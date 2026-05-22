import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, FeatureCollection } from "geojson";
import {
  loadMapbox,
  MAPBOX_TOKEN,
} from "../../auxilium/lib/maps";
import {
  stateMetrics,
  metricValue,
  type StateMetrics,
} from "../data/stateMetrics";
import { STATE_FIPS_TO_CODE } from "../../auxilium/data/justiceByState";
import type { Chapter } from "../data/chapters";

const STATES_TOPO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

/**
 * Mapbox-backed Justice Gap choropleth.
 *
 * Architecture, per kickoff §4:
 *   §4a: TopoJSON → GeoJSON converted client-side via topojson-client.
 *        Per-state metric values + the composite Justice Gap Index are
 *        baked into each feature's `properties` at load time, keyed
 *        `metric_${chapterId}`. The persistent PD-count overlay also
 *        builds a points FeatureCollection from state-centroid coords.
 *   §4c: Paint expressions read straight from `['get', metricKey]` —
 *        not from feature-state. Removes the first-load race.
 *        feature-state is reserved for hover + selected only.
 *   §4d: A persistent points layer renders public-defender counts at
 *        state centroids (cream fill #ffe9b3, dark stroke, sized by
 *        metric). Visible across every chapter.
 *   §4e: Click a state → fitBounds + setSelected. The parent component
 *        renders state-specific framing in the sidebar.
 *
 * Cooperative gestures are on (touch-pan requires two fingers; scroll
 * wheel requires Ctrl/Cmd), so the page can be scrolled past the map
 * on mobile and trackpad without hijacking.
 */
