/**
 * The 92% — giant count-up from 0 to 92, with the caption that
 * arrives in two breaths to let the number land alone first.
 *
 * Ten seconds.
 */

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";
import { STATS } from "../data";

export const BigNumberScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count-up easing: spring from 0 to the target across ~50 frames.
  const countSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 70, mass: 1.2 },
    durationInFrames: 50,
  });
  const displayNumber = Math.round(STATS.unmetCivilLegalNeed * countSpring);

  // First caption (the "of substantial civil legal problems...")
  const caption1Opacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Second caption (the "get inadequate or no legal help.")
  const caption2Opacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle drift of the number after it lands
  const numberDrift = interpolate(frame, [50, 300], [0, -20]);

  // Source pin
  const sourceOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        justifyContent: "center",
        alignItems: "center",
        color: COLORS.ink,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 360,
          fontWeight: 700,
          color: COLORS.wine,
          letterSpacing: -8,
          lineHeight: 1,
          transform: `translateY(${numberDrift}px)`,
          fontFeatureSettings: '"lnum" 1, "tnum" 1',
        }}
      >
        {displayNumber}%
      </div>

      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 40,
          color: COLORS.slate,
          fontStyle: "italic",
          maxWidth: 1300,
          textAlign: "center",
          opacity: caption1Opacity,
          marginTop: 20,
          lineHeight: 1.3,
        }}
      >
        of substantial civil legal problems faced by low-income Americans
      </div>

      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 56,
          fontWeight: 600,
          color: COLORS.ink,
          maxWidth: 1500,
          textAlign: "center",
          opacity: caption2Opacity,
          marginTop: 24,
          lineHeight: 1.2,
        }}
      >
        get inadequate, or no, legal help.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontFamily: FONTS.mono,
          fontSize: 16,
          color: COLORS.slateSoft,
          opacity: sourceOpacity,
          letterSpacing: 1,
        }}
      >
        Legal Services Corporation · Justice Gap Report 2022 · 50-state NORC survey
      </div>
    </AbsoluteFill>
  );
};
