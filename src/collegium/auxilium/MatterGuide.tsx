import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Clock,
  FileText,
  HelpCircle,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Check,
  ExternalLink,
} from "lucide-react";
import { findMatter } from "./data/matters";
import { evictionGuide, type EvictionGuide } from "./data/eviction";
import { LocalInfoPanel } from "./components/LocalInfoPanel";
import { JurisdictionPicker, useJurisdiction } from "./components/JurisdictionPicker";
import { ConsultPacket } from "./components/ConsultPacket";

/** All guides we have ready, keyed by slug. */
const GUIDES: Record<string, EvictionGuide> = {
  eviction: evictionGuide,
};

export function MatterGuide() {
  const { slug = "" } = useParams<{ slug: string }>();
  const matter = findMatter(slug);
  const guide = GUIDES[slug];
  const { jurisdiction, setJurisdiction } = useJurisdiction();

  if (!matter) {
    return (
      <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen px-4 py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="collegium-display text-2xl mb-3">Matter not found</h1>
          <Link to="/auxilium" className="collegium-link">
            Back to start
          </Link>
        </div>
      </div>
    );
  }

  // Scaffold for matter types we haven't deeply written yet.
  if (!guide) {
    return (
      <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <Link
            to="/auxilium"
            className="text-xs collegium-link mb-6 inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> All matters
          </Link>
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] mb-4">
            <matter.icon size={22} />
          </div>
          <h1 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
            {matter.title}
          </h1>
          <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-6">
            {matter.blurb}
          </p>
          <div className="collegium-card-warm p-5 sm:p-6">
            <h3 className="collegium-display text-lg mb-2">Coming together</h3>
            <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-4">
              This guide is being built. For now, here's what we can do for
              you today: find a clinic near you that handles{" "}
              {matter.title.toLowerCase()}.
            </p>
            <Link
              to="/auxilium/find-help"
              className="collegium-btn-primary text-sm"
            >
              Find help near me
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))]">
      {/* Header band */}
      <div className="bg-gradient-to-b from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10">
          <Link
            to="/auxilium"
            className="text-xs collegium-link mb-5 inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> All matters
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
              <matter.icon size={26} />
            </div>
            <div>
              <p className="collegium-latin text-sm text-[hsl(var(--c-wine))]">
                Auxilium
              </p>
              <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
                {guide.title}
              </h1>
              <p className="text-sm sm:text-base text-[hsl(var(--c-slate))] italic mt-1">
                {guide.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-12 collegium-safe-bottom">
        {/* Jurisdiction picker — drives the Perplexity calls below. */}
        <JurisdictionPicker
          value={jurisdiction}
          onChange={setJurisdiction}
        />

        {/* Overview */}
        <Section title="What you're facing" icon={ShieldCheck} latin="Quid est">
          <div className="collegium-prose">
            {guide.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        {/* Ethical grounding */}
        <aside className="bg-[hsl(var(--c-cream-warm))] border-l-2 border-[hsl(var(--c-gold))] rounded-r-md p-5 sm:p-6">
          <p className="text-[hsl(var(--c-slate))] leading-relaxed italic mb-3">
            "{guide.ethicalGrounding.quote}"
          </p>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-3">
            — {guide.ethicalGrounding.source}
          </p>
          <p className="text-sm sm:text-base text-[hsl(var(--c-ink))] leading-relaxed">
            {guide.ethicalGrounding.plainEnglish}
          </p>
        </aside>

        {/* Timeline */}
        <Section title="Your next two weeks" icon={Clock} latin="Tempus">
          <ol className="space-y-4 sm:space-y-5">
            {guide.timeline.map((step, i) => (
              <li
                key={i}
                className={`grid grid-cols-[5rem_1fr] sm:grid-cols-[7rem_1fr] gap-3 sm:gap-5 ${
                  step.urgent
                    ? "border-l-2 border-[hsl(8_55%_52%)] pl-3 sm:pl-4 -ml-3 sm:-ml-4"
                    : ""
                }`}
              >
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[hsl(var(--c-wine))] pt-1">
                  {step.day}
                </div>
                <div>
                  <h4 className="collegium-display text-lg leading-tight mb-1">
                    {step.title}
                    {step.urgent && (
                      <span className="ml-2 inline-block text-[9px] uppercase tracking-widest text-[hsl(8_55%_42%)] font-bold align-middle">
                        Urgent
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Document checklist with check-off + upload affordance */}
        <Section title="What to gather" icon={FileText} latin="Documenta">
          <DocumentChecklist guide={guide} />
        </Section>

        {/* Live local info — Perplexity-powered panel */}
        <Section
          title="What's true in your area today"
          icon={Search}
          latin="Hic et nunc"
        >
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
            Each answer below is a live look-up against current public sources
            — court websites, statutes, legal-aid directories. We show the
            citations alongside so you can verify everything yourself.
          </p>
          <div className="space-y-4">
            {guide.perplexityQueries.map((q) => (
              <LocalInfoPanel
                key={q.key}
                queryKey={q.key}
                promptTemplate={q.prompt}
                jurisdiction={jurisdiction}
              />
            ))}
          </div>
        </Section>

        {/* Questions to bring to consult */}
        <Section
          title="Questions worth asking the lawyer"
          icon={HelpCircle}
          latin="Interrogationes"
        >
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4 sm:mb-5">
            A clinic appointment is usually 45 minutes. These are the
            questions that get you the most out of those 45 minutes.
          </p>
          <ol className="space-y-4">
            {guide.consultQuestions.map((q, i) => (
              <li
                key={i}
                className="grid grid-cols-[1.5rem_1fr] gap-3 sm:gap-4"
              >
                <div className="collegium-display text-base text-[hsl(var(--c-gold))]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--c-ink))] mb-1 leading-snug">
                    {q.q}
                  </p>
                  <p className="text-sm text-[hsl(var(--c-slate-soft))] leading-snug">
                    {q.why}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Consult packet — what they hand to the lawyer */}
        <Section title="Your consult packet" icon={Sparkles} latin="Sarcina">
          <ConsultPacket guide={guide} jurisdiction={jurisdiction} />
        </Section>

        {/* Find help */}
        <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] -mx-4 sm:mx-0 rounded-none sm:rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <MapPin
              className="text-[hsl(38_60%_70%)] shrink-0 mt-1"
              size={22}
            />
            <div>
              <h2 className="collegium-display text-2xl text-[hsl(40_40%_94%)] mb-2">
                Now find someone to walk in with
              </h2>
              <p className="text-[hsl(40_20%_85%)] leading-relaxed mb-5">
                You've done the hard part. Below are clinics in our network
                that handle housing matters, plus national directories so you
                can find others.
              </p>
              <Link
                to="/auxilium/find-help"
                className="inline-flex items-center gap-2 bg-[hsl(38_60%_60%)] text-[hsl(220_30%_12%)] rounded-full px-5 py-3 font-medium hover:bg-[hsl(38_60%_70%)] transition-colors text-sm"
              >
                Find help near me <ChevronLeft size={14} className="rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({
  title,
  latin,
  icon: Icon,
  children,
}: {
  title: string;
  latin?: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
          <Icon size={15} />
        </div>
        <div>
          {latin && (
            <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
              {latin}
            </div>
          )}
          <h2 className="collegium-display text-2xl sm:text-3xl leading-tight">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function DocumentChecklist({ guide }: { guide: EvictionGuide }) {
  const STORAGE_KEY = `auxilium_docs_${guide.slug}`;
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {
      /* ignore */
    }
  }, [checked, STORAGE_KEY]);

  const total = guide.documents.length;
  const got = checked.size;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[hsl(var(--c-slate-soft))]">
          {got} of {total} gathered
        </span>
        <div className="flex-1 h-1 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden mx-3 max-w-[200px]">
          <div
            className="h-full bg-[hsl(var(--c-gold))] transition-all"
            style={{ width: `${(got / total) * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {guide.documents.map((d) => {
          const isChecked = checked.has(d.key);
          return (
            <li key={d.key}>
              <button
                onClick={() =>
                  setChecked((prev) => {
                    const next = new Set(prev);
                    if (next.has(d.key)) next.delete(d.key);
                    else next.add(d.key);
                    return next;
                  })
                }
                className={`w-full text-left collegium-card p-4 hover:shadow-md transition-all flex items-start gap-3 ${
                  isChecked ? "bg-[hsl(145_30%_42%/0.04)]" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    isChecked
                      ? "bg-[hsl(145_30%_42%)] border-[hsl(145_30%_42%)] text-white"
                      : "border-[hsl(var(--c-border))] bg-white"
                  }`}
                >
                  {isChecked && <Check size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-[hsl(var(--c-ink))] leading-snug ${
                      isChecked ? "line-through opacity-60" : ""
                    }`}
                  >
                    {d.label}
                  </div>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] leading-snug mt-0.5">
                    {d.why}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
