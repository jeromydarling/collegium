/**
 * Lightweight in-memory state for the Collegium demo.
 *
 * GitHub Pages is static; there is no backend. The demo lives entirely in
 * the browser. A subset of state persists to localStorage so the visitor
 * sees continuity across reloads (their role, completed actions, etc.).
 */

import { useEffect, useState } from "react";

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
