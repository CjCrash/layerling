import { describe, expect, it } from "vitest";
import { bedOverhangs, printerPresetById, shapeBedFootprint } from "@/lib/printBed";
import { PRINTER_PRESETS } from "@/lib/printerPresets.generated";
import type { WorkplaneShape } from "@/types/layerling";

function shape(overrides: Partial<WorkplaneShape> = {}): WorkplaneShape {
  return {
    id: "box-1",
    name: "Box",
    kind: "box",
    color: "#d41721",
    x: 0,
    z: 0,
    elevation: 0,
    size: 20,
    width: 20,
    depth: 10,
    height: 30,
    rotation: 0,
    locked: false,
    hidden: false,
    ...overrides,
  };
}

describe("printer presets", () => {
  it("have unique ids and sane build volumes", () => {
    expect(new Set(PRINTER_PRESETS.map((preset) => preset.id)).size).toBe(PRINTER_PRESETS.length);
    for (const preset of PRINTER_PRESETS) {
      expect(preset.width).toBeGreaterThanOrEqual(100);
      expect(preset.depth).toBeGreaterThanOrEqual(100);
      expect(preset.height).toBeGreaterThanOrEqual(100);
      expect(preset.width).toBeLessThanOrEqual(1000);
    }
  });

  it("are found by id", () => {
    expect(printerPresetById("bambu-lab-a1")).toMatchObject({ vendor: "Bambu Lab", model: "A1", width: 256, depth: 256, height: 256 });
    expect(printerPresetById("prusa-mk4")).toMatchObject({ width: 250, depth: 210 });
    expect(printerPresetById("no-such-printer")).toBeNull();
    expect(printerPresetById("")).toBeNull();
  });
});

describe("shapeBedFootprint", () => {
  it("is the plain box for an unturned body", () => {
    expect(shapeBedFootprint(shape({ x: 5, z: -3 }))).toEqual({ minX: -5, maxX: 15, minZ: -8, maxZ: 2 });
  });

  it("swaps width and depth after a quarter turn", () => {
    const footprint = shapeBedFootprint(shape({ rotation: 90 }));
    expect(footprint.maxX - footprint.minX).toBeCloseTo(10);
    expect(footprint.maxZ - footprint.minZ).toBeCloseTo(20);
  });

  it("lays the height flat when the body is tipped over", () => {
    const footprint = shapeBedFootprint(shape({ rotationX: 90 }));
    expect(footprint.maxX - footprint.minX).toBeCloseTo(20);
    expect(footprint.maxZ - footprint.minZ).toBeCloseTo(30);
  });

  it("grows to the diagonal at 45 degrees", () => {
    const footprint = shapeBedFootprint(shape({ width: 20, depth: 20, rotation: 45 }));
    expect(footprint.maxX - footprint.minX).toBeCloseTo(20 * Math.SQRT2);
  });
});

describe("bedOverhangs", () => {
  it("reports nothing while everything stands on the plate", () => {
    expect(bedOverhangs([shape(), shape({ id: "edge", x: 90 })], 200, 200)).toEqual([]);
  });

  it("names the side and the amount a body reaches past", () => {
    const [overhang] = bedOverhangs([shape({ x: 95, z: -98 })], 200, 200);
    expect(overhang.right).toBeCloseTo(5);
    expect(overhang.back).toBeCloseTo(3);
    expect(overhang.left).toBe(0);
    expect(overhang.front).toBe(0);
  });

  it("counts a body larger than the plate on both sides", () => {
    const [overhang] = bedOverhangs([shape({ width: 260 })], 256, 256);
    expect(overhang.left).toBeCloseTo(2);
    expect(overhang.right).toBeCloseTo(2);
  });

  it("reports a body taller than the build height", () => {
    const [overhang] = bedOverhangs([shape({ height: 270 })], 256, 256, 256);
    expect(overhang.top).toBeCloseTo(14);
    expect(Math.max(overhang.left, overhang.right, overhang.back, overhang.front)).toBe(0);
    expect(bedOverhangs([shape({ height: 256 })], 256, 256, 256)).toEqual([]);
  });

  it("counts height from the lowest body, as the slicer sets the model down", () => {
    // Floating 100 mm up, but only 200 mm tall: fits.
    expect(bedOverhangs([shape({ height: 200, elevation: 100 })], 256, 256, 256)).toEqual([]);
    // Stacked: 150 mm on top of a 150 mm body is 300 mm in all.
    const stack = bedOverhangs([shape({ id: "low", height: 150 }), shape({ id: "high", height: 150, elevation: 150 })], 256, 256, 256);
    expect(stack.map((entry) => entry.shape.id)).toEqual(["high"]);
    expect(stack[0].top).toBeCloseTo(44);
  });

  it("measures a tipped body by its turned height", () => {
    // 30 mm tall, 20 wide - laid on its side it is 20 mm tall.
    expect(bedOverhangs([shape({ height: 300, width: 20, rotationZ: 90 })], 400, 400, 256)).toEqual([]);
    expect(bedOverhangs([shape({ height: 300, width: 20 })], 400, 400, 256)).toHaveLength(1);
  });

  it("leaves height alone when no build height is given", () => {
    expect(bedOverhangs([shape({ height: 900 })], 256, 256)).toEqual([]);
  });

  it("ignores holes, hidden bodies and rulers", () => {
    expect(bedOverhangs([
      shape({ id: "hole", x: 500, hole: true }),
      shape({ id: "hidden", x: 500, hidden: true }),
      shape({ id: "ruler", x: 500, kind: "ruler" }),
    ], 200, 200)).toEqual([]);
  });
});
