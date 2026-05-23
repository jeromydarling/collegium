import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ArrowRight,
  CircleDot,
  CircleDashed,
  CircleCheck,
  ListChecks,
  UserCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import { chapters, people, type ChapterOfficer } from "../../data/demo";

/**
 * Officer-handoff workspace — closes the gap between the marketing-page
 * claim ("officer handoff tools") and the actual product. Renders per-
 * officer state across a chapter's slate:
 *
 *   • Term end date + time-remaining bar (warns under 90 days)
 *   • Handoff status as a five-step ladder (no successor → shadowing →
 *     named → transition → complete)
 *   • Successor person card with mentor-pair context if applicable
 *   • Knowledge-transfer notes list with add/remove
 *
 * Lives at /app/chapters/:slug/handoff and links from ChapterDetail.
 */

const STATUS_LABEL: Record<NonNullable<ChapterOfficer["handoffStatus"]>, string> = {
  "no-successor-named": "No successor named",
  "successor-shadowing": "Successor shadowing",
  "successor-named": "Successor named",
  "transition-in-progress": "Transition in progress",
  complete: "Complete",
};

const STATUS_ORDER: NonNullable<ChapterOfficer["handoffStatus"]>[] = [
  "no-successor-named",
  "successor-shadowing",
  "successor-named",
  "transition-in-progress",
  "complete",
];

export function HandoffWorkspace() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = chapters.find((c) => c.slug === slug);

  if (!chapter) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">Chapter not found.</p>
        <Link to="/app/chapters" className="collegium-link text-xs mt-2 inline-block">
          ← Back to chapters
        </Link>
      </div>
    );
  }

  const slateNeedingAction = chapter.officers.filter(
    (o) => o.handoffStatus !== "complete" && o.termEnd
  );
  const upcomingTerms = chapter.officers
    .filter((o) => o.termEnd)
    .sort((a, b) => (a.termEnd ?? "").localeCompare(b.termEnd ?? ""));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <Link
        to={`/app/chapters/${chapter.slug}`}
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> {chapter.name.split("—")[0].trim()}
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <UserCheck size={14} />
          <span className="collegium-latin text-sm">Traditio officiorum</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Officer handoff
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          The quiet work of bringing the next slate in. Where each officer
          sits in the transition, who's shadowing whom, and what gets passed
          on the way out.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <KPI
          label="Officers"
          value={chapter.officers.length}
        />
        <KPI
          label="Term ending"
          value={slateNeedingAction.length}
          accent={slateNeedingAction.length > 0 ? "warn" : undefined}
        />
        <KPI
          label="Successors named"
          value={chapter.officers.filter((o) => o.successorId).length}
        />
        <KPI
          label="Succession index"
          value={chapter.health.succession}
          accent={chapter.health.succession >= 70 ? "good" : "warn"}
          suffix=""
        />
      </div>

      <div className="space-y-4 collegium-safe-bottom">
        {upcomingTerms.map((officer) => (
          <OfficerCard
            key={officer.role + officer.name}
            officer={officer}
            chapterSlug={chapter.slug}
          />
        ))}
        {chapter.officers
          .filter((o) => !o.termEnd)
          .map((officer) => (
            <OfficerCard
              key={officer.role + officer.name}
              officer={officer}
              chapterSlug={chapter.slug}
            />
          ))}
      </div>
    </div>
  );
}

