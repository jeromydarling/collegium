/**
 * The justice crisis, by state.
 *
 * Data sources:
 *   • Lawyers per 1,000 residents: ABA Profile of the Legal Profession.
 *     Reported numbers vary by edition (2022–2024); these are
 *     reasonable approximations rounded to one decimal.
 *   • Eviction filing rates: Princeton Eviction Lab, state averages
 *     (pre-COVID baseline, 2016 since their state-level updates are
 *     uneven). Expressed as % of renter households with a filing per
 *     year.
 *   • LSC turn-away: LSC 2022 Justice Gap Report indicates ~49%
 *     nationally; state programs vary. We use the national rate as
 *     a floor where state-specific data is not published.
 *   • Right-to-Counsel status: National Coalition for a Civil Right
 *     to Counsel tracker (civilrighttocounsel.org), as of 2026.
 *   • Sandbox / LP / LLLT: Utah sandbox (extended to Aug 2027),
 *     Arizona Legal Paraprofessionals (since 2021), Washington LLLT
 *     (sunset 2020), Minnesota LPP pilot, Oregon LPP pilot, New
 *     Hampshire LP pilot, Colorado LPP. AB 2958 froze California.
 *   • Lawyer-desert percentage: ABA / Iowa State Rural Legal Deserts
 *     research. Number of counties with <1 lawyer per 1,000 residents
 *     as a share of the state's counties.
 *
 * These numbers are approximations meant for educational visualization.
 * They are NOT a substitute for primary-source citation in legal work.
 * Each card in the UI links back to the underlying source.
 */

export type RtcStatus =
  | "state-rtc"
  | "city-rtc"
  | "pilot"
  | "none";

export type RegulatoryStatus =
  | "sandbox"
  | "paraprofessional"
  | "lllt-sunset"
  | "pilot"
  | "frozen"
  | "none";

export type StateData = {
  code: string;
  name: string;
  /** Lawyers per 1,000 residents (ABA, 2022–2024 approximations). */
  lawyersPer1000: number;
  /** Eviction filings as % of renter households per year (Eviction Lab). */
  evictionRate: number;
  /** Civil RTC status. */
  rtc: RtcStatus;
  /** Regulatory innovation status. */
  regulatory: RegulatoryStatus;
  /** Approximate % of counties with <1 lawyer per 1,000 residents. */
  lawyerDesertPct: number;
  /** One-line state-specific note. */
  note?: string;
};

