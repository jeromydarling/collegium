/**
 * The Auxilium legal-help directory.
 *
 * Comprehensive listing of every avenue a person can actually use to get
 * legal help in the United States — free, reduced-rate, paid subscription,
 * faith-based, and self-help. Each entry is categorized and tagged with
 * the states / matter types it covers so the FindHelp page can filter
 * intelligently.
 *
 * Editor note: this catalogue is the spine of "Auxilium as the #1
 * source for people who need legal help." Add resources here as we
 * discover them. Tag honestly. Never promise.
 *
 * LegalShield is listed as a paid subscription option with an explicit
 * affiliate-disclosure flag. Their affiliate program pays roughly $50
 * per signup; replace AFFILIATE_CODE in the URL with the real referral
 * code before going live.
 */

export type Resource = {
  id: string;
  name: string;
  url: string;
  blurb: string;
  category:
    | "legal-aid" // LSC-funded free legal aid for low-income
    | "faith-based" // Christian / Catholic / Jewish / Muslim legal aid
    | "law-school-clinic" // Law school clinics
    | "bar-referral" // Bar association lawyer referral
    | "self-help" // Document assembly, court self-help portals
    | "hotline" // Phone-first help
    | "specialized" // DV, veterans, elderly, immigration, etc.
    | "paid-subscription" // LegalShield, LegalZoom etc.
    | "court" // Court system itself
    | "directory"; // Aggregator / locator
  scope: "national" | "state" | "metro";
  /** ISO state codes covered (empty = national). */
  states?: string[];
  /** Matter types this resource handles. */
  handles: string[];
  /** Eligibility — usually income-based for free aid. */
  eligibility?: string;
  /** Indicates affiliate / monetization. Must be visibly disclosed. */
  affiliate?: {
    note: string;
  };
  /** Phone number if available. */
  phone?: string;
  /** Optional ranking signal — higher = surface first. */
  weight?: number;
};

// ─── NATIONAL DIRECTORIES (always show these) ──────────────────────────

const NATIONAL_DIRECTORIES: Resource[] = [
  {
    id: "lawhelp",
    name: "LawHelp.org",
    url: "https://www.lawhelp.org/",
    blurb:
      "The largest national directory of free civil legal help, organized by zip code. Searches every LSC-funded program plus state-by-state nonprofit legal aid orgs.",
    category: "directory",
    scope: "national",
    handles: ["all"],
    eligibility: "Most listed orgs serve people at or below 125–200% of the federal poverty level.",
    weight: 100,
  },
  {
    id: "lsc-get-help",
    name: "LSC — Find Legal Aid",
    url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
    blurb:
      "Locator for the 130+ LSC-funded legal aid programs serving every U.S. state, territory, and tribal lands. The federal program for low-income civil legal help.",
    category: "legal-aid",
    scope: "national",
    handles: ["all"],
    eligibility: "Generally 125% of the federal poverty level, with discretion up to 200%.",
    weight: 99,
  },
  {
    id: "211",
    name: "211 — Community Help Line",
    url: "https://www.211.org/",
    blurb:
      "Free, confidential, 24/7 directory. Call or text 211. Connects to local legal aid, rental assistance, food, shelter, and more.",
    category: "hotline",
    scope: "national",
    handles: ["all"],
    phone: "211",
    weight: 95,
  },
  {
    id: "aba-free-legal-answers",
    name: "ABA Free Legal Answers",
    url: "https://www.americanbar.org/groups/legal_services/flh-home/",
    blurb:
      "Post a civil legal question online — a volunteer attorney in your state answers. Free, no in-person meeting required.",
    category: "legal-aid",
    scope: "national",
    handles: ["all", "family", "housing", "consumer", "debt", "estate"],
    eligibility: "Household income generally under 250% of the federal poverty level.",
    weight: 92,
  },
  {
    id: "lawhelp-interactive",
    name: "LawHelp Interactive",
    url: "https://lawhelpinteractive.org/",
    blurb:
      "Free, guided document-assembly. Walk through a Q&A and get court-ready forms — divorce, name change, eviction answer, expungement, more.",
    category: "self-help",
    scope: "national",
    handles: ["family", "housing", "expungement", "estate", "debt"],
    weight: 88,
  },
  {
    id: "courthelp",
    name: "Court self-help centers (by state)",
    url: "https://www.ncsc.org/consulting-and-research/areas-of-expertise/access-and-fairness/self-represented-litigation",
    blurb:
      "Most state courts run a self-help center that can explain procedure, deadlines, and forms — for free, without giving legal advice. Search '[your state] court self-help'.",
    category: "court",
    scope: "national",
    handles: ["all"],
    weight: 85,
  },
];

