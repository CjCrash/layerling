import { describe, expect, it } from "vitest";
import { applySegmentDimension } from "@/lib/sketchDimensions";
import type { SketchPoint, SketchSegment } from "@/types/layerling";

describe("applySegmentDimension", () => {
  it("resizes a horizontal line from 10mm to 25mm anchoring start point", () => {
    const p1: SketchPoint = { id: "p1", x: 0, z: 0 };
    const p2: SketchPoint = { id: "p2", x: 10, z: 0 };
    const segment: SketchSegment = { id: "s1", startId: "p1", endId: "p2", kind: "line" };

    const result = applySegmentDimension(segment, [p1, p2], 25);
    const updatedP1 = result.find((p) => p.id === "p1")!;
    const updatedP2 = result.find((p) => p.id === "p2")!;

    expect(updatedP1.x).toBe(0);
    expect(updatedP1.z).toBe(0);
    expect(updatedP2.x).toBe(25);
    expect(updatedP2.z).toBe(0);
  });

  it("resizes a vertical line anchoring end point when requested", () => {
    const p1: SketchPoint = { id: "p1", x: 5, z: 10 };
    const p2: SketchPoint = { id: "p2", x: 5, z: 40 };
    const segment: SketchSegment = { id: "s1", startId: "p1", endId: "p2", kind: "line" };

    // Anchor p2, so p1 moves. Target length 15mm.
    const result = applySegmentDimension(segment, [p1, p2], 15, "p2");
    const updatedP1 = result.find((p) => p.id === "p1")!;
    const updatedP2 = result.find((p) => p.id === "p2")!;

    expect(updatedP2.x).toBe(5);
    expect(updatedP2.z).toBe(40);
    expect(updatedP1.x).toBe(5);
    expect(updatedP1.z).toBe(25); // 40 - 15 = 25
  });

  it("preserves angle on diagonal lines", () => {
    const p1: SketchPoint = { id: "p1", x: 0, z: 0 };
    const p2: SketchPoint = { id: "p2", x: 3, z: 4 }; // Length 5
    const segment: SketchSegment = { id: "s1", startId: "p1", endId: "p2", kind: "line" };

    const result = applySegmentDimension(segment, [p1, p2], 10);
    const updatedP2 = result.find((p) => p.id === "p2")!;

    expect(updatedP2.x).toBeCloseTo(6);
    expect(updatedP2.z).toBeCloseTo(8);
  });

  it("translates handles on moving point", () => {
    const p1: SketchPoint = { id: "p1", x: 0, z: 0 };
    const p2: SketchPoint = { id: "p2", x: 10, z: 0, handleIn: { x: 8, z: 2 } };
    const segment: SketchSegment = { id: "s1", startId: "p1", endId: "p2", kind: "line" };

    const result = applySegmentDimension(segment, [p1, p2], 20);
    const updatedP2 = result.find((p) => p.id === "p2")!;

    expect(updatedP2.x).toBe(20);
    expect(updatedP2.handleIn?.x).toBe(18); // 8 + 10
    expect(updatedP2.handleIn?.z).toBe(2);
  });

  it("returns unchanged points on invalid length or zero-length segment", () => {
    const p1: SketchPoint = { id: "p1", x: 0, z: 0 };
    const p2: SketchPoint = { id: "p2", x: 10, z: 0 };
    const segment: SketchSegment = { id: "s1", startId: "p1", endId: "p2", kind: "line" };

    expect(applySegmentDimension(segment, [p1, p2], -5)).toEqual([p1, p2]);
    expect(applySegmentDimension(segment, [p1, p2], 0)).toEqual([p1, p2]);
    expect(applySegmentDimension(segment, [p1, p2], NaN)).toEqual([p1, p2]);

    const zeroSegment: SketchSegment = { id: "s2", startId: "p1", endId: "p1", kind: "line" };
    expect(applySegmentDimension(zeroSegment, [p1], 20)).toEqual([p1]);
  });
});
