/**
 * Devotional manuscript export — produces a single Markdown file
 * containing the entire 365-day devotional (or whatever is seeded so
 * far), ready to hand to a typesetter or run through Pandoc / Vellum /
 * a LaTeX pipeline to produce the bound book.
 *
 * Why Markdown:
 *   - Trivial to round-trip through InDesign tagged text, Vellum, or
 *     a Pandoc → LaTeX pipeline.
 *   - Versionable in git as the source of truth for the print
 *     manuscript.
 *   - The PDF builders in this app are for proof / preview / single-
 *     day handouts; production typesetting happens in a tool with
 *     better typography than jsPDF.
 *
 * Output convention:
 *   - YAML front-matter at the top of the file with book metadata.
 *   - Per-week heading (## Week N — Arc)
 *   - Per-day heading (### Day N · Date · Title)
 *   - Scripture, Excerpt, Meditation, Prayer, Prompt as subsections.
 *   - Decorative breaks ("⁂") between days.
 */

import type { DevotionalDay } from "../content/devotional/types";
import { devotionalDays } from "../content/devotional";
import { weekArcs } from "../content/devotional/types";
import { dayTagOverrides } from "../content/devotional/curation";
import { prayerForDay } from "../content/devotional/traditionalPrayers";

export type ManuscriptKind = "heirloom-year" | "field-guide";

export interface ManuscriptOptions {
  kind: ManuscriptKind;
  /** Days to include, in order. If omitted: all seeded days for "heirloom-year". */
  days?: number[];
  /** Skip front-matter (useful for embedding into a parent doc). */
  skipFrontMatter?: boolean;
}

/** Build a full Markdown manuscript string. */
export function buildManuscript(options: ManuscriptOptions): string {
  const dayList = resolveDays(options);
  const out: string[] = [];

  if (!options.skipFrontMatter) {
    out.push(frontMatter(options.kind, dayList.length));
    out.push("");
  }

  if (options.kind === "heirloom-year") {
    // Group by week
    const byWeek = new Map<number, DevotionalDay[]>();
    for (const d of dayList) {
      const arr = byWeek.get(d.weekNumber) ?? [];
      arr.push(d);
      byWeek.set(d.weekNumber, arr);
    }
    const weekNumbers = Array.from(byWeek.keys()).sort((a, b) => a - b);
    for (const wn of weekNumbers) {
      const arc = weekArcs.find((a) => a.weekNumber === wn);
      if (arc) {
        out.push(weekOpener(arc.weekNumber, arc.arc, arc.arcLatin, arc.blurb));
        out.push("");
      }
      const weekDays = byWeek.get(wn)!;
      for (let i = 0; i < weekDays.length; i++) {
        out.push(renderDay(weekDays[i]));
        if (i < weekDays.length - 1) {
          out.push("");
          out.push("⁂");
          out.push("");
        }
      }
      out.push("");
    }
  } else {
    // field-guide: linear sequence as given
    for (let i = 0; i < dayList.length; i++) {
      out.push(renderDay(dayList[i]));
      if (i < dayList.length - 1) {
        out.push("");
        out.push("⁂");
        out.push("");
      }
    }
  }

  return out.join("\n");
}

function resolveDays(options: ManuscriptOptions): DevotionalDay[] {
  if (options.days && options.days.length > 0) {
    return options.days
      .map((d) => devotionalDays.find((e) => e.day === d))
      .filter((e): e is DevotionalDay => Boolean(e));
  }
  return [...devotionalDays].sort((a, b) => a.day - b.day);
}