// ─── FAITH-BASED NETWORKS ──────────────────────────────────────────────

const FAITH_BASED: Resource[] = [
  {
    id: "cls-clinic-directory",
    name: "Christian Legal Society — Clinic Directory",
    url: "https://www.christianlegalsociety.org/cla/clinic-directory/",
    blurb:
      "Directory of 65+ church-attached Christian Legal Aid clinics across the U.S. Most run monthly Saturday clinics offering brief consultations, advice, and referrals.",
    category: "faith-based",
    scope: "national",
    handles: ["all", "family", "housing", "debt", "estate", "expungement"],
    weight: 98,
  },
  {
    id: "clinic-affiliates",
    name: "CLINIC — Catholic Legal Immigration Network",
    url: "https://www.cliniclegal.org/find-legal-help/affiliates/directory",
    blurb:
      "420+ Catholic and faith-based immigration legal-services nonprofits across 49 states + DC. Largest immigration legal aid network in the country.",
    category: "faith-based",
    scope: "national",
    handles: ["immigration"],
    weight: 97,
  },
  {
    id: "administer-justice",
    name: "Administer Justice — Gospel Justice Centers",
    url: "https://www.administerjustice.org/gethelp/",
    blurb:
      "80+ church-based Christian legal clinics nationally. Saturday-morning brief consults with attorneys and trained volunteers; small ($30) suggested copay.",
    category: "faith-based",
    scope: "national",
    handles: ["all", "family", "housing", "debt", "estate"],
    weight: 95,
  },
  {
    id: "catholic-charities",
    name: "Catholic Charities — Find Your Local Office",
    url: "https://www.catholiccharitiesusa.org/find-help/",
    blurb:
      "168 independent diocesan Catholic Charities agencies across the U.S. Many run immigration legal services; some offer broader legal help, mediation, and family services.",
    category: "faith-based",
    scope: "national",
    handles: ["immigration", "family", "all"],
    weight: 92,
  },
  {
    id: "world-relief-legal",
    name: "World Relief — Legal Support Network",
    url: "https://worldrelief.org/legal-support-network/",
    blurb:
      "25+ evangelical church-based immigration legal services sites. Affordable consultations, DOJ-accredited representatives, and pro bono attorney support.",
    category: "faith-based",
    scope: "national",
    handles: ["immigration"],
    weight: 90,
  },
  {
    id: "global-refuge",
    name: "Global Refuge (formerly LIRS) — Immigration Legal Services",
    url: "https://www.globalrefuge.org/what-we-do/immigration-legal-services/",
    blurb:
      "Lutheran network providing refugee resettlement and immigration legal services. Recently joined CLINIC as affiliated members.",
    category: "faith-based",
    scope: "national",
    handles: ["immigration"],
    weight: 87,
  },
  {
    id: "hias-legal",
    name: "HIAS — Legal Services",
    url: "https://hias.org/legal-services/",
    blurb:
      "Jewish refugee and immigration legal services. Direct services in NYC and DC; nationwide pro bono partner network.",
    category: "faith-based",
    scope: "national",
    handles: ["immigration"],
    weight: 85,
  },
  {
    id: "clf-canada",
    name: "Christian Legal Fellowship (Canada)",
    url: "https://www.christianlegalfellowship.org/",
    blurb:
      "National Canadian association of Christian lawyers and law students. Lawyer Referral Service to find a Christian lawyer near you.",
    category: "faith-based",
    scope: "national",
    handles: ["all"],
    weight: 80,
  },
];

