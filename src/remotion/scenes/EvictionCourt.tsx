/**
 * Eviction court — 100 small figures, animated in waves. Landlord side
 * fills with wine attorney-marks (90); tenant side leaves most of the
 * figures bare (only 10 with gold).
 *
 * Ten seconds. Layout uses AbsoluteFill regions with explicit y-bounds
 * so the punchline and source line are guaranteed visible.
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

  const punchlineOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sourceOpacity = interpolate(frame, [220, 250], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}>
      {/* Title block — top 80-220 */}
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
          Inside an eviction courtroom
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          Out of every 100 cases.
        </div>
      </div>

      {/* Figure grids — region 250 to 870 */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 120,
          right: 120,
          bottom: 210,
          display: "flex",
          gap: 100,
        }}
      >
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

      {/* Punchline — y=890 to y=970 */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 120,
          right: 120,
          fontFamily: FONTS.display,
          fontSize: 48,
          fontWeight: 600,
          color: COLORS.ink,
          textAlign: "center",
          opacity: punchlineOpacity,
          lineHeight: 1.2,
        }}
      >
        90 to 10.{" "}
        <span style={{ color: COLORS.wine, fontStyle: "italic" }}>
          The case is over before it begins.
        </span>
      </div>

      {/* Source line — bottom strip */}
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
        Eviction Lab · ABA studies aggregated · National averages; rates vary widely by jurisdiction
      </div>
    </AbsoluteFill>
  );
};

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
  const FIGURE_SIZE = 44;
  const cells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const filled = i < figuresToShow && i < count;
    const outlined = i < figuresToShow && i >= count;
    return { i, filled, outlined };
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 24,
          color: COLORS.slate,
          marginBottom: 14,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${FIGURE_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${FIGURE_SIZE}px)`,
          gap: 5,
          justifyContent: "start",
        }}
      >
        {cells.map((c) => (
          <Figure
            key={c.i}
            size={FIGURE_SIZE}
            filled={c.filled}
            outlined={c.outlined}
            color={color}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONTS.display,
          fontSize: 40,
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
  size,
  filled,
  outlined,
  color,
}: {
  size: number;
  filled: boolean;
  outlined: boolean;
  color: string;
}) {
  const fill = filled ? color : "transparent";
  const stroke = filled ? color : outlined ? COLORS.slateSoft : "transparent";
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
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
