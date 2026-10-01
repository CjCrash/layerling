import { describe, expect, it } from "vitest";
import { formatFractionalInches, parseMeasurementInput } from "@/lib/measurementUnits";
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

describe("inch fractions", () => {
  it("prints mixed numbers like Tinkercad", () => {
    expect(formatFractionalInches(1.625)).toBe("1⅝");
    expect(formatFractionalInches(0.1875)).toBe("3/16");
    expect(formatFractionalInches(2.5)).toBe("2½");
    expect(formatFractionalInches(1.0625)).toBe("1 1/16");
    expect(formatFractionalInches(3)).toBe("3");
    expect(formatFractionalInches(0)).toBe("0");
    expect(formatFractionalInches(-0.75)).toBe("-¾");
    expect(formatFractionalInches(0.7874)).toBe("25/32");
  });

  it("reads fractions back, typed or printed", () => {
    expect(parseMeasurementInput("1⅝")).toBeCloseTo(1.625, 10);
    expect(parseMeasurementInput("1 5/8")).toBeCloseTo(1.625, 10);
    expect(parseMeasurementInput("1-5/8")).toBeCloseTo(1.625, 10);
    expect(parseMeasurementInput("3/16")).toBeCloseTo(0.1875, 10);
    expect(parseMeasurementInput("-¾")).toBeCloseTo(-0.75, 10);
    expect(parseMeasurementInput("1/0")).toBeNaN();
    expect(parseMeasurementInput("1,5")).toBe(1.5);
    expect(parseMeasurementInput("2.25")).toBe(2.25);
  });
});
