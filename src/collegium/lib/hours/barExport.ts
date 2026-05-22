/**
 * Bar-format pro bono hours export.
 *
 * Generates the plain-text document each state bar wants to see for its
 * pro bono reporting. The format mirrors the state's official form. Output
 * is print-ready and copy-paste-friendly; PDF rendering can be added later
 * via jsPDF or a server-side renderer without changing the data layer.
 *
 * Each jurisdiction has its own quirks — NY's mandatory 50-hour bar-admission
 * affidavit, MA's voluntary annual report, CA's voluntary self-reporting,
 * etc. The export function takes a jurisdiction code, an attorney, and the
 * entries to summarize, and returns both a structured summary and a
 * print-ready text rendering.
 */

import {
  type HoursEntry,
  type BarReportSummary,
  type JurisdictionCode,
  SUPPORTED_JURISDICTIONS,
  CATEGORY_LABEL,
} from "./types";
import { matterGoal } from "./demoEntries";

export interface AttorneyHeader {
  name: string;
  barNumber?: string;
  firmOrClinic?: string;
  address?: string;
}

export interface BarExportRequest {
  jurisdiction: JurisdictionCode;
  attorney: AttorneyHeader;
  reportingYear: number;
  entries: HoursEntry[];
}

export interface BarExportResult {
  summary: BarReportSummary;
  text: string;
}

