import { describe, it, expect } from "vitest";
import {
  quoteForClient,
  summarizeRevenue,
  feeLadders,
  clientPayments,
  PLATFORM_FEE_PCT,
} from "./lowBono";

/**
 * Low-bono routing math is the revenue engine — pin the quote logic and the
 * revenue summary so a regression doesn't quietly cost us 5% on every
 * transaction.
 */

describe("quoteForClient", () => {
  const ladder = feeLadders["t-stm-boston"];

  it("returns pro-bono for clients under 100% FPL", () => {
    const q = quoteForClient(ladder, 80, "immigration", 4);
    expect(q.mode).toBe("pro-bono");
    expect(q.amount).toBe(0);
  });

  it("uses the matching flat fee when one applies and FPL is below ceiling", () => {
    const q = quoteForClient(ladder, 130, "estate-planning", 4);
    expect(q.mode).toBe("flat-fee");
    expect(q.amount).toBe(150);
  });

  it("falls back to hourly ladder when no flat fee matches", () => {
    const q = quoteForClient(ladder, 250, "parish-governance", 3);
    expect(q.mode).toBe("hourly");
    expect(q.amount).toBe(300); // $100/hr × 3 hours
  });

  it("respects the per-matter cap in the hourly ladder", () => {
    const q = quoteForClient(ladder, 175, "parish-governance", 20);
    expect(q.mode).toBe("hourly");
    // 200% FPL band rate is $50/hr, cap is $400. 20 hr × $50 = $1000, capped at $400.
    expect(q.amount).toBe(400);
  });

  it("returns pro-bono if ladder is disabled", () => {
    const disabled = { ...ladder, enabled: false };
    const q = quoteForClient(disabled, 300, "parish-governance", 3);
    expect(q.mode).toBe("pro-bono");
  });

  it("skips flat-fee when client's FPL exceeds the ceiling", () => {
    const q = quoteForClient(ladder, 350, "estate-planning", 4);
    expect(q.mode).toBe("hourly");
  });
});

describe("summarizeRevenue", () => {
  it("aggregates totals across all payments", () => {
    const s = summarizeRevenue(clientPayments);
    expect(s.transactionCount).toBe(clientPayments.length);
    expect(s.grossRouted).toBeGreaterThan(0);
    expect(s.platformFees).toBeGreaterThan(0);
    expect(s.netToAttorneys).toBeLessThan(s.grossRouted);
  });

  it("platform fees are 5% of gross routed", () => {
    const s = summarizeRevenue(clientPayments);
    const expected = Math.round(s.grossRouted * PLATFORM_FEE_PCT * 100) / 100;
    expect(s.platformFees).toBeCloseTo(expected, 1);
  });

  it("net to attorneys + platform fees + stripe fees ≈ gross", () => {
    const s = summarizeRevenue(clientPayments);
    const total =
      Math.round((s.netToAttorneys + s.platformFees + s.stripeFees) * 100) / 100;
    expect(total).toBeCloseTo(s.grossRouted, 1);
  });
});
