/**
 * Low-bono engagement data model — what powers the transaction handshake.
 *
 * Two concepts:
 *
 * 1. **FeeLadder** — a tenant's policy for sliding-scale or flat-fee
 *    pricing. Each tenant defines: (a) FPL bands and the hourly rate
 *    that applies, and/or (b) flat fees by matter category.
 *
 * 2. **ClientPayment** — a record of a routed transaction. Tracks the
 *    gross amount paid by the client, the platform fee, Stripe's fee,
 *    and the net to the attorney. When Stripe Connect is wired, these
 *    will be created from `payment_intent.succeeded` webhooks; for now
 *    we seed demo records that drive the tenant admin's revenue view.
 */

export type FplBand = {
  /** FPL percentage at the lower bound of this band, e.g. 100 = 100% FPL. */
  fplLowerPct: number;
  /** FPL percentage at the upper bound (exclusive). null = no upper bound. */
  fplUpperPct: number | null;
  /** Hourly rate in USD this band pays. 0 = pro bono. */
  hourlyRate: number;
  /** Optional cap on total client liability per matter. */
  perMatterCap?: number;
};

export type FlatFeeBand = {
  /** Matter category this flat fee applies to. */
  category: string;
  /** FPL ceiling above which the flat fee does NOT apply (client pays standard rates). */
  fplCeilingPct: number | null;
  /** Total flat fee in USD. */
  flatFee: number;
  /** Short description shown to the client. */
  description: string;
};

export interface FeeLadder {
  tenantId: string;
  enabled: boolean;
  /** FPL-based hourly ladder. Bands evaluated in order; first match wins. */
  fplBands: FplBand[];
  /** Optional flat fees by matter category. Override the FPL ladder when present. */
  flatFees: FlatFeeBand[];
  /** Platform fee — Collegium's 5% handshake. */
  platformFeePct: number;
  /** When this ladder was last updated (ISO). */
  updatedAt: string;
}

export interface ClientPayment {
  id: string;
  tenantId: string;
  matterId: string;
  attorneyId: string;
  /** ISO date the payment was processed. */
  paidOn: string;
  /** Gross amount in USD (what the client paid). */
  grossAmount: number;
  /** Platform fee taken by Collegium (5% of gross). */
  platformFee: number;
  /** Stripe's processing fee — approximately 2.9% + $0.30. */
  stripeFee: number;
  /** Net amount that landed in the attorney's connected account. */
  netToAttorney: number;
  /** FPL band that triggered this rate. */
  fplPct: number;
  /** What ladder configuration was in effect when this fired. */
  ladderSnapshot: "hourly" | "flat-fee";
  /** Description shown on receipt. */
  description: string;
  /** Stripe Connect transfer id (placeholder until wired). */
  stripeTransferId?: string;
}

/* ------------------------------------------------------------------ */
/* Default ladder shapes — what new tenants start with                */
/* ------------------------------------------------------------------ */

export const DEFAULT_FPL_BANDS: FplBand[] = [
  { fplLowerPct: 0, fplUpperPct: 100, hourlyRate: 0 },
  { fplLowerPct: 100, fplUpperPct: 150, hourlyRate: 25, perMatterCap: 200 },
  { fplLowerPct: 150, fplUpperPct: 200, hourlyRate: 50, perMatterCap: 400 },
  { fplLowerPct: 200, fplUpperPct: 300, hourlyRate: 100, perMatterCap: 800 },
  { fplLowerPct: 300, fplUpperPct: 400, hourlyRate: 175, perMatterCap: 1500 },
  { fplLowerPct: 400, fplUpperPct: null, hourlyRate: 250 },
];

export const DEFAULT_FLAT_FEES: FlatFeeBand[] = [
  {
    category: "estate-planning",
    fplCeilingPct: 300,
    flatFee: 150,
    description: "Simple will + health-care proxy + POA",
  },
  {
    category: "expungement",
    fplCeilingPct: 300,
    flatFee: 200,
    description: "Record-sealing petition packet + filing",
  },
  {
    category: "housing",
    fplCeilingPct: 250,
    flatFee: 250,
    description: "Eviction-defense limited-scope representation",
  },
  {
    category: "immigration",
    fplCeilingPct: 250,
    flatFee: 75,
    description: "60-minute advice consult (Spanish-fluent available)",
  },
  {
    category: "public-benefits",
    fplCeilingPct: 200,
    flatFee: 175,
    description: "SSI/SSDI reconsideration request packet",
  },
];

export const PLATFORM_FEE_PCT = 0.05;

/* ------------------------------------------------------------------ */
/* Demo ladders per tenant                                             */
/* ------------------------------------------------------------------ */

export const feeLadders: Record<string, FeeLadder> = {
  "t-stm-boston": {
    tenantId: "t-stm-boston",
    enabled: true,
    fplBands: DEFAULT_FPL_BANDS,
    flatFees: DEFAULT_FLAT_FEES,
    platformFeePct: PLATFORM_FEE_PCT,
    updatedAt: "2026-03-15",
  },
  "t-clg-chicago": {
    tenantId: "t-clg-chicago",
    enabled: true,
    fplBands: DEFAULT_FPL_BANDS,
    flatFees: DEFAULT_FLAT_FEES,
    platformFeePct: PLATFORM_FEE_PCT,
    updatedAt: "2026-02-08",
  },
  "t-doc-arlington": {
    tenantId: "t-doc-arlington",
    enabled: true,
    fplBands: DEFAULT_FPL_BANDS.map((b) => ({ ...b })),
    flatFees: DEFAULT_FLAT_FEES,
    platformFeePct: PLATFORM_FEE_PCT,
    updatedAt: "2026-04-20",
  },
};

