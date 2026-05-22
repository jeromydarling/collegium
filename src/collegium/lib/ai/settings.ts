/**
 * Tiny credential store for plug-in integrations (Claude, Twilio later).
 *
 * Keys live in localStorage on the user's browser. They never leave the
 * browser except to make the actual API call to the integration's
 * endpoint. We expose only read/write/clear — never log, never expose
 * to other modules in plaintext. Browser-side credential storage is
 * a deliberate demo choice; production deployment swaps this for a
 * server-side proxy.
 */

const KEYS = {
  claude: "collegium.integration.claude_api_key.v1",
  claudeModel: "collegium.integration.claude_model.v1",
  twilio: "collegium.integration.twilio.v1", // reserved for the Twilio session
} as const;

export const DEFAULT_CLAUDE_MODEL = "claude-haiku-4-5";

export function getClaudeKey(): string | null {
  try {
    return localStorage.getItem(KEYS.claude);
  } catch {
    return null;
  }
}

export function setClaudeKey(key: string): void {
  try {
    if (key.trim() === "") {
      localStorage.removeItem(KEYS.claude);
    } else {
      localStorage.setItem(KEYS.claude, key.trim());
    }
  } catch {
    /* localStorage may be unavailable; silent */
  }
}

export function clearClaudeKey(): void {
  try {
    localStorage.removeItem(KEYS.claude);
  } catch {
    /* silent */
  }
}

export function getClaudeModel(): string {
  try {
    return localStorage.getItem(KEYS.claudeModel) ?? DEFAULT_CLAUDE_MODEL;
  } catch {
    return DEFAULT_CLAUDE_MODEL;
  }
}

export function setClaudeModel(model: string): void {
  try {
    localStorage.setItem(KEYS.claudeModel, model);
  } catch {
    /* silent */
  }
}

export function hasClaudeKey(): boolean {
  const k = getClaudeKey();
  return !!k && k.length > 5;
}

/** Masked preview for UI surfaces — never the raw key. */
export function maskedClaudeKey(): string {
  const k = getClaudeKey();
  if (!k) return "";
  if (k.length <= 12) return "•".repeat(k.length);
  return k.slice(0, 8) + "…" + k.slice(-4);
}
