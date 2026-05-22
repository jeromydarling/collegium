/**
 * PDF rendering for bar-format pro bono exports.
 *
 * Takes the structured BarReportSummary and produces a print-ready PDF
 * using jsPDF + autotable. The text version (barExport.ts) remains the
 * source of truth for content; this just renders it.
 *
 * Layout choices:
 *  - Letter, 1" margins
 *  - Times New Roman for body (looks like a legal document, not a webapp)
 *  - Bold uppercase header with jurisdiction citation
 *  - Compliance status banner colored by met/not-met
 *  - Matters and category tables via autotable
 *  - Signature block + Collegium attribution footer
 */

import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import type {
  BarReportSummary,
  HoursEntry,
  JurisdictionCode,
} from "./types";
import { CATEGORY_LABEL, SUPPORTED_JURISDICTIONS } from "./types";
import type { FirmRollupResult } from "./barExport";

const COLOR_INK: [number, number, number] = [25, 22, 28];
const COLOR_WINE: [number, number, number] = [128, 26, 49];
const COLOR_SLATE: [number, number, number] = [80, 80, 90];
const COLOR_MUTED: [number, number, number] = [130, 130, 140];
const COLOR_OK: [number, number, number] = [40, 110, 55];
const COLOR_WARN: [number, number, number] = [180, 100, 30];

const FONT_BODY = "times";

interface AttorneyContext {
  firmOrClinic?: string;
  address?: string;
}

export function renderBarReportPdf(
  summary: BarReportSummary,
  context: AttorneyContext = {}
): jsPDF {
  const doc = new jsPDF({ unit: "in", format: "letter" });
  doc.setFont(FONT_BODY, "normal");

  const margin = 1;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header — jurisdiction title
  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_INK);
  doc.text(headerTitle(summary.jurisdiction), pageWidth / 2, y, { align: "center" });
  y += 0.18;

  doc.setFontSize(10);
  doc.setTextColor(...COLOR_WINE);
  doc.text(headerSubtitle(summary.jurisdiction), pageWidth / 2, y, {
    align: "center",
  });
  y += 0.32;

  // Attorney block
  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_INK);
  const attorneyLines = [
    `Attorney: ${summary.attorneyName}`,
    summary.barNumber ? `Bar #: ${summary.barNumber}` : null,
    context.firmOrClinic ? `Firm / Clinic: ${context.firmOrClinic}` : null,
    context.address ? `Address: ${context.address}` : null,
    `Reporting Year: ${summary.reportingYear}`,
  ].filter(Boolean) as string[];
  for (const line of attorneyLines) {
    doc.text(line, margin, y);
    y += 0.2;
  }
  y += 0.1;

  // Compliance banner
  drawComplianceBanner(doc, summary, margin, y, contentWidth);
  y += 0.55;

  // Service by category
  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_INK);
  doc.text("SERVICE BY CATEGORY", margin, y);
  y += 0.15;

  autoTable(doc, {
    startY: y,
    head: [["Category", "Hours", "Matters"]],
    body: summary.byCategory.map((c) => [
      CATEGORY_LABEL[c.category],
      c.hours.toFixed(2),
      String(c.matterCount),
    ] as RowInput),
    theme: "grid",
    headStyles: { fillColor: COLOR_WINE, textColor: 255, font: FONT_BODY, fontStyle: "bold" },
    bodyStyles: { font: FONT_BODY, textColor: COLOR_INK, fontSize: 10 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 3.5 },
      1: { halign: "right", cellWidth: 1.5 },
      2: { halign: "right", cellWidth: 1.5 },
    },
  });
  // After autotable, jsPDF's `lastAutoTable` plugin attaches finalY.
  y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  y += 0.3;

  // Service by matter
  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(11);
  doc.text("SERVICE BY MATTER", margin, y);
  y += 0.15;

  autoTable(doc, {
    startY: y,
    head: [["#", "Matter", "Hours", "Status"]],
    body: summary.matters.map((m, i) => [
      String(i + 1),
      truncate(m.goal, 70),
      m.hours.toFixed(2),
      m.closed ? "Closed" : "Ongoing",
    ] as RowInput),
    theme: "grid",
    headStyles: { fillColor: COLOR_WINE, textColor: 255, font: FONT_BODY, fontStyle: "bold" },
    bodyStyles: { font: FONT_BODY, textColor: COLOR_INK, fontSize: 10 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 0.4, halign: "center" },
      1: { cellWidth: 4.6 },
      2: { halign: "right", cellWidth: 0.9 },
      3: { halign: "center", cellWidth: 0.6 },
    },
  });
  y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  y += 0.3;

  // Certification / signature block
  if (y > 9.4) {
    doc.addPage();
    y = margin;
  }
  doc.setFont(FONT_BODY, "italic");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_SLATE);
  const certText = certificationText(summary.jurisdiction);
  const wrapped = doc.splitTextToSize(certText, contentWidth);
  doc.text(wrapped, margin, y);
  y += wrapped.length * 0.16 + 0.2;

  doc.setFont(FONT_BODY, "normal");
  doc.setTextColor(...COLOR_INK);
  doc.text(`Dated: ${summary.signedDate}`, margin, y);
  y += 0.4;

  doc.line(margin, y, margin + 3, y);
  y += 0.15;
  doc.setFontSize(9);
  doc.text(summary.attorneyName, margin, y);
  if (summary.barNumber) {
    doc.text(`Bar # ${summary.barNumber}`, margin + 3.2, y);
  }

  // Footer attribution on every page
  drawFooter(doc);

  return doc;
}

