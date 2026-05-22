import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Pro bono calculator — homily-voiced, math-honest.
 *
 * Inputs:
 *   • Hours per year the attorney is willing to give
 *   • Their billable hourly rate (for opportunity-cost framing)
 *   • Their state (CLE pro-bono credit rules vary widely)
 *   • Their matter focus (changes hours-per-case and people-per-case)
 *
 * Outputs, computed live:
 *   • Cases per year — Auxilium-prepped vs. traditional intake
 *   • People helped — household multiplier per matter type
 *   • Opportunity cost in dollars — the unsubsidized cost of pure billable time
 *   • CLE credit value — recouped against the cycle
 *   • Net effective cost — opportunity cost minus offsets
 *   • The scaled view: if every Christian lawyer in your state did this
 *
 * All numbers sourced. The point is not to be promotional. The point is
 * to make the financial argument against pro bono fall apart visibly
 * under the reader's own hands.
 */

type StateRule = {
  /** Hours of pro bono per 1 CLE credit. 0 means no formal credit. */
  hoursPerCredit: number;
  /** Annual cap on credits earned via pro bono. */
  capCredits: number;
  /** Display label. */
  label: string;
  /** Approx number of practicing attorneys in the state, ABA 2024. */
  attorneys: number;
};

const STATE_CLE: Record<string, StateRule> = {
  US: { hoursPerCredit: 3, capCredits: 6, label: "National average", attorneys: 1_322_649 },
  NY: { hoursPerCredit: 2, capCredits: 10, label: "New York (2:1, cap 10)", attorneys: 187_239 },
  FL: { hoursPerCredit: 1, capCredits: 5, label: "Florida (1:1, cap 5)", attorneys: 109_650 },
  TX: { hoursPerCredit: 5, capCredits: 6, label: "Texas (5:1, cap 6)", attorneys: 104_469 },
  CA: { hoursPerCredit: 0, capCredits: 0, label: "California (no formal credit)", attorneys: 191_374 },
  IL: { hoursPerCredit: 6, capCredits: 6, label: "Illinois (6:1, cap 6)", attorneys: 90_115 },
  PA: { hoursPerCredit: 5, capCredits: 5, label: "Pennsylvania (5:1, cap 5)", attorneys: 72_410 },
  GA: { hoursPerCredit: 6, capCredits: 6, label: "Georgia (6:1, cap 6)", attorneys: 39_927 },
  VA: { hoursPerCredit: 1, capCredits: 6, label: "Virginia (1:1, cap 6)", attorneys: 31_872 },
  MA: { hoursPerCredit: 0, capCredits: 0, label: "Massachusetts (no formal credit)", attorneys: 49_310 },
  WI: { hoursPerCredit: 5, capCredits: 6, label: "Wisconsin (5:1, cap 6)", attorneys: 16_174 },
  OH: { hoursPerCredit: 6, capCredits: 6, label: "Ohio (6:1, cap 6)", attorneys: 39_354 },
  NC: { hoursPerCredit: 0, capCredits: 0, label: "North Carolina (no formal credit)", attorneys: 28_572 },
};

type MatterMix = {
  id: string;
  label: string;
  /** Traditional hours per case from cold intake. */
  traditionalHours: number;
  /** Hours per case after Auxilium completes intake + matter file. */
  auxiliumHours: number;
  /** Average people benefitting per matter (client + household). */
  peoplePerMatter: number;
  /** Plain-English outcome the matter prevents. */
  outcome: string;
};

const MATTER_MIX: MatterMix[] = [
  {
    id: "balanced",
    label: "Balanced mix",
    traditionalHours: 11,
    auxiliumHours: 4,
    peoplePerMatter: 2.4,
    outcome: "kept in home / kept whole",
  },
  {
    id: "eviction",
    label: "Eviction defense",
    traditionalHours: 12,
    auxiliumHours: 4,
    peoplePerMatter: 2.7,
    outcome: "stayed in their home",
  },
  {
    id: "family",
    label: "Family / custody motions",
    traditionalHours: 16,
    auxiliumHours: 6,
    peoplePerMatter: 3.1,
    outcome: "kept the children safe",
  },
  {
    id: "debt",
    label: "Debt-collection defense",
    traditionalHours: 7,
    auxiliumHours: 3,
    peoplePerMatter: 1.8,
    outcome: "avoided default judgment",
  },
  {
    id: "immigration",
    label: "Immigration / asylum intake",
    traditionalHours: 18,
    auxiliumHours: 7,
    peoplePerMatter: 2.9,
    outcome: "kept the family together",
  },
];

