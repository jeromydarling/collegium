import { useState } from "react";
import {
  HeartHandshake,
  Mail,
  Copy,
  Check,
  Loader,
  ExternalLink,
  ShieldCheck,
  Building2,
  Send,
} from "lucide-react";
import type { MatterFile } from "../lib/aiClient";
import {
  findAllCharitableHelp,
  type CharityHit,
  type CharityKind,
} from "../lib/findCharity";
import {
  buildGoFundMeDraft,
  buildReferralEmailBody,
} from "../lib/gofundmeDraft";

/**
 * Bring the harvest in.
 *
 * "One mass 'help me' email to the people who are SUPPOSED to help."
 *
 * Auxilium queries Perplexity in parallel for the closest local
 * contact in every charitable + legal-aid network we've tracked: SVdP
 * conferences, Knights of Columbus councils, Catholic Charities
 * diocesan agencies, Lutheran Social Services + Global Refuge,
 * Christian Legal Aid (CLS) clinics, CLINIC affiliates, World Relief
 * Legal Support Network, Administer Justice Gospel Justice Centers,
 * Salvation Army corps. Renders a single packet the user can send to
 * the whole group at once.
 *
 * GoFundMe draft is the public-facing path that runs in parallel.
 *
 * Auxilium never touches money. Every send is the user's.
 */
