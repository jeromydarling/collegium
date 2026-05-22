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

        <div className="mt-12 sm:mt-16 pt-8 border-t border-[hsl(220_15%_75%)] text-center">
          <p
            className="text-base sm:text-lg italic text-[hsl(220_30%_28%)] leading-relaxed mb-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            More sections to come — the bail gap, the plea-bargain economy,
            the geography of the death penalty, the body of work known as
            "reentry."
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
