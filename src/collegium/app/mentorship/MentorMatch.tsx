import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Sparkles,
  Users,
  MapPin,
  Languages,
  GraduationCap,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  people,
  mentorPairs,
  chapters,
  type Person,
  type VocationStage,
} from "../../data/demo";
import { demoStore, useMentorshipRequests, useDemoState } from "../../lib/demoStore";

/**
 * Mentor-match — closes the gap between "we'll find you a mentor" and a
 * rule-based scoring engine. The user picks the side of the pairing they
 * occupy and their preferences; we score every eligible candidate on
 * the other side and surface the top matches with the reasons that
 * earned them points.
 *
 * Scoring is intentionally legible — the steward should read the row
 * and see why this match was suggested.
 */

const MENTOR_STAGES: VocationStage[] = [
  "lawyer",
  "young-lawyer",
  "canon-lawyer",
  "judge",
  "professor",
  "clergy",
  "retired",
];
const MENTEE_STAGES: VocationStage[] = ["student", "young-lawyer"];

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
  "natural-law",
  "criminal",
  "constitutional",
  "corporate",
  "administrative",
  "refugee",
  "international-human-rights",
];

type MatchSide = "seeking-mentor" | "seeking-mentee";

type Match = {
  person: Person;
  score: number;
  reasons: string[];
};

/**
 * Visitor "from" person for outgoing requests. In a real deployment
 * this is the authenticated user; in the demo we tie it to the steward
 * identity (Margaret Coyle = p-coyle by default), which is consistent
 * with the existing demoStore.identityName seed.
 */
function visitorPersonId(identityName: string): string {
  const match = people.find((p) => p.name === identityName);
  return match?.id ?? "p-coyle";
}

