import type { OcctKernel, ShapeHandle } from "occt-wasm";
import type { CadModifierProfileLoop, CadModifierProfilePart, CadModifierProfileSegment } from "@/lib/cadModifierTypes";

/*
 * Exact solids for catalog shapes that are an outline pushed straight up
 * (star, heart, crescent, slot, polygon, honeycomb, spur gear, text, the
 * ellipse, tube and round roof) or a section turned around an axis (bores,
 * the half sphere, the stretched sphere and cone). The
 * outline arrives as lines, circular or elliptical arcs and Bezier curves; the
 * kernel gets real curves and flat caps, so a star is 22 faces instead of one
 * face per display triangle, and fillets and chamfers on it cost milliseconds
 * instead of seconds.
 *
 * No three.js here: the CAD worker and the kernel tests import this file.
 */

type ProfileArc = Extract<CadModifierProfileSegment, { kind: "arc" }>;
type Point = { x: number; z: number };

const UP = { x: 0, y: 1, z: 0 };
const ORIGIN = { x: 0, y: 0, z: 0 };
const TWO_PI = Math.PI * 2;

export function profileArcPoint(arc: Pick<ProfileArc, "cx" | "cz" | "rx" | "rz">, angle: number): Point {
  return { x: arc.cx + arc.rx * Math.cos(angle), z: arc.cz + arc.rz * Math.sin(angle) };
}

/** Axis-aligned bounds [minX, minZ, maxX, maxZ] of a loop, arcs by their true extent. */
export function profileLoopBounds(loop: CadModifierProfileLoop) {
  let minX = loop.x;
  let maxX = loop.x;
  let minZ = loop.z;
  let maxZ = loop.z;
  const add = (point: Point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
  };
  loop.segments.forEach((segment) => {
    add(segment);
    // A Bezier curve stays inside the hull of its control points.
    if (segment.kind === "bezier") segment.controls.forEach(add);
    if (segment.kind !== "arc") return;
    const low = Math.min(segment.start, segment.end);
    const high = Math.max(segment.start, segment.end);
    for (let quarter = Math.ceil(low / (Math.PI / 2)); quarter * (Math.PI / 2) <= high; quarter += 1) {
      add(profileArcPoint(segment, quarter * (Math.PI / 2)));
    }
  });
  return [minX, minZ, maxX, maxZ];
}

/** Points along a segment from `from`, its end included; curves sampled finely. */
function segmentPoints(from: Point, segment: CadModifierProfileSegment): Point[] {
  if (segment.kind === "line") return [{ x: segment.x, z: segment.z }];
  const steps = 64;
  const points: Point[] = [];
  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    if (segment.kind === "arc") {
      points.push(profileArcPoint(segment, segment.start + (segment.end - segment.start) * t));
    } else {
      let row: Point[] = [from, ...segment.controls, { x: segment.x, z: segment.z }];
      while (row.length > 1) row = row.slice(1).map((point, index) => ({ x: row[index].x + (point.x - row[index].x) * t, z: row[index].z + (point.z - row[index].z) * t }));
      points.push(row[0]);
    }
  }
  return points;
}

/** Area inside a profile - outer loop minus holes - from finely sampled outlines. */
export function profileArea(profile: CadModifierProfilePart) {
  const loopArea = (loop: CadModifierProfileLoop) => {
    let twice = 0;
    let current: Point = { x: loop.x, z: loop.z };
    loop.segments.forEach((segment) => {
      segmentPoints(current, segment).forEach((point) => {
        twice += current.x * point.z - point.x * current.z;
        current = point;
      });
    });
    return Math.abs(twice) / 2;
  };
  const [outer, ...holes] = profile.loops;
  return loopArea(outer) - holes.reduce((total, hole) => total + loopArea(hole), 0);
}

function profileExtent(profile: CadModifierProfilePart) {
  const bounds = profileLoopBounds(profile.loops[0]);
  return Math.max(bounds[2] - bounds[0], bounds[3] - bounds[1], profile.height, 1e-3);
}

function samePoint(a: Point, b: Point, tolerance: number) {
  return Math.hypot(a.x - b.x, a.z - b.z) <= tolerance;
}

function sameRadius(a: number, b: number) {
  return Math.abs(a - b) <= 1e-9 * Math.max(a, b);
}

