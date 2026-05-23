/**
 * AcroForm-PDF filler for jurisdictions that publish a fillable official
 * form (NY, MA, NJ-Madden, FL).
 *
 * Flow:
 *   1. Caller passes the jurisdiction + the BarReportSummary + AttorneyHeader
 *   2. We load the official PDF from `assets/bar-forms/{filename}` (the
 *      fetch-bar-forms.mjs script downloaded it earlier)
 *   3. We map the lawyer's data into the AcroForm fields using fieldHints
 *      (fuzzy name match — fields don't always have stable IDs across
 *      revisions)
 *   4. We flatten the form so the output is a non-editable PDF the
 *      lawyer prints, signs, and files
 *
 * Field-name matching strategy:
 *   - Look for the catalog hint string in any field name (case-insensitive)
 *   - Fall back to common-keyword scan (e.g. any field name containing
 *     "name" gets the attorney name for whichever field hasn't been filled
 *     yet)
 *   - If we can't confidently fill a field, we leave it blank (better
 *     unfilled than mis-filled — the lawyer will catch and complete)
 */

import { PDFDocument, PDFTextField, type PDFForm } from "pdf-lib";
import type { BarReportSummary, JurisdictionCode } from "../types";
import type { AttorneyHeader } from "../barExport";
import { catalogFor } from "./catalog";

interface FillContext {
  jurisdiction: JurisdictionCode;
  summary: BarReportSummary;
  attorney: AttorneyHeader;
  /** Optional per-matter context — required for NY (one affidavit per project). */
  perMatter?: { matterId: string; goal: string; hours: number; closed: boolean };
}

export interface FillResult {
  ok: true;
  pdfBytes: Uint8Array;
  filename: string;
  /** Field names we successfully filled — for the audit log. */
  fieldsfilled: string[];
  /** Field names we could not confidently fill. */
  fieldsSkipped: string[];
}

export interface FillError {
  ok: false;
  reason:
    | "form-not-downloaded"
    | "form-parse-failed"
    | "no-acroform"
    | "jurisdiction-not-fillable";
  message: string;
}

export type FillResponse = FillResult | FillError;

/**
 * Fill the official form for a jurisdiction. Returns the filled PDF as
 * bytes ready for download / display.
 */
export async function fillOfficialForm(ctx: FillContext): Promise<FillResponse> {
  const catalog = catalogFor(ctx.jurisdiction);
  if (catalog.strategy !== "official-form") {
    return {
      ok: false,
      reason: "jurisdiction-not-fillable",
      message: `${catalog.artifactName} is portal-handoff, not a fillable PDF.`,
    };
  }
  if (!catalog.localPath) {
    return {
      ok: false,
      reason: "form-not-downloaded",
      message:
        "Official PDF not present in repo. Run `npm run forms:fetch` (or the CI workflow) to download it.",
    };
  }

  // Fetch the PDF bytes. In the browser this hits the dev server (Vite
  // serves files under `/`); in Node it'd be filesystem access (handled
  // by the CI test path, not used here).
  let pdfBytes: ArrayBuffer;
  try {
    const response = await fetch(`/${catalog.localPath}`);
    if (!response.ok) {
      return {
        ok: false,
        reason: "form-not-downloaded",
        message: `Failed to load ${catalog.localPath}: HTTP ${response.status}`,
      };
    }
    pdfBytes = await response.arrayBuffer();
  } catch (err) {
    return {
      ok: false,
      reason: "form-not-downloaded",
      message: err instanceof Error ? err.message : "Failed to load PDF",
    };
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(pdfBytes);
  } catch (err) {
    return {
      ok: false,
      reason: "form-parse-failed",
      message: err instanceof Error ? err.message : "PDF parse failed",
    };
  }

  let form: PDFForm;
  try {
    form = doc.getForm();
  } catch {
    return {
      ok: false,
      reason: "no-acroform",
      message: "PDF has no AcroForm — can't fill programmatically.",
    };
  }

  const fields = form.getFields();
  if (fields.length === 0) {
    return {
      ok: false,
      reason: "no-acroform",
      message: "PDF has no fillable fields.",
    };
  }

  const values = buildFieldValues(ctx);
  const filled: string[] = [];
  const skipped: string[] = [];

  for (const field of fields) {
    const name = field.getName();
    const value = resolveFieldValue(name, values, catalog.fieldHints ?? {});
    if (value === undefined) {
      skipped.push(name);
      continue;
    }
    try {
      if (field instanceof PDFTextField) {
        field.setText(value);
        filled.push(name);
      } else {
        // Checkboxes, dropdowns — skip for now; the lawyer fills these.
        skipped.push(name);
      }
    } catch {
      skipped.push(name);
    }
  }

  // Flatten so the output is non-editable. Production may want to leave
  // editable so the lawyer can correct typos before printing — flagged
  // for follow-up.
  form.flatten();

  const out = await doc.save();
  const filename = filenameFor(ctx);
  return { ok: true, pdfBytes: out, filename, fieldsfilled: filled, fieldsSkipped: skipped };
}

