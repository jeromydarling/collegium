/**
 * Visual constants shared across scenes. Matches the rest of the app's
 * wine + gold + cream + ink palette so the video looks like part of
 * the same artifact.
 */

export const COLORS = {
  cream: "#f5ede0",
  creamWarm: "#ede0c8",
  ink: "#2a1f24",
  wine: "#6c1c30",
  wineDeep: "#4a1220",
  gold: "#a58246",
  goldBright: "#c89a52",
  slate: "#6e6469",
  slateSoft: "#9b8f93",
} as const;

export const FONTS = {
  // Loaded via @remotion/google-fonts in scenes that use them
  display: "EB Garamond",
  body: "Crimson Pro",
  mono: "JetBrains Mono",
};

/** Frame-rate constant we use everywhere. Keep in sync with Root.tsx. */
export const FPS = 30;

export const sec = (s: number): number => Math.round(s * FPS);
