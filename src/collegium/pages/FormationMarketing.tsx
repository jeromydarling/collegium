import { Link } from "react-router-dom";
import { libraryWorks, libraryExcerpts, tracksSeed } from "../content/library";
import { christianYear, observances } from "../content/calendar";
import { ArrowRight, BookOpen } from "lucide-react";

export function FormationMarketing() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-5 py-20">
          <div className="collegium-latin text-sm mb-2">Eruditio</div>
          <h1 className="collegium-display-xl text-5xl mb-6">Formation</h1>
          <p className="text-xl text-[hsl(var(--c-slate))] leading-relaxed">
            A curated library of public-domain legal, civic, and theological texts —
            organized for chapter discussion, mentor prompts, and daily devotion.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <h2 className="collegium-display text-3xl mb-3">The library</h2>
          <p className="text-[hsl(var(--c-slate-soft))] mb-10 max-w-2xl">
            Every work below is in the public domain and verifiably sourced from
            Project Gutenberg, Internet Archive, or the Vatican magisterial archive.
            No paywalls, no licensing fog, no second-guessing.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {libraryWorks.map((w) => (
              <div key={w.id} className="collegium-card p-5">
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen size={16} className="text-[hsl(var(--c-gold))] mt-1 shrink-0" />
                  <div>
                    <h3 className="collegium-display text-lg leading-tight">{w.title}</h3>
                    <div className="text-sm text-[hsl(var(--c-slate-soft))]">
                      {w.author} · {w.year}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                  {w.summary}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="collegium-tag">{w.tradition}</span>
                  {w.themes.slice(0, 3).map((t) => (
                    <span key={t} className="collegium-tag-soft">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <h2 className="collegium-display text-3xl mb-3">Formation tracks</h2>
          <p className="text-[hsl(var(--c-slate-soft))] mb-10 max-w-2xl">
            Multi-week sequences for personal reading, mentor pairs, or chapter
            study groups. Each track ships with discussion guides.
          </p>
          <div className="space-y-5">
            {tracksSeed.map((t) => (
              <div key={t.id} className="collegium-card p-6">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <h3 className="collegium-display text-xl">{t.title}</h3>
                  <span className="collegium-tag shrink-0">{t.audience}</span>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{t.blurb}</p>
                <div className="text-xs text-[hsl(var(--c-slate-soft))] mt-3">
                  {t.items.length} readings
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <h2 className="collegium-display text-3xl mb-3">An ecumenical legal year</h2>
          <p className="text-[hsl(var(--c-slate-soft))] mb-10 max-w-2xl">
            Two layers. The Christian year that any tradition can name; legal and
            civic observances that overlay it; and an optional Catholic depth mode
            for the saints of legal vocation.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="collegium-display text-xl mb-4">Christian year</h3>
              <ul className="space-y-3">
                {christianYear.map((s) => (
                  <li key={s.key} className="border-l-2 border-[hsl(var(--c-gold))] pl-4 py-1">
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="collegium-display text-lg">{s.name}</span>
                      <span className="collegium-latin text-xs">{s.latin}</span>
                    </div>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">{s.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="collegium-display text-xl mb-4">Saints & observances</h3>
              <ul className="space-y-3">
                {observances.map((o) => (
                  <li key={o.key} className="border-l-2 border-[hsl(var(--c-wine)/0.3)] pl-4 py-1">
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="collegium-display text-lg">{o.name}</span>
                      <span className="text-xs text-[hsl(var(--c-slate-soft))]">{o.date}</span>
                    </div>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">{o.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-3xl mx-auto px-5 py-20 text-center">
          <h2 className="collegium-display text-4xl mb-6 text-[hsl(40_40%_94%)]">
            Read the Daily Office
          </h2>
          <p className="text-[hsl(40_20%_82%)] mb-8 max-w-xl mx-auto leading-relaxed">
            A ten-minute reading, reflection, prayer, and prompt — rotated by
            weekday theme. Built on Aquinas and the public-domain canon.
          </p>
          <Link
            to="/app/office"
            className="inline-flex items-center gap-2 bg-[hsl(38_60%_60%)] text-[hsl(220_30%_12%)] rounded-full px-6 py-3 font-medium hover:bg-[hsl(38_60%_70%)] transition-colors"
          >
            Open today's Office <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
