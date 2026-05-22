import { useState } from "react";
import { Eye, EyeOff, Trash2, Check, KeyRound, ShieldCheck } from "lucide-react";
import {
  getClaudeKey,
  setClaudeKey,
  clearClaudeKey,
  getClaudeModel,
  setClaudeModel,
  maskedClaudeKey,
  hasClaudeKey,
  DEFAULT_CLAUDE_MODEL,
} from "../lib/ai/settings";

/**
 * Inline integrations panel — Claude (live) + Twilio (placeholder until the
 * Twilio session). Renders the same key-entry pattern for each: paste, save,
 * clear. Keys are stored only in the user's browser via localStorage.
 *
 * The placeholder slot pattern is deliberate. When the Twilio session lands
 * we copy this block and swap the labels — the storage layer (lib/ai/settings)
 * already has the Twilio key reserved.
 */
export function IntegrationsPanel() {
  return (
    <div className="space-y-5">
      <ClaudeIntegration />
      <TwilioIntegrationPlaceholder />
    </div>
  );
}

function ClaudeIntegration() {
  const [key, setKey] = useState(getClaudeKey() ?? "");
  const [model, setModel] = useState(getClaudeModel());
  const [reveal, setReveal] = useState(false);
  const [savedNote, setSavedNote] = useState<"saved" | "cleared" | null>(null);
  const configured = hasClaudeKey();

  function handleSave() {
    setClaudeKey(key);
    setClaudeModel(model);
    setSavedNote("saved");
    setTimeout(() => setSavedNote(null), 1500);
  }

  function handleClear() {
    clearClaudeKey();
    setKey("");
    setSavedNote("cleared");
    setTimeout(() => setSavedNote(null), 1500);
  }

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <KeyRound size={14} className="text-[hsl(var(--c-wine))]" />
          <h3 className="collegium-display text-lg leading-tight">
            Claude API
          </h3>
          {configured && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]">
              Configured
            </span>
          )}
        </div>
        {configured && (
          <span className="text-[11px] text-[hsl(var(--c-slate-soft))] font-mono">
            {maskedClaudeKey()}
          </span>
        )}
      </div>

      <p className="text-sm text-[hsl(var(--c-slate))] mb-4 leading-relaxed">
        Powers AI features: intake-note auto-structure, draft polish, and
        long-narrative summarization. Your key stays in this browser — it's
        sent only to api.anthropic.com when an AI feature runs.
      </p>

      <div className="grid sm:grid-cols-[1fr_12rem] gap-3 mb-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            API key
          </span>
          <div className="relative">
            <input
              type={reveal ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-…"
              autoComplete="off"
              className="w-full text-sm py-1.5 pl-2.5 pr-9 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] font-mono focus:outline-none focus:border-[hsl(var(--c-wine))]"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-ink))]"
              aria-label={reveal ? "Hide key" : "Show key"}
            >
              {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Model
          </span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white focus:outline-none focus:border-[hsl(var(--c-wine))]"
          >
            <option value="claude-haiku-4-5">Haiku 4.5 (fast/cheap)</option>
            <option value="claude-sonnet-4-6">Sonnet 4.6 (balanced)</option>
            <option value="claude-opus-4-7">Opus 4.7 (heavy)</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!key.trim()}
            className="collegium-btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            {savedNote === "saved" ? <Check size={12} /> : null}
            {savedNote === "saved" ? "Saved" : "Save key"}
          </button>
          {configured && (
            <button
              type="button"
              onClick={handleClear}
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5 text-[hsl(8_55%_42%)]"
            >
              <Trash2 size={12} /> Clear key
            </button>
          )}
        </div>
        <div className="text-[11px] text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
          <ShieldCheck size={11} className="text-[hsl(var(--c-wine))]" /> Local
          only
        </div>
      </div>

      {savedNote === "cleared" && (
        <p className="text-xs text-[hsl(38_55%_28%)] mt-2">
          Key removed from this browser.
        </p>
      )}
    </div>
  );
}

function TwilioIntegrationPlaceholder() {
  return (
    <div className="collegium-card p-5 sm:p-6 border-dashed bg-[hsl(var(--c-cream-warm))] opacity-90">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={14} className="text-[hsl(var(--c-slate-soft))]" />
        <h3 className="collegium-display text-lg leading-tight">Twilio SMS</h3>
        <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]">
          Awaiting credentials
        </span>
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
        Powers SMS-first client features: intake-by-SMS, appointment reminders,
        status updates, one-time access links. Storage slot is already wired —
        when you provide Account SID, Auth Token, and From-number, the same
        key-entry pattern as Claude takes over and the SMS features turn on.
      </p>
    </div>
  );
}
