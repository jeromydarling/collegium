import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  Printer,
  ChevronRight,
} from "lucide-react";
import { devotionalDays } from "../../content/devotional";
import {
  pocketbookDays,
  pocketbookSections,
  dayTagOverrides,
} from "../../content/devotional/curation";
import {
  situationalCategories,
  tagLabel,
  type SituationalTag,
} from "../../content/devotional/situations";
import { exportFieldGuidePdf } from "../../lib/fieldGuidePdf";

/**
 * The Field Guide pocketbook surface — a curated ~50-entry subset of
 * the year, indexed by SITUATION rather than by date. Three tabs:
 *
 *   Contents — by virtue/topic section (the reading order)
 *   By situation — the field-guide-style index ("11pm-still-at-office")
 *   About — what this is, who it's for, how to print
 *
 * The "Generate PDF" button at the top builds a Lulu-ready pocket-trim
 * manuscript via lib/fieldGuidePdf.
 */

const tabs = ["Contents", "By situation", "About"] as const;
type Tab = (typeof tabs)[number];

export function FieldGuide() {
  const [tab, setTab] = useState<Tab>("Contents");

  const selectedEntries = useMemo(
    () =>
      pocketbookDays
        .map((d) => devotionalDays.find((e) => e.day === d))
        .filter(<T,>(x: T): x is NonNullable<T> => Boolean(x)),
    []
  );

  function effectiveTags(day: number): SituationalTag[] {
    const entry = selectedEntries.find((e) => e.day === day);
    if (entry?.situationalTags && entry.situationalTags.length > 0) {
      return entry.situationalTags;
    }
    return dayTagOverrides[day] ?? [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-4xl mx-auto">
      <Link
        to="/app/devotional"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> The Lawyer's Year
      </Link>

      <header className="mb-6 sm:mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">
          Manuale Advocati
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          The Lawyer's Field Guide
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          A ~50-entry pocket selection from the year, indexed by the
          moments of a working life — the eve of trial, after a loss,
          the eleven-o-clock office. Carry it. Look up the moment
          you're in.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => exportFieldGuidePdf()}
            className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
          >
            <Printer size={14} /> Generate the Field Guide PDF
          </button>
          <span className="text-xs text-[hsl(var(--c-slate-soft))]">
            {selectedEntries.length} entries · Lulu pocket trim (4¼ × 6⅞)
          </span>
        </div>
      </header>

      <div className="flex border-b border-[hsl(var(--c-border))] mb-5 sm:mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px min-h-[44px] ${
              tab === t
                ? "border-[hsl(var(--c-wine))] text-[hsl(var(--c-wine))]"
                : "border-transparent text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-slate))]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Contents" && (
        <div className="space-y-4 collegium-safe-bottom">
          {pocketbookSections.map((section) => {
            const sectionEntries = selectedEntries.filter(
              (e) => e.day >= section.dayRange[0] && e.day <= section.dayRange[1]
            );
            if (sectionEntries.length === 0) return null;
            return (
              <article
                key={section.title}
                className="collegium-card p-4 sm:p-5"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="collegium-display text-xl leading-tight">
                    {section.title}
                  </h2>
                  <span className="collegium-latin text-sm text-[hsl(var(--c-wine))]">
                    {section.latin}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {sectionEntries.map((e) => (
                    <li key={e.day}>
                      <Link
                        to={`/app/devotional/day/${e.day}`}
                        className="flex items-baseline gap-2 text-sm text-[hsl(var(--c-ink))] hover:text-[hsl(var(--c-wine))] py-1 px-1.5 -mx-1.5 rounded hover:bg-[hsl(var(--c-cream-warm))]"
                      >
                        <span className="text-[10px] font-mono text-[hsl(var(--c-slate-soft))] shrink-0">
                          {String(e.day).padStart(3, "0")}
                        </span>
                        <span className="truncate">{e.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}

      {tab === "By situation" && (
        <div className="space-y-5 collegium-safe-bottom">
          <p className="text-sm text-[hsl(var(--c-slate))] italic max-w-2xl">
            The way you'll actually use the book. Find the moment you're
            in; the entries it points to will meet you there.
          </p>
          {situationalCategories.map((cat) => {
            // Only show categories that have at least one matching entry
            const tagsWithEntries = cat.tags.filter((t) =>
              selectedEntries.some((e) => effectiveTags(e.day).includes(t.tag))
            );
            if (tagsWithEntries.length === 0) return null;
            return (
              <section key={cat.category} className="collegium-card p-4 sm:p-5">
                <h3 className="collegium-display text-lg leading-tight">
                  {cat.label}
                </h3>
                <p className="text-xs text-[hsl(var(--c-slate-soft))] italic mb-3 max-w-2xl">
                  {cat.blurb}
                </p>
                <dl className="space-y-2">
                  {tagsWithEntries.map((t) => {
                    const matches = selectedEntries.filter((e) =>
                      effectiveTags(e.day).includes(t.tag)
                    );
                    return (
                      <div
                        key={t.tag}
                        className="border-l-2 border-[hsl(var(--c-gold))] pl-3"
                      >
                        <dt className="text-sm font-medium text-[hsl(var(--c-ink))]">
                          {t.label}
                        </dt>
                        <dd className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                          {matches.map((m) => (
                            <Link
                              key={m.day}
                              to={`/app/devotional/day/${m.day}`}
                              className="text-xs text-[hsl(var(--c-wine))] hover:underline inline-flex items-center gap-1"
                            >
                              {m.title}
                              <ChevronRight size={10} />
                            </Link>
                          ))}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            );
          })}
        </div>
      )}

      {tab === "About" && (
        <div className="collegium-card p-5 sm:p-7 collegium-safe-bottom max-w-3xl">
          <div className="prose prose-sm sm:prose-base text-[hsl(var(--c-slate))] leading-relaxed">
            <p>
              <span className="collegium-latin text-[hsl(var(--c-wine))]">
                Manuale Advocati
              </span>
              {" "}— the working advocate's manual. A pocket-format
              selection from the 365-day devotional <em>The Lawyer's Year</em>,
              compiled so that it can be carried in a briefcase or a
              jacket pocket and consulted in the moments that recur in
              practice.
            </p>
            <p>
              The book is organized around the year's thirteen weekly
              arcs — Vocation, Justice, Equity, Conscience, The Poor,
              Authority, Mercy, Truth, Counsel, Office, Common Good,
              Subsidiarity, Christ the Advocate — but its real
              architecture is the index at the back. Look there for
              <em> the moment you're in</em>. The pages it points to will
              meet you there.
            </p>
            <p>
              Production: Lulu hardcover, pocket trim (4¼ × 6⅞ inches),
              cloth binding with a ribbon marker. The PDF generated here
              is the production-ready manuscript.
            </p>
            <h3 className="collegium-display text-lg text-[hsl(var(--c-ink))] mt-6 mb-2">
              Provenance
            </h3>
            <p>
              Scripture quotations are from the Douay-Rheims Bible (1899
              edition, public domain). Excerpts from public-domain
              works: the <em>Summa Theologiae</em>, Augustine's <em>City of God</em> and <em>Confessions</em>, Cicero's <em>De Officiis</em>, John Henry Newman's <em>Idea of a University</em>, Pope Leo XIII's <em>Rerum Novarum</em>, Pope Pius XI's <em>Quadragesimo Anno</em>, Blackstone's <em>Commentaries</em>, Thomas More's <em>Utopia</em> and Tower letters, and selected sermons of Ambrose, Chrysostom, Bernard, and Bonaventure.
            </p>
            <p>
              The meditations, prayers, and reflection prompts are
              original to Collegium Editions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
