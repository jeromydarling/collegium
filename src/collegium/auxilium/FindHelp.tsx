import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ExternalLink,
  Phone,
  Info,
  ShieldCheck,
} from "lucide-react";
import { chapters } from "../data/demo";
import { useJurisdiction } from "./components/JurisdictionPicker";
import {
  directory,
  filterByState,
  groupByCategory,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  type Resource,
} from "./data/directory";
import { InfoNotAdviceFooter } from "./components/InfoNotAdviceFooter";

/**
 * FindHelp — the comprehensive Auxilium legal-help directory.
 *
 * Goal: every avenue a person can actually use, organized so the cheapest
 * + most likely-to-help options surface first. Paid subscriptions appear
 * with explicit affiliate disclosure where applicable.
 */
export function FindHelp() {
  const { jurisdiction } = useJurisdiction();
  const state = jurisdiction.state;
  const [filterCat, setFilterCat] = useState<Resource["category"] | "all">("all");

  const resources = filterByState(state);
  const grouped = groupByCategory(resources);

  // Local Collegium-network chapters near the user's jurisdiction.
  const networkLocal = state
    ? chapters.filter(
        (c) =>
          c.state === abbreviationOf(state) ||
          c.state === state ||
          (jurisdiction.city &&
            c.city.toLowerCase().includes(jurisdiction.city.toLowerCase()))
      )
    : [];

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 collegium-safe-bottom">
        <Link
          to="/auxilium"
          className="text-xs collegium-link mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Back
        </Link>

        <h1 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
          Find legal help near you.
        </h1>
        <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-6 sm:mb-8">
          Every avenue we know of — free legal aid, faith-based clinics,
          hotlines, court self-help, paid subscription options. Sorted by
          which is most likely to help you. Bring your{" "}
          <Link to="/auxilium/matter-file" className="collegium-link">
            matter file
          </Link>{" "}
          with you when you call or visit.
        </p>

        {/* Info banner about the directory */}
        <aside className="bg-[hsl(var(--c-cream-warm))] border-l-2 border-[hsl(var(--c-gold))] rounded-r-md p-4 sm:p-5 mb-8 sm:mb-10">
          <div className="flex items-start gap-3">
            <Info
              size={16}
              className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-2">
                <strong>Free help comes first.</strong> Every option below
                that isn't marked "paid" is free or sliding-scale. Income
                eligibility usually means below 125–200% of the federal
                poverty level (roughly $19K–$31K for one person; about
                $40K–$63K for a family of three in 2026).
              </p>
              <p className="text-sm text-[hsl(var(--c-slate-soft))] leading-relaxed">
                If you make more than that and can't afford $300/hr private
                rates, scroll to the paid subscription section — there are
                real $25/month options that work for most everyday matters.
              </p>
            </div>
          </div>
        </aside>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 -mx-1">
          <Chip
            label="Show all"
            active={filterCat === "all"}
            onClick={() => setFilterCat("all")}
          />
          {CATEGORY_ORDER.map((cat) => {
            const count = (grouped.get(cat) ?? []).length;
            if (count === 0) return null;
            return (
              <Chip
                key={cat}
                label={`${CATEGORY_LABEL[cat]} (${count})`}
                active={filterCat === cat}
                onClick={() => setFilterCat(cat)}
              />
            );
          })}
        </div>

        {/* Collegium-network chapters near the user, if any */}
        {networkLocal.length > 0 && filterCat === "all" && (
          <section className="mb-8 sm:mb-10">
            <SectionHeader>From the Collegium network</SectionHeader>
            <div className="space-y-3">
              {networkLocal.map((c) => (
                <article key={c.id} className="collegium-card p-4 sm:p-5">
                  <h3 className="collegium-display text-lg leading-tight mb-1">
                    {c.name}
                  </h3>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-3">
                    {c.city}, {c.state}
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                    {c.blurb}
                  </p>
                  <Link
                    to={`/app/chapters/${c.slug}`}
                    className="text-xs collegium-link"
                  >
                    More about this chapter →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Categorized directory */}
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          if (filterCat !== "all" && filterCat !== cat) return null;
          return (
            <section key={cat} className="mb-8 sm:mb-10">
              <SectionHeader>{CATEGORY_LABEL[cat]}</SectionHeader>
              {cat === "paid-subscription" && (
                <PaidDisclosure />
              )}
              <ul className="space-y-3">
                {items.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </ul>
            </section>
          );
        })}

        <p className="text-xs text-[hsl(var(--c-slate-soft))] text-center mt-10 leading-relaxed">
          Don't see a resource that belongs here?{" "}
          <a
            href="mailto:auxilium@collegium.app?subject=Resource%20to%20add"
            className="collegium-link"
          >
            Tell us
          </a>
          . We grow this directory every week.
        </p>
      </div>
      <InfoNotAdviceFooter />
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="collegium-display text-xl sm:text-2xl mb-3 sm:mb-4 leading-tight">
      {children}
    </h2>
  );
}

function PaidDisclosure() {
  return (
    <aside className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-md p-4 mb-4">
      <div className="flex items-start gap-2.5">
        <ShieldCheck
          size={14}
          className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0"
        />
        <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">
          <strong>Disclosure:</strong> Auxilium receives a small referral
          fee for some signups in this section. It does not change what
          you pay or what service you receive. We list paid options
          because, above the legal-aid income cliff, a $25/month
          subscription is genuinely cheaper than a single hour of a
          private attorney.
        </p>
      </div>
    </aside>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="collegium-card p-4 sm:p-5 hover:shadow-md transition-shadow block group"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h3 className="collegium-display text-base sm:text-lg leading-tight">
                {resource.name}
              </h3>
              {resource.affiliate && (
                <span className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                  Affiliate
                </span>
              )}
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-2">
              {resource.blurb}
            </p>
            {(resource.eligibility || resource.phone) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-1.5">
                {resource.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone size={11} />
                    <a
                      href={`tel:${resource.phone.replace(/\D/g, "")}`}
                      className="collegium-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {resource.phone}
                    </a>
                  </span>
                )}
                {resource.eligibility && (
                  <span>{resource.eligibility}</span>
                )}
              </div>
            )}
            {resource.affiliate && (
              <p className="text-[10px] text-[hsl(var(--c-slate-soft))] italic leading-snug mt-1.5">
                {resource.affiliate.note}
              </p>
            )}
          </div>
          <ExternalLink
            size={14}
            className="text-[hsl(var(--c-wine))] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </a>
    </li>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-[hsl(var(--c-wine))] text-white border-[hsl(var(--c-wine))]"
          : "bg-white text-[hsl(var(--c-slate))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
      }`}
    >
      {label}
    </button>
  );
}

/** Loose US-state-name-to-abbreviation helper. */
function abbreviationOf(name: string): string {
  const map: Record<string, string> = {
    Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
    California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
    "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI",
    Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
    Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
    Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
    Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
    Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA",
    Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  };
  return map[name] ?? name;
}
