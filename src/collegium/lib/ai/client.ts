/**
 * Browser-side Claude API client.
 *
 * Calls api.anthropic.com directly using the key from localStorage. The
 * Anthropic API supports browser-origin calls when the dangerous-direct
 * -browser-access header is set; we set it explicitly so this is a
 * deliberate, owner-acknowledged decision rather than an accident.
 *
 * For production deployment, route through a server proxy and keep the
 * key off the browser entirely. This module's call surface is small enough
 * that swapping to a proxy is a one-line endpoint change.
 */

import {
  getClaudeKey,
  getClaudeModel,
  DEFAULT_CLAUDE_MODEL,
} from "./settings";

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export interface CompleteOptions {
  /** System instruction for this call. */
  system?: string;
  /** Override model — defaults to whatever the user has selected in settings. */
  model?: string;
  /** Max tokens out. Default 2000. */
  maxTokens?: number;
  /** Temperature 0–1. Default 0.4 (slight creativity, mostly grounded). */
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
    | "no-key"
    | "request-failed"
    | "api-error"
    | "invalid-response"
    | "network-error";
  message: string;
  status?: number;
}

export type CompleteResponse = CompleteResult | CompleteError;

/**
 * Single-prompt completion. The simplest possible call surface so individual
 * features can just say "complete(prompt, { system })" and get text back.
 */
export async function complete(
  prompt: string,
  options: CompleteOptions = {}
): Promise<CompleteResponse> {
  const key = getClaudeKey();
  if (!key) {
    return {
      ok: false,
      reason: "no-key",
      message:
        "No Claude API key configured. Add one in Integrations to enable AI features.",
    };
  }

  const model = options.model ?? getClaudeModel() ?? DEFAULT_CLAUDE_MODEL;

  const body = {
    model,
    max_tokens: options.maxTokens ?? 2000,
    temperature: options.temperature ?? 0.4,
    ...(options.system ? { system: options.system } : {}),
    messages: [{ role: "user", content: prompt }],
  };

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
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
      const errBody = (await response.json()) as {
        error?: { message?: string };
      };
      if (errBody.error?.message) detail = errBody.error.message;
    } catch {
      /* ignore */
    }
    return {
      ok: false,
      reason: "api-error",
      message: detail,
      status: response.status,
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (err) {
    return {
      ok: false,
      reason: "invalid-response",
      message: err instanceof Error ? err.message : "Bad JSON",
    };
  }

  const parsed = json as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
    model?: string;
  };

  const textBlock = parsed.content?.find((b) => b.type === "text");
  if (!textBlock?.text) {
    return {
      ok: false,
      reason: "invalid-response",
      message: "Response contained no text block",
    };
  }

  return {
    ok: true,
    text: textBlock.text,
    usage: {
      inputTokens: parsed.usage?.input_tokens ?? 0,
      outputTokens: parsed.usage?.output_tokens ?? 0,
    },
    model: parsed.model ?? model,
  };
}

/**
 * Streaming variant — yields text deltas as they arrive. Not used in the
 * initial intake-assist demo but kept here so feature work can opt in.
 */
export async function* completeStream(
  prompt: string,
  options: CompleteOptions = {}
): AsyncGenerator<string, void, void> {
  const key = getClaudeKey();
  if (!key) {
    throw new Error("No Claude API key configured");
  }

  const model = options.model ?? getClaudeModel() ?? DEFAULT_CLAUDE_MODEL;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.4,
      ...(options.system ? { system: options.system } : {}),
      messages: [{ role: "user", content: prompt }],
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
        const parsed = JSON.parse(data) as {
          type: string;
          delta?: { type: string; text?: string };
        };
        if (
          parsed.type === "content_block_delta" &&
          parsed.delta?.type === "text_delta" &&
          parsed.delta.text
        ) {
          yield parsed.delta.text;
        }
      } catch {
        /* skip malformed chunk */
      }
    }
  }
}
