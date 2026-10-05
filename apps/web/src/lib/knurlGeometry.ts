import * as THREE from "three";

/**
 * Knurling: a round grip with grooves around it, straight along the axis or
 * crossed into small diamonds. The cross-section is a ring of V grooves -
 * a ridge on the outer radius, a groove bottom `depth` further in, joined by
 * straight flanks. Straight knurling pushes that outline up; crossed
 * knurling is what two copies of it, turned against each other on helices,
 * have in common - the exact body the kernel builds (gearSolid) and the mesh
 * drawn here as the smaller of the two radii at every point.
 *
 * Frame as the gear's: centred on x and z, from y = 0 to the height, angles
 * from +x towards +z.
 */

export type KnurlPattern = "straight" | "diamond";

export const DEFAULT_KNURL_DIAMETER = 20;
export const DEFAULT_KNURL_HEIGHT = 15;
export const DEFAULT_KNURL_PATTERN: KnurlPattern = "straight";
export const DEFAULT_KNURL_COUNT = 30;
export const DEFAULT_KNURL_DEPTH = 0.6;
export const DEFAULT_KNURL_ANGLE = 30;
export const MIN_KNURL_COUNT = 6;
export const MAX_KNURL_COUNT = 180;
export const MIN_KNURL_DEPTH = 0.1;
export const MIN_KNURL_ANGLE = 10;
export const MAX_KNURL_ANGLE = 60;

export function normalizeKnurlPattern(value: unknown): KnurlPattern {
  return value === "diamond" ? "diamond" : "straight";
}

/** Narrowest groove pitch around the grip, in mm: finer than this no FDM printer shows. */
export const MIN_KNURL_PITCH = 0.8;

/** Most grooves that fit around this diameter at the narrowest pitch. */
export function maxKnurlCount(diameter?: number) {
  if (!(typeof diameter === "number" && diameter > 0)) return MAX_KNURL_COUNT;
  return Math.max(MIN_KNURL_COUNT, Math.min(MAX_KNURL_COUNT, Math.floor((Math.PI * diameter) / MIN_KNURL_PITCH)));
}

export function normalizeKnurlCount(value: unknown, diameter?: number) {
  const count = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : DEFAULT_KNURL_COUNT;
  return Math.min(maxKnurlCount(diameter), Math.max(MIN_KNURL_COUNT, count));
}

/** Grooves may go a third of the way to the axis, and never below the minimum. */
export function maxKnurlDepth(diameter: number) {
  return Math.max(MIN_KNURL_DEPTH, (diameter / 2) / 3);
}

export function normalizeKnurlDepth(value: unknown, diameter: number) {
  const depth = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_KNURL_DEPTH;
  return Math.min(maxKnurlDepth(diameter), Math.max(MIN_KNURL_DEPTH, depth));
}

/** How steeply the crossed grooves run, in degrees from the axis. */
export function normalizeKnurlAngle(value: unknown) {
  const angle = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_KNURL_ANGLE;
  return Math.min(MAX_KNURL_ANGLE, Math.max(MIN_KNURL_ANGLE, angle));
}

export type KnurlCorner = { angle: number; radius: number };

/** The outline's corners: ridges on the outer radius, groove bottoms between them. */
export function knurlCorners(diameter: number, count: number, depth: number): KnurlCorner[] {
  const radius = diameter / 2;
  const grooves = normalizeKnurlCount(count, diameter);
  const step = (Math.PI * 2) / grooves;
  const corners: KnurlCorner[] = [];
  for (let index = 0; index < grooves; index += 1) {
    corners.push({ angle: index * step, radius });
    corners.push({ angle: index * step + step / 2, radius: radius - depth });
  }
  return corners;
}

/** The turn from foot to top of a groove that climbs at `angle` degrees from the axis, in radians. */
export function knurlTwist(diameter: number, height: number, angle: number) {
  return (height * Math.tan(THREE.MathUtils.degToRad(normalizeKnurlAngle(angle)))) / (diameter / 2);
}

export type KnurlShapeFields = {
  width: number;
  height: number;
  knurlPattern?: KnurlPattern;
  knurlCount?: number;
  knurlDepth?: number;
  knurlAngle?: number;
};

export function knurlSettings(shape: KnurlShapeFields) {
  const diameter = Math.max(1, shape.width);
  return {
    diameter,
    height: Math.max(0.1, shape.height),
    pattern: normalizeKnurlPattern(shape.knurlPattern),
    count: normalizeKnurlCount(shape.knurlCount, diameter),
    depth: normalizeKnurlDepth(shape.knurlDepth, diameter),
    angle: normalizeKnurlAngle(shape.knurlAngle),
  };
}

