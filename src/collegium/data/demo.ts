/**
 * Demo seed data for Collegium. All persons, organizations, and matters
 * are fictional. Names are inspired by historic Catholic legal figures
 * and the conventions of St. Thomas More societies and Catholic lawyer
 * guilds in the U.S. and Canada.
 */

export type Tradition = "catholic" | "protestant" | "orthodox" | "ecumenical";
export type VocationStage =
  | "student"
  | "young-lawyer"
  | "lawyer"
  | "canon-lawyer"
  | "judge"
  | "professor"
  | "clergy"
  | "retired";

export type Person = {
  id: string;
  name: string;
  stage: VocationStage;
  tradition: Tradition;
  city: string;
  practice: string[];
  bio: string;
  chapterId: string;
  initials: string;
};

export type Chapter = {
  id: string;
  name: string;
  slug: string;
  type: "guild" | "law-school" | "national-affiliate" | "diocesan-network";
  city: string;
  state: string;
  founded: number;
  membersCount: number;
  officers: { name: string; role: string }[];
  blurb: string;
  health: {
    score: number;
    hospitality: number;
    formation: number;
    service: number;
    succession: number;
    notes: string;
  };
};

export type EventItem = {
  id: string;
  chapterId: string;
  title: string;
  date: string;
  time: string;
  kind: "luncheon" | "red-mass" | "cle" | "service-clinic" | "reading-group" | "retreat" | "conference";
  location: string;
  rsvpCount: number;
  capacity: number;
  description: string;
};

export type MentorPair = {
  id: string;
  mentorId: string;
  menteeId: string;
  startedOn: string;
  cadence: "weekly" | "biweekly" | "monthly";
  lastMeeting?: string;
  status: "thriving" | "steady" | "drifting" | "paused";
  notes: string;
};

export type ServiceMatter = {
  id: string;
  intakeDate: string;
  requester: string;
  region: string;
  category:
    | "immigration"
    | "family"
    | "housing"
    | "parish-governance"
    | "canon-law"
    | "indigent-defense"
    | "religious-liberty"
    | "expungement"
    | "estate-planning"
    | "public-benefits";
  status: "new" | "triaged" | "assigned" | "follow-up" | "closed";
  assignedTo?: string;
  summary: string;
  urgency: "routine" | "soon" | "urgent";
  /** Optional: a chapter (parish, guild, student org) that referred this matter. */
  referringChapterId?: string;
  /** The clergy/staff/officer who made the referral, if applicable. */
  referredBy?: string;
  /** Spoken language(s) of the person seeking help — used by the intake router. */
  languages?: string[];
  /** Federal poverty level percentage — captured at intake for eligibility. */
  fplPercent?: number;
  /**
   * Pastoral-care-aware summary written on closure, returned to the
   * referring chapter. Never includes private legal substance; surfaces
   * what the parish can do next.
   */
  closureSummary?: string;
  closureDate?: string;
  /** Whether the requester consented to closure-loop sharing with referring chapter. */
  closureLoopConsent?: boolean;
};

export type NRIBriefing = {
  id: string;
  scope: "person" | "chapter" | "mentor-pair" | "network";
  scopeId: string;
  title: string;
  body: string;
  signals: string[];
  suggestedAction: string;
  generatedOn: string;
  tone: "celebrate" | "attend" | "concern";
};

// ────────────────────────────────────────────────────────────────────
// Chapters
// ────────────────────────────────────────────────────────────────────

