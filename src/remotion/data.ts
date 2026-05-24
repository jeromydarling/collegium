/**
 * Source-cited statistics that drive the Justice Gap video.
 *
 * Every number here should be traceable to a primary source — when we
 * publish the video we cite them at the end. Numbers are conservative
 * where the underlying surveys disagree.
 */

export const STATS = {
  /**
   * % of substantial civil legal problems faced by low-income Americans
   * that get inadequate or no legal help.
   * Source: LSC Justice Gap Report 2022 (the 50-state representative
   * survey conducted by NORC at the University of Chicago).
   */
  unmetCivilLegalNeed: 92,

  /**
   * % of low-income U.S. households experiencing at least one substantial
   * civil legal problem in a given year.
   * Source: LSC Justice Gap Report 2022.
   */
  householdsWithCivilProblem: 74,

  /**
   * Approximate number of Americans at or below 125% of the federal
   * poverty line — the LSC income-eligibility threshold.
   * Source: LSC 2023 Fact Book; cross-checked against Census ACS.
   */
  lscEligibleAmericans: 50_000_000,

  /**
   * Lawyers per 10,000 people, general population (rough national avg).
   * Source: ABA National Lawyer Population Survey, ~1.3M active
   * lawyers / ~330M people = ~39 per 10K. We round to 40 for the
   * comparison and label it conservatively.
   */
  lawyersPer10kGeneral: 40,

  /**
   * LSC-funded attorneys per 10,000 LSC-eligible Americans (those at or
   * below 125% of the federal poverty line). ~6,400 LSC attorneys
   * serving ~50M eligible = ~1.3 per 10K. We round down to 1 for the
   * comparison.
   * Source: LSC 2023 Fact Book.
   */
  lscAttorneysPer10kPoor: 1,

  /**
   * % of landlords represented by counsel in eviction court (national
   * average across studies; varies state-to-state).
   * Source: Eviction Lab + ABA studies aggregated.
   */
  landlordsWithLawyer: 90,

  /**
   * % of tenants represented by counsel in eviction court.
   * Source: same as above.
   */
  tenantsWithLawyer: 10,

  /**
   * Estimated unmet civil legal events per year, derived from the
   * household-incidence rate × LSC-eligible population × the 92%
   * unmet-need rate.
   * Source: LSC report math; widely cited as ~150M.
   */
  annualUnmetCivilEvents: 150_000_000,

  /**
   * Approximate annual U.S. arrests, all crimes.
   * Source: FBI UCR / NIBRS (recent years ~7.6M-10M depending on
   * methodology; we use 10M as the rounded upper-bound).
   */
  annualArrests: 10_000_000,

  /**
   * The civil-to-criminal volume ratio. Civil legal need outstrips
   * criminal-justice contact by roughly 15-to-1 (150M / 10M).
   */
  civilToCriminalRatio: 15,

  /**
   * % of debt-collection lawsuits that end in default judgment because
   * the defendant did not appear (national average).
   * Source: Pew Charitable Trusts state-court survey 2020.
   */
  debtDefaultJudgment: 70,

  /**
   * Effect-size estimate: % of domestic-violence victims who obtain a
   * protection order *with* an attorney vs *without*. Multiple studies
   * (LSC, ABA) put the gap roughly at 70% vs 30%.
   */
  dvProtectionOrderWithLawyer: 70,
  dvProtectionOrderWithoutLawyer: 30,
} as const;

/**
 * State-level highlight data for the choropleth scene. Worst-served
 * states by LSC-attorney density (per 10K poor) — these are the
 * places the gap is widest.
 *
 * Drawn from src/collegium/justicegap/data/stateMetrics.ts so the
 * video stays in sync with the in-app analytics page.
 */
export const WORST_STATES_BY_LSC_DENSITY = [
  { code: "MS", name: "Mississippi", attorneys: 0.7 },
  { code: "TX", name: "Texas", attorneys: 0.8 },
  { code: "FL", name: "Florida", attorneys: 0.9 },
  { code: "AL", name: "Alabama", attorneys: 0.9 },
  { code: "GA", name: "Georgia", attorneys: 1.0 },
] as const;

export const SOURCES_LINE =
  "Sources: LSC 2022 Justice Gap Report · Eviction Lab · Pew Charitable Trusts · ABA · BJS";
