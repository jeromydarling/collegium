import { Plug, Sparkles, Video, Calendar } from "lucide-react";
import { demoStore } from "../../lib/demoStore";
import type { IntegrationConnection } from "../../data/demo";

/**
 * Integrations panel for the mentor-pair page header. Shows the
 * connection state for Read.ai (auto-summaries), Zoom (per-meeting
 * rooms), and Google/Outlook/Apple Calendar (two-way sync).
 *
 * Toggle behavior in the demo:
 *   - Click an unconnected provider → marks connected (demo).
 *   - Click a connected provider → marks disconnected.
 *
 * In production these toggles open the OAuth handshake; the demo's
 * state-only model exists so the surfaces are present and demoable.
 */

const PROVIDER_LABELS: Record<
  IntegrationConnection["provider"],
  { label: string; blurb: string; icon: typeof Plug }
> = {
  "read-ai": {
    label: "Read.ai",
    blurb: "Auto-summaries + action items from meeting recordings",
    icon: Sparkles,
  },
  zoom: {
    label: "Zoom",
    blurb: "Per-meeting rooms + cloud recording",
    icon: Video,
  },
  "google-calendar": {
    label: "Google Calendar",
    blurb: "Two-way sync of meetings",
    icon: Calendar,
  },
  outlook: {
    label: "Outlook",
    blurb: "Two-way sync of meetings",
    icon: Calendar,
  },
  "apple-calendar": {
    label: "Apple Calendar",
    blurb: "Subscribe via CalDAV",
    icon: Calendar,
  },
};

const DEFAULT_PROVIDERS: IntegrationConnection["provider"][] = [
  "read-ai",
  "zoom",
  "google-calendar",
];

export function IntegrationsPanel({
  pairId,
  integrations,
}: {
  pairId: string;
  integrations: IntegrationConnection[];
}) {
  const byProvider = new Map(integrations.map((c) => [c.provider, c]));

  return (
    <div className="mt-5 rounded-md border border-[hsl(var(--c-border))] bg-white p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
        <Plug size={11} /> Integrations
        <span className="text-[hsl(var(--c-wine))] normal-case tracking-normal font-normal">
          · click to toggle (demo — OAuth handshake lives in Phase 3)
        </span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {DEFAULT_PROVIDERS.map((p) => {
          const conn = byProvider.get(p);
          const meta = PROVIDER_LABELS[p];
          const Icon = meta.icon;
          const connected = !!conn?.connected;
          return (
            <button
              key={p}
              type="button"
              onClick={() =>
                demoStore.toggleIntegration(
                  pairId,
                  p,
                  conn?.displayName ?? `${meta.label} workspace`
                )
              }
              className={`text-left px-3 py-2 rounded border transition-colors ${
                connected
                  ? "bg-[hsl(var(--c-cream-warm))] border-[hsl(var(--c-wine)/0.3)]"
                  : "bg-white border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.2)]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon
                  size={12}
                  className={
                    connected
                      ? "text-[hsl(var(--c-wine))]"
                      : "text-[hsl(var(--c-slate-soft))]"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    connected
                      ? "text-[hsl(var(--c-ink))]"
                      : "text-[hsl(var(--c-slate-soft))]"
                  }`}
                >
                  {meta.label}
                </span>
                <span
                  className={`ml-auto text-[10px] font-semibold uppercase tracking-widest ${
                    connected
                      ? "text-[hsl(145_40%_28%)]"
                      : "text-[hsl(var(--c-slate-soft))]"
                  }`}
                >
                  {connected ? "On" : "Off"}
                </span>
              </div>
              <p
                className={`text-[11px] leading-snug mt-0.5 ${
                  connected
                    ? "text-[hsl(var(--c-slate))]"
                    : "text-[hsl(var(--c-slate-soft))]"
                }`}
              >
                {connected && conn?.displayName ? conn.displayName : meta.blurb}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
