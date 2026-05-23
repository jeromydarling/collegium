/**
 * SHA-256 hash with a tenant-scoped salt.
 *
 * The salt ensures that one tenant's ledger can't be brute-forced by an
 * attacker who knows the platform's hash function: even if they precompute
 * SHA-256 of every common name, the per-tenant salt makes the resulting
 * table useless against another tenant.
 *
 * Output is a 64-character lowercase hex string. The web crypto API is
 * available in both browsers (Patrocinium UI) and Node (the future
 * server-side backend), so this module works in either runtime.
 */

const SALT_PREFIX = "collegium-conflicts-v1::";

export async function hashNormalized(normalized: string, tenantSalt: string): Promise<string> {
  const input = `${SALT_PREFIX}${tenantSalt}::${normalized}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Batch helper — hashes a list of names in parallel and dedupes.
 */
export async function hashMany(normalized: string[], tenantSalt: string): Promise<string[]> {
  const hashes = await Promise.all(normalized.map((n) => hashNormalized(n, tenantSalt)));
  return [...new Set(hashes)];
}
