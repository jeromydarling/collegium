/**
 * On-site reader content — public-domain sections from the legal/spiritual
 * canon that the library excerpts cite. Each WorkSection is the FULL prose
 * around the excerpt so a reader can read it in context, not just the
 * paraphrased fragment.
 *
 * Text bodies use lightweight HTML (<p>, <em>, <strong>, <blockquote>) so
 * the WorkReader component can render them with proper typography.
 * Everything here is public-domain (pre-1929 translations).
 */

export type WorkSection = {
  /** Stable id, e.g. "summa-i-ii-q90-a4". */
  id: string;
  /** libraryWorks[].id this section belongs to. */
  workId: string;
  /** "Part 1, Treatise on Law, Q. 90 — On the Essence of Law" — what the reader sees in nav. */
  partTitle: string;
  /** "Article 4 — Whether promulgation is essential to a law?" — the section heading. */
  sectionTitle: string;
  /** Short citation used as a tag, e.g. "ST I-II, q.90, a.4". */
  citation: string;
  /** Translator/edition note, e.g. "English Dominican Fathers ed., 1920". */
  translatorNote?: string;
  /** Anchor ids that excerpts can target (the excerpt's text appears around this anchor). */
  excerptAnchors: { excerptId: string; htmlAnchor: string }[];
  /** Reading time, in minutes (computed by hand for the seed). */
  estimatedMinutes: number;
  /** The full prose body — HTML. */
  htmlBody: string;
};

export const workSections: WorkSection[] = [];

/** All sections for a given work, ordered as they appear in the canon. */
export function sectionsForWork(workId: string): WorkSection[] {
  return workSections.filter((s) => s.workId === workId);
}

export function getSection(id: string): WorkSection | undefined {
  return workSections.find((s) => s.id === id);
}

/** Find which section (if any) contains the given library excerpt. */
export function sectionForExcerpt(excerptId: string): WorkSection | undefined {
  return workSections.find((s) =>
    s.excerptAnchors.some((a) => a.excerptId === excerptId)
  );
}
