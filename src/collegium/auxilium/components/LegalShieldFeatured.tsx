import { Check, ArrowRight, Phone, FileCheck, Scale, ShieldCheck } from "lucide-react";

/**
 * LegalShield featured callout.
 *
 * The research finding that hit hardest: there is an existing,
 * regulated, real-attorney legal-services subscription at roughly
 * $25/month that almost nobody in poverty knows about. That price is
 * less than a single hour of a private attorney, less than Netflix, and
 * comparable to a phone plan. For the 200% FPL "missing middle" who
 * sits above legal-aid eligibility and below private-bar affordability,
 * it is the closest thing to a solved problem.
 *
 * We list it on FindHelp with full affiliate disclosure. We feature it
 * here on the landing because most users will never scroll FindHelp
 * far enough to see it, and they need to know it exists.
 */
export function LegalShieldFeatured() {
  // Replace AFFILIATE_CODE with the real associate / referral ID.
  const url = "https://www.legalshield.com/?associate=AFFILIATE_CODE";

  return (
    <section className="bg-white border-b border-[hsl(var(--c-border))]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <p className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-2">
            Solutio iam exsistit
          </p>
          <h2 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
            There's a working solution — most people don't know it exists.
          </h2>
          <p className="text-[hsl(var(--c-slate))] max-w-2xl mx-auto leading-relaxed">
            A real lawyer in your state, for less than a phone plan. We
            don't run this; we point you to it because it is the single
            most effective answer most low-income working people have
            never been told about.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-2xl p-6 sm:p-8 md:p-10">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-start">
            <div>
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <h3 className="collegium-display text-2xl sm:text-3xl text-[hsl(var(--c-ink))] leading-tight">
                  LegalShield
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                  Affiliate · disclosed
                </span>
              </div>
              <p className="text-base text-[hsl(var(--c-slate))] leading-relaxed mb-5">
                $24.95 a month gets you a dedicated law firm in your
                state. Call them whenever you need to. They write
                letters on your behalf. They review your contracts.
                They represent you on most matters at 25% off their
                normal rate. Open to anyone — no income test.
              </p>

              <ul className="space-y-2.5 mb-6">
                <Item icon={Phone} text="Unlimited phone consultations with a real attorney" />
                <Item icon={FileCheck} text="Letter-writing and document review on your behalf" />
                <Item icon={Scale} text="25% off most other legal matters with that firm" />
                <Item icon={Check} text="No income limit. Open to anyone." />
                <Item icon={ShieldCheck} text="Regulated under each state's bar — not a chatbot, not a forms website" />
              </ul>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                See LegalShield plans <ArrowRight size={16} />
              </a>

              <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-4 leading-relaxed italic">
                Auxilium receives a small affiliate fee if you sign up.
                It does not change what you pay or the service you
                receive. We feature LegalShield because it is the single
                most cost-effective real-attorney access we know of for
                people above the legal-aid income cliff.
              </p>
            </div>

            <div className="md:w-56 shrink-0">
              <div className="bg-white border border-[hsl(var(--c-border))] rounded-xl p-5 text-center">
                <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
                  Cost
                </div>
                <div className="collegium-display text-4xl sm:text-5xl text-[hsl(var(--c-ink))] mb-1">
                  $24.95
                </div>
                <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-4">
                  per month, personal plan
                </div>
                <hr className="collegium-gold-rule my-3" />
                <div className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">
                  <div className="mb-1.5">
                    <span className="line-through text-[hsl(var(--c-slate-soft))]">
                      One hour of private counsel
                    </span>
                  </div>
                  <div className="collegium-display text-2xl text-[hsl(var(--c-wine))]">
                    $300–$450
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-[hsl(var(--c-slate-soft))] text-center mt-8 sm:mt-10 max-w-2xl mx-auto leading-relaxed">
          Below LSC's 125% federal-poverty cutoff, free legal aid is the
          right starting point — see{" "}
          <a href="/auxilium/find-help" className="collegium-link">
            our directory
          </a>
          . If you're above it but can't afford $300/hour, LegalShield is
          the most realistic option that exists today.
        </p>
      </div>
    </section>
  );
}

function Item({ icon: Icon, text }: { icon: typeof Phone; text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[hsl(var(--c-slate))] leading-relaxed">
      <Icon
        size={15}
        className="text-[hsl(var(--c-gold))] mt-0.5 shrink-0"
      />
      <span>{text}</span>
    </li>
  );
}
