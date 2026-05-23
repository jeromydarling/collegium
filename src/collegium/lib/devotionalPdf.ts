/**
 * Devotional PDF export — print a single day's entry as a 6×9 trade-
 * paperback page, suitable for the Lulu hardcover edition once the year
 * is complete. Uses the same jsPDF dependency that the bar-export
 * module already pulls in, so no bundle cost.
 *
 * Trim size: 6 × 9 inches (the standard Lulu hardcover trim).
 * Margins: 0.75" outside, 1" inside (gutter), 0.75" top, 1" bottom.
 * Body: Garamond-like serif at 10.5pt with 14pt leading.
 */

import { jsPDF } from "jspdf";
import type { DevotionalDay } from "../content/devotional/types";

const PAGE_W = 6;
const PAGE_H = 9;
const MARGIN_OUT = 0.75;
const MARGIN_IN = 1.0; // gutter
const MARGIN_TOP = 0.85;
const MARGIN_BOT = 0.85;
const TEXT_W = PAGE_W - MARGIN_IN - MARGIN_OUT;

/**
 * Build a jsPDF for a single devotional day. Returns the doc rather
 * than saving so callers can either save() or output("blob") for a
 * preview viewer.
 */
export function buildDevotionalDayPdf(entry: DevotionalDay): jsPDF {
  const doc = new jsPDF({ unit: "in", format: [PAGE_W, PAGE_H] });

  let y = MARGIN_TOP;

  // Running header — week + arc, small caps
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.setTextColor(140, 95, 105);
  doc.text(
    `Week ${entry.weekNumber} · ${entry.weekArc} · ${entry.weekArcLatin}`,
    MARGIN_IN,
    0.45
  );
  doc.text(`Day ${entry.day}`, PAGE_W - MARGIN_OUT, 0.45, { align: "right" });

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(40, 30, 35);
  y = MARGIN_TOP;
  const titleLines = doc.splitTextToSize(entry.title, TEXT_W);
  doc.text(titleLines, MARGIN_IN, y);
  y += titleLines.length * 0.28 + 0.25;

  // Scripture
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 28, 48);
  doc.text(
    `SCRIPTURE · ${entry.scripture.reference.toUpperCase()} (DR)`,
    MARGIN_IN,
    y
  );
  y += 0.18;
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(40, 30, 35);
  y = writeParagraph(doc, entry.scripture.text, MARGIN_IN, y, TEXT_W, 0.18);
  y += 0.2;

  // Excerpt
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 28, 48);
  doc.text(
    `FROM THE CANON · ${entry.excerpt.author.toUpperCase()} · ${entry.excerpt.citation.toUpperCase()}`,
    MARGIN_IN,
    y
  );
  y += 0.18;
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(60, 50, 55);
  y = writeParagraph(doc, `"${entry.excerpt.text}"`, MARGIN_IN, y, TEXT_W, 0.17);
  y += 0.2;

  // Meditation — paginates across additional pages as needed
  y = ensurePage(doc, y, 0.6);
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 28, 48);
  doc.text("MEDITATION", MARGIN_IN, y);
  y += 0.18;
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 30, 35);
  const paras = entry.meditation.split(/\n\n+/);
  for (const p of paras) {
    y = ensurePage(doc, y, 0.35);
    y = writeParagraph(doc, p, MARGIN_IN, y, TEXT_W, 0.17);
    y += 0.12;
  }

  // Prayer
  y = ensurePage(doc, y, 0.6);
  y += 0.1;
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 28, 48);
  doc.text("PRAYER", MARGIN_IN, y);
  y += 0.18;
  doc.setFont("times", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 30, 35);
  y = writeParagraph(doc, entry.prayer, MARGIN_IN, y, TEXT_W, 0.17);
  y += 0.2;

  // Prompt
  y = ensurePage(doc, y, 0.5);
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 28, 48);
  doc.text("TO SIT WITH", MARGIN_IN, y);
  y += 0.18;
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 30, 35);
  writeParagraph(doc, entry.prompt, MARGIN_IN, y, TEXT_W, 0.17);

  // Footer — page numbers on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(140, 95, 105);
    doc.text(
      `${i} · The Lawyer's Year`,
      PAGE_W / 2,
      PAGE_H - 0.45,
      { align: "center" }
    );
  }

  return doc;
}

/** Wrap and write a paragraph, returning the new y. */
function writeParagraph(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  lineH: number
): number {
  const lines = doc.splitTextToSize(text, width);
  for (const line of lines) {
    y = ensurePage(doc, y, lineH);
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

/** Add a new page if there isn't room for `need` more inches. */
function ensurePage(doc: jsPDF, y: number, need: number): number {
  if (y + need > PAGE_H - MARGIN_BOT) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return y;
}

/** Convenience: save the single-day PDF with a sensible filename. */
export function exportDevotionalDayPdf(entry: DevotionalDay): void {
  const doc = buildDevotionalDayPdf(entry);
  doc.save(`lawyers-year-day-${String(entry.day).padStart(3, "0")}.pdf`);
}
