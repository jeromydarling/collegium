/**
 * Composition registry — every video the project exports lives here.
 *
 * For now: one composition, "JusticeGap", at 1920×1080 / 30fps / 60s.
 * Add 1080×1920 vertical and 1080×1080 square variants later if we
 * want platform-specific cuts.
 */

import { Composition } from "remotion";
import { JusticeGap, JUSTICE_GAP_DURATION_FRAMES } from "./JusticeGap";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JusticeGap"
        component={JusticeGap}
        durationInFrames={JUSTICE_GAP_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
