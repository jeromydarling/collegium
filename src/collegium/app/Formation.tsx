import { useState } from "react";
import { libraryWorks, libraryExcerpts, tracksSeed } from "../content/library";
import { useDemoState, demoStore } from "../lib/demoStore";
import { Bookmark, BookOpen, Check } from "lucide-react";

const tabs = ["Excerpts", "Works", "Tracks"] as const;
type Tab = (typeof tabs)[number];

export function Formation() {
  const [tab, setTab] = useState<Tab>("Excerpts");
  const state = useDemoState();

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Eruditio</div>
        <h1 className="collegium-display text-4xl">Formation</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          Public-domain readings, multi-week tracks, and the texts that have
          shaped legal vocation for two millennia.
        </p>
      </div>

      <div className="flex border-b border-[hsl(var(--c-border))] mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t
                ? "border-[hsl(var(--c-wine))] text-[hsl(var(--c-wine))]"
                : "border-transparent text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-slate))]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Excerpts" && (
        <div className="space-y-4">
          {libraryExcerpts.map((ex) => {
            const work = libraryWorks.find((w) => w.id === ex.workId);
            const saved = state.savedExcerpts.includes(ex.id);
            return (
              <article key={ex.id} className="collegium-card p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-0.5">
                      {work?.title} · {work?.author}
                    </div>
                    <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
                      {ex.citation}
                    </div>
                  </div>
                  <button
                    onClick={() => demoStore.toggleSavedExcerpt(ex.id)}
                    className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                      saved
                        ? "bg-[hsl(var(--c-wine)/0.08)] border-[hsl(var(--c-wine)/0.3)] text-[hsl(var(--c-wine))]"
                        : "border-[hsl(var(--c-border))] text-[hsl(var(--c-slate-soft))] hover:border-[hsl(var(--c-wine)/0.3)]"
                    }`}
                  >
                    {saved ? <Check size={12} /> : <Bookmark size={12} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
                <blockquote className="collegium-quote my-4">"{ex.text}"</blockquote>
                {ex.paraphrase && (
                  <p className="text-sm text-[hsl(var(--c-slate))] italic mb-3 leading-relaxed">
                    {ex.paraphrase}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {ex.themes.map((t) => (
                    <span key={t} className="collegium-tag-soft">{t}</span>
                  ))}
                  {ex.audience.map((a) => (
                    <span key={a} className="collegium-tag">{a.replace("-", " ")}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {tab === "Works" && (
        <div className="grid md:grid-cols-2 gap-5">
          {libraryWorks.map((w) => (
            <a
              key={w.id}
              href={w.source.url}
              target="_blank"
              rel="noopener"
              className="collegium-card p-5 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-start gap-3 mb-2">
                <BookOpen size={18} className="text-[hsl(var(--c-gold))] mt-1 shrink-0" />
                <div className="flex-1">
                  <h3 className="collegium-display text-lg leading-tight">{w.title}</h3>
                  <div className="text-sm text-[hsl(var(--c-slate-soft))]">
                    {w.author} · {w.year}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                {w.summary}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span className="collegium-tag">{w.tradition.replace("-", " ")}</span>
                {w.themes.slice(0, 3).map((t) => (
                  <span key={t} className="collegium-tag-soft">{t}</span>
                ))}
              </div>
              <div className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-2">
                Source: {w.source.label}
              </div>
            </a>
          ))}
        </div>
      )}

      {tab === "Tracks" && (
        <div className="space-y-5">
          {tracksSeed.map((t) => {
            const enrolled = state.enrolledTracks.includes(t.id);
            return (
              <div key={t.id} className="collegium-card p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="collegium-display text-2xl mb-1">{t.title}</h3>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-2">{t.blurb}</p>
                    <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {t.items.length} readings · audience: {t.audience}
                    </div>
                  </div>
                  <button
                    onClick={() => demoStore.enrollTrack(t.id)}
                    disabled={enrolled}
                    className={
                      enrolled
                        ? "collegium-btn-ghost text-sm cursor-default"
                        : "collegium-btn-primary text-sm"
                    }
                  >
                    {enrolled ? "Enrolled ✓" : "Enroll"}
                  </button>
                </div>
                <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3">
                  <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
                    Readings
                  </div>
                  <ol className="text-sm text-[hsl(var(--c-slate))] space-y-1 list-decimal list-inside">
                    {t.items.map((id) => {
                      const ex = libraryExcerpts.find((e) => e.id === id);
                      const work = libraryWorks.find((w) => w.id === ex?.workId);
                      return (
                        <li key={id}>
                          {work?.title} · <span className="collegium-latin text-xs">{ex?.citation}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