export function MapboxStates({
  chapter,
  selected,
  onSelect,
}: {
  chapter: Chapter;
  selected: string | null;
  onSelect: (code: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const featuresRef = useRef<FeatureCollection | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Load topojson + Mapbox once.
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setError("Mapbox token not set — set VITE_MAPBOX_TOKEN.");
      return;
    }
    if (!containerRef.current) return;
    let cancelled = false;
    (async () => {
      // Parallel: load mapbox-gl runtime + the topojson geometry.
      const [mapboxgl, topoRes] = await Promise.all([
        loadMapbox(),
        fetch(STATES_TOPO_URL).then((r) => r.json() as Promise<Topology>),
      ]);
      if (cancelled || !mapboxgl) {
        if (!cancelled) setError("Map couldn't load.");
        return;
      }

      // TopoJSON → GeoJSON. us-atlas exposes "states" as the object.
      const fc = feature(topoRes, topoRes.objects.states as GeometryCollection) as FeatureCollection;
      // Bake all metrics into properties.
      for (const f of fc.features) {
        const fips = String(f.id).padStart(2, "0");
        const code = STATE_FIPS_TO_CODE[fips];
        f.properties = f.properties ?? {};
        f.properties.code = code ?? null;
        f.properties.name = code ? undefined : (f.properties as any).name;
        if (code) {
          const m = stateMetrics[code];
          if (m) {
            for (const [k, v] of Object.entries(m)) {
              (f.properties as any)[`m_${k}`] = v;
            }
            (f.properties as any).m_justice_gap_index = metricValue(
              code,
              "justice_gap_index"
            );
          }
        }
      }
      featuresRef.current = fc;

      // Centroid points for the persistent PD-count overlay. We
      // approximate centroids by averaging polygon ring coordinates —
      // good enough at this scale; production would use turf.centroid.
      const pdPoints: FeatureCollection = {
        type: "FeatureCollection",
        features: fc.features
          .map((f) => {
            const code = (f.properties as any).code;
            if (!code) return null;
            const m = stateMetrics[code];
            if (!m) return null;
            const c = approxCentroid(f);
            if (!c) return null;
            return {
              type: "Feature",
              properties: {
                code,
                pd_caseload: m.pd_caseload,
                spend: m.indigent_spend_per_capita,
                label: `${m.pd_caseload}`,
              },
              geometry: { type: "Point", coordinates: c },
            } as Feature;
          })
          .filter(Boolean) as Feature[],
      };

      (mapboxgl as any).accessToken = MAPBOX_TOKEN;
      const map = new (mapboxgl as any).Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-96, 37.8],
        zoom: 3.2,
        projection: { name: "albers" },
        cooperativeGestures: true,
        attributionControl: true,
      });
      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;

        // Sources.
        map.addSource("states", {
          type: "geojson",
          data: featuresRef.current!,
          promoteId: "code",
        });
        map.addSource("pd-points", { type: "geojson", data: pdPoints });

        // Choropleth fill.
        map.addLayer({
          id: "states-fill",
          type: "fill",
          source: "states",
          paint: buildFillPaint(chapter),
        });
        // Highlight overlay for hover + selected.
        map.addLayer({
          id: "states-highlight",
          type: "line",
          source: "states",
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#ffe9b3",
              ["boolean", ["feature-state", "hover"], false],
              "#d4af6e",
              "transparent",
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              2.4,
              ["boolean", ["feature-state", "hover"], false],
              1.5,
              0,
            ],
          },
        });
        // Subtle state borders.
        map.addLayer({
          id: "states-border",
          type: "line",
          source: "states",
          paint: {
            "line-color": "rgba(20, 26, 36, 0.6)",
            "line-width": 0.6,
          },
        });

        // Persistent PD-count overlay — cream circles sized by caseload,
        // labels in bold beside.
        map.addLayer({
          id: "pd-circles",
          type: "circle",
          source: "pd-points",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "pd_caseload"],
              200,
              4,
              500,
              10,
              800,
              16,
            ],
            "circle-color": "#ffe9b3",
            "circle-stroke-color": "#1a1f2b",
            "circle-stroke-width": 1.2,
            "circle-opacity": 0.92,
          },
        });
        map.addLayer({
          id: "pd-labels",
          type: "symbol",
          source: "pd-points",
          layout: {
            "text-field": ["get", "label"],
            "text-size": 11,
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, -1.3],
            "text-allow-overlap": false,
            "text-ignore-placement": false,
          },
          paint: {
            "text-color": "#1a1f2b",
            "text-halo-color": "#ffe9b3",
            "text-halo-width": 1.2,
          },
        });

        // Interaction.
        map.on("mousemove", "states-fill", (e: any) => {
          const f = e.features?.[0];
          if (!f) return;
          if (hovered) {
            map.setFeatureState(
              { source: "states", id: hovered },
              { hover: false }
            );
          }
          const code = (f.properties as any).code;
          if (code) {
            map.setFeatureState(
              { source: "states", id: code },
              { hover: true }
            );
            setHovered(code);
          }
        });
        map.on("mouseleave", "states-fill", () => {
          if (hovered) {
            map.setFeatureState(
              { source: "states", id: hovered },
              { hover: false }
            );
          }
          setHovered(null);
        });
        map.on("click", "states-fill", (e: any) => {
          const f = e.features?.[0];
          if (!f) return;
          const code = (f.properties as any).code;
          if (!code) return;
          onSelect(code);
        });

        setReady(true);
      });
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // We intentionally don't depend on chapter or selected here — the
    // load is one-shot. Chapter changes update paint via the separate
    // effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Repaint when the chapter changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    mapRef.current.setPaintProperty(
      "states-fill",
      "fill-color",
      (buildFillPaint(chapter) as any)["fill-color"]
    );
  }, [chapter, ready]);

  // Sync selected with feature-state + fitBounds when selection changes.
  useEffect(() => {
    if (!ready || !mapRef.current || !featuresRef.current) return;
    const map = mapRef.current;
    // Clear previous selection state.
    for (const f of featuresRef.current.features) {
      const code = (f.properties as any).code;
      if (code) {
        map.setFeatureState({ source: "states", id: code }, { selected: false });
      }
    }
    if (!selected) return;
    map.setFeatureState(
      { source: "states", id: selected },
      { selected: true }
    );
    // Fit bounds to the selected state.
    const f = featuresRef.current.features.find(
      (ff: Feature) => (ff.properties as any).code === selected
    );
    if (!f) return;
    const bounds = boundsOfFeature(f);
    if (bounds) {
      map.fitBounds(bounds, { padding: 60, duration: 700, maxZoom: 6.5 });
    }
  }, [selected, ready]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full bg-[hsl(220_30%_8%)]"
        style={{ height: 520 }}
      />
      {selected && (
        <button
          onClick={() => {
            onSelect(null);
            mapRef.current?.flyTo({
              center: [-96, 37.8],
              zoom: 3.2,
              duration: 700,
            });
          }}
          className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-[hsl(220_30%_12%/0.9)] backdrop-blur text-[hsl(40_30%_88%)] border border-[hsl(220_20%_24%)] rounded-md px-2.5 py-1.5 hover:text-[hsl(38_60%_70%)]"
        >
          ← Back to national view
        </button>
      )}
      {hovered && !selected && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-[hsl(220_30%_14%/0.95)] backdrop-blur border border-[hsl(220_20%_24%)] rounded-lg px-4 py-3 pointer-events-none">
          <div className="text-xs text-[hsl(38_60%_70%)] uppercase tracking-widest mb-0.5">
            {hovered}
          </div>
          <div className="text-sm text-[hsl(40_30%_90%)]">
            {pdLabel(hovered)} cases per public defender · ${pdSpend(hovered)} / resident
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-3 bg-[hsl(220_30%_12%/0.95)] backdrop-blur rounded-lg p-4 text-sm text-[hsl(8_55%_72%)] flex items-center justify-center text-center">
          {error}
        </div>
      )}
    </div>
  );
}

