import {
  Users,
  Compass,
  Scale,
  Library as LibraryIcon,
  TrendingUp,
  Activity,
  Inbox,
  Languages,
  MapPin,
  Clock,
  CheckCircle2,
  Sun,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Quote,
} from "lucide-react";

/**
 * Mini React previews — one per Collegium module — shown alongside each
 * module's description on the /modules features page. Each preview is a
 * styled-down version of a real product surface (Dashboard, NRI Pulse,
 * Hours dashboard, etc.) with realistic demo data baked in. Pure
 * presentation: no state, no real handlers, no navigation away.
 *
 * The dispatcher `<ModulePreview slug="chapters" />` picks the right
 * mini per module slug.
 */

export function ModulePreview({ slug }: { slug: string }) {
  switch (slug) {
    case "chapters":
      return <ChaptersPreview />;
    case "mentorship":
      return <MentorshipPreview />;
    case "service":
      return <ServicePreview />;
    case "formation":
      return <FormationPreview />;
    case "advancement":
      return <AdvancementPreview />;
    case "nri":
      return <NRIPreview />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Chapters — chapter card with health pulse                            */
/* ------------------------------------------------------------------ */

function ChaptersPreview() {
  return (
    <Frame icon={<Users size={14} />} latin="Capitulum">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[hsl(var(--c-border))]">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="collegium-display text-base sm:text-lg leading-tight">
              St. Thomas More Society of Boston
            </h3>
            <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]">
              78 · steady
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[hsl(var(--c-slate-soft))]">
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> Boston, MA
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={10} /> 184 members
            </span>
            <span>Founded 1957</span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2 font-semibold">
            Health pulse
          </div>
          <div className="space-y-1.5">
            <HealthBar label="Hospitality" value={88} />
            <HealthBar label="Formation" value={64} />
            <HealthBar label="Service" value={82} />
            <HealthBar label="Succession" value={56} tone="warn" />
          </div>
          <p className="text-[11px] text-[hsl(var(--c-slate))] mt-3 italic leading-snug">
            Two officer terms end in May; only one successor named.
          </p>
        </div>
      </div>
    </Frame>
  );
}

function HealthBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warn";
}) {
  const color =
    tone === "warn"
      ? "bg-[hsl(38_55%_50%)]"
      : value >= 80
      ? "bg-[hsl(145_40%_38%)]"
      : value >= 65
      ? "bg-[hsl(var(--c-wine))]"
      : "bg-[hsl(38_55%_50%)]";
  return (
    <div className="grid grid-cols-[6rem_1fr_2.5rem] gap-2 items-center text-[11px]">
      <span className="text-[hsl(var(--c-slate))]">{label}</span>
      <div className="h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[hsl(var(--c-slate-soft))] tabular-nums text-right">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mentorship — pair card with drift signal                             */
/* ------------------------------------------------------------------ */

function MentorshipPreview() {
  return (
    <Frame icon={<Compass size={14} />} latin="Tirocinium">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center text-[11px] font-semibold border-2 border-white">
                RH
              </div>
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-gold))] text-[hsl(var(--c-ink))] flex items-center justify-center text-[11px] font-semibold border-2 border-white">
                MV
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-[hsl(var(--c-ink))]">
                Prof. Hartmann & Maria Velasquez
              </div>
              <div className="text-[10px] text-[hsl(var(--c-slate-soft))]">
                Monthly cadence · started Jan 2024
              </div>
            </div>
          </div>

          <div className="border-l-4 border-l-[hsl(38_55%_50%)] bg-[hsl(38_55%_50%/0.06)] p-3 rounded-r my-3">
            <div className="text-[10px] uppercase tracking-widest text-[hsl(38_55%_28%)] mb-1 font-semibold inline-flex items-center gap-1">
              <Activity size={10} /> NRI · Attend
            </div>
            <p className="text-[12px] text-[hsl(var(--c-ink))] leading-snug">
              <strong>Maria may be drifting.</strong> Two missed meetings in
              March and April. Bar-prep season. Last outreach April 28 — no
              reply yet.
            </p>
            <p className="text-[11px] italic text-[hsl(var(--c-slate))] mt-2 leading-snug">
              "Local steward sends a one-line note. No reply needed. Revisit
              after July 30."
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Service — Network Inbox routing suggestion                           */
/* ------------------------------------------------------------------ */

function ServicePreview() {
  return (
    <Frame icon={<Scale size={14} />} latin="Ministerium">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] p-3 flex items-center gap-2">
          <Inbox size={13} />
          <span className="text-[10px] uppercase tracking-widest">
            Network Inbox · 4 new
          </span>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px]">
            <span className="collegium-tag-soft">immigration</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(8_55%_38%)]">
              Urgent
            </span>
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
              <Languages size={10} /> Spanish
            </span>
          </div>
          <h3 className="collegium-display text-sm leading-tight mb-1.5">
            Maria F. · Pilsen · U-visa preparation
          </h3>
          <p className="text-[11px] text-[hsl(var(--c-slate))] leading-snug mb-3">
            Documentation gathered. Survivor of domestic violence. Petition
            draft underway.
          </p>
          <div className="bg-[hsl(var(--c-cream-warm))] rounded p-2.5">
            <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold mb-1.5">
              Suggested routing
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <div className="min-w-0">
                <div className="font-medium text-[hsl(var(--c-ink))]">
                  Catholic Lawyers Guild of Chicago
                </div>
                <div className="text-[10px] text-[hsl(var(--c-slate-soft))]">
                  Local · immigration · Spanish-fluent volunteers
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))] shrink-0">
                Best fit
              </span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Formation — Daily Office card                                        */