/* ------------------------------------------------------------------ */
/* Demo client payments                                                */
/* ------------------------------------------------------------------ */

function stripeFeeOn(gross: number): number {
  return Math.round((gross * 0.029 + 0.3) * 100) / 100;
}

function buildPayment(
  id: string,
  tenantId: string,
  matterId: string,
  attorneyId: string,
  paidOn: string,
  grossAmount: number,
  fplPct: number,
  ladder: "hourly" | "flat-fee",
  description: string
): ClientPayment {
  const platformFee = Math.round(grossAmount * PLATFORM_FEE_PCT * 100) / 100;
  const stripeFee = stripeFeeOn(grossAmount);
  const netToAttorney =
    Math.round((grossAmount - platformFee - stripeFee) * 100) / 100;
  return {
    id,
    tenantId,
    matterId,
    attorneyId,
    paidOn,
    grossAmount,
    platformFee,
    stripeFee,
    netToAttorney,
    fplPct,
    ladderSnapshot: ladder,
    description,
    stripeTransferId: `tr_demo_${id}`,
  };
}

export const clientPayments: ClientPayment[] = [
  buildPayment(
    "pm-1",
    "t-stm-boston",
    "sm-11",
    "p-coyle",
    "2026-05-22",
    150,
    165,
    "flat-fee",
    "Simple will + HCP + POA · Anna T."
  ),
  buildPayment(
    "pm-2",
    "t-stm-boston",
    "sm-9",
    "p-ohara",
    "2026-05-22",
    200,
    120,
    "flat-fee",
    "Sealing petition packet · Daniel O."
  ),
  buildPayment(
    "pm-3",
    "t-clg-chicago",
    "sm-12",
    "p-chen",
    "2026-05-19",
    175,
    75,
    "flat-fee",
    "SSI reconsideration packet · Robert M."
  ),
  buildPayment(
    "pm-4",
    "t-clg-chicago",
    "sm-1",
    "p-ruiz",
    "2026-05-15",
    480,
    165,
    "hourly",
    "Parish governance advisory · 4.8 hr @ $100/hr (cap reached)"
  ),
  buildPayment(
    "pm-5",
    "t-doc-arlington",
    "sm-3",
    "p-brennan",
    "2026-05-16",
    100,
    180,
    "hourly",
    "Canon-law / property-tax advisory · 1 hr"
  ),
];

/* ------------------------------------------------------------------ */
/* Selectors                                                            */
/* ------------------------------------------------------------------ */

export function getFeeLadder(tenantId: string): FeeLadder | null {
  return feeLadders[tenantId] ?? null;
}

export function getPaymentsForTenant(tenantId: string): ClientPayment[] {
  return clientPayments.filter((p) => p.tenantId === tenantId);
}

/** Resolve the right fee for a given FPL + matter category. */
export function quoteForClient(
  ladder: FeeLadder,
  fplPct: number,
  category: string,
  estimatedHours: number
): { mode: "pro-bono" | "flat-fee" | "hourly"; amount: number; description: string } {
  if (!ladder.enabled) {
    return { mode: "pro-bono", amount: 0, description: "Pure pro bono" };
  }

  // Truly poor — at or below the poverty line — never pay. This guardrail
  // exists no matter what the ladder says: the fee schedule starts above
  // 100% FPL.
  if (fplPct < 100) {
    return { mode: "pro-bono", amount: 0, description: "Pure pro bono (under poverty line)" };
  }

  // Flat-fee first if applicable
  const flat = ladder.flatFees.find(
    (f) => f.category === category && (f.fplCeilingPct === null || fplPct <= f.fplCeilingPct)
  );
  if (flat) {
    return {
      mode: "flat-fee",
      amount: flat.flatFee,
      description: flat.description,
    };
  }

  // Fall back to FPL ladder
  const band = ladder.fplBands.find(
    (b) =>
      fplPct >= b.fplLowerPct &&
      (b.fplUpperPct === null || fplPct < b.fplUpperPct)
  );
  if (!band || band.hourlyRate === 0) {
    return { mode: "pro-bono", amount: 0, description: "Pure pro bono" };
  }
  const gross = band.perMatterCap
    ? Math.min(band.hourlyRate * estimatedHours, band.perMatterCap)
    : band.hourlyRate * estimatedHours;
  return {
    mode: "hourly",
    amount: gross,
    description: `${estimatedHours} hr × $${band.hourlyRate}/hr${band.perMatterCap ? ` (capped at $${band.perMatterCap})` : ""}`,
  };
}

/** Aggregate revenue numbers across all routed payments — fuels the
 *  tenant revenue panel and our own internal reporting. */
export interface RevenueSummary {
  grossRouted: number;
  platformFees: number;
  stripeFees: number;
  netToAttorneys: number;
  transactionCount: number;
}

export function summarizeRevenue(payments: ClientPayment[]): RevenueSummary {
  const grossRouted = payments.reduce((s, p) => s + p.grossAmount, 0);
  const platformFees = payments.reduce((s, p) => s + p.platformFee, 0);
  const stripeFees = payments.reduce((s, p) => s + p.stripeFee, 0);
  const netToAttorneys = payments.reduce((s, p) => s + p.netToAttorney, 0);
  return {
    grossRouted: round(grossRouted),
    platformFees: round(platformFees),
    stripeFees: round(stripeFees),
    netToAttorneys: round(netToAttorneys),
    transactionCount: payments.length,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
