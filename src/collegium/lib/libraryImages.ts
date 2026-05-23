/**
 * Library-image manifest.
 *
 * Used across the marketing site to render reverent old-library backdrops
 * behind hero sections and feature modules. Each entry carries the
 * metadata the renderer + the legal/attribution footer need.
 *
 * Source URLs in `sourceUrl` are the canonical pages where licensing is
 * visible. `downloadUrl` is the direct image link the fetch script pulls
 * from. After fetch, images live under public/assets/library/{slug}.jpg
 * downsized to 1920px-wide JPEG at quality 82.
 *
 * Attribution is rendered by the LibraryImage component's <figcaption>
 * (when `requiresAttribution` is true) and always added to the global
 * /credits page.
 */

export type LibraryImage = {
  /** Slug — also the filename: public/assets/library/{slug}.jpg */
  slug: string;
  /** Display name of the library (e.g. "Trinity College Long Room"). */
  name: string;
  /** Short city / institution tag (e.g. "Dublin, Ireland"). */
  location: string;
  /** Direct URL to the original-resolution image. */
  downloadUrl: string;
  /** Source page URL where license is visible. */
  sourceUrl: string;
  /** License identifier — "CC-BY-SA-4.0" / "Unsplash" / "Pexels" / "CC0". */
  license: string;
  /** Whether visible attribution is required (not just in a footer). */
  requiresAttribution: boolean;
  /** Exact attribution string to display when required. */
  attributionString: string;
  /** Photographer / creator credit (always shown on /credits). */
  creator: string;
  /** Approximate original-resolution dimensions. */
  dimensions?: { w: number; h: number };
  /** Brief description of what's in the image. */
  description: string;
  /** Vibe — for matching to modules. */
  vibe: "reverent-dark" | "ornate-baroque" | "warm-wood" | "classical-light";
  /** Which Collegium feature this image visually fits best. */
  bestFor: "hero" | "chapters" | "mentorship" | "service" | "formation" | "advancement" | "nri" | "general";
};

/**
 * The catalog. Populated when the web-agent research lands. Each entry
 * is independently fetched by scripts/fetch-library-images.mjs — failures
 * skip rather than block (a 404 on one library doesn't kill the others).
 */
export const LIBRARY_IMAGES: LibraryImage[] = [];

/**
 * Helpers used by Modules.tsx + Landing.tsx.
 */
export function getLibraryImage(slug: string): LibraryImage | null {
  return LIBRARY_IMAGES.find((i) => i.slug === slug) ?? null;
}

export function imageForModule(
  moduleSlug: "chapters" | "mentorship" | "service" | "formation" | "advancement" | "nri"
): LibraryImage | null {
  return LIBRARY_IMAGES.find((i) => i.bestFor === moduleSlug) ?? null;
}

export function heroImage(): LibraryImage | null {
  return LIBRARY_IMAGES.find((i) => i.bestFor === "hero") ?? null;
}

/** All images that require visible attribution — used by the credits page. */
export function imagesRequiringAttribution(): LibraryImage[] {
  return LIBRARY_IMAGES.filter((i) => i.requiresAttribution);
}

/** All catalog entries, for /credits and the fetch script. */
export function allImages(): LibraryImage[] {
  return LIBRARY_IMAGES;
}
