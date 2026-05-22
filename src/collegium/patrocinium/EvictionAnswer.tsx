import { Link, useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { getCase } from "./data/cases";

/**
 * Guided eviction-answer template — 8 questions, working draft out the other end.
 *
 * Demonstrates the "20 minutes, not 2 hours" promise. Rule-based, fully
 * client-side. No LLM in the loop — each answer toggles a specific set of
 * boilerplate paragraphs into the draft. The lawyer reviews, edits, and
 * files. The goal isn't a finished pleading; it's a head start big enough
 * that "I'll do it later" becomes "I'll do it tonight."
 *
 * Scope: MA Housing Court answers. Other jurisdictions and templates land
 * in follow-up sessions.
 */
export function EvictionAnswer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const c = id ? getCase(id) : null;

  const [tenancyType, setTenancyType] = useState<"at-will" | "term" | "">("");
  const [noticeType, setNoticeType] = useState<
    "14-day-nonpayment" | "30-day-at-will" | "no-fault" | "cause" | ""
  >("");
  const [conditionsIssues, setConditionsIssues] = useState(false);
  const [retaliation, setRetaliation] = useState(false);
  const [securityDeposit, setSecurityDeposit] = useState(false);
  const [voucherType, setVoucherType] = useState<"section-8" | "rafn" | "none" | "">("");
  const [demandJury, setDemandJury] = useState(true);
  const [demandDiscovery, setDemandDiscovery] = useState(true);
  const [copied, setCopied] = useState(false);

  const answersComplete = !!tenancyType && !!noticeType && !!voucherType;

  const draft = useMemo(
    () =>
      buildDraftAnswer({
        tenantName: c?.matter.requester ?? "(tenant name)",
        landlord: c?.meta.opposingParty ?? "(landlord name)",
        forum: c?.meta.forum ?? "Housing Court (Eastern Division)",
        tenancyType: tenancyType || "at-will",
        noticeType: noticeType || "14-day-nonpayment",
        conditionsIssues,
        retaliation,
        securityDeposit,
        voucherType: voucherType || "none",
        demandJury,
        demandDiscovery,
      }),
    [
      c,
      tenancyType,
      noticeType,
      conditionsIssues,
      retaliation,
      securityDeposit,
      voucherType,
      demandJury,
      demandDiscovery,
    ]
  );

  if (!c) {
    return (
      <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-sm text-[hsl(var(--c-slate-soft))]">
          Case not found.{" "}
          <Link to="/patrocinium/cases" className="collegium-link">
            Back to cases
          </Link>
          .
        </div>
      </div>
    );
  }

  function handleCopy() {
    navigator.clipboard?.writeText(draft).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {
        /* clipboard not available — silent */
      }
    );
  }

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <button
          type="button"
          onClick={() => navigate(`/patrocinium/cases/${c.matter.id}`)}
          className="text-xs collegium-link inline-flex items-center gap-1 mb-4"
        >
          <ChevronLeft size={12} /> Back to brief
        </button>

        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
            <Sparkles size={14} />
            <span className="collegium-latin text-sm">Forma directa</span>
          </div>
          <h1 className="collegium-display text-2xl sm:text-3xl md:text-4xl leading-tight mb-2">
            Eviction answer — guided draft
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate))] max-w-2xl">
            Eight questions, a working draft on the right. Reviewed in 20
            minutes instead of two hours. The output is a starting point — your
            judgment finishes it.
          </p>
          <div className="mt-3 text-xs text-[hsl(var(--c-slate-soft))] flex items-start gap-1.5">
            <ShieldCheck size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
            <span>
              Template designed for MA Housing Court answers. Validates against
              standard summary-process forms. Always review jurisdiction-specific
              local rules before filing.
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Questions */}
          <div className="space-y-5">
            <Question
              n={1}
              prompt="What kind of tenancy is this?"
              hint="Term tenancies have a fixed end date in the lease. At-will tenancies do not."
            >
              <RadioGroup
                value={tenancyType}
                onChange={(v) => setTenancyType(v as typeof tenancyType)}
                options={[
                  { value: "at-will", label: "At-will" },
                  { value: "term", label: "Term (fixed end date)" },
                ]}
              />
            </Question>

            <Question
              n={2}
              prompt="What kind of notice did the landlord serve?"
              hint="The notice type drives which defenses apply."
            >
              <RadioGroup
                value={noticeType}
                onChange={(v) => setNoticeType(v as typeof noticeType)}
                options={[
                  { value: "14-day-nonpayment", label: "14-day nonpayment" },
                  { value: "30-day-at-will", label: "30-day at-will termination" },
                  { value: "no-fault", label: "No-fault (term expiry)" },
                  { value: "cause", label: "For-cause (lease violation)" },
                ]}
              />
            </Question>

            <Question
              n={3}
              prompt="Are there habitability issues?"
              hint="Lead, leaks, heat, pests, code violations. Triggers warranty-of-habitability defense."
            >
              <Toggle
                checked={conditionsIssues}
                onChange={setConditionsIssues}
                label="Yes — conditions defense applies"
              />
            </Question>

            <Question
              n={4}
              prompt="Any retaliation indicators?"
              hint="Notice within 6 months of a complaint, code report, or organizing activity creates a presumption of retaliation under c. 239 § 2A."
            >
              <Toggle
                checked={retaliation}
                onChange={setRetaliation}
                label="Yes — retaliation presumption applies"
              />
            </Question>

            <Question
              n={5}
              prompt="Outstanding security-deposit issues?"
              hint="Missing interest, not in separate account, no statement of conditions — counterclaim under c. 186 § 15B."
            >
              <Toggle
                checked={securityDeposit}
                onChange={setSecurityDeposit}
                label="Yes — security-deposit counterclaim"
              />
            </Question>

            <Question
              n={6}
              prompt="Voucher / subsidy status?"
              hint="Section-8 portability and RAFT pending change the landlord's lockout calculus."
            >
              <RadioGroup
                value={voucherType}
                onChange={(v) => setVoucherType(v as typeof voucherType)}
                options={[
                  { value: "section-8", label: "Section-8 (HCV)" },
                  { value: "rafn", label: "RAFT/HomeBASE pending" },
                  { value: "none", label: "No subsidy" },
                ]}
              />
            </Question>

            <Question n={7} prompt="Demand a jury trial?">
              <Toggle
                checked={demandJury}
                onChange={setDemandJury}
                label="Yes — preserve jury right"
              />
            </Question>

            <Question n={8} prompt="Serve standard discovery?">
              <Toggle
                checked={demandDiscovery}
                onChange={setDemandDiscovery}
                label="Yes — interrogatories and document requests"
              />
            </Question>

            {!answersComplete && (
              <p className="text-xs text-[hsl(var(--c-slate-soft))] italic">
                Answer all required questions to see the full draft. Skipped
                fields show as placeholders.
              </p>
            )}
          </div>

          {/* Draft */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="collegium-card p-5 sm:p-6 bg-white">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-[hsl(var(--c-wine))]">
                  <FileText size={14} />
                  <span className="collegium-latin text-xs">Exitus</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy to clipboard"}
                </button>
              </div>
              <h2 className="collegium-display text-base mb-3 leading-tight">
                Draft answer · live preview
              </h2>
              <pre className="text-[11px] sm:text-xs text-[hsl(var(--c-slate))] leading-relaxed whitespace-pre-wrap font-mono bg-[hsl(var(--c-cream-warm))] rounded p-4 overflow-x-auto max-h-[60vh] overflow-y-auto">
                {draft}
              </pre>
              <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-3 leading-relaxed">
                Generated locally on your machine. Nothing leaves your browser
                except the matter id, which the steward already has. Review
                every paragraph before filing.
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to={`/patrocinium/cases/${c.matter.id}`}
                className="text-xs collegium-link inline-flex items-center gap-1"
              >
                Back to brief <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Question({
  n,
  prompt,
  hint,
  children,
}: {
  n: number;
  prompt: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="collegium-card p-4 sm:p-5">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
          {n}
        </span>
        <h3 className="text-sm sm:text-base font-medium text-[hsl(var(--c-ink))]">
          {prompt}
        </h3>
      </div>
      {hint && (
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-2.5 leading-relaxed">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={`text-xs px-2.5 py-1.5 rounded border cursor-pointer transition-colors ${
            value === o.value
              ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
              : "bg-white border-[hsl(var(--c-border))] text-[hsl(var(--c-ink))] hover:border-[hsl(var(--c-wine))]"
          }`}
        >
          <input
            type="radio"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="hidden"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="cursor-pointer"
      />
      <span className="text-[hsl(var(--c-ink))]">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Draft builder — rule-based template assembly                        */
/* ------------------------------------------------------------------ */

interface DraftInputs {
  tenantName: string;
  landlord: string;
  forum: string;
  tenancyType: "at-will" | "term";
  noticeType: "14-day-nonpayment" | "30-day-at-will" | "no-fault" | "cause";
  conditionsIssues: boolean;
  retaliation: boolean;
  securityDeposit: boolean;
  voucherType: "section-8" | "rafn" | "none";
  demandJury: boolean;
  demandDiscovery: boolean;
}

function buildDraftAnswer(d: DraftInputs): string {
  const noticeDescription: Record<DraftInputs["noticeType"], string> = {
    "14-day-nonpayment": "a 14-day notice to quit for nonpayment of rent under M.G.L. c. 186 § 11",
    "30-day-at-will": "a 30-day notice to quit the tenancy at will under M.G.L. c. 186 § 12",
    "no-fault": "a no-fault notice based on expiration of the term",
    cause: "a notice to quit for alleged lease violation",
  };

  const tenancyDescription =
    d.tenancyType === "term"
      ? "a tenancy for a term"
      : "a tenancy at will";

  const lines: string[] = [];

  lines.push(`COMMONWEALTH OF MASSACHUSETTS`);
  lines.push(d.forum.toUpperCase());
  lines.push(``);
  lines.push(`${d.landlord.toUpperCase()},`);
  lines.push(`    Plaintiff,`);
  lines.push(``);
  lines.push(`    v.`);
  lines.push(``);
  lines.push(`${d.tenantName.toUpperCase()},`);
  lines.push(`    Defendant.`);
  lines.push(``);
  lines.push(`Civil Action No. _____________`);
  lines.push(``);
  lines.push(`DEFENDANT'S ANSWER, AFFIRMATIVE DEFENSES, AND COUNTERCLAIMS`);
  lines.push(``);
  lines.push(`Defendant ${d.tenantName}, by and through undersigned counsel, answers the Complaint and asserts the following affirmative defenses and counterclaims:`);
  lines.push(``);

  lines.push(`I. RESPONSES TO COMPLAINT`);
  lines.push(``);
  lines.push(`1. Admitted that Defendant is the lawful occupant of the premises pursuant to ${tenancyDescription}.`);
  lines.push(`2. Admitted that Plaintiff served ${noticeDescription[d.noticeType]} on or about [DATE OF NOTICE].`);
  lines.push(`3. Denied that Defendant is in default of any obligation that would justify possession by the Plaintiff.`);
  lines.push(`4. Denied all other allegations of the Complaint not expressly admitted herein.`);
  lines.push(``);

  lines.push(`II. AFFIRMATIVE DEFENSES`);
  lines.push(``);
  let defenseNum = 1;
  lines.push(`${defenseNum++}. Insufficient process and service of process.`);
  lines.push(``);

  if (d.noticeType === "14-day-nonpayment") {
    lines.push(`${defenseNum++}. Cure under M.G.L. c. 186 § 11. Defendant tendered or stands ready to tender all rent claimed within the statutory cure period and is entitled to retain the tenancy.`);
    lines.push(``);
  }

  if (d.conditionsIssues) {
    lines.push(`${defenseNum++}. Breach of warranty of habitability. The premises suffered conditions in violation of the State Sanitary Code (105 C.M.R. § 410.000 et seq.) and the implied warranty of habitability recognized in Boston Housing Auth. v. Hemingway, 363 Mass. 184 (1973). The reasonable rental value of the premises during the period of breach was substantially diminished, partially or wholly offsetting any rent claimed.`);
    lines.push(``);
    lines.push(`${defenseNum++}. Quiet enjoyment under M.G.L. c. 186 § 14. The conditions described above constituted an interference with Defendant's quiet enjoyment of the premises.`);
    lines.push(``);
  }

  if (d.retaliation) {
    lines.push(`${defenseNum++}. Retaliatory eviction under M.G.L. c. 239 § 2A and c. 186 § 18. The notice was served within six months of Defendant's protected activity (complaint, code-enforcement contact, or organizing). A presumption of retaliation applies and is not rebutted by clear and convincing evidence.`);
    lines.push(``);
  }

  if (d.voucherType === "section-8") {
    lines.push(`${defenseNum++}. Section-8 Housing Choice Voucher protections. Defendant participates in the federal Housing Choice Voucher program; the lease and applicable HUD regulations (24 C.F.R. § 982 et seq.) and the Massachusetts source-of-income protections under M.G.L. c. 151B § 4(10) modify the grounds and procedure for termination.`);
    lines.push(``);
  } else if (d.voucherType === "rafn") {
    lines.push(`${defenseNum++}. Pending emergency rental assistance. Defendant has a pending application for RAFT/HomeBASE emergency rental assistance under EOHLC guidelines. Pursuant to standing practice, the Court should continue the matter to permit disposition of that application before entering judgment.`);
    lines.push(``);
  }

  lines.push(`${defenseNum++}. Unclean hands.`);
  lines.push(``);
  lines.push(`${defenseNum++}. Failure to comply with M.G.L. c. 239 § 1 and applicable Uniform Summary Process Rules.`);
  lines.push(``);
  lines.push(`${defenseNum++}. Defendant reserves the right to assert additional affirmative defenses as discovery proceeds.`);
  lines.push(``);

  lines.push(`III. COUNTERCLAIMS`);
  lines.push(``);
  let counterNum = 1;

  if (d.conditionsIssues) {
    lines.push(`Counterclaim ${counterNum++}. Breach of warranty of habitability — damages for diminished rental value, attorneys' fees as the prevailing party under M.G.L. c. 93A and c. 239 § 8A.`);
    lines.push(``);
    lines.push(`Counterclaim ${counterNum++}. M.G.L. c. 93A unfair and deceptive acts and practices — attempting to collect rent on uninhabitable premises constitutes a c. 93A violation. Multiple damages and attorneys' fees sought.`);
    lines.push(``);
  }

  if (d.securityDeposit) {
    lines.push(`Counterclaim ${counterNum++}. Security-deposit violations under M.G.L. c. 186 § 15B — failure to maintain in segregated interest-bearing account, failure to pay interest, and/or failure to provide statement of conditions. Treble damages, interest, costs, and attorneys' fees.`);
    lines.push(``);
  }

  if (d.retaliation) {
    lines.push(`Counterclaim ${counterNum++}. Retaliation under M.G.L. c. 186 § 18 — damages of one to three months' rent, costs, and attorneys' fees.`);
    lines.push(``);
  }

  if (counterNum === 1) {
    lines.push(`Defendant reserves the right to assert counterclaims as discovery proceeds.`);
    lines.push(``);
  }

  lines.push(`IV. JURY DEMAND`);
  lines.push(``);
  lines.push(
    d.demandJury
      ? `Defendant demands a trial by jury on all issues so triable.`
      : `Defendant requests a bench trial.`
  );
  lines.push(``);

  if (d.demandDiscovery) {
    lines.push(`V. DISCOVERY`);
    lines.push(``);
    lines.push(`Pursuant to Uniform Summary Process Rule 7 and Mass. R. Civ. P. 33–34, Defendant serves contemporaneously herewith standard interrogatories and requests for production of documents.`);
    lines.push(``);
  }

  lines.push(`WHEREFORE, Defendant respectfully requests that the Court:`);
  lines.push(`    (a) Enter judgment for Defendant on the Complaint;`);
  lines.push(`    (b) Award damages on the counterclaims pleaded above;`);
  lines.push(`    (c) Award attorneys' fees and costs as authorized by statute; and`);
  lines.push(`    (d) Grant such other and further relief as the Court deems just and proper.`);
  lines.push(``);
  lines.push(`Respectfully submitted,`);
  lines.push(``);
  lines.push(`${d.tenantName.toUpperCase()},`);
  lines.push(`By their attorney,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`[ATTORNEY NAME], BBO #_______`);
  lines.push(`[FIRM / CLINIC]`);
  lines.push(`[ADDRESS]`);
  lines.push(`[PHONE] · [EMAIL]`);
  lines.push(``);
  lines.push(`Dated: ${new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`);

  return lines.join("\n");
}
