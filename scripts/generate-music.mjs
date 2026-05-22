#!/usr/bin/env node
/**
 * Generate background music for the walkthrough video via ElevenLabs Music.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... npm run music:generate
 *
 * Output:
 *   collegium-walkthrough/assets/music.mp3
 *
 * The composition's <audio data-start="0" data-duration="92"> picks the
 * file up automatically on the next render. If you want a different track,
 * edit MUSIC_PROMPT below and re-run; or drop your own .mp3 in at the
 * same path and skip this script.
 */

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const ASSETS_DIR = resolve(REPO_ROOT, "collegium-walkthrough/assets");
const OUTPUT_PATH = resolve(ASSETS_DIR, "music.mp3");

/* ------------------------------------------------------------------ */
/* Configuration — edit to taste, then re-run.                         */
/* ------------------------------------------------------------------ */

const MUSIC_LENGTH_MS = 92_000; // matches the composition duration

const MUSIC_PROMPT = `Warm, contemplative instrumental score for a documentary about
Catholic and Christian legal aid for the poor. Slow build over 90 seconds:
quiet piano and soft strings for the opening human moment, gentle warmth
through the network-explanation section, modest emotional lift at the
closing call. Reverent without being sacred-music; humane without being
sentimental. No vocals, no percussion peaks. Cinematic but restrained,
in the spirit of Ólafur Arnalds or Max Richter on a quiet day.`;

/* ------------------------------------------------------------------ */
/* ElevenLabs API call                                                  */
/* ------------------------------------------------------------------ */

const ENDPOINT = "https://api.elevenlabs.io/v1/music";
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  console.error(
    "✗ ELEVENLABS_API_KEY is not set.\n\n" +
      "  Generate one at https://elevenlabs.io/app/settings/api-keys\n" +
      "  Then re-run:\n\n" +
      "    ELEVENLABS_API_KEY=sk_... npm run music:generate\n"
  );
  process.exit(1);
}

console.log("• Requesting music from ElevenLabs…");
console.log(`  Length: ${(MUSIC_LENGTH_MS / 1000).toFixed(0)} seconds`);
console.log(`  Prompt: ${MUSIC_PROMPT.slice(0, 80)}…`);

async function generate() {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      prompt: MUSIC_PROMPT,
      music_length_ms: MUSIC_LENGTH_MS,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(
      `✗ ElevenLabs returned HTTP ${response.status}.\n` +
        (detail ? `  ${detail.slice(0, 400)}\n` : "") +
        "\n  If your account doesn't yet have the Music product enabled,\n" +
        "  request access from the ElevenLabs dashboard, or drop your own\n" +
        "  .mp3 into collegium-walkthrough/assets/music.mp3 to skip this step."
    );
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.mkdir(ASSETS_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, buffer);

  console.log(`✓ Wrote ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(1)} KB).`);
  console.log("");
  console.log("Re-render the video to bake the music in:");
  console.log("  npm run video:render");
}

generate().catch((err) => {
  console.error("✗ Failed to generate music:", err.message);
  process.exit(1);
});
