/**
 * Ecumenical legal-liturgical calendar.
 *
 * Two layers:
 *   1. The shared Christian year (Advent → Christmas → Epiphany → Lent →
 *      Easter → Pentecost → Ordinary Time) in language any tradition can use.
 *   2. Legal-vocational seasons that overlay civic and professional rhythms
 *      (bar exam, semester, Law Day, Red Mass), with optional Catholic depth.
 */

export type Season = {
  key: string;
  name: string;
  latin: string;
  themes: string[];
  blurb: string;
  approxRange: string;
};

export const christianYear: Season[] = [
  {
    key: "advent",
    name: "Advent",
    latin: "Adventus",
    themes: ["watchfulness", "hope", "justice"],
    blurb: "Four weeks of waiting. Read what the prophets said about justice and the courts of the unjust.",
    approxRange: "late Nov — Dec 24",
  },
  {
    key: "christmas",
    name: "Christmas",
    latin: "Nativitas Domini",
    themes: ["dignity", "vocation"],
    blurb: "The dignity of the human person made visible in a child. The whole foundation of law begins here.",
    approxRange: "Dec 25 — Jan 5",
  },
  {
    key: "epiphany",
    name: "Epiphany",
    latin: "Epiphania",
    themes: ["witness", "common-good"],
    blurb: "Law as gift to the nations. Where does Christian wisdom shine in public reason?",
    approxRange: "Jan 6 — early Feb",
  },
  {
    key: "lent",
    name: "Lent",
    latin: "Quadragesima",
    themes: ["repentance", "mercy", "service"],
    blurb: "Forty days of returning. A season for pro bono commitment, for almsgiving, for the works of mercy.",
    approxRange: "Ash Wednesday — Holy Saturday",
  },
  {
    key: "easter",
    name: "Easter",
    latin: "Pascha",
    themes: ["new-creation", "hope"],
    blurb: "Fifty days. The resurrection re-orders every legal vocation toward what cannot be taken away.",
    approxRange: "Easter Sunday — Pentecost",
  },
  {
    key: "pentecost",
    name: "Pentecost",
    latin: "Pentecostes",
    themes: ["mission", "solidarity", "witness"],
    blurb: "The Church goes out. So does the lawyer-citizen.",
    approxRange: "May/June (movable)",
  },
  {
    key: "ordinary",
    name: "Ordinary Time",
    latin: "Tempus per Annum",
    themes: ["formation", "common-good", "office"],
    blurb: "The long green season. Most of legal life is lived here — in steady, faithful, ordinary work.",
    approxRange: "after Pentecost — late Nov",
  },
];

export type Observance = {
  key: string;
  name: string;
  date: string; // ISO month-day "MM-DD" or descriptive
  category: "ecumenical" | "catholic" | "civic" | "professional";
  blurb: string;
};

export const observances: Observance[] = [
  // Catholic-depth observances
  {
    key: "st-thomas-more",
    name: "St. Thomas More, Patron of Lawyers",
    date: "06-22",
    category: "catholic",
    blurb:
      "More refused to subordinate conscience to the king's pleasure. The patron saint of lawyers, statesmen, and difficult clients.",
  },
  {
    key: "st-ives",
    name: "St. Yves (Ivo of Brittany), Patron of Lawyers",
    date: "05-19",
    category: "catholic",
    blurb:
      "Thirteenth-century parish priest and judge who defended the poor without fee.",
  },
  {
    key: "st-raymond",
    name: "St. Raymond of Penyafort, Patron of Canon Lawyers",
    date: "01-07",
    category: "catholic",
    blurb:
      "Dominican canon lawyer who compiled the Decretals of Gregory IX — patron of canonists, confessors, and consult-by-letter.",
  },
  {
    key: "red-mass",
    name: "Red Mass (start of judicial year)",
    date: "early October",
    category: "catholic",
    blurb:
      "An ancient votive Mass invoking the Holy Spirit on judges, lawyers, and public officials at the start of the term.",
  },
  {
    key: "aquinas-feast",
    name: "St. Thomas Aquinas",
    date: "01-28",
    category: "catholic",
    blurb:
      "Doctor of the Church. The Treatise on Law lives in his Summa, II-II, qq. 90–108.",
  },
  {
    key: "augustine-feast",
    name: "St. Augustine of Hippo",
    date: "08-28",
    category: "catholic",
    blurb:
      "Bishop, rhetor, and the first great theologian of two cities — the City of God and the earthly city.",
  },
  // Ecumenical / civic
  {
    key: "law-day",
    name: "Law Day (U.S.)",
    date: "05-01",
    category: "civic",
    blurb:
      "A day to reflect on the rule of law and the legal profession's debt to the wider community.",
  },
  {
    key: "human-rights-day",
    name: "Human Rights Day",
    date: "12-10",
    category: "civic",
    blurb:
      "Anniversary of the Universal Declaration. A natural moment for chapters to revisit human dignity.",
  },
  {
    key: "constitution-day",
    name: "Constitution Day (U.S.)",
    date: "09-17",
    category: "civic",
    blurb:
      "An invitation to chapter discussion on the moral foundations of constitutional order.",
  },
  // Professional rhythms
  {
    key: "bar-exam-summer",
    name: "Bar Exam (July)",
    date: "07-25",
    category: "professional",
    blurb:
      "Pray for the candidates. Mentors check in. Chapters host post-exam decompression.",
  },
  {
    key: "bar-exam-winter",
    name: "Bar Exam (February)",
    date: "02-25",
    category: "professional",
    blurb: "The quieter exam. Send a note to a candidate this week.",
  },
  {
    key: "1l-orientation",
    name: "1L Orientation (law schools)",
    date: "08-15",
    category: "professional",
    blurb:
      "Student chapters welcome a new cohort. Best window for inviting first-year mentees.",
  },
];

export function seasonForMonth(month: number): Season {
  // Rough mapping for static rendering — not liturgically exact.
  if (month === 12) return christianYear[1]; // Christmas-ish (Dec)
  if (month === 1) return christianYear[2]; // Epiphany
  if (month === 2 || month === 3) return christianYear[3]; // Lent
  if (month === 4 || month === 5) return christianYear[4]; // Easter
  if (month === 6) return christianYear[5]; // Pentecost
  if (month === 11) return christianYear[0]; // Advent
  return christianYear[6]; // Ordinary Time
}