export function renderFirmRollupPdf(rollup: FirmRollupResult): jsPDF {
  const doc = new jsPDF({ unit: "in", format: "letter" });
  doc.setFont(FONT_BODY, "normal");

  const margin = 1;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(15);
  doc.setTextColor(...COLOR_INK);
  doc.text(rollup.firmName.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 0.22;

  doc.setFontSize(11);
  doc.setTextColor(...COLOR_WINE);
  doc.text(
    `PRO BONO PROGRAM ANNUAL REPORT — ${rollup.jurisdictionName.toUpperCase()}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 0.18;

  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_SLATE);
  doc.text(`Reporting Year: ${rollup.reportingYear}`, pageWidth / 2, y, {
    align: "center",
  });
  y += 0.4;

  // Aggregate KPIs
  const jur = SUPPORTED_JURISDICTIONS.find((j) => j.code === rollup.jurisdiction);
  const threshold = jur?.threshold ?? 0;

  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_INK);
  doc.text("AGGREGATE FIRM CONTRIBUTION", margin, y);
  y += 0.2;

  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(10);
  const kpis: [string, string][] = [
    ["Total attorneys reporting", String(rollup.rows.length)],
    ["Total pro bono hours", rollup.totalHours.toFixed(2)],
    ["Total unique matters", String(rollup.totalMatters)],
  ];
  if (threshold > 0) {
    kpis.push([
      `Attorneys meeting ${threshold}-hour threshold`,
      `${rollup.meetsThresholdCount} of ${rollup.rows.length}`,
    ]);
  }
  for (const [label, value] of kpis) {
    doc.text(label, margin + 0.2, y);
    doc.setFont(FONT_BODY, "bold");
    doc.text(value, margin + contentWidth - 0.2, y, { align: "right" });
    doc.setFont(FONT_BODY, "normal");
    y += 0.2;
  }
  y += 0.15;

  // Per-attorney table
  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(11);
  doc.text("BY ATTORNEY", margin, y);
  y += 0.15;

  autoTable(doc, {
    startY: y,
    head: [["Attorney", "Bar #", "Hours", "Matters", "Status"]],
    body: rollup.rows.map((r) => [
      r.attorneyName,
      r.barNumber ?? "—",
      r.totalHours.toFixed(2),
      String(r.matterCount),
      r.meetsThreshold && threshold > 0
        ? "✓ Meets"
        : threshold > 0
        ? "  Below"
        : "—",
    ] as RowInput),
    theme: "striped",
    headStyles: {
      fillColor: COLOR_WINE,
      textColor: 255,
      font: FONT_BODY,
      fontStyle: "bold",
    },
    bodyStyles: { font: FONT_BODY, textColor: COLOR_INK, fontSize: 10 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 2.5 },
      1: { cellWidth: 1.2 },
      2: { halign: "right", cellWidth: 1 },
      3: { halign: "right", cellWidth: 0.9 },
      4: { cellWidth: 0.9, halign: "center" },
    },
  });
  y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  y += 0.3;

  // Footer
  doc.setFont(FONT_BODY, "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_SLATE);
  const generated = `Generated ${new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} by Collegium Patrocinium for firm-administrator use.`;
  const wrapped = doc.splitTextToSize(generated, contentWidth);
  doc.text(wrapped, margin, y);

  drawFooter(doc);

  return doc;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function drawComplianceBanner(
  doc: jsPDF,
  s: BarReportSummary,
  x: number,
  y: number,
  width: number
): void {
  const met = s.meetsThreshold;
  const color = met ? COLOR_OK : s.threshold > 0 ? COLOR_WARN : COLOR_MUTED;
  doc.setDrawColor(...color);
  doc.setLineWidth(0.015);
  doc.rect(x, y, width, 0.45);

  doc.setFont(FONT_BODY, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...color);

  const label = met
    ? `MEETS ${s.threshold > 0 ? `${s.threshold}-HOUR` : "ASPIRATIONAL"} TARGET`
    : s.threshold > 0
    ? `BELOW ${s.threshold}-HOUR TARGET`
    : "AGGREGATE REPORT";

  doc.text(label, x + 0.15, y + 0.18);

  doc.setFont(FONT_BODY, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_INK);
  doc.text(
    `Total pro bono hours: ${s.totalHours.toFixed(2)}${
      s.threshold > 0 ? ` of ${s.threshold} required` : ""
    }`,
    x + 0.15,
    y + 0.36
  );
}

function drawFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setFont(FONT_BODY, "italic");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(
      "Generated by Collegium Patrocinium · collegium.network",
      w / 2,
      h - 0.35,
      { align: "center" }
    );
    doc.text(`Page ${i} of ${pageCount}`, w - 1, h - 0.35, { align: "right" });
  }
}

function headerTitle(jur: JurisdictionCode): string {
  switch (jur) {
    case "US-NY":
      return "STATE OF NEW YORK · SUPREME COURT, APPELLATE DIVISION";
    case "US-MA":
      return "COMMONWEALTH OF MASSACHUSETTS · BOARD OF BAR OVERSEERS";
    case "US-CA":
      return "THE STATE BAR OF CALIFORNIA";
    case "US-NJ":
      return "STATE OF NEW JERSEY · MADDEN PRO BONO REPORT";
    default: {
      const j = SUPPORTED_JURISDICTIONS.find((x) => x.code === jur);
      return `${j?.name ?? jur} BAR · PRO BONO HOURS REPORT`;
    }
  }
}

function headerSubtitle(jur: JurisdictionCode): string {
  switch (jur) {
    case "US-NY":
      return "Affidavit of Compliance with 22 NYCRR § 520.16";
    case "US-MA":
      return "Pro Bono Annual Report · Mass. R. Prof. C. 6.1";
    case "US-CA":
      return "Pro Bono Self-Report · Bus. & Prof. Code § 6073";
    case "US-NJ":
      return "Madden Pro Bono Service Report · R. 1:21-12";
    default:
      return "Annual Pro Bono Hours Summary";
  }
}

function certificationText(jur: JurisdictionCode): string {
  switch (jur) {
    case "US-NY":
      return "I certify under penalty of perjury that the hours reported above were performed in compliance with 22 NYCRR § 520.16 and that the information is true and accurate to the best of my knowledge.";
    case "US-CA":
      return "Submitted in accordance with the voluntary self-reporting framework under California Business & Professions Code § 6073. All hours reflect uncompensated service to persons of limited means or to qualifying public-interest organizations.";
    case "US-NJ":
      return "Submitted in accordance with R. 1:21-12 (Madden). All hours reflect qualifying pro bono service. Equivalency for assigned-counsel service noted where applicable.";
    case "US-MA":
    default:
      return "Submitted in accordance with the aspirational target of Mass. R. Prof. C. 6.1. All hours reflect uncompensated service to persons of limited means or to qualifying public-interest organizations.";
  }
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

/* ------------------------------------------------------------------ */
/* Public download helpers                                              */
/* ------------------------------------------------------------------ */

export function downloadBarReportPdf(
  summary: BarReportSummary,
  context: AttorneyContext = {},
  filename?: string
): void {
  const doc = renderBarReportPdf(summary, context);
  const fn =
    filename ??
    `pro-bono-${summary.jurisdiction}-${summary.reportingYear}-${summary.attorneyName
      .split(" ")
      .pop()}.pdf`;
  doc.save(fn);
}

export function downloadFirmRollupPdf(
  rollup: FirmRollupResult,
  filename?: string
): void {
  const doc = renderFirmRollupPdf(rollup);
  const fn =
    filename ??
    `firm-pro-bono-${rollup.jurisdiction}-${rollup.reportingYear}-${rollup.firmName
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .slice(0, 30)}.pdf`;
  doc.save(fn);
}

/* unused-import shim — keeps HoursEntry type referenced for tree-shake */
export type _Hours = HoursEntry;
