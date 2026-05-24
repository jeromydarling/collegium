/**
 * PDF image helper — loads the Strahov library photo for use as a faded
 * background on title pages and section openers.
 *
 * Works in both node (sample generation via vite-node) and the
 * browser (when the user clicks "Generate PDF").
 */

const LIBRARY_IMAGE_PATH = "assets/library/strahov-theological-hall.jpg";

let cached: string | null = null;
let cacheFailed = false;

/**
 * Load the Strahov image as a base64 data URL. Returns null if the
 * image cannot be loaded (don't block PDF generation on missing
 * background).
 */
export async function loadLibraryImage(): Promise<string | null> {
  if (cached) return cached;
  if (cacheFailed) return null;

  try {
    if (typeof window === "undefined") {
      // Node — read directly from public/
      const fs = await import("node:fs");
      const path = await import("node:path");
      const filePath = path.resolve(process.cwd(), "public", LIBRARY_IMAGE_PATH);
      const buffer = fs.readFileSync(filePath);
      cached = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      return cached;
    }
    // Browser — fetch with Vite's BASE_URL respected
    const base =
      (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
    const url = `${base.replace(/\/$/, "")}/${LIBRARY_IMAGE_PATH}`;
    const response = await fetch(url);
    if (!response.ok) {
      cacheFailed = true;
      return null;
    }
    const blob = await response.blob();
    cached = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        typeof reader.result === "string"
          ? resolve(reader.result)
          : reject(new Error("Image read produced non-string"));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return cached;
  } catch {
    cacheFailed = true;
    return null;
  }
}

/**
 * Library photo's natural aspect ratio. The Strahov photo is 6480×4320
 * → 1.5 (landscape).
 */
export const LIBRARY_IMAGE_ASPECT = 6480 / 4320;