// ─── SPECIALIZED (population- or matter-specific) ──────────────────────

const SPECIALIZED: Resource[] = [
  {
    id: "ndvh",
    name: "National Domestic Violence Hotline",
    url: "https://www.thehotline.org/",
    blurb:
      "24/7 confidential help. Connects to local legal aid for protection orders, safety planning, and shelter. Call, text, or chat online.",
    category: "specialized",
    scope: "national",
    handles: ["family", "protection-order", "domestic-violence"],
    phone: "1-800-799-7233",
    weight: 96,
  },
  {
    id: "civil-rtc",
    name: "National Right to Counsel — Tenant Tracker",
    url: "https://civilrighttocounsel.org/major_developments/right-to-counsel-tenant",
    blurb:
      "Tracks which U.S. cities and states guarantee free legal counsel for low-income tenants facing eviction. Currently: NYC, San Francisco, Cleveland, Detroit, Philadelphia, Newark, Toledo, Boulder, Kansas City MO, Louisville, plus CT and WA statewide.",
    category: "specialized",
    scope: "national",
    handles: ["housing", "eviction"],
    weight: 94,
  },
  {
    id: "nclr-veterans",
    name: "National Veterans Legal Services Program",
    url: "https://www.nvlsp.org/",
    blurb:
      "Free legal help for veterans on VA disability claims, discharge upgrades, and military-related civil matters.",
    category: "specialized",
    scope: "national",
    handles: ["veterans", "benefits", "disability"],
    weight: 90,
  },
  {
    id: "stateside-legal",
    name: "Stateside Legal — Veterans & Military",
    url: "https://statesidelegal.org/",
    blurb:
      "Legal information and self-help for U.S. service members, veterans, and their families. Plain-English, jurisdiction-aware.",
    category: "specialized",
    scope: "national",
    handles: ["veterans", "benefits", "family"],
    weight: 88,
  },
  {
    id: "justice-in-aging",
    name: "Justice in Aging",
    url: "https://justiceinaging.org/get-help/",
    blurb:
      "Legal advocacy for older adults in poverty. Senior legal hotlines in most states for people 60+.",
    category: "specialized",
    scope: "national",
    handles: ["elderly", "benefits", "medicare", "medicaid"],
    weight: 87,
  },
  {
    id: "nilc",
    name: "National Immigration Law Center — Find Help",
    url: "https://www.nilc.org/get-involved/find-immigration-legal-services/",
    blurb:
      "Directory of nonprofit immigration legal services across the country, with DOJ-accredited representatives.",
    category: "specialized",
    scope: "national",
    handles: ["immigration"],
    weight: 86,
  },
  {
    id: "civil-legal-aid-domestic-violence",
    name: "National Network to End Domestic Violence",
    url: "https://nnedv.org/resources-library/",
    blurb:
      "Connects to local domestic-violence programs that include civil legal advocacy: protection orders, custody, divorce, housing protections.",
    category: "specialized",
    scope: "national",
    handles: ["family", "protection-order", "domestic-violence", "housing"],
    weight: 85,
  },
  {
    id: "nlchp",
    name: "National Homelessness Law Center",
    url: "https://homelesslaw.org/",
    blurb:
      "Civil-rights advocacy for unhoused people. Resources and referrals for housing, encampment defense, public-benefits access.",
    category: "specialized",
    scope: "national",
    handles: ["housing", "benefits"],
    weight: 82,
  },
];

// ─── PAID SUBSCRIPTION (clearly disclosed) ─────────────────────────────