/** An arc once round: a loop of its own, a circle or ellipse in one closed edge. */
export function isWholeEllipse(segment: CadModifierProfileSegment) {
  return segment.kind === "arc" && Math.abs(Math.abs(segment.end - segment.start) - TWO_PI) <= 1e-9;
}

/** Throws unless every number is finite, every loop closes and every arc ends where it says. */
export function validateCadProfile(profile: CadModifierProfilePart) {
  if (profile.kind !== "extrusion" && profile.kind !== "revolution") throw new Error(`Unsupported CAD profile: ${String((profile as { kind: unknown }).kind)}`);
  if (!Number.isFinite(profile.height) || profile.height <= 0) throw new Error("The profile has no height");
  if (!profile.loops.length) throw new Error("The profile has no outline");
  const tolerance = profileExtent(profile) * 1e-7;
  profile.loops.forEach((loop) => {
    // A loop of one segment is only a whole ellipse, and only in an extrusion.
    const whole = profile.kind === "extrusion" && loop.segments.length === 1 && isWholeEllipse(loop.segments[0]);
    if (!Number.isFinite(loop.x) || !Number.isFinite(loop.z) || (loop.segments.length < 2 && !whole)) {
      throw new Error("The profile outline is incomplete");
    }
    let current: Point = loop;
    loop.segments.forEach((segment) => {
      const values = segment.kind === "arc"
        ? [segment.x, segment.z, segment.cx, segment.cz, segment.rx, segment.rz, segment.start, segment.end]
        : segment.kind === "bezier"
          ? [segment.x, segment.z, ...segment.controls.flatMap((control) => [control.x, control.z])]
          : [segment.x, segment.z];
      if (!values.every(Number.isFinite)) throw new Error("The profile outline has an invalid point");
      if (segment.kind === "arc") {
        const sweep = Math.abs(segment.end - segment.start);
        if (segment.rx <= 0 || segment.rz <= 0 || sweep <= 1e-9 || (sweep > TWO_PI - 1e-9 && !whole)) {
          throw new Error("The profile outline has an invalid arc");
        }
        if (!samePoint(profileArcPoint(segment, segment.start), current, tolerance) || !samePoint(profileArcPoint(segment, segment.end), segment, tolerance)) {
          throw new Error("A profile arc does not meet its neighbours");
        }
      } else if (segment.kind === "bezier") {
        if (segment.controls.length < 1 || segment.controls.length > 2) throw new Error("The profile outline has an invalid curve");
        if ([segment, ...segment.controls].every((point) => samePoint(current, point, tolerance))) {
          throw new Error("The profile outline has a zero-length curve");
        }
      } else if (samePoint(current, segment, tolerance)) {
        throw new Error("The profile outline has a zero-length line");
      }
      current = segment;
    });
    if (!samePoint(current, loop, tolerance)) throw new Error("The profile outline is not closed");
  });
}

function vec(point: Point) {
  return { x: point.x, y: 0, z: point.z };
}

/*
 * Measured on occt-wasm 5.3.5: makeEllipseArc with the normal +Y lays the
 * major axis along +Z and the minor axis along +X, parameter growing from +Z
 * towards +X. The arc is built around the origin in that frame and then turned
 * and moved rigidly into place, which keeps it an analytic ellipse. The ends
 * are checked afterwards, so a kernel that lays the axes out differently is
 * caught here instead of producing a wrong body.
 */
function ellipseArcEdge(cad: OcctKernel, from: Point, arc: ProfileArc, tolerance: number) {
  const majorAlongZ = arc.rz >= arc.rx;
  const first = majorAlongZ ? Math.PI / 2 - arc.start : -arc.start;
  const last = majorAlongZ ? Math.PI / 2 - arc.end : -arc.end;
  const raw = majorAlongZ
    ? cad.makeEllipseArc(ORIGIN, UP, arc.rz, arc.rx, Math.min(first, last), Math.max(first, last))
    : cad.makeEllipseArc(ORIGIN, UP, arc.rx, arc.rz, Math.min(first, last), Math.max(first, last));
  const placement = majorAlongZ
    ? [1, 0, 0, arc.cx, 0, 1, 0, 0, 0, 0, 1, arc.cz]
    : [0, 0, 1, arc.cx, 0, 1, 0, 0, -1, 0, 0, arc.cz];
  const edge = cad.transform(raw, placement);
  cad.release(raw);
  const vertices = cad.getSubShapes(edge, "vertex");
  try {
    const ends = vertices.map((vertex) => cad.vertexPosition(vertex));
    const touches = (point: Point) => ends.some((end) => Math.abs(end.y) <= tolerance && samePoint({ x: end.x, z: end.z }, point, tolerance));
    const parameters = cad.curveParameters(edge) as { first: number; last: number };
    const middle = cad.curvePointAtParam(edge, (parameters.first + parameters.last) / 2);
    if (!touches(from) || !touches(arc) || !samePoint({ x: middle.x, z: middle.z }, profileArcPoint(arc, (arc.start + arc.end) / 2), tolerance)) {
      throw new Error("The kernel laid out an elliptical arc differently than expected");
    }
  } finally {
    vertices.forEach((vertex) => cad.release(vertex));
  }
  return edge;
}

