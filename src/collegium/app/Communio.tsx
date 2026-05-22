import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  peerGuilds,
  peerSignals,
  peerReferrals,
  type PeerGuild,
  type ConnectionStatus,
  type TrustTier,
} from "../data/communio";
import { buildSharedReferral } from "../lib/communio/buildSharedSignal";
import {
  MapPin,
  Users,
  Scale,
  Languages,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  Inbox,
  Send,
  Eye,
  CircleDot,
  Globe,
} from "lucide-react";

const TRUST_LABEL: Record<TrustTier, { label: string; copy: string }> = {
  covenant: {
    label: "Covenant",
    copy: "Full sharing — signals, referrals, and roster awareness.",
  },
  partner: {
    label: "Partner",
    copy: "Referrals and practice-area patterns. Roster stays private.",
  },
  network: {
    label: "Network",
    copy: "Generic signals only — patterns and alerts. No referrals.",
  },
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: "Connected",
  "pending-outgoing": "Invite sent",
  "pending-incoming": "Invite received",
  suggested: "Suggested",
  discovered: "Discovered",
};

const LANG_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  ru: "Russian",
  zh: "Chinese",
  vi: "Vietnamese",
  ht: "Haitian Creole",
  hmn: "Hmong",
};

const REGION_LABEL: Record<string, string> = {
  midwest: "Midwest",
  northeast: "Northeast",
  south: "South",
  west: "West",
  canada: "Canada",
};

/* =================================================================== */
/* Directory — /app/communio                                            */
/* =================================================================== */

