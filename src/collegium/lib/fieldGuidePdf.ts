/**
 * Field Guide pocketbook PDF builder.
 *
 * Compiles a curated subset of the 365-day devotional into a single
 * print-ready manuscript at Lulu's pocket trim. Front matter, body,
 * and back matter (situational + topical + Scripture + author indices)
 * all in one PDF. The user clicks "Generate Field Guide" in the app
 * and gets a Lulu-uploadable PDF.
 *
 * Trim: 4.25 × 6.875 inches (Lulu's standard pocket hardcover trim).
 * Margins (gutter is wider, outside narrower):
 *   - Inside (gutter):  0.625"
 *   - Outside:          0.375"
 *   - Top:              0.625"
 *   - Bottom:           0.75" (room for page number + decorative band)
 * Body type: Times 10pt at 13pt leading (jsPDF's built-in font). Real
 * production will swap to Garamond via an embedded TTF in a follow-on.
 *
 * NOTE: The actual heirloom-grade typesetting will likely happen
 * outside this app (InDesign or LaTeX); this PDF is the "preview /
 * proof-of-shape" artifact, plus a usable bring-along.
 */

import { jsPDF } from "jspdf";
import type { DevotionalDay } from "../content/devotional/types";
import { devotionalDays } from "../content/devotional";
import {
  pocketbookDays,
  pocketbookSections,
  dayTagOverrides,
} from "../content/devotional/curation";
import {
  situationalCategories,
  type SituationalTag,
} from "../content/devotional/situations";
import { prayerForDay } from "../content/devotional/traditionalPrayers";

const W = 4.25;
const H = 6.875;
const M_IN = 0.625;
const M_OUT = 0.375;
const M_TOP = 0.625;
const M_BOT = 0.75;

// Recto pages (odd): inside margin on the LEFT, outside on the RIGHT.
// Verso pages (even): inside margin on the RIGHT, outside on the LEFT.
// We do not flip — for the proof PDF we use a single fixed layout to
// keep complexity down. Lulu accepts non-mirror PDFs.

const TEXT_W = W - M_IN - M_OUT;
const TEXT_TOP = M_TOP;
const TEXT_BOT = H - M_BOT;

const COLOR_INK = [40, 30, 35] as const;
const COLOR_WINE = [108, 28, 48] as const;
const COLOR_SLATE = [110, 100, 105] as const;
const COLOR_GOLD = [165, 130, 70] as const;

/** Effective situational tags for a day (entry tags override the curation map). */
function tagsForDay(entry: DevotionalDay): SituationalTag[] {
  if (entry.situationalTags && entry.situationalTags.length > 0) {
    return entry.situationalTags;
  }
  return dayTagOverrides[entry.day] ?? [];
}

/** Build and return the Field Guide PDF. */
export function buildFieldGuidePdf(): jsPDF {
  const doc = new jsPDF({ unit: "in", format: [W, H] });
  // 1pt of color line under headers, etc. — jsPDF default line width is fine.

  // The selected days, in pocketbook order, with entries resolved.
  const entries: DevotionalDay[] = pocketbookDays
    .map((d) => devotionalDays.find((e) => e.day === d))
    .filter((e): e is DevotionalDay => Boolean(e));

  // ── FRONT MATTER ──────────────────────────────────────────────────
  drawTitlePage(doc);
  doc.addPage();
  drawCopyrightPage(doc);
  doc.addPage();
  drawDedicationPage(doc);
  doc.addPage();
  drawForewordPage(doc);
  doc.addPage();
  drawTableOfContents(doc, entries);
  doc.addPage();

  // ── BODY ──────────────────────────────────────────────────────────
  // Section openers + per-day pages, grouped by pocketbookSections.
  const entriesBySection = new Map<string, DevotionalDay[]>();
  for (const section of pocketbookSections) {
    const [lo, hi] = section.dayRange;
    const sectionEntries = entries.filter(
      (e) => e.day >= lo && e.day <= hi
    );
    if (sectionEntries.length > 0) {
      entriesBySection.set(section.title, sectionEntries);
    }
  }

  for (const section of pocketbookSections) {
    const sectionEntries = entriesBySection.get(section.title);
    if (!sectionEntries || sectionEntries.length === 0) continue;
    drawSectionOpener(doc, section.title, section.latin);
    for (const entry of sectionEntries) {
      doc.addPage();
      drawEntry(doc, entry);
    }
    doc.addPage();
  }

  // ── BACK MATTER ───────────────────────────────────────────────────
  drawSituationalIndex(doc, entries);
  doc.addPage();
  drawScriptureIndex(doc, entries);
  doc.addPage();
  drawAuthorIndex(doc, entries);
  doc.addPage();
  drawColophon(doc);

  // ── PAGE NUMBERS / RUNNING HEADS ──────────────────────────────────
  applyFootersAndHeaders(doc);

  return doc;
}

