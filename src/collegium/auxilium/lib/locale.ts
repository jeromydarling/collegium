/**
 * Locale + DeepL — multilingual support for Auxilium.
 *
 * Two layers:
 *   1. A small i18n module for static UI strings (the bits that
 *      never change per-user). Source language is English; other
 *      languages live in dictionaries keyed by message id.
 *   2. A DeepL translation client for dynamic content (the user's
 *      matter file, the GoFundMe draft, the SVdP/KofC referral
 *      bodies, the live Perplexity panels). Calls go through a
 *      backend proxy that holds the DeepL API key.
 *
 * Today the DeepL client is mocked — it returns the original text
 * with a `[locale]` marker prefix so the wiring is visible without
 * a key in the bundle. Flip VITE_DEEPL_PROXY_URL to switch to the
 * live proxy. The shape stays the same.
 *
 * Locale tags here are BCP-47 (en-US, es-US, fr-CA, vi-VN, ht-HT,
 * zh-CN, ar, ru, pt-BR). DeepL accepts a smaller set of language
 * codes — translateText() maps BCP-47 down to DeepL's expected
 * target code internally.
 */

import { useEffect, useState } from "react";

export type LocaleCode =
  | "en-US"
  | "es-US"
  | "fr-CA"
  | "ht-HT"
  | "vi-VN"
  | "zh-CN"
  | "ar"
  | "ru"
  | "pt-BR";

export type Locale = {
  code: LocaleCode;
  name: string;
  /** Native name as the user would recognize it. */
  nativeName: string;
  /** BCP-47 lang for TTS/STT. */
  speechLang: string;
  /** DeepL target-language code (when different from BCP-47). */
  deeplTarget: string;
  /** Whether RTL — affects body direction. */
  rtl?: boolean;
};

