import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Wand2,
  RefreshCw,
  AlertTriangle,
  Settings as SettingsIcon,
  ChevronDown,
} from "lucide-react";
import { complete } from "../lib/ai/client";
import { hasAIConfigured } from "../lib/ai/settings";
import { IntegrationsPanel } from "../components/IntegrationsPanel";

const SYSTEM_PROMPT = `You are an intake analyst for a Catholic legal-aid network. You convert unstructured intake-call notes from a parish or clinic steward into a structured pro bono case brief.

Rules:
- Do NOT invent facts not present in the notes. If a field is unknown, write "unknown" or "to confirm."
- Be terse and lawyer-readable.
- Strip PII when you can: name the requester by first name only, no last names, no contact info. Keep regions at city granularity (county or city, no street).
- Output ONLY a JSON object matching the exact schema below — no preamble, no postscript.

Schema:
{
  "category": "immigration" | "family" | "housing" | "parish-governance" | "canon-law" | "indigent-defense" | "religious-liberty" | "expungement" | "estate-planning" | "public-benefits",
  "urgency": "urgent" | "soon" | "routine",
  "engagementType": "advice-call" | "document-review" | "limited-scope" | "full-representation" | "clinic-shift",
  "hoursEstimate": number,
  "goal": string,
  "forum": string | null,
  "opposingParty": string | null,
  "postureNotes": string,
  "deadlineDate": string | null,
  "languages": string[],
  "redactionsApplied": string[]
}`;

const SAMPLE_NOTES = `Spoke with Maria (St. Procopius Parish) today, 5/22 around 11am. Family member's brother got a notice to quit on April 30. Allston address, Spanish-first, two kids in school. Voucher portability — they came from a Phoenix Section-8 last fall, paperwork stalled at HUD.

Landlord is Allston Realty Trust LLC. Court date in two weeks. She's also confused about the lease — sealed copy. Brother lost $2400 to a notario in March on an unrelated immigration thing but isn't asking about that right now.

She gave consent for closure-loop. Phone is on file with the parish — she'd rather not be on email. Speaks English but says Spanish is easier when stressed.`;

interface ParsedBrief {
  category: string;
  urgency: string;
  engagementType: string;
  hoursEstimate: number;
  goal: string;
  forum: string | null;
  opposingParty: string | null;
  postureNotes: string;
  deadlineDate: string | null;
  languages: string[];
  redactionsApplied: string[];
}

