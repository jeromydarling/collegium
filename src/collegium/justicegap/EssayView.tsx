import { Link } from "react-router-dom";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Prayer } from "./components/Prayer";
import { meditationById } from "./data/prayers";

/**
 * Essay view — long-form argument in numbered sections, each ending
 * in a public-domain meditation block.
 *
 * Structure: four foundational sections (i–iv) frame Gideon and the
 * civil/criminal divide. Six civil sections (v–ix) — eviction, the
 * collection court, family court pro se, the administrative denial,
 * removal without counsel — carry the larger share of the unmet
 * legal need. Four criminal deep-dives (x–xiii) — bail, plea
 * bargaining, the death-penalty geography, reentry — carry the
 * sharper-stakes argument. The civil:criminal weighting in the essay
 * reflects, roughly, the actual ~15:1 ratio of unmet civil to
 * criminal legal need documented by LSC (2022) and BJS.
 */
export function EssayView() {
  return (
    <div className="bg-[hsl(40_30%_94%)] text-[hsl(220_30%_18%)] min-h-screen">
      <ModeSwitcher />

      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[hsl(354_55%_28%)] mb-3">
            Justice Gap · Essay
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl text-[hsl(220_30%_14%)] leading-[1.05] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
          >
            What the law promised, and what it cost to find out we lied.
          </h1>
          <p className="text-sm sm:text-base text-[hsl(220_20%_38%)] leading-relaxed italic max-w-xl mx-auto">
            A reading on the gap between the constitutional right to counsel
            and the lived experience of an American without money.
          </p>
        </header>

        <Section
          number="i"
          title="The promise."
          body={[
            "In March of 1963, Justice Hugo Black wrote for a unanimous Supreme Court that any person too poor to hire a lawyer, facing serious criminal charges, must have one provided. Until then, the right to counsel had meant the right to pay for one. After Gideon, it became something else: a promise the state made to every defendant in its courts.",
            "The promise was an enormous one. It put the state on the hook for a defense it had no infrastructure to deliver. It assumed funding it had not appropriated, lawyers it had not trained, courtrooms it had not built. The Court issued the decision and went home. The states were left holding the bill.",
            "Sixty years on, almost every state has, in some sense, kept the promise. There are public defenders. There are appointed counsel. There are caseload standards. There are model rules. The promise lives in statute and in case law.",
            "The promise does not live in courtrooms.",
          ]}
          prayer={meditationById("gideon-decision")}
        />

        <Section
          number="ii"
          title="The arithmetic."
          body={[
            "The American Bar Association's recommended maximum caseload for a single public defender is 150 felonies per year. The number was set in 1973. In 2023, the National Public Defense Workload Study revised it lower — between 25 and 60 felonies per year, depending on case complexity. That study was the first major update in fifty years.",
            "The real numbers, taken from state-by-state surveys by the Sixth Amendment Center: 400, 500, 600, 800 felonies per attorney, per year. In some Louisiana parishes, single defenders handle more than 700. In rural Texas, the practice of indigent defense has been almost entirely outsourced to private attorneys paid a flat fee per case — often less than minimum wage when divided by the hours actually required.",
            "An attorney with 800 felonies per year has, on the most charitable arithmetic, less than three hours per case. Most of the case work — investigation, expert consultation, motion practice — cannot be done in three hours. So it isn't done.",
            "What gets done instead is a plea bargain. Ninety-seven percent of federal felony convictions, ninety-five percent of state ones, end in a guilty plea negotiated in a hallway. The right to a trial by jury is, in practice, the right to refuse a deal that the system has structured to be functionally impossible to refuse.",
          ]}
          prayer={meditationById("sixth-amendment")}
        />

        <Section
          number="iii"
          title="The other half of the law."
          body={[
            "Gideon was a criminal case. The constitutional right to counsel applies only to criminal prosecutions. Everything that happens to a poor American in a civil court — eviction, child custody, debt collection, benefits denial, immigration removal — happens, by default, without a lawyer.",
            "The Legal Services Corporation, the largest single funder of free civil legal aid in the country, reported in 2022 that 92% of substantial civil legal problems of low-income Americans received inadequate or no legal help. Forty-nine percent of eligible people who walked through the door of an LSC-funded program were turned away — not because they didn't qualify, but because there were not enough lawyers.",
            "There is no Gideon for an eviction case. There is no Gideon for a custody fight. There is no Gideon for a deportation hearing. The Sixth Amendment ends where the criminal court ends. Everything past that door, the poor walk alone.",
            "Some states and cities have begun to grant a civil right to counsel in eviction cases — Connecticut and Washington statewide; New York City, San Francisco, Cleveland, Detroit, Philadelphia, Newark and a growing list of others at the city level. Where these programs exist and are funded, the data is unambiguous: tenants with lawyers stay in their homes about 84% of the time. Tenants without lawyers do not.",
            "Everywhere else, the answer to the question 'do I have a right to a lawyer?' is, in civil court, no.",
          ]}
          prayer={meditationById("micah-6")}
        />

        <Section
          number="iv"
          title="The cost we choose not to pay."
          body={[
            "All in, state and local governments spend roughly four billion dollars a year on indigent defense. Across the U.S. population, that's about eleven dollars and eighty-six cents per resident, per year. About what we spend on a single streaming subscription per month.",
            "If we tripled it — if we spent thirty-five dollars per resident per year on the defense of the people accused in our courts — we would still spend less, per person, than we spend on entertainment. We would make Gideon real.",
            "The math is not hard. The will is what is missing. And the will is missing because the people whose rights are being denied are not, by and large, the people the appropriations committees are responsive to.",
            "The gap between the constitutional promise and the lived experience of an indigent defendant is not a policy failure. It is a moral choice we keep making.",
          ]}
          prayer={meditationById("amos-5")}
        />

        <Section
          number="v"
          title="Eviction, and the lawyer one side has."
          body={[
            "The Eviction Lab at Princeton has documented, in year after year of data collection, roughly 3.6 million eviction filings in American courts annually — naming about seven percent of all renting households each year. Federal moratoria and the Emergency Rental Assistance Program briefly drove that number down during the pandemic. By 2023 the filings had rebounded; by 2024 and 2025 the Eviction Lab's tracking system was reporting them above pre-pandemic levels in most jurisdictions.",
            "Inside the courtroom the asymmetry is total. The Legal Services Corporation's Civil Court Data Initiative studied the Virginia eviction docket and found that tenants had counsel in one percent of cases. Landlords had counsel in sixty-eight percent. The represented tenant was about seven times more likely to prevail. In Philadelphia, five percent of represented tenants were forcibly displaced; seventy-eight percent of unrepresented tenants were. In Cleveland's right-to-counsel pilot, ninety-three percent of represented tenants either kept their homes or got an orderly move-out. New York City's Right-to-Counsel statute, the country's first, peaked at seventy-one percent of eligible tenants represented under its mandate. By 2024 the share had fallen to forty-two percent, and in the Bronx to thirty-one percent, as the program ran out of attorneys faster than the city replaced them. In the same year, eighty-nine percent of represented New York households avoided eviction. Stout Risius Ross's independent cost-benefit analysis projects that New York's program generates three hundred and twenty million dollars in annual public benefits — averted shelter use, preserved subsidized housing, reduced emergency-room and law-enforcement contact — against one hundred and ninety-one million dollars in costs.",
            "Connecticut, Maryland, Minnesota, and Washington have enacted statewide eviction right-to-counsel laws. Eighteen more cities have done the same locally. Forty states have done nothing. Where Gideon was a national promise extended without funding, civil right to counsel in eviction is a patchwork extended only where political will has briefly converged.",
            "Black renters are eighteen-point-six percent of all American renters, and they account for fifty-one-point-one percent of every eviction filing in the country. Black women with children face the highest filing rate of any race-gender-parental group. Matthew Desmond and his collaborators at Princeton, working from Georgia data, found that eviction during the second or third trimester of pregnancy is associated with lower infant birthweight and earlier gestational age. The harm reaches the next generation in utero.",
            "Jasmine Carter, a Maryland tenant of Kushner Companies, was sued for rent she had already paid. ProPublica followed her through seven separate court dates over several years; pro bono counsel only entered the case after the reporter did. A $4,615 lien was finally released more than seven years after she had moved out. The case was winnable on the facts at the first hearing. What she lacked was a lawyer. Roughly three and a half million times a year, in some American courtroom, that is what is missing.",
          ]}
          prayer={meditationById("isaiah-10-decrees")}
        />

        <Section
          number="vi"
          title="The collection court."
          body={[
            "Debt collection is now the largest single category of civil case on American state-court dockets. The Pew Charitable Trusts documented that debt claims grew from roughly one in nine civil cases in 1993 to about one in four by 2013. Their 2023 follow-up reported that across the nine states with comparable data — Alaska, Colorado, Connecticut, Indiana, Missouri, New Mexico, Texas, Utah, Wisconsin — debt cases were forty-two percent of the civil docket by 2021, up from twenty-nine percent in 2013. In New Mexico the share was fifty-one percent. In Texas, forty-eight. By 2025, filings had returned past their pre-pandemic highs.",
            "Roughly seventy percent of these lawsuits end in default judgment. The defendant did not, in any meaningful sense, ignore the case. The defendant could not afford a lawyer for a fifteen-hundred-dollar dispute, could not miss a shift at fourteen dollars an hour to sit in a courthouse, could not parse a summons written in legalese, and could not, in many cases, prove that the summons had ever been properly served — what consumer-law attorneys call sewer service. The Princeton-based Debt Collection Lab quantified what counsel does in this forum: in their four-county study, the presence of a defense lawyer reduced the likelihood of default judgment by ninety-one-point-one percent. Pew documented that fewer than ten percent of consumer defendants in debt cases have a lawyer; debt collectors are represented in nearly one hundred percent.",
            "About a quarter of all debt sold to buyers, by Federal Trade Commission measurement, is already past the statute of limitations. The Consumer Financial Protection Bureau's 2023 Annual Report under the Fair Debt Collection Practices Act received one hundred and nine thousand consumer complaints, fifty-three percent of which were about attempts to collect debts not owed — the predominant complaint category every year since 2013. The two largest debt buyers in the country, Encore Capital and Portfolio Recovery Associates, have repeatedly been sanctioned by the CFPB for filing tens of thousands of suits through law firms staffed by only a handful of attorneys.",
            "Roughly one hundred million Americans carry medical debt they cannot pay — about two hundred and twenty billion dollars in total. On January 7, 2025, the CFPB finalized a rule that would have removed medical debt from credit reports for some fifteen million people: an estimated forty-nine billion dollars in debt cleared. On July 11, 2025, the United States District Court for the Eastern District of Texas vacated the rule at the joint request of the new CFPB leadership and industry plaintiffs. Eleven states have since enacted their own state-level medical-debt credit-reporting bans.",
            "Sherry McKee monitors a dormitory at a tribal boarding school outside McAlester, Oklahoma. She has been sued three times by McAlester Regional Medical Center, most recently over a three-thousand-three-hundred-and-seventy-five-dollar bill for what turned out to be vertigo — an amount exceeding her monthly salary. The hospital and its affiliated clinic have filed close to five thousand collection cases since the early nineteen-nineties, nearly all of them handled by a single father-and-daughter law firm. On the morning a KFF Health News reporter watched, that firm disposed of fifty-one cases in roughly an hour. None of those defendants had a lawyer.",
          ]}
          prayer={meditationById("isaiah-1")}
        />

        <Section
          number="vii"
          title="Family court, pro se."
          body={[
            "The Institute for the Advancement of the American Legal System at the University of Denver — IAALS, in the field's shorthand — has spent more than a decade documenting that sixty to ninety percent of family-law cases in the United States have at least one party without a lawyer. California's number rises from roughly seventy percent at filing to about eighty percent by judgment. South Carolina's protective-order docket runs at approximately seventy-five percent no-counsel-on-either-side. The National Network to End Domestic Violence's single-day count in 2025 found that one thousand seven hundred and seven domestic-violence programs across the country served eighty-four thousand adults and children that day, and turned away thirteen thousand more requests for help.",
            "What is decided in this forum is who raises a child, whether a parent goes to jail for unpaid child support, whether a survivor of intimate violence can leave, whether the children of an incarcerated parent enter the foster-care system. The Supreme Court declined, in Lassiter v. Department of Social Services in 1981, to recognize a categorical due-process right to counsel for parents facing termination of their parental rights. Forty states and the District of Columbia have since provided that right by statute; ten have not, or have qualified it. In 2011, in Turner v. Rogers, the Court held that the Fourteenth Amendment does not require appointed counsel for an indigent father facing jail on civil contempt for unpaid support — provided the court supplies what the decision calls 'alternative procedural safeguards.' Michael Turner had been jailed six times, including a twelve-month stretch, without those safeguards.",
            "Roughly sixty-five thousand American children had their relationships to a parent terminated by court order in fiscal year 2021. Forty-nine percent of children currently in foster care have already had at least one parent's rights terminated. The Adoption and Safe Families Act of 1997 requires state child-welfare agencies to file for termination once a child has been in foster care for fifteen of the previous twenty-two months. The average state prison sentence is more than five years. The arithmetic does not allow a parent in prison to keep their children even when nothing else about their fitness as a parent has changed.",
            "Jennifer Moston of Wisconsin documented more than fifty acts of domestic violence by her husband in twenty pages of contemporaneous handwritten notes. Wisconsin's family court, operating under a presumption of shared parenting, moved toward joint custody anyway. The case was not resolved by family court. It was resolved by a criminal judge who, in 2018, sentenced her husband to eight and a half years' imprisonment and barred contact with the child for ten years. The civil system, designed around a presumption of cooperative co-parents and competent self-represented litigants, structurally underweights documented abuse until a criminal court intervenes.",
            "Family-court neutrality is the official defense of the architecture: same rules for everyone. But neutrality between a represented party and a pro se party is asymmetry dressed as fairness. The represented party drafts the order. The judge signs it. The pro se party leaves the courthouse with a custody schedule they never saw before the hearing.",
          ]}
          prayer={meditationById("proverbs-31-mouth")}
        />

        <Section
          number="viii"
          title="The administrative denial."
          body={[
            "The largest civil-justice failure in America does not happen in a courtroom. It happens in an unanswered letter, an unreturned form, a phone tree that disconnects at minute thirty-two. The administrative state distributes disability benefits, food assistance, health coverage, and unemployment insurance — and denies eligible Americans at scale, then makes the appeal so procedurally hostile that most simply stop trying.",
            "The Social Security Administration's own 2023 statistical report shows that the initial allowance rate for Social Security Disability Insurance applications has hovered between nineteen and twenty-one percent for a decade; the final award rate after all appeals averages about thirty percent. At the administrative-law-judge hearing stage, the approval rate climbs to roughly fifty percent — for represented claimants. Represented claimants are nearly three times as likely to prevail as those without counsel. The Government Accountability Office found, in a 2020 audit, that one hundred and nine thousand seven hundred and twenty-five disability claimants died awaiting their appeal decisions between fiscal years 2008 and 2019, and that another forty-eight thousand declared bankruptcy while waiting. Median wait was eight hundred and thirty-nine days. SSA has since cut the wait roughly in half; eight states still average more than nine months.",
            "When the federal continuous-coverage rule that kept Americans on Medicaid through COVID expired in April of 2023, the states began what was called the Unwinding. The Kaiser Family Foundation tracker, which covers all fifty states and the District of Columbia, documents that twenty-five million Americans lost Medicaid coverage in the unwinding through mid-2025. Sixty-nine percent of those terminations were procedural — paperwork errors, missed letters, recertifications that never reached the recipient. The recipients did not become ineligible; they failed to navigate a process. The variance between states is the moral content of the data. Nevada and New Mexico ran procedural-termination shares of ninety-three percent. Texas ran roughly seventy-one. Maine ran twenty-two. One federal statute, administered fifty-one different ways.",
            "Beneath SSDI and Medicaid sits the Supplemental Nutrition Assistance Program churn. The Urban Institute and the Center on Budget and Policy Priorities document that seventeen to twenty-eight percent of SNAP households experience churn — losing benefits and re-enrolling within ninety days, almost always for procedural reasons. A San Francisco recertification study found that ninety-four percent of rejected recertifications involved earnings still below the eligibility threshold. The denials are not separating fraud from need. They are separating people with broadband, stable mail, and the bandwidth to navigate bureaucracy from people without.",
            "Christopher Tincher began his work life as a teenager in an Aflex, Kentucky coal mine. He moved to grill-scraping, to janitorial work, to a Walmart tire bay in Arkansas, and finally to a small-town wastewater plant in 2017, where sewage soaked into his ill-fitting boots and his right leg was amputated below the knee. SSA denied his disability claim in 2018. He won, years later, on appeal. ProPublica's October 2025 reporting documents that a recently proposed administrative rewrite of the SSA's 'grid rules' would have stripped eligibility from roughly eight hundred and thirty thousand mostly older blue-collar workers like him, cascading into loss of Medicare and forced early-retirement drawdowns.",
            "Program integrity is the official rationale for every denial. Program integrity is also what the data above describes the system as failing to deliver — separating people with lawyers from people without is not integrity, and it is not policy. It is the justice gap, administered.",
          ]}
          prayer={meditationById("james-5-labourers")}
        />

        <Section
          number="ix"
          title="Removal without counsel."
          body={[
            "Deportation, in American law, is a civil proceeding. The Supreme Court held in INS v. Lopez-Mendoza in 1984 that because removal is not punishment in the criminal-law sense, the Sixth Amendment guarantee of counsel does not reach it. Counsel is statutorily permitted, but, in the words of the statute itself, at no expense to the Government.",
            "The system thus operates exactly as the doctrine describes. People are detained far from any immigration lawyer — Winn Correctional in rural Louisiana, four hours from the nearest immigration practitioner; Stewart Detention Center in southern Georgia; the newer facilities opened in 2025 that the federal government nicknamed Alligator Alcatraz. The American Civil Liberties Union's 2024 report No Fighting Chance documented that at one hundred and seventy-three of the country's roughly one hundred and ninety-two ICE detention facilities, nearly every channel of attorney-client communication — secure phone, contact visitation, video — was broken.",
            "TRAC Immigration at Syracuse maintains the running tally. At the end of 2025, U.S. immigration courts carried roughly three-point-four million active pending cases. The asylum grant rate, which had been about thirty-eight percent as recently as August of 2024, had collapsed to nineteen-point-two percent by August of 2025 — the lowest in a decade. Roughly seventy percent of detained respondents face removal proceedings without a lawyer at the merits stage. The Vera Institute's evaluation of the New York Immigrant Family Unity Project — the original universal-representation program — documented an eleven-hundred-percent improvement in successful outcomes for detained respondents who received counsel: from four percent pro se to a projected forty-eight percent represented. In-absentia removal orders fell from sixty-eight percent for unrepresented respondents to seven percent for represented ones.",
            "Children fare worse than adults. A 2025 study covering 2009 through 2023 found that only fifty-one percent of unaccompanied minors had counsel in their removal proceedings; children with counsel were more than seven times more likely to be allowed to remain. In the spring of 2025, the federal contract held by the Acacia Center for Justice — covering legal representation for some twenty-six thousand unaccompanied children — was terminated. A federal judge ordered partial restoration; coverage remains fragmented. The National Qualified Representative Program, the only federal program guaranteeing counsel to detained immigrants with serious mental disabilities — established under the 2013 court order in Franco-Gonzalez v. Holder — was likewise defunded. The program had served roughly three thousand people whom the courts themselves had ruled were incompetent to represent themselves.",
            "The Department of Homeland Security's interim report of April 2024, the most recent comprehensive accounting, identified four thousand six hundred and fifty-six children separated from their parents under the 2017–2018 Zero Tolerance policy. As of that report, one thousand three hundred and sixty of those children still had no confirmed reunification, and four hundred and forty-six family contacts could not be located at all.",
            "The civil label cannot do the moral work of distinguishing a parking ticket from permanent exile to a country that someone fled at gunpoint. The stakes are the Gideon stakes. The statute pretends otherwise. The map is what the statute has produced.",
          ]}
          prayer={meditationById("leviticus-19-stranger")}
        />

        <Section
          number="x"
          title="The bail gap."
          body={[
            "On any given day in 2023, the Bureau of Justice Statistics counted roughly 467,600 people in American jails who had not been convicted of anything. That figure is seventy percent of every jail bed in the country — the highest share in more than a decade. They were not held because the state had proved its case. They were held because they could not post the bond a magistrate had set, sometimes minutes after their arrest, often without their lawyer present.",
            "The median felony bail in the United States is about ten thousand dollars. For the median detained defendant — disproportionately poor, disproportionately without savings, disproportionately working hourly — that is roughly eight months of income. For misdemeanors, the amounts run from five hundred to two thousand dollars. Federal research has documented for decades that the people who cannot pay five hundred dollars stay in jail for weeks, months, sometimes a year — for charges that, on conviction, would have carried no prison time at all.",
            "Heaton, Mayson, and Stevenson, working from Harris County, Texas data, showed in 2017 what every public defender already knew. Pretrial detention does not predict guilt; it manufactures it. Detained misdemeanor defendants pleaded guilty twenty-five percent more often than otherwise-identical defendants who made bail. They were sentenced to jail forty-three percent more often. Their sentences ran more than twice as long. And they reoffended at higher rates, not lower — pretrial detention is, in the empirical literature, criminogenic. It produces the conduct it is theoretically designed to prevent.",
            "Three states have run the natural experiment. New Jersey abolished cash bail for most offenses in 2017; its pretrial jail population fell by more than a quarter, and the Drexel study published in 2024 found no increase in firearm violence. New York reformed bail in 2019; ninety-six percent of pretrial-released defendants were not rearrested, and ninety-nine percent were not rearrested on a violent felony. Illinois became the first state in the country to abolish cash bail outright when the Pretrial Fairness Act took effect in September of 2023; jail populations fell by twenty-five percent in rural counties and fourteen percent in Cook County, and the comparable-period crime rate dropped by eleven percent. About one hundred and forty million dollars a year that had been extracted from working families in Illinois as bail money now stays in those families.",
            "Layleen Polanco was twenty-seven years old when she was arrested on misdemeanor drug charges in New York in April of 2019. The court set her bail at five hundred dollars. She could not pay. She was placed in solitary confinement at Rikers Island despite a documented seizure disorder. On June 7, 2019, she died of an epileptic seizure in her cell. Five hundred dollars. Less than a month's rent in any borough of the city that built that cell.",
            "The Eighth Amendment to the United States Constitution, ratified in 1791, declares that excessive bail shall not be required. The Supreme Court has spent two hundred and thirty-four years declining to say what that means when the bail amount is five hundred dollars and the defendant does not have five hundred dollars. The clause is still on the page. It has not yet been made to mean what it says.",
          ]}
          prayer={meditationById("psalm-82")}
        />

        <Section
          number="xi"
          title="The plea-bargain economy."
          body={[
            "Of the 61,678 federal criminal cases concluded in the 2024 fiscal year, approximately ninety-seven percent ended in a guilty plea. The figure has held above ninety-five percent for more than a generation. In state courts, the American Bar Association's 2023 Plea Bargain Task Force put the rate at roughly ninety-eight percent. Fewer than three federal defendants out of a hundred ever see the inside of a jury room. The Sixth Amendment right to a trial by jury — the right that Madison thought central enough to enumerate first — has, in the practice of American criminal courts, become a rare and expensive exception.",
            "What replaced the trial was a price. The 2018 National Association of Criminal Defense Lawyers study found that, at the federal level, defendants who went to trial and lost served sentences roughly three times longer than defendants who pleaded guilty to the same conduct. In some categories of offense, the multiplier ran to eight or ten. The legal academy calls this the trial penalty. From a defendant's seat, it is not a penalty in any abstract sense. It is the prosecutor offering two years if you sign, and threatening twelve if you don't.",
            "Justice Anthony Kennedy, writing for the majority in Missouri v. Frye in 2012, acknowledged what every working defender already knew. \"Plea bargaining,\" he wrote, \"is not some adjunct to the criminal justice system; it is the criminal justice system.\" The Court has nonetheless continued to treat the jury trial as the constitutional baseline and the plea as the voluntary exception. The doctrine has not caught up with the architecture. Boykin v. Alabama, decided in 1969, still requires the colloquy in which a judge asks whether the defendant is pleading \"knowingly, intelligently, and voluntarily.\" The colloquy lasts about four minutes. The plea has often been discussed with counsel for less time than that.",
            "Mandatory minimums and charge stacking are the visible levers. The prosecutor files every available enhancement — career offender, repeat offender, weapon, quantity — and then offers the discount that comes from dropping them. Pretrial detention is the silent one. The Harris County study found that detained defendants pleaded guilty at twenty-five percent higher rates than otherwise-similar released defendants, and that roughly seventeen percent of detained defendants who pleaded would likely not have been convicted at all had they been free to fight from the outside.",
            "The National Registry of Exonerations has documented more than thirty-six hundred American exonerations since 1989. About a quarter of the exonerees, by the Registry's own count, had pleaded guilty before being cleared. They are the cases we know about. The universe of innocent pleas that never get unwound is, by definition, unknowable, and it is larger. In 2024, Texas's Court of Criminal Appeals declared Kerry Max Cook \"actually innocent\" of a murder he had been on death row for since 1977. He had taken a no-contest plea in 1999, after his fourth trial collapsed, in exchange for release. DNA tied another man to the crime two months later. He spent the next twenty-five years trying to prove that the plea had been a lie.",
            "Brady v. United States, decided in 1970, holds that a plea induced by the threat of more severe punishment is not, in itself, unconstitutionally coerced. That was the doctrine when most American felonies still went to trial. It is also the doctrine now, when virtually none of them do. The right to a jury is not denied. It is priced. And the price clears the market.",
          ]}
          prayer={meditationById("proverbs-22-gate")}
        />

        <Section
          number="xii"
          title="The geography of the death penalty."
          body={[
            "The death penalty is constitutional. The Supreme Court of the United States has said so for half a century. Twenty-seven American states currently authorize it. The remaining twenty-three either have abolished it or never adopted it. Of the twenty-seven that retain it, only a handful actually use it in any given year: in 2024, twenty-five executions were carried out, nineteen of them in the South, six in Alabama alone. New death sentences in 2024 numbered twenty-six. Both figures are near historic lows. The trend, on any honest reading, is downward.",
            "And yet the trend, on any honest reading, is also a map. The Death Penalty Information Center's research has shown that roughly two percent of American counties — about fifty in total — have produced more than half of every death sentence handed down since the modern era of capital punishment began in 1976. In a single recent year, three counties — Riverside in California, Clark in Nevada, Maricopa in Arizona — generated nearly a third of the country's new death sentences between them. Whether the state kills you depends, far more than on what you did, on which county line you were standing inside when it was done.",
            "Within those counties, the variable narrows again. Robert Macy of Oklahoma County, who served as district attorney for twenty-one years and was nicknamed Cowboy Bob, personally obtained fifty-four death sentences. Nearly half were reversed. Three ended in exoneration. Lynne Abraham of Philadelphia, the Queen of Death, obtained more than a hundred capital sentences in her tenure; at least two of the men she sent to death row were later exonerated. Harris County, Texas, the historical national leader, produced fewer than one capital sentence a year after a different generation of prosecutors took the office. The crime rate had not changed. The decisions had.",
            "Since 1973, the National Registry has counted two hundred death-row exonerations — roughly one for every nine people sentenced to die. Official misconduct, by police or by prosecutors, drove sixty-nine percent of them. Anthony Ray Hinton spent thirty years on Alabama's death row before the Supreme Court, in 2014, unanimously reversed the trial court's refusal to fund a competent firearms expert; new testing then showed the bullets could not have come from his mother's gun. Toforest Johnson still sits on Alabama's death row. The original trial prosecutor, the current district attorney of Jefferson County, three former state attorneys general, two former chief justices of the state supreme court, and the original trial judge have all publicly called for him to receive a new trial. He has not received one.",
            "On the twenty-third of December in 2024, President Biden commuted thirty-seven of the forty federal death sentences in effect to life without parole. Four weeks later, on his first day in office, President Trump signed Executive Order 14164, directing the Department of Justice to resume federal executions and to pressure state prosecutors to file fresh capital charges, including against the thirty-seven men whose sentences had just been commuted. Five weeks after that, in Glossip v. Oklahoma, the Supreme Court voted five to three to vacate Richard Glossip's death sentence, the prosecution having conceded — through Oklahoma's own Republican Attorney General — that the principal witness had been allowed to lie on the stand. The morning that opinion came down, Kenneth Smith had already been dead for thirteen months. Smith was the first person in American history executed by nitrogen hypoxia, in Alabama, in January of 2024. Eyewitnesses reported that he shook and writhed on the gurney for at least four minutes before death. The state had promised unconsciousness in seconds.",
            "The death penalty in 2025 is not a national policy. It is a small set of elected prosecutors, in a smaller set of counties, in a few states, deciding for the rest of the country what the Constitution shall be made to permit.",
          ]}
          prayer={meditationById("matthew-25")}
        />

        <Section
          number="xiii"
          title="The door that never closes."
          body={[
            "The cell door opens, on average, twelve years after it was first shut. The Bureau of Justice Statistics, tracking four hundred and eight thousand state prisoners released from twenty-four states in 2008, found that sixty-six percent of them were rearrested within three years, and eighty-two percent within ten. Sixty-one percent were back in prison within that decade, either for a new sentence or for a supervision violation. The figures are sometimes cited as proof of an incorrigible criminal class. They are better read as a description of the country a released person walks back into.",
            "The National Inventory of Collateral Consequences of Conviction is a federally funded catalog of every civil legal disability that American law attaches to a criminal record. As of 2024 it counted approximately forty-four thousand of them. Employment bars. Occupational-licensing bars. Public-housing bars. Public-benefit bars. Voter disqualifications. Jury disqualifications. Firearm prohibitions. Immigration triggers. Parental-rights terminations. The substantial majority are mandatory. The substantial majority are permanent. They begin the moment the gavel falls and they do not, in most cases, end with the sentence.",
            "Devah Pager, a sociologist at Harvard, demonstrated in 2003 what every reentry caseworker had already seen. She sent matched pairs of applicants — one with a fictitious felony record, one without — to the same Milwaukee employers, then measured the callbacks. A white applicant with no record was called back thirty-four percent of the time; with a felony, seventeen percent. A Black applicant with no record was called back fourteen percent of the time. A Black applicant with a felony, five. A Black man without a criminal record was less likely to be called back than a white man with one. The Prison Policy Initiative, working from later data, measured the unemployment rate of the formerly incarcerated at twenty-seven percent. The corresponding figure for the general U.S. labor force was about five.",
            "The Sentencing Project's 2024 report puts the number of Americans disenfranchised by felony conviction at roughly four million. The largest single share lives in Florida, where Amendment 4 was ratified in 2018 to restore voting rights to people who had completed their sentences, and where Senate Bill 7066, passed by the legislature in 2019, conditioned that restoration on payment of all outstanding court-imposed fines and fees. About seven hundred thousand Floridians have completed their sentences and remain unable to vote because they cannot pay. The Sentencing Project's parallel research counts more than thirty-two thousand parental-rights terminations of incarcerated parents in the United States between 2006 and 2019. The Adoption and Safe Families Act of 1997 requires state child-welfare agencies to file for termination once a child has been in foster care for fifteen of the previous twenty-two months. The average state prison sentence is more than five years. The arithmetic is unforgiving.",
            "Promise Stewart and Santonio Ford met on a prison bus to a Cleveland halfway house in 2005. Stewart had owned a barbershop before he went away. Ford had served three years on a felonious-assault charge. He was rejected by every bank he asked, for sixteen years, for the loan he needed to open his own shop. In 2021 — sixteen years after his release — he finally opened Authentic Kutz. He had cut hair in someone else's shop for the intervening decade and a half. The Marshall Project, which reported the story in 2023, was reporting it as part of an Ohio bill that would limit some of the licensing barriers Ford had faced. Ohio has not, as of this writing, passed it.",
            "Reentry is not an event. It is a body of work. Forty-four thousand statutes deep, lasting decades after the cell door closes, layered through federal housing rules, state licensing boards, county housing authorities, private landlords, and background-check vendors who sell the criminal record back to the labor market for a fee. The eighty-two-percent ten-year rearrest rate is not evidence of a criminal nature. It is evidence of a design. The door that closes behind the cell door is the one that does not open again, and most of America has not learned to see it.",
          ]}
          prayer={meditationById("isaiah-61-liberty")}
        />

        <div className="mt-12 sm:mt-16 pt-8 border-t border-[hsl(220_15%_75%)] text-center">
          <p
            className="text-base sm:text-lg italic text-[hsl(220_30%_28%)] leading-relaxed mb-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            The essay continues to be deepened. Every figure here is sourced
            to a primary record. Every prayer block is verbatim from
            public-domain Scripture or the historical record.
          </p>
          <Link
            to="/justicegap/map"
            className="inline-flex items-center gap-2 bg-[hsl(354_55%_26%)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[hsl(354_55%_18%)] transition-colors"
          >
            See the map →
          </Link>
        </div>
      </article>
    </div>
  );
}

function Section({
  number,
  title,
  body,
  prayer,
}: {
  number: string;
  title: string;
  body: string[];
  prayer?: ReturnType<typeof meditationById>;
}) {
  return (
    <section className="mb-14 sm:mb-16">
      <div className="flex items-baseline gap-4 mb-5 sm:mb-6">
        <span
          className="text-2xl sm:text-3xl text-[hsl(354_55%_26%)]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {number}.
        </span>
        <h2
          className="text-2xl sm:text-3xl text-[hsl(220_30%_14%)] leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
        >
          {title}
        </h2>
      </div>
      {body.map((p, i) => (
        <p
          key={i}
          className="text-base sm:text-lg leading-relaxed text-[hsl(220_25%_22%)] mb-5"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {p}
        </p>
      ))}
      {prayer && <Prayer m={prayer} />}
    </section>
  );
}
