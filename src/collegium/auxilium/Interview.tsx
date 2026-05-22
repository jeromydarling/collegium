import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Loader,
  SkipForward,
  ChevronLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
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
  type InterviewQuestion,
} from "./data/interview";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
  cancelSpeaking,
  startDictation,
  awaitVoices,
  type DictationSession,
} from "./lib/voice";

const SESSION_KEY = "auxilium_interview_session";

type Session = {
  matterType: string;
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterFile?: MatterFile;
  jurisdiction?: { city?: string; state?: string };
  done?: boolean;
  /** Voice mode preference persists. */
  voiceEnabled?: boolean;
  /** When the user last touched the session — used for "pick up where you left off" prompts. */
  updatedAt?: string;
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
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...s, updatedAt: new Date().toISOString() })
    );
  } catch {
    /* ignore */
  }
}

export function Interview() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>(() => {
    const existing = loadSession();
    if (existing) return existing;
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
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(
    session.voiceEnabled ?? false
  );
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const dictationRef = useRef<DictationSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  // Save session on every change. Also save right before unload — phone
  // calls + lock screen don't reliably fire React unmount.
  useEffect(() => {
    saveSession({ ...session, voiceEnabled });
  }, [session, voiceEnabled]);

  useEffect(() => {
    function flush() {
      saveSession({ ...session, voiceEnabled });
    }
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [session, voiceEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [session.transcript.length, thinking]);

  // Preload voice list so the first spoken message uses a real voice.
  useEffect(() => {
    if (voiceEnabled && isSpeechSynthesisSupported()) {
      awaitVoices();
    }
  }, [voiceEnabled]);

  // When voice mode is on, speak each new AI message once.
  useEffect(() => {
    if (!voiceEnabled || !isSpeechSynthesisSupported()) return;
    const lastAi = [...session.transcript].reverse().find((m) => m.role === "ai");
    if (!lastAi || !lastAi.stepId) return;
    const id = lastAi.stepId + "::" + lastAi.text.length;
    if (lastSpokenIdRef.current === id) return;
    lastSpokenIdRef.current = id;
    // Speak without awaiting — let React keep going.
    speak(lastAi.text, { lang: "en-US" });
  }, [session.transcript, voiceEnabled]);

  // Whenever voice mode flips off, stop mid-utterance speech.
  useEffect(() => {
    if (!voiceEnabled) cancelSpeaking();
  }, [voiceEnabled]);

  // Stop listening + speaking on unmount.
  useEffect(() => {
    return () => {
      cancelSpeaking();
      dictationRef.current?.stop();
    };
  }, []);

  // When the interview reaches "done", synthesize the matter file and route.
  useEffect(() => {
    if (!session.done || session.matterFile || synthesizing) return;
    setSynthesizing(true);
    synthesizeMatterFile({
      transcript: session.transcript,
      facts: session.facts,
      matterType: session.matterType,
    }).then((file) => {
      const updated = { ...session, matterFile: file, voiceEnabled };
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

  const lastQ: InterviewQuestion | undefined = (() => {
    const id = lastAiQuestionId();
    return evictionInterview.questions.find((q) => q.id === id);
  })();

  async function submitAnswer(text: string) {
    if (!text.trim() || thinking) return;
    cancelSpeaking();
    stopListening();
    const userMsg: ChatMessage = { role: "user", text: text.trim() };
    const lastQuestion = lastQ;
    setInput("");
    setInterimText("");
    setThinking(true);

    const nextFacts = lastQuestion
      ? await extractFacts({
          question: lastQuestion,
          userReply: text.trim(),
          current: session.facts,
        })
      : session.facts;

    const transcriptAfter = [...session.transcript, userMsg];
    const ack =
      lastQuestion?.acknowledge && lastQuestion.acknowledge(text.trim(), nextFacts);
    let transcriptWithAck = transcriptAfter;
    if (ack) {
      transcriptWithAck = [
        ...transcriptAfter,
        { role: "ai", text: ack, stepId: `${lastQuestion!.id}-ack` } as ChatMessage,
      ];
    }

    const next = await nextQuestion({
      transcript: transcriptWithAck,
      facts: nextFacts,
      matterType: session.matterType,
    });

    const newTranscript: ChatMessage[] = [...transcriptWithAck, next.message];
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
    if (!confirm("Start the interview over? Your answers so far will be deleted.")) return;
    cancelSpeaking();
    stopListening();
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  function startListening() {
    if (listening) return;
    setInterimText("");
    setListening(true);
    const session = startDictation({
      lang: "en-US",
      onInterim: (t) => setInterimText(t),
      onFinal: (t) => {
        setListening(false);
        setInterimText("");
        // Append to existing input (in case they were partway through typing).
        const merged = input ? input.trim() + " " + t : t;
        submitAnswer(merged);
      },
      onError: (e) => {
        console.warn("[voice]", e);
        setListening(false);
        setInterimText("");
      },
      onEnd: () => {
        setListening(false);
        setInterimText("");
      },
    });
    dictationRef.current = session;
    if (!session) setListening(false);
  }

  function stopListening() {
    dictationRef.current?.stop();
    dictationRef.current = null;
    setListening(false);
    setInterimText("");
  }

  function toggleListen() {
    if (listening) stopListening();
    else startListening();
  }

  const questionsAsked = new Set(
    session.transcript
      .filter(
        (m) =>
          m.role === "ai" &&
          m.stepId &&
          !m.stepId.endsWith("-ack") &&
          m.stepId !== "greeting" &&
          m.stepId !== "closing"
      )
      .map((m) => m.stepId!)
  );
  const total = evictionInterview.questions.length;
  const progress = Math.min(1, questionsAsked.size / total);

  const composerValue = listening && interimText ? interimText : input;
  const sttSupported = isSpeechRecognitionSupported();
  const ttsSupported = isSpeechSynthesisSupported();
  const voiceCapable = ttsSupported || sttSupported;

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[hsl(var(--c-cream)/0.96)] backdrop-blur border-b border-[hsl(var(--c-border))] collegium-safe-top">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2 gap-3">
            <button
              onClick={() => navigate("/auxilium")}
              className="text-xs collegium-link inline-flex items-center gap-1 shrink-0"
            >
              <ChevronLeft size={12} /> Back
            </button>
            <div className="flex items-center gap-3">
              {voiceCapable && (
                <button
                  onClick={() => setVoiceEnabled((v) => !v)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${
                    voiceEnabled
                      ? "bg-[hsl(var(--c-wine))] text-white border-[hsl(var(--c-wine))]"
                      : "bg-white text-[hsl(var(--c-slate))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
                  }`}
                  title={voiceEnabled ? "Voice mode is on" : "Turn voice mode on"}
                >
                  {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  Voice {voiceEnabled ? "on" : "off"}
                </button>
              )}
              <div className="text-xs text-[hsl(var(--c-slate-soft))] shrink-0">
                {questionsAsked.size} / {total}
              </div>
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
            {/* Quick-answer buttons (super-guided mode) */}
            {lastQ?.quickAnswers && lastQ.quickAnswers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {lastQ.quickAnswers.map((a) => (
                  <button
                    key={a}
                    onClick={() => submitAnswer(a)}
                    disabled={thinking}
                    className="text-sm px-3.5 py-2 rounded-full border border-[hsl(var(--c-wine)/0.4)] text-[hsl(var(--c-wine))] bg-white hover:bg-[hsl(var(--c-wine)/0.06)] disabled:opacity-50"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer(input);
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  value={composerValue}
                  onChange={(e) => {
                    if (listening) stopListening();
                    setInput(e.target.value);
                  }}
                  placeholder={
                    listening
                      ? "Listening… speak now"
                      : voiceEnabled && sttSupported
                      ? "Type or tap the mic to speak"
                      : "Type your answer…"
                  }
                  rows={2}
                  className={`w-full min-h-[44px] px-3 py-2.5 rounded-md border bg-white text-base resize-y focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)] ${
                    listening
                      ? "border-[hsl(var(--c-wine))] ring-2 ring-[hsl(var(--c-wine)/0.3)]"
                      : "border-[hsl(var(--c-border))]"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submitAnswer(input);
                    }
                  }}
                />
                {listening && (
                  <span className="absolute right-2 top-2 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(8_55%_52%)] animate-pulse" />
                    Listening
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="collegium-btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  <Send size={14} /> Send
                </button>
                <div className="flex items-center gap-2 justify-end">
                  {sttSupported && (
                    <button
                      type="button"
                      onClick={toggleListen}
                      disabled={thinking}
                      className={`text-xs inline-flex items-center gap-1 rounded-full px-2.5 py-1 border ${
                        listening
                          ? "bg-[hsl(var(--c-wine))] text-white border-[hsl(var(--c-wine))]"
                          : "bg-white text-[hsl(var(--c-wine))] border-[hsl(var(--c-wine)/0.3)] hover:border-[hsl(var(--c-wine))]"
                      }`}
                      aria-label={listening ? "Stop dictation" : "Start dictation"}
                    >
                      {listening ? <MicOff size={11} /> : <Mic size={11} />}
                      {listening ? "Stop" : "Speak"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={skip}
                    className="text-xs text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-wine))] inline-flex items-center gap-1"
                    disabled={thinking}
                  >
                    <SkipForward size={11} /> Skip
                  </button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-between mt-2 text-[10px] text-[hsl(var(--c-slate-soft))]">
              <span>
                Information, not advice. Stored only on your device.
                {voiceEnabled && sttSupported && " · Voice stays on your phone."}
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
