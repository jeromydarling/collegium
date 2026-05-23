import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  Check,
  Circle,
  Quote,
  Clock,
  ListChecks,
  Users,
} from "lucide-react";
import { tracksSeed, libraryExcerpts, libraryWorks } from "../../content/library";
import { useDemoState, demoStore } from "../../lib/demoStore";

/**
 * Track runner — closes the gap between "multi-week formation tracks"
 * and an actual week-by-week UI. Renders the curriculum in order:
 *
 *   • Excerpt + paraphrase (the reading)
 *   • Estimated minutes
 *   • Discussion prompts (the meat — what the facilitator opens with)
 *   • Optional supplement
 *   • Mark-complete toggle (persists via demoStore.toggleWeekComplete)
 *
 * Plus a facilitator-notes block at the bottom for whoever is running
 * the group.
 *
 * Lives at /app/formation/track/:id.
 */

export function TrackRunner() {
  const { id } = useParams<{ id: string }>();
  const track = tracksSeed.find((t) => t.id === id);
  const state = useDemoState();

  const completed = useMemo(() => {
    if (!id) return new Set<number>();
    return new Set(state.trackProgress[id] ?? []);
  }, [state.trackProgress, id]);

  if (!track) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <Link
          to="/app/formation"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Formation
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That formation track was not found.
        </p>
      </div>
    );
  }

  const enrolled = state.enrolledTracks.includes(track.id);
  const pct = track.weeks.length === 0
    ? 0
    : Math.round((completed.size / track.weeks.length) * 100);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-4xl mx-auto">
      <Link
        to="/app/formation"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Formation
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <BookOpen size={14} />
          <span className="collegium-latin text-sm">Eruditio</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight mb-1">
          {track.title}
        </h1>
        <p className="text-[hsl(var(--c-slate))] mt-1 max-w-2xl">{track.blurb}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="text-xs text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
            <Users size={12} /> Audience: {track.audience}
          </span>
          <span className="text-xs text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
            <ListChecks size={12} /> {track.weeks.length} weeks
          </span>
          {!enrolled ? (
            <button
              type="button"
              onClick={() => demoStore.enrollTrack(track.id)}
              className="collegium-btn-primary text-xs"
            >
              Enroll
            </button>
          ) : (
            <span className="text-xs text-[hsl(145_40%_28%)] font-medium">
              Enrolled ✓
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden max-w-[300px]">
            <div
              className="h-full bg-[hsl(var(--c-gold))]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-[hsl(var(--c-slate-soft))]">
            {completed.size} of {track.weeks.length} complete · {pct}%
          </span>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 collegium-safe-bottom mb-8">
        {track.weeks.map((week) => {
          const ex = libraryExcerpts.find((e) => e.id === week.excerptId);
          const work = libraryWorks.find((w) => w.id === ex?.workId);
          const done = completed.has(week.number);
          return (
            <article
              key={week.number}
              className={`collegium-card p-4 sm:p-5 ${
                done ? "bg-[hsl(var(--c-cream-warm))]" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      done
                        ? "bg-[hsl(145_30%_42%)] text-white"
                        : "bg-[hsl(var(--c-wine)/0.1)] text-[hsl(var(--c-wine))]"
                    }`}
                  >
                    {done ? <Check size={16} /> : week.number}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                      Week {week.number}
                    </div>
                    <h2 className="collegium-display text-xl leading-tight">
                      {week.title}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    demoStore.toggleWeekComplete(track.id, week.number)
                  }
                  className={
                    done
                      ? "collegium-btn-ghost text-xs inline-flex items-center gap-1"
                      : "collegium-btn-primary text-xs inline-flex items-center gap-1"
                  }
                >
                  {done ? (
                    <>
                      <Circle size={11} /> Mark incomplete
                    </>
                  ) : (
                    <>
                      <Check size={11} /> Mark complete
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1 mb-3">
                <Clock size={11} /> ~{week.estimateMinutes} min · {work?.title}
                {ex?.citation && (
                  <span className="collegium-latin text-[hsl(var(--c-wine))]">
                    · {ex.citation}
                  </span>
                )}
              </div>

              {ex && (
                <blockquote className="collegium-quote text-sm my-3">
                  "{ex.text}"
                </blockquote>
              )}
              {ex?.paraphrase && (
                <p className="text-sm text-[hsl(var(--c-slate))] italic mb-3">
                  {ex.paraphrase}
                </p>
              )}

              <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3">
                <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
                  Discussion prompts
                </div>
                <ul className="space-y-2">
                  {week.prompts.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[hsl(var(--c-slate))] leading-snug"
                    >
                      <Quote
                        size={12}
                        className="text-[hsl(var(--c-gold))] mt-1 shrink-0"
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {week.supplement && (
                  <p className="text-xs text-[hsl(var(--c-slate-soft))] italic mt-3">
                    Supplement: {week.supplement}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <section className="collegium-card-warm p-5 sm:p-6 collegium-safe-bottom">
        <h3 className="collegium-display text-xl mb-3">Facilitator notes</h3>
        <ul className="space-y-2">
          {track.facilitatorNotes.map((n, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[hsl(var(--c-slate))] leading-relaxed"
            >
              <span className="text-[hsl(var(--c-wine))] font-bold mt-0.5">·</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
