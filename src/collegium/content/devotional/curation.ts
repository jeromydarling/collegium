/**
 * Field Guide pocketbook — curation layer.
 *
 * Two things live here:
 *
 *  1. `pocketbookDays` — the ordered list of day numbers selected for the
 *     pocketbook. Aim is ~50 entries that together cover every weekly
 *     arc and the major situational moments of legal life.
 *
 *  2. `dayTagOverrides` — a per-day map of situational tags. Used to
 *     retrofit tags onto Q1 entries (written before the situational
 *     vocabulary existed) without rewriting the seed files. Q2+ entries
 *     should set `situationalTags` directly on the DevotionalDay.
 *
 * Effective tags for a day = entry.situationalTags ?? dayTagOverrides[day] ?? [].
 *
 * The selection here is provisional — first hand pick. It will be revised
 * once Q2–Q4 land and we can see the full year's terrain.
 */

import type { SituationalTag } from "./situations";

/**
 * The ~50 days selected for the Field Guide. Order = the order they
 * appear in the pocketbook (not the order of the year).
 *
 * Convention so the editor can see structure at a glance:
 *   - Open with Vocation (the gravity beneath everything else)
 *   - Then virtues (Justice, Equity, Mercy, Truth, Conscience)
 *   - Then practice realities (Counsel, Office, Authority)
 *   - Then the work of cases (sentencing, the poor, mid-trial)
 *   - Close with Christ the Advocate (the lawyer's pattern)
 */
export const pocketbookDays: number[] = [
  // I. Vocation
  1, 4, 5, 7,
  // II. Justice
  8, 9, 12, 14,
  // III. Equity
  15, 17, 20, 21,
  // IV. Conscience
  22, 23, 27, 28,
  // V. The Poor
  29, 30, 31, 33,
  // VI. Authority
  36, 38, 40, 42,
  // VII. Mercy
  43, 45, 47, 49,
  // VIII. Truth
  50, 51, 53, 56,
  // IX. Counsel
  57, 58, 59, 62,
  // X. Office
  64, 67, 68, 69,
  // XI. Common Good
  72, 75, 76,
  // XII. Subsidiarity
  78, 80, 83,
  // XIII. Christ the Advocate
  85, 87, 90, 91,
];

/**
 * Pocketbook section headings — group the days into chapters with a
 * sectional title. Pocketbook is organized by virtue/topic, then has a
 * back-matter situational index.
 */
export const pocketbookSections: { title: string; latin: string; dayRange: [number, number]; }[] = [
  { title: "Vocation", latin: "Vocatio", dayRange: [1, 7] },
  { title: "Justice", latin: "Iustitia", dayRange: [8, 14] },
  { title: "Equity", latin: "Aequitas", dayRange: [15, 21] },
  { title: "Conscience", latin: "Conscientia", dayRange: [22, 28] },
  { title: "The Poor", latin: "Pauperes", dayRange: [29, 35] },
  { title: "Authority", latin: "Auctoritas", dayRange: [36, 42] },
  { title: "Mercy", latin: "Misericordia", dayRange: [43, 49] },
  { title: "Truth", latin: "Veritas", dayRange: [50, 56] },
  { title: "Counsel", latin: "Consilium", dayRange: [57, 63] },
  { title: "Office", latin: "Officium", dayRange: [64, 70] },
  { title: "Common Good", latin: "Bonum commune", dayRange: [71, 77] },
  { title: "Subsidiarity", latin: "Subsidiaritas", dayRange: [78, 84] },
  { title: "Christ the Advocate", latin: "Christus Advocatus", dayRange: [85, 91] },
];

/**
 * Per-day situational-tag overrides for Q1 (days 1–91), written before
 * the situational vocabulary was finalized. Map of day → tags.
 *
 * Q2+ entries set situationalTags directly on the DevotionalDay; this
 * map is the bridge for the older entries.
 */
