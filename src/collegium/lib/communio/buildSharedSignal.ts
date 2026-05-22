/**
 * Communio Signal Sanitizer (Collegium port).
 *
 * Communio is the network layer between peer guilds — separate tenants
 * that share signals and refer matters across organizational lines. This
 * module is the boundary that strips PII before anything crosses the wire.
 *
 * Safety invariants when publishing to a peer guild:
 *   - Never include client names, contacts, addresses, or financial detail
 *   - Never include matter identifiers from the home tenant
 *   - Summaries are truncated to 220 chars and bucketed to week granularity
 *   - Two-name patterns and obvious contact strings are auto-scrubbed
 *   - Anything still scrubbed past a threshold is rejected outright
 *
 * Lifted from the CROS implementation and adapted for Collegium's
 * briefing + matter shapes. Pure functions — no Supabase, no side effects.
 */

const FORBIDDEN_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // phone numbers (US)
  /\$[\d,]+(\.\d{2})?/g, // dollar amounts
  /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, // two-word proper names ("Maria Velasquez")
];

const FORBIDDEN_KEYS = [
  "email", "phone", "contact_name", "client_name", "client_id",
  "address", "street", "zip", "ssn", "dob", "date_of_birth",
  "first_name", "last_name", "full_name", "name",
  "case_number", "matter_id", "docket",
  "raw_body", "note_text", "intake_note",
];

const MAX_SUMMARY_CHARS = 220;
const MAX_REDACTIONS_ALLOWED = 2;

export type ShareLevel = "covenant" | "partner" | "network";

export interface RawSignal {
  signalType: string;
  title?: string;
  summary?: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export interface SanitizedSignal {
  signalType: string;
  headline: string;
  body: string;
  redactionCount: number;
}

export interface SanitizationResult {
  ok: boolean;
  signal?: SanitizedSignal;
  reason?: string;
}

function scrubText(text: string): { text: string; count: number } {
  let cleaned = text;
  let count = 0;
  for (const pattern of FORBIDDEN_PATTERNS) {
    pattern.lastIndex = 0;
    cleaned = cleaned.replace(pattern, () => {
      count += 1;
      return "[redacted]";
    });
  }
  return { text: cleaned, count };
}

function bucketToWeek(dateLike?: string): string | undefined {
  if (!dateLike) return undefined;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return undefined;
  // Snap to Monday of the same week.
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

function hasForbiddenKeys(obj: Record<string, unknown>): string | null {
  for (const k of Object.keys(obj)) {
    if (FORBIDDEN_KEYS.includes(k.toLowerCase())) return k;
  }
  return null;
}

function deepContainsForbidden(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    return FORBIDDEN_PATTERNS.some((p) => {
      p.lastIndex = 0;
      return p.test(value);
    });
  }
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (hasForbiddenKeys(rec)) return true;
    return Object.values(rec).some(deepContainsForbidden);
  }
  return false;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3).trimEnd() + "...";
}

/**
 * Transform a raw internal signal into a sanitized payload ready to publish
 * to a peer guild. Returns ok:false with a reason if it can't be made safe.
 */
export function buildSharedSignal(raw: RawSignal): SanitizationResult {
  if (!raw.signalType) {
    return { ok: false, reason: "missing signal type" };
  }

  const source = raw.summary ?? raw.body ?? raw.title;
  if (!source) {
    return { ok: false, reason: "no summary content" };
  }

  if (raw.metadata) {
    const forbiddenKey = hasForbiddenKeys(raw.metadata);
    if (forbiddenKey) {
      return { ok: false, reason: `metadata contains forbidden key: ${forbiddenKey}` };
    }
    if (deepContainsForbidden(raw.metadata)) {
      return { ok: false, reason: "metadata contains PII-shaped content" };
    }
  }

  const scrubbedBody = scrubText(source);
  if (scrubbedBody.count > MAX_REDACTIONS_ALLOWED) {
    return {
      ok: false,
      reason: `signal too redacted to share (${scrubbedBody.count} redactions)`,
    };
  }

  const scrubbedTitle = raw.title ? scrubText(raw.title) : { text: "", count: 0 };

  return {
    ok: true,
    signal: {
      signalType: raw.signalType,
      headline: truncate(scrubbedTitle.text || scrubbedBody.text, 120),
      body: truncate(scrubbedBody.text, MAX_SUMMARY_CHARS),
      redactionCount: scrubbedBody.count + scrubbedTitle.count,
    },
  };
}

/**
 * Build a sanitized referral payload for outbound matter referral to a
 * peer guild. Only carries category, region, language, and a short
 * narrative — no requester identity, no contact, no FPL figure.
 */
export interface RawReferral {
  category: string;
  region: string;
  languages?: string[];
  urgency?: string;
  summary: string;
  intakeDate?: string;
}

export interface SanitizedReferral {
  category: string;
  region: string;
  languages: string[];
  urgency: string;
  summary: string;
  weekBucket?: string;
  redactionCount: number;
}

export function buildSharedReferral(raw: RawReferral): SanitizationResult & {
  referral?: SanitizedReferral;
} {
  const { text, count } = scrubText(raw.summary);
  if (count > MAX_REDACTIONS_ALLOWED) {
    return {
      ok: false,
      reason: `referral narrative too redacted to share (${count} redactions)`,
    };
  }
  return {
    ok: true,
    referral: {
      category: raw.category,
      region: raw.region,
      languages: raw.languages ?? ["en"],
      urgency: raw.urgency ?? "soon",
      summary: truncate(text, MAX_SUMMARY_CHARS),
      weekBucket: bucketToWeek(raw.intakeDate),
      redactionCount: count,
    },
  };
}

/** Public for tests + UI previewing what would publish. */
export const __internal = {
  scrubText,
  hasForbiddenKeys,
  deepContainsForbidden,
  bucketToWeek,
  truncate,
  FORBIDDEN_PATTERNS,
  FORBIDDEN_KEYS,
  MAX_SUMMARY_CHARS,
  MAX_REDACTIONS_ALLOWED,
};