function OfficerCard({
  officer,
  chapterSlug: _chapterSlug,
}: {
  officer: ChapterOfficer;
  chapterSlug: string;
}) {
  const successor = officer.successorId
    ? people.find((p) => p.id === officer.successorId)
    : null;
  const officerPerson = officer.personId
    ? people.find((p) => p.id === officer.personId)
    : null;

  const [notes, setNotes] = useState<string[]>(officer.handoffNotes ?? []);
  const [draftNote, setDraftNote] = useState("");

  const daysToTerm = officer.termEnd
    ? Math.round(
        (new Date(officer.termEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;
  const urgency: "ok" | "soon" | "now" =
    daysToTerm === null
      ? "ok"
      : daysToTerm < 60
      ? "now"
      : daysToTerm < 180
      ? "soon"
      : "ok";

  const status = officer.handoffStatus ?? "no-successor-named";

  function addNote() {
    if (!draftNote.trim()) return;
    setNotes((prev) => [...prev, draftNote.trim()]);
    setDraftNote("");
  }

  function removeNote(i: number) {
    setNotes((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <article
      className={`collegium-card p-5 sm:p-6 ${
        urgency === "now" ? "border-l-4 border-l-[hsl(8_55%_52%)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
              {officer.role}
            </span>
            {urgency === "now" && (
              <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)] inline-flex items-center gap-1">
                <AlertTriangle size={10} /> Term ending soon
              </span>
            )}
          </div>
          <h3 className="collegium-display text-xl sm:text-2xl leading-tight">
            {officer.name}
          </h3>
          {officerPerson && (
            <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
              {officerPerson.city} · {officerPerson.practice.slice(0, 2).join(", ")}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          {officer.termEnd ? (
            <>
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                Term ends
              </div>
              <div className="text-sm font-semibold text-[hsl(var(--c-ink))] inline-flex items-center gap-1 mt-0.5">
                <Calendar size={11} />
                {formatDate(officer.termEnd)}
              </div>
              {daysToTerm !== null && daysToTerm > 0 && (
                <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                  {daysToTerm} day{daysToTerm === 1 ? "" : "s"}
                </div>
              )}
            </>
          ) : (
            <span className="text-[11px] text-[hsl(var(--c-slate-soft))] italic">
              Indefinite term
            </span>
          )}
        </div>
      </div>

      {/* Status ladder */}
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2 font-semibold">
          Handoff progress
        </div>
        <div className="flex items-stretch gap-0.5 overflow-x-auto pb-1">
          {STATUS_ORDER.map((s, i) => {
            const currentIdx = STATUS_ORDER.indexOf(status);
            const isCurrent = i === currentIdx;
            const isPast = i < currentIdx;
            return (
              <div
                key={s}
                className={`flex-1 min-w-[6rem] px-2 py-2 text-[10px] uppercase tracking-widest font-semibold border ${
                  isCurrent
                    ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
                    : isPast
                    ? "bg-[hsl(145_30%_45%/0.08)] text-[hsl(145_40%_25%)] border-[hsl(145_30%_45%/0.30)]"
                    : "bg-white text-[hsl(var(--c-slate-soft))] border-[hsl(var(--c-border))]"
                }`}
                title={STATUS_LABEL[s]}
              >
                <div className="flex items-start gap-1.5">
                  {isCurrent ? (
                    <CircleDot size={10} className="mt-0.5 shrink-0" />
                  ) : isPast ? (
                    <CircleCheck size={10} className="mt-0.5 shrink-0" />
                  ) : (
                    <CircleDashed size={10} className="mt-0.5 shrink-0" />
                  )}
                  <span className="leading-tight">{STATUS_LABEL[s]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Successor */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5 font-semibold">
            Named successor
          </div>
          {successor ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-gold))] text-[hsl(var(--c-ink))] flex items-center justify-center text-[11px] font-semibold shrink-0">
                {successor.initials}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-[hsl(var(--c-ink))] truncate">
                  {successor.name}
                </div>
                <div className="text-[11px] text-[hsl(var(--c-slate-soft))] truncate">
                  {successor.stage} · {successor.city}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-[hsl(38_55%_28%)] italic inline-flex items-center gap-1.5">
              <AlertTriangle size={12} /> No successor named yet
            </div>
          )}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5 font-semibold">
            Status
          </div>
          <div className="text-sm text-[hsl(var(--c-ink))] font-medium">
            {STATUS_LABEL[status]}
          </div>
        </div>
      </div>

      {/* Handoff notes */}
      <div className="border-t border-[hsl(var(--c-border))] pt-4">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2 font-semibold">
          <ListChecks size={11} /> Knowledge to transfer
        </div>
        {notes.length === 0 ? (
          <p className="text-xs text-[hsl(var(--c-slate-soft))] italic mb-2">
            Nothing captured yet. The first one is usually the hardest to write.
          </p>
        ) : (
          <ul className="space-y-1.5 mb-3">
            {notes.map((n, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[hsl(var(--c-slate))] group"
              >
                <span className="text-[hsl(var(--c-gold))] mt-1 shrink-0">·</span>
                <span className="flex-1">{n}</span>
                <button
                  type="button"
                  onClick={() => removeNote(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(var(--c-slate-soft))] hover:text-[hsl(8_55%_42%)]"
                  aria-label="Remove note"
                >
                  <Trash2 size={11} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addNote();
            }}
            placeholder="One thing the next person needs to know…"
            className="flex-1 text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          />
          <button
            type="button"
            onClick={addNote}
            disabled={!draftNote.trim()}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={11} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

function KPI({
  label,
  value,
  accent,
  suffix = "",
}: {
  label: string;
  value: number;
  accent?: "good" | "warn";
  suffix?: string;
}) {
  const color =
    accent === "good"
      ? "text-[hsl(145_40%_28%)]"
      : accent === "warn"
      ? "text-[hsl(38_55%_28%)]"
      : "text-[hsl(var(--c-ink))]";
  return (
    <div className="collegium-card p-3 sm:p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div className={`collegium-display text-2xl sm:text-3xl ${color} tabular-nums leading-none`}>
        {value}
        {suffix}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
