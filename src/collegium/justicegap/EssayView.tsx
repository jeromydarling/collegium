import { Link } from "react-router-dom";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Prayer } from "./components/Prayer";
import { meditationById } from "./data/prayers";

/**
 * Essay view — long-form argument in numbered sections, each ending
 * in a meditation block.
 *
 * Tonight ships four sections. The full ten-section essay follows the
 * fostercrisis pattern (kickoff §1, §7).
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
          number="vi"
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
          number="vii"
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
          number="viii"
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
