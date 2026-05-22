import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Filter,
  X,
  Clock,
  MapPin,
  Languages,
  ShieldCheck,
  Inbox,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import {
  allCases,
  filterCases,
  sortByAdvocatePriority,
  poolCategories,
  poolRegions,
  poolLanguages,
  ENGAGEMENT_LABEL,
  type CaseFilters,
  type EngagementType,
  type PatrociniumCase,
} from "./data/cases";
import { useDemoState } from "../lib/demoStore";

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

const URGENCY_LABEL: Record<string, string> = {
  urgent: "Urgent",
  soon: "Soon",
  routine: "Routine",
};

export function CaseBrowser() {
  const state = useDemoState();
  const [filters, setFilters] = useState<CaseFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const cases = useMemo(() => sortByAdvocatePriority(allCases()), []);
  const visible = useMemo(() => filterCases(cases, filters), [cases, filters]);

  const open = visible.filter((c) => !state.acceptedCases.includes(c.matter.id));
  const accepted = visible.filter((c) => state.acceptedCases.includes(c.matter.id));

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined).length;

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link
          to="/patrocinium"
          className="text-xs collegium-link mb-3 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Patrocinium
        </Link>

        <div className="mb-5 sm:mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
              <Inbox size={14} />
              <span className="collegium-latin text-sm">Causae apertae</span>
            </div>
            <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
              Open cases
            </h1>
            <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
              {open.length} open · {accepted.length} on your plate · sorted by
              urgency then deadline
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="collegium-btn-ghost text-sm shrink-0 inline-flex items-center gap-1.5"
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({})}
          />
        )}

        {open.length === 0 && accepted.length === 0 && (
          <div className="collegium-card p-10 text-center">
            <p className="text-sm text-[hsl(var(--c-slate-soft))]">
              No cases match these filters.{" "}
              <button
                type="button"
                onClick={() => setFilters({})}
                className="collegium-link"
              >
                Clear all
              </button>
              .
            </p>
          </div>
        )}

        {open.length > 0 && (
          <div className="space-y-3 sm:space-y-4 collegium-safe-bottom">
            {open.map((c) => (
              <CaseRow key={c.matter.id} c={c} saved={state.savedCases.includes(c.matter.id)} />
            ))}
          </div>
        )}

        {accepted.length > 0 && (
          <>
            <div className="mt-10 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
              <CheckCircle2 size={12} /> On your plate · {accepted.length}
            </div>
            <div className="space-y-3 opacity-80 collegium-safe-bottom">
              {accepted.map((c) => (
                <CaseRow key={c.matter.id} c={c} saved={false} accepted />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: CaseFilters;
  onChange: (f: CaseFilters) => void;
  onClear: () => void;
}) {
  const categories = poolCategories();
  const regions = poolRegions();
  const languages = poolLanguages();

  function update<K extends keyof CaseFilters>(key: K, value: CaseFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="collegium-card p-5 mb-5 sm:mb-6 bg-[hsl(var(--c-cream-warm))]">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <FilterSelect
          label="Practice area"
          value={filters.category}
          options={categories.map((c) => ({
            value: c,
            label: c.replace(/-/g, " "),
          }))}
          onChange={(v) => update("category", v || undefined)}
        />
        <FilterSelect
          label="Region"
          value={filters.region}
          options={regions.map((r) => ({ value: r, label: r }))}
          onChange={(v) => update("region", v || undefined)}
        />
        <FilterSelect
          label="Language"
          value={filters.language}
          options={languages.map((l) => ({
            value: l,
            label: LANG_NAME[l] ?? l,
          }))}
          onChange={(v) => update("language", v || undefined)}
        />
        <FilterSelect
          label="Engagement"
          value={filters.engagementType}
          options={(Object.keys(ENGAGEMENT_LABEL) as EngagementType[]).map((e) => ({
            value: e,
            label: ENGAGEMENT_LABEL[e],
          }))}
          onChange={(v) => update("engagementType", (v as EngagementType) || undefined)}
        />
        <FilterSelect
          label="Max hours"
          value={filters.maxHours?.toString()}
          options={[
            { value: "2", label: "≤ 2 hours" },
            { value: "4", label: "≤ 4 hours" },
            { value: "8", label: "≤ 8 hours" },
            { value: "20", label: "≤ 20 hours" },
          ]}
          onChange={(v) => update("maxHours", v ? Number(v) : undefined)}
        />
        <FilterSelect
          label="Urgency"
          value={filters.urgency}
          options={[
            { value: "urgent", label: "Urgent" },
            { value: "soon", label: "Soon" },
            { value: "routine", label: "Routine" },
          ]}
          onChange={(v) =>
            update(
              "urgency",
              (v as "urgent" | "soon" | "routine") || undefined
            )
          }
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <label className="text-xs text-[hsl(var(--c-slate))] inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.remoteOnly}
            onChange={(e) => update("remoteOnly", e.target.checked || undefined)}
            className="cursor-pointer"
          />
          Remote-only
        </label>
        <button
          type="button"
          onClick={onClear}
          className="text-xs collegium-link inline-flex items-center gap-1"
        >
          <X size={11} /> Clear all
        </button>
      </div>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm py-2 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] focus:outline-none focus:border-[hsl(var(--c-wine))]"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CaseRow({
  c,
  saved,
  accepted,
}: {
  c: PatrociniumCase;
  saved: boolean;
  accepted?: boolean;
}) {
  const { matter, meta } = c;
  return (
    <Link
      to={`/patrocinium/cases/${matter.id}`}
      className="collegium-card p-5 sm:p-6 hover:shadow-md transition-shadow block group"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
        <span className="collegium-tag-soft">
          {matter.category.replace(/-/g, " ")}
        </span>
        <UrgencyChip urgency={matter.urgency} />
        <span className="text-[hsl(var(--c-slate-soft))]">·</span>
        <span className="text-[hsl(var(--c-slate-soft))]">
          {ENGAGEMENT_LABEL[meta.engagementType]}
        </span>
        {meta.conflicts !== "pending" && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(145_40%_28%)] font-semibold">
            <ShieldCheck size={11} /> Conflicts cleared
          </span>
        )}
        {accepted && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
            <CheckCircle2 size={11} /> Accepted
          </span>
        )}
        {!accepted && saved && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(38_55%_28%)] font-semibold">
            <Bookmark size={11} /> Saved
          </span>
        )}
      </div>

      <h2 className="collegium-display text-lg sm:text-xl leading-tight mb-2">
        {meta.goal}
      </h2>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-3">
        <span className="inline-flex items-center gap-1">
          <MapPin size={11} /> {matter.region}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={11} /> ~{meta.hoursEstimate} hr{meta.hoursEstimate === 1 ? "" : "s"}
        </span>
        {matter.languages && matter.languages.some((l) => l !== "en") && (
          <span className="inline-flex items-center gap-1">
            <Languages size={11} />
            {matter.languages
              .filter((l) => l !== "en")
              .map((l) => LANG_NAME[l] ?? l)
              .join(", ")}
          </span>
        )}
        {meta.deadlineDate && (
          <span className="inline-flex items-center gap-1">
            Deadline · {formatDate(meta.deadlineDate)}
          </span>
        )}
        {meta.remoteOk && (
          <span className="text-[hsl(145_40%_30%)]">· Remote-OK</span>
        )}
      </div>

      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed line-clamp-2">
        {meta.postureNotes ?? matter.summary}
      </p>

      <div className="mt-3 text-xs collegium-link inline-flex items-center gap-1">
        See brief <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function UrgencyChip({ urgency }: { urgency: string }) {
  const tone =
    urgency === "urgent"
      ? "bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]"
      : urgency === "soon"
      ? "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]"
      : "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]";
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${tone}`}
    >
      {URGENCY_LABEL[urgency] ?? urgency}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
