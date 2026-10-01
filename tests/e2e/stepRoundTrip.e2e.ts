import { beforeAll, describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { WorkplaneShape } from "@/types/layerling";

// Drive the REAL exporter/importer against the REAL OpenCascade kernel, loaded
// from node_modules instead of the browser-only /occt/ URL. Everything else in
// stepExport.ts / stepImport.ts runs unmodified.
vi.mock("@/lib/brepKernel", async () => {
  const brep = await import("brepjs");
  const { OcctKernel } = await import("occt-wasm");
  const wasm = join(dirname(fileURLToPath(import.meta.resolve("occt-wasm"))), "occt-wasm.wasm");
  let ready: Promise<typeof brep> | null = null;
  let raw: Awaited<ReturnType<typeof OcctKernel.init>> | null = null;
  return {
    occtKernel: () => raw,
    loadBrepWithOcct: () =>
      (ready ??= (async () => {
        const kernel = await OcctKernel.init({ wasm });
        raw = kernel;
        brep.registerKernel("occt-wasm", brep.OcctWasmAdapter.fromKernel(kernel));
        return brep;
      })()),
  };
});

let brep: typeof import("brepjs");
let exportShapesToStep: typeof import("@/lib/stepExport").exportShapesToStep;
let importedShapeFromStep: typeof import("@/lib/stepImport").importedShapeFromStep;

beforeAll(async () => {
  brep = await import("brepjs");
  ({ exportShapesToStep } = await import("@/lib/stepExport"));
  ({ importedShapeFromStep } = await import("@/lib/stepImport"));
  // Warm the kernel via the mocked loader so brepjs has a registered kernel for
  // the re-import assertions below.
  const { loadBrepWithOcct } = await import("@/lib/brepKernel");
  await loadBrepWithOcct();
});

function shape(overrides: Partial<WorkplaneShape>): WorkplaneShape {
  return {
    id: Math.random().toString(36).slice(2),
    name: "Shape",
    kind: "box",
    color: "#0098c7",
    x: 0,
    z: 0,
    size: 10,
    width: 10,
    depth: 10,
    height: 10,
    rotation: 0,
    ...overrides,
  };
}

async function reimportVolume(blob: Blob): Promise<number> {
  const r = await brep.importSTEP(blob);
  if (!r.ok) throw new Error(`reimport failed: ${String(r.error?.message ?? r.error)}`);
  const v = brep.measureVolume(r.value);
  if (!v.ok) throw new Error("measureVolume failed");
  return v.value;
}

const PI = Math.PI;
const near = (a: number, b: number, relTol = 0.01) => Math.abs(a - b) <= relTol * Math.abs(b) + 1e-6;

describe("STEP export round-trip (real OCCT kernel)", () => {
  it("exports box + cylinder + sphere as exact B-Rep with conserved volume", async () => {
    const box = shape({ kind: "box", name: "Box", x: -30, width: 10, depth: 6, height: 4 });
    const cyl = shape({ kind: "cylinder", name: "Cyl", x: 0, width: 8, depth: 8, height: 12 });
    const sph = shape({ kind: "sphere", name: "Sph", x: 30, width: 10, depth: 10, height: 10 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([box, cyl, sph]);
    expect(exportedCount).toBe(3);
    expect(skipped).toEqual([]);

    const expected = 10 * 6 * 4 + PI * 4 * 4 * 12 + (4 / 3) * PI * 5 ** 3;
    expect(near(await reimportVolume(blob), expected)).toBe(true);
  });

  it("subtracts an overlapping hole and conserves the cut volume", async () => {
    const body = shape({ kind: "box", name: "Plate", width: 20, depth: 20, height: 10, elevation: 0 });
    // Cylinder hole punched fully through the plate's full height (overhangs both faces).
    const hole = shape({ kind: "cylinder", name: "Bore", hole: true, width: 6, depth: 6, height: 14, elevation: -2 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([body, hole]);
    expect(exportedCount).toBe(1);
    expect(skipped).toEqual([]);

    const expected = 20 * 20 * 10 - PI * 3 * 3 * 10;
    expect(near(await reimportVolume(blob), expected)).toBe(true);
  });

  it("leaves a body untouched when the hole's AABB does not reach it", async () => {
    const body = shape({ kind: "box", name: "Plate", x: 0, width: 10, depth: 10, height: 10 });
    const farHole = shape({ kind: "cylinder", name: "Bore", hole: true, x: 500, width: 4, depth: 4, height: 20 });

    const { blob } = await exportShapesToStep([body, farHole]);
    expect(near(await reimportVolume(blob), 1000)).toBe(true);
  });

  it("exports a full cone in a multi-solid assembly with conserved volume (occt-wasm 3.6.1 fix)", async () => {
    const cone = shape({ kind: "cone", name: "Cone", x: -20, width: 8, depth: 8, height: 10, baseRadius: 4, topRadius: 0 });
    const box = shape({ kind: "box", name: "Box", x: 20, width: 6, depth: 6, height: 6 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([cone, box]);
    expect(exportedCount).toBe(2);
    expect(skipped).toEqual([]);

    const expected = (1 / 3) * PI * 4 * 4 * 10 + 6 * 6 * 6;
    expect(near(await reimportVolume(blob), expected)).toBe(true);
  });

  it("exports a truncated cone with conserved volume", async () => {
    const frustum = shape({ kind: "cone", name: "Frustum", width: 10, depth: 10, height: 12, baseRadius: 5, topRadius: 2 });
    const { blob, exportedCount } = await exportShapesToStep([frustum]);
    expect(exportedCount).toBe(1);
    // Frustum volume = (π h / 3)(R² + R r + r²), with R=5, r=2, h=12.
    const expected = (PI * 12 / 3) * (25 + 10 + 4);
    expect(near(await reimportVolume(blob), expected)).toBe(true);
  });

  it("skips non-exact shapes with descriptive reasons but still exports the rest", async () => {
    const box = shape({ kind: "box", name: "Box", width: 8, depth: 8, height: 8 });
    const pyramid = shape({ kind: "pyramid", name: "Pyramid", width: 8, depth: 8, height: 8 });
    const meshNoBrep = shape({ kind: "mesh", name: "RawMesh" });

    const { exportedCount, skipped } = await exportShapesToStep([box, pyramid, meshNoBrep]);
    expect(exportedCount).toBe(1);
    expect(skipped.map((s) => s.kind).sort()).toEqual(["mesh", "pyramid"]);
    expect(skipped.find((s) => s.kind === "pyramid")?.reason).toMatch(/no exact B-Rep mapping/i);
    expect(skipped.find((s) => s.kind === "mesh")?.reason).toMatch(/no B-Rep source/i);
  });

  it("exports outline shapes as exact bodies with the volume their outline predicts", async () => {
    const ellipse = shape({ kind: "ellipse", name: "Ellipse", x: -60, width: 26, depth: 16, height: 20 });
    const tube = shape({ kind: "tube", name: "Tube", x: -20, width: 34, depth: 34, height: 28, bevel: 6 });
    const dome = shape({ kind: "halfSphere", name: "Dome", x: 20, width: 22, depth: 22, height: 11 });
    const roof = shape({ kind: "roundRoof", name: "Roof", x: 60, width: 20, depth: 30, height: 10 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([ellipse, tube, dome, roof]);
    expect(exportedCount).toBe(4);
    expect(skipped).toEqual([]);

    const expected = PI * 13 * 8 * 20 + PI * (17 ** 2 - 11 ** 2) * 28 + (2 / 3) * PI * 11 ** 3 + (PI / 2) * 10 * 10 * 30;
    expect(near(await reimportVolume(blob), expected)).toBe(true);
  });

  it("exports an oval dome and an oval cone at their drawn size", async () => {
    const cases = [
      { source: shape({ kind: "halfSphere", name: "Oval dome", width: 30, depth: 20, height: 10 }), box: [-15, -10, 0, 15, 10, 10] },
      { source: shape({ kind: "cone", name: "Oval cone", width: 30, depth: 15, height: 15, baseRadius: 15, topRadius: 0 }), box: [-15, -7.5, 0, 15, 7.5, 15] },
      { source: shape({ kind: "cone", name: "Oval frustum", width: 30, depth: 15, height: 15, baseRadius: 15, topRadius: 4 }), box: [-15, -7.5, 0, 15, 7.5, 15] },
    ];
    const { occtKernel } = await import("@/lib/brepKernel");
    const kernel = occtKernel()!;
    for (const { source, box } of cases) {
      const { blob, exportedCount, skipped } = await exportShapesToStep([source]);
      expect(exportedCount).toBe(1);
      expect(skipped).toEqual([]);
      // Measured on a mesh of the re-imported body (the kernel's own box is loose on B-spline
      // faces), in STEP's Z-up frame: depth along -Y, height along Z.
      const { positions } = kernel.tessellate(kernel.importStep(await blob.text()), { linearDeflection: 0.01, angularDeflection: 0.2 });
      const bounds = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
      for (let index = 0; index < positions.length; index += 3) {
        for (let axis = 0; axis < 3; axis += 1) {
          bounds[axis] = Math.min(bounds[axis], positions[index + axis]);
          bounds[axis + 3] = Math.max(bounds[axis + 3], positions[index + axis]);
        }
      }
      bounds.forEach((value, index) => expect(Math.abs(value - box[index])).toBeLessThan(0.02));
    }
  });

  it("exports round shapes round whatever their side count, as before", async () => {
    const dome = shape({ kind: "halfSphere", name: "Faceted dome", x: -40, width: 30, depth: 30, height: 15, steps: 8 });
    const cone = shape({ kind: "cone", name: "Six-sided oval cone", x: 0, width: 30, depth: 15, height: 15, baseRadius: 15, topRadius: 0, sides: 6 });
    const ellipse = shape({ kind: "ellipse", name: "Eight-sided ellipse", x: 40, width: 26, depth: 16, height: 20, sides: 8 });
    const { blob, exportedCount, skipped } = await exportShapesToStep([dome, cone, ellipse]);
    expect(skipped).toEqual([]);
    expect(exportedCount).toBe(3);
    const expected = (2 / 3) * PI * 15 ** 3 + (PI * 15 * 7.5 * 15) / 3 + PI * 13 * 8 * 20;
    // The pointed oval cone is a B-spline body; OCCT's volume of it runs about 1 % high.
    expect(Math.abs(await reimportVolume(blob) - expected) / expected).toBeLessThan(0.01);
  });

  it("exports a star, a heart and a teardrop instead of skipping them", async () => {
    const star = shape({ kind: "star", name: "Star", x: -30, width: 20, depth: 20, height: 5 });
    const heart = shape({ kind: "heart", name: "Heart", x: 0, width: 20, depth: 20, height: 5 });
    const teardrop = shape({ kind: "teardrop", name: "Teardrop", x: 30, width: 6, depth: 20, height: 3 + 3 * Math.SQRT2 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([star, heart, teardrop]);
    expect(exportedCount).toBe(3);
    expect(skipped).toEqual([]);
    expect(await reimportVolume(blob)).toBeGreaterThan(0);
  });

  it("cuts a counterbore out of a plate", async () => {
    const plate = shape({ kind: "box", name: "Plate", width: 20, depth: 20, height: 20 });
    const bore = shape({ kind: "counterbore", name: "Bore", hole: true, width: 6.4, depth: 6.4, height: 12, elevation: 8.1, screwHoleShaft: 3.4, screwHoleHeadDepth: 3.2 });

    const { blob, exportedCount, skipped } = await exportShapesToStep([plate, bore]);
    expect(exportedCount).toBe(1);
    expect(skipped).toEqual([]);

    // Shaft from 8.1 to 16.9, head pocket from 16.9 up to the top of the plate at 20.
    const expected = 20 * 20 * 20 - PI * 1.7 ** 2 * (16.9 - 8.1) - PI * 3.2 ** 2 * (20 - 16.9);
    expect(near(await reimportVolume(blob), expected, 0.001)).toBe(true);
  });

  it("throws when there is nothing exact to export", async () => {
    await expect(exportShapesToStep([shape({ kind: "pyramid", name: "Pyramid" })])).rejects.toThrow(/No exportable B-Rep solids/i);
  });
});

describe("STEP import → re-export round-trip (real OCCT kernel)", () => {
  it("imports a STEP body, stores its B-Rep, and re-exports it losslessly", async () => {
    // Author a source STEP file straight from the kernel: a 12×8×6 box in CAD Z-up.
    const src = brep.exportSTEP(brep.box(12, 8, 6, { centered: true }));
    expect(src.ok).toBe(true);
    const bytes = await (src as { value: Blob }).value.arrayBuffer();

    const imported = await importedShapeFromStep("widget.step", bytes);
    expect(imported.kind).toBe("mesh");
    expect(imported.importedMesh?.sourceFormat).toBe("step");
    expect(imported.importedMesh?.brepStep).toBeTruthy();
    // Importer maps CAD Z-up (X12,Y8,Z6) to Layerling Y-up (width12, height6, depth8).
    expect(near(imported.importedMesh!.baseWidth, 12)).toBe(true);
    expect(near(imported.importedMesh!.baseHeight, 6)).toBe(true);
    expect(near(imported.importedMesh!.baseDepth, 8)).toBe(true);

    // Re-export the imported body at native size and confirm volume survives the
    // import-normalize → store → re-emit pipeline.
    const reexport = await exportShapesToStep([imported]);
    expect(reexport.exportedCount).toBe(1);
    expect(reexport.skipped).toEqual([]);
    expect(near(await reimportVolume(reexport.blob), 12 * 8 * 6)).toBe(true);
  });
});
