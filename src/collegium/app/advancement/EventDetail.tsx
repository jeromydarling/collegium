import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Mic,
  Users,
  Check,
  Circle,
  Pencil,
} from "lucide-react";
import { chapters, people, type Person } from "../../data/demo";
import { useDemoState, demoStore, useEvent } from "../../lib/demoStore";

/**
 * Event detail — closes the gap between "speaker records" + "attendance
 * tracking" in marketing copy and an actual view. Shows:
 *
 *   • Header: title, kind, date/time, location, chapter
 *   • Speakers list (role + affiliation)
 *   • Attendance checklist over chapter membership — toggle present/
 *     absent per person; updates demoStore.eventAttendance
 *   • Show rate (% of RSVPs that actually attended)
 *
 * Lives at /app/advancement/event/:id.
 */

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = useEvent(id);
  const state = useDemoState();

  // Compute the attended set unconditionally (hooks must run in stable order).
  // If event is missing we'll bail out below.
  const attendedSet = useMemo(() => {
    if (!event) return new Set<string>();
    const override = state.eventAttendance[event.id];
    // Once the user has interacted, the override is authoritative.
    if (override && override.length > 0) {
      return new Set(override);
    }
    return new Set<string>(event.attendedBy ?? []);
  }, [event, state.eventAttendance]);

  if (!event) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <Link
          to="/app/advancement"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Advancement
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That event was not found.
        </p>
      </div>
    );
  }

  const chapter = chapters.find((c) => c.id === event.chapterId);
  const chapterMembers = people.filter((p) => p.chapterId === event.chapterId);
  const isPast = new Date(event.date) < new Date();

  const showRate =
    event.rsvpCount > 0
      ? Math.round((attendedSet.size / event.rsvpCount) * 100)
      : null;

  const dt = new Date(event.date);
  const dateStr = dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-4xl mx-auto">
      <Link
        to="/app/advancement"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Advancement
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3 mb-2">
          <KindTag kind={event.kind} />
          <Link
            to={`/app/advancement/event/${event.id}/edit`}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
          >
            <Pencil size={11} /> Edit
          </Link>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight mb-2">
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[hsl(var(--c-slate-soft))]">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> {dateStr} · {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {event.location}
          </span>
          {chapter && <span>· {chapter.name.split("—")[0].trim()}</span>}
        </div>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mt-3 max-w-3xl">
          {event.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="RSVPs" value={event.rsvpCount} sub={`of ${event.capacity}`} />
        <Stat
          label={isPast ? "Attended" : "Will attend"}
          value={attendedSet.size}
          sub={
            showRate !== null && isPast
              ? `${showRate}% show rate`
              : undefined
          }
        />
        <Stat label="Speakers" value={(event.speakers ?? []).length} />
      </div>

      {event.speakers && event.speakers.length > 0 && (
        <section className="mb-8">
          <h2 className="collegium-display text-xl mb-3 inline-flex items-center gap-2">
            <Mic size={16} className="text-[hsl(var(--c-wine))]" />
            Speakers
          </h2>
          <div className="space-y-2.5">
            {event.speakers.map((sp, i) => (
              <article key={i} className="collegium-card p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-3 mb-0.5">
                  <h3 className="collegium-display text-lg leading-tight">
                    {sp.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                    {sp.role}
                  </span>
                </div>
                {sp.affiliation && (
                  <div className="text-sm text-[hsl(var(--c-slate-soft))]">
                    {sp.affiliation}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="collegium-safe-bottom">
        <h2 className="collegium-display text-xl mb-2 inline-flex items-center gap-2">
          <Users size={16} className="text-[hsl(var(--c-wine))]" />
          Attendance
        </h2>
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-3">
          {isPast
            ? "Tap each member to record who was actually present."
            : "Mark attendance as members arrive. Show rate updates live."}
        </p>
        {chapterMembers.length === 0 ? (
          <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
            No chapter members listed.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {chapterMembers.map((member) => (
              <AttendanceRow
                key={member.id}
                person={member}
                attended={attendedSet.has(member.id)}
                onToggle={() =>
                  demoStore.togglePersonAttendance(event.id, member.id)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AttendanceRow({
  person,
  attended,
  onToggle,
}: {
  person: Person;
  attended: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-left collegium-card p-3 transition-colors ${
        attended
          ? "bg-[hsl(145_30%_42%/0.08)] border border-[hsl(145_30%_42%/0.35)]"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
            attended
              ? "bg-[hsl(145_30%_42%)] text-white"
              : "bg-[hsl(var(--c-wine)/0.1)] text-[hsl(var(--c-wine))]"
          }`}
        >
          {attended ? <Check size={14} /> : person.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[hsl(var(--c-ink))] truncate">
            {person.name}
          </div>
          <div className="text-[11px] text-[hsl(var(--c-slate-soft))] capitalize">
            {person.stage.replace(/-/g, " ")}
          </div>
        </div>
        {attended ? (
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(145_40%_28%)] shrink-0">
            Present
          </span>
        ) : (
          <Circle size={14} className="text-[hsl(var(--c-slate-soft))] shrink-0" />
        )}
      </div>
    </button>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="collegium-card p-3 sm:p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div className="collegium-display text-2xl sm:text-3xl text-[hsl(var(--c-ink))]">
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}

function KindTag({ kind }: { kind: string }) {
  const labels: Record<string, string> = {
    "red-mass": "Red Mass",
    luncheon: "Luncheon",
    cle: "CLE",
    "service-clinic": "Service clinic",
    "reading-group": "Reading group",
    retreat: "Retreat",
    conference: "Conference",
  };
  return (
    <span className="collegium-tag inline-block">
      {labels[kind] || kind}
    </span>
  );
}
