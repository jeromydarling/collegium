import { Link } from "react-router-dom";
import { useState } from "react";
import { serviceMatters, chapters, people } from "../data/demo";
import { Languages, MapPin, ArrowRight, Inbox, Check } from "lucide-react";

/**
 * Network Inbox — the federated intake board.
 *
 * Service requests come in through partner parishes (the referring chapter),
 * land here, and a steward routes them to a local clinic / volunteer. The
 * router is faith- and language-aware: it suggests a chapter based on
 * geography, the practice area, the requester's language, and (where the
 * referring chapter is named) any existing relationship the parish has with
 * the network. No PII leaves the chapter that takes the matter.
 */

const PRACTICE_PROFICIENCY: Record<string, string[]> = {
  immigration: ["ch-clg-chicago", "ch-cbf-toronto"],
  housing: ["ch-clg-chicago", "ch-stm-boston"],
  family: ["ch-stm-boston", "ch-clg-chicago"],
  expungement: ["ch-stm-boston", "ch-doc-arlington"],
  "estate-planning": ["ch-stm-boston", "ch-clg-chicago"],
  "public-benefits": ["ch-clg-chicago", "ch-stm-boston"],
  "parish-governance": ["ch-doc-arlington", "ch-clg-chicago"],
  "canon-law": ["ch-doc-arlington"],
  "indigent-defense": ["ch-doc-arlington", "ch-clg-chicago"],
  "religious-liberty": ["ch-cbf-toronto", "ch-doc-arlington"],
};

const LANG_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  fa: "Farsi",
  ti: "Tigrinya",
  ln: "Lingala",
};

/** Score a chapter for a given matter — geographic match + practice tag + language hint. */
function routingScore(chapterId: string, matter: typeof serviceMatters[number]) {
  let score = 0;
  const reasons: string[] = [];
  const ch = chapters.find((c) => c.id === chapterId);
  if (!ch) return { score: 0, reasons };

  // Geographic match (very rough — city or state substring).
  const cityMatch = matter.region.toLowerCase().includes(ch.city.toLowerCase());
  if (cityMatch) {
    score += 3;
    reasons.push(`Local to ${ch.city}`);
  } else if (matter.region.toLowerCase().includes(ch.state.toLowerCase())) {
    score += 1;
    reasons.push(`In state (${ch.state})`);
  }

  // Practice-area proficiency.
  const proficient = PRACTICE_PROFICIENCY[matter.category] ?? [];
  if (proficient.includes(chapterId)) {
    score += 2;
    reasons.push(`Handles ${matter.category.replace("-", " ")}`);
  }

  // Existing relationship with the referring parish.
  if (matter.referringChapterId === chapterId) {
    score += 2;
    reasons.push("Already in relationship with the referring parish");
  }

  // Language fit — Chicago has Spanish-fluent volunteers; Toronto has French.
  if (matter.languages?.includes("es") && chapterId === "ch-clg-chicago") {
    score += 1;
    reasons.push("Spanish-fluent volunteers available");
  }
  if (matter.languages?.includes("fr") && chapterId === "ch-cbf-toronto") {
    score += 1;
    reasons.push("French-fluent volunteers available");
  }

  return { score, reasons };
}