export const dayTagOverrides: Record<number, SituationalTag[]> = {
  // Vocation (week 1)
  1: ["swearing-in", "forgetting-why-you-do-this", "first-job"],
  2: ["swearing-in", "first-job"],
  3: ["billable-hour-burnout", "accepting-pro-bono", "considering-leaving-practice"],
  4: ["intake-difficult-client", "11pm-still-at-office"],
  5: ["sole-practice-loneliness"],
  6: ["intake-difficult-client", "client-lied-to-you", "accepting-pro-bono"],
  7: ["billable-hour-burnout", "11pm-still-at-office", "on-the-feast-day"],

  // Justice (week 2)
  8: ["forgetting-why-you-do-this", "gratitude-for-the-bar"],
  9: ["civic-amicus", "settlement-negotiation"],
  10: ["justice-gap", "civic-amicus"],
  11: ["settlement-negotiation", "intake-difficult-client"],
  12: ["partnership-track", "gratitude-for-the-bar"],
  13: ["arguing-against-conscience", "moral-injury", "after-loss"],
  14: ["unjust-statute", "civic-amicus", "moral-injury"],

  // Equity (week 3)
  15: ["before-sentencing", "defending-the-indefensible"],
  16: ["mid-trial-collapse", "after-loss"],
  17: ["civic-amicus", "settlement-negotiation"],
  18: ["unjust-statute", "before-sentencing"],
  19: ["before-trial", "settlement-negotiation"],
  20: ["before-sentencing", "after-win"],
  21: ["settlement-negotiation", "after-loss"],

  // Conscience (week 4)
  22: ["arguing-against-conscience", "moral-injury"],
  23: ["firm-pressure-to-compromise", "considering-leaving-practice"],
  24: ["young-associate-mistake", "press-release-omission"],
  25: ["arguing-against-conscience", "discovery-response-borderline"],
  26: ["arguing-against-conscience", "before-mass"],
  27: ["arguing-against-conscience", "moral-injury"],
  28: ["considering-leaving-practice", "moral-injury", "death-of-mentor"],

  // The Poor (week 5)
  29: ["justice-gap", "accepting-pro-bono"],
  30: ["public-defender-overload", "justice-gap"],
  31: ["accepting-pro-bono", "billable-hour-burnout"],
  32: ["public-defender-overload", "accepting-pro-bono"],
  33: ["public-defender-overload", "before-sentencing"],
  34: ["accepting-pro-bono", "justice-gap"],
  35: ["accepting-pro-bono", "intake-difficult-client"],

  // Authority (week 6)
  36: ["civic-amicus", "unjust-statute"],
  37: ["unjust-statute", "civic-amicus"],
  38: ["civic-amicus", "arguing-against-conscience"],
  39: ["arguing-against-conscience", "moral-injury"],
  40: ["arguing-against-conscience", "unjust-statute"],
  41: ["unjust-statute", "civic-amicus"],
  42: ["unjust-statute", "moral-injury"],

  // Mercy (week 7)
  43: ["before-sentencing", "settlement-negotiation"],
  44: ["before-sentencing", "judicial-appointment"],
  45: ["settlement-negotiation", "after-win"],
  46: ["before-sentencing", "arguing-against-conscience"],
  47: ["accepting-pro-bono", "intake-difficult-client"],
  48: ["before-sentencing", "after-loss"],
  49: ["after-confession", "moral-injury"],

  // Truth (week 8)
  50: ["coaching-the-witness", "press-release-omission"],
  51: ["intake-difficult-client", "client-lied-to-you"],
  52: ["coaching-the-witness", "discovery-response-borderline"],
  53: ["discovery-response-borderline", "after-loss"],
  54: ["client-lied-to-you", "before-trial"],
  55: ["coaching-the-witness", "press-release-omission"],
  56: ["arguing-against-conscience", "moral-injury"],

  // Counsel (week 9)
  57: ["intake-difficult-client", "declining-the-case"],
  58: ["intake-difficult-client", "firm-pressure-to-compromise"],
  59: ["arguing-against-conscience", "death-of-mentor"],
  60: ["bar-committee", "young-associate-mistake"],
  61: ["intake-difficult-client", "11pm-still-at-office"],
  62: ["firm-pressure-to-compromise", "young-associate-mistake"],
  63: ["declining-the-case", "moral-injury"],

  // Office (week 10)
  64: ["swearing-in", "first-job"],
  65: ["partnership-track", "gratitude-for-the-bar"],
  66: ["bar-committee", "civic-amicus"],
  67: ["partnership-offered", "considering-leaving-practice"],
  68: ["swearing-in", "gratitude-for-the-bar"],
  69: ["arguing-against-conscience", "declining-the-case"],
  70: ["retirement", "death-of-mentor"],

  // Common Good (week 11)
  71: ["civic-amicus", "bar-committee"],
  72: ["justice-gap", "bar-committee"],
  73: ["civic-amicus", "bar-committee"],
  74: ["gratitude-for-the-bar", "partnership-track"],
  75: ["bar-committee", "civic-amicus"],
  76: ["unjust-statute", "moral-injury"],
  77: ["on-the-feast-day", "civic-amicus"],

  // Subsidiarity (week 12)
  78: ["civic-amicus", "bar-committee"],
  79: ["civic-amicus", "unjust-statute"],
  80: ["senior-partner-bullying", "young-associate-mistake"],
  81: ["bar-committee", "civic-amicus"],
  82: ["accepting-pro-bono", "justice-gap"],
  83: ["civic-amicus", "young-associate-mistake"],
  84: ["on-the-feast-day", "gratitude-for-the-bar"],

  // Christ the Advocate (week 13)
  85: ["accepting-pro-bono", "before-trial"],
  86: ["sole-practice-loneliness", "before-trial"],
  87: ["after-confession", "before-trial"],
  88: ["after-loss", "before-sentencing", "moral-injury"],
  89: ["on-the-feast-day", "after-loss"],
  90: ["accepting-pro-bono", "sole-practice-loneliness"],
  91: ["on-the-feast-day", "gratitude-for-the-bar"],
};
