import { serviceMatters, people } from "../data/demo";

const STATUS_COLS = ["new", "triaged", "assigned", "follow-up", "closed"] as const;
type StatusKey = (typeof STATUS_COLS)[number];

const STATUS_LABEL: Record<StatusKey, { label: string; latin: string }> = {
  new: { label: "New", latin: "Nova" },
  triaged: { label: "Triaged", latin: "Distincta" },
  assigned: { label: "Assigned", latin: "Assignata" },
  "follow-up": { label: "Follow-up", latin: "Persecutio" },
  closed: { label: "Closed", latin: "Conclusa" },
};

export function Service() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Ministerium</div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Service</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          The works of mercy in legal vocation — pro bono, parish governance,
          canon-law overlap, and the unrepresented who would otherwise fall
          through.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 sm:mb-8">
        {STATUS_COLS.map((s) => {
          const count = serviceMatters.filter((m) => m.status === s).length;
          return (
            <div key={s} className="collegium-card p-4">
              <div className="collegium-latin text-[10px] text-[hsl(var(--c-wine))] mb-0.5">
                {STATUS_LABEL[s].latin}
              </div>
              <div className="text-xs uppercase tracking-wider text-[hsl(var(--c-slate-soft))] mb-1">
                {STATUS_LABEL[s].label}
              </div>
              <div className="collegium-display text-2xl text-[hsl(var(--c-ink))]">{count}</div>
            </div>
          );
        })}
      </div>

      <p className="lg:hidden text-xs text-[hsl(var(--c-slate-soft))] mb-2 italic">
        Swipe sideways to move across the board →
      </p>
      <div className="collegium-kanban">
        {STATUS_COLS.map((s) => {
          const matters = serviceMatters.filter((m) => m.status === s);
          return (
            <div key={s} className="bg-[hsl(var(--c-cream-warm))] rounded-lg p-3">
              <div className="font-medium text-xs uppercase tracking-wider text-[hsl(var(--c-slate))] mb-3 px-1">
                {STATUS_LABEL[s].label} · {matters.length}
              </div>
              <div className="space-y-2.5">
                {matters.map((m) => {
                  const assigned = m.assignedTo
                    ? people.find((p) => p.id === m.assignedTo)
                    : null;
                  return (
                    <article key={m.id} className="bg-white rounded-md p-3 border border-[hsl(var(--c-border))]">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <CategoryTag category={m.category} />
                        <UrgencyDot urgency={m.urgency} />
                      </div>
                      <h4 className="text-sm font-medium text-[hsl(var(--c-ink))] leading-tight mb-1">
                        {m.requester}
                      </h4>
                      <p className="text-xs text-[hsl(var(--c-slate))] leading-snug line-clamp-3 mb-2">
                        {m.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[hsl(var(--c-slate-soft))]">
                        <span>{m.region}</span>
                        {assigned && <span>→ {assigned.name.split(" ").slice(-1)[0]}</span>}
                      </div>
                    </article>
                  );
                })}
                {matters.length === 0 && (
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] italic px-1 py-3">
                    Empty.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10 collegium-card-warm p-5 sm:p-6 max-w-4xl">
        <h3 className="collegium-display text-xl mb-2">Canon-law overlap</h3>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
          Parish governance, marriage tribunals, religious-institute counsel —
          civil and canonical work intersect more often than either bar realizes.
          Collegium tags canon-law-credentialed members and surfaces them when a
          civil matter touches an ecclesial question. Fr. Stephen Cale, JCL,
          (Arlington) currently absorbs much of this work remotely; NRI is
          recommending we identify a Chicago canonist before the parish queue
          grows.
        </p>
      </div>
    </div>
  );
}

function CategoryTag({ category }: { category: string }) {
  return (
    <span className="text-[9px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded bg-[hsl(var(--c-wine)/0.08)] text-[hsl(var(--c-wine))]">
      {category.replace("-", " ")}
    </span>
  );
}

function UrgencyDot({ urgency }: { urgency: string }) {
  const color =
    urgency === "urgent"
      ? "bg-[hsl(8_55%_52%)]"
      : urgency === "soon"
      ? "bg-[hsl(38_55%_50%)]"
      : "bg-[hsl(145_30%_50%)]";
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} title={urgency} />;
}