export const chapters: Chapter[] = [
  {
    id: "ch-stm-boston",
    name: "St. Thomas More Society of Boston",
    slug: "stm-boston",
    type: "guild",
    city: "Boston",
    state: "MA",
    founded: 1957,
    membersCount: 184,
    officers: [
      { name: "Margaret Coyle", role: "President" },
      { name: "James O'Hara", role: "Vice President" },
      { name: "Sr. Anne Marie Falconio, OP", role: "Spiritual Advisor" },
      { name: "Daniel Chen", role: "Membership Chair" },
    ],
    blurb:
      "The oldest Catholic lawyers guild in New England. Monthly luncheons at the Boston Athenæum, a Red Mass at the Cathedral of the Holy Cross, and a quietly active pro bono network reaching across the Archdiocese.",
    health: {
      score: 78,
      hospitality: 88,
      formation: 64,
      service: 82,
      succession: 56,
      notes:
        "Strong hospitality and service energy. Formation participation is uneven — luncheons fill, reading groups struggle. Two officer terms end in May; only one successor has been named.",
    },
  },
  {
    id: "ch-clg-chicago",
    name: "Catholic Lawyers Guild of Chicago",
    slug: "clg-chicago",
    type: "guild",
    city: "Chicago",
    state: "IL",
    founded: 1949,
    membersCount: 312,
    officers: [
      { name: "Rev. Msgr. Patrick Lally", role: "Spiritual Advisor" },
      { name: "Elena Ruiz-Schwarz", role: "President" },
      { name: "Thomas Aquinas Kelly", role: "Treasurer" },
      { name: "Hannah Park", role: "Student Liaison" },
    ],
    blurb:
      "A guild of 300+ practitioners across Cook County. Red Mass at Holy Name Cathedral every October, an active legal-aid clinic in Pilsen, and a robust mentorship program with the John Marshall and Loyola law schools.",
    health: {
      score: 86,
      hospitality: 82,
      formation: 88,
      service: 92,
      succession: 78,
      notes:
        "Healthy across all four indices. Service energy is unusually strong this quarter — a parish-governance referral surge suggests need for one more canon-law-tagged volunteer.",
    },
  },
  {
    id: "ch-jp2-cua",
    name: "Saint John Paul II Guild of Catholic Lawyers",
    slug: "jp2-cua",
    type: "law-school",
    city: "Washington",
    state: "DC",
    founded: 2014,
    membersCount: 47,
    officers: [
      { name: "Maria del Carmen Velasquez", role: "President (3L)" },
      { name: "Patrick Owens", role: "VP (2L)" },
      { name: "Prof. Robert Hartmann", role: "Faculty Advisor" },
    ],
    blurb:
      "The student chapter at the Catholic University of America's Columbus School of Law. Reading groups in the Treatise on Law, a weekly Rosary in the chapel, and a mentor-match program with attorneys across the D.C. metro.",
    health: {
      score: 72,
      hospitality: 84,
      formation: 90,
      service: 48,
      succession: 60,
      notes:
        "Formation is exceptional for a student chapter. Service participation is thin — 1Ls don't yet know how to find clinics. Officer transition coming in April; new 2L slate is uncertain.",
    },
  },
  {
    id: "ch-cbf-toronto",
    name: "Christian Legal Fellowship — Toronto Chapter",
    slug: "clf-toronto",
    type: "national-affiliate",
    city: "Toronto",
    state: "ON",
    founded: 1978,
    membersCount: 96,
    officers: [
      { name: "Rebecca Mwangi-Stone", role: "Chair" },
      { name: "David Tanner", role: "Vice Chair" },
      { name: "Aileen Lim", role: "Student Coordinator" },
    ],
    blurb:
      "A broadly ecumenical Christian legal community across the GTA. Monthly Bible-and-Law roundtable, religious-liberty docket, and a refugee-claim pro bono program with several downtown firms.",
    health: {
      score: 69,
      hospitality: 72,
      formation: 70,
      service: 84,
      succession: 50,
      notes:
        "Service is the strongest signal. Hospitality has slipped since the Chair's maternity leave began. The Vice Chair is carrying double load.",
    },
  },
  {
    id: "ch-doc-arlington",
    name: "Catholic Bar Association — Arlington Affiliate",
    slug: "cba-arlington",
    type: "diocesan-network",
    city: "Arlington",
    state: "VA",
    founded: 2020,
    membersCount: 71,
    officers: [
      { name: "Michael Brennan", role: "President" },
      { name: "Anita Roy", role: "Vice President" },
      { name: "Rev. Stephen Cale, JCL", role: "Canon-Law Advisor" },
    ],
    blurb:
      "A young diocesan affiliate growing rapidly. A 2024 Red Mass with Bishop Burbidge, regular formation evenings on the Treatise on Justice, and an emerging canon-law referral track for parish governance.",
    health: {
      score: 74,
      hospitality: 80,
      formation: 78,
      service: 62,
      succession: 70,
      notes:
        "A new chapter punching above its weight. Canon-law overlap is becoming a defining feature — three parish-governance referrals in the last 60 days.",
    },
  },
];

