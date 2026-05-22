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
    headline: "70%",
    subline: "of U.S. jail population at midyear 2023 was unconvicted — about 467,600 people on any given day.",
    body:
      "On any given day in America, about 467,600 people sit in jail without having been convicted of a crime. They were arrested, denied release, and could not post the amount a magistrate set. The Bureau of Justice Statistics figure for midyear 2023 — 70% of every jail bed in the country — is the highest unconvicted share in more than a decade. The convicted jail population has fallen about 29% over the last ten years. The unconvicted has grown.\n\n" +
      "The bail amounts are not exotic. Median felony bail nationally is around $10,000 — about eight months of income for a typical detained defendant. For low-level offenses the amounts run $500 to $2,000. The Harris County study by Heaton, Mayson, and Stevenson showed in 2017 what every working defender already knew: detained misdemeanor defendants pleaded guilty 25% more often, were sentenced to jail 43% more often, and served sentences more than twice as long. They reoffended at higher rates, not lower. Pretrial detention does not predict guilt. It manufactures it.\n\n" +
      "Three states have run the natural experiment. New Jersey abolished cash bail in 2017; pretrial jail populations fell 27%. New York reformed in 2019; 96% of pretrial-released defendants were not rearrested. Illinois became the first state to abolish cash bail outright when the Pretrial Fairness Act took effect in September 2023; rural jail populations fell 25%, urban populations 14%, and the comparable-period crime rate dropped 11%. About $140 million a year that had been extracted from working families in Illinois as bail money now stays in those families.\n\n" +
      "The Eighth Amendment, ratified in 1791, declares that excessive bail shall not be required. The Supreme Court has spent 234 years declining to say what that means when the amount is $500 and the defendant does not have $500. Layleen Polanco was 27 years old in 2019 when her bail was set at $500. She could not pay. She died of an epileptic seizure in solitary at Rikers eight weeks later.",
    sting:
      "The wealthy go home. The poor wait. Then the poor plead.",
    source: {
      label: "BJS Jail Inmates 2023; Prison Policy Initiative — Mass Incarceration: The Whole Pie",
      url: "https://bjs.ojp.gov/library/publications/jail-inmates-2023-statistical-tables",
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
      "The death penalty is constitutional. The Supreme Court has said so for half a century. Twenty-seven states still authorize it; twenty-three have abolished it or never adopted it. Of the twenty-seven, only a handful actually use it in any given year: in 2024 the country executed 25 people, 19 of them in the South, six in Alabama alone. New death sentences in 2024 numbered 26. Both figures are near historic lows.\n\n" +
      "And yet the trend is also a map. The Death Penalty Information Center has documented that just 2% of U.S. counties — about 50 in total — have produced more than half of every death sentence handed down since 1976. In recent years three counties alone — Riverside CA, Clark NV, and Maricopa AZ — have generated nearly a third of the country's new death sentences. Whether the state kills you depends, far more than on what you did, on which county line you were standing inside when it was done. Robert Macy of Oklahoma County personally obtained 54 death sentences; nearly half were reversed; three ended in exoneration. Harris County, Texas — once the national leader — produced zero new death sentences in 2015 after a different generation of prosecutors took the office. The crime rate had not changed. The decisions had.\n\n" +
      "Since 1973, 200 people have been exonerated from death row — about one for every nine sentenced to die. Official misconduct drove 69% of those exonerations. Anthony Ray Hinton spent 30 years on Alabama's death row before the U.S. Supreme Court unanimously reversed in 2014; new firearms testing showed the bullets could not have come from his mother's gun. Toforest Johnson still sits on Alabama's death row, despite the original prosecutor, the current district attorney, three former state attorneys general, and the original trial judge all publicly calling for him to receive a new trial.\n\n" +
      "On December 23, 2024, President Biden commuted 37 of the 40 federal death sentences to life without parole. Four weeks later, President Trump signed Executive Order 14164, directing the Justice Department to resume federal executions and to pressure state prosecutors into filing fresh capital charges. In February 2025, the Supreme Court vacated Richard Glossip's death sentence in a 5–3 opinion after Oklahoma's own Republican Attorney General conceded prosecutorial error. The morning that opinion came down, Kenneth Smith had already been dead for thirteen months. Alabama executed Smith by nitrogen hypoxia in January 2024 — the first such execution in American history; eyewitnesses reported he writhed for at least four minutes before death.",
    sting:
      "The federal Constitution allows the death penalty. A handful of counties choose it. Most of America does not.",
    source: {
      label: "Death Penalty Information Center — Year End Reports 2024 & 2023; The 2% Death Penalty (2013)",
      url: "https://deathpenaltyinfo.org/research/analysis/reports/year-end-reports/the-death-penalty-in-2024/executions",
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
    headline: "82%",
    subline: "of people released from state prison are rearrested within ten years; 66% within three.",
    body:
      "The Bureau of Justice Statistics tracked 408,300 state prisoners released across 24 states for ten years. Within three years, 66% were rearrested. Within ten, 82%. Within ten, 61% had been returned to prison — either for a new sentence or for a supervision violation. The numbers are sometimes cited as proof of an incorrigible criminal class. They are better read as a description of the country a released person walks back into.\n\n" +
      "The National Inventory of Collateral Consequences of Conviction is a federally funded catalog of every civil legal disability American law attaches to a criminal record. As of 2024 it counts approximately 44,000 of them. Employment bars, occupational-licensing bars, public-housing bars, public-benefit bars, voter disqualifications, jury disqualifications, firearm prohibitions, immigration triggers, parental-rights terminations. Most are mandatory. Most are permanent. They begin the moment the gavel falls and they do not, in most cases, end with the sentence.\n\n" +
      "Devah Pager's 2003 Milwaukee audit study demonstrated what every reentry caseworker had already seen. A white applicant with no record was called back 34% of the time; with a felony, 17%. A Black applicant with no record, 14%. A Black applicant with a felony, 5%. A Black man without a criminal record was less likely to be called back than a white man with one. The Prison Policy Initiative measured the unemployment rate of the formerly incarcerated at 27.3% — Depression-era levels. The Sentencing Project counts roughly 4 million Americans disenfranchised by felony conviction; in Florida alone, 730,000 have completed their sentences but cannot vote because they cannot pay outstanding fines and fees.\n\n" +
      "Thirteen states plus DC have now passed Clean Slate automatic record-clearance laws — Pennsylvania first in 2018, most recently Illinois in 2024. The Center for Employment Opportunities' transitional-jobs program returns $1.26 to $3.85 in reduced recidivism and tax revenue for every dollar spent. The investments that work, work. Their absence is what's accidental.",
    sting:
      "The system that put them in did not build a way out. It was not built to.",
    source: {
      label: "BJS Recidivism of Prisoners Released in 24 States (2008–2018); NICCC; Sentencing Project Locked Out 2024",
      url: "https://bjs.ojp.gov/library/publications/recidivism-prisoners-released-24-states-2008-10-year-follow-period-2008-2018",
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
