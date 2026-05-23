/**
 * Bar-forms public API.
 *
 * One entry point: `generateOfficialOutput(jurisdiction, summary, attorney)`
 * picks the right strategy (fill the AcroForm PDF, or render the portal-
 * handoff worksheet) based on the catalog.
 */

import type { BarReportSummary, JurisdictionCode } from "../types";
import type { AttorneyHeader } from "../barExport";
import { catalogFor, type FormCatalogEntry } from "./catalog";
import { fillOfficialForm, downloadFilledForm, type FillResponse } from "./formFiller";
import { renderPortalHandoff, downloadPortalHandoff } from "./portalHandoff";

export type GenerateOutput =
  | { ok: true; kind: "official-form"; result: FillResponse; catalog: FormCatalogEntry }
  | { ok: true; kind: "portal-handoff"; pdf: ReturnType<typeof renderPortalHandoff>; catalog: FormCatalogEntry };

export async function generateOfficialOutput(
  jurisdiction: JurisdictionCode,
  summary: BarReportSummary,
  attorney: AttorneyHeader,
  perMatter?: { matterId: string; goal: string; hours: number; closed: boolean }
): Promise<GenerateOutput> {
  const catalog = catalogFor(jurisdiction);
  if (catalog.strategy === "official-form") {
    const result = await fillOfficialForm({ jurisdiction, summary, attorney, perMatter });
    return { ok: true, kind: "official-form", result, catalog };
  }
  const pdf = renderPortalHandoff(jurisdiction, summary, attorney);
  return { ok: true, kind: "portal-handoff", pdf, catalog };
}

/**
 * One-call download helper for the dashboard's "Download official form" button.
 * Picks the right downloader for the jurisdiction's strategy.
 */
export async function downloadOfficialOutput(
  jurisdiction: JurisdictionCode,
  summary: BarReportSummary,
  attorney: AttorneyHeader,
  perMatter?: { matterId: string; goal: string; hours: number; closed: boolean }
): Promise<{ ok: boolean; reason?: string }> {
  const out = await generateOfficialOutput(jurisdiction, summary, attorney, perMatter);
  if (out.kind === "official-form") {
    if (out.result.ok) {
      downloadFilledForm(out.result);
      return { ok: true };
    }
    return { ok: false, reason: out.result.message };
  }
  // portal-handoff
  downloadPortalHandoff(jurisdiction, summary, attorney);
  return { ok: true };
}

export { catalogFor, BAR_FORMS, isOfficialForm } from "./catalog";
export type { FormCatalogEntry, FormStrategy } from "./catalog";