// ────────────────────────────────────────────────────────────────────
// People
// ────────────────────────────────────────────────────────────────────

export const people: Person[] = [
  // Boston
  {
    id: "p-coyle",
    name: "Margaret Coyle",
    stage: "lawyer",
    tradition: "catholic",
    city: "Boston, MA",
    practice: ["family", "religious-liberty", "appellate"],
    bio: "Partner at Coyle & Whelan; chapter president; serves on the diocesan tribunal review board as a lay assessor.",
    chapterId: "ch-stm-boston",
    initials: "MC",
  },
  {
    id: "p-ohara",
    name: "James O'Hara",
    stage: "lawyer",
    tradition: "catholic",
    city: "Cambridge, MA",
    practice: ["litigation", "education"],
    bio: "Mid-career litigator. Has informally mentored seven law students in the last decade.",
    chapterId: "ch-stm-boston",
    initials: "JO",
  },
  {
    id: "p-falconio",
    name: "Sr. Anne Marie Falconio, OP",
    stage: "clergy",
    tradition: "catholic",
    city: "Boston, MA",
    practice: ["canon-law", "tribunal"],
    bio: "Dominican sister with a JCL from Catholic University; spiritual advisor and tribunal advocate.",
    chapterId: "ch-stm-boston",
    initials: "AF",
  },
  {
    id: "p-chen",
    name: "Daniel Chen",
    stage: "young-lawyer",
    tradition: "catholic",
    city: "Boston, MA",
    practice: ["immigration", "litigation"],
    bio: "Third-year associate, BC Law '22. Coyle Mentees Class of 2024.",
    chapterId: "ch-stm-boston",
    initials: "DC",
  },
  // Chicago
  {
    id: "p-ruiz",
    name: "Elena Ruiz-Schwarz",
    stage: "lawyer",
    tradition: "catholic",
    city: "Chicago, IL",
    practice: ["immigration", "family"],
    bio: "Solo practitioner in Pilsen. Founder of the guild's Wednesday-evening parish legal clinic.",
    chapterId: "ch-clg-chicago",
    initials: "ER",
  },
  {
    id: "p-kelly",
    name: "Thomas Aquinas Kelly",
    stage: "lawyer",
    tradition: "catholic",
    city: "Chicago, IL",
    practice: ["estates", "religious-organizations"],
    bio: "Trusts and estates attorney; guild treasurer; counsel to several religious institutes in the Archdiocese.",
    chapterId: "ch-clg-chicago",
    initials: "TK",
  },
  {
    id: "p-park",
    name: "Hannah Park",
    stage: "student",
    tradition: "protestant",
    city: "Chicago, IL",
    practice: ["constitutional", "religious-liberty"],
    bio: "Loyola Chicago 2L. Joined this fall through the ecumenical Christian Legal Society. Wants to do religious-liberty work post-graduation.",
    chapterId: "ch-clg-chicago",
    initials: "HP",
  },
  {
    id: "p-lally",
    name: "Msgr. Patrick Lally",
    stage: "clergy",
    tradition: "catholic",
    city: "Chicago, IL",
    practice: ["canon-law"],
    bio: "Vicar judicial of the Archdiocese; spiritual advisor; preaches at the annual Red Mass.",
    chapterId: "ch-clg-chicago",
    initials: "PL",
  },
  // CUA
  {
    id: "p-velasquez",
    name: "Maria del Carmen Velasquez",
    stage: "student",
    tradition: "catholic",
    city: "Washington, DC",
    practice: ["international-human-rights"],
    bio: "CUA Law 3L. Heads the JP II Guild. Plans to clerk on the D.C. Circuit before joining a religious-liberty practice.",
    chapterId: "ch-jp2-cua",
    initials: "MV",
  },
  {
    id: "p-owens",
    name: "Patrick Owens",
    stage: "student",
    tradition: "catholic",
    city: "Washington, DC",
    practice: ["criminal"],
    bio: "CUA Law 2L. Reading group leader for ST I-II, qq. 90–108.",
    chapterId: "ch-jp2-cua",
    initials: "PO",
  },
  {
    id: "p-hartmann",
    name: "Prof. Robert Hartmann",
    stage: "professor",
    tradition: "catholic",
    city: "Washington, DC",
    practice: ["jurisprudence", "natural-law"],
    bio: "Faculty advisor; teaches Jurisprudence and the seminar on Aquinas and Modern Constitutionalism.",
    chapterId: "ch-jp2-cua",
    initials: "RH",
  },
  // Toronto
  {
    id: "p-mwangi",
    name: "Rebecca Mwangi-Stone",
    stage: "lawyer",
    tradition: "ecumenical",
    city: "Toronto, ON",
    practice: ["refugee", "religious-liberty"],
    bio: "Refugee-claim counsel; chair of the Toronto CLF; currently on maternity leave.",
    chapterId: "ch-cbf-toronto",
    initials: "RM",
  },
  {
    id: "p-tanner",
    name: "David Tanner",
    stage: "lawyer",
    tradition: "protestant",
    city: "Toronto, ON",
    practice: ["corporate", "pro-bono"],
    bio: "Bay Street corporate lawyer; vice chair carrying the chair's duties through Q2.",
    chapterId: "ch-cbf-toronto",
    initials: "DT",
  },
  {
    id: "p-lim",
    name: "Aileen Lim",
    stage: "student",
    tradition: "protestant",
    city: "Toronto, ON",
    practice: ["administrative"],
    bio: "Osgoode 2L. Student coordinator. Runs the monthly Bible-and-Law roundtable.",
    chapterId: "ch-cbf-toronto",
    initials: "AL",
  },
  // Arlington
  {
    id: "p-brennan",
    name: "Michael Brennan",
    stage: "lawyer",
    tradition: "catholic",
    city: "Arlington, VA",
    practice: ["administrative", "parish-governance"],
    bio: "Government-relations counsel; founding president of the Arlington CBA affiliate.",
    chapterId: "ch-doc-arlington",
    initials: "MB",
  },
  {
    id: "p-roy",
    name: "Anita Roy",
    stage: "young-lawyer",
    tradition: "catholic",
    city: "Arlington, VA",
    practice: ["family", "religious-liberty"],
    bio: "Fourth-year associate; vice president; rising leader in the affiliate's formation work.",
    chapterId: "ch-doc-arlington",
    initials: "AR",
  },
  {
    id: "p-cale",
    name: "Rev. Stephen Cale, JCL",
    stage: "canon-lawyer",
    tradition: "catholic",
    city: "Arlington, VA",
    practice: ["canon-law", "tribunal", "parish-governance"],
    bio: "Diocesan canonist; canon-law advisor to the affiliate.",
    chapterId: "ch-doc-arlington",
    initials: "SC",
  },
];

