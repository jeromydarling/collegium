/**
 * Generate narration audio via ElevenLabs Text-to-Speech for the
 * Justice Gap video.
 *
 * Reads the line catalog from src/remotion/narration.ts (single
 * source of truth shared with the Remotion composition) and writes
 * one mp3 per line into public/assets/audio/narration/.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... npx vite-node scripts/generate-narration.ts
 *
 * Or via npm:
 *   npm run narration:generate
 *
 * Re-runs are idempotent: each call overwrites the previous mp3. To
 * regenerate only one line, pass its id:
 *   npx vite-node scripts/generate-narration.ts -- --only=02-bignumber
 *
 * CI: the .github/workflows/render-video.yml job calls this script
 * before rendering. The ELEVENLABS_API_KEY repo secret powers it.
 *
 * Cost note: at 5,000-character monthly budget on the Starter tier,
 * the six narration lines total ~700 characters — generating the
 * full set costs about $0.20 per regeneration.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import {
  NARRATION_LINES,
  DEFAULT_VOICE_ID,
  DEFAULT_MODEL_ID,
  narrationFilePath,
  type NarrationLine,
} from "../src/remotion/narration";

const API_BASE = "https://api.elevenlabs.io";
const PUBLIC_ROOT = resolve(process.cwd(), "public");

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error(
      "ERROR: ELEVENLABS_API_KEY environment variable is not set.\n" +
        "Set it from your ElevenLabs dashboard (https://elevenlabs.io/app/settings/api-keys)\n" +
        "and re-run: ELEVENLABS_API_KEY=sk_... npm run narration:generate"
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const onlyId = onlyArg ? onlyArg.slice("--only=".length) : null;

  const lines = onlyId
    ? NARRATION_LINES.filter((l) => l.id === onlyId)
    : NARRATION_LINES;

  if (lines.length === 0) {
    console.error(`No narration lines match --only=${onlyId}`);
    process.exit(1);
  }

  console.log(
    `Generating ${lines.length} narration line(s) via ElevenLabs ${DEFAULT_MODEL_ID}...`
  );

  for (const line of lines) {
    await generateOne(line, apiKey);
  }

  console.log(`\nDone. Files in public/assets/audio/narration/`);
}

async function generateOne(line: NarrationLine, apiKey: string): Promise<void> {
  const voiceId = line.voiceId ?? DEFAULT_VOICE_ID;
  const url = `${API_BASE}/v1/text-to-speech/${voiceId}`;

  const body = {
    text: line.text,
    model_id: DEFAULT_MODEL_ID,
    voice_settings: {
      stability: line.stability ?? 0.55,
      similarity_boost: line.similarityBoost ?? 0.75,
      style: line.style ?? 0,
      use_speaker_boost: true,
    },
  };

  console.log(`  → ${line.id}  (${line.text.length} chars)`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(
      `ElevenLabs API error for ${line.id} (${response.status}): ${errBody}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = resolve(PUBLIC_ROOT, narrationFilePath(line));
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  const sizeKb = (buffer.byteLength / 1024).toFixed(1);
  console.log(`    saved ${filePath.replace(process.cwd() + "/", "")} (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
