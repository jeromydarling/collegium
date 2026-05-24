/**
 * Lightweight in-memory state for the Collegium demo.
 *
 * GitHub Pages is static; there is no backend. The demo lives entirely in
 * the browser. A subset of state persists to localStorage so the visitor
 * sees continuity across reloads (their role, completed actions, etc.).
 */

import { useEffect, useMemo, useState } from "react";
import {
  events as seedEvents,
  pairMeetings as seedPairMeetings,
  pairOutcomes as seedPairOutcomes,
  mentorPairs as seedMentorPairs,
  mentorshipRequests as seedMentorshipRequests,
  integrationConnections as seedIntegrationConnections,
  type EventItem,
  type PairMeeting,
  type PairOutcome,
  type MentorPair,
  type MentorshipRequest,
  type IntegrationConnection,
  type OutcomeVerification,
  type ActionItem,
} from "../data/demo";

const STORAGE_KEY = "collegium_demo_state_v1";

export type DemoRole = "national-steward" | "local-steward" | "mentor" | "member" | "student";

export type MatterLifecycleState =
  | "intake-scheduled"
  | "intake-complete"
  | "active"
  | "filing-pending"
  | "client-response-pending"
  | "closed";

export type MatterMessage = {
  id: string;
  matterId: string;
  /** Who authored the message in the demo simulation. */
  from: "lawyer" | "client" | "steward" | "system";
  /** ISO timestamp. */
  sentAt: string;
  body: string;
  /** Channel hint — affects how the message renders. */
  channel?: "platform" | "sms" | "email" | "in-person";
};

export type MatterDocument = {
  id: string;
  matterId: string;
  filename: string;
  /** Kind hint — e.g. "Engagement letter", "Draft answer". */
  kind: string;
  /** Size in KB; placeholder for real uploads. */
  sizeKb?: number;
  uploadedAt: string;
  uploadedBy: "lawyer" | "client" | "steward";
};

export type ClosureSummary = {
  matterId: string;
  summary: string;
  consentVerified: boolean;
  sentToReferrer: boolean;
  signedAt: string;
};

/** Conflict-check snapshot — recorded against a draft before publication. */
export type ConflictCheckSnapshot = {
  /** ISO timestamp of when the check ran. */
  checkedAt: string;
  /** Steward who ran the check. */
  checkedBy: string;
  /** True when the check returned no hits OR when a steward justified-override. */
  cleared: boolean;
  /** Number of party-name hashes checked. */
  hashesChecked: number;
  /** Hash-only summary of any hits found (never plaintext). */
  hits: {
    hash: string;
    priorMatterId: string;
    priorRole: string;
    newRole: string;
    severity: "direct-adverse" | "name-collision-likely" | "review";
  }[];
  /** If the steward overrode hits, the justification. */
  override?: {
    justification: string;
    by: string;
    at: string;
  };
};

/** Drafts of matters submitted from Auxilium awaiting steward review. */
export type MatterDraft = {
  id: string;
  /** First name only — never last name. */
  requesterFirstName: string;
  category: string;
  region: string;
  languages: string[];
  /** Plain-English summary the client provided. */
  summary: string;
  /** Optional personal-appeal text. */
  appealText?: string;
  /** Optional appeal consent flags. */
  appealConsents?: {
    showToAdvocates: boolean;
    shareCommunio: boolean;
    publicAdvocacy: boolean;
  };
  /** Opposing party named during steward triage (optional). */
  opposingParty?: string;
  /** Where this came from. */
  source: "auxilium" | "voice-intake" | "intake-assist" | "manual";
  /** ISO timestamp of submission. */
  submittedAt: string;
  /** Current state in the steward triage flow. */
  status: "new" | "in-review" | "published" | "declined";
  /** When published, the resulting ServiceMatter id. */
  publishedMatterId?: string;
  /** Conflict-check state. Publication blocked until cleared=true. */
  conflictCheck?: ConflictCheckSnapshot;
};

