/**
 * Resend client — auto-send the referral packet to every charitable
 * network instead of asking the user to open their email app.
 *
 * The user named the problem directly: low-income users often don't
 * have a usable personal email, and copy-paste is a real friction on
 * a Lifeline Android phone. Resend lets us fire the email server-side
 * and surface a per-network success checkmark.
 *
 * Architecture:
 *   – RESEND_API_KEY lives in a server-side secret. It MUST NOT be in
 *     the client bundle. A tiny Cloudflare Worker (or Lovable backend
 *     when re-imported) proxies POST /send to https://api.resend.com/
 *     emails with `Authorization: Bearer ${RESEND_API_KEY}`.
 *   – VITE_RESEND_PROXY_URL points the client at that proxy. When
 *     unset, this module mocks success with a 700ms delay so the UX
 *     is honest in dev.
 *
 * Worker sketch (≈30 lines) lives in docs/resend-worker.md.
 */

export type SendArgs = {
  to: string;
  subject: string;
  body: string;
  /**
   * The "From" address must be a verified Resend sender. We default to
   * an Auxilium-branded sender; the Worker can override.
   */
  from?: string;
  /**
   * A reply-to set to the user's email (if they provide one) so the
   * receiving org can write back directly. Falls back to a Collegium
   * inbox.
   */
  replyTo?: string;
};

export type SendResult = {
  ok: boolean;
  /** Resend message id, when available. */
  id?: string;
  /** Error message, when ok=false. */
  error?: string;
  /** Source: live (Resend) or mock. */
  source: "live" | "mock";
};

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_COLLEGIUM_SUPABASE_URL ||
  "";

/**
 * Resolve the Resend proxy URL. Precedence:
 *   1. VITE_RESEND_PROXY_URL — explicit override (any backend)
 *   2. VITE_SUPABASE_URL + /functions/v1/auxilium-resend (Lovable default)
 *   3. empty string → mock mode
 */
function resolveProxyUrl(): string {
  if (import.meta.env.VITE_RESEND_PROXY_URL)
    return import.meta.env.VITE_RESEND_PROXY_URL as string;
  if (SUPABASE_URL) return `${SUPABASE_URL}/functions/v1/auxilium-resend`;
  return "";
}

const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

const PROXY_URL = resolveProxyUrl();
const MOCK = !PROXY_URL;

export async function sendEmail(args: SendArgs): Promise<SendResult> {
  if (MOCK) return mockSend(args);
  try {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Supabase Edge Functions require the anon key; harmless on
        // any other proxy that ignores it.
        ...(SUPABASE_ANON_KEY
          ? {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            }
          : {}),
      },
      body: JSON.stringify({
        to: args.to,
        subject: args.subject,
        text: args.body,
        from: args.from,
        reply_to: args.replyTo,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, error: `Resend proxy ${res.status}: ${errText}`, source: "live" };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id, source: "live" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), source: "live" };
  }
}

/** Send a batch of identical-body emails to many recipients in parallel. */
export async function sendBatch(
  recipients: string[],
  template: Omit<SendArgs, "to">
): Promise<Map<string, SendResult>> {
  const results = new Map<string, SendResult>();
  // Parallel — Resend rate-limits at 10 req/sec on the free tier,
  // and we won't exceed that for a handful of networks.
  await Promise.all(
    recipients.map(async (to) => {
      const r = await sendEmail({ ...template, to });
      results.set(to, r);
    })
  );
  return results;
}

function mockSend(args: SendArgs): Promise<SendResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Reject mailto-style addresses or obvious typos as "ok: false"
      // so the UI's error-handling path is visible in dev too.
      const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.to);
      resolve({
        ok: looksValid,
        id: looksValid ? `mock_${Math.random().toString(36).slice(2)}` : undefined,
        error: looksValid ? undefined : "Address looks invalid",
        source: "mock",
      });
    }, 700);
  });
}
