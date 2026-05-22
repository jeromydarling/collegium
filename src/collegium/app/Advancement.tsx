import { events, chapters } from "../data/demo";
import { demoStore, useDemoState } from "../lib/demoStore";
import { Calendar, MapPin } from "lucide-react";

export function Advancement() {
  const state = useDemoState();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const future = sorted.filter((e) => new Date(e.date) >= new Date());

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Provectio</div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Advancement</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          Conferences, Red Masses, formation days, CLE-quality gatherings, and
          the slow shaping of the next generation of officers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
        <Stat label="Upcoming events" value={future.length} />
        <Stat label="Total RSVPs" value={future.reduce((sum, e) => sum + e.rsvpCount, 0)} />
        <Stat label="Red Masses" value={events.filter((e) => e.kind === "red-mass").length} />
        <Stat label="Service clinics" value={events.filter((e) => e.kind === "service-clinic").length} />
      </div>

      <div className="space-y-4 collegium-safe-bottom">
        {future.map((e) => {
          const ch = chapters.find((c) => c.id === e.chapterId);
          const rsvped = state.rsvps.includes(e.id);
          const fill = (e.rsvpCount / e.capacity) * 100;
          const dt = new Date(e.date);
          return (
            <article key={e.id} className="collegium-card p-5 sm:p-6">
              <div className="grid md:grid-cols-[8rem_1fr_auto] gap-4 sm:gap-5 items-start">
                {/* Mobile date strip; desktop centered column. */}
                <div className="flex md:block items-baseline gap-3 md:gap-0 md:text-center">
                  <div className="collegium-display text-3xl text-[hsl(var(--c-wine))] leading-none">
                    {dt.toLocaleDateString("en-US", { day: "numeric" })}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                    {dt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] md:mt-1">{e.time}</div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <KindTag kind={e.kind} />
                    <span className="text-xs text-[hsl(var(--c-slate-soft))]">{ch?.name}</span>
                  </div>
                  <h3 className="collegium-display text-xl mb-1 leading-tight">{e.title}</h3>
                  <div className="text-sm text-[hsl(var(--c-slate-soft))] flex items-start gap-1 mb-2">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span>{e.location}</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{e.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-[hsl(var(--c-slate-soft))] shrink-0">
                      {e.rsvpCount} / {e.capacity}
                    </span>
                    <div className="flex-1 h-1 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className="h-full bg-[hsl(var(--c-gold))]"
                        style={{ width: `${Math.min(100, fill)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-32 flex md:flex-col gap-2">
                  <button
                    onClick={() => demoStore.toggleRsvp(e.id)}
                    className={
                      rsvped
                        ? "collegium-btn-ghost text-sm flex-1 justify-center"
                        : "collegium-btn-primary text-sm flex-1 justify-center"
                    }
                  >
                    {rsvped ? "RSVP'd ✓" : "RSVP"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="collegium-card p-4">
      <div className="text-xs uppercase tracking-wider text-[hsl(var(--c-slate-soft))] mb-1">{label}</div>
      <div className="collegium-display text-3xl text-[hsl(var(--c-ink))]">{value}</div>
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
  return <span className="collegium-tag">{labels[kind] || kind}</span>;
}
