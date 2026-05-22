/**
 * Patrocinium case data — the advocate-facing wrapper around serviceMatters.
 *
 * serviceMatters is the steward's canonical intake record. proBonoCaseMeta
 * augments matters that have been pre-vetted for pro bono publication —
 * adding the fields a lawyer needs to decide in five minutes whether to
 * accept: hours estimate, engagement type, conflicts state, deadline,
 * opposing party, goal, jurisdiction/forum, available templates.
 *
 * Pre-vetting is what removes friction. By the time a case shows up here,
 * a steward has already confirmed: malpractice coverage in place, intake
 * facts gathered, conflicts auto-checked, deadline known. The lawyer
 * answers one question — "can I take this?" — not ten.
 */

import { serviceMatters, type ServiceMatter } from "../../data/demo";

export type EngagementType =
  | "advice-call"
  | "document-review"
  | "limited-scope"
  | "full-representation"
  | "clinic-shift";

export const ENGAGEMENT_LABEL: Record<EngagementType, string> = {
  "advice-call": "Advice call",
  "document-review": "Document review",
  "limited-scope": "Limited-scope rep",
  "full-representation": "Full representation",
  "clinic-shift": "Clinic shift",
};

export type ConflictStatus = "cleared" | "pending" | "auto-cleared";

export type ProBonoCaseMeta = {
  /** The serviceMatter this enriches. */
  matterId: string;
  /** Total hours estimate (1 = "an hour or less", 8 = "morning of work"). */
  hoursEstimate: number;
  engagementType: EngagementType;
  conflicts: ConflictStatus;
  malpracticeCovered: boolean;
  /** ISO date — when something must be filed/answered/decided. */
  deadlineDate?: string;
  opposingParty?: string;
  /** What the client actually wants. */
  goal: string;
  /** Court/agency/forum with jurisdiction. */
  forum?: string;
  /** Short, lawyer-readable note about where the matter sits procedurally. */
  postureNotes?: string;
  /** Guided-template slugs available for this matter (eviction-answer, etc.). */
  templatesAvailable?: string[];
  /** Whether the engagement can be done remote-only. */
  remoteOk?: boolean;
  /**
   * Practice-area tags beyond the matter's category — surfaces matters for
   * lawyers who don't think of themselves as e.g. "immigration" but are
   * comfortable with "asylum interview prep."
   */
  subPractice?: string[];
};

/**
 * Curated pro bono pool — the matters a steward has signed off as ready
 * for advocate publication. Keyed by serviceMatter id.
 */
