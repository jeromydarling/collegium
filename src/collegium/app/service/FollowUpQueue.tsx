import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  Bell,
  MoonStar,
  CheckCircle2,
} from "lucide-react";
import {
  serviceMatters,
  people,
  chapters,
  type ServiceMatter,
} from "../../data/demo";
import { useDemoState, demoStore } from "../../lib/demoStore";

/**
 * Follow-up queue — closes the gap between "we'll bug you about urgent
 * matters" and the actual product. Surfaces matters that need a nudge
 * because the deadline is approaching, the urgency is high and the
 * matter is aging, or the lifecycle column has gone quiet.
 *
 * Each row supports two actions:
 *   • "Nudge sent" — records that the steward reached out (timestamp).
 *   • "Snooze" — silences for 3 or 7 days. Snoozed rows still show but
 *     dimmed; "Show snoozed" toggle hides them entirely.
 *
 * No mutation of the service matter itself — this layer sits on top of
 * the kanban as a stewardship overlay.
 */

const URGENCY_AGE_DAYS: Record<ServiceMatter["urgency"], number> = {
  urgent: 3,
  soon: 10,
  routine: 30,
};

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

type QueueReason =
  | { kind: "urgent-aging"; ageDays: number }
  | { kind: "stale-followup"; ageDays: number }
  | { kind: "unassigned-aging"; ageDays: number };

type QueueItem = {
  matter: ServiceMatter;
  reasons: QueueReason[];
  priority: number;
};

export function FollowUpQueue() {
  const state = useDemoState();
  // Stable "now" anchor per render — the queue only needs day-granularity.
  const today = new Date().toISOString().slice(0, 10);

  const items = useMemo<QueueItem[]>(() => {
    const now = new Date(today);
    const out: QueueItem[] = [];
    for (const m of serviceMatters) {
      if (m.status === "closed") continue;
      const intake = new Date(m.intakeDate);
      const ageDays = daysBetween(intake, now);
      const reasons: QueueReason[] = [];

      // Rule 1: urgent matters older than threshold
      if (m.urgency === "urgent" && ageDays >= URGENCY_AGE_DAYS.urgent) {
        reasons.push({ kind: "urgent-aging", ageDays });
      }

      // Rule 2: "follow-up" status that has been there a while
      if (m.status === "follow-up" && ageDays >= URGENCY_AGE_DAYS[m.urgency]) {
        reasons.push({ kind: "stale-followup", ageDays });
      }

      // Rule 3: new/triaged without an advocate after the urgency window
      if (
        !m.assignedTo &&
        (m.status === "new" || m.status === "triaged") &&
        ageDays >= URGENCY_AGE_DAYS[m.urgency]
      ) {
        reasons.push({ kind: "unassigned-aging", ageDays });
      }

      if (reasons.length > 0) {
        const priority =
          (m.urgency === "urgent" ? 1000 : m.urgency === "soon" ? 500 : 0) +
          ageDays +
          reasons.length * 10;
        out.push({ matter: m, reasons, priority });
      }
    }
    return out.sort((a, b) => b.priority - a.priority);
  }, [today]);

  const snoozedCount = items.filter(
    (i) => isSnoozedNow(state.followUpState[i.matter.id]?.snoozeUntil, today)
  ).length;
  const activeItems = items.filter(
    (i) => !isSnoozedNow(state.followUpState[i.matter.id]?.snoozeUntil, today)
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <Link
        to="/app/service"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Service
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Bell size={14} />
          <span className="collegium-latin text-sm">Persecutio</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Follow-up queue
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Matters the steward should touch this week. Urgent matters aging
          past three days, "follow-up" status that has stalled, and
          referrals sitting without an advocate. Snooze, nudge, or open.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Need attention" value={activeItems.length} />
        <Stat
          label="Urgent aging"
          value={
            activeItems.filter((i) =>
              i.reasons.some((r) => r.kind === "urgent-aging")
            ).length
          }
          accent="alert"
        />
        <Stat label="Snoozed" value={snoozedCount} muted />
      </div>

      {activeItems.length === 0 && (
        <div className="collegium-card p-8 text-center">
          <CheckCircle2
            size={28}
            className="mx-auto mb-3 text-[hsl(145_30%_42%)]"
          />
          <p className="collegium-display text-lg mb-1">Queue clear.</p>
          <p className="text-sm text-[hsl(var(--c-slate-soft))]">
            Every open matter is on cadence. Take five minutes.
          </p>
        </div>
      )}

      <div className="space-y-3 collegium-safe-bottom">
        {items.map((item) => (
          <QueueRow
            key={item.matter.id}
            item={item}
            followUpState={state.followUpState[item.matter.id]}
            today={today}
          />
        ))}
      </div>
    </div>
  );
}

