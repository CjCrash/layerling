import { beforeAll, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as THREE from "three";
import { OcctKernel, type ShapeHandle } from "occt-wasm";
import type { WorkplaneShape } from "@/types/layerling";
import { cadModifierThreadForShape, cadProfileExpectation } from "@/lib/cadProfileExtrusion";
import { cadProfileSolidMismatch } from "@/lib/cadProfileSolid";
import { cadTransformRequiresGeneralTransform } from "@/lib/cadModifierRuntime";
import { threadPartSolid } from "@/lib/threadSolid";
import { createThreadGeometry, threadNaturalFootprint, threadNaturalHeight, threadProfileShape, threadSettings, MIN_THREAD_QUALITY, WHITWORTH_PROFILE_CONSTANTS } from "@/lib/threadGeometry";
import { meshYawDegrees, mirrorSign } from "@/lib/workplaneShapes";

/*
 * The thread's exact body against its display mesh, built by the real
 * createThreadGeometry and placed as transformMesh places it (copied here,
 * as LayerlingEditor.tsx keeps it to itself; threads take no taper, twist or
 * lean). Bounds and volume cannot tell a left-hand thread from a right-hand
 * one, or a thread half a turn out of phase, so points just inside and just
 * outside the drawn flanks are also tested against the body.
 */

type Vec3 = [number, number, number];

let cad: OcctKernel;

beforeAll(async () => {
  const wasm = join(dirname(fileURLToPath(import.meta.resolve("occt-wasm"))), "occt-wasm.wasm");
  cad = await OcctKernel.init({ wasm });
});

function thread(extra: Partial<WorkplaneShape> = {}): WorkplaneShape {
  const fields = { threadDiameter: 6, threadPitch: 1, ...extra } as WorkplaneShape;
  const settings = threadSettings(fields);
  const footprint = threadNaturalFootprint(settings);
  return {
    id: "t", name: "Thread", kind: "thread", color: "#888888", x: 0, z: 0, elevation: 0, rotation: 0,
    width: footprint.width, depth: footprint.depth, size: Math.max(footprint.width, footprint.depth), height: threadNaturalHeight(settings),
    ...fields,
  } as WorkplaneShape;
}

/** The display mesh in world space, with each vertex's normal. */
function displayMesh(shape: WorkplaneShape) {
  const geometry = createThreadGeometry({ ...shape, width: shape.width, depth: shape.depth ?? shape.width, height: shape.height });
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  if (!flat.getAttribute("normal")) flat.computeVertexNormals();
  const position = flat.getAttribute("position");
  const normal = flat.getAttribute("normal");
  const centerY = shape.height / 2;
  const rotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(shape.rotationX ?? 0), THREE.MathUtils.degToRad(meshYawDegrees(shape)), THREE.MathUtils.degToRad(shape.rotationZ ?? 0), "XYZ"));
  const mirror = new THREE.Vector3(mirrorSign(shape.mirrorX), mirrorSign(shape.mirrorY), mirrorSign(shape.mirrorZ));
  const vertices: Vec3[] = [];
  const normals: Vec3[] = [];
  const local: Vec3[] = [];
  for (let i = 0; i < position.count; i += 1) {
    local.push([position.getX(i), position.getY(i), position.getZ(i)]);
    const v = new THREE.Vector3(position.getX(i) * mirror.x, (position.getY(i) - centerY) * mirror.y, position.getZ(i) * mirror.z).applyMatrix4(rotation);
    vertices.push([v.x + shape.x, v.y + (shape.elevation ?? 0) + centerY, v.z + shape.z]);
    const n = new THREE.Vector3(normal.getX(i) * mirror.x, normal.getY(i) * mirror.y, normal.getZ(i) * mirror.z).applyMatrix4(rotation).normalize();
    normals.push([n.x, n.y, n.z]);
  }
  const faces: Vec3[] = [];
  const flip = [shape.mirrorX, shape.mirrorY, shape.mirrorZ].filter(Boolean).length % 2 === 1;
  for (let i = 0; i + 2 < vertices.length; i += 3) faces.push(flip ? [i, i + 2, i + 1] : [i, i + 1, i + 2]);
  return { vertices, normals, faces, local };
}