// ────────────────────────────────────────────────────────────────────
// Events
// ────────────────────────────────────────────────────────────────────

export const events: EventItem[] = [
  {
    id: "ev-boston-red-mass",
    chapterId: "ch-stm-boston",
    title: "Red Mass + Reception",
    date: "2026-10-04",
    time: "10:30 AM",
    kind: "red-mass",
    location: "Cathedral of the Holy Cross, Boston",
    rsvpCount: 142,
    capacity: 220,
    description:
      "Annual votive Mass invoking the Holy Spirit on the judiciary and the bar. Cardinal-archbishop presiding; reception at the Boston Athenæum.",
  },
  {
    id: "ev-boston-luncheon",
    chapterId: "ch-stm-boston",
    title: "Monthly Luncheon — 'Equity and the Practice of Mercy'",
    date: "2026-06-12",
    time: "12:00 PM",
    kind: "luncheon",
    location: "Boston Athenæum, 10½ Beacon St.",
    rsvpCount: 38,
    capacity: 60,
    description:
      "Speaker: Hon. Judith Mahoney (Mass. Appeals Court, ret.) on equity in family-law practice.",
  },
  {
    id: "ev-chicago-clinic",
    chapterId: "ch-clg-chicago",
    title: "Pilsen Parish Legal Clinic",
    date: "2026-06-03",
    time: "6:30 PM",
    kind: "service-clinic",
    location: "St. Procopius Parish Hall, Pilsen",
    rsvpCount: 12,
    capacity: 18,
    description:
      "Wednesday-evening walk-in clinic. Immigration, housing, family. Volunteer lawyers and 2L–3L students welcome.",
  },
  {
    id: "ev-chicago-red-mass",
    chapterId: "ch-clg-chicago",
    title: "Red Mass at Holy Name Cathedral",
    date: "2026-10-11",
    time: "11:00 AM",
    kind: "red-mass",
    location: "Holy Name Cathedral, Chicago",
    rsvpCount: 0,
    capacity: 400,
    description:
      "Annual Red Mass at the start of the judicial term. Msgr. Lally to preach.",
  },
  {
    id: "ev-cua-reading",
    chapterId: "ch-jp2-cua",
    title: "Reading Group — ST I-II, q. 96 (Power of Human Law)",
    date: "2026-06-15",
    time: "7:00 PM",
    kind: "reading-group",
    location: "Columbus School of Law, Room 220",
    rsvpCount: 19,
    capacity: 24,
    description:
      "Patrick Owens (2L) leading. Pre-reading: ST I-II, q. 96, aa. 1–6.",
  },
  {
    id: "ev-cua-mentor-mixer",
    chapterId: "ch-jp2-cua",
    title: "Mentor-Match Mixer",
    date: "2026-08-26",
    time: "5:30 PM",
    kind: "luncheon",
    location: "Caldwell Hall, Catholic University",
    rsvpCount: 28,
    capacity: 80,
    description:
      "New 1Ls meet attorney mentors from across the D.C. metro. Wine, hors d'oeuvres, and twenty short introductions.",
  },
  {
    id: "ev-toronto-roundtable",
    chapterId: "ch-cbf-toronto",
    title: "Bible-and-Law Roundtable — 'Justice in Amos'",
    date: "2026-06-19",
    time: "6:00 PM",
    kind: "reading-group",
    location: "Bay & College Boardroom, Toronto",
    rsvpCount: 22,
    capacity: 32,
    description: "Aileen Lim (Osgoode 2L) opening; brown-bag dinner.",
  },
  {
    id: "ev-arlington-conf",
    chapterId: "ch-doc-arlington",
    title: "Annual Formation Day — Aquinas on the Treatise on Law",
    date: "2026-09-26",
    time: "9:00 AM",
    kind: "conference",
    location: "Pope John Paul II Cultural Center, Washington DC",
    rsvpCount: 41,
    capacity: 120,
    description:
      "Day-long conference with Prof. Hartmann (CUA Law), Fr. Cale (canon law), and a panel of practitioners on equity in administrative law.",
  },
];

