import { mentorPairs, people, chapters } from "../data/demo";

export function Mentorship() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Tirocinium</div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Mentorship</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          Active pairings across the network. NRI tone reflects what the
          relationship needs this month.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
        <Stat label="Active pairs" value={mentorPairs.length} />
        <Stat label="Thriving" value={mentorPairs.filter((p) => p.status === "thriving").length} />
        <Stat label="Steady" value={mentorPairs.filter((p) => p.status === "steady").length} />
        <Stat label="Drifting" value={mentorPairs.filter((p) => p.status === "drifting").length} accent="warn" />
      </div>

      <div className="space-y-4">
        {mentorPairs.map((pair) => {
          const mentor = people.find((p) => p.id === pair.mentorId)!;
          const mentee = people.find((p) => p.id === pair.menteeId)!;
          const chapter = chapters.find((c) => c.id === mentor.chapterId);
          const monthsActive = monthsSince(pair.startedOn);

          return (
            <div key={pair.id} className="collegium-card p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-5">
                <div className="flex items-center gap-3 md:w-1/3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.12)] flex items-center justify-center text-sm font-medium text-[hsl(var(--c-wine))] border-2 border-white">
                      {mentor.initials}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-gold)/0.25)] flex items-center justify-center text-sm font-medium text-[hsl(var(--c-wine-deep))] border-2 border-white">
                      {mentee.initials}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[hsl(var(--c-ink))]">
                      {mentor.name.split(" ").slice(-1)[0]} & {mentee.name.split(" ").slice(-1)[0]}
                    </div>
                    <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {chapter?.name}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusTag status={pair.status} />
                    <span className="collegium-tag-soft">{pair.cadence}</span>
                    <span className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {monthsActive} months · started {new Date(pair.startedOn).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                    {pair.notes}
                  </p>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                    Last meeting:{" "}
                    {pair.lastMeeting
                      ? new Date(pair.lastMeeting).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10 collegium-card-warm p-5 sm:p-6 collegium-safe-bottom">
        <h3 className="collegium-display text-xl mb-2">How NRI reads these</h3>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed max-w-3xl">
          "Drifting" is not failure. Two missed meetings during bar prep is
          overload; two missed meetings in October is something different. NRI
          looks at the season around the silence before it suggests anything.
          On the dashboard, Maria Velasquez's drift surfaces with a one-line
          suggestion — and a request that the local steward, not Prof. Hartmann,
          send the touch.
        </p>
      </div>
    </div>
  );
}

function monthsSince(date: string) {
  const d = new Date(date);
  const now = new Date();
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: "warn" }) {
  return (
    <div className="collegium-card p-4">
      <div className="text-xs text-[hsl(var(--c-slate-soft))] uppercase tracking-wider mb-1">{label}</div>
      <div className={`collegium-display text-3xl ${accent === "warn" ? "text-[hsl(8_55%_42%)]" : "text-[hsl(var(--c-ink))]"}`}>
        {value}
      </div>
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    thriving: { color: "bg-[hsl(145_30%_42%/0.15)] text-[hsl(145_40%_28%)]", label: "Thriving" },
    steady: { color: "bg-[hsl(var(--c-cream-warm))] text-[hsl(var(--c-slate))]", label: "Steady" },
    drifting: { color: "bg-[hsl(8_45%_52%/0.15)] text-[hsl(8_55%_42%)]", label: "Drifting" },
    paused: { color: "bg-[hsl(220_10%_85%)] text-[hsl(var(--c-slate))]", label: "Paused" },
  };
  const v = map[status] || map.steady;
  return (
    <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded ${v.color}`}>
      {v.label}
    </span>
  );
}
