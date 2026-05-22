import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Heart,
  Sparkles,
  Building,
  Briefcase,
  Users,
  Scale,
  HandHeart,
  ShieldCheck,
} from "lucide-react";

type Tier = {
  name: string;
  latin: string;
  price: string;
  period: string;
  expense: string;
  persona: { name: string; role: string; story: string };
  features: string[];
  cta: string;
  ctaTo: string;
  icon: typeof Heart;
  accent: "neutral" | "wine" | "gold" | "dark";
  highlighted?: boolean;
  ribbon?: string;
};

const tiers: Tier[] = [
  {
    name: "Individual",
    latin: "Causa propria",
    price: "Free",
    period: "forever",
    expense: "—",
    persona: {
      name: "Daniel Chen",
      role: "Third-year associate · BC Law '22",
      story:
        "Takes one immigration matter a year through his parish clinic. Wants the hours logged for the bar's voluntary reporting. Doesn't want admin overhead. Doesn't want a sales call.",
    },
    features: [
      "Personal pro bono diary",
      "Up to 25 hours/year exported as basic PDF",
      "Browse Patrocinium cases",
      "Read Practice Hub answers",
      "5 AI intake-assist runs / month",
    ],
    cta: "Start free",
    ctaTo: "/app",
    icon: Heart,
    accent: "neutral",
  },
  {
    name: "Personal Pro",
    latin: "Patronus",
    price: "$9",
    period: "per month",
    expense: "Cheaper than Netflix",
    persona: {
      name: "Margaret Coyle",
      role: "Partner · Coyle & Whelan · Boston",
      story:
        "Mid-career litigator. Takes 3–4 pro bono matters a year across MA and NY. The bar wants reporting in both jurisdictions. Excel was getting tedious.",
    },
    features: [
      "Unlimited hours logged",
      "Bar-formatted export for every reporting state",
      "Accept Patrocinium cases",
      "Post questions to Practice Hub",
      "50 AI runs / month",
    ],
    cta: "Subscribe",
    ctaTo: "/checkout?plan=personal-pro",
    icon: Sparkles,
    accent: "neutral",
  },
  {
    name: "Chapter",
    latin: "Capitulum",
    price: "$29",
    period: "per month · up to 10 members",
    expense: "Same as a Spotify family plan",
    persona: {
      name: "St. Thomas More Society of Boston",
      role: "Margaret Coyle, President · 184 members",
      story:
        "The Society runs a Red Mass, two clinic shifts, monthly luncheons. Margaret wants chapter-wide hours rollup for the annual report to the Archdiocese.",
    },
    features: [
      "Up to 10 active members",
      "Chapter-wide hours rollup",
      "Aggregate bar reporting",
      "Custom intake form",
      "Chapter NRI Pulse",
      "250 AI runs + 500 SMS / month",
    ],
    cta: "Subscribe",
    ctaTo: "/checkout?plan=chapter",
    icon: Users,
    accent: "neutral",
  },
  {
    name: "Network",
    latin: "Communio",
    price: "$99",
    period: "per month · up to 50 members",
    expense: "Less than Slack for a small team",
    persona: {
      name: "Catholic Charities of Cleveland",
      role: "12 attorneys · 4 service sites · immigration + housing",
      story:
        "Runs intake out of four parish-based clinics. Needs multi-site hours rollup, branded intake forms, and an annual impact report the board can brag about.",
    },
    features: [
      "Up to 50 members",
      "Multi-site hours rollup",
      "Custom subdomain + logo",
      "Communio publishing rights",
      "Justice Gap analytics for your network",
      "1,000 AI runs + 2,500 SMS / month",
      "Sponsor / underwriter attribution surface",
    ],
    cta: "Subscribe",
    ctaTo: "/checkout?plan=network",
    icon: HandHeart,
    accent: "wine",
    highlighted: true,
    ribbon: "Most popular for Catholic Charities affiliates",
  },
  {
    name: "Institution",
    latin: "Dioecesis",
    price: "$299",
    period: "per month · up to 200 members",
    expense: "Less than one bar-conference registration",
    persona: {
      name: "Diocese of Arlington",
      role: "6 parish-based clinics · 4 law-school chapters · 70 attorneys",
      story:
        "Vicar of Catholic Charities wants one dashboard for the diocese's whole pro bono operation. Bar-format exports for every attorney in every state. Annual report to the Bishop with one click.",
    },
    features: [
      "Up to 200 members",
      "Multi-chapter + multi-site rollup",
      "AmLaw-ready year-over-year reports",
      "SSO + API access",
      "5,000 AI runs + 10,000 SMS / month",
      "Dedicated success contact",
      "Priority feature requests",
    ],
    cta: "Subscribe",
    ctaTo: "/checkout?plan=institution",
    icon: Building,
    accent: "wine",
  },
  {
    name: "Enterprise",
    latin: "Provincia",
    price: "$999",
    period: "per month · unlimited",
    expense: "Less than one associate-hour at standard rates",
    persona: {
      name: "Jones Day Pro Bono Practice",
      role: "2,500 attorneys · global pro bono program",
      story:
        "Pro bono coordinator manages thousands of attorneys across dozens of jurisdictions. Needs AmLaw-ranking-ready exports, white-label option, and SSO. Already pays five figures for inferior tools.",
    },
    features: [
      "Unlimited members",
      "Full white-label option",
      "Multi-jurisdiction reporting",
      "Unlimited AI + SMS at cost+",
      "Custom integrations",
      "SLA + dedicated engineer",
    ],
    cta: "Subscribe",
    ctaTo: "/checkout?plan=enterprise",
    icon: Briefcase,
    accent: "dark",
  },
];

