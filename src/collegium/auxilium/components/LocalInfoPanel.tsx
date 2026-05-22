import { useEffect, useState } from "react";
import { Search, ExternalLink, Loader, AlertCircle, Sparkles } from "lucide-react";
import {
  runPerplexityQuery,
  fillJurisdiction,
  type PerplexityAnswer,
} from "../lib/perplexity";
import type { Jurisdiction } from "./JurisdictionPicker";

/**
 * A single live-info panel. Renders a Perplexity-grounded answer with
 * citations. Caches per (queryKey + jurisdiction) so we don't re-fetch on
 * every render. The mock implementation simulates a 600ms delay so the
 * loading state is honest and visible.
 */
export function LocalInfoPanel({
  queryKey,
  promptTemplate,
  jurisdiction,
}: {
  queryKey: string;
  promptTemplate: string;
  jurisdiction: Jurisdiction;
}) {
  const [answer, setAnswer] = useState<PerplexityAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasJurisdiction = Boolean(jurisdiction.state);
  const prompt = fillJurisdiction(promptTemplate, jurisdiction);

  useEffect(() => {
    if (!hasJurisdiction) {
      setAnswer(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    runPerplexityQuery(prompt, controller.signal)
      .then((res) => setAnswer(res))
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e?.message ?? e));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
    // Re-run when jurisdiction changes or the prompt template changes.
  }, [prompt, hasJurisdiction]);

  // Pull the headline (first sentence) from the prompt for the panel title.
  const headline = humanQuestionFor(queryKey);

  return (
    <article className="collegium-card overflow-hidden">
      <header className="px-4 sm:px-5 py-3 border-b border-[hsl(var(--c-border))] flex items-center gap-2 bg-[hsl(var(--c-cream-warm))]">
        <Search size={14} className="text-[hsl(var(--c-wine))] shrink-0" />
        <h4 className="font-medium text-sm text-[hsl(var(--c-ink))] flex-1 leading-tight">
          {headline}
        </h4>
        {answer?.source === "mock" && (
          <span className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
            sample
          </span>
        )}
      </header>
      <div className="p-4 sm:p-5">
        {!hasJurisdiction && (
          <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
            Choose your state above to look this up for your jurisdiction.
          </p>
        )}
        {hasJurisdiction && loading && (
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--c-slate-soft))]">
            <Loader size={14} className="animate-spin" />
            Looking this up against current sources…
          </div>
        )}
        {hasJurisdiction && error && (
          <div className="flex items-start gap-2 text-sm text-[hsl(8_55%_42%)]">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Couldn't reach the source.</div>
              <div className="text-xs">{error}</div>
            </div>
          </div>
        )}
        {hasJurisdiction && answer && !loading && (
          <>
            <p className="text-sm sm:text-base text-[hsl(var(--c-slate))] leading-relaxed">
              {answer.answer}
            </p>
            {answer.citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[hsl(var(--c-border))]">
                <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2 flex items-center gap-1.5">
                  <Sparkles size={10} /> Sources
                </div>
                <ul className="space-y-1.5">
                  {answer.citations.map((c, i) => (
                    <li key={i}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[hsl(var(--c-wine))] underline decoration-[hsl(var(--c-gold)/0.5)] underline-offset-2 hover:decoration-[hsl(var(--c-wine))] inline-flex items-baseline gap-1 break-words"
                      >
                        {c.title || c.url}
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-3">
              Information, not legal advice. Verify against the cited sources
              and confirm with a licensed attorney before acting.
            </p>
          </>
        )}
      </div>
    </article>
  );
}

function humanQuestionFor(key: string): string {
  switch (key) {
    case "notice-period":
      return "How much notice is the landlord required to give?";
    case "answer-deadline":
      return "How long do I have to file an Answer after I'm served?";
    case "rental-assistance":
      return "What rental-assistance funds are open in my area?";
    case "right-to-counsel":
      return "Does my city guarantee a free lawyer in eviction cases?";
    case "legal-aid":
      return "Which legal-aid organizations serve tenants near me?";
    default:
      return "Local information";
  }
}
