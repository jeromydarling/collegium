import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  stateData,
  STATE_FIPS_TO_CODE,
  colorFor,
  type Metric,
  type StateData,
  METRIC_LABEL,
  METRIC_BLURB,
  METRIC_LEGEND,
} from "../data/justiceByState";
import { MapPin, ExternalLink, X } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const METRICS: Metric[] = [
  "rtc",
  "lawyersPer1000",
  "evictionRate",
  "lawyerDesertPct",
  "regulatory",
];

const SHORT_METRIC: Record<Metric, string> = {
  rtc: "Right to counsel",
  lawyersPer1000: "Lawyer density",
  evictionRate: "Eviction filings",
  lawyerDesertPct: "Lawyer deserts",
  regulatory: "Sandbox / LP",
};

/**
 * The interactive justice-crisis map for the Auxilium homepage.
 *
 * Toggle between five metrics to recolor the choropleth. Hover for
 * tooltip; click a state for the full breakdown in a side card. Pure
 * react-simple-maps + a CDN-hosted us-atlas TopoJSON — no Mapbox token
 * required for this surface.
 */
export function JusticeMap() {
  const [metric, setMetric] = useState<Metric>("rtc");
  const [selected, setSelected] = useState<StateData | null>(null);
  const [hovered, setHovered] = useState<StateData | null>(null);

  return (
    <section className="bg-[hsl(220_30%_10%)] text-[hsl(40_35%_92%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <p className="collegium-latin text-sm text-[hsl(38_60%_70%)] mb-2">
            Iniustitia per regiones
          </p>
          <h2 className="collegium-display text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[hsl(40_40%_94%)] leading-tight">
            The nightmare, mapped.
          </h2>
          <p className="text-[hsl(40_20%_82%)] max-w-2xl mx-auto leading-relaxed">
            What it actually looks like to be poor and need a lawyer in
            America — broken out by state. Toggle between the dimensions
            of the crisis. Tap any state for the breakdown.
          </p>
        </div>

        {/* Metric toggle */}
        <div className="flex flex-wrap gap-2 justify-center mb-5 sm:mb-6">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full border transition-colors ${
                metric === m
                  ? "bg-[hsl(38_60%_60%)] text-[hsl(220_30%_10%)] border-[hsl(38_60%_60%)]"
                  : "bg-transparent text-[hsl(40_30%_88%)] border-[hsl(40_20%_30%)] hover:border-[hsl(38_60%_60%)]"
              }`}
            >
              {SHORT_METRIC[m]}
            </button>
          ))}
        </div>

        <p className="text-sm text-[hsl(40_20%_82%)] text-center max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed italic">
          {METRIC_BLURB[metric]}
        </p>

        <div className="grid lg:grid-cols-[1fr_22rem] gap-5 sm:gap-6 items-start">
          {/* The map */}
          <div className="relative bg-[hsl(220_30%_8%)] rounded-xl p-3 sm:p-5 border border-[hsl(220_20%_20%)]">
            <ComposableMap
              projection="geoAlbersUsa"
              width={800}
              height={500}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = String(geo.id).padStart(2, "0");
                    const code = STATE_FIPS_TO_CODE[fips];
                    const s = code ? stateData[code] : null;
                    const fill = s ? colorFor(metric, s) : "hsl(220 10% 25%)";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="hsl(220 20% 15%)"
                        strokeWidth={0.6}
                        onMouseEnter={() => setHovered(s ?? null)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => s && setSelected(s)}
                        style={{
                          default: { outline: "none", cursor: s ? "pointer" : "default" },
                          hover: {
                            outline: "none",
                            fill,
                            opacity: 0.85,
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {hovered && !selected && (
              <div className="hidden sm:block absolute bottom-3 left-3 right-3 bg-[hsl(220_30%_15%)/0.95] backdrop-blur border border-[hsl(220_20%_22%)] rounded-lg px-4 py-3 pointer-events-none">
                <div className="text-xs text-[hsl(38_60%_70%)] uppercase tracking-widest mb-0.5">
                  {hovered.name}
                </div>
                <div className="text-sm text-[hsl(40_30%_90%)]">
                  {tooltipFor(metric, hovered)}
                </div>
              </div>
            )}
          </div>

          {/* Legend + detail */}
          <div className="space-y-5">
            <div className="bg-[hsl(220_30%_8%)] rounded-xl p-5 border border-[hsl(220_20%_20%)]">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-3">
                {METRIC_LABEL[metric]}
              </div>
              <ul className="space-y-2">
                {METRIC_LEGEND[metric].map((row) => (
                  <li key={row.label} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="w-4 h-4 rounded-sm shrink-0"
                      style={{ background: row.color }}
                    />
                    <span className="text-[hsl(40_20%_82%)]">{row.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selected ? (
              <StateDetail s={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="bg-[hsl(220_30%_8%)] rounded-xl p-5 border border-[hsl(220_20%_20%)] text-sm text-[hsl(40_20%_75%)]">
                <MapPin
                  size={14}
                  className="inline mr-1.5 text-[hsl(38_60%_70%)]"
                />
                Tap a state on the map to see the breakdown for people in
                poverty there.
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-[hsl(40_20%_60%)] text-center mt-8 sm:mt-10 leading-relaxed max-w-2xl mx-auto">
          Sources: ABA Profile of the Legal Profession (2022–2024) ·
          Princeton Eviction Lab · Legal Services Corporation 2022 Justice
          Gap Report · National Coalition for a Civil Right to Counsel
          tracker. State-level numbers are approximations meant for visual
          understanding, not citation.
        </p>
      </div>
    </section>
  );
}

function tooltipFor(metric: Metric, s: StateData): string {
  switch (metric) {
    case "rtc":
      return s.rtc === "state-rtc"
        ? "Statewide right to a free lawyer in eviction cases."
        : s.rtc === "city-rtc"
        ? "Some cities guarantee a free lawyer in eviction cases."
        : s.rtc === "pilot"
        ? "Pilot program for free eviction counsel."
        : "No right to a free lawyer in civil cases.";
    case "lawyersPer1000":
      return `${s.lawyersPer1000} lawyers per 1,000 residents.`;
    case "evictionRate":
      return `${s.evictionRate}% of renter households face an eviction filing in a typical year.`;
    case "lawyerDesertPct":
      return `~${s.lawyerDesertPct}% of counties have fewer than one lawyer per 1,000 residents.`;
    case "regulatory":
      return s.regulatory === "sandbox"
        ? "Regulatory sandbox open — non-lawyer entities allowed to provide legal services."
        : s.regulatory === "paraprofessional"
        ? "Licensed Legal Paraprofessionals can advise in defined matters."
        : s.regulatory === "pilot"
        ? "Active non-lawyer practitioner pilot."
        : s.regulatory === "lllt-sunset"
        ? "Pioneered the non-lawyer model; closed in 2020."
        : s.regulatory === "frozen"
        ? "Sandbox/paraprofessional licensing frozen by legislation."
        : "Only licensed attorneys can give legal advice.";
  }
}

function StateDetail({ s, onClose }: { s: StateData; onClose: () => void }) {
  return (
    <div className="bg-[hsl(220_30%_8%)] rounded-xl p-5 sm:p-6 border border-[hsl(220_20%_20%)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-0.5">
            {s.code}
          </div>
          <h3 className="collegium-display text-2xl text-[hsl(40_40%_94%)] leading-tight">
            {s.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[hsl(40_20%_70%)] hover:text-[hsl(40_40%_94%)] -mt-1 -mr-1 p-1"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <dl className="space-y-3 mb-4">
        <Row label="Lawyers per 1,000 residents" value={s.lawyersPer1000.toString()} />
        <Row
          label="Eviction filings per 100 renter households / year"
          value={`${s.evictionRate}`}
        />
        <Row
          label="Counties with fewer than 1 lawyer per 1,000"
          value={`${s.lawyerDesertPct}%`}
        />
        <Row label="Right to counsel" value={rtcLabel(s.rtc)} />
        <Row label="Non-lawyer help" value={regulatoryLabel(s.regulatory)} />
      </dl>

      {s.note && (
        <p className="text-sm text-[hsl(40_30%_88%)] italic border-l-2 border-[hsl(38_60%_60%)] pl-3 leading-relaxed">
          {s.note}
        </p>
      )}

      <a
        href={`https://www.lawhelp.org/find-help/all/${s.code.toLowerCase()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[hsl(38_60%_70%)] hover:underline mt-4"
      >
        Find free legal help in {s.name} <ExternalLink size={11} />
      </a>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm border-b border-[hsl(220_20%_18%)] pb-2 last:border-0 last:pb-0">
      <dt className="text-[hsl(40_20%_75%)] flex-1 leading-snug">{label}</dt>
      <dd className="text-[hsl(40_40%_94%)] font-medium shrink-0">{value}</dd>
    </div>
  );
}

function rtcLabel(r: StateData["rtc"]): string {
  switch (r) {
    case "state-rtc":
      return "Statewide";
    case "city-rtc":
      return "Some cities";
    case "pilot":
      return "Pilot";
    default:
      return "No right";
  }
}

function regulatoryLabel(r: StateData["regulatory"]): string {
  switch (r) {
    case "sandbox":
      return "Sandbox open";
    case "paraprofessional":
      return "Paraprofessionals";
    case "pilot":
      return "Pilot program";
    case "lllt-sunset":
      return "Closed (LLLT sunset)";
    case "frozen":
      return "Frozen by law";
    default:
      return "Lawyers only";
  }
}
