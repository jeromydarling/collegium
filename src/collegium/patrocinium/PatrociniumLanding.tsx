import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Timer,
  Inbox,
  CheckCircle2,
  Layers,
  Scale,
  Sparkles,
} from "lucide-react";
import { allCases, sortByAdvocatePriority } from "./data/cases";

/**
 * Patrocinium landing — the third front door of Collegium.
 *
 * Audience: lawyers who'd take a pro bono case in principle but bounce off
 * the friction in practice. The page's job is to make "yes" feel cheap and
 * "no" feel intentional: malpractice covered, conflicts cleared, hours
 * estimated, bite-sized commitments offered.
 *
 * Voice: respectful of busy professionals. Not a guilt trip. Not a sales
 * pitch. Practical specifics + a low-friction entry point.
 */
export function PatrociniumLanding() {
  const featured = sortByAdvocatePriority(allCases()).slice(0, 3);

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-4">
            <span className="collegium-latin not-italic">Patrocinium</span>
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span>By Collegium</span>
          </div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--c-ink))] mb-5 sm:mb-6 leading-[1.05]">
            Five minutes from sign-in to your <span className="collegium-mark">next case</span>.
          </h1>
          <p className="text-base sm:text-lg text-[hsl(var(--c-slate))] max-w-xl mx-auto leading-relaxed mb-3">
            Pre-vetted cases. Conflicts pre-cleared. Malpractice covered.
            Hours estimated. Templates and checklists in the same drawer.
          </p>
          <p className="text-sm sm:text-base text-[hsl(var(--c-slate-soft))] max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
            Pro bono shouldn't take longer than the case itself. Pick a
            commitment that fits — a 60-minute advice call, a one-shift
            clinic, or full representation — and we handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/patrocinium/cases"
              className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm text-base"
            >
              Browse open cases <ArrowRight size={18} />
            </Link>
            <Link
              to="/patrocinium/me"
              className="collegium-btn-ghost inline-flex items-center justify-center gap-2 w-full sm:w-auto text-base"
            >
              My pro bono
            </Link>
          </div>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-4">
            {allCases().length} cases in the pool right now. New
            referrals come in daily.
          </p>
        </div>
      </section>

      {/* What's already done for you */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3 justify-center">
            <ShieldCheck size={16} />
            <p className="collegium-latin text-sm">Quod paratum est</p>
          </div>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 text-center leading-tight">
            What's already done by the time you say yes.
          </h2>
          <p className="text-[hsl(var(--c-slate))] text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            Pro bono attorneys tell us the same thing: the work isn't the
            barrier — the <em className="not-italic font-medium">unknowns</em> are. Here's what
            we close before a case ever reaches you.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            <Promise
              icon={<ShieldCheck size={18} />}
              label="Malpractice"
              body="Network-wide coverage for any matter you accept through Patrocinium. Engagement letter language vetted by counsel."
            />
            <Promise
              icon={<CheckCircle2 size={18} />}
              label="Conflicts"
              body="Auto-cleared against the network's hash-only conflicts ledger before publication. Confirm one box when you accept."
            />
            <Promise
              icon={<Timer size={18} />}
              label="Hours estimate"
              body="Every case shows a realistic hours range. Bite-sized commitments — advice calls, document review — surface first."
            />
            <Promise
              icon={<Layers size={18} />}
              label="Templates"
              body="Practice-area templates and checklists attached to the matter where they apply. Eviction answers, sealing petitions, sponsorship checklists."
            />
          </div>
        </div>
      </section>

      {/* Engagement types — bite-sized is welcome */}
      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
            <Sparkles size={16} />
            <p className="collegium-latin text-sm">Quanta vis</p>
          </div>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
            Take as much as your week can hold.
          </h2>
          <p className="text-[hsl(var(--c-slate))] max-w-2xl mb-8 sm:mb-10">
            Pro bono doesn't have to mean open-ended representation. Limited-scope
            and unbundled commitments are first-class citizens here.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <EngagementTile hours="≈ 1–2 hrs" title="Advice call" body="One-time conversation with a client who needs a clear answer." />
            <EngagementTile hours="≈ 2–3 hrs" title="Document review" body="Read a notice, contract, or petition and write a one-page memo." />
            <EngagementTile hours="≈ 4–8 hrs" title="Limited-scope" body="One filing or hearing. Engagement letter scopes you precisely." />
            <EngagementTile hours="2-hour shifts" title="Clinic shift" body="In-person or remote — sit at the intake counter with a steward." />
            <EngagementTile hours="≈ 10–20 hrs" title="Full representation" body="Soup-to-nuts on a single matter. Templates and supervision available." />
          </div>
        </div>
      </section>

      {/* Featured cases */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
                <Inbox size={16} />
                <p className="collegium-latin text-sm">In limine</p>
              </div>
              <h2 className="collegium-display text-3xl sm:text-4xl leading-tight">
                Open right now.
              </h2>
            </div>
            <Link
              to="/patrocinium/cases"
              className="collegium-link text-sm shrink-0 inline-flex items-center gap-1"
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <p className="text-[hsl(var(--c-slate))] mb-8 sm:mb-10 max-w-2xl">
            A taste. Three of the most time-sensitive cases in the pool today.
          </p>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
            {featured.map(({ matter, meta }) => (
              <Link
                key={matter.id}
                to={`/patrocinium/cases/${matter.id}`}
                className="collegium-card p-5 sm:p-6 hover:shadow-md transition-shadow block group"
              >
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="collegium-tag-soft">
                    {matter.category.replace(/-/g, " ")}
                  </span>
                  {matter.urgency === "urgent" && (
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(8_55%_38%)]">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">
                  {matter.region} · {meta.hoursEstimate} hr{meta.hoursEstimate === 1 ? "" : "s"} ·{" "}
                  {meta.engagementType.replace(/-/g, " ")}
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed line-clamp-4">
                  {meta.goal}
                </p>
                <div className="mt-3 text-xs collegium-link inline-flex items-center gap-1">
                  See brief <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[hsl(var(--c-cream))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
            <Scale size={16} />
            <p className="collegium-latin text-sm">Quomodo</p>
          </div>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-8 sm:mb-10 leading-tight">
            How a case moves through Patrocinium.
          </h2>
          <ol className="space-y-6 sm:space-y-8">
            <Step
              n={1}
              title="A parish or partner refers a person in need."
              body="Intake happens at the chapter or clinic — not in your inbox. A steward gathers facts, gets consent, and confirms the basics: jurisdiction, language, FPL eligibility."
            />
            <Step
              n={2}
              title="The steward pre-vets the matter for publication."
              body="Conflicts auto-cleared against the network's hash-only ledger. Engagement type, hours estimate, deadline, opposing party, and goal recorded on a single screen."
            />
            <Step
              n={3}
              title="You browse the pool and accept what fits."
              body="Filter by practice, region, language, hours, urgency. Read the brief in three minutes. Accept, save for later, or decline."
            />
            <Step
              n={4}
              title="Templates, supervision, and the close-out are waiting."
              body="Practice-area templates pre-attached. A senior advocate available for one-question sanity checks. Closure summary sent back to the referring parish only if the client gave consent."
            />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="collegium-latin text-sm text-[hsl(38_60%_70%)] mb-3">
            Tibi datum est
          </p>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-4 text-[hsl(40_40%_94%)] leading-tight">
            One case this month is more than nothing.
          </h2>
          <p className="text-[hsl(40_25%_82%)] max-w-2xl mx-auto mb-8 leading-relaxed">
            The justice gap closes one matter at a time. The infrastructure
            here exists so the gap between "I'd like to help" and "I helped"
            is small enough to cross during lunch.
          </p>
          <Link
            to="/patrocinium/cases"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 text-base"
          >
            Browse open cases <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="bg-[hsl(var(--c-cream))] border-t border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-xs text-[hsl(var(--c-slate-soft))] flex flex-col sm:flex-row gap-3 justify-between">
          <span>
            Patrocinium · part of <Link to="/" className="collegium-link">Collegium</Link>
          </span>
          <span className="flex gap-4">
            <Link to="/auxilium" className="collegium-link">Auxilium (for clients)</Link>
            <Link to="/justicegap" className="collegium-link">Justice Gap</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

function Promise({
  icon,
  label,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
}) {
  return (
    <div className="collegium-card p-5">
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-2">
        {icon}
        <span className="text-xs uppercase tracking-widest font-semibold">{label}</span>
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{body}</p>
    </div>
  );
}

function EngagementTile({
  hours,
  title,
  body,
}: {
  hours: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
        {hours}
      </div>
      <div className="collegium-display text-lg mb-1.5 leading-tight">{title}</div>
      <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4 sm:gap-5">
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center font-semibold collegium-display text-lg sm:text-xl">
        {n}
      </div>
      <div className="pt-1">
        <h3 className="collegium-display text-lg sm:text-xl leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