export const proBonoCaseMeta: Record<string, ProBonoCaseMeta> = {
  "sm-1": {
    matterId: "sm-1",
    hoursEstimate: 4,
    engagementType: "limited-scope",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    deadlineDate: "2026-06-12",
    opposingParty: "(none — internal parish governance)",
    goal: "Bylaws revision draft that survives canon-law overlap with civil property-transfer rules.",
    forum: "Archdiocese of Chicago — chancery review",
    postureNotes:
      "Parish council has approved a revision concept; needs civil-canon harmonization before final adoption. No active litigation.",
    templatesAvailable: ["engagement-letter", "parish-bylaws-checklist"],
    remoteOk: true,
    subPractice: ["bylaws-drafting", "civil-canon-harmonization"],
  },
  "sm-3": {
    matterId: "sm-3",
    hoursEstimate: 2,
    engagementType: "advice-call",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    opposingParty: "(none — advisory)",
    goal: "Memo-grade answer the trustee can rely on at next chancery meeting.",
    forum: "Diocese of Arlington — chancery",
    postureNotes:
      "One 60-minute call plus a short follow-up memo. Fr. Cale already drafted a preliminary view; advisor reviews and stress-tests.",
    templatesAvailable: ["engagement-letter", "juridic-person-property-memo"],
    remoteOk: true,
    subPractice: ["canon-law", "property-tax"],
  },
  "sm-5": {
    matterId: "sm-5",
    hoursEstimate: 12,
    engagementType: "full-representation",
    conflicts: "cleared",
    malpracticeCovered: true,
    deadlineDate: "2026-08-05",
    opposingParty: "Minister of Citizenship & Immigration Canada (IRB hearing)",
    goal: "IRB religious-persecution claim — hearing prep, witness statements, country-conditions evidence binder.",
    forum: "Immigration & Refugee Board of Canada — Toronto",
    postureNotes:
      "Four claimants; one binder of country-conditions evidence can serve all. Two languages on the witness side — Farsi and Tigrinya. Interpreter coordinated by RCN.",
    templatesAvailable: ["engagement-letter", "irb-witness-statement", "country-conditions-binder"],
    remoteOk: false,
    subPractice: ["asylum", "refugee-claims", "religious-liberty"],
  },
  "sm-8": {
    matterId: "sm-8",
    hoursEstimate: 6,
    engagementType: "limited-scope",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    deadlineDate: "2026-06-04",
    opposingParty: "Allston Realty Trust LLC (landlord)",
    goal: "Answer notice-to-quit; preserve voucher transfer; avoid summary process before next hearing.",
    forum: "Boston Housing Court — Eastern Division",
    postureNotes:
      "Spanish-first client. Sealed lease in hand. Section-8 portability paperwork stalled at HUD — voucher needs preservation pending transfer.",
    templatesAvailable: ["engagement-letter", "eviction-answer", "voucher-preservation-letter"],
    remoteOk: false,
    subPractice: ["housing-court", "section-8"],
  },
  "sm-9": {
    matterId: "sm-9",
    hoursEstimate: 3,
    engagementType: "document-review",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    opposingParty: "(none — record sealing)",
    goal: "Sealing petition filed under M.G.L. c. 276 § 100A for two 2018 misdemeanors.",
    forum: "Boston Municipal Court — Central Division (Probation)",
    postureNotes:
      "Client willing to file pro se if guided. Lawyer review of petition packet + one prep call should be enough. No hearing required for 100A.",
    templatesAvailable: ["engagement-letter", "sealing-petition-100a"],
    remoteOk: true,
    subPractice: ["record-sealing", "expungement"],
  },
  "sm-10": {
    matterId: "sm-10",
    hoursEstimate: 2,
    engagementType: "advice-call",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    opposingParty: "(none — pre-application advisory)",
    goal: "Document checklist + intake call so the family arrives prepared to a sponsorship consult.",
    forum: "IRCC — family-class sponsorship",
    postureNotes:
      "French/Lingala primary. RCN has lined up an interpreter. Goal is to remove the most expensive hour from a future paid consult by doing the prep here.",
    templatesAvailable: ["engagement-letter", "sponsorship-document-checklist"],
    remoteOk: true,
    subPractice: ["immigration", "family-sponsorship"],
  },
  "sm-11": {
    matterId: "sm-11",
    hoursEstimate: 4,
    engagementType: "limited-scope",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    opposingParty: "(none — estate planning)",
    goal: "Will, health-care proxy, and durable POA. No contested estate.",
    forum: "(none — non-contentious; recorded with probate registry on death)",
    postureNotes:
      "Adult daughter present at intake and willing to be HCP agent. Straightforward set; could be done as a 2-hour clinic shift if a lawyer prefers that format.",
    templatesAvailable: ["engagement-letter", "simple-will", "hcp-form-mass"],
    remoteOk: true,
    subPractice: ["estate-planning", "elder-law"],
  },
  "sm-4": {
    matterId: "sm-4",
    hoursEstimate: 8,
    engagementType: "limited-scope",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    deadlineDate: "2026-07-15",
    opposingParty: "Former spouse · pro se",
    goal:
      "Custody modification + civil custody motion paired with tribunal-side annulment advocacy.",
    forum: "Middlesex Probate & Family Court (Cambridge)",
    postureNotes:
      "Civil and canon-law tracks running in parallel — civil custody motion on the schedule and the annulment-tribunal advocacy proceeding through the Archdiocese. Sr. Anne Marie carries the tribunal piece; civil counsel needed for the modification.",
    templatesAvailable: ["engagement-letter", "family-law-modification"],
    remoteOk: false,
    subPractice: ["family-law", "probate-family", "tribunal-civil-overlap"],
  },
  "sm-12": {
    matterId: "sm-12",
    hoursEstimate: 8,
    engagementType: "limited-scope",
    conflicts: "auto-cleared",
    malpracticeCovered: true,
    deadlineDate: "2026-07-10",
    opposingParty: "Social Security Administration (SSA)",
    goal: "Request for reconsideration on SSI disability denial; if denied, position for ALJ hearing.",
    forum: "SSA Chicago Region — Office of Disability Adjudication",
    postureNotes:
      "Treating-physician letter already in hand. Disability onset disputed. 60-day window to request reconsideration starts the clock at denial notice date.",
    templatesAvailable: ["engagement-letter", "ssi-reconsideration", "medical-records-request"],
    remoteOk: true,
    subPractice: ["public-benefits", "disability"],
  },
};

