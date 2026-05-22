/**
 * AI gateway client — OpenAI chat-completions compatible.
 *
 * Speaks the standard {model, messages, temperature, max_tokens} format
 * that Lovable AI, OpenRouter, OpenAI, Anthropic-via-proxy, and most
 * self-hosted runtimes all support. The default endpoint is Lovable's
 * gateway (/api/ai/chat); the default model is Gemini 2.5 Flash.
 *
 * On Lovable cloud:
 *   - Endpoint stays as the relative path
 *   - Credentials are auto-injected by the gateway
 *   - Calls happen browser → Lovable backend → Gemini → back
 *
 * For local dev or non-Lovable deployment:
 *   - User pastes their own key + can override endpoint + model
 *   - Same call surface so feature code is unchanged
 */

import {
  getApiKey,
  getEndpoint,
  getModel,
  hasAIConfigured,
} from "./settings";

export interface CompleteOptions {
  /** System instruction prepended to the chat. */
  system?: string;
  /** Override the configured model for this single call. */
  model?: string;
  /** Max tokens out. Default 2000. */
  maxTokens?: number;
  /** Temperature 0–2. Default 0.4. */
  temperature?: number;
}

export interface CompleteResult {
  ok: true;
  text: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
}

export interface CompleteError {
  ok: false;
  reason:
    | "not-configured"
    | "request-failed"
    | "api-error"
    | "invalid-response"
    | "network-error";
  message: string;
  status?: number;
}

export type CompleteResponse = CompleteResult | CompleteError;

interface OpenAIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIChatResponse {
  choices?: {
    message?: { role?: string; content?: string };
    delta?: { content?: string };
    finish_reason?: string;
  }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  model?: string;
  error?: { message?: string };
}

/**
 * Single-prompt completion. Feature code calls this; the gateway/provider
 * is opaque from the caller's perspective.
 */
export async function complete(
  prompt: string,
  options: CompleteOptions = {}
): Promise<CompleteResponse> {
  if (!hasAIConfigured()) {
    return {
      ok: false,
      reason: "not-configured",
      message:
        "AI gateway not configured. Paste an API key in Integrations or deploy on Lovable for auto-injected credentials.",
    };
  }

  const endpoint = getEndpoint();
  const apiKey = getApiKey();
  const model = options.model ?? getModel();

  const messages: OpenAIChatMessage[] = [];
  if (options.system) messages.push({ role: "system", content: options.system });
  messages.push({ role: "user", content: prompt });

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  // Only attach the bearer when we actually have one — the Lovable gateway
  // does its own auth when running against a relative endpoint.
  if (apiKey && !endpoint.startsWith("/")) {
    headers["authorization"] = `Bearer ${apiKey}`;
  } else if (apiKey) {
    // Some self-hosted gateways still want the bearer even on relative routes.
    headers["authorization"] = `Bearer ${apiKey}`;
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options.maxTokens ?? 2000,
        temperature: options.temperature ?? 0.4,
      }),
    });
  } catch (err) {
    return {
      ok: false,
      reason: "network-error",
      message: err instanceof Error ? err.message : "Network error",
    };
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as OpenAIChatResponse;
      if (body.error?.message) detail = body.error.message;
    } catch {
      /* fall through */
    }
    return {
      ok: false,
      reason: "api-error",
      message: detail,
      status: response.status,
    };
  }

  let json: OpenAIChatResponse;
  try {
    json = (await response.json()) as OpenAIChatResponse;
  } catch (err) {
    return {
      ok: false,
      reason: "invalid-response",
      message: err instanceof Error ? err.message : "Bad JSON",
    };
  }

  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    return {
      ok: false,
      reason: "invalid-response",
      message: "Response contained no message content",
    };
  }

  return {
    ok: true,
    text,
    usage: {
      inputTokens: json.usage?.prompt_tokens ?? 0,
      outputTokens: json.usage?.completion_tokens ?? 0,
    },
    model: json.model ?? model,
  };
}

/**
 * Streaming variant — yields text deltas as they arrive. Same OpenAI
 * server-sent-events convention as the non-streaming version.
 */
export async function* completeStream(
  prompt: string,
  options: CompleteOptions = {}
): AsyncGenerator<string, void, void> {
  if (!hasAIConfigured()) {
    throw new Error("AI gateway not configured");
  }

  const endpoint = getEndpoint();
  const apiKey = getApiKey();
  const model = options.model ?? getModel();

  const messages: OpenAIChatMessage[] = [];
  if (options.system) messages.push({ role: "system", content: options.system });
  messages.push({ role: "user", content: prompt });

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (apiKey) headers["authorization"] = `Bearer ${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.4,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`stream failed: HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const data = chunk
        .split("\n")
        .filter((l) => l.startsWith("data: "))
        .map((l) => l.slice(6))
        .join("");
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data) as OpenAIChatResponse;
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        /* skip malformed chunk */
      }
    }
  }
}
