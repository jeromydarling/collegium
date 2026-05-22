/**
 * Voice controller — wraps the browser SpeechRecognition + SpeechSynthesis
 * APIs into a stable interface for the Auxilium interview.
 *
 * Both APIs are vendor-prefixed and inconsistently supported. This
 * module hides those wrinkles, exposes a small Promise-based API, and
 * fails open: if a browser doesn't support speech recognition, the
 * mic button hides and the text input still works. If TTS isn't
 * available, AI messages just don't get spoken aloud.
 *
 * Locale support is first-class — every call accepts a BCP-47 lang
 * tag (en-US, es-US, fr-CA, vi-VN, etc.). Multilingual Auxilium will
 * thread the active language through here.
 */

type RecognitionLike = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: { new (): RecognitionLike };
    webkitSpeechRecognition?: { new (): RecognitionLike };
  }
}

function getRecognitionCtor(): { new (): RecognitionLike } | null {
  if (typeof window === "undefined") return null;
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(getRecognitionCtor());
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak a string. Returns a Promise that resolves when speech ends. */
export function speak(
  text: string,
  opts: { lang?: string; rate?: number; pitch?: number; voice?: SpeechSynthesisVoice } = {}
): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported() || !text.trim()) {
      resolve();
      return;
    }
    // Cancel anything in-flight so we don't queue.
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang ?? "en-US";
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1.0;
    if (opts.voice) u.voice = opts.voice;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export function cancelSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}

/**
 * Pick the best-available voice for a given lang code.
 * voices are async-loaded by the browser; this returns null until they're in.
 */
export function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!isSpeechSynthesisSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  // Prefer exact match; then language-prefix match; then any.
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split("-")[0])) ||
    undefined
  );
}

/** Wait for voices to load (Chrome async-loads them on first call). */
export function awaitVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) return resolve(existing);
    const handler = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Poke it; Chrome only fires voiceschanged after getVoices() is called.
    window.speechSynthesis.getVoices();
    // Safety timeout.
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
  });
}

export type DictationSession = {
  stop: () => void;
};

/**
 * Start a single-utterance dictation. The session resolves when the user
 * stops speaking; onInterim fires with partials as the user speaks.
 */
export function startDictation(opts: {
  lang?: string;
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (msg: string) => void;
  onEnd?: () => void;
}): DictationSession | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    opts.onError?.("Speech recognition not supported in this browser.");
    return null;
  }
  const r = new Ctor();
  r.continuous = false;
  r.interimResults = true;
  r.lang = opts.lang ?? "en-US";

  let finalTranscript = "";

  r.onresult = (e: any) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      const txt = res[0]?.transcript ?? "";
      if (res.isFinal) {
        finalTranscript += txt;
      } else {
        interim += txt;
      }
    }
    if (interim && opts.onInterim) opts.onInterim(interim);
  };
  r.onerror = (e: any) => {
    const msg = (e && e.error) || "speech recognition error";
    opts.onError?.(String(msg));
  };
  r.onend = () => {
    if (finalTranscript.trim()) {
      opts.onFinal(finalTranscript.trim());
    } else {
      opts.onEnd?.();
    }
  };
  r.start();
  return {
    stop: () => {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    },
  };
}
