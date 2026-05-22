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

const _SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_COLLEGIUM_SUPABASE_URL ||
  "";
const _SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";
/**
 * Resolve the DeepL proxy URL. Precedence:
 *   1. VITE_DEEPL_PROXY_URL — explicit override
 *   2. VITE_SUPABASE_URL + /functions/v1/auxilium-deepl (Lovable default)
 *   3. empty string → mock with [LOCALE] marker
 */
function _resolveProxyUrl(): string {
  if (import.meta.env.VITE_DEEPL_PROXY_URL)
    return import.meta.env.VITE_DEEPL_PROXY_URL as string;
  if (_SUPABASE_URL) return `${_SUPABASE_URL}/functions/v1/auxilium-deepl`;
  return "";
}
const _PROXY_URL = _resolveProxyUrl();
const MOCK = !_PROXY_URL;

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
  const target = localeFor(opts.target).deeplTarget;
  const res = await fetch(_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(_SUPABASE_ANON_KEY
        ? {
            apikey: _SUPABASE_ANON_KEY,
            Authorization: `Bearer ${_SUPABASE_ANON_KEY}`,
          }
        : {}),
    },
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

/**
 * Per-locale dictionaries — hand-translated for the 9 launch locales so
 * the static UI ships at zero translation-quota cost. Dynamic content
 * (the matter file, the referral packets, the Perplexity panels) goes
 * through translateText / translateBatch above.
 */