// (Sponsor / scholarship tiers replaced by the low-bono transaction story
// in a dedicated section below.)

export function Pricing() {
  return (
    <div className="collegium-theme">
      {/* Hero */}
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="collegium-latin text-sm mb-2">Pretium</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-5 sm:mb-6">
            Priced to be expensed without asking.
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] leading-relaxed max-w-2xl mx-auto mb-3">
            Every tier sits below the procurement-approval line for its
            audience. A solo attorney clicks subscribe without HR. A
            chancellor approves a diocese plan from petty cash.
          </p>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] max-w-2xl mx-auto">
            Sponsor underwriting lets Big Law fund the rest of the network at
            scholarship pricing. Justice infrastructure should not be gated by
            ability to pay.
          </p>
        </div>
      </section>

      {/* Standard tiers */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {tiers.map((t) => (
              <TierCard key={t.name} tier={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Low-bono marketplace — the real handshake */}
      <section className="bg-[hsl(var(--c-cream-warm))] border-y border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <div className="collegium-latin text-sm mb-2 text-[hsl(var(--c-wine))]">
              Causa publica
            </div>
            <h2 className="collegium-display text-3xl sm:text-4xl mb-4 leading-tight">
              Low-bono, not just pro bono.
            </h2>
            <p className="text-base text-[hsl(var(--c-slate))] max-w-2xl mx-auto leading-relaxed mb-3">
              Pure pro bono burns lawyers out. Charity-only clients sometimes
              refuse help they need. Collegium routes <em className="not-italic font-semibold">sliding-scale</em>{" "}
              payments — a client above the poverty line pays what they can; the
              attorney recovers something for their time.
            </p>
            <p className="text-sm text-[hsl(var(--c-slate-soft))] max-w-2xl mx-auto leading-relaxed">
              We facilitate the financial exchange through Stripe Connect and
              take a small platform fee on each transaction. That's the only
              fee on the flow. The rest goes straight to the attorney's account.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mb-8">
            <ExampleCard
              label="Pure pro bono"
              fpl="Under 100% FPL"
              fee="$0"
              note="Routed free — no platform charge. Attorney logs hours; client signs a fee-waiver engagement letter."
            />
            <ExampleCard
              label="Low-bono"
              fpl="100–200% FPL"
              fee="$25–75 / hr"
              note="Client pays a small sliding-scale rate. Platform takes 5%. Attorney's Stripe Connect account is paid out."
              highlighted
            />
            <ExampleCard
              label="Sliding scale"
              fpl="200–400% FPL"
              fee="$100–200 / hr"
              note="Modest discount off market rates. Still well below standard billing. Bar reporting still counts the hours."
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-[hsl(var(--c-slate-soft))] max-w-xl mx-auto">
              Each tenant sets its own ladder. We handle the rails, the
              receipts, and the bar-reportable hours export. Tenants never
              touch your client's card — the money flows directly to your
              Stripe Connect account.
            </p>
          </div>
        </div>
      </section>

      {/* How the transaction handshake works */}
      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center gap-2 justify-center text-[hsl(var(--c-wine))] mb-2">
              <Scale size={14} />
              <span className="collegium-latin text-sm">Quomodo</span>
            </div>
            <h2 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
              How the transaction handshake works.
            </h2>
          </div>
          <ol className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
            <Step
              n={1}
              title="A tenant sets its sliding-scale ladder."
              body="During onboarding, your guild / clinic / firm defines what reduced rates look like at each FPL band. Many tenants start with one flat fee per matter type — $150 for a will, $250 for an eviction defense, $75 for an immigration consult."
            />
            <Step
              n={2}
              title="A client is matched to a matter through Patrocinium."
              body="Steward verifies eligibility and the right fee tier at intake. If they're truly pro bono, no fee fires. If they're low-bono, they see a small invoice — $25 to $150 — at engagement."
            />
            <Step
              n={3}
              title="Payment flows directly to the attorney via Stripe Connect."
              body="Client pays through a hosted checkout. Stripe takes their standard 2.9% + 30¢. Collegium takes 5% as the platform handshake fee. The remaining 92.1% lands in the attorney's connected account, ready to draw on."
            />
            <Step
              n={4}
              title="Both sides see one clean record."
              body="The transaction appears on the matter timeline. Attorney gets a receipt, client gets a receipt, your tenant admin sees the aggregate. Hours still log against the matter for bar reporting."
            />
          </ol>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="collegium-latin text-sm text-[hsl(38_60%_70%)] mb-3">
            Subsidiaritas
          </p>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-4 text-[hsl(40_40%_94%)] leading-tight">
            Subsidiarity is a principle, not a marketing line.
          </h2>
          <p className="text-[hsl(40_25%_82%)] max-w-2xl mx-auto mb-8 leading-relaxed">
            We price Collegium so the decision to use it lives with the local
            chapter — not above it. If the price is wrong for your community,
            tell us why; we will figure something out.
          </p>
          <Link
            to="/contact"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 text-base"
          >
            Tell us about your community <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const Icon = tier.icon;
  const accentClass = {
    neutral: "",
    wine: "ring-2 ring-[hsl(var(--c-wine))] relative",
    gold: "ring-2 ring-[hsl(var(--c-gold))] relative bg-[hsl(var(--c-cream))]",
    dark:
      "bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] border-[hsl(220_20%_22%)]",
  }[tier.accent];

  const isDark = tier.accent === "dark";

  return (
    <div className={`collegium-card p-5 sm:p-6 flex flex-col ${accentClass}`}>
      {tier.ribbon && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap font-semibold ${
            tier.accent === "gold"
              ? "bg-[hsl(var(--c-gold))] text-[hsl(var(--c-ink))]"
              : "bg-[hsl(var(--c-wine))] text-white"
          }`}
        >
          {tier.ribbon}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div
            className={`collegium-latin text-xs mb-0.5 ${
              isDark ? "text-[hsl(38_60%_70%)]" : "text-[hsl(var(--c-wine))]"
            }`}
          >
            {tier.latin}
          </div>
          <h3
            className={`collegium-display text-xl sm:text-2xl leading-tight ${
              isDark ? "text-[hsl(40_40%_94%)]" : ""
            }`}
          >
            {tier.name}
          </h3>
        </div>
        <Icon
          size={18}
          className={isDark ? "text-[hsl(38_60%_70%)] shrink-0" : "text-[hsl(var(--c-wine))] shrink-0"}
        />
      </div>

      <div className="mb-4">
        <div
          className={`collegium-display text-3xl sm:text-4xl leading-none ${
            isDark ? "text-[hsl(40_40%_94%)]" : "text-[hsl(var(--c-ink))]"
          }`}
        >
          {tier.price}
        </div>
        <div
          className={`text-xs mt-1 ${
            isDark ? "text-[hsl(40_25%_80%)]" : "text-[hsl(var(--c-slate-soft))]"
          }`}
        >
          {tier.period}
        </div>
        {tier.expense !== "—" && (
          <div
            className={`text-[11px] italic mt-1 ${
              isDark ? "text-[hsl(38_60%_70%)]" : "text-[hsl(var(--c-wine))]"
            }`}
          >
            {tier.expense}
          </div>
        )}
      </div>

      {/* Persona story */}
      <div
        className={`text-xs sm:text-sm leading-relaxed mb-4 p-3 rounded ${
          isDark
            ? "bg-[hsl(220_25%_18%)] text-[hsl(40_25%_82%)]"
            : "bg-[hsl(var(--c-cream-warm))] text-[hsl(var(--c-slate))]"
        }`}
      >
        <div
          className={`text-[10px] uppercase tracking-widest font-semibold mb-1 ${
            isDark ? "text-[hsl(38_60%_70%)]" : "text-[hsl(var(--c-wine))]"
          }`}
        >
          For someone like
        </div>
        <div className={isDark ? "text-[hsl(40_35%_92%)] font-medium" : "font-medium text-[hsl(var(--c-ink))]"}>
          {tier.persona.name}
        </div>
        <div
          className={`text-[11px] mb-2 ${
            isDark ? "text-[hsl(40_20%_75%)]" : "text-[hsl(var(--c-slate-soft))]"
          }`}
        >
          {tier.persona.role}
        </div>
        <p>{tier.persona.story}</p>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check
              size={14}
              className={
                isDark
                  ? "text-[hsl(38_60%_70%)] mt-0.5 shrink-0"
                  : "text-[hsl(var(--c-gold))] mt-0.5 shrink-0"
              }
            />
            <span
              className={
                isDark ? "text-[hsl(40_25%_85%)]" : "text-[hsl(var(--c-slate))]"
              }
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to={tier.ctaTo}
        className={
          tier.highlighted || tier.accent === "gold"
            ? "collegium-btn-primary text-center text-sm justify-center inline-flex items-center gap-1.5"
            : isDark
            ? "bg-[hsl(38_60%_70%)] text-[hsl(220_30%_12%)] font-semibold text-center text-sm rounded px-4 py-2 inline-flex items-center justify-center gap-1.5 hover:bg-[hsl(38_60%_80%)] transition-colors"
            : "collegium-btn-ghost text-center text-sm justify-center inline-flex items-center gap-1.5"
        }
      >
        {tier.cta} <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function ExampleCard({
  label,
  fpl,
  fee,
  note,
  highlighted,
}: {
  label: string;
  fpl: string;
  fee: string;
  note: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`collegium-card p-5 ${
        highlighted
          ? "ring-2 ring-[hsl(var(--c-wine))] bg-white"
          : "bg-white"
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1 font-semibold">
        {label}
      </div>
      <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">{fpl}</div>
      <div className="collegium-display text-2xl text-[hsl(var(--c-ink))] mb-2">
        {fee}
      </div>
      <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">{note}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4 sm:gap-5">
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center font-semibold collegium-display text-lg sm:text-xl">
        {n}
      </div>
      <div className="pt-1">
        <h3 className="collegium-display text-lg sm:text-xl leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
