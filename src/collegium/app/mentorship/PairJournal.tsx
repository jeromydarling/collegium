import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  PenLine,
  Sparkles,
  Quote,
  Calendar,
} from "lucide-react";
import { mentorPairs, people, chapters } from "../../data/demo";
import { libraryExcerpts, libraryWorks } from "../../content/library";
import { useDemoState, demoStore } from "../../lib/demoStore";

/**
 * Per-pair reflection journal — closes the gap between "reflection
 * prompts from the formation library" and the actual product. Drops the
 * mentor and mentee into a shared (demo: single-user) journal anchored
 * to a library excerpt or a free-form note.
 *
 * Each entry is tagged by source — { kind: "excerpt", id } or
 * { kind: "prompt" } or { kind: "note" } — so the audit trail shows
 * what the pair has been sitting with.
 *
 * Lives at /app/mentorship/pair/:id.
 */

const FREE_PROMPTS = [
  "What's a case from this month that pulled at your conscience?",
  "Name a moment you saw the rule you were enforcing fail the person in front of you. What did you do?",
  "Where in your week did you have to choose between speed and care? Which did you choose?",
  "Who in your practice has shown you what it looks like to do this well?",
  "What's a habit of mind you're trying to grow this season?",
];

export function PairJournal() {
  const { id } = useParams<{ id: string }>();
  const pair = mentorPairs.find((p) => p.id === id);
  const state = useDemoState();

  const [tab, setTab] = useState<"excerpts" | "prompts" | "entries">(
    "excerpts"
  );
  const [draft, setDraft] = useState("");
  const [draftSource, setDraftSource] = useState<{
    kind: "excerpt" | "prompt" | "note";
    id?: string;
    label?: string;
  }>({ kind: "note" });

  const entries = useMemo(
    () => (id ? state.mentorJournal.filter((e) => e.pairId === id) : []),
    [state.mentorJournal, id]
  );

  if (!pair) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <Link
          to="/app/mentorship"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Mentorship
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That mentor pair was not found.
        </p>
      </div>
    );
  }

  const mentor = people.find((p) => p.id === pair.mentorId)!;
  const mentee = people.find((p) => p.id === pair.menteeId)!;
  const chapter = chapters.find((c) => c.id === mentor.chapterId);

  // Recommend excerpts matched to the mentee's stage; falls back to all if
  // none match.
  const recommended = libraryExcerpts.filter((ex) =>
    ex.audience.some((a) =>
      a === mentee.stage || (mentee.stage === "young-lawyer" && a === "lawyer")
    )
  );
  const excerpts = recommended.length > 0 ? recommended : libraryExcerpts;

  function startWithExcerpt(excerptId: string) {
    const ex = libraryExcerpts.find((e) => e.id === excerptId);
    setDraftSource({ kind: "excerpt", id: excerptId, label: ex?.citation });
    setTab("entries");
  }

  function startWithPrompt(prompt: string) {
    setDraftSource({ kind: "prompt", label: prompt });
    setDraft("");
    setTab("entries");
  }

  function saveEntry() {
    if (!draft.trim() || !id) return;
    demoStore.addJournalEntry({
      pairId: id,
      source: draftSource.kind === "note"
        ? { kind: "note" }
        : { kind: draftSource.kind, id: draftSource.id },
      body: draft.trim(),
    });
    setDraft("");
    setDraftSource({ kind: "note" });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-4xl mx-auto">
      <Link
        to="/app/mentorship"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Mentorship
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <PenLine size={14} />
          <span className="collegium-latin text-sm">Diarium Concordiae</span>
        </div>
        <div className="flex flex-wrap items-end gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.14)] flex items-center justify-center text-sm font-medium text-[hsl(var(--c-wine))] border-2 border-white">
                {mentor.initials}
              </div>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-gold)/0.28)] flex items-center justify-center text-sm font-medium text-[hsl(var(--c-wine-deep))] border-2 border-white">
                {mentee.initials}
              </div>
            </div>
            <div>
              <h1 className="collegium-display text-2xl sm:text-3xl leading-tight">
                {mentor.name.split(" ").slice(-1)[0]} &{" "}
                {mentee.name.split(" ").slice(-1)[0]}
              </h1>
              <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                {chapter?.name} · {pair.cadence} · {pair.status}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-snug max-w-2xl">
          {pair.notes}
        </p>
      </div>

      <div className="flex border-b border-[hsl(var(--c-border))] mb-5">
        <TabBtn
          active={tab === "excerpts"}
          onClick={() => setTab("excerpts")}
          icon={<BookOpen size={14} />}
          label="Library prompts"
          count={excerpts.length}
        />
        <TabBtn
          active={tab === "prompts"}
          onClick={() => setTab("prompts")}
          icon={<Sparkles size={14} />}
          label="Free prompts"
          count={FREE_PROMPTS.length}
        />
        <TabBtn
          active={tab === "entries"}
          onClick={() => setTab("entries")}
          icon={<PenLine size={14} />}
          label="Entries"
          count={entries.length}
        />
      </div>

      {tab === "excerpts" && (
        <div className="space-y-3 collegium-safe-bottom">
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">
            Recommended for {mentee.name.split(" ")[0]} ({mentee.stage.replace(/-/g, " ")}).
            Pick one to anchor this month's journal entry.
          </p>
          {excerpts.map((ex) => {
            const work = libraryWorks.find((w) => w.id === ex.workId);
            return (
              <article key={ex.id} className="collegium-card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                      {work?.title} · {work?.author}
                    </div>
                    <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
                      {ex.citation}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startWithExcerpt(ex.id)}
                    className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
                  >
                    <PenLine size={11} /> Reflect
                  </button>
                </div>
                <blockquote className="collegium-quote text-sm my-2">
                  "{ex.text}"
                </blockquote>
                {ex.paraphrase && (
                  <p className="text-sm text-[hsl(var(--c-slate))] italic">
                    {ex.paraphrase}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === "prompts" && (
        <div className="space-y-2.5 collegium-safe-bottom">
          {FREE_PROMPTS.map((p, i) => (
            <article key={i} className="collegium-card p-4">
              <div className="flex items-start gap-3">
                <Quote
                  size={16}
                  className="text-[hsl(var(--c-gold))] mt-0.5 shrink-0"
                />
                <p className="flex-1 text-sm text-[hsl(var(--c-slate))] leading-snug">
                  {p}
                </p>
                <button
                  type="button"
                  onClick={() => startWithPrompt(p)}
                  className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
                >
                  <PenLine size={11} /> Use
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "entries" && (
        <div className="space-y-4 collegium-safe-bottom">
          <article className="collegium-card p-4 sm:p-5 bg-[hsl(var(--c-cream-warm))]">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
              New entry
            </div>
            {draftSource.kind !== "note" && (
              <div className="text-xs text-[hsl(var(--c-wine))] mb-2 italic">
                Reflecting on:{" "}
                {draftSource.kind === "excerpt" ? draftSource.label : "a prompt"}
              </div>
            )}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What does this stir up for the pair?"
              rows={4}
              className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white resize-y"
            />
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                Saved locally for this demo. In production, mentor and mentee
                both see.
              </div>
              <button
                type="button"
                onClick={saveEntry}
                disabled={!draft.trim()}
                className={
                  draft.trim()
                    ? "collegium-btn-primary text-sm"
                    : "collegium-btn-ghost text-sm cursor-not-allowed opacity-50"
                }
              >
                Save entry
              </button>
            </div>
          </article>

          {entries.length === 0 && (
            <p className="text-sm text-[hsl(var(--c-slate-soft))] italic text-center py-6">
              No entries yet. Pick a library prompt or free prompt to start.
            </p>
          )}

          {entries
            .slice()
            .reverse()
            .map((e) => {
              const ex =
                e.source.kind === "excerpt" && e.source.id
                  ? libraryExcerpts.find((x) => x.id === e.source.id)
                  : null;
              return (
                <article key={e.id} className="collegium-card p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--c-slate-soft))] mb-2">
                    <Calendar size={11} />
                    {new Date(e.at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    <span className="ml-1 capitalize">· {e.source.kind}</span>
                    {ex && (
                      <span className="collegium-latin text-[hsl(var(--c-wine))]">
                        · {ex.citation}
                      </span>
                    )}
                  </div>
                  {ex && (
                    <blockquote className="collegium-quote text-xs mb-2 opacity-70">
                      "{ex.text}"
                    </blockquote>
                  )}
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed whitespace-pre-wrap">
                    {e.body}
                  </p>
                </article>
              );
            })}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
        active
          ? "border-[hsl(var(--c-wine))] text-[hsl(var(--c-wine))]"
          : "border-transparent text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-slate))]"
      }`}
    >
      {icon}
      <span>{label}</span>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded ${
          active
            ? "bg-[hsl(var(--c-wine)/0.1)] text-[hsl(var(--c-wine))]"
            : "bg-[hsl(var(--c-cream-warm))] text-[hsl(var(--c-slate-soft))]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
