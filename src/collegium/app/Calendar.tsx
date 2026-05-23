import { christianYear, observances, seasonForMonth } from "../content/calendar";
import { chapters } from "../data/demo";
import { useAllEvents } from "../lib/demoStore";

export function CalendarPage() {
  const today = new Date();
  const currentSeason = seasonForMonth(today.getMonth() + 1);
  const events = useAllEvents();
  const upcoming = [...events]
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Sort observances by date string (MM-DD). Simple display sort.
  const sortedObservances = [...observances]
    .filter((o) => /^\d{2}-\d{2}$/.test(o.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Calendarium</div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Calendar</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          An ecumenical legal-liturgical year. The shared Christian seasons in
          plain language; saints and civic observances in their own register;
          chapter events woven through.
        </p>
      </div>

      <div className="collegium-card p-5 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))]">
        <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
          Current season
        </div>
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="collegium-display text-3xl">{currentSeason.name}</h2>
          <span className="collegium-latin text-base">{currentSeason.latin}</span>
        </div>
        <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-3">{currentSeason.blurb}</p>
        <div className="flex flex-wrap gap-2">
          {currentSeason.themes.map((t) => (
            <span key={t} className="collegium-tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 collegium-safe-bottom">
        <div className="collegium-card p-5 sm:p-6">
          <h3 className="collegium-display text-xl mb-4">The Christian year</h3>
          <ul className="space-y-3">
            {christianYear.map((s) => (
              <li
                key={s.key}
                className={`border-l-2 pl-3 py-0.5 ${
                  s.key === currentSeason.key ? "border-[hsl(var(--c-wine))]" : "border-[hsl(var(--c-gold)/0.4)]"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="text-[10px] text-[hsl(var(--c-slate-soft))]">{s.approxRange}</span>
                </div>
                <div className="collegium-latin text-xs">{s.latin}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="collegium-card p-5 sm:p-6">
          <h3 className="collegium-display text-xl mb-4">Saints &amp; observances</h3>
          <ul className="space-y-3">
            {sortedObservances.map((o) => (
              <li key={o.key} className="border-l-2 border-[hsl(var(--c-wine)/0.3)] pl-3 py-0.5">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="font-medium text-sm leading-snug">{o.name}</span>
                  <span className="text-[10px] text-[hsl(var(--c-slate-soft))] shrink-0">{o.date}</span>
                </div>
                <p className="text-xs text-[hsl(var(--c-slate))] leading-snug">{o.blurb}</p>
              </li>
            ))}
            {observances.filter((o) => !/^\d{2}-\d{2}$/.test(o.date)).map((o) => (
              <li key={o.key} className="border-l-2 border-[hsl(var(--c-wine)/0.3)] pl-3 py-0.5">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="font-medium text-sm leading-snug">{o.name}</span>
                  <span className="text-[10px] text-[hsl(var(--c-slate-soft))] shrink-0 italic">{o.date}</span>
                </div>
                <p className="text-xs text-[hsl(var(--c-slate))] leading-snug">{o.blurb}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="collegium-card p-5 sm:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="collegium-display text-xl mb-4">Upcoming chapter events</h3>
          <ul className="space-y-3">
            {upcoming.map((e) => {
              const ch = chapters.find((c) => c.id === e.chapterId);
              return (
                <li key={e.id} className="border-l-2 border-[hsl(var(--c-gold))] pl-3 py-0.5">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <span className="font-medium text-sm leading-snug">{e.title}</span>
                    <span className="text-[10px] text-[hsl(var(--c-slate-soft))] shrink-0">
                      {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--c-slate))] leading-snug">{ch?.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
