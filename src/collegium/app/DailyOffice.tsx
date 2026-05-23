import {
  devotionalForDate as weekRhythmForDate,
  weekdayRhythm,
  type Weekday,
} from "../content/weekRhythm";
import { devotionalForDate, dayOfYear } from "../content/devotional";
import { Sun, ChevronLeft, ChevronRight, BookOpen, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function DailyOffice() {
  const [date, setDate] = useState(() => new Date());
  const entry = weekRhythmForDate(date);
  // 365-day "Lawyer's Year" entry (null if today is not yet seeded)
  const yearEntry = devotionalForDate(date);
  const todayDay = dayOfYear(date);

  function shift(days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    setDate(next);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-[hsl(var(--c-wine))] mb-3">
          <Sun size={16} />
          <span className="collegium-latin text-sm tracking-wider">
            Officium quotidianum · The Daily Office
          </span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl mb-2">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm text-[hsl(var(--c-slate-soft))]">
          <button onClick={() => shift(-1)} className="hover:text-[hsl(var(--c-wine))] inline-flex items-center gap-1">
            <ChevronLeft size={14} /> Previous
          </button>
          <button onClick={() => setDate(new Date())} className="hover:text-[hsl(var(--c-wine))] underline">
            Today
          </button>
          <button onClick={() => shift(1)} className="hover:text-[hsl(var(--c-wine))] inline-flex items-center gap-1">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {yearEntry && (
        <Link
          to={`/app/devotional/day/${yearEntry.day}`}
          className="collegium-card p-4 mb-6 flex items-center gap-3 bg-[hsl(var(--c-cream-warm))] hover:shadow-md transition-shadow group"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center shrink-0">
            <BookOpen size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))]">
              The Lawyer's Year · Day {yearEntry.day} · {yearEntry.weekArc}
            </div>
            <div className="collegium-display text-base leading-tight truncate">
              {yearEntry.title}
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-[hsl(var(--c-wine))] group-hover:translate-x-0.5 transition-transform shrink-0"
          />
        </Link>
      )}
      {!yearEntry && (
        <Link
          to="/app/devotional"
          className="collegium-card p-4 mb-6 flex items-center gap-3 bg-[hsl(var(--c-cream-warm))] hover:shadow-md transition-shadow group"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center shrink-0">
            <BookOpen size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))]">
              The Lawyer's Year
            </div>
            <div className="collegium-display text-base leading-tight">
              Browse the 365-day devotional
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-[hsl(var(--c-wine))] group-hover:translate-x-0.5 transition-transform shrink-0"
          />
        </Link>
      )}
      <div className="hidden">{todayDay}</div>

      <article className="collegium-card p-5 sm:p-8 md:p-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="collegium-latin text-base text-[hsl(var(--c-wine))] mb-1">{entry.latin}</div>
          <h2 className="collegium-display text-2xl sm:text-3xl mb-3">{entry.theme}</h2>
          <p className="text-sm italic text-[hsl(var(--c-slate-soft))]">— {entry.movement}</p>
        </div>

        <hr className="collegium-gold-rule mb-6 sm:mb-8" />

        <section className="mb-6 sm:mb-8">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3">
            Lectio · Reading
          </div>
          <blockquote className="collegium-quote text-lg sm:text-xl mb-3">"{entry.excerpt}"</blockquote>
          <div className="text-xs text-[hsl(var(--c-slate-soft))] italic">{entry.citation}</div>
        </section>

        <section className="mb-6 sm:mb-8">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3">
            Meditatio · Reflection
          </div>
          <div className="collegium-prose">
            <p>{entry.reflection}</p>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-[hsl(var(--c-cream-warm))] -mx-5 sm:-mx-8 md:-mx-10 px-5 sm:px-8 md:px-10 py-5 sm:py-6">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
            Oratio · Prayer
          </div>
          <p className="text-[hsl(var(--c-ink))] leading-relaxed italic">{entry.prayer}</p>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3">
            Actio · Today's prompt
          </div>
          <p className="collegium-display text-lg text-[hsl(var(--c-ink))] leading-snug">
            {entry.prompt}
          </p>
        </section>
      </article>

      <div className="mt-8 sm:mt-10 collegium-card-warm p-5 sm:p-6 collegium-safe-bottom">
        <h3 className="collegium-display text-lg mb-2">The week's rhythm</h3>
        <p className="text-sm text-[hsl(var(--c-slate))] mb-4">
          Each weekday carries its own emphasis. Together they form a rule of
          life modest enough to keep and serious enough to change you.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {(Object.keys(weekdayRhythm) as Weekday[]).map((wd) => (
            <div
              key={wd}
              className={`flex items-baseline justify-between gap-2 px-3 py-1.5 rounded ${
                wd === entry.weekday ? "bg-[hsl(var(--c-wine)/0.06)]" : ""
              }`}
            >
              <div>
                <span className="capitalize font-medium">{wd}</span>
                <span className="collegium-latin text-xs ml-2 text-[hsl(var(--c-wine))]">
                  {weekdayRhythm[wd].latin}
                </span>
              </div>
              <span className="text-xs text-[hsl(var(--c-slate-soft))] text-right">
                {weekdayRhythm[wd].theme}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
