import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Quote,
  Clock,
  MapPin,
  ShieldCheck,
  Languages,
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Award,
  Download,
  FileText,
  Sparkles,
  Globe,
  HandHeart,
} from "lucide-react";

/**
 * Live product showcase — four mini React components rendered inline on
 * the marketing homepage, showing real product surfaces (not screenshots).
 *
 * Each card is a styled-down version of a real Collegium component with
 * realistic demo data. Visitors can hover / scroll without breaking
 * anything; navigation links go to the live demo. The intent is "you can
 * see exactly what this looks like, without committing to opening the
 * demo first."
 *
 * Four cards:
 *   1. Patrocinium case-detail card with Esperanza's personal appeal
 *   2. NRI Pulse briefing — the platform noticing a cross-tenant signal
 *   3. Hours-export "Official form" surface — the killer-feature moment
 *   4. Auxilium matter-submission moment — client routes to a guild
 */
export function LiveProductShowcase() {
  return (
    <section className="bg-[hsl(var(--c-cream-warm))] border-y border-[hsl(var(--c-border))]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <div className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-2">
            In vivo
          </div>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
            What the work looks like up close.
          </h2>
          <p className="text-[hsl(var(--c-slate))] max-w-2xl mx-auto leading-relaxed">
            The video shows the whole arc. Here are the four moments inside it
            — the surfaces a lawyer, a client, and a steward actually touch.
            Live React components, not screenshots. Click any of them to open
            the live demo where you can interact for real.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <PatrociniumCaseMini />
          <NRIBriefingMini />
          <HoursExportMini />
          <AuxiliumSubmitMini />
        </div>

        <div className="text-center mt-10">
          <Link
            to="/app"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 text-base"
          >
            Step inside the live demo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Patrocinium case-detail card                                      */
/* ------------------------------------------------------------------ */

function PatrociniumCaseMini() {
  const [accepted, setAccepted] = useState(false);
  return (
    <ShowcaseFrame
      latin="Patrocinium"
      title="A case a lawyer can take in five minutes"
      to="/patrocinium/cases/sm-8"
      surface="patrocinium"
    >
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        {/* Top chips */}
        <div className="px-4 pt-4 pb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="collegium-tag-soft">housing</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]">
            Urgent
          </span>
          <span className="text-[hsl(var(--c-slate-soft))]">·</span>
          <span className="text-[hsl(var(--c-slate-soft))]">Limited-scope · ~6 hr</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(145_40%_28%)] font-semibold">
            <ShieldCheck size={11} /> Cleared
          </span>
        </div>

        {/* Goal */}
        <div className="px-4 pb-3">
          <h3 className="collegium-display text-base sm:text-lg leading-tight mb-2">
            Answer notice-to-quit; preserve voucher transfer.
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[hsl(var(--c-slate-soft))]">
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> Boston, MA
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={10} /> ~6 hr
            </span>
            <span className="inline-flex items-center gap-1">
              <Languages size={10} /> Spanish
            </span>
          </div>
        </div>

        {/* The personal appeal */}
        <div className="bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-l-4 border-l-[hsl(var(--c-gold))] mx-4 mb-3 p-3 rounded-r">
          <div className="flex items-start gap-2">
            <Quote
              size={18}
              className="text-[hsl(var(--c-gold))] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1 font-semibold">
                In her words
              </div>
              <p className="text-xs sm:text-sm italic text-[hsl(var(--c-ink))] leading-snug">
                "I have lived in my apartment for seventeen years… My
                grandchildren go to St. Anthony's school three blocks away. I
                am asking for help so I do not lose my home."
              </p>
              <div className="text-[11px] text-[hsl(var(--c-wine))] font-medium mt-1.5">
                — Esperanza
              </div>
            </div>
          </div>
        </div>

        {/* Safety tiles */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <SafetyTile label="Malpractice" status="Covered" />
            <SafetyTile label="Conflicts" status="Auto-cleared" />
            <SafetyTile label="Templates" status="Eviction answer ready" />
          </div>
        </div>

        {/* Accept */}
        <div className="px-4 pb-4 flex items-center justify-between gap-3 border-t border-[hsl(var(--c-border))] pt-3 bg-[hsl(var(--c-cream))]">
          {accepted ? (
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--c-wine))] font-semibold">
              <CheckCircle2 size={13} />
              On your plate. Workspace opens next.
            </div>
          ) : (
            <>
              <p className="text-[11px] text-[hsl(var(--c-slate))] leading-snug">
                Conflicts already cleared, malpractice covered.
              </p>
              <button
                type="button"
                onClick={() => setAccepted(true)}
                className="collegium-btn-primary text-xs inline-flex items-center gap-1.5 shrink-0"
              >
                Accept this case <ArrowRight size={11} />
              </button>
            </>
          )}
        </div>
      </div>
    </ShowcaseFrame>
  );
}

