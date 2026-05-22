import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  HelpCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { matterTypes } from "./data/matters";

/**
 * Auxilium landing — the second front door of Collegium.
 *
 * Voice: plain English, mobile-first, calm. The reader is probably already
 * panicking; the page should feel like a deep breath, not a sales pitch.
 */
export function AuxiliumLanding() {
  return (
    <div className="collegium-theme">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-4">
            <span className="collegium-latin not-italic">Auxilium</span>
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span>By Collegium</span>
          </div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--c-ink))] mb-5 sm:mb-6 leading-[1.05]">
            Walk into help <span className="collegium-mark">prepared.</span>
          </h1>
          <p className="text-base sm:text-lg text-[hsl(var(--c-slate))] max-w-xl mx-auto leading-relaxed mb-3">
            A plain-English guide for what you're facing, the documents to
            gather, the deadlines to know, and the questions to ask.
          </p>
          <p className="text-sm sm:text-base text-[hsl(var(--c-slate-soft))] max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
            We are not your lawyer and we do not give legal advice. We help you
            understand the system and bring your whole case into the room
            before the meter starts running.
          </p>
          <Link
            to="/auxilium/begin"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm mx-auto text-base"
          >
            Begin the interview <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-4">
            10–15 minutes, in a conversation. No account required. Stays on
            your device unless you choose to share it.
          </p>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-3">
            Or{" "}
            <Link to="/auxilium/start" className="collegium-link">
              skip the interview and browse matter types
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Three promises */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <Promise
              icon={FileText}
              title="A guide for your situation"
              body="Plain English. Real deadlines. Real documents. None of the things lawyers learned to say to feel important."
            />
            <Promise
              icon={HelpCircle}
              title="Questions worth asking"
              body="The right questions, written out, so a 45-minute clinic appointment becomes 45 minutes of actual help."
            />
            <Promise
              icon={MapPin}
              title="Help that's local to you"
              body="We look up what's true in your state and city today — statutes, deadlines, programs, free clinics."
            />
          </div>
        </div>
      </section>

      {/* What we don't do */}
      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[hsl(var(--c-border))] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="collegium-display text-2xl sm:text-3xl mb-3">
                Information, not advice. On purpose.
              </h2>
              <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                A 2022 federal court decision confirmed something every paralegal
                already knew: explaining how the legal system works is
                information, not the practice of law. Telling you what you
                personally should do — that's advice, and that's what licensed
                attorneys are for.
              </p>
              <p className="text-[hsl(var(--c-slate))] leading-relaxed">
                Auxilium stays on the information side of that line, on
                purpose. Every fact we surface comes with a citation you can
                verify. When you need advice, we'll help you find someone who
                can give it to you — for free, if your income qualifies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Matter types */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-10 sm:mb-12 text-center">
            <h2 className="collegium-display text-3xl sm:text-4xl mb-3">
              What kind of help do you need?
            </h2>
            <p className="text-[hsl(var(--c-slate-soft))] max-w-xl mx-auto px-2">
              These are the matters we handle most often. Start with the one
              that fits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {matterTypes.map((m) => (
              <Link
                key={m.slug}
                to={`/auxilium/matter/${m.slug}`}
                className="collegium-card p-5 hover:shadow-md transition-shadow group block"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
                    <m.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="collegium-display text-lg leading-tight">
                      {m.title}
                    </h3>
                    {m.status !== "ready" && (
                      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                        Coming together
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                  {m.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Christian framing — present, not pushy */}
      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="collegium-latin text-sm text-[hsl(38_60%_70%)] mb-3">
            Cur Auxilium?
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl mb-5 sm:mb-6 text-[hsl(40_40%_94%)]">
            Why a Christian-founded help platform?
          </h2>
          <p className="text-[hsl(40_20%_85%)] leading-relaxed mb-4">
            Because Catholic Social Teaching has been saying since 1891 that
            shelter, work, dignity, and access to justice are not privileges
            granted to the poor by the powerful — they are foundations the
            law was made to protect.
          </p>
          <p className="text-[hsl(40_20%_85%)] leading-relaxed mb-6">
            We're built by a network of Christian and Catholic lawyers,
            students, and chapters who believe that. You don't need to share
            our faith to use this tool — but you should know we mean it.
          </p>
          <p className="collegium-latin text-base text-[hsl(38_60%_70%)]">
            Lex caritas est. The law is love made just.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 sm:mb-4">
            Take a breath. Start.
          </h2>
          <p className="text-[hsl(var(--c-slate))] mb-8 sm:mb-10 leading-relaxed">
            You don't need to know what kind of legal matter this is. You just
            need to tell us what happened.
          </p>
          <Link
            to="/auxilium/begin"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm mx-auto"
          >
            Begin the interview <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Promise({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof FileText;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] mb-3">
        <Icon size={18} />
      </div>
      <h3 className="collegium-display text-xl mb-2 leading-tight">{title}</h3>
      <p className="text-sm sm:text-base text-[hsl(var(--c-slate))] leading-relaxed">
        {body}
      </p>
    </div>
  );
}
