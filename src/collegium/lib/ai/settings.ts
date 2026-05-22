/**
 * AI integration settings — Lovable AI gateway scaffolding.
 *
 * Collegium deploys on Lovable, which provides a built-in AI gateway with
 * Gemini Flash as the cost-efficient default. The gateway speaks the
 * OpenAI chat-completions format, so swapping providers (OpenRouter,
 * Anthropic direct, OpenAI direct, a self-hosted Ollama) is a one-line
 * endpoint change.
 *
 * Three configurable values:
 *   - endpoint: where the chat-completions POST goes
 *   - apiKey:   bearer token; for Lovable cloud this is auto-injected at
 *               deploy time so the user never sees a key. For local /
 *               other-provider use, paste it here.
 *   - model:    which model to ask for. Defaults to Gemini Flash; can
 *               be swapped to any compatible OpenAI-format model id.
 */

const KEYS = {
  apiKey: "collegium.ai.api_key.v1",
  endpoint: "collegium.ai.endpoint.v1",
  model: "collegium.ai.model.v1",
} as const;

export const DEFAULT_ENDPOINT = "/api/ai/chat";
export const DEFAULT_MODEL = "google/gemini-2.5-flash";

export const MODEL_CHOICES: { value: string; label: string; note: string }[] = [
  {
    value: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    note: "Default · fast, cost-efficient · works well for intake structuring",
  },
  {
    value: "google/gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    note: "Higher quality for hard reasoning · 5× cost",
  },
  {
    value: "google/gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    note: "Older Flash; widely supported · cheapest tier",
  },
  {
    value: "anthropic/claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    note: "Anthropic fallback · stronger English structure",
  },
];

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(KEYS.apiKey);
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  try {
    if (key.trim() === "") {
      localStorage.removeItem(KEYS.apiKey);
    } else {
      localStorage.setItem(KEYS.apiKey, key.trim());
    }
  } catch {
    /* silent */
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(KEYS.apiKey);
  } catch {
    /* silent */
  }
}

export function getEndpoint(): string {
  try {
    return localStorage.getItem(KEYS.endpoint) ?? DEFAULT_ENDPOINT;
  } catch {
    return DEFAULT_ENDPOINT;
  }
}

export function setEndpoint(endpoint: string): void {
  try {
    if (endpoint.trim() === "") {
      localStorage.removeItem(KEYS.endpoint);
    } else {
      localStorage.setItem(KEYS.endpoint, endpoint.trim());
    }
  } catch {
    /* silent */
  }
}

export function getModel(): string {
  try {
    return localStorage.getItem(KEYS.model) ?? DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export function setModel(model: string): void {
  try {
    localStorage.setItem(KEYS.model, model);
  } catch {
    /* silent */
  }
}

/**
 * Whether AI is configured enough to call.
 *
 * On Lovable cloud, the gateway auto-injects credentials so a key may not
 * be needed — we consider AI "configured" if the endpoint is the Lovable
 * default OR if a key is present.
 */
export function hasAIConfigured(): boolean {
  const endpoint = getEndpoint();
  const key = getApiKey();
  // Lovable cloud auto-injects auth at the gateway; consider it configured
  // when running against the relative gateway endpoint.
  if (endpoint.startsWith("/")) return true;
  return !!key && key.length > 5;
}

export function maskedApiKey(): string {
  const k = getApiKey();
  if (!k) return "";
  if (k.length <= 12) return "•".repeat(k.length);
  return k.slice(0, 6) + "…" + k.slice(-4);
}
