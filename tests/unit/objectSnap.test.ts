import { describe, expect, it } from "vitest";
import { objectSnapOffset, type SnapBox } from "@/lib/objectSnap";

const box = (minX: number, maxX: number, minZ: number, maxZ: number): SnapBox => ({ minX, maxX, minZ, maxZ });

describe("objectSnapOffset", () => {
  it("lays the moving edge against a neighbour's edge within the threshold", () => {
    const result = objectSnapOffset(box(21.2, 41.2, 50, 70), [box(0, 20, 0, 20)], 2);
    expect(result.dx).toBeCloseTo(-1.2);
    expect(result.dz).toBeNull();
    expect(result.guides).toEqual([{ axis: "x", value: 20, from: 0, to: 70 }]);
  });

  it("snaps centres onto centres", () => {
    const result = objectSnapOffset(box(-4.5, 5.5, 30, 40), [box(-10, 10, -10, 10)], 1);
    // The centre line (0.5 -> 0) is the nearest; edges are 5.5 and 4.5 away.
    expect(result.dx).toBeCloseTo(-0.5);
  });

  it("takes the nearest of several candidates on each axis independently", () => {
    const result = objectSnapOffset(box(9, 19, 9.6, 19.6), [box(0, 10, 0, 10), box(30, 40, 20, 30)], 1.5);
    expect(result.dx).toBeCloseTo(1); // 9 -> 10
    expect(result.dz).toBeCloseTo(0.4); // 19.6 -> 20
    // After the shift the box also lines up with the first neighbour at z = 10.
    expect(result.guides.map((guide) => `${guide.axis}${guide.value}`).sort()).toEqual(["x10", "z10", "z20"]);
  });

  it("leaves the box alone when nothing is close enough", () => {
    expect(objectSnapOffset(box(50, 60, 50, 60), [box(0, 10, 0, 10)], 2)).toEqual({ dx: null, dz: null, guides: [] });
  });

  it("does nothing without targets or with a zero threshold", () => {
    expect(objectSnapOffset(box(0, 1, 0, 1), [], 5).dx).toBeNull();
    expect(objectSnapOffset(box(0, 1, 0, 1), [box(0, 1, 0, 1)], 0).dx).toBeNull();
  });

  it("merges guides for the same line from several targets", () => {
    const result = objectSnapOffset(box(10.5, 20.5, 0, 10), [box(0, 10, 20, 30), box(0, 10, -30, -20)], 1);
    const xGuides = result.guides.filter((guide) => guide.axis === "x");
    expect(xGuides).toEqual([{ axis: "x", value: 10, from: -30, to: 30 }]);
  });
});
