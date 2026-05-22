import { useEffect, useRef, useState } from "react";
import { Map, Bus, FootprintsIcon, Car, ExternalLink, MapPin, Clock } from "lucide-react";
import {
  loadMapbox,
  geocode,
  googleMapsDirections,
  distanceMiles,
  getDirections,
  getIsochrone,
  fmtDuration,
  fmtDistance,
  MAPBOX_TOKEN,
  type LatLng,
} from "../lib/maps";

/**
 * LocalMap — visual context for FindHelp.
 *
 * Shows the user's location plus a small set of legal-help pins. Each
 * pin has a "Get directions" deep-link that opens Google Maps in the
 * user's preferred travel mode (transit, walking, driving). Distances
 * are straight-line haversine — good enough for a "how far away is
 * this" sense without requiring a routing API.
 *
 * Graceful fallback: if no VITE_MAPBOX_TOKEN is set or the network
 * blocks Mapbox CDN, we render a clean list view instead of a broken
 * map. The deep-link buttons still work either way.
 */

export type MapResource = {
  id: string;
  name: string;
  address?: string;
  /** Precomputed coords if known; otherwise we geocode the address. */
  coords?: LatLng;
  kind?: "clinic" | "court" | "library" | "shelter" | "office";
};

export function LocalMap({
  origin,
  resources,
  jurisdiction,
}: {
  origin?: LatLng;
  resources: MapResource[];
  jurisdiction?: { city?: string; state?: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [resolvedOrigin, setResolvedOrigin] = useState<LatLng | null>(
    origin ?? null
  );
  const [resolved, setResolved] = useState<MapResource[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapResource | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);
  const [isochroneVisible, setIsochroneVisible] = useState(false);

  // Geocode the user's stated city + state if no origin was passed.
  useEffect(() => {
    if (resolvedOrigin || !jurisdiction || !MAPBOX_TOKEN) return;
    const query = [jurisdiction.city, jurisdiction.state]
      .filter(Boolean)
      .join(", ");
    if (!query) return;
    geocode(query).then((loc) => {
      if (loc) setResolvedOrigin(loc);
    });
  }, [jurisdiction, resolvedOrigin]);

  // Geocode any resources without coords.
  useEffect(() => {
    let cancelled = false;
    async function resolveAll() {
      const out: MapResource[] = [];
      for (const r of resources) {
        if (r.coords) {
          out.push(r);
          continue;
        }
        if (!r.address || !MAPBOX_TOKEN) {
          out.push(r);
          continue;
        }
        const loc = await geocode(r.address);
        out.push(loc ? { ...r, coords: loc } : r);
      }
      if (!cancelled) setResolved(out);
    }
    resolveAll();
    return () => {
      cancelled = true;
    };
  }, [resources]);

  // Render the map once we have a token, an origin, and DOM.
  useEffect(() => {
    if (!MAPBOX_TOKEN || !resolvedOrigin || !containerRef.current) return;
    let cancelled = false;
    (async () => {
      const mapboxgl = await loadMapbox();
      if (!mapboxgl || cancelled) {
        if (!cancelled) setError("Map couldn't load.");
        return;
      }
      (mapboxgl as any).accessToken = MAPBOX_TOKEN;
      const map = new (mapboxgl as any).Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [resolvedOrigin.lng, resolvedOrigin.lat],
        zoom: 11,
        attributionControl: true,
      });
      mapRef.current = map;
      map.on("load", () => {
        if (cancelled) return;
        // Origin pin (wine).
        new (mapboxgl as any).Marker({ color: "#5a1a2b" })
          .setLngLat([resolvedOrigin.lng, resolvedOrigin.lat])
          .setPopup(
            new (mapboxgl as any).Popup({ offset: 18 }).setHTML(
              `<strong>You are here</strong>`
            )
          )
          .addTo(map);
        // Resource pins (gold).
        for (const r of resolved) {
          if (!r.coords) continue;
          const marker = new (mapboxgl as any).Marker({ color: "#b8923a" })
            .setLngLat([r.coords.lng, r.coords.lat])
            .setPopup(
              new (mapboxgl as any).Popup({ offset: 18 }).setHTML(
                `<strong>${escapeHtml(r.name)}</strong>${
                  r.address
                    ? `<br/><span style="font-size:11px">${escapeHtml(
                        r.address
                      )}</span>`
                    : ""
                }`
              )
            )
            .addTo(map);
          marker.getElement().addEventListener("click", () => setSelected(r));
        }
        // Add placeholder layers we'll fill in later when a route or
        // isochrone is requested.
        map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#5a1a2b",
            "line-width": 4,
            "line-opacity": 0.85,
          },
        });
        map.addSource("isochrone", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        map.addLayer(
          {
            id: "isochrone-fill",
            type: "fill",
            source: "isochrone",
            paint: {
              "fill-color": [
                "match",
                ["get", "contour"],
                15,
                "#b8923a",
                30,
                "#5a1a2b",
                "#888",
              ],
              "fill-opacity": 0.18,
            },
          },
          "route-line"
        );
        map.addLayer(
          {
            id: "isochrone-line",
            type: "line",
            source: "isochrone",
            paint: {
              "line-color": [
                "match",
                ["get", "contour"],
                15,
                "#b8923a",
                30,
                "#5a1a2b",
                "#888",
              ],
              "line-width": 1.5,
              "line-dasharray": [2, 2],
              "line-opacity": 0.85,
            },
          },
          "route-line"
        );
        // Fit bounds.
        const pts = [resolvedOrigin, ...resolved.map((r) => r.coords).filter(Boolean) as LatLng[]];
        if (pts.length > 1) {
          const bounds = new (mapboxgl as any).LngLatBounds();
          for (const p of pts) bounds.extend([p.lng, p.lat]);
          map.fitBounds(bounds, { padding: 60, duration: 0 });
        }
        setMapReady(true);
      });
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [resolvedOrigin, resolved]);

  // When the user selects a pin, fetch a walking-route GeoJSON and
  // draw it onto the map. Walking is the in-app preview; transit goes
  // out to Google Maps where the GTFS data is.
  useEffect(() => {
    if (!mapReady || !mapRef.current || !resolvedOrigin || !selected?.coords) {
      // Clear any prior route.
      if (mapRef.current?.getSource("route")) {
        (mapRef.current.getSource("route") as any).setData({
          type: "FeatureCollection",
          features: [],
        });
      }
      setRouteInfo(null);
      return;
    }
    let cancelled = false;
    getDirections(resolvedOrigin, selected.coords, "walking").then((feature) => {
      if (cancelled || !feature || !mapRef.current) return;
      (mapRef.current.getSource("route") as any).setData({
        type: "FeatureCollection",
        features: [feature],
      });
      setRouteInfo({
        duration: feature.properties?.duration as number,
        distance: feature.properties?.distance as number,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [selected, mapReady, resolvedOrigin]);

  // Isochrone overlay — what's reachable on foot in 15 / 30 minutes
  // from the user's location.
  useEffect(() => {
    if (!mapReady || !mapRef.current || !resolvedOrigin) return;
    if (!isochroneVisible) {
      (mapRef.current.getSource("isochrone") as any)?.setData({
        type: "FeatureCollection",
        features: [],
      });
      return;
    }
    let cancelled = false;
    getIsochrone(resolvedOrigin, [15, 30], "walking").then((fc) => {
      if (cancelled || !fc || !mapRef.current) return;
      (mapRef.current.getSource("isochrone") as any).setData(fc);
    });
    return () => {
      cancelled = true;
    };
  }, [isochroneVisible, mapReady, resolvedOrigin]);

  const withCoords = resolved.filter((r) => r.coords);

  // Render fallback if no token or no origin.
  if (!MAPBOX_TOKEN) {
    return (
      <FallbackList
        resources={resources}
        jurisdiction={jurisdiction}
        reason="To enable the interactive map, set VITE_MAPBOX_TOKEN in your build environment. Below is the list view; directions still work."
      />
    );
  }

  if (!resolvedOrigin) {
    return (
      <FallbackList
        resources={resources}
        jurisdiction={jurisdiction}
        reason="Set your city and state above to see resources on a map."
      />
    );
  }

  return (
    <div className="collegium-card overflow-hidden">
      <header className="px-4 sm:px-5 py-3 border-b border-[hsl(var(--c-border))] flex items-center gap-2 bg-[hsl(var(--c-cream-warm))]">
        <Map size={14} className="text-[hsl(var(--c-wine))] shrink-0" />
        <h3 className="font-medium text-sm text-[hsl(var(--c-ink))]">
          Resources near you
        </h3>
        <button
          onClick={() => setIsochroneVisible((v) => !v)}
          className={`ml-auto inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
            isochroneVisible
              ? "bg-[hsl(var(--c-wine))] text-white border-[hsl(var(--c-wine))]"
              : "bg-white text-[hsl(var(--c-wine))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
          }`}
          title="Show 15- and 30-minute walking range from your location"
        >
          <Clock size={11} /> What I can walk to
        </button>
      </header>
      <div
        ref={containerRef}
        className="w-full h-[300px] sm:h-[420px] bg-[hsl(var(--c-cream-warm))]"
      />
      {routeInfo && selected && (
        <div className="px-4 sm:px-5 py-3 border-b border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream-warm))]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className="font-medium text-[hsl(var(--c-ink))]">
              Walking to {selected.name}:
            </span>
            <span className="text-[hsl(var(--c-wine))]">
              <FootprintsIcon size={11} className="inline mr-1" />
              {fmtDuration(routeInfo.duration)} · {fmtDistance(routeInfo.distance)}
            </span>
            <a
              href={googleMapsDirections({
                origin: resolvedOrigin,
                destination:
                  selected.address ||
                  `${selected.coords!.lat},${selected.coords!.lng}`,
                mode: "transit",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs collegium-link inline-flex items-center gap-1 ml-auto"
            >
              <Bus size={11} /> See on transit
            </a>
          </div>
        </div>
      )}
      {error && (
        <div className="p-3 text-xs text-[hsl(8_55%_42%)]">{error}</div>
      )}
      <div className="p-4 sm:p-5 space-y-3 border-t border-[hsl(var(--c-border))]">
        {withCoords.map((r) => (
          <ResourceRow
            key={r.id}
            resource={r}
            origin={resolvedOrigin}
            selected={selected?.id === r.id}
            onSelect={() => setSelected(r)}
          />
        ))}
        {isochroneVisible && (
          <div className="text-[11px] text-[hsl(var(--c-slate-soft))] pt-2 border-t border-[hsl(var(--c-border))] flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[hsl(38_52%_50%/0.25)] border border-[hsl(38_52%_50%)]" />
              within 15 min walk
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[hsl(354_55%_26%/0.18)] border border-[hsl(354_55%_26%)]" />
              within 30 min walk
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceRow({
  resource,
  origin,
  selected,
  onSelect,
}: {
  resource: MapResource;
  origin: LatLng;
  selected?: boolean;
  onSelect?: () => void;
}) {
  if (!resource.coords) return null;
  const dist = distanceMiles(origin, resource.coords).toFixed(1);
  const destStr = resource.address || `${resource.coords.lat},${resource.coords.lng}`;
  return (
    <div
      className={`flex items-start gap-3 -mx-1 px-2 py-2 rounded-md transition-colors cursor-pointer ${
        selected ? "bg-[hsl(var(--c-wine)/0.06)]" : "hover:bg-[hsl(var(--c-cream-warm))]"
      }`}
      onClick={onSelect}
    >
      <MapPin
        size={14}
        className={
          selected
            ? "text-[hsl(var(--c-wine))] mt-1 shrink-0"
            : "text-[hsl(var(--c-gold))] mt-1 shrink-0"
        }
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-[hsl(var(--c-ink))] leading-snug">
          {resource.name}
        </div>
        {resource.address && (
          <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-2 truncate">
            {resource.address} · {dist} mi
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          <DirectionLink
            label="Transit"
            icon={Bus}
            url={googleMapsDirections({
              origin,
              destination: destStr,
              mode: "transit",
            })}
          />
          <DirectionLink
            label="Walk"
            icon={FootprintsIcon}
            url={googleMapsDirections({
              origin,
              destination: destStr,
              mode: "walking",
            })}
          />
          <DirectionLink
            label="Drive"
            icon={Car}
            url={googleMapsDirections({
              origin,
              destination: destStr,
              mode: "driving",
            })}
          />
        </div>
      </div>
    </div>
  );
}

function DirectionLink({
  label,
  icon: Icon,
  url,
}: {
  label: string;
  icon: typeof Bus;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[hsl(var(--c-border))] text-[hsl(var(--c-wine))] hover:border-[hsl(var(--c-wine)/0.4)] hover:bg-[hsl(var(--c-wine)/0.04)] transition-colors"
    >
      <Icon size={11} /> {label}
      <ExternalLink size={9} />
    </a>
  );
}

function FallbackList({
  resources,
  jurisdiction,
  reason,
}: {
  resources: MapResource[];
  jurisdiction?: { city?: string; state?: string };
  reason: string;
}) {
  const originStr = [jurisdiction?.city, jurisdiction?.state]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-start gap-2 mb-4">
        <Map size={14} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
        <p className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed">
          {reason}
        </p>
      </div>
      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <MapPin
              size={14}
              className="text-[hsl(var(--c-gold))] mt-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[hsl(var(--c-ink))] leading-snug">
                {r.name}
              </div>
              {r.address && (
                <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-2">
                  {r.address}
                </div>
              )}
              {r.address && (
                <a
                  href={googleMapsDirections({
                    origin: originStr || undefined,
                    destination: r.address,
                    mode: "transit",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs collegium-link inline-flex items-center gap-1"
                >
                  Get transit directions <ExternalLink size={10} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
