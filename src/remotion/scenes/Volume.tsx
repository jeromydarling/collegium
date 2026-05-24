/**
 * Civil vs criminal volume — the 15-to-1 story. Two animated bars
 * scale up; the civil one dwarfs the criminal one. The whole point is
 * the visual asymmetry: civil legal need is the larger story, and it
 * has no Gideon.
 *
 * Twelve seconds.
 *
 * Layout uses AbsoluteFill regions instead of flow layout so nothing
 * can overflow the 1080px canvas. Safe-area margin: 60px from every
 * edge, source line lives in its own bottom strip.
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

  const criminalProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 80 },
    durationInFrames: 35,
  });

  const civilProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 18, stiffness: 70 },
    durationInFrames: 55,
  });

  const ratioOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sourceOpacity = interpolate(frame, [240, 270], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bar heights cap at 560px (the bars container is 560px tall).
  // Mapping: 150M civil = 560px; 10M criminal = 37px.
  const MAX_BAR_HEIGHT = 560;
  const PIXELS_PER_MILLION = MAX_BAR_HEIGHT / 150;
  const criminalHeight =
    (STATS.annualArrests / 1_000_000) * PIXELS_PER_MILLION * criminalProgress;
  const civilHeight =
    (STATS.annualUnmetCivilEvents / 1_000_000) * PIXELS_PER_MILLION * civilProgress;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}>
      {/* Title — top 200px */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 120,
          right: 120,
          opacity: titleOpacity,
        }}
      >
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

      {/* Bars — centered region y=260 to y=900 */}
      <div
        style={{
          position: "absolute",
          top: 260,
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          gap: 140,
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
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

      {/* Punchline — y=920 to y=990 */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 120,
          right: 120,
          fontFamily: FONTS.display,
          fontSize: 48,
          fontWeight: 600,
          color: COLORS.ink,
          textAlign: "center",
          opacity: ratioOpacity,
          lineHeight: 1.2,
        }}
      >
        Fifteen-to-one.{" "}
        <span style={{ color: COLORS.wine, fontStyle: "italic" }}>
          And no Gideon on the civil side.
        </span>
      </div>

      {/* Source line — bottom strip, y=1030 to y=1060 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 120,
          right: 120,
          fontFamily: FONTS.mono,
          fontSize: 14,
          color: COLORS.slateSoft,
          opacity: sourceOpacity,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        FBI UCR · LSC 2022 Justice Gap Report · "Gideon" = Gideon v. Wainwright
        (1963), criminal-only
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
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: accent ? 64 : 48,
          fontWeight: 700,
          color: accent ? COLORS.wine : COLORS.ink,
          opacity: progress,
        }}
      >
        {number}
        <span
          style={{
            fontSize: accent ? 28 : 22,
            color: COLORS.slate,
            fontWeight: 400,
            marginLeft: 8,
          }}
        >
          {unit}
        </span>
      </div>
      <div
        style={{
          width: 160,
          height,
          backgroundColor: color,
          borderRadius: "6px 6px 0 0",
          boxShadow: accent ? `0 0 40px ${COLORS.wine}33` : undefined,
        }}
      />
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 20,
          color: COLORS.slate,
          textAlign: "center",
          maxWidth: 280,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
}
