/**
 * 365-day devotional — collects per-week files into a single array.
 *
 * Each week file lives under ./seed/week-NN.ts and exports a
 * `weekNN: DevotionalDay[]` of seven entries. This index concatenates
 * them in order and exposes lookup helpers.
 */

import type { DevotionalDay } from "./types";
import { week01 } from "./seed/week-01";
import { week02 } from "./seed/week-02";
import { week03 } from "./seed/week-03";
import { week04 } from "./seed/week-04";
import { week05 } from "./seed/week-05";
import { week06 } from "./seed/week-06";
import { week07 } from "./seed/week-07";
import { week08 } from "./seed/week-08";
import { week09 } from "./seed/week-09";
import { week10 } from "./seed/week-10";
import { week11 } from "./seed/week-11";
import { week12 } from "./seed/week-12";
import { week13 } from "./seed/week-13";
import { week14 } from "./seed/week-14";
import { week15 } from "./seed/week-15";
import { week16 } from "./seed/week-16";
import { week17 } from "./seed/week-17";
import { week18 } from "./seed/week-18";
import { week19 } from "./seed/week-19";
import { week20 } from "./seed/week-20";
import { week21 } from "./seed/week-21";
import { week22 } from "./seed/week-22";
import { week23 } from "./seed/week-23";
import { week24 } from "./seed/week-24";
import { week25 } from "./seed/week-25";
import { week26 } from "./seed/week-26";

export const devotionalDays: DevotionalDay[] = [
  ...week01,
  ...week02,
  ...week03,
  ...week04,
  ...week05,
  ...week06,
  ...week07,
  ...week08,
  ...week09,
  ...week10,
  ...week11,
  ...week12,
  ...week13,
  ...week14,
  ...week15,
  ...week16,
  ...week17,
  ...week18,
  ...week19,
  ...week20,
  ...week21,
  ...week22,
  ...week23,
  ...week24,
  ...week25,
  ...week26,
];

/** Day-of-year (1–365) for a given Date. Feb 29 collapses onto Feb 28 (day 59). */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / 86_400_000);
  // In a leap year days 60+ shift; clamp Feb 29 onto Feb 28 so the
  // 365-entry seed stays sequential.
  return Math.min(day, 365);
}

/** Today's devotional, or the closest day for which we have an entry. */
export function devotionalForDate(date: Date): DevotionalDay | null {
  const d = dayOfYear(date);
  // Sparse-seed safe: pick the latest entry on or before today.
  let best: DevotionalDay | null = null;
  for (const e of devotionalDays) {
    if (e.day <= d && (!best || e.day > best.day)) best = e;
  }
  // If nothing matches (e.g. early-Jan and seed starts mid-year), fall
  // back to the first entry.
  return best ?? devotionalDays[0] ?? null;
}

export function devotionalByDay(day: number): DevotionalDay | undefined {
  return devotionalDays.find((d) => d.day === day);
}
