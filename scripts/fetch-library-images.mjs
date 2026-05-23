#!/usr/bin/env node
/**
 * Fetch + downscale library images for the marketing site.
 *
 * Reads the manifest from src/collegium/lib/libraryImages.ts (via a tiny
 * runtime import-and-extract), downloads each `downloadUrl`, validates
 * it's actually an image, downsizes to 1920px-wide JPEG at quality 82,
 * and writes to public/assets/library/{slug}.jpg.
 *
 * Failures per-image don't block the rest. The script exits 1 if any
 * image failed so CI surfaces the issue.
 *
 * No image processing deps — uses `sharp` if present, falls back to
 * raw save if not.
 *
 * Usage:
 *   npm run library:fetch
 *
 * Env:
 *   IMAGES_DIR=public/assets/library  (override output dir)
 *   MAX_WIDTH=1920                    (downscale ceiling)
 *   JPEG_QUALITY=82                   (output quality)
 */

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const OUTPUT_DIR = resolve(
  REPO_ROOT,
  process.env.IMAGES_DIR ?? "public/assets/library"
);
const MAX_WIDTH = Number(process.env.MAX_WIDTH ?? 1920);
const JPEG_QUALITY = Number(process.env.JPEG_QUALITY ?? 82);

async function loadManifest() {
  // Read the TS source and extract the array literal. Avoids needing a
  // TS toolchain on the CI runner; the manifest is hand-authored data,
  // not compiled types.
  const tsPath = resolve(
    REPO_ROOT,
    "src/collegium/lib/libraryImages.ts"
  );
  const source = await fs.readFile(tsPath, "utf-8");

  // Find the LIBRARY_IMAGES array literal and parse it.
  const match = source.match(
    /export const LIBRARY_IMAGES: LibraryImage\[\] = (\[[\s\S]*?\n\]);/
  );
  if (!match) {
    throw new Error(
      "Could not find LIBRARY_IMAGES array in src/collegium/lib/libraryImages.ts. Did the shape change?"
    );
  }

  // Convert TS object-literal-with-trailing-commas to JSON via a few
  // small substitutions. This is fragile by design — when the manifest
  // grows complex, swap for a proper TS parser.
  const literal = match[1];
  let jsonish = literal
    // Strip trailing commas before } or ]
    .replace(/,(\s*[}\]])/g, "$1")
    // Quote unquoted property keys
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  try {
    return JSON.parse(jsonish);
  } catch (err) {
    console.error("Failed to parse manifest. Snippet:");
    console.error(jsonish.slice(0, 500));
    throw err;
  }
}

let sharp;
try {
  sharp = (await import("sharp")).default;
  console.log("• Using sharp for image processing");
} catch {
  console.log("• sharp not available — saving raw bytes (no downscaling)");
}

async function fetchOne(image) {
  const outPath = resolve(OUTPUT_DIR, `${image.slug}.jpg`);
  console.log(`  ${image.slug} (${image.name})`);
  console.log(`    ← ${image.downloadUrl}`);
  let response;
  try {
    response = await fetch(image.downloadUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; CollegiumImagesBot/1.0; +https://collegium.network)",
        accept: "image/*",
      },
      redirect: "follow",
    });
  } catch (err) {
    console.log(`    ✗ Network error: ${err.message}`);
    return false;
  }
  if (!response.ok) {
    console.log(`    ✗ HTTP ${response.status}`);
    return false;
  }
  const ct = response.headers.get("content-type") ?? "";
  if (!ct.startsWith("image/")) {
    console.log(`    ✗ Not an image (content-type: ${ct})`);
    return false;
  }

  const buf = Buffer.from(await response.arrayBuffer());
  if (sharp) {
    try {
      const meta = await sharp(buf).metadata();
      const widthIn = meta.width ?? 0;
      const out = await sharp(buf, { failOn: "error" })
        .resize({
          width: Math.min(MAX_WIDTH, widthIn || MAX_WIDTH),
          withoutEnlargement: true,
        })
        .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
        .toBuffer();
      await fs.writeFile(outPath, out);
      console.log(
        `    ✓ ${widthIn}px → ${Math.min(MAX_WIDTH, widthIn || MAX_WIDTH)}px · ${(out.length / 1024).toFixed(1)} KB`
      );
      return true;
    } catch (err) {
      console.log(`    ✗ sharp failed: ${err.message}`);
      return false;
    }
  }
  // No sharp — save raw
  await fs.writeFile(outPath, buf);
  console.log(`    ✓ saved raw ${(buf.length / 1024).toFixed(1)} KB`);
  return true;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const manifest = await loadManifest();
  console.log(`Fetching ${manifest.length} library images → ${OUTPUT_DIR}`);
  console.log("");
  let ok = 0;
  let failed = 0;
  for (const image of manifest) {
    const success = await fetchOne(image);
    if (success) ok++;
    else failed++;
    console.log("");
  }
  console.log(`Done. ${ok} of ${manifest.length} fetched successfully.`);
  if (failed > 0) {
    console.log("");
    console.log(
      `${failed} image(s) failed. Update the URL in src/collegium/lib/libraryImages.ts`
    );
    console.log("and re-run, or skip the failed ones if they're optional.");
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
