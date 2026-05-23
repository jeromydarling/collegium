/**
 * Public-domain seed library for Collegium Formation.
 *
 * Each entry links to a verified public-domain source (Project Gutenberg,
 * Internet Archive, or Vatican magisterial archive). Texts in the public
 * domain by date of publication and translation are quoted in full
 * excerpts; later works are cited and briefly excerpted for educational use.
 */

export type Tradition =
  | "roman-law"
  | "canon-law"
  | "natural-law"
  | "common-law"
  | "constitutional"
  | "catholic-social-teaching"
  | "christian-civic";

export type Theme =
  | "justice"
  | "equity"
  | "duty"
  | "rights"
  | "office"
  | "authority"
  | "conscience"
  | "mercy"
  | "stewardship"
  | "witness"
  | "vocation"
  | "common-good"
  | "subsidiarity"
  | "solidarity";

export type LibraryWork = {
  id: string;
  title: string;
  author: string;
  year: number | string;
  tradition: Tradition;
  themes: Theme[];
  summary: string;
  source: { label: string; url: string };
  publicDomain: boolean;
};

export type LibraryExcerpt = {
  id: string;
  workId: string;
  text: string;
  citation: string;
  themes: Theme[];
  audience: ("student" | "lawyer" | "canon-lawyer" | "mentor" | "chapter-leader")[];
  paraphrase?: string;
};

export const libraryWorks: LibraryWork[] = [
  {
    id: "aquinas-summa",
    title: "Summa Theologiae",
    author: "Thomas Aquinas",
    year: "c. 1265–1274 (English ed. 1920)",
    tradition: "natural-law",
    themes: ["justice", "common-good", "conscience", "equity", "vocation"],
    summary:
      "The most influential synthesis of Christian moral theology, with the Treatise on Law (I-II, qq. 90–108) and Treatise on Justice (II-II, qq. 57–122) at the heart of Western legal philosophy.",
    source: {
      label: "Project Gutenberg #17611 (English Dominican Fathers ed.)",
      url: "https://www.gutenberg.org/ebooks/17611",
    },
    publicDomain: true,
  },
  {
    id: "augustine-city",
    title: "The City of God",
    author: "Augustine of Hippo",
    year: "c. 413–426 (Dods tr. 1871)",
    tradition: "christian-civic",
    themes: ["justice", "authority", "common-good", "witness"],
    summary:
      "Augustine's vast meditation on two cities — the City of God and the earthly city — and on what justice means when removed from its true source.",
    source: { label: "Project Gutenberg #45304", url: "https://www.gutenberg.org/ebooks/45304" },
    publicDomain: true,
  },
  {
    id: "leo-rerum-novarum",
    title: "Rerum Novarum (On the Condition of Labor)",
    author: "Pope Leo XIII",
    year: 1891,
    tradition: "catholic-social-teaching",
    themes: ["rights", "duty", "solidarity", "common-good", "stewardship"],
    summary:
      "The foundational modern encyclical of Catholic Social Teaching: on private property, labor, just wages, and the duties of owners, workers, and the state.",
    source: {
      label: "Vatican archive (public domain)",
      url: "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_15051891_rerum-novarum.html",
    },
    publicDomain: true,
  },
  {
    id: "pius-quadragesimo",
    title: "Quadragesimo Anno",
    author: "Pope Pius XI",
    year: 1931,
    tradition: "catholic-social-teaching",
    themes: ["subsidiarity", "rights", "common-good", "solidarity"],
    summary:
      "Forty years after Rerum Novarum: the encyclical that gave the world the principle of subsidiarity in its mature form.",
    source: {
      label: "Vatican archive",
      url: "https://www.vatican.va/content/pius-xi/en/encyclicals/documents/hf_p-xi_enc_19310515_quadragesimo-anno.html",
    },
    publicDomain: true,
  },
  {
    id: "giraud-roman",
    title: "A Short History of Roman Law",
    author: "Charles Giraud (tr. James Hadley)",
    year: 1881,
    tradition: "roman-law",
    themes: ["justice", "equity", "authority", "office"],
    summary:
      "A compact 19th-century introduction to the categories of Roman law — persons, things, actions — that shaped both civil and canonical traditions.",
    source: {
      label: "Internet Archive",
      url: "https://archive.org/details/shorthistoryofro00girauoft",
    },
    publicDomain: true,
  },
  {
    id: "stimson-popular-law",
    title: "Popular Law-Making",
    author: "Frederic Jesup Stimson",
    year: 1910,
    tradition: "common-law",
    themes: ["rights", "authority", "duty", "common-good"],
    summary:
      "A historical study of how Anglo-American law has been made by the people — through legislatures, courts, and custom.",
    source: { label: "Project Gutenberg #12235", url: "https://www.gutenberg.org/ebooks/12235" },
    publicDomain: true,
  },
  {
    id: "more-utopia",
    title: "Utopia",
    author: "Thomas More",
    year: "1516 (Robynson tr. 1551)",
    tradition: "christian-civic",
    themes: ["justice", "common-good", "office", "vocation"],
    summary:
      "More's dialogue on justice, property, and the proper ends of a commonwealth — read in every age as both critique and aspiration.",
    source: { label: "Project Gutenberg #2130", url: "https://www.gutenberg.org/ebooks/2130" },
    publicDomain: true,
  },
  {
    id: "blackstone-commentaries",
    title: "Commentaries on the Laws of England, Vol. I",
    author: "William Blackstone",
    year: 1765,
    tradition: "common-law",
    themes: ["rights", "duty", "authority", "office"],
    summary:
      "The eighteenth-century synthesis of English common law that founded American legal education — and Aquinas-influenced in its grounding of natural rights.",
    source: { label: "Project Gutenberg #30802", url: "https://www.gutenberg.org/ebooks/30802" },
    publicDomain: true,
  },
  {
    id: "newman-idea",
    title: "The Idea of a University",
    author: "John Henry Newman",
    year: 1852,
    tradition: "christian-civic",
    themes: ["vocation", "office", "witness"],
    summary:
      "Newman on liberal learning, the formation of the whole person, and the moral character of intellectual work — formative reading for the lawyer-citizen.",
    source: { label: "Project Gutenberg #24526", url: "https://www.gutenberg.org/ebooks/24526" },
    publicDomain: true,
  },
  {
    id: "burke-reflections",
    title: "Reflections on the Revolution in France",
    author: "Edmund Burke",
    year: 1790,
    tradition: "constitutional",
    themes: ["authority", "duty", "common-good"],
    summary:
      "Burke's classic on the moral architecture of constitutional order — prudence, inheritance, and the limits of abstract right.",
    source: { label: "Project Gutenberg #15679", url: "https://www.gutenberg.org/ebooks/15679" },
    publicDomain: true,
  },
];

