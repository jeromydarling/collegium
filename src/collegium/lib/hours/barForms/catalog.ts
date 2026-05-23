/**
 * Bar-form catalog — for each supported jurisdiction, what the official
 * artifact actually is, where the canonical PDF lives, and which export
 * strategy we use to produce the lawyer's submission.
 *
 * Two strategies:
 *
 *   - "official-form" — the bar publishes a fillable PDF. We download it
 *     (once, via scripts/fetch-bar-forms.mjs), load it via pdf-lib, fill
 *     its AcroForm fields with the lawyer's data, flatten, and return.
 *     This output IS the artifact the lawyer files.
 *
 *   - "portal-handoff" — no fillable PDF; reporting goes through a
 *     bar-association web portal. We render a one-page handoff sheet
 *     that mirrors the portal's exact field structure so the lawyer
 *     can transcribe in two minutes. (This is the closest legal-aid
 *     analog to a "summary cover letter," and it's not legally filed.)
 *
 * Catalog is data-only — no rendering logic in this file. The renderers
 * read from it.
 */

import type { JurisdictionCode } from "../types";

export type FormStrategy = "official-form" | "portal-handoff";

export type FormCatalogEntry = {
  jurisdiction: JurisdictionCode;
  strategy: FormStrategy;
  /** Display name of the artifact, as a lawyer would refer to it. */
  artifactName: string;
  /** Rule / citation that the form satisfies. */
  ruleCitation: string;
  /**
   * Where the canonical PDF lives, if applicable. For portal-handoff
   * jurisdictions this is null. The fetch script downloads this URL to
   * `assets/bar-forms/{filename}`.
   */
  sourceUrl: string | null;
  /** Local file path for the downloaded PDF (relative to repo root). */
  localPath: string | null;
  /** Submission method — what the lawyer does with the PDF. */
  submission: string;
  /** Frequency — how often this is filed. */
  frequency: "annual" | "at-bar-admission" | "voluntary-annual";
  /**
   * For portal-handoff jurisdictions: the exact portal URL the lawyer
   * needs to open to file. The handoff sheet links here.
   */
  portalUrl?: string;
  /**
   * For official-form jurisdictions: AcroForm field-name hints. The
   * formFiller looks these up by name and falls back to position-
   * based heuristics if names don't match (since the form's field
   * names aren't documented and may change between revisions).
   */
  fieldHints?: Record<string, string>;
  /** Mandatory? Affects badging on the dashboard. */
  mandatory: boolean;
  /**
   * For multi-instance forms (NY: one per project) — true when each
   * matter generates its own filing artifact rather than one
   * aggregated PDF.
   */
  perMatter?: boolean;
};

