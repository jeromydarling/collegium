import { beforeEach, describe, expect, it } from "vitest";
import {
  checkMatterConflicts,
  commitMatterToLedger,
  partiesFromMatter,
  _resetLedgersForTest,
  ledgerSize,
} from "./ledger";
import { normalizeForHash, isPlaceholder } from "./normalize";
import { hashNormalized } from "./hash";

/**
 * The conflict ledger is the gate between a matter being drafted and
 * being published to Patrocinium. These tests pin the safety invariants:
 *  - Hashes never reveal the underlying name
 *  - Normalization collapses spelling variants so hashes match
 *  - Direct-adverse hits get flagged at the right severity
 *  - Placeholders ("(none)", "n/a") never enter the ledger
 *  - Cross-tenant isolation: tenant A's ledger never sees tenant B's matters
 */

const TENANT_A = "t-stm-boston";
const TENANT_B = "t-clg-chicago";
const SALT_A = "salt-stm-boston-001";
const SALT_B = "salt-clg-chicago-002";

beforeEach(() => {
  _resetLedgersForTest();
});

describe("normalizeForHash", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalizeForHash("O'Hara, James")).toBe("ohara james");
  });

  it("strips honorifics and post-nominals", () => {
    expect(normalizeForHash("Dr. Margaret Coyle, Esq.")).toBe("margaret coyle");
    expect(normalizeForHash("Sr. Anne Marie Falconio, OP")).toBe("anne marie falconio");
    expect(normalizeForHash("Rev. Stephen Cale, JCL")).toBe("stephen cale");
  });

  it("strips entity suffixes", () => {
    expect(normalizeForHash("Allston Realty Trust LLC")).toBe("allston realty");
    expect(normalizeForHash("ACME Corp.")).toBe("acme");
  });

  it("folds accents and unicode", () => {
    expect(normalizeForHash("José María García")).toBe("jose maria garcia");
  });

  it("handles 'and' / '&' between names", () => {
    expect(normalizeForHash("Smith & Jones LLP")).toBe("smith jones");
    expect(normalizeForHash("Smith and Jones")).toBe("smith jones");
  });

  it("collapses internal whitespace", () => {
    expect(normalizeForHash("  Maria    Velasquez  ")).toBe("maria velasquez");
  });
});

describe("isPlaceholder", () => {
  it("flags '(none — advisory)' and similar phantom entries", () => {
    expect(isPlaceholder(normalizeForHash("(none — advisory)"))).toBe(true);
    expect(isPlaceholder(normalizeForHash("(none — record sealing)"))).toBe(true);
    expect(isPlaceholder(normalizeForHash("Unknown"))).toBe(true);
    expect(isPlaceholder(normalizeForHash("To Confirm"))).toBe(true);
    expect(isPlaceholder(normalizeForHash("N/A"))).toBe(true);
  });

  it("does not flag real parties", () => {
    expect(isPlaceholder(normalizeForHash("Maria Velasquez"))).toBe(false);
    expect(isPlaceholder(normalizeForHash("Allston Realty Trust LLC"))).toBe(false);
  });
});

describe("hashNormalized", () => {
  it("is deterministic for the same input + salt", async () => {
    const a = await hashNormalized("maria velasquez", SALT_A);
    const b = await hashNormalized("maria velasquez", SALT_A);
    expect(a).toBe(b);
  });

  it("produces different hashes for different salts (cross-tenant isolation)", async () => {
    const a = await hashNormalized("maria velasquez", SALT_A);
    const b = await hashNormalized("maria velasquez", SALT_B);
    expect(a).not.toBe(b);
  });

  it("returns a 64-char hex string", async () => {
    const h = await hashNormalized("anyone", SALT_A);
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });

  it("does not reveal the input in the hash", async () => {
    const h = await hashNormalized("maria velasquez", SALT_A);
    expect(h).not.toContain("maria");
    expect(h).not.toContain("velasquez");
  });
});

