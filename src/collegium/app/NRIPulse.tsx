import { useMemo } from "react";
import {
  chapters,
  mentorPairs,
  people,
  events,
  serviceMatters,
} from "../data/demo";
import { peerGuilds, peerSignals } from "../data/communio";
import { generateBriefings } from "../lib/nri/engine";
import { demoStore, useDemoState } from "../lib/demoStore";
import { Activity, Check } from "lucide-react";

const SCOPE_LABEL: Record<string, string> = {
  person: "Person",
  chapter: "Chapter",
  "mentor-pair": "Mentor pair",
  network: "Network",
};

export function NRIPulse() {
  const state = useDemoState();
  const briefings = useMemo(
    () =>
      generateBriefings({
        chapters,
        people,
        mentorPairs,
        events,
        serviceMatters,
        peerGuilds,
        peerSignals,
      }),
    []
  );
  const active = briefings.filter((b) => !state.resolvedBriefings.includes(b.id));
  const resolved = briefings.filter((b) => state.resolvedBriefings.includes(b.id));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Activity size={14} />
          <span className="collegium-latin text-sm">Concentus</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl">NRI Pulse</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Narrative Relational Intelligence reads the small signals across your
          chapters and synthesizes them into briefings a steward can act on.
        </p>
      </div>

      <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2 text-[hsl(38_60%_70%)]">
          <Activity size={14} />
          <span className="text-[10px] uppercase tracking-widest">How to read this</span>
        </div>
        <p className="text-sm text-[hsl(40_20%_82%)] leading-relaxed">
          NRI is not a dashboard. It is a discernment tool. Each briefing is
          short on purpose, names the signals it saw, and proposes a next step
          that a human can either confirm, modify, or dismiss. The steward
          retains the final word.
        </p>
      </div>

      <div className="mb-3 text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
        Active briefings · {active.length}
      </div>
      <div className="space-y-4 mb-10 sm:mb-12">
        {active.map((b) => (
          <BriefingCard key={b.id} b={b} resolved={false} />
        ))}
      </div>

      {resolved.length > 0 && (
        <>
          <div className="mb-3 text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
            Resolved · {resolved.length}
          </div>
          <div className="space-y-4 opacity-70 collegium-safe-bottom">
            {resolved.map((b) => (
              <BriefingCard key={b.id} b={b} resolved={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BriefingCard({
  b,
  resolved,
}: {
  b: ReturnType<typeof generateBriefings>[number];
  resolved: boolean;
}) {
  const subject = resolveSubject(b.scope, b.scopeId);
  return (
    <article className={`collegium-card p-5 sm:p-6 ${b.tone === "concern" ? "border-l-4 border-l-[hsl(8_55%_52%)]" : b.tone === "celebrate" ? "border-l-4 border-l-[hsl(145_30%_42%)]" : "border-l-4 border-l-[hsl(38_55%_50%)]"}`}>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[hsl(var(--c-slate-soft))] mb-1">
            <span className="collegium-tag-soft">{SCOPE_LABEL[b.scope]}</span>
            {subject && <span>· {subject}</span>}
            <ToneTag tone={b.tone} />
          </div>
          <h3 className="collegium-display text-lg sm:text-xl leading-tight">{b.title}</h3>
        </div>
        {!resolved && (
          <button
            onClick={() => demoStore.resolveBriefing(b.id)}
            className="text-xs text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-wine))] inline-flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <Check size={12} /> Mark complete
          </button>
        )}
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-4">{b.body}</p>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5 pt-4 border-t border-[hsl(var(--c-border))]">
        <div>
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
            Signals NRI saw
          </div>
          <ul className="space-y-1 text-sm text-[hsl(var(--c-slate))]">
            {b.signals.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[hsl(var(--c-gold))] mt-1">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
            Suggested action
          </div>
          <p className="text-sm text-[hsl(var(--c-ink))] italic leading-relaxed">
            {b.suggestedAction}
          </p>
        </div>
      </div>
    </article>
  );
}

function resolveSubject(scope: string, id: string): string {
  if (scope === "chapter") return chapters.find((c) => c.id === id)?.name || id;
  if (scope === "person") return people.find((p) => p.id === id)?.name || id;
  if (scope === "mentor-pair") {
    const pair = mentorPairs.find((m) => m.id === id);
    if (!pair) return id;
    const mentor = people.find((p) => p.id === pair.mentorId)?.name.split(" ").slice(-1)[0];
    const mentee = people.find((p) => p.id === pair.menteeId)?.name.split(" ").slice(-1)[0];
    return `${mentor} & ${mentee}`;
  }
  return "Network";
}

function ToneTag({ tone }: { tone: "celebrate" | "attend" | "concern" }) {
  const map = {
    celebrate: { color: "text-[hsl(145_40%_30%)]", label: "Celebrate" },
    attend: { color: "text-[hsl(var(--c-wine))]", label: "Attend" },
    concern: { color: "text-[hsl(8_55%_42%)]", label: "Concern" },
  }[tone];
  return (
    <span className={`text-[10px] uppercase tracking-widest font-medium ${map.color}`}>
      · {map.label}
    </span>
  );
}
