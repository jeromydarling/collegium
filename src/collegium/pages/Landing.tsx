import { Link } from "react-router-dom";
import {
  Users,
  Compass,
  Scale,
  Library,
  TrendingUp,
  Activity,
  ArrowRight,
  Quote,
} from "lucide-react";
import { brand, moduleOrder, principles } from "../brand";
import { aquinasQuotes } from "../content/aquinas";

const moduleIcons: Record<string, typeof Users> = {
  chapters: Users,
  mentorship: Compass,
  service: Scale,
  formation: Library,
  advancement: TrendingUp,
  nri: Activity,
};

export function Landing() {
  return (
    <div className="collegium-theme">
      {/* ─────────────────── Hero ─────────────────── */}
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-5 pt-20 sm:pt-28 pb-20 text-center">
          <div className="collegium-latin text-sm mb-5 tracking-wider">
            Collegium · Capitula · Tirocinium · Ministerium · Eruditio · Provectio
          </div>
          <h1 className="collegium-display-xl text-5xl sm:text-6xl md:text-7xl text-[hsl(var(--c-ink))] mb-8 max-w-4xl mx-auto">
            A guild for those who practice{" "}
            <span className="collegium-mark">law as a calling.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] max-w-2xl mx-auto leading-relaxed mb-6">
            Collegium is a guild operating system for Christian and Catholic legal
            communities — chapters, students, mentors, canonists, clinics, and the
            stewards who hold them together.
          </p>
          <p className="collegium-latin text-base text-[hsl(var(--c-wine))] mb-12">
            {brand.motto}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo" className="collegium-btn-primary inline-flex items-center gap-2">
              Enter the demo <ArrowRight size={16} />
            </Link>
            <Link to="/manifesto" className="collegium-btn-ghost">
              Read the manifesto
            </Link>
          </div>
          <div className="collegium-divider-ornament mt-16">⁂</div>
          <blockquote className="collegium-quote max-w-2xl mx-auto text-left">
            "Law is nothing else than an ordinance of reason for the common good,
            made by him who has care of the community, and promulgated."
            <footer className="text-sm not-italic text-[hsl(var(--c-slate-soft))] mt-3 font-sans">
              — Thomas Aquinas, Summa Theologiae I-II, q. 90, a. 4
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─────────────────── What it is ─────────────────── */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="collegium-latin text-sm mb-2">Quid est Collegium?</div>
              <h2 className="collegium-display text-4xl mb-6 leading-tight">
                Not a CRM. Not a directory.{" "}
                <span className="text-[hsl(var(--c-wine))]">A common life.</span>
              </h2>
            </div>
            <div className="collegium-prose">
              <p>
                Christian and Catholic legal communities already exist —
                St. Thomas More societies, the Catholic Bar Association, Christian
                Legal Society chapters, diocesan affiliates, student guilds. They
                hold formation evenings, run Red Masses, place mentors, route
                pro bono work, and quietly carry institutional memory across the
                generations.
              </p>
              <p>
                But the work mostly lives in email threads, spreadsheets, and the
                memory of whoever is currently chapter president. When the
                president rotates out, the memory rotates with them.
              </p>
              <p>
                Collegium is a single platform for the recurring rhythms of guild
                life: <em>chapter, mentor, service, formation, leadership</em> —
                with a Narrative Relational Intelligence layer that helps stewards
                notice who is drifting, who is rising, and where the chapter is
                being formed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Six modules ─────────────────── */}
      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <div className="collegium-latin text-sm mb-2">Sex officia</div>
            <h2 className="collegium-display text-4xl mb-3">Six functions, one common life</h2>
            <p className="text-[hsl(var(--c-slate-soft))] max-w-2xl mx-auto">
              Each module is a window on the same community. A student moves through
              all of them in time.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {moduleOrder.map((m) => {
              const Icon = moduleIcons[m.slug] ?? Users;
              return (
                <Link
                  key={m.slug}
                  to="/modules"
                  className="collegium-card p-6 hover:shadow-md transition-shadow group block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))]">
                      <Icon size={20} />
                    </div>
                    <span className="collegium-tag-soft">{m.latin}</span>
                  </div>
                  <h3 className="collegium-display text-2xl mb-2">{m.label}</h3>
                  <p className="text-sm leading-relaxed text-[hsl(var(--c-slate))]">
                    {m.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────── Principles ─────────────────── */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <div className="collegium-latin text-sm mb-2">Principia</div>
            <h2 className="collegium-display text-4xl mb-4">
              Built on Catholic Social Teaching
            </h2>
            <p className="text-[hsl(var(--c-slate-soft))] max-w-2xl mx-auto">
              The architecture follows the principles, not the other way around.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.key} className="border-l-2 border-[hsl(var(--c-gold))] pl-5 py-1">
                <div className="collegium-latin text-xs mb-1">{p.latin}</div>
                <h3 className="collegium-display text-xl mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--c-slate))]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── For ─────────────────── */}
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="collegium-latin text-sm mb-2 text-center">Pro quibus?</div>
          <h2 className="collegium-display text-4xl mb-12 text-center">
            For the communities that already exist
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                t: "St. Thomas More societies",
                d: "Local Catholic lawyer guilds with Red Masses, monthly luncheons, and quiet pro bono networks.",
              },
              {
                t: "Catholic Bar affiliates",
                d: "Diocesan and metro affiliates of the Catholic Bar Association — many founded in the last five years.",
              },
              {
                t: "Christian Legal Society chapters",
                d: "Attorney chapters and law-student ministries across the U.S.",
              },
              {
                t: "Christian Legal Fellowship",
                d: "Canada's national association of Christian lawyers and law students.",
              },
              {
                t: "Law-school student guilds",
                d: "Catholic and Christian student organizations at Notre Dame, CUA, Loyola, Ave Maria, and beyond.",
              },
              {
                t: "Faith-based legal aid",
                d: "Parish-level clinics, religious-liberty practices, immigration ministries.",
              },
            ].map((card) => (
              <div key={card.t} className="collegium-card p-5">
                <h3 className="collegium-display text-xl mb-2">{card.t}</h3>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── NRI ─────────────────── */}
      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-5xl mx-auto px-5 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[hsl(38_60%_70%)] collegium-latin text-sm mb-2">
                Concentus
              </div>
              <h2 className="collegium-display text-4xl mb-6 text-[hsl(40_40%_94%)]">
                A narrative intelligence that <em>helps stewards notice.</em>
              </h2>
              <p className="text-[hsl(40_20%_82%)] mb-4 leading-relaxed">
                NRI — Narrative Relational Intelligence — is not a dashboard. It is
                an interpretive layer that synthesizes the small signals of
                chapter life into the question a steward should actually be asking
                this week.
              </p>
              <p className="text-[hsl(40_20%_82%)] leading-relaxed">
                "A law student has missed two mentor meetings and is in bar prep —
                this is overload, not disengagement; send a one-line note."
                <span className="text-[hsl(38_60%_70%)]"> That's NRI.</span>
              </p>
            </div>
            <div className="bg-[hsl(220_20%_18%)] rounded-lg p-7 border border-[hsl(220_20%_28%)]">
              <div className="flex items-center gap-2 mb-3 text-[hsl(38_60%_70%)]">
                <Activity size={16} />
                <span className="text-xs uppercase tracking-widest">NRI Briefing</span>
              </div>
              <h3 className="collegium-display text-xl text-[hsl(40_40%_94%)] mb-3">
                JP II Guild: succession risk before April transition
              </h3>
              <p className="text-sm text-[hsl(40_20%_82%)] mb-4 leading-relaxed">
                Maria Velasquez (3L) graduates in May. Patrick Owens (2L) is being
                lined up as president, but no VP candidate has emerged. Three 1Ls
                attended the August mentor-match and never returned.
              </p>
              <div className="border-t border-[hsl(220_20%_28%)] pt-3">
                <div className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)] mb-1.5">
                  Suggested
                </div>
                <p className="text-sm text-[hsl(40_30%_88%)] italic">
                  Prof. Hartmann hosts a small dinner with Patrick and the three
                  named 1Ls before finals. Frame as conversation, not recruitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Aquinas closing ─────────────────── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <Quote className="mx-auto text-[hsl(var(--c-gold))] mb-6" size={32} />
          <blockquote className="collegium-display text-3xl sm:text-4xl text-[hsl(var(--c-ink))] leading-tight mb-6">
            "To live well is to work well,
            <br />
            or display a good activity,
            <br />
            for virtue is concerned with conduct."
          </blockquote>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-12">
            Thomas Aquinas · Commentary on Aristotle's Nicomachean Ethics
          </p>
          <hr className="collegium-gold-rule" />
          <p className="text-lg text-[hsl(var(--c-slate))] mb-8 mt-8">
            If you steward a Catholic lawyers guild, a St. Thomas More chapter, a
            Christian student fellowship, or a parish legal-aid program — we built
            Collegium for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo" className="collegium-btn-primary inline-flex items-center gap-2">
              Enter the demo <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="collegium-btn-ghost">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
