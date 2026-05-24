/**
 * Narration script for the Justice Gap video.
 *
 * Single source of truth for both:
 *   - scripts/generate-narration.ts (calls ElevenLabs TTS per line)
 *   - src/remotion/JusticeGap.tsx (mounts <Audio> per line at the
 *     right composition offset)
 *
 * Each line carries the text, the voice id, the scene it belongs to,
 * and the in-scene start time (seconds — translated to frames by the
 * composition).
 *
 * Voice catalog (ElevenLabs public voices):
 *   nPczCjzI2devNBz1zQrb  Brian   — deep, serious, mature male
 *   JBFqnCBsd6RMkjVDRZzb  George  — warm British male
 *   21m00Tcm4TlvDq8ikWAM  Rachel  — clear American female
 *   XB0fDUnXU5powFXDhCwa  Charlotte — measured female
 *
 * Pick one voice for consistency. Brian is the default for this short:
 * the somber, measured tone fits the material.
 */

export const DEFAULT_VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian
export const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export interface NarrationLine {
  /** Stable id — used as the filename in public/assets/audio/narration/. */
  id: string;
  /** Which scene this line plays in. */
  scene:
    | "opening"
    | "bigNumber"
    | "lawyerDensity"
    | "evictionCourt"
    | "volume"
    | "closing";
  /** Seconds INTO the scene the line starts playing. */
  startInScene: number;
  /** The text to speak. Hyphens for natural pauses; periods for breaths. */
  text: string;
  /** ElevenLabs voice id. Defaults to DEFAULT_VOICE_ID. */
  voiceId?: string;
  /** Voice settings — defaults are tuned for measured documentary narration. */
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

export const NARRATION_LINES: NarrationLine[] = [
  // Opening — let the title breathe; no narration on this scene.

  // BigNumber scene starts at composition second 4.
  // Number lands around in-scene frame 50 (~1.7s in). Narration starts
  // just after the number is full, so the viewer reads "92%" then hears
  // it named.
  {
    id: "02-bignumber",
    scene: "bigNumber",
    startInScene: 2.0,
    text: "Ninety-two percent. Of substantial civil legal problems faced by low-income Americans, ninety-two percent get inadequate, or no, legal help.",
    stability: 0.55,
    similarityBoost: 0.75,
  },

  // LawyerDensity at composition second 14.
  {
    id: "03-lawyer-density",
    scene: "lawyerDensity",
    startInScene: 1.0,
    text: "Lawyers per ten thousand people. The general population has roughly forty. Below the poverty line, just one. A forty-to-one disparity.",
    stability: 0.55,
    similarityBoost: 0.75,
  },

  // EvictionCourt at composition second 24.
  {
    id: "04-eviction-court",
    scene: "evictionCourt",
    startInScene: 1.0,
    text: "Inside an eviction courtroom. Out of every hundred cases, ninety landlords appear with a lawyer. Ten tenants do. The case is over before it begins.",
    stability: 0.55,
    similarityBoost: 0.75,
  },

  // Volume at composition second 34.
  {
    id: "05-volume",
    scene: "volume",
    startInScene: 1.0,
    text: "Annual events in the United States. Ten million arrests, all crimes. One hundred and fifty million unmet civil legal events. The civil story is fifteen times larger — and has no Gideon.",
    stability: 0.55,
    similarityBoost: 0.75,
  },

  // Closing at composition second 46.
  // The Latin line is at-frame ~70 in this scene; narration covers the
  // English gloss after.
  {
    id: "06-closing",
    scene: "closing",
    startInScene: 0.5,
    text: "The civil side has no Gideon. The work is unfinished. Iustitia tenax — tenacious justice. Collegium. A guild for Christian lawyers.",
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.15,
  },
];

/**
 * Composition-frame offset of each scene's start (kept in sync with
 * JusticeGap.tsx slot()).  Used by the composition to translate
 * startInScene → absolute composition frame.
 */
export const SCENE_START_FRAMES: Record<NarrationLine["scene"], number> = {
  opening: 0,
  bigNumber: 4 * 30,
  lawyerDensity: 14 * 30,
  evictionCourt: 24 * 30,
  volume: 34 * 30,
  closing: 46 * 30,
};

/** File path the generator writes to and the composition reads from. */
export function narrationFilePath(line: NarrationLine): string {
  return `assets/audio/narration/${line.id}.mp3`;
}
