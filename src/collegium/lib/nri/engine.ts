/**
 * Narrative Relational Intelligence — Rule-based briefing engine.
 *
 * Pure function over Collegium's data (chapters, people, mentor pairs,
 * service matters, events) plus optional Communio peer signals. Returns
 * deterministic briefings — same input → same output, including stable
 * IDs so resolved-state persists across reloads.
 *
 * No AI in the engine itself. Each detection rule is a small function
 * returning zero or more briefings; the entry point runs them all and
 * concatenates. Rules are intentionally legible so a steward can reason
 * about why a briefing fired — "I see what NRI saw."
 *
 * Lineage: this is a Collegium-shaped port of the CROS narrativeSignals
 * aggregator. The CROS version reads from Supabase; this one reads from
 * in-memory data so demo, dev, and prod-with-real-data all share one
 * engine.
 */

import type {
  Chapter,
  Person,
  MentorPair,
  EventItem,
  ServiceMatter,
  NRIBriefing,
  PairMeeting,
  PairOutcome,
} from "../../data/demo";
import type { PeerGuild, PeerSignal } from "../../data/communio";

export interface NRIInput {
  chapters: Chapter[];
  people: Person[];
  mentorPairs: MentorPair[];
  events: EventItem[];
  serviceMatters: ServiceMatter[];
  /** Optional — once provided, the engine reasons about scheduling gaps and bar/job milestones. */
  pairMeetings?: PairMeeting[];
  pairOutcomes?: PairOutcome[];
  peerSignals?: PeerSignal[];
  peerGuilds?: PeerGuild[];
  /** Override "now" for deterministic testing. Defaults to system time. */
  now?: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const CADENCE_THRESHOLD_DAYS: Record<MentorPair["cadence"], number> = {
  weekly: 10,
  biweekly: 21,
  monthly: 45,
};

const PRACTICE_TO_LANGUAGE_HINT: Record<string, string[]> = {
  immigration: ["es", "vi", "ht", "fr", "ln", "fa", "ti", "zh"],
  housing: ["es", "ht"],
  family: ["es", "ht", "vi"],
};

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

export function generateBriefings(input: NRIInput): NRIBriefing[] {
  const now = input.now ?? new Date();
  const today = isoDate(now);

  const briefings: NRIBriefing[] = [
    ...mentorPairDriftRule(input, now, today),
    ...mentorPairLongGapRule(input, now, today),
    ...mentorPairThrivingArcRule(input, now, today),
    ...mentorPairUnscheduledRule(input, now, today),
    ...mentorPairOutcomeCelebrationRule(input, now, today),
    ...chapterServiceSurgeRule(input, now, today),
    ...chapterSuccessionRiskRule(input, today),
    ...chapterOfficerOverloadRule(input, today),
    ...chapterFormationServiceImbalanceRule(input, today),
    ...serviceRegionalPressureRule(input, now, today),
    ...serviceLanguageGapRule(input, today),
    ...serviceUrgentAgingRule(input, now, today),
    ...serviceClosureLoopHabitRule(input, today),
    ...communioPeerCrosslinkRule(input, today),
    ...networkPulseRule(input, today),
  ];

  // Sort: concern → attend → celebrate; within tone, mentor-pair / person
  // first (most specific), then chapter, then network.
  const tonePriority: Record<NRIBriefing["tone"], number> = {
    concern: 0,
    attend: 1,
    celebrate: 2,
  };
  const scopePriority: Record<NRIBriefing["scope"], number> = {
    "mentor-pair": 0,
    person: 1,
    chapter: 2,
    network: 3,
  };
  briefings.sort((a, b) => {
    const t = tonePriority[a.tone] - tonePriority[b.tone];
    if (t !== 0) return t;
    return scopePriority[a.scope] - scopePriority[b.scope];
  });

  return briefings;
}

/* ------------------------------------------------------------------ */
/* Rule: Mentor pair drift                                             */
/* ------------------------------------------------------------------ */

function mentorPairDriftRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const pair of input.mentorPairs) {
    if (pair.status !== "drifting") continue;
    const mentee = input.people.find((p) => p.id === pair.menteeId);
    const mentor = input.people.find((p) => p.id === pair.mentorId);
    if (!mentee || !mentor) continue;

    const lastMeetingDate = pair.lastMeeting ? new Date(pair.lastMeeting) : null;
    const daysSince = lastMeetingDate
      ? Math.round((now.getTime() - lastMeetingDate.getTime()) / DAY_MS)
      : null;

    const menteeShort = lastNameOnly(mentee.name);
    const signals: string[] = [`Pair status is currently "drifting"`];
    if (daysSince !== null) {
      signals.push(
        `${daysSince} day${daysSince === 1 ? "" : "s"} since last meeting (${pair.cadence} cadence)`
      );
    }
    if (pair.notes) {
      signals.push(trimSignal(pair.notes));
    }

    out.push({
      id: `nri-mp-drift-${pair.id}`,
      scope: "mentor-pair",
      scopeId: pair.id,
      title: `${mentee.name} may be drifting`,
      body: `${menteeShort}'s mentor pair has been flagged drifting. The relationship has held for ${monthsBetween(pair.startedOn, now)} months — silence now is more likely overload than disengagement, but worth a soft touch from someone other than the mentor.`,
      signals,
      suggestedAction: `Local steward sends a one-line note: "Praying for you. No reply needed." Then revisit in two weeks before escalating.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Mentor pair long gap (cadence-aware)                          */
/* ------------------------------------------------------------------ */

function mentorPairLongGapRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const pair of input.mentorPairs) {
    // Skip drifting pairs — handled by the drift rule with richer context.
    if (pair.status === "drifting" || pair.status === "paused") continue;
    if (!pair.lastMeeting) continue;
    const last = new Date(pair.lastMeeting);
    const days = Math.round((now.getTime() - last.getTime()) / DAY_MS);
    const threshold = CADENCE_THRESHOLD_DAYS[pair.cadence];
    if (days <= threshold) continue;

    const mentee = input.people.find((p) => p.id === pair.menteeId);
    const mentor = input.people.find((p) => p.id === pair.mentorId);
    if (!mentee || !mentor) continue;

    out.push({
      id: `nri-mp-gap-${pair.id}`,
      scope: "mentor-pair",
      scopeId: pair.id,
      title: `${lastNameOnly(mentor.name)} & ${lastNameOnly(mentee.name)} — overdue by ${days - threshold} days`,
      body: `This ${pair.cadence} pair has now been quiet for ${days} days; cadence expects a touch every ${threshold}. Pair status still reads "${pair.status}", so this is likely circumstance, not estrangement.`,
      signals: [
        `${days} days since last meeting`,
        `Cadence: ${pair.cadence} (expects ≤ ${threshold} days)`,
        `Status: ${pair.status}`,
      ],
      suggestedAction: `Send the mentor a one-line nudge — "Worth a check-in?" — and let them lead. Avoid scheduling on their behalf.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Thriving long arc                                             */
/* ------------------------------------------------------------------ */

function mentorPairThrivingArcRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const pair of input.mentorPairs) {
    if (pair.status !== "thriving") continue;
    const monthsActive = monthsBetween(pair.startedOn, now);
    if (monthsActive < 18) continue;
    const mentee = input.people.find((p) => p.id === pair.menteeId);
    const mentor = input.people.find((p) => p.id === pair.mentorId);
    if (!mentee || !mentor) continue;

    out.push({
      id: `nri-mp-thrive-${pair.id}`,
      scope: "mentor-pair",
      scopeId: pair.id,
      title: `${lastNameOnly(mentor.name)} & ${lastNameOnly(mentee.name)} arc is bearing fruit`,
      body: `${monthsActive} months in and still thriving. Long arcs like this are the formation backbone of a guild — they pull the next pair into existence by example. Worth naming aloud at the next gathering.`,
      signals: [
        `${monthsActive} months active and status "thriving"`,
        `Cadence: ${pair.cadence}`,
        pair.notes ? trimSignal(pair.notes) : `Steady cadence, no flags`,
      ],
      suggestedAction: `Invite ${lastNameOnly(mentor.name)} to speak briefly at the next chapter event about what a long mentor arc has taught them. Keep it under five minutes.`,
      generatedOn: today,
      tone: "celebrate",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Mentor pair with no upcoming meeting scheduled                */
/* ------------------------------------------------------------------ */

/**
 * Fires when an active pair has no future meeting on the books AND
 * their last meeting was longer ago than their cadence allows. Distinct
 * from the gap rule: this one is about scheduling hygiene, not just
 * elapsed silence.
 */
function mentorPairUnscheduledRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  if (!input.pairMeetings) return out;
  const nowMs = now.getTime();

  for (const pair of input.mentorPairs) {
    if (pair.status === "paused") continue;
    const pairMeetings = input.pairMeetings.filter((m) => m.pairId === pair.id);
    const upcoming = pairMeetings.filter(
      (m) => m.status === "scheduled" && new Date(m.scheduledFor).getTime() >= nowMs
    );
    if (upcoming.length > 0) continue;

    // No upcoming. Check last completed against cadence threshold.
    const completed = pairMeetings
      .filter((m) => m.status === "completed")
      .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
    const last = completed[0];
    const threshold = CADENCE_THRESHOLD_DAYS[pair.cadence];
    const daysSinceLast = last
      ? Math.round((nowMs - new Date(last.scheduledFor).getTime()) / DAY_MS)
      : Infinity;
    if (daysSinceLast <= threshold) continue;

    const mentor = input.people.find((p) => p.id === pair.mentorId);
    const mentee = input.people.find((p) => p.id === pair.menteeId);
    if (!mentor || !mentee) continue;

    out.push({
      id: `nri-mp-unscheduled-${pair.id}`,
      scope: "mentor-pair",
      scopeId: pair.id,
      title: `${lastNameOnly(mentor.name)} & ${lastNameOnly(mentee.name)} — no next meeting on the books`,
      body: `Their ${pair.cadence} cadence expects a touch every ${threshold} days, and the calendar is empty past today. The pair likely needs nothing more than a one-minute "what does the next two weeks look like?" prompt.`,
      signals: [
        last
          ? `Last meeting ${daysSinceLast} days ago`
          : `No completed meetings on file`,
        `Cadence: ${pair.cadence} (expects ≤ ${threshold} days)`,
        `No future meetings scheduled`,
      ],
      suggestedAction: `Steward or the mentor opens the pair's schedule tab and adds the next meeting. Don't ask permission — propose a date and let them adjust.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Recent outcome milestone (bar passed, first job, etc.)        */
/* ------------------------------------------------------------------ */

const CELEBRATABLE_OUTCOMES = new Set([
  "bar-passed",
  "first-job",
  "judicial-clerkship",
  "publication",
  "moot-court",
  "partnership-offered",
  "still-in-practice-1yr",
  "still-in-practice-5yr",
  "still-in-practice-10yr",
]);

function mentorPairOutcomeCelebrationRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  if (!input.pairOutcomes) return out;
  const nowMs = now.getTime();
  const SIXTY_DAYS = 60 * DAY_MS;

  for (const outcome of input.pairOutcomes) {
    if (!CELEBRATABLE_OUTCOMES.has(outcome.kind)) continue;
    const occurredMs = new Date(outcome.occurredOn).getTime();
    if (nowMs - occurredMs > SIXTY_DAYS) continue;
    if (occurredMs > nowMs + 7 * DAY_MS) continue; // not too-far-future

    const pair = input.mentorPairs.find((p) => p.id === outcome.pairId);
    if (!pair) continue;
    const mentor = input.people.find((p) => p.id === pair.mentorId);
    const mentee = input.people.find((p) => p.id === pair.menteeId);
    if (!mentor || !mentee) continue;

    const kindLabel: Record<string, string> = {
      "bar-passed": "passed the bar",
      "first-job": "landed her first legal job",
      "judicial-clerkship": "started a judicial clerkship",
      publication: "got a piece published",
      "moot-court": "won at moot court",
      "partnership-offered": "was offered partnership",
      "still-in-practice-1yr": "marked one year in practice",
      "still-in-practice-5yr": "marked five years in practice",
      "still-in-practice-10yr": "marked ten years in practice",
    };
    const verb =
      kindLabel[outcome.kind] ?? "hit a milestone in her formation arc";

    out.push({
      id: `nri-mp-outcome-${outcome.id}`,
      scope: "mentor-pair",
      scopeId: pair.id,
      title: `${mentee.name.split(" ")[0]} ${verb}`,
      body: `${outcome.detail} The pair with ${lastNameOnly(mentor.name)} has been part of this arc since ${new Date(pair.startedOn).toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Worth naming aloud, both to honor the mentor's accompaniment and to give the next pair an example.`,
      signals: [
        `Outcome recorded ${outcome.occurredOn}`,
        outcome.recordedBy ? `Recorded by ${outcome.recordedBy}` : `Recorded in the pair's outcomes`,
        `Pair active ${monthsBetween(pair.startedOn, now)} months`,
      ],
      suggestedAction: `Send a short congratulatory note to the mentor (not the mentee) — it was her steadiness that made this possible. Consider naming the outcome at the next chapter gathering.`,
      generatedOn: today,
      tone: "celebrate",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Chapter service surge                                         */
/* ------------------------------------------------------------------ */

function chapterServiceSurgeRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  const cutoff = now.getTime() - 60 * DAY_MS;
  for (const chapter of input.chapters) {
    const recent = input.serviceMatters.filter(
      (m) =>
        m.referringChapterId === chapter.id &&
        new Date(m.intakeDate).getTime() >= cutoff
    );
    if (recent.length < 4) continue;

    const open = recent.filter((m) => m.status !== "closed").length;
    const byCategory = new Map<string, number>();
    for (const m of recent) {
      byCategory.set(m.category, (byCategory.get(m.category) ?? 0) + 1);
    }
    const topCategory = [...byCategory.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];

    const isImbalance = topCategory && topCategory[1] >= 3;
    const tone: NRIBriefing["tone"] =
      chapter.health.service >= 80 ? "celebrate" : "attend";

    out.push({
      id: `nri-ch-surge-${chapter.id}`,
      scope: "chapter",
      scopeId: chapter.id,
      title: `${chapterShort(chapter)}: service energy is unusually high`,
      body: `${recent.length} matters referred in the last 60 days${open ? `, ${open} still open` : ""}. ${
        isImbalance
          ? `Concentration in ${humanCategory(topCategory[0])} — ${topCategory[1]} of the ${recent.length}.`
          : `Distribution is roughly even across practice areas.`
      } ${
        isImbalance && tone === "celebrate"
          ? `One additional ${humanCategory(topCategory[0])}-tagged volunteer would unlock the lane.`
          : `Worth naming aloud at the next steward huddle.`
      }`,
      signals: [
        `${recent.length} referrals in 60 days`,
        `${open} still open`,
        isImbalance
          ? `${topCategory[1]} of those are ${humanCategory(topCategory[0])}`
          : `No single category dominates`,
      ],
      suggestedAction: isImbalance
        ? `Ask the chapter to flag any member with ${humanCategory(topCategory[0])} capacity. One volunteer onboarded relieves the bottleneck.`
        : `Mark the moment publicly — service energy unevenly distributed across a guild is the early signal of a generational shift.`,
      generatedOn: today,
      tone,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Chapter succession risk                                       */
/* ------------------------------------------------------------------ */

function chapterSuccessionRiskRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const chapter of input.chapters) {
    if (chapter.health.succession >= 60) continue;
    const notes = chapter.health.notes.toLowerCase();
    const imminent =
      notes.includes("transition") ||
      notes.includes("term") ||
      notes.includes("successor") ||
      notes.includes("slate");

    out.push({
      id: `nri-ch-succession-${chapter.id}`,
      scope: "chapter",
      scopeId: chapter.id,
      title: `${chapterShort(chapter)}: succession risk${imminent ? " before next transition" : ""}`,
      body: `Succession index sits at ${chapter.health.succession}. ${
        imminent
          ? `Notes suggest an officer transition is imminent and the slate is unclear.`
          : `No imminent transition flagged, but the bench is thinner than the chapter's other indices.`
      } Quiet, early movement now is cheaper than a scramble in two months.`,
      signals: [
        `Succession score: ${chapter.health.succession} (overall ${chapter.health.score})`,
        ...(imminent ? [`Notes flag a transition or unclear slate`] : []),
        `Officers on record: ${chapter.officers.length}`,
      ],
      suggestedAction: `Identify two people who would say yes if asked privately. Don't open it up to the chapter yet. A whispered yes is worth more than a public call.`,
      generatedOn: today,
      tone: "concern",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Officer carrying double load                                  */
/* ------------------------------------------------------------------ */

function chapterOfficerOverloadRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const chapter of input.chapters) {
    const notes = chapter.health.notes.toLowerCase();
    const flaggedInNotes =
      notes.includes("double load") ||
      notes.includes("carrying") ||
      notes.includes("maternity leave");

    // Also detect: a single officer holding multiple roles.
    const officerCounts = new Map<string, number>();
    for (const o of chapter.officers) {
      officerCounts.set(o.name, (officerCounts.get(o.name) ?? 0) + 1);
    }
    const doubleHat = [...officerCounts.entries()].find(([, c]) => c > 1);

    if (!flaggedInNotes && !doubleHat) continue;

    const subject = doubleHat
      ? doubleHat[0]
      : extractOfficerFromNotes(chapter) ?? "An officer";

    out.push({
      id: `nri-ch-overload-${chapter.id}`,
      scope: "chapter",
      scopeId: chapter.id,
      title: `${chapterShort(chapter)}: ${subject} is carrying double load`,
      body: `Chapter notes (or officer roster) flag someone shouldering more than one role's worth of work. The chapter is still functioning, but this is the kind of quiet attrition that ends ministries — not loudly, just by exhaustion.`,
      signals: [
        flaggedInNotes ? `Chapter notes flag overload pattern` : `Multiple roles on one person`,
        `Hospitality index: ${chapter.health.hospitality}`,
        `Overall: ${chapter.health.score}`,
      ],
      suggestedAction: `Don't ask them how they are — they'll say "fine." Identify one task they own and quietly take it. Then tell them after.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Formation strong but service thin                             */
/* ------------------------------------------------------------------ */

function chapterFormationServiceImbalanceRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const chapter of input.chapters) {
    if (chapter.health.formation < 80) continue;
    if (chapter.health.service >= 60) continue;

    out.push({
      id: `nri-ch-formation-vs-service-${chapter.id}`,
      scope: "chapter",
      scopeId: chapter.id,
      title: `${chapterShort(chapter)}: formation strong, service still thin`,
      body: `Formation reads ${chapter.health.formation}, service reads ${chapter.health.service}. That gap usually means the chapter is doing the inner work but hasn't yet found the on-ramp from study to action.`,
      signals: [
        `Formation index: ${chapter.health.formation}`,
        `Service index: ${chapter.health.service}`,
        `Gap of ${chapter.health.formation - chapter.health.service} points`,
      ],
      suggestedAction: `Co-host one clinic with a chapter that runs strong service (e.g. Chicago's Pilsen clinic). Don't lecture about service — let people see it.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Service — regional pressure                                   */
/* ------------------------------------------------------------------ */

function serviceRegionalPressureRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const cutoff = now.getTime() - 30 * DAY_MS;
  const byRegion = new Map<string, ServiceMatter[]>();
  for (const m of input.serviceMatters) {
    if (m.status === "closed") continue;
    if (new Date(m.intakeDate).getTime() < cutoff) continue;
    const arr = byRegion.get(m.region) ?? [];
    arr.push(m);
    byRegion.set(m.region, arr);
  }

  const out: NRIBriefing[] = [];
  for (const [region, matters] of byRegion) {
    if (matters.length < 4) continue;
    const urgent = matters.filter((m) => m.urgency === "urgent").length;
    out.push({
      id: `nri-svc-region-${slugify(region)}`,
      scope: "network",
      scopeId: `region:${region}`,
      title: `Pressure on the ${region} pipeline`,
      body: `${matters.length} open matters in ${region} from the last 30 days${urgent ? `, ${urgent} flagged urgent` : ""}. The local chapter can absorb steady inflow, but spikes need cross-network coverage.`,
      signals: [
        `${matters.length} open matters in ${region} (30d)`,
        urgent ? `${urgent} urgent` : `No urgent flags`,
        `Categories: ${[...new Set(matters.map((m) => humanCategory(m.category)))].slice(0, 3).join(", ")}`,
      ],
      suggestedAction: `Offer cross-chapter coverage — Communio can route one or two matters to peer guilds with capacity in this region.`,
      generatedOn: today,
      tone: urgent > 0 ? "concern" : "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Service — language coverage gap                               */
/* ------------------------------------------------------------------ */

function serviceLanguageGapRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  const open = input.serviceMatters.filter((m) => m.status !== "closed");
  const byLang = new Map<string, ServiceMatter[]>();
  for (const m of open) {
    if (!m.languages) continue;
    for (const l of m.languages) {
      if (l === "en") continue;
      const arr = byLang.get(l) ?? [];
      arr.push(m);
      byLang.set(l, arr);
    }
  }

  for (const [lang, matters] of byLang) {
    if (matters.length < 2) continue;
    out.push({
      id: `nri-svc-lang-${lang}`,
      scope: "network",
      scopeId: `lang:${lang}`,
      title: `${LANG_NAME[lang] ?? lang}-language coverage needed`,
      body: `${matters.length} open matters list ${LANG_NAME[lang] ?? lang} as a primary language. Coverage at the intake counter is the difference between someone being served and someone being deferred.`,
      signals: [
        `${matters.length} open matters with ${LANG_NAME[lang] ?? lang}`,
        `Regions: ${[...new Set(matters.map((m) => m.region))].join(", ")}`,
        `Categories: ${[...new Set(matters.map((m) => humanCategory(m.category)))].slice(0, 3).join(", ")}`,
      ],
      suggestedAction: `Survey chapter rosters for ${LANG_NAME[lang] ?? lang} fluency — even a one-shift interpreter changes the dynamic. Communio can also surface peers with this capacity.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Service — urgent matter aging                                 */
/* ------------------------------------------------------------------ */

function serviceUrgentAgingRule(
  input: NRIInput,
  now: Date,
  today: string
): NRIBriefing[] {
  const out: NRIBriefing[] = [];
  for (const m of input.serviceMatters) {
    if (m.urgency !== "urgent") continue;
    if (m.status === "closed" || m.status === "assigned") continue;
    const ageDays = Math.round(
      (now.getTime() - new Date(m.intakeDate).getTime()) / DAY_MS
    );
    if (ageDays < 4) continue;

    out.push({
      id: `nri-svc-urgent-${m.id}`,
      scope: "network",
      scopeId: m.id,
      title: `Urgent matter aging: ${humanCategory(m.category)} in ${m.region}`,
      body: `An urgent-flagged matter has been sitting ${ageDays} days without assignment. Urgency calls for hours, not days — the client's window may already be narrowing.`,
      signals: [
        `Intake ${formatRelative(m.intakeDate, now)}`,
        `Status: ${m.status}`,
        `${ageDays} days since intake`,
      ],
      suggestedAction: `Route now — even an interim conflict-cleared advocate is better than another day of silence. Communio can broaden the search if the local bench is full.`,
      generatedOn: today,
      tone: "concern",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Closure-loop habit celebration                                */
/* ------------------------------------------------------------------ */

function serviceClosureLoopHabitRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  const closed = input.serviceMatters.filter((m) => m.status === "closed");
  if (closed.length === 0) return [];
  const consented = closed.filter((m) => m.closureLoopConsent === true).length;
  const allMatters = input.serviceMatters;
  const allConsented = allMatters.filter(
    (m) => m.closureLoopConsent === true
  ).length;
  const consentRate = allConsented / allMatters.length;

  if (consentRate < 0.6) return [];

  return [
    {
      id: `nri-svc-closure-loop`,
      scope: "network",
      scopeId: "closure-loop",
      title: `Closure-loop habit is sticking`,
      body: `${Math.round(consentRate * 100)}% of matters carry closure-loop consent. That's not a process win — it's a trust win. Clients are saying yes to keeping their referring parish in the loop.`,
      signals: [
        `${consented} closed matters with closure-loop`,
        `${allConsented} of ${allMatters.length} total carry consent`,
        `Consent rate: ${Math.round(consentRate * 100)}%`,
      ],
      suggestedAction: `Name this aloud at the next steward huddle. The closure-loop is what makes referring parishes feel seen — and what brings the next referral.`,
      generatedOn: today,
      tone: "celebrate",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Rule: Communio peer cross-link                                      */
/* ------------------------------------------------------------------ */

function communioPeerCrosslinkRule(
  input: NRIInput,
  today: string
): NRIBriefing[] {
  if (!input.peerSignals || !input.peerGuilds) return [];
  const out: NRIBriefing[] = [];
  const seenPeers = new Set<string>();

  // Only crosslink on signals that actually warrant attention from a peer —
  // patterns (this is happening, you should know) and alerts (warn-outs).
  // Skip requests (asking for help), celebrations (sharing wins), and
  // knowledge drops (FYI memos) — those don't need a steward's eye on them.
  const eligible = (input.peerSignals ?? []).filter(
    (s) => s.category === "pattern" || s.category === "alert"
  );
  // Newest first so when we cap to one-per-peer, we keep the fresh signal.
  eligible.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  for (const signal of eligible) {
    if (seenPeers.has(signal.peerGuildId)) continue;
    const peer = input.peerGuilds.find((g) => g.id === signal.peerGuildId);
    if (!peer || peer.connection !== "connected") continue;

    const headline = signal.headline.toLowerCase();
    const body = signal.body.toLowerCase();
    const text = `${headline} ${body}`;

    const relevantCategory = [
      "immigration",
      "housing",
      "expungement",
      "parish-governance",
      "family",
      "religious-liberty",
    ].find((cat) => text.includes(cat) || text.includes(cat.replace("-", " ")));
    if (!relevantCategory) continue;

    // Local chapter with the MOST matters in that category — strongest match,
    // not just the first one alphabetically.
    const ranked = input.chapters
      .map((ch) => {
        const count = input.serviceMatters.filter(
          (m) =>
            m.referringChapterId === ch.id && m.category === relevantCategory
        ).length;
        return { ch, count };
      })
      .filter((x) => x.count >= 1)
      .sort((a, b) => b.count - a.count);
    if (ranked.length === 0) continue;
    const localChapter = ranked[0].ch;

    seenPeers.add(signal.peerGuildId);
    out.push({
      id: `nri-communio-${signal.id}`,
      scope: "chapter",
      scopeId: localChapter.id,
      title: `${peer.short} flagged ${humanCategory(relevantCategory)} — your ${chapterShort(localChapter)} should know`,
      body: `A connected peer guild just published: "${signal.headline}". Your chapter is actively working ${humanCategory(relevantCategory)} matters; this is worth a five-minute look.`,
      signals: [
        `Peer signal from ${peer.short}`,
        `Category match: ${humanCategory(relevantCategory)}`,
        `Trust tier: ${signal.shareLevel}`,
      ],
      suggestedAction: `Open ${peer.short}'s signal in Communio and consider whether it warrants a steward-to-steward note back. The reciprocity is the network.`,
      generatedOn: today,
      tone: "attend",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rule: Network quarterly pulse                                        */
/* ------------------------------------------------------------------ */

function networkPulseRule(input: NRIInput, today: string): NRIBriefing[] {
  const chapterCount = input.chapters.length;
  const memberCount = input.chapters.reduce((s, c) => s + c.membersCount, 0);
  const thrivingPairs = input.mentorPairs.filter(
    (p) => p.status === "thriving"
  ).length;
  const totalPairs = input.mentorPairs.length;
  const closedMatters = input.serviceMatters.filter(
    (m) => m.status === "closed"
  ).length;
  const openMatters = input.serviceMatters.filter(
    (m) => m.status !== "closed"
  ).length;
  const quarter = quarterLabel(today);

  return [
    {
      id: `nri-network-pulse-${quarter.replace(" ", "-").toLowerCase()}`,
      scope: "network",
      scopeId: "network",
      title: `Network pulse — ${quarter}`,
      body: `${chapterCount} chapters, ${memberCount} members on record. ${thrivingPairs} of ${totalPairs} mentor pairs are reading "thriving"; ${closedMatters} matters resolved, ${openMatters} still in flight. The numbers don't tell the story — but they tell the steward where to look.`,
      signals: [
        `${chapterCount} chapters · ${memberCount} members`,
        `${thrivingPairs}/${totalPairs} pairs thriving`,
        `${closedMatters} matters closed, ${openMatters} open`,
      ],
      suggestedAction: `Share the pulse with the chapter presidents on the next call. Keep it under three lines — the goal is awareness, not measurement.`,
      generatedOn: today,
      tone: "celebrate",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function chapterShort(c: Chapter): string {
  if (c.name.includes("Chicago")) return "Chicago";
  if (c.name.includes("Boston")) return "Boston";
  if (c.name.includes("Toronto")) return "Toronto";
  if (c.name.includes("Arlington")) return "Arlington";
  if (c.name.includes("John Paul II") || c.name.includes("Saint John Paul")) return "JP II Guild";
  return c.city;
}

function lastNameOnly(name: string): string {
  // Strip honorifics + post-nominals, take the last "word."
  const cleaned = name.replace(/,.*$/, "").trim();
  const parts = cleaned.split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function trimSignal(s: string): string {
  if (s.length <= 110) return s;
  return s.slice(0, 107).trimEnd() + "...";
}

function monthsBetween(startIso: string, end: Date): number {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return 0;
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function humanCategory(category: string): string {
  return category.replace(/-/g, " ");
}

function formatRelative(iso: string, now: Date): string {
  const d = new Date(iso);
  const days = Math.round((now.getTime() - d.getTime()) / DAY_MS);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function quarterLabel(today: string): string {
  const d = new Date(today);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

function extractOfficerFromNotes(chapter: Chapter): string | null {
  const notes = chapter.health.notes;
  // Looks for "Vice Chair" or "Chair" mentions paired with overload language.
  if (notes.match(/Vice Chair is carrying/i)) {
    const vc = chapter.officers.find((o) => /vice/i.test(o.role));
    return vc?.name ?? "The Vice Chair";
  }
  if (notes.match(/maternity/i)) {
    const chair = chapter.officers.find((o) => /chair/i.test(o.role));
    return chair?.name ?? "The chair";
  }
  return null;
}
