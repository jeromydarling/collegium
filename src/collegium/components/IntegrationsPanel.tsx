import { useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  Check,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Cloud,
} from "lucide-react";
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  getEndpoint,
  setEndpoint,
  getModel,
  setModel,
  maskedApiKey,
  hasAIConfigured,
  MODEL_CHOICES,
  DEFAULT_ENDPOINT,
} from "../lib/ai/settings";
import { hasTwilioConfigured, maskedTwilioSid } from "../lib/twilio/settings";

/**
 * Inline integrations panel — AI gateway + Twilio (preview).
 *
 * Both follow the same "paste credentials → features turn on" pattern.
 * On Lovable cloud, the AI gateway's relative endpoint auto-injects auth
 * so users rarely need to enter a key directly.
 */
export function IntegrationsPanel() {
  return (
    <div className="space-y-5">
      <AIGatewayIntegration />
      <TwilioIntegration />
    </div>
  );
}

function AIGatewayIntegration() {
  const [key, setKey] = useState(getApiKey() ?? "");
  const [endpoint, setEndpointState] = useState(getEndpoint());
  const [model, setModelState] = useState(getModel());
  const [reveal, setReveal] = useState(false);
  const [savedNote, setSavedNote] = useState<"saved" | "cleared" | null>(null);
  const [advanced, setAdvanced] = useState(endpoint !== DEFAULT_ENDPOINT);
  const configured = hasAIConfigured();
  const onLovable = endpoint.startsWith("/");

  function handleSave() {
    setApiKey(key);
    setEndpoint(endpoint);
    setModel(model);
    setSavedNote("saved");
    setTimeout(() => setSavedNote(null), 1500);
  }

  function handleClear() {
    clearApiKey();
    setKey("");
    setSavedNote("cleared");
    setTimeout(() => setSavedNote(null), 1500);
  }

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[hsl(var(--c-wine))]" />
          <h3 className="collegium-display text-lg leading-tight">
            AI gateway
          </h3>
          {configured && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]">
              Configured
            </span>
          )}
        </div>
        {configured && key && (
          <span className="text-[11px] text-[hsl(var(--c-slate-soft))] font-mono">
            {maskedApiKey()}
          </span>
        )}
      </div>

      <p className="text-sm text-[hsl(var(--c-slate))] mb-4 leading-relaxed">
        Powers intake structuring, draft polish, and long-narrative
        summarization. On Lovable cloud the gateway auto-injects credentials —
        no key needed. For local development or non-Lovable deploys, paste an
        OpenAI-compatible API key here.
      </p>

      {onLovable && !key && (
        <div className="bg-[hsl(145_30%_45%/0.10)] border border-[hsl(145_30%_45%/0.30)] rounded p-3 mb-4 text-xs text-[hsl(145_40%_25%)] flex items-start gap-2">
          <Cloud size={13} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">Lovable cloud mode.</strong>{" "}
            Endpoint is the Lovable gateway. Credentials are managed for you;
            AI calls flow through Lovable AI (Gemini Flash by default) and
            count against your workspace credits.
          </span>
        </div>
      )}

      <div className="mb-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Model
          </span>
          <select
            value={model}
            onChange={(e) => setModelState(e.target.value)}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white focus:outline-none focus:border-[hsl(var(--c-wine))]"
          >
            {MODEL_CHOICES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[hsl(var(--c-slate-soft))] block mt-1">
            {MODEL_CHOICES.find((m) => m.value === model)?.note}
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={() => setAdvanced((a) => !a)}
        className="text-xs collegium-link mb-3"
      >
        {advanced ? "Hide" : "Show"} advanced (endpoint + API key)
      </button>

      {advanced && (
        <div className="grid sm:grid-cols-[1fr_14rem] gap-3 mb-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
              Endpoint
            </span>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpointState(e.target.value)}
              placeholder={DEFAULT_ENDPOINT}
              autoComplete="off"
              className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] font-mono focus:outline-none focus:border-[hsl(var(--c-wine))]"
            />
            <span className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1 block">
              Relative path = Lovable gateway · absolute URL = direct to
              provider (OpenAI, OpenRouter, etc.)
            </span>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
              API key {onLovable && <em className="not-italic font-normal opacity-70">(optional on Lovable)</em>}
            </span>
            <div className="relative">
              <input
                type={reveal ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={onLovable ? "Auto-injected" : "sk-..."}
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
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
          >
            {savedNote === "saved" ? <Check size={12} /> : null}
            {savedNote === "saved" ? "Saved" : "Save settings"}
          </button>
          {key && (
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

function TwilioIntegration() {
  const configured = hasTwilioConfigured();
  return (
    <div
      className={`collegium-card p-5 sm:p-6 ${
        configured ? "" : "border-dashed bg-[hsl(var(--c-cream-warm))] opacity-90"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={14} className={configured ? "text-[hsl(var(--c-wine))]" : "text-[hsl(var(--c-slate-soft))]"} />
        <h3 className="collegium-display text-lg leading-tight">
          Twilio voice + SMS
        </h3>
        {configured ? (
          <>
            <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]">
              Configured
            </span>
            <span className="text-[11px] text-[hsl(var(--c-slate-soft))] font-mono ml-auto">
              SID {maskedTwilioSid()}
            </span>
          </>
        ) : (
          <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]">
            Awaiting credentials
          </span>
        )}
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
        Powers SMS-first client features and voice intake. Configure inside
        the Voice Intake page — the same paste-credentials pattern as the AI
        gateway turns the SMS and voicemail surfaces live.
      </p>
    </div>
  );
}
