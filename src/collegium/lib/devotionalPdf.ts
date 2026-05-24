/**
 * Devotional PDF export — print a single day's entry as a heirloom 6×9
 * hardcover page. The print artifact is meant to feel like a sample
 * chapter of the bound book: serif body, decorative wine + gold
 * section bands, a drop cap on the meditation, a running head and a
 * centered roman-numeralled folio.
 *
 * Trim:    6 × 9 inches (Lulu's standard hardcover trim).
 * Margins: 0.875" outside, 1" inside (gutter), 0.9" top, 1" bottom.
 *          The proof PDF doesn't mirror — Lulu accepts non-mirrored.
 * Body:    Times Roman at 10.5pt with 14pt leading (jsPDF built-in).
 *          The production edition will swap to Adobe Garamond via an
 *          embedded TTF; until then the layout below is faithful to
 *          the typesetting and only the typeface itself differs.
 */

import { jsPDF } from "jspdf";
import type { DevotionalDay } from "../content/devotional/types";
import { prayerForDay } from "../content/devotional/traditionalPrayers";
import { loadLibraryImage, LIBRARY_IMAGE_ASPECT } from "./pdfImage";

const PAGE_W = 6;
const PAGE_H = 9;
const MARGIN_OUT = 0.875;
const MARGIN_IN = 1.0;
const MARGIN_TOP = 0.9;
const MARGIN_BOT = 1.0;
const TEXT_W = PAGE_W - MARGIN_IN - MARGIN_OUT;
const TEXT_TOP = MARGIN_TOP;
const TEXT_BOT = PAGE_H - MARGIN_BOT;

const C_INK = [40, 30, 35] as const;
const C_WINE = [108, 28, 48] as const;
const C_SLATE = [110, 100, 105] as const;
const C_GOLD = [165, 130, 70] as const;

/** Build a heirloom-grade jsPDF for a single devotional day. */
export async function buildDevotionalDayPdf(entry: DevotionalDay): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "in", format: [PAGE_W, PAGE_H] });
  const bgImage = await loadLibraryImage();

  // Faded library photo as the page-1 backdrop (very subtle —
  // the per-day page is not a full title page, just hints at the book's
  // larger architecture)
  drawFadedBackground(doc, bgImage, 0.07);

  // ── Running head (page 1 only — body pages get the cleaner head)
  drawTitlePageHeader(doc, entry);

  // ── Title
  let y = MARGIN_TOP + 0.5;
  setFont(doc, "italic", 9);
  setColor(doc, C_WINE);
  doc.text(
    `${entry.weekArc.toUpperCase()} · ${entry.weekArcLatin}`,
    MARGIN_IN,
    y
  );
  y += 0.32;

  setFont(doc, "bold", 22);
  setColor(doc, C_INK);
  const titleLines = doc.splitTextToSize(entry.title, TEXT_W);
  for (const line of titleLines) {
    doc.text(line, MARGIN_IN, y);
    y += 0.32;
  }

  // Decorative rule beneath the title
  y += 0.05;
  setColor(doc, C_GOLD);
  doc.setLineWidth(0.012);
  doc.line(MARGIN_IN, y, MARGIN_IN + 1.6, y);
  y += 0.4;

  // ── Scripture
  y = drawSectionBand(doc, "SCRIPTURE", `${entry.scripture.reference} (Douay-Rheims)`, y);
  y += 0.08;
  setFont(doc, "italic", 11.5);
  setColor(doc, C_INK);
  y = writeJustified(doc, entry.scripture.text, MARGIN_IN, y, TEXT_W, 0.19);
  y += 0.28;

  // ── Excerpt
  y = ensurePage(doc, y, 0.6);
  y = drawSectionBand(
    doc,
    "FROM THE CANON",
    `${entry.excerpt.author} · ${entry.excerpt.citation}`,
    y
  );
  y += 0.08;
  setFont(doc, "normal", 10.5);
  setColor(doc, C_INK);
  y = writeJustified(doc, `“${entry.excerpt.text}”`, MARGIN_IN, y, TEXT_W, 0.18);
  y += 0.28;

  // ── Traditional prayer (only if one is mapped to this day)
  const prayer = prayerForDay(entry.day);
  if (prayer) {
    y = ensurePage(doc, y, 0.7);
    y += 0.1;
    y = drawSectionBand(doc, prayer.title.toUpperCase(), prayer.source, y);
    y += 0.12;
    setFont(doc, "italic", 10.5);
    setColor(doc, C_INK);
    const paras = prayer.text.split(/\n\n+/);
    for (let i = 0; i < paras.length; i++) {
      y = ensurePage(doc, y, 0.3);
      y = writeJustified(
        doc,
        paras[i],
        MARGIN_IN + 0.2,
        y,
        TEXT_W - 0.4,
        0.18
      );
      y += 0.1;
    }
  }

  // ── Footers + page numbers (skip the first page's centered folio;
  //     it carries the title rule instead)
  applyFooters(doc, entry);

  return doc;
}

