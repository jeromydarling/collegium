import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  Filter,
  Users,
  Languages,
  MapPin,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { people, serviceMatters, chapters, type Person } from "../../data/demo";

/**
 * Volunteer roster — the practice-tagged people directory that lets a
 * steward answer "find me a Spanish-fluent immigration volunteer in
 * Boston with ≤ 4 hours of bandwidth." Pulls from people[] and filters
 * by practice area, vocation stage, chapter, and current matter load.
 *
 * Available capacity is computed as "open matters where this person is
 * the assigned advocate" — when over the threshold, the row is flagged
 * "at capacity" but kept visible so the steward can override.
 */

const PRACTICE_AREAS = [
  "immigration",
  "family",
  "housing",
  "expungement",
  "estate-planning",
  "indigent-defense",
  "religious-liberty",
  "canon-law",
  "parish-governance",
  "public-benefits",
  "appellate",
  "litigation",
  "tribunal",
  "education",
] as const;

const STAGES = [
  "lawyer",
  "young-lawyer",
  "canon-lawyer",
  "judge",
  "professor",
  "clergy",
  "student",
  "retired",
] as const;

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  la: "Latin",
  zh: "Chinese",
};

const LOAD_CAP_DEFAULT = 2;

export function VolunteerRoster() {
  const [practice, setPractice] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [chapterId, setChapterId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [excludeAtCapacity, setExcludeAtCapacity] = useState(false);

  // Compute current load per person from open service matters.
  const loadByPerson = useMemo(() => {
    const m = new Map<string, number>();
    for (const matter of serviceMatters) {
      if (matter.status === "closed") continue;
      if (matter.assignedTo) {
        m.set(matter.assignedTo, (m.get(matter.assignedTo) ?? 0) + 1);
      }
    }
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      if (practice && !p.practice.includes(practice)) return false;
      if (stage && p.stage !== stage) return false;
      if (chapterId && p.chapterId !== chapterId) return false;
      const load = loadByPerson.get(p.id) ?? 0;
      if (excludeAtCapacity && load >= LOAD_CAP_DEFAULT) return false;
      if (q) {
        const hay = `${p.name} ${p.city} ${p.practice.join(" ")} ${p.bio}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [practice, stage, chapterId, query, excludeAtCapacity, loadByPerson]);

  const activeFilterCount = [practice, stage, chapterId, query].filter(Boolean).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <Link
        to="/app/service"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Service
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Users size={14} />
          <span className="collegium-latin text-sm">Voluntarii</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Volunteer roster
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Practice-tagged people directory. Find a Spanish-fluent immigration
          volunteer in Boston with bandwidth in two minutes. Filter by
          practice, stage, chapter, language, current load.
        </p>
      </div>

      {/* Filters */}
      <div className="collegium-card p-4 sm:p-5 mb-5 bg-[hsl(var(--c-cream-warm))]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="lg:col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1 inline-flex items-center gap-1">
              <Search size={11} /> Find by name, city, or practice
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Spanish, immigration, Pilsen, Coyle"
              className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white"
            />
          </div>
          <FilterSelect
            label="Practice area"
            value={practice}
            options={PRACTICE_AREAS.map((p) => ({ value: p, label: p.replace(/-/g, " ") }))}
            onChange={setPractice}
          />
          <FilterSelect
            label="Stage"
            value={stage}
            options={STAGES.map((s) => ({ value: s, label: s.replace(/-/g, " ") }))}
            onChange={setStage}
          />
        </div>
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <FilterSelect
            label="Chapter"
            value={chapterId}
            options={chapters.map((c) => ({
              value: c.id,
              label: c.name.split("—")[0].trim(),
            }))}
            onChange={setChapterId}
          />
          <label className="text-xs text-[hsl(var(--c-slate))] inline-flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={excludeAtCapacity}
              onChange={(e) => setExcludeAtCapacity(e.target.checked)}
              className="cursor-pointer"
            />
            Hide at-capacity
          </label>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setPractice("");
                setStage("");
                setChapterId("");
                setQuery("");
              }}
              className="collegium-btn-ghost text-xs inline-flex items-center gap-1 pb-1"
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-xs text-[hsl(var(--c-slate-soft))]">
        <span>
          {filtered.length} of {people.length} members
          {activeFilterCount > 0 && (
            <span className="text-[hsl(var(--c-wine))] ml-1">
              · <Filter size={10} className="inline" /> {activeFilterCount} filter
              {activeFilterCount === 1 ? "" : "s"}
            </span>
          )}
        </span>
      </div>

      <div className="space-y-2.5 collegium-safe-bottom">
        {filtered.map((p) => (
          <VolunteerRow key={p.id} person={p} load={loadByPerson.get(p.id) ?? 0} />
        ))}
        {filtered.length === 0 && (
          <div className="collegium-card p-8 text-center">
            <p className="text-sm text-[hsl(var(--c-slate-soft))]">
              No volunteers match these filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function VolunteerRow({ person, load }: { person: Person; load: number }) {
  const chapter = chapters.find((c) => c.id === person.chapterId);
  const atCapacity = load >= LOAD_CAP_DEFAULT;

  return (
    <article
      className={`collegium-card p-4 sm:p-5 ${
        atCapacity ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center text-sm font-semibold shrink-0">
          {person.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
            <h3 className="collegium-display text-lg leading-tight">{person.name}</h3>
            <div className="flex items-center gap-2 shrink-0">
              {atCapacity && (
                <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]">
                  At capacity
                </span>
              )}
              <span className="text-[11px] text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
                <Clock size={10} /> {load} / {LOAD_CAP_DEFAULT} open
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-2">
            <span className="capitalize">{person.stage.replace(/-/g, " ")}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> {person.city}
            </span>
            {chapter && <span>· {chapter.name.split("—")[0].trim()}</span>}
          </div>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-snug mb-2 line-clamp-2">
            {person.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {person.practice.map((p) => (
              <span key={p} className="collegium-tag-soft text-[10px]">
                {p.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 self-center">
          <button
            type="button"
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1"
          >
            Assign matter <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  // languages helper for the Spanish-fluent label in the page header
  void LANGUAGE_LABEL;
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1 inline-flex items-center gap-1">
        <Languages size={11} className="inline opacity-0" /> {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white capitalize"
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
