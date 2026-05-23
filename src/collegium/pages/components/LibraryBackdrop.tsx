import type { LibraryImage } from "../../lib/libraryImages";

/**
 * LibraryBackdrop — renders a library photograph as a filtered backdrop
 * behind a hero section. The treatment ladder (subtle → cinematic) is
 * applied as a stack of overlays so the source image still reads but
 * doesn't compete with the foreground typography:
 *
 *   1. Greyscale + sepia + hue-rotate filter chain — pushes the image
 *      into the wine palette using CSS filters only (no SVG <filter>,
 *      since mobile Chrome / WebKit render `filter: url(#id)` on
 *      non-SVG elements inconsistently — often as fully transparent).
 *   2. Wine multiply overlay — deepens shadows toward wine
 *   3. Cream-wash gradient — lighter at top, denser at bottom where
 *      typography sits
 *   4. Subtle film-grain noise — adds tactility, never distracts
 *   5. Inner shadow / vignette — keeps the edges quiet
 */

export function LibraryBackdrop({
  image,
  mode,
  children,
  className = "",
  align = "center",
}: {
  image: LibraryImage | null;
  mode: "hero" | "feature";
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  if (mode === "hero") {
    return (
      <HeroBackdrop image={image} className={className} align={align}>
        {children}
      </HeroBackdrop>
    );
  }
  return (
    <FeatureBackdrop image={image} className={className}>
      {children}
    </FeatureBackdrop>
  );
}

function HeroBackdrop({
  image,
  className,
  align,
  children,
}: {
  image: LibraryImage | null;
  className: string;
  align: "left" | "center" | "right";
  children?: React.ReactNode;
}) {
  const bgUrl = image
    ? `${import.meta.env.BASE_URL}assets/library/${image.slug}.jpg`
    : null;
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <section
      className={`relative isolate overflow-hidden ${className}`}
      aria-label={image ? `Background: ${image.name}` : undefined}
    >
      {bgUrl && (
        <>
          {/* Layer A: the library photo, desaturated + warmed toward sepia.
              Pure CSS filters — supported uniformly across desktop + mobile. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgUrl})`,
              filter:
                "grayscale(1) sepia(0.55) hue-rotate(310deg) saturate(2) brightness(0.92) contrast(1.05)",
            }}
          />
          {/* Layer B: wine multiply tint — pushes the shadows toward wine
              and unifies the palette with the rest of the site. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 mix-blend-multiply"
            style={{ background: "hsl(350 55% 28%)" }}
          />
          {/* Layer C: cream highlight screen — lifts the lights toward
              the cream palette so the result reads as a wine-and-cream
              duotone rather than a uniform wine wash. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 mix-blend-screen opacity-25"
            style={{ background: "hsl(40 35% 88%)" }}
          />
        </>
      )}

      {/* Cream wash — light enough to keep the library visible behind the
          text, dense enough where copy actually sits so the typography
          reads. Vertical gradient: lighter at top where the eye lands on
          the library, denser at bottom where the doors / CTA need to pop. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          background: bgUrl
            ? "linear-gradient(180deg, hsl(40 35% 92% / 0.55) 0%, hsl(40 35% 92% / 0.72) 35%, hsl(40 35% 90% / 0.85) 70%, hsl(40 35% 88% / 0.94) 100%)"
            : "linear-gradient(180deg, hsl(40 35% 92%) 0%, hsl(40 30% 86%) 100%)",
        }}
      />

      {/* Film-grain noise — keeps the surface tactile */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 mix-blend-overlay opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Inner vignette — keeps the edges quiet so corner text doesn't fight the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 200px hsl(20 30% 18% / 0.35)",
        }}
      />

      <div className={`relative z-20 ${alignClass}`}>{children}</div>

      {image?.requiresAttribution && (
        <div className="absolute bottom-2 right-3 z-30 text-[10px] italic text-[hsl(var(--c-slate-soft))] opacity-60 hover:opacity-100 transition-opacity">
          <a
            href={image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {image.attributionString}
          </a>
        </div>
      )}
    </section>
  );
}

function FeatureBackdrop({
  image,
  className,
  children,
}: {
  image: LibraryImage | null;
  className: string;
  children?: React.ReactNode;
}) {
  if (!image) {
    return (
      <figure
        className={`relative aspect-[4/3] rounded-xl bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] flex items-center justify-center ${className}`}
      >
        <span className="text-xs text-[hsl(var(--c-slate-soft))] italic">
          Library image not yet downloaded
        </span>
        {children}
      </figure>
    );
  }
  return (
    <figure
      className={`relative rounded-xl overflow-hidden border border-[hsl(var(--c-border))] shadow-sm ${className}`}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/library/${image.slug}.jpg`}
        alt={`${image.name}, ${image.location}`}
        loading="lazy"
        className="w-full h-full object-cover aspect-[4/3]"
      />
      {children}
      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-[hsl(40_30%_90%)] px-3 py-2 text-[11px] leading-snug">
        <div className="font-medium">{image.name}</div>
        <div className="text-[hsl(40_20%_80%)] text-[10px]">{image.location}</div>
        {image.requiresAttribution && (
          <a
            href={image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(38_60%_75%)] hover:underline italic"
          >
            {image.attributionString}
          </a>
        )}
      </figcaption>
    </figure>
  );
}