function drawTitlePage(doc: jsPDF) {
  const cx = W / 2;
  let y = H * 0.32;

  setFont(doc, "italic", 10);
  setColor(doc, COLOR_WINE);
  doc.text("ANNUS ADVOCATI", cx, y, { align: "center" });
  y += 0.35;

  setFont(doc, "bold", 22);
  setColor(doc, COLOR_INK);
  doc.text("The Lawyer's", cx, y, { align: "center" });
  y += 0.32;
  doc.text("Field Guide", cx, y, { align: "center" });
  y += 0.5;

  setFont(doc, "italic", 11);
  setColor(doc, COLOR_SLATE);
  doc.text("Selected Meditations", cx, y, { align: "center" });
  y += 0.18;
  doc.text("for the Working Advocate", cx, y, { align: "center" });

  // Bottom mark
  setFont(doc, "italic", 9);
  setColor(doc, COLOR_WINE);
  doc.text("Collegium Editions", cx, H - 1.0, { align: "center" });
}

function drawCopyrightPage(doc: jsPDF) {
  let y = M_TOP + 0.5;
  setFont(doc, "normal", 8.5);
  setColor(doc, COLOR_SLATE);

  const lines = [
    "The Lawyer's Field Guide",
    "Selected Meditations for the Working Advocate",
    "",
    "Collegium Editions",
    "",
    "Scripture quotations are from the Douay-Rheims Bible (1899 edition,",
    "public domain). Excerpts from public-domain works including the",
    "Summa Theologiae, the City of God, Cicero's De Officiis, Newman's",
    "Idea of a University, Leo XIII's Rerum Novarum, and others are",
    "attributed at each entry.",
    "",
    "Meditations, prayers, and reflection prompts © Collegium Editions.",
    "",
    "Printed by Lulu Press. Hardcover ISBN to be assigned.",
    "",
    "First edition.",
  ];

  for (const line of lines) {
    doc.text(line, M_IN, y);
    y += 0.18;
  }
}

function drawDedicationPage(doc: jsPDF) {
  const cx = W / 2;
  setFont(doc, "italic", 11);
  setColor(doc, COLOR_INK);
  const lines = [
    "For those who appear",
    "for the unrepresented,",
    "and stand beside them",
    "in the hallways of courts.",
  ];
  let y = H * 0.42;
  for (const line of lines) {
    doc.text(line, cx, y, { align: "center" });
    y += 0.24;
  }
}

function drawForewordPage(doc: jsPDF) {
  let y = M_TOP;
  setFont(doc, "bold", 13);
  setColor(doc, COLOR_WINE);
  doc.text("A NOTE TO THE READER", M_IN, y);
  y += 0.4;

  setFont(doc, "normal", 10);
  setColor(doc, COLOR_INK);
  const text = `This is a field guide, not a daily reader. Its pages are not numbered as days of the year. They are numbered as moments of practice: the eve of trial, the loss after a long case, the eleven-o-clock office, the temptation to leave. \n\nThe back of the book is the index that does the real work. Look in it for the moment you are in, and the page it points to will meet you there. \n\nThe Christian tradition is wide and old, and the Catholic intellectual life is older than the bar that any of us were sworn into. The voices that speak in these pages — Augustine, Aquinas, Cicero, Ambrose, Chrysostom, Thomas More, Leo XIII, John Henry Newman — wrote nothing about the federal sentencing guidelines or the partnership track. But they wrote about everything that the federal sentencing guidelines and the partnership track are made of: justice and mercy, conscience and counsel, the order of authority, the duties of office, the slow weight of a life of service to others. \n\nThe meditations are addressed to a particular reader: a Christian lawyer, often Catholic, who took an oath at the bar in part because the work seemed to be worth a life. Practice has tested that conviction in ways the swearing-in could not have warned about. The book is offered as company, not advice. \n\nKeep it in your briefcase. Read it when you need it.`;

  for (const para of text.split(/\n\n+/)) {
    const lines = doc.splitTextToSize(para, TEXT_W);
    for (const line of lines) {
      y = ensurePage(doc, y, 0.16, M_IN);
      doc.text(line, M_IN, y);
      y += 0.16;
    }
    y += 0.1;
  }
}

