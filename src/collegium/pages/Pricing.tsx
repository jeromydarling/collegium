import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Student Chapter",
    latin: "Schola",
    price: "$0",
    period: "for now, while we pilot",
    blurb: "Law-school Christian and Catholic student guilds.",
    features: [
      "Up to 50 members",
      "Chapters, events, mentor matching",
      "Formation library + Daily Office",
      "Officer handoff tools",
      "Community-supported",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Local Guild",
    latin: "Capitulum",
    price: "$49",
    period: "per month",
    blurb:
      "St. Thomas More societies, Catholic Bar affiliates, CLS chapters, faith-based clinics.",
    features: [
      "Up to 250 members",
      "All five modules + NRI Pulse",
      "Service intake & referral routing",
      "Canon-law tagging",
      "Member directory + dues-friendly",
    ],
    cta: "Pilot with us",
    highlighted: true,
  },
  {
    name: "Network",
    latin: "Provincia",
    price: "Custom",
    period: "for national bodies",
    blurb:
      "Catholic Bar Association, Christian Legal Society, Christian Legal Fellowship.",
    features: [
      "Unlimited chapters and members",
      "Network-wide NRI briefings",
      "Affiliate growth dashboard",
      "Federated formation publishing",
      "Dedicated stewardship support",
    ],
    cta: "Let's talk",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-5 py-20 text-center">
          <div className="collegium-latin text-sm mb-2">Pretium</div>
          <h1 className="collegium-display-xl text-5xl mb-6">Pricing</h1>
          <p className="text-xl text-[hsl(var(--c-slate))] leading-relaxed max-w-2xl mx-auto">
            Priced so that a guild already collecting modest dues can afford to
            organize itself well. Student chapters are free during our pilot.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`collegium-card p-7 flex flex-col ${
                  t.highlighted
                    ? "ring-2 ring-[hsl(var(--c-wine))] relative"
                    : ""
                }`}
              >
                {t.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--c-wine))] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    Recommended pilot
                  </div>
                )}
                <div className="collegium-latin text-xs mb-1">{t.latin}</div>
                <h3 className="collegium-display text-2xl mb-1">{t.name}</h3>
                <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-5">{t.blurb}</p>
                <div className="mb-6">
                  <div className="collegium-display text-4xl text-[hsl(var(--c-ink))]">
                    {t.price}
                  </div>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))]">{t.period}</div>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className="text-[hsl(var(--c-gold))] mt-0.5 shrink-0"
                      />
                      <span className="text-[hsl(var(--c-slate))]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={
                    t.highlighted
                      ? "collegium-btn-primary text-center text-sm"
                      : "collegium-btn-ghost text-center text-sm"
                  }
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-16 text-center">
            <p className="text-sm text-[hsl(var(--c-slate-soft))] leading-relaxed">
              Subsidiarity is a principle, not a marketing line. We price
              Collegium so that decisions about whether to use it live with the
              local chapter — not above it. If the price is wrong for your
              community, tell us why; we will figure something out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
