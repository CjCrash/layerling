import { beforeAll, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { OcctKernel } from "occt-wasm";
import type { WorkplaneShape } from "@/types/layerling";
import { cadModifierProfileForShape } from "@/lib/cadProfileExtrusion";
import { profileExtrusionSolid } from "@/lib/cadProfileSolid";

/*
 * The round catalog shapes as exact bodies against the real kernel: ellipse,
 * oval cylinder, tube, half sphere, round roof and rounded box. Each is a
 * valid solid with the volume its outline predicts, standing where the
 * display mesh stands.
 */

function shape(kind: WorkplaneShape["kind"], extra: Partial<WorkplaneShape> = {}): WorkplaneShape {
  return { id: `test-${kind}`, name: kind, kind, x: 0, z: 0, elevation: 0, size: 20, width: 20, depth: 20, height: 10, rotation: 0, color: "#ff8800", ...extra } as WorkplaneShape;
}

describe("exact bodies for the round shapes with the real OCCT kernel", () => {
  let cad: OcctKernel;
  beforeAll(async () => {
    const wasm = join(dirname(fileURLToPath(import.meta.resolve("occt-wasm"))), "occt-wasm.wasm");
    cad = await OcctKernel.init({ wasm });
  });

  function build(source: WorkplaneShape) {
    const part = cadModifierProfileForShape(source);
    expect(part).not.toBeNull();
    const local = profileExtrusionSolid(cad, part!);
    const solid = part!.transform ? cad.transform(local, part!.transform) : local;
    expect(cad.isSolid(solid)).toBe(true);
    expect(cad.isValid(solid)).toBe(true);
    return solid;
  }

  it("ellipse: an elliptic prism with the exact area", () => {
    const solid = build(shape("ellipse", { x: 3, z: -2, elevation: 1, width: 26, depth: 16, height: 20 }));
    expect(cad.getVolume(solid)).toBeCloseTo(Math.PI * 13 * 8 * 20, 2);
    const box = cad.getBoundingBox(solid);
    expect(box.xmax - box.xmin).toBeCloseTo(26, 3);
    expect(box.zmax - box.zmin).toBeCloseTo(16, 3);
    expect(box.ymin).toBeCloseTo(1, 4);
    expect(box.ymax).toBeCloseTo(21, 4);
  });

  it("cylinder: only an oval one is a profile, a round one stays the analytic primitive", () => {
    expect(cadModifierProfileForShape(shape("cylinder", { width: 20, depth: 20 }))).toBeNull();
    const solid = build(shape("cylinder", { width: 30, depth: 20, height: 12 }));
    expect(cad.getVolume(solid)).toBeCloseTo(Math.PI * 15 * 10 * 12, 2);
  });

  it("tube: outer ellipse minus inner ellipse, the wall from bevel", () => {
    const solid = build(shape("tube", { width: 34, depth: 34, height: 28, bevel: 6 }));
    expect(cad.getVolume(solid)).toBeCloseTo(Math.PI * (17 ** 2 - 11 ** 2) * 28, 2);
    expect(cad.subShapeCount(solid, "face")).toBeGreaterThanOrEqual(4);
    const oval = build(shape("tube", { width: 40, depth: 24, height: 10, bevel: 3 }));
    expect(cad.getVolume(oval)).toBeCloseTo(Math.PI * (20 * 12 - 17 * 9) * 10, 2);
  });

  it("halfSphere: a dome standing on its flat base", () => {
    const solid = build(shape("halfSphere", { x: 1, z: 2, elevation: 3, width: 22, depth: 22, height: 11 }));
    expect(cad.getVolume(solid)).toBeCloseTo((2 / 3) * Math.PI * 11 ** 3, 1);
    const box = cad.getBoundingBox(solid);
    expect(box.ymin).toBeCloseTo(3, 4);
    expect(box.ymax).toBeCloseTo(14, 3);
    expect(box.xmax - box.xmin).toBeCloseTo(22, 3);
    expect(cad.subShapeCount(solid, "face")).toBe(2);
    const flatter = build(shape("halfSphere", { width: 22, depth: 22, height: 8 }));
    expect(cad.getVolume(flatter)).toBeCloseTo((2 / 3) * Math.PI * 11 * 11 * 8, 1);
    expect(cadModifierProfileForShape(shape("halfSphere", { width: 22, depth: 30, height: 11 }))).toBeNull();
  });

  it("roundRoof: a half ellipse along the depth, curved side up", () => {
    const solid = build(shape("roundRoof", { x: -4, z: 5, elevation: 2, width: 20, depth: 30, height: 10 }));
    expect(cad.getVolume(solid)).toBeCloseTo((Math.PI / 2) * 10 * 10 * 30, 1);
    const box = cad.getBoundingBox(solid);
    expect(box.ymin).toBeCloseTo(2, 4);
    expect(box.ymax).toBeCloseTo(12, 3);
    expect(box.xmin).toBeCloseTo(-14, 3);
    expect(box.xmax).toBeCloseTo(6, 3);
    expect(box.zmin).toBeCloseTo(-10, 3);
    expect(box.zmax).toBeCloseTo(20, 3);
  });

  it("roundedBox: rounded corners exactly, rounded ends when asked", () => {
    const plain = build(shape("roundedBox", { width: 40, depth: 30, height: 20, cornerFillet: 5, topBottomFillet: 0 }));
    expect(cad.getVolume(plain)).toBeCloseTo((40 * 30 - (4 - Math.PI) * 25) * 20, 2);
    const rounded = build(shape("roundedBox", { width: 40, depth: 30, height: 20, cornerFillet: 5, topBottomFillet: 2 }));
    expect(cad.getVolume(rounded)).toBeLessThan(cad.getVolume(plain));
    expect(cad.getVolume(rounded)).toBeGreaterThan(cad.getVolume(plain) * 0.95);
  });

  it("roundedBox: sharp corners are a plain rectangle", () => {
    const solid = build(shape("roundedBox", { width: 40, depth: 30, height: 20, cornerFillet: 0, topBottomFillet: 0 }));
    expect(cad.getVolume(solid)).toBeCloseTo(40 * 30 * 20, 3);
  });
});
