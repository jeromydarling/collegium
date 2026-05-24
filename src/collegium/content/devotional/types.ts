/**
 * The 365-day devotional for legal vocation.
 *
 * One entry per day of the year. Each entry pairs Scripture (Douay-Rheims)
 * with an excerpt from a public-domain legal/spiritual classic and a
 * meditation written specifically for Christian lawyers, especially those
 * doing pro bono work. Closes with a prayer and a reflection prompt.
 *
 * Print-ready by design: the schema carries everything needed to typeset
 * each day onto a 6×9 trade-paperback page for the heirloom hardcover, and
 * to filter into the Field Guide pocketbook via situational tags.
 */

import type { SituationalTag } from "./situations";
export type { SituationalTag } from "./situations";

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
  /**
   * Optional, deprecated — earlier weeks shipped with LLM-written
   * meditations, prayers, and prompts. The book has since been
   * re-scoped as a curated anthology of Scripture + the public-domain
   * canon, with real traditional Catholic prayers attached only where
   * one naturally belongs (looked up via traditionalPrayers.ts).
   *
   * These optional fields stay on the type so legacy seed entries
   * compile; they are not rendered anywhere in the app or in the
   * production manuscript.
   */
  meditation?: string;
  prayer?: string;
  prompt?: string;
  /**
   * Situations this entry speaks to — drives the Field Guide's
   * situational index. A day may carry 1–3 tags. See `situationalTagCatalog`
   * below for the controlled vocabulary.
   */
  situationalTags?: SituationalTag[];
  /**
   * If set, this entry is selected for the Field Guide pocketbook. The
   * key positions the entry inside the pocketbook ("arc-anchor:vocation"
   * = the strongest vocation entry; "situation:11pm-still-at-office" = the
   * field entry for that moment). Curated by hand.
   */
  pocketbookKey?: string;
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
  {
    weekNumber: 14,
    arc: "Patience",
    arcLatin: "Patientia",
    blurb:
      "The slow case. The deferred ruling. The decade-long appeal. Patience as the lawyer's secret long-form virtue.",
  },
  {
    weekNumber: 15,
    arc: "Memory",
    arcLatin: "Memoria",
    blurb:
      "What you keep: of the case, of the client, of the lost cause. The lawyer as keeper of records that outlast the parties.",
  },
  {
    weekNumber: 16,
    arc: "Friendship",
    arcLatin: "Amicitia",
    blurb:
      "Co-counsel, the colleague you trust, the friend who is also a lawyer. Aristotle and Aquinas on friendship as a near-virtue.",
  },
  {
    weekNumber: 17,
    arc: "Silence",
    arcLatin: "Silentium",
    blurb:
      "What you do not say in chambers, in cross, in the press. The disciplined tongue of the wise advocate.",
  },
  {
    weekNumber: 18,
    arc: "Listening",
    arcLatin: "Auditio",
    blurb:
      "What the client is telling you that they have not said yet. Listening as the first competence.",
  },
  {
    weekNumber: 19,
    arc: "The Witness",
    arcLatin: "Testis",
    blurb:
      "On taking testimony and being one. From the deposition to the martyr.",
  },
  {
    weekNumber: 20,
    arc: "Promises",
    arcLatin: "Promissa",
    blurb:
      "The contract, the covenant, the word given. What it means that the law's bones are made of promises.",
  },
  {
    weekNumber: 21,
    arc: "Oaths",
    arcLatin: "Iuramenta",
    blurb:
      "The oath of office, the swearing-in, the affidavit. What we invoke when we pledge.",
  },
  {
    weekNumber: 22,
    arc: "The Judge",
    arcLatin: "Iudex",
    blurb:
      "The work of judgment — by the bench, by counsel, by the soul. Aquinas on the just judge.",
  },
  {
    weekNumber: 23,
    arc: "Sentencing",
    arcLatin: "Sententia",
    blurb:
      "Where mercy and justice meet a particular person. The hardest moment in criminal practice.",
  },
  {
    weekNumber: 24,
    arc: "Pardon",
    arcLatin: "Indulgentia",
    blurb:
      "On forgiveness — given, received, refused. The lawyer's vocational stake in pardon.",
  },
  {
    weekNumber: 25,
    arc: "Solidarity",
    arcLatin: "Solidaritas",
    blurb:
      "Catholic Social Teaching's other foundational principle. Standing with those whose case is also your own.",
  },
  {
    weekNumber: 26,
    arc: "Mid-Year",
    arcLatin: "Medium Anni",
    blurb:
      "Halfway through the year. A week of review, examination, and renewal of the year's first vow.",
  },
  {
    weekNumber: 27,
    arc: "Sabbath",
    arcLatin: "Sabbatum",
    blurb:
      "Rest as a discipline of vocation. The seventh day, the lawyer's hardest week to take off, and the order of creation it depends on.",
  },
  {
    weekNumber: 28,
    arc: "The Adversary",
    arcLatin: "Adversarius",
    blurb:
      "Opposing counsel as person, not antagonist. What is owed across the bar to those whose case is the reverse of yours.",
  },
  {
    weekNumber: 29,
    arc: "The Library",
    arcLatin: "Bibliotheca",
    blurb:
      "The books that have formed an advocate. Newman, Aquinas, the long shelf the practice rests on.",
  },
  {
    weekNumber: 30,
    arc: "Place",
    arcLatin: "Statio",
    blurb:
      "The physical office, the desk, the chair, the windowsill — the place where the work is done.",
  },
  {
    weekNumber: 31,
    arc: "The Tongue",
    arcLatin: "Lingua",
    blurb:
      "James on the tongue that sets a forest on fire. Speech as the lawyer's instrument and the lawyer's danger.",
  },
  {
    weekNumber: 32,
    arc: "The Eye",
    arcLatin: "Oculus",
    blurb:
      "What we look at, and what we look away from. Attention as a moral act.",
  },
  {
    weekNumber: 33,
    arc: "Trial",
    arcLatin: "Iudicium",
    blurb:
      "The week of trial itself — the days before, the morning of, the cross, the close, the verdict.",
  },
  {
    weekNumber: 34,
    arc: "Cross-Examination",
    arcLatin: "Interrogatio",
    blurb:
      "The duty in questioning. Wigmore's engine, the witness in fear, the truth that arrives only in the silence after.",
  },
  {
    weekNumber: 35,
    arc: "The Brief",
    arcLatin: "Memoriale",
    blurb:
      "Written advocacy as a moral artifact. The brief that lasts beyond the case.",
  },
  {
    weekNumber: 36,
    arc: "The Settlement",
    arcLatin: "Compositio",
    blurb:
      "Resolution outside the courtroom. Composition as the older, slower word for peace between parties.",
  },
  {
    weekNumber: 37,
    arc: "The Appeal",
    arcLatin: "Appellatio",
    blurb:
      "The higher court, the deeper question. The appeal as the lawyer's return to first principles.",
  },
  {
    weekNumber: 38,
    arc: "Wonder",
    arcLatin: "Admiratio",
    blurb:
      "The lawyer's lost capacity for awe. Aquinas on wonder as the beginning of wisdom.",
  },
  {
    weekNumber: 39,
    arc: "Gratitude",
    arcLatin: "Gratitudo",
    blurb:
      "The discipline of the grateful advocate. Three-quarters of a year now traveled.",
  },
  {
    weekNumber: 40,
    arc: "The Stranger",
    arcLatin: "Peregrinus",
    blurb:
      "Hospitality to the foreigner — the immigration consultation, the asylum client, the stranger Levitical law was written to protect.",
  },
  {
    weekNumber: 41,
    arc: "Widow and Orphan",
    arcLatin: "Vidua et Orphanus",
    blurb:
      "The biblical category the Ivo Collect names. The constituency the law was supposed to be for.",
  },
  {
    weekNumber: 42,
    arc: "The Old Lawyer",
    arcLatin: "Senex",
    blurb:
      "The late-career advocate. What the years have taught. What they have failed to teach.",
  },
  {
    weekNumber: 43,
    arc: "The Young Lawyer",
    arcLatin: "Iuvenis",
    blurb:
      "The new admittee — fear, hubris, the first appearance. The shape the practice takes before it has been tested.",
  },
  {
    weekNumber: 44,
    arc: "Mentorship",
    arcLatin: "Tirocinium",
    blurb:
      "Forming the next generation. The mentor's care, the protege's slow becoming.",
  },
  {
    weekNumber: 45,
    arc: "The Bench",
    arcLatin: "Sedes",
    blurb:
      "The move from bar to bench. Sitting in judgment as a vocation, not a promotion.",
  },
  {
    weekNumber: 46,
    arc: "Money",
    arcLatin: "Pecunia",
    blurb:
      "The fee, the retainer, the bill. The lawyer's compensation as moral object — neither shame nor sanctity.",
  },
  {
    weekNumber: 47,
    arc: "Stewardship",
    arcLatin: "Dispensatio",
    blurb:
      "The lawyer as steward — of the client's matter, of the law's order, of the soul's own time.",
  },
  {
    weekNumber: 48,
    arc: "Death",
    arcLatin: "Mors",
    blurb:
      "The estate plan, the deathbed, the will, the lawyer at end-of-life. The week All Souls falls in.",
  },
  {
    weekNumber: 49,
    arc: "Hope",
    arcLatin: "Spes",
    blurb:
      "The theological virtue. The Advent of the year of practice that has nearly ended.",
  },
  {
    weekNumber: 50,
    arc: "Faith",
    arcLatin: "Fides",
    blurb:
      "What holds the practice up when the brief is weak and the bench is silent. The first of the theological virtues.",
  },
  {
    weekNumber: 51,
    arc: "Charity",
    arcLatin: "Caritas",
    blurb:
      "The crown of the virtues. Paul to the Corinthians. The week of Christmas.",
  },
  {
    weekNumber: 52,
    arc: "The Last Things",
    arcLatin: "Novissima",
    blurb:
      "Year's end. Death, judgment, heaven, hell — the four last things the lawyer has been moving toward all along. The vow renewed for the year to come.",
  },
];