/** Radius of the straight outline in direction `phi`: where that ray meets the flank between a ridge and a groove. */
function outlineRadiusAt(phi: number, radius: number, depth: number, count: number) {
  const step = (Math.PI * 2) / count;
  const local = ((phi % step) + step) % step;
  // Ridge at 0, groove at step/2, ridge again at step: mirror the second half.
  const toward = local <= step / 2 ? local : step - local;
  const ridge = { x: radius, z: 0 };
  const groove = { x: Math.cos(step / 2) * (radius - depth), z: Math.sin(step / 2) * (radius - depth) };
  const direction = { x: Math.cos(toward), z: Math.sin(toward) };
  const edge = { x: groove.x - ridge.x, z: groove.z - ridge.z };
  const cross = (a: { x: number; z: number }, b: { x: number; z: number }) => a.x * b.z - a.z * b.x;
  return cross(ridge, edge) / cross(direction, edge);
}

export function createKnurlGeometry(shape: KnurlShapeFields): THREE.BufferGeometry {
  const { diameter, height, pattern, count, depth, angle } = knurlSettings(shape);
  const radius = diameter / 2;
  const positions: number[] = [];
  const indices: number[] = [];

  if (pattern === "straight") {
    // Exactly the outline the kernel pushes up: one ring at the foot, one at the top.
    const corners = knurlCorners(diameter, count, depth);
    [0, height].forEach((y) => corners.forEach(({ angle: a, radius: r }) => positions.push(Math.cos(a) * r, y, Math.sin(a) * r)));
    const n = corners.length;
    for (let i = 0; i < n; i += 1) {
      const j = (i + 1) % n;
      indices.push(i, n + i, j, j, n + i, n + j);
    }
    addCaps(positions, indices, 0, n, n, height);
  } else {
    // The grid is laid along the grooves: each row turns both rows of grooves
    // by exactly one column, so every groove line runs through grid points -
    // straight up a diagonal - and each cell is split along the diagonal of
    // the groove row that forms its surface. No staircase along the creases.
    // That fixes the turn to whole columns; the angle moves by a hair for it.
    // Six columns per flank, fewer when many grooves on a long, steep grip
    // would pass about 200 000 cells: one column per flank still puts every
    // ridge and groove on the grid, the surface just gets fewer facets.
    const twistGuess = Math.abs(knurlTwist(diameter, height, angle));
    const columnBudget = Math.sqrt((200000 * Math.PI * 2) / Math.max(twistGuess, 1e-6));
    const columnsPerHalfGroove = Math.max(1, Math.min(6, Math.floor(columnBudget / (count * 2))));
    const columns = count * columnsPerHalfGroove * 2;
    const columnStep = (Math.PI * 2) / columns;
    const rows = Math.max(1, Math.min(2000, Math.round(knurlTwist(diameter, height, angle) / columnStep)));
    const outline = (phi: number) => outlineRadiusAt(phi, radius, depth, count);
    for (let row = 0; row <= rows; row += 1) {
      const y = (row / rows) * height;
      const turn = row * columnStep;
      for (let column = 0; column < columns; column += 1) {
        const phi = column * columnStep;
        const r = Math.min(outline(phi - turn), outline(phi + turn));
        positions.push(Math.cos(phi) * r, y, Math.sin(phi) * r);
      }
    }
    for (let row = 0; row < rows; row += 1) {
      const turn = (row + 0.5) * columnStep;
      for (let column = 0; column < columns; column += 1) {
        const a = row * columns + column;
        const b = row * columns + ((column + 1) % columns);
        const phi = (column + 0.5) * columnStep;
        // The row turning with the height forms the surface here: its grooves run up and to the right.
        if (outline(phi - turn) <= outline(phi + turn)) indices.push(a, a + columns, b + columns, a, b + columns, b);
        else indices.push(a, a + columns, b, b, a + columns, b + columns);
      }
    }
    addCaps(positions, indices, 0, columns, rows * columns, height);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  const flat = geometry.toNonIndexed();
  geometry.dispose();
  flat.computeVertexNormals();
  return flat;
}

/** Flat ends: a fan from the axis to each ring, the foot facing down, the top facing up. */
function addCaps(positions: number[], indices: number[], footStart: number, ringSize: number, topStart: number, height: number) {
  const foot = positions.length / 3;
  positions.push(0, 0, 0);
  const top = foot + 1;
  positions.push(0, height, 0);
  for (let i = 0; i < ringSize; i += 1) {
    const j = (i + 1) % ringSize;
    indices.push(foot, footStart + i, footStart + j);
    indices.push(top, topStart + j, topStart + i);
  }
}
