/**
 * Auxilium matter-type catalogue.
 *
 * These are the recurring legal matters that the Christian Legal Aid
 * research surfaced — the "core five" plus a few neighbors. Each one
 * has its own field guide. Eviction is the deepest worked example;
 * the others are scaffolded and will deepen as we go.
 */

import {
  Home,
  Scissors,
  Users,
  HeartPulse,
  Banknote,
  ScrollText,
  Plane,
  Church,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Urgency = "now" | "soon" | "planning";

export type MatterType = {
  slug: string;
  title: string;
  /** Short phrase used in the chooser ("a notice to quit"). */
  triggerPhrase: string;
  icon: LucideIcon;
  blurb: string;
  /**
   * How urgent is this matter, in general? Drives prominence in the UI.
   * "now" = deadlines run, days matter; "soon" = weeks; "planning" = months.
   */
  defaultUrgency: Urgency;
  /** Whether we have a deep field guide yet, or just a stub. */
  status: "ready" | "scaffold" | "coming-soon";
  /** Used by the Perplexity query layer to ground searches. */
  perplexityTopic: string;
};

export const matterTypes: MatterType[] = [
  {
    slug: "eviction",
    title: "Eviction & housing",
    triggerPhrase: "notice to quit, an eviction filing, or trouble with a landlord",
    icon: Home,
    blurb:
      "If your landlord has handed you something on paper — a notice, a summons, a lawsuit — the deadlines have already started. Let's name what you have and what to do this week.",
    defaultUrgency: "now",
    status: "ready",
    perplexityTopic: "tenant eviction defense",
  },
  {
    slug: "expungement",
    title: "Record sealing & expungement",
    triggerPhrase: "an old charge you want sealed",
    icon: Scissors,
    blurb:
      "Old arrests and dismissed cases can usually be sealed. The forms and timing vary by state, but the path is real and you can usually walk it yourself with help.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "criminal record expungement",
  },
  {
    slug: "family",
    title: "Family & custody",
    triggerPhrase: "divorce, custody, or a family-court matter",
    icon: Users,
    blurb:
      "Family-court rules are local, the paperwork is heavy, and emotions are high. We'll help you understand the steps before you walk into a hearing.",
    defaultUrgency: "soon",
    status: "scaffold",
    perplexityTopic: "family court divorce custody",
  },
  {
    slug: "public-benefits",
    title: "Benefits denial / appeal",
    triggerPhrase: "an SSI, SSDI, Medicaid, or SNAP denial",
    icon: HeartPulse,
    blurb:
      "Most denials are reversible on appeal — but the appeal deadlines are short. Bring your denial letter; we'll walk you through the next 30 days.",
    defaultUrgency: "now",
    status: "scaffold",
    perplexityTopic: "SSI SSDI Medicaid SNAP appeals",
  },
  {
    slug: "debt",
    title: "Debt collection",
    triggerPhrase: "a debt-collection lawsuit or threats from a collector",
    icon: Banknote,
    blurb:
      "Most consumer debt-collection lawsuits are won by default because the person sued never showed up. Showing up is most of the battle.",
    defaultUrgency: "soon",
    status: "scaffold",
    perplexityTopic: "consumer debt collection lawsuit defense",
  },
  {
    slug: "estate",
    title: "Will & health-care proxy",
    triggerPhrase: "a will, a power of attorney, or end-of-life documents",
    icon: ScrollText,
    blurb:
      "Most adults need three documents: a will, a durable power of attorney, and a health-care proxy. We'll help you gather what's needed before the consult.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "simple will power of attorney health care proxy",
  },
  {
    slug: "immigration",
    title: "Immigration intake",
    triggerPhrase: "an immigration question or a status change",
    icon: Plane,
    blurb:
      "Immigration law is federal but immigration help is local. We'll help you gather your documents and find a DOJ-accredited representative.",
    defaultUrgency: "soon",
    status: "scaffold",
    perplexityTopic: "immigration intake DOJ BIA accreditation",
  },
  {
    slug: "annulment",
    title: "Catholic marriage tribunal",
    triggerPhrase: "a Catholic annulment process",
    icon: Church,
    blurb:
      "A canonical annulment is not a civil divorce — it asks whether a sacramental bond existed. The process is pastoral, document-heavy, and free or low-cost.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "Catholic diocesan marriage tribunal annulment",
  },
];

export const findMatter = (slug: string) =>
  matterTypes.find((m) => m.slug === slug);