export function AskForHelp({
  matter,
  jurisdiction,
}: {
  matter: MatterFile;
  jurisdiction: { city?: string; state?: string };
}) {
  const [firstName, setFirstName] = useState(
    matter.story.match(/\b(?:my name is|name is|i'm|im|i am)\s+([A-Z][a-z]+)/i)?.[1] || ""
  );
  const [goal, setGoal] = useState(0);
  const [needSummary, setNeedSummary] = useState("");
  const [consented, setConsented] = useState(false);
  const [working, setWorking] = useState(false);
  const [hits, setHits] = useState<Record<CharityKind, CharityHit> | null>(null);
  const [selected, setSelectedSet] = useState<Set<CharityKind>>(
    new Set([
      "svdp",
      "kofc",
      "catholic-charities",
      "lutheran",
      "cls",
      "administer-justice",
      "salvation-army",
    ])
  );

  const canRun =
    consented &&
    firstName.trim() &&
    goal > 0 &&
    needSummary.trim() &&
    Boolean(jurisdiction.city || jurisdiction.state);

  async function run() {
    if (!canRun) return;
    setWorking(true);
    try {
      const result = await findAllCharitableHelp({
        city: jurisdiction.city ?? "",
        state: jurisdiction.state ?? "",
      });
      setHits(result);
    } finally {
      setWorking(false);
    }
  }

  function toggle(k: CharityKind) {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  // Build the unified mass-send email: the body is a single packet,
  // the TO line is every selected network's email (when known), and
  // a single Subject.
  function buildMassMailto(): { mailto: string; recipientCount: number; copyText: string } {
    if (!hits) return { mailto: "", recipientCount: 0, copyText: "" };
    const recipients: string[] = [];
    for (const k of selected) {
      const h = hits[k];
      if (h?.email) recipients.push(h.email);
    }
    // Use the SVdP body as the canonical text (it's the gentlest framing).
    const { subject, body } = buildReferralEmailBody({
      matter,
      firstName,
      county: jurisdiction.city,
      state: jurisdiction.state,
      goalDollars: goal,
      needSummary,
      kind: "svdp",
    });
    const sentTo = [...selected]
      .map((k) => `  • ${hits[k]?.network}`)
      .join("\n");
    const fullBody =
      body +
      `\n\n--- This referral is being sent in parallel to:\n${sentTo}\n` +
      `Auxilium does not handle any disbursement. Each organization will reach ` +
      `out to ${firstName} directly per their established intake.\n`;
    const mailto = `mailto:${recipients.join(",")}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(fullBody)}`;
    return {
      mailto,
      recipientCount: selected.size,
      copyText: `To: ${recipients.join(", ") || "[fill in addresses]"}\nSubject: ${subject}\n\n${fullBody}`,
    };
  }

  const mass = hits ? buildMassMailto() : null;

  return (
    <article className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-xl overflow-hidden">
      <header className="px-5 sm:px-6 py-4 border-b border-[hsl(var(--c-border))] bg-white/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
            <HeartHandshake size={18} />
          </div>
          <div>
            <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
              Concurrentes · Bring the harvest in
            </div>
            <h3 className="collegium-display text-xl sm:text-2xl leading-tight">
              Send the packet to everyone who's supposed to help.
            </h3>
            <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1 leading-relaxed">
              Auxilium will look up the closest St. Vincent de Paul, Knights
              of Columbus, Catholic Charities, Lutheran services, Christian
              Legal Aid clinic, CLINIC affiliate, World Relief, Administer
              Justice, and Salvation Army. One email packet. One send.
              Auxilium never touches money.
            </p>
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Inputs */}
        <div className="grid sm:grid-cols-[1fr_8rem] gap-3 sm:gap-4">
          <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))]">
            First name (the only name that leaves your device)
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g., Maria"
              className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))]">
            Dollar need
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--c-slate-soft))]">
                $
              </span>
              <input
                type="number"
                value={goal || ""}
                onChange={(e) => setGoal(parseInt(e.target.value, 10) || 0)}
                placeholder="250"
                className="w-full pl-7 pr-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
              />
            </div>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))]">
          What the dollars are for — be specific, itemize
          <textarea
            value={needSummary}
            onChange={(e) => setNeedSummary(e.target.value)}
            rows={3}
            placeholder="e.g., $75 filing fee for the answer; $80 transit and parking for two court dates; $120 daycare for the hearing day."
            className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
          />
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[hsl(var(--c-wine))]"
          />
          <span className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
            I understand: Auxilium will redact my surname, address, employer,
            and case number before producing any referral. I am in control of
            every send. Auxilium never touches the money.
          </span>
        </label>

        <button
          onClick={run}
          disabled={!canRun || working}
          className="collegium-btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {working ? (
            <>
              <Loader size={14} className="animate-spin" /> Looking up every nearby help…
            </>
          ) : (
            <>
              <Building2 size={14} /> Find every nearby help
            </>
          )}
        </button>

        {/* Results */}
        {hits && (
          <div className="space-y-4 pt-3 border-t border-[hsl(var(--c-border))]">
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))]">
              Nine networks looked up. Pick which to include.
            </div>

            <ul className="space-y-2">
              {(Object.keys(hits) as CharityKind[]).map((k) => (
                <NetworkRow
                  key={k}
                  hit={hits[k]}
                  selected={selected.has(k)}
                  onToggle={() => toggle(k)}
                />
              ))}
            </ul>

            {mass && (
              <MassSendPanel
                mailto={mass.mailto}
                copyText={mass.copyText}
                count={mass.recipientCount}
              />
            )}

            <hr className="border-[hsl(var(--c-border))]" />

            <GoFundMeCard
              draft={buildGoFundMeDraft({
                matter,
                firstName,
                goalDollars: goal,
                county: jurisdiction.city,
                needSummary,
              })}
            />

            <aside className="bg-white border border-[hsl(var(--c-border))] rounded-md p-4 flex items-start gap-2.5">
              <ShieldCheck
                size={14}
                className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
              />
              <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">
                <strong>What you're sending.</strong> First name, city/state,
                dollar need, and your situation in your own words — PII
                removed. Each organization will reach out to you directly
                through their existing intake process. Auxilium does not
                handle the money. As the Collegium chapter network grows,
                local guild members will also receive this packet.
              </p>
            </aside>
          </div>
        )}
      </div>
    </article>
  );
}