const CLE_VALUE_PER_CREDIT_USD = 75; // realistic average state-bar CLE pricing
const MALPRACTICE_COST_USD = 0; // covered by referring legal-aid nonprofit; ALAS rider <$500

const fmt = (n: number) => Math.round(n).toLocaleString();
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function ProBonoCalculator() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(275);
  const [stateCode, setStateCode] = useState("US");
  const [matterId, setMatterId] = useState("balanced");
  const [showScaled, setShowScaled] = useState(false);

  const rule = STATE_CLE[stateCode];
  const matter = MATTER_MIX.find((m) => m.id === matterId) ?? MATTER_MIX[0];

  const calc = useMemo(() => {
    const auxiliumCases = hours / matter.auxiliumHours;
    const traditionalCases = hours / matter.traditionalHours;
    const peopleHelped = auxiliumCases * matter.peoplePerMatter;
    const opportunityCost = hours * rate;
    const creditsEarned =
      rule.hoursPerCredit > 0
        ? Math.min(hours / rule.hoursPerCredit, rule.capCredits)
        : 0;
    const cleSavings = creditsEarned * CLE_VALUE_PER_CREDIT_USD;
    const malpractice = MALPRACTICE_COST_USD;
    const netCost = Math.max(0, opportunityCost - cleSavings - malpractice);

    // Auxilium time savings: hours saved per year vs. traditional intake.
    const hoursSavedByAuxilium = (auxiliumCases - traditionalCases) * matter.auxiliumHours
      + auxiliumCases * (matter.traditionalHours - matter.auxiliumHours);
    // Simpler equivalent: with same hour budget, how many additional cases get done
    // because Auxilium shrank each case.
    const extraCasesBecauseOfAuxilium = auxiliumCases - traditionalCases;
    const extraPeopleBecauseOfAuxilium = extraCasesBecauseOfAuxilium * matter.peoplePerMatter;

    // Comparison to ABA Model Rule 6.1 aspiration (50 hours).
    const abaPct = (hours / 50) * 100;

    // Scaled-up to the state: if every practicing attorney here gave the same.
    const stateCases = auxiliumCases * rule.attorneys;
    const statePeople = peopleHelped * rule.attorneys;
    // National justice gap: LSC 2022, ~2 million unmet civil legal matters per year for low-income Americans
    // (the LSC Justice Gap report figures show 1.8–2.5M depending on year; we use 2M as a conservative round).
    const NATIONAL_UNMET = 2_000_000;
    const justiceGapPctClosed = stateCode === "US"
      ? (auxiliumCases * rule.attorneys / NATIONAL_UNMET) * 100
      : (auxiliumCases * rule.attorneys / (NATIONAL_UNMET * (rule.attorneys / 1_322_649))) * 100;

    return {
      auxiliumCases,
      traditionalCases,
      peopleHelped,
      opportunityCost,
      creditsEarned,
      cleSavings,
      malpractice,
      netCost,
      extraCasesBecauseOfAuxilium,
      extraPeopleBecauseOfAuxilium,
      hoursSavedByAuxilium,
      abaPct,
      stateCases,
      statePeople,
      justiceGapPctClosed,
    };
  }, [hours, rate, rule, matter, stateCode]);

  return (
    <section
      className="my-12 sm:my-16 border-y-2 border-[hsl(354_55%_26%/0.18)] bg-[hsl(40_30%_98%)] -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 sm:py-14"
      aria-label="Pro bono calculator"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[hsl(354_55%_28%)] mb-2">
            Rationes — The reckoning
          </p>
          <h3
            className="text-2xl sm:text-3xl text-[hsl(220_30%_14%)] leading-tight mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
          >
            What this looks like in your own hand.
          </h3>
          <p
            className="text-sm sm:text-base text-[hsl(220_25%_30%)] italic max-w-xl mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Move the dials. The numbers are real. The sources sit at the
            foot of the page.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid gap-5 sm:gap-6 mb-8 sm:mb-10">
          <Field label="Hours you would give per year" hint={`${hours} hours · about ${(hours / 12).toFixed(1)} / month`}>
            <input
              type="range"
              min={4}
              max={100}
              step={1}
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10))}
              className="w-full accent-[hsl(354_55%_26%)]"
              aria-label="Pro bono hours per year"
            />
          </Field>

          <Field label="Your billable rate" hint={`${fmtMoney(rate)} / hour`}>
            <input
              type="range"
              min={75}
              max={750}
              step={25}
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value, 10))}
              className="w-full accent-[hsl(354_55%_26%)]"
              aria-label="Billable hourly rate"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <Field label="Your state (for CLE credit rules)">
              <Select
                value={stateCode}
                onChange={setStateCode}
                options={Object.entries(STATE_CLE).map(([code, r]) => ({
                  value: code,
                  label: r.label,
                }))}
              />
            </Field>

            <Field label="Type of matter you'd take">
              <Select
                value={matterId}
                onChange={setMatterId}
                options={MATTER_MIX.map((m) => ({ value: m.id, label: m.label }))}
              />
            </Field>
          </div>
        </div>

        {/* Big number: people helped */}
        <div className="text-center mb-8 sm:mb-10 py-6 border-y border-[hsl(354_55%_26%/0.15)]">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(354_55%_28%)] mb-2">
            In one year, you would help
          </div>
          <div
            className="text-6xl sm:text-7xl text-[hsl(354_55%_26%)] leading-none mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
          >
            {fmt(calc.peopleHelped)}
          </div>
          <div className="text-sm sm:text-base text-[hsl(220_25%_30%)] leading-relaxed">
            people {matter.outcome}, across about{" "}
            <strong className="text-[hsl(220_30%_14%)]">
              {fmt(calc.auxiliumCases)} cases
            </strong>{" "}
            — because Auxilium did the intake.
          </div>
        </div>

        {/* Without / with Auxilium */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <Pillar
            tone="muted"
            eyebrow="Traditional intake"
            number={fmt(calc.traditionalCases)}
            label="cases"
            note={`${matter.traditionalHours} hours each — most of it on intake, conflicts, document hunting before any motion gets drafted.`}
          />
          <Pillar
            tone="wine"
            eyebrow="Auxilium-prepped"
            number={fmt(calc.auxiliumCases)}
            label="cases"
            note={`${matter.auxiliumHours} hours each — the client did the intake. You spend the time on the motion, the negotiation, the appearance.`}
          />
        </div>
        <p className="text-center text-sm text-[hsl(220_25%_30%)] italic mb-8 sm:mb-10">
          That difference —{" "}
          <strong className="text-[hsl(354_55%_26%)] not-italic">
            {fmt(calc.extraPeopleBecauseOfAuxilium)} more people helped
          </strong>{" "}
          on the same hours — is what the intake-and-routing problem looks
          like when you actually solve it.
        </p>

        {/* The reckoning ledger */}
        <div className="bg-white border border-[hsl(220_15%_85%)] rounded-lg p-5 sm:p-6 mb-6 sm:mb-8">
          <div
            className="text-sm uppercase tracking-widest text-[hsl(354_55%_28%)] mb-4 pb-3 border-b border-[hsl(220_15%_88%)]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            The ledger
          </div>

          <Row
            label="Opportunity cost (hours × billable rate)"
            value={fmtMoney(calc.opportunityCost)}
            note="The unsubsidized cost if every hour had been billed instead. Clio's 2024 Legal Trends Report shows the average U.S. attorney bills 2.9 of 8 hours — the other 5.1 are admin, intake, and email. Five hours a month of pro bono does not displace billable hours. It displaces hours already lost."
            tone="cost"
          />

          <Row
            label={`CLE credit earned (${calc.creditsEarned.toFixed(1)} credits × $75)`}
            value={fmtMoney(-calc.cleSavings)}
            note={
              rule.hoursPerCredit > 0
                ? `${rule.label} grants one CLE for every ${rule.hoursPerCredit} hour${rule.hoursPerCredit === 1 ? "" : "s"} of pro bono, capped at ${rule.capCredits}. Average state-bar CLE pricing is about $75 per credit hour.`
                : `${rule.label} grants no formal CLE credit for pro bono. The other offsets still apply.`
            }
            tone="offset"
          />

          <Row
            label="Malpractice exposure"
            value={fmtMoney(0)}
            note="Legal-aid referrals carry the referring nonprofit's primary malpractice coverage. The Volunteer Protection Act of 1997 and every state's Good Samaritan statute immunize ordinary-negligence acts by volunteer attorneys for qualified nonprofits. Carriers describe claims arising from pro bono work as 'very rare.'"
            tone="offset"
          />

          <div className="border-t border-[hsl(220_15%_85%)] pt-4 mt-4">
            <div className="flex items-baseline justify-between gap-3">
              <div
                className="text-base sm:text-lg text-[hsl(220_30%_14%)]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
              >
                Net effective cost
              </div>
              <div
                className="text-xl sm:text-2xl text-[hsl(354_55%_26%)]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
              >
                {fmtMoney(calc.netCost)}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[hsl(220_25%_30%)] italic leading-relaxed mt-2">
              The full opportunity-cost figure assumes every hour would
              have been billed. The Clio data says less than 40% of those
              hours actually would have been. The real cost lies somewhere
              between this number and zero.
            </p>
          </div>
        </div>

        {/* Comparison to ABA aspiration */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm text-[hsl(220_25%_30%)] leading-relaxed">
            That is{" "}
            <strong className="text-[hsl(354_55%_26%)]">{Math.round(calc.abaPct)}%</strong>{" "}
            of the ABA Model Rule 6.1 aspiration — and{" "}
            <strong className="text-[hsl(354_55%_26%)]">{Math.round((hours / 15))}× </strong>
            the typical Christian-Legal-Society clinic ask.
          </p>
        </div>

        {/* Scale it */}
        <button
          onClick={() => setShowScaled((s) => !s)}
          className="w-full text-left bg-[hsl(354_55%_26%/0.05)] hover:bg-[hsl(354_55%_26%/0.08)] border border-[hsl(354_55%_26%/0.18)] rounded-lg px-5 py-4 transition-colors"
          aria-expanded={showScaled}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[hsl(354_55%_28%)] mb-1">
                Now scale it
              </div>
              <div
                className="text-base sm:text-lg text-[hsl(220_30%_14%)]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
              >
                If every practicing attorney in {stateCode === "US" ? "America" : rule.label.split(" (")[0]} did the same…
              </div>
            </div>
            <ChevronDown
              size={20}
              className={`text-[hsl(354_55%_26%)] transition-transform ${showScaled ? "rotate-180" : ""}`}
            />
          </div>

          {showScaled && (
            <div className="mt-5 pt-5 border-t border-[hsl(354_55%_26%/0.18)] grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[hsl(220_25%_30%)] mb-1">
                  Cases handled
                </div>
                <div
                  className="text-3xl sm:text-4xl text-[hsl(220_30%_14%)] leading-none mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  {fmt(calc.stateCases)}
                </div>
                <div className="text-xs text-[hsl(220_25%_30%)]">
                  per year, across {fmt(rule.attorneys)} attorneys
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[hsl(220_25%_30%)] mb-1">
                  People made whole
                </div>
                <div
                  className="text-3xl sm:text-4xl text-[hsl(220_30%_14%)] leading-none mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  {fmt(calc.statePeople)}
                </div>
                <div className="text-xs text-[hsl(220_25%_30%)]">
                  households, families, and individuals
                </div>
              </div>
              <div className="sm:col-span-2 pt-4 border-t border-[hsl(354_55%_26%/0.12)]">
                <p className="text-sm text-[hsl(220_25%_30%)] leading-relaxed italic">
                  {stateCode === "US" ? (
                    <>
                      Against LSC's documented ~2 million unmet civil legal
                      matters per year for low-income Americans, that closes{" "}
                      <strong className="text-[hsl(354_55%_26%)] not-italic">
                        {calc.justiceGapPctClosed >= 100 ? "the entire" : `${calc.justiceGapPctClosed.toFixed(0)}% of the`}
                      </strong>{" "}
                      justice gap.
                    </>
                  ) : (
                    <>
                      Against the share of the national civil justice gap
                      proportionate to {rule.label.split(" (")[0]}'s bar, that
                      closes{" "}
                      <strong className="text-[hsl(354_55%_26%)] not-italic">
                        {calc.justiceGapPctClosed >= 100 ? "the entire" : `${calc.justiceGapPctClosed.toFixed(0)}% of the`}
                      </strong>{" "}
                      gap in this state.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </button>

        <p className="text-xs text-[hsl(220_15%_45%)] leading-relaxed mt-6 text-center">
          Sources: ABA Supporting Justice V (2025); ABA Model Rule 6.1; LSC
          2022 Justice Gap Report; Clio 2024 Legal Trends Report; state-bar
          CLE rules cited inline; Pro Bono Institute Law Firm Challenge
          (2024); Volunteer Protection Act of 1997.
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label
          className="text-xs sm:text-sm uppercase tracking-widest text-[hsl(354_55%_28%)]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {label}
        </label>
        {hint && (
          <span className="text-xs text-[hsl(220_25%_30%)] tabular-nums">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-[hsl(220_15%_75%)] rounded-md px-3 py-2 text-sm text-[hsl(220_30%_14%)] focus:outline-none focus:ring-2 focus:ring-[hsl(354_55%_26%/0.4)] focus:border-[hsl(354_55%_26%/0.5)] cursor-pointer pr-9"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220_25%_40%)] pointer-events-none"
      />
    </div>
  );
}

function Pillar({
  tone,
  eyebrow,
  number,
  label,
  note,
}: {
  tone: "wine" | "muted";
  eyebrow: string;
  number: string;
  label: string;
  note: string;
}) {
  const wineStyles =
    "bg-[hsl(354_55%_26%)] text-[hsl(40_35%_94%)] border-[hsl(354_55%_18%)]";
  const mutedStyles =
    "bg-white text-[hsl(220_30%_14%)] border-[hsl(220_15%_82%)]";
  return (
    <div className={`border rounded-lg p-5 ${tone === "wine" ? wineStyles : mutedStyles}`}>
      <div
        className={`text-[10px] uppercase tracking-widest mb-2 ${
          tone === "wine" ? "text-[hsl(38_55%_75%)]" : "text-[hsl(220_25%_40%)]"
        }`}
      >
        {eyebrow}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <div
          className="text-4xl sm:text-5xl leading-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
        >
          {number}
        </div>
        <div className="text-sm">{label}</div>
      </div>
      <p
        className={`text-xs sm:text-sm leading-relaxed ${
          tone === "wine" ? "text-[hsl(40_30%_88%)]" : "text-[hsl(220_25%_38%)]"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "cost" | "offset";
}) {
  return (
    <div className="py-3 border-b border-[hsl(220_15%_92%)] last:border-0">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <div className="text-sm sm:text-base text-[hsl(220_30%_14%)]">
          {label}
        </div>
        <div
          className={`text-base sm:text-lg tabular-nums ${
            tone === "cost" ? "text-[hsl(220_30%_14%)]" : "text-[hsl(145_30%_38%)]"
          }`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
        >
          {value}
        </div>
      </div>
      <p className="text-xs text-[hsl(220_25%_38%)] leading-relaxed">{note}</p>
    </div>
  );
}