const PAID: Resource[] = [
  {
    id: "legalshield",
    name: "LegalShield — Legal subscription plans",
    // Replace AFFILIATE_CODE with the real affiliate / associate ID before launch.
    url: "https://www.legalshield.com/?associate=AFFILIATE_CODE",
    blurb:
      "Roughly $25–$35/month gets you a dedicated law firm in your state for unlimited phone consultations, letter-writing, document review, and 25% off most major matters. Best for people just above legal-aid eligibility ($30K–$60K household income) who can't afford $300/hr private rates but can budget a small monthly fee.",
    category: "paid-subscription",
    scope: "national",
    handles: ["all", "family", "estate", "debt", "consumer", "housing"],
    eligibility: "No income limit — open to anyone who can afford the monthly subscription.",
    affiliate: {
      note: "Auxilium receives a small referral fee if you sign up. This does not change what you pay or what services you receive. We list LegalShield because it's a real, established option for people priced out of both legal aid and private attorneys.",
    },
    weight: 75,
  },
  {
    id: "hello-divorce",
    name: "Hello Divorce",
    url: "https://hellodivorce.com/",
    blurb:
      "Flat-fee divorce service. DIY plan from $99; assisted plans $1,500+. Full filing in CA/CO/NY/TX/UT; document help in all 50 states. Designed for uncontested or low-conflict divorces.",
    category: "paid-subscription",
    scope: "national",
    handles: ["family", "divorce"],
    eligibility: "No income limit.",
    weight: 70,
  },
  {
    id: "upsolve",
    name: "Upsolve — Free Chapter 7 bankruptcy",
    url: "https://upsolve.org/",
    blurb:
      "Free, nonprofit, TurboTax-style filing for Chapter 7 bankruptcy. For people overwhelmed by debt with few assets. Has erased $911M+ in debt for 19,000+ families.",
    category: "self-help",
    scope: "national",
    handles: ["debt", "bankruptcy"],
    eligibility: "For people who qualify for Chapter 7 — generally below median state income.",
    weight: 92,
  },
  {
    id: "solosuit",
    name: "Solo (SoloSuit) — Debt-collection defense",
    url: "https://www.solosuit.com/",
    blurb:
      "Builds a free Answer to a debt-collection lawsuit in minutes. Optional paid review and settlement-negotiation services. The standard tool for pro se debt defense.",
    category: "self-help",
    scope: "national",
    handles: ["debt"],
    weight: 90,
  },
];

// ─── ALL RESOURCES ─────────────────────────────────────────────────────

export const directory: Resource[] = [
  ...NATIONAL_DIRECTORIES,
  ...FAITH_BASED,
  ...SPECIALIZED,
  ...PAID,
];

export const CATEGORY_LABEL: Record<Resource["category"], string> = {
  "directory": "Find legal help (locators)",
  "legal-aid": "Free legal aid",
  "faith-based": "Faith-based legal help",
  "law-school-clinic": "Law school clinics",
  "bar-referral": "Bar association referrals",
  "self-help": "Self-help & document assembly",
  "hotline": "Hotlines",
  "specialized": "Specialized help",
  "paid-subscription": "Paid options (low cost)",
  "court": "Court self-help centers",
};

/**
 * Order in which categories appear on FindHelp. Free options first;
 * paid subscription clearly demarcated near the bottom.
 */
export const CATEGORY_ORDER: Resource["category"][] = [
  "directory",
  "legal-aid",
  "faith-based",
  "specialized",
  "self-help",
  "hotline",
  "court",
  "law-school-clinic",
  "bar-referral",
  "paid-subscription",
];

export function filterByState(state: string | undefined): Resource[] {
  if (!state) return directory;
  return directory.filter(
    (r) => !r.states || r.states.length === 0 || r.states.includes(state)
  );
}

export function groupByCategory(resources: Resource[]): Map<Resource["category"], Resource[]> {
  const map = new Map<Resource["category"], Resource[]>();
  for (const cat of CATEGORY_ORDER) map.set(cat, []);
  for (const r of resources) {
    const arr = map.get(r.category) ?? [];
    arr.push(r);
    map.set(r.category, arr);
  }
  // Sort within each category by weight desc.
  for (const [k, arr] of map.entries()) {
    map.set(
      k,
      arr.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
    );
  }
  return map;
}
