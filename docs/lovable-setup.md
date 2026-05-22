# Lovable setup — Auxilium proxies

When this repo is imported into Lovable, three Supabase Edge Functions
deploy automatically and become the live backends for the Auxilium
demo. Each function holds a third-party API key as a Supabase secret;
the client knows to find them at
`${VITE_SUPABASE_URL}/functions/v1/<function-name>`.

The repo's `.env` (and the Lovable project environment) already point
at the existing Supabase project, so once secrets are set the
functions are live.

## The three functions

| Function | What it proxies | Surfaces it powers |
|---|---|---|
| `auxilium-resend` | Resend's `POST /emails` | "Send for me" on the mass referral packet |
| `auxilium-deepl`  | DeepL's `POST /v2/translate` | All UI + dynamic content translation (9 locales) |
| `auxilium-perplexity` | Perplexity Sonar | Local legal-info panels + nearest-charity lookup |

All three are configured as **public** functions (no JWT required) in
`supabase/config.toml`. The CORS allowlist in
`supabase/functions/_shared/cors.ts` already includes the Collegium /
Auxilium / Justice Gap origins (Lovable previews, the GH Pages route,
and the planned production domains).

## Secrets to set in Lovable

In Lovable → Project Settings → Edge Function Secrets, add:

```
RESEND_API_KEY           = re_xxxxxxxxxxxxxxxxxxxxxxxx
AUXILIUM_FROM_EMAIL      = Auxilium <referrals@collegium.app>   (optional)

DEEPL_API_KEY            = xxxxxxxxxxxxxxxxxxxxxxxx:fx           (free tier ends in :fx)
DEEPL_API_HOST           = api-free.deepl.com                    (optional — use api.deepl.com for paid)

PERPLEXITY_API_KEY       = pplx-xxxxxxxxxxxxxxxxxxxxxxxx
```

The functions read these via `Deno.env.get(...)` at request time, so
rotation is a settings change with no redeploy.

## Domain verification for Resend

Resend requires the `from` domain to be verified before it'll send.
For Collegium:

1. Add `collegium.app` as a domain in Resend.
2. Add the SPF, DKIM, and DMARC DNS records Resend provides.
3. Verify.

Until verified, Resend's test sender `onboarding@resend.dev` works for
development. Set `AUXILIUM_FROM_EMAIL=onboarding@resend.dev` to use it.

## Verifying each function works

Once secrets are set, you can verify each from a terminal:

```bash
SUPABASE_URL="https://<your-project>.supabase.co"
ANON_KEY="<your anon publishable key>"

# Perplexity
curl -X POST "$SUPABASE_URL/functions/v1/auxilium-perplexity" \
  -H "Content-Type: application/json" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"prompt": "What is the eviction notice period in Massachusetts?"}'

# DeepL
curl -X POST "$SUPABASE_URL/functions/v1/auxilium-deepl" \
  -H "Content-Type: application/json" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"text": ["Walk into help prepared."], "target_lang": "ES"}'

# Resend (uses onboarding@resend.dev as sender for the test)
curl -X POST "$SUPABASE_URL/functions/v1/auxilium-resend" \
  -H "Content-Type: application/json" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "you@example.com",
    "subject": "Auxilium test",
    "text": "If you see this, the proxy is live."
  }'
```

## How the client knows where to look

`src/collegium/auxilium/lib/{resend,locale,perplexity}.ts` each
resolve a proxy URL in this precedence:

1. An explicit `VITE_*_PROXY_URL` env var (escape hatch — works for
   self-hosted Cloudflare Workers etc.).
2. `${VITE_SUPABASE_URL}/functions/v1/<function-name>` — the Lovable
   default.
3. Empty → mock mode (a believable canned response with a clear
   `source: "mock"` flag in the UI).

This means: **no extra env vars are needed in a Lovable deploy.** The
existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
already in `.env` are sufficient. Set the three API secrets in the
Supabase secrets panel and everything goes live.

## Rate limits, briefly

- **Resend free tier**: 100 emails/day, 10/sec. Each Auxilium "send"
  hits at most 9 networks, so ~11 mass-sends/day before throttling.
  Upgrade ($20/mo for 50K/mo) when volume warrants.
- **DeepL free tier**: 500K characters/month. Translation results are
  client-side cached per `(text, target)` so repeats are free; a
  typical matter file is ~3K chars, so the free tier carries the
  first ~150 matter-file translations comfortably.
- **Perplexity** ([sonar pricing](https://docs.perplexity.ai/guides/pricing)):
  $5 / 1K requests on the cheapest Sonar tier. The nearest-charity
  lookup fires 9 parallel requests per user; that's roughly $0.05
  per mass-referral run.

## Fallback to a self-hosted proxy

If you ever want to move off Supabase (or run a second proxy for
redundancy), set `VITE_RESEND_PROXY_URL` / `VITE_DEEPL_PROXY_URL` /
`VITE_PERPLEXITY_PROXY_URL` in the GitHub Actions secrets and the
client will prefer those over the Supabase URL. The function shapes
above are the contract — any backend that implements the same
request/response shape works.
