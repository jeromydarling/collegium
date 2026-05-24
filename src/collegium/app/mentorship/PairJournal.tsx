import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  PenLine,
  Sparkles,
  Quote,
  Calendar,
  Video,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Award,
  FileDown,
  Plus,
  Plug,
  ShieldCheck,
  ExternalLink,
  Mic,
} from "lucide-react";
import {
  mentorPairs,
  people,
  chapters,
  type PairOutcome,
  type IntegrationConnection,
} from "../../data/demo";
import { libraryExcerpts, libraryWorks } from "../../content/library";
import {
  useDemoState,
  demoStore,
  usePairMeetings,
  usePairOutcomes,
  usePairVideoLink,
  usePairIntegrations,
} from "../../lib/demoStore";
import { downloadIcsForPair } from "../../lib/icsExport";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { VerificationBadge } from "./VerificationBadge";

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

  const [tab, setTab] = useState<
    "schedule" | "outcomes" | "excerpts" | "prompts" | "entries"
  >("schedule");

  const meetings = usePairMeetings(id);
  const outcomes = usePairOutcomes(id);
  const videoLink = usePairVideoLink(id);
  const integrations = usePairIntegrations(id);
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
  // Saved-by-the-user excerpts come first; then stage-recommended (deduped).
  const savedSet = new Set(state.savedExcerpts);
  const savedExcerpts = libraryExcerpts.filter((ex) => savedSet.has(ex.id));
  const fillSource = recommended.length > 0 ? recommended : libraryExcerpts;
  const restExcerpts = fillSource.filter((ex) => !savedSet.has(ex.id));
  const excerpts = [...savedExcerpts, ...restExcerpts];

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
        <div className="mt-4 flex flex-wrap gap-2">
          {videoLink ? (
            <a
              href={videoLink}
              target="_blank"
              rel="noopener"
              className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
            >
              <Video size={12} /> Open video room
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                const url = prompt(
                  "Paste this pair's standing video room URL (Zoom / Meet / Jitsi):",
                  ""
                );
                if (url && id) demoStore.setPairVideoLink(id, url.trim());
              }}
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
            >
              <Video size={12} /> Set video room
            </button>
          )}
          {meetings.length > 0 && (
            <button
              type="button"
              onClick={() =>
                downloadIcsForPair(pair, meetings, mentor, mentee)
              }
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
              title="Download .ics — subscribe in Google Calendar / Apple Calendar / Outlook"
            >
              <FileDown size={12} /> Calendar (.ics)
            </button>
          )}
        </div>
        {id && (
          <IntegrationsPanel pairId={id} integrations={integrations} />
        )}
      </div>

      <div className="flex border-b border-[hsl(var(--c-border))] mb-5 overflow-x-auto">
        <TabBtn
          active={tab === "schedule"}
          onClick={() => setTab("schedule")}
          icon={<Calendar size={14} />}
          label="Schedule"
          count={meetings.length}
        />
        <TabBtn
          active={tab === "outcomes"}
          onClick={() => setTab("outcomes")}
          icon={<Award size={14} />}
          label="Outcomes"
          count={outcomes.length}
        />
        <TabBtn
          active={tab === "excerpts"}
          onClick={() => setTab("excerpts")}
          icon={<BookOpen size={14} />}
          label="Library"
          count={excerpts.length}
        />
        <TabBtn
          active={tab === "prompts"}
          onClick={() => setTab("prompts")}
          icon={<Sparkles size={14} />}
          label="Prompts"
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

      {tab === "schedule" && id && (
        <ScheduleTab
          pairId={id}
          meetings={meetings}
          videoLink={videoLink}
        />
      )}

      {tab === "outcomes" && id && (
        <OutcomesTab pairId={id} outcomes={outcomes} />
      )}

      {tab === "excerpts" && (
        <div className="space-y-3 collegium-safe-bottom">
          {savedExcerpts.length > 0 && (
            <p className="text-xs text-[hsl(var(--c-wine))] mb-2">
              Your {savedExcerpts.length} saved reading{savedExcerpts.length === 1 ? "" : "s"} first.
              Then recommendations for {mentee.name.split(" ")[0]} ({mentee.stage.replace(/-/g, " ")}).
            </p>
          )}
          {savedExcerpts.length === 0 && (
            <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">
              Recommended for {mentee.name.split(" ")[0]} ({mentee.stage.replace(/-/g, " ")}).
              Pick one to anchor this month's journal entry.
            </p>
          )}
          {excerpts.map((ex) => {
            const work = libraryWorks.find((w) => w.id === ex.workId);
            const isSaved = savedSet.has(ex.id);
            return (
              <article
                key={ex.id}
                className={`collegium-card p-4 sm:p-5 ${
                  isSaved ? "border-l-4 border-[hsl(var(--c-gold))]" : ""
                }`}
              >
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

// ── Schedule tab ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<
  import("../../data/demo").PairMeeting["status"],
  { bg: string; ink: string; label: string }
> = {
  scheduled: { bg: "bg-[hsl(220_30%_92%)]", ink: "text-[hsl(220_30%_30%)]", label: "Scheduled" },
  completed: { bg: "bg-[hsl(145_35%_88%)]", ink: "text-[hsl(145_40%_28%)]", label: "Completed" },
  missed: { bg: "bg-[hsl(0_40%_92%)]", ink: "text-[hsl(0_50%_38%)]", label: "Missed" },
  rescheduled: { bg: "bg-[hsl(40_40%_88%)]", ink: "text-[hsl(40_50%_30%)]", label: "Rescheduled" },
  cancelled: { bg: "bg-[hsl(0_0%_90%)]", ink: "text-[hsl(0_0%_45%)]", label: "Cancelled" },
};

function ScheduleTab({
  pairId,
  meetings,
  videoLink,
}: {
  pairId: string;
  meetings: import("../../data/demo").PairMeeting[];
  videoLink: string | undefined;
}) {
  const [adding, setAdding] = useState(false);
  const now = useMemo(() => Date.now(), []);

  const upcoming = meetings.filter(
    (m) => new Date(m.scheduledFor).getTime() >= now && m.status === "scheduled"
  );
  const past = [...meetings]
    .filter((m) => new Date(m.scheduledFor).getTime() < now || m.status !== "scheduled")
    .reverse();

  return (
    <div className="space-y-5 collegium-safe-bottom">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[hsl(var(--c-slate-soft))]">
          {upcoming.length} upcoming · {past.length} past meeting{past.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
        >
          <CalendarPlus size={12} /> Schedule new
        </button>
      </div>

      {adding && (
        <ScheduleForm
          pairId={pairId}
          videoLink={videoLink}
          onClose={() => setAdding(false)}
        />
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="collegium-display text-lg mb-2">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.map((m) => (
              <MeetingRow key={m.id} meeting={m} videoLink={videoLink} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="collegium-display text-lg mb-2">Past</h2>
          <div className="space-y-2">
            {past.map((m) => (
              <MeetingRow key={m.id} meeting={m} videoLink={videoLink} past />
            ))}
          </div>
        </section>
      )}

      {meetings.length === 0 && !adding && (
        <div className="collegium-card p-8 text-center">
          <Calendar size={22} className="mx-auto mb-2 text-[hsl(var(--c-slate-soft))]" />
          <p className="text-sm text-[hsl(var(--c-slate-soft))]">
            No meetings scheduled yet. Click "Schedule new" to add the first one.
          </p>
        </div>
      )}
    </div>
  );
}

function MeetingRow({
  meeting: m,
  videoLink,
  past,
}: {
  meeting: import("../../data/demo").PairMeeting;
  videoLink: string | undefined;
  past?: boolean;
}) {
  const start = new Date(m.scheduledFor);
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const link = m.videoLink ?? videoLink;
  const palette = STATUS_COLORS[m.status];

  return (
    <article
      className={`collegium-card p-4 ${
        past && m.status === "missed" ? "border-l-4 border-[hsl(0_50%_55%)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--c-ink))]">
            {dateStr} · {timeStr}
          </div>
          <div className="text-xs text-[hsl(var(--c-slate-soft))]">
            {m.durationMinutes} min
          </div>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${palette.bg} ${palette.ink}`}
        >
          {palette.label}
        </span>
      </div>
      {m.agenda && (
        <p className="text-sm text-[hsl(var(--c-slate))] leading-snug mt-1">
          {m.agenda}
        </p>
      )}
      {m.notes && (
        <p className="text-xs text-[hsl(var(--c-slate-soft))] italic mt-2 leading-snug">
          {m.notes}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {!past && link && (
          <a
            href={link}
            target="_blank"
            rel="noopener"
            className="text-xs collegium-link inline-flex items-center gap-1"
          >
            <Video size={11} /> Join room
          </a>
        )}
        {past && m.status === "scheduled" && (
          <>
            <button
              type="button"
              onClick={() =>
                demoStore.updatePairMeeting(m.id, { status: "completed" })
              }
              className="collegium-btn-ghost text-[11px] inline-flex items-center gap-1"
            >
              <CheckCircle2 size={11} /> Mark completed
            </button>
            <button
              type="button"
              onClick={() =>
                demoStore.updatePairMeeting(m.id, { status: "missed" })
              }
              className="collegium-btn-ghost text-[11px] inline-flex items-center gap-1"
            >
              <XCircle size={11} /> Mark missed
            </button>
          </>
        )}
        {past && m.status === "completed" && !m.notes && (
          <button
            type="button"
            onClick={() => {
              const note = prompt("Drop a one-line note about this meeting:", "");
              if (note) demoStore.updatePairMeeting(m.id, { notes: note });
            }}
            className="text-xs collegium-link inline-flex items-center gap-1"
          >
            <PenLine size={11} /> Add notes
          </button>
        )}
        {m.recordingUrl && (
          <a
            href={m.recordingUrl}
            target="_blank"
            rel="noopener"
            className="text-xs collegium-link inline-flex items-center gap-1"
          >
            <Mic size={11} /> Recording <ExternalLink size={9} />
          </a>
        )}
      </div>
      {m.summary && <MeetingSummaryCard summary={m.summary} />}
    </article>
  );
}

function MeetingSummaryCard({
  summary,
}: {
  summary: import("../../data/demo").MeetingSummary;
}) {
  const sourceLabel: Record<
    import("../../data/demo").MeetingSummary["source"],
    string
  > = {
    "read-ai": "Read.ai",
    "zoom-ai": "Zoom AI Companion",
    otter: "Otter.ai",
    manual: "Manual notes",
  };

  return (
    <div className="mt-3 rounded-md bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
        <Sparkles size={10} /> {sourceLabel[summary.source]} summary
        <span className="text-[hsl(var(--c-slate-soft))] normal-case font-normal tracking-normal">
          · generated {new Date(summary.generatedAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-[hsl(var(--c-ink))] leading-snug mb-2">
        {summary.summary}
      </p>
      {summary.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {summary.topics.map((t, i) => (
            <span key={i} className="collegium-tag-soft text-[10px]">
              {t}
            </span>
          ))}
        </div>
      )}
      {summary.engagement?.note && (
        <p className="text-[11px] italic text-[hsl(var(--c-slate-soft))] mb-2 leading-snug">
          {summary.engagement.note}
          {summary.engagement.mentorSpeakingPercent !== undefined &&
            summary.engagement.menteeSpeakingPercent !== undefined && (
              <span className="ml-1 not-italic">
                — Mentor {summary.engagement.mentorSpeakingPercent}% / Mentee{" "}
                {summary.engagement.menteeSpeakingPercent}%
              </span>
            )}
        </p>
      )}
      {summary.actionItems.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
            Action items
          </div>
          <ul className="space-y-1">
            {summary.actionItems.map((ai) => (
              <li key={ai.id} className="flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={ai.status === "done"}
                  onChange={() => demoStore.toggleActionItem(ai.id)}
                  className="mt-0.5 cursor-pointer shrink-0"
                />
                <span
                  className={`flex-1 leading-snug ${
                    ai.status === "done"
                      ? "line-through text-[hsl(var(--c-slate-soft))]"
                      : "text-[hsl(var(--c-slate))]"
                  }`}
                >
                  {ai.text}
                  {ai.dueOn && (
                    <span className="text-[10px] text-[hsl(var(--c-wine))] ml-1.5">
                      · due {new Date(ai.dueOn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {summary.transcriptUrl && (
        <a
          href={summary.transcriptUrl}
          target="_blank"
          rel="noopener"
          className="text-[11px] collegium-link inline-flex items-center gap-1 mt-2"
        >
          Full transcript <ExternalLink size={9} />
        </a>
      )}
    </div>
  );
}

function ScheduleForm({
  pairId,
  videoLink,
  onClose,
}: {
  pairId: string;
  videoLink: string | undefined;
  onClose: () => void;
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("18:30");
  const [duration, setDuration] = useState(60);
  const [agenda, setAgenda] = useState("");

  function submit() {
    if (!date || !time) return;
    const scheduledFor = `${date}T${time}:00`;
    demoStore.addPairMeeting({
      pairId,
      scheduledFor,
      durationMinutes: duration,
      agenda: agenda.trim() || undefined,
      status: "scheduled",
    });
    onClose();
  }

  return (
    <div className="collegium-card p-4 bg-[hsl(var(--c-cream-warm))]">
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Time
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Duration
          </span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </select>
        </label>
      </div>
      <label className="block mb-3">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Agenda (optional)
        </span>
        <input
          type="text"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="What's this meeting for?"
          className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-[hsl(var(--c-slate-soft))] italic">
          {videoLink
            ? `Will use the pair's standing video room.`
            : `Set a standing video room in the header to add it automatically.`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="collegium-btn-ghost text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="collegium-btn-primary text-xs"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Outcomes tab ─────────────────────────────────────────────────────

const OUTCOME_KIND_LABEL: Record<PairOutcome["kind"], string> = {
  "bar-passed": "Bar passed",
  "bar-failed": "Bar attempt — did not pass",
  "first-job": "First legal job",
  "judicial-clerkship": "Judicial clerkship",
  internship: "Internship",
  "moot-court": "Moot court",
  publication: "Publication",
  "partnership-track": "Partnership track",
  "partnership-offered": "Partnership offered",
  "still-in-practice-1yr": "1 year in practice",
  "still-in-practice-3yr": "3 years in practice",
  "still-in-practice-5yr": "5 years in practice",
  "still-in-practice-10yr": "10 years in practice",
  "left-practice": "Left practice",
  "left-and-returned": "Returned to practice",
  other: "Other milestone",
};

function OutcomesTab({
  pairId,
  outcomes,
}: {
  pairId: string;
  outcomes: PairOutcome[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4 collegium-safe-bottom">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[hsl(var(--c-slate-soft))] italic max-w-2xl">
          The long-form receipts. What this pairing has produced over time —
          bar passage, first job, the years in practice that follow.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
        >
          <Plus size={12} /> Add outcome
        </button>
      </div>

      {adding && (
        <OutcomeForm
          pairId={pairId}
          onClose={() => setAdding(false)}
        />
      )}

      {outcomes.length > 0 ? (
        <ol className="relative border-l-2 border-[hsl(var(--c-gold))] ml-3 space-y-4 mt-2">
          {outcomes.map((o) => (
            <li key={o.id} className="ml-4">
              <span className="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-[hsl(var(--c-wine))] border-2 border-white" />
              <article className="collegium-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))]">
                      {OUTCOME_KIND_LABEL[o.kind]}
                    </div>
                    <div className="text-sm font-medium text-[hsl(var(--c-ink))]">
                      {new Date(o.occurredOn).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  {o.recordedBy && (
                    <span className="text-[10px] text-[hsl(var(--c-slate-soft))] italic">
                      Recorded by {o.recordedBy}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">
                  {o.detail}
                </p>
                <VerificationBadge outcome={o} />
              </article>
            </li>
          ))}
        </ol>
      ) : (
        !adding && (
          <div className="collegium-card p-8 text-center">
            <Award
              size={22}
              className="mx-auto mb-2 text-[hsl(var(--c-slate-soft))]"
            />
            <p className="text-sm text-[hsl(var(--c-slate-soft))]">
              No outcomes recorded yet. Add the first one when the mentee passes
              the bar, lands a job, or hits any milestone worth marking.
            </p>
          </div>
        )
      )}
    </div>
  );
}

function OutcomeForm({
  pairId,
  onClose,
}: {
  pairId: string;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<PairOutcome["kind"]>("bar-passed");
  const [occurredOn, setOccurredOn] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [detail, setDetail] = useState("");

  function submit() {
    if (!detail.trim()) return;
    demoStore.addPairOutcome({
      pairId,
      kind,
      occurredOn,
      detail: detail.trim(),
    });
    onClose();
  }

  return (
    <div className="collegium-card p-4 bg-[hsl(var(--c-cream-warm))]">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Kind
          </span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as PairOutcome["kind"])}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          >
            {Object.entries(OUTCOME_KIND_LABEL).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Occurred on
          </span>
          <input
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
          />
        </label>
      </div>
      <label className="block mb-3">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Detail
        </span>
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder='e.g. "Passed Illinois bar on first attempt"'
          className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
        />
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="collegium-btn-ghost text-xs"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!detail.trim()}
          className="collegium-btn-primary text-xs disabled:opacity-50"
        >
          Record
        </button>
      </div>
    </div>
  );
}