function SafetyTile({ label, status }: { label: string; status: string }) {
  return (
    <div className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded p-2">
      <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
        {label}
      </div>
      <div className="text-[11px] font-medium text-[hsl(145_40%_28%)] mt-0.5 leading-tight">
        {status}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. NRI Pulse briefing                                                */
/* ------------------------------------------------------------------ */

function NRIBriefingMini() {
  return (
    <ShowcaseFrame
      latin="Concentus"
      title="NRI notices a cross-tenant pattern"
      to="/app/pulse"
      surface="nri"
    >
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] p-3 flex items-center gap-2">
          <Activity size={14} className="text-[hsl(38_60%_70%)]" />
          <span className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)]">
            NRI Pulse · 5 active briefings
          </span>
        </div>

        <article className="p-4 border-l-4 border-l-[hsl(38_55%_50%)] bg-[hsl(38_55%_50%/0.04)]">
          <div className="flex items-center gap-2 mb-1.5 text-[10px]">
            <span className="collegium-tag-soft">Chapter</span>
            <span className="text-[hsl(var(--c-slate-soft))]">· Chicago</span>
            <span className="text-[hsl(38_55%_28%)] uppercase tracking-widest font-semibold">
              · Attend
            </span>
          </div>
          <h3 className="collegium-display text-base leading-tight mb-2">
            Sacred Heart Phoenix flagged immigration — your Chicago should know
          </h3>
          <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed mb-3">
            A connected peer guild just published: "I-589 backlog stretching
            past 36 months." Your chapter is actively working immigration
            matters; worth a five-minute look.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-[hsl(var(--c-border))]">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
                Signals NRI saw
              </div>
              <ul className="space-y-0.5 text-[11px] text-[hsl(var(--c-slate))]">
                <li className="flex items-start gap-1">
                  <span className="text-[hsl(var(--c-gold))] mt-0.5">·</span>
                  Peer signal from Sacred Heart Phoenix
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[hsl(var(--c-gold))] mt-0.5">·</span>
                  Category match: immigration
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[hsl(var(--c-gold))] mt-0.5">·</span>
                  Trust tier: covenant
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
                Suggested action
              </div>
              <p className="text-[11px] italic text-[hsl(var(--c-ink))] leading-snug">
                Open the signal in Communio and consider a steward-to-steward
                note back. The reciprocity is the network.
              </p>
            </div>
          </div>
        </article>
      </div>
    </ShowcaseFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Hours export — official form                                      */
/* ------------------------------------------------------------------ */

function HoursExportMini() {
  const [exporting, setExporting] = useState(false);
  return (
    <ShowcaseFrame
      latin="Horae operis"
      title="Bar reporting becomes a one-click PDF"
      to="/app/hours"
      surface="hours"
    >
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
            <Award size={13} />
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Pro bono hours · 2026
            </span>
          </div>
          <h3 className="collegium-display text-base leading-tight mb-3">
            New York · 22 NYCRR § 520.16
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <KPIMini label="Hours" value="68.5" sub="this year" />
            <KPIMini label="Threshold" value="50 hr" sub="✓ met" status="good" />
            <KPIMini label="Matters" value="9" sub="3 closed" />
          </div>

          <div className="bg-[hsl(var(--c-cream-warm))] rounded p-3 mb-3 text-[11px] text-[hsl(var(--c-slate))] leading-relaxed">
            <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold mb-1">
              Official form
            </div>
            Fillable AcroForm PDF published by the NY Court of Appeals. We map
            your hours into the affidavit's fields per project, flatten the
            form, and hand you a print-ready file.
          </div>

          <button
            type="button"
            onClick={() => {
              setExporting(true);
              setTimeout(() => setExporting(false), 1800);
            }}
            disabled={exporting}
            className="collegium-btn-primary text-xs w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Sparkles size={12} className="animate-pulse" /> Filling
                Affidavit of Compliance…
              </>
            ) : (
              <>
                <Download size={12} /> Download official affidavit
              </>
            )}
          </button>

          <div className="mt-3 flex items-start gap-2 text-[10px] text-[hsl(var(--c-slate-soft))] leading-relaxed">
            <FileText size={10} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
            <span>
              Eight jurisdictions wired: NY, MA, CA, NJ, IL, MD, DC, FL, TX
              — official PDF where available, portal-handoff worksheet where
              reporting is online-only.
            </span>
          </div>
        </div>
      </div>
    </ShowcaseFrame>
  );
}

