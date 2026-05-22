import { Globe } from "lucide-react";
import { useLocale, LOCALES, type LocaleCode } from "../lib/locale";

/**
 * A compact dropdown that picks the active Auxilium locale. The
 * persistent store in locale.ts notifies every subscribing component
 * (interview, matter file, find-help, voice controller) so the
 * language change propagates everywhere — TTS lang switches to the new
 * BCP-47 code, static strings re-render, and DeepL translates dynamic
 * content for the next call.
 */
export function LanguagePicker({
  variant = "default",
}: {
  variant?: "default" | "dark";
}) {
  const [locale, setLocale] = useLocale();
  const dark = variant === "dark";
  return (
    <label
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium ${
        dark
          ? "bg-[hsl(220_30%_12%)] text-[hsl(40_30%_88%)] border-[hsl(220_20%_28%)]"
          : "bg-white text-[hsl(var(--c-slate))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
      }`}
      title="Change language"
    >
      <Globe size={12} className={dark ? "text-[hsl(38_60%_70%)]" : "text-[hsl(var(--c-wine))]"} />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className={`bg-transparent border-0 focus:outline-none text-xs ${
          dark ? "text-[hsl(40_30%_88%)]" : "text-[hsl(var(--c-slate))]"
        }`}
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