export const BAR_FORMS: Record<JurisdictionCode, FormCatalogEntry> = {
  "US-NY": {
    jurisdiction: "US-NY",
    strategy: "official-form",
    artifactName: "Affidavit of Compliance with 22 NYCRR § 520.16",
    ruleCitation: "22 NYCRR § 520.16",
    sourceUrl:
      "https://ww2.nycourts.gov/ATTORNEYS/probono/AppForAdmission_Pro-BonoReq_Fillable.pdf",
    localPath: "assets/bar-forms/us-ny-affidavit.pdf",
    submission:
      "Original printed Affidavit (one per qualifying project) attached to the application for admission filed with the appropriate Appellate Division.",
    frequency: "at-bar-admission",
    mandatory: true,
    perMatter: true,
    fieldHints: {
      applicantName: "Applicant Name",
      lawSchoolGraduation: "Law School Graduation Date",
      mailingAddress: "Mailing Address",
      sponsoringOrganization: "Sponsoring Organization",
      workDescription: "Description of Work",
      startDate: "Service Start Date",
      endDate: "Service End Date",
      totalHours: "Total Qualifying Hours",
      supervisorName: "Supervising Attorney Name",
      supervisorTitle: "Supervisor Title",
      supervisorBarNumber: "Supervisor Bar Number",
      supervisorContact: "Supervisor Contact Info",
    },
  },
  "US-MA": {
    jurisdiction: "US-MA",
    strategy: "official-form",
    artifactName: "SJC Pro Bono Honor Roll Certification (Individual)",
    ruleCitation: "Mass. R. Prof. C. 6.1",
    sourceUrl:
      "https://www.mass.gov/info-details/about-the-pro-bono-honor-roll",
    localPath: "assets/bar-forms/us-ma-honor-roll.pdf",
    submission:
      "Email PDF to mb.sjcprobono@jud.state.ma.us or mail to Deputy Legal Counsel, SJC, John Adams Courthouse. Annual deadline ~Sept 30 for the prior calendar year.",
    frequency: "voluntary-annual",
    mandatory: false,
    fieldHints: {
      attorneyName: "Attorney Name",
      bboNumber: "BBO Number",
      firm: "Firm or Employer",
      mailingAddress: "Mailing Address",
      email: "Email",
      phone: "Phone",
      reportingYear: "Calendar Year",
      totalHours: "Total Hours",
      honorRollLevel: "Honor Roll Level",
    },
  },
  "US-CA": {
    jurisdiction: "US-CA",
    strategy: "portal-handoff",
    artifactName: "Portal Handoff Summary (Cal. Bus. & Prof. § 6073.2)",
    ruleCitation: "Cal. Bus. & Prof. Code § 6073.2",
    sourceUrl: null,
    localPath: null,
    submission:
      "File online via 'My State Bar Profile' → 'Report your Pro Bono Hours' during annual fee payment (deadline March 30). Print this handoff to use as your worksheet — it's not filed.",
    frequency: "annual",
    mandatory: true,
    portalUrl:
      "https://my.calbar.ca.gov/AdminCenter/Login.aspx",
  },
  "US-NJ": {
    jurisdiction: "US-NJ",
    strategy: "official-form",
    artifactName: "Voluntary Pro Bono Service Certification (Madden)",
    ruleCitation: "R. 1:21-12",
    sourceUrl:
      "https://www.njcourts.gov/attorneys/rules-of-court/madden-exemption-based-voluntary-qualifying-pro-bono-service",
    localPath: "assets/bar-forms/us-nj-madden.pdf",
    submission:
      "Email to Probono.Mailbox@NJCourts.Gov. Annual; ≥25 qualifying hours exempt from Madden assignment in the following year.",
    frequency: "voluntary-annual",
    mandatory: false,
    fieldHints: {
      attorneyName: "Attorney Name",
      barId: "NJ Bar ID",
      firm: "Firm / Employer",
      address: "Address",
      reportingYear: "Calendar Year",
      qualifyingHours: "Qualifying Hours",
      organizationName: "Pro Bono Organization",
    },
  },
  "US-MD": {
    jurisdiction: "US-MD",
    strategy: "portal-handoff",
    artifactName: "Portal Handoff Summary (Md. Rule 19-503)",
    ruleCitation: "Md. Rule 19-503",
    sourceUrl: null,
    localPath: null,
    submission:
      "File online via Maryland's Attorney Information System (AIS). Annual; reporting period July 1 – June 30; due Sept 10 each year. Print this handoff to use as your worksheet for the AIS 5-step flow — it's not filed.",
    frequency: "annual",
    mandatory: true,
    portalUrl:
      "https://jportal.mdcourts.gov/aisattorneyportal/security/login.xhtml",
  },
  "US-IL": {
    jurisdiction: "US-IL",
    strategy: "portal-handoff",
    artifactName: "Portal Handoff Summary (Ill. S. Ct. R. 756(f))",
    ruleCitation: "Illinois Supreme Court Rule 756(f)",
    sourceUrl: null,
    localPath: null,
    submission:
      "File through ARDC annual registration. Annual; deadline January 1. Print this handoff to use as your worksheet — it's not filed.",
    frequency: "annual",
    mandatory: true,
    portalUrl: "https://registration.iardc.org",
  },
  "US-DC": {
    jurisdiction: "US-DC",
    strategy: "portal-handoff",
    artifactName: "Capital Pro Bono Honor Roll Handoff",
    ruleCitation: "D.C. R. Prof. C. 6.1",
    sourceUrl: null,
    localPath: null,
    submission:
      "Declare honor-roll level online at capitalprobono.net (voluntary; Jan-Feb window for prior calendar year).",
    frequency: "voluntary-annual",
    mandatory: false,
    portalUrl: "https://www.capitalprobono.net/",
  },
  "US-FL": {
    jurisdiction: "US-FL",
    strategy: "official-form",
    artifactName: "Trust Account Compliance Certificate & Pro Bono Report",
    ruleCitation: "Rule 4-6.1, Rules Regulating The Florida Bar",
    sourceUrl:
      "https://www-media.floridabar.org/uploads/2025/07/Trust-Acct-and-Pro-Bono-form-2025-2026-ADA-RE-1.pdf",
    localPath: "assets/bar-forms/us-fl-trust-probono.pdf",
    submission:
      "Mail or submit with annual fee statement; many attorneys complete electronically through the Florida Bar member portal. Mandatory; failure to report is itself a disciplinary offense.",
    frequency: "annual",
    mandatory: true,
    fieldHints: {
      attorneyName: "Attorney Name",
      flBarNumber: "Florida Bar Number",
      personalHours: "Personal Pro Bono Hours",
      collectiveServices: "Collective Services Description",
      contributionAmount: "Contribution Amount",
      contributionRecipient: "Contribution Recipient",
      signature: "Signature",
      date: "Date",
    },
  },
  "US-TX": {
    jurisdiction: "US-TX",
    strategy: "portal-handoff",
    artifactName: "Texas Annual Pro Bono Reporting Handoff",
    ruleCitation: "Texas Disciplinary Rule 6.01",
    sourceUrl: null,
    localPath: null,
    submission:
      "Report through annual State Bar of Texas attendance/MCLE filing. Voluntary; 50-hour aspirational target.",
    frequency: "voluntary-annual",
    mandatory: false,
    portalUrl: "https://www.texasbar.com",
  },
};

export function catalogFor(jurisdiction: JurisdictionCode): FormCatalogEntry {
  return BAR_FORMS[jurisdiction];
}

export function isOfficialForm(jurisdiction: JurisdictionCode): boolean {
  return BAR_FORMS[jurisdiction].strategy === "official-form";
}

export function allWithOfficialForms(): FormCatalogEntry[] {
  return Object.values(BAR_FORMS).filter((c) => c.strategy === "official-form");
}