// ────────────────────────────────────────────────────────────────────
// Mentor pairs
// ────────────────────────────────────────────────────────────────────

export const mentorPairs: MentorPair[] = [
  {
    id: "mp-coyle-chen",
    mentorId: "p-coyle",
    menteeId: "p-chen",
    startedOn: "2024-09-10",
    cadence: "monthly",
    lastMeeting: "2026-04-22",
    status: "thriving",
    notes:
      "Two-year arc. Daniel was a 2L when this started; now a third-year associate working on his first solo immigration matter. Conversations have shifted from career strategy to vocation.",
  },
  {
    id: "mp-ruiz-park",
    mentorId: "p-ruiz",
    menteeId: "p-park",
    startedOn: "2025-09-04",
    cadence: "biweekly",
    lastMeeting: "2026-05-05",
    status: "steady",
    notes:
      "Hannah is ecumenical, Elena is Catholic. The Bible-and-Law conversations have surprised both of them. Hannah's summer-internship plans are forming.",
  },
  {
    id: "mp-hartmann-velasquez",
    mentorId: "p-hartmann",
    menteeId: "p-velasquez",
    startedOn: "2024-01-12",
    cadence: "monthly",
    lastMeeting: "2026-03-10",
    status: "drifting",
    notes:
      "Two missed meetings in March and April. Maria is bar-prepping and has gone quiet. Prof. Hartmann last reached out April 28 — no reply yet.",
  },
  {
    id: "mp-brennan-roy",
    mentorId: "p-brennan",
    menteeId: "p-roy",
    startedOn: "2025-02-01",
    cadence: "monthly",
    lastMeeting: "2026-05-08",
    status: "thriving",
    notes:
      "Mentorship has evolved into co-leadership. Anita is being prepared for the VP-to-President transition next year.",
  },
  {
    id: "mp-tanner-lim",
    mentorId: "p-tanner",
    menteeId: "p-lim",
    startedOn: "2025-10-01",
    cadence: "monthly",
    lastMeeting: "2026-04-30",
    status: "steady",
    notes:
      "Aileen is testing whether corporate practice can be a Christian vocation. David is leaning into the question rather than answering it for her.",
  },
];