export function IntakeAssist() {
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedBrief | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(!hasAIConfigured());
  const [usage, setUsage] = useState<{
    inputTokens: number;
    outputTokens: number;
    model: string;
  } | null>(null);

  async function handleRun() {
    setBusy(true);
    setError(null);
    setResult(null);
    setRawText(null);
    setUsage(null);

    const response = await complete(notes.trim(), {
      system: SYSTEM_PROMPT,
      maxTokens: 1500,
      temperature: 0.3,
    });

    if (!response.ok) {
      setError(response.message);
      if (response.reason === "no-key") setShowSettings(true);
      setBusy(false);
      return;
    }

    setRawText(response.text);
    setUsage({
      inputTokens: response.usage.inputTokens,
      outputTokens: response.usage.outputTokens,
      model: response.model,
    });

    const parsed = tryParseJSON(response.text);
    if (!parsed) {
      setError(
        "The model returned content but it didn't parse as JSON. See raw output below."
      );
    } else {
      setResult(parsed);
    }
    setBusy(false);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Sparkles size={14} />
          <span className="collegium-latin text-sm">Intake assist</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Turn raw intake notes into a publishable case brief
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Paste the notes you took on the phone or in the parish office. The
          assistant proposes a structured brief — category, urgency, engagement
          type, hours estimate, goal, forum, posture — that a steward reviews
          and publishes to Patrocinium.
        </p>
      </div>

      <div className="mb-5">
        <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] rounded-xl p-5 sm:p-6">
          <div className="flex items-start gap-2 text-[hsl(38_60%_70%)] mb-2">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest">
              Steward retains the final word
            </span>
          </div>
          <p className="text-sm text-[hsl(40_25%_85%)] leading-relaxed">
            The assistant is an accelerant, not an authority. Every proposed
            field shows up editable. Names, phone numbers, dollar figures, and
            unrelated client details are scrubbed before the brief is generated
            — the assistant is instructed to drop them.
          </p>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="text-xs text-[hsl(var(--c-slate-soft))]">
          {hasAIConfigured() ? (
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[hsl(145_40%_28%)]" />
              AI gateway configured — Gemini Flash via Lovable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[hsl(38_55%_28%)]">
              <AlertTriangle size={12} /> AI gateway not configured
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
        >
          <SettingsIcon size={12} /> Integrations
          <ChevronDown
            size={11}
            className={`transition-transform ${showSettings ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {showSettings && (
        <div className="mb-6">
          <IntegrationsPanel />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label
              htmlFor="intake-notes"
              className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))]"
            >
              Intake notes
            </label>
            <button
              type="button"
              onClick={() => setNotes(SAMPLE_NOTES)}
              className="text-xs collegium-link"
            >
              Load sample
            </button>
          </div>
          <textarea
            id="intake-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            placeholder="Paste the steward's call notes here. Conversational is fine — typos, names, phone numbers, half-sentences. The assistant pulls the structure out."
            className="w-full text-sm p-3 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] resize-y leading-relaxed focus:outline-none focus:border-[hsl(var(--c-wine))]"
          />
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
              {notes.length} characters
            </div>
            <button
              type="button"
              onClick={handleRun}
              disabled={busy || !notes.trim() || !hasAIConfigured()}
              className="collegium-btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Generating
                </>
              ) : (
                <>
                  <Wand2 size={13} /> Generate brief
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
            Proposed brief
          </div>
          {error && (
            <div className="collegium-card p-4 mb-3 border-l-4 border-l-[hsl(8_55%_52%)]">
              <div className="flex items-start gap-2 text-sm text-[hsl(8_55%_38%)]">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {result && <BriefPreview brief={result} />}

          {!result && !error && !busy && (
            <div className="collegium-card p-8 text-center text-sm text-[hsl(var(--c-slate-soft))]">
              {hasAIConfigured()
                ? "Paste notes on the left and generate to see the proposed brief here."
                : "Configure the AI gateway above to enable AI assist."}
            </div>
          )}

          {usage && (
            <div className="mt-3 text-[11px] text-[hsl(var(--c-slate-soft))]">
              Model {usage.model} · {usage.inputTokens} in / {usage.outputTokens} out tokens
            </div>
          )}

          {rawText && !result && (
            <details className="mt-3">
              <summary className="text-xs text-[hsl(var(--c-slate-soft))] cursor-pointer">
                Raw response
              </summary>
              <pre className="text-[11px] mt-2 bg-[hsl(var(--c-cream-warm))] p-3 rounded font-mono leading-relaxed whitespace-pre-wrap max-h-[40vh] overflow-y-auto">
                {rawText}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

function BriefPreview({ brief }: { brief: ParsedBrief }) {
  return (
    <div className="collegium-card p-5">
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <Field label="Category">{humanize(brief.category)}</Field>
        <Field label="Urgency">{humanize(brief.urgency)}</Field>
        <Field label="Engagement">{humanize(brief.engagementType)}</Field>
        <Field label="Hours estimate">
          ~{brief.hoursEstimate} hr{brief.hoursEstimate === 1 ? "" : "s"}
        </Field>
        {brief.forum && <Field label="Forum">{brief.forum}</Field>}
        {brief.opposingParty && (
          <Field label="Opposing party">{brief.opposingParty}</Field>
        )}
        {brief.deadlineDate && (
          <Field label="Deadline">{brief.deadlineDate}</Field>
        )}
        {brief.languages.length > 0 && (
          <Field label="Languages">{brief.languages.join(", ")}</Field>
        )}
      </div>

      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
          Goal
        </div>
        <p className="text-sm text-[hsl(var(--c-ink))] leading-relaxed">
          {brief.goal}
        </p>
      </div>

      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
          Posture notes
        </div>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
          {brief.postureNotes}
        </p>
      </div>

      {brief.redactionsApplied.length > 0 && (
        <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
            Redactions the assistant applied
          </div>
          <ul className="text-xs text-[hsl(var(--c-slate))] space-y-0.5">
            {brief.redactionsApplied.map((r, i) => (
              <li key={i}>· {r}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-4 italic">
        Demo workflow ends here. In production, this proposal would land in
        the steward's review queue for one-click publication or edit.
      </p>
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
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-0.5">
        {label}
      </div>
      <div className="text-sm text-[hsl(var(--c-ink))]">{children}</div>
    </div>
  );
}

function humanize(s: string): string {
  return s.replace(/-/g, " ");
}

function tryParseJSON(text: string): ParsedBrief | null {
  // The model is asked for JSON-only, but cope with stray text by extracting
  // the first {...} block.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]) as Partial<ParsedBrief>;
    if (
      typeof obj.category === "string" &&
      typeof obj.goal === "string" &&
      typeof obj.postureNotes === "string"
    ) {
      return {
        category: obj.category,
        urgency: obj.urgency ?? "routine",
        engagementType: obj.engagementType ?? "advice-call",
        hoursEstimate: typeof obj.hoursEstimate === "number" ? obj.hoursEstimate : 2,
        goal: obj.goal,
        forum: obj.forum ?? null,
        opposingParty: obj.opposingParty ?? null,
        postureNotes: obj.postureNotes,
        deadlineDate: obj.deadlineDate ?? null,
        languages: Array.isArray(obj.languages) ? obj.languages : ["en"],
        redactionsApplied: Array.isArray(obj.redactionsApplied)
          ? obj.redactionsApplied
          : [],
      };
    }
  } catch {
    /* fall through to null */
  }
  return null;
}
