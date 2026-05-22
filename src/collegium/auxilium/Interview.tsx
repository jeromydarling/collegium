import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Loader, SkipForward, ChevronLeft } from "lucide-react";
import {
  nextQuestion,
  extractFacts,
  synthesizeMatterFile,
  type ChatMessage,
  type MatterFile,
} from "./lib/aiClient";
import {
  evictionInterview,
  type ExtractedFacts,
} from "./data/interview";

const SESSION_KEY = "auxilium_interview_session";

type Session = {
  matterType: string;
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterFile?: MatterFile;
  jurisdiction?: { city?: string; state?: string };
  done?: boolean;
};

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(s: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function Interview() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>(() => {
    const existing = loadSession();
    if (existing) return existing;
    // Seed: greeting + opening question.
    const greeting: ChatMessage = {
      role: "ai",
      text: evictionInterview.greeting,
      stepId: "greeting",
    };
    const opening = evictionInterview.questions[0];
    return {
      matterType: "eviction",
      transcript: [
        greeting,
        { role: "ai", text: opening.text, stepId: opening.id },
      ],
      facts: {},
    };
  });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [session.transcript.length, thinking]);

  // When the interview reaches "done", synthesize the matter file and route.
  useEffect(() => {
    if (!session.done || session.matterFile || synthesizing) return;
    setSynthesizing(true);
    synthesizeMatterFile({
      transcript: session.transcript,
      facts: session.facts,
      matterType: session.matterType,
    }).then((file) => {
      const updated = { ...session, matterFile: file };
      saveSession(updated);
      setSession(updated);
      setSynthesizing(false);
      navigate("/auxilium/matter-file");
    });
  }, [session.done]); // eslint-disable-line react-hooks/exhaustive-deps

  function lastAiQuestionId(): string | undefined {
    for (let i = session.transcript.length - 1; i >= 0; i--) {
      const m = session.transcript[i];
      if (m.role === "ai" && m.stepId && m.stepId !== "greeting") return m.stepId;
    }
    return undefined;
  }

  async function submitAnswer(text: string) {
    if (!text.trim() || thinking) return;
    const userMsg: ChatMessage = { role: "user", text: text.trim() };
    // Update transcript with the user reply, extract facts.
    const lastId = lastAiQuestionId();
    const lastQ = evictionInterview.questions.find((q) => q.id === lastId);
    setInput("");
    setThinking(true);

    const nextFacts = lastQ
      ? await extractFacts({
          question: lastQ,
          userReply: text.trim(),
          current: session.facts,
        })
      : session.facts;

    const transcriptAfter = [...session.transcript, userMsg];

    // Optional acknowledgement from the script.
    const ack =
      lastQ?.acknowledge && lastQ.acknowledge(text.trim(), nextFacts);
    let transcriptWithAck = transcriptAfter;
    if (ack) {
      transcriptWithAck = [
        ...transcriptAfter,
        { role: "ai", text: ack, stepId: `${lastId}-ack` } as ChatMessage,
      ];
    }

    // Ask for the next question.
    const next = await nextQuestion({
      transcript: transcriptWithAck,
      facts: nextFacts,
      matterType: session.matterType,
    });

    const newTranscript: ChatMessage[] = [
      ...transcriptWithAck,
      next.message,
    ];

    setSession({
      ...session,
      transcript: newTranscript,
      facts: nextFacts,
      done: next.done,
    });
    setThinking(false);
  }

  function skip() {
    submitAnswer("(skipped)");
  }

  function reset() {
    if (!confirm("Start the interview over? Your answers so far will be deleted."))
      return;
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  // Visible progress: how many script questions answered.
  const questionsAsked = new Set(
    session.transcript
      .filter((m) => m.role === "ai" && m.stepId && !m.stepId.endsWith("-ack") && m.stepId !== "greeting" && m.stepId !== "closing")
      .map((m) => m.stepId!)
  );
  const total = evictionInterview.questions.length;
  const progress = Math.min(1, questionsAsked.size / total);

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[hsl(var(--c-cream)/0.96)] backdrop-blur border-b border-[hsl(var(--c-border))] collegium-safe-top">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate("/auxilium")}
              className="text-xs collegium-link inline-flex items-center gap-1"
            >
              <ChevronLeft size={12} /> Back
            </button>
            <div className="text-xs text-[hsl(var(--c-slate-soft))]">
              {questionsAsked.size} / {total} questions
            </div>
          </div>
          <div className="h-1 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--c-gold))] transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Transcript */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
          {session.transcript.map((m, i) => (
            <Bubble key={i} message={m} />
          ))}
          {(thinking || synthesizing) && (
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--c-slate-soft))] italic">
              <Loader size={14} className="animate-spin" />
              {synthesizing ? "Writing up your matter file…" : "Listening…"}
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Composer */}
      {!session.done && (
        <footer className="sticky bottom-0 bg-[hsl(var(--c-cream)/0.96)] backdrop-blur border-t border-[hsl(var(--c-border))] collegium-safe-bottom">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer…"
                rows={2}
                className="flex-1 min-h-[44px] px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-base resize-y focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    submitAnswer(input);
                  }
                }}
              />
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="collegium-btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  <Send size={14} /> Send
                </button>
                <button
                  type="button"
                  onClick={skip}
                  className="text-xs text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-wine))] inline-flex items-center gap-1 justify-center"
                  disabled={thinking}
                >
                  <SkipForward size={11} /> Skip
                </button>
              </div>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-[hsl(var(--c-slate-soft))]">
              <span>
                Information, not legal advice. Stored only on your device.
              </span>
              <button onClick={reset} className="hover:text-[hsl(var(--c-wine))]">
                Start over
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === "ai") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-wine))] text-white flex items-center justify-center shrink-0 text-xs font-bold collegium-display">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="collegium-latin text-[10px] text-[hsl(var(--c-wine))] mb-0.5">
            Auxilium
          </div>
          <div className="text-[15px] sm:text-base leading-relaxed text-[hsl(var(--c-ink))]">
            {message.text.split("\n").map((line, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-[hsl(var(--c-wine))] text-white rounded-2xl rounded-br-sm px-4 py-2.5">
        <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
      </div>
    </div>
  );
}