function drawTitlePageHeader(doc: jsPDF, entry: DevotionalDay) {
  setFont(doc, "italic", 8);
  setColor(doc, C_WINE);
  doc.text("Annus Advocati · The Lawyer's Year", PAGE_W / 2, 0.55, {
    align: "center",
  });
  setFont(doc, "italic", 8);
  setColor(doc, C_SLATE);
  doc.text(
    `Day ${entry.day} of 365`,
    PAGE_W - MARGIN_OUT,
    0.55,
    { align: "right" }
  );
  doc.text(`Week ${entry.weekNumber}`, MARGIN_IN, 0.55);
  // Decorative rule beneath the running head
  setColor(doc, C_GOLD);
  doc.setLineWidth(0.005);
  doc.line(MARGIN_IN, 0.7, PAGE_W - MARGIN_OUT, 0.7);
}

/** Draw a section band; returns the y at which body content should start. */
function drawSectionBand(
  doc: jsPDF,
  label: string,
  sub: string,
  y: number
): number {
  setFont(doc, "bold", 8.5);
  setColor(doc, C_WINE);
  doc.text(label, MARGIN_IN, y);

  // Hairline gold rule under the label
  setColor(doc, C_GOLD);
  doc.setLineWidth(0.006);
  doc.line(MARGIN_IN, y + 0.06, MARGIN_IN + TEXT_W, y + 0.06);

  // Sub-text wraps on its own line(s) beneath the rule, never beside.
  if (sub) {
    setFont(doc, "italic", 8.5);
    setColor(doc, C_SLATE);
    const subLines = doc.splitTextToSize(sub, TEXT_W);
    let subY = y + 0.18;
    for (const line of subLines) {
      doc.text(line, MARGIN_IN, subY);
      subY += 0.13;
    }
    return subY + 0.06;
  }
  return y + 0.22;
}

/**
 * Drop-cap paragraph — first letter set 2.6× body size, three lines
 * deep. Body text wraps around it on the right.
 */
function drawDropCapParagraph(
  doc: jsPDF,
  paragraph: string,
  x: number,
  startY: number,
  width: number
): number {
  if (paragraph.length === 0) return startY;
  const dropChar = paragraph[0];
  const rest = paragraph.slice(1);

  // Drop cap geometry
  const dropSize = 28;
  const dropH = 0.5; // visual height of the cap in inches (approx)
  const dropW = 0.32; // approx width occupied
  const dropLines = 3;
  const lineH = 0.18;
  const wrapW = width - dropW - 0.05;

  // Render drop cap (Times Bold, wine)
  setFont(doc, "bold", dropSize);
  setColor(doc, C_WINE);
  doc.text(dropChar, x, startY + dropH * 0.85);

  // Render the rest, wrapped at the narrower width for the first
  // `dropLines` lines, then full width.
  setFont(doc, "normal", 10.5);
  setColor(doc, C_INK);

  // Split at narrow width first
  const narrowLines = doc.splitTextToSize(rest, wrapW);
  let lineIdx = 0;
  let y = startY + lineH;

  // First dropLines lines render alongside the drop cap.
  while (lineIdx < dropLines && lineIdx < narrowLines.length) {
    y = ensurePage(doc, y, lineH);
    doc.text(narrowLines[lineIdx], x + dropW + 0.05, y);
    y += lineH;
    lineIdx++;
  }

  if (lineIdx < narrowLines.length) {
    // The remaining narrow-wrapped text needs to be re-wrapped at the
    // full width. Rejoin and split again.
    const remainder = narrowLines.slice(lineIdx).join(" ");
    const wideLines = doc.splitTextToSize(remainder, width);
    for (const line of wideLines) {
      y = ensurePage(doc, y, lineH);
      doc.text(line, x, y);
      y += lineH;
    }
  }

  return y;
}

