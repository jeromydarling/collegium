/**
 * State-level metrics for the Justice Gap choropleth.
 *
 * Following the kickoff-doc pattern: these get baked into feature
 * properties at bundle assembly so the choropleth paint expression
 * reads via `['get', 'metric_<chapterId>']` rather than through
 * `setFeatureState`. We're using react-simple-maps tonight; the same
 * shape will transfer to Mapbox when we migrate.
 *
 * Sources (approximations — see source notes in chapters.ts):
 *   • Public defender caseloads: Sixth Amendment Center state surveys,
 *     supplemented by ABA SCLAID reports. Where state-level published
 *     numbers don't exist, we use the regional / per-county median
 *     reported in the field.
 *   • Indigent-defense spending: BJS State Indigent Defense Survey;
 *     Sixth Amendment Center state reports.
 *   • Incarceration rate: PrisonPolicy.org 2024 state data.
 *   • LSC-funded attorneys per 10K poor: derived from LSC 2023
 *     Fact Book + state poverty population.
 *   • Exonerations: National Registry of Exonerations, totals by
 *     state through ~2024.
 *   • Plea %: USSC + state court statistical reports. We use 95% as
 *     the national floor and small spreads on either side.
 *   • Pretrial %: PPI 2024 jail snapshot.
 *
 * These are educational approximations. Each chapter card links to
 * the primary source so the reader can verify.
 */

export type StateMetrics = {
  pd_caseload: number;
  indigent_spend_per_capita: number;
  incarceration_per_100k: number;
  lsc_attys_per_10k_poor: number;
  exonerations_total: number;
  plea_pct: number;
  pretrial_pct: number;
};

