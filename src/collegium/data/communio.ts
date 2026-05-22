/**
 * Communio demo data — peer guilds in the federated network.
 *
 * These are SEPARATE TENANTS from your guild ("Catholic Legal Network",
 * the demo tenant whose chapters live in demo.ts). Each peer guild is a
 * different organization that has joined Communio; signals are exchanged
 * through the sanitizer at /lib/communio/buildSharedSignal.ts.
 *
 * All names, regions, and numbers are fictional but representative of
 * real Catholic legal-aid and pro-bono guild ecology.
 */

export type GuildRegion = "midwest" | "northeast" | "south" | "west" | "canada";
export type GuildType =
  | "guild"
  | "law-school"
  | "diocesan-network"
  | "national-affiliate"
  | "religious-order";

export type ConnectionStatus =
  | "connected"
  | "pending-outgoing"
  | "pending-incoming"
  | "suggested"
  | "discovered";

/**
 * Trust tiers govern what gets shared with a connected peer:
 *   covenant  — full sharing: signals + referrals + roster awareness
 *   partner   — referrals + practice patterns; no roster
 *   network   — generic signals only (patterns, alerts), no referrals
 */
export type TrustTier = "covenant" | "partner" | "network";

export type PeerGuild = {
  id: string;
  name: string;
  short: string;
  slug: string;
  city: string;
  state: string;
  region: GuildRegion;
  type: GuildType;
  foundedYear: number;
  chapters: number;
  members: number;
  advocates: number;
  focusAreas: string[];
  languages: string[];
  bio: string;
  connection: ConnectionStatus;
  trustTier?: TrustTier;
  connectedSince?: string;
  /** Hint shown on directory cards — last meaningful exchange. */
  recentActivity?: string;
  /** Why Communio is recommending this peer for connection. */
  suggestionReason?: string;
};

export type PeerSignalCategory =
  | "pattern"
  | "request"
  | "celebration"
  | "alert"
  | "knowledge";

export type PeerSignal = {
  id: string;
  peerGuildId: string;
  publishedAt: string;
  category: PeerSignalCategory;
  scope: "guild" | "chapter" | "practice-area";
  headline: string;
  body: string;
  /** Already-sanitized supporting hints — never raw PII. */
  signals: string[];
  shareLevel: TrustTier;
  redactionCount: number;
};

export type PeerReferral = {
  id: string;
  direction: "outgoing" | "incoming";
  peerGuildId: string;
  category: string;
  region: string;
  languages: string[];
  urgency: "urgent" | "soon" | "routine";
  summary: string;
  status: "open" | "accepted" | "declined" | "completed";
  createdAt: string;
  /** When status moved off open. */
  respondedAt?: string;
  /** For outgoing referrals — the local matter id we sent. */
  localMatterId?: string;
};

/* ------------------------------------------------------------------ */
/* Peer Guilds (the network of advocates beyond your guild)            */
/* ------------------------------------------------------------------ */

