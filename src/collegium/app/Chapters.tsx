import { Link, useParams } from "react-router-dom";
import { chapters, people, events, serviceMatters } from "../data/demo";
import {
  MapPin,
  Users,
  Calendar,
  ArrowRight,
  ChevronLeft,
  Scale,
  CheckCircle2,
} from "lucide-react";

export function ChaptersList() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="collegium-latin text-sm text-[hsl(var(--c-wine))]">Capitula</div>
        <h1 className="collegium-display text-3xl sm:text-4xl">Chapters</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1">
          The local guilds, affiliates, and student fellowships that hold the
          network together.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5 collegium-safe-bottom">
        {chapters.map((c) => (
          <Link
            to={`/app/chapters/${c.slug}`}
            key={c.id}
            className="collegium-card p-5 sm:p-6 hover:shadow-md transition-shadow block"
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="collegium-display text-xl leading-tight">{c.name}</h2>
              <HealthBadge score={c.health.score} />
            </div>
            <div className="flex items-center gap-3 text-xs text-[hsl(var(--c-slate-soft))] mb-3">
              <span className="flex items-center gap-1"><MapPin size={11} /> {c.city}, {c.state}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {c.membersCount}</span>
              <span>Founded {c.founded}</span>
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3 line-clamp-3">
              {c.blurb}
            </p>
            <span className="collegium-tag-soft">{c.type.replace("-", " ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ChapterDetail() {
  const { slug } = useParams<{ slug: string }>();
  const c = chapters.find((x) => x.slug === slug);
  if (!c) return <div className="p-8">Chapter not found.</div>;

  const members = people.filter((p) => p.chapterId === c.id);
  const chapterEvents = events.filter((e) => e.chapterId === c.id);
  const referredMatters = serviceMatters.filter(
    (m) => m.referringChapterId === c.id
  );
  const closedWithLoop = referredMatters.filter(
    (m) => m.status === "closed" && m.closureSummary
  );
  const openLoop = referredMatters.filter((m) => m.status !== "closed");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <Link to="/app/chapters" className="text-xs collegium-link mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={12} /> All chapters
      </Link>

      <div className="mb-6 sm:mb-8">
        <span className="collegium-tag-soft mb-2 inline-block">{c.type.replace("-", " ")}</span>
        <h1 className="collegium-display text-3xl sm:text-4xl mb-2 leading-tight">{c.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[hsl(var(--c-slate-soft))]">
          <span className="flex items-center gap-1"><MapPin size={13} /> {c.city}, {c.state}</span>
          <span className="flex items-center gap-1"><Users size={13} /> {c.membersCount} members</span>
          <span>Founded {c.founded}</span>
        </div>
        <p className="mt-4 text-[hsl(var(--c-slate))] leading-relaxed max-w-3xl">{c.blurb}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="lg:col-span-2 collegium-card p-5 sm:p-6">
          <h3 className="collegium-display text-xl mb-1">Chapter health</h3>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-5">
            NRI-synthesized score across four indices. Hover to see what's behind each.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <HealthMetric label="Hospitality" latin="Hospitalitas" value={c.health.hospitality} />
            <HealthMetric label="Formation" latin="Eruditio" value={c.health.formation} />
            <HealthMetric label="Service" latin="Ministerium" value={c.health.service} />
            <HealthMetric label="Succession" latin="Successio" value={c.health.succession} />
          </div>
          <div className="collegium-card-warm p-4 text-sm text-[hsl(var(--c-slate))] leading-relaxed">
            <div className="collegium-latin text-xs mb-1 text-[hsl(var(--c-wine))]">Reading</div>
            {c.health.notes}
          </div>
        </div>

        <div className="collegium-card p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <h3 className="collegium-display text-xl">Officers</h3>
            <Link
              to={`/app/chapters/${c.slug}/handoff`}
              className="text-xs collegium-link inline-flex items-center gap-1"
            >
              Handoff workspace →
            </Link>
          </div>
          <ul className="space-y-3">
            {c.officers.map((o) => {
              const termSoon =
                o.termEnd &&
                (new Date(o.termEnd).getTime() - Date.now()) / 86_400_000 < 90;
              return (
                <li key={o.name} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-[hsl(var(--c-ink))]">{o.name}</span>
                  <span className="text-xs text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1.5">
                    {o.role}
                    {termSoon && (
                      <span className="text-[9px] uppercase tracking-widest font-semibold px-1 py-0.5 rounded bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]">
                        Term ending
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 collegium-safe-bottom">
        <div className="collegium-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="collegium-display text-xl">Upcoming events</h3>
            <Link to="/app/advancement" className="text-xs collegium-link">All</Link>
          </div>
          <ul className="space-y-4">
            {chapterEvents.slice(0, 4).map((e) => (
              <li key={e.id} className="border-l-2 border-[hsl(var(--c-gold))] pl-3">
                <div className="flex items-baseline justify-between gap-3 mb-0.5">
                  <span className="font-medium text-sm">{e.title}</span>
                  <span className="text-xs text-[hsl(var(--c-slate-soft))] shrink-0">
                    {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                  {e.location} · {e.rsvpCount}/{e.capacity} RSVPs
                </div>
              </li>
            ))}
            {chapterEvents.length === 0 && (
              <li className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                No upcoming events on the calendar.
              </li>
            )}
          </ul>
        </div>

        <div className="collegium-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="collegium-display text-xl">Members</h3>
            <span className="text-xs text-[hsl(var(--c-slate-soft))]">{members.length} shown · {c.membersCount} total</span>
          </div>
          <ul className="space-y-3">
            {members.slice(0, 6).map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-wine)/0.1)] flex items-center justify-center text-xs font-medium text-[hsl(var(--c-wine))]">
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[hsl(var(--c-ink))]">{m.name}</div>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] truncate">
                    {m.stage.replace("-", " ")} · {m.practice.slice(0, 2).join(", ")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Parish loop ────────────────────────────────────────────── */}
      {referredMatters.length > 0 && (
        <section className="mt-6 sm:mt-8 collegium-safe-bottom">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h2 className="collegium-display text-2xl sm:text-3xl">
              Parish loop
            </h2>
            <Link to="/app/service" className="text-xs collegium-link">
              All service matters
            </Link>
          </div>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-5 sm:mb-6 max-w-3xl">
            Matters referred in through partner parishes connected to this
            chapter. When a matter closes — and the requester has consented —
            a pastoral-care-aware note returns here so the parish that sent
            them can keep walking with them, even after the legal work is done.
          </p>

          {closedWithLoop.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={12} /> Closed — pastoral notes
              </div>
              <div className="space-y-3">
                {closedWithLoop.map((m) => (
                  <article
                    key={m.id}
                    className="collegium-card p-5 sm:p-6 bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                      <span className="collegium-tag-soft">
                        {m.category.replace("-", " ")}
                      </span>
                      <span className="text-[hsl(var(--c-slate-soft))]">
                        Closed{" "}
                        {m.closureDate
                          ? new Date(m.closureDate).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric" }
                            )
                          : ""}
                      </span>
                      {m.referredBy && (
                        <span className="text-[hsl(var(--c-slate-soft))]">
                          · via {m.referredBy}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-sm text-[hsl(var(--c-ink))] mb-2">
                      {m.requester}
                    </div>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed italic border-l-2 border-[hsl(var(--c-gold))] pl-3">
                      {m.closureSummary}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-3 uppercase tracking-widest">
                      Consent on file · no legal substance shared
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {openLoop.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-3">
                In progress — visible to chapter steward only
              </div>
              <div className="space-y-2">
                {openLoop.map((m) => (
                  <div
                    key={m.id}
                    className="collegium-card p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="collegium-tag-soft">
                          {m.category.replace("-", " ")}
                        </span>
                        <span className="text-xs text-[hsl(var(--c-slate-soft))]">
                          {m.status} · referred{" "}
                          {new Date(m.intakeDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[hsl(var(--c-ink))] truncate">
                        {m.requester}
                      </div>
                      {m.referredBy && (
                        <div className="text-xs text-[hsl(var(--c-slate-soft))] truncate">
                          via {m.referredBy}
                        </div>
                      )}
                    </div>
                    {m.closureLoopConsent && (
                      <span className="text-[10px] uppercase tracking-widest text-[hsl(145_40%_30%)] shrink-0">
                        Closure-loop on
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-[hsl(145_30%_42%/0.15)] text-[hsl(145_40%_28%)] border-[hsl(145_30%_42%/0.3)]"
      : score >= 65
      ? "bg-[hsl(38_55%_50%/0.15)] text-[hsl(var(--c-wine))] border-[hsl(38_55%_50%/0.3)]"
      : "bg-[hsl(8_45%_52%/0.15)] text-[hsl(8_55%_42%)] border-[hsl(8_45%_52%/0.3)]";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${color} shrink-0`}>
      {score}/100
    </span>
  );
}

function HealthMetric({ label, latin, value }: { label: string; latin: string; value: number }) {
  return (
    <div>
      <div className="text-xs text-[hsl(var(--c-slate-soft))] uppercase tracking-wider">{label}</div>
      <div className="collegium-latin text-[10px] mb-1">{latin}</div>
      <div className="collegium-display text-2xl text-[hsl(var(--c-ink))]">{value}</div>
      <div className="h-1 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-[hsl(var(--c-gold))] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
