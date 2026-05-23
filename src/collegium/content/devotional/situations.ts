/**
 * Situational vocabulary for the Field Guide pocketbook.
 *
 * Tags are bounded (not free-text) so the back-of-book index, the in-app
 * search, and the curation surface all see the same set. A devotional day
 * may carry 1–3 tags chosen from this catalog.
 *
 * Adding a tag: pick a category, write a phrase a lawyer might think to
 * themselves at 11pm. Keep it specific. "Pressure" is not a tag.
 * "11pm-still-at-office" is.
 */

export type SituationalCategory =
  | "career-moment"
  | "case-life"
  | "practice-condition"
  | "conscience"
  | "faith-vocation"
  | "civic";

export type SituationalTag =
  // Career moments
  | "swearing-in"
  | "first-job"
  | "partnership-track"
  | "partnership-offered"
  | "considering-leaving-practice"
  | "judicial-appointment"
  | "retirement"
  | "death-of-mentor"
  // Case life
  | "intake-difficult-client"
  | "client-lied-to-you"
  | "declining-the-case"
  | "accepting-pro-bono"
  | "before-trial"
  | "mid-trial-collapse"
  | "before-sentencing"
  | "after-loss"
  | "after-win"
  | "settlement-negotiation"
  | "appeal-rejected"
  | "client-died"
  // Practice conditions
  | "billable-hour-burnout"
  | "11pm-still-at-office"
  | "weekend-document-review"
  | "vacation-interrupted"
  | "sole-practice-loneliness"
  | "firm-pressure-to-compromise"
  | "young-associate-mistake"
  | "senior-partner-bullying"
  // Conscience
  | "defending-the-indefensible"
  | "press-release-omission"
  | "discovery-response-borderline"
  | "coaching-the-witness"
  | "arguing-against-conscience"
  | "moral-injury"
  // Faith and vocation
  | "forgetting-why-you-do-this"
  | "pride-in-the-win"
  | "envy-of-the-bigger-firm"
  | "gratitude-for-the-bar"
  | "before-mass"
  | "after-confession"
  | "on-the-feast-day"
  // Civic
  | "civic-amicus"
  | "bar-committee"
  | "unjust-statute"
  | "public-defender-overload"
  | "justice-gap";

export const situationalCategories: {
  category: SituationalCategory;
  label: string;
  blurb: string;
  tags: { tag: SituationalTag; label: string }[];
}[] = [
  {
    category: "career-moment",
    label: "Career moments",
    blurb: "The doors of a legal life — opening, closing, opening again.",
    tags: [
      { tag: "swearing-in", label: "Just sworn in" },
      { tag: "first-job", label: "First job" },
      { tag: "partnership-track", label: "On the partnership track" },
      { tag: "partnership-offered", label: "Partnership offered" },
      { tag: "considering-leaving-practice", label: "Considering leaving practice" },
      { tag: "judicial-appointment", label: "Appointed to the bench" },
      { tag: "retirement", label: "Approaching retirement" },
      { tag: "death-of-mentor", label: "A mentor has died" },
    ],
  },
  {
    category: "case-life",
    label: "The life of a case",
    blurb: "From the intake call to the final order — the moments that mark a matter.",
    tags: [
      { tag: "intake-difficult-client", label: "A difficult intake" },
      { tag: "client-lied-to-you", label: "The client lied" },
      { tag: "declining-the-case", label: "Declining a case" },
      { tag: "accepting-pro-bono", label: "Accepting a pro bono matter" },
      { tag: "before-trial", label: "On the eve of trial" },
      { tag: "mid-trial-collapse", label: "When trial goes sideways" },
      { tag: "before-sentencing", label: "Before sentencing" },
      { tag: "after-loss", label: "After a loss" },
      { tag: "after-win", label: "After a win" },
      { tag: "settlement-negotiation", label: "At the settlement table" },
      { tag: "appeal-rejected", label: "The appeal was denied" },
      { tag: "client-died", label: "A client has died" },
    ],
  },
  {
    category: "practice-condition",
    label: "Conditions of practice",
    blurb: "The hours, the loneliness, the structures that shape who we are becoming.",
    tags: [
      { tag: "billable-hour-burnout", label: "Billable-hour burnout" },
      { tag: "11pm-still-at-office", label: "11 PM, still at the office" },
      { tag: "weekend-document-review", label: "Weekend document review" },
      { tag: "vacation-interrupted", label: "Vacation interrupted" },
      { tag: "sole-practice-loneliness", label: "The loneliness of sole practice" },
      { tag: "firm-pressure-to-compromise", label: "Firm pressure to compromise" },
      { tag: "young-associate-mistake", label: "A young associate's mistake" },
      { tag: "senior-partner-bullying", label: "Senior-partner bullying" },
    ],
  },
  {
    category: "conscience",
    label: "Conscience",
    blurb: "The moments the rule-book doesn't cover — and the soul does.",
    tags: [
      { tag: "defending-the-indefensible", label: "Defending the indefensible" },
      { tag: "press-release-omission", label: "What the press release leaves out" },
      { tag: "discovery-response-borderline", label: "A discovery response on the line" },
      { tag: "coaching-the-witness", label: "Coaching the witness" },
      { tag: "arguing-against-conscience", label: "Arguing against conscience" },
      { tag: "moral-injury", label: "Moral injury" },
    ],
  },
  {
    category: "faith-vocation",
    label: "Faith and vocation",
    blurb: "The dispositions a Christian lawyer brings to the desk — and what un-makes them.",
    tags: [
      { tag: "forgetting-why-you-do-this", label: "Forgetting why you do this" },
      { tag: "pride-in-the-win", label: "Pride in the win" },
      { tag: "envy-of-the-bigger-firm", label: "Envy of the bigger firm" },
      { tag: "gratitude-for-the-bar", label: "Gratitude for the bar" },
      { tag: "before-mass", label: "Before Mass" },
      { tag: "after-confession", label: "After confession" },
      { tag: "on-the-feast-day", label: "On a feast day" },
    ],
  },
  {
    category: "civic",
    label: "Civic life",
    blurb: "The work that doesn't appear on a billing statement — but holds the order together.",
    tags: [
      { tag: "civic-amicus", label: "Writing a civic amicus" },
      { tag: "bar-committee", label: "On a bar committee" },
      { tag: "unjust-statute", label: "Living under an unjust statute" },
      { tag: "public-defender-overload", label: "The public-defender caseload" },
      { tag: "justice-gap", label: "Sitting with the justice gap" },
    ],
  },
];

/** Quick lookup: tag → human label. */
export const tagLabel: Record<SituationalTag, string> = Object.fromEntries(
  situationalCategories.flatMap((c) => c.tags.map((t) => [t.tag, t.label]))
) as Record<SituationalTag, string>;

/** Quick lookup: tag → category. */
export const tagCategory: Record<SituationalTag, SituationalCategory> =
  Object.fromEntries(
    situationalCategories.flatMap((c) => c.tags.map((t) => [t.tag, c.category]))
  ) as Record<SituationalTag, SituationalCategory>;
