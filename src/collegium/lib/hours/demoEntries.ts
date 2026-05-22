/**
 * Demo hours entries — realistic distribution across attorneys, jurisdictions,
 * and activities for the past 12 months. Used by the bar-export and firm
 * dashboard until real logging takes over.
 */

import type { HoursEntry, HoursActivity } from "./types";
import { serviceMatters } from "../../data/demo";

interface Seed {
  attorneyId: string;
  matterId: string;
  jurisdiction: string;
  category: HoursEntry["category"];
  entries: { date: string; hours: number; activity: HoursActivity; description: string; closed?: boolean }[];
}

const SEEDS: Seed[] = [
  {
    attorneyId: "p-coyle",
    matterId: "sm-4",
    jurisdiction: "US-MA",
    category: "direct-representation",
    entries: [
      { date: "2026-02-14", hours: 2.5, activity: "client-intake", description: "Initial intake at Cathedral pastoral office, conflict-check" },
      { date: "2026-02-28", hours: 3.0, activity: "research", description: "Tribunal procedure + civil custody overlap" },
      { date: "2026-03-12", hours: 4.5, activity: "drafting", description: "Civil custody motion + tribunal advocacy memo" },
      { date: "2026-04-08", hours: 2.0, activity: "client-counseling", description: "Strategy session with client; Sr. Anne Marie co-present" },
      { date: "2026-05-08", hours: 5.5, activity: "court-appearance", description: "Custody motion hearing, Middlesex Probate" },
    ],
  },
  {
    attorneyId: "p-coyle",
    matterId: "sm-11",
    jurisdiction: "US-MA",
    category: "limited-scope",
    entries: [
      { date: "2026-05-19", hours: 1.0, activity: "client-intake", description: "Intake at St. Mark's Dorchester; widow + adult daughter" },
      { date: "2026-05-21", hours: 2.5, activity: "drafting", description: "Simple will + HCP form" },
      { date: "2026-05-22", hours: 1.0, activity: "client-counseling", description: "Signing meeting, walkthrough, daughter as HCP agent", closed: true },
    ],
  },
  {
    attorneyId: "p-chen",
    matterId: "sm-2",
    jurisdiction: "US-MA",
    category: "direct-representation",
    entries: [
      { date: "2026-03-04", hours: 1.5, activity: "client-intake", description: "Intake at St. Procopius Wednesday clinic" },
      { date: "2026-03-18", hours: 4.0, activity: "research", description: "U-visa eligibility, documentation gathering" },
      { date: "2026-04-02", hours: 6.0, activity: "drafting", description: "I-918 petition first draft" },
      { date: "2026-04-22", hours: 3.5, activity: "drafting", description: "Supporting affidavits + LEA certification request" },
      { date: "2026-05-15", hours: 2.0, activity: "client-counseling", description: "Review final petition with client; Spanish-fluent interpreter" },
    ],
  },
  {
    attorneyId: "p-chen",
    matterId: "sm-8",
    jurisdiction: "US-MA",
    category: "limited-scope",
    entries: [
      { date: "2026-05-21", hours: 1.0, activity: "client-intake", description: "Eviction intake at St. Anthony Shrine outreach" },
      { date: "2026-05-22", hours: 2.5, activity: "drafting", description: "Eviction answer draft + voucher preservation letter" },
    ],
  },
  {
    attorneyId: "p-brennan",
    matterId: "sm-6",
    jurisdiction: "US-DC",
    category: "direct-representation",
    entries: [
      { date: "2026-04-30", hours: 1.5, activity: "client-intake", description: "Intake at St. Thomas More Saturday clinic" },
      { date: "2026-05-04", hours: 3.0, activity: "hearing-prep", description: "Plea prep, mitigation factors interview" },
      { date: "2026-05-15", hours: 3.5, activity: "court-appearance", description: "Plea hearing — CWOF accepted", closed: true },
    ],
  },
  {
    attorneyId: "p-brennan",
    matterId: "sm-3",
    jurisdiction: "US-VA",
    category: "advice-and-counsel",
    entries: [
      { date: "2026-05-13", hours: 1.0, activity: "research", description: "Public juridic person / property-tax framework review" },
      { date: "2026-05-16", hours: 1.5, activity: "client-counseling", description: "Advisory call with trustee + Fr. Cale" },
    ],
  },
  {
    attorneyId: "p-ohara",
    matterId: "sm-9",
    jurisdiction: "US-MA",
    category: "advice-and-counsel",
    entries: [
      { date: "2026-05-22", hours: 2.0, activity: "drafting", description: "Sealing-petition packet review + prep call with pro se filer" },
    ],
  },
  {
    attorneyId: "p-falconio",
    matterId: "sm-4",
    jurisdiction: "US-MA",
    category: "supervision",
    entries: [
      { date: "2026-03-12", hours: 1.0, activity: "supervision", description: "Tribunal advocacy review with Coyle" },
      { date: "2026-05-08", hours: 0.5, activity: "supervision", description: "Pre-hearing sanity check" },
    ],
  },
  // Prior-year matters for the year-over-year comparison
  {
    attorneyId: "p-coyle",
    matterId: "sm-4",
    jurisdiction: "US-MA",
    category: "direct-representation",
    entries: [
      { date: "2025-09-14", hours: 3.5, activity: "drafting", description: "[Prior matter] Annulment-tribunal advocacy first draft" },
      { date: "2025-10-22", hours: 2.0, activity: "court-appearance", description: "[Prior matter] Civil motion hearing" },
      { date: "2025-11-30", hours: 1.5, activity: "client-counseling", description: "[Prior matter] Closing meeting", closed: true },
    ],
  },
  {
    attorneyId: "p-chen",
    matterId: "sm-2",
    jurisdiction: "US-MA",
    category: "direct-representation",
    entries: [
      { date: "2025-12-04", hours: 4.0, activity: "drafting", description: "[Prior matter] I-918 second-pass draft" },
      { date: "2026-01-10", hours: 2.0, activity: "client-counseling", description: "[Prior matter] Strategy review" },
    ],
  },
];

function goalForMatter(matterId: string): string {
  const m = serviceMatters.find((x) => x.id === matterId);
  if (!m) return matterId;
  return m.summary.split(".")[0];
}

export const hoursEntries: HoursEntry[] = SEEDS.flatMap((seed) =>
  seed.entries.map((e, i) => ({
    id: `he-${seed.attorneyId}-${seed.matterId}-${i}-${e.date}`,
    tenantId: "t-stm-boston", // demo default; real assignment by attorney's tenant membership
    attorneyId: seed.attorneyId,
    matterId: seed.matterId,
    date: e.date,
    hours: e.hours,
    activity: e.activity,
    description: e.description,
    jurisdiction: seed.jurisdiction,
    category: seed.category,
    matterClosed: e.closed,
    loggedAt: e.date + "T20:00:00Z",
  }))
);

export function matterGoal(matterId: string): string {
  return goalForMatter(matterId);
}
