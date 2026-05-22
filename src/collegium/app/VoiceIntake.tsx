import { useMemo, useState } from "react";
import {
  Phone,
  Mic,
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Settings as SettingsIcon,
  Languages as LanguagesIcon,
  Eye,
  EyeOff,
  Trash2,
  PhoneIncoming,
} from "lucide-react";
import {
  voiceAppeals,
  type VoiceAppeal,
} from "../data/voiceAppeals";
import { defaultTenant } from "../data/tenants";
import {
  getTwilioCreds,
  setTwilioCreds,
  clearTwilioCreds,
  hasTwilioConfigured,
  maskedTwilioSid,
} from "../lib/twilio/settings";

const LANG_NAME: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  ht: "Haitian Creole",
  vi: "Vietnamese",
  fa: "Farsi",
  ti: "Tigrinya",
  ln: "Lingala",
  zh: "Chinese",
};

/**
 * Voice intake — what Twilio voicemails look like once they land.
 *
 * Auto-transcribed, optionally auto-translated, queued for steward review.
 * The steward listens (when Twilio's actually wired), reads, optionally
 * promotes the voicemail into a new ServiceMatter with the transcript
 * pre-loaded as a ClientAppeal.
 *
 * When Twilio creds are absent, the page shows the configuration panel
 * alongside three demo voicemails so the workflow is visible.
 */
