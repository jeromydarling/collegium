import { useState } from "react";
import { PhoneCall, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";

/**
 * Pre-call coaching — the agent-1 finding that "the first call is often
 * to the landlord or creditor, before any legal step" turned into a
 * field-guide module. Tells the user what to say, what NOT to sign, and
 * what to write down DURING the call.
 *
 * Information, not advice. Procedural common-sense — what a court
 * self-help center clerk might tell you before you walk out of the
 * building.
 */

const COACHING: Record<
  string,
  {
    title: string;
    intro: string;
    say: string[];
    dontSay: string[];
    write: string[];
    signs: string[];
  }
> = {
  eviction: {
    title: "Before you call (or are called by) the landlord",
    intro:
      "Landlords usually try to settle before going to court. That's not generosity — it's cheaper for them. The conversation can save or sink your case. Walk in ready.",
    say: [
      "I want to fix this. Can you tell me what you need from me, in writing?",
      "I have some questions. Can I get back to you tomorrow after I look at my lease?",
      "I'd like to record this conversation, or I can take notes. Which do you prefer?",
    ],
    dontSay: [
      "Anything that admits you owe a specific amount, even loosely (\"I know I'm two months behind\"). Numbers in your voice become numbers in court.",
      "Anything that admits the apartment is fine if it isn't. (\"Yeah, it's mostly OK\" can torch a habitability defense.)",
      "Any promise you can't keep. \"I'll have all the money next Friday\" becomes evidence if Friday comes and goes.",
    ],
    write: [
      "The date and time of the call.",
      "Who said what, in their words — exact phrases if you can.",
      "Anything they offered (cash for keys, move-out date, payment plan, time).",
      "Anything they threatened (eviction filing, lockout, calling police, calling ICE — illegal but happens).",
    ],
    signs: [
      "A cash-for-keys agreement that waives your right to file an Answer.",
      "A confession of judgment — sometimes hidden in a payment plan.",
      "Any document handed to you that you haven't had time to read or have someone else review.",
    ],
  },
  debt: {
    title: "Before you call (or are called by) the debt collector",
    intro:
      "Most consumer debt cases settle on the phone. Most of those settlements are worse than the person had to accept. Federal law (FDCPA) gives you specific rights — but only if you exercise them.",
    say: [
      "Please send me written verification of this debt. Federal law says I'm entitled to it.",
      "I need to think about this. Please don't call again until I've had a chance to respond in writing.",
      "I'd like to record this call, or take notes. Which do you prefer?",
    ],
    dontSay: [
      "Anything that confirms the debt is yours before you've seen written proof. (\"Yes, that was my account\" can restart the statute of limitations clock in many states.)",
      "Any partial-payment promise. Even a $1 payment can revive an old debt past its statute of limitations.",
      "Your bank-account or employer information. They can use either to garnish later.",
    ],
    write: [
      "The collector's name, the original creditor, and the amount.",
      "Whether they've sued or are threatening to sue (different stages, different deadlines).",
      "Any time-pressure tactics (\"if you don't agree today\") — those are red flags.",
    ],
    signs: [
      "Any agreement that revives a time-barred debt by getting you to promise a payment.",
      "A consent judgment — gives them the same rights as winning at trial.",
      "Automatic withdrawal authorization from your bank account.",
    ],
  },
  family: {
    title: "Before you call the other party (or their lawyer)",
    intro:
      "In family court, anything you say becomes a tool either side can use. Don't speak in anger. Don't speak alone if there's been violence. Write everything down.",
    say: [
      "I'm not able to discuss this right now. I'll respond in writing through email.",
      "If asked about the children: \"They're well. I'll communicate about scheduling through our parenting app/email.\"",
    ],
    dontSay: [
      "Anything about new relationships, jobs, money, or living situations on the phone.",
      "Anything about \"giving up\" custody, visitation, or support, even casually.",
      "Anything you wouldn't want a judge to read printed out.",
    ],
    write: [
      "Every interaction with the other party — date, time, what was said.",
      "Every time the other party hurt or threatened you or the children.",
      "Every missed visit, missed payment, missed exchange.",
    ],
    signs: [
      "Any document the other party hands you to sign without time to consult a lawyer.",
      "Any agreement about custody, support, or property reached over text without legal review.",
    ],
  },
};

export function PreCallCoaching({ matterType }: { matterType: string }) {
  const coaching = COACHING[matterType];
  const [open, setOpen] = useState(false);
  if (!coaching) return null;

  return (
    <article className="collegium-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-[hsl(var(--c-cream-warm))] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
            <PhoneCall size={16} />
          </div>
          <div className="min-w-0">
            <div className="collegium-latin text-[10px] text-[hsl(var(--c-wine))]">
              Antequam vocas
            </div>
            <h3 className="collegium-display text-lg leading-tight">
              {coaching.title}
            </h3>
          </div>
        </div>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[hsl(var(--c-border))]">
          <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-5">
            {coaching.intro}
          </p>

          <CoachSection
            label="Phrases worth using"
            items={coaching.say}
            color="success"
          />
          <CoachSection
            label="What not to say"
            items={coaching.dontSay}
            color="warning"
          />
          <CoachSection
            label="What to write down during the call"
            items={coaching.write}
            color="neutral"
          />
          <CoachSection
            label="What not to sign, on the spot"
            items={coaching.signs}
            color="warning"
            warning
          />
        </div>
      )}
    </article>
  );
}

function CoachSection({
  label,
  items,
  color,
  warning,
}: {
  label: string;
  items: string[];
  color: "success" | "warning" | "neutral";
  warning?: boolean;
}) {
  const ring =
    color === "success"
      ? "border-l-[hsl(145_30%_42%)]"
      : color === "warning"
      ? "border-l-[hsl(8_55%_52%)]"
      : "border-l-[hsl(var(--c-gold))]";
  return (
    <div className="mb-5 last:mb-0">
      <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate))] mb-2 font-semibold flex items-center gap-1.5">
        {warning && <AlertTriangle size={11} className="text-[hsl(8_55%_42%)]" />}
        {label}
      </h4>
      <ul className={`space-y-1.5 border-l-2 pl-3 ${ring}`}>
        {items.map((item, i) => (
          <li key={i} className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