export type DemoState = {
  role: DemoRole;
  identityName: string;
  resolvedBriefings: string[]; // NRI briefing IDs the user has dismissed/completed
  savedExcerpts: string[]; // library excerpt IDs
  enrolledTracks: string[]; // formation track IDs
  rsvps: string[]; // event IDs
  acceptedCases: string[]; // Patrocinium matter IDs accepted by the visitor
  savedCases: string[]; // Patrocinium matter IDs saved for later
  loggedHours: { matterId: string; hours: number; date: string; note?: string }[];
  /** Per-matter lifecycle state for cases the visitor has accepted. */
  matterLifecycle: Record<string, MatterLifecycleState>;
  /** Conversation log per matter. */
  matterMessages: MatterMessage[];
  /** Document references per matter. */
  matterDocuments: MatterDocument[];
  /** Closure summaries per matter. */
  closureSummaries: Record<string, ClosureSummary>;
  /** Drafts submitted from Auxilium awaiting steward triage. */
  matterDrafts: MatterDraft[];
  /**
   * Append-only audit log of every conflict check ever run on this device.
   * In production this lives on the server with RLS by tenant; the
   * platform NEVER deletes from this log.
   */
  conflictAuditLog: ConflictCheckSnapshot[];
  /** Per-event attendance overrides (additions on top of the seed data). */
  eventAttendance: Record<string, string[]>; // eventId → personIds present
  /** Per-pair journal entries (mentor-pair reflection prompts saved). */
  mentorJournal: MentorJournalEntry[];
  /** Per-track week-completion progress for the visitor. */
  trackProgress: Record<string, number[]>; // trackId → completed week numbers
  /** Per-matter follow-up state (snoozed-until + last-nudge). */
  followUpState: Record<string, { snoozeUntil?: string; lastNudge?: string }>;
  /** Fully user-created events (not in the seed). */
  customEvents: EventItem[];
  /** Patches applied to seed events — partial overlay merged at read time. */
  eventOverrides: Record<string, Partial<EventItem>>;
  /** Seed event ids the steward has deleted — filtered out at read time. */
  deletedEventIds: string[];
  /** Per-pair meeting overrides — patches and additions on top of seed. */
  pairMeetingsAdded: PairMeeting[];
  pairMeetingPatches: Record<string, Partial<PairMeeting>>;
  /** Per-pair outcomes the user has added on top of seed. */
  pairOutcomesAdded: PairOutcome[];
  /** Per-pair video link overrides (lets the visitor change a pair's standing room). */
  pairVideoLinkOverrides: Record<string, string>;
  /** Verifications recorded against seed outcomes (overlay on the seed). */
  outcomeVerifications: Record<string, OutcomeVerification>;
  /** Action-item status patches — overlay on summary action items. */
  actionItemPatches: Record<string, Partial<ActionItem>>;
  /** Mentorship requests added by the visitor (the MentorMatch handshake). */
  mentorshipRequestsAdded: MentorshipRequest[];
  /** Per-request status patches (accept / decline / withdraw on seed or added). */
  mentorshipRequestPatches: Record<string, Partial<MentorshipRequest>>;
  /** Integration connection overrides — added or toggled connections per pair. */
  integrationConnectionsAdded: IntegrationConnection[];
  integrationConnectionPatches: Record<string, Partial<IntegrationConnection>>;
};

export type MentorJournalEntry = {
  id: string;
  pairId: string;
  /** ISO timestamp the entry was logged. */
  at: string;
  /** Which library-excerpt or prompt this came from. */
  source: { kind: "excerpt" | "prompt" | "note"; id?: string };
  body: string;
};

const defaultState: DemoState = {
  role: "local-steward",
  identityName: "Margaret Coyle",
  resolvedBriefings: [],
  savedExcerpts: [],
  enrolledTracks: [],
  rsvps: [],
  acceptedCases: [],
  savedCases: [],
  loggedHours: [],
  matterLifecycle: {},
  matterMessages: [],
  matterDocuments: [],
  closureSummaries: {},
  matterDrafts: [],
  conflictAuditLog: [],
  eventAttendance: {},
  mentorJournal: [],
  trackProgress: {},
  followUpState: {},
  customEvents: [],
  eventOverrides: {},
  deletedEventIds: [],
  pairMeetingsAdded: [],
  pairMeetingPatches: {},
  pairOutcomesAdded: [],
  pairVideoLinkOverrides: {},
  outcomeVerifications: {},
  actionItemPatches: {},
  mentorshipRequestsAdded: [],
  mentorshipRequestPatches: {},
  integrationConnectionsAdded: [],
  integrationConnectionPatches: {},
};

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

