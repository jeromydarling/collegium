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
 * The catalog. Seven Catholic-monastic libraries — one per Collegium
 * module plus a hero. Picks intentionally lean toward houses of canons
 * regular, Benedictines, Jesuits, Franciscans, and Premonstratensians,
 * so the visual catechesis of the features page mirrors the orders
 * whose work the platform stands inside.
 *
 * To swap any image: edit downloadUrl + sourceUrl + attribution here,
 * then push — the CI workflow auto-fetches and the page picks up the
 * new file the next time it renders.
 *
 * URL pattern: `Special:FilePath/{filename}` is Wikimedia's normalized
 * redirect to the original file. More tolerant of filename quirks than
 * direct upload.wikimedia.org URLs and doesn't need the content-hash
 * subpath that varies per upload.
 */
export const LIBRARY_IMAGES: LibraryImage[] = [
  {
    slug: "wiblingen-bibliothekssaal",
    name: "Wiblingen Abbey Library",
    location: "Ulm, Germany · Benedictine, founded 1093",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kloster_Wiblingen_Bibliothekssaal_01.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kloster_Wiblingen_Bibliothekssaal_01.jpg",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString: "Wiblingen Abbey Library · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 3492, h: 2328 },
    description:
      "Rococo Bibliothekssaal in head-on perspective — white-and-gold columns, sky-blue ceiling fresco by Franz Martin Kuen depicting Wisdom and the cardinal virtues, books receding into the vault.",
    vibe: "ornate-baroque",
    bestFor: "hero",
  },
  {
    slug: "biblioteca-joanina-coimbra",
    name: "Biblioteca Joanina",
    location: "Coimbra, Portugal · originally Jesuit",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Biblioteca_Joanina_-_Coimbra,_Portugal.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Interior_of_Biblioteca_Joanina",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString:
      "Biblioteca Joanina · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 5304, h: 3536 },
    description:
      "Three interconnected baroque halls aligned like the naves of a basilica. Gold-on-green, gold-on-red, gold-on-black bookcases under vaulted painted ceilings — the most Catholic-feeling reading room in Iberia.",
    vibe: "ornate-baroque",
    bestFor: "chapters",
  },
  {
    slug: "stiftsbibliothek-st-gallen",
    name: "St. Gallen Abbey Library",
    location: "St. Gallen, Switzerland · Benedictine",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Stiftsbibliothek_St._Gallen_Innenraum.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Stiftsbibliothek_St._Gallen",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString:
      "Stiftsbibliothek St. Gallen · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 4000, h: 2670 },
    description:
      "Peter Thumb's 1758–67 rococo hall. The inscription over the door reads ΨΥΧΗΣ ΙΑΤΡΕΙΟΝ — 'Healing place of the soul.' Carved polished walnut, stucco, soft pastel ceiling.",
    vibe: "warm-wood",
    bestFor: "mentorship",
  },
  {
    slug: "codrington-all-souls",
    name: "Codrington Library, All Souls College",
    location: "Oxford, England · Hawksmoor, 1716–51",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/All_Souls_College_Codrington_Library_2.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:All_Souls_College_Library,_Oxford",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString:
      "All Souls College Library · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 4000, h: 2667 },
    description:
      "Single immense barrel-vaulted hall — white-painted bookcases, original sloping baluster reading desks, and at the east end a marble statue of William Blackstone in his judge's robes. Blackstone is the patron of common-law jurisprudence and pro bono lineage.",
    vibe: "classical-light",
    bestFor: "service",
  },
  {
    slug: "melk-bibliothek",
    name: "Melk Abbey Library",
    location: "Melk, Austria · Benedictine, founded 1089",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Stift_Melk_Bibliothek_001.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Library_of_Melk_Abbey",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString:
      "Melk Abbey Library · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 3648, h: 2432 },
    description:
      "Warm honey-and-gold Benedictine library with two-tier walnut bookshelves and Paul Troger's ceiling fresco of Faith. The ordered shelves say 'weekly Aquinas reading group' exactly.",
    vibe: "warm-wood",
    bestFor: "formation",
  },
  {
    slug: "strahov-philosophical-hall",
    name: "Strahov Library — Philosophical Hall",
    location: "Prague, Czechia · Premonstratensian (Norbertine)",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Strahov_Library_Philosophical_Hall.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Philosophical_hall_of_Strahov_library",
    license: "CC BY-SA 4.0",
    requiresAttribution: true,
    attributionString:
      "Strahov Library, Philosophical Hall · Wikimedia Commons · CC BY-SA 4.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 4320, h: 3240 },
    description:
      "Two-storey Premonstratensian library with a clerestory pulling light to the upper balcony. Anton Maulbertsch's ceiling fresco, 'Intellectual Progress of Mankind,' is the leadership-pipeline metaphor in fresco form.",
    vibe: "ornate-baroque",
    bestFor: "advancement",
  },
  {
    slug: "mafra-palace-library",
    name: "Mafra Palace Library",
    location: "Mafra, Portugal · originally Franciscan convent",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Library_of_the_Convent_of_Mafra.JPG",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Library_of_the_Mafra_National_Palace",
    license: "CC BY-SA 3.0",
    requiresAttribution: true,
    attributionString:
      "Mafra Palace Library · Joseolgon · Wikimedia Commons · CC BY-SA 3.0",
    creator: "Joseolgon",
    dimensions: { w: 4000, h: 2667 },
    description:
      "An 88-metre rococo gallery in pink, grey, and white marble with white-and-gilt bookcases the full length of the hall. The convent still houses bats that protect the books from insects — a guardianship still in active office.",
    vibe: "ornate-baroque",
    bestFor: "nri",
  },
];

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