export const stateData: Record<string, StateData> = {
  AL: { code: "AL", name: "Alabama", lawyersPer1000: 2.7, evictionRate: 5.2, rtc: "none", regulatory: "none", lawyerDesertPct: 53, note: "Among the lowest LSC funding per low-income resident." },
  AK: { code: "AK", name: "Alaska", lawyersPer1000: 3.0, evictionRate: 1.4, rtc: "none", regulatory: "none", lawyerDesertPct: 78, note: "Massive lawyer desert — vast rural areas with no practicing attorneys." },
  AZ: { code: "AZ", name: "Arizona", lawyersPer1000: 2.4, evictionRate: 3.3, rtc: "none", regulatory: "paraprofessional", lawyerDesertPct: 47, note: "Licensed Legal Paraprofessionals can give advice in family, civil, criminal, and administrative matters." },
  AR: { code: "AR", name: "Arkansas", lawyersPer1000: 2.1, evictionRate: 6.5, rtc: "none", regulatory: "none", lawyerDesertPct: 60, note: "Highest eviction filing rate among Southern states." },
  CA: { code: "CA", name: "California", lawyersPer1000: 4.4, evictionRate: 1.7, rtc: "city-rtc", regulatory: "frozen", lawyerDesertPct: 18, note: "AB 2958 (2022) froze state-bar sandbox and paraprofessional programs through at least 2025." },
  CO: { code: "CO", name: "Colorado", lawyersPer1000: 4.0, evictionRate: 1.9, rtc: "city-rtc", regulatory: "paraprofessional", lawyerDesertPct: 31, note: "Licensed Legal Paraprofessionals in family law. Boulder has tenant RTC." },
  CT: { code: "CT", name: "Connecticut", lawyersPer1000: 5.4, evictionRate: 1.8, rtc: "state-rtc", regulatory: "none", lawyerDesertPct: 0, note: "Statewide eviction Right to Counsel for low-income tenants since 2021." },
  DE: { code: "DE", name: "Delaware", lawyersPer1000: 4.0, evictionRate: 3.6, rtc: "none", regulatory: "none", lawyerDesertPct: 0, note: "Smallest state by area; concentrated legal services." },
  DC: { code: "DC", name: "District of Columbia", lawyersPer1000: 81.3, evictionRate: 5.4, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 0, note: "Most lawyer-dense jurisdiction in the country, but high eviction rate among low-income residents." },
  FL: { code: "FL", name: "Florida", lawyersPer1000: 4.4, evictionRate: 2.6, rtc: "none", regulatory: "none", lawyerDesertPct: 15, note: "Active state-bar AI enforcement opinions; sandbox proposal rejected." },
  GA: { code: "GA", name: "Georgia", lawyersPer1000: 3.0, evictionRate: 6.0, rtc: "none", regulatory: "none", lawyerDesertPct: 56, note: "Among highest eviction filing rates in the South." },
  HI: { code: "HI", name: "Hawaii", lawyersPer1000: 3.0, evictionRate: 1.1, rtc: "none", regulatory: "none", lawyerDesertPct: 0, note: "Active Access to Justice Commission with technology pilots." },
  ID: { code: "ID", name: "Idaho", lawyersPer1000: 2.0, evictionRate: 1.8, rtc: "none", regulatory: "none", lawyerDesertPct: 64, note: "Most counties have fewer than one lawyer per 1,000 residents." },
  IL: { code: "IL", name: "Illinois", lawyersPer1000: 4.7, evictionRate: 3.2, rtc: "none", regulatory: "none", lawyerDesertPct: 24, note: "Illinois Legal Aid Online runs one of the largest LawHelp Interactive deployments." },
  IN: { code: "IN", name: "Indiana", lawyersPer1000: 2.0, evictionRate: 5.8, rtc: "none", regulatory: "none", lawyerDesertPct: 49, note: "Neighborhood Christian Legal Clinic (Indianapolis) handles ~9 staff attorneys + 16 statewide intake clinics." },
  IA: { code: "IA", name: "Iowa", lawyersPer1000: 2.4, evictionRate: 2.4, rtc: "none", regulatory: "none", lawyerDesertPct: 65, note: "Rural lawyer-desert problem widely studied at Iowa State." },
  KS: { code: "KS", name: "Kansas", lawyersPer1000: 2.3, evictionRate: 4.8, rtc: "none", regulatory: "none", lawyerDesertPct: 68, note: "Western counties chronically underserved." },
  KY: { code: "KY", name: "Kentucky", lawyersPer1000: 2.7, evictionRate: 2.5, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 47, note: "Louisville guarantees free counsel to low-income tenants facing eviction." },
  LA: { code: "LA", name: "Louisiana", lawyersPer1000: 4.2, evictionRate: 2.1, rtc: "none", regulatory: "none", lawyerDesertPct: 30, note: "Civil law tradition; unique procedural overlay." },
  ME: { code: "ME", name: "Maine", lawyersPer1000: 2.6, evictionRate: 1.2, rtc: "none", regulatory: "none", lawyerDesertPct: 50, note: "Rural lawyer-desert in northern counties; veteran population concentrated." },
  MD: { code: "MD", name: "Maryland", lawyersPer1000: 5.4, evictionRate: 9.5, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 0, note: "Highest eviction-filing rate in the country. Statewide tenant RTC enacted but underfunded." },
  MA: { code: "MA", name: "Massachusetts", lawyersPer1000: 6.6, evictionRate: 1.7, rtc: "none", regulatory: "none", lawyerDesertPct: 0, note: "MassLegalHelp.org and CLA-Boston are mature; statewide RTC bill pending." },
  MI: { code: "MI", name: "Michigan", lawyersPer1000: 3.0, evictionRate: 4.4, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 16, note: "Detroit and Toledo (just across the line in OH) both have RTC programs." },
  MN: { code: "MN", name: "Minnesota", lawyersPer1000: 4.4, evictionRate: 1.8, rtc: "none", regulatory: "pilot", lawyerDesertPct: 39, note: "Legal Paraprofessional Pilot program for family-law and housing." },
  MS: { code: "MS", name: "Mississippi", lawyersPer1000: 2.7, evictionRate: 5.7, rtc: "none", regulatory: "none", lawyerDesertPct: 60, note: "Lowest household income in the country; LSC turn-away near 60%." },
  MO: { code: "MO", name: "Missouri", lawyersPer1000: 3.6, evictionRate: 4.3, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 41, note: "Kansas City has tenant RTC. Janson v. LegalZoom originated here." },
  MT: { code: "MT", name: "Montana", lawyersPer1000: 2.7, evictionRate: 1.5, rtc: "none", regulatory: "none", lawyerDesertPct: 73, note: "Geographically vast lawyer deserts." },
  NE: { code: "NE", name: "Nebraska", lawyersPer1000: 2.5, evictionRate: 2.8, rtc: "none", regulatory: "none", lawyerDesertPct: 68, note: "Western counties chronically underserved." },
  NV: { code: "NV", name: "Nevada", lawyersPer1000: 2.7, evictionRate: 5.2, rtc: "none", regulatory: "none", lawyerDesertPct: 47, note: "Summary eviction process is among the fastest in the country (5–7 days)." },
  NH: { code: "NH", name: "New Hampshire", lawyersPer1000: 3.0, evictionRate: 1.4, rtc: "none", regulatory: "pilot", lawyerDesertPct: 30, note: "Active LP pilot for family and housing matters." },
  NJ: { code: "NJ", name: "New Jersey", lawyersPer1000: 4.4, evictionRate: 4.9, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 0, note: "Newark has tenant RTC. Pending statewide expansion." },
  NM: { code: "NM", name: "New Mexico", lawyersPer1000: 3.0, evictionRate: 3.7, rtc: "none", regulatory: "none", lawyerDesertPct: 55, note: "Tribal jurisdictional complexity adds another layer of unmet need." },
  NY: { code: "NY", name: "New York", lawyersPer1000: 9.4, evictionRate: 2.6, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 14, note: "NYC RTC has fallen from 71% (FY21) to 42% representation due to underfunding. Upsolve litigation revived UPL enforcement (2025 2d Cir)." },
  NC: { code: "NC", name: "North Carolina", lawyersPer1000: 2.6, evictionRate: 5.9, rtc: "none", regulatory: "none", lawyerDesertPct: 38, note: "Among highest eviction rates in the country." },
  ND: { code: "ND", name: "North Dakota", lawyersPer1000: 2.2, evictionRate: 1.2, rtc: "none", regulatory: "none", lawyerDesertPct: 79, note: "Most extreme lawyer-desert state by per-county metric." },
  OH: { code: "OH", name: "Ohio", lawyersPer1000: 3.4, evictionRate: 4.2, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 26, note: "Cleveland and Toledo both have tenant RTC." },
  OK: { code: "OK", name: "Oklahoma", lawyersPer1000: 3.2, evictionRate: 6.7, rtc: "none", regulatory: "none", lawyerDesertPct: 58, note: "Highest eviction filing rate among non-Southern states." },
  OR: { code: "OR", name: "Oregon", lawyersPer1000: 3.3, evictionRate: 1.9, rtc: "none", regulatory: "pilot", lawyerDesertPct: 36, note: "Licensed Paralegal pilot program. Statewide tenant protections among strongest in country." },
  PA: { code: "PA", name: "Pennsylvania", lawyersPer1000: 3.6, evictionRate: 3.1, rtc: "city-rtc", regulatory: "none", lawyerDesertPct: 32, note: "Philadelphia has tenant RTC; CLA-Pittsburgh runs a major Christian legal aid clinic." },
  RI: { code: "RI", name: "Rhode Island", lawyersPer1000: 4.3, evictionRate: 1.6, rtc: "none", regulatory: "none", lawyerDesertPct: 0, note: "Small state with concentrated services." },
  SC: { code: "SC", name: "South Carolina", lawyersPer1000: 2.6, evictionRate: 7.7, rtc: "none", regulatory: "none", lawyerDesertPct: 39, note: "Eviction filing rate among the top three nationally." },
  SD: { code: "SD", name: "South Dakota", lawyersPer1000: 2.3, evictionRate: 1.3, rtc: "none", regulatory: "none", lawyerDesertPct: 76, note: "Per-county lawyer density rivals North Dakota and Alaska." },
  TN: { code: "TN", name: "Tennessee", lawyersPer1000: 2.8, evictionRate: 4.5, rtc: "none", regulatory: "none", lawyerDesertPct: 35, note: "Compassionate Counsel (Nashville) runs a notable Christian legal aid clinic." },
  TX: { code: "TX", name: "Texas", lawyersPer1000: 3.6, evictionRate: 3.4, rtc: "none", regulatory: "none", lawyerDesertPct: 38, note: "Active state-bar AI enforcement opinion (TX Op. 705). Texas Legal Services Center runs a notable Spanish-language portal." },
  UT: { code: "UT", name: "Utah", lawyersPer1000: 2.7, evictionRate: 2.7, rtc: "none", regulatory: "sandbox", lawyerDesertPct: 38, note: "Regulatory sandbox extended through August 2027 — friendliest jurisdiction in the country for legal-tech innovation." },
  VT: { code: "VT", name: "Vermont", lawyersPer1000: 3.3, evictionRate: 1.0, rtc: "none", regulatory: "none", lawyerDesertPct: 50, note: "Strong nonprofit legal aid coverage; lowest filing rate in the country." },
  VA: { code: "VA", name: "Virginia", lawyersPer1000: 3.6, evictionRate: 5.1, rtc: "none", regulatory: "none", lawyerDesertPct: 27, note: "Arlington has a CBA Catholic legal-affiliate; statewide filings rebounded post-pandemic." },
  WA: { code: "WA", name: "Washington", lawyersPer1000: 3.8, evictionRate: 1.6, rtc: "state-rtc", regulatory: "lllt-sunset", lawyerDesertPct: 30, note: "Statewide tenant RTC for low-income; LLLT program sunset in 2020 after pioneering the model." },
  WV: { code: "WV", name: "West Virginia", lawyersPer1000: 2.7, evictionRate: 1.5, rtc: "none", regulatory: "none", lawyerDesertPct: 51, note: "Coal-country lawyer deserts; opioid-crisis adds untracked civil legal need." },
  WI: { code: "WI", name: "Wisconsin", lawyersPer1000: 2.6, evictionRate: 2.9, rtc: "none", regulatory: "none", lawyerDesertPct: 36, note: "Catholic Charities v. Wisconsin LIRC (SCOTUS 2025) reshaped religious-org tax doctrine." },
  WY: { code: "WY", name: "Wyoming", lawyersPer1000: 2.6, evictionRate: 1.1, rtc: "none", regulatory: "none", lawyerDesertPct: 78, note: "Lawyer desert across most of the state's geography." },
};

