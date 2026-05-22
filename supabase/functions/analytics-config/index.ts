/**
 * analytics-config — Federated GA configuration for the CROS family.
 *
 * WHAT: Public GET endpoint that returns the Google Analytics measurement
 *       ID (and optional custom-dimension config) every CROS-family app
 *       should use. Apps fetch this on first paint and inject gtag.js
 *       with the returned ID.
 * WHERE: Called by the shared `useGlobalAnalytics` React hook in every app.
 * WHY: Centralizes the GA measurement ID so swapping properties or A/B
 *      testing GA configurations is a one-line server-side change instead
 *      of 17 redeploys.
 *
 * Security model:
 *   • Fully public (verify_jwt = false in supabase/config.toml).
 *   • CORS allowlist enforced (see _shared/cors.ts).
 *   • Read-only — no DB writes, no auth, no PII handling.
 *   • Cache-friendly response (Cache-Control: public, max-age=300, s-maxage=900).
 *
 * Config sources (in priority order):
 *   1. Env var GA_MEASUREMENT_ID (set this to override default)
 *   2. Hardcoded DEFAULT_MEASUREMENT_ID below (G-RKF41M29QE — CROS Family property)
 */

import { corsHeaders } from '../_shared/cors.ts';

// ── Defaults ─────────────────────────────────────────────────────────────
// CROS Family GA4 property (ID 526708699). Override via GA_MEASUREMENT_ID env var
// per environment (e.g. set a debug property on staging).
const DEFAULT_MEASUREMENT_ID = 'G-RKF41M29QE';

// Custom dimensions registered on the GA4 property. The frontend hook will
// pass these as `gtag('config', id, { ...customDimensions })`.
//
// Convention: each app stamps `cros_app: <slug>` on every event so reports
// can be filtered by app inside one shared property.
//
// To register a custom dimension in GA4:
//   Admin → Custom definitions → Create custom dimension
//   Scope: Event, Event parameter: cros_app
const CUSTOM_DIMENSIONS_PARAMS = ['cros_app'];

// Known source apps (mirrors KNOWN_SOURCE_APPS in public-leads-intake).
// Used for soft validation of the optional ?app= query param.
const KNOWN_SOURCE_APPS = new Set([
  'thecros',
  'theschola',
  'hortus',
  'refugium',
  'resurrectio',
  'transitus',
  'vigilia',
  'communis',
  'propria',
  'cormundum',
  'bitoku',
  'rehearso',
  'heritage-kitchen',
  'via-publica',
  'fabrica-forge',
  'catholic-insurance',
  'vrtmethod',
]);

interface AnalyticsConfigResponse {
  /** GA4 measurement ID, e.g. "G-RKF41M29QE" */
  measurementId: string;
  /** Provider — currently always "ga4". Future-proof for posthog/plausible swaps. */
  provider: 'ga4';
  /** Whether GA debug_mode should be enabled (true on staging/dev only). */
  debug: boolean;
  /** Custom dimension parameter names the client should always stamp. */
  customDimensionParams: string[];
  /** Echoed app slug if the caller passed ?app=<slug> and it was recognized. */
  app: string | null;
  /** Server timestamp (ISO) — useful for cache debugging. */
  serverTime: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const url = new URL(req.url);
  const appParam = url.searchParams.get('app');
  const app = appParam && KNOWN_SOURCE_APPS.has(appParam) ? appParam : null;

  const measurementId =
    Deno.env.get('GA_MEASUREMENT_ID')?.trim() || DEFAULT_MEASUREMENT_ID;

  // Debug mode: explicit env override, otherwise off in production.
  const debug = Deno.env.get('GA_DEBUG_MODE') === 'true';

  const body: AnalyticsConfigResponse = {
    measurementId,
    provider: 'ga4',
    debug,
    customDimensionParams: CUSTOM_DIMENSIONS_PARAMS,
    app,
    serverTime: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      // Cache aggressively — config changes are rare and the hook re-fetches on every page load anyway.
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  });
});
