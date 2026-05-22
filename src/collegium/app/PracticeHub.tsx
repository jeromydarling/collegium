import { useMemo, useState } from "react";
import {
  MessageCircleQuestion,
  CheckCircle2,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Filter,
  PlusCircle,
} from "lucide-react";
import {
  practiceQuestions,
  practiceCategories,
  type PracticeCategory,
  type PracticeQuestion,
} from "../data/practiceQA";

/**
 * Practice Hub — async sanity-check Q&A for the network.
 *
 * Each card is a quick question + threaded answers from senior practitioners.
 * The hub is the lightweight middle between "Google search" and "schedule a
 * mentor call" — most pro bono friction lives in that middle, and most of
 * it can be unblocked by one credible practitioner in 200 words.
 */
export function PracticeHub() {
  const [category, setCategory] = useState<PracticeCategory | "all">("all");
  const [showAskForm, setShowAskForm] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(practiceQuestions.filter((q) => q.status === "open").map((q) => q.id))
  );

  const categories = useMemo(() => practiceCategories(), []);
  const visible = useMemo(
    () =>
      category === "all"
        ? practiceQuestions
        : practiceQuestions.filter((q) => q.category === category),
    [category]
  );

  const open = visible.filter((q) => q.status === "open");
  const settled = visible.filter((q) => q.status === "settled");

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <MessageCircleQuestion size={14} />
          <span className="collegium-latin text-sm">Quaestio brevis</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Practice hub
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          A 200-word question. A 200-word answer. The async sanity-check that
          unblocks most pro bono friction without scheduling a mentor call.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-[hsl(var(--c-slate-soft))]" />
          <CategoryChip
            label="All"
            active={category === "all"}
            onClick={() => setCategory("all")}
          />
          {categories.map((c) => (
            <CategoryChip
              key={c}
              label={c.replace(/-/g, " ")}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAskForm((s) => !s)}
          className="collegium-btn-primary text-sm inline-flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={12} /> Ask
        </button>
      </div>

      {showAskForm && <AskForm onClose={() => setShowAskForm(false)} />}

      {open.length > 0 && (
        <section className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3">
            Open · {open.length}
          </div>
          <div className="space-y-3">
            {open.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                expanded={expanded.has(q.id)}
                onToggle={() => toggle(q.id)}
              />
            ))}
          </div>
        </section>
      )}

      {settled.length > 0 && (
        <section className="mb-8 collegium-safe-bottom">
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-[hsl(145_40%_28%)]" />
            Settled · {settled.length}
          </div>
          <div className="space-y-3">
            {settled.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                expanded={expanded.has(q.id)}
                onToggle={() => toggle(q.id)}
              />
            ))}
          </div>
        </section>
      )}

      {visible.length === 0 && (
        <div className="collegium-card p-10 text-center text-sm text-[hsl(var(--c-slate-soft))]">
          No questions in this category yet. Be the first to ask.
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  q,
  expanded,
  onToggle,
}: {
  q: PracticeQuestion;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="collegium-card p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="collegium-tag-soft">{q.category.replace(/-/g, " ")}</span>
          {q.forum && (
            <span className="text-[hsl(var(--c-slate-soft))]">{q.forum}</span>
          )}
          <span className="text-[hsl(var(--c-slate-soft))]">·</span>
          <span className="text-[hsl(var(--c-slate-soft))]">
            {q.askerRole} · {formatDate(q.postedAt)}
          </span>
          {q.status === "settled" && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(145_40%_28%)]">
              <CheckCircle2 size={10} /> Settled
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-ink))] shrink-0"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="text-left w-full"
      >
        <h3 className="collegium-display text-lg leading-tight text-[hsl(var(--c-ink))] hover:text-[hsl(var(--c-wine))] transition-colors">
          {q.question}
        </h3>
      </button>

      {expanded && (
        <>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mt-2 pb-3 border-b border-[hsl(var(--c-border))]">
            {q.context}
          </p>

          <div className="mt-3 space-y-3">
            {q.answers.map((a) => (
              <div key={a.id} className="bg-[hsl(var(--c-cream-warm))] rounded p-3">
                <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                  <span className="font-medium text-[hsl(var(--c-ink))]">
                    {a.authorName}
                  </span>
                  <span className="text-[hsl(var(--c-slate-soft))]">
                    {a.authorRole} · {formatDate(a.postedAt)}
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                  {a.body}
                </p>
                <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-2 inline-flex items-center gap-1">
                  <ThumbsUp size={10} /> {a.endorsements} endorsement
                  {a.endorsements === 1 ? "" : "s"}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="text-xs collegium-link inline-flex items-center gap-1"
            >
              Add an answer →
            </button>
          </div>
        </>
      )}

      {!expanded && q.answers.length > 0 && (
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-2">
          {q.answers.length} answer{q.answers.length === 1 ? "" : "s"} ·{" "}
          {q.answers.reduce((s, a) => s + a.endorsements, 0)} endorsement
          {q.answers.reduce((s, a) => s + a.endorsements, 0) === 1 ? "" : "s"}
        </p>
      )}
    </article>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded border transition-colors capitalize ${
        active
          ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
          : "bg-white border-[hsl(var(--c-border))] text-[hsl(var(--c-slate))] hover:border-[hsl(var(--c-wine))]"
      }`}
    >
      {label}
    </button>
  );
}

function AskForm({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo-only: in production this writes to the practice-QA store.
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1800);
  }

  return (
    <div className="collegium-card p-5 mb-5 bg-[hsl(var(--c-cream-warm))]">
      {submitted ? (
        <div className="text-center py-2">
          <CheckCircle2
            size={20}
            className="text-[hsl(145_40%_28%)] mx-auto mb-1"
          />
          <p className="text-sm text-[hsl(var(--c-ink))]">
            Question posted. Senior advocates in this practice area will be
            pinged.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
            Ask the network
          </div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="One-sentence question — what you want to know"
            className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white mb-2"
            required
          />
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="Two or three sentences of context — what triggered the question, what you've already considered"
            className="w-full text-sm p-3 rounded border border-[hsl(var(--c-border))] bg-white mb-2 leading-relaxed resize-y"
            required
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="collegium-btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!question.trim() || !context.trim()}
              className="collegium-btn-primary text-xs disabled:opacity-50"
            >
              Post question
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
