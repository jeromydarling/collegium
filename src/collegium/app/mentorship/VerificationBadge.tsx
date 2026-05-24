import { useState } from "react";
import { ShieldCheck, ExternalLink, Plus } from "lucide-react";
import { demoStore } from "../../lib/demoStore";
import type { PairOutcome, OutcomeVerification } from "../../data/demo";

/**
 * Verification badge for a PairOutcome. Shows a green stamp when
 * verified (with deep link to the source), or a "Verify" affordance
 * with a small form when not. The form lets a steward pick the source,
 * paste the reference URL/identifier, drop an optional note.
 *
 * Verification sources include:
 *   - State bar lookup (links to the state's online lookup page)
 *   - Court appointment list (judicial clerkships)
 *   - Law-firm website (first-job confirmation)
 *   - LinkedIn (employer verification)
 *   - Publication DOI (publications)
 *   - Self-reported (mentee told us)
 *   - Steward-confirmed (steward eyes-on)
 */

const STATE_BAR_LINKS: Record<string, { name: string; url: string }> = {
  IL: { name: "IL ARDC", url: "https://www.iardc.org/lawyersearch.aspx" },
  NY: { name: "NY OCA", url: "https://iapps.courts.state.ny.us/attorneyservices/search" },
  CA: { name: "CA Bar", url: "https://apps.calbar.ca.gov/attorney/Licensee/Search" },
  TX: { name: "TX Bar", url: "https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer" },
  MA: { name: "MA BBO", url: "https://www.massbbo.org/s/aab" },
  DC: { name: "DC Bar", url: "https://www.dcbar.org/membership/membership-information/find-a-member" },
};

export function VerificationBadge({ outcome }: { outcome: PairOutcome }) {
  const [formOpen, setFormOpen] = useState(false);

  if (outcome.verification) {
    const v = outcome.verification;
    return (
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[hsl(145_40%_28%)]">
        <ShieldCheck size={12} />
        <span className="font-medium uppercase tracking-widest">Verified</span>
        <span className="text-[hsl(var(--c-slate-soft))] normal-case font-normal">
          · {labelForSource(v.source)}
          {v.verifiedBy && ` · by ${v.verifiedBy}`}
        </span>
        {v.reference && (
          <a
            href={v.reference}
            target="_blank"
            rel="noopener"
            className="collegium-link inline-flex items-center gap-0.5"
          >
            view <ExternalLink size={9} />
          </a>
        )}
        <button
          type="button"
          onClick={() => demoStore.unverifyOutcome(outcome.id)}
          className="ml-auto text-[10px] text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-wine))]"
          title="Remove verification (demo)"
        >
          remove
        </button>
      </div>
    );
  }

  if (formOpen) {
    return <VerifyForm outcome={outcome} onClose={() => setFormOpen(false)} />;
  }

  // Suggest the right verification path for the outcome kind
  const suggestion = suggestSource(outcome);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="collegium-link inline-flex items-center gap-1"
      >
        <Plus size={11} /> Verify this outcome
      </button>
      {suggestion && (
        <a
          href={suggestion.url}
          target="_blank"
          rel="noopener"
          className="collegium-link text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1"
        >
          → {suggestion.label} <ExternalLink size={9} />
        </a>
      )}
    </div>
  );
}

function VerifyForm({
  outcome,
  onClose,
}: {
  outcome: PairOutcome;
  onClose: () => void;
}) {
  const [source, setSource] = useState<OutcomeVerification["source"]>(
    defaultSourceFor(outcome.kind)
  );
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  function submit() {
    demoStore.verifyOutcome(outcome.id, {
      source,
      reference: reference.trim() || undefined,
      note: note.trim() || undefined,
      verifiedBy: "You (this session)",
      verifiedAt: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div className="mt-2 rounded-md bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] p-3 space-y-2">
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Source
          </span>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as OutcomeVerification["source"])
            }
            className="w-full text-xs py-1 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
          >
            <option value="state-bar-lookup">State bar lookup</option>
            <option value="court-appointment-list">Court appointment list</option>
            <option value="law-firm-website">Law firm website</option>
            <option value="linkedin">LinkedIn</option>
            <option value="publication-doi">Publication DOI</option>
            <option value="self-reported">Self-reported</option>
            <option value="steward-confirmed">Steward confirmed</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Reference URL / ID
          </span>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="https://… or bar #"
            className="w-full text-xs py-1 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Note
        </span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='e.g. "Active status, no discipline"'
          className="w-full text-xs py-1 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
        />
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="collegium-btn-ghost text-[11px]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          className="collegium-btn-primary text-[11px]"
        >
          Record verification
        </button>
      </div>
    </div>
  );
}

function labelForSource(s: OutcomeVerification["source"]): string {
  const map: Record<OutcomeVerification["source"], string> = {
    "state-bar-lookup": "state bar lookup",
    "court-appointment-list": "court appointment list",
    "law-firm-website": "law firm website",
    linkedin: "LinkedIn",
    "publication-doi": "DOI",
    "self-reported": "self-reported",
    "steward-confirmed": "steward confirmed",
  };
  return map[s];
}

function suggestSource(o: PairOutcome): { label: string; url: string } | null {
  if (o.kind === "bar-passed" || o.kind === "bar-failed") {
    // Try to detect state from detail
    const detailLower = o.detail.toLowerCase();
    for (const [code, info] of Object.entries(STATE_BAR_LINKS)) {
      if (
        detailLower.includes(info.name.toLowerCase()) ||
        detailLower.includes(` ${code.toLowerCase()} `) ||
        detailLower.includes(`${code.toLowerCase()} bar`)
      ) {
        return { label: `Look up at ${info.name}`, url: info.url };
      }
    }
    return null;
  }
  if (o.kind === "first-job" || o.kind === "judicial-clerkship") {
    return null;
  }
  return null;
}

function defaultSourceFor(
  kind: PairOutcome["kind"]
): OutcomeVerification["source"] {
  switch (kind) {
    case "bar-passed":
    case "bar-failed":
      return "state-bar-lookup";
    case "judicial-clerkship":
      return "court-appointment-list";
    case "first-job":
    case "partnership-offered":
    case "partnership-track":
      return "law-firm-website";
    case "publication":
      return "publication-doi";
    default:
      return "steward-confirmed";
  }
}
