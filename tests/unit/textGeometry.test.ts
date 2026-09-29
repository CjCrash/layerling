import { beforeAll, describe, expect, it } from "vitest";
import { loadTextFonts } from "@/lib/textFonts";
import { createTextGeometry } from "@/lib/textGeometry";
import type { WorkplaneShape } from "@/types/layerling";

function mockShape(overrides: Partial<WorkplaneShape> = {}): WorkplaneShape {
  return {
    id: "test-text",
    name: "Text",
    kind: "text",
    color: "#ff0000",
    x: 0,
    z: 0,
    size: 40,
    width: 40,
    depth: 20,
    height: 10,
    rotation: 0,
    text: "TEST",
    ...overrides,
  };
}

describe("textGeometry", () => {
  beforeAll(async () => {
    await loadTextFonts();
  });

  it("builds flat linear text geometry with correct height and centered base", () => {
    const shape = mockShape({ text: "HELLO", height: 8 });
    const geometry = createTextGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    expect(box.min.y).toBeCloseTo(0, 3);
    expect(box.max.y).toBeCloseTo(8, 3);
    expect(box.min.x).toBeLessThan(0);
    expect(box.max.x).toBeGreaterThan(0);
  });

  it("builds curved text geometry along an arc", () => {
    const shape = mockShape({
      text: "CIRCULAR",
      textCurved: true,
      textRadius: 40,
      height: 6,
    });
    const geometry = createTextGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    expect(box.min.y).toBeCloseTo(0, 3);
    expect(box.max.y).toBeCloseTo(6, 3);
    // Position attribute must be present and contain triangles
    const pos = geometry.getAttribute("position");
    expect(pos.count).toBeGreaterThan(100);
  });

  it("supports inward facing curved text", () => {
    const shape = mockShape({
      text: "INWARD",
      textCurved: true,
      textRadius: 35,
      textInward: true,
      height: 5,
    });
    const geometry = createTextGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    expect(box.min.y).toBeCloseTo(0, 3);
    expect(box.max.y).toBeCloseTo(5, 3);
    const pos = geometry.getAttribute("position");
    expect(pos.count).toBeGreaterThan(100);
  });

  it("handles spaces and whitespace gracefully", () => {
    const shape = mockShape({
      text: "A B C",
      textCurved: true,
      textRadius: 50,
      height: 4,
    });
    const geometry = createTextGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    expect(box.min.y).toBeCloseTo(0, 3);
    expect(box.max.y).toBeCloseTo(4, 3);
  });
});