export const peerGuilds: PeerGuild[] = [
  {
    id: "pg-sacred-heart-phoenix",
    name: "Sacred Heart Legal Aid",
    short: "Sacred Heart Phoenix",
    slug: "sacred-heart-phoenix",
    city: "Phoenix",
    state: "AZ",
    region: "west",
    type: "diocesan-network",
    foundedYear: 2019,
    chapters: 3,
    members: 87,
    advocates: 24,
    focusAreas: ["immigration", "family", "religious-liberty"],
    languages: ["en", "es"],
    bio: "A diocesan-aligned legal aid serving the Phoenix metropolitan area. Founded out of the Sacred Heart Catholic Charities legal clinic, now operating three chapters across Maricopa County and the West Valley. Heavy immigration practice; growing canon-law-adjacent religious-liberty bench.",
    connection: "connected",
    trustTier: "covenant",
    connectedSince: "2024-03",
    recentActivity: "Accepted 2 immigration referrals last month",
  },
  {
    id: "pg-pro-bono-ny",
    name: "Catholic Pro Bono Society of New York",
    short: "Catholic Pro Bono NY",
    slug: "pro-bono-ny",
    city: "New York",
    state: "NY",
    region: "northeast",
    type: "guild",
    foundedYear: 2008,
    chapters: 4,
    members: 156,
    advocates: 41,
    focusAreas: ["housing", "expungement", "public-benefits", "family"],
    languages: ["en", "es", "fr", "ru"],
    bio: "Five-borough network of advocates founded by the Catholic Lawyers' Guild of New York. Long-standing housing-court practice in Brooklyn and Bronx; expungement clinic partnership with Fordham Law.",
    connection: "connected",
    trustTier: "partner",
    connectedSince: "2023-09",
    recentActivity: "Published a housing-pattern signal 4 days ago",
  },
  {
    id: "pg-aquinas-houston",
    name: "Aquinas Legal Fellowship",
    short: "Aquinas Houston",
    slug: "aquinas-houston",
    city: "Houston",
    state: "TX",
    region: "south",
    type: "guild",
    foundedYear: 2016,
    chapters: 2,
    members: 73,
    advocates: 19,
    focusAreas: ["immigration", "estate-planning", "parish-governance"],
    languages: ["en", "es", "vi"],
    bio: "Texas guild grown out of the Aquinas Center at the University of St. Thomas Houston. Strong parish-governance work alongside the Archdiocese of Galveston–Houston; growing Vietnamese-Catholic immigration practice.",
    connection: "connected",
    trustTier: "network",
    connectedSince: "2025-01",
    recentActivity: "Joined Communio 5 months ago",
  },
  {
    id: "pg-st-vincent-sf",
    name: "St. Vincent Counsel SF",
    short: "St. Vincent SF",
    slug: "st-vincent-sf",
    city: "San Francisco",
    state: "CA",
    region: "west",
    type: "guild",
    foundedYear: 2022,
    chapters: 2,
    members: 64,
    advocates: 18,
    focusAreas: ["immigration", "indigent-defense", "housing"],
    languages: ["en", "es", "zh"],
    bio: "Newer Bay Area guild founded out of St. Vincent de Paul Society of San Francisco. Mixed indigent-defense and housing-court work, with a growing immigration intake that complements the diocesan migration office.",
    connection: "pending-outgoing",
    recentActivity: "Connection invite sent 3 days ago",
    suggestionReason: "Strong immigration practice — complements Chicago's Pilsen clinic",
  },
  {
    id: "pg-john-fisher-denver",
    name: "John Fisher Society",
    short: "John Fisher Denver",
    slug: "john-fisher-denver",
    city: "Denver",
    state: "CO",
    region: "west",
    type: "guild",
    foundedYear: 2014,
    chapters: 2,
    members: 91,
    advocates: 27,
    focusAreas: ["religious-liberty", "canon-law", "estate-planning"],
    languages: ["en", "es"],
    bio: "Rocky Mountain region society named for the English martyr St. John Fisher. Strongest canon-law-adjacent religious-liberty bench in the federation — runs an annual symposium with the Archdiocese of Denver.",
    connection: "suggested",
    suggestionReason: "Canon-law bench would unlock parish-governance lane Fr. Cale currently absorbs alone",
    recentActivity: "Active on Communio · 14 peer signals in the past 30 days",
  },
  {
    id: "pg-marquette-fellowship",
    name: "Marquette Catholic Law Fellowship",
    short: "Marquette Fellowship",
    slug: "marquette-fellowship",
    city: "Milwaukee",
    state: "WI",
    region: "midwest",
    type: "law-school",
    foundedYear: 2011,
    chapters: 1,
    members: 48,
    advocates: 11,
    focusAreas: ["family", "expungement", "indigent-defense"],
    languages: ["en", "es", "hmn"],
    bio: "Student-and-alumni fellowship rooted at Marquette Law. Strongest training pipeline in the upper Midwest — supplies young-lawyer formation cohorts to nearby guilds and runs a Hmong-language family-law clinic with Catholic Charities.",
    connection: "suggested",
    suggestionReason: "Sends young-lawyer formation cohorts to Chicago and Detroit annually",
    recentActivity: "Joined Communio last week",
  },
  {
    id: "pg-emmaus-tampa",
    name: "Emmaus Legal Society",
    short: "Emmaus Tampa",
    slug: "emmaus-tampa",
    city: "Tampa",
    state: "FL",
    region: "south",
    type: "guild",
    foundedYear: 2020,
    chapters: 2,
    members: 56,
    advocates: 15,
    focusAreas: ["immigration", "housing", "public-benefits"],
    languages: ["en", "es", "ht"],
    bio: "Gulf-coast guild centered on the Diocese of St. Petersburg. Haitian-creole capacity built up in 2024 in partnership with Catholic Charities Tampa Bay; co-runs a quarterly housing-court bench bar with the diocesan office.",
    connection: "discovered",
    recentActivity: "Profile published 2 months ago — no shared signals yet",
  },
];

