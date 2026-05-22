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
  | "juvenile_contact_rate"
  | "court_fines_pct"
  | "pretrial_pct"
  | "death_sentences_per_murder"
  | "recidivism_3yr_pct"
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
  {
    id: "juvenile",
    number: "07",
    title: "The juvenile bench.",
    eyebrow: "Children in the system",
    metric: "juvenile_contact_rate",
    ramp: RAMP_RED,
    domain: [5, 60],
    unit: "juvenile court referrals per 1,000 children, per year",
    headline: "5×",
    subline: "the rate at which Black youth are detained, compared to white youth, for the same conduct.",
    body:
      "American juvenile justice was supposed to be different. It has its own courts, its own statutes, its own rehabilitative language. The cases are sealed. The records, in principle, end at eighteen. The idea was that children are not adults, and the law should remember that.\n\n" +
      "In practice, we built a parallel system that does most of what the adult system does, applied to children, with the constitutional protections quietly thinned. Most states allow children to be tried as adults; almost all allow them to be questioned by police without a parent, without a lawyer, sometimes for hours. Public defenders for juveniles carry caseloads that make the adult ones look generous — 500 or more cases per attorney per year, often without dedicated juvenile-court specialists.\n\n" +
      "Black children are referred to juvenile court at roughly five times the rate of white children. Detained at higher rates. Transferred to adult court at higher rates. Sentenced more severely for the same offenses. The disparity widens, not narrows, at every successive decision point in the system.\n\n" +
      "The disparity is not new. The disparity is not a mistake. It is what the system, as built, produces.",
    sting:
      "We tell children of color that the juvenile court will treat them as children. Then we don't.",
    source: {
      label: "The Sentencing Project — Youth Justice; Annie E. Casey Foundation Race & Ethnicity Disparities",
      url: "https://www.sentencingproject.org/research/youth-and-the-justice-system/",
    },
    status: "ready",
  },
  {
    id: "fines",
    number: "08",
    title: "Fines and fees.",
    eyebrow: "Court debt as municipal revenue",
    metric: "court_fines_pct",
    ramp: RAMP_WINE,
    domain: [0, 25],
    unit: "% of local government general revenue from fines / fees / forfeitures",
    headline: "23%",
    subline: "of Ferguson, MO's general revenue, the year before Michael Brown was killed.",
    body:
      "The 2015 Department of Justice report on Ferguson, Missouri, documented a small American city that had quietly redesigned its police department, its municipal court, and its budget around a single function: extracting fines and fees from poor, mostly Black residents to fund the city government. Ferguson's police chief was told, in writing, to increase ticket revenue. Officers were measured by how many citations they wrote. Failure to pay a fine became a separate arrestable offense, with its own fee. Failure to appear at the hearing to discuss the fee became another offense. The compound interest of poverty became a balance sheet.\n\n" +
      "Ferguson is not unique. The Fines and Fees Justice Center has documented the pattern across thousands of small American jurisdictions: court debt as municipal revenue, suspended driver's licenses as a collection tool, jail as a method of forced payment. The Constitution permits state and local governments to raise revenue. It does not, in principle, permit them to raise it from the criminal-legal system itself. In practice, that's how many of them stay solvent.\n\n" +
      "Court debt also closes doors that were already mostly closed. An unpaid municipal fine in many states can suspend a driver's license. The license suspension makes it harder to get to work. The lost income makes it harder to pay the fine. The unpaid fine becomes a warrant. The warrant becomes a jail booking. The jail booking becomes another fee.",
    sting:
      "We figured out how to fund the police department on the backs of the people the police arrest. We called it justice.",
    source: {
      label: "Fines and Fees Justice Center; U.S. DOJ Civil Rights Division — Ferguson Report (2015)",
      url: "https://finesandfeesjusticecenter.org/",
    },
    status: "ready",
  },
  {
    id: "bail",
    number: "09",
    title: "The bail gap.",
    eyebrow: "Pretrial detention",
    metric: "pretrial_pct",
    ramp: RAMP_RED,
    domain: [25, 80],
    unit: "% of jail population held pretrial",
    headline: "60%",
    subline: "of U.S. jail population on any given day is unconvicted, awaiting trial.",
    body:
      "On any given day in America, more than 400,000 people are held in jail without having been convicted of a crime. They are there because they were arrested, denied release, and could not post the bail amount a judge set. About 60% of every jail population in the country, on average, is unconvicted. That share has held steady for thirty years, even as the absolute number of jail beds has grown.\n\n" +
      "The bail amounts are not exotic. Median felony bail nationally is around $10,000. For low-level offenses it's $500 to $2,000. Federal research has documented for decades that people who could not post less than $500 stayed in jail for weeks, months, sometimes a year — for charges that, on conviction, would have carried no incarceration at all.\n\n" +
      "What that time inside actually costs is a job, an apartment, a child's placement, a court date in family court, a chance at the plea deal the prosecutor would have offered to a defendant who was not visibly imprisoned. The Bail Project, a national fund that pays bail for the people who can't, has demonstrated in tens of thousands of cases that releasing low-income defendants pretrial does not increase failure-to-appear rates or rearrest rates in any meaningful way. The thing that bail accomplishes, in the cases the Bail Project tracks, is the time inside.\n\n" +
      "The Supreme Court has held repeatedly that excessive bail violates the Eighth Amendment, that pretrial detention based on inability to pay raises equal-protection concerns, that liberty is the norm and detention the exception. The decisions are eloquent. The practice in every county jail in America is the opposite.",
    sting:
      "The wealthy go home. The poor wait. Then the poor plead.",
    source: {
      label: "Prison Policy Initiative — Pretrial Detention; The Bail Project — Annual Report",
      url: "https://www.prisonpolicy.org/reports/pretrial.html",
    },
    status: "ready",
  },
  {
    id: "death",
    number: "10",
    title: "The death penalty geography.",
    eyebrow: "Where executions concentrate",
    metric: "death_sentences_per_murder",
    ramp: RAMP_WINE,
    domain: [0, 5],
    unit: "death sentences per 1,000 murders, by state (decade average)",
    headline: "2%",
    subline: "of U.S. counties have produced more than half of the death sentences issued since 1976.",
    body:
      "The death penalty is constitutional. The Supreme Court has said so. Twenty-seven states still authorize it. Three of those states — California, Pennsylvania, and Oregon — have executive moratoria; eleven others have functional moratoria, with no executions in over a decade. Twenty-three states have abolished it outright or do not authorize it.\n\n" +
      "Of the states that do still use it, the geography narrows again. The Death Penalty Information Center has documented that just 2% of U.S. counties — roughly fifty in total — have produced more than half of every death sentence handed down since the modern era of capital punishment began in 1976. Most of these counties are in Texas, Florida, Alabama, Oklahoma, and a handful of other Southern jurisdictions. Within those states, a single elected prosecutor's office often accounts for the majority of capital cases.\n\n" +
      "Who lives in the 2% determines whether the state kills them. Race of victim, more than race of defendant, drives the prosecutor's choice to seek death. Indigent defense in capital cases is even more under-funded than indigent defense in non-capital felony cases: many states pay flat fees, capped at the lowest amounts in the country, for the most complex litigation imaginable. The exoneration rate from death row has been higher than from any other category of conviction — about 1 in 8 people sentenced to death since 1976 have been exonerated.\n\n" +
      "An entire moral architecture has been constructed to justify the practice. The architecture works for the 2%. The other 98% of America manages without it.",
    sting:
      "The federal Constitution allows the death penalty. A handful of counties choose it. Most of America does not.",
    source: {
      label: "Death Penalty Information Center — Facts & Research",
      url: "https://deathpenaltyinfo.org/facts-and-research",
    },
    status: "ready",
  },
  {
    id: "recidivism",
    number: "11",
    title: "Reentry and the door that never closes.",
    eyebrow: "What happens after release",
    metric: "recidivism_3yr_pct",
    ramp: RAMP_RED,
    domain: [50, 85],
    unit: "% of state prisoners rearrested within 3 years of release",
    headline: "68%",
    subline: "of people released from state prison are rearrested within three years; 83% within nine.",
    body:
      "The Bureau of Justice Statistics has tracked one cohort of state prisoners — about 400,000 people released across thirty states — for nine years. Within one year, 44% were rearrested. Within three years, 68%. Within nine years, 83%. The federal numbers are slightly lower; the state numbers are the relevant ones for the vast majority of the incarcerated population.\n\n" +
      "Recidivism is usually reported as if it were a personal failure. The data tells a different story. The single largest predictor of rearrest is the absence of stable housing, followed by the absence of stable employment, followed by mental-health and substance-use treatment access. Most American states release people from prison with a small amount of \"gate money\" — sometimes as little as $25 — a bus ticket, and, often, no government-issued identification. Without ID, a returning citizen cannot get a job, rent an apartment, open a bank account, or apply for benefits. Public-housing waiting lists are years long; many ban people with felony records outright. Felony conviction strips voting rights in most states.\n\n" +
      "The closed door is not metaphorical. It is the literal apartment that won't rent, the literal employer who runs a background check, the literal occupational license the state has stripped from anyone with a record. Forty-eight states impose at least one occupational licensing restriction on returning citizens — for jobs ranging from barber to home health aide. The system that incarcerated them did not, on release, fund a door out.\n\n" +
      "The states that have invested in reentry — Massachusetts, Minnesota, Oregon, Connecticut — see recidivism rates 15 to 25 percentage points lower than national averages. The investment is not enormous. Nor is its absence accidental.",
    sting:
      "The system that put them in did not build a way out. It was not built to.",
    source: {
      label: "BJS Recidivism Study (9-Year Follow-up); The Sentencing Project; Council of State Governments Reentry Programs",
      url: "https://bjs.ojp.gov/library/publications/recidivism-prisoners-released-30-states-2005-patterns-2005-2014",
    },
    status: "ready",
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
    headline: "Mississippi 92.",
    subline: "Massachusetts 14. Two states. One country.",
    body:
      "The Justice Gap Index combines six dimensions of how the legal system actually works for poor Americans, state by state: public-defender caseload, indigent-defense spending per resident, civil legal aid attorneys per 10,000 people in poverty, the documented exoneration count, the share of jail population held pretrial, and the share of felony convictions resolved by plea instead of trial.\n\n" +
      "Each dimension is rescaled 0-to-100 against the U.S. range; higher means worse access. The composite is a simple average. We are not claiming statistical precision; the underlying numbers themselves are approximations from BJS, the Sixth Amendment Center, the Legal Services Corporation, the National Registry of Exonerations, and the Prison Policy Initiative. We are claiming that adding them up produces a map.\n\n" +
      "The map shows what every individual chapter showed, condensed. The worst-served states cluster in the Deep South and the Mountain West — Mississippi, Louisiana, Oklahoma, Alabama, Arkansas. The best-served are in the Northeast and a handful of Western outliers — Massachusetts, Connecticut, Minnesota, DC, Wisconsin. A child born poor in Massachusetts will, on average, face an indigent-defense system funded at four to eight times the per-resident level of a child born poor in Mississippi. The Constitution does not change at the state line. The funding does.\n\n" +
      "The index is composite because the gap is composite. The dimensions reinforce each other. A state that does not fund public defenders also does not fund civil legal aid, also does not invest in reentry, also has higher pretrial detention, also pays municipal court debt out of the pockets of its poorest residents. None of this is conspiracy; it is downstream of the same set of choices made over decades by appropriations committees answerable to people who never imagined needing any of it.",
    sting:
      "Add up every moment the system chose not to spend, not to fund, not to defend. That number, where you live, is your address.",
    source: {
      label: "Auxilium / Collegium synthesis from BJS, Sixth Amendment Center, LSC, National Registry of Exonerations, and Prison Policy Initiative",
    },
    status: "ready",
  },
];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);
