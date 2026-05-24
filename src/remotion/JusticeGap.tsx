/**
 * The Justice Gap — animated short.
 *
 * 60 seconds at 30fps. Six scenes, each scene mounted via <Sequence>
 * so they share one timeline but compose independently:
 *
 *   0–4s    Opening
 *   4–14s   The 92% (giant count-up)
 *   14–24s  Lawyer-density comparison (40-to-1 disparity)
 *   24–34s  Eviction court (90% / 10%)
 *   34–46s  Civil-to-criminal volume (15× larger story)
 *   46–60s  Closing — naming the work and the source citation
 */

import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, sec } from "./theme";
import { Opening } from "./scenes/Opening";
import { BigNumberScene } from "./scenes/BigNumber";
import { LawyerDensityScene } from "./scenes/LawyerDensity";
import { EvictionCourtScene } from "./scenes/EvictionCourt";
import { VolumeScene } from "./scenes/Volume";
import { ClosingScene } from "./scenes/Closing";
import {
  NARRATION_LINES,
  SCENE_START_FRAMES,
  narrationFilePath,
  type NarrationLine,
} from "./narration";
import { hasStaticFile } from "./staticFiles";

const SCENE_DURATIONS = {
  opening: sec(4),
  bigNumber: sec(10),
  lawyerDensity: sec(10),
  evictionCourt: sec(10),
  volume: sec(12),
  closing: sec(14),
};

export const JUSTICE_GAP_DURATION_FRAMES =
  SCENE_DURATIONS.opening +
  SCENE_DURATIONS.bigNumber +
  SCENE_DURATIONS.lawyerDensity +
  SCENE_DURATIONS.evictionCourt +
  SCENE_DURATIONS.volume +
  SCENE_DURATIONS.closing;

export const JusticeGap: React.FC = () => {
  let offset = 0;

  const slot = (duration: number) => {
    const at = offset;
    offset += duration;
    return { from: at, durationInFrames: duration };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* Music bed — ducks under narration when present. Track lives
          at public/assets/audio/justice-gap-score.mp3 — swap that file
          to use a different score; the Audio component just plays
          whatever's there. */}
      <ScoreBed totalFrames={JUSTICE_GAP_DURATION_FRAMES} />

      {/* Narration — one <Audio> per script line, mounted at the
          composition frame derived from the scene + in-scene offset.
          If the mp3 hasn't been generated yet (no ElevenLabs run),
          the file is missing and Remotion silently no-ops. */}
      {NARRATION_LINES.map((line) => (
        <NarrationTrack key={line.id} line={line} />
      ))}

      <Sequence {...slot(SCENE_DURATIONS.opening)}>
        <Opening />
      </Sequence>
      <Sequence {...slot(SCENE_DURATIONS.bigNumber)}>
        <BigNumberScene />
      </Sequence>
      <Sequence {...slot(SCENE_DURATIONS.lawyerDensity)}>
        <LawyerDensityScene />
      </Sequence>
      <Sequence {...slot(SCENE_DURATIONS.evictionCourt)}>
        <EvictionCourtScene />
      </Sequence>
      <Sequence {...slot(SCENE_DURATIONS.volume)}>
        <VolumeScene />
      </Sequence>
      <Sequence {...slot(SCENE_DURATIONS.closing)}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Music bed with frame-driven volume envelope. Reads
 * public/assets/audio/justice-gap-score.mp3 via staticFile().
 *
 * Envelope (in seconds):
 *   0 → 1.5 : fade in to 0.55
 *   1.5 → 56 : 0.55 normally; ducks to 0.18 while narration is playing
 *   56 → 60 : fade to 0
 *
 * Narration ducking: we compute an approximate "narration is active"
 * window per line (start frame + assumed 0.075 s per character of
 * text — a rough but stable proxy for the actual mp3 duration without
 * needing to ffprobe each file from inside the renderer) and reduce
 * the music volume during those windows.
 */
function ScoreBed({ totalFrames }: { totalFrames: number }) {
  const frame = useCurrentFrame();
  const fadeInEnd = sec(1.5);
  const fadeOutStart = totalFrames - sec(4);

  // Base envelope
  let volume = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, totalFrames - 1],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck while any narration line is playing
  if (isNarrationActive(frame) && volume > 0.18) {
    volume = 0.18;
  }

  return (
    <Audio src={staticFile("assets/audio/justice-gap-score.mp3")} volume={volume} />
  );
}

/**
 * Per-line narration track. Mounted as an absolute-positioned <Audio>
 * scheduled at the right composition frame. If the mp3 file is not
 * present (no ElevenLabs run), Remotion will fail-soft at render time
 * (the track is simply silent); we also short-circuit via the
 * hasStaticFile helper.
 */
function NarrationTrack({ line }: { line: NarrationLine }) {
  if (!hasStaticFile(narrationFilePath(line))) {
    return null;
  }
  const startFrame =
    SCENE_START_FRAMES[line.scene] + sec(line.startInScene);
  return (
    <Sequence from={startFrame}>
      <Audio src={staticFile(narrationFilePath(line))} />
    </Sequence>
  );
}

/**
 * Rough estimate of whether any narration is sounding at frame N.
 * Each line is assumed to last (text length × 0.075 s + 0.5 s tail).
 * The real durations vary by voice and pacing; this is a stable
 * proxy good enough for the duck-the-music decision.
 */
function isNarrationActive(frame: number): boolean {
  for (const line of NARRATION_LINES) {
    const start =
      SCENE_START_FRAMES[line.scene] + sec(line.startInScene);
    const durationSec = line.text.length * 0.075 + 0.5;
    const end = start + sec(durationSec);
    if (frame >= start && frame < end) return true;
  }
  return false;
}