/* ------------------------------------------------------------------ */
/* Peer Signals (sanitized briefings published by connected peers)    */
/* ------------------------------------------------------------------ */

export const peerSignals: PeerSignal[] = [
  {
    id: "ps-1",
    peerGuildId: "pg-sacred-heart-phoenix",
    publishedAt: "2026-05-18",
    category: "pattern",
    scope: "practice-area",
    headline: "I-589 backlog stretching past 36 months",
    body: "Phoenix asylum docket is now scheduling merits hearings out to early 2029. Affirmative cases filed in 2023 are still without interview notices. Pattern is consistent across three Phoenix-area immigration offices.",
    signals: [
      "Hearings scheduling out 36+ months",
      "No movement on 2023-filed affirmatives",
      "Confirmed across 3 offices",
    ],
    shareLevel: "covenant",
    redactionCount: 0,
  },
  {
    id: "ps-2",
    peerGuildId: "pg-pro-bono-ny",
    publishedAt: "2026-05-19",
    category: "pattern",
    scope: "practice-area",
    headline: "Brooklyn housing court — pro se litigants spiking",
    body: "Pro se litigant rate in Brooklyn housing court has climbed steadily since February, now ~58% of new petitions. Tenant-side legal aid intake is at capacity through July. Court-appointed counsel program saturated.",
    signals: [
      "~58% pro se rate (was 41% in Q4)",
      "Tenant-side intake saturated",
      "Court counsel program at cap",
    ],
    shareLevel: "partner",
    redactionCount: 0,
  },
  {
    id: "ps-3",
    peerGuildId: "pg-sacred-heart-phoenix",
    publishedAt: "2026-05-16",
    category: "request",
    scope: "guild",
    headline: "Looking for Spanish-fluent volunteer attorney coverage",
    body: "Pilsen-style Spanish-fluent volunteer coverage needed for May 29 family-law clinic in Maryvale. One advocate out on leave; second is at conflict. Two-hour shifts.",
    signals: [
      "May 29 Maryvale family-law clinic",
      "Two-hour shifts",
      "Spanish fluency required",
    ],
    shareLevel: "covenant",
    redactionCount: 0,
  },
  {
    id: "ps-4",
    peerGuildId: "pg-aquinas-houston",
    publishedAt: "2026-05-14",
    category: "knowledge",
    scope: "practice-area",
    headline: "New diocesan canon-law memo on parish bylaws posted",
    body: "Galveston-Houston chancery published a memo clarifying parish-council bylaw requirements after the 2024 instruction. Useful template for any parish-governance work in dioceses applying the same instruction.",
    signals: [
      "Galveston-Houston chancery memo",
      "Parish-council bylaws under 2024 instruction",
      "Template adaptable for other dioceses",
    ],
    shareLevel: "network",
    redactionCount: 0,
  },
  {
    id: "ps-5",
    peerGuildId: "pg-pro-bono-ny",
    publishedAt: "2026-05-12",
    category: "celebration",
    scope: "guild",
    headline: "Fordham expungement clinic — 200th sealed record",
    body: "Five-year-running expungement clinic with Fordham Law just closed its 200th sealed-record case. Average post-sealing employment outcome reported as positive in 81% of follow-ups at six months.",
    signals: [
      "200 sealed records (5 years)",
      "81% positive employment outcome at 6mo",
      "Fordham Law partnership",
    ],
    shareLevel: "partner",
    redactionCount: 0,
  },
  {
    id: "ps-6",
    peerGuildId: "pg-aquinas-houston",
    publishedAt: "2026-05-08",
    category: "alert",
    scope: "practice-area",
    headline: "Vietnamese-Catholic immigration scam reported in Houston",
    body: "Two parishes reported the same notario-style scam targeting Vietnamese-Catholic families with bogus naturalization filings. Forms collected with cash deposits, no work performed. Warn-out drafted; ready for adaptation.",
    signals: [
      "Two parishes affected",
      "Notario-style scam pattern",
      "Naturalization filings, cash deposits",
    ],
    shareLevel: "network",
    redactionCount: 0,
  },
];

