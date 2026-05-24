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

export type ChapterOfficer = {
  name: string;
  role: string;
  /** Person id if the officer is in `people[]`. Used to thread mentor / formation data. */
  personId?: string;
  /** ISO date when this officer's term ends (and a successor must be in place). */
  termEnd?: string;
  /** Person id of the named or proposed successor. */
  successorId?: string;
  /** Where the handoff sits — surfaces on the Chapter handoff workspace. */
  handoffStatus?:
    | "no-successor-named"
    | "successor-shadowing"
    | "successor-named"
    | "transition-in-progress"
    | "complete";
  /** Knowledge-transfer items the outgoing officer noted. */
  handoffNotes?: string[];
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
  officers: ChapterOfficer[];
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
  /** Speakers + their role/affiliation. Empty for member-led gatherings. */
  speakers?: EventSpeaker[];
  /** Person IDs who actually attended (post-event); independent of RSVP. */
  attendedBy?: string[];
};

export type EventSpeaker = {
  name: string;
  /** "Faculty Advisor", "Keynote", "Panelist", "Spiritual Advisor", etc. */
  role: string;
  /** Optional one-line affiliation (e.g. "Prof., CUA Law"). */
  affiliation?: string;
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
  /**
   * Standing video room URL for this pair (their Zoom/Meet/Jitsi link).
   * Single "bring your own URL" approach — no third-party OAuth. Pair
   * sets it once via the journal page; the "Open video room" button
   * uses it forever. A per-meeting override lives on PairMeeting.
   */
  videoLink?: string;
};

/**
 * A scheduled or completed pair meeting. The pair page lets the mentor
 * or steward schedule new meetings, mark them complete, drop a one-line
 * note, and export the schedule to .ics for Google Calendar / Apple
 * Calendar / Outlook to subscribe to.
 */
export type PairMeeting = {
  id: string;
  pairId: string;
  /** ISO datetime — start of the meeting in the pair's local tz. */
  scheduledFor: string;
  durationMinutes: number;
  /** Optional one-line agenda the pair set together. */
  agenda?: string;
  status: "scheduled" | "completed" | "missed" | "rescheduled" | "cancelled";
  /** One-line note dropped after the meeting (or after it was missed). */
  notes?: string;
  /** Override the pair's standing video room, if used. */
  videoLink?: string;
};

/**
 * A longitudinal outcome milestone for the mentee. The point of mentor
 * pairing is producing lawyers who pass the bar, get the first job,
 * and stay in practice — this is the data that says whether the program
 * is working.
 */
export type PairOutcome = {
  id: string;
  pairId: string;
  /** ISO date the milestone occurred (not when it was recorded). */
  occurredOn: string;
  kind:
    | "bar-passed"
    | "bar-failed"
    | "first-job"
    | "judicial-clerkship"
    | "internship"
    | "moot-court"
    | "publication"
    | "partnership-track"
    | "partnership-offered"
    | "still-in-practice-1yr"
    | "still-in-practice-3yr"
    | "still-in-practice-5yr"
    | "still-in-practice-10yr"
    | "left-practice"
    | "left-and-returned"
    | "other";
  /** Free-text detail. "Passed IL bar on first attempt", "Hired as associate at Kelly & Roy, Chicago", etc. */
  detail: string;
  /** Who recorded this — usually the mentor or local steward. */
  recordedBy?: string;
  /** ISO timestamp when recorded (separate from when it occurred). */
  recordedAt: string;
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
  /**
   * Optional personal appeal — the client's own short story, in their own
   * voice. The structured fields are how Patrocinium matches matters to
   * lawyers; the appeal is how it moves them. Privacy-protected: first
   * name only, consent-gated, sanitizer-runs-on-share.
   */
  appeal?: ClientAppeal;
};