/** A whole ellipse round (cx, 0, cz), semi-axes rx along X and rz along Z, as one closed edge. */
function wholeEllipseEdge(cad: OcctKernel, arc: ProfileArc) {
  const center = { x: arc.cx, y: 0, z: arc.cz };
  if (sameRadius(arc.rx, arc.rz)) return cad.makeCircleEdge(center, UP, arc.rx);
  // With the normal +Y the major axis lies along +Z (see above); a wider one is turned a quarter.
  if (arc.rz > arc.rx) return cad.makeEllipseEdge(center, UP, arc.rz, arc.rx);
  const raw = cad.makeEllipseEdge(ORIGIN, UP, arc.rx, arc.rz);
  const edge = cad.transform(raw, [0, 0, 1, arc.cx, 0, 1, 0, 0, -1, 0, 0, arc.cz]);
  cad.release(raw);
  return edge;
}

function segmentEdge(cad: OcctKernel, from: Point, segment: CadModifierProfileSegment, tolerance: number) {
  if (segment.kind === "line") return cad.makeLineEdge(vec(from), vec(segment));
  if (segment.kind === "bezier") return cad.makeBezierEdge([vec(from), ...segment.controls.map(vec), vec(segment)]);
  if (isWholeEllipse(segment)) return wholeEllipseEdge(cad, segment);
  if (Math.abs(segment.rx - segment.rz) <= 1e-9 * Math.max(segment.rx, segment.rz)) {
    return cad.makeArcEdge(vec(from), vec(profileArcPoint(segment, (segment.start + segment.end) / 2)), vec(segment));
  }
  return ellipseArcEdge(cad, from, segment, tolerance);
}

function loopWire(cad: OcctKernel, loop: CadModifierProfileLoop, tolerance: number) {
  const edges: ShapeHandle[] = [];
  let current: Point = loop;
  loop.segments.forEach((segment) => {
    edges.push(segmentEdge(cad, current, segment, tolerance));
    current = segment;
  });
  return cad.makeWire(edges);
}

/**
 * The exact body of a profile in the shape's local frame: outline in the X/Z
 * plane at y = 0, pushed up to y = height. Throws when anything about it is
 * off - the caller falls back to the display mesh.
 */