/* ------------------------------------------------------------------ */
/* Peer Referrals (cross-guild matter handoffs, sanitized)            */
/* ------------------------------------------------------------------ */

export const peerReferrals: PeerReferral[] = [
  {
    id: "pr-1",
    direction: "incoming",
    peerGuildId: "pg-sacred-heart-phoenix",
    category: "immigration",
    region: "Chicago, IL",
    languages: ["es"],
    urgency: "soon",
    summary:
      "Phoenix family relocating to Chicago this summer. Open removal proceedings — venue change needed and continuity of counsel. Spanish primary, English limited. Two children school-age.",
    status: "accepted",
    createdAt: "2026-05-10",
    respondedAt: "2026-05-11",
  },
  {
    id: "pr-2",
    direction: "incoming",
    peerGuildId: "pg-pro-bono-ny",
    category: "housing",
    region: "Chicago, IL",
    languages: ["en"],
    urgency: "urgent",
    summary:
      "Former NY tenant moving to Chicago after eviction. Section 8 voucher portability paperwork stalled. Needs help opening a CHA case and avoiding a homelessness gap. 14-day window.",
    status: "accepted",
    createdAt: "2026-05-15",
    respondedAt: "2026-05-15",
  },
  {
    id: "pr-3",
    direction: "outgoing",
    peerGuildId: "pg-sacred-heart-phoenix",
    category: "immigration",
    region: "Phoenix, AZ",
    languages: ["es", "en"],
    urgency: "soon",
    summary:
      "Family completed Chicago-side asylum filing, now relocating back to Phoenix to be near extended family. Needs continuity counsel for next master calendar in October. All documents on hand.",
    status: "accepted",
    createdAt: "2026-05-03",
    respondedAt: "2026-05-04",
    localMatterId: "sm-velasquez-09",
  },
  {
    id: "pr-4",
    direction: "outgoing",
    peerGuildId: "pg-pro-bono-ny",
    category: "expungement",
    region: "Brooklyn, NY",
    languages: ["en"],
    urgency: "routine",
    summary:
      "Chicago client moved to Brooklyn for work; old IL conviction eligible for sealing in NY under new statute. Looking for Fordham-clinic intake handoff. No urgency — six-month window.",
    status: "open",
    createdAt: "2026-05-20",
  },
  {
    id: "pr-5",
    direction: "incoming",
    peerGuildId: "pg-aquinas-houston",
    category: "parish-governance",
    region: "Arlington, VA",
    languages: ["en"],
    urgency: "routine",
    summary:
      "Houston parish council in transition; bylaws drafted by canon-law adjunct in Galveston-Houston. Seeking peer review from Arlington-area canon lawyer familiar with similar instructions.",
    status: "open",
    createdAt: "2026-05-21",
  },
];