function pdLabel(code: string): string {
  return String(stateMetrics[code]?.pd_caseload ?? "—");
}
function pdSpend(code: string): string {
  const v = stateMetrics[code]?.indigent_spend_per_capita;
  return v == null ? "—" : v.toFixed(2);
}

/** Paint expression for the choropleth, reading the metric directly off the feature. */
function buildFillPaint(chapter: Chapter): { "fill-color": any; "fill-opacity": number } {
  const key = `m_${chapter.metric}`;
  const [lo, hi] = chapter.domain;
  const ramp = chapter.ramp;
  // interpolate stops across the domain
  const stops: any[] = [];
  for (let i = 0; i < ramp.length; i++) {
    const t = i / (ramp.length - 1);
    stops.push(lo + t * (hi - lo), ramp[i]);
  }
  return {
    "fill-color": [
      "case",
      ["==", ["coalesce", ["get", key], null], null],
      "hsl(220 20% 18%)",
      ["interpolate", ["linear"], ["get", key], ...stops],
    ],
    "fill-opacity": 0.85,
  };
}

/** Compute the approximate centroid of a polygon/multipolygon Feature. */
function approxCentroid(f: Feature): [number, number] | null {
  let sumX = 0,
    sumY = 0,
    n = 0;
  const visit = (coords: any) => {
    if (typeof coords[0] === "number") {
      sumX += coords[0];
      sumY += coords[1];
      n += 1;
    } else {
      for (const c of coords) visit(c);
    }
  };
  if (!f.geometry || !("coordinates" in f.geometry)) return null;
  visit((f.geometry as any).coordinates);
  if (n === 0) return null;
  return [sumX / n, sumY / n];
}

/** Compute the bounding box of a Feature as [[w,s],[e,n]]. */
function boundsOfFeature(f: Feature): [[number, number], [number, number]] | null {
  if (!f.geometry || !("coordinates" in f.geometry)) return null;
  let w = Infinity,
    e = -Infinity,
    s = Infinity,
    n = -Infinity;
  const visit = (coords: any) => {
    if (typeof coords[0] === "number") {
      w = Math.min(w, coords[0]);
      e = Math.max(e, coords[0]);
      s = Math.min(s, coords[1]);
      n = Math.max(n, coords[1]);
    } else {
      for (const c of coords) visit(c);
    }
  };
  visit((f.geometry as any).coordinates);
  if (!isFinite(w)) return null;
  return [
    [w, s],
    [e, n],
  ];
}