// ────────────────────────────────────────────────────────────────────
// Service matters
// ────────────────────────────────────────────────────────────────────

export const serviceMatters: ServiceMatter[] = [
  {
    id: "sm-1",
    intakeDate: "2026-05-18",
    requester: "St. Stanislaus Parish (Chicago)",
    region: "Chicago, IL",
    category: "parish-governance",
    status: "new",
    summary:
      "Parish council seeking guidance on bylaws revision following a property-transfer question. Likely needs canon-law overlap with civil counsel.",
    urgency: "soon",
    referringChapterId: "ch-clg-chicago",
    referredBy: "Msgr. Patrick Lally",
    languages: ["en"],
    closureLoopConsent: true,
  },
  {
    id: "sm-2",
    intakeDate: "2026-05-15",
    requester: "Maria F. (Pilsen)",
    region: "Chicago, IL",
    category: "immigration",
    status: "assigned",
    assignedTo: "p-chen",
    summary:
      "U-visa application for survivor of domestic violence. Documentation gathered; petition draft underway.",
    urgency: "soon",
    referringChapterId: "ch-clg-chicago",
    referredBy: "St. Procopius Parish (Wednesday clinic)",
    languages: ["es", "en"],
    fplPercent: 95,
    closureLoopConsent: true,
  },
  {
    id: "sm-3",
    intakeDate: "2026-05-12",
    requester: "Diocese of Arlington (parish trustee)",
    region: "Arlington, VA",
    category: "canon-law",
    status: "triaged",
    summary:
      "Trustee asking how civil property-tax exemption interacts with the canon-law definition of 'public juridic person.' Fr. Cale advising.",
    urgency: "routine",
    referringChapterId: "ch-doc-arlington",
    referredBy: "Diocesan chancery",
    languages: ["en"],
  },
  {
    id: "sm-4",
    intakeDate: "2026-05-08",
    requester: "Karen L. (Dorchester)",
    region: "Boston, MA",
    category: "family",
    status: "follow-up",
    assignedTo: "p-coyle",
    summary:
      "Annulment-tribunal advocacy combined with civil custody motion. Sr. Anne Marie advising on the tribunal side.",
    urgency: "soon",
    referringChapterId: "ch-stm-boston",
    referredBy: "Cathedral of the Holy Cross — pastoral office",
    languages: ["en"],
    fplPercent: 165,
    closureLoopConsent: true,
  },
  {
    id: "sm-5",
    intakeDate: "2026-05-04",
    requester: "Refugee Claimant Network (Toronto)",
    region: "Toronto, ON",
    category: "religious-liberty",
    status: "new",
    summary:
      "Bulk request: four religious-persecution claimants need IRB-hearing counsel within 90 days.",
    urgency: "urgent",
    referringChapterId: "ch-cbf-toronto",
    referredBy: "RCN intake coordinator",
    languages: ["en", "fa", "ti"],
    fplPercent: 100,
  },
  {
    id: "sm-6",
    intakeDate: "2026-04-29",
    requester: "John D. (Arlington)",
    region: "Washington, DC",
    category: "indigent-defense",
    status: "closed",
    assignedTo: "p-brennan",
    summary:
      "Misdemeanor representation, completed pro bono. Pleaded down to a continuance without finding.",
    urgency: "routine",
    referringChapterId: "ch-doc-arlington",
    referredBy: "Cathedral of St. Thomas More — Saturday clinic",
    languages: ["en"],
    fplPercent: 140,
    closureLoopConsent: true,
    closureDate: "2026-05-19",
    closureSummary:
      "Matter resolved without conviction. The family is asking about pastoral support during the probation check-ins; one of the deacons may want to follow up. No legal substance shared with the parish; the client gave permission for this note.",
  },
  {
    id: "sm-7",
    intakeDate: "2026-05-20",
    requester: "Holy Name Parish (Chicago)",
    region: "Chicago, IL",
    category: "parish-governance",
    status: "new",
    summary:
      "Cemetery-trust governance question — fourth such parish-governance matter this quarter.",
    urgency: "routine",
    referringChapterId: "ch-clg-chicago",
    referredBy: "Parish business manager",
    languages: ["en"],
  },
  // ── Network-inbox referrals: matters arriving from partner parishes that
  //    have not yet been routed to a local clinic. The federated intake board
  //    surfaces these to a steward with a routing suggestion.
  {
    id: "sm-8",
    intakeDate: "2026-05-21",
    requester: "Esperanza R. (Allston)",
    region: "Boston, MA",
    category: "housing",
    status: "new",
    summary:
      "Notice-to-quit served at end of April; sealed lease and a Section-8 voucher transfer question. Requester is Spanish-first.",
    urgency: "urgent",
    referringChapterId: "ch-stm-boston",
    referredBy: "St. Anthony Shrine — Tuesday outreach",
    languages: ["es"],
    fplPercent: 80,
    closureLoopConsent: true,
  },
  {
    id: "sm-9",
    intakeDate: "2026-05-21",
    requester: "Daniel O. (Brookline)",
    region: "Boston, MA",
    category: "expungement",
    status: "new",
    summary:
      "Two 2018 misdemeanor charges; eligible for record sealing under 276 § 100A. Wants help filing pro se if possible.",
    urgency: "routine",
    referringChapterId: "ch-stm-boston",
    referredBy: "Sacred Heart, Newton",
    languages: ["en"],
    fplPercent: 120,
  },
  {
    id: "sm-10",
    intakeDate: "2026-05-20",
    requester: "Jean-Paul N. (Scarborough)",
    region: "Toronto, ON",
    category: "immigration",
    status: "new",
    summary:
      "Family reunification — spouse and two minor children in DRC. Asking what documents to gather before consult.",
    urgency: "soon",
    referringChapterId: "ch-cbf-toronto",
    referredBy: "Our Lady of Guadalupe — multilingual outreach",
    languages: ["fr", "ln"],
    fplPercent: 65,
    closureLoopConsent: true,
  },
  {
    id: "sm-11",
    intakeDate: "2026-05-19",
    requester: "Anna T. (Dorchester)",
    region: "Boston, MA",
    category: "estate-planning",
    status: "new",
    summary:
      "Widow, age 72, needs a will and a health-care proxy. Adult daughter present at intake; no contested estate.",
    urgency: "routine",
    referringChapterId: "ch-stm-boston",
    referredBy: "St. Mark's, Dorchester",
    languages: ["en"],
    fplPercent: 110,
    closureLoopConsent: true,
  },
  {
    id: "sm-12",
    intakeDate: "2026-05-19",
    requester: "Robert M. (Pilsen)",
    region: "Chicago, IL",
    category: "public-benefits",
    status: "new",
    summary:
      "SSI denial appeal — disability onset disputed. Treating physician letter in hand.",
    urgency: "soon",
    referringChapterId: "ch-clg-chicago",
    referredBy: "St. Procopius Parish (Wednesday clinic)",
    languages: ["en"],
    fplPercent: 75,
    closureLoopConsent: true,
  },
];

