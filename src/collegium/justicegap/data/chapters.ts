/**
 * Justice Gap — chapter set.
 *
 * Following the fostercrisis.com pattern: ordered chapters, each with a
 * metric, a color ramp (low → bleak), a headline, a sting, and a
 * primary citation. Six of the twelve are written deeply tonight. The
 * remaining six are scaffolded with the metric definition so the map
 * surfaces them, with body text and headline coming as we deepen.
 *
 * The metric values for the choropleth live in stateMetrics.ts and are
 * baked into the feature properties at bundle assembly — never into
 * Mapbox feature-state (see kickoff §4c).
 */

export type Metric =
  | "pd_caseload"
  | "indigent_spend_per_capita"
  | "incarceration_per_100k"
  | "lsc_attys_per_10k_poor"
  | "exonerations_total"
  | "plea_pct"
  | "court_fines_pct"
  | "pretrial_pct"
  | "felony_disenfranchisement"
  | "death_sentences_per_murder"
  | "recidivism_pct"
  | "justice_gap_index";

export type Chapter = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  metric: Metric;
  /** Color ramp, low → bleak. */
  ramp: string[];
  /** Domain for the ramp (min/max values). */
  domain: [number, number];
  /** Unit label for the legend. */
  unit: string;
  /** Big number in the sidebar. */
  headline: string;
  /** Short context line beneath the headline. */
  subline: string;
  /** The argument — 2–3 paragraphs. */
  body: string;
  /** The sting — one line that closes the chapter. */
  sting: string;
  /** Primary citation. */
  source: { label: string; url?: string };
  /** Status — "ready" means body + sting + sources are written. */
  status: "ready" | "scaffold";
};

const RAMP_RED = [
  "hsl(145 30% 38%)",
  "hsl(70 35% 50%)",
  "hsl(38 55% 55%)",
  "hsl(20 60% 50%)",
  "hsl(8 65% 38%)",
];
const RAMP_WINE = [
  "hsl(145 30% 38%)",
  "hsl(70 30% 50%)",
  "hsl(38 50% 55%)",
  "hsl(354 40% 45%)",
  "hsl(354 60% 28%)",
];

