import { describe, expect, it } from "vitest";
import { normalizePrintMaterial, printEstimate } from "@/lib/printEstimate";

describe("printEstimate", () => {
  it("turns a 20 mm cube into volume, PLA weight and 1.75 mm filament", () => {
    const estimate = printEstimate(8000, "pla");
    expect(estimate.volumeCm3).toBeCloseTo(8, 6);
    expect(estimate.grams).toBeCloseTo(9.92, 6);
    // 8000 mm³ / (pi * 0.875²) = 3326 mm of filament
    expect(estimate.filamentMeters).toBeCloseTo(3.326, 3);
  });

  it("weighs by the chosen material", () => {
    expect(printEstimate(1000, "abs").grams).toBeCloseTo(1.04, 6);
    expect(printEstimate(1000, "petg").grams).toBeCloseTo(1.27, 6);
  });

  it("never reports a negative or broken volume", () => {
    expect(printEstimate(-5).grams).toBe(0);
    expect(printEstimate(Number.NaN).volumeCm3).toBe(0);
  });

  it("falls back to PLA for an unknown material", () => {
    expect(normalizePrintMaterial("wood")).toBe("pla");
    expect(normalizePrintMaterial("tpu")).toBe("tpu");
  });
});