function isSnoozedNow(snoozeUntil: string | undefined, today: string): boolean {
  if (!snoozeUntil) return false;
  return snoozeUntil > today;
}

function QueueRow({
  item,
  followUpState,
  today,
}: {
  item: QueueItem;
  followUpState: { snoozeUntil?: string; lastNudge?: string } | undefined;
  today: string;
}) {
  const { matter, reasons } = item;
  const assigned = matter.assignedTo
    ? people.find((p) => p.id === matter.assignedTo)
    : null;
  const refChapter = matter.referringChapterId
    ? chapters.find((c) => c.id === matter.referringChapterId)
    : null;
  const snoozed = isSnoozedNow(followUpState?.snoozeUntil, today);
  const lastNudge = followUpState?.lastNudge;
  const lastNudgeAge = lastNudge
    ? Math.max(0, daysBetween(new Date(lastNudge), new Date()))
    : null;

  return (
    <article
      className={`collegium-card p-4 sm:p-5 ${
        snoozed ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {reasons.map((r) => (
          <ReasonBadge key={r.kind} reason={r} urgency={matter.urgency} />
        ))}
        {snoozed && (
          <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(220_10%_92%)] text-[hsl(var(--c-slate))] inline-flex items-center gap-1">
            <MoonStar size={10} /> Snoozed until{" "}
            {followUpState?.snoozeUntil?.slice(5, 10)}
          </span>
        )}
        <span className="text-[10px] text-[hsl(var(--c-slate-soft))] ml-auto">
          {matter.status.replace(/-/g, " ")}
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-start">
        <div className="min-w-0">
          <h3 className="collegium-display text-lg leading-tight mb-0.5">
            {matter.requester}
          </h3>
          <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-1.5">
            {matter.category.replace(/-/g, " ")} · {matter.region}
            {assigned && (
              <span className="text-[hsl(var(--c-wine))]">
                {" "}
                · → {assigned.name}
              </span>
            )}
            {!assigned && (
              <span className="text-[hsl(8_55%_42%)] font-medium">
                {" "}
                · unassigned
              </span>
            )}
          </div>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-snug line-clamp-2 mb-1.5">
            {matter.summary}
          </p>
          {refChapter && (
            <div className="text-[11px] text-[hsl(var(--c-wine))]">
              Referred · {matter.referredBy || refChapter.name}
            </div>
          )}
          {lastNudgeAge !== null && (
            <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1 inline-flex items-center gap-1">
              <Clock size={10} /> Last nudge{" "}
              {lastNudgeAge === 0
                ? "today"
                : lastNudgeAge === 1
                ? "yesterday"
                : `${lastNudgeAge} days ago`}
            </div>
          )}
        </div>

        <div className="flex sm:flex-col flex-wrap gap-1.5 shrink-0 sm:items-end">
          <button
            type="button"
            onClick={() => demoStore.recordFollowUpNudge(matter.id)}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            <Bell size={11} /> Nudge sent
          </button>
          <button
            type="button"
            onClick={() => demoStore.snoozeMatterFollowUp(matter.id, 3)}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            <MoonStar size={11} /> Snooze 3d
          </button>
          <button
            type="button"
            onClick={() => demoStore.snoozeMatterFollowUp(matter.id, 7)}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            <MoonStar size={11} /> Snooze 7d
          </button>
        </div>
      </div>
    </article>
  );
}

function ReasonBadge({
  reason,
  urgency,
}: {
  reason: QueueReason;
  urgency: ServiceMatter["urgency"];
}) {
  if (reason.kind === "urgent-aging") {
    return (
      <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)] inline-flex items-center gap-1">
        <AlertTriangle size={10} /> Urgent · {reason.ageDays}d
      </span>
    );
  }
  if (reason.kind === "stale-followup") {
    return (
      <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(38_55%_50%/0.16)] text-[hsl(38_55%_28%)]">
        Stalled · {reason.ageDays}d
      </span>
    );
  }
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
        urgency === "urgent"
          ? "bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]"
          : "bg-[hsl(var(--c-wine)/0.1)] text-[hsl(var(--c-wine))]"
      }`}
    >
      Unassigned · {reason.ageDays}d
    </span>
  );
}

function Stat({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: number;
  accent?: "alert";
  muted?: boolean;
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
            : muted
            ? "text-[hsl(var(--c-slate-soft))]"
            : "text-[hsl(var(--c-ink))]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