function NetworkRow({
  hit,
  selected,
  onToggle,
}: {
  hit: CharityHit;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={`block bg-white border rounded-md p-3 sm:p-4 cursor-pointer transition-colors ${
          selected
            ? "border-[hsl(var(--c-wine))] ring-1 ring-[hsl(var(--c-wine)/0.3)]"
            : "border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="mt-1 w-4 h-4 accent-[hsl(var(--c-wine))] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-medium text-sm text-[hsl(var(--c-ink))] leading-tight">
                {hit.network}
              </h4>
              <div className="flex gap-1.5 shrink-0">
                {hit.emergencyAid && (
                  <span className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold px-1.5 py-0.5 rounded bg-[hsl(var(--c-wine)/0.08)]">
                    Aid
                  </span>
                )}
                {hit.legalAid && (
                  <span className="text-[9px] uppercase tracking-widest text-[hsl(38_55%_28%)] font-semibold px-1.5 py-0.5 rounded bg-[hsl(38_55%_50%/0.12)]">
                    Legal
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed mb-2">
              {hit.intake}
            </p>
            {hit.citations.length > 0 && (
              <a
                href={hit.citations[0].url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-[hsl(var(--c-wine))] underline decoration-dotted underline-offset-2 inline-flex items-baseline gap-1"
              >
                {hit.citations[0].title || hit.citations[0].url}
                <ExternalLink size={10} className="shrink-0" />
              </a>
            )}
          </div>
        </div>
      </label>
    </li>
  );
}

function MassSendPanel({
  mailto,
  copyText,
  count,
}: {
  mailto: string;
  copyText: string;
  count: number;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }
  return (
    <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] rounded-md p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <Send size={16} className="text-[hsl(38_60%_70%)] mt-0.5 shrink-0" />
        <div>
          <h4 className="collegium-display text-lg text-[hsl(40_40%_94%)] leading-tight">
            One email. {count} {count === 1 ? "network" : "networks"}.
          </h4>
          <p className="text-xs text-[hsl(40_20%_82%)] mt-1 leading-relaxed">
            Opens your email client with the full packet pre-filled and every
            selected network's contact in the TO line. For networks that
            don't publish a public email, copy the packet and forward it to
            their intake phone or web form.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={mailto}
          className="inline-flex items-center gap-1.5 bg-[hsl(38_60%_60%)] text-[hsl(220_30%_10%)] rounded-full px-4 py-2 text-xs font-medium hover:bg-[hsl(38_60%_70%)] transition-colors"
        >
          <Mail size={12} /> Open in email
        </a>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 bg-transparent text-[hsl(40_30%_88%)] border border-[hsl(220_20%_30%)] rounded-full px-4 py-2 text-xs font-medium hover:border-[hsl(38_60%_60%)]"
        >
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy the packet
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function GoFundMeCard({
  draft,
}: {
  draft: ReturnType<typeof buildGoFundMeDraft>;
}) {
  const [copied, setCopied] = useState(false);
  const full = `TITLE\n${draft.title}\n\nSHORT BLURB\n${draft.shortBlurb}\n\nGOAL\n$${draft.goalDollars}\n\nSTORY\n${draft.story}`;
  function copy() {
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }
  return (
    <div className="bg-white border border-[hsl(var(--c-border))] rounded-md overflow-hidden">
      <header className="px-4 py-3 border-b border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream-warm))] flex items-center justify-between gap-2">
        <h4 className="font-medium text-sm text-[hsl(var(--c-ink))] leading-tight">
          GoFundMe draft — for sharing publicly
        </h4>
        <span className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
          You publish
        </span>
      </header>
      <div className="p-4">
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
          For people who want to share their story on Facebook or with their
          own community. PII already redacted. Edit anything you want before
          you publish.
        </p>
        <div className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-md p-3 text-[11px] font-mono whitespace-pre-wrap text-[hsl(var(--c-slate))] mb-3 max-h-72 overflow-y-auto">
          <strong className="block mb-1">Title:</strong>
          {draft.title}
          <strong className="block mt-3 mb-1">Goal:</strong>${draft.goalDollars}
          <strong className="block mt-3 mb-1">Story:</strong>
          {draft.story}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="collegium-btn-primary inline-flex items-center gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy the draft
              </>
            )}
          </button>
          <a
            href="https://www.gofundme.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="collegium-btn-ghost inline-flex items-center gap-1.5 text-xs"
          >
            Open GoFundMe <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
