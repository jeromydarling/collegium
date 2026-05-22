/**
 * Practice Q&A — async sanity-check threads across the network.
 *
 * Volunteer attorneys ask quick questions; senior advocates answer at
 * their own pace. Lower-overhead than formal mentorship; higher-trust
 * than a Google search. Tagged by practice area so a question routes to
 * the right bench without anyone having to think about it.
 */

export type PracticeCategory =
  | "immigration"
  | "housing"
  | "family"
  | "canon-law"
  | "expungement"
  | "estate-planning"
  | "religious-liberty"
  | "public-benefits"
  | "indigent-defense"
  | "parish-governance"
  | "professional-responsibility";

export type Answer = {
  id: string;
  authorName: string;
  authorRole: string;
  postedAt: string;
  body: string;
  /** Peer endorsements — "I checked this and it tracks." */
  endorsements: number;
};

export type PracticeQuestion = {
  id: string;
  category: PracticeCategory;
  /** Plain-language headline as posted by the asker. */
  question: string;
  context: string;
  askerRole: string;
  postedAt: string;
  /** Tagged forum / jurisdiction, optional. */
  forum?: string;
  /** Open = unanswered or active; settled = consensus answer endorsed. */
  status: "open" | "settled";
  answers: Answer[];
};

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "q-1",
    category: "housing",
    question:
      "Can I argue a 14-day cure even after the SP has been filed?",
    context:
      "Took a Boston housing-court matter through Patrocinium last week. The 14-day notice ran out before I got the file. Landlord filed summary process. Does the tenant still have the right to cure under c. 186 § 11?",
    askerRole: "Young lawyer",
    postedAt: "2026-05-21",
    forum: "MA Housing Court",
    status: "settled",
    answers: [
      {
        id: "a-1-1",
        authorName: "Margaret Coyle",
        authorRole: "Senior advocate · Boston",
        postedAt: "2026-05-21",
        body:
          "Yes. § 11 specifically preserves the cure right even after entry of summary process, as long as the tender is made before execution issues. Tender the full rent owed (no late fees unless the lease says so) plus any reasonable costs incurred since notice — the burden is on you to do it cleanly. Get a money order; get a receipt. The court will usually continue the matter to let cure happen.",
        endorsements: 3,
      },
      {
        id: "a-1-2",
        authorName: "James O'Hara",
        authorRole: "Mid-career litigator · Boston",
        postedAt: "2026-05-22",
        body:
          "Adding: the SJC's decision in *Cumis Ins. Soc'y v. BJ's Wholesale Club* doesn't change this; § 11 is statutory and survives. If the landlord refuses to accept the tender, walk it into court and tender on the record. The judge will almost always accept it.",
        endorsements: 2,
      },
    ],
  },
  {
    id: "q-2",
    category: "expungement",
    question:
      "Does a CWOF count as a conviction for § 100A waiting period purposes?",
    context:
      "Reviewing a sealing-petition matter — client has one CWOF from 2021 and two convictions from 2018. The CWOF says \"continued without finding\" but the docket entry treats it like a guilty plea. Which date starts the § 100A clock?",
    askerRole: "Young lawyer",
    postedAt: "2026-05-19",
    status: "settled",
    answers: [
      {
        id: "a-2-1",
        authorName: "Sr. Anne Marie Falconio, OP",
        authorRole: "Canon-law / tribunal advocate · Boston",
        postedAt: "2026-05-20",
        body:
          "A CWOF for § 100A purposes triggers from the date the continuance ends, not the date of plea — i.e., when the probation is dismissed without entry of judgment. The probation department can confirm the dismissal date. § 100A waits ARE shorter for CWOFs because they're not technically convictions, but the safe practice is to count from the latest dismissal date on the record.",
        endorsements: 5,
      },
    ],
  },
  {
    id: "q-3",
    category: "immigration",
    question:
      "Best practice for prepping a Spanish-fluent client for an IRB hearing?",
    context:
      "Toronto case via Communio. Four religious-persecution claimants, three first-language Spanish, one Farsi. Interpreter coordinated. How do you keep witness preparation tight without putting words in their mouths?",
    askerRole: "Mid-career litigator",
    postedAt: "2026-05-18",
    forum: "IRB Canada",
    status: "open",
    answers: [
      {
        id: "a-3-1",
        authorName: "Rebecca Mwangi-Stone",
        authorRole: "Refugee-claim practitioner · Toronto",
        postedAt: "2026-05-19",
        body:
          "Three things have served me. First, never rehearse the answer — rehearse the *question*. The claimant should know the shape of every question they'll be asked. Second, draw a timeline together — start with date of birth, mark every move, every threat, every flight. Hearing testimony tracks that timeline. Third, the country-conditions binder is the spine; let them speak to it, not from it. Interpreter sits to the side, not between.",
        endorsements: 4,
      },
      {
        id: "a-3-2",
        authorName: "Daniel Chen",
        authorRole: "Young lawyer · immigration · Boston",
        postedAt: "2026-05-20",
        body:
          "Also — and this is small — let the claimant set the seating arrangement in the prep room. Survivors of state violence sometimes need to face the door. Asking gives them agency.",
        endorsements: 3,
      },
    ],
  },
  {
    id: "q-4",
    category: "parish-governance",
    question:
      "Does a parish council \"approve\" bylaws or just \"adopt\" them?",
    context:
      "Drafting bylaws revision for a Chicago parish via Patrocinium. The chancery memo uses 'adopt'; the canon-law adjunct keeps writing 'approve.' Does the distinction matter for civil property purposes?",
    askerRole: "Young lawyer",
    postedAt: "2026-05-17",
    status: "open",
    answers: [
      {
        id: "a-4-1",
        authorName: "Rev. Stephen Cale, JCL",
        authorRole: "Canon-law advisor · Arlington",
        postedAt: "2026-05-18",
        body:
          "It matters in canon law more than civil. Parish councils in the U.S. are consultative under c. 536; they do not have legislative authority. So they neither 'approve' nor 'adopt' in the binding sense — they recommend to the pastor and ultimately the bishop. For your civil draft, use 'recommended' for the council action and 'adopted' for the pastor/bishop's final act. Civil property transactions then attach to the latter.",
        endorsements: 6,
      },
    ],
  },
  {
    id: "q-5",
    category: "professional-responsibility",
    question:
      "Limited-scope engagement — can I disclose that to opposing counsel?",
    context:
      "Took an advice-call matter through Patrocinium with a limited-scope engagement letter (one issue, one phone call). Opposing counsel emailed me asking for a discovery extension. Can I say \"I'm only retained for X\" without breaching anything?",
    askerRole: "Solo practitioner",
    postedAt: "2026-05-16",
    status: "settled",
    answers: [
      {
        id: "a-5-1",
        authorName: "Margaret Coyle",
        authorRole: "Senior advocate · Boston",
        postedAt: "2026-05-16",
        body:
          "Yes — and you should. Under Mass. R. Prof. C. 1.2(c), limited-scope is permitted; the scope itself isn't privileged. Tell opposing counsel \"my engagement is limited to [X]\" and decline anything outside it. Then file a notice of limited appearance under Mass. R. Civ. P. Supplemental Rule 1A if you haven't already. Belt and suspenders.",
        endorsements: 4,
      },
    ],
  },
];

/** Distinct categories in the corpus — for filter UI. */
export function practiceCategories(): PracticeCategory[] {
  return [...new Set(practiceQuestions.map((q) => q.category))].sort() as PracticeCategory[];
}
