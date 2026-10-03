import { describe, expect, it } from "vitest";
import { generateSectionSvg, type SectionMeshSource } from "@/lib/sectionSvg";

describe("generateSectionSvg", () => {
  // A simple 20x20x20 box centered at (0, 0, 0)
  // min: (-10, -10, -10), max: (10, 10, 10)
  function createBoxSource(): SectionMeshSource {
    const p = 10;
    const m = -10;
    // 8 vertices
    const vertices = [
      m, m, m, // 0
      p, m, m, // 1
      p, p, m, // 2
      m, p, m, // 3
      m, m, p, // 4
      p, m, p, // 5
      p, p, p, // 6
      m, p, p, // 7
    ];
    // 12 triangles (2 per face)
    const indices = [
      // front (z = p)
      4, 5, 6, 4, 6, 7,
      // back (z = m)
      1, 0, 3, 1, 3, 2,
      // top (y = p)
      3, 2, 6, 3, 6, 7,
      // bottom (y = m)
      4, 5, 1, 4, 1, 0,
      // right (x = p)
      1, 5, 6, 1, 6, 2,
      // left (x = m)
      0, 4, 7, 0, 7, 3,
    ];
    return {
      positions: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      color: "#ff5500",
      name: "TestBox",
    };
  }

  it("slices a box along Z axis and produces a 2D rectangular SVG path", () => {
    const box = createBoxSource();
    // Plane cut at Z = 0: normal = (0, 0, 1), constant = 0
    const result = generateSectionSvg([box], { normal: { x: 0, y: 0, z: 1 }, constant: 0 }, "z", "Box Cut Z");

    expect(result.segmentCount).toBeGreaterThan(0);
    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("</svg>");
    expect(result.svg).toContain("<path");
    expect(result.svg).toContain('data-name="TestBox"');
    expect(result.svg).toContain('stroke="#ff5500"');
    // Content width and height should be approximately 20mm
    expect(result.bounds.width).toBeCloseTo(20, 1);
    expect(result.bounds.height).toBeCloseTo(20, 1);
  });

  it("slices a box along X axis", () => {
    const box = createBoxSource();
    // Plane cut at X = 0: normal = (1, 0, 0), constant = 0
    const result = generateSectionSvg([box], { normal: { x: 1, y: 0, z: 0 }, constant: 0 }, "x", "Box Cut X");

    expect(result.segmentCount).toBeGreaterThan(0);
    expect(result.svg).toContain("<svg");
    expect(result.bounds.width).toBeCloseTo(20, 1);
    expect(result.bounds.height).toBeCloseTo(20, 1);
  });

  it("slices a box along Y axis", () => {
    const box = createBoxSource();
    // Plane cut at Y = 0: normal = (0, 1, 0), constant = 0
    const result = generateSectionSvg([box], { normal: { x: 0, y: 1, z: 0 }, constant: 0 }, "y", "Box Cut Y");

    expect(result.segmentCount).toBeGreaterThan(0);
    expect(result.svg).toContain("<svg");
    expect(result.bounds.width).toBeCloseTo(20, 1);
    expect(result.bounds.height).toBeCloseTo(20, 1);
  });

  it("returns fallback empty SVG when plane does not intersect the mesh", () => {
    const box = createBoxSource();
    // Plane at Z = 50: box is in [-10, 10], so no intersection
    const result = generateSectionSvg([box], { normal: { x: 0, y: 0, z: 1 }, constant: -50 }, "z");

    expect(result.segmentCount).toBe(0);
    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("No section cut geometry");
  });

  it("applies matrixWorld transformation before slicing", () => {
    const box = createBoxSource();
    // Transform matrix: translate +20 in X
    const m = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      20, 0, 0, 1,
    ];
    box.matrixWorldElements = m;

    const result = generateSectionSvg([box], { normal: { x: 0, y: 0, z: 1 }, constant: 0 }, "z");
    expect(result.segmentCount).toBeGreaterThan(0);
    // Bounds in U (which is X) should now be centered around +20, i.e. [10, 30]
    expect(result.bounds.minU).toBeCloseTo(10, 1);
    expect(result.bounds.maxU).toBeCloseTo(30, 1);
  });
});
