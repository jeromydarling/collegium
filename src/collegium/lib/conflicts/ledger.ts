/**
 * Conflict ledger — hash-only store of every party-name a tenant has
 * encountered.
 *
 * For each matter we hash:
 *   - The requester (client)
 *   - The opposing party (if any, not a placeholder)
 *   - Each member of the household / adverse party named in posture notes
 *
 * The platform never stores the name in plaintext. The ledger is a
 * Map<hash, LedgerEntry> where each entry records what *kind* of role
 * the name played, in what matter, and on what date. That's enough to
 * surface a hit ("the hashed name 'X' was the opposing party in matter
 * sm-8 last month") without revealing the name itself.
 *
 * A hit means the steward has to confirm by hashing the suspected name
 * with the tenant's salt and matching. The match is performed locally,
 * with the steward typing the name into a one-off confirmation UI.
 * Nothing leaves the system; the steward simply knows whether to publish.
 *
 * For cross-tenant checks via Communio, the salt would be a Communio-
 * shared salt (per peer-network) so two connected tenants can detect
 * shared adverse parties without revealing their rosters. That's a
 * follow-up; for now the ledger is per-tenant.
 */

import type { ServiceMatter } from "../../data/demo";
import { normalizeForHash, isPlaceholder } from "./normalize";
import { hashNormalized } from "./hash";

export type LedgerRole =
  | "requester"
  | "opposing-party"
  | "co-party"
  | "household-member"
  | "third-party-mentioned";

export interface LedgerEntry {
  hash: string;
  role: LedgerRole;
  matterId: string;
  /** ISO date the name was added. */
  addedAt: string;
}

export interface ConflictHit {
  hash: string;
  /** The role the conflicting party played in the prior matter. */
  priorRole: LedgerRole;
  /** The role the new matter claims for this party. */
  newRole: LedgerRole;
  /** Prior matter id where this name appeared. */
  priorMatterId: string;
  /** ISO date the prior entry was added. */
  priorAddedAt: string;
  /** Severity hint — direct adverse vs. coincidental. */
  severity: "direct-adverse" | "name-collision-likely" | "review";
}

export interface ConflictCheckResult {
  /** Whether the matter is safe to publish without further review. */
  cleared: boolean;
  /** Hash-only hits, if any. Empty array means no conflicts found. */
  hits: ConflictHit[];
  /** Hashes that were checked. */
  checked: string[];
  /** ISO timestamp of the check. */
  checkedAt: string;
  /** Audit trail line — human readable summary. */
  summary: string;
}

/**
 * Per-tenant ledger. Implementation note: in production this is a
 * Supabase row-level-secured table; for demo we keep it in-memory keyed
 * by tenant id.
 */
type TenantLedger = Map<string, LedgerEntry[]>; // hash → entries (1 hash can have multiple matter appearances)

const ledgers = new Map<string, TenantLedger>();

function ledgerFor(tenantId: string): TenantLedger {
  let l = ledgers.get(tenantId);
  if (!l) {
    l = new Map();
    ledgers.set(tenantId, l);
  }
  return l;
}

export interface PartyToCheck {
  rawName: string;
  role: LedgerRole;
}

/**
 * Run a conflict check for a new matter. Hash every named party, look
 * them up in the tenant's ledger, return any hits. Does NOT write to the
 * ledger — that happens after publication, via `commitMatterToLedger`.
 *
 * Severity heuristic:
 *   - If the new party would be in adverse role to a prior party in
 *     adverse role on the same hash → direct-adverse (most serious)
 *   - If both roles are requester/co-party → name-collision-likely
 *     (probably the same person returning; still worth flagging)
 *   - Anything else → review
 */
export async function checkMatterConflicts(
  tenantId: string,
  parties: PartyToCheck[],
  tenantSalt: string
): Promise<ConflictCheckResult> {
  const ledger = ledgerFor(tenantId);
  const hits: ConflictHit[] = [];
  const checked: string[] = [];

  for (const party of parties) {
    const normalized = normalizeForHash(party.rawName);
    if (isPlaceholder(normalized)) continue;

    const hash = await hashNormalized(normalized, tenantSalt);
    checked.push(hash);

    const priorEntries = ledger.get(hash) ?? [];
    for (const prior of priorEntries) {
      hits.push({
        hash,
        priorRole: prior.role,
        newRole: party.role,
        priorMatterId: prior.matterId,
        priorAddedAt: prior.addedAt,
        severity: severityFor(prior.role, party.role),
      });
    }
  }

  const checkedAt = new Date().toISOString();
  const cleared = hits.length === 0;

  const summary = cleared
    ? `Conflict check ran ${formatTime(checkedAt)} — ${checked.length} party hash${
        checked.length === 1 ? "" : "es"
      } checked, no matches in the tenant ledger.`
    : `Conflict check ran ${formatTime(checkedAt)} — ${hits.length} hit${
        hits.length === 1 ? "" : "s"
      } found across ${new Set(hits.map((h) => h.priorMatterId)).size} prior matter${
        new Set(hits.map((h) => h.priorMatterId)).size === 1 ? "" : "s"
      }. Manual review required before publication.`;

  return { cleared, hits, checked, checkedAt, summary };
}

function severityFor(prior: LedgerRole, neu: LedgerRole): ConflictHit["severity"] {
  const adverse: LedgerRole[] = ["opposing-party"];
  const same: LedgerRole[] = ["requester", "co-party", "household-member"];
  if (adverse.includes(prior) && same.includes(neu)) return "direct-adverse";
  if (same.includes(prior) && adverse.includes(neu)) return "direct-adverse";
  if (same.includes(prior) && same.includes(neu)) return "name-collision-likely";
  return "review";
}

/**
 * After a matter is approved + published, write its parties to the
 * ledger so future conflict checks find them.
 */
export async function commitMatterToLedger(
  tenantId: string,
  matterId: string,
  parties: PartyToCheck[],
  tenantSalt: string
): Promise<{ written: number; skipped: number }> {
  const ledger = ledgerFor(tenantId);
  const addedAt = new Date().toISOString();
  let written = 0;
  let skipped = 0;

  for (const party of parties) {
    const normalized = normalizeForHash(party.rawName);
    if (isPlaceholder(normalized)) {
      skipped++;
      continue;
    }
    const hash = await hashNormalized(normalized, tenantSalt);
    const entries = ledger.get(hash) ?? [];
    entries.push({ hash, role: party.role, matterId, addedAt });
    ledger.set(hash, entries);
    written++;
  }

  return { written, skipped };
}

/**
 * Adapter — derive the list of parties from a ServiceMatter for the
 * common case where the steward is checking a new matter draft.
 */
export function partiesFromMatter(matter: Pick<ServiceMatter, "requester" | "summary"> & {
  opposingParty?: string;
}): PartyToCheck[] {
  const parties: PartyToCheck[] = [];
  if (matter.requester) {
    parties.push({ rawName: matter.requester, role: "requester" });
  }
  if (matter.opposingParty) {
    parties.push({ rawName: matter.opposingParty, role: "opposing-party" });
  }
  return parties;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Test helper — wipe the ledger. Never use in production code path; only
 * the conflict ledger admin / test harness should call this.
 */
export function _resetLedgersForTest(): void {
  ledgers.clear();
}

/** Inspector — total entry count for a tenant. Used by tests and admin. */
export function ledgerSize(tenantId: string): number {
  const l = ledgers.get(tenantId);
  if (!l) return 0;
  let count = 0;
  for (const entries of l.values()) count += entries.length;
  return count;
}
