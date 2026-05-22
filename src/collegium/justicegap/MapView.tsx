import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { ChevronLeft, ChevronRight, ExternalLink, X, Layers } from "lucide-react";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { chapters, chapterById, type Chapter } from "./data/chapters";
import {
  stateMetrics,
  metricValue,
  colorOnRamp,
  formatMetric,
} from "./data/stateMetrics";
import { getFraming, type StateFraming } from "./data/stateFramings";
import { STATE_FIPS_TO_CODE, stateData as civilStateData } from "../auxilium/data/justiceByState";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

/**
 * Chapter-based choropleth — fostercrisis.com pattern, react-simple-maps
 * implementation. When we migrate to Mapbox for Albers + cooperative
 * gestures, the chapter data + state data files stay the same; only
 * this component swaps out.
 *
 * Per kickoff §4c: metric values come straight off the per-state
 * record, not through feature-state. No first-load races.
 */
export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterFromPath = location.pathname.split("/").pop();
  const currentChapter =
    chapterById(chapterFromPath ?? "") ?? chapters[0];

  const idx = chapters.findIndex((c) => c.id === currentChapter.id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNumbers, setShowNumbers] = useState(false);

  function go(delta: number) {
    const next = chapters[(idx + delta + chapters.length) % chapters.length];
    navigate(`/justicegap/map/${next.id}`);
    setSelected(null);
    setShowNumbers(false);
  }

  return (
    <div className="bg-[hsl(220_30%_8%)] text-[hsl(40_35%_92%)] min-h-screen">
      <ModeSwitcher />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5 sm:py-8 grid lg:grid-cols-[1fr_440px] gap-5 sm:gap-6">
        {/* Map panel */}
        <section className="bg-[hsl(220_30%_6%)] border border-[hsl(220_20%_18%)] rounded-xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-[hsl(220_20%_18%)] flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-0.5">
                Chapter {currentChapter.number} of 12 · {currentChapter.eyebrow}
              </div>
              <h2 className="collegium-display text-lg sm:text-xl text-[hsl(40_40%_94%)] leading-tight">
                {currentChapter.title}
              </h2>
            </div>
          </div>

          <div className="relative bg-[hsl(220_30%_5%)]">
            <ComposableMap
              projection="geoAlbersUsa"
              width={900}
              height={520}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = String(geo.id).padStart(2, "0");
                    const code = STATE_FIPS_TO_CODE[fips];
                    const m = code
                      ? metricValue(code, currentChapter.metric)
                      : null;
                    const fill = code
                      ? colorOnRamp(m, currentChapter.ramp, currentChapter.domain)
                      : "hsl(220 20% 18%)";
                    const isSelected = code === selected;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={isSelected ? "hsl(38 60% 70%)" : "hsl(220 30% 10%)"}
                        strokeWidth={isSelected ? 1.8 : 0.5}
                        onMouseEnter={() => setHovered(code ?? null)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => code && setSelected(code)}
                        style={{
                          default: { outline: "none", cursor: code ? "pointer" : "default" },
                          hover: { outline: "none", opacity: 0.85 },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Hover readout */}
            {hovered && !selected && (
              <div className="hidden sm:block absolute bottom-3 left-3 right-3 bg-[hsl(220_30%_14%/0.95)] backdrop-blur border border-[hsl(220_20%_24%)] rounded-lg px-4 py-3 pointer-events-none">
                <div className="text-xs text-[hsl(38_60%_70%)] uppercase tracking-widest mb-0.5">
                  {civilStateData[hovered]?.name ?? hovered}
                </div>
                <div className="text-sm text-[hsl(40_30%_90%)]">
                  {hoverReadout(hovered, currentChapter)}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-4 sm:px-5 py-4 border-t border-[hsl(220_20%_18%)]">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-2">
              {currentChapter.unit}
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
              <div
                className="h-3 rounded-sm w-full"
                style={{
                  background: `linear-gradient(to right, ${currentChapter.ramp.join(", ")})`,
                }}
              />
              <div className="text-[11px] text-[hsl(40_20%_70%)] whitespace-nowrap">
                {currentChapter.domain[0]} → {currentChapter.domain[1]}
              </div>
            </div>
            {currentChapter.source.url ? (
              <a
                href={currentChapter.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)] hover:text-[hsl(38_60%_70%)] inline-flex items-center gap-1 mt-2 underline decoration-dotted"
              >
                Source: {currentChapter.source.label}
                <ExternalLink size={9} />
              </a>
            ) : (
              <p className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)] mt-2">
                Source: {currentChapter.source.label}
              </p>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="bg-[hsl(220_30%_6%)] border border-[hsl(220_20%_18%)] rounded-xl flex flex-col">
          {selected ? (
            (() => {
              const framing = getFraming(currentChapter.id, selected);
              return framing ? (
                <StateFramingPanel
                  framing={framing}
                  chapter={currentChapter}
                  code={selected}
                  onClose={() => setSelected(null)}
                  onSeeNumbers={() => setShowNumbers(true)}
                  showNumbers={showNumbers}
                />
              ) : (
                <StateBreakdown
                  code={selected}
                  chapter={currentChapter}
                  onClose={() => setSelected(null)}
                />
              );
            })()
          ) : (
            <ChapterPanel chapter={currentChapter} />
          )}

          <div className="border-t border-[hsl(220_20%_18%)] flex items-center justify-between px-4 sm:px-5 py-3">
            <button
              onClick={() => go(-1)}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[hsl(40_30%_85%)] hover:text-[hsl(38_60%_70%)]"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <div className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)]">
              {currentChapter.number} of 12
            </div>
            <button
              onClick={() => go(1)}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[hsl(40_30%_85%)] hover:text-[hsl(38_60%_70%)]"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ChapterPanel({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-1.5">
        {chapter.eyebrow}
      </div>
      <h3 className="collegium-display text-2xl sm:text-3xl text-[hsl(40_40%_94%)] leading-tight mb-4">
        {chapter.title}
      </h3>

      <div className="mb-5">
        <div className="collegium-display text-4xl sm:text-5xl text-[hsl(38_60%_70%)] leading-none mb-1">
          {chapter.headline}
        </div>
        <p className="text-sm text-[hsl(40_20%_75%)] leading-relaxed">{chapter.subline}</p>
      </div>

      {chapter.body.split("\n\n").map((p, i) => (
        <p key={i} className="text-[15px] text-[hsl(40_30%_85%)] leading-relaxed mb-4">
          {p}
        </p>
      ))}

      {chapter.sting && (
        <p className="mt-5 pt-5 border-t border-[hsl(220_20%_22%)] text-[hsl(40_40%_94%)] text-base sm:text-lg leading-snug italic"
           style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {chapter.sting}
        </p>
      )}

      {chapter.status === "scaffold" && (
        <div className="mt-4 text-[10px] uppercase tracking-widest text-[hsl(40_20%_55%)]">
          Chapter still being written
        </div>
      )}
    </div>
  );
}

function StateFramingPanel({
  framing,
  chapter,
  code,
  onClose,
  onSeeNumbers,
  showNumbers,
}: {
  framing: StateFraming;
  chapter: Chapter;
  code: string;
  onClose: () => void;
  onSeeNumbers: () => void;
  showNumbers: boolean;
}) {
  const name = civilStateData[code]?.name ?? code;
  return (
    <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-1">
            <Layers size={11} /> Reading {chapter.eyebrow.toLowerCase()} in
          </div>
          <h3 className="collegium-display text-3xl text-[hsl(40_40%_94%)] leading-tight">
            {name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[hsl(40_20%_70%)] hover:text-[hsl(40_40%_94%)] -mt-1 -mr-1 p-1"
          aria-label="Back to national framing"
        >
          <X size={16} />
        </button>
      </div>

      {framing.headline && (
        <div className="mb-5 pb-5 border-b border-[hsl(220_20%_22%)]">
          <div className="collegium-display text-4xl sm:text-5xl text-[hsl(38_60%_70%)] leading-none mb-1">
            {framing.headline}
          </div>
          {framing.subline && (
            <p className="text-sm text-[hsl(40_20%_75%)] leading-relaxed">
              {framing.subline}
            </p>
          )}
        </div>
      )}

      {framing.body.split("\n\n").map((p, i) => (
        <p key={i} className="text-[15px] text-[hsl(40_30%_85%)] leading-relaxed mb-4">
          {p}
        </p>
      ))}

      {framing.sting && (
        <p
          className="mt-5 pt-5 border-t border-[hsl(220_20%_22%)] text-[hsl(40_40%_94%)] text-base sm:text-lg leading-snug italic"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {framing.sting}
        </p>
      )}

      <div className="mt-5 pt-5 border-t border-[hsl(220_20%_22%)] flex flex-wrap items-center gap-3">
        {!showNumbers && (
          <button
            onClick={onSeeNumbers}
            className="text-xs text-[hsl(38_60%_70%)] hover:text-[hsl(38_60%_85%)] inline-flex items-center gap-1 underline decoration-dotted"
          >
            See {name}'s numbers
          </button>
        )}
        <button
          onClick={onClose}
          className="text-xs text-[hsl(40_20%_70%)] hover:text-[hsl(40_40%_94%)] inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Back to national framing
        </button>
      </div>

      {showNumbers && (
        <div className="mt-5 pt-5 border-t border-[hsl(220_20%_22%)]">
          <StateNumbers code={code} />
        </div>
      )}
    </div>
  );
}

function StateNumbers({ code }: { code: string }) {
  const m = stateMetrics[code];
  if (!m) return null;
  const idx = metricValue(code, "justice_gap_index");
  return (
    <dl className="space-y-3 text-sm">
      <Row label="Public-defender caseload" value={`${m.pd_caseload} / atty / yr`} />
      <Row label="Indigent-defense spending" value={`$${m.indigent_spend_per_capita.toFixed(2)} / resident`} />
      <Row label="Incarcerated" value={`${m.incarceration_per_100k.toLocaleString()} / 100K`} />
      <Row label="LSC attorneys" value={`${m.lsc_attys_per_10k_poor.toFixed(2)} / 10K poor`} />
      <Row label="Documented exonerations" value={m.exonerations_total.toLocaleString()} />
      <Row label="Felony cases by plea" value={`${m.plea_pct.toFixed(0)}%`} />
      <Row label="Jail population, pretrial" value={`${m.pretrial_pct.toFixed(0)}%`} />
      <Row label="Court fines / fees, % of revenue" value={`${m.court_fines_pct.toFixed(1)}%`} />
      <Row label="3-year recidivism" value={`${m.recidivism_3yr_pct.toFixed(0)}%`} />
      {idx != null && (
        <Row label="Justice Gap Index" value={`${idx} / 100`} />
      )}
    </dl>
  );
}

function StateBreakdown({
  code,
  chapter,
  onClose,
}: {
  code: string;
  chapter: Chapter;
  onClose: () => void;
}) {
  const name = civilStateData[code]?.name ?? code;
  const m = stateMetrics[code];
  if (!m) {
    return (
      <div className="flex-1 p-6 text-sm text-[hsl(40_20%_70%)]">
        Data unavailable for {code}.
        <button onClick={onClose} className="ml-3 text-[hsl(38_60%_70%)]">
          Close
        </button>
      </div>
    );
  }
  const currentVal = metricValue(code, chapter.metric);
  return (
    <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)] mb-0.5">
            {code}
          </div>
          <h3 className="collegium-display text-3xl text-[hsl(40_40%_94%)] leading-tight">
            {name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[hsl(40_20%_70%)] hover:text-[hsl(40_40%_94%)] -mt-1 -mr-1 p-1"
        >
          <X size={16} />
        </button>
      </div>

      {currentVal != null && (
        <div className="mb-5 pb-5 border-b border-[hsl(220_20%_22%)]">
          <div className="collegium-display text-4xl text-[hsl(38_60%_70%)] mb-1">
            {formatMetric(chapter.metric, currentVal)}
          </div>
          <div className="text-xs text-[hsl(40_20%_75%)]">{chapter.unit}</div>
        </div>
      )}

      <dl className="space-y-3 text-sm">
        <Row label="Public-defender caseload" value={`${m.pd_caseload} cases / atty / yr`} />
        <Row
          label="Indigent-defense spending"
          value={`$${m.indigent_spend_per_capita.toFixed(2)} / resident`}
        />
        <Row
          label="Incarcerated"
          value={`${m.incarceration_per_100k.toLocaleString()} / 100K`}
        />
        <Row
          label="LSC attorneys"
          value={`${m.lsc_attys_per_10k_poor.toFixed(2)} / 10K poor`}
        />
        <Row label="Documented exonerations (1989–)" value={m.exonerations_total.toLocaleString()} />
        <Row label="Felony cases by plea" value={`${m.plea_pct.toFixed(0)}%`} />
        <Row label="Jail population, pretrial" value={`${m.pretrial_pct.toFixed(0)}%`} />
        <Row
          label="Juvenile court referrals"
          value={`${m.juvenile_contact_rate.toFixed(0)} per 1,000`}
        />
        <Row
          label="Court fines / fees, % of revenue"
          value={`${m.court_fines_pct.toFixed(1)}%`}
        />
        <Row
          label="Death sentences per 1K murders"
          value={
            m.death_sentences_per_murder === 0
              ? "—"
              : m.death_sentences_per_murder.toFixed(1)
          }
        />
        <Row
          label="3-year recidivism"
          value={`${m.recidivism_3yr_pct.toFixed(0)}%`}
        />
        <Row
          label="Justice Gap Index"
          value={`${metricValue(code, "justice_gap_index") ?? "—"} / 100`}
        />
      </dl>

      <Link
        to="/auxilium/find-help"
        className="inline-flex items-center gap-1.5 text-xs text-[hsl(38_60%_70%)] hover:text-[hsl(38_60%_85%)] mt-5 underline decoration-dotted"
      >
        Find free legal help in {name} <ExternalLink size={11} />
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[hsl(220_20%_18%)] pb-2 last:border-0 last:pb-0">
      <dt className="text-[hsl(40_20%_75%)] flex-1 leading-snug">{label}</dt>
      <dd className="text-[hsl(40_40%_94%)] font-medium shrink-0">{value}</dd>
    </div>
  );
}

function hoverReadout(code: string, chapter: Chapter): string {
  const v = metricValue(code, chapter.metric);
  if (v == null) return "Data unavailable";
  return formatMetric(chapter.metric, v);
}
