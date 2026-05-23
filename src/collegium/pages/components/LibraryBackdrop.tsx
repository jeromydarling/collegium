import type { LibraryImage } from "../../lib/libraryImages";

/**
 * LibraryBackdrop — renders a library photograph as a filtered backdrop
 * behind a hero section. The treatment ladder (subtle → cinematic) is
 * applied as a stack of overlays so the source image still reads but
 * doesn't compete with the foreground typography:
 *
 *   1. SVG duotone — re-colors the image into the wine + cream palette
 *   2. CSS filter — slight blur + saturation boost so it reads as
 *      texture, not photograph
 *   3. Cream-wine gradient overlay — pulls the eye to the center
 *      where the headline lives
 *   4. Subtle film-grain noise — adds tactility, never distracts
 *   5. Inner shadow / vignette — keeps the edges quiet
 *
 * The composite reads as an illuminated-manuscript-feel backdrop:
 * recognizable as a library, but unmistakably treated.
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
  const bgUrl = image ? `/assets/library/${image.slug}.jpg` : null;
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <section
      className={`relative isolate overflow-hidden ${className}`}
      aria-label={image ? `Background: ${image.name}` : undefined}
    >
      {/* SVG duotone filter — applied via CSS filter:url(#duotone-wine). */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        className="absolute"
      >
        <defs>
          <filter id="duotone-wine" colorInterpolationFilters="sRGB">
            {/* Step 1: desaturate to luminance */}
            <feColorMatrix
              type="matrix"
              values="
                0.299 0.587 0.114 0 0
                0.299 0.587 0.114 0 0
                0.299 0.587 0.114 0 0
                0     0     0     1 0"
            />
            {/* Step 2: map luminance into wine ↔ cream */}
            <feComponentTransfer>
              {/* Shadows toward deep wine #4a1020 (R 74 G 16 B 32) */}
              {/* Highlights toward cream #f6e8c8 (R 246 G 232 B 200) */}
              <feFuncR
                type="table"
                tableValues="0.290 0.345 0.40 0.46 0.52 0.59 0.66 0.74 0.82 0.90 0.965"
              />
              <feFuncG
                type="table"
                tableValues="0.063 0.130 0.20 0.28 0.36 0.45 0.54 0.64 0.74 0.84 0.910"
              />
              <feFuncB
                type="table"
                tableValues="0.125 0.180 0.23 0.29 0.36 0.43 0.51 0.60 0.69 0.77 0.785"
              />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {bgUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgUrl})`,
            filter: "url(#duotone-wine) saturate(120%)",
          }}
        />
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
        src={`/assets/library/${image.slug}.jpg`}
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
