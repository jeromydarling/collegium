/**
 * State-level metrics for the Justice Gap choropleth.
 *
 * THE CIVIL/CRIMINAL RATIO. The Legal Services Corporation's 2022
 * Justice Gap Report documents that 74% of low-income U.S. households
 * face a substantial civil legal problem in a given year and 92% of
 * those problems get inadequate or no legal help. Spread across ~50M
 * Americans at ≤125% of the federal poverty line, that's roughly
 * 150 million unmet civil legal events per year. Compare ~10M annual
 * arrests and ~700K felony convictions. The volume of civil legal
 * need is ~15× the criminal side, and civil has no Gideon.
 *
 * So the civil metrics here carry equal — not subordinate — weight in
 * the Justice Gap Index. The criminal numbers below are still
 * documented because the Sixth Amendment promise has not been kept
 * either; but the larger story is civil.
 *
 * Sources (per-metric):
 *   • Public-defender caseloads: Sixth Amendment Center state surveys
 *     + ABA SCLAID reports.
 *   • Indigent-defense spending: BJS State Indigent Defense Survey;
 *     Sixth Amendment Center state reports.
 *   • Incarceration rate: PrisonPolicy.org 2024 state data.
 *   • LSC-funded attorneys per 10K poor: LSC 2023 Fact Book + state
 *     poverty population.
 *   • Exonerations: National Registry of Exonerations.
 *   • Plea %: USSC + state-court statistical reports.
 *   • Pretrial %: BJS Jail Inmates 2023 (national 70%); state values
 *     anchored to PPI 2024 jail snapshot.
 *   • Juvenile contact rate: OJJDP / Sentencing Project approximations.
 *   • Court fines / fees as % of municipal revenue: Fines and Fees
 *     Justice Center / Brookings.
 *   • Death sentences per 1K murders (decade avg): DPIC.
 *   • Recidivism: BJS 24-state 10-year follow-up; PPI state series.
 *
 * Civil metrics (added with the civil rebalance):
 *   • Eviction filing rate: Eviction Lab ETS 2024–2025 (CT, DE, IN,
 *     MN, MO, NM, PA, RI, VA, WI directly; other states inferred
 *     from Eviction Lab city-level data + regional patterns).
 *   • Debt default-judgment rate: Pew Charitable Trusts state-court
 *     studies (AK, CO, CT, IN, MO, NM, TX, UT, WI directly); other
 *     states approximated by legal-aid density + regional pattern.
 *   • Family-court pro-se rate: IAALS "Cases Without Counsel" +
 *     state-level NCSC reports where available; otherwise regional
 *     extrapolation from caseload-pressure and legal-aid density.
 *   • Medicaid procedural-termination % during unwinding: KFF
 *     Medicaid Enrollment and Unwinding Tracker (all 50 states +
 *     DC are tracked directly).
 *   • Immigration unrepresented-rate: TRAC Immigration court-level
 *     representation rates mapped to states by dominant court.
 *
 * Approximations are documented per chapter card; the reader can
 * follow the chapter "source" link to the primary record.
 */

export type StateMetrics = {
  // ── Criminal-justice metrics ────────────────────────────────────
  pd_caseload: number;
  indigent_spend_per_capita: number;
  incarceration_per_100k: number;
  exonerations_total: number;
  plea_pct: number;
  pretrial_pct: number;
  /** Juvenile court referrals per 1,000 children. */
  juvenile_contact_rate: number;
  /**
   * Court fines + fees + forfeitures as % of municipal/county general
   * revenue. State averages mask the within-state variance — Ferguson
   * famously hit 23% pre-DOJ; many small jurisdictions exceed 15%.
   */
  court_fines_pct: number;
  /**
   * Death sentences per 1,000 murders, decade average (DPIC).
   * 0 = no death penalty authorized / functional moratorium.
   */
  death_sentences_per_murder: number;
  /** 3-year rearrest rate for released state prisoners. */
  recidivism_3yr_pct: number;

  // ── Civil-justice metrics (≥10× larger story by need) ───────────
  /** LSC-funded attorneys per 10K Americans in poverty in the state. */
  lsc_attys_per_10k_poor: number;
  /** Eviction filings per 100 renter households, latest year. */
  eviction_filing_pct: number;
  /** % of debt-collection lawsuits that end in default judgment. */
  debt_default_pct: number;
  /** % of family-court cases with at least one self-represented party. */
  family_pro_se_pct: number;
  /**
   * Of Medicaid disenrollments during the 2023–2024 unwinding, the
   * share terminated for procedural / paperwork reasons rather than
   * substantive ineligibility (KFF tracker, all-50-state coverage).
   */
  medicaid_procedural_pct: number;
  /**
   * % of immigration-court respondents in the state's dominant court
   * who appeared without counsel (TRAC, mapped to states).
   */
  immigration_pro_se_pct: number;
};

