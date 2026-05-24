/**
 * Lawyer density — the 40-to-1 disparity, rendered as two animated
 * bars that fill from zero to their respective end-points. The
 * disparity is the headline; the actual numbers are labeled at the
 * tip of each bar.
 *
 * Ten seconds.
 */

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";
import { STATS } from "../data";

export const LawyerDensityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bar 1 (general population) — fills first
  const bar1Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 90 },
    durationInFrames: 50,
  });

  // Bar 2 (low-income) — barely fills at all, but draws on a slight delay
  const bar2Progress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 18, stiffness: 90 },
    durationInFrames: 30,
  });

  // Final caption
  const captionOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateRight: "clamp",
  });

  const generalBarWidth = STATS.lawyersPer10kGeneral * 30; // 40 × 30 = 1200px
  const lscBarWidth = STATS.lscAttorneysPer10kPoor * 30; // 1 × 30 = 30px

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        padding: "100px 120px",
      }}
    >
      <div style={{ opacity: titleOpacity, marginBottom: 80 }}>
        <div
          style={{
            fontFamily: FONTS.body,
            fontStyle: "italic",
            fontSize: 24,
            color: COLORS.wine,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Lawyers per 10,000 people
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          One country, two markets.
        </div>
      </div>

      {/* Bar 1 — general population */}
      <div style={{ marginBottom: 70 }}>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 28,
            color: COLORS.slate,
            marginBottom: 14,
          }}
        >
          General population
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: generalBarWidth * bar1Progress,
              height: 80,
              backgroundColor: COLORS.gold,
              boxShadow: `0 4px 24px ${COLORS.gold}55`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 56,
              fontWeight: 700,
              color: COLORS.ink,
              opacity: bar1Progress,
            }}
          >
            ≈ {Math.round(STATS.lawyersPer10kGeneral * bar1Progress)}
          </div>
        </div>
      </div>

      {/* Bar 2 — low-income */}
      <div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 28,
            color: COLORS.slate,
            marginBottom: 14,
          }}
        >
          Americans below the poverty line (LSC-funded)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: lscBarWidth * bar2Progress,
              height: 80,
              backgroundColor: COLORS.wine,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 56,
              fontWeight: 700,
              color: COLORS.wine,
              opacity: bar2Progress,
            }}
          >
            ≈ {STATS.lscAttorneysPer10kPoor * Math.round(bar2Progress)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 90,
          fontFamily: FONTS.display,
          fontSize: 56,
          fontWeight: 600,
          color: COLORS.wine,
          opacity: captionOpacity,
          textAlign: "center",
        }}
      >
        A forty-to-one disparity.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 120,
          right: 120,
          fontFamily: FONTS.mono,
          fontSize: 16,
          color: COLORS.slateSoft,
          opacity: interpolate(frame, [180, 210], [0, 1], {
            extrapolateRight: "clamp",
          }),
          letterSpacing: 1,
        }}
      >
        ABA National Lawyer Population Survey · LSC 2023 Fact Book
      </div>
    </AbsoluteFill>
  );
};
