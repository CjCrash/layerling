import { describe, expect, it } from "vitest";
import { shellMaxThickness } from "@/lib/shellLimits";

describe("thickest wall the Hollow tool offers", () => {
  const plate = { width: 40, depth: 30, height: 1 };

  it("ignores the height for a frame open top and bottom", () => {
    // Fratercula's case: a 1 mm frame from a 1 mm plate.
    expect(shellMaxThickness(plate, "top-bottom")).toBe(15);
  });

  it("lets a floor or lid take almost the whole height when one side is open", () => {
    expect(shellMaxThickness({ width: 40, depth: 30, height: 2 }, "top")).toBeCloseTo(1.8);
    expect(shellMaxThickness({ width: 40, depth: 30, height: 2 }, "bottom")).toBeCloseTo(1.8);
  });

  it("shares the height between floor and lid when closed all round", () => {
    expect(shellMaxThickness({ width: 40, depth: 30, height: 2 }, "none")).toBe(1);
  });

  it("is always limited by the narrower side and never drops below the minimum wall", () => {
    expect(shellMaxThickness({ width: 6, depth: 50, height: 100 }, "top")).toBe(3);
    expect(shellMaxThickness({ width: 40, depth: 30, height: 0.1 }, "top")).toBe(0.2);
  });
});
