/**
 * The 365-day devotional for legal vocation.
 *
 * One entry per day of the year. Each entry pairs Scripture (Douay-Rheims)
 * with an excerpt from a public-domain legal/spiritual classic and a
 * meditation written specifically for Christian lawyers, especially those
 * doing pro bono work. Closes with a prayer and a reflection prompt.
 *
 * Print-ready by design: the schema carries everything needed to typeset
 * each day onto a 6×9 trade-paperback page for the Lulu hardcover edition.
 */

export type DevotionalDay = {
  /** 1–365 (no Feb 29 — leap year readers re-read day 59). */
  day: number;
  /** "MM-DD" — calendar-date label, not used for ordering. */
  date: string;
  /** Week number 1–52; week 53 holds day 365 alone. */
  weekNumber: number;
  /** Arc theme for the week, English short form ("Vocation", "Justice"). */
  weekArc: string;
  /** Arc theme in Latin ("Vocatio", "Iustitia"). */
  weekArcLatin: string;
  /** Day title — what THIS day's meditation lands on. */
  title: string;
  /** Scripture passage (Douay-Rheims). */
  scripture: {
    reference: string;
    text: string;
  };
  /** Excerpt from a legal / spiritual classic. */
  excerpt: {
    /** Reference to libraryWorks[].id, or a free-text "author" if not in corpus. */
    workId?: string;
    author: string;
    citation: string;
    text: string;
  };
  /** The meditation — 900–1200 words, prose paragraphs separated by \n\n. */
  meditation: string;
  /** A short closing prayer (2–5 sentences). */
  prayer: string;
  /** A single reflection prompt the reader can sit with. */
  prompt: string;
};

export type WeekArc = {
  weekNumber: number;
  arc: string;
  arcLatin: string;
  /** One-paragraph blurb describing this week's terrain. */
  blurb: string;
};

/**
 * The 52 weekly arcs that structure the year. These are the rails the
 * daily meditations run on — each week sits with one virtue, vice, or
 * vocational question.
 */
export const weekArcs: WeekArc[] = [
  {
    weekNumber: 1,
    arc: "Vocation",
    arcLatin: "Vocatio",
    blurb:
      "Why am I a lawyer? The week opens the year with the question that should reopen every year.",
  },
  {
    weekNumber: 2,
    arc: "Justice",
    arcLatin: "Iustitia",
    blurb:
      "Justice itself — not as outcome but as the constant and perpetual will to render each their due.",
  },
  {
    weekNumber: 3,
    arc: "Equity",
    arcLatin: "Aequitas",
    blurb:
      "Where the rule fails the case. The lawyer's particular charism of remembering what the statute forgot.",
  },
  {
    weekNumber: 4,
    arc: "Conscience",
    arcLatin: "Conscientia",
    blurb:
      "Thomas More on counsel given against conscience. The advocate as the soul's last witness.",
  },
  {
    weekNumber: 5,
    arc: "The Poor",
    arcLatin: "Pauperes",
    blurb:
      "The unrepresented — those who would lose by default if the lawyer did not appear. The week the gospel reads us.",
  },
  {
    weekNumber: 6,
    arc: "Authority",
    arcLatin: "Auctoritas",
    blurb:
      "What legitimates a command? When obedience is virtue and when it is complicity.",
  },
  {
    weekNumber: 7,
    arc: "Mercy",
    arcLatin: "Misericordia",
    blurb:
      "Aquinas: mercy is the fulfillment of justice, not its suspension. A week with the lawyer's hardest virtue.",
  },
  {
    weekNumber: 8,
    arc: "Truth",
    arcLatin: "Veritas",
    blurb:
      "Witness in a profession structured around persuasion. When honesty costs the brief.",
  },
  {
    weekNumber: 9,
    arc: "Counsel",
    arcLatin: "Consilium",
    blurb:
      "The discipline of speaking the hard word to a client who came for permission, not advice.",
  },
  {
    weekNumber: 10,
    arc: "Office",
    arcLatin: "Officium",
    blurb:
      "The duties of the advocate's office — what your name on the bar roll obliges you to.",
  },
  {
    weekNumber: 11,
    arc: "Common Good",
    arcLatin: "Bonum commune",
    blurb:
      "The horizon beyond the client. The lawyer as steward of a civic order, not only a hired mind.",
  },
  {
    weekNumber: 12,
    arc: "Subsidiarity",
    arcLatin: "Subsidiaritas",
    blurb:
      "The principle that decisions belong where the life is. Pius XI on what the higher community owes the lower.",
  },
  {
    weekNumber: 13,
    arc: "Christ the Advocate",
    arcLatin: "Christus Advocatus",
    blurb:
      "The High Priest who pleads for us. The lawyer's pattern: not the prosecutor, but the one who stands beside.",
  },
];
