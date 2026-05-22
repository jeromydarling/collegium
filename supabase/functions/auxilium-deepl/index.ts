/**
 * auxilium-deepl — proxies translation requests to DeepL, holding the
 * API key server-side.
 *
 * Request body:
 *   {
 *     text: string[],            // up to 50 strings per call
 *     target_lang: string,       // DeepL target code (EN-US, ES, FR, etc.)
 *     source_lang?: string,      // optional source code; omit to auto-detect
 *     formality?: "default" | "less" | "more" | "prefer_less" | "prefer_more",
 *     preserve_formatting?: boolean
 *   }
 *
 * Response: { translations: [{ text: string, detected_source_language?: string }] }
 *
 * Secrets (set in Lovable → Supabase → Edge Function Secrets):
 *   DEEPL_API_KEY      required
 *   DEEPL_API_HOST     optional — "api-free.deepl.com" or "api.deepl.com".
 *                      Defaults to api-free.deepl.com.
 */

import {
  getCorsHeaders,
  handleCorsPreflightResponse,
} from "../_shared/cors.ts";

interface TranslateArgs {
  text: string[];
  target_lang: string;
  source_lang?: string;
  formality?: "default" | "less" | "more" | "prefer_less" | "prefer_more";
  preserve_formatting?: boolean;
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

  const apiKey = Deno.env.get("DEEPL_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "DEEPL_API_KEY not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
  const host =
    Deno.env.get("DEEPL_API_HOST") ?? "api-free.deepl.com";

  let body: TranslateArgs;
  try {
    body = (await req.json()) as TranslateArgs;
  } catch {
    return new Response(JSON.stringify({ error: "Bad JSON" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (
    !body ||
    !Array.isArray(body.text) ||
    body.text.length === 0 ||
    body.text.length > 50 ||
    typeof body.target_lang !== "string"
  ) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid fields" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  // DeepL accepts a repeated `text` parameter via form encoding; the
  // JSON endpoint also exists. We use JSON for clarity.
  const r = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: body.text,
      target_lang: body.target_lang,
      source_lang: body.source_lang,
      formality: body.formality ?? "default",
      preserve_formatting: body.preserve_formatting ?? true,
    }),
  });

  const text = await r.text();
  return new Response(text, {
    status: r.status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