function suggestedRoute(matter: typeof serviceMatters[number]) {
  return chapters
    .map((c) => ({ chapter: c, ...routingScore(c.id, matter) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

export function NetworkInbox() {
  const [acted, setActed] = useState<Set<string>>(new Set());
  const incoming = serviceMatters
    .filter((m) => m.status === "new" && m.referringChapterId)
    .sort((a, b) => b.intakeDate.localeCompare(a.intakeDate));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Inbox size={14} />
          <span className="collegium-latin text-sm">Atrium</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Network Inbox</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Matters referred in through partner parishes, waiting to be routed
          to a local clinic. The router proposes a chapter based on geography,
          practice area, and language. Stewards confirm; no client information
          leaves the chapter that takes the matter.
        </p>
      </div>

      <div className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <Stat label="Incoming" value={incoming.length} />
          <Stat
            label="Closure-loop consented"
            value={incoming.filter((m) => m.closureLoopConsent).length}
          />
          <Stat
            label="Non-English primary"
            value={
              incoming.filter((m) => m.languages && !m.languages.includes("en"))
                .length
            }
          />
        </div>
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-4 leading-relaxed">
          <strong className="text-[hsl(var(--c-wine))] font-semibold">Federated by design.</strong>{" "}
          Each affiliated clinic keeps its own client data. The inbox only
          carries what the requester gave to the referring parish — name,
          region, the kind of help they need, and their consent preferences.
          Conflicts are checked across chapters by a one-way hash, never by
          sharing names.
        </p>
      </div>

      <div className="space-y-4 collegium-safe-bottom">
        {incoming.map((m) => {
          const routes = suggestedRoute(m);
          const refChapter = chapters.find((c) => c.id === m.referringChapterId);
          const isActed = acted.has(m.id);
          return (
            <article
              key={m.id}
              className={`collegium-card p-5 sm:p-6 ${
                isActed ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                <CategoryTag category={m.category} />
                <UrgencyDot urgency={m.urgency} />
                <span className="text-[hsl(var(--c-slate-soft))]">·</span>
                <span className="text-[hsl(var(--c-slate-soft))]">
                  Intake {new Date(m.intakeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                {m.fplPercent !== undefined && (
                  <>
                    <span className="text-[hsl(var(--c-slate-soft))]">·</span>
                    <span className="text-[hsl(var(--c-slate-soft))]">
                      {m.fplPercent}% FPL
                    </span>
                  </>
                )}
              </div>
              <h3 className="collegium-display text-lg sm:text-xl leading-tight mb-1">
                {m.requester}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-3">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} /> {m.region}
                </span>
                {m.languages && (
                  <span className="inline-flex items-center gap-1">
                    <Languages size={11} />
                    {m.languages.map((l) => LANG_LABEL[l] || l).join(", ")}
                  </span>
                )}
                {refChapter && (
                  <span className="inline-flex items-center gap-1">
                    Referred by{" "}
                    <Link
                      to={`/app/chapters/${refChapter.slug}`}
                      className="collegium-link"
                    >
                      {refChapter.name.replace(/—.*/, "").trim()}
                    </Link>
                    {m.referredBy ? ` (${m.referredBy})` : ""}
                  </span>
                )}
              </div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-4">
                {m.summary}
              </p>

              {!isActed ? (
                <div className="border-t border-[hsl(var(--c-border))] pt-4">
                  <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3">
                    Suggested routing
                  </div>
                  <div className="space-y-2.5">
                    {routes.map(({ chapter, reasons }, i) => (
                      <div
                        key={chapter.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-md bg-[hsl(var(--c-cream-warm))]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-medium text-sm text-[hsl(var(--c-ink))]">
                              {chapter.name}
                            </span>
                            {i === 0 && (
                              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                                Best fit
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                            {reasons.join(" · ")}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setActed((prev) => new Set(prev).add(m.id))
                          }
                          className={
                            i === 0
                              ? "collegium-btn-primary text-xs shrink-0"
                              : "collegium-btn-ghost text-xs shrink-0"
                          }
                        >
                          Route here <ArrowRight size={12} className="ml-1" />
                        </button>
                      </div>
                    ))}
                    {routes.length === 0 && (
                      <div className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                        No clear routing in the network — escalate to national
                        steward for partner referral.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-t border-[hsl(var(--c-border))] pt-4 flex items-center gap-2 text-sm text-[hsl(145_40%_30%)]">
                  <Check size={14} /> Routed. Local clinic notified; client
                  will hear back within 48 hours.
                </div>
              )}
            </article>
          );
        })}
        {incoming.length === 0 && (
          <div className="collegium-card p-8 text-center text-sm text-[hsl(var(--c-slate-soft))]">
            Inbox empty. Every referral is in a chapter's hands.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-[hsl(var(--c-slate-soft))]">
        {label}
      </div>
      <div className="collegium-display text-3xl text-[hsl(var(--c-ink))]">{value}</div>
    </div>
  );
}

function CategoryTag({ category }: { category: string }) {
  return (
    <span className="text-[9px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded bg-[hsl(var(--c-wine)/0.08)] text-[hsl(var(--c-wine))]">
      {category.replace("-", " ")}
    </span>
  );
}

function UrgencyDot({ urgency }: { urgency: string }) {
  const color =
    urgency === "urgent"
      ? "bg-[hsl(8_55%_52%)]"
      : urgency === "soon"
      ? "bg-[hsl(38_55%_50%)]"
      : "bg-[hsl(145_30%_50%)]";
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} title={urgency} />;
}
