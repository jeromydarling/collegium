import { describe, it, expect } from "vitest";
import { generateBriefings } from "./engine";
import {
  chapters,
  people,
  mentorPairs,
  events,
  serviceMatters,
} from "../../data/demo";
import { peerGuilds, peerSignals } from "../../data/communio";

const NOW = new Date("2026-05-22T12:00:00Z");

/**
 * The engine is a pure function over Collegium's demo data. These tests
 * pin the rules so the briefings stay legible and additive — a steward
 * who reads a briefing should always be able to point to the rule that
 * fired and the signals that drove it.
 */

describe("NRI engine — determinism", () => {
  it("returns the same briefings for the same input", () => {
    const a = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const b = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
    expect(a).toEqual(b);
  });

  it("produces deterministic stable IDs across calls", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    for (const b of briefings) {
      expect(b.id).toMatch(/^nri-/);
      expect(b.generatedOn).toBe("2026-05-22");
    }
  });

  it("sorts concern before attend before celebrate", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const toneOrder = { concern: 0, attend: 1, celebrate: 2 };
    for (let i = 1; i < briefings.length; i++) {
      expect(toneOrder[briefings[i].tone]).toBeGreaterThanOrEqual(
        toneOrder[briefings[i - 1].tone]
      );
    }
  });
});

describe("NRI engine — mentor-pair rules", () => {
  it("fires a drift briefing for the drifting pair", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const drift = briefings.find(
      (b) => b.id === "nri-mp-drift-mp-hartmann-velasquez"
    );
    expect(drift).toBeDefined();
    expect(drift!.tone).toBe("attend");
    expect(drift!.title).toContain("Velasquez");
    expect(drift!.signals.some((s) => s.includes("drifting"))).toBe(true);
  });

  it("fires a thriving-arc briefing only for pairs active 18+ months", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const thriving = briefings.filter((b) => b.id.startsWith("nri-mp-thrive-"));
    // mp-coyle-chen started Sept 2024 → ~20 months by May 2026 → should fire.
    // mp-brennan-roy started Feb 2025 → ~15 months → should NOT fire.
    expect(thriving.length).toBeGreaterThan(0);
    expect(thriving.some((b) => b.id === "nri-mp-thrive-mp-coyle-chen")).toBe(true);
    expect(thriving.some((b) => b.id === "nri-mp-thrive-mp-brennan-roy")).toBe(false);
  });

  it("does not double-fire (no gap rule fires for a drifting pair)", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const driftIds = briefings.filter((b) => b.id.includes("hartmann-velasquez"));
    // Exactly one briefing should fire for the drifting pair — the drift rule,
    // not the long-gap rule.
    expect(driftIds.length).toBe(1);
    expect(driftIds[0].id).toBe("nri-mp-drift-mp-hartmann-velasquez");
  });
});

describe("NRI engine — chapter rules", () => {
  it("fires a service-surge briefing for Chicago", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const surge = briefings.find((b) => b.id === "nri-ch-surge-ch-clg-chicago");
    expect(surge).toBeDefined();
    expect(surge!.signals.some((s) => /referrals in 60 days/.test(s))).toBe(true);
  });

  it("fires succession risk for chapters with low succession score", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const succession = briefings.filter((b) => b.id.startsWith("nri-ch-succession-"));
    // Boston (56), JP II (60 — boundary, excluded), Toronto (50) should fire.
    // JP II is 60 which is NOT < 60, so excluded; Boston (56) and Toronto (50) fire.
    expect(succession.length).toBeGreaterThanOrEqual(2);
    expect(succession.every((b) => b.tone === "concern")).toBe(true);
  });

  it("fires officer-overload for Toronto (vice chair carrying double load)", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const overload = briefings.find(
      (b) => b.id === "nri-ch-overload-ch-cbf-toronto"
    );
    expect(overload).toBeDefined();
    expect(overload!.tone).toBe("attend");
  });

  it("fires formation-vs-service imbalance for JP II Guild", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const imbalance = briefings.find(
      (b) => b.id === "nri-ch-formation-vs-service-ch-jp2-cua"
    );
    expect(imbalance).toBeDefined();
    expect(imbalance!.signals.some((s) => /Gap of \d+/.test(s))).toBe(true);
  });
});

describe("NRI engine — service-matter rules", () => {
  it("fires a regional-pressure briefing when 4+ open matters in same region", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const regional = briefings.filter((b) => b.id.startsWith("nri-svc-region-"));
    expect(regional.length).toBeGreaterThan(0);
    // Boston has 4 open matters in the 30d window → should fire.
    expect(regional.some((b) => b.title.includes("Boston"))).toBe(true);
  });

  it("flags closure-loop habit when consent rate is high", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const loop = briefings.find((b) => b.id === "nri-svc-closure-loop");
    expect(loop).toBeDefined();
    expect(loop!.tone).toBe("celebrate");
  });

  it("flags urgent matters aging past the threshold", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const urgent = briefings.filter((b) => b.id.startsWith("nri-svc-urgent-"));
    // sm-5 is urgent, status "new", intake 2026-05-04 → 18 days old by 5/22.
    expect(urgent.some((b) => b.scopeId === "sm-5")).toBe(true);
  });
});

describe("NRI engine — Communio integration", () => {
  it("fires cross-tenant briefings when peer signals match local practice", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      peerSignals,
      peerGuilds,
      now: NOW,
    });
    const crosslinks = briefings.filter((b) => b.id.startsWith("nri-communio-"));
    expect(crosslinks.length).toBeGreaterThan(0);
    // Sacred Heart Phoenix published an immigration-pattern signal;
    // Chicago has active immigration matters — should fire.
    expect(
      crosslinks.some(
        (b) => b.title.includes("Sacred Heart") || b.title.includes("immigration")
      )
    ).toBe(true);
  });

  it("does not fire crosslinks when peer signals are absent", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const crosslinks = briefings.filter((b) => b.id.startsWith("nri-communio-"));
    expect(crosslinks.length).toBe(0);
  });
});

describe("NRI engine — network pulse", () => {
  it("always produces a quarterly network-pulse briefing", () => {
    const briefings = generateBriefings({
      chapters,
      people,
      mentorPairs,
      events,
      serviceMatters,
      now: NOW,
    });
    const pulse = briefings.find((b) => b.id.startsWith("nri-network-pulse-"));
    expect(pulse).toBeDefined();
    expect(pulse!.scope).toBe("network");
    expect(pulse!.tone).toBe("celebrate");
    expect(pulse!.title).toContain("Q2 2026");
  });
});
