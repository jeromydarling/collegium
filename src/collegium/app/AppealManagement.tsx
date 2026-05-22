import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Quote,
  ShieldCheck,
  Edit3,
  Trash2,
  Send,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  HandHeart,
  Pencil,
  Mic,
  Eye,
  AlertCircle,
} from "lucide-react";
import { serviceMatters, type ServiceMatter, type ClientAppeal } from "../data/demo";
import { defaultTenant } from "../data/tenants";

/**
 * Appeal management — steward-facing view of every personal appeal in the
 * tenant. Stewards can edit text, toggle consents, or revoke. They can
 * also send a "request appeal update" magic link to a client who'd like
 * to refresh their story.
 *
 * In production, edits write to the tenant database with an audit log
 * (who-changed-what-when) and revocations cascade to peer guilds via
 * Communio's signal-revocation channel. For demo we mutate local state
 * so the workflow is visible.
 */

interface MutableAppeal extends ClientAppeal {
  /** Local-only flag — has this been touched since load. */
  dirty?: boolean;
}

interface AppealRow {
  matter: ServiceMatter;
  appeal: MutableAppeal;
}

export function AppealManagement() {
  const tenant = useMemo(() => defaultTenant(), []);

  // Seed our local state from the tenant's matters that carry appeals.
  const [rows, setRows] = useState<AppealRow[]>(() =>
    serviceMatters
      .filter((m) => m.appeal && m.referringChapterId === tenant.id.replace("t-", "ch-"))
      .map((m) => ({ matter: m, appeal: { ...m.appeal! } }))
  );
  // Fallback: if filter produced nothing (demo tenant ids don't always
  // map cleanly to chapter ids), surface all matters with appeals.
  const fallbackRows = useMemo(
    () =>
      rows.length === 0
        ? serviceMatters
            .filter((m) => m.appeal)
            .map((m) => ({ matter: m, appeal: { ...m.appeal! } }))
        : rows,
    [rows]
  );
  const effectiveRows = rows.length === 0 ? fallbackRows : rows;

  const [expandedId, setExpandedId] = useState<string | null>(null);

  function update(matterId: string, next: MutableAppeal) {
    const updater = (list: AppealRow[]) =>
      list.map((r) =>
        r.matter.id === matterId ? { ...r, appeal: { ...next, dirty: true } } : r
      );
    setRows(updater(rows.length === 0 ? fallbackRows : rows));
  }

  function revoke(matterId: string) {
    if (
      !confirm(
        "Remove this appeal from the matter? The client will need to re-write or grant consent again before it appears anywhere."
      )
    ) {
      return;
    }
    setRows((list) => list.filter((r) => r.matter.id !== matterId));
  }

  const visible = effectiveRows.filter((r) => r.appeal); // post-revocation safety

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Quote size={14} />
          <span className="collegium-latin text-sm">Appellationes</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Appeal management
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Every personal appeal in your tenant. Edit on behalf of a client
          who can't, change consent gates as relationships evolve, revoke
          when a matter closes or a client withdraws. Audit-logged in
          production.
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="collegium-card p-10 text-center">
          <HandHeart size={28} className="text-[hsl(var(--c-slate-soft))] mx-auto mb-3" />
          <p className="text-sm text-[hsl(var(--c-slate-soft))]">
            No personal appeals in your tenant yet. Clients can add one from
            the Auxilium matter file, or stewards can capture one during
            phone or in-person intake.
          </p>
        </div>
      ) : (
        <div className="space-y-3 collegium-safe-bottom">
          {visible.map((row) => (
            <AppealEditCard
              key={row.matter.id}
              row={row}
              expanded={expandedId === row.matter.id}
              onToggle={() =>
                setExpandedId(expandedId === row.matter.id ? null : row.matter.id)
              }
              onChange={(next) => update(row.matter.id, next)}
              onRevoke={() => revoke(row.matter.id)}
            />
          ))}
        </div>
      )}

      <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8">
        <p className="mb-2">
          <strong className="text-[hsl(var(--c-wine))] font-semibold">
            Audit trail (production):
          </strong>{" "}
          Every edit captures who, what changed, and when. Revocations
          cascade to peer guilds via Communio's revocation channel — any
          peer that received the sanitized story is notified that the
          consent was withdrawn and removes the story from display.
        </p>
        <p>
          <strong className="text-[hsl(var(--c-wine))] font-semibold">
            Client self-edit (future):
          </strong>{" "}
          When the member portal lands, clients receive a magic-link to
          edit their own appeal directly — no steward intermediation. For
          now, "Request appeal update" sends them a prompt to refresh.
        </p>
      </section>
    </div>
  );
}