export const stateMetrics: Record<string, StateMetrics> = {
  AL: { pd_caseload: 480, indigent_spend_per_capita: 6.5, incarceration_per_100k: 941, lsc_attys_per_10k_poor: 0.5, exonerations_total: 42, plea_pct: 95, pretrial_pct: 58, juvenile_contact_rate: 38, court_fines_pct: 5.2, death_sentences_per_murder: 3.8, recidivism_3yr_pct: 72, eviction_filing_pct: 14, debt_default_pct: 78, family_pro_se_pct: 78, medicaid_procedural_pct: 70, immigration_pro_se_pct: 75 },
  AK: { pd_caseload: 380, indigent_spend_per_capita: 50.0, incarceration_per_100k: 615, lsc_attys_per_10k_poor: 1.1, exonerations_total: 8, plea_pct: 94, pretrial_pct: 49, juvenile_contact_rate: 32, court_fines_pct: 2.1, death_sentences_per_murder: 0, recidivism_3yr_pct: 66, eviction_filing_pct: 6, debt_default_pct: 70, family_pro_se_pct: 70, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  AZ: { pd_caseload: 520, indigent_spend_per_capita: 11.0, incarceration_per_100k: 745, lsc_attys_per_10k_poor: 0.7, exonerations_total: 55, plea_pct: 96, pretrial_pct: 65, juvenile_contact_rate: 30, court_fines_pct: 6.4, death_sentences_per_murder: 2.4, recidivism_3yr_pct: 71, eviction_filing_pct: 12, debt_default_pct: 73, family_pro_se_pct: 75, medicaid_procedural_pct: 65, immigration_pro_se_pct: 70 },
  AR: { pd_caseload: 580, indigent_spend_per_capita: 4.8, incarceration_per_100k: 928, lsc_attys_per_10k_poor: 0.6, exonerations_total: 17, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 36, court_fines_pct: 4.8, death_sentences_per_murder: 1.9, recidivism_3yr_pct: 70, eviction_filing_pct: 13, debt_default_pct: 80, family_pro_se_pct: 78, medicaid_procedural_pct: 86, immigration_pro_se_pct: 75 },
  CA: { pd_caseload: 440, indigent_spend_per_capita: 28.0, incarceration_per_100k: 494, lsc_attys_per_10k_poor: 1.2, exonerations_total: 326, plea_pct: 94, pretrial_pct: 67, juvenile_contact_rate: 16, court_fines_pct: 3.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 50, eviction_filing_pct: 4, debt_default_pct: 60, family_pro_se_pct: 80, medicaid_procedural_pct: 32, immigration_pro_se_pct: 55 },
  CO: { pd_caseload: 360, indigent_spend_per_capita: 21.5, incarceration_per_100k: 555, lsc_attys_per_10k_poor: 1.0, exonerations_total: 28, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 22, court_fines_pct: 3.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 56, eviction_filing_pct: 9, debt_default_pct: 70, family_pro_se_pct: 70, medicaid_procedural_pct: 38, immigration_pro_se_pct: 60 },
  CT: { pd_caseload: 280, indigent_spend_per_capita: 22.0, incarceration_per_100k: 343, lsc_attys_per_10k_poor: 1.4, exonerations_total: 24, plea_pct: 95, pretrial_pct: 38, juvenile_contact_rate: 18, court_fines_pct: 2.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 50, eviction_filing_pct: 4, debt_default_pct: 55, family_pro_se_pct: 60, medicaid_procedural_pct: 30, immigration_pro_se_pct: 55 },
  DE: { pd_caseload: 360, indigent_spend_per_capita: 19.0, incarceration_per_100k: 524, lsc_attys_per_10k_poor: 1.1, exonerations_total: 4, plea_pct: 95, pretrial_pct: 70, juvenile_contact_rate: 28, court_fines_pct: 3.0, death_sentences_per_murder: 0, recidivism_3yr_pct: 65, eviction_filing_pct: 5, debt_default_pct: 68, family_pro_se_pct: 65, medicaid_procedural_pct: 35, immigration_pro_se_pct: 55 },
  DC: { pd_caseload: 200, indigent_spend_per_capita: 95.0, incarceration_per_100k: 422, lsc_attys_per_10k_poor: 2.2, exonerations_total: 32, plea_pct: 92, pretrial_pct: 45, juvenile_contact_rate: 35, court_fines_pct: 1.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 48, eviction_filing_pct: 5, debt_default_pct: 50, family_pro_se_pct: 55, medicaid_procedural_pct: 30, immigration_pro_se_pct: 45 },
  FL: { pd_caseload: 540, indigent_spend_per_capita: 8.4, incarceration_per_100k: 795, lsc_attys_per_10k_poor: 0.6, exonerations_total: 130, plea_pct: 96, pretrial_pct: 67, juvenile_contact_rate: 28, court_fines_pct: 5.8, death_sentences_per_murder: 4.6, recidivism_3yr_pct: 66, eviction_filing_pct: 13, debt_default_pct: 75, family_pro_se_pct: 75, medicaid_procedural_pct: 75, immigration_pro_se_pct: 68 },
  GA: { pd_caseload: 600, indigent_spend_per_capita: 7.2, incarceration_per_100k: 968, lsc_attys_per_10k_poor: 0.6, exonerations_total: 32, plea_pct: 96, pretrial_pct: 70, juvenile_contact_rate: 34, court_fines_pct: 7.2, death_sentences_per_murder: 2.1, recidivism_3yr_pct: 68, eviction_filing_pct: 18, debt_default_pct: 72, family_pro_se_pct: 75, medicaid_procedural_pct: 82, immigration_pro_se_pct: 75 },
  HI: { pd_caseload: 320, indigent_spend_per_capita: 25.0, incarceration_per_100k: 405, lsc_attys_per_10k_poor: 1.1, exonerations_total: 7, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 16, court_fines_pct: 2.0, death_sentences_per_murder: 0, recidivism_3yr_pct: 53, eviction_filing_pct: 5, debt_default_pct: 65, family_pro_se_pct: 65, medicaid_procedural_pct: 35, immigration_pro_se_pct: 55 },
  ID: { pd_caseload: 460, indigent_spend_per_capita: 8.5, incarceration_per_100k: 754, lsc_attys_per_10k_poor: 0.5, exonerations_total: 5, plea_pct: 96, pretrial_pct: 70, juvenile_contact_rate: 24, court_fines_pct: 4.2, death_sentences_per_murder: 0.8, recidivism_3yr_pct: 68, eviction_filing_pct: 9, debt_default_pct: 75, family_pro_se_pct: 75, medicaid_procedural_pct: 80, immigration_pro_se_pct: 65 },
  IL: { pd_caseload: 480, indigent_spend_per_capita: 14.0, incarceration_per_100k: 459, lsc_attys_per_10k_poor: 0.9, exonerations_total: 460, plea_pct: 95, pretrial_pct: 45, juvenile_contact_rate: 24, court_fines_pct: 3.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 65, eviction_filing_pct: 8, debt_default_pct: 70, family_pro_se_pct: 70, medicaid_procedural_pct: 60, immigration_pro_se_pct: 50 },
  IN: { pd_caseload: 520, indigent_spend_per_capita: 7.5, incarceration_per_100k: 720, lsc_attys_per_10k_poor: 0.6, exonerations_total: 38, plea_pct: 96, pretrial_pct: 60, juvenile_contact_rate: 32, court_fines_pct: 4.4, death_sentences_per_murder: 0.6, recidivism_3yr_pct: 68, eviction_filing_pct: 11, debt_default_pct: 78, family_pro_se_pct: 72, medicaid_procedural_pct: 55, immigration_pro_se_pct: 60 },
  IA: { pd_caseload: 320, indigent_spend_per_capita: 21.0, incarceration_per_100k: 470, lsc_attys_per_10k_poor: 0.9, exonerations_total: 13, plea_pct: 95, pretrial_pct: 50, juvenile_contact_rate: 22, court_fines_pct: 2.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 55, eviction_filing_pct: 8, debt_default_pct: 70, family_pro_se_pct: 68, medicaid_procedural_pct: 50, immigration_pro_se_pct: 60 },
  KS: { pd_caseload: 460, indigent_spend_per_capita: 12.0, incarceration_per_100k: 657, lsc_attys_per_10k_poor: 0.7, exonerations_total: 14, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 28, court_fines_pct: 4.6, death_sentences_per_murder: 0.4, recidivism_3yr_pct: 66, eviction_filing_pct: 9, debt_default_pct: 73, family_pro_se_pct: 72, medicaid_procedural_pct: 78, immigration_pro_se_pct: 65 },
  KY: { pd_caseload: 460, indigent_spend_per_capita: 10.5, incarceration_per_100k: 911, lsc_attys_per_10k_poor: 0.7, exonerations_total: 31, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 30, court_fines_pct: 4.0, death_sentences_per_murder: 0.6, recidivism_3yr_pct: 71, eviction_filing_pct: 11, debt_default_pct: 75, family_pro_se_pct: 75, medicaid_procedural_pct: 55, immigration_pro_se_pct: 65 },
  LA: { pd_caseload: 720, indigent_spend_per_capita: 5.0, incarceration_per_100k: 1094, lsc_attys_per_10k_poor: 0.5, exonerations_total: 76, plea_pct: 96, pretrial_pct: 56, juvenile_contact_rate: 42, court_fines_pct: 8.4, death_sentences_per_murder: 1.6, recidivism_3yr_pct: 65, eviction_filing_pct: 12, debt_default_pct: 78, family_pro_se_pct: 78, medicaid_procedural_pct: 65, immigration_pro_se_pct: 75 },
  ME: { pd_caseload: 320, indigent_spend_per_capita: 19.0, incarceration_per_100k: 328, lsc_attys_per_10k_poor: 1.0, exonerations_total: 4, plea_pct: 94, pretrial_pct: 32, juvenile_contact_rate: 14, court_fines_pct: 2.0, death_sentences_per_murder: 0, recidivism_3yr_pct: 56, eviction_filing_pct: 5, debt_default_pct: 55, family_pro_se_pct: 65, medicaid_procedural_pct: 22, immigration_pro_se_pct: 55 },
  MD: { pd_caseload: 360, indigent_spend_per_capita: 22.0, incarceration_per_100k: 482, lsc_attys_per_10k_poor: 1.0, exonerations_total: 39, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 32, court_fines_pct: 3.0, death_sentences_per_murder: 0, recidivism_3yr_pct: 65, eviction_filing_pct: 7, debt_default_pct: 65, family_pro_se_pct: 68, medicaid_procedural_pct: 45, immigration_pro_se_pct: 55 },
  MA: { pd_caseload: 280, indigent_spend_per_capita: 41.0, incarceration_per_100k: 275, lsc_attys_per_10k_poor: 1.4, exonerations_total: 36, plea_pct: 93, pretrial_pct: 45, juvenile_contact_rate: 14, court_fines_pct: 1.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 45, eviction_filing_pct: 4, debt_default_pct: 55, family_pro_se_pct: 60, medicaid_procedural_pct: 40, immigration_pro_se_pct: 50 },
  MI: { pd_caseload: 520, indigent_spend_per_capita: 11.0, incarceration_per_100k: 633, lsc_attys_per_10k_poor: 0.7, exonerations_total: 120, plea_pct: 96, pretrial_pct: 55, juvenile_contact_rate: 26, court_fines_pct: 4.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 64, eviction_filing_pct: 9, debt_default_pct: 70, family_pro_se_pct: 72, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  MN: { pd_caseload: 320, indigent_spend_per_capita: 32.0, incarceration_per_100k: 364, lsc_attys_per_10k_poor: 1.2, exonerations_total: 22, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 18, court_fines_pct: 2.2, death_sentences_per_murder: 0, recidivism_3yr_pct: 52, eviction_filing_pct: 5, debt_default_pct: 65, family_pro_se_pct: 65, medicaid_procedural_pct: 35, immigration_pro_se_pct: 55 },
  MS: { pd_caseload: 660, indigent_spend_per_capita: 4.5, incarceration_per_100k: 1031, lsc_attys_per_10k_poor: 0.4, exonerations_total: 25, plea_pct: 96, pretrial_pct: 64, juvenile_contact_rate: 48, court_fines_pct: 9.6, death_sentences_per_murder: 2.0, recidivism_3yr_pct: 76, eviction_filing_pct: 13, debt_default_pct: 80, family_pro_se_pct: 80, medicaid_procedural_pct: 75, immigration_pro_se_pct: 75 },
  MO: { pd_caseload: 480, indigent_spend_per_capita: 8.5, incarceration_per_100k: 791, lsc_attys_per_10k_poor: 0.6, exonerations_total: 36, plea_pct: 96, pretrial_pct: 55, juvenile_contact_rate: 32, court_fines_pct: 11.4, death_sentences_per_murder: 1.4, recidivism_3yr_pct: 71, eviction_filing_pct: 9, debt_default_pct: 80, family_pro_se_pct: 72, medicaid_procedural_pct: 70, immigration_pro_se_pct: 65 },
  MT: { pd_caseload: 380, indigent_spend_per_capita: 18.0, incarceration_per_100k: 583, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 94, pretrial_pct: 65, juvenile_contact_rate: 26, court_fines_pct: 3.4, death_sentences_per_murder: 0.6, recidivism_3yr_pct: 60, eviction_filing_pct: 6, debt_default_pct: 75, family_pro_se_pct: 72, medicaid_procedural_pct: 86, immigration_pro_se_pct: 65 },
  NE: { pd_caseload: 380, indigent_spend_per_capita: 13.0, incarceration_per_100k: 538, lsc_attys_per_10k_poor: 0.7, exonerations_total: 11, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 28, court_fines_pct: 3.8, death_sentences_per_murder: 0.4, recidivism_3yr_pct: 63, eviction_filing_pct: 9, debt_default_pct: 72, family_pro_se_pct: 70, medicaid_procedural_pct: 55, immigration_pro_se_pct: 60 },
  NV: { pd_caseload: 580, indigent_spend_per_capita: 11.5, incarceration_per_100k: 691, lsc_attys_per_10k_poor: 0.5, exonerations_total: 16, plea_pct: 96, pretrial_pct: 75, juvenile_contact_rate: 26, court_fines_pct: 5.6, death_sentences_per_murder: 2.6, recidivism_3yr_pct: 70, eviction_filing_pct: 11, debt_default_pct: 75, family_pro_se_pct: 78, medicaid_procedural_pct: 93, immigration_pro_se_pct: 65 },
  NH: { pd_caseload: 340, indigent_spend_per_capita: 23.0, incarceration_per_100k: 287, lsc_attys_per_10k_poor: 0.9, exonerations_total: 3, plea_pct: 94, pretrial_pct: 38, juvenile_contact_rate: 14, court_fines_pct: 1.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 48, eviction_filing_pct: 4, debt_default_pct: 60, family_pro_se_pct: 65, medicaid_procedural_pct: 45, immigration_pro_se_pct: 55 },
  NJ: { pd_caseload: 320, indigent_spend_per_capita: 29.0, incarceration_per_100k: 246, lsc_attys_per_10k_poor: 1.2, exonerations_total: 54, plea_pct: 95, pretrial_pct: 28, juvenile_contact_rate: 18, court_fines_pct: 2.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 56, eviction_filing_pct: 4, debt_default_pct: 58, family_pro_se_pct: 65, medicaid_procedural_pct: 50, immigration_pro_se_pct: 50 },
  NM: { pd_caseload: 540, indigent_spend_per_capita: 16.0, incarceration_per_100k: 642, lsc_attys_per_10k_poor: 0.7, exonerations_total: 12, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 30, court_fines_pct: 4.0, death_sentences_per_murder: 0, recidivism_3yr_pct: 70, eviction_filing_pct: 10, debt_default_pct: 82, family_pro_se_pct: 72, medicaid_procedural_pct: 93, immigration_pro_se_pct: 60 },
  NY: { pd_caseload: 320, indigent_spend_per_capita: 36.0, incarceration_per_100k: 314, lsc_attys_per_10k_poor: 1.3, exonerations_total: 365, plea_pct: 94, pretrial_pct: 38, juvenile_contact_rate: 18, court_fines_pct: 2.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 60, eviction_filing_pct: 5, debt_default_pct: 60, family_pro_se_pct: 70, medicaid_procedural_pct: 45, immigration_pro_se_pct: 50 },
  NC: { pd_caseload: 520, indigent_spend_per_capita: 9.0, incarceration_per_100k: 444, lsc_attys_per_10k_poor: 0.6, exonerations_total: 91, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 24, court_fines_pct: 4.0, death_sentences_per_murder: 0.8, recidivism_3yr_pct: 66, eviction_filing_pct: 11, debt_default_pct: 70, family_pro_se_pct: 72, medicaid_procedural_pct: 70, immigration_pro_se_pct: 70 },
  ND: { pd_caseload: 280, indigent_spend_per_capita: 17.0, incarceration_per_100k: 461, lsc_attys_per_10k_poor: 0.8, exonerations_total: 1, plea_pct: 95, pretrial_pct: 50, juvenile_contact_rate: 22, court_fines_pct: 2.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 55, eviction_filing_pct: 7, debt_default_pct: 72, family_pro_se_pct: 70, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  OH: { pd_caseload: 540, indigent_spend_per_capita: 13.0, incarceration_per_100k: 519, lsc_attys_per_10k_poor: 0.7, exonerations_total: 124, plea_pct: 96, pretrial_pct: 50, juvenile_contact_rate: 28, court_fines_pct: 5.4, death_sentences_per_murder: 1.0, recidivism_3yr_pct: 62, eviction_filing_pct: 10, debt_default_pct: 72, family_pro_se_pct: 72, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  OK: { pd_caseload: 620, indigent_spend_per_capita: 7.0, incarceration_per_100k: 1004, lsc_attys_per_10k_poor: 0.5, exonerations_total: 47, plea_pct: 96, pretrial_pct: 65, juvenile_contact_rate: 38, court_fines_pct: 8.0, death_sentences_per_murder: 3.6, recidivism_3yr_pct: 70, eviction_filing_pct: 13, debt_default_pct: 78, family_pro_se_pct: 78, medicaid_procedural_pct: 88, immigration_pro_se_pct: 70 },
  OR: { pd_caseload: 420, indigent_spend_per_capita: 22.0, incarceration_per_100k: 433, lsc_attys_per_10k_poor: 0.9, exonerations_total: 14, plea_pct: 94, pretrial_pct: 60, juvenile_contact_rate: 18, court_fines_pct: 2.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 54, eviction_filing_pct: 7, debt_default_pct: 65, family_pro_se_pct: 70, medicaid_procedural_pct: 38, immigration_pro_se_pct: 55 },
  PA: { pd_caseload: 580, indigent_spend_per_capita: 4.5, incarceration_per_100k: 478, lsc_attys_per_10k_poor: 0.6, exonerations_total: 100, plea_pct: 96, pretrial_pct: 60, juvenile_contact_rate: 26, court_fines_pct: 4.6, death_sentences_per_murder: 0, recidivism_3yr_pct: 64, eviction_filing_pct: 9, debt_default_pct: 72, family_pro_se_pct: 72, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  RI: { pd_caseload: 300, indigent_spend_per_capita: 20.0, incarceration_per_100k: 244, lsc_attys_per_10k_poor: 1.0, exonerations_total: 7, plea_pct: 94, pretrial_pct: 25, juvenile_contact_rate: 16, court_fines_pct: 1.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 50, eviction_filing_pct: 4, debt_default_pct: 60, family_pro_se_pct: 65, medicaid_procedural_pct: 45, immigration_pro_se_pct: 55 },
  SC: { pd_caseload: 560, indigent_spend_per_capita: 6.0, incarceration_per_100k: 559, lsc_attys_per_10k_poor: 0.5, exonerations_total: 13, plea_pct: 96, pretrial_pct: 55, juvenile_contact_rate: 32, court_fines_pct: 5.6, death_sentences_per_murder: 1.4, recidivism_3yr_pct: 67, eviction_filing_pct: 18, debt_default_pct: 75, family_pro_se_pct: 75, medicaid_procedural_pct: 70, immigration_pro_se_pct: 70 },
  SD: { pd_caseload: 320, indigent_spend_per_capita: 14.0, incarceration_per_100k: 757, lsc_attys_per_10k_poor: 0.7, exonerations_total: 1, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 30, court_fines_pct: 3.0, death_sentences_per_murder: 0.8, recidivism_3yr_pct: 65, eviction_filing_pct: 8, debt_default_pct: 75, family_pro_se_pct: 72, medicaid_procedural_pct: 60, immigration_pro_se_pct: 60 },
  TN: { pd_caseload: 540, indigent_spend_per_capita: 9.5, incarceration_per_100k: 740, lsc_attys_per_10k_poor: 0.6, exonerations_total: 33, plea_pct: 96, pretrial_pct: 60, juvenile_contact_rate: 30, court_fines_pct: 5.4, death_sentences_per_murder: 0.8, recidivism_3yr_pct: 67, eviction_filing_pct: 12, debt_default_pct: 75, family_pro_se_pct: 75, medicaid_procedural_pct: 60, immigration_pro_se_pct: 70 },
  TX: { pd_caseload: 620, indigent_spend_per_capita: 8.5, incarceration_per_100k: 769, lsc_attys_per_10k_poor: 0.5, exonerations_total: 488, plea_pct: 96, pretrial_pct: 55, juvenile_contact_rate: 26, court_fines_pct: 6.4, death_sentences_per_murder: 3.2, recidivism_3yr_pct: 62, eviction_filing_pct: 14, debt_default_pct: 79, family_pro_se_pct: 75, medicaid_procedural_pct: 71, immigration_pro_se_pct: 70 },
  UT: { pd_caseload: 320, indigent_spend_per_capita: 12.0, incarceration_per_100k: 380, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 95, pretrial_pct: 50, juvenile_contact_rate: 18, court_fines_pct: 2.8, death_sentences_per_murder: 0.6, recidivism_3yr_pct: 58, eviction_filing_pct: 7, debt_default_pct: 75, family_pro_se_pct: 72, medicaid_procedural_pct: 78, immigration_pro_se_pct: 60 },
  VT: { pd_caseload: 280, indigent_spend_per_capita: 24.0, incarceration_per_100k: 234, lsc_attys_per_10k_poor: 1.1, exonerations_total: 2, plea_pct: 94, pretrial_pct: 32, juvenile_contact_rate: 12, court_fines_pct: 1.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 48, eviction_filing_pct: 3, debt_default_pct: 60, family_pro_se_pct: 60, medicaid_procedural_pct: 35, immigration_pro_se_pct: 55 },
  VA: { pd_caseload: 420, indigent_spend_per_capita: 11.5, incarceration_per_100k: 595, lsc_attys_per_10k_poor: 0.7, exonerations_total: 27, plea_pct: 95, pretrial_pct: 50, juvenile_contact_rate: 24, court_fines_pct: 3.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 60, eviction_filing_pct: 11, debt_default_pct: 70, family_pro_se_pct: 70, medicaid_procedural_pct: 50, immigration_pro_se_pct: 65 },
  WA: { pd_caseload: 360, indigent_spend_per_capita: 17.0, incarceration_per_100k: 388, lsc_attys_per_10k_poor: 0.9, exonerations_total: 30, plea_pct: 95, pretrial_pct: 60, juvenile_contact_rate: 18, court_fines_pct: 2.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 50, eviction_filing_pct: 4, debt_default_pct: 65, family_pro_se_pct: 68, medicaid_procedural_pct: 35, immigration_pro_se_pct: 55 },
  WV: { pd_caseload: 420, indigent_spend_per_capita: 12.5, incarceration_per_100k: 593, lsc_attys_per_10k_poor: 0.7, exonerations_total: 5, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 28, court_fines_pct: 3.4, death_sentences_per_murder: 0, recidivism_3yr_pct: 65, eviction_filing_pct: 9, debt_default_pct: 78, family_pro_se_pct: 72, medicaid_procedural_pct: 82, immigration_pro_se_pct: 60 },
  WI: { pd_caseload: 400, indigent_spend_per_capita: 42.0, incarceration_per_100k: 567, lsc_attys_per_10k_poor: 0.8, exonerations_total: 65, plea_pct: 95, pretrial_pct: 45, juvenile_contact_rate: 22, court_fines_pct: 2.8, death_sentences_per_murder: 0, recidivism_3yr_pct: 55, eviction_filing_pct: 5, debt_default_pct: 70, family_pro_se_pct: 68, medicaid_procedural_pct: 50, immigration_pro_se_pct: 55 },
  WY: { pd_caseload: 300, indigent_spend_per_capita: 22.0, incarceration_per_100k: 614, lsc_attys_per_10k_poor: 0.7, exonerations_total: 2, plea_pct: 95, pretrial_pct: 55, juvenile_contact_rate: 26, court_fines_pct: 3.4, death_sentences_per_murder: 0.4, recidivism_3yr_pct: 60, eviction_filing_pct: 5, debt_default_pct: 72, family_pro_se_pct: 70, medicaid_procedural_pct: 72, immigration_pro_se_pct: 60 },
};

export function metricValue(state: string, metric: string): number | null {
  // The composite Justice Gap Index is computed; everything else reads
  // directly off the per-state record.
  if (metric === "justice_gap_index") {
    return computeJusticeGapIndex(state);
  }
  const s = stateMetrics[state];
  if (!s) return null;
  const key = metric as keyof StateMetrics;
  const v = s[key];
  return typeof v === "number" ? v : null;
}

/**
 * Composite "Justice Gap Index" — rescales each of 11 dimensions to
 * 0–100 (higher = worse access) and averages them. Six are civil, five
 * are criminal — matching the actual ratio of unmet legal need much
 * more closely than the prior six-criminal / one-civil composite did.
 *
 * Civil: lsc_attys_per_10k_poor (inverted), eviction_filing_pct,
 *   debt_default_pct, family_pro_se_pct, medicaid_procedural_pct,
 *   immigration_pro_se_pct.
 * Criminal: pd_caseload, indigent_spend_per_capita (inverted),
 *   incarceration_per_100k, plea_pct, pretrial_pct.
 *
 * This is a heuristic, not a model. The point is to ask: when every
 * dimension fails the same way, what does the map look like?
 */
function computeJusticeGapIndex(state: string): number | null {
  const s = stateMetrics[state];
  if (!s) return null;
  // Civil dimensions — 0 = best, 100 = worst.
  const civilAid = 100 - rescale(s.lsc_attys_per_10k_poor, 0.3, 2.5);
  const eviction = rescale(s.eviction_filing_pct, 3, 20);
  const debt = rescale(s.debt_default_pct, 50, 85);
  const family = rescale(s.family_pro_se_pct, 55, 85);
  const benefits = rescale(s.medicaid_procedural_pct, 20, 93);
  const immig = rescale(s.immigration_pro_se_pct, 45, 75);
  // Criminal dimensions.
  const caseload = rescale(s.pd_caseload, 200, 800);
  const spend = 100 - rescale(s.indigent_spend_per_capita, 4, 60);
  const incarcer = rescale(s.incarceration_per_100k, 200, 1100);
  const plea = rescale(s.plea_pct, 88, 98);
  const pretrial = rescale(s.pretrial_pct, 25, 80);
  return Math.round(
    (civilAid + eviction + debt + family + benefits + immig +
     caseload + spend + incarcer + plea + pretrial) / 11
  );
}

function rescale(v: number, lo: number, hi: number): number {
  return Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
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
export function formatMetric(metric: string, v: number): string {
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
    case "juvenile_contact_rate":
      return `${v.toFixed(0)} per 1,000 children`;
    case "court_fines_pct":
      return `${v.toFixed(1)}% of revenue`;
    case "death_sentences_per_murder":
      return v === 0
        ? "no death penalty / moratorium"
        : `${v.toFixed(1)} per 1,000 murders`;
    case "recidivism_3yr_pct":
      return `${v.toFixed(0)}% rearrested in 3 yrs`;
    case "eviction_filing_pct":
      return `${v.toFixed(0)} filings per 100 renter HH`;
    case "debt_default_pct":
      return `${v.toFixed(0)}% default judgment`;
    case "family_pro_se_pct":
      return `${v.toFixed(0)}% pro se in family court`;
    case "medicaid_procedural_pct":
      return `${v.toFixed(0)}% procedural terminations`;
    case "immigration_pro_se_pct":
      return `${v.toFixed(0)}% without immigration counsel`;
    case "justice_gap_index":
      return `${Math.round(v)} / 100`;
    default:
      return String(v);
  }
}
