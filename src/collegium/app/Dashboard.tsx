import { Link } from "react-router-dom";
import {
  Users,
  Compass,
  Scale,
  Library,
  TrendingUp,
  Activity,
  Sun,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { useDemoState, roleLabel } from "../lib/demoStore";
import {
  chapters,
  events,
  serviceMatters,
  mentorPairs,
  people,
} from "../data/demo";
import { peerGuilds, peerSignals } from "../data/communio";
import { generateBriefings } from "../lib/nri/engine";
import { devotionalForDate } from "../content/devotional";

export function Dashboard() {
  const state = useDemoState();
  const r = roleLabel[state.role];

  const today = new Date();
  const office = devotionalForDate(today);

  const nriBriefings = generateBriefings({
    chapters,
    people,
    mentorPairs,
    events,
    serviceMatters,
    peerGuilds,
    peerSignals,
  });

  const myChapter = chapters[0]; // Boston for local steward demo
  const networkPulse = nriBriefings.find((b) => b.scope === "network");
  const urgentNri = nriBriefings.filter((b) =>
    state.role === "national-steward" ? true : b.scope !== "person"
  ).slice(0, 3);
  const upcomingEvents = [...events]
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-1">
          Salve, {state.identityName.split(" ")[0]}
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl">
          {greeting(today)}, {state.identityName.split(" ")[0]}.
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          Acting as {r.label} ({r.latin}). Today is {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.
        </p>
      </div>

      {/* ── Top row: NRI + Today's Office ── */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="lg:col-span-2 collegium-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[hsl(var(--c-wine))]" />
              <h2 className="collegium-display text-xl">What needs your attention</h2>
            </div>
            <Link to="/app/pulse" className="text-xs collegium-link">
              See all NRI briefings
            </Link>
          </div>
          <div className="space-y-3">
            {urgentNri.map((b) => (
              <Link
                to="/app/pulse"
                key={b.id}
                className="block border-l-2 border-[hsl(var(--c-gold))] pl-4 py-1.5 hover:bg-[hsl(var(--c-cream-warm))] rounded-r-md -mx-2 px-4 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <div className="font-medium text-sm text-[hsl(var(--c-ink))] flex-1">
                    {b.title}
                  </div>
                  <ToneTag tone={b.tone} />
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))] leading-snug line-clamp-2">
                  {b.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/app/office"
          className="collegium-card p-5 sm:p-6 hover:shadow-md transition-shadow group block bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))]"
        >
          <div className="flex items-center gap-2 mb-3 text-[hsl(var(--c-wine))]">
            <Sun size={16} />
            <span className="text-xs uppercase tracking-widest">Today's Office</span>
          </div>
          <div className="collegium-latin text-sm mb-1">{office.latin}</div>
          <h3 className="collegium-display text-xl mb-3">{office.theme}</h3>
          <blockquote className="collegium-quote text-sm mb-3">
            "{office.excerpt.length > 110 ? office.excerpt.slice(0, 110) + "…" : office.excerpt}"
          </blockquote>
          <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-4">{office.citation}</div>
          <div className="flex items-center gap-1 text-sm text-[hsl(var(--c-wine))] font-medium">
            Read today's Office <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ── Modules quick-access ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <ModuleTile to="/app/chapters" icon={Users} label="Chapters" count={chapters.length} />
        <ModuleTile to="/app/mentorship" icon={Compass} label="Mentorship" count={mentorPairs.length} />
        <ModuleTile to="/app/service" icon={Scale} label="Service" count={serviceMatters.filter((s) => s.status !== "closed").length} />
        <ModuleTile to="/app/formation" icon={Library} label="Formation" count={3} suffix="tracks" />
        <ModuleTile to="/app/advancement" icon={TrendingUp} label="Advancement" count={events.length} suffix="events" />
        <ModuleTile to="/app/pulse" icon={Activity} label="NRI Pulse" count={nriBriefings.length} />
      </div>

      {/* ── Network pulse + upcoming ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 collegium-safe-bottom">
        {networkPulse && (
          <div className="collegium-card p-5 sm:p-6 bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)]">
            <div className="flex items-center gap-2 mb-3 text-[hsl(38_60%_70%)]">
              <Activity size={14} />
              <span className="text-[10px] uppercase tracking-widest">Network pulse</span>
            </div>
            <h3 className="collegium-display text-xl text-[hsl(40_40%_94%)] mb-2">
              {networkPulse.title}
            </h3>
            <p className="text-sm text-[hsl(40_20%_82%)] leading-relaxed mb-4">
              {networkPulse.body}
            </p>
            <div className="text-xs text-[hsl(38_60%_70%)] uppercase tracking-widest mb-1">
              Suggested
            </div>
            <p className="text-sm text-[hsl(40_30%_88%)] italic">
              {networkPulse.suggestedAction}
            </p>
          </div>
        )}
        <div className="collegium-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[hsl(var(--c-wine))]" />
              <h2 className="collegium-display text-xl">Upcoming</h2>
            </div>
            <Link to="/app/calendar" className="text-xs collegium-link">
              Full calendar
            </Link>
          </div>
          <ul className="space-y-3">
            {upcomingEvents.map((e) => {
              const ch = chapters.find((c) => c.id === e.chapterId);
              return (
                <li key={e.id} className="border-l-2 border-[hsl(var(--c-gold))] pl-3 py-0.5">
                  <div className="flex items-baseline justify-between gap-3 mb-0.5">
                    <span className="font-medium text-sm text-[hsl(var(--c-ink))]">
                      {e.title}
                    </span>
                    <span className="text-xs text-[hsl(var(--c-slate-soft))] shrink-0">
                      {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                    {ch?.name}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function ToneTag({ tone }: { tone: "celebrate" | "attend" | "concern" }) {
  const map = {
    celebrate: { bg: "bg-[hsl(145_30%_42%/0.12)]", color: "text-[hsl(145_40%_30%)]", label: "Celebrate" },
    attend: { bg: "bg-[hsl(38_55%_50%/0.12)]", color: "text-[hsl(var(--c-wine))]", label: "Attend" },
    concern: { bg: "bg-[hsl(8_45%_52%/0.12)]", color: "text-[hsl(8_55%_42%)]", label: "Concern" },
  }[tone];
  return (
    <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded ${map.bg} ${map.color}`}>
      {map.label}
    </span>
  );
}

function ModuleTile({
  to,
  icon: Icon,
  label,
  count,
  suffix = "",
}: {
  to: string;
  icon: typeof Users;
  label: string;
  count: number;
  suffix?: string;
}) {
  return (
    <Link
      to={to}
      className="collegium-card p-4 hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[88px]"
    >
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))]">
        <Icon size={14} />
        <span className="text-xs font-medium ui-sans uppercase tracking-wider text-[hsl(var(--c-slate))]">
          {label}
        </span>
      </div>
      <div className="collegium-display text-2xl text-[hsl(var(--c-ink))]">
        {count} {suffix && <span className="text-sm text-[hsl(var(--c-slate-soft))]">{suffix}</span>}
      </div>
    </Link>
  );
}
