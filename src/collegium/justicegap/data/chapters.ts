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
  | "eviction_filing_pct"
  | "debt_default_pct"
  | "family_pro_se_pct"
  | "medicaid_procedural_pct"
  | "immigration_pro_se_pct"
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
    id: "eviction",
    number: "05",
    title: "Eviction, and the lawyer one side has.",
    eyebrow: "Civil — Housing",
    metric: "eviction_filing_pct",
    ramp: RAMP_RED,
    domain: [3, 20],
    unit: "eviction filings per 100 renter households per year",
    headline: "3.6 M",
    subline: "annual eviction filings nationally, pre-pandemic. Filings have rebounded to ~1.2M annually across the cities Eviction Lab tracks.",
    body:
      "The Eviction Lab at Princeton has documented, year after year, roughly 3.6 million eviction filings in American courts — naming about 7% of all renting households annually. The COVID-era moratoria and the Emergency Rental Assistance Program briefly drove that number down. The 2023, 2024, and 2025 Eviction Lab tracking reports show filings have rebounded past pre-pandemic levels in most jurisdictions.\n\n" +
      "Inside the courtroom the asymmetry is total. The Legal Services Corporation's Civil Court Data Initiative found that in Virginia eviction cases, tenants had counsel in 1% of cases and landlords in 68%. The represented tenant was seven times more likely to prevail. In Cleveland, 93% of represented tenants avoided eviction or got an orderly move-out; in Philadelphia, 5% of represented tenants were forcibly displaced compared to 78% of unrepresented ones. New York City's pioneering Right-to-Counsel law guaranteed counsel to every income-eligible tenant facing eviction — and representation peaked at 71% under it. By 2024 it had fallen to 42%, and in the Bronx to 31%, as the program ran out of funded attorneys. In the same year, 89% of represented New York households avoided eviction. Stout Risius Ross's independent cost-benefit analysis projected that NYC's RTC program generates $320 million in annual public benefits — averted shelter use, preserved housing — against $191 million in costs.\n\n" +
      "Connecticut, Maryland, Minnesota, and Washington have enacted statewide eviction right-to-counsel laws. Eighteen more cities have done the same locally. Forty states have done nothing. Jasmine Carter spent more than seven years and seven separate court dates trying to clear a $4,615 lien for rent she had already paid; pro bono counsel only entered after ProPublica reported the story. The case was winnable on the facts from the first hearing.\n\n" +
      "Black renters are 18.6% of all American renters and account for 51.1% of eviction filings. Black women with children face the highest filing rate of any race-gender-parental group in the country. The 92% civil justice gap is most concentrated, by every primary-source measure, exactly here.",
    sting:
      "Eviction is the most common life-altering legal proceeding in America. It is the one most often heard with one side represented and the other left with the paper.",
    source: {
      label: "Eviction Lab (Princeton); NYC Comptroller Levine 2024; PNAS 2023 (Graetz et al.); LSC Civil Court Data Initiative",
      url: "https://evictionlab.org/national-estimates/",
    },
    status: "ready",
  },
  {
    id: "debt",
    number: "06",
    title: "The collection court.",
    eyebrow: "Civil — Consumer debt",
    metric: "debt_default_pct",
    ramp: RAMP_RED,
    domain: [50, 85],
    unit: "% of debt-collection lawsuits that end in default judgment",
    headline: "42%",
    subline: "of the civil docket in the nine states with comparable data, 2021. Up from 29% in 2013.",
    body:
      "Debt collection is now the single largest category of civil case on American state-court dockets. Pew Charitable Trusts' 2020 study found that debt claims had grown from roughly one in nine civil cases in 1993 to about one in four by 2013. Pew's 2023 follow-up reported that across nine states with comparable data — Alaska, Colorado, Connecticut, Indiana, Missouri, New Mexico, Texas, Utah, Wisconsin — debt cases accounted for 42% of the civil docket by 2021, up from 29% in 2013. In New Mexico the share was 51%, in Texas 48%. By 2025, filings had returned past pre-pandemic levels.\n\n" +
      "More than seventy percent of these lawsuits end in default judgment — an automatic loss because the defendant never appears. The defendant did not, in most cases, ignore the case in any meaningful sense. The defendant could not afford a lawyer for a $1,500 dispute, could not miss a shift at $14 an hour to sit in a courtroom, could not parse a summons written in legalese, and could not, in many cases, prove that the summons had ever been properly served — what consumer-law attorneys call \"sewer service.\" The Princeton-based Debt Collection Lab quantified what counsel does in this forum: in their four-county study, a represented defendant's likelihood of default judgment fell by 91.1%. Pew documented that fewer than 10% of consumer defendants in debt cases have a lawyer; debt collectors are represented in nearly 100%.\n\n" +
      "About a quarter of all debt sold to buyers, by FTC measurement, is already past the statute of limitations. The 2023 CFPB Annual FDCPA Report received 109,000 debt-collection complaints, 53% of which alleged attempts to collect debts not owed. The two largest U.S. debt buyers, Encore Capital and Portfolio Recovery Associates, have repeatedly been sanctioned by the CFPB for filing tens of thousands of suits through law firms staffed by only a handful of attorneys. Behind the judgments lies the back-end: about 7% of U.S. employees have had wages garnished in any given year, 11 million Americans have lost driving privileges over unpaid court debt, and the credit destruction follows for a decade.\n\n" +
      "Roughly 100 million Americans carry medical debt they cannot pay — about $220 billion in total. In January 2025 the CFPB finalized a rule removing medical debt from credit reports for some 15 million people, an estimated $49 billion in debt erased. On July 11, 2025, the U.S. District Court for the Eastern District of Texas vacated the rule at the joint request of new CFPB leadership and industry plaintiffs. Sherry McKee, who works as a tribal-school dorm monitor outside McAlester, Oklahoma, has now been sued three times by McAlester Regional Medical Center over a $3,375 bill for what turned out to be vertigo. The hospital and its affiliated clinic have filed close to 5,000 collection cases since the early 1990s. A single father-daughter law firm handled 51 of those cases on the morning a KFF Health News reporter watched, walking out with roughly $40,000 in judgments in about an hour.",
    sting:
      "The civil court that runs at scale in America is not a forum for adjudication. It is a forum for one side, and a paperwork conveyor for the other.",
    source: {
      label: "Pew Charitable Trusts 2020/2023/2025; Debt Collection Lab (Princeton); CFPB 2023 FDCPA Report",
      url: "https://www.pew.org/en/research-and-analysis/reports/2020/05/how-debt-collectors-are-transforming-the-business-of-state-courts",
    },
    status: "ready",
  },
  {
    id: "family",
    number: "07",
    title: "Family court, pro se.",
    eyebrow: "Civil — Family law",
    metric: "family_pro_se_pct",
    ramp: RAMP_RED,
    domain: [55, 85],
    unit: "% of family-court cases with at least one self-represented party",
    headline: "60–90%",
    subline: "of family-law cases nationally have at least one party without a lawyer. California reaches 80% by judgment.",
    body:
      "The IAALS \"Cases Without Counsel\" research at the University of Denver puts 60 to 90 percent of family-court cases nationwide as having at least one self-represented party — the highest pro-se rate of any major civil docket in America. California's number rises from about 70% at filing to roughly 80% by judgment. South Carolina's protective-order docket runs at roughly 75% no-counsel-on-either-side. In NNEDV's single-day 2025 count, 1,707 domestic-violence programs served 84,146 adults and children and turned away another 13,018 requests for help, most of them civil-legal in nature.\n\n" +
      "What is decided in this forum is who raises a child, whether a parent goes to jail for unpaid support, whether a survivor of intimate violence can leave, whether the children of an incarcerated parent enter foster care. The Supreme Court's 1981 decision in Lassiter v. Department of Social Services declined a categorical due-process right to counsel for parents facing termination of their parental rights. Forty states and the District of Columbia now provide that right by statute; ten do not, or qualify it. The Court's 2011 decision in Turner v. Rogers held that the Fourteenth Amendment does not require appointed counsel for an indigent father facing jail for civil contempt over child support — provided the court supplies \"alternative procedural safeguards\" the decision describes. Michael Turner had been jailed six times, including a twelve-month stretch, without those safeguards.\n\n" +
      "Approximately 65,000 American children had their relationships to a parent terminated by court order in fiscal year 2021. About 49% of children in foster care as of FY 2024 had at least one parent's rights terminated. The Adoption and Safe Families Act of 1997 requires state child-welfare agencies to file for termination once a child has been in foster care for fifteen of the previous twenty-two months. The average state prison sentence is more than five years. The arithmetic does not allow a parent in prison to keep their children even when nothing else has changed about their fitness as a parent.\n\n" +
      "Jennifer Moston of Wisconsin documented more than fifty acts of domestic violence by her husband in twenty pages of contemporaneous notes. Family court moved toward joint custody anyway, in the spirit of Wisconsin's shared-parenting presumption. The case was not resolved by family court. It was resolved by a criminal judge who, in 2018, sentenced her husband to eight and a half years' imprisonment and barred contact with the child for ten. The family-court system, designed around a presumption of cooperative co-parents and competent pro-se litigants, structurally underweights documented abuse until a criminal court intervenes.",
    sting:
      "Family court decides who raises the child. It does so, in most American cases, with at least one parent unrepresented.",
    source: {
      label: "IAALS \"Cases Without Counsel\"; NNEDV 2025 DV Counts; NCCRC Survey on Parent's Right to Counsel; HHS AFCARS",
      url: "https://iaals.du.edu/sites/default/files/documents/publications/cases_without_counsel_research_report.pdf",
    },
    status: "ready",
  },
  {
    id: "benefits",
    number: "08",
    title: "The administrative denial.",
    eyebrow: "Civil — Public benefits, disability, Medicaid",
    metric: "medicaid_procedural_pct",
    ramp: RAMP_RED,
    domain: [20, 93],
    unit: "% of Medicaid unwinding terminations that were procedural, not substantive (KFF, 2023–24)",
    headline: "25 M",
    subline: "Americans lost Medicaid coverage during the 2023–24 unwinding. 69% of those terminations were procedural — paperwork, not eligibility.",
    body:
      "The largest civil-justice failure in America does not happen in a courtroom. It happens in an unanswered letter, an unreturned form, a phone tree that disconnects at minute thirty-two. The administrative state distributes disability benefits, food assistance, health coverage, and unemployment insurance — and denies eligible Americans at scale, then makes appeal so procedurally hostile that most simply stop trying.\n\n" +
      "The Social Security Administration's own 2023 statistical report shows that initial Social Security Disability Insurance allowance rates have hovered at 19 to 21 percent for a decade, and the final award rate after all appeals averages about 30 percent. At the administrative-law-judge hearing stage, approval rates climb to roughly 50 percent — but only for represented claimants, who are nearly three times as likely to prevail as those without counsel. GAO-20-641R documented that 109,725 disability claimants died awaiting their appeal decision between 2008 and 2019, and that another 48,000 declared bankruptcy while waiting. Median wait was 839 days for fiscal-year-2015 claims. The agency has since cut the wait roughly in half, but eight states still average nine months or more.\n\n" +
      "When the federal continuous-coverage requirement that kept Americans on Medicaid through COVID expired in April of 2023, the states began \"unwinding\" their rolls. KFF's tracker, which covers all fifty states, documents that 25 million Americans lost Medicaid coverage in the unwinding through mid-2025 — and that 69 percent of those terminations were procedural. The recipients did not become ineligible; they failed to navigate a paperwork process. State variance is extreme: Nevada and New Mexico ran procedural-termination shares of 93 percent. Texas ran roughly 71 percent. Maine ran 22 percent. The same federal statute, administered differently.\n\n" +
      "Beneath this sits the SNAP churn: Urban Institute and the Center on Budget and Policy Priorities document that 17 to 28 percent of SNAP households experience churn — losing benefits and re-enrolling within ninety days, almost always for procedural reasons. A San Francisco recertification study found 94 percent of rejected recertifications involved earnings below the eligibility threshold. The denials are not separating fraud from need. They are separating people with lawyers, broadband, stable mail, and bandwidth to handle bureaucracy from people without.\n\n" +
      "Christopher Tincher began his work life as a teenager in an Aflex, Kentucky coal mine. He moved to grill-scraping, to janitorial, to a Walmart tire bay in Arkansas, and finally to a small-town wastewater plant in 2017, where sewage soaked into his ill-fitting boots and his right leg was amputated below the knee. SSA denied his disability claim in 2018. He won, years later, on appeal. ProPublica's October 2025 reporting documents that a Trump-administration rewrite of the \"grid rules\" would have stripped eligibility from roughly 830,000 mostly older blue-collar workers like him, cascading into loss of Medicare and forced early-retirement drawdowns.",
    sting:
      "Program integrity is the official rationale. The denials separate people with lawyers from people without. That is not integrity; it is the justice gap, administered.",
    source: {
      label: "KFF Medicaid Unwinding Tracker; SSA SSDI Statistical Report 2023; GAO-20-641R; CBPP Lessons Churned; ProPublica 2025",
      url: "https://www.kff.org/medicaid/medicaid-enrollment-and-unwinding-tracker/",
    },
    status: "ready",
  },
  {
    id: "immigration",
    number: "09",
    title: "Removal without counsel.",
    eyebrow: "Civil — Immigration",
    metric: "immigration_pro_se_pct",
    ramp: RAMP_WINE,
    domain: [45, 75],
    unit: "% of removal respondents appearing without counsel (TRAC, mapped to states by dominant immigration court)",
    headline: "3.4 M",
    subline: "active cases in U.S. immigration court at end of 2025. Roughly 70% of detained respondents have no lawyer.",
    body:
      "Deportation is technically a civil proceeding. INS v. Lopez-Mendoza (1984) and its progeny hold that Gideon does not reach it. Counsel is statutorily permitted, but \"at no expense to the Government.\" The system thus operates exactly as that doctrine describes. People are detained far from any immigration lawyer — Winn Correctional in Louisiana, four hours from the nearest immigration attorney in any direction, holds people who in some cases never see counsel. The ACLU's 2024 report No Fighting Chance found that at 173 of the country's roughly 192 ICE detention facilities, nearly every attorney-client communication channel — secure phone, contact visitation, video — was broken.\n\n" +
      "TRAC Immigration at Syracuse maintains the running tally. At the end of 2025, U.S. immigration courts carried roughly 3.4 million active pending cases. The asylum grant rate, which had been about 38% as recently as August of 2024, had collapsed to 19.2% by August of 2025 — the lowest in a decade. Roughly 70% of detained respondents face removal proceedings without a lawyer at the merits stage. The Vera Institute's evaluation of the New York Immigrant Family Unity Project — the original universal-representation program — documented an 1,100% improvement in successful outcomes for detained respondents who received counsel: from 4% pro se to a projected 48% with representation. In absentia removal orders fell from 68% pro se to 7% with counsel.\n\n" +
      "Children fare worse than adults. A 2025 study covering 2009 through 2023 found that only 51% of unaccompanied minors had counsel in their removal proceedings; children with counsel were more than seven times more likely to be allowed to remain. In the spring of 2025, the federal contract held by the Acacia Center for Justice — covering legal representation for some 26,000 unaccompanied children — was terminated. A federal judge ordered partial restoration after lawsuits; coverage remains fragmented as of late 2025. The National Qualified Representative Program, the only federal program guaranteeing counsel to detained immigrants with serious mental disabilities — established under the 2013 court order in Franco-Gonzalez v. Holder — was likewise defunded. The program had served roughly 3,000 people who the courts themselves had ruled were incompetent to represent themselves.\n\n" +
      "The Department of Homeland Security's April 2024 interim report identified 4,656 children separated from their parents under the 2017–2018 Zero Tolerance policy. As of that report, 1,360 of those children still had no confirmed reunification, and 446 family contacts could not be located at all.\n\n" +
      "The civil label cannot do the moral work of distinguishing a parking ticket from permanent exile to a country someone fled at gunpoint. The stakes are the Gideon stakes; only the statute pretends otherwise.",
    sting:
      "We invented a civil court whose decisions deport human beings. Then we declined to provide them lawyers, because — formally — it isn't criminal.",
    source: {
      label: "TRAC Immigration (Syracuse); Vera Institute NYIFUP; ACLU 2024 No Fighting Chance; DHS Family Reunification Task Force 2024",
      url: "https://tracreports.org/phptools/immigration/backlog/",
    },
    status: "ready",
  },
  {
    id: "exonerations",
    number: "10",
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
    number: "11",
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
    number: "12",
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
    number: "13",
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
    number: "14",
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
    number: "15",
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
    number: "16",
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
    number: "17",
    title: "The Justice Gap Index.",
    eyebrow: "Everything, at once",
    metric: "justice_gap_index",
    ramp: RAMP_WINE,
    domain: [0, 100],
    unit: "composite index (0 = best access; 100 = worst)",
    headline: "Mississippi 92.",
    subline: "Massachusetts 14. Two states. One country.",
    body:
      "The Justice Gap Index combines eleven dimensions of how the legal system actually works for poor Americans, state by state. Six are civil — civil-legal-aid attorney density, eviction filing rates, debt-collection default-judgment rates, family-court pro-se rates, Medicaid-unwinding procedural-termination rates, and the share of immigration-court respondents appearing without counsel. Five are criminal — public-defender caseload, indigent-defense spending, incarceration rate, plea share, and pretrial-detention share.\n\n" +
      "The civil dimensions are weighted equally with the criminal ones for a reason. The Legal Services Corporation's 2022 Justice Gap Report documents that 74% of low-income U.S. households face a substantial civil legal problem in any given year and 92% of those problems get inadequate or no legal help. Spread across the ~50 million Americans at 125% of poverty or below, that is roughly 150 million unmet civil legal events per year — against ~10 million annual arrests and ~700,000 felony convictions on the criminal side. The civil need is roughly fifteen times the criminal need. And civil has no Gideon. We tell the story this way because the funding does not.\n\n" +
      "Each dimension is rescaled 0-to-100 against the national range, with higher meaning worse access; the composite is a simple average. The numbers themselves come from BJS, the Sixth Amendment Center, the Legal Services Corporation, the National Registry of Exonerations, the Prison Policy Initiative, the Eviction Lab, Pew Charitable Trusts, IAALS, KFF, and TRAC Immigration. We are not claiming statistical precision. We are claiming that adding them up produces a map.\n\n" +
      "The worst-served states cluster in the Deep South — Mississippi, Louisiana, Oklahoma, Alabama, Arkansas — and the Mountain West, with New Mexico, Nevada, and Arizona pulled up by Medicaid unwinding and immigration-court pro se rates. The best-served are in the Northeast — Massachusetts, Connecticut, New Jersey — and a handful of others — Minnesota, DC, Wisconsin, Maine. A family living in poverty in Massachusetts faces a system funded at four to eight times the per-resident level of one living in poverty in Mississippi. The Constitution does not change at the state line. The funding does.\n\n" +
      "The index is composite because the gap is composite. The dimensions reinforce each other. A state that does not fund civil legal aid also does not fund public defenders, also has higher Medicaid procedural disenrollment, also has higher eviction filing rates, also has higher debt-default judgment rates, also has higher pretrial detention, also pays municipal court debt out of the pockets of its poorest residents. None of this is conspiracy. It is downstream of the same set of choices made over decades by appropriations committees answerable to people who never imagined needing any of it.",
    sting:
      "Add up every moment the system chose not to spend, not to fund, not to defend. That number, where you live, is your address.",
    source: {
      label: "Auxilium / Collegium synthesis from BJS, Sixth Amendment Center, LSC, National Registry of Exonerations, and Prison Policy Initiative",
    },
    status: "ready",
  },
];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);