/* ------------------------------------------------------------------ */
/* Selectors                                                            */
/* ------------------------------------------------------------------ */

export type PatrociniumCase = {
  matter: ServiceMatter;
  meta: ProBonoCaseMeta;
};

/** All matters in the pro bono pool, joined with their service-matter data. */
export function allCases(): PatrociniumCase[] {
  return Object.values(proBonoCaseMeta)
    .map((meta) => {
      const matter = serviceMatters.find((m) => m.id === meta.matterId);
      return matter ? { matter, meta } : null;
    })
    .filter((x): x is PatrociniumCase => x !== null);
}

export function getCase(matterId: string): PatrociniumCase | null {
  const meta = proBonoCaseMeta[matterId];
  if (!meta) return null;
  const matter = serviceMatters.find((m) => m.id === matterId);
  return matter ? { matter, meta } : null;
}

export type CaseFilters = {
  category?: string;
  region?: string;
  language?: string;
  engagementType?: EngagementType;
  maxHours?: number;
  remoteOnly?: boolean;
  urgency?: ServiceMatter["urgency"];
};

export function filterCases(
  cases: PatrociniumCase[],
  filters: CaseFilters
): PatrociniumCase[] {
  return cases.filter(({ matter, meta }) => {
    if (filters.category && matter.category !== filters.category) return false;
    if (filters.region && !matter.region.includes(filters.region)) return false;
    if (filters.language) {
      if (!matter.languages || !matter.languages.includes(filters.language))
        return false;
    }
    if (filters.engagementType && meta.engagementType !== filters.engagementType)
      return false;
    if (filters.maxHours && meta.hoursEstimate > filters.maxHours) return false;
    if (filters.remoteOnly && !meta.remoteOk) return false;
    if (filters.urgency && matter.urgency !== filters.urgency) return false;
    return true;
  });
}

/**
 * Sort cases by an "advocate priority" — urgent + soonest deadline first,
 * smallest hours-estimate second (so bite-sized commitments surface).
 */
export function sortByAdvocatePriority(cases: PatrociniumCase[]): PatrociniumCase[] {
  const urgencyOrder: Record<ServiceMatter["urgency"], number> = {
    urgent: 0,
    soon: 1,
    routine: 2,
  };
  return [...cases].sort((a, b) => {
    const u = urgencyOrder[a.matter.urgency] - urgencyOrder[b.matter.urgency];
    if (u !== 0) return u;
    if (a.meta.deadlineDate && b.meta.deadlineDate) {
      const d = a.meta.deadlineDate.localeCompare(b.meta.deadlineDate);
      if (d !== 0) return d;
    } else if (a.meta.deadlineDate) {
      return -1;
    } else if (b.meta.deadlineDate) {
      return 1;
    }
    return a.meta.hoursEstimate - b.meta.hoursEstimate;
  });
}

/** Distinct categories present in the pool — for the filter UI. */
export function poolCategories(): string[] {
  return [...new Set(allCases().map((c) => c.matter.category))].sort();
}

/** Distinct regions present in the pool. */
export function poolRegions(): string[] {
  return [...new Set(allCases().map((c) => c.matter.region))].sort();
}

/** Distinct non-English languages present in the pool. */
export function poolLanguages(): string[] {
  const langs = new Set<string>();
  for (const c of allCases()) {
    for (const l of c.matter.languages ?? []) {
      if (l !== "en") langs.add(l);
    }
  }
  return [...langs].sort();
}