function save(state: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

type Listener = (state: DemoState) => void;
let currentState: DemoState = load();
const listeners = new Set<Listener>();

function setState(updater: (prev: DemoState) => DemoState) {
  currentState = updater(currentState);
  save(currentState);
  listeners.forEach((l) => l(currentState));
}

export const demoStore = {
  getState: () => currentState,
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setRole: (role: DemoRole, identityName: string) =>
    setState((s) => ({ ...s, role, identityName })),
  resolveBriefing: (id: string) =>
    setState((s) =>
      s.resolvedBriefings.includes(id)
        ? s
        : { ...s, resolvedBriefings: [...s.resolvedBriefings, id] }
    ),
  toggleSavedExcerpt: (id: string) =>
    setState((s) => ({
      ...s,
      savedExcerpts: s.savedExcerpts.includes(id)
        ? s.savedExcerpts.filter((x) => x !== id)
        : [...s.savedExcerpts, id],
    })),
  enrollTrack: (id: string) =>
    setState((s) =>
      s.enrolledTracks.includes(id)
        ? s
        : { ...s, enrolledTracks: [...s.enrolledTracks, id] }
    ),
  toggleRsvp: (id: string) =>
    setState((s) => ({
      ...s,
      rsvps: s.rsvps.includes(id) ? s.rsvps.filter((x) => x !== id) : [...s.rsvps, id],
    })),
  acceptCase: (id: string) =>
    setState((s) =>
      s.acceptedCases.includes(id)
        ? s
        : {
            ...s,
            acceptedCases: [...s.acceptedCases, id],
            // accepting clears the saved-for-later mark, if present
            savedCases: s.savedCases.filter((x) => x !== id),
            // accepting moves the matter into "intake-scheduled"
            matterLifecycle: {
              ...s.matterLifecycle,
              [id]: "intake-scheduled",
            },
            // accepting drops a system event into the message log
            matterMessages: [
              ...s.matterMessages,
              {
                id: `mm-accept-${id}-${Date.now()}`,
                matterId: id,
                from: "system",
                sentAt: new Date().toISOString(),
                body: "Matter accepted. Lawyer has 48 hours to send an engagement letter.",
                channel: "platform",
              },
            ],
          }
    ),
  setMatterState: (id: string, state: MatterLifecycleState) =>
    setState((s) => ({
      ...s,
      matterLifecycle: { ...s.matterLifecycle, [id]: state },
      matterMessages: [
        ...s.matterMessages,
        {
          id: `mm-state-${id}-${Date.now()}`,
          matterId: id,
          from: "system",
          sentAt: new Date().toISOString(),
          body: `Status changed to "${state.replace(/-/g, " ")}".`,
          channel: "platform",
        },
      ],
    })),
  postMessage: (msg: Omit<MatterMessage, "id" | "sentAt">) =>
    setState((s) => ({
      ...s,
      matterMessages: [
        ...s.matterMessages,
        {
          ...msg,
          id: `mm-${msg.matterId}-${Date.now()}`,
          sentAt: new Date().toISOString(),
        },
      ],
    })),
  addDocument: (doc: Omit<MatterDocument, "id" | "uploadedAt">) =>
    setState((s) => ({
      ...s,
      matterDocuments: [
        ...s.matterDocuments,
        {
          ...doc,
          id: `md-${doc.matterId}-${Date.now()}`,
          uploadedAt: new Date().toISOString(),
        },
      ],
    })),
  removeDocument: (docId: string) =>
    setState((s) => ({
      ...s,
      matterDocuments: s.matterDocuments.filter((d) => d.id !== docId),
    })),
  saveClosureSummary: (cs: ClosureSummary) =>
    setState((s) => ({
      ...s,
      closureSummaries: { ...s.closureSummaries, [cs.matterId]: cs },
      matterLifecycle: { ...s.matterLifecycle, [cs.matterId]: "closed" },
    })),
  submitMatterDraft: (draft: Omit<MatterDraft, "id" | "submittedAt" | "status">) =>
    setState((s) => {
      const id = `draft-${Date.now()}`;
      return {
        ...s,
        matterDrafts: [
          ...s.matterDrafts,
          {
            ...draft,
            id,
            submittedAt: new Date().toISOString(),
            status: "new",
          },
        ],
      };
    }),
  updateMatterDraft: (id: string, patch: Partial<MatterDraft>) =>
    setState((s) => ({
      ...s,
      matterDrafts: s.matterDrafts.map((d) =>
        d.id === id ? { ...d, ...patch } : d
      ),
    })),
  recordConflictCheck: (draftId: string, snapshot: ConflictCheckSnapshot) =>
    setState((s) => ({
      ...s,
      matterDrafts: s.matterDrafts.map((d) =>
        d.id === draftId ? { ...d, conflictCheck: snapshot } : d
      ),
      // Audit log is append-only — every check, cleared or not, is kept.
      conflictAuditLog: [...s.conflictAuditLog, snapshot],
    })),
  togglePersonAttendance: (eventId: string, personId: string) =>
    setState((s) => {
      const current = s.eventAttendance[eventId] ?? [];
      const next = current.includes(personId)
        ? current.filter((p) => p !== personId)
        : [...current, personId];
      return {
        ...s,
        eventAttendance: { ...s.eventAttendance, [eventId]: next },
      };
    }),
  addJournalEntry: (entry: Omit<MentorJournalEntry, "id" | "at">) =>
    setState((s) => ({
      ...s,
      mentorJournal: [
        ...s.mentorJournal,
        {
          ...entry,
          id: `mj-${entry.pairId}-${Date.now()}`,
          at: new Date().toISOString(),
        },
      ],
    })),
  toggleWeekComplete: (trackId: string, week: number) =>
    setState((s) => {
      const current = s.trackProgress[trackId] ?? [];
      const next = current.includes(week)
        ? current.filter((w) => w !== week)
        : [...current, week].sort((a, b) => a - b);
      return {
        ...s,
        trackProgress: { ...s.trackProgress, [trackId]: next },
      };
    }),
  snoozeMatterFollowUp: (matterId: string, days: number) =>
    setState((s) => {
      const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      return {
        ...s,
        followUpState: {
          ...s.followUpState,
          [matterId]: { ...(s.followUpState[matterId] ?? {}), snoozeUntil: until },
        },
      };
    }),
  recordFollowUpNudge: (matterId: string) =>
    setState((s) => ({
      ...s,
      followUpState: {
        ...s.followUpState,
        [matterId]: {
          ...(s.followUpState[matterId] ?? {}),
          lastNudge: new Date().toISOString(),
        },
      },
    })),
  addEvent: (event: Omit<EventItem, "id">): string => {
    const id = `ev-custom-${Date.now()}`;
    setState((s) => ({
      ...s,
      customEvents: [...s.customEvents, { ...event, id }],
    }));
    return id;
  },
  updateEvent: (id: string, patch: Partial<EventItem>) =>
    setState((s) => {
      // Custom event: patch in place.
      const isCustom = s.customEvents.some((e) => e.id === id);
      if (isCustom) {
        return {
          ...s,
          customEvents: s.customEvents.map((e) =>
            e.id === id ? { ...e, ...patch, id: e.id } : e
          ),
        };
      }
      // Seed event: write to overrides.
      return {
        ...s,
        eventOverrides: {
          ...s.eventOverrides,
          [id]: { ...(s.eventOverrides[id] ?? {}), ...patch },
        },
      };
    }),
  deleteEvent: (id: string) =>
    setState((s) => {
      const isCustom = s.customEvents.some((e) => e.id === id);
      if (isCustom) {
        return {
          ...s,
          customEvents: s.customEvents.filter((e) => e.id !== id),
          // Clean up any attendance state for the dropped custom event.
          eventAttendance: omitKey(s.eventAttendance, id),
        };
      }
      // Seed event: tombstone it, drop its override + attendance.
      const overrides = omitKey(s.eventOverrides, id);
      const attendance = omitKey(s.eventAttendance, id);
      return {
        ...s,
        deletedEventIds: s.deletedEventIds.includes(id)
          ? s.deletedEventIds
          : [...s.deletedEventIds, id],
        eventOverrides: overrides,
        eventAttendance: attendance,
        rsvps: s.rsvps.filter((r) => r !== id),
      };
    }),
  declineCase: (id: string) =>
    setState((s) => ({
      ...s,
      acceptedCases: s.acceptedCases.filter((x) => x !== id),
      savedCases: s.savedCases.filter((x) => x !== id),
    })),
  toggleSavedCase: (id: string) =>
    setState((s) => ({
      ...s,
      savedCases: s.savedCases.includes(id)
        ? s.savedCases.filter((x) => x !== id)
        : [...s.savedCases, id],
    })),
  logHours: (entry: { matterId: string; hours: number; date: string; note?: string }) =>
    setState((s) => ({ ...s, loggedHours: [...s.loggedHours, entry] })),

  // ── Mentor pair: meetings, outcomes, video link ──
  addPairMeeting: (m: Omit<PairMeeting, "id">): string => {
    const id = `pm-custom-${Date.now()}`;
    setState((s) => ({
      ...s,
      pairMeetingsAdded: [...s.pairMeetingsAdded, { ...m, id }],
    }));
    return id;
  },
  updatePairMeeting: (id: string, patch: Partial<PairMeeting>) =>
    setState((s) => {
      // Added meetings get patched in place
      const inAdded = s.pairMeetingsAdded.some((m) => m.id === id);
      if (inAdded) {
        return {
          ...s,
          pairMeetingsAdded: s.pairMeetingsAdded.map((m) =>
            m.id === id ? { ...m, ...patch, id: m.id } : m
          ),
        };
      }
      // Seed meetings get an overlay patch
      return {
        ...s,
        pairMeetingPatches: {
          ...s.pairMeetingPatches,
          [id]: { ...(s.pairMeetingPatches[id] ?? {}), ...patch },
        },
      };
    }),
  addPairOutcome: (o: Omit<PairOutcome, "id" | "recordedAt">): string => {
    const id = `po-custom-${Date.now()}`;
    setState((s) => ({
      ...s,
      pairOutcomesAdded: [
        ...s.pairOutcomesAdded,
        { ...o, id, recordedAt: new Date().toISOString() },
      ],
    }));
    return id;
  },
  setPairVideoLink: (pairId: string, url: string) =>
    setState((s) => ({
      ...s,
      pairVideoLinkOverrides: { ...s.pairVideoLinkOverrides, [pairId]: url },
    })),

  // ── Outcome verification ──
  verifyOutcome: (outcomeId: string, v: OutcomeVerification) =>
    setState((s) => ({
      ...s,
      outcomeVerifications: { ...s.outcomeVerifications, [outcomeId]: v },
    })),
  unverifyOutcome: (outcomeId: string) =>
    setState((s) => {
      if (!(outcomeId in s.outcomeVerifications)) return s;
      const next = { ...s.outcomeVerifications };
      delete next[outcomeId];
      return { ...s, outcomeVerifications: next };
    }),

  // ── Action items ──
  toggleActionItem: (id: string) =>
    setState((s) => {
      const current = s.actionItemPatches[id];
      const nextStatus = current?.status === "done" ? "open" : "done";
      return {
        ...s,
        actionItemPatches: {
          ...s.actionItemPatches,
          [id]: { ...current, status: nextStatus },
        },
      };
    }),

  // ── Mentorship requests ──
  createMentorshipRequest: (req: Omit<MentorshipRequest, "id" | "submittedAt" | "status">): string => {
    const id = `mr-custom-${Date.now()}`;
    setState((s) => ({
      ...s,
      mentorshipRequestsAdded: [
        ...s.mentorshipRequestsAdded,
        {
          ...req,
          id,
          status: "pending",
          submittedAt: new Date().toISOString(),
        },
      ],
    }));
    return id;
  },
  resolveMentorshipRequest: (
    id: string,
    resolution: "accepted" | "declined" | "withdrawn",
    resultingPairId?: string
  ) =>
    setState((s) => ({
      ...s,
      mentorshipRequestPatches: {
        ...s.mentorshipRequestPatches,
        [id]: {
          ...(s.mentorshipRequestPatches[id] ?? {}),
          status: resolution,
          resolvedAt: new Date().toISOString(),
          resultingPairId,
        },
      },
    })),

  // ── Integration connections ──
  toggleIntegration: (
    pairId: string,
    provider: IntegrationConnection["provider"],
    displayName?: string
  ) =>
    setState((s) => {
      // Look up existing connection (seed or added) for this pair+provider
      const seedKey = `${pairId}|${provider}`;
      const inSeed = seedIntegrationConnections.find(
        (c) => c.pairId === pairId && c.provider === provider
      );
      const inAdded = s.integrationConnectionsAdded.find(
        (c) => c.pairId === pairId && c.provider === provider
      );
      const existing = inSeed
        ? { ...inSeed, ...(s.integrationConnectionPatches[seedKey] ?? {}) }
        : inAdded;
      const nextConnected = !existing?.connected;

      if (inSeed) {
        return {
          ...s,
          integrationConnectionPatches: {
            ...s.integrationConnectionPatches,
            [seedKey]: {
              connected: nextConnected,
              connectedAt: nextConnected ? new Date().toISOString() : undefined,
              displayName: displayName ?? existing?.displayName,
            },
          },
        };
      }
      if (inAdded) {
        return {
          ...s,
          integrationConnectionsAdded: s.integrationConnectionsAdded.map((c) =>
            c.pairId === pairId && c.provider === provider
              ? {
                  ...c,
                  connected: nextConnected,
                  connectedAt: nextConnected
                    ? new Date().toISOString()
                    : undefined,
                  displayName: displayName ?? c.displayName,
                }
              : c
          ),
        };
      }
      // Brand-new connection
      return {
        ...s,
        integrationConnectionsAdded: [
          ...s.integrationConnectionsAdded,
          {
            pairId,
            provider,
            connected: nextConnected,
            connectedAt: nextConnected ? new Date().toISOString() : undefined,
            displayName,
          },
        ],
      };
    }),

  reset: () => setState(() => defaultState),
};

export function useDemoState(): DemoState {
  const [state, setLocal] = useState<DemoState>(currentState);
  useEffect(() => {
    const unsubscribe = demoStore.subscribe(setLocal);
    return () => {
      unsubscribe();
    };
  }, []);
  return state;
}

function omitKey<T>(obj: Record<string, T>, key: string): Record<string, T> {
  if (!(key in obj)) return obj;
  const { [key]: _drop, ...rest } = obj;
  void _drop;
  return rest;
}

/**
 * The events the rest of the app should read.
 *
 *   merged = (seed - deleted, each patched with overrides) ∪ customEvents
 *
 * Hook subscribes so create/edit/delete trigger re-renders.
 */
export function useAllEvents(): EventItem[] {
  const state = useDemoState();
  return useMemo(() => {
    const fromSeed = seedEvents
      .filter((e) => !state.deletedEventIds.includes(e.id))
      .map((e) => {
        const patch = state.eventOverrides[e.id];
        return patch ? ({ ...e, ...patch, id: e.id } as EventItem) : e;
      });
    return [...fromSeed, ...state.customEvents];
  }, [state.deletedEventIds, state.eventOverrides, state.customEvents]);
}

/** Single-event lookup over the merged view. */
export function useEvent(id: string | undefined): EventItem | undefined {
  const all = useAllEvents();
  return id ? all.find((e) => e.id === id) : undefined;
}

/** Merged meetings for a pair — seed + patches + additions, with action-item overlay, sorted by start. */
export function usePairMeetings(pairId: string | undefined): PairMeeting[] {
  const state = useDemoState();
  return useMemo(() => {
    if (!pairId) return [];
    const applyAi = (m: PairMeeting) =>
      m.summary
        ? { ...m, summary: applyActionItemPatches(m.summary, state.actionItemPatches) }
        : m;
    const fromSeed = seedPairMeetings
      .filter((m) => m.pairId === pairId)
      .map((m) => {
        const patch = state.pairMeetingPatches[m.id];
        return applyAi(patch ? { ...m, ...patch, id: m.id } : m);
      });
    const fromAdded = state.pairMeetingsAdded
      .filter((m) => m.pairId === pairId)
      .map(applyAi);
    return [...fromSeed, ...fromAdded].sort((a, b) =>
      a.scheduledFor.localeCompare(b.scheduledFor)
    );
  }, [
    pairId,
    state.pairMeetingPatches,
    state.pairMeetingsAdded,
    state.actionItemPatches,
  ]);
}

/** Merged outcomes for a pair — seed + additions, with verification overlay, sorted by date. */
export function usePairOutcomes(pairId: string | undefined): PairOutcome[] {
  const state = useDemoState();
  return useMemo(() => {
    if (!pairId) return [];
    const fromSeed = seedPairOutcomes.filter((o) => o.pairId === pairId);
    const fromAdded = state.pairOutcomesAdded.filter(
      (o) => o.pairId === pairId
    );
    return [...fromSeed, ...fromAdded]
      .map((o) => {
        const v = state.outcomeVerifications[o.id];
        return v ? { ...o, verification: v } : o;
      })
      .sort((a, b) => a.occurredOn.localeCompare(b.occurredOn));
  }, [pairId, state.pairOutcomesAdded, state.outcomeVerifications]);
}

/** Effective video link for a pair (override beats seed). */
export function usePairVideoLink(pairId: string | undefined): string | undefined {
  const state = useDemoState();
  if (!pairId) return undefined;
  const override = state.pairVideoLinkOverrides[pairId];
  if (override) return override;
  const pair = seedMentorPairs.find((p) => p.id === pairId);
  return pair?.videoLink;
}

/** Cross-pair counts for dashboards / module headlines. */
export function useAllPairOutcomes(): PairOutcome[] {
  const state = useDemoState();
  return useMemo(
    () =>
      [...seedPairOutcomes, ...state.pairOutcomesAdded].map((o) => {
        const v = state.outcomeVerifications[o.id];
        return v ? { ...o, verification: v } : o;
      }),
    [state.pairOutcomesAdded, state.outcomeVerifications]
  );
}

/** All mentorship requests — seed + added, with status patches applied. */
export function useMentorshipRequests(): MentorshipRequest[] {
  const state = useDemoState();
  return useMemo(() => {
    const seed = seedMentorshipRequests.map((r) => {
      const patch = state.mentorshipRequestPatches[r.id];
      return patch ? { ...r, ...patch, id: r.id } : r;
    });
    const added = state.mentorshipRequestsAdded.map((r) => {
      const patch = state.mentorshipRequestPatches[r.id];
      return patch ? { ...r, ...patch, id: r.id } : r;
    });
    return [...seed, ...added].sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt)
    );
  }, [state.mentorshipRequestPatches, state.mentorshipRequestsAdded]);
}

