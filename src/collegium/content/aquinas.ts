/**
 * Selected passages from Thomas Aquinas, all from public-domain English
 * translations of the Summa Theologiae (chiefly the Dominican Fathers
 * edition, 1920–22, now in the public domain). Citations point to the
 * Treatise on Law (ST I-II, qq. 90–108) and Treatise on Justice
 * (ST II-II, qq. 57–122) unless noted.
 */

export type AquinasQuote = {
  id: string;
  text: string;
  citation: string;
  theme:
    | "law"
    | "justice"
    | "prudence"
    | "common-good"
    | "mercy"
    | "vocation"
    | "right"
    | "equity"
    | "conscience";
};

export const aquinasQuotes: AquinasQuote[] = [
  {
    id: "stl-q90-a4",
    text: "Law is nothing else than an ordinance of reason for the common good, made by him who has care of the community, and promulgated.",
    citation: "Summa Theologiae I-II, q.90, a.4",
    theme: "law",
  },
  {
    id: "stl-q95-a2",
    text: "Every human law has just so much of the nature of law as it is derived from the law of nature. But if in any point it deflects from the law of nature, it is no longer a law but a perversion of law.",
    citation: "Summa Theologiae I-II, q.95, a.2",
    theme: "law",
  },
  {
    id: "stj-q58-a1",
    text: "Justice is a habit whereby a man renders to each one his due by a constant and perpetual will.",
    citation: "Summa Theologiae II-II, q.58, a.1",
    theme: "justice",
  },
  {
    id: "stj-q57-a1",
    text: "The right or the just is a work that is adjusted to another person according to some kind of equality.",
    citation: "Summa Theologiae II-II, q.57, a.1",
    theme: "right",
  },
  {
    id: "stj-q120-a2",
    text: "Equity (epieikeia) is a higher rule of human actions than legal justice — for the lawgiver cannot foresee every case, and equity follows reason where the letter would fail it.",
    citation: "Summa Theologiae II-II, q.120, a.2 (paraphrased)",
    theme: "equity",
  },
  {
    id: "stl-q96-a4",
    text: "Laws framed by man are either just or unjust. If they be just, they have the power of binding in conscience.",
    citation: "Summa Theologiae I-II, q.96, a.4",
    theme: "conscience",
  },
  {
    id: "stp-q47-a2",
    text: "Prudence is right reason about things to be done. It is the charioteer of the virtues.",
    citation: "Summa Theologiae II-II, q.47, a.2",
    theme: "prudence",
  },
  {
    id: "stj-q30-a4",
    text: "Mercy is the fulfillment of justice, not its dissolution; it perfects what justice begins.",
    citation: "Summa Theologiae II-II, q.30, a.4 (paraphrased)",
    theme: "mercy",
  },
  {
    id: "stl-q90-a2",
    text: "Since every part is ordained to the whole, as imperfect to perfect, and since one man is part of the perfect community, the law must needs regard properly the relation to universal happiness.",
    citation: "Summa Theologiae I-II, q.90, a.2",
    theme: "common-good",
  },
  {
    id: "stj-q58-a6",
    text: "Justice directs man in his relations with other men. Now this may happen in two ways: first, as regards his relation with individuals; secondly, as regards his relations with others in general.",
    citation: "Summa Theologiae II-II, q.58, a.6",
    theme: "justice",
  },
  {
    id: "stl-q97-a2",
    text: "Human law is rightly changed, in so far as such change is conducive to the common weal. But the very change of law, considered in itself, is of a nature to cause some loss to the common weal: because custom avails much for the observance of laws.",
    citation: "Summa Theologiae I-II, q.97, a.2",
    theme: "law",
  },
  {
    id: "stj-q66-a7",
    text: "In cases of necessity, all things are common property; so that there would seem to be no sin in taking another's property, for need has made it common.",
    citation: "Summa Theologiae II-II, q.66, a.7",
    theme: "mercy",
  },
  {
    id: "vocation",
    text: "To live well is to work well, or display a good activity, for virtue is concerned with conduct.",
    citation: "Aquinas, Commentary on Aristotle's Nicomachean Ethics I, lect. 10",
    theme: "vocation",
  },
];

export function aquinasByTheme(theme: AquinasQuote["theme"]): AquinasQuote[] {
  return aquinasQuotes.filter((q) => q.theme === theme);
}

export function aquinasOfTheDay(dayIndex: number): AquinasQuote {
  return aquinasQuotes[dayIndex % aquinasQuotes.length];
}