/**
 * Build a dictionary of "what the lawyer would type into this field"
 * keyed by semantic field names (matching catalog hints).
 */
function buildFieldValues(ctx: FillContext): Record<string, string> {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return {
    // Common
    attorneyName: ctx.attorney.name,
    applicantName: ctx.attorney.name,
    name: ctx.attorney.name,
    bboNumber: ctx.summary.barNumber ?? "",
    barNumber: ctx.summary.barNumber ?? "",
    flBarNumber: ctx.summary.barNumber ?? "",
    barId: ctx.summary.barNumber ?? "",
    firm: ctx.attorney.firmOrClinic ?? "",
    firmOrClinic: ctx.attorney.firmOrClinic ?? "",
    mailingAddress: ctx.attorney.address ?? "",
    address: ctx.attorney.address ?? "",
    reportingYear: String(ctx.summary.reportingYear),
    totalHours: ctx.summary.totalHours.toFixed(2),
    personalHours: ctx.summary.totalHours.toFixed(2),
    qualifyingHours: ctx.summary.totalHours.toFixed(2),
    date: today,
    signature: "",
    // Honor-roll level for MA
    honorRollLevel:
      ctx.summary.totalHours >= 100
        ? "High Honor Roll"
        : ctx.summary.totalHours >= 50
        ? "Honor Roll"
        : "",
    // FL collective / contribution — leaves blank by default; lawyer fills
    collectiveServices: "",
    contributionAmount: "",
    contributionRecipient: "",
    // NY per-matter
    sponsoringOrganization: ctx.attorney.firmOrClinic ?? "",
    workDescription: ctx.perMatter?.goal ?? "",
    startDate: "",
    endDate: "",
    supervisorName: "",
    supervisorTitle: "",
    supervisorBarNumber: "",
    supervisorContact: "",
    lawSchoolGraduation: "",
    organizationName: ctx.attorney.firmOrClinic ?? "",
  };
}

/**
 * Resolve which value to put into a given AcroForm field by name. Tries:
 *   1. Exact catalog hint match (case-insensitive substring)
 *   2. Common-keyword fallback (any field with "name" in it gets attorney
 *      name, etc.)
 */
function resolveFieldValue(
  fieldName: string,
  values: Record<string, string>,
  hints: Record<string, string>
): string | undefined {
  const lower = fieldName.toLowerCase();

  // Try hints first
  for (const [key, hint] of Object.entries(hints)) {
    if (lower.includes(hint.toLowerCase())) {
      const v = values[key];
      if (v !== undefined && v !== "") return v;
    }
  }

  // Common-keyword fallback
  if (lower.includes("name") && !lower.includes("firm") && !lower.includes("organization")) {
    return values.attorneyName;
  }
  if (lower.includes("bar") && lower.includes("number")) return values.bboNumber;
  if (lower.includes("year") || lower.includes("calendar")) return values.reportingYear;
  if (lower.includes("hour")) return values.totalHours;
  if (lower.includes("date") && !lower.includes("school")) return values.date;
  if (lower.includes("firm")) return values.firm;
  if (lower.includes("address") || lower.includes("street")) return values.mailingAddress;

  return undefined;
}

function filenameFor(ctx: FillContext): string {
  const surname = ctx.attorney.name.split(" ").pop() ?? "attorney";
  const safe = surname.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  if (ctx.perMatter) {
    return `${ctx.jurisdiction.toLowerCase()}-${safe}-${ctx.perMatter.matterId}-${ctx.summary.reportingYear}.pdf`;
  }
  return `${ctx.jurisdiction.toLowerCase()}-${safe}-${ctx.summary.reportingYear}.pdf`;
}

/**
 * Download helper — saves the filled PDF directly. Used from the Hours
 * dashboard's "Download official form" button.
 */
export function downloadFilledForm(result: FillResult): void {
  const blob = new Blob([result.pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = result.filename;
  a.click();
  URL.revokeObjectURL(url);
}
