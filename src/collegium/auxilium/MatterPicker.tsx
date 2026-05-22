import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { matterTypes } from "./data/matters";

export function MatterPicker() {
  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 collegium-safe-bottom">
        <Link
          to="/auxilium"
          className="text-xs collegium-link mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Back
        </Link>

        <div className="mb-8 sm:mb-10">
          <p className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-2">
            Quid accidit? — What happened?
          </p>
          <h1 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
            What's the closest match to what you're facing?
          </h1>
          <p className="text-[hsl(var(--c-slate))] leading-relaxed">
            Pick the one that sounds most like your situation. You can change
            it later if it turns out something else fits better.
          </p>
        </div>

        <div className="space-y-3">
          {matterTypes.map((m) => (
            <Link
              key={m.slug}
              to={`/auxilium/matter/${m.slug}`}
              className="collegium-card p-4 sm:p-5 hover:shadow-md transition-shadow flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
                <m.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <h2 className="collegium-display text-lg leading-tight">
                    I'm dealing with…
                  </h2>
                  {m.defaultUrgency === "now" && (
                    <span className="text-[10px] uppercase tracking-widest text-[hsl(8_55%_42%)] font-semibold">
                      Time-sensitive
                    </span>
                  )}
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">
                  {m.triggerPhrase}.
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-[hsl(var(--c-wine))] shrink-0 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          ))}
        </div>

        <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-8 sm:mt-10 text-center leading-relaxed">
          Don't see your situation? You can still{" "}
          <Link to="/auxilium/find-help" className="collegium-link">
            find a clinic near you
          </Link>{" "}
          and talk to someone in person.
        </p>
      </div>
    </div>
  );
}
