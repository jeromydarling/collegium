/**
 * Pro bono hours — domain types.
 *
 * An HoursEntry is a single time-log: an attorney spent N hours on a matter
 * on a given date doing a specific activity. The reporting layer groups
 * entries into period-based summaries that match each jurisdiction's
 * pro bono reporting form.
 */

export type HoursActivity =
  | "client-intake"
  | "research"
  | "drafting"
  | "court-appearance"
  | "hearing-prep"
  | "client-counseling"
  | "supervision"
  | "clinic-shift"
  | "training"
  | "other";

export const ACTIVITY_LABEL: Record<HoursActivity, string> = {
  "client-intake": "Client intake",
  research: "Legal research",
  drafting: "Drafting / pleadings",
  "court-appearance": "Court appearance / hearing",
  "hearing-prep": "Hearing preparation",
  "client-counseling": "Client counseling",
  supervision: "Supervising student or junior",
  "clinic-shift": "Clinic shift",
  training: "Training / formation",
  other: "Other",
};

export interface HoursEntry {
  id: string;
  tenantId: string;
  /** Attorney who logged the hours — references a Person id. */
  attorneyId: string;
  /** The matter this rolls up to. References a serviceMatter id. */
  matterId: string;
  /** ISO date YYYY-MM-DD. */
  date: string;
  /** Hours, in 0.25-hour increments. */
  hours: number;
  activity: HoursActivity;
  /** Optional one-line description of the work. */
  description?: string;
  /** Jurisdiction this work is reportable in. ISO 3166-2 subdivision (e.g. "US-NY"). */
  jurisdiction?: string;
  /** Pro-bono category — used by bar-form generators that ask. */
  category:
    | "direct-representation"
    | "limited-scope"
    | "advice-and-counsel"
    | "clinic"
    | "training"
    | "supervision";
  /** Whether the matter was completed in this period. */
  matterClosed?: boolean;
  /** ISO timestamp of when this entry was logged. */
  loggedAt: string;
}

export const CATEGORY_LABEL: Record<HoursEntry["category"], string> = {
  "direct-representation": "Direct representation",
  "limited-scope": "Limited-scope representation",
  "advice-and-counsel": "Advice & counsel",
  clinic: "Clinic / brief-service",
  training: "Training & mentorship",
  supervision: "Supervising student attorney",
};

/** US-state bar-reporting jurisdictions we generate forms for. */
export const SUPPORTED_JURISDICTIONS = [
  { code: "US-NY", name: "New York", threshold: 50, mandatory: true },
  { code: "US-MA", name: "Massachusetts", threshold: 25, mandatory: false },
  { code: "US-CA", name: "California", threshold: 0, mandatory: false },
  { code: "US-NJ", name: "New Jersey", threshold: 50, mandatory: false },
  { code: "US-IL", name: "Illinois", threshold: 0, mandatory: true },
  { code: "US-MD", name: "Maryland", threshold: 50, mandatory: true },
  { code: "US-DC", name: "District of Columbia", threshold: 50, mandatory: false },
  { code: "US-FL", name: "Florida", threshold: 0, mandatory: true },
  { code: "US-TX", name: "Texas", threshold: 50, mandatory: false },
] as const;

export type JurisdictionCode = (typeof SUPPORTED_JURISDICTIONS)[number]["code"];

export interface BarReportSummary {
  jurisdiction: JurisdictionCode;
  jurisdictionName: string;
  attorneyName: string;
  barNumber?: string;
  reportingYear: number;
  totalHours: number;
  meetsThreshold: boolean;
  threshold: number;
  byCategory: { category: HoursEntry["category"]; hours: number; matterCount: number }[];
  matters: { matterId: string; goal: string; hours: number; closed: boolean }[];
  signedDate: string;
}
