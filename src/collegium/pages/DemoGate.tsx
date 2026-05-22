import { useNavigate } from "react-router-dom";
import { demoStore, roleLabel, type DemoRole } from "../lib/demoStore";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ROLE_PRESETS: { role: DemoRole; name: string; context: string }[] = [
  {
    role: "national-steward",
    name: "Rebecca Mwangi-Stone",
    context:
      "Chair, Christian Legal Fellowship (Toronto). See the network pulse across all five chapters.",
  },
  {
    role: "local-steward",
    name: "Margaret Coyle",
    context:
      "President, St. Thomas More Society of Boston. Run a 184-member guild with monthly luncheons and an October Red Mass.",
  },
  {
    role: "mentor",
    name: "Prof. Robert Hartmann",
    context:
      "Faculty at Catholic University Law. Mentor to Maria Velasquez (3L); two missed meetings during her bar-prep.",
  },
  {
    role: "student",
    name: "Hannah Park",
    context:
      "Loyola Chicago 2L. Ecumenical Christian Legal Society. Discerning religious-liberty practice.",
  },
];

export function DemoGate() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(1);

  function enter() {
    if (selected === null) return;
    const preset = ROLE_PRESETS[selected];
    demoStore.setRole(preset.role, preset.name);
    navigate("/app");
  }

  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="collegium-latin text-sm mb-2">Aditus · Entry</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-4 sm:mb-5">Step into the demo</h1>
          <p className="text-base sm:text-lg text-[hsl(var(--c-slate))] max-w-xl mx-auto leading-relaxed">
            Pick a role. The same data is visible from each perspective, but the
            home view, suggestions, and NRI briefings shift to match what that
            person would actually see.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 collegium-safe-bottom">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
            {ROLE_PRESETS.map((p, i) => {
              const r = roleLabel[p.role];
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`collegium-card text-left p-5 transition-all ${
                    isSelected
                      ? "ring-2 ring-[hsl(var(--c-wine))] shadow-md"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="collegium-display text-lg">{r.label}</span>
                    <span className="collegium-latin text-xs">{r.latin}</span>
                  </div>
                  <div className="text-sm font-medium text-[hsl(var(--c-wine))] mb-1.5">
                    {p.name}
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">
                    {p.context}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 bg-[hsl(var(--c-cream)/0.96)] backdrop-blur sm:bg-transparent sm:backdrop-blur-none border-t sm:border-0 border-[hsl(var(--c-border))]">
            <button
              onClick={enter}
              disabled={selected === null}
              className="collegium-btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Enter as {selected !== null ? ROLE_PRESETS[selected].name.split(" ")[0] : "…"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="text-xs text-[hsl(var(--c-slate-soft))] text-center mt-8 max-w-md mx-auto">
            All data is illustrative. Names are fictional or composite. Nothing
            you do in the demo is sent to any backend.
          </p>
        </div>
      </section>
    </div>
  );
}