function writeJustified(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  lineH: number
): number {
  // jsPDF doesn't ship true justification; splitTextToSize plus left-
  // aligned text is good enough for proof typesetting. The bound
  // edition will be justified by the typesetter.
  const lines = doc.splitTextToSize(text, width);
  for (const line of lines) {
    y = ensurePage(doc, y, lineH);
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

function writeJustifiedIndented(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  lineH: number
): number {
  // First-line indent of 0.2" for body paragraphs after the first.
  const indent = 0.2;
  const lines = doc.splitTextToSize(text, width - indent);
  for (let i = 0; i < lines.length; i++) {
    y = ensurePage(doc, y, lineH);
    doc.text(lines[i], x + (i === 0 ? indent : 0), y);
    y += lineH;
  }
  // Re-wrap remaining lines at full width if needed — for the proof we
  // accept the slightly narrower line for readability across the para.
  return y;
}

function ensurePage(doc: jsPDF, y: number, need: number): number {
  if (y + need > TEXT_BOT) {
    doc.addPage();
    return TEXT_TOP;
  }
  return y;
}

function applyFooters(doc: jsPDF, entry: DevotionalDay) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont(doc, "italic", 8);
    setColor(doc, C_SLATE);
    // Centered ornament + folio
    doc.text(
      `❧  ${romanize(i)}  ❧`,
      PAGE_W / 2,
      PAGE_H - 0.55,
      { align: "center" }
    );
    // Title slug, lowered
    setFont(doc, "italic", 7.5);
    setColor(doc, C_WINE);
    doc.text(
      `${entry.weekArc} · Day ${entry.day}`,
      PAGE_W / 2,
      PAGE_H - 0.35,
      { align: "center" }
    );
  }
}

function romanize(n: number): string {
  const m: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of m) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

function setFont(doc: jsPDF, style: "normal" | "italic" | "bold" | "bolditalic", size: number) {
  doc.setFont("times", style);
  doc.setFontSize(size);
}

function setColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

/** Convenience: save the single-day PDF with a sensible filename. */
export async function exportDevotionalDayPdf(entry: DevotionalDay): Promise<void> {
  const doc = await buildDevotionalDayPdf(entry);
  doc.save(`lawyers-year-day-${String(entry.day).padStart(3, "0")}.pdf`);
}

/**
 * Faded library-photo backdrop. No-op if jsPDF's GState is unavailable.
 */
function drawFadedBackground(
  doc: jsPDF,
  bgImage: string | null,
  opacity: number
): void {
  if (!bgImage) return;
  try {
    const docAny = doc as unknown as {
      GState: new (opts: { opacity: number }) => unknown;
      setGState: (gs: unknown) => void;
    };
    const fadedState = new docAny.GState({ opacity });
    const fullState = new docAny.GState({ opacity: 1 });
    docAny.setGState(fadedState);

    const pageAspect = PAGE_W / PAGE_H;
    let drawW: number, drawH: number, dx: number, dy: number;
    if (LIBRARY_IMAGE_ASPECT > pageAspect) {
      drawH = PAGE_H;
      drawW = PAGE_H * LIBRARY_IMAGE_ASPECT;
      dx = (PAGE_W - drawW) / 2;
      dy = 0;
    } else {
      drawW = PAGE_W;
      drawH = PAGE_W / LIBRARY_IMAGE_ASPECT;
      dx = 0;
      dy = (PAGE_H - drawH) / 2;
    }
    doc.addImage(bgImage, "JPEG", dx, dy, drawW, drawH);
    docAny.setGState(fullState);
  } catch {
    /* GState unsupported — skip */
  }
}
