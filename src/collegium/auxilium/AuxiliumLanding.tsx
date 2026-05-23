import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  HelpCircle,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { matterTypes } from "./data/matters";
import { InfoNotAdviceFooter } from "./components/InfoNotAdviceFooter";
import { JusticeMap } from "./components/JusticeMap";
import { LegalShieldFeatured } from "./components/LegalShieldFeatured";
import { LanguagePicker } from "./components/LanguagePicker";

/**
 * Auxilium landing — the second front door of Collegium.
 *
 * Voice: plain English, mobile-first, calm. The reader is probably already
 * panicking; the page should feel like a deep breath, not a sales pitch.
 *
 * Posture: post-Upsolve-2d-Cir-reversal, we explicitly stay in the court
 * self-help center doctrinal lane. Information, not advice. Visible on
 * every screen.
 */
export function AuxiliumLanding() {
  return (
    <div className="collegium-theme">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] whitespace-nowrap">
              <span className="collegium-latin not-italic">Auxilium</span>
              <span className="text-[hsl(var(--c-slate-soft))]">·</span>
              <span>By Collegium</span>
            </div>
            <LanguagePicker />
          </div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--c-ink))] mb-5 sm:mb-6 leading-[1.05]">
            Walk into help <span className="collegium-mark">prepared.</span>
          </h1>
          <p className="text-base sm:text-lg text-[hsl(var(--c-slate))] max-w-xl mx-auto leading-relaxed mb-3">
            A plain-English guide for what you're facing, the documents to
            gather, the deadlines to know, and the questions to ask.
          </p>
          <p className="text-sm sm:text-base text-[hsl(var(--c-slate-soft))] max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
            We are not your lawyer. Auxilium provides information, not legal
            advice. We help you understand the system and bring your whole
            story into the room before the meter starts running.
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
            Already know what you need?{" "}
            <Link to="/auxilium/find-help" className="collegium-link">
              Find free or low-cost legal help near you
            </Link>
            .
          </p>
        </div>
      </section>

      {/* THE REALITY — the brutal numbers, up front. */}
      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-[hsl(38_60%_70%)] mb-3">
            <AlertTriangle size={16} />
            <p className="collegium-latin text-sm">Quae vera sunt</p>
          </div>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 text-[hsl(40_40%_94%)] leading-tight">
            In America, the poor are denied justice almost universally.
          </h2>
          <p className="text-[hsl(40_20%_82%)] max-w-3xl leading-relaxed mb-10 sm:mb-12">
            We say "everyone has a right to a lawyer." That's true in
            criminal cases. In civil cases — eviction, debt, child custody,
            benefits, deportation, domestic violence — there is no such
            right. The people most often in need of legal help can almost
            never afford it. Here is what that looks like by the numbers.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <Stat
              big="92%"
              label="of substantial civil legal problems of low-income Americans get inadequate or no legal help."
              source="LSC Justice Gap Report (2022). Up from 86% in 2017."
              sourceUrl="https://justicegap.lsc.gov/the-report/"
            />
            <Stat
              big="49%"
              label="of eligible people who walk through the door of an LSC-funded legal aid program are turned away."
              source="Legal Services Corporation, 2022."
              sourceUrl="https://www.lsc.gov/press-release/low-income-americans-face-immense-justice-gap-according-new-legal-services-corporation-report"
            />
            <Stat
              big="70%"
              label="of consumer debt-collection lawsuits end in default judgment — because the person sued never showed up."
              source="Pew Charitable Trusts, 2020. Debt is now ~42% of state civil dockets."
              sourceUrl="https://www.pew.org/en/research-and-analysis/reports/2020/05/how-debt-collectors-are-transforming-the-business-of-state-courts"
            />
            <Stat
              big="84%"
              label="of tenants with a lawyer stay in their homes. Only 42% of eligible NYC tenants currently get one — down from 71%."
              source="NYC Right to Counsel evaluation, Urban Institute."
              sourceUrl="https://housingmatters.urban.org/articles/right-counsel-eviction-lessons-new-york-city"
            />
            <Stat
              big="60–90%"
              label="of family court cases have at least one party without a lawyer. California hits 80% by judgment."
              source="IAALS, Cases Without Counsel."
              sourceUrl="https://iaals.du.edu/sites/default/files/documents/publications/cases_without_counsel_research_report.pdf"
            />
            <Stat
              big="10.5×"
              label="more likely to win an immigration case when represented. Only 27% of represented detainees are deported, vs. 62% of pro se."
              source="Vera Institute."
              sourceUrl="https://www.vera.org/publications/the-impact-of-legal-representation-on-detained-immigrants-facing-deportation"
            />
            <Stat
              big="54"
              label="U.S. counties have zero practicing lawyers. About 1,300 (41%) have fewer than one per 1,000 residents."
              source="ABA Profile of the Legal Profession."
              sourceUrl="https://www.2civility.org/aba-profile-of-the-legal-profession-legal-deserts-and-law-school-debt/"
            />
            <Stat
              big="$300–$450"
              label="per hour is what private representation typically costs above the LSC income cliff (125–200% of poverty)."
              source="Bar association survey data; LSC income eligibility, 45 CFR 1611."
              sourceUrl="https://www.ecfr.gov/current/title-45/subtitle-B/chapter-XVI/part-1611"
            />
            <Stat
              big="~80%"
              label="reduction in reported physical violence when a domestic-violence survivor gets a protection order."
              source="LSC analysis."
              sourceUrl="https://www.lsc.gov/our-impact/publications/other-publications-and-reports/how-legal-aid-helps-domestic-violence"
            />
          </div>

          <p className="text-sm text-[hsl(40_20%_75%)] mt-10 sm:mt-12 max-w-3xl leading-relaxed italic">
            "Justice removed, then, what are kingdoms but great robberies?"
            <br />
            <span className="text-xs not-italic text-[hsl(40_20%_60%)]">
              Augustine, City of God, Book IV
            </span>
          </p>
        </div>
      </section>

      {/* The justice crisis, mapped — interactive choropleth */}
      <JusticeMap />

      {/* Door to the deeper polemic — Justice Gap */}
      <section className="bg-[hsl(220_30%_6%)] border-y border-[hsl(220_20%_18%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <p className="collegium-latin text-sm text-[hsl(38_60%_70%)] mb-3">
            Iustitia rapta
          </p>
          <h3 className="collegium-display text-2xl sm:text-3xl text-[hsl(40_40%_94%)] mb-4 leading-tight">
            The deeper reckoning — Justice Gap.
          </h3>
          <p className="text-[hsl(40_30%_82%)] leading-relaxed mb-6 max-w-2xl mx-auto">
            For the wider question — what the Constitution promised in
            1963, what we have actually built, and what the cost has been —
            open the polemic. Seventeen chapters. The map, the essay, the
            stories, the news, the solution.
          </p>
          <Link
            to="/justicegap"
            className="inline-flex items-center justify-center gap-2 bg-[hsl(38_60%_60%)] text-[hsl(220_30%_10%)] rounded-full px-5 py-3 font-medium hover:bg-[hsl(38_60%_70%)] transition-colors text-sm"
          >
            Open Justice Gap <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* LegalShield breakthrough — the solution that already exists */}
      <LegalShieldFeatured />

      {/* Three promises */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="collegium-display text-3xl sm:text-4xl mb-3">
              What we actually do for you.
            </h2>
            <p className="text-[hsl(var(--c-slate-soft))] max-w-2xl mx-auto">
              No advice. No promises. Real preparation, real documents,
              real questions, real referrals to people who can help.
            </p>
          </div>
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
              body="We look up what's true in your state and city today — statutes, deadlines, programs, free clinics, paid options."
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
                Auxilium is a court self-help tool, not a lawyer. We can
                explain what an eviction is, what a deadline is, what
                statute applies, and what documents a real attorney will
                want to see. We cannot tell you what <em>you</em> should
                do — that's legal advice, and that's what licensed
                attorneys are for.
              </p>
              <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                We do not share your information with ICE, CPS, your
                landlord, your creditor, or anyone else. Your matter file
                stays on your device. It moves only when you choose to
                send it to a clinic, an attorney, or a trusted person.
              </p>
              <p className="text-[hsl(var(--c-slate))] leading-relaxed">
                When you need advice, we'll help you find someone who can
                give it — free if you qualify, low-cost if you don't.
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
              These are the matters we handle most often. Start with the
              one that fits — or take the interview and we'll figure it
              out together.
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

      {/* Why a Christian-founded platform */}
      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-3">
            Cur Auxilium?
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl mb-5 sm:mb-6">
            Why a Christian-founded help platform?
          </h2>
          <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-4">
            Because Catholic Social Teaching has been saying since 1891
            that shelter, work, dignity, and access to justice are not
            privileges granted to the poor by the powerful — they are
            foundations the law was made to protect.
          </p>
          <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-6">
            Built by a network of Christian and Catholic lawyers,
            students, and chapters who believe that. You don't need to
            share our faith to use this tool. You just need help.
          </p>
          <p className="collegium-latin text-base text-[hsl(var(--c-wine))]">
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
            You don't need to know what kind of legal matter this is. You
            just need to tell us what happened.
          </p>
          <Link
            to="/auxilium/begin"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm mx-auto"
          >
            Begin the interview <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <InfoNotAdviceFooter />
    </div>
  );
}

function Stat({
  big,
  label,
  source,
  sourceUrl,
}: {
  big: string;
  label: string;
  source: string;
  sourceUrl?: string;
}) {
  return (
    <div className="border-l-2 border-[hsl(38_60%_60%)] pl-4 sm:pl-5">
      <div className="collegium-display text-3xl sm:text-4xl text-[hsl(38_60%_75%)] leading-none mb-2">
        {big}
      </div>
      <p className="text-sm sm:text-base text-[hsl(40_30%_92%)] leading-snug mb-2">
        {label}
      </p>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_65%)] hover:text-[hsl(38_60%_70%)] underline decoration-dotted underline-offset-2"
        >
          {source}
        </a>
      ) : (
        <p className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_65%)]">
          {source}
        </p>
      )}
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
