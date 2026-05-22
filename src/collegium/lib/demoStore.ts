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
          }
    ),
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