export const libraryExcerpts: LibraryExcerpt[] = [
  {
    id: "ex-aquinas-law-def",
    workId: "aquinas-summa",
    text: "Law is nothing else than an ordinance of reason for the common good, made by him who has care of the community, and promulgated.",
    citation: "ST I-II, q.90, a.4",
    themes: ["common-good", "authority"],
    audience: ["student", "lawyer", "canon-lawyer"],
    paraphrase:
      "A real law has four marks: reason (not whim), the common good (not private interest), competent authority, and public promulgation.",
  },
  {
    id: "ex-aquinas-equity",
    workId: "aquinas-summa",
    text: "Because human actions, with which laws are concerned, are composed of contingent singulars and are innumerable in their diversity, it was not possible to lay down rules of law that would apply to every single case. Legislators in framing laws attend to what commonly happens.",
    citation: "ST I-II, q.96, a.6",
    themes: ["equity", "justice"],
    audience: ["lawyer", "canon-lawyer", "mentor"],
    paraphrase:
      "Statutes speak to the typical case. Equity remembers the case the statute could not foresee.",
  },
  {
    id: "ex-rerum-property",
    workId: "leo-rerum-novarum",
    text: "Man's needs do not die out, but recur; satisfied today, they demand new supplies tomorrow. Nature, therefore, owes to man a storehouse that shall never fail, the daily supply of his daily wants. And this he finds only in the inexhaustible fertility of the earth.",
    citation: "Rerum Novarum, §7",
    themes: ["rights", "stewardship", "common-good"],
    audience: ["lawyer", "chapter-leader"],
  },
  {
    id: "ex-quadragesimo-subsidiarity",
    workId: "pius-quadragesimo",
    text: "It is an injustice and at the same time a grave evil and disturbance of right order to assign to a greater and higher association what lesser and subordinate organizations can do.",
    citation: "Quadragesimo Anno, §79",
    themes: ["subsidiarity"],
    audience: ["chapter-leader", "lawyer"],
    paraphrase:
      "Don't promote upward what can be handled where the work is actually being done.",
  },
  {
    id: "ex-augustine-justice",
    workId: "augustine-city",
    text: "Justice removed, then, what are kingdoms but great robberies? For what are robberies themselves, but little kingdoms?",
    citation: "City of God, Book IV, ch. 4",
    themes: ["justice", "authority"],
    audience: ["lawyer", "student"],
  },
  {
    id: "ex-more-counsel",
    workId: "more-utopia",
    text: "If evil opinions and naughty persuasions cannot be utterly and quite plucked out of their hearts, if you cannot, even as you would, remedy vices which use and custom have confirmed: yet for this cause you must not leave and forsake the commonwealth.",
    citation: "Utopia, Book I",
    themes: ["vocation", "duty", "common-good"],
    audience: ["student", "lawyer"],
    paraphrase:
      "More's case against quitting the public square — even when the public square refuses to be perfected.",
  },
  {
    id: "ex-blackstone-rights",
    workId: "blackstone-commentaries",
    text: "The principal aim of society is to protect individuals in the enjoyment of those absolute rights which were vested in them by the immutable laws of nature.",
    citation: "Commentaries, Book I, ch. 1",
    themes: ["rights", "common-good"],
    audience: ["lawyer", "student"],
  },
  {
    id: "ex-newman-mind",
    workId: "newman-idea",
    text: "A habit of mind is formed which lasts through life, of which the attributes are, freedom, equitableness, calmness, moderation, and wisdom.",
    citation: "The Idea of a University, Discourse V",
    themes: ["vocation", "office"],
    audience: ["student", "mentor"],
  },
];