export const STATE_FIPS_TO_CODE: Record<string, string> = {
  "01": "AL","02": "AK","04": "AZ","05": "AR","06": "CA","08": "CO","09": "CT","10": "DE","11": "DC","12": "FL","13": "GA","15": "HI","16": "ID","17": "IL","18": "IN","19": "IA","20": "KS","21": "KY","22": "LA","23": "ME","24": "MD","25": "MA","26": "MI","27": "MN","28": "MS","29": "MO","30": "MT","31": "NE","32": "NV","33": "NH","34": "NJ","35": "NM","36": "NY","37": "NC","38": "ND","39": "OH","40": "OK","41": "OR","42": "PA","44": "RI","45": "SC","46": "SD","47": "TN","48": "TX","49": "UT","50": "VT","51": "VA","53": "WA","54": "WV","55": "WI","56": "WY",
};

export type Metric =
  | "rtc"
  | "lawyersPer1000"
  | "evictionRate"
  | "lawyerDesertPct"
  | "regulatory";

export const METRIC_LABEL: Record<Metric, string> = {
  rtc: "Right to a free lawyer in eviction cases",
  lawyersPer1000: "Lawyers per 1,000 residents",
  evictionRate: "Eviction filings per 100 renter households / year",
  lawyerDesertPct: "Counties with fewer than 1 lawyer per 1,000",
  regulatory: "Non-lawyer help allowed (sandbox / paraprofessional)",
};

