import { useEffect, useMemo, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, Clock } from "lucide-react";
import { libraryWorks, libraryExcerpts } from "../../content/library";
import {
  workSections,
  sectionsForWork,
  getSection,
} from "../../content/workSections";

/**
 * On-site reader for the public-domain canon. Renders the cleaned-up
 * prose around a library excerpt so the reader can read it in context
 * rather than as a stand-alone quote.
 *
 * Two routes resolve here:
 *   /app/formation/work/:workId                      — list of sections
 *   /app/formation/work/:workId/section/:sectionId   — single section
 *
 * The excerpt-anchor query param (?excerpt=ex-aquinas-law-def) scrolls
 * the reader to the cited paragraph and gently highlights it.
 */

export function WorkReader() {
  const { workId, sectionId } = useParams<{ workId: string; sectionId?: string }>();
  const [params] = useSearchParams();
  const excerptAnchor = params.get("excerpt");

  const work = workId ? libraryWorks.find((w) => w.id === workId) : null;
  const sections = workId ? sectionsForWork(workId) : [];
  const current = sectionId ? getSection(sectionId) : null;

  if (!work) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <Link
          to="/app/formation"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Formation
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That work was not found.
        </p>
      </div>
    );
  }

  // Single-section view
  if (current) {
    return (
      <SectionReader
        sectionId={current.id}
        excerptAnchor={excerptAnchor}
      />
    );
  }

  // Work-level index of sections
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-3xl mx-auto">
      <Link
        to="/app/formation"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Formation
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <BookOpen size={14} />
          <span className="collegium-latin text-sm">Bibliotheca</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          {work.title}
        </h1>
        <div className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
          {work.author} · {work.year}
        </div>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mt-3 max-w-2xl">
          {work.summary}
        </p>
        <a
          href={work.source.url}
          target="_blank"
          rel="noopener"
          className="collegium-link text-xs inline-flex items-center gap-1 mt-3"
        >
          Full work at {work.source.label} <ExternalLink size={11} />
        </a>
      </div>

      <h2 className="collegium-display text-xl mb-3">Available sections</h2>
      {sections.length === 0 ? (
        <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
          No on-site sections transcribed for this work yet. Use the
          full-source link above to read it on Project Gutenberg / Vatican
          / Internet Archive.
        </p>
      ) : (
        <div className="space-y-2.5 collegium-safe-bottom">
          {sections.map((s) => (
            <Link
              key={s.id}
              to={`/app/formation/work/${work.id}/section/${s.id}`}
              className="collegium-card p-4 sm:p-5 block hover:shadow-md transition-shadow"
            >
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-0.5">
                {s.partTitle}
              </div>
              <h3 className="collegium-display text-lg leading-tight">
                {s.sectionTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[hsl(var(--c-slate-soft))]">
                <span className="collegium-latin text-[hsl(var(--c-wine))]">
                  {s.citation}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} /> ~{s.estimatedMinutes} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionReader({
  sectionId,
  excerptAnchor,
}: {
  sectionId: string;
  excerptAnchor: string | null;
}) {
  const section = getSection(sectionId);
  const containerRef = useRef<HTMLDivElement>(null);

  const work = section
    ? libraryWorks.find((w) => w.id === section.workId)
    : null;

  // All sections of the same work, for prev / next nav
  const sectionsOfWork = useMemo(
    () => (section ? sectionsForWork(section.workId) : []),
    [section]
  );
  const idx = section ? sectionsOfWork.findIndex((s) => s.id === section.id) : -1;
  const prev = idx > 0 ? sectionsOfWork[idx - 1] : null;
  const next = idx >= 0 && idx < sectionsOfWork.length - 1 ? sectionsOfWork[idx + 1] : null;

  // Scroll to + highlight the anchored paragraph
  useEffect(() => {
    if (!excerptAnchor || !section) return;
    const anchor = section.excerptAnchors.find((a) => a.excerptId === excerptAnchor);
    if (!anchor || !containerRef.current) return;
    const el = containerRef.current.querySelector(`#${anchor.htmlAnchor}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("reader-excerpt-highlight");
    const t = setTimeout(() => {
      el.classList.remove("reader-excerpt-highlight");
    }, 4000);
    return () => clearTimeout(t);
  }, [excerptAnchor, section]);

  if (!section || !work) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <Link
          to="/app/formation"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={12} /> Formation
        </Link>
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          That section was not found.
        </p>
      </div>
    );
  }

  // Excerpts that anchor inside this section — surface a "you came from"
  // breadcrumb when the reader arrived from an excerpt card.
  const anchoredExcerpts = libraryExcerpts.filter((ex) =>
    section.excerptAnchors.some((a) => a.excerptId === ex.id)
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-3xl mx-auto">
      <Link
        to={`/app/formation/work/${work.id}`}
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> {work.title}
      </Link>

      <header className="mb-6 sm:mb-8 pb-5 border-b border-[hsl(var(--c-border))]">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
          {work.author} · {section.partTitle}
        </div>
        <h1 className="collegium-display text-2xl sm:text-3xl leading-tight">
          {section.sectionTitle}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[hsl(var(--c-slate-soft))]">
          <span className="collegium-latin text-[hsl(var(--c-wine))]">
            {section.citation}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} /> ~{section.estimatedMinutes} min
          </span>
          {section.translatorNote && (
            <span className="italic">{section.translatorNote}</span>
          )}
        </div>
        {anchoredExcerpts.length > 0 && excerptAnchor && (
          <p className="text-xs text-[hsl(var(--c-wine))] mt-3 italic">
            Highlighted: the passage cited as{" "}
            {anchoredExcerpts.find((e) => e.id === excerptAnchor)?.citation ??
              "this excerpt"}
            .
          </p>
        )}
      </header>

      <div
        ref={containerRef}
        className="collegium-reader-prose text-base text-[hsl(var(--c-ink))] leading-relaxed font-serif space-y-4"
        dangerouslySetInnerHTML={{ __html: section.htmlBody }}
      />

      <nav className="flex items-center justify-between border-t border-[hsl(var(--c-border))] pt-5 mt-8 collegium-safe-bottom">
        {prev ? (
          <Link
            to={`/app/formation/work/${work.id}/section/${prev.id}`}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1 max-w-[45%]"
          >
            <ChevronLeft size={12} />{" "}
            <span className="truncate">{prev.sectionTitle}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/app/formation/work/${work.id}/section/${next.id}`}
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1 max-w-[45%]"
          >
            <span className="truncate">{next.sectionTitle}</span>{" "}
            <ChevronRight size={12} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

// Silence the unused import warning when workSections is empty — the
// helpers still resolve at runtime once the seed is populated.
void workSections;