export const LOCALES: Locale[] = [
  { code: "en-US", name: "English", nativeName: "English", speechLang: "en-US", deeplTarget: "EN-US" },
  { code: "es-US", name: "Spanish", nativeName: "Español", speechLang: "es-US", deeplTarget: "ES" },
  { code: "fr-CA", name: "French", nativeName: "Français", speechLang: "fr-CA", deeplTarget: "FR" },
  { code: "ht-HT", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen", speechLang: "ht", deeplTarget: "EN-US" /* DeepL doesn't support HT yet — falls back to EN. */ },
  { code: "vi-VN", name: "Vietnamese", nativeName: "Tiếng Việt", speechLang: "vi-VN", deeplTarget: "VI" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "中文(简体)", speechLang: "zh-CN", deeplTarget: "ZH-HANS" },
  { code: "ar", name: "Arabic", nativeName: "العربية", speechLang: "ar-SA", deeplTarget: "AR", rtl: true },
  { code: "ru", name: "Russian", nativeName: "Русский", speechLang: "ru-RU", deeplTarget: "RU" },
  { code: "pt-BR", name: "Portuguese", nativeName: "Português", speechLang: "pt-BR", deeplTarget: "PT-BR" },
];

const STORAGE_KEY = "auxilium_locale";

export function getStoredLocale(): LocaleCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (stored && LOCALES.some((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  // Try browser language as a fallback.
  if (typeof navigator !== "undefined") {
    const nav = navigator.language;
    const match = LOCALES.find(
      (l) => l.code === nav || l.code.split("-")[0] === nav.split("-")[0]
    );
    if (match) return match.code;
  }
  return "en-US";
}

export function setStoredLocale(code: LocaleCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}

export function localeFor(code: LocaleCode): Locale {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

// ─────────────────────────────────────────────────────────────────────
// DeepL translation client
// ─────────────────────────────────────────────────────────────────────

const MOCK = !import.meta.env.VITE_DEEPL_PROXY_URL;

export type TranslateOpts = {
  target: LocaleCode;
  /** Source language, omit to auto-detect. */
  source?: LocaleCode;
  /** Hint for DeepL: "less" preserves formality, "more" prefers formal. */
  formality?: "less" | "more" | "default";
};

/**
 * Translate a single string via DeepL. Returns the original on en-US,
 * or when DeepL doesn't support the target. Caches per (text, target)
 * for the session so repeated renders don't re-bill.
 */
const translateCache = new Map<string, string>();

export async function translateText(text: string, opts: TranslateOpts): Promise<string> {
  if (!text.trim()) return text;
  if (opts.target === "en-US") return text;
  const cacheKey = `${opts.target}::${text}`;
  if (translateCache.has(cacheKey)) return translateCache.get(cacheKey)!;

  const result = MOCK ? await mockTranslate(text, opts) : await liveTranslate(text, opts);
  translateCache.set(cacheKey, result);
  return result;
}

/** Translate many strings in one round-trip — DeepL supports arrays. */
export async function translateBatch(texts: string[], opts: TranslateOpts): Promise<string[]> {
  if (opts.target === "en-US") return texts;
  if (MOCK) return Promise.all(texts.map((t) => translateText(t, opts)));
  // Live path: single call.
  const proxy = import.meta.env.VITE_DEEPL_PROXY_URL!;
  const target = localeFor(opts.target).deeplTarget;
  const res = await fetch(proxy, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texts,
      target_lang: target,
      source_lang: opts.source ? localeFor(opts.source).deeplTarget : undefined,
      formality: opts.formality ?? "default",
      preserve_formatting: true,
    }),
  });
  if (!res.ok) throw new Error(`DeepL proxy returned ${res.status}`);
  const data = (await res.json()) as { translations: { text: string }[] };
  data.translations.forEach((t, i) => translateCache.set(`${opts.target}::${texts[i]}`, t.text));
  return data.translations.map((t) => t.text);
}

async function liveTranslate(text: string, opts: TranslateOpts): Promise<string> {
  const [out] = await translateBatch([text], opts);
  return out ?? text;
}

async function mockTranslate(text: string, opts: TranslateOpts): Promise<string> {
  // Mock returns the original text with a small locale marker so devs can
  // see the wiring is active without burning a real translation quota.
  const tag = opts.target.split("-")[0].toUpperCase();
  await new Promise((r) => setTimeout(r, 30));
  return `[${tag}] ${text}`;
}

// ─────────────────────────────────────────────────────────────────────
// Static UI string i18n
// ─────────────────────────────────────────────────────────────────────

/** Key for every translatable static UI string. Add as we go. */
export type StringKey =
  | "voice.toggle.on"
  | "voice.toggle.off"
  | "voice.speak"
  | "voice.stop"
  | "voice.listening"
  | "voice.placeholder"
  | "compose.send"
  | "compose.skip"
  | "compose.startOver"
  | "compose.placeholder"
  | "compose.disclaimer"
  | "matter.heading"
  | "ask.title"
  | "ask.cta"
  | "ask.working"
  | "ask.consent";

/**
 * English source strings. Other locales translate live via DeepL on
 * first read in that locale. The cache makes this effectively free
 * after first use per session.
 */
export const EN: Record<StringKey, string> = {
  "voice.toggle.on": "Voice on",
  "voice.toggle.off": "Voice off",
  "voice.speak": "Speak",
  "voice.stop": "Stop",
  "voice.listening": "Listening",
  "voice.placeholder": "Listening… speak now",
  "compose.send": "Send",
  "compose.skip": "Skip",
  "compose.startOver": "Start over",
  "compose.placeholder": "Type your answer…",
  "compose.disclaimer":
    "Information, not advice. Stored only on your device.",
  "matter.heading": "Here's what we have for you.",
  "ask.title": "Send the packet to everyone who's supposed to help.",
  "ask.cta": "Find every nearby help",
  "ask.working": "Looking up every nearby help…",
  "ask.consent":
    "I understand Auxilium will redact my surname, address, employer, and case number before producing any referral. I am in control of every send. Auxilium never touches the money.",
};

/** Per-locale dictionaries — populate as translations land. */
const DICT: Partial<Record<LocaleCode, Partial<Record<StringKey, string>>>> = {
  // Seeded Spanish hand-translations — proof that the i18n surface
  // works without waiting for the DeepL proxy. Add more locales as we
  // ship.
  "es-US": {
    "voice.toggle.on": "Voz activada",
    "voice.toggle.off": "Voz desactivada",
    "voice.speak": "Hablar",
    "voice.stop": "Parar",
    "voice.listening": "Escuchando",
    "voice.placeholder": "Escuchando… hable ahora",
    "compose.send": "Enviar",
    "compose.skip": "Omitir",
    "compose.startOver": "Empezar de nuevo",
    "compose.placeholder": "Escriba su respuesta…",
    "compose.disclaimer":
      "Información, no asesoramiento. Solo guardado en su dispositivo.",
    "matter.heading": "Esto es lo que tenemos para usted.",
    "ask.title": "Envíe el paquete a todos los que deberían ayudar.",
    "ask.cta": "Encuentra toda la ayuda cercana",
    "ask.working": "Buscando toda la ayuda cercana…",
    "ask.consent":
      "Entiendo que Auxilium eliminará mi apellido, dirección, empleador y número de caso antes de generar cualquier referencia. Yo controlo cada envío. Auxilium nunca toca el dinero.",
  },
};

/** Resolve a static string for the active locale. */
export function t(key: StringKey, locale: LocaleCode = "en-US"): string {
  const dict = DICT[locale];
  return dict?.[key] ?? EN[key];
}

// ─────────────────────────────────────────────────────────────────────
// React hook
// ─────────────────────────────────────────────────────────────────────

/** Simple cross-component locale store, persisted to localStorage. */
let _locale: LocaleCode = typeof window === "undefined" ? "en-US" : getStoredLocale();
const localeListeners = new Set<(l: LocaleCode) => void>();

export function getLocale(): LocaleCode {
  return _locale;
}

export function setLocale(code: LocaleCode): void {
  _locale = code;
  setStoredLocale(code);
  for (const l of localeListeners) l(code);
}

export function useLocale(): [LocaleCode, (l: LocaleCode) => void] {
  const [v, setV] = useState<LocaleCode>(_locale);
  useEffect(() => {
    const handler = (l: LocaleCode) => setV(l);
    localeListeners.add(handler);
    return () => {
      localeListeners.delete(handler);
    };
  }, []);
  return [v, setLocale];
}

/** Convenience hook that gives a translated string + the active locale. */
export function useT() {
  const [locale] = useLocale();
  return {
    t: (key: StringKey) => t(key, locale),
    locale,
  };
}
