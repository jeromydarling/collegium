/**
 * Opening title — wine background, gilt rule, English + Latin title,
 * source line. Four seconds.
 */

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";
import { SOURCES_LINE } from "../data";

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title spring-in
  const titleEntry = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.7 },
  });

  // Latin subtitle, slightly delayed
  const subtitleOpacity = interpolate(frame, [16, 28], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gold rule slides out from center
  const ruleScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  // Sources line at the bottom
  const sourcesOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.wineDeep,
        justifyContent: "center",
        alignItems: "center",
        color: COLORS.cream,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.body,
          fontStyle: "italic",
          fontSize: 28,
          color: COLORS.gold,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: titleEntry,
          transform: `translateY(${(1 - titleEntry) * 40}px)`,
          marginBottom: 40,
        }}
      >
        Annus Advocati · A Collegium Short
      </div>

      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 140,
          fontWeight: 700,
          letterSpacing: -2,
          opacity: titleEntry,
          transform: `translateY(${(1 - titleEntry) * 60}px)`,
          lineHeight: 1.05,
        }}
      >
        The Justice Gap
      </div>

      <div
        style={{
          width: 360 * ruleScale,
          height: 3,
          backgroundColor: COLORS.gold,
          margin: "32px 0",
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          fontFamily: FONTS.body,
          fontStyle: "italic",
          fontSize: 38,
          color: COLORS.creamWarm,
          opacity: subtitleOpacity,
          maxWidth: 1200,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        What the numbers say about the work that isn't being done.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontFamily: FONTS.mono,
          fontSize: 18,
          color: COLORS.slateSoft,
          opacity: sourcesOpacity,
          letterSpacing: 1,
        }}
      >
        {SOURCES_LINE}
      </div>
    </AbsoluteFill>
  );
};
