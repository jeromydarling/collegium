import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { libraryWorks, libraryExcerpts, tracksSeed } from "../content/library";
import { sectionForExcerpt, sectionsForWork } from "../content/workSections";
import { useDemoState, demoStore } from "../lib/demoStore";
import { Bookmark, BookOpen, Check, ArrowRight, Filter, X } from "lucide-react";

const tabs = ["Excerpts", "Works", "Tracks"] as const;
type Tab = (typeof tabs)[number];

export function Formation() {
  const [tab, setTab] = useState<Tab>("Excerpts");
  const [themeFilter, setThemeFilter] = useState<string>("");
  const [audienceFilter, setAudienceFilter] = useState<string>("");
  const [traditionFilter, setTraditionFilter] = useState<string>("");
  const [savedOnly, setSavedOnly] = useState(false);
  const state = useDemoState();

  const allThemes = useMemo(() => {
    const s = new Set<string>();
    for (const ex of libraryExcerpts) for (const t of ex.themes) s.add(t);
    return Array.from(s).sort();
  }, []);
  const allAudiences = useMemo(() => {
    const s = new Set<string>();
    for (const ex of libraryExcerpts) for (const a of ex.audience) s.add(a);
    return Array.from(s).sort();
  }, []);
  const allTraditions = useMemo(() => {
    const s = new Set<string>();
    for (const w of libraryWorks) s.add(w.tradition);
    return Array.from(s).sort();
  }, []);

  const filteredExcerpts = useMemo(() => {
    return libraryExcerpts.filter((ex) => {
      if (themeFilter && !ex.themes.includes(themeFilter)) return false;
      if (audienceFilter && !ex.audience.includes(audienceFilter)) return false;
      if (savedOnly && !state.savedExcerpts.includes(ex.id)) return false;
      if (traditionFilter) {
        const work = libraryWorks.find((w) => w.id === ex.workId);
        if (!work || work.tradition !== traditionFilter) return false;
      }
      return true;
    });
  }, [themeFilter, audienceFilter, traditionFilter, savedOnly, state.savedExcerpts]);

  const activeFilterCount = [themeFilter, audienceFilter, traditionFilter].filter(Boolean).length + (savedOnly ? 1 : 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Eruditio</div>
          <h1 className="collegium-display text-3xl sm:text-4xl">Formation</h1>
          <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
            Public-domain readings, multi-week tracks, and the texts that have
            shaped legal vocation for two millennia.
          </p>
        </div>
        <Link
          to="/app/devotional"
          className="collegium-card p-3 hover:shadow-md transition-shadow flex items-center gap-2.5 group shrink-0 bg-[hsl(var(--c-cream-warm))]"
        >
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center shrink-0">
            <BookOpen size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))]">
              Devotional
            </div>
            <div className="collegium-display text-sm leading-tight">
              The Lawyer's Year
            </div>
          </div>
          <ArrowRight
            size={14}
            className="text-[hsl(var(--c-wine))] group-hover:translate-x-0.5 transition-transform shrink-0"
          />
        </Link>
      </div>

      <div className="flex border-b border-[hsl(var(--c-border))] mb-5 sm:mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px min-h-[44px] ${
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
        <div className="collegium-safe-bottom">
          <div className="collegium-card p-4 sm:p-5 mb-4 bg-[hsl(var(--c-cream-warm))]">
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <FilterSelect
                label="Theme"
                value={themeFilter}
                onChange={setThemeFilter}
                options={allThemes}
              />
              <FilterSelect
                label="Audience"
                value={audienceFilter}
                onChange={setAudienceFilter}
                options={allAudiences}
              />
              <FilterSelect
                label="Tradition"
                value={traditionFilter}
                onChange={setTraditionFilter}
                options={allTraditions}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <label className="text-xs text-[hsl(var(--c-slate))] inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={savedOnly}
                  onChange={(e) => setSavedOnly(e.target.checked)}
                  className="cursor-pointer"
                />
                Saved only ({state.savedExcerpts.length})
              </label>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setThemeFilter("");
                    setAudienceFilter("");
                    setTraditionFilter("");
                    setSavedOnly(false);
                  }}
                  className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
                >
                  <X size={11} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 text-xs text-[hsl(var(--c-slate-soft))]">
            <span>
              {filteredExcerpts.length} of {libraryExcerpts.length} excerpts
              {activeFilterCount > 0 && (
                <span className="text-[hsl(var(--c-wine))] ml-1">
                  · <Filter size={10} className="inline" /> {activeFilterCount} filter
                  {activeFilterCount === 1 ? "" : "s"}
                </span>
              )}
            </span>
          </div>

          <div className="space-y-4">
            {filteredExcerpts.map((ex) => {
              const work = libraryWorks.find((w) => w.id === ex.workId);
              const saved = state.savedExcerpts.includes(ex.id);
              const section = sectionForExcerpt(ex.id);
              return (
                <article key={ex.id} className="collegium-card p-5 sm:p-6">
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
                    {work && (
                      <Link
                        to={
                          section
                            ? `/app/formation/work/${work.id}/section/${section.id}?excerpt=${ex.id}`
                            : `/app/formation/work/${work.id}`
                        }
                        className="collegium-link text-xs inline-flex items-center gap-1 ml-auto"
                      >
                        <BookOpen size={11} /> Read in context{" "}
                        <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
            {filteredExcerpts.length === 0 && (
              <div className="collegium-card p-8 text-center">
                <p className="text-sm text-[hsl(var(--c-slate-soft))]">
                  No excerpts match these filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "Works" && (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5 collegium-safe-bottom">
          {libraryWorks.map((w) => {
            const sections = sectionsForWork(w.id);
            return (
              <div
                key={w.id}
                className="collegium-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen
                    size={18}
                    className="text-[hsl(var(--c-gold))] mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="collegium-display text-lg leading-tight">
                      {w.title}
                    </h3>
                    <div className="text-sm text-[hsl(var(--c-slate-soft))]">
                      {w.author} · {w.year}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                  {w.summary}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                  <span className="collegium-tag">
                    {w.tradition.replace("-", " ")}
                  </span>
                  {w.themes.slice(0, 3).map((t) => (
                    <span key={t} className="collegium-tag-soft">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[hsl(var(--c-border))]">
                  {sections.length > 0 ? (
                    <Link
                      to={`/app/formation/work/${w.id}`}
                      className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
                    >
                      Start reading on-site ({sections.length} section
                      {sections.length === 1 ? "" : "s"}){" "}
                      <ArrowRight size={11} />
                    </Link>
                  ) : (
                    <span className="text-[10px] text-[hsl(var(--c-slate-soft))] italic">
                      On-site reader not yet transcribed
                    </span>
                  )}
                  <a
                    href={w.source.url}
                    target="_blank"
                    rel="noopener"
                    className="text-[10px] text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-wine))] truncate"
                  >
                    Full source: {w.source.label}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "Tracks" && (
        <div className="space-y-4 sm:space-y-5 collegium-safe-bottom">
          {tracksSeed.map((t) => {
            const enrolled = state.enrolledTracks.includes(t.id);
            const completedWeeks = state.trackProgress[t.id] ?? [];
            const pct =
              t.weeks.length === 0
                ? 0
                : Math.round((completedWeeks.length / t.weeks.length) * 100);
            return (
              <div key={t.id} className="collegium-card p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="collegium-display text-xl sm:text-2xl mb-1 leading-tight">{t.title}</h3>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-2">{t.blurb}</p>
                    <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {t.weeks.length} weeks · audience: {t.audience}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => demoStore.enrollTrack(t.id)}
                      disabled={enrolled}
                      className={
                        enrolled
                          ? "collegium-btn-ghost text-sm cursor-default w-full sm:w-auto"
                          : "collegium-btn-primary text-sm w-full sm:w-auto"
                      }
                    >
                      {enrolled ? "Enrolled ✓" : "Enroll"}
                    </button>
                    <Link
                      to={`/app/formation/track/${t.id}`}
                      className="collegium-btn-ghost text-xs inline-flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      Open track <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
                {enrolled && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden max-w-[260px]">
                      <div
                        className="h-full bg-[hsl(var(--c-gold))]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {completedWeeks.length} / {t.weeks.length} weeks
                    </span>
                  </div>
                )}
                <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3">
                  <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
                    Weekly arc
                  </div>
                  <ol className="text-sm text-[hsl(var(--c-slate))] space-y-1 list-decimal list-inside">
                    {t.weeks.map((wk) => {
                      const ex = libraryExcerpts.find((e) => e.id === wk.excerptId);
                      const work = libraryWorks.find((w) => w.id === ex?.workId);
                      const done = completedWeeks.includes(wk.number);
                      return (
                        <li
                          key={wk.number}
                          className={done ? "text-[hsl(145_40%_28%)]" : ""}
                        >
                          <span className="font-medium">{wk.title}</span> —{" "}
                          {work?.title} ·{" "}
                          <span className="collegium-latin text-xs">{ex?.citation}</span>
                          {done && <Check size={12} className="inline ml-1" />}
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

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white capitalize"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