describe("checkMatterConflicts + commitMatterToLedger", () => {
  it("returns cleared=true when the ledger is empty", async () => {
    const result = await checkMatterConflicts(
      TENANT_A,
      [
        { rawName: "Maria Velasquez", role: "requester" },
        { rawName: "Allston Realty Trust LLC", role: "opposing-party" },
      ],
      SALT_A
    );
    expect(result.cleared).toBe(true);
    expect(result.hits).toHaveLength(0);
    expect(result.checked).toHaveLength(2);
  });

  it("detects a returning client (requester → requester)", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-old",
      [{ rawName: "Maria Velasquez", role: "requester" }],
      SALT_A
    );

    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "Maria Velasquez", role: "requester" }],
      SALT_A
    );
    expect(result.cleared).toBe(false);
    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].priorMatterId).toBe("sm-old");
    expect(result.hits[0].severity).toBe("name-collision-likely");
  });

  it("flags direct adverse: prior opposing party showing up as new requester", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-landlord-case",
      [{ rawName: "John Smith", role: "opposing-party" }],
      SALT_A
    );

    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "John Smith", role: "requester" }],
      SALT_A
    );
    expect(result.cleared).toBe(false);
    expect(result.hits[0].severity).toBe("direct-adverse");
  });

  it("matches across spelling variants once normalized", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-old",
      [{ rawName: "Margaret Coyle, Esq.", role: "opposing-party" }],
      SALT_A
    );

    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "Dr. MARGARET COYLE", role: "requester" }],
      SALT_A
    );
    expect(result.cleared).toBe(false);
    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].severity).toBe("direct-adverse");
  });

  it("skips placeholders without writing to or matching against the ledger", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-no-opp",
      [
        { rawName: "Maria Velasquez", role: "requester" },
        { rawName: "(none — advisory)", role: "opposing-party" },
      ],
      SALT_A
    );

    // Only one entry should be written — the placeholder was skipped.
    expect(ledgerSize(TENANT_A)).toBe(1);

    // Checking another matter with a different placeholder should NOT hit.
    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "(none — record sealing)", role: "opposing-party" }],
      SALT_A
    );
    expect(result.cleared).toBe(true);
  });

  it("isolates tenants — tenant B's ledger doesn't leak into tenant A's checks", async () => {
    await commitMatterToLedger(
      TENANT_B,
      "sm-chicago-case",
      [{ rawName: "Maria Velasquez", role: "requester" }],
      SALT_B
    );

    // Tenant A checks the same name — should be cleared because their
    // ledger and salt are independent.
    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "Maria Velasquez", role: "requester" }],
      SALT_A
    );
    expect(result.cleared).toBe(true);
  });

  it("audit summary mentions the count of hits and prior matters", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-1",
      [{ rawName: "John Smith", role: "opposing-party" }],
      SALT_A
    );
    await commitMatterToLedger(
      TENANT_A,
      "sm-2",
      [{ rawName: "John Smith", role: "requester" }],
      SALT_A
    );

    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "John Smith", role: "co-party" }],
      SALT_A
    );
    expect(result.cleared).toBe(false);
    expect(result.hits).toHaveLength(2); // hit against both prior entries
    expect(result.summary).toContain("2 hits");
    expect(result.summary).toContain("2 prior matters");
  });

  it("partiesFromMatter pulls requester + opposingParty when both present", () => {
    const parties = partiesFromMatter({
      requester: "Esperanza R.",
      summary: "...",
      opposingParty: "Allston Realty Trust LLC",
    });
    expect(parties).toEqual([
      { rawName: "Esperanza R.", role: "requester" },
      { rawName: "Allston Realty Trust LLC", role: "opposing-party" },
    ]);
  });
});

describe("conflict ledger — security invariants", () => {
  it("storing a name and then dumping the ledger reveals only hashes, never plaintext", async () => {
    await commitMatterToLedger(
      TENANT_A,
      "sm-1",
      [
        { rawName: "Esperanza Rodriguez", role: "requester" },
        { rawName: "Allston Realty Trust LLC", role: "opposing-party" },
      ],
      SALT_A
    );

    // Re-check to expose hashes
    const result = await checkMatterConflicts(
      TENANT_A,
      [{ rawName: "Esperanza Rodriguez", role: "requester" }],
      SALT_A
    );
    const exposed = JSON.stringify(result);
    expect(exposed.toLowerCase()).not.toContain("esperanza");
    expect(exposed.toLowerCase()).not.toContain("rodriguez");
    expect(exposed.toLowerCase()).not.toContain("allston");
  });
});