export const stateMetrics: Record<string, StateMetrics> = {
  AL: { pd_caseload: 480, indigent_spend_per_capita: 6.5, incarceration_per_100k: 941, lsc_attys_per_10k_poor: 0.5, exonerations_total: 42, plea_pct: 95, pretrial_pct: 58 },
  AK: { pd_caseload: 380, indigent_spend_per_capita: 50.0, incarceration_per_100k: 615, lsc_attys_per_10k_poor: 1.1, exonerations_total: 8, plea_pct: 94, pretrial_pct: 49 },
  AZ: { pd_caseload: 520, indigent_spend_per_capita: 11.0, incarceration_per_100k: 745, lsc_attys_per_10k_poor: 0.7, exonerations_total: 55, plea_pct: 96, pretrial_pct: 65 },
  AR: { pd_caseload: 580, indigent_spend_per_capita: 4.8, incarceration_per_100k: 928, lsc_attys_per_10k_poor: 0.6, exonerations_total: 17, plea_pct: 95, pretrial_pct: 55 },
  CA: { pd_caseload: 440, indigent_spend_per_capita: 28.0, incarceration_per_100k: 494, lsc_attys_per_10k_poor: 1.2, exonerations_total: 326, plea_pct: 94, pretrial_pct: 67 },
  CO: { pd_caseload: 360, indigent_spend_per_capita: 21.5, incarceration_per_100k: 555, lsc_attys_per_10k_poor: 1.0, exonerations_total: 28, plea_pct: 95, pretrial_pct: 60 },
  CT: { pd_caseload: 280, indigent_spend_per_capita: 22.0, incarceration_per_100k: 343, lsc_attys_per_10k_poor: 1.4, exonerations_total: 24, plea_pct: 95, pretrial_pct: 38 },
  DE: { pd_caseload: 360, indigent_spend_per_capita: 19.0, incarceration_per_100k: 524, lsc_attys_per_10k_poor: 1.1, exonerations_total: 4, plea_pct: 95, pretrial_pct: 70 },
  DC: { pd_caseload: 200, indigent_spend_per_capita: 95.0, incarceration_per_100k: 422, lsc_attys_per_10k_poor: 2.2, exonerations_total: 32, plea_pct: 92, pretrial_pct: 45 },
  FL: { pd_caseload: 540, indigent_spend_per_capita: 8.4, incarceration_per_100k: 795, lsc_attys_per_10k_poor: 0.6, exonerations_total: 130, plea_pct: 96, pretrial_pct: 67 },
  GA: { pd_caseload: 600, indigent_spend_per_capita: 7.2, incarceration_per_100k: 968, lsc_attys_per_10k_poor: 0.6, exonerations_total: 32, plea_pct: 96, pretrial_pct: 70 },
  HI: { pd_caseload: 320, indigent_spend_per_capita: 25.0, incarceration_per_100k: 405, lsc_attys_per_10k_poor: 1.1, exonerations_total: 7, plea_pct: 95, pretrial_pct: 60 },
  ID: { pd_caseload: 460, indigent_spend_per_capita: 8.5, incarceration_per_100k: 754, lsc_attys_per_10k_poor: 0.5, exonerations_total: 5, plea_pct: 96, pretrial_pct: 70 },
  IL: { pd_caseload: 480, indigent_spend_per_capita: 14.0, incarceration_per_100k: 459, lsc_attys_per_10k_poor: 0.9, exonerations_total: 460, plea_pct: 95, pretrial_pct: 45 },
  IN: { pd_caseload: 520, indigent_spend_per_capita: 7.5, incarceration_per_100k: 720, lsc_attys_per_10k_poor: 0.6, exonerations_total: 38, plea_pct: 96, pretrial_pct: 60 },
  IA: { pd_caseload: 320, indigent_spend_per_capita: 21.0, incarceration_per_100k: 470, lsc_attys_per_10k_poor: 0.9, exonerations_total: 13, plea_pct: 95, pretrial_pct: 50 },
  KS: { pd_caseload: 460, indigent_spend_per_capita: 12.0, incarceration_per_100k: 657, lsc_attys_per_10k_poor: 0.7, exonerations_total: 14, plea_pct: 95, pretrial_pct: 55 },
  KY: { pd_caseload: 460, indigent_spend_per_capita: 10.5, incarceration_per_100k: 911, lsc_attys_per_10k_poor: 0.7, exonerations_total: 31, plea_pct: 95, pretrial_pct: 60 },
  LA: { pd_caseload: 720, indigent_spend_per_capita: 5.0, incarceration_per_100k: 1094, lsc_attys_per_10k_poor: 0.5, exonerations_total: 76, plea_pct: 96, pretrial_pct: 56 },
  ME: { pd_caseload: 320, indigent_spend_per_capita: 19.0, incarceration_per_100k: 328, lsc_attys_per_10k_poor: 1.0, exonerations_total: 4, plea_pct: 94, pretrial_pct: 32 },
  MD: { pd_caseload: 360, indigent_spend_per_capita: 22.0, incarceration_per_100k: 482, lsc_attys_per_10k_poor: 1.0, exonerations_total: 39, plea_pct: 95, pretrial_pct: 60 },
  MA: { pd_caseload: 280, indigent_spend_per_capita: 41.0, incarceration_per_100k: 275, lsc_attys_per_10k_poor: 1.4, exonerations_total: 36, plea_pct: 93, pretrial_pct: 45 },
  MI: { pd_caseload: 520, indigent_spend_per_capita: 11.0, incarceration_per_100k: 633, lsc_attys_per_10k_poor: 0.7, exonerations_total: 120, plea_pct: 96, pretrial_pct: 55 },
  MN: { pd_caseload: 320, indigent_spend_per_capita: 32.0, incarceration_per_100k: 364, lsc_attys_per_10k_poor: 1.2, exonerations_total: 22, plea_pct: 95, pretrial_pct: 60 },
  MS: { pd_caseload: 660, indigent_spend_per_capita: 4.5, incarceration_per_100k: 1031, lsc_attys_per_10k_poor: 0.4, exonerations_total: 25, plea_pct: 96, pretrial_pct: 64 },
  MO: { pd_caseload: 480, indigent_spend_per_capita: 8.5, incarceration_per_100k: 791, lsc_attys_per_10k_poor: 0.6, exonerations_total: 36, plea_pct: 96, pretrial_pct: 55 },
  MT: { pd_caseload: 380, indigent_spend_per_capita: 18.0, incarceration_per_100k: 583, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 94, pretrial_pct: 65 },
  NE: { pd_caseload: 380, indigent_spend_per_capita: 13.0, incarceration_per_100k: 538, lsc_attys_per_10k_poor: 0.7, exonerations_total: 11, plea_pct: 95, pretrial_pct: 55 },
  NV: { pd_caseload: 580, indigent_spend_per_capita: 11.5, incarceration_per_100k: 691, lsc_attys_per_10k_poor: 0.5, exonerations_total: 16, plea_pct: 96, pretrial_pct: 75 },
  NH: { pd_caseload: 340, indigent_spend_per_capita: 23.0, incarceration_per_100k: 287, lsc_attys_per_10k_poor: 0.9, exonerations_total: 3, plea_pct: 94, pretrial_pct: 38 },
  NJ: { pd_caseload: 320, indigent_spend_per_capita: 29.0, incarceration_per_100k: 246, lsc_attys_per_10k_poor: 1.2, exonerations_total: 54, plea_pct: 95, pretrial_pct: 28 },
  NM: { pd_caseload: 540, indigent_spend_per_capita: 16.0, incarceration_per_100k: 642, lsc_attys_per_10k_poor: 0.7, exonerations_total: 12, plea_pct: 95, pretrial_pct: 55 },
  NY: { pd_caseload: 320, indigent_spend_per_capita: 36.0, incarceration_per_100k: 314, lsc_attys_per_10k_poor: 1.3, exonerations_total: 365, plea_pct: 94, pretrial_pct: 38 },
  NC: { pd_caseload: 520, indigent_spend_per_capita: 9.0, incarceration_per_100k: 444, lsc_attys_per_10k_poor: 0.6, exonerations_total: 91, plea_pct: 95, pretrial_pct: 55 },
  ND: { pd_caseload: 280, indigent_spend_per_capita: 17.0, incarceration_per_100k: 461, lsc_attys_per_10k_poor: 0.8, exonerations_total: 1, plea_pct: 95, pretrial_pct: 50 },
  OH: { pd_caseload: 540, indigent_spend_per_capita: 13.0, incarceration_per_100k: 519, lsc_attys_per_10k_poor: 0.7, exonerations_total: 124, plea_pct: 96, pretrial_pct: 50 },
  OK: { pd_caseload: 620, indigent_spend_per_capita: 7.0, incarceration_per_100k: 1004, lsc_attys_per_10k_poor: 0.5, exonerations_total: 47, plea_pct: 96, pretrial_pct: 65 },
  OR: { pd_caseload: 420, indigent_spend_per_capita: 22.0, incarceration_per_100k: 433, lsc_attys_per_10k_poor: 0.9, exonerations_total: 14, plea_pct: 94, pretrial_pct: 60 },
  PA: { pd_caseload: 580, indigent_spend_per_capita: 4.5, incarceration_per_100k: 478, lsc_attys_per_10k_poor: 0.6, exonerations_total: 100, plea_pct: 96, pretrial_pct: 60 },
  RI: { pd_caseload: 300, indigent_spend_per_capita: 20.0, incarceration_per_100k: 244, lsc_attys_per_10k_poor: 1.0, exonerations_total: 7, plea_pct: 94, pretrial_pct: 25 },
  SC: { pd_caseload: 560, indigent_spend_per_capita: 6.0, incarceration_per_100k: 559, lsc_attys_per_10k_poor: 0.5, exonerations_total: 13, plea_pct: 96, pretrial_pct: 55 },
  SD: { pd_caseload: 320, indigent_spend_per_capita: 14.0, incarceration_per_100k: 757, lsc_attys_per_10k_poor: 0.7, exonerations_total: 1, plea_pct: 95, pretrial_pct: 55 },
  TN: { pd_caseload: 540, indigent_spend_per_capita: 9.5, incarceration_per_100k: 740, lsc_attys_per_10k_poor: 0.6, exonerations_total: 33, plea_pct: 96, pretrial_pct: 60 },
  TX: { pd_caseload: 620, indigent_spend_per_capita: 8.5, incarceration_per_100k: 769, lsc_attys_per_10k_poor: 0.5, exonerations_total: 488, plea_pct: 96, pretrial_pct: 55 },
  UT: { pd_caseload: 320, indigent_spend_per_capita: 12.0, incarceration_per_100k: 380, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 95, pretrial_pct: 50 },
  VT: { pd_caseload: 280, indigent_spend_per_capita: 24.0, incarceration_per_100k: 234, lsc_attys_per_10k_poor: 1.1, exonerations_total: 2, plea_pct: 94, pretrial_pct: 32 },
  VA: { pd_caseload: 420, indigent_spend_per_capita: 11.5, incarceration_per_100k: 595, lsc_attys_per_10k_poor: 0.7, exonerations_total: 27, plea_pct: 95, pretrial_pct: 50 },
  WA: { pd_caseload: 360, indigent_spend_per_capita: 17.0, incarceration_per_100k: 388, lsc_attys_per_10k_poor: 0.9, exonerations_total: 30, plea_pct: 95, pretrial_pct: 60 },
  WV: { pd_caseload: 420, indigent_spend_per_capita: 12.5, incarceration_per_100k: 593, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 95, pretrial_pct: 55 },
  WI: { pd_caseload: 400, indigent_spend_per_capita: 42.0, incarceration_per_100k: 567, lsc_attys_per_10k_poor: 0.8, exonerations_total: 65, plea_pct: 95, pretrial_pct: 45 },
  WY: { pd_caseload: 300, indigent_spend_per_capita: 22.0, incarceration_per_100k: 614, lsc_attys_per_10k_poor: 0.7, exonerations_total: 2, plea_pct: 95, pretrial_pct: 55 },
};

