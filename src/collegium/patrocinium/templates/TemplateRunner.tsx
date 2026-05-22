import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  FileText,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type { PatrociniumCase } from "../data/cases";

/**
 * Shared shell for guided pro bono templates. Each template declares its
 * questions and its draft builder; the shell renders the two-column layout
 * (questions left, live draft right), copy-to-clipboard, header, and the
 * back-to-brief navigation.
 *
 * Adding a new template is therefore mostly: define the questions + write
 * a deterministic builder. Eight to fifteen questions, a working draft on
 * the right, twenty minutes instead of two hours.
 */

export type QuestionDef =
  | {
      id: string;
      type: "radio";
      prompt: string;
      hint?: string;
      options: { value: string; label: string }[];
      required?: boolean;
    }
  | {
      id: string;
      type: "toggle";
      prompt: string;
      hint?: string;
    }
  | {
      id: string;
      type: "text";
      prompt: string;
      hint?: string;
      placeholder?: string;
    };

export type TemplateAnswers = Record<string, string | boolean>;

export interface TemplateDefinition {
  /** Slug — matches the URL segment and template id in case meta. */
  slug: string;
  /** Display title, e.g. "Eviction answer — guided draft". */
  title: string;
  /** One-paragraph intro the lawyer reads first. */
  description: string;
  /** Jurisdictional / scope note. */
  jurisdictionNote: string;
  /** Latin micro-label above the heading. */
  latin: string;
  /** Question definitions, in display order. */
  questions: QuestionDef[];
  /** Default values for any field. */
  defaults?: TemplateAnswers;
  /** IDs of required radios — runner uses this to gray the preview. */
  requiredIds?: string[];
  /** Pure function: answers + case → text draft. */
  buildDraft: (answers: TemplateAnswers, c: PatrociniumCase) => string;
}

export function TemplateRunner({
  template,
  case: c,
}: {
  template: TemplateDefinition;
  case: PatrociniumCase;
}) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<TemplateAnswers>(
    template.defaults ?? {}
  );
  const [copied, setCopied] = useState(false);

  const allRequiredAnswered = (template.requiredIds ?? []).every(
    (id) => answers[id] !== undefined && answers[id] !== ""
  );

  const draft = useMemo(
    () => template.buildDraft(answers, c),
    [answers, c, template]
  );

  function update(id: string, value: string | boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleCopy() {
    navigator.clipboard?.writeText(draft).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => undefined
    );
  }

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <button
          type="button"
          onClick={() => navigate(`/patrocinium/cases/${c.matter.id}`)}
          className="text-xs collegium-link inline-flex items-center gap-1 mb-4"
        >
          <ChevronLeft size={12} /> Back to brief
        </button>

        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
            <Sparkles size={14} />
            <span className="collegium-latin text-sm">{template.latin}</span>
          </div>
          <h1 className="collegium-display text-2xl sm:text-3xl md:text-4xl leading-tight mb-2">
            {template.title}
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate))] max-w-2xl">
            {template.description}
          </p>
          <div className="mt-3 text-xs text-[hsl(var(--c-slate-soft))] flex items-start gap-1.5">
            <ShieldCheck size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
            <span>{template.jurisdictionNote}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Questions */}
          <div className="space-y-4">
            {template.questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                n={i + 1}
                def={q}
                value={answers[q.id]}
                onChange={(v) => update(q.id, v)}
              />
            ))}

            {!allRequiredAnswered && (template.requiredIds ?? []).length > 0 && (
              <p className="text-xs text-[hsl(var(--c-slate-soft))] italic">
                Answer the required fields to see the full draft.
              </p>
            )}
          </div>

          {/* Draft */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="collegium-card p-5 sm:p-6 bg-white">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-[hsl(var(--c-wine))]">
                  <FileText size={14} />
                  <span className="collegium-latin text-xs">Exitus</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy to clipboard"}
                </button>
              </div>
              <h2 className="collegium-display text-base mb-3 leading-tight">
                Draft · live preview
              </h2>
              <pre className="text-[11px] sm:text-xs text-[hsl(var(--c-slate))] leading-relaxed whitespace-pre-wrap font-mono bg-[hsl(var(--c-cream-warm))] rounded p-4 overflow-x-auto max-h-[60vh] overflow-y-auto">
                {draft}
              </pre>
              <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-3 leading-relaxed">
                Generated locally on your machine. Nothing leaves your browser.
                Review every paragraph before filing.
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to={`/patrocinium/cases/${c.matter.id}`}
                className="text-xs collegium-link inline-flex items-center gap-1"
              >
                Back to brief <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  n,
  def,
  value,
  onChange,
}: {
  n: number;
  def: QuestionDef;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  return (
    <div className="collegium-card p-4 sm:p-5">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
          {n}
        </span>
        <h3 className="text-sm sm:text-base font-medium text-[hsl(var(--c-ink))]">
          {def.prompt}
        </h3>
      </div>
      {def.hint && (
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-2.5 leading-relaxed">
          {def.hint}
        </p>
      )}
      {def.type === "radio" && (
        <RadioGroup
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          options={def.options}
        />
      )}
      {def.type === "toggle" && (
        <Toggle
          checked={!!value}
          onChange={(v) => onChange(v)}
          label="Yes"
        />
      )}
      {def.type === "text" && (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={def.placeholder}
          className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] focus:outline-none focus:border-[hsl(var(--c-wine))]"
        />
      )}
    </div>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={`text-xs px-2.5 py-1.5 rounded border cursor-pointer transition-colors ${
            value === o.value
              ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
              : "bg-white border-[hsl(var(--c-border))] text-[hsl(var(--c-ink))] hover:border-[hsl(var(--c-wine))]"
          }`}
        >
          <input
            type="radio"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="hidden"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
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