function KPIMini({
  label,
  value,
  sub,
  status,
}: {
  label: string;
  value: string;
  sub: string;
  status?: "good" | "warn";
}) {
  const statusColor =
    status === "good"
      ? "text-[hsl(145_40%_28%)]"
      : status === "warn"
      ? "text-[hsl(38_55%_28%)]"
      : "text-[hsl(var(--c-slate-soft))]";
  return (
    <div className="bg-[hsl(var(--c-cream))] border border-[hsl(var(--c-border))] rounded p-2">
      <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] leading-none">
        {label}
      </div>
      <div className="collegium-display text-lg text-[hsl(var(--c-ink))] leading-none mt-1 tabular-nums">
        {value}
      </div>
      <div className={`text-[9px] mt-0.5 ${statusColor}`}>{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Auxilium client submission                                        */
/* ------------------------------------------------------------------ */

function AuxiliumSubmitMini() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <ShowcaseFrame
      latin="Auxilium"
      title="The client routes their matter into the network"
      to="/auxilium"
      surface="auxilium"
    >
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <HandHeart
              size={14}
              className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
            />
            <div>
              <h3 className="collegium-display text-base leading-tight">
                Send this matter to a Catholic legal guild?
              </h3>
              <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-0.5 leading-snug">
                A steward will review and reach out within two business days.
              </p>
            </div>
          </div>

          <div className="bg-[hsl(var(--c-cream-warm))] rounded p-3 mb-3 text-[11px] leading-snug">
            <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold mb-1">
              What gets sent
            </div>
            <ul className="space-y-0.5 text-[hsl(var(--c-slate))]">
              <li>· Matter category and deadline</li>
              <li>· Region (city only, not address)</li>
              <li>
                · Your personal appeal — only with your explicit consent
              </li>
            </ul>
            <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold mt-2 mb-1">
              What stays private
            </div>
            <ul className="space-y-0.5 text-[hsl(var(--c-slate))]">
              <li>· Your last name + contact details</li>
              <li>· Anything you marked confidential</li>
            </ul>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-l-4 border-l-[hsl(145_40%_28%)] p-3 rounded-r">
              <div className="flex items-center gap-2 text-[hsl(145_40%_28%)] mb-1">
                <CheckCircle2 size={13} />
                <span className="text-[11px] uppercase tracking-widest font-semibold">
                  Sent to St. Thomas More Society of Boston
                </span>
              </div>
              <p className="text-[11px] text-[hsl(var(--c-slate))] leading-snug">
                Your private portal:{" "}
                <code className="font-mono text-[hsl(var(--c-wine))]">
                  /portal/pt-9d2k…3f8x
                </code>
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="collegium-btn-primary text-xs w-full inline-flex items-center justify-center gap-1.5"
            >
              Send to a guild <ArrowRight size={11} />
            </button>
          )}
        </div>
      </div>
    </ShowcaseFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Frame wrapper — shared chrome around each mini surface              */
/* ------------------------------------------------------------------ */

function ShowcaseFrame({
  latin,
  title,
  to,
  surface,
  children,
}: {
  latin: string;
  title: string;
  to: string;
  surface: "patrocinium" | "nri" | "hours" | "auxilium";
  children: React.ReactNode;
}) {
  const iconMap = {
    patrocinium: <ArrowRight size={12} />,
    nri: <Activity size={12} />,
    hours: <Award size={12} />,
    auxilium: <Globe size={12} />,
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-2 mb-2 px-1">
        <div>
          <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
            {latin}
          </div>
          <h3 className="collegium-display text-base sm:text-lg leading-tight text-[hsl(var(--c-ink))]">
            {title}
          </h3>
        </div>
        <Link
          to={to}
          className="text-[11px] collegium-link inline-flex items-center gap-1 shrink-0"
        >
          Open {iconMap[surface]}
        </Link>
      </div>
      {children}
    </div>
  );
}