function AppealEditCard({
  row,
  expanded,
  onToggle,
  onChange,
  onRevoke,
}: {
  row: AppealRow;
  expanded: boolean;
  onToggle: () => void;
  onChange: (next: MutableAppeal) => void;
  onRevoke: () => void;
}) {
  const { matter, appeal } = row;
  const [storyText, setStoryText] = useState(appeal.storyText);
  const [firstName, setFirstName] = useState(appeal.firstName);
  const [showToAdvocates, setShowToAdvocates] = useState(
    appeal.consents.showToAdvocates
  );
  const [shareCommunio, setShareCommunio] = useState(
    appeal.consents.shareCommunio
  );
  const [publicAdvocacy, setPublicAdvocacy] = useState(
    appeal.consents.publicAdvocacy
  );
  const [updateRequested, setUpdateRequested] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    onChange({
      ...appeal,
      firstName: firstName.trim(),
      storyText: storyText.trim(),
      consents: { showToAdvocates, shareCommunio, publicAdvocacy },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function requestUpdate() {
    setUpdateRequested(true);
    setTimeout(() => setUpdateRequested(false), 2500);
  }

  const authorBadge = {
    client: { icon: <Pencil size={11} />, label: "Client wrote it" },
    steward: { icon: <HandHeart size={11} />, label: "Steward transcribed" },
    "third-party": { icon: <HandHeart size={11} />, label: "Captured on their behalf" },
    "voice-transcribed": { icon: <Mic size={11} />, label: "From voicemail" },
  }[appeal.storyAuthor];

  return (
    <article className="collegium-card overflow-hidden">
      <div
        className="p-4 sm:p-5 cursor-pointer hover:bg-[hsl(var(--c-cream-warm))]"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <Quote
            size={20}
            className="text-[hsl(var(--c-gold))] shrink-0 mt-1"
            strokeWidth={1.5}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
              <span className="font-medium text-[hsl(var(--c-ink))]">
                {appeal.firstName}
              </span>
              <span className="text-[hsl(var(--c-slate-soft))]">·</span>
              <span className="text-[hsl(var(--c-slate-soft))] capitalize">
                {matter.category.replace(/-/g, " ")}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                {authorBadge.icon} {authorBadge.label}
              </span>
              <ConsentBadges consents={appeal.consents} />
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] italic line-clamp-2">
              "{appeal.storyText}"
            </p>
            <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
              Matter <code className="font-mono">{matter.id}</code> ·{" "}
              <Link
                to={`/patrocinium/cases/${matter.id}`}
                className="collegium-link"
                onClick={(e) => e.stopPropagation()}
              >
                view on Patrocinium
              </Link>
            </div>
          </div>
          <div className="text-[hsl(var(--c-slate-soft))] shrink-0">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[hsl(var(--c-border))] p-4 sm:p-5 bg-[hsl(var(--c-cream))]">
          <div className="grid sm:grid-cols-[10rem_1fr] gap-3 mb-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
                First name
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white"
                maxLength={40}
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
                Story text
              </span>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                rows={4}
                className="w-full text-sm p-3 rounded border border-[hsl(var(--c-border))] bg-white leading-relaxed resize-y"
                maxLength={1000}
              />
              <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
                {storyText.length} / 1000 characters
              </div>
            </label>
          </div>

          <div className="border-t border-[hsl(var(--c-border))] pt-3 mb-4">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2 inline-flex items-center gap-1">
              <ShieldCheck size={11} /> Consent toggles
            </div>
            <div className="space-y-2">
              <ConsentToggle
                checked={showToAdvocates}
                onChange={setShowToAdvocates}
                label="Show to advocates on Patrocinium"
              />
              <ConsentToggle
                checked={shareCommunio}
                onChange={setShareCommunio}
                label="Share with peer guilds via Communio (auto-sanitized)"
              />
              <ConsentToggle
                checked={publicAdvocacy}
                onChange={setPublicAdvocacy}
                label="Anonymized version may appear in Justice Gap public stories"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[hsl(var(--c-border))]">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={save}
                className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
              >
                {saved ? <Check size={11} /> : <Edit3 size={11} />}
                {saved ? "Saved" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={requestUpdate}
                className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
              >
                {updateRequested ? <Check size={11} /> : <Send size={11} />}
                {updateRequested ? "Magic link queued" : "Request appeal update"}
              </button>
              <Link
                to={`/patrocinium/cases/${matter.id}`}
                className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
              >
                <Eye size={11} /> View on Patrocinium
              </Link>
            </div>
            <button
              type="button"
              onClick={onRevoke}
              className="text-xs text-[hsl(8_55%_42%)] hover:underline inline-flex items-center gap-1"
            >
              <Trash2 size={11} /> Revoke appeal
            </button>
          </div>

          <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-3 italic flex items-start gap-1">
            <AlertCircle size={11} className="mt-0.5 shrink-0" />
            Demo edits affect this session only. Production writes to the
            tenant database and revocations cascade to peer guilds.
          </p>
        </div>
      )}
    </article>
  );
}

function ConsentBadges({ consents }: { consents: ClientAppeal["consents"] }) {
  const items: { label: string; on: boolean }[] = [
    { label: "advocates", on: consents.showToAdvocates },
    { label: "communio", on: consents.shareCommunio },
    { label: "public", on: consents.publicAdvocacy },
  ];
  return (
    <span className="ml-auto inline-flex items-center gap-1">
      {items.map((it) => (
        <span
          key={it.label}
          className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-semibold ${
            it.on
              ? "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]"
              : "bg-[hsl(var(--c-slate-soft)/0.15)] text-[hsl(var(--c-slate-soft))]"
          }`}
        >
          {it.on ? "✓" : "·"} {it.label}
        </span>
      ))}
    </span>
  );
}

function ConsentToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="cursor-pointer"
      />
      <span className="text-[hsl(var(--c-ink))]">{label}</span>
    </label>
  );
}
