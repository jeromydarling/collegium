/**
 * The eviction matter guide.
 *
 * Structured so the same shape can be re-used for every future matter
 * type: a plain-English overview, a timeline of what's likely to
 * happen, a document checklist, questions to bring to any consult,
 * and a panel for live local information (powered by Perplexity).
 */

export type DocumentItem = {
  key: string;
  label: string;
  why: string;
  /** If true, the user almost certainly has this somewhere. */
  expected: boolean;
};

export type TimelineStep = {
  day: string;
  title: string;
  body: string;
  urgent?: boolean;
};

export type ConsultQuestion = {
  q: string;
  why: string;
};

export const evictionGuide = {
  slug: "eviction",
  title: "Eviction & housing",
  tagline: "If a piece of paper just arrived, the clock is already running.",

  overview: [
    "Eviction is a court process — even when it doesn't feel like one. A landlord cannot legally remove you, change the locks, or shut off your utilities without going through the courts and getting a judge to sign an order. That takes time, and the time is yours to use.",
    "What it costs you depends almost entirely on what you do in the next two weeks. Showing up — to a hearing, to an appointment with a clinic, with the right documents — is most of the work. Most evictions that end in tenants losing their homes do so because the tenant never appeared in court.",
    "We are not your lawyer. We will not tell you what to do. We will help you understand what's happening, gather the documents that any lawyer will need, prepare questions, and find someone who can help.",
  ],

  // The mercy / dignity grounding — drawn from the Formation library but
  // expressed in plain English. Citation lives next to it so the reader
  // can see the source.
  ethicalGrounding: {
    quote:
      "Man's needs do not die out, but recur; satisfied today, they demand new supplies tomorrow. Nature, therefore, owes to man a storehouse that shall never fail, the daily supply of his daily wants. And this he finds only in the inexhaustible fertility of the earth.",
    source: "Leo XIII, Rerum Novarum §7 (1891)",
    plainEnglish:
      "Catholic Social Teaching has been clear since 1891: shelter is not a privilege the powerful extend to the poor. It is a foundation the law was made to protect. You have a right to be in this fight.",
  },

  // What's likely to happen, in order. Days are relative to "today."
  timeline: [
    {
      day: "Today",
      title: "Read every word of what you received",
      body:
        "Find the date the notice was served, the reason given, and the deadline — usually printed on the first page. Photograph it from your phone if you haven't already. Don't sign anything yet.",
      urgent: true,
    },
    {
      day: "Days 1–3",
      title: "Pull together the basics",
      body:
        "Your lease. Your last six months of rent receipts or bank statements showing rent payments. Any texts, emails, or letters between you and the landlord. Photos of any condition issues (mold, broken heat, pests). The notice itself.",
    },
    {
      day: "Days 1–7",
      title: "Find a tenant-rights resource near you",
      body:
        "Most cities have either a free legal-aid line or a tenant-rights clinic. Many courts also have a 'Lawyer for the Day' program at housing court. Showing up with documents is half the battle.",
    },
    {
      day: "By the answer deadline",
      title: "File an Answer if a lawsuit has been filed",
      body:
        "If you've been served with a court summons, you have a deadline (usually 7–14 days) to file an Answer with the court. Missing this deadline is the most common way tenants lose by default. Many courts have free forms and self-help centers.",
      urgent: true,
    },
    {
      day: "The hearing",
      title: "Show up, every time",
      body:
        "Even if you have a lawyer, your presence matters. Even if your case looks bad on paper, the judge will give you more deference if you are there, on time, with your documents.",
    },
  ] as TimelineStep[],

  // What to gather. These are the categories any legal-aid intake worker
  // or volunteer attorney will ask about. Having them in one folder
  // saves the attorney an hour and saves you re-telling the story.
  documents: [
    {
      key: "notice",
      label: "The notice or court paper you received",
      why: "This is the document the timeline runs from. Read it for the date served, the reason, and any deadline.",
      expected: true,
    },
    {
      key: "lease",
      label: "Your lease (or any written rental agreement)",
      why: "Even a verbal lease creates rights. If you have anything in writing, bring it.",
      expected: true,
    },
    {
      key: "rent-history",
      label: "Proof of rent paid — last 6–12 months",
      why: "Bank statements, money-order receipts, Venmo / Cash App records, anything showing what you paid and when.",
      expected: true,
    },
    {
      key: "communications",
      label: "Any texts, emails, or letters from your landlord",
      why: "Especially anything about repairs, complaints, or threats. Screenshots are fine.",
      expected: true,
    },
    {
      key: "condition",
      label: "Photos or videos of any condition problems",
      why: "Broken heat, leaks, mold, pests, locks. Date-stamped if possible. These can become a defense or a counterclaim.",
      expected: false,
    },
    {
      key: "income",
      label: "Proof of household income",
      why: "Recent paystubs, benefits letters, or a tax return. Needed for eligibility at most legal-aid clinics, and useful for negotiating with the landlord.",
      expected: true,
    },
    {
      key: "id",
      label: "A photo ID for yourself and any adults on the lease",
      why: "Most clinics need this to open a file.",
      expected: true,
    },
  ] as DocumentItem[],

  // Questions to bring to the consult. These are framed so a volunteer
  // attorney can answer quickly and the tenant gets the most out of a
  // 45-minute Saturday-morning slot.
  consultQuestions: [
    {
      q: "Was the notice I received legally proper for this state?",
      why: "Many landlord notices are defective — wrong notice period, wrong reason, wrong service. A defective notice can be a defense by itself.",
    },
    {
      q: "Has a lawsuit actually been filed yet, or is this just a notice?",
      why: "A notice is the warning shot; the lawsuit is the legal action. The deadlines and stakes are very different.",
    },
    {
      q: "Do I have any habitability or repair-related defenses or counterclaims?",
      why: "In most states, if the unit is not habitable, that affects what the landlord can collect — and sometimes whether they can evict at all.",
    },
    {
      q: "Are there any rental-assistance funds open in this jurisdiction right now?",
      why: "Many cities and states have emergency rental-assistance programs that can pay back rent and stop an eviction even mid-case. The lists change month to month.",
    },
    {
      q: "If I lose, what does an eviction on my record mean for my next apartment?",
      why: "Eviction filings show up on tenant-screening reports for 7 years in most states. There are sometimes ways to seal or expunge the filing.",
    },
    {
      q: "Do I qualify for a free lawyer through any local Right-to-Counsel program?",
      why: "A growing list of cities (NYC, San Francisco, Cleveland, Detroit, Philadelphia, Newark, Toledo, Boulder, Kansas City, parts of WA and CT) have laws guaranteeing free counsel for low-income tenants in eviction cases.",
    },
  ] as ConsultQuestion[],

  // Sample queries we'd send to Perplexity for the local-info panel.
  // The {state} / {city} substitutions are filled at runtime.
  perplexityQueries: [
    {
      key: "notice-period",
      prompt:
        "In {state}, what is the legally required notice period that a landlord must give before filing an eviction for nonpayment of rent in 2026? Cite the statute and any recent changes.",
    },
    {
      key: "answer-deadline",
      prompt:
        "In {state}, after a tenant is served with an eviction summons or 'forcible entry and detainer' complaint, how many days do they have to file an Answer with the court in 2026? Cite the statute or rule of civil procedure.",
    },
    {
      key: "rental-assistance",
      prompt:
        "What emergency rental-assistance programs are currently accepting applications in {city}, {state} in 2026, for tenants facing eviction? Include eligibility criteria and how to apply.",
    },
    {
      key: "right-to-counsel",
      prompt:
        "Does {city}, {state} have a Right to Counsel program for tenants facing eviction in 2026? If so, who administers it and how does a tenant access it?",
    },
    {
      key: "legal-aid",
      prompt:
        "List the nonprofit legal-aid organizations serving low-income tenants in {city}, {state} in 2026, including their intake phone numbers and any income eligibility limits.",
    },
  ],
};

export type EvictionGuide = typeof evictionGuide;