export function CommunioDirectory() {
  const connected = peerGuilds.filter((g) => g.connection === "connected");
  const pending = peerGuilds.filter(
    (g) => g.connection === "pending-outgoing" || g.connection === "pending-incoming"
  );
  const suggested = peerGuilds.filter((g) => g.connection === "suggested");
  const discovered = peerGuilds.filter((g) => g.connection === "discovered");

  const incomingReferrals = peerReferrals.filter((r) => r.direction === "incoming");
  const recentSignals = peerSignals.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Globe size={14} />
          <span className="collegium-latin text-sm">Communio</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl">The Network of Guilds</h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Peer guilds across the federation — separate organizations who share
          practice patterns, accept cross-region referrals, and trust each
          other to handle client matters with the same care. No client
          information crosses the wire; only what stays safe to share.
        </p>
      </div>

      <div className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <Stat label="Connected peers" value={connected.length} />
          <Stat label="Pending invites" value={pending.length} />
          <Stat label="Incoming referrals" value={incomingReferrals.length} />
          <Stat label="Peer signals (30d)" value={recentSignals} />
        </div>
        <div className="text-xs text-[hsl(var(--c-slate-soft))] mt-4 leading-relaxed flex items-start gap-2">
          <ShieldCheck size={14} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
          <span>
            <strong className="text-[hsl(var(--c-wine))] font-semibold">
              How Communio stays safe.
            </strong>{" "}
            Each guild keeps its own client roster. Names, contact details,
            financial figures, and matter identifiers are stripped at the
            boundary by a shared sanitizer. Conflicts across guilds are
            checked by a one-way hash — never by sharing names.
          </span>
        </div>
      </div>

      {connected.length > 0 && (
        <Section title="Connected" subtitle="Active relationships across the federation">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {connected.map((g) => (
              <PeerCard key={g.id} guild={g} />
            ))}
          </div>
        </Section>
      )}

      {pending.length > 0 && (
        <Section title="Pending" subtitle="Invitations sent or awaiting your response">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {pending.map((g) => (
              <PeerCard key={g.id} guild={g} />
            ))}
          </div>
        </Section>
      )}

      {suggested.length > 0 && (
        <Section
          title="Suggested for connection"
          subtitle="Guilds whose practice complements yours — Communio surfaces these from federation signals"
        >
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {suggested.map((g) => (
              <PeerCard key={g.id} guild={g} />
            ))}
          </div>
        </Section>
      )}

      {discovered.length > 0 && (
        <Section
          title="Discovered"
          subtitle="Guilds visible in the directory but not yet ready to connect"
        >
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5 collegium-safe-bottom">
            {discovered.map((g) => (
              <PeerCard key={g.id} guild={g} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="mb-4">
        <h2 className="collegium-display text-xl sm:text-2xl leading-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-[hsl(var(--c-slate-soft))] mt-0.5">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

function PeerCard({ guild }: { guild: PeerGuild }) {
  const guildSignals = peerSignals.filter((s) => s.peerGuildId === guild.id);
  const latestSignal = guildSignals[0];

  return (
    <Link
      to={`/app/communio/${guild.slug}`}
      className="collegium-card p-5 sm:p-6 hover:shadow-md transition-shadow block group"
    >
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="collegium-display text-lg sm:text-xl leading-tight">
          {guild.name}
        </h3>
        <StatusBadge status={guild.connection} tier={guild.trustTier} />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={11} /> {guild.city}, {guild.state}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} /> {guild.members}
        </span>
        <span>{REGION_LABEL[guild.region]}</span>
        <span>· Founded {guild.foundedYear}</span>
      </div>

      <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3 line-clamp-2">
        {guild.bio}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {guild.focusAreas.slice(0, 3).map((f) => (
          <span key={f} className="collegium-tag-soft">
            {f.replace(/-/g, " ")}
          </span>
        ))}
        {guild.focusAreas.length > 3 && (
          <span className="text-[10px] text-[hsl(var(--c-slate-soft))] self-center">
            +{guild.focusAreas.length - 3} more
          </span>
        )}
      </div>

      {guild.connection === "connected" && latestSignal && (
        <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3">
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
            Latest from {guild.short}
          </div>
          <div className="text-sm text-[hsl(var(--c-ink))] leading-snug line-clamp-2">
            {latestSignal.headline}
          </div>
        </div>
      )}

      {(guild.connection === "suggested" || guild.connection === "discovered") &&
        guild.suggestionReason && (
          <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3 flex items-start gap-2">
            <Sparkles size={12} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
            <div className="text-xs text-[hsl(var(--c-slate))] leading-snug italic">
              {guild.suggestionReason}
            </div>
          </div>
        )}

      {guild.connection.startsWith("pending") && guild.recentActivity && (
        <div className="border-t border-[hsl(var(--c-border))] pt-3 mt-3 text-xs text-[hsl(var(--c-slate-soft))]">
          {guild.recentActivity}
        </div>
      )}
    </Link>
  );
}

function StatusBadge({
  status,
  tier,
}: {
  status: ConnectionStatus;
  tier?: TrustTier;
}) {
  if (status === "connected" && tier) {
    const tierClass =
      tier === "covenant"
        ? "bg-[hsl(var(--c-wine)/0.12)] text-[hsl(var(--c-wine))]"
        : tier === "partner"
        ? "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_30%)]"
        : "bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]";
    return (
      <span
        className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded shrink-0 ${tierClass}`}
      >
        {TRUST_LABEL[tier].label}
      </span>
    );
  }
  if (status.startsWith("pending")) {
    return (
      <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_30%)]">
        {STATUS_LABEL[status]}
      </span>
    );
  }
  if (status === "suggested") {
    return (
      <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_28%)]">
        Suggested
      </span>
    );
  }
  return (
    <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]">
      {STATUS_LABEL[status]}
    </span>
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

/* =================================================================== */
/* Peer Detail — /app/communio/:slug                                    */
/* =================================================================== */

export function CommunioPeer() {
  const { slug } = useParams<{ slug: string }>();
  const guild = peerGuilds.find((g) => g.slug === slug);
  const [showSanitizer, setShowSanitizer] = useState(false);

  if (!guild) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <Link to="/app/communio" className="text-xs collegium-link mb-4 inline-flex items-center gap-1">
          <ChevronLeft size={12} /> All peer guilds
        </Link>
        <p className="text-[hsl(var(--c-slate-soft))]">Peer guild not found.</p>
      </div>
    );
  }

  const signals = peerSignals.filter((s) => s.peerGuildId === guild.id);
  const referrals = peerReferrals.filter((r) => r.peerGuildId === guild.id);
  const incoming = referrals.filter((r) => r.direction === "incoming");
  const outgoing = referrals.filter((r) => r.direction === "outgoing");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <Link to="/app/communio" className="text-xs collegium-link mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={12} /> All peer guilds
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="collegium-tag-soft">{guild.type.replace(/-/g, " ")}</span>
          <StatusBadge status={guild.connection} tier={guild.trustTier} />
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl mb-2 leading-tight">{guild.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[hsl(var(--c-slate-soft))]">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {guild.city}, {guild.state}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {guild.members} members · {guild.advocates} advocates
          </span>
          <span>{guild.chapters} chapter{guild.chapters === 1 ? "" : "s"}</span>
          <span>Founded {guild.foundedYear}</span>
        </div>
        <p className="mt-4 text-[hsl(var(--c-slate))] leading-relaxed max-w-3xl">
          {guild.bio}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {guild.connection === "connected" && (
            <div className="collegium-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2 text-[hsl(var(--c-wine))]">
                <ShieldCheck size={14} />
                <span className="collegium-latin text-xs">Foedus</span>
              </div>
              <h2 className="collegium-display text-xl mb-1">
                {guild.trustTier && TRUST_LABEL[guild.trustTier].label} relationship
              </h2>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                {guild.trustTier && TRUST_LABEL[guild.trustTier].copy}
              </p>
              <div className="text-xs text-[hsl(var(--c-slate-soft))]">
                Connected since {formatMonthYear(guild.connectedSince)} · last
                exchange: {guild.recentActivity?.toLowerCase()}
              </div>
            </div>
          )}

          {signals.length > 0 && (
            <div>
              <h2 className="collegium-display text-xl sm:text-2xl mb-3">
                Recent signals from {guild.short}
              </h2>
              <div className="space-y-3">
                {signals.map((s) => (
                  <article key={s.id} className="collegium-card p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                      <CategoryChip category={s.category} />
                      <span className="text-[hsl(var(--c-slate-soft))]">·</span>
                      <span className="text-[hsl(var(--c-slate-soft))] text-[11px]">
                        {formatDate(s.publishedAt)} · {s.scope.replace(/-/g, " ")}
                      </span>
                      <span className="ml-auto text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                        {TRUST_LABEL[s.shareLevel].label}
                      </span>
                    </div>
                    <h3 className="collegium-display text-base sm:text-lg leading-tight mb-2">
                      {s.headline}
                    </h3>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                      {s.body}
                    </p>
                    {s.signals.length > 0 && (
                      <ul className="text-xs text-[hsl(var(--c-slate-soft))] space-y-1">
                        {s.signals.map((sig, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CircleDot size={10} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
                            {sig}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {referrals.length > 0 && (
            <div>
              <h2 className="collegium-display text-xl sm:text-2xl mb-3">Referrals</h2>
              <div className="space-y-3">
                {incoming.length > 0 && (
                  <ReferralGroup
                    label="Incoming — accepted into your network"
                    icon={<Inbox size={12} />}
                    items={incoming}
                  />
                )}
                {outgoing.length > 0 && (
                  <ReferralGroup
                    label="Outgoing — sent from your network"
                    icon={<Send size={12} />}
                    items={outgoing}
                  />
                )}
              </div>
            </div>
          )}

          {signals.length === 0 && referrals.length === 0 && (
            <div className="collegium-card p-8 text-center">
              <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                No signals or referrals exchanged yet.
              </p>
              {guild.connection === "suggested" && (
                <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-2 max-w-md mx-auto">
                  Send a connection request to start sharing practice patterns
                  and routing referrals.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="collegium-card p-5">
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3">
              Practice
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {guild.focusAreas.map((f) => (
                <span key={f} className="collegium-tag-soft">
                  {f.replace(/-/g, " ")}
                </span>
              ))}
            </div>
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
              Languages
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[hsl(var(--c-slate))]">
              <Languages size={12} className="text-[hsl(var(--c-slate-soft))]" />
              {guild.languages.map((l) => LANG_LABEL[l] ?? l).join(", ")}
            </div>
          </div>

          {guild.connection === "connected" && (
            <div className="collegium-card p-5">
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3">
                Actions
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className="collegium-btn-primary w-full text-sm justify-center"
                  onClick={() => setShowSanitizer(true)}
                >
                  <Send size={12} className="mr-1.5" /> Send a referral
                </button>
                <button
                  type="button"
                  className="collegium-btn-ghost w-full text-sm justify-center"
                  onClick={() => setShowSanitizer((s) => !s)}
                >
                  <Eye size={12} className="mr-1.5" /> Preview what would publish
                </button>
              </div>
            </div>
          )}

          {guild.connection === "suggested" && (
            <div className="collegium-card p-5">
              <button
                type="button"
                className="collegium-btn-primary w-full text-sm justify-center"
              >
                Request connection <ArrowRight size={12} className="ml-1.5" />
              </button>
              <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-2 leading-snug">
                A steward at {guild.short} will review and respond. Start at
                Network tier; trust upgrades after first successful exchange.
              </p>
            </div>
          )}

          {guild.connection.startsWith("pending") && (
            <div className="collegium-card p-5 bg-[hsl(var(--c-cream-warm))]">
              <div className="text-xs text-[hsl(var(--c-slate-soft))] leading-snug">
                {guild.connection === "pending-outgoing"
                  ? `Invite sent. ${guild.short} hasn't responded yet.`
                  : `${guild.short} has invited you. Open the invite to review.`}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSanitizer && guild.connection === "connected" && (
        <SanitizerPreview guildShort={guild.short} onClose={() => setShowSanitizer(false)} />
      )}
    </div>
  );
}

function ReferralGroup({
  label,
  icon,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  items: typeof peerReferrals;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r.id} className="collegium-card p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
              <span className="collegium-tag-soft text-[10px]">
                {r.category.replace(/-/g, " ")}
              </span>
              <UrgencyDot urgency={r.urgency} />
              <span className="text-[hsl(var(--c-slate-soft))]">·</span>
              <span className="text-[hsl(var(--c-slate-soft))]">{r.region}</span>
              <span className="ml-auto">
                <ReferralStatus status={r.status} />
              </span>
            </div>
            <p className="text-sm text-[hsl(var(--c-slate))] leading-snug">
              {r.summary}
            </p>
            <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-2">
              {formatDate(r.createdAt)}
              {r.respondedAt && ` · responded ${formatDate(r.respondedAt)}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SanitizerPreview({
  guildShort,
  onClose,
}: {
  guildShort: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(
    "Maria Velasquez (maria.v@example.com, 312-555-0142) is asking about asylum in Chicago. Her brother is hosting at 4711 N Ashland. Family of four, lost $2,400 to a notario in March."
  );

  const sanitized = useMemo(
    () =>
      buildSharedReferral({
        category: "immigration",
        region: "Chicago, IL",
        languages: ["es"],
        urgency: "soon",
        summary: draft,
        intakeDate: new Date().toISOString(),
      }),
    [draft]
  );

  return (
    <div className="collegium-card p-5 sm:p-6 mb-8 border-2 border-[hsl(var(--c-wine)/0.2)]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
            <Eye size={14} />
            <span className="collegium-latin text-xs">Praevisio</span>
          </div>
          <h3 className="collegium-display text-lg sm:text-xl leading-tight">
            What would publish to {guildShort}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-ink))] shrink-0"
        >
          Close
        </button>
      </div>

      <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-3 leading-relaxed">
        Type a referral note as you would internally. The sanitizer scrubs PII
        at the boundary — only what stays safe to share leaves your tenant.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5">
            Internal draft (stays on your side)
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="w-full text-sm p-3 rounded border border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream-warm))] text-[hsl(var(--c-ink))] resize-y font-mono leading-relaxed"
          />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1.5">
            Published to {guildShort}
          </div>
          <div className="w-full text-sm p-3 rounded border border-[hsl(var(--c-wine)/0.18)] bg-white text-[hsl(var(--c-ink))] min-h-[7.5rem] leading-relaxed">
            {sanitized.ok && sanitized.referral ? (
              <>
                <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-1">
                  {sanitized.referral.category.replace(/-/g, " ")} · {sanitized.referral.region}
                </div>
                <div>{sanitized.referral.summary}</div>
                {sanitized.referral.redactionCount > 0 && (
                  <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-2 italic">
                    {sanitized.referral.redactionCount} item
                    {sanitized.referral.redactionCount === 1 ? "" : "s"} scrubbed
                    by sanitizer
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-[hsl(8_55%_42%)] italic">
                Not safe to publish — {sanitized.reason}.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] leading-relaxed flex items-start gap-1.5">
        <ShieldCheck size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
        <span>
          Scrubs: emails, phone numbers, dollar amounts, two-word proper names,
          and forbidden metadata keys. Truncates to 220 characters. Anything
          past two redactions is rejected outright.
        </span>
      </div>
    </div>
  );
}

function CategoryChip({ category }: { category: string }) {
  const tone: Record<string, string> = {
    pattern: "bg-[hsl(var(--c-wine)/0.10)] text-[hsl(var(--c-wine))]",
    request: "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]",
    celebration: "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]",
    alert: "bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]",
    knowledge: "bg-[hsl(var(--c-slate-soft)/0.18)] text-[hsl(var(--c-slate))]",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
        tone[category] ?? tone.knowledge
      }`}
    >
      {category}
    </span>
  );
}

function ReferralStatus({ status }: { status: string }) {
  const tone: Record<string, string> = {
    open: "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]",
    accepted: "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]",
    declined: "bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]",
    completed: "bg-[hsl(var(--c-wine)/0.10)] text-[hsl(var(--c-wine))]",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
        tone[status] ?? tone.open
      }`}
    >
      {status}
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthYear(iso?: string): string {
  if (!iso) return "—";
  const [y, m] = iso.split("-");
  if (!y || !m) return iso;
  const date = new Date(Number(y), Number(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