export function MentorMatch() {
  const [side, setSide] = useState<MatchSide>("seeking-mentor");
  const [chapterId, setChapterId] = useState<string>("");
  const [practice, setPractice] = useState<string>("");
  const [sameChapterOnly, setSameChapterOnly] = useState(false);
  const [message, setMessage] = useState<string>("");
  const allRequests = useMentorshipRequests();
  const demoState = useDemoState();
  const visitorId = visitorPersonId(demoState.identityName);

  // Which candidate ids the visitor already has a pending request with
  // (either direction). Drives the "Requested" pill on a match row.
  const pendingFor = useMemo(() => {
    const out = new Set<string>();
    for (const r of allRequests) {
      if (r.status !== "pending") continue;
      if (r.fromPersonId === visitorId) out.add(r.toPersonId);
      if (r.toPersonId === visitorId) out.add(r.fromPersonId);
    }
    return out;
  }, [allRequests, visitorId]);

  // People already in a pair on the mentor side — when seeking-mentor we
  // de-rank (don't exclude) people already mentoring; mentors can hold
  // multiple mentees.
  const existingMentorIds = useMemo(
    () => new Set(mentorPairs.map((p) => p.mentorId)),
    []
  );
  const existingMenteeIds = useMemo(
    () => new Set(mentorPairs.map((p) => p.menteeId)),
    []
  );

  const matches = useMemo<Match[]>(() => {
    const eligibleStages = side === "seeking-mentor" ? MENTOR_STAGES : MENTEE_STAGES;
    const out: Match[] = [];

    for (const p of people) {
      if (!eligibleStages.includes(p.stage)) continue;
      if (sameChapterOnly && chapterId && p.chapterId !== chapterId) continue;

      let score = 0;
      const reasons: string[] = [];

      // Practice overlap (heavy weight)
      if (practice) {
        if (p.practice.includes(practice)) {
          score += 50;
          reasons.push(`Practices ${practice.replace(/-/g, " ")}`);
        } else {
          // adjacent practice areas get half credit
          if (isAdjacentPractice(practice, p.practice)) {
            score += 18;
            reasons.push(
              `Adjacent: ${p.practice.find((x) => isAdjacentPractice(practice, [x]))?.replace(/-/g, " ")}`
            );
          }
        }
      }

      // Same chapter — strong signal even if not enforced
      if (chapterId && p.chapterId === chapterId) {
        score += 25;
        reasons.push("Same chapter");
      } else if (chapterId) {
        const ch = chapters.find((c) => c.id === chapterId);
        const them = chapters.find((c) => c.id === p.chapterId);
        if (ch && them && sameMetro(ch.city, them.city)) {
          score += 12;
          reasons.push(`Nearby (${them.city})`);
        }
      }

      // Existing load on mentor side
      if (side === "seeking-mentor" && existingMentorIds.has(p.id)) {
        const load = mentorPairs.filter(
          (mp) => mp.mentorId === p.id && mp.status !== "paused"
        ).length;
        if (load >= 2) {
          score -= 15;
          reasons.push(`Already mentoring ${load}`);
        } else {
          reasons.push(`Mentoring ${load}`);
        }
      }

      // Already-in-a-pair on mentee side excludes
      if (side === "seeking-mentee" && existingMenteeIds.has(p.id)) {
        continue;
      }

      // Stage credibility for mentors — credibility multiplier
      if (side === "seeking-mentor") {
        if (p.stage === "lawyer" || p.stage === "judge" || p.stage === "professor") {
          score += 10;
        } else if (p.stage === "young-lawyer") {
          score += 5;
          reasons.push("Young-lawyer mentor (peer-near)");
        } else if (p.stage === "retired") {
          score += 8;
          reasons.push("Retired — deep bandwidth");
        }
      }

      // Floor — only surface people with at least one signal
      if (score <= 0 && reasons.length === 0) continue;

      out.push({ person: p, score, reasons });
    }

    return out.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [side, chapterId, practice, sameChapterOnly, existingMentorIds, existingMenteeIds]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-4xl mx-auto">
      <Link
        to="/app/mentorship"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Mentorship
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Sparkles size={14} />
          <span className="collegium-latin text-sm">Concordia</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Mentor match
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          Tell us what you're looking for. We score candidates on practice
          overlap, same-chapter membership, stage credibility, and current
          mentoring load — and show you the reasons each candidate scored.
        </p>
      </div>

      <div className="collegium-card p-4 sm:p-5 mb-5 bg-[hsl(var(--c-cream-warm))]">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-2">
          I am looking for
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <SideButton
            active={side === "seeking-mentor"}
            onClick={() => setSide("seeking-mentor")}
            label="A mentor"
            sub="I'm a student or young lawyer"
          />
          <SideButton
            active={side === "seeking-mentee"}
            onClick={() => setSide("seeking-mentee")}
            label="A mentee"
            sub="I want to accompany someone"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <FieldSelect
            icon={<MapPin size={11} />}
            label="My chapter"
            value={chapterId}
            onChange={setChapterId}
            options={chapters.map((c) => ({
              value: c.id,
              label: c.name.split("—")[0].trim(),
            }))}
          />
          <FieldSelect
            icon={<GraduationCap size={11} />}
            label="Practice area"
            value={practice}
            onChange={setPractice}
            options={PRACTICE_AREAS.map((p) => ({
              value: p,
              label: p.replace(/-/g, " "),
            }))}
          />
        </div>
        <label className="text-xs text-[hsl(var(--c-slate))] inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sameChapterOnly}
            disabled={!chapterId}
            onChange={(e) => setSameChapterOnly(e.target.checked)}
            className="cursor-pointer"
          />
          Limit to my chapter only
        </label>
      </div>

      <div className="text-xs text-[hsl(var(--c-slate-soft))] mb-3">
        {matches.length} candidate{matches.length === 1 ? "" : "s"} ranked by
        match score
      </div>

      <div className="space-y-2.5 collegium-safe-bottom">
        {matches.map((m) => (
          <MatchRow
            key={m.person.id}
            match={m}
            side={side}
            isPending={pendingFor.has(m.person.id)}
            onRequest={() => {
              const note = message.trim() ||
                (side === "seeking-mentor"
                  ? "I'd love to be in your orbit if you have bandwidth."
                  : "I'd be glad to accompany you for a season — say monthly.");
              demoStore.createMentorshipRequest({
                fromPersonId: visitorId,
                toPersonId: m.person.id,
                direction:
                  side === "seeking-mentor"
                    ? "mentee-to-mentor"
                    : "mentor-to-mentee",
                message: note,
                proposedCadence: "monthly",
                proposedFocus: practice || undefined,
              });
            }}
          />
        ))}
        {matches.length === 0 && (
          <div className="collegium-card p-8 text-center">
            <Languages
              size={22}
              className="mx-auto mb-2 text-[hsl(var(--c-slate-soft))]"
            />
            <p className="text-sm text-[hsl(var(--c-slate-soft))]">
              No candidates score above zero with these preferences. Try
              widening the chapter or practice filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchRow({
  match,
  side,
  isPending,
  onRequest,
}: {
  match: Match;
  side: MatchSide;
  isPending: boolean;
  onRequest: () => void;
}) {
  const { person, score, reasons } = match;
  const chapter = chapters.find((c) => c.id === person.chapterId);
  return (
    <article className="collegium-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] flex items-center justify-center text-sm font-semibold shrink-0">
          {person.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
            <h3 className="collegium-display text-lg leading-tight">
              {person.name}
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--c-wine))]">
              Score {score}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--c-slate-soft))] mb-2">
            <span className="capitalize">
              {person.stage.replace(/-/g, " ")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> {person.city}
            </span>
            {chapter && <span>· {chapter.name.split("—")[0].trim()}</span>}
          </div>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-snug line-clamp-2 mb-2">
            {person.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {reasons.map((r, i) => (
              <span key={i} className="collegium-tag-soft text-[10px]">
                {r}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 self-center">
          {isPending ? (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(145_40%_28%)] inline-flex items-center gap-1">
              <Check size={11} /> Sent
            </span>
          ) : (
            <button
              type="button"
              onClick={onRequest}
              className="collegium-btn-primary text-xs inline-flex items-center gap-1"
            >
              <Users size={11} />{" "}
              {side === "seeking-mentor" ? "Request" : "Invite"}{" "}
              <ArrowRight size={11} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function SideButton({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-3 py-2 rounded border transition-colors ${
        active
          ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
          : "bg-white border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine)/0.4)]"
      }`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div
        className={`text-[10px] ${
          active
            ? "text-[hsl(var(--c-cream))]"
            : "text-[hsl(var(--c-slate-soft))]"
        }`}
      >
        {sub}
      </div>
    </button>
  );
}

function FieldSelect({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1 inline-flex items-center gap-1">
        {icon} {label}
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

const ADJACENT: Record<string, string[]> = {
  immigration: ["refugee", "international-human-rights", "family"],
  family: ["tribunal", "immigration", "canon-law"],
  housing: ["public-benefits", "expungement"],
  "canon-law": ["tribunal", "parish-governance", "religious-liberty"],
  "parish-governance": ["canon-law", "religious-liberty"],
  "religious-liberty": ["constitutional", "canon-law"],
  appellate: ["litigation"],
  litigation: ["appellate", "criminal"],
  criminal: ["indigent-defense", "litigation"],
  "indigent-defense": ["criminal", "public-benefits"],
  "estate-planning": ["family"],
  refugee: ["immigration", "international-human-rights"],
  administrative: ["public-benefits"],
  "natural-law": ["constitutional", "jurisprudence"],
};

function isAdjacentPractice(target: string, candidate: string[]): boolean {
  const adj = ADJACENT[target] ?? [];
  return candidate.some((c) => adj.includes(c));
}

function sameMetro(a: string, b: string): boolean {
  // Match on city — both are "City, ST" formatted
  const aCity = a.split(",")[0].trim();
  const bCity = b.split(",")[0].trim();
  return aCity === bCity;
}