export function metricValue(state: string, metric: keyof StateMetrics): number | null {
  const s = stateMetrics[state];
  if (!s) return null;
  const v = s[metric];
  return typeof v === "number" ? v : null;
}

/** Interpolate a value within [domain[0], domain[1]] across a ramp. */
export function colorOnRamp(
  value: number | null,
  ramp: string[],
  domain: [number, number]
): string {
  if (value == null) return "hsl(220 10% 22%)";
  const t = clamp((value - domain[0]) / (domain[1] - domain[0]), 0, 1);
  const segments = ramp.length - 1;
  const i = Math.min(Math.floor(t * segments), segments - 1);
  return ramp[i + 1] && t > 0.5 ? ramp[Math.min(ramp.length - 1, i + 1)] : ramp[i];
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Format a metric value for display in the tooltip + state detail. */
export function formatMetric(metric: keyof StateMetrics, v: number): string {
  switch (metric) {
    case "indigent_spend_per_capita":
      return `$${v.toFixed(2)}`;
    case "incarceration_per_100k":
      return `${Math.round(v).toLocaleString()} per 100K`;
    case "pd_caseload":
      return `${Math.round(v)} cases / atty / year`;
    case "lsc_attys_per_10k_poor":
      return `${v.toFixed(2)} attys / 10K poor`;
    case "exonerations_total":
      return `${v.toLocaleString()} exonerations`;
    case "plea_pct":
      return `${v.toFixed(0)}% plea`;
    case "pretrial_pct":
      return `${v.toFixed(0)}% pretrial`;
    default:
      return String(v);
  }
}
