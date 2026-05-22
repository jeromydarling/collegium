import { ShieldCheck } from "lucide-react";

/**
 * Persistent doctrinal disclosure. Every Auxilium screen carries this
 * at the bottom so the "information, not advice" line is impossible to
 * miss — and our posture under post-Upsolve UPL law is clear.
 */
export function InfoNotAdviceFooter() {
  return (
    <footer className="border-t border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream-warm))] collegium-safe-bottom">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-start gap-2.5">
          <ShieldCheck
            size={14}
            className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
          />
          <p className="text-[11px] sm:text-xs text-[hsl(var(--c-slate))] leading-relaxed">
            <strong className="font-semibold text-[hsl(var(--c-wine))]">
              Information, not advice.
            </strong>{" "}
            Auxilium is a court self-help tool, not a lawyer. We can
            explain procedure, deadlines, and statutes — we cannot tell
            you what to do in your case. Your information stays on your
            device. We don't share with ICE, CPS, your landlord, your
            creditor, or anyone else.
          </p>
        </div>
      </div>
    </footer>
  );
}
