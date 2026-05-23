/**
 * Name normalization for conflict checking.
 *
 * Conflicts are checked against a hash-only ledger — names are never stored
 * in plaintext on the platform side. To make hashes match across two
 * tenants spelling the same name slightly differently, we normalize
 * aggressively before hashing.
 *
 * Normalization rules (in order):
 *   1. Unicode-fold (NFKD), strip accents
 *   2. Lowercase
 *   3. Strip honorifics + post-nominals (Mr., Ms., Dr., Esq., Jr., Sr.,
 *      II, III, IV, OP, OFM, JCL, MD, PhD, etc.)
 *   4. Collapse "and" / "&" / "+" / "," variants between names
 *   5. Strip entity suffixes (LLC, LLP, Inc., Corp., Trust, etc.)
 *   6. Strip all non-alphanumeric except whitespace
 *   7. Collapse internal whitespace to a single space
 *   8. Trim
 *
 * The output is a canonical form like "maria velasquez" or "allston realty trust".
 *
 * NOT included (intentional):
 *   - Soundex / Metaphone fuzzy matching. Belongs in a follow-up; would
 *     require a server-side index. For now, normalized exact match.
 *   - Partial token matching (e.g. last-name-only). Too many false hits.
 */

const HONORIFICS = [
  "mr", "mrs", "ms", "miss", "dr", "fr", "rev", "rt", "msgr", "sr", "br",
  "bro", "sister", "father", "deacon", "the honorable", "hon",
];

const POST_NOMINALS = [
  "esq", "esquire", "jd", "jr", "sr", "ii", "iii", "iv", "v",
  "md", "phd", "do", "lcsw", "lcpc", "pa", "pe",
  "op", "ofm", "ofs", "sj", "cssr", "jcl", "jcd", "stl", "std",
  "rsm", "ssj", "snd", "obl", "cm",
];

const ENTITY_SUFFIXES = [
  "llc", "lc", "llp", "lp", "pllc", "pc", "pa",
  "inc", "incorporated", "corp", "corporation",
  "co", "company",
  "ltd", "limited",
  "trust", "estate", "association", "assn",
  "foundation", "fund", "society",
];

function stripAccents(s: string): string {
  // Decompose, drop combining marks (U+0300..U+036F). Works in modern JS
  // runtimes; falls back to identity on environments without normalize.
  try {
    return s.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  } catch {
    return s;
  }
}

function stripTokenAffixes(input: string, suffixes: string[]): string {
  const tokens = input.split(/\s+/);
  return tokens
    .filter((t) => {
      const bare = t.replace(/\.$/, "");
      return !suffixes.includes(bare);
    })
    .join(" ");
}

export function normalizeForHash(raw: string): string {
  if (!raw) return "";
  let s = stripAccents(raw);
  s = s.toLowerCase();
  // Drop apostrophes outright — "O'Hara" should become "ohara", not "o hara".
  s = s.replace(/['‘’]/g, "");
  // Replace separators with space
  s = s.replace(/[,&+]/g, " ");
  s = s.replace(/\band\b/g, " ");
  // Strip honorifics + post-nominals
  s = stripTokenAffixes(s, HONORIFICS);
  s = stripTokenAffixes(s, POST_NOMINALS);
  // Strip entity suffixes
  s = stripTokenAffixes(s, ENTITY_SUFFIXES);
  // Strip remaining punctuation
  s = s.replace(/[^a-z0-9\s]/g, " ");
  // Collapse whitespace
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/**
 * Whether a normalized token represents an "anonymizing" placeholder the
 * caller doesn't actually want to check (e.g. "(none — internal parish
 * governance)", "(none — advisory)", "n/a"). Used to skip ledger writes
 * for these phantom opposing parties.
 */
export function isPlaceholder(normalized: string): boolean {
  if (!normalized) return true;
  if (normalized.length < 3) return true;
  if (normalized.includes("none")) return true;
  if (normalized.includes("unknown")) return true;
  if (normalized.includes("to confirm")) return true;
  if (normalized.includes("n a")) return true; // "n/a" → "n a"
  return false;
}
