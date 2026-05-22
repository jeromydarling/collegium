import { useMemo, useState } from "react";
import {
  Inbox,
  Quote,
  ArrowRight,
  Check,
  X,
  Eye,
  MapPin,
  Clock,
  Languages,
} from "lucide-react";
import { useDemoState, demoStore, type MatterDraft } from "../lib/demoStore";

/**
 * Steward intake-triage inbox — the surface where Auxilium submissions and
 * voice/AI-assist captures land. The steward reviews each draft, optionally
 * edits, then publishes it as a ServiceMatter on Patrocinium (or declines).
 *
 * In production publishing writes to the tenant database and the Auxilium
 * client receives a portal token via email or SMS. For demo, publishing
 * updates the draft's status + records the new matter id.
 */
export function MatterInbox() {
  const state = useDemoState();
  const drafts = useMemo(
    () => [...state.matterDrafts].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [state.matterDrafts]
  );
  const newDrafts = drafts.filter((d) => d.status === "new");
  const inReview = drafts.filter((d) => d.status === "in-review");
  const published = drafts.filter((d) => d.status === "published");
  const declined = drafts.filter((d) => d.status === "declined");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Inbox size={14} />
          <span className="collegium-latin text-sm">Atrium</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Intake triage
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Drafts coming in from Auxilium, voice intake, and the AI-assisted
          paste workflow. Review, optionally edit, then publish to Patrocinium
          so advocates can take the case.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
        <KPI label="New" value={newDrafts.length} accent="warn" />
        <KPI label="In review" value={inReview.length} />
        <KPI label="Published" value={published.length} accent="good" />
        <KPI label="Declined" value={declined.length} />
      </div>

      {drafts.length === 0 && (
        <div className="collegium-card p-10 text-center">
          <Inbox size={28} className="text-[hsl(var(--c-slate-soft))] mx-auto mb-3" />
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-3">
            No drafts yet.
          </p>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] max-w-md mx-auto leading-relaxed">
            Drafts arrive when a client completes the Auxilium interview and
            chooses "Send to a guild," or when a steward promotes a voicemail
            from the Voice Intake queue, or when the AI assist publishes a
            structured brief from raw notes.
          </p>
        </div>
      )}

      {newDrafts.length > 0 && (
        <Section
          title="New"
          subtitle="Awaiting steward review"
          count={newDrafts.length}
        >
          {newDrafts.map((d) => (
            <DraftCard key={d.id} draft={d} />
          ))}
        </Section>
      )}

      {inReview.length > 0 && (
        <Section
          title="In review"
          subtitle="Stewards working on these"
          count={inReview.length}
        >
          {inReview.map((d) => (
            <DraftCard key={d.id} draft={d} />
          ))}
        </Section>
      )}

      {published.length > 0 && (
        <Section
          title="Published to Patrocinium"
          subtitle="Now visible in the advocate pool"
          count={published.length}
        >
          {published.map((d) => (
            <DraftCard key={d.id} draft={d} compact />
          ))}
        </Section>
      )}

      {declined.length > 0 && (
        <Section
          title="Declined"
          subtitle="Returned to the referring source"
          count={declined.length}
        >
          {declined.map((d) => (
            <DraftCard key={d.id} draft={d} compact />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="mb-3">
        <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
          {title} · {count}
        </h2>
        <p className="text-xs text-[hsl(var(--c-slate-soft))]">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function DraftCard({ draft, compact }: { draft: MatterDraft; compact?: boolean }) {
  const [expanded, setExpanded] = useState(draft.status === "new" && !compact);
  const [editedSummary, setEditedSummary] = useState(draft.summary);
  const [editedCategory, setEditedCategory] = useState(draft.category);
  const [editedRegion, setEditedRegion] = useState(draft.region);

  function startReview() {
    demoStore.updateMatterDraft(draft.id, { status: "in-review" });
  }

  function publish() {
    const newMatterId = `sm-aux-${Date.now().toString(36)}`;
    demoStore.updateMatterDraft(draft.id, {
      status: "published",
      publishedMatterId: newMatterId,
      summary: editedSummary,
      category: editedCategory,
      region: editedRegion,
    });
  }

  function decline() {
    if (!confirm("Decline this draft? Source will be notified.")) return;
    demoStore.updateMatterDraft(draft.id, { status: "declined" });
  }

  return (
    <article className="collegium-card overflow-hidden">
      <div
        className="p-4 sm:p-5 cursor-pointer hover:bg-[hsl(var(--c-cream-warm))]"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))]">
            {draft.source === "auxilium" ? (
              <Quote size={14} />
            ) : (
              <Inbox size={14} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
              <span className="font-medium text-[hsl(var(--c-ink))]">
                {draft.requesterFirstName}
              </span>
              <span className="collegium-tag-soft">
                {draft.category.replace(/-/g, " ")}
              </span>
              <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
                <MapPin size={10} /> {draft.region}
              </span>
              <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
                <Clock size={10} /> {formatRelative(draft.submittedAt)}
              </span>
              {draft.languages.some((l) => l !== "en") && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                  <Languages size={10} />
                  {draft.languages.filter((l) => l !== "en").join(", ")}
                </span>
              )}
              <StatusBadge status={draft.status} />
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] ml-auto">
                via {draft.source}
              </span>
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] line-clamp-2 leading-snug">
              {draft.summary}
            </p>
            {draft.appealText && (
              <div className="mt-2 flex items-start gap-1.5">
                <Quote
                  size={11}
                  className="text-[hsl(var(--c-gold))] shrink-0 mt-0.5"
                />
                <p className="text-xs italic text-[hsl(var(--c-slate))] line-clamp-2 leading-snug">
                  "{draft.appealText}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[hsl(var(--c-border))] p-4 sm:p-5 bg-[hsl(var(--c-cream))]">
          {draft.status !== "published" && draft.status !== "declined" ? (
            <div className="space-y-3">
              <Field label="Category">
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
                >
                  {[
                    "immigration",
                    "family",
                    "housing",
                    "parish-governance",
                    "canon-law",
                    "indigent-defense",
                    "religious-liberty",
                    "expungement",
                    "estate-planning",
                    "public-benefits",
                    "other",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Region">
                <input
                  type="text"
                  value={editedRegion}
                  onChange={(e) => setEditedRegion(e.target.value)}
                  className="w-full text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
                />
              </Field>
              <Field label="Summary">
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-2 rounded border border-[hsl(var(--c-border))] bg-white leading-relaxed resize-y"
                />
              </Field>
              {draft.appealText && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1 font-semibold">
                    Personal appeal (immutable — client owns this)
                  </div>
                  <p className="text-sm italic text-[hsl(var(--c-slate))] leading-relaxed p-3 bg-white rounded border border-[hsl(var(--c-border))]">
                    "{draft.appealText}"
                  </p>
                  {draft.appealConsents && (
                    <p className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-1">
                      Consents: advocates{" "}
                      {draft.appealConsents.showToAdvocates ? "✓" : "·"} ·
                      communio {draft.appealConsents.shareCommunio ? "✓" : "·"} ·
                      public {draft.appealConsents.publicAdvocacy ? "✓" : "·"}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[hsl(var(--c-border))]">
                {draft.status === "new" && (
                  <button
                    type="button"
                    onClick={startReview}
                    className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
                  >
                    <Eye size={11} /> Mark in-review
                  </button>
                )}
                <button
                  type="button"
                  onClick={decline}
                  className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5 text-[hsl(8_55%_42%)]"
                >
                  <X size={11} /> Decline
                </button>
                <button
                  type="button"
                  onClick={publish}
                  className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
                >
                  <Check size={11} /> Publish to Patrocinium <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ) : draft.status === "published" ? (
            <div className="text-sm text-[hsl(145_40%_28%)] inline-flex items-center gap-1.5">
              <Check size={13} /> Published as matter{" "}
              <code className="font-mono">{draft.publishedMatterId}</code>
            </div>
          ) : (
            <div className="text-sm text-[hsl(8_55%_42%)] inline-flex items-center gap-1.5">
              <X size={13} /> Declined — referring source notified
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: MatterDraft["status"] }) {
  const map: Record<MatterDraft["status"], { label: string; cls: string }> = {
    new: {
      label: "New",
      cls: "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]",
    },
    "in-review": {
      label: "In review",
      cls: "bg-[hsl(var(--c-wine)/0.10)] text-[hsl(var(--c-wine))]",
    },
    published: {
      label: "Published",
      cls: "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]",
    },
    declined: {
      label: "Declined",
      cls: "bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${cls}`}
    >
      {label}
    </span>
  );
}

function KPI({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "good" | "warn";
}) {
  const color =
    accent === "good"
      ? "text-[hsl(145_40%_28%)]"
      : accent === "warn"
      ? "text-[hsl(38_55%_28%)]"
      : "text-[hsl(var(--c-ink))]";
  return (
    <div className="collegium-card p-3">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-0.5">
        {label}
      </div>
      <div className={`collegium-display text-2xl leading-none ${color}`}>
        {value}
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
