/**
 * auxilium-perplexity — proxies Perplexity Sonar requests, holding the
 * API key server-side.
 *
 * The Auxilium client uses this for two surfaces:
 *   1. The eviction matter-file "What's true in your area today" panels
 *      (notice period, answer deadline, rental assistance, RTC, legal-aid).
 *   2. The mass-referral "find every nearby help" lookup (SVdP, KofC,
 *      Catholic Charities, Lutheran, CLS, CLINIC, World Relief,
 *      Administer Justice, Salvation Army).
 *
 * Request body:
 *   {
 *     model?: "sonar" | "sonar-pro",     // default: "sonar"
 *     prompt: string,                     // user-facing query
 *     temperature?: number,               // default 0.2
 *     return_citations?: boolean,         // default true
 *     system?: string                     // optional override (else built-in)
 *   }
 *
 * Response:
 *   {
 *     answer: string,
 *     citations: { url: string, title?: string }[]
 *   }
 *
 * Secrets (set in Lovable → Supabase → Edge Function Secrets):
 *   PERPLEXITY_API_KEY    required
 */

import {
  getCorsHeaders,
  handleCorsPreflightResponse,
} from "../_shared/cors.ts";

const DEFAULT_SYSTEM =
  "You are a legal information assistant for Auxilium, a Christian-founded legal-help platform. " +
  "You provide INFORMATION, never legal advice. You cite primary sources (statutes, court rules, " +
  "government agency websites, established legal-aid organizations) wherever possible. If a " +
  "question cannot be answered from current public sources, say so plainly.";

interface AskArgs {
  prompt: string;
  model?: "sonar" | "sonar-pro";
  temperature?: number;
  return_citations?: boolean;
  system?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCorsPreflightResponse(req);
  const cors = getCorsHeaders(req);
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "PERPLEXITY_API_KEY not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  let body: AskArgs;
  try {
    body = (await req.json()) as AskArgs;
  } catch {
    return new Response(JSON.stringify({ error: "Bad JSON" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const payload = {
    model: body.model ?? "sonar",
    messages: [
      { role: "system", content: body.system ?? DEFAULT_SYSTEM },
      { role: "user", content: body.prompt.slice(0, 8_000) },
    ],
    return_citations: body.return_citations ?? true,
    temperature: body.temperature ?? 0.2,
  };

  const r = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `Perplexity ${r.status}: ${errText}` }),
      { status: r.status, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const data = await r.json();
  const answer: string = data?.choices?.[0]?.message?.content ?? "";
  const citations: { url: string; title?: string }[] = Array.isArray(
    data?.citations
  )
    ? (data.citations as Array<string | { url: string; title?: string }>).map(
        (c) => (typeof c === "string" ? { url: c } : c)
      )
    : [];

  return new Response(JSON.stringify({ answer, citations }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