function frontMatter(kind: ManuscriptKind, count: number): string {
  const today = new Date().toISOString().slice(0, 10);
  const title =
    kind === "heirloom-year"
      ? "The Lawyer's Year"
      : "The Lawyer's Field Guide";
  const subtitle =
    kind === "heirloom-year"
      ? "A 365-Day Devotional for the Christian Advocate"
      : "Selected Meditations for the Working Advocate";
  const trim =
    kind === "heirloom-year" ? "6 x 9 hardcover" : "4.25 x 6.875 pocket hardcover";

  return [
    "---",
    `title: "${title}"`,
    `subtitle: "${subtitle}"`,
    `series: "Annus Advocati"`,
    `imprint: "Collegium Editions"`,
    `binding: "${trim}"`,
    `entries: ${count}`,
    `manuscript-generated: ${today}`,
    "---",
    "",
    `# ${title}`,
    "",
    `*${subtitle}*`,
    "",
    "---",
    "",
    "## Dedication",
    "",
    kind === "heirloom-year"
      ? "*For those who carry the work of the law as a vocation, and for those who took an oath that has cost them something.*"
      : "*For those who appear for the unrepresented, and stand beside them in the hallways of courts.*",
    "",
    "## A Note to the Reader",
    "",
    kind === "heirloom-year"
      ? `This is a devotional shaped to the working life of a Christian lawyer. Three hundred and sixty-five days, paired Scripture from the Douay-Rheims and passages from the legal-spiritual canon, each closed with a prayer and a question to sit with.

The canon that speaks here is older than any bar that any of us were sworn into: Augustine and Aquinas, Cicero and Ambrose, Chrysostom and Newman, Thomas More writing from the Tower, Leo XIII writing to the workers of the new industrial cities. They wrote nothing about the federal sentencing guidelines or the partnership track. They wrote about everything those things are made of: justice and mercy, conscience and counsel, the order of authority, the duties of office, the weight of a life of service to others.

The book is meant for the desk. Read it slowly. The same day will read differently in March than it did in January, and differently in November than it did in March.`
      : `This is a field guide, not a daily reader. Its pages are not numbered as days of the year. They are arranged as moments of practice: the eve of trial, the loss after a long case, the eleven-o-clock office, the temptation to leave.

The back of the book is the index that does the real work. Look in it for the moment you are in, and the page it points to will meet you there.`,
    "",
    "---",
    "",
  ].join("\n");
}

function weekOpener(
  weekNumber: number,
  arc: string,
  arcLatin: string,
  blurb: string
): string {
  return [
    "",
    "---",
    "",
    `## Week ${weekNumber} — ${arc}`,
    `*${arcLatin}*`,
    "",
    `> ${blurb}`,
    "",
  ].join("\n");
}

function renderDay(entry: DevotionalDay): string {
  const tags =
    entry.situationalTags ?? dayTagOverrides[entry.day] ?? [];
  const tagLine = tags.length > 0 ? `\n*Situations: ${tags.join(", ")}*\n` : "";
  const prayer = prayerForDay(entry.day);

  const sections: string[] = [
    `### Day ${entry.day} · ${entry.date} · ${entry.title}`,
    tagLine,
    "",
    "#### Scripture",
    "",
    `**${entry.scripture.reference}** (Douay-Rheims)`,
    "",
    `> ${escapeQuote(entry.scripture.text)}`,
    "",
    "#### From the Canon",
    "",
    `**${entry.excerpt.author}** — *${entry.excerpt.citation}*`,
    "",
    `> ${escapeQuote(entry.excerpt.text)}`,
  ];

  if (prayer) {
    sections.push(
      "",
      `#### ${prayer.title}`,
      `*${prayer.source}*`,
      "",
      `> ${escapeQuote(prayer.text)}`
    );
  }

  return sections.join("\n");
}

function escapeQuote(text: string): string {
  // Preserve paragraphing inside blockquotes — markdown blockquotes
  // need each line prefixed with "> ".
  return text.replace(/\n\n+/g, "\n>\n> ").replace(/\n/g, "\n> ");
}

/** Browser convenience: trigger a manuscript download. */
export function downloadManuscript(options: ManuscriptOptions): void {
  const md = buildManuscript(options);
  const filename =
    options.kind === "heirloom-year"
      ? "the-lawyers-year-manuscript.md"
      : "the-lawyers-field-guide-manuscript.md";
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
