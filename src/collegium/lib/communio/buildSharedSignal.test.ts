import { describe, it, expect } from "vitest";
import {
  buildSharedSignal,
  buildSharedReferral,
  __internal,
} from "./buildSharedSignal";

/**
 * The sanitizer is the only thing standing between a guild's confidential
 * client information and what travels to a peer tenant. These tests guard
 * the safety invariants — if any of them ever flips, Communio leaks PII.
 */

describe("buildSharedSignal — safety invariants", () => {
  it("scrubs email addresses", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Reach out to maria@example.com about the case",
    });
    expect(r.ok).toBe(true);
    expect(r.signal?.body).not.toMatch(/maria@example\.com/);
    expect(r.signal?.body).toContain("[redacted]");
  });

  it("scrubs phone numbers in multiple formats", () => {
    const formats = ["312-555-0142", "312.555.0142", "3125550142"];
    for (const phone of formats) {
      const r = buildSharedSignal({
        signalType: "request",
        summary: `Callback to ${phone} about housing`,
      });
      expect(r.ok).toBe(true);
      expect(r.signal?.body).not.toMatch(/\d{3}.?\d{3}.?\d{4}/);
    }
  });

  it("scrubs dollar amounts", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Family lost $2,400 to a notario scheme in March",
    });
    expect(r.ok).toBe(true);
    expect(r.signal?.body).not.toMatch(/\$[\d,]+/);
  });

  it("scrubs two-word proper names", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Maria Velasquez asked about asylum filing options",
    });
    expect(r.ok).toBe(true);
    expect(r.signal?.body).not.toMatch(/Maria Velasquez/);
  });

  it("rejects payloads that need more than 2 redactions", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary:
        "Maria Velasquez (maria@example.com, 312-555-0142) lost $2,400 to a notario at 4711 N Ashland",
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/too redacted/);
  });

  it("rejects metadata containing forbidden keys", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Pattern across three offices",
      metadata: { client_name: "Maria Velasquez" },
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/forbidden key/);
  });

  it("rejects metadata where values look like PII", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Pattern across three offices",
      metadata: {
        notes: "Reach Maria Velasquez at maria@example.com",
      },
    });
    expect(r.ok).toBe(false);
  });

  it("rejects deeply-nested metadata containing forbidden keys", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      summary: "Pattern across three offices",
      metadata: { intake: { client: { full_name: "Maria V." } } },
    });
    expect(r.ok).toBe(false);
  });

  it("truncates summaries above 220 characters", () => {
    const long = "x".repeat(400);
    const r = buildSharedSignal({ signalType: "pattern", summary: long });
    expect(r.ok).toBe(true);
    expect(r.signal!.body.length).toBeLessThanOrEqual(220);
    expect(r.signal!.body.endsWith("...")).toBe(true);
  });

  it("requires a signal type", () => {
    const r = buildSharedSignal({ signalType: "", summary: "ok" });
    expect(r.ok).toBe(false);
  });

  it("requires some content to summarize", () => {
    const r = buildSharedSignal({ signalType: "pattern" });
    expect(r.ok).toBe(false);
  });

  it("preserves clean signals untouched", () => {
    const r = buildSharedSignal({
      signalType: "pattern",
      title: "I-589 backlog stretching past 36 months",
      summary:
        "Phoenix asylum docket is now scheduling merits hearings out to early 2029.",
    });
    expect(r.ok).toBe(true);
    expect(r.signal!.redactionCount).toBe(0);
    expect(r.signal!.body).toContain("Phoenix asylum docket");
  });
});

describe("buildSharedReferral — outbound matter handoffs", () => {
  it("scrubs PII from referral narrative", () => {
    const r = buildSharedReferral({
      category: "immigration",
      region: "Chicago, IL",
      summary: "Maria Velasquez asked about asylum",
    });
    expect(r.ok).toBe(true);
    expect(r.referral?.summary).not.toMatch(/Maria Velasquez/);
  });

  it("buckets intake dates to the start of the week", () => {
    const result = __internal.bucketToWeek("2026-05-22"); // a Friday
    expect(result).toBe("2026-05-18"); // the Monday of that week
  });

  it("returns urgency default 'soon' when omitted", () => {
    const r = buildSharedReferral({
      category: "housing",
      region: "Brooklyn, NY",
      summary: "Pro se litigant needs help",
    });
    expect(r.referral?.urgency).toBe("soon");
  });

  it("rejects referrals with too much PII", () => {
    const r = buildSharedReferral({
      category: "immigration",
      region: "Chicago",
      summary:
        "Maria Velasquez (maria@example.com, 312-555-0142) needs help — paid $1,200 already",
    });
    expect(r.ok).toBe(false);
  });
});

describe("buildSharedSignal — sanitizer primitives", () => {
  it("FORBIDDEN_PATTERNS array is non-empty and stateful-safe", () => {
    expect(__internal.FORBIDDEN_PATTERNS.length).toBeGreaterThan(2);
    for (const p of __internal.FORBIDDEN_PATTERNS) {
      p.lastIndex = 0;
      // Running .test twice should yield the same result for a non-matching
      // string — this catches the global-regex lastIndex foot-gun.
      expect(p.test("dummy")).toBe(p.test("dummy"));
    }
  });

  it("forbidden key check is case-insensitive", () => {
    expect(__internal.hasForbiddenKeys({ EMAIL: "x" })).toBe("EMAIL");
    expect(__internal.hasForbiddenKeys({ Full_Name: "y" })).toBe("Full_Name");
    expect(__internal.hasForbiddenKeys({ harmless_field: "z" })).toBeNull();
  });

  it("truncate preserves short strings exactly", () => {
    expect(__internal.truncate("short", 100)).toBe("short");
  });

  it("truncate appends ellipsis when over the limit", () => {
    const out = __internal.truncate("a".repeat(50), 10);
    expect(out.length).toBeLessThanOrEqual(10);
    expect(out.endsWith("...")).toBe(true);
  });
});
