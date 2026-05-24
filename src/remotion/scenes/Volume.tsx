/**
 * Civil vs criminal volume — the 15-to-1 story. Two animated bars
 * scale up; the civil one dwarfs the criminal one. The whole point is
 * the visual asymmetry: civil legal need is the larger story, and it
 * has no Gideon.
 *
 * Twelve seconds.
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

export const VolumeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Criminal bar grows first (smaller)
  const criminalProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 80 },
    durationInFrames: 35,
  });

  // Civil bar grows after, much larger
  const civilProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 18, stiffness: 70 },
    durationInFrames: 55,
  });

  const ratioOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scaling: max bar height 700px maps to 150M (civil)
  const PIXELS_PER_MILLION = 700 / 150;
  const criminalHeight =
    (STATS.annualArrests / 1_000_000) * PIXELS_PER_MILLION * criminalProgress;
  const civilHeight =
    (STATS.annualUnmetCivilEvents / 1_000_000) * PIXELS_PER_MILLION * civilProgress;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        padding: "100px 120px",
      }}
    >
      <div style={{ opacity: titleOpacity, marginBottom: 30 }}>
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
          A bigger story than the one we tell
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          Annual events, United States.
        </div>
      </div>

      {/* Bars container */}
      <div
        style={{
          display: "flex",
          gap: 120,
          alignItems: "flex-end",
          justifyContent: "center",
          height: 760,
          marginTop: 30,
        }}
      >
        {/* Criminal bar */}
        <BarColumn
          label="Annual arrests, all crimes"
          color={COLORS.slate}
          height={criminalHeight}
          number={Math.round(
            (STATS.annualArrests / 1_000_000) * criminalProgress
          )}
          unit="million"
          progress={criminalProgress}
        />

        {/* Civil bar */}
        <BarColumn
          label="Unmet civil legal events per year"
          color={COLORS.wine}
          height={civilHeight}
          number={Math.round(
            (STATS.annualUnmetCivilEvents / 1_000_000) * civilProgress
          )}
          unit="million"
          progress={civilProgress}
          accent
        />
      </div>

      <div
        style={{
          marginTop: 30,
          fontFamily: FONTS.display,
          fontSize: 52,
          fontWeight: 600,
          color: COLORS.ink,
          textAlign: "center",
          opacity: ratioOpacity,
        }}
      >
        Fifteen-to-one.{" "}
        <span style={{ color: COLORS.wine, fontStyle: "italic" }}>
          And no Gideon on the civil side.
        </span>
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
          opacity: interpolate(frame, [240, 270], [0, 1], {
            extrapolateRight: "clamp",
          }),
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        FBI UCR · LSC 2022 Justice Gap Report · "Gideon" = Gideon v. Wainwright (1963), criminal-only
      </div>
    </AbsoluteFill>
  );
};

function BarColumn({
  label,
  color,
  height,
  number,
  unit,
  progress,
  accent,
}: {
  label: string;
  color: string;
  height: number;
  number: number;
  unit: string;
  progress: number;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: accent ? 72 : 56,
          fontWeight: 700,
          color: accent ? COLORS.wine : COLORS.ink,
          opacity: progress,
        }}
      >
        {number}
        <span style={{ fontSize: accent ? 32 : 24, color: COLORS.slate, fontWeight: 400, marginLeft: 10 }}>
          {unit}
        </span>
      </div>
      <div
        style={{
          width: 180,
          height,
          backgroundColor: color,
          borderRadius: "6px 6px 0 0",
          boxShadow: accent ? `0 0 40px ${COLORS.wine}33` : undefined,
        }}
      />
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 22,
          color: COLORS.slate,
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
}