export function VoiceIntake() {
  const tenant = useMemo(() => defaultTenant(), []);
  const appeals = useMemo(
    () => voiceAppeals.filter((a) => a.tenantId === tenant.id),
    [tenant.id]
  );
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(appeals.filter((a) => a.status === "new").map((a) => a.id))
  );
  const [showSettings, setShowSettings] = useState(!hasTwilioConfigured());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const newCount = appeals.filter((a) => a.status === "new").length;
  const reviewedCount = appeals.filter((a) => a.status === "reviewed").length;
  const promotedCount = appeals.filter((a) => a.status === "promoted").length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <PhoneIncoming size={14} />
          <span className="collegium-latin text-sm">Vox petentis</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Voice intake
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Clients without reliable email can call a tenant-specific number,
          leave a 60-second voicemail, and reach the network. We transcribe,
          translate when needed, and queue for steward review.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <KPI label="New" value={newCount} accent="warn" />
        <KPI label="Reviewed" value={reviewedCount} />
        <KPI label="Promoted to matter" value={promotedCount} accent="good" />
      </div>

      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="text-xs text-[hsl(var(--c-slate-soft))]">
          {hasTwilioConfigured() ? (
            <span className="inline-flex items-center gap-1.5">
              <Check size={12} className="text-[hsl(145_40%_28%)]" />
              Twilio configured — voicemails route to {getTwilioCreds().voiceNumber || "(your voice line)"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[hsl(38_55%_28%)]">
              <AlertTriangle size={12} /> Twilio not yet configured · the
              voicemails below are demos
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
        >
          <SettingsIcon size={12} /> Twilio settings
          <ChevronDown
            size={11}
            className={`transition-transform ${showSettings ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {showSettings && <TwilioPanel />}

      <div className="space-y-3 collegium-safe-bottom">
        {appeals.map((a) => (
          <VoicemailCard
            key={a.id}
            appeal={a}
            expanded={expanded.has(a.id)}
            onToggle={() => toggle(a.id)}
          />
        ))}
      </div>
    </div>
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
    <div className="collegium-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div className={`collegium-display text-3xl leading-none ${color}`}>
        {value}
      </div>
    </div>
  );
}

function VoicemailCard({
  appeal,
  expanded,
  onToggle,
}: {
  appeal: VoiceAppeal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const langName = appeal.detectedLanguage
    ? LANG_NAME[appeal.detectedLanguage] ?? appeal.detectedLanguage
    : null;
  const isForeign =
    appeal.detectedLanguage && appeal.detectedLanguage !== "en";

  return (
    <article className="collegium-card overflow-hidden">
      <div
        className="p-4 sm:p-5 cursor-pointer hover:bg-[hsl(var(--c-cream-warm))]"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))]">
            <Mic size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
              <span className="font-medium text-[hsl(var(--c-ink))]">
                {appeal.callerFirstName ?? "Unknown caller"}
              </span>
              <span className="text-[hsl(var(--c-slate-soft))]">·</span>
              <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
                <Phone size={10} /> {appeal.fromMasked}
              </span>
              <span className="text-[hsl(var(--c-slate-soft))]">·</span>
              <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
                <Clock size={10} /> {formatDuration(appeal.durationSec)}
              </span>
              {langName && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                  <LanguagesIcon size={10} /> {langName}
                </span>
              )}
              <StatusChip status={appeal.status} />
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] line-clamp-2 italic">
              "{(appeal.translation ?? appeal.transcript).slice(0, 180)}
              {(appeal.translation ?? appeal.transcript).length > 180 ? "…" : ""}"
            </p>
            <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
              {formatTimestamp(appeal.receivedAt)}
            </div>
          </div>
          <div className="text-[hsl(var(--c-slate-soft))] shrink-0">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[hsl(var(--c-border))] p-4 sm:p-5 bg-[hsl(var(--c-cream))]">
          {/* Audio placeholder — would be a real player when Twilio's wired */}
          <div className="bg-white border border-[hsl(var(--c-border))] rounded p-3 mb-4 flex items-center gap-3">
            <PlayCircle size={28} className="text-[hsl(var(--c-wine))] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[hsl(var(--c-ink))] font-medium">
                Voicemail audio
              </div>
              <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                {hasTwilioConfigured()
                  ? "Click to play original recording"
                  : "Audio playback active when Twilio is connected"}
              </div>
            </div>
            <span className="text-xs text-[hsl(var(--c-slate-soft))] font-mono shrink-0">
              {formatDuration(appeal.durationSec)}
            </span>
          </div>

          {isForeign && appeal.translation && (
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1.5 font-semibold">
                English translation
              </div>
              <p className="text-sm text-[hsl(var(--c-ink))] leading-relaxed">
                "{appeal.translation}"
              </p>
            </div>
          )}

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5 font-semibold">
              {isForeign && appeal.translation
                ? `Original transcript (${langName})`
                : "Auto-transcript"}
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed italic">
              "{appeal.transcript}"
            </p>
          </div>

          {appeal.notes && (
            <div className="mb-4 pb-3 border-b border-[hsl(var(--c-border))]">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5 font-semibold">
                Steward note · {appeal.reviewedBy}
              </div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                {appeal.notes}
              </p>
            </div>
          )}

          {appeal.status === "new" && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
              >
                Promote to matter
              </button>
              <button
                type="button"
                className="collegium-btn-ghost text-xs"
              >
                Mark reviewed
              </button>
              <button
                type="button"
                className="collegium-btn-ghost text-xs text-[hsl(8_55%_42%)]"
              >
                Archive
              </button>
            </div>
          )}

          {appeal.status === "promoted" && appeal.promotedToMatterId && (
            <div className="text-xs text-[hsl(145_40%_28%)] inline-flex items-center gap-1.5">
              <Check size={11} /> Promoted to matter {appeal.promotedToMatterId} — caller's
              story flows in as a ClientAppeal with consent unset (steward
              confirms with caller before publishing).
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function StatusChip({ status }: { status: VoiceAppeal["status"] }) {
  const map = {
    new: { label: "New", className: "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]" },
    reviewed: { label: "Reviewed", className: "bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]" },
    promoted: { label: "Promoted", className: "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]" },
    archived: { label: "Archived", className: "bg-[hsl(var(--c-slate-soft)/0.10)] text-[hsl(var(--c-slate-soft))]" },
  }[status];
  return (
    <span
      className={`ml-auto text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${map.className}`}
    >
      {map.label}
    </span>
  );
}

function TwilioPanel() {
  const [creds, setCreds] = useState(getTwilioCreds());
  const [reveal, setReveal] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function update(field: keyof typeof creds, value: string) {
    setCreds((c) => ({ ...c, [field]: value }));
  }

  function save() {
    setTwilioCreds(creds);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function clearAll() {
    if (!confirm("Remove Twilio credentials from this browser?")) return;
    clearTwilioCreds();
    setCreds({});
  }

  return (
    <div className="collegium-card p-5 mb-5 sm:mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))]">
            <Phone size={14} />
            <h3 className="collegium-display text-lg leading-tight">
              Twilio voice + SMS
            </h3>
            {hasTwilioConfigured() && (
              <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]">
                Configured
              </span>
            )}
          </div>
          {hasTwilioConfigured() && (
            <span className="text-[11px] text-[hsl(var(--c-slate-soft))] font-mono">
              SID {maskedTwilioSid()}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-[hsl(var(--c-slate))] mb-4 leading-relaxed">
        Paste your Twilio Account SID, Auth Token, and the phone numbers you
        provisioned for voice + SMS. Voicemails left on the voice number land
        in the queue above; SMS appointment reminders and intake links send
        from the from-number.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Account SID">
          <input
            type="text"
            value={creds.accountSid ?? ""}
            onChange={(e) => update("accountSid", e.target.value)}
            placeholder="AC..."
            autoComplete="off"
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
          />
        </Field>
        <Field label="Auth Token">
          <div className="relative">
            <input
              type={reveal ? "text" : "password"}
              value={creds.authToken ?? ""}
              onChange={(e) => update("authToken", e.target.value)}
              placeholder="•••"
              autoComplete="off"
              className="w-full text-sm py-1.5 pl-2.5 pr-9 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-ink))]"
            >
              {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="From number (SMS)">
          <input
            type="text"
            value={creds.fromNumber ?? ""}
            onChange={(e) => update("fromNumber", e.target.value)}
            placeholder="+1 555 555 0142"
            autoComplete="off"
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
          />
        </Field>
        <Field label="Voice number">
          <input
            type="text"
            value={creds.voiceNumber ?? ""}
            onChange={(e) => update("voiceNumber", e.target.value)}
            placeholder="+1 555 555 0143"
            autoComplete="off"
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
          />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={!creds.accountSid?.trim() || !creds.authToken?.trim()}
            className="collegium-btn-primary text-xs inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savedFlash ? <Check size={12} /> : null}
            {savedFlash ? "Saved" : "Save credentials"}
          </button>
          {hasTwilioConfigured() && (
            <button
              type="button"
              onClick={clearAll}
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5 text-[hsl(8_55%_42%)]"
            >
              <Trash2 size={11} /> Clear
            </button>
          )}
        </div>
        <span className="text-[11px] text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
          <Check size={11} className="text-[hsl(var(--c-wine))]" /> Local-only
          storage
        </span>
      </div>
    </div>
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

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
