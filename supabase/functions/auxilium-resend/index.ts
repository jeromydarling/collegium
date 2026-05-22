/**
 * auxilium-resend — proxies the Auxilium "Send for me" referral packet
 * to Resend, holding the API key server-side.
 *
 * Request body:
 *   {
 *     to: string,            // recipient email
 *     subject: string,
 *     text: string,          // plain-text body (referral packet)
 *     from?: string,         // optional override — must be a verified Resend sender
 *     reply_to?: string      // user's email so the network can write back
 *   }
 *
 * Response: the JSON returned by Resend (200 with `id` on success;
 * error status + body on failure).
 *
 * Secrets (set in Lovable → Supabase → Edge Function Secrets):
 *   RESEND_API_KEY        required
 *   AUXILIUM_FROM_EMAIL   optional override (default: "Auxilium <referrals@collegium.app>")
 */

import {
  getCorsHeaders,
  handleCorsPreflightResponse,
} from "../_shared/cors.ts";

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  from?: string;
  reply_to?: string;
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

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
  const defaultFrom =
    Deno.env.get("AUXILIUM_FROM_EMAIL") ?? "Auxilium <referrals@collegium.app>";

  let body: SendArgs;
  try {
    body = (await req.json()) as SendArgs;
  } catch {
    return new Response(JSON.stringify({ error: "Bad JSON" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Minimal validation. The client is trusted-but-cheap — this is a
  // user-initiated mass-referral so the main concern is volume.
  if (
    !body ||
    typeof body.to !== "string" ||
    !body.subject ||
    !body.text ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.to)
  ) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid fields" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const payload = {
    from: body.from ?? defaultFrom,
    to: [body.to],
    subject: body.subject.slice(0, 200),
    text: body.text.slice(0, 50_000),
    reply_to: body.reply_to,
  };

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await r.text();
  return new Response(text, {
    status: r.status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