/** Integration connections for a pair — seed + added, with patches. */
export function usePairIntegrations(
  pairId: string | undefined
): IntegrationConnection[] {
  const state = useDemoState();
  return useMemo(() => {
    if (!pairId) return [];
    const fromSeed = seedIntegrationConnections
      .filter((c) => c.pairId === pairId)
      .map((c) => {
        const key = `${c.pairId}|${c.provider}`;
        const patch = state.integrationConnectionPatches[key];
        return patch ? { ...c, ...patch } : c;
      });
    const fromAdded = state.integrationConnectionsAdded.filter(
      (c) => c.pairId === pairId
    );
    return [...fromSeed, ...fromAdded];
  }, [
    pairId,
    state.integrationConnectionPatches,
    state.integrationConnectionsAdded,
  ]);
}

/** Apply action-item patches on top of a meeting summary. */
export function applyActionItemPatches(
  summary: import("../data/demo").MeetingSummary | undefined,
  patches: Record<string, Partial<ActionItem>>
): import("../data/demo").MeetingSummary | undefined {
  if (!summary) return summary;
  const items = summary.actionItems.map((ai) => {
    const patch = patches[ai.id];
    return patch ? { ...ai, ...patch, id: ai.id } : ai;
  });
  return { ...summary, actionItems: items };
}

export const roleLabel: Record<DemoRole, { label: string; latin: string; description: string }> = {
  "national-steward": {
    label: "National Steward",
    latin: "Magister generalis",
    description: "Oversees the network of chapters, affiliates, and formation distribution.",
  },
  "local-steward": {
    label: "Local Steward",
    latin: "Magister capituli",
    description: "Runs a chapter or guild — members, events, hospitality, continuity.",
  },
  mentor: {
    label: "Mentor",
    latin: "Magister",
    description: "Accompanies a student or younger lawyer through regular check-ins.",
  },
  member: {
    label: "Member",
    latin: "Socius",
    description: "Participates in chapter life, formation, and service.",
  },
  student: {
    label: "Student",
    latin: "Discipulus",
    description: "Law student finding their footing in vocation and community.",
  },
};