export type ClientAppeal = {
  /** First name only — never last name, never contact info. */
  firstName: string;
  /** The story itself. Aim for 2–6 sentences in the client's own voice. */
  storyText: string;
  /**
   * Who captured this story:
   *  - "client" = client wrote it themselves (most ideal)
   *  - "steward" = intake coordinator transcribed during intake
   *  - "third-party" = parish staff / family member captured on behalf
   *  - "voice-transcribed" = arrived via voicemail, auto-transcribed
   */
  storyAuthor: "client" | "steward" | "third-party" | "voice-transcribed";
  /** ISO date the appeal was captured. */
  capturedAt: string;
  /** Original language of the story (if not English). */
  originalLanguage?: string;
  /** Translator credit if the story was translated. */
  translatedBy?: string;
  /** Client-controlled visibility flags. */
  consents: {
    /** OK to show on Patrocinium so potential advocates see the story. */
    showToAdvocates: boolean;
    /**
     * OK to share with peer guilds via Communio. Story is auto-sanitized
     * by buildSharedSignal before crossing tenant boundaries.
     */
    shareCommunio: boolean;
    /**
     * OK to use an anonymized version as a Justice Gap public-advocacy
     * story (first name + circumstance only; no region; no specifics).
     */
    publicAdvocacy: boolean;
  };
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
      {
        name: "Margaret Coyle",
        role: "President",
        personId: "p-coyle",
        termEnd: "2026-05-15",
        handoffStatus: "successor-shadowing",
        successorId: "p-ohara",
        handoffNotes: [
          "Athenæum luncheon vendor relationships go in the binder.",
          "Cathedral pastoral office (Sr. Anne Marie's line) holds the closure-loop intake.",
          "Annual Red Mass committee meets quietly in September — bring Margaret in for the first one as advisor.",
        ],
      },
      {
        name: "James O'Hara",
        role: "Vice President",
        personId: "p-ohara",
        termEnd: "2026-05-15",
        handoffStatus: "no-successor-named",
      },
      {
        name: "Sr. Anne Marie Falconio, OP",
        role: "Spiritual Advisor",
        personId: "p-falconio",
        handoffStatus: "complete",
      },
      {
        name: "Daniel Chen",
        role: "Membership Chair",
        personId: "p-chen",
        termEnd: "2027-01-31",
        handoffStatus: "complete",
      },
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
      {
        name: "Rev. Msgr. Patrick Lally",
        role: "Spiritual Advisor",
        personId: "p-lally",
        handoffStatus: "complete",
      },
      {
        name: "Elena Ruiz-Schwarz",
        role: "President",
        personId: "p-ruiz",
        termEnd: "2027-06-30",
        handoffStatus: "complete",
      },
      {
        name: "Thomas Aquinas Kelly",
        role: "Treasurer",
        personId: "p-kelly",
        termEnd: "2026-12-31",
        handoffStatus: "successor-named",
        handoffNotes: ["Pilsen clinic banking is the most delicate handoff — book-and-binder transfer in November."],
      },
      {
        name: "Hannah Park",
        role: "Student Liaison",
        personId: "p-park",
        termEnd: "2026-08-31",
        handoffStatus: "no-successor-named",
      },
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
      {
        name: "Maria del Carmen Velasquez",
        role: "President (3L)",
        personId: "p-velasquez",
        termEnd: "2026-04-30",
        handoffStatus: "transition-in-progress",
        successorId: "p-owens",
        handoffNotes: [
          "Bar prep season — limited availability through July.",
          "Patrick is shadowing the Treatise reading-group rotation already.",
          "Mentor-match program is the one piece that needs continuity above all else.",
        ],
      },
      {
        name: "Patrick Owens",
        role: "VP (2L)",
        personId: "p-owens",
        termEnd: "2026-04-30",
        handoffStatus: "transition-in-progress",
        handoffNotes: [
          "Becoming President when Maria graduates — slate for new VP is uncertain.",
        ],
      },
      {
        name: "Prof. Robert Hartmann",
        role: "Faculty Advisor",
        personId: "p-hartmann",
        handoffStatus: "complete",
      },
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
      {
        name: "Rebecca Mwangi-Stone",
        role: "Chair",
        personId: "p-mwangi-stone",
        termEnd: "2026-09-01",
        handoffStatus: "no-successor-named",
        handoffNotes: [
          "On maternity leave through August — handoff conversations on hold.",
          "Vice Chair carrying double load; Tanner should NOT be assumed to be the next chair.",
        ],
      },
      {
        name: "David Tanner",
        role: "Vice Chair",
        personId: "p-tanner",
        termEnd: "2026-09-01",
        handoffStatus: "no-successor-named",
      },
      {
        name: "Aileen Lim",
        role: "Student Coordinator",
        personId: "p-lim",
        termEnd: "2026-12-31",
        handoffStatus: "successor-shadowing",
      },
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
      {
        name: "Michael Brennan",
        role: "President",
        personId: "p-brennan",
        termEnd: "2027-03-31",
        handoffStatus: "successor-shadowing",
        successorId: "p-roy",
        handoffNotes: [
          "Anita Roy is being prepared deliberately for the VP-to-President transition; mentor pair (Brennan/Roy) is the spine of that prep.",
        ],
      },
      {
        name: "Anita Roy",
        role: "Vice President",
        personId: "p-roy",
        termEnd: "2027-03-31",
        handoffStatus: "successor-shadowing",
      },
      {
        name: "Rev. Stephen Cale, JCL",
        role: "Canon-Law Advisor",
        personId: "p-cale",
        handoffStatus: "complete",
      },
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
    speakers: [
      { name: "His Eminence the Cardinal-Archbishop", role: "Celebrant", affiliation: "Archdiocese of Boston" },
      { name: "Hon. Margaret Lin", role: "Homilist", affiliation: "Mass. Supreme Judicial Court" },
    ],
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
    speakers: [
      { name: "Hon. Judith Mahoney", role: "Keynote", affiliation: "Mass. Appeals Court (ret.)" },
    ],
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
    speakers: [
      { name: "Patrick Owens", role: "Discussion lead", affiliation: "JP II Guild · CUA 2L" },
      { name: "Prof. Robert Hartmann", role: "Faculty respondent", affiliation: "CUA Law" },
    ],
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
    speakers: [
      { name: "Prof. Robert Hartmann", role: "Keynote — Aquinas on Law", affiliation: "CUA Law" },
      { name: "Rev. Stephen Cale, JCL", role: "Plenary — Canon law in civil practice", affiliation: "Diocese of Arlington" },
      { name: "Michael Brennan", role: "Panel chair", affiliation: "Arlington CBA" },
      { name: "Anita Roy", role: "Panelist", affiliation: "Arlington CBA" },
    ],
  },
  // Past events with attendance data — feeds the chapter-detail attendance widget
  {
    id: "ev-boston-past-luncheon",
    chapterId: "ch-stm-boston",
    title: "Monthly Luncheon — 'On Discovery and Discretion'",
    date: "2026-04-10",
    time: "12:00 PM",
    kind: "luncheon",
    location: "Boston Athenæum, 10½ Beacon St.",
    rsvpCount: 44,
    capacity: 60,
    description:
      "Speaker: Adam Vasquez, Mass. AG appellate office, on discretion in misdemeanor charging.",
    speakers: [
      { name: "Adam Vasquez", role: "Keynote", affiliation: "Mass. Attorney General (appellate)" },
    ],
    // 36 of 44 RSVPs actually showed
    attendedBy: ["p-coyle", "p-ohara", "p-falconio", "p-chen"],
  },
  {
    id: "ev-chicago-past-redmass",
    chapterId: "ch-clg-chicago",
    title: "Red Mass — Holy Name Cathedral",
    date: "2025-10-12",
    time: "11:00 AM",
    kind: "red-mass",
    location: "Holy Name Cathedral, Chicago",
    rsvpCount: 312,
    capacity: 400,
    description: "Annual Red Mass at the start of the judicial term. Msgr. Lally presiding.",
    speakers: [
      { name: "Rev. Msgr. Patrick Lally", role: "Celebrant", affiliation: "Holy Name Cathedral" },
    ],
    attendedBy: ["p-ruiz", "p-lally", "p-kelly", "p-park"],
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
    videoLink: "https://meet.google.com/coyle-chen-monthly",
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
    videoLink: "https://zoom.us/j/8127541129",
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
    videoLink: "https://meet.jit.si/CollegiumBrennanRoy",
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
// Pair meetings — scheduled + completed history per pair
// ────────────────────────────────────────────────────────────────────

export const pairMeetings: PairMeeting[] = [
  // Coyle & Chen — monthly. Two completed, one upcoming.
  {
    id: "pm-coyle-chen-2026-03",
    pairId: "mp-coyle-chen",
    scheduledFor: "2026-03-19T18:30:00",
    durationMinutes: 60,
    agenda: "First solo immigration matter — review intake and conflict check.",
    status: "completed",
    notes: "Daniel walked through his first solo intake (asylum, Venezuelan family). Coyle pushed on conflict check with prior co-counsel.",
  },
  {
    id: "pm-coyle-chen-2026-04",
    pairId: "mp-coyle-chen",
    scheduledFor: "2026-04-22T18:30:00",
    durationMinutes: 60,
    agenda: "Hearing prep — direct exam practice.",
    status: "completed",
    notes: "Ran the direct twice. Worked on slowing down before opening questions.",
  },
  {
    id: "pm-coyle-chen-2026-06",
    pairId: "mp-coyle-chen",
    scheduledFor: "2026-06-04T18:30:00",
    durationMinutes: 60,
    agenda: "Post-hearing debrief and vocation check-in.",
    status: "scheduled",
  },

  // Ruiz & Park — biweekly. Tight cadence.
  {
    id: "pm-ruiz-park-2026-04-21",
    pairId: "mp-ruiz-park",
    scheduledFor: "2026-04-21T17:00:00",
    durationMinutes: 45,
    agenda: "Summer internship choice — three offers on the table.",
    status: "completed",
    notes: "Hannah is leaning toward the Catholic Legal Aid Society over the firm offer. Elena asked the right hard questions about loan implications.",
  },
  {
    id: "pm-ruiz-park-2026-05-05",
    pairId: "mp-ruiz-park",
    scheduledFor: "2026-05-05T17:00:00",
    durationMinutes: 45,
    agenda: "Bible study — Acts 4 on the early Church's common life.",
    status: "completed",
  },
  {
    id: "pm-ruiz-park-2026-05-19",
    pairId: "mp-ruiz-park",
    scheduledFor: "2026-05-19T17:00:00",
    durationMinutes: 45,
    agenda: "Pre-internship send-off.",
    status: "scheduled",
  },

  // Hartmann & Velasquez — DRIFTING. Two missed; no upcoming.
  {
    id: "pm-hartmann-velasquez-2026-03-10",
    pairId: "mp-hartmann-velasquez",
    scheduledFor: "2026-03-10T19:00:00",
    durationMinutes: 60,
    agenda: "Bar-prep schedule and Anki strategy.",
    status: "completed",
    notes: "Maria has the Themis schedule. Concerns about constitutional law density.",
  },
  {
    id: "pm-hartmann-velasquez-2026-04-07",
    pairId: "mp-hartmann-velasquez",
    scheduledFor: "2026-04-07T19:00:00",
    durationMinutes: 60,
    agenda: "Mid-bar-prep check-in.",
    status: "missed",
    notes: "Maria did not appear. Prof. Hartmann sent a one-line note that evening; no reply.",
  },
  {
    id: "pm-hartmann-velasquez-2026-05-05",
    pairId: "mp-hartmann-velasquez",
    scheduledFor: "2026-05-05T19:00:00",
    durationMinutes: 60,
    agenda: "Bar prep — last month.",
    status: "missed",
    notes: "Second consecutive miss. Steward Coyle flagged for soft outreach (not from Hartmann).",
  },

  // Brennan & Roy — monthly, near co-leadership.
  {
    id: "pm-brennan-roy-2026-04-10",
    pairId: "mp-brennan-roy",
    scheduledFor: "2026-04-10T12:00:00",
    durationMinutes: 90,
    agenda: "Chapter VP-to-President transition timeline.",
    status: "completed",
    notes: "Walked through the September handover plan. Anita drafted the talking points.",
  },
  {
    id: "pm-brennan-roy-2026-05-08",
    pairId: "mp-brennan-roy",
    scheduledFor: "2026-05-08T12:00:00",
    durationMinutes: 90,
    agenda: "Red Mass planning and chapter calendar review.",
    status: "completed",
  },
  {
    id: "pm-brennan-roy-2026-06-12",
    pairId: "mp-brennan-roy",
    scheduledFor: "2026-06-12T12:00:00",
    durationMinutes: 90,
    agenda: "End-of-year retreat planning + mentorship matching for incoming students.",
    status: "scheduled",
  },

  // Tanner & Lim — monthly.
  {
    id: "pm-tanner-lim-2026-04-30",
    pairId: "mp-tanner-lim",
    scheduledFor: "2026-04-30T20:00:00",
    durationMinutes: 60,
    agenda: "Corporate practice as Christian vocation — Rerum Novarum reading.",
    status: "completed",
    notes: "Aileen brought the Rerum Novarum §§5-15 reading. David let her sit with the discomfort rather than resolving it.",
  },
  {
    id: "pm-tanner-lim-2026-06-04",
    pairId: "mp-tanner-lim",
    scheduledFor: "2026-06-04T20:00:00",
    durationMinutes: 60,
    agenda: "Year-one review — what corporate work has cost; what it has given.",
    status: "scheduled",
  },
];

// ────────────────────────────────────────────────────────────────────
// Pair outcomes — longitudinal milestones the program produces
// ────────────────────────────────────────────────────────────────────

export const pairOutcomes: PairOutcome[] = [
  // Coyle & Chen — Daniel went from 2L to associate over two years.
  {
    id: "po-chen-bar",
    pairId: "mp-coyle-chen",
    occurredOn: "2025-07-22",
    kind: "bar-passed",
    detail: "Passed the Illinois bar on first attempt.",
    recordedBy: "Margaret Coyle",
    recordedAt: "2025-09-15T10:30:00",
  },
  {
    id: "po-chen-first-job",
    pairId: "mp-coyle-chen",
    occurredOn: "2025-09-08",
    kind: "first-job",
    detail: "Started as associate at the National Immigrant Justice Center, Chicago.",
    recordedBy: "Margaret Coyle",
    recordedAt: "2025-09-15T10:32:00",
  },
  {
    id: "po-chen-1yr",
    pairId: "mp-coyle-chen",
    occurredOn: "2026-09-08",
    kind: "still-in-practice-1yr",
    detail: "One year in. First solo asylum matter underway. Stayed at NIJC; promoted to staff attorney track.",
    recordedBy: "Margaret Coyle",
    recordedAt: "2026-05-20T14:15:00",
  },

  // Hartmann & Velasquez — bar pending.
  {
    id: "po-velasquez-internship",
    pairId: "mp-hartmann-velasquez",
    occurredOn: "2025-06-01",
    kind: "internship",
    detail: "Summer 2025 internship at the D.C. Public Defender Service.",
    recordedBy: "Prof. Eleanor Hartmann",
    recordedAt: "2025-08-30T16:00:00",
  },
  {
    id: "po-velasquez-moot",
    pairId: "mp-hartmann-velasquez",
    occurredOn: "2026-02-14",
    kind: "moot-court",
    detail: "Won the 3L Moot Court Tournament at CUA Law (constitutional law brief).",
    recordedBy: "Prof. Eleanor Hartmann",
    recordedAt: "2026-02-16T09:00:00",
  },

  // Brennan & Roy — chapter leadership pipeline.
  {
    id: "po-roy-leadership",
    pairId: "mp-brennan-roy",
    occurredOn: "2025-09-01",
    kind: "other",
    detail: "Elected Vice President of the D.C. metro chapter; transitioning to President in Sept 2026.",
    recordedBy: "Sean Brennan",
    recordedAt: "2025-09-05T11:00:00",
  },
  {
    id: "po-roy-publication",
    pairId: "mp-brennan-roy",
    occurredOn: "2026-01-15",
    kind: "publication",
    detail: "Co-authored short piece in Catholic Lawyer on chapter formation models.",
    recordedBy: "Sean Brennan",
    recordedAt: "2026-01-17T08:00:00",
  },

  // Tanner & Lim — first year of practice.
  {
    id: "po-lim-1yr",
    pairId: "mp-tanner-lim",
    occurredOn: "2026-04-15",
    kind: "still-in-practice-1yr",
    detail: "One year as M&A associate at Sidley Austin. Considering the question of corporate work-as-vocation rather than running from it.",
    recordedBy: "David Tanner",
    recordedAt: "2026-04-20T19:30:00",
  },

  // Ruiz & Park — too new for outcomes yet.
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
    appeal: {
      firstName: "Maria",
      storyText:
        "I came to Chicago in 2019 from Honduras with my brother. My husband stayed and was supposed to follow. Last year he was killed during a robbery in our town. The U-visa papers are confusing in any language and I have been carrying this alone for too long. My priest at St. Procopius told me to come to the Wednesday clinic. I want to do this right so my children and I can stay.",
      storyAuthor: "steward",
      capturedAt: "2026-03-04",
      originalLanguage: "es",
      translatedBy: "St. Procopius bilingual intake volunteer",
      consents: {
        showToAdvocates: true,
        shareCommunio: false,
        publicAdvocacy: false,
      },
    },
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
    appeal: {
      firstName: "John",
      storyText:
        "I had a misdemeanor charge from a stupid argument outside a bar in 2023. I am a roofer. I show up to work. I would like this not to follow me when I apply for the union apprenticeship in the fall. The Saturday clinic at the Cathedral said your guild handles things like this for free.",
      storyAuthor: "client",
      capturedAt: "2026-04-29",
      consents: {
        showToAdvocates: true,
        shareCommunio: true,
        publicAdvocacy: true,
      },
    },
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
    appeal: {
      firstName: "Esperanza",
      storyText:
        "I have lived in my apartment for seventeen years. When I came to Boston from Phoenix last fall my Section-8 papers got stuck somewhere. The new landlord said he wants me out before the summer. My grandchildren go to St. Anthony's school three blocks away. I am asking for help so I do not lose my home.",
      storyAuthor: "steward",
      capturedAt: "2026-05-21",
      originalLanguage: "es",
      translatedBy: "St. Anthony Shrine outreach coordinator",
      consents: {
        showToAdvocates: true,
        shareCommunio: false,
        publicAdvocacy: false,
      },
    },
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
    appeal: {
      firstName: "Anna",
      storyText:
        "My husband died in 2019. I have been meaning to put my affairs in order ever since but kept putting it off — there was always something. My daughter is grown and steady. I would like her to know what to do if something happens to me, and I would like to choose her now and not leave that decision to anyone else. The parish secretary said your guild does this kind of work for people like me.",
      storyAuthor: "client",
      capturedAt: "2026-05-19",
      consents: {
        showToAdvocates: true,
        shareCommunio: true,
        publicAdvocacy: true,
      },
    },
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

