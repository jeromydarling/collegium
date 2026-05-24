/**
 * Eviction court — 100 small figures, animated in waves. Landlord side
 * fills with gold attorney-marks (90); tenant side leaves most of the
 * figures bare (only 10 with gold).
 *
 * Ten seconds.
 */

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONTS } from "../theme";
import { STATS } from "../data";

export const EvictionCourtScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Landlord-side figures animate in over frames 20-70 (one at a time)
  // Tenant-side animates in over frames 70-130
  // After both, the punchline appears.

  const punchlineOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        padding: "100px 120px",
      }}
    >
      <div style={{ opacity: titleOpacity, marginBottom: 50 }}>
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
          Inside an eviction courtroom
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          Out of every 100 cases.
        </div>
      </div>

      <div style={{ display: "flex", gap: 80, marginTop: 30 }}>
        <FigureGrid
          label="Landlords with a lawyer"
          color={COLORS.wine}
          count={STATS.landlordsWithLawyer}
          startFrame={20}
          frame={frame}
        />
        <FigureGrid
          label="Tenants with a lawyer"
          color={COLORS.gold}
          count={STATS.tenantsWithLawyer}
          startFrame={80}
          frame={frame}
        />
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: FONTS.display,
          fontSize: 52,
          fontWeight: 600,
          color: COLORS.ink,
          textAlign: "center",
          opacity: punchlineOpacity,
        }}
      >
        90 to 10. <span style={{ color: COLORS.wine }}>The case is over before it begins.</span>
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
          opacity: interpolate(frame, [220, 250], [0, 1], {
            extrapolateRight: "clamp",
          }),
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        Eviction Lab · ABA studies aggregated · National averages; rates vary widely by jurisdiction
      </div>
    </AbsoluteFill>
  );
};

/**
 * A 10×10 grid where `count` figures fill in with the given color and
 * the rest stay outlined. Figures fill in sequentially.
 */
function FigureGrid({
  label,
  color,
  count,
  startFrame,
  frame,
}: {
  label: string;
  color: string;
  count: number;
  startFrame: number;
  frame: number;
}) {
  const FRAMES_TO_FILL = 60;
  const figuresToShow = Math.min(
    100,
    Math.max(0, Math.round(((frame - startFrame) / FRAMES_TO_FILL) * 100))
  );

  const COLS = 10;
  const ROWS = 10;
  const cells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const filled = i < figuresToShow && i < count;
    const outlined = i < figuresToShow && i >= count;
    return { i, filled, outlined };
  });

  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 26,
          color: COLORS.slate,
          marginBottom: 18,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 56px)`,
          gridTemplateRows: `repeat(${ROWS}, 56px)`,
          gap: 6,
        }}
      >
        {cells.map((c) => (
          <Figure key={c.i} filled={c.filled} outlined={c.outlined} color={color} />
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: FONTS.display,
          fontSize: 44,
          fontWeight: 700,
          color,
        }}
      >
        {Math.min(count, figuresToShow)}
      </div>
    </div>
  );
}

function Figure({
  filled,
  outlined,
  color,
}: {
  filled: boolean;
  outlined: boolean;
  color: string;
}) {
  // Simple "person" silhouette: a circle head + rounded shoulders.
  const fill = filled ? color : "transparent";
  const stroke = filled ? color : outlined ? COLORS.slateSoft : "transparent";
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={18} r={9} fill={fill} stroke={stroke} strokeWidth={2} />
      <path
        d="M 10 50 Q 10 32 28 32 Q 46 32 46 50 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}
