/**
 * State-specific framings.
 *
 * When the user clicks a state on the Justice Gap map, the sidebar
 * swaps from national narrative to a state-specific reading of the
 * chapter — keyed by state abbreviation + chapter id.
 *
 * Following fostercrisis kickoff §4e. We've drafted the worst-served
 * and best-served states deeply on the most polemic chapters
 * (caseload, money, civil-aid, plea, fines, bail, index). The other
 * chapters fall through to the national framing.
 *
 * Sources: state-level data in stateMetrics.ts; primary citations on
 * each chapter card. The bodies here are the polemic compression —
 * intended to land as a paragraph, not a research summary.
 */

export type StateFraming = {
  /** Big number that replaces the chapter's national headline. */
  headline?: string;
  /** Single-line context under the headline. */
  subline?: string;
  /** Replacement body — 2 to 3 paragraphs. */
  body: string;
  /** Sting specific to this state. */
  sting?: string;
};

/** Lookup: framings[chapterId][stateCode] = StateFraming. */
export const framings: Record<string, Record<string, StateFraming>> = {
  // ── 01: Public-defender caseloads ─────────────────────────────────
  caseload: {
    LA: {
      headline: "720+",
      subline:
        "Felony cases per Louisiana public defender, per year. The ABA recommends 150.",
      body:
        "Louisiana funds its indigent defense system through traffic tickets. Most of the public defender's office's budget comes not from the state's general fund but from a per-conviction fee, which means the system that defends the accused depends on convicting them. In rural parishes, single attorneys carry 700 felony cases per year — the Sixth Amendment Center has documented cases where the defender met the client in the hallway five minutes before the plea.\n\n" +
        "The Louisiana Supreme Court has, more than once, recognized the system as unconstitutional. The legislature has, more than once, declined to fully fix it.",
      sting:
        "Louisiana built a public defender system funded by convictions. The conflict of interest is not a side effect. It is the design.",
    },
    MS: {
      headline: "660",
      subline:
        "Felony cases per Mississippi public defender, per year — among the worst in the country.",
      body:
        "Mississippi spends $4.50 per resident per year on the right to counsel. It does not have a statewide public defender system; indigent defense is handled by individual counties, paid for out of local budgets that are already strained, with attorneys often appointed at flat fees that work out to less than minimum wage per hour of actual work.\n\n" +
        "A 2018 study by the Sixth Amendment Center found that across Mississippi, public defenders are routinely meeting their clients for the first time at arraignment — sometimes within minutes of advising them whether to plead guilty.",
      sting:
        "Mississippi has not chosen to fund Gideon. Mississippi has not chosen not to convict.",
    },
    OK: {
      headline: "620",
      subline:
        "Felony cases per Oklahoma public defender, per year.",
      body:
        "Oklahoma has the second-highest incarceration rate in America. It also has one of the most under-funded indigent defense systems. The Oklahoma Indigent Defense System budget has been cut, in real dollars, in nearly every year of the past decade. Outside Oklahoma County and Tulsa County, indigent defense is a network of part-time contract attorneys, paid hourly rates well below the cost of running an actual law practice.",
      sting:
        "Oklahoma chose to lock up more of its residents than almost anywhere on earth. It did not choose to give them a lawyer first.",
    },
    MA: {
      headline: "280",
      subline:
        "Felony cases per Massachusetts public defender — among the lowest in the country.",
      body:
        "Massachusetts funds the Committee for Public Counsel Services (CPCS) as a statewide agency at roughly $41 per resident, per year — about ten times what Mississippi or Pennsylvania spend. Caseloads are still above ABA recommendations, but they are workable. CPCS staff attorneys carry roughly 280 felony cases per year, with investigators, social workers, and a real motion practice.\n\n" +
        "The outcomes track. Massachusetts has the lowest incarceration rate in America. Its exoneration count is high mostly because its post-conviction defense bar actually goes back and looks.",
      sting:
        "What it takes to fund Gideon is not a mystery. It is a budget. Massachusetts wrote one.",
    },
    DC: {
      headline: "200",
      subline:
        "Felony cases per DC public defender — among the very lowest in the country.",
      body:
        "The District of Columbia funds the Public Defender Service for DC (PDS) as a federal-grade institution. Attorneys are paid competitively with federal prosecutors. They have investigators, social workers, mitigation specialists, and a budget for expert witnesses. The caseload is around 200 per attorney — closer to the ABA's old standard of 150 than any other jurisdiction in the country gets.\n\n" +
        "PDS is the proof of concept. It also happens to be the public defender system most often praised by the very judges who hear its cases.",
      sting:
        "When Gideon is funded as Gideon intended, it works. DC built that. The rest of the country chose not to.",
    },
  },

  // ── 02: Indigent defense spending per capita ──────────────────────
  spend: {
    MS: {
      headline: "$4.50",
      subline:
        "Mississippi's per-resident indigent-defense spending — among the lowest in the country.",
      body:
        "Mississippi's per-resident indigent defense spending — about $4.50 a year — works out to roughly two cups of coffee per resident, per year. The state's per-capita corrections budget is more than fifteen times that.\n\n" +
        "The math is not a budget shortfall. It is a stated priority. Mississippi has, in successive legislative sessions, voted to spend more on prisons and less on the lawyers who might keep people out of them.",
      sting:
        "Mississippi has paid more, per resident, to lock people up than to ensure they had counsel before the door closed.",
    },
    PA: {
      headline: "$4.50",
      subline:
        "Pennsylvania's per-resident indigent defense spending — among the lowest in America for a populous state.",
      body:
        "Pennsylvania is one of two states (Mississippi being the other) where indigent defense receives essentially no state funding. The whole bill falls on counties — wealthy ones can fund the work; poor rural ones cannot. The result is a Pennsylvania where the right to counsel depends on which county you were arrested in.\n\n" +
        "The Pennsylvania Supreme Court has, on the record, called the system 'shameful.' The legislature has, on the record, done nothing.",
      sting:
        "In Pennsylvania, the right to a lawyer turns on your zip code.",
    },
    MA: {
      headline: "$41",
      subline:
        "Massachusetts spends roughly ten times what Mississippi or Pennsylvania spend on indigent defense, per resident.",
      body:
        "Massachusetts funds the Committee for Public Counsel Services at $41 per resident — the highest among large states. CPCS pays its attorneys competitively with district attorneys, retains investigators, runs an in-house motion practice, and supervises caseloads. The state spends about 0.4% of its general fund on the constitutional right to counsel.\n\n" +
        "What the funding produces: the country's lowest incarceration rate, the country's most active exoneration practice, and the country's lowest recidivism rate.",
      sting:
        "Funding Gideon costs less than half a percent of a state budget. Massachusetts spent it.",
    },
    WI: {
      headline: "$42",
      subline:
        "Wisconsin has the country's highest per-resident indigent defense spending.",
      body:
        "Wisconsin runs a statewide State Public Defender's Office funded at the federal model — full-time attorneys, social workers, investigators. Per-resident spending is the highest in the country at roughly $42. The outcomes track: Wisconsin has the lowest recidivism rate in America, lower than Massachusetts.",
      sting:
        "Wisconsin's investment proves what the math always said: it is cheaper to defend than to incarcerate.",
    },
  },

  // ── 03: Incarceration rate ────────────────────────────────────────
  incarceration: {
    LA: {
      headline: "1,094",
      subline:
        "Louisiana's incarceration rate per 100,000 — the highest in the world.",
      body:
        "Louisiana incarcerates a higher share of its residents than any country on earth. The rate is more than twice the U.S. national average, which is itself the highest in the developed world. The Louisiana state prison system is partially privatized; many parish jails make most of their revenue housing state prisoners.\n\n" +
        "The economics produce their own gravity. Sheriffs lobby against sentencing reform because their budgets depend on inmate-day reimbursements. The state's indigent defense system is funded through traffic fines. Every part of the pipeline is paid for by the people it processes.",
      sting:
        "Louisiana built a system that pays everyone who runs it more money the more people it locks up. It does what it was built to do.",
    },
    MS: {
      headline: "1,031",
      subline:
        "Mississippi locks up its residents at higher rates than every nation on earth except a handful.",
      body:
        "Mississippi's incarceration rate — over 1,000 per 100,000 — places it above El Salvador (which is famous for it), above Cuba, above Rwanda. Mississippi has the highest Black incarceration rate in America. The state spends 15× more per resident on locking people up than on defending them in court.\n\n" +
        "This is not the inheritance of a frontier penal code. It is the product of legislative choices made in living memory.",
      sting:
        "Mississippi is not the South of 1865. It is the South of yesterday's appropriations bill.",
    },
    MA: {
      headline: "275",
      subline:
        "Massachusetts locks up fewer of its residents than any state in America — about a quarter of Louisiana's rate.",
      body:
        "Massachusetts has the lowest incarceration rate in the United States. It funds its indigent defense bar. It has decriminalized substantially more conduct than its peers. Its racial disparities, while present, are smaller than in any large state.\n\n" +
        "The system Massachusetts built is not radical. It is what the U.S. national average would look like if every other state simply matched what Massachusetts does.",
      sting:
        "If America's average matched Massachusetts, the U.S. would no longer have the developed world's highest incarceration rate.",
    },
  },

  // ── 04: Civil legal aid ────────────────────────────────────────────
  "civil-aid": {
    MS: {
      headline: "0.4",
      subline:
        "LSC-funded attorneys per 10,000 Mississippians in poverty — among the lowest in the country.",
      body:
        "Mississippi has the lowest household income in America. It also has, by per-capita measure, the thinnest civil legal aid coverage. There is roughly one LSC-funded attorney for every 25,000 low-income Mississippians. The two LSC grantees serving the state — Mississippi Center for Justice and North Mississippi Rural Legal Services — are excellent and chronically swamped.\n\n" +
        "The mismatch is not a managerial problem. There are not enough lawyers because there is not enough funding.",
      sting:
        "Mississippi's poorest residents face the highest civil legal need in the country and the lowest civil legal supply.",
    },
    MA: {
      headline: "1.4",
      subline:
        "Massachusetts has roughly four times the civil legal aid coverage of Mississippi.",
      body:
        "Massachusetts funds civil legal aid both through the federal LSC channel and through state appropriations — the Massachusetts Legal Assistance Corporation, which receives a line item in the state budget. The legal-aid bar is concentrated, organized, and adequately funded, with statewide hotlines, courthouse self-help centers, and an integrated tech infrastructure (MassLegalHelp.org).\n\n" +
        "The investment has built one of the country's most coordinated civil legal aid systems.",
      sting:
        "Massachusetts didn't wait for Congress. It funded its own civil right to counsel.",
    },
    DC: {
      headline: "2.2",
      subline:
        "DC has roughly five times Mississippi's per-resident civil legal aid coverage.",
      body:
        "DC funds the Bar Foundation, the Catholic Charities Legal Network, and a dozen smaller civil-aid programs at levels that, on a per-capita basis, dwarf almost every state. It also passed eviction Right to Counsel in 2018, and has expanded it since. Tenants facing eviction in DC have an actual right to a lawyer — and the city has funded the lawyers.",
      sting:
        "DC's law schools graduate civil legal aid attorneys who can find jobs. Mississippi's graduate civil legal aid attorneys who cannot.",
    },
  },

  // ── 06: Plea bargain ──────────────────────────────────────────────
  plea: {
    TX: {
      headline: "96%",
      subline:
        "Texas felony convictions by plea, not trial. The state has the highest absolute exoneration count in America.",
      body:
        "Texas has the highest documented exoneration count of any U.S. state — 488 cases, more than half of them out of Harris County (Houston) alone. The state convicts at the national plea rate; the volume is what produces the absolute number of wrongful convictions discovered.\n\n" +
        "The Texas plea machine works through volume. Harris County alone produces more felony convictions per year than most states. The math on pro-se exposure to a Texas felony plea offer — 'I can give you 5 years today or you can fight and lose 25' — does not require complicated game theory.",
      sting:
        "Texas exonerated 488 people we know about. The number we don't know about is, by definition, higher.",
    },
    NY: {
      headline: "94%",
      subline:
        "New York's plea rate is below the national average — by enforcement choice, not by trial volume.",
      body:
        "New York's plea rate, while still over 90%, is among the lower of large states. The institutional choice to invest in jury trials, post-Indigent Legal Services reforms in the 2010s, has produced measurably more actual adjudication. The Innocence Project — founded in New York — has driven a comparatively strong post-conviction practice.\n\n" +
        "It is still the case that 94 of every 100 New York felony convictions are pleas. Even a 'better' American jurisdiction is a plea-bargain system.",
      sting:
        "When the best of the country still resolves 94 of 100 felonies in a hallway, what the Sixth Amendment guarantees is theoretical.",
    },
  },

  // ── 08: Fines and fees ────────────────────────────────────────────
  fines: {
    MO: {
      headline: "11.4%",
      subline:
        "Missouri's average reliance on court fines as a share of local revenue — among the highest in the country.",
      body:
        "Ferguson, Missouri made the model national. The 2015 Department of Justice report documented a small city that funded itself by ticketing poor Black residents. The model exists across Missouri: small jurisdictions that depend on court fines for between 10% and 30% of their general fund.\n\n" +
        "A Missouri Supreme Court study in 2017 found that 100+ Missouri towns ran courts that exist primarily as revenue-collection operations. Many of those have continued to do so since.",
      sting:
        "Ferguson is not history. Ferguson is the average Missouri small town.",
    },
    LA: {
      headline: "8.4%",
      subline:
        "Louisiana parishes fund themselves heavily on court fines — and route those fines to the public defenders defending the people who pay them.",
      body:
        "Louisiana is the only state in the country where the per-conviction fines that defendants pay are routed directly to the public defenders who represent them. The state's indigent defense funding mechanism is, structurally, conviction-driven. When convictions decline, public defenders are paid less. When they rise, the system is funded.",
      sting:
        "Louisiana built a Sixth Amendment that pays out only when it loses.",
    },
  },

  // ── 09: Bail ──────────────────────────────────────────────────────
  bail: {
    NV: {
      headline: "75%",
      subline:
        "Nevada has the highest pretrial detention share in America — three out of four jail inmates are unconvicted.",
      body:
        "Nevada's pretrial detention rate — about 75% of jail population — is the country's highest. Nevada also has the fastest summary eviction process (5–7 days) and one of the lower indigent defense budgets. The system processes its lowest-income residents at high speed and with minimal counsel.",
      sting:
        "Three of every four people in a Nevada jail tonight have not been convicted of anything.",
    },
    NJ: {
      headline: "28%",
      subline:
        "New Jersey has the country's lowest pretrial detention rate — by deliberate policy, not chance.",
      body:
        "In 2017, New Jersey effectively abolished cash bail through the Criminal Justice Reform Act, replacing it with a risk-assessment system that releases most defendants pretrial unless they're shown to pose a genuine flight or violence risk. The state's pretrial detention rate dropped from over 50% to under 30% within two years. Failure-to-appear rates did not measurably increase.",
      sting:
        "Cash bail was not a public-safety tool. New Jersey proved it.",
    },
  },

  // ── 12: Composite index ───────────────────────────────────────────
  index: {
    MS: {
      headline: "92 / 100",
      subline:
        "Mississippi sits at the worst end of every dimension of the Justice Gap Index.",
      body:
        "Mississippi is at or near the worst on all six dimensions of the index: highest pd caseload, lowest indigent spending, lowest civil legal aid coverage, second-highest incarceration rate, highest plea rate, near-highest pretrial detention. Reasonable people may dispute the precise composite weighting; nobody serious disputes the direction.",
      sting:
        "If we wanted to design a state where being poor and accused was as constitutionally protected as possible, we know how. Mississippi tells us what we built instead.",
    },
    MA: {
      headline: "14 / 100",
      subline:
        "Massachusetts sits at the best end of nearly every dimension.",
      body:
        "Massachusetts ranks among the top three states on five of the six dimensions — manageable pd caseloads, highest indigent spending, strong civil-aid coverage, lowest incarceration rate, lowest pretrial detention. The plea rate (93%) is still high, but at the low end of the U.S. range.\n\n" +
        "Massachusetts is not utopia. It is what an honest reading of the U.S. Constitution funded at half a percent of a state budget produces.",
      sting:
        "Twelve states could not pass what Massachusetts has passed. Mississippi could not pass what Connecticut has passed. The question is no longer feasibility.",
    },
  },
};

/** Lookup helper. */
export function getFraming(
  chapterId: string,
  stateCode: string
): StateFraming | undefined {
  return framings[chapterId]?.[stateCode];
}
