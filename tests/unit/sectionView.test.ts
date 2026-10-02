import { describe, expect, it } from "vitest";
import { computeSectionPlaneVector, DEFAULT_SECTION_SETTINGS, getSectionBounds, sectionFineWindow } from "@/lib/sectionView";
import type { WorkplaneShape } from "@/types/layerling";

function sampleShape(overrides: Partial<WorkplaneShape> = {}): WorkplaneShape {
  return {
    id: "box-1",
    name: "Box",
    kind: "box",
    x: 0,
    z: 0,
    elevation: 0,
    width: 20,
    height: 10,
    depth: 30,
    rotation: 0,
    color: "#ff0000",
    ...overrides,
  };
}

describe("sectionView", () => {
  it("defaults to disabled along x axis", () => {
    expect(DEFAULT_SECTION_SETTINGS.enabled).toBe(false);
    expect(DEFAULT_SECTION_SETTINGS.axis).toBe("x");
    expect(DEFAULT_SECTION_SETTINGS.flipped).toBe(false);
  });

  it("calculates bounds for empty shapes using workspace limits", () => {
    const boundsX = getSectionBounds([], "x", 220, 220);
    expect(boundsX.min).toBe(-110);
    expect(boundsX.max).toBe(110);
    expect(boundsX.center).toBe(0);

    const boundsY = getSectionBounds([], "y", 220, 220);
    expect(boundsY.min).toBe(0);
    expect(boundsY.max).toBe(100);
    expect(boundsY.center).toBe(50);
  });

  it("calculates bounds across visible shapes with padding", () => {
    const shape = sampleShape({ x: 10, z: -5, elevation: 5, width: 20, height: 10, depth: 30 });

    const boundsX = getSectionBounds([shape], "x");
    // shape x spans from 10 - 10 = 0 to 10 + 10 = 20. Span = 20. Padding = 1.
    expect(boundsX.min).toBeLessThanOrEqual(0);
    expect(boundsX.max).toBeGreaterThanOrEqual(20);
    expect(boundsX.center).toBe(10);

    const boundsY = getSectionBounds([shape], "y");
    // elevation spans from 5 to 15. Center = 10.
    expect(boundsY.min).toBeLessThanOrEqual(5);
    expect(boundsY.max).toBeGreaterThanOrEqual(15);
    expect(boundsY.center).toBe(10);

    const boundsZ = getSectionBounds([shape], "z");
    // z spans from -5 - 15 = -20 to -5 + 15 = 10. Center = -5.
    expect(boundsZ.min).toBeLessThanOrEqual(-20);
    expect(boundsZ.max).toBeGreaterThanOrEqual(10);
    expect(boundsZ.center).toBe(-5);
  });

  it("ignores hidden shapes", () => {
    const hidden = sampleShape({ id: "h1", hidden: true, x: 500, width: 20 });
    const visible = sampleShape({ id: "v1", x: 0, width: 20 });
    const bounds = getSectionBounds([hidden, visible], "x");
    expect(bounds.center).toBe(0);
  });

  it("computes plane normal and constant for X axis", () => {
    const unflipped = computeSectionPlaneVector({
      enabled: true,
      axis: "x",
      offset: 15,
      flipped: false,
      showPlane: true,
    });
    expect(unflipped.normal).toEqual({ x: 1, y: 0, z: 0 });
    expect(unflipped.constant).toBe(-15);

    const flipped = computeSectionPlaneVector({
      enabled: true,
      axis: "x",
      offset: 15,
      flipped: true,
      showPlane: true,
    });
    expect(flipped.normal).toEqual({ x: -1, y: 0, z: 0 });
    expect(flipped.constant).toBe(15);
  });

  it("computes plane normal and constant for Y and Z axes", () => {
    const yAxis = computeSectionPlaneVector({
      enabled: true,
      axis: "y",
      offset: 25,
      flipped: false,
      showPlane: true,
    });
    expect(yAxis.normal).toEqual({ x: 0, y: 1, z: 0 });
    expect(yAxis.constant).toBe(-25);

    const zAxisFlipped = computeSectionPlaneVector({
      enabled: true,
      axis: "z",
      offset: -10,
      flipped: true,
      showPlane: true,
    });
    expect(zAxisFlipped.normal).toEqual({ x: 0, y: 0, z: -1 });
    expect(zAxisFlipped.constant).toBe(-10);
  });
});

describe("sectionFineWindow", () => {
  it("is a twentieth of the coarse range to either side, between 0.5 and 10 mm", () => {
    expect(sectionFineWindow({ min: 0, max: 40 })).toEqual({ span: 2, step: 0.01 });
    expect(sectionFineWindow({ min: 0, max: 4 }).span).toBe(0.5);
    expect(sectionFineWindow({ min: -500, max: 500 }).span).toBe(10);
  });
});