export const METRIC_BLURB: Record<Metric, string> = {
  rtc:
    "Only a handful of states or cities guarantee a free lawyer to low-income tenants facing eviction. Everyone else faces a lawyer-vs-no-lawyer mismatch in a court they've never seen before.",
  lawyersPer1000:
    "ABA Profile of the Legal Profession. DC has 81 per 1,000. North Dakota and Idaho have about 2 per 1,000. The poor never see most of them.",
  evictionRate:
    "Princeton Eviction Lab. South Carolina, Oklahoma, Georgia, Maryland are the top of the chart — each filing on more than 1 in 20 renter households per year.",
  lawyerDesertPct:
    "Most U.S. counties have fewer than one lawyer per 1,000 residents. In some states, more than 70% of counties qualify as lawyer deserts.",
  regulatory:
    "Utah's sandbox and Arizona's Legal Paraprofessional program let trained non-lawyers offer advice in defined matters. Washington pioneered the model and shut it down. California froze its sandbox in 2022.",
};

/** Color-scale a state's value for a given metric to a single hue. */
export function colorFor(metric: Metric, s: StateData): string {
  if (metric === "rtc") {
    return s.rtc === "state-rtc"
      ? "hsl(145 30% 35%)" // green — best
      : s.rtc === "city-rtc"
      ? "hsl(145 30% 55%)" // light green — partial
      : s.rtc === "pilot"
      ? "hsl(38 55% 60%)" // amber
      : "hsl(8 50% 38%)"; // red — none
  }
  if (metric === "regulatory") {
    return s.regulatory === "sandbox"
      ? "hsl(145 30% 35%)"
      : s.regulatory === "paraprofessional" || s.regulatory === "pilot"
      ? "hsl(145 30% 55%)"
      : s.regulatory === "lllt-sunset"
      ? "hsl(38 40% 55%)"
      : s.regulatory === "frozen"
      ? "hsl(8 55% 38%)"
      : "hsl(220 10% 65%)";
  }
  // Numeric scales: darker = worse for the poor.
  if (metric === "lawyersPer1000") {
    // Lower is worse. 81 (DC) to 2.0 (lowest).
    const v = s.lawyersPer1000;
    if (v >= 5) return "hsl(145 30% 40%)";
    if (v >= 3.5) return "hsl(145 25% 55%)";
    if (v >= 2.6) return "hsl(38 55% 55%)";
    if (v >= 2.2) return "hsl(15 55% 48%)";
    return "hsl(8 60% 38%)";
  }
  if (metric === "evictionRate") {
    // Higher is worse. 9.5 (MD) high; 1.0 (VT) low.
    const v = s.evictionRate;
    if (v >= 6) return "hsl(8 60% 38%)";
    if (v >= 4) return "hsl(15 55% 48%)";
    if (v >= 2.5) return "hsl(38 55% 55%)";
    if (v >= 1.5) return "hsl(145 25% 55%)";
    return "hsl(145 30% 40%)";
  }
  if (metric === "lawyerDesertPct") {
    const v = s.lawyerDesertPct;
    if (v >= 60) return "hsl(8 60% 38%)";
    if (v >= 40) return "hsl(15 55% 48%)";
    if (v >= 25) return "hsl(38 55% 55%)";
    if (v >= 10) return "hsl(145 25% 55%)";
    return "hsl(145 30% 40%)";
  }
  return "hsl(220 10% 65%)";
}