function body(shape: WorkplaneShape) {
  const part = cadModifierThreadForShape(shape);
  expect(part).not.toBeNull();
  const local = threadPartSolid(cad, part!);
  const t = part!.transform;
  return !t ? local : cadTransformRequiresGeneralTransform(t) ? cad.generalTransform(local, t) : cad.transform(local, t);
}

/** The body as fine triangles, for point-in-body tests by ray parity (a boolean per point is far too slow). */
function triangles(solid: ShapeHandle, deflection: number) {
  const copy = cad.copy(solid);
  const mesh = cad.tessellate(copy, { linearDeflection: deflection, angularDeflection: 0.5 });
  cad.release(copy);
  const tris: number[][] = [];
  for (let i = 0; i + 2 < mesh.indices.length; i += 3) {
    const t: number[] = [];
    for (let k = 0; k < 3; k += 1) t.push(mesh.positions[mesh.indices[i + k] * 3], mesh.positions[mesh.indices[i + k] * 3 + 1], mesh.positions[mesh.indices[i + k] * 3 + 2]);
    tris.push(t);
  }
  return tris;
}

/** Ray parity along a slightly skewed direction, so the ray does not graze edges. */
function inside(tris: number[][], p: Vec3) {
  const d = [1, 0.0137, 0.0071];
  let hits = 0;
  for (const t of tris) {
    const e1 = [t[3] - t[0], t[4] - t[1], t[5] - t[2]];
    const e2 = [t[6] - t[0], t[7] - t[1], t[8] - t[2]];
    const h = [d[1] * e2[2] - d[2] * e2[1], d[2] * e2[0] - d[0] * e2[2], d[0] * e2[1] - d[1] * e2[0]];
    const a = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
    if (Math.abs(a) < 1e-14) continue;
    const f = 1 / a;
    const sv = [p[0] - t[0], p[1] - t[1], p[2] - t[2]];
    const u = f * (sv[0] * h[0] + sv[1] * h[1] + sv[2] * h[2]);
    if (u < 0 || u > 1) continue;
    const q = [sv[1] * e1[2] - sv[2] * e1[1], sv[2] * e1[0] - sv[0] * e1[2], sv[0] * e1[1] - sv[1] * e1[0]];
    const v = f * (d[0] * q[0] + d[1] * q[1] + d[2] * q[2]);
    if (v < 0 || u + v > 1) continue;
    if (f * (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]) > 0) hits += 1;
  }
  return hits % 2 === 1;
}