export function generateBarReport(req: BarExportRequest): BarExportResult {
  const jur = SUPPORTED_JURISDICTIONS.find((j) => j.code === req.jurisdiction);
  if (!jur) throw new Error(`Unsupported jurisdiction: ${req.jurisdiction}`);

  // Filter entries to this jurisdiction + reporting year
  const yearStart = `${req.reportingYear}-01-01`;
  const yearEnd = `${req.reportingYear}-12-31`;
  const relevant = req.entries.filter(
    (e) =>
      e.jurisdiction === req.jurisdiction &&
      e.date >= yearStart &&
      e.date <= yearEnd
  );

  const totalHours = relevant.reduce((s, e) => s + e.hours, 0);

  // Group by matter
  const matterMap = new Map<
    string,
    { matterId: string; goal: string; hours: number; closed: boolean }
  >();
  for (const e of relevant) {
    const row = matterMap.get(e.matterId) ?? {
      matterId: e.matterId,
      goal: matterGoal(e.matterId),
      hours: 0,
      closed: false,
    };
    row.hours += e.hours;
    if (e.matterClosed) row.closed = true;
    matterMap.set(e.matterId, row);
  }
  const matters = [...matterMap.values()].sort((a, b) => b.hours - a.hours);

  // Group by category
  const categoryMap = new Map<
    HoursEntry["category"],
    { matters: Set<string>; hours: number }
  >();
  for (const e of relevant) {
    const c = categoryMap.get(e.category) ?? {
      matters: new Set<string>(),
      hours: 0,
    };
    c.matters.add(e.matterId);
    c.hours += e.hours;
    categoryMap.set(e.category, c);
  }
  const byCategory = [...categoryMap.entries()].map(
    ([category, { matters, hours }]) => ({
      category,
      hours,
      matterCount: matters.size,
    })
  );

  const summary: BarReportSummary = {
    jurisdiction: req.jurisdiction,
    jurisdictionName: jur.name,
    attorneyName: req.attorney.name,
    barNumber: req.attorney.barNumber,
    reportingYear: req.reportingYear,
    totalHours,
    meetsThreshold: jur.threshold === 0 || totalHours >= jur.threshold,
    threshold: jur.threshold,
    byCategory,
    matters,
    signedDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  const text = renderJurisdictionText(req, summary);
  return { summary, text };
}

function renderJurisdictionText(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  switch (req.jurisdiction) {
    case "US-NY":
      return renderNewYork(req, s);
    case "US-MA":
      return renderMassachusetts(req, s);
    case "US-CA":
      return renderCalifornia(req, s);
    case "US-NJ":
      return renderNewJersey(req, s);
    case "US-IL":
    case "US-MD":
    case "US-FL":
    case "US-TX":
    default:
      return renderGeneric(req, s);
  }
}

/* ------------------------------------------------------------------ */
/* New York — Bar Admission 22 NYCRR § 520.16 Form Affidavit            */
/* ------------------------------------------------------------------ */

function renderNewYork(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  const lines: string[] = [];
  lines.push(`STATE OF NEW YORK`);
  lines.push(`SUPREME COURT, APPELLATE DIVISION`);
  lines.push(``);
  lines.push(`AFFIDAVIT OF COMPLIANCE WITH 22 NYCRR § 520.16`);
  lines.push(`(50-HOUR PRO BONO LEGAL SERVICE REQUIREMENT)`);
  lines.push(``);
  lines.push(`Applicant: ${s.attorneyName}`);
  if (req.attorney.firmOrClinic) lines.push(`Firm / Clinic: ${req.attorney.firmOrClinic}`);
  if (req.attorney.address) lines.push(`Address: ${req.attorney.address}`);
  if (s.barNumber) lines.push(`Bar Number: ${s.barNumber}`);
  lines.push(`Reporting Year: ${s.reportingYear}`);
  lines.push(``);
  lines.push(
    `I, ${s.attorneyName}, being duly sworn, depose and say that I have performed law-related pro bono service in compliance with 22 NYCRR § 520.16 as follows:`
  );
  lines.push(``);

  lines.push(`I. TOTAL HOURS PERFORMED`);
  lines.push(``);
  lines.push(`  Total pro bono hours in calendar year ${s.reportingYear}: ${s.totalHours.toFixed(2)}`);
  lines.push(`  Statutory minimum: ${s.threshold} hours`);
  lines.push(
    `  Compliance status: ${s.meetsThreshold ? "MEETS the 50-hour requirement" : "DOES NOT yet meet the 50-hour requirement"}`
  );
  lines.push(``);

  lines.push(`II. SERVICE BY CATEGORY`);
  lines.push(``);
  for (const c of s.byCategory) {
    lines.push(
      `  ${CATEGORY_LABEL[c.category].padEnd(36)} ${c.hours.toFixed(2).padStart(7)} hr  ${c.matterCount} matter${c.matterCount === 1 ? "" : "s"}`
    );
  }
  lines.push(``);

  lines.push(`III. SERVICE BY MATTER`);
  lines.push(``);
  s.matters.forEach((m, i) => {
    lines.push(`  ${i + 1}. ${truncate(m.goal, 70)}`);
    lines.push(
      `       Hours: ${m.hours.toFixed(2).padStart(6)}   Status: ${m.closed ? "Closed" : "Ongoing"}`
    );
  });
  lines.push(``);

  lines.push(`IV. NATURE OF SERVICE`);
  lines.push(``);
  lines.push(
    `All hours reported herein were performed without compensation to a person of limited means, or to a not-for-profit organization, foundation, or governmental entity, in furtherance of one or more of the categories of qualifying service set forth in 22 NYCRR § 520.16(c).`
  );
  lines.push(``);

  lines.push(`V. CERTIFICATION`);
  lines.push(``);
  lines.push(
    `I certify under penalty of perjury that the foregoing is true and accurate to the best of my knowledge.`
  );
  lines.push(``);
  lines.push(`Dated: ${s.signedDate}`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${s.attorneyName}`);
  lines.push(``);
  lines.push(
    `Sworn to before me this _____ day of ____________________, ${s.reportingYear === new Date().getFullYear() ? new Date().getFullYear() : s.reportingYear + 1}.`
  );
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`Notary Public`);
  lines.push(``);
  lines.push(`[GENERATED BY COLLEGIUM PATROCINIUM · ${todayShort()}]`);

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Massachusetts — voluntary BBO pro bono annual report                 */
/* ------------------------------------------------------------------ */

function renderMassachusetts(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  const lines: string[] = [];
  lines.push(`COMMONWEALTH OF MASSACHUSETTS`);
  lines.push(`BOARD OF BAR OVERSEERS — PRO BONO ANNUAL REPORT`);
  lines.push(`(Mass. R. Prof. C. 6.1 — Aspirational 25-Hour Target)`);
  lines.push(``);
  lines.push(`Attorney: ${s.attorneyName}`);
  if (s.barNumber) lines.push(`BBO #: ${s.barNumber}`);
  if (req.attorney.firmOrClinic) lines.push(`Firm / Clinic: ${req.attorney.firmOrClinic}`);
  lines.push(`Reporting Year: ${s.reportingYear}`);
  lines.push(``);

  lines.push(`SUMMARY OF PRO BONO LEGAL SERVICE`);
  lines.push(``);
  lines.push(`  Total pro bono hours: ${s.totalHours.toFixed(2)}`);
  lines.push(`  Aspirational target (Rule 6.1): 25 hours / year`);
  lines.push(
    `  Status: ${s.meetsThreshold ? `MEETS aspirational target (${s.totalHours.toFixed(0)} of 25)` : `Below aspirational target (${s.totalHours.toFixed(0)} of 25)`}`
  );
  lines.push(``);

  lines.push(`SERVICE BY CATEGORY`);
  lines.push(``);
  for (const c of s.byCategory) {
    lines.push(
      `  ${CATEGORY_LABEL[c.category].padEnd(36)} ${c.hours.toFixed(2).padStart(7)} hr  (${c.matterCount} matter${c.matterCount === 1 ? "" : "s"})`
    );
  }
  lines.push(``);

  lines.push(`MATTERS SUMMARIZED`);
  lines.push(``);
  s.matters.forEach((m, i) => {
    lines.push(`  ${(i + 1).toString().padStart(2)}. ${truncate(m.goal, 70)}`);
    lines.push(
      `      ${m.hours.toFixed(2)} hr   ${m.closed ? "Closed" : "Ongoing"}`
    );
  });
  lines.push(``);
  lines.push(
    `Hours above reflect services to persons of limited means or to legal aid, faith-based, or charitable organizations in furtherance of Rule 6.1.`
  );
  lines.push(``);
  lines.push(`Submitted: ${s.signedDate}`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${s.attorneyName}, BBO #${s.barNumber ?? "________"}`);
  lines.push(``);
  lines.push(`[GENERATED BY COLLEGIUM PATROCINIUM · ${todayShort()}]`);

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* California — State Bar Pro Bono Self-Report                          */
/* ------------------------------------------------------------------ */

function renderCalifornia(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  const lines: string[] = [];
  lines.push(`STATE BAR OF CALIFORNIA`);
  lines.push(`PRO BONO SELF-REPORT FORM`);
  lines.push(`(California Business & Professions Code § 6073)`);
  lines.push(``);
  lines.push(`Attorney: ${s.attorneyName}`);
  if (s.barNumber) lines.push(`State Bar #: ${s.barNumber}`);
  if (req.attorney.firmOrClinic) lines.push(`Firm / Clinic: ${req.attorney.firmOrClinic}`);
  lines.push(`Reporting Year: ${s.reportingYear}`);
  lines.push(``);

  lines.push(`PRO BONO HOURS — STATUTORY ASPIRATION`);
  lines.push(``);
  lines.push(`  Total hours: ${s.totalHours.toFixed(2)}`);
  lines.push(`  California aspirational target: 50 hours / year (Bus. & Prof. § 6073)`);
  lines.push(``);

  lines.push(`HOURS BY CATEGORY`);
  lines.push(``);
  for (const c of s.byCategory) {
    lines.push(
      `  ${CATEGORY_LABEL[c.category].padEnd(36)} ${c.hours.toFixed(2).padStart(7)} hr`
    );
  }
  lines.push(``);

  lines.push(`MATTERS — SUMMARY`);
  lines.push(``);
  s.matters.forEach((m, i) => {
    lines.push(
      `  ${(i + 1).toString().padStart(2)}. [${m.hours.toFixed(2)} hr · ${m.closed ? "Closed" : "Open"}] ${truncate(m.goal, 65)}`
    );
  });
  lines.push(``);
  lines.push(`Submitted: ${s.signedDate}`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${s.attorneyName}, Cal. Bar #${s.barNumber ?? "________"}`);
  lines.push(``);
  lines.push(`[GENERATED BY COLLEGIUM PATROCINIUM · ${todayShort()}]`);

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* New Jersey — Madden Pro Bono Service Report                          */
/* ------------------------------------------------------------------ */

function renderNewJersey(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  const lines: string[] = [];
  lines.push(`STATE OF NEW JERSEY`);
  lines.push(`MADDEN PRO BONO SERVICE REPORT`);
  lines.push(`(R. 1:21-12)`);
  lines.push(``);
  lines.push(`Attorney: ${s.attorneyName}`);
  if (s.barNumber) lines.push(`NJ Bar #: ${s.barNumber}`);
  lines.push(`Reporting Year: ${s.reportingYear}`);
  lines.push(``);

  lines.push(`PRO BONO SERVICE PERFORMED`);
  lines.push(``);
  lines.push(`  Total hours: ${s.totalHours.toFixed(2)}`);
  lines.push(`  Madden equivalency threshold: 25 hours assigned cases / yr`);
  lines.push(`  Status: ${s.meetsThreshold ? "MEETS equivalency threshold" : "Below equivalency threshold"}`);
  lines.push(``);

  lines.push(`HOURS BY CATEGORY`);
  lines.push(``);
  for (const c of s.byCategory) {
    lines.push(
      `  ${CATEGORY_LABEL[c.category].padEnd(36)} ${c.hours.toFixed(2).padStart(7)} hr`
    );
  }
  lines.push(``);

  lines.push(`Submitted: ${s.signedDate}`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${s.attorneyName}, NJ Bar #${s.barNumber ?? "________"}`);
  lines.push(``);
  lines.push(`[GENERATED BY COLLEGIUM PATROCINIUM · ${todayShort()}]`);

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Generic — for jurisdictions without a specific form yet              */
/* ------------------------------------------------------------------ */

function renderGeneric(
  req: BarExportRequest,
  s: BarReportSummary
): string {
  const lines: string[] = [];
  lines.push(`PRO BONO HOURS REPORT — ${s.jurisdictionName.toUpperCase()}`);
  lines.push(``);
  lines.push(`Attorney: ${s.attorneyName}`);
  if (s.barNumber) lines.push(`Bar #: ${s.barNumber}`);
  lines.push(`Reporting Year: ${s.reportingYear}`);
  lines.push(``);
  lines.push(`Total hours: ${s.totalHours.toFixed(2)}`);
  if (s.threshold > 0) {
    lines.push(
      `Threshold: ${s.threshold} · ${s.meetsThreshold ? "Meets" : "Below"} threshold`
    );
  }
  lines.push(``);
  lines.push(`BY CATEGORY`);
  for (const c of s.byCategory) {
    lines.push(
      `  ${CATEGORY_LABEL[c.category].padEnd(36)} ${c.hours.toFixed(2).padStart(7)} hr  (${c.matterCount})`
    );
  }
  lines.push(``);
  lines.push(`MATTERS`);
  s.matters.forEach((m, i) => {
    lines.push(
      `  ${i + 1}. [${m.hours.toFixed(2)} hr · ${m.closed ? "Closed" : "Open"}] ${truncate(m.goal, 65)}`
    );
  });
  lines.push(``);
  lines.push(`Submitted ${s.signedDate}`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(s.attorneyName);
  lines.push(``);
  lines.push(`[GENERATED BY COLLEGIUM PATROCINIUM · ${todayShort()}]`);
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Firm-wide rollup — multi-attorney report (the Big Law killer)        */
/* ------------------------------------------------------------------ */

export interface FirmRollupRow {
  attorneyId: string;
  attorneyName: string;
  barNumber?: string;
  totalHours: number;
  matterCount: number;
  meetsThreshold: boolean;
  threshold: number;
  byCategory: { category: HoursEntry["category"]; hours: number }[];
}

export interface FirmRollupResult {
  jurisdiction: JurisdictionCode;
  jurisdictionName: string;
  reportingYear: number;
  firmName: string;
  totalHours: number;
  totalMatters: number;
  attorneyCount: number;
  meetsThresholdCount: number;
  rows: FirmRollupRow[];
  text: string;
}

export interface FirmRollupRequest {
  jurisdiction: JurisdictionCode;
  reportingYear: number;
  firmName: string;
  /** Map of attorneyId → name + bar # for the firm's roster. */
  attorneys: Map<string, { name: string; barNumber?: string }>;
  entries: HoursEntry[];
}

export function generateFirmRollup(req: FirmRollupRequest): FirmRollupResult {
  const jur = SUPPORTED_JURISDICTIONS.find((j) => j.code === req.jurisdiction);
  if (!jur) throw new Error(`Unsupported jurisdiction: ${req.jurisdiction}`);

  const yearStart = `${req.reportingYear}-01-01`;
  const yearEnd = `${req.reportingYear}-12-31`;
  const relevant = req.entries.filter(
    (e) =>
      e.jurisdiction === req.jurisdiction &&
      e.date >= yearStart &&
      e.date <= yearEnd
  );

  const byAttorney = new Map<string, HoursEntry[]>();
  for (const e of relevant) {
    const list = byAttorney.get(e.attorneyId) ?? [];
    list.push(e);
    byAttorney.set(e.attorneyId, list);
  }

  const rows: FirmRollupRow[] = [];
  for (const [attorneyId, entries] of byAttorney) {
    const info = req.attorneys.get(attorneyId) ?? {
      name: attorneyId,
      barNumber: undefined,
    };
    const totalHours = entries.reduce((s, e) => s + e.hours, 0);
    const matterIds = new Set(entries.map((e) => e.matterId));
    const categoryMap = new Map<HoursEntry["category"], number>();
    for (const e of entries) {
      categoryMap.set(
        e.category,
        (categoryMap.get(e.category) ?? 0) + e.hours
      );
    }
    rows.push({
      attorneyId,
      attorneyName: info.name,
      barNumber: info.barNumber,
      totalHours,
      matterCount: matterIds.size,
      meetsThreshold: jur.threshold === 0 || totalHours >= jur.threshold,
      threshold: jur.threshold,
      byCategory: [...categoryMap.entries()].map(([category, hours]) => ({
        category,
        hours,
      })),
    });
  }
  rows.sort((a, b) => b.totalHours - a.totalHours);

  const totalHours = rows.reduce((s, r) => s + r.totalHours, 0);
  const totalMatters = new Set(relevant.map((e) => e.matterId)).size;
  const meetsThresholdCount = rows.filter((r) => r.meetsThreshold).length;

  const text = renderFirmRollupText({
    ...req,
    jurisdiction: req.jurisdiction,
    jurisdictionName: jur.name,
    threshold: jur.threshold,
    totalHours,
    totalMatters,
    meetsThresholdCount,
    rows,
  });

  return {
    jurisdiction: req.jurisdiction,
    jurisdictionName: jur.name,
    reportingYear: req.reportingYear,
    firmName: req.firmName,
    totalHours,
    totalMatters,
    attorneyCount: rows.length,
    meetsThresholdCount,
    rows,
    text,
  };
}

function renderFirmRollupText(args: {
  jurisdictionName: string;
  jurisdiction: JurisdictionCode;
  threshold: number;
  reportingYear: number;
  firmName: string;
  totalHours: number;
  totalMatters: number;
  meetsThresholdCount: number;
  rows: FirmRollupRow[];
}): string {
  const lines: string[] = [];
  lines.push(`${args.firmName.toUpperCase()}`);
  lines.push(`PRO BONO PROGRAM ANNUAL REPORT — ${args.jurisdictionName}`);
  lines.push(`Reporting Year: ${args.reportingYear}`);
  lines.push(``);
  lines.push(`AGGREGATE FIRM CONTRIBUTION`);
  lines.push(``);
  lines.push(
    `  Total attorneys reporting: ${args.rows.length}`
  );
  lines.push(`  Total pro bono hours: ${args.totalHours.toFixed(2)}`);
  lines.push(`  Total unique matters: ${args.totalMatters}`);
  if (args.threshold > 0) {
    lines.push(
      `  Attorneys meeting ${args.threshold}-hour threshold: ${args.meetsThresholdCount} of ${args.rows.length}`
    );
  }
  lines.push(``);

  lines.push(`BY ATTORNEY`);
  lines.push(``);
  lines.push(
    `  ${"Attorney".padEnd(32)}  ${"Bar #".padEnd(10)}  ${"Hours".padStart(8)}  Matters  Status`
  );
  lines.push(`  ` + "-".repeat(78));
  for (const r of args.rows) {
    lines.push(
      `  ${truncate(r.attorneyName, 30).padEnd(32)}  ${(r.barNumber ?? "—").padEnd(10)}  ${r.totalHours.toFixed(2).padStart(8)}  ${r.matterCount.toString().padStart(7)}  ${r.meetsThreshold ? "✓ meets" : "  below"}`
    );
  }
  lines.push(``);
  lines.push(
    `Generated ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} by Collegium Patrocinium for firm-administrator use.`
  );

  return lines.join("\n");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function todayShort(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
