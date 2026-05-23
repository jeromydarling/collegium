/**
 * Library-image manifest — one image only, used as a filtered backdrop
 * behind the homepage hero. Strahov's Theological Hall (Premonstratensian,
 * Prague) — the darkest and warmest of the candidate libraries, which
 * matches the "tucked subtly behind the hero" treatment best.
 *
 * To swap the hero image: edit downloadUrl + sourceUrl + attribution
 * here, push — the CI workflow fetches the new file and the page
 * picks it up automatically.
 */

export type LibraryImage = {
  /** Slug — also the filename: public/assets/library/{slug}.jpg */
  slug: string;
  name: string;
  location: string;
  downloadUrl: string;
  sourceUrl: string;
  license: string;
  requiresAttribution: boolean;
  attributionString: string;
  creator: string;
  dimensions?: { w: number; h: number };
  description: string;
};

export const LIBRARY_IMAGES: LibraryImage[] = [
  {
    slug: "strahov-theological-hall",
    name: "Strahov Library — Theological Hall",
    location: "Prague, Czechia · Premonstratensian (Norbertine)",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Strahov_Monastery_Library_(34800862940).jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Category:Theological_hall_of_Strahov_library",
    license: "CC BY-SA 2.0",
    requiresAttribution: true,
    attributionString:
      "Strahov Library, Theological Hall · Wikimedia Commons · CC BY-SA 2.0",
    creator: "Wikimedia Commons contributor",
    dimensions: { w: 6480, h: 4320 },
    description:
      "The 1670s Premonstratensian library hall in Prague. Low barrel vault, walnut shelves, stucco cartouches, candlelight-feel. Deep walnut and ochre tones — pairs naturally with cream + wine + gold under a duotone filter.",
  },
];

export function heroImage(): LibraryImage | null {
  return LIBRARY_IMAGES[0] ?? null;
}

export function allImages(): LibraryImage[] {
  return LIBRARY_IMAGES;
}

export function imagesRequiringAttribution(): LibraryImage[] {
  return LIBRARY_IMAGES.filter((i) => i.requiresAttribution);
}