export function profileExtrusionSolid(cad: OcctKernel, profile: CadModifierProfilePart) {
  validateCadProfile(profile);
  const tolerance = profileExtent(profile) * 1e-6;
  const [outer, ...holes] = profile.loops;
  let face = cad.makeFace(loopWire(cad, outer, tolerance));
  if (holes.length > 0) face = cad.addHolesInFace(face, holes.map((hole) => loopWire(cad, hole, tolerance)));
  // A revolution turns its half-section once around the Z axis; the result stands along Z.
  let solid = profile.kind === "revolution"
    ? cad.revolve(face, { point: ORIGIN, direction: { x: 0, y: 0, z: 1 } }, TWO_PI)
    : cad.extrude(face, 0, profile.height, 0);
  const solids = cad.isSolid(solid) ? [solid] : cad.getSubShapes(solid, "solid");
  if (solids.length !== 1) throw new Error("The profile did not become one solid");
  solid = solids[0];
  const isValid = (candidate: ShapeHandle) => {
    try {
      return Boolean(cad.isValid(candidate));
    } catch {
      return false;
    }
  };
  if (!isValid(solid) && profile.kind === "revolution") throw new Error("The turned profile solid is not valid");
  if (!isValid(solid)) {
    // Some font outlines (the "1" of the Rounded face, for one) come out of
    // the face builder flagged invalid, and the kernel's own repair fixes
    // them. It is only kept when it did not change the body: its volume has to
    // match the outline's area times the height - elsewhere the repair can
    // throw away most of a glyph and still call the rest valid.
    const repaired = cad.fixShape(solid);
    const repairedSolids = cad.isSolid(repaired) ? [repaired] : cad.getSubShapes(repaired, "solid");
    if (repairedSolids.length !== 1 || !isValid(repairedSolids[0])) throw new Error("The profile solid is not valid");
    const expectedVolume = profileArea(profile) * profile.height;
    if (!(Math.abs(cad.getVolume(repairedSolids[0]) - expectedVolume) <= 0.005 * expectedVolume)) {
      throw new Error("The repaired profile solid does not keep the outline's volume");
    }
    solid = repairedSolids[0];
  }
  if (!(cad.getVolume(solid) > 0)) throw new Error("The profile solid is inside out");
  if (profile.capFillet && profile.capFillet > 1e-4 && profile.kind === "extrusion") {
    // The flat ends of the extrusion: every edge lying in the plane y = 0 or y = height.
    const edges = cad.getSubShapes(solid, "edge").filter((edge) => {
      const box = cad.getBoundingBox(edge);
      return Math.abs(box.ymax - box.ymin) < 1e-6 && (Math.abs(box.ymin) < 1e-6 || Math.abs(box.ymin - profile.height) < 1e-6);
    });
    const rounded = cad.fillet(solid, edges, profile.capFillet);
    if (!cad.isSolid(rounded) || !isValid(rounded) || !(cad.getVolume(rounded) > 0)) throw new Error("The rounded ends of the profile solid are not valid");
    return rounded;
  }
  return solid;
}

function meshedBounds(cad: OcctKernel, solid: ShapeHandle, deflection: number) {
  const probe = cad.copy(solid);
  try {
    const { positions } = cad.tessellate(probe, { linearDeflection: Math.max(1e-4, deflection), angularDeflection: 0.5 });
    const bounds = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (let index = 0; index + 2 < positions.length; index += 3) {
      for (let axis = 0; axis < 3; axis += 1) {
        bounds[axis] = Math.min(bounds[axis], positions[index + axis]);
        bounds[axis + 3] = Math.max(bounds[axis + 3], positions[index + axis]);
      }
    }
    return bounds;
  } finally {
    cad.release(probe);
  }
}

/**
 * Null when the exact body agrees with the display mesh it replaces, otherwise
 * what disagrees. The mesh only approximates the arcs, so the check is loose:
 * it catches a body in the wrong place, turned or mirrored the wrong way, or
 * missing a large part of its volume - not small differences in detail, which
 * the tests compare shape by shape.
 */
export function cadProfileSolidMismatch(cad: OcctKernel, solid: ShapeHandle, expected: CadModifierProfilePart["expected"]) {
  if (!expected || expected.bounds.length !== 6 || ![...expected.bounds, expected.volume].every(Number.isFinite)) return null;
  const box = cad.getBoundingBox(solid);
  const actual = [box.xmin, box.ymin, box.zmin, box.xmax, box.ymax, box.zmax];
  const size = Math.max(
    expected.bounds[3] - expected.bounds[0],
    expected.bounds[4] - expected.bounds[1],
    expected.bounds[5] - expected.bounds[2],
  );
  const boundsTolerance = 0.05 * size + 0.05;
  const differ = (bounds: number[]) => Math.max(...bounds.map((value, index) => Math.abs(value - expected.bounds[index])));
  let worst = differ(actual);
  if (!(worst <= boundsTolerance)) {
    // The kernel's box is loose on a turned curved face - a tipped half
    // sphere measured 4 mm too big - so ask a coarse mesh of a copy (a copy,
    // so the body itself keeps no triangulation the preview would reuse).
    // Its vertices lie on the faces: that box is short of the true one by the
    // deflection at most, 0.5 % of the size - a tenth of the tolerance.
    worst = differ(meshedBounds(cad, solid, size * 5e-3));
  }
  if (!(worst <= boundsTolerance)) return `bounds differ by ${worst.toFixed(3)} mm`;
  const volume = Math.abs(cad.getVolume(solid));
  const expectedVolume = Math.abs(expected.volume);
  if (!(Math.abs(volume - expectedVolume) <= 0.15 * expectedVolume + 1e-6)) {
    return `volume ${volume.toFixed(2)} instead of ${expectedVolume.toFixed(2)} mm³`;
  }
  return null;
}
