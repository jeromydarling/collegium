/**
 * Interview script for eviction matters.
 *
 * The questions read in the voice of a calm civil legal-aid attorney
 * sitting across a table — one question at a time, acknowledging the
 * answer before moving on. Each question carries a lightweight
 * extractor that pulls keywords/dates/numbers out of the user's reply
 * into a structured ExtractedFacts object the mock state machine
 * uses to personalize the rest of the interview and the matter file.
 *
 * When the real Lovable AI / Gemini integration lands, this script is
 * still the spine — it defines the canonical fact shape and the
 * defense + document logic. The model will simply phrase the
 * questions and write the closing matter file.
 */

export type Communication = { when?: string; channel?: string; summary: string };
export type DocReceived = {
  type: string;
  servedOn?: string;
  description?: string;
};
export type Complaint = { when?: string; about: string; to?: string };

export type ExtractedFacts = {
  jurisdiction?: { city?: string; state?: string };

  // Tenancy fundamentals.
  tenancyStartedOn?: string;
  rentMonthlyCents?: number;
  arrearsMonths?: number;
  lastRentPaidOn?: string;
  hasWrittenLease?: boolean;

  // Documents and communications.
  documentsReceived?: DocReceived[];
  communications?: Communication[];

  // Habitability.
  habitabilityIssues?: string[];
  complaintsReported?: Complaint[];

  // Household + sensitive.
  household?: string;
  children?: boolean;
  disability?: boolean;
  immigrationConcern?: boolean;
  priorEviction?: boolean;
  housingSubsidy?: string;

  // Outcome.
  goals?: string;

  /** Free-text narrative the user gave when first asked "what's going on". */
  openingNarrative?: string;
};

export type InterviewQuestion = {
  id: string;
  /** The default question text. */
  text: string;
  /** Optional render-time tailoring based on accumulated facts. */
  render?: (facts: ExtractedFacts) => string;
  /** Skip this question entirely if a precondition rejects it. */
  skipIf?: (facts: ExtractedFacts) => boolean;
  /** Extract structured facts from the user's reply. */
  extract?: (userReply: string, current: ExtractedFacts) => ExtractedFacts;
  /** Optional opening acknowledgement the UI can show after the user answers. */
  acknowledge?: (userReply: string, facts: ExtractedFacts) => string;
};

export type DefenseRule = {
  id: string;
  headline: string;
  why: string;
  applies: (facts: ExtractedFacts) => boolean;
};

export type ConsultQuestion = { q: string; why: string };

export type InterviewScript = {
  greeting: string;
  questions: InterviewQuestion[];
  baseDocuments: {
    key: string;
    label: string;
    why: string;
  }[];
  personalizedDocuments: (
    facts: ExtractedFacts
  ) => { key: string; label: string; why: string }[];
  defenseRules: DefenseRule[];
  consultQuestions: (facts: ExtractedFacts) => ConsultQuestion[];
};

// ── small extraction helpers ─────────────────────────────────────────

const HABITABILITY_KEYWORDS: Record<string, string> = {
  heat: "heat or hot water",
  "hot water": "heat or hot water",
  "no water": "water",
  mold: "mold",
  mildew: "mold",
  roach: "pest infestation",
  rat: "pest infestation",
  mice: "pest infestation",
  bedbug: "bedbugs",
  leak: "leaks or water damage",
  "broken window": "broken window",
  lock: "broken lock",
  electric: "electrical",
  rodent: "pest infestation",
  pest: "pest infestation",
};

function detectHabitability(text: string): string[] {
  const hits = new Set<string>();
  const lower = text.toLowerCase();
  for (const [kw, label] of Object.entries(HABITABILITY_KEYWORDS)) {
    if (lower.includes(kw)) hits.add(label);
  }
  return [...hits];
}

const NOTICE_TYPES: { kw: string[]; type: string }[] = [
  { kw: ["14-day", "14 day"], type: "14-day notice to quit" },
  { kw: ["7-day", "7 day"], type: "7-day notice to quit" },
  { kw: ["30-day", "30 day"], type: "30-day notice" },
  { kw: ["3-day", "3 day"], type: "3-day notice (pay or quit)" },
  { kw: ["summons", "summary process", "complaint"], type: "court summons / complaint" },
  { kw: ["notice to quit"], type: "notice to quit" },
  { kw: ["pay or quit"], type: "pay-or-quit notice" },
  { kw: ["notice of lease termination"], type: "lease termination notice" },
];