const DICT: Partial<Record<LocaleCode, Partial<Record<StringKey, string>>>> = {
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
  "fr-CA": {
    "voice.toggle.on": "Voix activée",
    "voice.toggle.off": "Voix désactivée",
    "voice.speak": "Parler",
    "voice.stop": "Arrêter",
    "voice.listening": "À l'écoute",
    "voice.placeholder": "À l'écoute… parlez maintenant",
    "compose.send": "Envoyer",
    "compose.skip": "Passer",
    "compose.startOver": "Recommencer",
    "compose.placeholder": "Tapez votre réponse…",
    "compose.disclaimer":
      "Information, pas un conseil. Sauvegardé uniquement sur votre appareil.",
    "matter.heading": "Voici ce que nous avons pour vous.",
    "ask.title": "Envoyez le dossier à tous ceux qui sont censés aider.",
    "ask.cta": "Trouver toute l'aide à proximité",
    "ask.working": "Recherche de toute l'aide à proximité…",
    "ask.consent":
      "Je comprends qu'Auxilium supprimera mon nom de famille, mon adresse, mon employeur et mon numéro de dossier avant de produire toute référence. Je contrôle chaque envoi. Auxilium ne touche jamais à l'argent.",
  },
  "ht-HT": {
    "voice.toggle.on": "Vwa aktive",
    "voice.toggle.off": "Vwa fèmen",
    "voice.speak": "Pale",
    "voice.stop": "Sispann",
    "voice.listening": "M ap koute",
    "voice.placeholder": "M ap koute… pale kounye a",
    "compose.send": "Voye",
    "compose.skip": "Sote",
    "compose.startOver": "Rekòmanse",
    "compose.placeholder": "Tape repons ou…",
    "compose.disclaimer":
      "Enfòmasyon, se pa konsèy. Sove sèlman sou aparèy ou.",
    "matter.heading": "Men sa nou genyen pou ou.",
    "ask.title": "Voye pake a bay tout moun ki sipoze ede w.",
    "ask.cta": "Jwenn tout èd ki tou pre",
    "ask.working": "Ap chèche tout èd ki tou pre…",
    "ask.consent":
      "Mwen konprann Auxilium pral retire siyati mwen, adrès mwen, anplwayè mwen, ak nimewo ka mwen anvan li pwodui nenpòt referans. Se mwen ki kontwole chak voye. Auxilium pa janm manyen lajan.",
  },
  "vi-VN": {
    "voice.toggle.on": "Bật giọng nói",
    "voice.toggle.off": "Tắt giọng nói",
    "voice.speak": "Nói",
    "voice.stop": "Dừng",
    "voice.listening": "Đang lắng nghe",
    "voice.placeholder": "Đang lắng nghe… vui lòng nói",
    "compose.send": "Gửi",
    "compose.skip": "Bỏ qua",
    "compose.startOver": "Bắt đầu lại",
    "compose.placeholder": "Nhập câu trả lời của bạn…",
    "compose.disclaimer":
      "Thông tin, không phải tư vấn pháp lý. Chỉ lưu trên thiết bị của bạn.",
    "matter.heading": "Đây là những gì chúng tôi có cho bạn.",
    "ask.title":
      "Gửi gói thông tin đến tất cả những người được cho là sẽ giúp đỡ.",
    "ask.cta": "Tìm mọi sự giúp đỡ gần đây",
    "ask.working": "Đang tìm mọi sự giúp đỡ gần đây…",
    "ask.consent":
      "Tôi hiểu rằng Auxilium sẽ ẩn họ, địa chỉ, chủ lao động, và số hồ sơ của tôi trước khi tạo bất kỳ giới thiệu nào. Tôi kiểm soát mọi lần gửi. Auxilium không bao giờ chạm vào tiền.",
  },
  "zh-CN": {
    "voice.toggle.on": "语音已开启",
    "voice.toggle.off": "语音已关闭",
    "voice.speak": "说话",
    "voice.stop": "停止",
    "voice.listening": "正在聆听",
    "voice.placeholder": "正在聆听…请说话",
    "compose.send": "发送",
    "compose.skip": "跳过",
    "compose.startOver": "重新开始",
    "compose.placeholder": "输入您的答案…",
    "compose.disclaimer": "信息，非法律建议。仅保存在您的设备上。",
    "matter.heading": "这是我们为您准备的内容。",
    "ask.title": "将资料包发送给所有应当提供帮助的人。",
    "ask.cta": "查找附近所有的帮助",
    "ask.working": "正在查找附近所有的帮助…",
    "ask.consent":
      "我理解 Auxilium 将在生成任何转介之前隐去我的姓氏、地址、雇主和案件编号。我控制每一次发送。Auxilium 从不经手资金。",
  },
  "ar": {
    "voice.toggle.on": "الصوت قيد التشغيل",
    "voice.toggle.off": "الصوت متوقف",
    "voice.speak": "تحدث",
    "voice.stop": "إيقاف",
    "voice.listening": "جارٍ الاستماع",
    "voice.placeholder": "جارٍ الاستماع… تحدث الآن",
    "compose.send": "إرسال",
    "compose.skip": "تخطي",
    "compose.startOver": "البدء من جديد",
    "compose.placeholder": "اكتب إجابتك…",
    "compose.disclaimer":
      "معلومات وليست نصيحة قانونية. محفوظة فقط على جهازك.",
    "matter.heading": "إليك ما لدينا من أجلك.",
    "ask.title": "أرسل الملف إلى كل من يُفترض به أن يساعد.",
    "ask.cta": "ابحث عن كل مساعدة قريبة",
    "ask.working": "جارٍ البحث عن كل مساعدة قريبة…",
    "ask.consent":
      "أفهم أن Auxilium سيحذف اسم عائلتي وعنواني وصاحب عملي ورقم قضيتي قبل إنتاج أي إحالة. أنا أتحكم في كل إرسال. Auxilium لا يلمس الأموال أبدًا.",
  },
  "ru": {
    "voice.toggle.on": "Голос включён",
    "voice.toggle.off": "Голос отключён",
    "voice.speak": "Говорить",
    "voice.stop": "Остановить",
    "voice.listening": "Слушаю",
    "voice.placeholder": "Слушаю… говорите",
    "compose.send": "Отправить",
    "compose.skip": "Пропустить",
    "compose.startOver": "Начать заново",
    "compose.placeholder": "Введите ваш ответ…",
    "compose.disclaimer":
      "Информация, а не юридический совет. Сохранено только на вашем устройстве.",
    "matter.heading": "Вот что у нас есть для вас.",
    "ask.title": "Отправьте пакет всем, кто должен помочь.",
    "ask.cta": "Найти всю помощь поблизости",
    "ask.working": "Ищем всю помощь поблизости…",
    "ask.consent":
      "Я понимаю, что Auxilium удалит мою фамилию, адрес, работодателя и номер дела перед созданием любого направления. Я контролирую каждую отправку. Auxilium никогда не касается денег.",
  },
  "pt-BR": {
    "voice.toggle.on": "Voz ativada",
    "voice.toggle.off": "Voz desativada",
    "voice.speak": "Falar",
    "voice.stop": "Parar",
    "voice.listening": "Escutando",
    "voice.placeholder": "Escutando… fale agora",
    "compose.send": "Enviar",
    "compose.skip": "Pular",
    "compose.startOver": "Recomeçar",
    "compose.placeholder": "Digite sua resposta…",
    "compose.disclaimer":
      "Informação, não aconselhamento jurídico. Salvo apenas no seu dispositivo.",
    "matter.heading": "Aqui está o que temos para você.",
    "ask.title": "Envie o pacote para todos que deveriam ajudar.",
    "ask.cta": "Encontre toda ajuda próxima",
    "ask.working": "Procurando toda ajuda próxima…",
    "ask.consent":
      "Entendo que o Auxilium removerá meu sobrenome, endereço, empregador e número do caso antes de produzir qualquer encaminhamento. Eu controlo cada envio. O Auxilium nunca toca no dinheiro.",
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
