/**
 * Static-file existence check for the Remotion composition.
 *
 * Remotion bundles everything under public/ as static assets. We need
 * to know at composition time whether a given path exists so we don't
 * mount a 404-ing <Audio> source (which fails the render rather than
 * silently no-oping).
 *
 * `getStaticFiles()` returns the manifest Remotion built when it
 * bundled the project. We index by `src` (the same relative path
 * passed to `staticFile()`).
 */

import { getStaticFiles } from "remotion";

let cache: Set<string> | null = null;

function index(): Set<string> {
  if (cache) return cache;
  try {
    const files = getStaticFiles();
    cache = new Set(files.map((f) => f.src));
  } catch {
    // Outside of the renderer (e.g. during type-checking or unit
    // tests) getStaticFiles() throws — treat that as "we don't know,
    // assume present" so the composition still renders.
    cache = null;
    return new Set();
  }
  return cache;
}

export function hasStaticFile(relativePath: string): boolean {
  const set = index();
  if (set.size === 0) return true; // outside renderer — assume present
  // Remotion prefixes static file `src` with the public-folder URL
  // path. Build both candidates and match either.
  return (
    set.has(relativePath) ||
    set.has(`/${relativePath}`) ||
    Array.from(set).some((s) => s.endsWith(`/${relativePath}`))
  );
}