export const chapters: Chapter[] = [
  {
    id: "caseload",
    number: "01",
    title: "The constitutional promise vs. the bench.",
    eyebrow: "Gideon, 60 years on",
    metric: "pd_caseload",
    ramp: RAMP_RED,
    domain: [150, 900],
    unit: "felony cases per public defender, per year",
    headline: "400–800",
    subline: "real-world median. ABA recommends ≤150.",
    body:
      "In Gideon v. Wainwright (1963), the Supreme Court held that the Sixth Amendment guarantees a lawyer to anyone accused of a serious crime who cannot afford one. The American Bar Association has, for fifty years, recommended that any single public defender carry no more than 150 felony cases in a year. " +
      "The 2023 update to that standard — the National Public Defense Workload Study — set the limit even lower for serious cases.\n\n" +
      "The reality: in Missouri, a 2017 ABA report found public defenders carrying nearly 200% of the recommended caseload. In Louisiana parishes, single defenders have been documented handling more than 700 felonies a year. In some Texas counties, the answer is that there is no public defender's office at all — the work is contracted out to attorneys in private practice, who are paid a flat fee that often works out to less than minimum wage per case.\n\n" +
      "Every state in the country accepted Gideon. Almost none of them paid for it.",
    sting:
      "We tell defendants they have a right to a lawyer. We do not tell them their lawyer represents 6 of them in the same hour.",
    source: {
      label: "Sixth Amendment Center; ABA Standing Committee on Legal Aid and Indigent Defendants (SCLAID)",
      url: "https://sixthamendment.org/the-right-to-counsel/",
    },
    status: "ready",
  },
  {
    id: "spend",
    number: "02",
    title: "The money the right to counsel costs.",
    eyebrow: "Indigent defense, per capita",
    metric: "indigent_spend_per_capita",
    ramp: [...RAMP_RED].reverse(),
    domain: [0, 60],
    unit: "$ per resident, per year",
    headline: "$11.86",
    subline: "national average state + local indigent defense spending, per resident.",
    body:
      "States and counties together spend roughly $4 billion a year on indigent defense — the lawyers who stand between an accused person and a prison cell when that person cannot afford private counsel. Spread over the U.S. population, that's about $11.86 per resident, per year. " +
      "For perspective: Americans spend, on average, $35 per person per year on streaming services.\n\n" +
      "The spending is wildly unequal by state. Wisconsin, Minnesota, and Massachusetts spend more than $40 per resident. Mississippi and Pennsylvania spend less than $5. " +
      "These are not abstract numbers. They are the difference between a defender who can investigate, file motions, and meet a client before the plea, and a defender who meets the client in the hallway five minutes before the docket call.",
    sting:
      "A nation that spends more on what to stream tonight than on the right not to be wrongly convicted is making a choice. The cost is mostly paid by people who never made it.",
    source: {
      label: "Bureau of Justice Statistics; Sixth Amendment Center state surveys",
      url: "https://bjs.ojp.gov/topics/right-counsel",
    },
    status: "ready",
  },
  {
    id: "incarceration",
    number: "03",
    title: "The pipeline at the end of the bench.",
    eyebrow: "Incarcerated per 100,000 residents",
    metric: "incarceration_per_100k",
    ramp: RAMP_WINE,
    domain: [150, 1100],
    unit: "people incarcerated per 100,000",
    headline: "664",
    subline: "U.S. incarceration rate per 100,000 — highest in the developed world.",
    body:
      "The United States incarcerates a higher share of its people than any country on earth. " +
      "The national rate is 664 per 100,000. In Louisiana, Mississippi, and Oklahoma, it tops 1,000 — comparable to the most authoritarian states in the world. " +
      "About 60% of the people held in U.S. jails on any given day have not been convicted of anything; they are awaiting trial.\n\n" +
      "The pipeline runs from a missed court date or an unpaid fine, through pretrial detention because the defendant cannot make a $500 bail, to a plea bargain offered in the hallway because a trial date is six months away and the defendant has a job, or children, or a lease running out. " +
      "The lawyer in that hallway is usually a public defender. They have, on average, 8 minutes per case.",
    sting:
      "The pipeline doesn't fail. It works exactly the way it was funded to work.",
    source: {
      label: "Prison Policy Initiative; Vera Institute of Justice",
      url: "https://www.prisonpolicy.org/global/2024.html",
    },
    status: "ready",
  },
  {
    id: "civil-aid",
    number: "04",
    title: "Civil legal aid deserts.",
    eyebrow: "Lawyers vs. need",
    metric: "lsc_attys_per_10k_poor",
    ramp: [...RAMP_RED].reverse(),
    domain: [0.3, 2.5],
    unit: "LSC-funded attorneys per 10,000 people in poverty",
    headline: "0.84",
    subline: "national LSC-funded attorneys per 10,000 low-income Americans.",
    body:
      "The Legal Services Corporation funds 130 nonprofit legal-aid programs serving every state, territory, and tribal jurisdiction. They are, collectively, the largest single source of free civil legal help in America. " +
      "They are also nowhere near enough. There is about one LSC-funded attorney for every 10,000 Americans in poverty.\n\n" +
      "By LSC's own 2022 Justice Gap Report, 92% of substantial civil legal problems of low-income Americans receive inadequate or no legal help. 49% of eligible people who walk through the door of an LSC-funded program are turned away — not because they don't qualify, but because there are not enough lawyers.\n\n" +
      "Civil cases — eviction, child custody, debt, benefits denials, deportation — have no constitutional right to a lawyer. Gideon ends at the courtroom door of the criminal court. Everything that happens to a poor American on the civil side happens, by default, alone.",
    sting:
      "We argue endlessly about whether the right to counsel covers civil matters. The people losing their homes argue with a piece of paper.",
    source: {
      label: "Legal Services Corporation 2022 Justice Gap Report",
      url: "https://justicegap.lsc.gov/the-report/",
    },
    status: "ready",
  },
  {
    id: "exonerations",
    number: "05",
    title: "The wrongly convicted we know about.",
    eyebrow: "Exonerations since 1989",
    metric: "exonerations_total",
    ramp: RAMP_WINE,
    domain: [10, 600],
    unit: "documented exonerations since 1989",
    headline: "3,649",
    subline: "exonerations registered nationally. The unrecorded number is unknowable.",
    body:
      "Since 1989, the National Registry of Exonerations has documented more than 3,600 cases in which someone convicted of a serious crime in an American court was later proven innocent. " +
      "Combined, these people lost more than 30,000 years to prison.\n\n" +
      "The leading official cause of wrongful conviction is misconduct — by police, by prosecutors, occasionally by judges. The second is mistaken eyewitness testimony. The third is false confession, often coerced. " +
      "Behind every one of those causes is a missing safeguard the system was designed to provide and didn't: a defense attorney with the time and resources to investigate, to push back, to refuse the plea offered in the hallway.\n\n" +
      "The Registry only counts the ones we found out about. The ones we didn't find out about are, by definition, not on the list.",
    sting:
      "Thirty thousand years. That's the floor.",
    source: {
      label: "National Registry of Exonerations (University of Michigan / UC Irvine / Michigan State)",
      url: "https://www.law.umich.edu/special/exoneration/Pages/about.aspx",
    },
    status: "ready",
  },
  {
    id: "plea",
    number: "06",
    title: "The plea bargain has eaten the right to trial.",
    eyebrow: "How cases actually end",
    metric: "plea_pct",
    ramp: RAMP_RED,
    domain: [88, 99],
    unit: "% of felony convictions resolved by plea, not trial",
    headline: "97%",
    subline: "of federal felony convictions are pleas. State courts run at about 95%.",
    body:
      "The Sixth Amendment guarantees the right to a trial by jury. In practice, fewer than 3% of federal criminal cases ever see one. The rest are resolved by guilty plea, almost always in exchange for a lower sentence than the defendant would face after trial.\n\n" +
      "The math from a defendant's seat: the prosecutor offers 2 years if you plead. They threaten 12 if you fight and lose. Your public defender has 40 minutes a week for you. The trial date is eight months out; you'd lose your job, your apartment, your custody hearing in family court the same week. " +
      "You take the deal. You become a felon. The plea form notes that you are doing this 'freely and voluntarily.'\n\n" +
      "Plea bargains were, originally, a way to manage genuine docket pressure. They have become the standard way the criminal-legal system disposes of human beings.",
    sting:
      "The right to a trial is not denied. It is priced out.",
    source: {
      label: "U.S. Sentencing Commission; National Association of Criminal Defense Lawyers (NACDL)",
      url: "https://www.nacdl.org/Content/The-Trial-Penalty",
    },
    status: "ready",
  },
  // Scaffolded chapters — metric defined, full body / sting to come.
  {
    id: "juvenile",
    number: "07",
    title: "The juvenile bench.",
    eyebrow: "Children in the system",
    metric: "felony_disenfranchisement",
    ramp: RAMP_RED,
    domain: [0, 8],
    unit: "% of voting-age citizens disenfranchised by felony record",
    headline: "Coming",
    subline: "scaffold — full chapter under construction",
    body: "Juvenile justice contact rates, with the racial overlay that defines them.",
    sting: "",
    source: { label: "Sentencing Project" },
    status: "scaffold",
  },
  {
    id: "fines",
    number: "08",
    title: "Fines and fees.",
    eyebrow: "Court debt as municipal revenue",
    metric: "court_fines_pct",
    ramp: RAMP_WINE,
    domain: [0, 12],
    unit: "% of local government revenue from court fines / fees",
    headline: "Coming",
    subline: "scaffold — Ferguson Report follow-ups by jurisdiction",
    body: "When local governments fund themselves on the backs of the people they prosecute.",
    sting: "",
    source: { label: "Fines and Fees Justice Center" },
    status: "scaffold",
  },
  {
    id: "bail",
    number: "09",
    title: "The bail gap.",
    eyebrow: "Pretrial detention",
    metric: "pretrial_pct",
    ramp: RAMP_RED,
    domain: [20, 80],
    unit: "% of jail population held pretrial",
    headline: "60%",
    subline: "of U.S. jail population on any given day is unconvicted, awaiting trial.",
    body:
      "On any given day, more than 60% of the people held in American jails have not been convicted of a crime. They are awaiting trial. Most of them are there because they could not afford bail — often $500 or less. " +
      "The cost of that pretrial wait is not abstract: lost jobs, lost apartments, lost children to CPS, lost cases because a defendant in jail clothes makes worse plea decisions.",
    sting: "The wealthy go home. The poor wait.",
    source: {
      label: "Prison Policy Initiative",
      url: "https://www.prisonpolicy.org/reports/pretrial.html",
    },
    status: "scaffold",
  },
  {
    id: "death",
    number: "10",
    title: "The death penalty geography.",
    eyebrow: "Where executions concentrate",
    metric: "death_sentences_per_murder",
    ramp: RAMP_WINE,
    domain: [0, 4],
    unit: "death sentences per 1,000 murders",
    headline: "Coming",
    subline: "scaffold — 2% of U.S. counties produce most death sentences",
    body: "A handful of counties drive most of America's death row.",
    sting: "",
    source: { label: "Death Penalty Information Center" },
    status: "scaffold",
  },
  {
    id: "recidivism",
    number: "11",
    title: "Reentry and the door that never closes.",
    eyebrow: "What happens after release",
    metric: "recidivism_pct",
    ramp: RAMP_RED,
    domain: [25, 75],
    unit: "% rearrested within 3 years of release",
    headline: "Coming",
    subline: "scaffold — 3-year recidivism rates by state",
    body: "When the path back to incarceration is wider than the path away from it.",
    sting: "",
    source: { label: "Bureau of Justice Statistics" },
    status: "scaffold",
  },
  {
    id: "index",
    number: "12",
    title: "The Justice Gap Index.",
    eyebrow: "Everything, at once",
    metric: "justice_gap_index",
    ramp: RAMP_WINE,
    domain: [0, 100],
    unit: "composite index (0 = best access; 100 = worst)",
    headline: "Coming",
    subline: "scaffold — composite of caseload, funding, civil-aid, exonerations, plea rate",
    body: "The composite that adds them all together.",
    sting: "",
    source: { label: "Auxilium synthesis" },
    status: "scaffold",
  },
];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);