describe("the thread's exact body", () => {
  const cases: Array<[string, Partial<WorkplaneShape>]> = [
    ["an M6 rod, V profile", {}],
    ["a left-hand M6 rod", { threadHand: "left" }],
    ["a trapezoidal rod", { threadProfile: "trapezoidal", threadDiameter: 10, threadPitch: 2 }],
    ["a round-profile rod", { threadProfile: "round", threadDiameter: 10, threadPitch: 2 }],
    ["a Whitworth G1/2 rod", { threadProfile: "whitworth", threadDiameter: 20.955, threadPitch: 25.4 / 14 }],
    ["a screw with a cylinder head", { threadRole: "screw" }],
    ["a screw with a hex head, both head rims chamfered", { threadRole: "screw", threadHead: "hex", threadHeadChamfer: 0.4 }],
    ["a countersunk screw", { threadRole: "screw", threadHead: "countersunk" }],
    ["a nut", { threadRole: "nut" }],
    ["a nut with chamfered rims, left hand", { threadRole: "nut", threadHeadChamfer: 0.5, threadHand: "left" }],
    ["a tapped hole", { threadRole: "bore", hole: true }],
    ["a rod turned, tipped and lifted", { rotation: 30, rotationX: 90, elevation: 4, x: 12, z: -5 }],
  ];

  it.each(cases)("matches the drawn %s", (_name, extra) => {
    const shape = thread(extra);
    const solid = body(shape);
    expect(cad.isValid(solid)).toBe(true);
    const mesh = displayMesh(shape);
    const expected = cadProfileExpectation(mesh.vertices, mesh.faces);
    expect(cadProfileSolidMismatch(cad, solid, expected)).toBeNull();
    expect(Math.abs(cad.getVolume(solid) - expected.volume) / expected.volume).toBeLessThan(0.01);
    // Points a little off the drawn thread flanks, away from its ends: inside below the surface, outside above it.
    const part = cadModifierThreadForShape(shape)!;
    const settings = threadSettings(shape);
    const depth = settings.pitch * 0.06;
    const tris = triangles(solid, depth * 0.1);
    const onFlank = mesh.local.map((v, i) => i).filter((i) => {
      const [x, y, z] = mesh.local[i];
      const radius = Math.hypot(x, z);
      return radius > part.minor - 1e-6 && radius < part.major + 1e-6 && y > part.shaftBottom + 2 * settings.pitch && y < part.height - 2 * settings.pitch;
    });
    const picks = onFlank.filter((_, k) => k % Math.max(1, Math.floor(onFlank.length / 24)) === 0).slice(0, 24);
    let tested = 0;
    for (const i of picks) {
      const v = mesh.vertices[i];
      const n = mesh.normals[i];
      if (!n.every(Number.isFinite)) continue;
      const inPoint: Vec3 = [v[0] - n[0] * depth, v[1] - n[1] * depth, v[2] - n[2] * depth];
      const outPoint: Vec3 = [v[0] + n[0] * depth, v[1] + n[1] * depth, v[2] + n[2] * depth];
      expect(inside(tris, inPoint)).toBe(true);
      expect(inside(tris, outPoint)).toBe(false);
      tested += 1;
    }
    expect(tested).toBeGreaterThan(8);
  });

  /*
   * The flank test above stands 0.06 pitch off the drawn surface, too far to
   * see the profile's shape: a Whitworth arc of half again its radius passed
   * it. Here the profile itself, in the half plane through +x where every
   * rod has a crest at its shaft bottom, a pitch at a time: points 0.002
   * pitch inside and outside it. The Whitworth body takes the true arcs, which
   * the drawn chords stray from by 0.0013 pitch; the other profiles take the
   * drawn points.
   */
  const profileCases: Array<[string, Partial<WorkplaneShape>]> = [
    ["V", {}],
    ["V, left hand", { threadHand: "left" }],
    ["trapezoidal", { threadProfile: "trapezoidal", threadDiameter: 10, threadPitch: 2 }],
    ["round", { threadProfile: "round", threadDiameter: 10, threadPitch: 2 }],
    ["Whitworth", { threadProfile: "whitworth", threadDiameter: 20.955, threadPitch: 25.4 / 14 }],
  ];

  it.each(profileCases)("follows the %s profile within 0.002 pitch", (_name, extra) => {
    const shape = thread(extra);
    const part = cadModifierThreadForShape(shape)!;
    const solid = threadPartSolid(cad, part);
    const { pitch, major, minor } = part;
    const settings = threadSettings(shape);
    // Pieces of one pitch from the crest, as (radius, height above it) at t in [0, 1], with the outward normal.
    type Piece = (t: number) => { r: number; y: number; nr: number; ny: number };
    const pieces: Piece[] = [];
    const line = (a: [number, number], b: [number, number]): Piece => (t) => {
      const dr = b[0] - a[0];
      const dy = b[1] - a[1];
      const length = Math.hypot(dr, dy);
      return { r: a[0] + dr * t, y: a[1] + dy * t, nr: dy / length, ny: -dr / length };
    };
    expect(part.curve?.kind).toBe(settings.profile === "whitworth" ? "whitworth" : undefined);
    if (settings.profile === "whitworth") {
      const radius = WHITWORTH_PROFILE_CONSTANTS.radiusPerPitch * pitch;
      const arcEnd = Math.PI / 2 - ((WHITWORTH_PROFILE_CONSTANTS.flankAngleDegrees / 2) * Math.PI) / 180;
      // Crest arcs bulge outwards from their centre, the root arc inwards to its own.
      const arc = (cr: number, cy: number, from: number, to: number, sign: 1 | -1): Piece => (t) => {
        const angle = from + (to - from) * t;
        return { r: cr + sign * radius * Math.cos(angle), y: cy + radius * Math.sin(angle), nr: sign * Math.cos(angle), ny: sign * Math.sin(angle) };
      };
      const root = (angle: number): [number, number] => [minor + radius - radius * Math.cos(angle), pitch / 2 + radius * Math.sin(angle)];
      const crest = (cy: number, angle: number): [number, number] => [major - radius + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
      pieces.push(arc(major - radius, 0, 0, arcEnd, 1), line(crest(0, arcEnd), root(-arcEnd)));
      const rootArc: Piece = (t) => {
        const angle = -arcEnd + 2 * arcEnd * t;
        return { r: minor + radius - radius * Math.cos(angle), y: pitch / 2 + radius * Math.sin(angle), nr: Math.cos(angle), ny: -Math.sin(angle) };
      };
      pieces.push(rootArc, line(root(arcEnd), crest(pitch, -arcEnd)), arc(major - radius, pitch, -arcEnd, 0, 1));
    } else {
      const points = threadProfileShape(settings.profile).points.map((point): [number, number] => [minor + (major - minor) * point.level, point.u * pitch]);
      points.push([points[0][0], pitch]);
      for (let index = 0; index + 1 < points.length; index += 1) pieces.push(line(points[index], points[index + 1]));
    }
    const offset = 0.002 * pitch;
    const base = part.shaftBottom + Math.round((part.height - part.shaftBottom) / 2 / pitch) * pitch;
    let tested = 0;
    for (const piece of pieces) {
      for (const t of [0.2, 0.5, 0.8]) {
        const p = piece(t);
        const at = (sign: number) => ({ x: p.r + sign * offset * p.nr, y: base + p.y + sign * offset * p.ny, z: 0 });
        expect(cad.containsPoint(solid, at(-1), 1e-7)).toBe(true);
        expect(cad.containsPoint(solid, at(1), 1e-7)).toBe(false);
        tested += 1;
      }
    }
    expect(tested).toBeGreaterThanOrEqual(9);
  });

  it("builds the same exact body at any quality, which only sets how finely the mesh is drawn", () => {
    const fine = thread();
    const coarse = thread({ threadQuality: MIN_THREAD_QUALITY });
    const solid = body(coarse);
    const mesh = displayMesh(coarse);
    expect(cadProfileSolidMismatch(cad, solid, cadProfileExpectation(mesh.vertices, mesh.faces))).toBeNull();
    expect(Math.abs(cad.getVolume(solid) - cad.getVolume(body(fine)))).toBeLessThan(1e-6 * cad.getVolume(solid));
  });

  it("takes edge treatment: the screw head's rims, and a block with a tapped hole", () => {
    // The cylinder head's two circular rims, filleted.
    const screw = body(thread({ threadRole: "screw" }));
    const rims = cad.getSubShapes(screw, "edge").filter((edge) => {
      if (cad.curveType(edge) !== "circle") return false;
      const box = cad.getBoundingBox(edge);
      return box.xmax - box.xmin > 9;
    });
    expect(rims.length).toBe(2);
    const filleted = cad.fillet(screw, rims, 0.5);
    expect(cad.isValid(filleted)).toBe(true);
    expect(cad.getVolume(filleted)).toBeLessThan(cad.getVolume(screw));

    // A 20 x 20 x 12 block with an M6 tapped hole through it, its outer vertical edges rounded.
    const tapped = body(thread({ threadRole: "bore", hole: true, height: 12 }));
    const block = cad.translate(cad.makeBox(20, 12, 20), -10, 0, -10);
    let holed = cad.cut(block, tapped);
    const solids = cad.getSubShapes(holed, "solid");
    expect(solids.length).toBe(1);
    holed = solids[0];
    expect(cad.isValid(holed)).toBe(true);
    const corners = cad.getSubShapes(holed, "edge").filter((edge) => {
      if (cad.curveType(edge) !== "line") return false;
      const box = cad.getBoundingBox(edge);
      return box.ymax - box.ymin > 11.9 && Math.abs(box.xmin) > 9.9 && Math.abs(box.zmin) > 9.9;
    });
    expect(corners.length).toBe(4);
    const rounded = cad.fillet(holed, corners, 2);
    expect(cad.isValid(rounded)).toBe(true);
    expect(cad.getVolume(rounded)).toBeLessThan(cad.getVolume(holed));
  });
});
