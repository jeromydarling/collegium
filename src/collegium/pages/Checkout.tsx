import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  KeyRound,
  AlertTriangle,
  ChevronLeft,
  Check,
} from "lucide-react";
import {
  getPaymentLinks,
  setPaymentLink,
  hasPaymentLink,
  STRIPE_DEMO_LINKS,
} from "../lib/billing/settings";
import {
  PLAN_LABEL,
  PLAN_MONTHLY_USD,
  type PlanTier,
} from "../data/tenants";

const PLAN_ORDER: PlanTier[] = [
  "personal-pro",
  "chapter",
  "network",
  "institution",
  "enterprise",
];

/**
 * Checkout entry point — handles /checkout?plan=X.
 *
 * If a Payment Link is configured for the requested plan, we redirect to
 * Stripe immediately. If not, we show the configuration surface so the
 * owner can paste their Payment Link URLs (one per plan). Same pattern as
 * the Claude credentials integration — keys live in localStorage, nothing
 * leaves the browser until the actual Stripe redirect fires.
 */
export function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = (searchParams.get("plan") as PlanTier) || "network";
  const links = getPaymentLinks();
  const [showConfig, setShowConfig] = useState(!hasPaymentLink(plan));
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (hasPaymentLink(plan) && !showConfig) {
      const url = links[plan];
      if (url) {
        setRedirecting(true);
        // brief delay so the user sees the redirect notice
        const t = setTimeout(() => {
          window.location.href = url;
        }, 600);
        return () => clearTimeout(t);
      }
    }
  }, [plan, links, showConfig]);

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          to="/pricing"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-4"
        >
          <ChevronLeft size={12} /> All tiers
        </Link>

        <div className="mb-6">
          <div className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-1">
            Checkout
          </div>
          <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
            Subscribing to {PLAN_LABEL[plan] ?? plan}
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
            ${PLAN_MONTHLY_USD[plan]}/month · Cancel any time from your billing portal.
          </p>
        </div>

        {redirecting && (
          <div className="collegium-card p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-[hsl(var(--c-wine))] mb-3">
              <ExternalLink size={16} />
              <span className="text-sm font-semibold">
                Redirecting to Stripe…
              </span>
            </div>
            <p className="text-xs text-[hsl(var(--c-slate-soft))]">
              If nothing happens,{" "}
              <a
                href={links[plan]}
                className="collegium-link"
                rel="noopener noreferrer"
              >
                click here to continue.
              </a>
            </p>
          </div>
        )}

        {!redirecting && showConfig && <PaymentLinksPanel selectedPlan={plan} />}

        {!redirecting && !showConfig && (
          <div className="collegium-card p-6 text-center">
            <p className="text-sm text-[hsl(var(--c-slate-soft))]">
              Subscription configured. You'll be sent to Stripe in a moment.
            </p>
            <button
              type="button"
              onClick={() => navigate(0)}
              className="text-xs collegium-link mt-3 inline-flex items-center gap-1"
            >
              Reload <ArrowRight size={11} />
            </button>
          </div>
        )}

        <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-8 text-center leading-relaxed">
          After payment, Stripe will redirect you to <span className="font-mono">/onboarding</span>{" "}
          to set up your tenant — branding, members, jurisdictions, fee ladder.
        </p>
      </div>
    </div>
  );
}

function PaymentLinksPanel({ selectedPlan }: { selectedPlan: PlanTier }) {
  const [links, setLinks] = useState<Partial<Record<PlanTier, string>>>(getPaymentLinks());
  const [savedFlash, setSavedFlash] = useState<PlanTier | null>(null);

  function handleSave(plan: PlanTier, url: string) {
    setPaymentLink(plan, url);
    setLinks(getPaymentLinks());
    setSavedFlash(plan);
    setTimeout(() => setSavedFlash(null), 1500);
  }

  function loadDemo() {
    for (const [plan, url] of Object.entries(STRIPE_DEMO_LINKS)) {
      setPaymentLink(plan as PlanTier, url);
    }
    setLinks(getPaymentLinks());
  }

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-start gap-2 text-[hsl(var(--c-wine))] mb-3">
        <KeyRound size={14} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <h2 className="collegium-display text-xl leading-tight mb-1">
            Stripe Payment Links
          </h2>
          <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">
            Create one Stripe Payment Link per tier in your Stripe dashboard
            (Products → Pricing → Create payment link), paste the URLs below.
            Buttons on the pricing page will redirect to the matching link.
          </p>
        </div>
      </div>

      {!hasPaymentLink(selectedPlan) && (
        <div className="bg-[hsl(38_55%_50%/0.10)] border border-[hsl(38_55%_50%/0.30)] rounded p-3 text-xs text-[hsl(38_55%_28%)] flex items-start gap-2 mb-4">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            No Payment Link configured yet for{" "}
            <strong>{PLAN_LABEL[selectedPlan]}</strong>. Add one below or{" "}
            <button
              type="button"
              onClick={loadDemo}
              className="underline font-semibold"
            >
              load demo links
            </button>{" "}
            to see the redirect flow.
          </span>
        </div>
      )}

      <div className="space-y-3">
        {PLAN_ORDER.map((plan) => (
          <PaymentLinkRow
            key={plan}
            plan={plan}
            value={links[plan] ?? ""}
            saved={savedFlash === plan}
            highlighted={plan === selectedPlan}
            onSave={(url) => handleSave(plan, url)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2 text-[11px] text-[hsl(var(--c-slate-soft))] leading-relaxed">
        <ShieldCheck size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
        <span>
          Payment Link URLs are public by design (they're meant to be shared).
          They live in this browser's localStorage. When you deploy the
          production site, set them once in the deployment environment and
          they'll work for every visitor.
        </span>
      </div>
    </div>
  );
}

function PaymentLinkRow({
  plan,
  value,
  saved,
  highlighted,
  onSave,
}: {
  plan: PlanTier;
  value: string;
  saved: boolean;
  highlighted: boolean;
  onSave: (url: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  return (
    <div
      className={`grid sm:grid-cols-[10rem_1fr_auto] gap-2 items-center p-3 rounded ${
        highlighted
          ? "bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-gold))]"
          : "bg-[hsl(var(--c-cream))]"
      }`}
    >
      <div className="text-sm font-semibold text-[hsl(var(--c-ink))]">
        {PLAN_LABEL[plan]}{" "}
        <span className="font-normal text-[hsl(var(--c-slate-soft))]">
          · ${PLAN_MONTHLY_USD[plan]}
        </span>
      </div>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="https://buy.stripe.com/..."
        className="text-xs sm:text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
      />
      <button
        type="button"
        onClick={() => onSave(draft)}
        disabled={draft === value}
        className="collegium-btn-ghost text-xs inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saved ? <Check size={11} /> : null} {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
