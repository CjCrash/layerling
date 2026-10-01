import { describe, expect, it } from "vitest";
import { snapGridForUnits, snapGridOptionsForUnits, snapGridStep } from "@/lib/workplaneSettings";

describe("imperial snap grid", () => {
  it("steps are inch fractions in millimetres", () => {
    expect(snapGridStep("1/8 in")).toBeCloseTo(3.175, 10);
    expect(snapGridStep("1/16 in")).toBeCloseTo(1.5875, 10);
    expect(snapGridStep("1/64 in")).toBeCloseTo(0.396875, 10);
    expect(snapGridStep("1 in")).toBeCloseTo(25.4, 10);
    expect(snapGridStep("1.0 mm")).toBe(1);
  });

  it("offers inch steps for Imperial and millimetre steps otherwise", () => {
    expect(snapGridOptionsForUnits("Imperial")).toContain("1/8 in");
    expect(snapGridOptionsForUnits("Imperial")).not.toContain("1.0 mm");
    expect(snapGridOptionsForUnits("Metric (Default)")).toContain("1.0 mm");
    expect(snapGridOptionsForUnits("Metric (Default)")).not.toContain("1/8 in");
  });

  it("switches the step with the unit system and keeps one that still fits", () => {
    expect(snapGridForUnits("Imperial", "1.0 mm")).toBe("1/8 in");
    expect(snapGridForUnits("Imperial", "1/4 in")).toBe("1/4 in");
    expect(snapGridForUnits("Metric (Default)", "1/8 in")).toBe("1.0 mm");
    expect(snapGridForUnits("Metric (Default)", "Off")).toBe("Off");
  });
});
