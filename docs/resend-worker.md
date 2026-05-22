# Resend proxy — Cloudflare Worker

The Auxilium client cannot hold a Resend API key (static deploy → key
would leak in the bundle). We send through a tiny Cloudflare Worker
that owns the secret and forwards to Resend.

## Deploy

1. Sign in to Cloudflare → Workers & Pages → Create Worker.
2. Paste the code below into `index.js`.
3. Settings → Variables → add encrypted env var `RESEND_API_KEY`
   (your Resend key).
4. Settings → Variables → add `ALLOWED_ORIGIN` set to the deployed
   Auxilium origin (e.g., `https://auxilium.collegium.app`).
5. Deploy. Copy the worker URL.
6. In the repo, set the GitHub Actions secret
   `VITE_RESEND_PROXY_URL` to the worker URL. Push to `main`. The
   client `sendEmail()` will start hitting the worker instead of the
   mock.

## Worker code

```js
// resend-proxy/index.js
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN ?? "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    const origin = request.headers.get("origin");
    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400, headers: cors });
    }

    // Minimal validation. The client is trusted-but-cheap: this is a
    // user-initiated mass-referral so we mostly worry about volume.
    if (!body || typeof body.to !== "string" || !body.subject || !body.text) {
      return new Response("Missing fields", { status: 400, headers: cors });
    }

    const payload = {
      from: body.from ?? "Auxilium <referrals@collegium.app>",
      to: body.to,
      subject: body.subject.slice(0, 200),
      text: body.text.slice(0, 50_000),
      reply_to: body.reply_to,
    };

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
```

## Rate limits

Resend's free tier allows 100 emails/day and 10/sec. Each Auxilium
"send" hits at most 9 recipients (one per charitable network), so we
cap at roughly 11 mass-sends per day before the free tier gates us.

When that becomes the limit, upgrade Resend (paid plans start at
$20/mo for 50K/mo) or batch into a single email with all networks in
BCC.

## Domain setup

Resend requires the `from` domain to be verified. For Collegium:
1. Add `collegium.app` as a domain in Resend.
2. Add the SPF, DKIM, and DMARC records Resend provides.
3. Verify. The `referrals@collegium.app` sender will work.

Until the domain is verified, Resend's `onboarding@resend.dev` sender
works for testing only.
