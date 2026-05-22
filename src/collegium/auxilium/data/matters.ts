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

/**
 * Matter type order is the build priority. Eviction is the ready
 * worked example. Debt collection is matter #2 because it's the
 * largest single category of state-court civil work (~42% of dockets,
 * 4.7M filings/yr, 70%+ default judgment rate). Protection orders +
 * SSI/SSDI follow. Annulment lives last because it's the Collegium
 * crossover, not the volume play.
 */
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
    slug: "debt",
    title: "Debt collection lawsuit",
    triggerPhrase: "a debt-collection lawsuit or threats from a collector",
    icon: Banknote,
    blurb:
      "70% of debt-collection lawsuits end in default judgment — because the person sued never showed up. Showing up, with the right paperwork, is most of the battle. We'll get you ready.",
    defaultUrgency: "now",
    status: "scaffold",
    perplexityTopic: "consumer debt collection lawsuit defense",
  },
  {
    slug: "family",
    title: "Family & protection orders",
    triggerPhrase: "divorce, custody, a protection order, or a family-court matter",
    icon: Users,
    blurb:
      "Family court rules are local and the paperwork is heavy. Protection orders save lives — reported physical violence drops about 80% after one is issued. We'll get you ready.",
    defaultUrgency: "soon",
    status: "scaffold",
    perplexityTopic: "family court divorce custody protection order",
  },
  {
    slug: "public-benefits",
    title: "Benefits denial / appeal",
    triggerPhrase: "an SSI, SSDI, Medicaid, or SNAP denial",
    icon: HeartPulse,
    blurb:
      "Most denials are reversible on appeal — but the appeal deadlines are short, often 60 days. Approval at SSDI hearings nearly doubles with help. Bring your denial letter; we'll walk you through it.",
    defaultUrgency: "now",
    status: "scaffold",
    perplexityTopic: "SSI SSDI Medicaid SNAP appeals",
  },
  {
    slug: "expungement",
    title: "Record sealing & expungement",
    triggerPhrase: "an old charge you want sealed",
    icon: Scissors,
    blurb:
      "Old arrests, dismissed cases, and some convictions can be sealed. It opens doors that have been closed for years — housing, jobs, professional licenses. You can usually walk this yourself with help.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "criminal record expungement sealing",
  },
  {
    slug: "immigration",
    title: "Immigration intake",
    triggerPhrase: "an immigration question or a status change",
    icon: Plane,
    blurb:
      "Immigration law is federal but immigration help is local. We'll help you gather your documents and connect you to a DOJ-accredited representative — the only people other than attorneys who can represent you.",
    defaultUrgency: "soon",
    status: "scaffold",
    perplexityTopic: "immigration intake DOJ BIA accreditation",
  },
  {
    slug: "estate",
    title: "Will & health-care proxy",
    triggerPhrase: "a will, a power of attorney, or end-of-life documents",
    icon: ScrollText,
    blurb:
      "Most adults need three documents: a will, a durable power of attorney, and a health-care proxy. We'll help you gather what's needed before the consult — these are usually free or low-cost to draft.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "simple will power of attorney health care proxy",
  },
  {
    slug: "annulment",
    title: "Catholic marriage tribunal",
    triggerPhrase: "a Catholic annulment process",
    icon: Church,
    blurb:
      "A canonical annulment is not a civil divorce — it asks whether a sacramental bond existed. The process is pastoral, document-heavy, and usually free or very low-cost through your diocese.",
    defaultUrgency: "planning",
    status: "scaffold",
    perplexityTopic: "Catholic diocesan marriage tribunal annulment",
  },
];

export const findMatter = (slug: string) =>
  matterTypes.find((m) => m.slug === slug);
