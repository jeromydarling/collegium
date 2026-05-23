import type { LibraryImage } from "../../lib/libraryImages";

/**
 * LibraryBackdrop — renders a library photograph as a background behind
 * a content panel. Two modes:
 *
 *   - "hero" — full-width section background with a wine-tinted overlay
 *     so cream text reads cleanly over the deep wood interior.
 *   - "feature" — half-width side panel image with attribution caption
 *     rendered below.
 *
 * Falls back gracefully when the image file isn't present yet (e.g. the
 * fetch script hasn't run) — renders just the cream gradient backdrop.
 *
 * Attribution rendering:
 *   - If the image requires visible attribution (CC BY-SA), a small
 *     italic caption appears beneath in feature mode, or in the corner
 *     for hero mode.
 *   - Either way, every image is linked from the global /credits page.
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
  const alignClass = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <section
      className={`relative isolate overflow-hidden ${className}`}
      aria-label={image ? `Background: ${image.name}` : undefined}
    >
      {bgUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgUrl})`,
          }}
        />
      )}
      {/* Cream-to-wine gradient overlay so the typography reads — softer
          on top so the library texture shows, denser on the bottom where
          most copy lives. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          background: bgUrl
            ? "linear-gradient(180deg, hsl(40 35% 92% / 0.92) 0%, hsl(40 35% 92% / 0.78) 35%, hsl(40 35% 92% / 0.94) 100%)"
            : "linear-gradient(180deg, hsl(40 35% 92%) 0%, hsl(40 30% 86%) 100%)",
        }}
      />
      <div className={`relative z-20 ${alignClass}`}>{children}</div>
      {image?.requiresAttribution && (
        <div className="absolute bottom-2 right-3 z-30 text-[10px] italic text-[hsl(var(--c-slate-soft))] opacity-70 hover:opacity-100 transition-opacity">
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
