/**
 * Map + transit helpers.
 *
 * For the homepage state-level choropleth we use react-simple-maps —
 * no API key, pure SVG, no third-party token required.
 *
 * For the FindHelp local-resources map we use Mapbox GL JS, loaded
 * from the CDN on demand, with a public token (pk.*). Mapbox public
 * tokens are designed to be exposed in browser code — they're
 * referrer-restricted server-side, so a real production token sits
 * safely in a client bundle. The token sits in VITE_MAPBOX_TOKEN.
 *
 * For directions we deep-link to Google Maps using its public URL
 * scheme. This requires no API key, works on every device, and lets
 * the user pick their preferred travel mode (transit, walking,
 * driving, cycling) inside Google Maps itself — which has the most
 * complete public-transit dataset in the U.S.
 *
 * Future integration points named here so the slots are reserved:
 *   • Transit-feed APIs (Transitland, OneBusAway, OpenTripPlanner) for
 *     embedded route-planning without leaving Auxilium. Not lit up
 *     today because the UX of "open Google Maps, pick your mode" is
 *     already better than 90% of in-app transit planners.
 */

// Mapbox public tokens (pk.*) live in the client bundle by design — they're
// referrer-restricted server-side. Set VITE_MAPBOX_TOKEN as a GitHub repo
// secret so the deploy workflow can inject it at build time. The map
// component renders a friendly "token not set" placeholder when missing.
export const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN || "";

export type LatLng = { lat: number; lng: number };

/** Build a Google Maps directions deep-link. */
export function googleMapsDirections(args: {
  origin?: LatLng | string;
  destination: LatLng | string;
  mode?: "transit" | "walking" | "driving" | "bicycling";
}): string {
  const params = new URLSearchParams({
    api: "1",
    travelmode: args.mode ?? "transit",
  });
  if (args.origin) params.set("origin", encodeLoc(args.origin));
  params.set("destination", encodeLoc(args.destination));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function encodeLoc(loc: LatLng | string): string {
  if (typeof loc === "string") return loc;
  return `${loc.lat},${loc.lng}`;
}

/** Trivial straight-line distance (haversine) in miles. */
export function distanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Loose typing for the mapbox-gl runtime we load from CDN. */
type MapboxGl = {
  accessToken: string;
  Map: any;
  Marker: any;
  Popup: any;
  LngLatBounds: any;
};

/**
 * Dynamically load mapbox-gl from a CDN. Returns the module's exports
 * once loaded. Caches across calls. Resolves to null if the network
 * isn't available so callers can render a graceful fallback.
 */
let mapboxModulePromise: Promise<MapboxGl | null> | null = null;
export function loadMapbox(): Promise<MapboxGl | null> {
  if (mapboxModulePromise) return mapboxModulePromise;
  mapboxModulePromise = new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }
    if (!document.querySelector('link[data-mapbox]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css";
      link.setAttribute("data-mapbox", "true");
      document.head.appendChild(link);
    }
    const existing = (window as any).mapboxgl;
    if (existing) {
      resolve(existing as MapboxGl);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js";
    script.async = true;
    script.onload = () => resolve((window as any).mapboxgl as MapboxGl);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return mapboxModulePromise;
}

/**
 * Geocode a free-form address through Mapbox's geocoding API. Returns
 * the first result, or null. Requires VITE_MAPBOX_TOKEN.
 */
export async function geocode(query: string): Promise<LatLng | null> {
  if (!MAPBOX_TOKEN) return null;
  if (!query.trim()) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&country=us&limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.features?.[0];
    if (!f) return null;
    const [lng, lat] = f.center as [number, number];
    return { lat, lng };
  } catch {
    return null;
  }
}

export type Mode = "walking" | "driving" | "cycling";

/** Minimal GeoJSON types we need — avoids depending on @types/geojson. */
type LineStringGeom = { type: "LineString"; coordinates: [number, number][] };
export type RouteFeature = {
  type: "Feature";
  properties: { duration: number; distance: number; mode: string };
  geometry: LineStringGeom;
};
export type FeatureCollection = { type: "FeatureCollection"; features: unknown[] };

/**
 * Mapbox Directions — get a route GeoJSON between two points. Supports
 * driving, walking, and cycling natively. Public transit routing is
 * not in Mapbox's first-party API today, so for transit we keep the
 * Google Maps deep-link as the canonical answer (it has the best US
 * GTFS coverage), and surface walking as the in-app preview.
 *
 * Returns a GeoJSON LineString, or null on failure.
 */
export async function getDirections(
  origin: LatLng,
  destination: LatLng,
  mode: Mode = "walking"
): Promise<RouteFeature | null> {
  if (!MAPBOX_TOKEN) return null;
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      type: "Feature",
      properties: {
        duration: route.duration as number,
        distance: route.distance as number,
        mode,
      },
      geometry: route.geometry as LineStringGeom,
    };
  } catch {
    return null;
  }
}

/**
 * Mapbox Isochrone API — what's reachable from a point within N minutes.
 * Profile: walking. Returns a GeoJSON polygon of the reachable area.
 *
 * Why walking and not transit: most low-income users without cars
 * walk to a bus stop. The walking isochrone tells them what's within
 * actual reach of their feet, which is the truth of their access. We
 * surface 15- and 30-minute walking rings — that's the practical
 * radius before they need to budget a bus fare and 45 minutes.
 */
export async function getIsochrone(
  origin: LatLng,
  minutes: number[] = [15, 30],
  mode: "walking" | "cycling" | "driving" = "walking"
): Promise<FeatureCollection | null> {
  if (!MAPBOX_TOKEN) return null;
  const contours = minutes.join(",");
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/${mode}/${origin.lng},${origin.lat}?contours_minutes=${contours}&polygons=true&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as FeatureCollection;
  } catch {
    return null;
  }
}

/** Format duration (seconds) as a short human string. */
export function fmtDuration(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} hr ${rest} min` : `${h} hr`;
}

/** Format distance (meters) as a short human string in miles. */
export function fmtDistance(meters: number): string {
  const mi = meters / 1609.344;
  if (mi < 0.2) return `${Math.round(meters * 3.281)} ft`;
  return `${mi.toFixed(1)} mi`;
}