function drawTableOfContents(doc: jsPDF, entries: DevotionalDay[]) {
  let y = M_TOP;
  setFont(doc, "bold", 13);
  setColor(doc, COLOR_WINE);
  doc.text("CONTENTS", M_IN, y);
  y += 0.35;

  setFont(doc, "normal", 9.5);
  setColor(doc, COLOR_INK);

  for (const section of pocketbookSections) {
    const sectionEntries = entries.filter(
      (e) => e.day >= section.dayRange[0] && e.day <= section.dayRange[1]
    );
    if (sectionEntries.length === 0) continue;
    setFont(doc, "bold", 10);
    y = ensurePage(doc, y, 0.3, M_IN);
    doc.text(section.title, M_IN, y);
    setFont(doc, "italic", 9);
    setColor(doc, COLOR_WINE);
    doc.text(section.latin, M_IN + TEXT_W, y, { align: "right" });
    setColor(doc, COLOR_INK);
    y += 0.22;
    setFont(doc, "normal", 9);
    for (const e of sectionEntries) {
      y = ensurePage(doc, y, 0.18, M_IN);
      const title = doc.splitTextToSize(e.title, TEXT_W - 0.5)[0];
      doc.text(title, M_IN + 0.18, y);
      y += 0.16;
    }
    y += 0.18;
  }

  y = ensurePage(doc, y, 0.5, M_IN);
  setFont(doc, "bold", 10);
  doc.text("Indices at the back", M_IN, y);
  y += 0.2;
  setFont(doc, "italic", 9);
  setColor(doc, COLOR_SLATE);
  doc.text("By situation · By Scripture · By author · Colophon", M_IN, y);
}

function drawSectionOpener(doc: jsPDF, title: string, latin: string) {
  const cx = W / 2;
  let y = H * 0.40;
  setFont(doc, "italic", 10);
  setColor(doc, COLOR_WINE);
  doc.text(latin.toUpperCase(), cx, y, { align: "center" });
  y += 0.4;

  // Decorative band
  setColor(doc, COLOR_GOLD);
  doc.setLineWidth(0.01);
  doc.line(cx - 0.6, y, cx + 0.6, y);
  y += 0.3;

  setFont(doc, "bold", 18);
  setColor(doc, COLOR_INK);
  doc.text(title, cx, y, { align: "center" });
}

function drawEntry(doc: jsPDF, entry: DevotionalDay) {
  let y = M_TOP;

  // Running mini-title above the title (small caps feel)
  setFont(doc, "italic", 8.5);
  setColor(doc, COLOR_WINE);
  doc.text(
    `${entry.weekArc.toUpperCase()} · ${entry.weekArcLatin}`,
    M_IN,
    y
  );
  y += 0.22;

  // Title
  setFont(doc, "bold", 14);
  setColor(doc, COLOR_INK);
  const titleLines = doc.splitTextToSize(entry.title, TEXT_W);
  for (const line of titleLines) {
    doc.text(line, M_IN, y);
    y += 0.22;
  }
  y += 0.1;

  // Scripture
  drawSectionHeader(doc, "SCRIPTURE", `${entry.scripture.reference} (DR)`, y);
  y += 0.22;
  setFont(doc, "italic", 9.5);
  setColor(doc, COLOR_INK);
  y = writeWrapped(doc, entry.scripture.text, M_IN, y, TEXT_W, 0.15);
  y += 0.14;

  // Excerpt
  y = ensurePage(doc, y, 0.4, M_IN);
  drawSectionHeader(
    doc,
    "FROM THE CANON",
    `${entry.excerpt.author} · ${entry.excerpt.citation}`,
    y
  );
  y += 0.22;
  setFont(doc, "normal", 9.5);
  setColor(doc, COLOR_INK);
  y = writeWrapped(doc, `“${entry.excerpt.text}”`, M_IN, y, TEXT_W, 0.15);
  y += 0.14;

  // Traditional prayer (only if one is mapped to this day)
  const prayer = prayerForDay(entry.day);
  if (prayer) {
    y = ensurePage(doc, y, 0.4, M_IN);
    drawSectionHeader(doc, prayer.title.toUpperCase(), prayer.source, y);
    y += 0.22;
    setFont(doc, "italic", 9.5);
    setColor(doc, COLOR_INK);
    const paras = prayer.text.split(/\n\n+/);
    for (let i = 0; i < paras.length; i++) {
      y = ensurePage(doc, y, 0.2, M_IN);
      y = writeWrapped(doc, paras[i], M_IN + 0.15, y, TEXT_W - 0.3, 0.15);
      y += 0.08;
    }
  }
}

