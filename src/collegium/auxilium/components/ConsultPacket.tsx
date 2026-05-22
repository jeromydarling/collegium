import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { type EvictionGuide } from "../data/eviction";
import type { Jurisdiction } from "./JurisdictionPicker";

/**
 * The consult packet — a single block of text the user can copy and bring
 * to any clinic appointment, screenshot from their phone, or print. It
 * reads like a one-page brief: who, what, where, what they've gathered,
 * what they want to know. This is the "save them a ton of money" piece.
 */
export function ConsultPacket({
  guide,
  jurisdiction,
}: {
  guide: EvictionGuide;
  jurisdiction: Jurisdiction;
}) {
  const [copied, setCopied] = useState(false);

  const STORAGE_KEY = `auxilium_docs_${guide.slug}`;
  let checked: string[] = [];
  try {
    checked = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    /* ignore */
  }

  const docsGot = guide.documents.filter((d) => checked.includes(d.key));
  const docsMissing = guide.documents.filter((d) => !checked.includes(d.key));

  const packet = buildPacket({
    guide,
    jurisdiction,
    docsGot,
    docsMissing,
  });

  function copy() {
    navigator.clipboard.writeText(packet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4 sm:mb-5">
        When you sit down with a volunteer attorney, hand them this — or
        text it to them — and the first ten minutes are already done.
      </p>
      <div className="collegium-card overflow-hidden">
        <header className="px-4 sm:px-5 py-3 border-b border-[hsl(var(--c-border))] flex items-center justify-between bg-[hsl(var(--c-cream-warm))]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[hsl(var(--c-gold))]" />
            <h4 className="font-medium text-sm text-[hsl(var(--c-ink))]">
              Your consult packet
            </h4>
          </div>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--c-wine))] hover:text-[hsl(var(--c-wine-deep))]"
          >
            {copied ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </header>
        <pre className="p-4 sm:p-5 text-[13px] leading-relaxed whitespace-pre-wrap text-[hsl(var(--c-slate))] font-mono overflow-x-auto">
{packet}
        </pre>
      </div>
    </div>
  );
}

function buildPacket({
  guide,
  jurisdiction,
  docsGot,
  docsMissing,
}: {
  guide: EvictionGuide;
  jurisdiction: Jurisdiction;
  docsGot: typeof guide.documents;
  docsMissing: typeof guide.documents;
}): string {
  const loc =
    jurisdiction.city && jurisdiction.state
      ? `${jurisdiction.city}, ${jurisdiction.state}`
      : jurisdiction.state || "[location not set]";

  const lines: string[] = [];
  lines.push(`MATTER: ${guide.title}`);
  lines.push(`LOCATION: ${loc}`);
  lines.push("");
  lines.push("WHAT I'M FACING:");
  lines.push("  " + guide.overview[0].split(".")[0] + ".");
  lines.push("");
  lines.push("DOCUMENTS I HAVE WITH ME:");
  if (docsGot.length === 0) {
    lines.push("  (none yet — gathering)");
  } else {
    for (const d of docsGot) lines.push("  • " + d.label);
  }
  if (docsMissing.length > 0) {
    lines.push("");
    lines.push("STILL GATHERING:");
    for (const d of docsMissing) lines.push("  • " + d.label);
  }
  lines.push("");
  lines.push("QUESTIONS I WANT TO ASK:");
  guide.consultQuestions.forEach((q, i) => {
    lines.push(`  ${i + 1}. ${q.q}`);
  });
  lines.push("");
  lines.push("Prepared with Auxilium · auxilium is information, not legal advice.");
  return lines.join("\n");
}
