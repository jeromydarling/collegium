import { useMemo } from "react";
import { BarChart3, MapPin, Globe, Languages, TrendingUp, AlertTriangle } from "lucide-react";
import { chapters, serviceMatters, type ServiceMatter } from "../data/demo";
import { proBonoCaseMeta } from "../patrocinium/data/cases";

/**
 * Justice Gap Insights — steward-facing analytics over the network's intake.
 *
 * Counts matters by chapter, region, category, language, urgency. Surfaces
 * the gap between "people seeking help" and "people served" so the network
 * can name drop-off points instead of pretending they don't exist.
 *
 * Everything here is rule-aggregated over the in-memory data; no SQL, no
 * pivot tables, just typed reduce calls. When real Supabase data lands,
 * the same selectors point at it.
 */

const STATUS_BUCKETS: { label: string; statuses: ServiceMatter["status"][]; tone: string }[] = [
  { label: "Open · intake done", statuses: ["new"], tone: "text-[hsl(38_55%_28%)]" },
  { label: "Triaged or assigned", statuses: ["triaged", "assigned"], tone: "text-[hsl(var(--c-wine))]" },
  { label: "Follow-up phase", statuses: ["follow-up"], tone: "text-[hsl(var(--c-slate))]" },
  { label: "Closed", statuses: ["closed"], tone: "text-[hsl(145_40%_28%)]" },
];

const LANG_NAME: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  fa: "Farsi",
  ti: "Tigrinya",
  ln: "Lingala",
  ht: "Haitian Creole",
  vi: "Vietnamese",
  zh: "Chinese",
};