function drawSectionHeader(doc: jsPDF, label: string, sub: string, y: number) {
  setFont(doc, "bold", 8);
  setColor(doc, COLOR_WINE);
  doc.text(label, M_IN, y);
  if (sub) {
    setFont(doc, "italic", 8);
    setColor(doc, COLOR_SLATE);
    doc.text(sub, M_IN + TEXT_W, y, { align: "right" });
  }
  // Decorative rule under the header
  setColor(doc, COLOR_GOLD);
  doc.setLineWidth(0.005);
  doc.line(M_IN, y + 0.05, M_IN + TEXT_W, y + 0.05);
}

function drawSituationalIndex(doc: jsPDF, entries: DevotionalDay[]) {
  let y = M_TOP;
  setFont(doc, "bold", 13);
  setColor(doc, COLOR_WINE);
  doc.text("INDEX BY SITUATION", M_IN, y);
  y += 0.3;
  setFont(doc, "italic", 9);
  setColor(doc, COLOR_SLATE);
  doc.text("Look up the moment you're in.", M_IN, y);
  y += 0.3;

  // Group by category
  for (const cat of situationalCategories) {
    y = ensurePage(doc, y, 0.5, M_IN);
    setFont(doc, "bold", 10);
    setColor(doc, COLOR_INK);
    doc.text(cat.label.toUpperCase(), M_IN, y);
    y += 0.2;
    setFont(doc, "italic", 8.5);
    setColor(doc, COLOR_SLATE);
    const blurbLines = doc.splitTextToSize(cat.blurb, TEXT_W);
    for (const l of blurbLines) {
      doc.text(l, M_IN, y);
      y += 0.14;
    }
    y += 0.1;

    // Per tag in this category
    for (const t of cat.tags) {
      const matches = entries.filter((e) => tagsForDay(e).includes(t.tag));
      if (matches.length === 0) continue;
      y = ensurePage(doc, y, 0.2, M_IN);
      setFont(doc, "normal", 9);
      setColor(doc, COLOR_INK);
      doc.text(t.label, M_IN + 0.12, y);
      // Right-aligned: which entry titles match
      const refs = matches.map((m) => `Day ${m.day}`).join(" · ");
      setFont(doc, "italic", 8.5);
      setColor(doc, COLOR_WINE);
      doc.text(refs, M_IN + TEXT_W, y, { align: "right" });
      y += 0.16;
    }
    y += 0.14;
  }
}

function drawScriptureIndex(doc: jsPDF, entries: DevotionalDay[]) {
  let y = M_TOP;
  setFont(doc, "bold", 13);
  setColor(doc, COLOR_WINE);
  doc.text("INDEX BY SCRIPTURE", M_IN, y);
  y += 0.3;

  // Group by Bible book (use the leading word of the reference).
  const byBook = new Map<string, { ref: string; day: number; title: string }[]>();
  for (const e of entries) {
    const book = e.scripture.reference.split(/[\s:]/)[0];
    const arr = byBook.get(book) ?? [];
    arr.push({ ref: e.scripture.reference, day: e.day, title: e.title });
    byBook.set(book, arr);
  }
  const books = Array.from(byBook.keys()).sort();

  setFont(doc, "normal", 9);
  setColor(doc, COLOR_INK);
  for (const book of books) {
    y = ensurePage(doc, y, 0.3, M_IN);
    setFont(doc, "bold", 9.5);
    setColor(doc, COLOR_WINE);
    doc.text(book, M_IN, y);
    y += 0.16;
    setFont(doc, "normal", 9);
    setColor(doc, COLOR_INK);
    for (const r of byBook.get(book)!) {
      y = ensurePage(doc, y, 0.18, M_IN);
      doc.text(r.ref, M_IN + 0.15, y);
      setFont(doc, "italic", 8.5);
      setColor(doc, COLOR_SLATE);
      doc.text(`Day ${r.day}`, M_IN + TEXT_W, y, { align: "right" });
      setFont(doc, "normal", 9);
      setColor(doc, COLOR_INK);
      y += 0.16;
    }
    y += 0.08;
  }
}