export type TrackWeek = {
  /** 1-indexed week number within the track. */
  number: number;
  title: string;
  /** Library-excerpt id this week's reading anchors on. */
  excerptId: string;
  /** Suggested ~time on reading + reflection, in minutes. */
  estimateMinutes: number;
  /** Two-to-four discussion prompts a facilitator can read aloud. */
  prompts: string[];
  /** Optional supplementary reading or context, displayed as a sub-bullet. */
  supplement?: string;
};

export type FormationTrack = {
  id: string;
  title: string;
  blurb: string;
  audience: "lawyer" | "student" | "steward" | "all";
  /** The weeks of the track in order. */
  weeks: TrackWeek[];
  /** For backwards-compat with code that read `items`. */
  items?: string[];
  /** Notes for the chapter facilitator running the reading group. */
  facilitatorNotes: string[];
};

export const tracksSeed: FormationTrack[] = [
  {
    id: "track-natural-law",
    title: "Natural Law: A Lawyer's Eight-Week Walk",
    blurb:
      "Eight weeks with Aquinas on what law is, what justice is, and what equity remembers.",
    audience: "lawyer",
    items: [
      "ex-aquinas-law-def",
      "ex-aquinas-equity",
      "ex-augustine-justice",
      "ex-blackstone-rights",
    ],
    weeks: [
      {
        number: 1,
        title: "What law IS",
        excerptId: "ex-aquinas-law-def",
        estimateMinutes: 40,
        prompts: [
          "Aquinas's definition has four parts. Which has the most teeth in your daily practice?",
          "When does 'promulgation' fail in your jurisdiction? Who pays?",
          "What's a rule you enforce that isn't, in this sense, law at all?",
        ],
      },
      {
        number: 2,
        title: "Justice as a habit, not an outcome",
        excerptId: "ex-augustine-justice",
        estimateMinutes: 35,
        prompts: [
          "How does Augustine's 'right order in the soul' relate to 'right order' in a courtroom?",
          "Where do you see disordered loves driving outcomes you've witnessed?",
        ],
        supplement: "Pair with Ps. 82 if the group has time.",
      },
      {
        number: 3,
        title: "Equity as memory",
        excerptId: "ex-aquinas-equity",
        estimateMinutes: 45,
        prompts: [
          "Aquinas calls equity 'a higher rule.' What does that mean when you draft a settlement?",
          "Name a case from your practice where equity rescued a result the rule would have ruined.",
        ],
      },
      {
        number: 4,
        title: "Rights as natural, not invented",
        excerptId: "ex-blackstone-rights",
        estimateMinutes: 50,
        prompts: [
          "Blackstone says rights are pre-political. Modern positivism says otherwise. Where do you actually stand in practice?",
          "How does the answer change how you advise a client whose claim has no statutory hook?",
        ],
      },
    ],
    facilitatorNotes: [
      "Open each session with the excerpt read aloud (one paragraph max). Then sit with it for a minute before the first prompt.",
      "These prompts are designed for 8–14 people. Smaller groups: pick two prompts, go deeper.",
      "Avoid resolving the questions. The group's job is to sit with them, not finish them.",
      "Close every session with one minute of silent prayer for someone the group serves.",
    ],
  },
  {
    id: "track-cst-foundations",
    title: "Catholic Social Teaching for the Practicing Bar",
    blurb:
      "Rerum Novarum to Laudato Si' — the documents that shape how the Church reads the world.",
    audience: "lawyer",
    items: ["ex-rerum-property", "ex-quadragesimo-subsidiarity", "ex-more-counsel"],
    weeks: [
      {
        number: 1,
        title: "Property, dignity, and labor (Rerum Novarum)",
        excerptId: "ex-rerum-property",
        estimateMinutes: 45,
        prompts: [
          "Leo XIII writes that private property is a natural right ordered to the common good. What does 'ordered to' mean in your real-estate practice?",
          "Where in your jurisdiction does property law honor that ordering — and where does it forget?",
        ],
      },
      {
        number: 2,
        title: "Subsidiarity (Quadragesimo Anno)",
        excerptId: "ex-quadragesimo-subsidiarity",
        estimateMinutes: 40,
        prompts: [
          "Pius XI: 'a higher community should not arrogate to itself functions which can be performed by a lower.' Where in your work is the higher community arrogating?",
          "When does subsidiarity become an excuse for abandonment?",
        ],
      },
      {
        number: 3,
        title: "The lawyer's particular witness (More on counsel)",
        excerptId: "ex-more-counsel",
        estimateMinutes: 35,
        prompts: [
          "More writes to his daughter about counsel given against conscience. What's your version of that letter?",
        ],
      },
    ],
    facilitatorNotes: [
      "CST is bottomless. Resist the urge to summarize the encyclicals — pick one paragraph and stay with it.",
      "Most lawyers in the group will not have read these documents. The intimidation is real — name it.",
    ],
  },
  {
    id: "track-students",
    title: "Vocation in the First Year",
    blurb:
      "For 1Ls finding their footing — what kind of lawyer am I being formed to be?",
    audience: "student",
    items: ["ex-newman-mind", "ex-more-counsel", "ex-aquinas-law-def"],
    weeks: [
      {
        number: 1,
        title: "The educated mind (Newman)",
        excerptId: "ex-newman-mind",
        estimateMinutes: 30,
        prompts: [
          "Newman distinguishes useful from liberal knowledge. Which is law-school giving you right now? Which do you want it to give you?",
        ],
      },
      {
        number: 2,
        title: "Counsel against conscience (More)",
        excerptId: "ex-more-counsel",
        estimateMinutes: 35,
        prompts: [
          "If your professor or your firm asked you to make an argument you knew was wrong — not illegal, just wrong — what would you do? Have you done it?",
        ],
      },
      {
        number: 3,
        title: "What law IS (Aquinas)",
        excerptId: "ex-aquinas-law-def",
        estimateMinutes: 40,
        prompts: [
          "Aquinas's definition. Sit with it. Where does your 1L casebook quietly disagree?",
        ],
      },
    ],
    facilitatorNotes: [
      "1Ls are tired. Keep sessions to 45 minutes max.",
      "The mentor relationship is at least as important as the reading. Treat the discussion as a backdrop for that.",
    ],
  },
];
