import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Quote,
  Heart,
  HelpCircle,
  Printer,
  Sun,
} from "lucide-react";
import {
  devotionalDays,
  devotionalByDay,
  devotionalForDate,
  dayOfYear,
} from "../../content/devotional";
import { libraryWorks } from "../../content/library";
import { exportDevotionalDayPdf } from "../../lib/devotionalPdf";

/**
 * Single-day devotional view — Scripture + Excerpt + Meditation + Prayer
 * + Prompt + print-to-PDF. Used at /app/devotional/day/:n and (via
 * today-resolution) at /app/devotional/today.
 */

export function DevotionalDayView({ today }: { today?: boolean }) {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();

  const entry = useMemo(() => {
    if (today) return devotionalForDate(new Date());
    if (!day) return null;
    return devotionalByDay(Number(day)) ?? null;
  }, [day, today]);

  if (!entry) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <Link
          to="/app/devotional"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> The Lawyer's Year
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That day's entry is not yet ready.
        </p>
      </div>
    );
  }

  const work = entry.excerpt.workId
    ? libraryWorks.find((w) => w.id === entry.excerpt.workId)
    : null;
  const todayDay = dayOfYear(new Date());
  const isActuallyToday = entry.day === todayDay;

  // Prev / next navigation among seeded days
  const sortedDays = [...devotionalDays].sort((a, b) => a.day - b.day);
  const idx = sortedDays.findIndex((d) => d.day === entry.day);
  const prev = idx > 0 ? sortedDays[idx - 1] : null;
  const next = idx >= 0 && idx < sortedDays.length - 1 ? sortedDays[idx + 1] : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-3xl mx-auto">
      <Link
        to="/app/devotional"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> The Lawyer's Year
      </Link>

      <header className="mb-6 sm:mb-8 pb-5 border-b border-[hsl(var(--c-border))]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
            Day {entry.day} · Week {entry.weekNumber} · {entry.weekArc}
            <span className="collegium-latin ml-1 text-[hsl(var(--c-wine))]">
              {entry.weekArcLatin}
            </span>
          </div>
          {isActuallyToday && (
            <span className="text-[10px] uppercase tracking-widest font-semibold inline-flex items-center gap-1 text-[hsl(var(--c-gold))]">
              <Sun size={11} /> Today
            </span>
          )}
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          {entry.title}
        </h1>
        <button
          type="button"
          onClick={() => exportDevotionalDayPdf(entry)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1 mt-3"
        >
          <Printer size={12} /> Print this entry
        </button>
      </header>

      <section className="mb-6 collegium-card-warm p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
          <BookOpen size={11} /> Scripture
          <span className="text-[hsl(var(--c-slate-soft))] normal-case font-normal tracking-normal">
            · {entry.scripture.reference} (Douay-Rheims)
          </span>
        </div>
        <p className="text-base sm:text-lg text-[hsl(var(--c-ink))] leading-relaxed font-serif whitespace-pre-wrap">
          {entry.scripture.text}
        </p>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
          <Quote size={11} /> From the canon
          <span className="text-[hsl(var(--c-slate-soft))] normal-case font-normal tracking-normal">
            · {entry.excerpt.author} · {entry.excerpt.citation}
          </span>
        </div>
        <blockquote className="collegium-quote whitespace-pre-wrap">
          {entry.excerpt.text}
        </blockquote>
        {work && (
          <Link
            to={`/app/formation/work/${work.id}`}
            className="collegium-link text-xs inline-flex items-center gap-1 mt-2"
          >
            Read in context <ChevronRight size={12} />
          </Link>
        )}
      </section>

      <section className="mb-6">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
          Meditation
        </div>
        <div className="text-base text-[hsl(var(--c-slate))] leading-relaxed font-serif space-y-4">
          {entry.meditation.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="mb-6 collegium-card-warm p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
          <Heart size={11} /> Prayer
        </div>
        <p className="text-base text-[hsl(var(--c-ink))] leading-relaxed font-serif italic">
          {entry.prayer}
        </p>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
          <HelpCircle size={11} /> To sit with
        </div>
        <p className="text-base text-[hsl(var(--c-slate))] leading-relaxed">
          {entry.prompt}
        </p>
      </section>

      <nav className="flex items-center justify-between border-t border-[hsl(var(--c-border))] pt-5 collegium-safe-bottom">
        {prev ? (
          <button
            type="button"
            onClick={() => navigate(`/app/devotional/day/${prev.day}`)}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Day {prev.day}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => navigate(`/app/devotional/day/${next.day}`)}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            Day {next.day} <ChevronRight size={12} />
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
