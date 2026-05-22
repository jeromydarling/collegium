import { type Meditation } from "../data/prayers";

/**
 * The Prayer / meditation block. Cream parchment card with eyebrow,
 * title, body. No source attribution displayed (see kickoff §7).
 *
 * Single-newline = verse-style line break within a paragraph.
 * Double-newline = paragraph break.
 */
export function Prayer({ m }: { m: Meditation }) {
  const paragraphs = m.body.split("\n\n");
  return (
    <aside className="my-8 sm:my-10 bg-[hsl(40_30%_92%)] border-l-4 border-[hsl(38_55%_50%)] rounded-r-md p-5 sm:p-7 shadow-sm">
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[hsl(354_55%_28%)] mb-2 font-semibold">
        {m.eyebrow}
      </div>
      <h3 className="collegium-display text-xl sm:text-2xl text-[hsl(220_30%_18%)] mb-4 leading-tight">
        {m.title}
      </h3>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-base sm:text-lg text-[hsl(220_30%_22%)] leading-relaxed mb-4 last:mb-0"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {p.split("\n").map((line, j) => (
            <span key={j}>
              {line}
              {j < p.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </aside>
  );
}