function drawAuthorIndex(doc: jsPDF, entries: DevotionalDay[]) {
  let y = M_TOP;
  setFont(doc, "bold", 13);
  setColor(doc, COLOR_WINE);
  doc.text("INDEX BY AUTHOR", M_IN, y);
  y += 0.3;

  // Group by excerpt author surname.
  const byAuthor = new Map<string, { day: number; citation: string }[]>();
  for (const e of entries) {
    const arr = byAuthor.get(e.excerpt.author) ?? [];
    arr.push({ day: e.day, citation: e.excerpt.citation });
    byAuthor.set(e.excerpt.author, arr);
  }
  const authors = Array.from(byAuthor.keys()).sort();

  for (const a of authors) {
    y = ensurePage(doc, y, 0.3, M_IN);
    setFont(doc, "bold", 9.5);
    setColor(doc, COLOR_WINE);
    doc.text(a, M_IN, y);
    y += 0.16;
    setFont(doc, "normal", 9);
    setColor(doc, COLOR_INK);
    for (const r of byAuthor.get(a)!) {
      y = ensurePage(doc, y, 0.18, M_IN);
      doc.text(r.citation, M_IN + 0.15, y);
      setFont(doc, "italic", 8.5);
      setColor(doc, COLOR_SLATE);
      doc.text(`Day ${r.day}`, M_IN + TEXT_W, y, { align: "right" });
      setFont(doc, "normal", 9);
      setColor(doc, COLOR_INK);
      y += 0.16;
    }
    y += 0.08;
  }
}

function drawColophon(doc: jsPDF) {
  const cx = W / 2;
  let y = H * 0.42;
  setFont(doc, "italic", 9);
  setColor(doc, COLOR_SLATE);
  const lines = [
    "Set in Times Roman for the proof; the production edition is",
    "set in Garamond by Adobe at 10.5/13.5 on a 4¼ by 6⅞ trim,",
    "printed and bound in cloth by Lulu Press.",
    "",
    "Scripture in the Douay-Rheims English (1899). Excerpts in",
    "translations published before 1929 and now in the public domain.",
    "",
    "Collegium Editions",
  ];
  for (const l of lines) {
    doc.text(l, cx, y, { align: "center" });
    y += 0.18;
  }
}

function applyFootersAndHeaders(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  // Skip page numbers on title (1), copyright (2), dedication (3).
  for (let i = 4; i <= pageCount; i++) {
    doc.setPage(i);
    setFont(doc, "italic", 8);
    setColor(doc, COLOR_SLATE);
    doc.text(String(i - 3), W / 2, H - M_BOT * 0.5, { align: "center" });
  }
}

// ── Helpers ────────────────────────────────────────────────────────

function setFont(
  doc: jsPDF,
  style: "normal" | "italic" | "bold" | "bolditalic",
  size: number
) {
  doc.setFont("times", style);
  doc.setFontSize(size);
}

function setColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function writeWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  w: number,
  lineH: number
): number {
  const lines = doc.splitTextToSize(text, w);
  for (const line of lines) {
    y = ensurePage(doc, y, lineH, M_IN);
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

function ensurePage(doc: jsPDF, y: number, need: number, _xRef: number): number {
  if (y + need > TEXT_BOT) {
    doc.addPage();
    return TEXT_TOP;
  }
  return y;
}

/** Convenience: save the Field Guide PDF with a sensible filename. */
export function exportFieldGuidePdf(): void {
  const doc = buildFieldGuidePdf();
  doc.save("the-lawyers-field-guide.pdf");
}