/* ------------------------------------------------------------------ */

function FormationPreview() {
  return (
    <Frame icon={<LibraryIcon size={14} />} latin="Eruditio">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] p-4 border-b border-[hsl(var(--c-border))]">
          <div className="flex items-center gap-2 mb-1">
            <Sun size={13} className="text-[hsl(var(--c-gold))]" />
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
              Daily Office · Thursday
            </span>
          </div>
          <h3 className="collegium-display text-base leading-tight">
            Aquinas on Law as Ordinance of Reason
          </h3>
          <p className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-0.5">
            Summa Theologiae I-II, q. 90, a. 4 · 8 minutes
          </p>
        </div>
        <div className="p-4">
          <blockquote className="text-[12px] italic text-[hsl(var(--c-ink))] leading-relaxed border-l-2 border-l-[hsl(var(--c-gold))] pl-3 mb-3">
            "Law is nothing else than an ordinance of reason for the common
            good, made by him who has care of the community, and promulgated."
          </blockquote>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1 font-semibold">
            Today's question
          </div>
          <p className="text-[11px] text-[hsl(var(--c-slate))] leading-snug">
            Where in your practice do you find yourself enforcing a rule that
            isn't, in Aquinas's sense, an ordinance of reason for the common
            good?
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[hsl(var(--c-slate-soft))]">
            <CheckCircle2 size={11} className="text-[hsl(145_40%_28%)]" />
            14 of your chapter have read this today
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Advancement — event RSVP card with capacity                          */
/* ------------------------------------------------------------------ */

function AdvancementPreview() {
  return (
    <Frame icon={<TrendingUp size={14} />} latin="Provectio">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 text-[10px]">
            <CalendarDays size={11} className="text-[hsl(var(--c-wine))]" />
            <span className="text-[hsl(var(--c-wine))] font-semibold uppercase tracking-widest">
              Annual Formation Day
            </span>
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span className="text-[hsl(var(--c-slate-soft))]">Sept 21</span>
          </div>
          <h3 className="collegium-display text-base leading-tight mb-1">
            Aquinas on the Treatise on Law
          </h3>
          <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mb-3">
            Arlington Catholic Bar · Cathedral of St. Thomas More
          </p>

          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-[hsl(var(--c-slate-soft))]">RSVP</span>
              <span className="font-semibold text-[hsl(var(--c-ink))]">
                41 / 120
              </span>
            </div>
            <div className="h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--c-wine))]"
                style={{ width: "34%" }}
              />
            </div>
          </div>

          <div className="bg-[hsl(var(--c-cream-warm))] rounded p-3">
            <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1.5 font-semibold">
              Leadership pipeline · NRI suggests
            </div>
            <ul className="space-y-1 text-[11px] text-[hsl(var(--c-slate))]">
              <li className="flex items-start gap-1.5">
                <span className="text-[hsl(var(--c-gold))]">·</span>
                Anita Roy — co-leadership, mentor pair thriving
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[hsl(var(--c-gold))]">·</span>
                Patrick Owens — running JP II reading group next month
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* NRI Pulse — network-wide pulse                                       */
/* ------------------------------------------------------------------ */

function NRIPreview() {
  return (
    <Frame icon={<Activity size={14} />} latin="Concentus">
      <div className="bg-white rounded-lg border border-[hsl(var(--c-border))] overflow-hidden shadow-sm">
        <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] p-3 flex items-center gap-2">
          <Activity size={13} className="text-[hsl(38_60%_70%)]" />
          <span className="text-[10px] uppercase tracking-widest text-[hsl(38_60%_70%)]">
            NRI · 17 active briefings
          </span>
        </div>
        <article className="p-4 border-l-4 border-l-[hsl(145_30%_42%)] bg-[hsl(145_30%_45%/0.04)]">
          <div className="flex items-center gap-2 mb-1.5 text-[10px]">
            <span className="collegium-tag-soft">Network</span>
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span className="text-[hsl(145_40%_25%)] uppercase tracking-widest font-semibold">
              Celebrate
            </span>
          </div>
          <h3 className="collegium-display text-base leading-tight mb-2">
            Network pulse — Q2 2026
          </h3>
          <p className="text-[11px] text-[hsl(var(--c-slate))] leading-snug mb-3">
            5 chapters, 710 members. 6 of 8 mentor pairs thriving. 12 matters
            closed, 23 in flight. The numbers don't tell the story — but they
            tell the steward where to look.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <NRIStat label="Chapters" value="5" />
            <NRIStat label="Members" value="710" />
            <NRIStat label="Pairs ✓" value="6/8" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold mt-3 mb-1">
            Action
          </div>
          <p className="text-[11px] italic text-[hsl(var(--c-slate))] leading-snug">
            Share the pulse with chapter presidents on the next call. Three
            lines max. Awareness, not measurement.
          </p>
        </article>
      </div>
    </Frame>
  );
}

function NRIStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[hsl(var(--c-cream))] border border-[hsl(var(--c-border))] rounded p-2">
      <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] leading-none">
        {label}
      </div>
      <div className="collegium-display text-base text-[hsl(var(--c-ink))] tabular-nums mt-1">
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frame                                                                 */
/* ------------------------------------------------------------------ */

function Frame({
  icon,
  latin,
  children,
}: {
  icon: React.ReactNode;
  latin: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute -top-3 left-4 z-10 bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded px-2 py-0.5 flex items-center gap-1 text-[hsl(var(--c-wine))]">
        {icon}
        <span className="collegium-latin text-[10px] not-italic">{latin}</span>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
