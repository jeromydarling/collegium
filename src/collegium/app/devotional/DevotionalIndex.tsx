import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sun, ArrowRight, Calendar, FileDown } from "lucide-react";
import {
  devotionalDays,
  dayOfYear,
} from "../../content/devotional";
import { weekArcs } from "../../content/devotional/types";
import { downloadManuscript } from "../../lib/devotionalManuscript";

/**
 * Devotional index — the year laid out by week. Each weekly arc is one
 * row showing the seven daily entries (or "coming soon" placeholders
 * for weeks not yet seeded). Today's entry is highlighted.
 *
 * Lives at /app/devotional.
 */

export function DevotionalIndex() {
  const today = useMemo(() => dayOfYear(new Date()), []);

  const byWeek = useMemo(() => {
    const m = new Map<number, typeof devotionalDays>();
    for (const e of devotionalDays) {
      const arr = m.get(e.weekNumber) ?? [];
      arr.push(e);
      m.set(e.weekNumber, arr);
    }
    return m;
  }, []);

  const totalSeeded = devotionalDays.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <BookOpen size={14} />
          <span className="collegium-latin text-sm">Annus Advocati</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          The Lawyer's Year
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          A 365-day devotional for Christian and Catholic lawyers — Scripture
          paired with a passage from the legal-spiritual canon and a
          meditation on practice. Ten minutes a day across a year.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/app/devotional/today"
            className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
          >
            <Sun size={14} /> Today's reading <ArrowRight size={12} />
          </Link>
          <Link
            to="/app/devotional/field-guide"
            className="collegium-btn-ghost text-sm inline-flex items-center gap-1.5"
          >
            <BookOpen size={14} /> The Field Guide pocketbook
          </Link>
          <button
            type="button"
            onClick={() => downloadManuscript({ kind: "heirloom-year" })}
            className="collegium-btn-ghost text-sm inline-flex items-center gap-1.5"
            title="Download the full devotional as a Markdown manuscript for Lulu/Vellum/InDesign typesetting"
          >
            <FileDown size={14} /> Download manuscript (.md)
          </button>
          <span className="text-xs text-[hsl(var(--c-slate-soft))]">
            {totalSeeded} of 365 entries seeded
          </span>
        </div>
      </div>

      <div className="space-y-4 collegium-safe-bottom">
        {weekArcs.map((arc) => {
          const entries = byWeek.get(arc.weekNumber) ?? [];
          const hasContent = entries.length > 0;
          return (
            <article
              key={arc.weekNumber}
              className={`collegium-card p-4 sm:p-5 ${
                hasContent ? "" : "opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                    Week {arc.weekNumber}
                  </div>
                  <h2 className="collegium-display text-xl leading-tight">
                    {arc.arc}
                  </h2>
                  <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
                    {arc.arcLatin}
                  </div>
                </div>
                {hasContent && (
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(145_40%_28%)]">
                    {entries.length} of 7 ready
                  </span>
                )}
              </div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-snug mb-3">
                {arc.blurb}
              </p>
              {hasContent ? (
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {entries.map((e) => {
                    const isToday = e.day === today;
                    return (
                      <Link
                        key={e.day}
                        to={`/app/devotional/day/${e.day}`}
                        className={`flex items-baseline gap-2 text-sm px-2.5 py-1.5 rounded border transition-colors ${
                          isToday
                            ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
                            : "border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-mono shrink-0 ${
                            isToday
                              ? "text-[hsl(var(--c-gold))]"
                              : "text-[hsl(var(--c-slate-soft))]"
                          }`}
                        >
                          {e.date}
                        </span>
                        <span className="truncate">{e.title}</span>
                        {isToday && (
                          <span className="text-[9px] uppercase tracking-widest font-semibold text-[hsl(var(--c-gold))] ml-auto shrink-0">
                            Today
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-[hsl(var(--c-slate-soft))] italic inline-flex items-center gap-1">
                  <Calendar size={11} /> Coming soon
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