function detectDocumentType(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const { kw, type } of NOTICE_TYPES) {
    if (kw.some((k) => lower.includes(k))) return type;
  }
  if (lower.includes("notice")) return "written notice";
  if (lower.includes("letter")) return "letter from landlord";
  return undefined;
}

function detectMoney(text: string): number | undefined {
  // Pull a first dollar figure if there is one.
  const m = text.match(/\$?\s?([0-9][0-9,]{1,5}(?:\.\d{2})?)/);
  if (!m) return undefined;
  const dollars = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(dollars)) return undefined;
  return Math.round(dollars * 100);
}

function detectYesNo(text: string): boolean | undefined {
  const lower = text.toLowerCase().trim();
  if (/(^|\W)(yes|yeah|yep|yes,|yup)(\W|$)/.test(lower)) return true;
  if (/(^|\W)(no|nope|not really|never)(\W|$)/.test(lower)) return false;
  return undefined;
}

// ── The eviction script ──────────────────────────────────────────────

export const evictionInterview: InterviewScript = {
  greeting:
    "I'm going to ask you some questions about what's happening. " +
    "I am not a lawyer and I cannot give you legal advice. What I can " +
    "do is help you understand the system and organize your story so " +
    "that when you sit down with a real attorney — paid or free — you " +
    "can use that hour well.\n\n" +
    "Everything you tell me stays on your device. I don't share with " +
    "ICE, CPS, your landlord, your creditor, or anyone else. You can " +
    "delete the whole conversation at any time.\n\n" +
    "Take your time. Skip anything you don't want to answer.",

  questions: [
    {
      id: "opening",
      text:
        "Tell me, in your own words: what's going on with your housing? " +
        "What's the most recent thing that happened?",
      extract: (reply, current) => {
        const hab = detectHabitability(reply);
        const docType = detectDocumentType(reply);
        const facts: ExtractedFacts = {
          ...current,
          openingNarrative: reply,
        };
        if (hab.length) facts.habitabilityIssues = hab;
        if (docType)
          facts.documentsReceived = [
            ...(current.documentsReceived || []),
            { type: docType, description: "Mentioned in opening" },
          ];
        return facts;
      },
      acknowledge: (_reply, facts) => {
        if (facts.documentsReceived && facts.documentsReceived.length)
          return "I hear you. That paper you received matters — we'll come back to it.";
        return "Thank you for telling me. Let me ask a few specific things so we can build the file.";
      },
    },
    {
      id: "tenancy-length",
      text:
        "How long have you lived in this apartment? An approximate year is fine — " +
        "if you can remember the month, that's even better.",
      extract: (reply, current) => {
        const yearMatch = reply.match(/\b(20\d{2}|19\d{2})\b/);
        const months = [
          "january","february","march","april","may","june","july",
          "august","september","october","november","december",
          "jan","feb","mar","apr","jun","jul","aug","sep","sept","oct","nov","dec",
        ];
        const lower = reply.toLowerCase();
        const monthMatch = months.find((m) => lower.includes(m));
        let tenancyStartedOn = "";
        if (yearMatch && monthMatch)
          tenancyStartedOn = `${monthMatch[0].toUpperCase() + monthMatch.slice(1)} ${yearMatch[0]}`;
        else if (yearMatch) tenancyStartedOn = yearMatch[0];
        return tenancyStartedOn
          ? { ...current, tenancyStartedOn }
          : { ...current };
      },
    },
    {
      id: "lease",
      text:
        "Do you have a written lease — even an old one, even if it expired and you stayed on month-to-month?",
      extract: (reply, current) => {
        const yn = detectYesNo(reply);
        if (yn === undefined) return current;
        return { ...current, hasWrittenLease: yn };
      },
    },
    {
      id: "rent",
      text:
        "What's the rent each month? And have you fallen behind — if so, how many months are you behind?",
      extract: (reply, current) => {
        const cents = detectMoney(reply);
        const next: ExtractedFacts = { ...current };
        if (cents) next.rentMonthlyCents = cents;
        // Heuristic: "X months behind" or "owe X months".
        const m = reply.toLowerCase().match(/(\d+)\s*month/);
        if (m) next.arrearsMonths = parseInt(m[1], 10);
        else if (/behind/.test(reply.toLowerCase())) next.arrearsMonths = next.arrearsMonths ?? 1;
        return next;
      },
    },
    {
      id: "last-paid",
      text:
        "When was the last time you paid rent in full? If you've made any partial " +
        "payments since, mention those too.",
      skipIf: (f) => !f.arrearsMonths || f.arrearsMonths === 0,
      extract: (reply, current) => {
        // Light date capture — pulls the first month-name + year, or "today" etc.
        const months = [
          "january","february","march","april","may","june","july",
          "august","september","october","november","december",
        ];
        const lower = reply.toLowerCase();
        const monthMatch = months.find((m) => lower.includes(m));
        const yearMatch = reply.match(/\b(20\d{2})\b/);
        if (monthMatch && yearMatch)
          return {
            ...current,
            lastRentPaidOn: `${monthMatch[0].toUpperCase() + monthMatch.slice(1)} ${yearMatch[0]}`,
          };
        if (monthMatch)
          return {
            ...current,
            lastRentPaidOn: monthMatch[0].toUpperCase() + monthMatch.slice(1),
          };
        return current;
      },
    },
    {
      id: "habitability-followup",
      text:
        "Tell me about the condition of the apartment. Are there problems — " +
        "things that don't work, things you've asked the landlord to fix? " +
        "Anything from broken heat to mold to pests counts here.",
      render: (facts) => {
        if (facts.habitabilityIssues && facts.habitabilityIssues.length) {
          return (
            "You mentioned " +
            facts.habitabilityIssues.join(", ") +
            ". Tell me more about that — when did it start, " +
            "did you tell the landlord, and is it still going on?"
          );
        }
        return (
          "Tell me about the condition of the apartment. Are there problems — " +
          "things that don't work, things you've asked the landlord to fix? " +
          "Anything from broken heat to mold to pests counts here."
        );
      },
      extract: (reply, current) => {
        const hab = detectHabitability(reply);
        const all = [...(current.habitabilityIssues || []), ...hab];
        const set = [...new Set(all)];
        const lower = reply.toLowerCase();
        const complaints: Complaint[] = [];
        if (
          lower.includes("told") ||
          lower.includes("called") ||
          lower.includes("texted") ||
          lower.includes("emailed") ||
          lower.includes("asked") ||
          lower.includes("complained")
        ) {
          complaints.push({ about: set.join(", ") || "condition issues" });
        }
        const next: ExtractedFacts = { ...current };
        if (set.length) next.habitabilityIssues = set;
        if (complaints.length)
          next.complaintsReported = [
            ...(current.complaintsReported || []),
            ...complaints,
          ];
        return next;
      },
    },
    {
      id: "code-enforcement",
      text:
        "Have you ever called code enforcement, the health department, or 311 " +
        "about the apartment? Even years ago counts.",
      skipIf: (f) => !f.habitabilityIssues || f.habitabilityIssues.length === 0,
      extract: (reply, current) => {
        const yn = detectYesNo(reply);
        if (yn === true) {
          return {
            ...current,
            complaintsReported: [
              ...(current.complaintsReported || []),
              { about: "Reported to code enforcement / health dept", to: "agency" },
            ],
          };
        }
        return current;
      },
    },
    {
      id: "documents-received",
      text:
        "What have you received from the landlord on paper? A notice, a letter, " +
        "a court summons? When was it given to you, and how — handed to you, " +
        "taped to the door, in the mail?",
      extract: (reply, current) => {
        const docType = detectDocumentType(reply);
        if (!docType) return current;
        const exists = (current.documentsReceived || []).some(
          (d) => d.type === docType
        );
        if (exists) return current;
        // Pull a date if there is one.
        const dateMatch = reply.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
        const monthName = reply.toLowerCase().match(
          /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/
        );
        const dayMatch = reply.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
        let servedOn: string | undefined;
        if (dateMatch) servedOn = dateMatch[0];
        else if (monthName && dayMatch)
          servedOn = `${monthName[0][0].toUpperCase() + monthName[0].slice(1)} ${dayMatch[0]}`;
        return {
          ...current,
          documentsReceived: [
            ...(current.documentsReceived || []),
            { type: docType, servedOn, description: "from intake interview" },
          ],
        };
      },
    },
    {
      id: "subsidy",
      text:
        "Do you receive any housing help — Section 8, public housing, RAFT, " +
        "MRVP, anything like that? It changes what protections you have.",
      extract: (reply, current) => {
        const lower = reply.toLowerCase();
        let subsidy: string | undefined;
        if (lower.includes("section 8") || lower.includes("housing choice voucher"))
          subsidy = "Housing Choice Voucher (Section 8)";
        else if (lower.includes("public housing")) subsidy = "public housing";
        else if (lower.includes("raft")) subsidy = "RAFT";
        else if (lower.includes("mrvp")) subsidy = "MRVP";
        else if (lower.includes("voucher")) subsidy = "rental voucher";
        if (subsidy) return { ...current, housingSubsidy: subsidy };
        return current;
      },
    },
    {
      id: "household",
      text:
        "Who else lives with you in the apartment? Are any children involved?",
      extract: (reply, current) => {
        const lower = reply.toLowerCase();
        const children =
          /child|kid|son|daughter|baby|infant|toddler/.test(lower) ||
          /\b\d+\s*(year|yr)/.test(lower);
        return {
          ...current,
          household: reply.slice(0, 220),
          children,
        };
      },
    },
    {
      id: "sensitive",
      text:
        "I have to ask a few sensitive questions — they matter for what we do next. " +
        "Skip any you don't want to answer. Is there anything you're worried about " +
        "coming up in court — old issues, debts, immigration status, anything?",
      extract: (reply, current) => {
        const lower = reply.toLowerCase();
        const next: ExtractedFacts = { ...current };
        if (
          lower.includes("immigration") ||
          lower.includes("status") ||
          lower.includes("undocumented") ||
          lower.includes("visa") ||
          lower.includes("green card")
        )
          next.immigrationConcern = true;
        if (lower.includes("evict") && lower.includes("before")) next.priorEviction = true;
        if (
          lower.includes("disab") ||
          lower.includes("ssdi") ||
          lower.includes("ssi") ||
          lower.includes("wheelchair") ||
          lower.includes("mental health")
        )
          next.disability = true;
        return next;
      },
    },
    {
      id: "goals",
      text:
        "Last one. If everything worked out as well as it possibly could from here, " +
        "what would that look like for you?",
      extract: (reply, current) => ({ ...current, goals: reply.trim() }),
    },
  ],

  baseDocuments: [
    {
      key: "notice",
      label: "Every notice, letter, or court paper you've received",
      why: "Bring all of it — even ones that look old or unrelated. Photograph the front and back.",
    },
    {
      key: "lease",
      label: "Your lease (or any written rental agreement)",
      why: "Even an expired lease establishes terms. If you don't have one, that's also a fact.",
    },
    {
      key: "rent-history",
      label: "Proof of rent paid — last 6 to 12 months",
      why: "Bank statements, money-order stubs, Venmo / Cash App / Zelle records, anything dated.",
    },
    {
      key: "communications",
      label: "Every text, email, or letter with the landlord",
      why: "Screenshots are fine. Include the dates and the phone number / address shown.",
    },
    {
      key: "income",
      label: "Proof of household income",
      why: "Recent paystubs, benefits letters, or last year's taxes. Most clinics need this for eligibility.",
    },
    {
      key: "id",
      label: "Photo ID for every adult on the lease",
      why: "Clinics need it to open a file. A state ID, passport, or consular card works.",
    },
  ],

  personalizedDocuments: (facts) => {
    const out: { key: string; label: string; why: string }[] = [];
    if (facts.habitabilityIssues && facts.habitabilityIssues.length) {
      out.push({
        key: "habitability-evidence",
        label: `Photos / videos of the condition problems (${facts.habitabilityIssues.join(", ")})`,
        why: "Date-stamped images become both a defense and a possible counterclaim.",
      });
    }
    if (facts.complaintsReported && facts.complaintsReported.length) {
      out.push({
        key: "complaint-records",
        label: "Records of every complaint to landlord, building manager, or code enforcement",
        why: "Texts, emails, voicemails, and any inspection reports. These prove you raised the issue first.",
      });
    }
    if (facts.housingSubsidy) {
      out.push({
        key: "subsidy-documents",
        label: `Your ${facts.housingSubsidy} paperwork`,
        why: "Voucher contract (HAP), recertification letters, and any caseworker contacts.",
      });
    }
    if (facts.disability) {
      out.push({
        key: "reasonable-accommodation",
        label: "Documentation of your disability and any accommodation requests",
        why: "Reasonable-accommodation requests under the Fair Housing Act can pause or stop an eviction.",
      });
    }
    return out;
  },

  defenseRules: [
    {
      id: "habitability",
      headline: "Breach of warranty of habitability",
      why:
        "Almost every state implies a warranty that the apartment is fit to live in. " +
        "If the landlord knew about the condition problems you described and didn't fix them, " +
        "your rent withholding may be lawful and the landlord's case for back rent may be reduced or barred.",
      applies: (f) =>
        Boolean(f.habitabilityIssues && f.habitabilityIssues.length > 0),
    },
    {
      id: "retaliation",
      headline: "Retaliation",
      why:
        "Many states prohibit eviction in retaliation for a tenant complaining to code enforcement, " +
        "the landlord, or a fair-housing agency. If you reported conditions and the eviction came soon after, " +
        "raise this with the attorney.",
      applies: (f) =>
        Boolean(f.complaintsReported && f.complaintsReported.length > 0),
    },
    {
      id: "defective-notice",
      headline: "Defective notice",
      why:
        "Many landlord notices fail technical requirements — wrong notice period, wrong reason stated, " +
        "improper service. A defective notice is its own defense, often a complete one.",
      applies: (f) =>
        Boolean(f.documentsReceived && f.documentsReceived.length > 0),
    },
    {
      id: "subsidy-protections",
      headline: "Subsidized-housing protections",
      why:
        "Subsidized housing (Section 8, public housing, RAFT, MRVP, LIHTC) carries extra notice, " +
        "good-cause, and procedural protections that often defeat or delay eviction.",
      applies: (f) => Boolean(f.housingSubsidy),
    },
    {
      id: "disability-accommodation",
      headline: "Disability / reasonable accommodation",
      why:
        "Under the Fair Housing Act, a landlord must consider reasonable accommodations for tenants with disabilities. " +
        "Many eviction cases pause or settle when a properly framed accommodation request is made.",
      applies: (f) => Boolean(f.disability),
    },
  ],

  consultQuestions: (facts) => {
    const qs: ConsultQuestion[] = [
      {
        q: "Was the notice I received legally proper for this state?",
        why:
          "Many notices fail technical requirements — wrong notice period, wrong reason, improper service. A defective notice is often a complete defense.",
      },
      {
        q: "Has a lawsuit actually been filed, or is this just a pre-suit notice?",
        why: "The deadlines, stakes, and next steps are different at each stage.",
      },
    ];
    if (facts.habitabilityIssues && facts.habitabilityIssues.length) {
      qs.push({
        q:
          "Given the condition issues (" +
          facts.habitabilityIssues.join(", ") +
          "), do I have a warranty-of-habitability defense or counterclaim?",
        why:
          "Habitability defenses can reduce or eliminate back-rent claims and sometimes win damages on top.",
      });
    }
    if (facts.complaintsReported && facts.complaintsReported.length) {
      qs.push({
        q: "Could this be retaliation for the complaints I made?",
        why:
          "Most states prohibit retaliatory eviction. Timing between your complaint and the landlord's action matters.",
      });
    }
    if (facts.housingSubsidy) {
      qs.push({
        q:
          `What extra protections does my ${facts.housingSubsidy} subsidy give me here?`,
        why:
          "Subsidized-housing protections often defeat eviction notices that would otherwise be valid.",
      });
    }
    if (facts.disability) {
      qs.push({
        q: "Could a reasonable-accommodation request help here?",
        why:
          "Fair Housing Act accommodations can pause an eviction and sometimes change the outcome entirely.",
      });
    }
    qs.push({
      q: "Are there any rental-assistance funds open in my city right now?",
      why:
        "Emergency rental assistance can pay back rent and stop the case mid-stream. Programs come and go monthly.",
    });
    qs.push({
      q: "Do I qualify for a free attorney through any local Right-to-Counsel program?",
      why:
        "A growing list of cities and states guarantee free counsel for low-income tenants in eviction cases.",
    });
    if (facts.priorEviction) {
      qs.push({
        q: "How will my prior eviction affect this case and any future apartment search?",
        why:
          "Filings show up on tenant-screening reports for up to 7 years; some are sealable.",
      });
    }
    qs.push({
      q: "If we settle, what should I make sure is in the agreement?",
      why:
        "Settlement language about sealing the case, neutral references, and payment schedules matters more than the dollar number.",
    });
    return qs;
  },
};
