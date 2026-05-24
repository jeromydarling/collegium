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
      {/* Music bed — fades in over the first second, fades out across
          the last two seconds, ducks slightly during the count-up.
          Track lives at public/assets/audio/justice-gap-score.mp3 —
          swap that file to use a different score; the Audio component
          just plays whatever's there. */}
      <ScoreBed totalFrames={JUSTICE_GAP_DURATION_FRAMES} />

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
 *   1.5 → 56 : stay at 0.55 (under the dialogue / numbers)
 *   56 → 60 : fade to 0
 */
function ScoreBed({ totalFrames }: { totalFrames: number }) {
  const frame = useCurrentFrame();
  const fadeInEnd = sec(1.5);
  const fadeOutStart = totalFrames - sec(4);

  const volume = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, totalFrames - 1],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <Audio src={staticFile("assets/audio/justice-gap-score.mp3")} volume={volume} />;
}
