import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  chapters,
  people,
  mentorPairs,
  serviceMatters,
  type ChapterOfficer,
  type Person,
} from "../../data/demo";
import { generateBriefings } from "../../lib/nri/engine";
import { useAllEvents } from "../../lib/demoStore";

/**
 * Leadership pipeline — closes the gap between "rising leaders" copy
 * and an actual synthesis. Walks four signal sources and surfaces:
 *
 *   1. Officers with terms ending in the next 6 months and the named
 *      successor (or red flag if none).
 *   2. Thriving long-arc mentor pairs — mentees being prepared.
 *   3. Young lawyers / students who anchor service work or speak at
 *      events (vocational momentum).
 *   4. NRI succession-risk chapters that need a steward to make a
 *      decision this quarter.
 *
 * This page is mostly a synthesis layer over data the other modules
 * already track — no new data shapes.
 */

const SOON_DAYS = 180;

function daysUntil(dateIso: string | undefined): number | null {
  if (!dateIso) return null;
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

type RisingLeader = {
  person: Person;
  reasons: string[];
  score: number;
};

export function LeadershipPipeline() {
  const events = useAllEvents();
  const briefings = useMemo(
    () =>
      generateBriefings({
        chapters,
        people,
        mentorPairs,
        events,
        serviceMatters,
      }),
    [events]
  );

  const successionConcerns = briefings.filter(
    (b) => b.scope === "chapter" && b.tone === "concern"
  );
  const thrivingArcs = briefings.filter(
    (b) => b.scope === "mentor-pair" && b.tone === "celebrate"
  );

  // Officers with terms ending soon
  const transitioningOfficers = useMemo(() => {
    const rows: {
      chapterId: string;
      chapterName: string;
      officer: ChapterOfficer;
      daysLeft: number;
    }[] = [];
    for (const c of chapters) {
      for (const off of c.officers ?? []) {
        const days = daysUntil(off.termEnd);
        if (days !== null && days >= 0 && days <= SOON_DAYS) {
          rows.push({
            chapterId: c.id,
            chapterName: c.name,
            officer: off,
            daysLeft: days,
          });
        }
      }
    }
    return rows.sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  // Rising-leaders synthesis: score the early-stage people who show
  // signals of leadership.
  const risingLeaders = useMemo<RisingLeader[]>(() => {
    const out: RisingLeader[] = [];
    for (const p of people) {
      if (p.stage !== "student" && p.stage !== "young-lawyer") continue;
      const reasons: string[] = [];
      let score = 0;

      // Mentee in a thriving long-arc pair
      const thrivingPair = mentorPairs.find(
        (mp) =>
          mp.menteeId === p.id &&
          mp.status === "thriving" &&
          monthsBetween(mp.startedOn, new Date()) >= 12
      );
      if (thrivingPair) {
        score += 30;
        reasons.push(`${monthsBetween(thrivingPair.startedOn, new Date())}-mo thriving pair`);
      }

      // Named as a successor on any officer slate
      const isSuccessor = chapters.some((c) =>
        (c.officers ?? []).some((o) => o.successorId === p.id)
      );
      if (isSuccessor) {
        score += 40;
        reasons.push("Named successor");
      }

      // Speaks at events
      const speaksAt = events.filter((e) =>
        (e.speakers ?? []).some((sp) =>
          sp.name.toLowerCase().includes(p.name.split(" ").slice(-1)[0].toLowerCase())
        )
      );
      if (speaksAt.length > 0) {
        score += 12 * speaksAt.length;
        reasons.push(`Speaks at ${speaksAt.length} event${speaksAt.length === 1 ? "" : "s"}`);
      }

      // Anchors service work
      const assignedOpen = serviceMatters.filter(
        (m) => m.assignedTo === p.id && m.status !== "closed"
      ).length;
      if (assignedOpen >= 1) {
        score += 10 * assignedOpen;
        reasons.push(`${assignedOpen} open matter${assignedOpen === 1 ? "" : "s"}`);
      }

      // Has presented at a reading group / formation event
      const readingGroupLead = events.some(
        (e) =>
          e.kind === "reading-group" &&
          (e.speakers ?? []).some((sp) =>
            sp.name.toLowerCase().includes(p.name.split(" ").slice(-1)[0].toLowerCase())
          )
      );
      if (readingGroupLead) {
        score += 8;
        reasons.push("Leads reading group");
      }

      if (score > 0) out.push({ person: p, reasons, score });
    }
    return out.sort((a, b) => b.score - a.score);
  }, [events]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <Link
        to="/app/advancement"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Advancement
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <TrendingUp size={14} />
          <span className="collegium-latin text-sm">Successio</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Leadership pipeline
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Synthesis layer — terms ending soon, thriving long-arc pairs, and
          the young lawyers and students who are quietly already leading.
          Names a steward should hold in mind this quarter.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat
          label="Officers transitioning"
          value={transitioningOfficers.length}
          accent={transitioningOfficers.some((t) => !t.officer.successorId) ? "alert" : undefined}
        />
        <Stat label="Thriving long arcs" value={thrivingArcs.length} />
        <Stat label="Rising candidates" value={risingLeaders.length} />
      </div>

      {successionConcerns.length > 0 && (
        <section className="mb-8">
          <h2 className="collegium-display text-xl mb-2 inline-flex items-center gap-2">
            <AlertTriangle
              size={16}
              className="text-[hsl(8_55%_42%)]"
            />
            Succession risk this quarter
          </h2>
          <div className="space-y-2.5">
            {successionConcerns.map((b) => {
              const ch = chapters.find((c) => c.id === b.scopeId);
              return (
                <article
                  key={b.id}
                  className="collegium-card p-4 sm:p-5 border-l-4 border-[hsl(8_55%_52%)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="collegium-display text-lg leading-tight">
                      {b.title}
                    </h3>
                    {ch && (
                      <Link
                        to={`/app/chapters/${ch.slug}/handoff`}
                        className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
                      >
                        Open handoff <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">
                    {b.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="collegium-display text-xl mb-2 inline-flex items-center gap-2">
          <Calendar size={16} className="text-[hsl(var(--c-wine))]" />
          Officers transitioning in the next {SOON_DAYS} days
        </h2>
        {transitioningOfficers.length === 0 ? (
          <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
            No officer terms ending in the window.
          </p>
        ) : (
          <div className="space-y-2.5">
            {transitioningOfficers.map((row) => {
              const successor = row.officer.successorId
                ? people.find((p) => p.id === row.officer.successorId)
                : null;
              return (
                <article
                  key={`${row.chapterId}-${row.officer.name}`}
                  className="collegium-card p-4 sm:p-5"
                >
                  <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
                    <div>
                      <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                        {row.chapterName.split("—")[0].trim()}
                      </div>
                      <h3 className="collegium-display text-lg leading-tight">
                        {row.officer.name}
                      </h3>
                      <div className="text-sm text-[hsl(var(--c-slate))]">
                        {row.officer.role} ·{" "}
                        <span
                          className={
                            row.daysLeft < 60
                              ? "text-[hsl(8_55%_42%)] font-medium"
                              : "text-[hsl(var(--c-slate-soft))]"
                          }
                        >
                          {row.daysLeft === 0
                            ? "term ends today"
                            : `${row.daysLeft} days left in term`}
                        </span>
                      </div>
                      {successor ? (
                        <div className="mt-2 text-xs inline-flex items-center gap-1 text-[hsl(145_40%_28%)]">
                          <Sparkles size={11} /> Successor: {successor.name}
                          {row.officer.handoffStatus && (
                            <span className="text-[hsl(var(--c-slate-soft))]">
                              {" "}
                              · {row.officer.handoffStatus.replace(/-/g, " ")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs inline-flex items-center gap-1 text-[hsl(8_55%_42%)] font-medium">
                          <AlertTriangle size={11} /> No successor named
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/app/chapters/${chapters.find((c) => c.id === row.chapterId)?.slug}/handoff`}
                      className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
                    >
                      Handoff workspace <ArrowRight size={11} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="collegium-display text-xl mb-2 inline-flex items-center gap-2">
          <Sparkles size={16} className="text-[hsl(var(--c-gold))]" />
          Rising leaders
        </h2>
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-3">
          Students and young lawyers showing leadership signals — named
          successors, long-arc mentees, event speakers, anchored service
          matters. Scored across all four.
        </p>
        <div className="space-y-2.5">
          {risingLeaders.map((r) => (
            <RisingRow key={r.person.id} leader={r} />
          ))}
          {risingLeaders.length === 0 && (
            <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
              No rising leaders surface yet — adjust who's leading reading
              groups, speaking at events, or anchoring matters.
            </p>
          )}
        </div>
      </section>

      {thrivingArcs.length > 0 && (
        <section className="collegium-card-warm p-5 sm:p-6 collegium-safe-bottom">
          <h3 className="collegium-display text-xl mb-3 inline-flex items-center gap-2">
            <Sparkles size={16} className="text-[hsl(var(--c-gold))]" />
            Long arcs bearing fruit
          </h3>
          <div className="space-y-3">
            {thrivingArcs.map((b) => {
              const pair = mentorPairs.find((mp) => mp.id === b.scopeId);
              return (
                <div key={b.id}>
                  <div className="collegium-display text-base mb-1">{b.title}</div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-1">
                    {b.body}
                  </p>
                  {pair && (
                    <Link
                      to={`/app/mentorship/pair/${pair.id}`}
                      className="collegium-link text-xs inline-flex items-center gap-1"
                    >
                      Open pair journal <ArrowRight size={10} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function RisingRow({ leader }: { leader: RisingLeader }) {
  const { person, reasons, score } = leader;
  const chapter = chapters.find((c) => c.id === person.chapterId);
  return (
    <article className="collegium-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-gold)/0.25)] text-[hsl(var(--c-wine-deep))] flex items-center justify-center text-sm font-semibold shrink-0">
          {person.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
            <h3 className="collegium-display text-lg leading-tight">
              {person.name}
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--c-wine))]">
              Signal {score}
            </span>
          </div>
          <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">
            {person.stage.replace(/-/g, " ")} · {chapter?.name.split("—")[0].trim()}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {reasons.map((r, i) => (
              <span key={i} className="collegium-tag-soft text-[10px]">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "alert";
}) {
  return (
    <div className="collegium-card p-3 sm:p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div
        className={`collegium-display text-2xl sm:text-3xl ${
          accent === "alert"
            ? "text-[hsl(8_55%_42%)]"
            : "text-[hsl(var(--c-ink))]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function monthsBetween(iso: string, now: Date): number {
  const d = new Date(iso);
  return (
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth())
  );
}
