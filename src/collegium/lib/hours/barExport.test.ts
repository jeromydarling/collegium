import { describe, it, expect } from "vitest";
import { generateBarReport, generateFirmRollup } from "./barExport";
import { hoursEntries } from "./demoEntries";

/**
 * The bar-export generator is the killer feature for paid tiers. These
 * tests pin the contract: same inputs, same output text; the right hours
 * land in the right state; the threshold check fires correctly.
 */

describe("generateBarReport — NY single-attorney", () => {
  it("returns deterministic output", () => {
    const a = generateBarReport({
      jurisdiction: "US-NY",
      attorney: { name: "Daniel Chen", barNumber: "5891234" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    const b = generateBarReport({
      jurisdiction: "US-NY",
      attorney: { name: "Daniel Chen", barNumber: "5891234" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    expect(a.text).toBe(b.text);
    expect(a.summary).toEqual(b.summary);
  });

  it("filters entries to the requested jurisdiction", () => {
    const r = generateBarReport({
      jurisdiction: "US-NY",
      attorney: { name: "Daniel Chen", barNumber: "5891234" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    // Demo entries are MA/VA/DC — none in NY. Should return 0 hours.
    expect(r.summary.totalHours).toBe(0);
    expect(r.summary.meetsThreshold).toBe(false);
    expect(r.text).toMatch(/22 NYCRR/);
  });

  it("reports MA hours when MA is the jurisdiction", () => {
    const r = generateBarReport({
      jurisdiction: "US-MA",
      attorney: { name: "Margaret Coyle", barNumber: "BBO-555-444" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    expect(r.summary.totalHours).toBeGreaterThan(0);
    expect(r.text).toMatch(/Massachusetts/i);
    expect(r.text).toMatch(/BBO/);
  });

  it("renders the NY affidavit format", () => {
    const r = generateBarReport({
      jurisdiction: "US-NY",
      attorney: { name: "Margaret Coyle", barNumber: "5891234" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    expect(r.text).toMatch(/AFFIDAVIT OF COMPLIANCE/);
    expect(r.text).toMatch(/22 NYCRR § 520\.16/);
    expect(r.text).toMatch(/50-HOUR/i);
  });

  it("excludes entries from prior years", () => {
    const r2026 = generateBarReport({
      jurisdiction: "US-MA",
      attorney: { name: "Margaret Coyle" },
      reportingYear: 2026,
      entries: hoursEntries,
    });
    const r2025 = generateBarReport({
      jurisdiction: "US-MA",
      attorney: { name: "Margaret Coyle" },
      reportingYear: 2025,
      entries: hoursEntries,
    });
    expect(r2026.summary.totalHours).not.toBe(r2025.summary.totalHours);
    expect(r2025.summary.totalHours).toBeGreaterThan(0);
  });
});

describe("generateFirmRollup — multi-attorney aggregate", () => {
  it("groups hours by attorney with totals", () => {
    const rollup = generateFirmRollup({
      jurisdiction: "US-MA",
      reportingYear: 2026,
      firmName: "Coyle & Whelan Pro Bono",
      attorneys: new Map([
        ["p-coyle", { name: "Margaret Coyle", barNumber: "BBO-555-444" }],
        ["p-chen", { name: "Daniel Chen", barNumber: "BBO-678-901" }],
        ["p-ohara", { name: "James O'Hara", barNumber: "BBO-222-333" }],
        ["p-falconio", { name: "Sr. Anne Marie Falconio, OP", barNumber: "BBO-111-555" }],
      ]),
      entries: hoursEntries,
    });
    expect(rollup.rows.length).toBeGreaterThanOrEqual(3);
    expect(rollup.totalHours).toBeGreaterThan(0);
    // Sorted by hours descending
    for (let i = 1; i < rollup.rows.length; i++) {
      expect(rollup.rows[i].totalHours).toBeLessThanOrEqual(
        rollup.rows[i - 1].totalHours
      );
    }
  });

  it("renders firm rollup text with all reporting attorneys", () => {
    const rollup = generateFirmRollup({
      jurisdiction: "US-MA",
      reportingYear: 2026,
      firmName: "Coyle & Whelan Pro Bono",
      attorneys: new Map([
        ["p-coyle", { name: "Margaret Coyle", barNumber: "BBO-555-444" }],
        ["p-chen", { name: "Daniel Chen", barNumber: "BBO-678-901" }],
      ]),
      entries: hoursEntries,
    });
    expect(rollup.text).toMatch(/COYLE & WHELAN PRO BONO/);
    expect(rollup.text).toMatch(/Margaret Coyle/);
    expect(rollup.text).toMatch(/Daniel Chen/);
    expect(rollup.text).toMatch(/AGGREGATE FIRM CONTRIBUTION/);
  });

  it("flags threshold compliance per attorney", () => {
    const rollup = generateFirmRollup({
      jurisdiction: "US-NY", // 50-hour threshold
      reportingYear: 2026,
      firmName: "Test Firm",
      attorneys: new Map([
        ["p-coyle", { name: "Margaret Coyle", barNumber: "5891234" }],
      ]),
      entries: hoursEntries,
    });
    // No NY entries → 0 hours → below threshold
    for (const r of rollup.rows) {
      expect(r.meetsThreshold).toBe(false);
    }
  });
});
