/**
 * The Daily Office for Legal Vocation.
 *
 * Seven days of the week, each with its own emphasis. Combined with a
 * rotating set of Aquinas / Augustine / public-domain excerpts and a short
 * reflection in plain language, this becomes a daily ten-minute habit
 * for any member of the guild.
 */

import { aquinasOfTheDay } from "./aquinas";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const weekdayRhythm: Record<
  Weekday,
  { theme: string; latin: string; movement: string }
> = {
  monday: { theme: "Vocation and office", latin: "Vocatio et officium", movement: "Begin again." },
  tuesday: { theme: "Justice and equity", latin: "Iustitia et æquitas", movement: "Render each their due." },
  wednesday: {
    theme: "Mercy and service",
    latin: "Misericordia et ministerium",
    movement: "Mercy is the fulfillment of justice.",
  },
  thursday: {
    theme: "Law, conscience, and duty",
    latin: "Lex, conscientia, officium",
    movement: "Conscience speaks where statute is silent.",
  },
  friday: {
    theme: "Sacrifice and witness",
    latin: "Sacrificium et testimonium",
    movement: "What is a profession that does not cost anything?",
  },
  saturday: {
    theme: "Wisdom and study",
    latin: "Sapientia et studium",
    movement: "Read slowly. Read what lasts.",
  },
  sunday: {
    theme: "Rest, worship, common good",
    latin: "Quies, cultus, bonum commune",
    movement: "The common good is also rest.",
  },
};

export type DevotionalEntry = {
  weekday: Weekday;
  theme: string;
  latin: string;
  movement: string;
  excerpt: string;
  citation: string;
  reflection: string;
  prayer: string;
  prompt: string;
};

const reflections: Record<Weekday, { reflection: string; prayer: string; prompt: string }> = {
  monday: {
    reflection:
      "A lawyer's week does not begin in the office. It begins in the recognition that practice is a calling. Aquinas saw law itself as ordained reason — not a mechanism, not a market, but the slow shaping of a community toward its good. Open the week as one called, not merely hired.",
    prayer:
      "Lord, you are the source of all justice. Make my work an ordinance of reason this week. Where I am tempted to reduce a client to a file, return me to the person.",
    prompt: "What is one piece of work this week that I should treat as vocation, not transaction?",
  },
  tuesday: {
    reflection:
      "Justice, said Aquinas, is the habit of giving each their due. The habit. Not a single heroic act but the daily, almost boring repetition by which a virtue becomes part of who we are. The lawyer is formed by the small choices about whom to call back first, which case to take, which fee to forgive.",
    prayer:
      "Father, form in me the constant and perpetual will to render each their due. Show me whose due is at stake today.",
    prompt: "Whom have I overlooked? Whose due am I tempted to discount?",
  },
  wednesday: {
    reflection:
      "Mercy is not the suspension of justice. It is, Aquinas insisted, its fulfillment. In legal practice, the line between rigor and pity is rarely a single moment of choice. It is a hundred quiet decisions — about deadlines, about indigent clients, about the tone of an email to opposing counsel.",
    prayer:
      "Christ, you are the just judge who also weeps. Help me imitate you today — not in soft mercy that loses justice, but in justice fulfilled by mercy.",
    prompt: "Where is justice asking me to soften, and where is mercy asking me to hold firm?",
  },
  thursday: {
    reflection:
      "Aquinas: human law binds in conscience only insofar as it conforms to reason and the common good. The lawyer's task is not to obey every command of the strong, nor to subvert every command of the inconvenient. It is to discern. Conscience is harder than rebellion.",
    prayer:
      "Holy Spirit, sharpen my conscience. Where the letter of the law clouds its purpose, give me the courage of equity. Where the letter is just, give me obedience.",
    prompt: "What in my practice this week is testing my conscience? Have I spoken about it with anyone?",
  },
  friday: {
    reflection:
      "Thomas More went to the scaffold for refusing to swear what he could not swear. Most of us will not be asked that. We will be asked smaller costs: hours unbilled, candor that wounds, fees declined, a Friday devoted to a pro bono case instead of a paying one. Witness is rarely heroic. It is usually inconvenient.",
    prayer:
      "Lord, you gave yourself for the world's life. Teach me to give without measuring what I gave. Let this Friday cost me something.",
    prompt: "What cost am I avoiding that would, if accepted, be the most honest thing I do this week?",
  },
  saturday: {
    reflection:
      "Newman wrote of liberal learning as a habit of mind that lasts through life: freedom, equitableness, calmness, moderation, wisdom. Most lawyers stop being formed at graduation. The guild exists, in part, to refuse that. Saturday is the day to read what lasts — slowly, without an audience.",
    prayer:
      "Wisdom, you ordered all things sweetly. Slow me down. Help me to read the way our forebears read — not to win but to be changed.",
    prompt: "What twenty pages have I been meaning to read for six months? When this Saturday will I read them?",
  },
  sunday: {
    reflection:
      "The common good includes rest. Aquinas located the seventh day in the order of creation itself. A lawyer who does not rest will eventually deplete the community they were trying to serve. Sunday is not earned. It is given.",
    prayer:
      "Father of all good gifts, you rested and called it holy. Lift from me the illusion that the case turns on my next email. Restore the people I love. Restore me.",
    prompt: "What is the form of rest that would actually restore me — and not merely distract me — today?",
  },
};

export function devotionalForDate(date: Date): DevotionalEntry {
  const weekdays: Weekday[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const wd = weekdays[date.getDay()];
  const rhythm = weekdayRhythm[wd];
  const r = reflections[wd];
  // Rotate Aquinas quotes by day-of-year so each day has a distinct excerpt.
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const q = aquinasOfTheDay(dayOfYear);
  return {
    weekday: wd,
    theme: rhythm.theme,
    latin: rhythm.latin,
    movement: rhythm.movement,
    excerpt: q.text,
    citation: q.citation,
    reflection: r.reflection,
    prayer: r.prayer,
    prompt: r.prompt,
  };
}
