import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const STORAGE_KEY = "auxilium_jurisdiction";

export type Jurisdiction = {
  city: string;
  state: string;
};

export function useJurisdiction(): {
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
} {
  const [jurisdiction, setJurisdictionState] = useState<Jurisdiction>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return { city: "", state: "" };
  });
  function setJurisdiction(j: Jurisdiction) {
    setJurisdictionState(j);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(j));
    } catch {
      /* ignore */
    }
  }
  return { jurisdiction, setJurisdiction };
}

const STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"],
  ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"],
  ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"],
  ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"],
  ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"],
] as const;

export function JurisdictionPicker({
  value,
  onChange,
}: {
  value: Jurisdiction;
  onChange: (j: Jurisdiction) => void;
}) {
  const [city, setCity] = useState(value.city);
  const [state, setState] = useState(value.state);

  // Sync if value changes from outside (e.g., another tab restored from localStorage).
  useEffect(() => {
    setCity(value.city);
    setState(value.state);
  }, [value.city, value.state]);

  const dirty = city !== value.city || state !== value.state;

  return (
    <div className="collegium-card-warm p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <MapPin
          size={16}
          className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
        />
        <div>
          <h3 className="collegium-display text-lg leading-tight">
            Where are you located?
          </h3>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
            Used to look up the laws and programs that apply to you. Stored
            only on your device.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_8rem] gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (optional)"
          className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
        >
          <option value="">State…</option>
          {STATES.map(([code, name]) => (
            <option key={code} value={name}>
              {code}
            </option>
          ))}
        </select>
      </div>
      {dirty && (
        <button
          onClick={() => onChange({ city, state })}
          className="collegium-btn-primary text-sm mt-3 w-full sm:w-auto"
        >
          Use this location
        </button>
      )}
    </div>
  );
}