export const METRIC_LEGEND: Record<Metric, { label: string; color: string }[]> = {
  rtc: [
    { label: "Statewide right to counsel", color: "hsl(145 30% 35%)" },
    { label: "Some cities", color: "hsl(145 30% 55%)" },
    { label: "Pilot program", color: "hsl(38 55% 60%)" },
    { label: "No right", color: "hsl(8 50% 38%)" },
  ],
  regulatory: [
    { label: "Sandbox open", color: "hsl(145 30% 35%)" },
    { label: "Non-lawyer practitioners", color: "hsl(145 30% 55%)" },
    { label: "Closed (LLLT sunset)", color: "hsl(38 40% 55%)" },
    { label: "Frozen", color: "hsl(8 55% 38%)" },
    { label: "None", color: "hsl(220 10% 65%)" },
  ],
  lawyersPer1000: [
    { label: "5+", color: "hsl(145 30% 40%)" },
    { label: "3.5–5", color: "hsl(145 25% 55%)" },
    { label: "2.6–3.5", color: "hsl(38 55% 55%)" },
    { label: "2.2–2.6", color: "hsl(15 55% 48%)" },
    { label: "Below 2.2", color: "hsl(8 60% 38%)" },
  ],
  evictionRate: [
    { label: "Below 1.5%", color: "hsl(145 30% 40%)" },
    { label: "1.5–2.5%", color: "hsl(145 25% 55%)" },
    { label: "2.5–4%", color: "hsl(38 55% 55%)" },
    { label: "4–6%", color: "hsl(15 55% 48%)" },
    { label: "Above 6%", color: "hsl(8 60% 38%)" },
  ],
  lawyerDesertPct: [
    { label: "Below 10%", color: "hsl(145 30% 40%)" },
    { label: "10–25%", color: "hsl(145 25% 55%)" },
    { label: "25–40%", color: "hsl(38 55% 55%)" },
    { label: "40–60%", color: "hsl(15 55% 48%)" },
    { label: "Over 60%", color: "hsl(8 60% 38%)" },
  ],
};