export function JusticeGapInsights() {
  const metrics = useMemo(() => computeMetrics(), []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <BarChart3 size={14} />
          <span className="collegium-latin text-sm">Hiatus iustitiae</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Justice Gap insights
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          The network's intake, served, and turned-away figures. Where the
          numbers thin out is where the gap is. Refresh daily; act weekly.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <KPI label="Total intake" value={metrics.totalIntake} sub="across the network" />
        <KPI
          label="Active in pool"
          value={metrics.activeInPool}
          sub="awaiting assignment"
        />
        <KPI
          label="Served"
          value={metrics.closed}
          sub={`${pct(metrics.closed, metrics.totalIntake)}% completion`}
        />
        <KPI
          label="Closure-loop"
          value={metrics.closureLoopRate}
          sub="% with consent"
          isPercent
        />
      </div>

      {/* Pipeline funnel */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
            Intake to outcome
          </h2>
          <span className="text-xs text-[hsl(var(--c-slate-soft))]">
            All categories · all chapters
          </span>
        </div>
        <div className="collegium-card p-5 sm:p-6">
          {STATUS_BUCKETS.map((b) => {
            const count = metrics.byStatus.get(b.label) ?? 0;
            const percent =
              metrics.totalIntake > 0
                ? Math.round((count / metrics.totalIntake) * 100)
                : 0;
            return (
              <div key={b.label} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between gap-2 text-sm mb-1">
                  <span className={`font-medium ${b.tone}`}>{b.label}</span>
                  <span className="text-[hsl(var(--c-slate-soft))]">
                    {count} ({percent}%)
                  </span>
                </div>
                <div className="h-2 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--c-wine))]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter breakdown */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div>
            <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
              By chapter
            </h2>
            <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
              Where intake comes from, what stage matters are in
            </p>
          </div>
        </div>
        <div className="collegium-card p-5 sm:p-6">
          <div className="space-y-4">
            {metrics.byChapter.map((row) => (
              <div key={row.id}>
                <div className="flex items-center justify-between gap-2 text-sm mb-1">
                  <span className="font-medium text-[hsl(var(--c-ink))]">
                    {row.name}
                  </span>
                  <span className="text-[hsl(var(--c-slate-soft))]">
                    {row.total} matters
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-[hsl(var(--c-cream-warm))]">
                  <div
                    className="bg-[hsl(38_55%_50%)]"
                    style={{ width: `${pct(row.new, row.total)}%` }}
                    title={`${row.new} new`}
                  />
                  <div
                    className="bg-[hsl(var(--c-wine))]"
                    style={{ width: `${pct(row.inFlight, row.total)}%` }}
                    title={`${row.inFlight} in flight`}
                  />
                  <div
                    className="bg-[hsl(145_30%_45%)]"
                    style={{ width: `${pct(row.closed, row.total)}%` }}
                    title={`${row.closed} closed`}
                  />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
                  <span>{row.new} new</span>
                  <span>{row.inFlight} in flight</span>
                  <span>{row.closed} closed</span>
                  {row.urgentOpen > 0 && (
                    <span className="text-[hsl(8_55%_42%)] inline-flex items-center gap-1">
                      <AlertTriangle size={10} /> {row.urgentOpen} urgent open
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category & language gaps */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="collegium-display text-xl sm:text-2xl leading-tight mb-3">
            By practice area
          </h2>
          <div className="collegium-card p-5">
            {metrics.byCategory.map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between gap-3 py-2 border-b last:border-0 border-[hsl(var(--c-border))]"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[hsl(var(--c-ink))] capitalize">
                    {c.category.replace(/-/g, " ")}
                  </div>
                  <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                    {c.open} open · {c.closed} closed
                  </div>
                </div>
                <div className="text-sm text-[hsl(var(--c-wine))] font-semibold tabular-nums">
                  {c.total}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Languages size={14} className="text-[hsl(var(--c-wine))]" />
            <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
              Language coverage
            </h2>
          </div>
          <div className="collegium-card p-5">
            {metrics.byLanguage.length === 0 ? (
              <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                No non-English language demand recorded in the current window.
              </p>
            ) : (
              metrics.byLanguage.map((l) => (
                <div
                  key={l.lang}
                  className="flex items-center justify-between gap-3 py-2 border-b last:border-0 border-[hsl(var(--c-border))]"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[hsl(var(--c-ink))]">
                      {LANG_NAME[l.lang] ?? l.lang}
                    </div>
                    <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                      across {l.regions.size} region{l.regions.size === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="text-sm text-[hsl(var(--c-wine))] font-semibold tabular-nums">
                    {l.count}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Drop-off + gap callout */}
      <section className="mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-[hsl(var(--c-wine))]" />
          <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
            The gap, named
          </h2>
        </div>
        <div className="collegium-card p-5 sm:p-6 bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] border-[hsl(220_20%_22%)]">
          <p className="text-sm sm:text-base leading-relaxed text-[hsl(40_25%_85%)] mb-3">
            <strong className="text-[hsl(38_60%_75%)] font-semibold">
              {metrics.totalIntake} matters
            </strong>{" "}
            entered the network's intake.{" "}
            <strong className="text-[hsl(40_40%_92%)] font-semibold">
              {metrics.served} were served.
            </strong>{" "}
            That leaves{" "}
            <strong className="text-[hsl(40_40%_92%)] font-semibold">
              {metrics.totalIntake - metrics.served}
            </strong>{" "}
            still in the pipeline or in the gap.
          </p>
          {metrics.languageGap.length > 0 && (
            <p className="text-sm text-[hsl(40_25%_82%)] leading-relaxed mt-3">
              <strong className="text-[hsl(38_60%_75%)] font-semibold">
                Language pressure points:
              </strong>{" "}
              {metrics.languageGap
                .map((l) => `${LANG_NAME[l] ?? l}`)
                .join(", ")}{" "}
              — open matters here outnumber confirmed fluent volunteers.
            </p>
          )}
          {metrics.urgentAging > 0 && (
            <p className="text-sm text-[hsl(40_25%_82%)] leading-relaxed mt-3 inline-flex items-start gap-1.5">
              <AlertTriangle
                size={13}
                className="text-[hsl(8_50%_70%)] mt-0.5 shrink-0"
              />
              <span>
                {metrics.urgentAging} urgent matter
                {metrics.urgentAging === 1 ? " is" : "s are"} more than seven
                days old and still unassigned. NRI Pulse will surface each one
                individually.
              </span>
            </p>
          )}
          <p className="text-[11px] text-[hsl(40_20%_75%)] mt-4 italic">
            Snapshot regenerated on every page load from live network data.
            Filters and timelines coming in the next polish session.
          </p>
        </div>
      </section>

      <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8 collegium-safe-bottom">
        <div className="flex items-start gap-2">
          <Globe size={11} className="mt-0.5 shrink-0 text-[hsl(var(--c-wine))]" />
          <p>
            Public Justice Gap content lives at{" "}
            <a href="/justicegap" className="collegium-link">
              /justicegap
            </a>{" "}
            — that surface is for advocacy and awareness. This page is the
            steward's working view of the same data, scoped to the network's
            own intake.
          </p>
        </div>
      </section>
    </div>
  );
}

function KPI({
  label,
  value,
  sub,
  isPercent,
}: {
  label: string;
  value: number;
  sub: string;
  isPercent?: boolean;
}) {
  return (
    <div className="collegium-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div className="collegium-display text-3xl text-[hsl(var(--c-ink))] leading-none">
        {value}
        {isPercent && <span className="text-base">%</span>}
      </div>
      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">{sub}</div>
    </div>
  );
}

function pct(n: number, d: number): number {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

interface Metrics {
  totalIntake: number;
  activeInPool: number;
  closed: number;
  served: number;
  closureLoopRate: number;
  urgentAging: number;
  byStatus: Map<string, number>;
  byChapter: ChapterRow[];
  byCategory: CategoryRow[];
  byLanguage: LanguageRow[];
  languageGap: string[];
}

interface ChapterRow {
  id: string;
  name: string;
  total: number;
  new: number;
  inFlight: number;
  closed: number;
  urgentOpen: number;
}

interface CategoryRow {
  category: string;
  total: number;
  open: number;
  closed: number;
}

interface LanguageRow {
  lang: string;
  count: number;
  regions: Set<string>;
}

function computeMetrics(): Metrics {
  const totalIntake = serviceMatters.length;
  const activeInPool = Object.keys(proBonoCaseMeta).length;
  const closed = serviceMatters.filter((m) => m.status === "closed").length;
  const served = closed; // for v1, served == closed; expand later with closure-loop verified subset
  const consentCount = serviceMatters.filter((m) => m.closureLoopConsent).length;
  const closureLoopRate = Math.round((consentCount / totalIntake) * 100);

  const byStatus = new Map<string, number>();
  for (const bucket of STATUS_BUCKETS) {
    const count = serviceMatters.filter((m) =>
      bucket.statuses.includes(m.status)
    ).length;
    byStatus.set(bucket.label, count);
  }

  const byChapter: ChapterRow[] = chapters
    .map((c) => {
      const matters = serviceMatters.filter(
        (m) => m.referringChapterId === c.id
      );
      const newCount = matters.filter((m) => m.status === "new").length;
      const closedCount = matters.filter((m) => m.status === "closed").length;
      const inFlight = matters.length - newCount - closedCount;
      const urgentOpen = matters.filter(
        (m) => m.urgency === "urgent" && m.status !== "closed"
      ).length;
      return {
        id: c.id,
        name: c.name.split("—")[0].trim(),
        total: matters.length,
        new: newCount,
        inFlight,
        closed: closedCount,
        urgentOpen,
      };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  const categoryMap = new Map<string, CategoryRow>();
  for (const m of serviceMatters) {
    const row = categoryMap.get(m.category) ?? {
      category: m.category,
      total: 0,
      open: 0,
      closed: 0,
    };
    row.total += 1;
    if (m.status === "closed") row.closed += 1;
    else row.open += 1;
    categoryMap.set(m.category, row);
  }
  const byCategory = [...categoryMap.values()].sort(
    (a, b) => b.total - a.total
  );

  const langMap = new Map<string, LanguageRow>();
  for (const m of serviceMatters) {
    if (!m.languages) continue;
    for (const lang of m.languages) {
      if (lang === "en") continue;
      const row = langMap.get(lang) ?? {
        lang,
        count: 0,
        regions: new Set<string>(),
      };
      row.count += 1;
      row.regions.add(m.region);
      langMap.set(lang, row);
    }
  }
  const byLanguage = [...langMap.values()].sort((a, b) => b.count - a.count);

  const languageGap = byLanguage.filter((l) => l.count >= 2).map((l) => l.lang);

  const now = Date.now();
  const urgentAging = serviceMatters.filter(
    (m) =>
      m.urgency === "urgent" &&
      m.status !== "closed" &&
      m.status !== "assigned" &&
      (now - new Date(m.intakeDate).getTime()) / 86400000 >= 7
  ).length;

  return {
    totalIntake,
    activeInPool,
    closed,
    served,
    closureLoopRate,
    urgentAging,
    byStatus,
    byChapter,
    byCategory,
    byLanguage,
    languageGap,
  };
}
