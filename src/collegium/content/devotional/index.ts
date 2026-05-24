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
import { week27 } from "./seed/week-27";
import { week28 } from "./seed/week-28";
import { week29 } from "./seed/week-29";
import { week30 } from "./seed/week-30";
import { week31 } from "./seed/week-31";
import { week32 } from "./seed/week-32";
import { week33 } from "./seed/week-33";
import { week34 } from "./seed/week-34";
import { week35 } from "./seed/week-35";
import { week36 } from "./seed/week-36";
import { week37 } from "./seed/week-37";
import { week38 } from "./seed/week-38";
import { week39 } from "./seed/week-39";
import { week40 } from "./seed/week-40";
import { week41 } from "./seed/week-41";
import { week42 } from "./seed/week-42";
import { week43 } from "./seed/week-43";
import { week44 } from "./seed/week-44";
import { week45 } from "./seed/week-45";
import { week46 } from "./seed/week-46";
import { week47 } from "./seed/week-47";
import { week48 } from "./seed/week-48";
import { week49 } from "./seed/week-49";
import { week50 } from "./seed/week-50";
import { week51 } from "./seed/week-51";
import { week52 } from "./seed/week-52";

export const devotionalDays: DevotionalDay[] = [
  ...week01, ...week02, ...week03, ...week04, ...week05, ...week06, ...week07,
  ...week08, ...week09, ...week10, ...week11, ...week12, ...week13, ...week14,
  ...week15, ...week16, ...week17, ...week18, ...week19, ...week20, ...week21,
  ...week22, ...week23, ...week24, ...week25, ...week26, ...week27, ...week28,
  ...week29, ...week30, ...week31, ...week32, ...week33, ...week34, ...week35,
  ...week36, ...week37, ...week38, ...week39, ...week40, ...week41, ...week42,
  ...week43, ...week44, ...week45, ...week46, ...week47, ...week48, ...week49,
  ...week50, ...week51, ...week52,
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
