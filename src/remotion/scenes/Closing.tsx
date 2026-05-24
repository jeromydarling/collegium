/**
 * Closing — the call. Wine background, gilt rule, the Latin motto,
 * the English, the wordmark, and the source line. Fourteen seconds.
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

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The thesis sentence first
  const thesisOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const thesisDrift = interpolate(frame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Latin motto springs in
  const mottoSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // English gloss fades in below the Latin
  const englishOpacity = interpolate(frame, [110, 140], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gold rule
  const ruleScale = spring({
    frame: frame - 90,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  // Wordmark
  const wordmarkOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Sources line + url
  const sourcesOpacity = interpolate(frame, [260, 300], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow vignette fade to deep wine at the very end
  const finalFade = interpolate(frame, [380, 420], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.wineDeep,
        color: COLORS.cream,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0 200px",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.body,
          fontStyle: "italic",
          fontSize: 44,
          color: COLORS.creamWarm,
          textAlign: "center",
          opacity: thesisOpacity,
          transform: `translateY(${thesisDrift}px)`,
          maxWidth: 1400,
          lineHeight: 1.35,
          marginBottom: 80,
        }}
      >
        The volume of unmet civil legal need is fifteen times the criminal
        side. The civil side has no Gideon. The work is unfinished.
      </div>

      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 140,
          fontWeight: 700,
          color: COLORS.gold,
          letterSpacing: -1,
          opacity: mottoSpring,
          transform: `scale(${0.85 + mottoSpring * 0.15})`,
        }}
      >
        Iustitia tenax.
      </div>

      <div
        style={{
          width: 360 * ruleScale,
          height: 3,
          backgroundColor: COLORS.gold,
          margin: "26px 0",
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          fontFamily: FONTS.body,
          fontStyle: "italic",
          fontSize: 38,
          color: COLORS.creamWarm,
          opacity: englishOpacity,
          textAlign: "center",
        }}
      >
        Tenacious justice. Hold the work; do not let it go.
      </div>

      <div
        style={{
          marginTop: 90,
          opacity: wordmarkOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: COLORS.cream,
          }}
        >
          Collegium
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontStyle: "italic",
            fontSize: 22,
            color: COLORS.gold,
            marginTop: 8,
            letterSpacing: 3,
          }}
        >
          A guild for Christian lawyers
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontFamily: FONTS.mono,
          fontSize: 16,
          color: COLORS.slateSoft,
          opacity: sourcesOpacity,
          letterSpacing: 1,
          textAlign: "center",
          maxWidth: 1600,
          lineHeight: 1.5,
        }}
      >
        {SOURCES_LINE}
      </div>

      {/* Final vignette to black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: finalFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
