import type { SketchPoint, SketchSegment } from "@/types/layerling";

/**
 * Adjusts the length of a sketch segment to `newLength` (in millimeters).
 * The anchor point remains stationary while the other point moves along the segment's line/tangent.
 * Any Bezier control handles attached to the moving point are translated or scaled along with it.
 */
export function applySegmentDimension(
  segment: SketchSegment,
  points: SketchPoint[],
  newLength: number,
  anchorPointId?: string,
): SketchPoint[] {
  if (!Number.isFinite(newLength) || newLength <= 0.001) {
    return points;
  }

  const start = points.find((p) => p.id === segment.startId);
  const end = points.find((p) => p.id === segment.endId);
  if (!start || !end) return points;

  // Decide which point is anchored and which point moves.
  // If anchorPointId is specified and matches end, start moves.
  // Otherwise start is anchor and end moves.
  const anchorIsEnd = anchorPointId === end.id;
  const anchor = anchorIsEnd ? end : start;
  const mover = anchorIsEnd ? start : end;

  const dx = mover.x - anchor.x;
  const dz = mover.z - anchor.z;
  const currentLength = Math.hypot(dx, dz);

  if (currentLength < 1e-6) return points;

  const scale = newLength / currentLength;
  const newMoverX = anchor.x + dx * scale;
  const newMoverZ = anchor.z + dz * scale;
  const deltaX = newMoverX - mover.x;
  const deltaZ = newMoverZ - mover.z;

  const updatedMover: SketchPoint = {
    ...mover,
    x: newMoverX,
    z: newMoverZ,
    handleIn: mover.handleIn
      ? { x: mover.handleIn.x + deltaX, z: mover.handleIn.z + deltaZ }
      : undefined,
    handleOut: mover.handleOut
      ? { x: mover.handleOut.x + deltaX, z: mover.handleOut.z + deltaZ }
      : undefined,
  };

  // If segment is curved and anchor has an outgoing handle along this segment,
  // scale that handle proportionally relative to the anchor.
  let updatedAnchor = anchor;
  if (segment.kind !== "line") {
    if (!anchorIsEnd && anchor.handleOut) {
      updatedAnchor = {
        ...anchor,
        handleOut: {
          x: anchor.x + (anchor.handleOut.x - anchor.x) * scale,
          z: anchor.z + (anchor.handleOut.z - anchor.z) * scale,
        },
      };
    } else if (anchorIsEnd && anchor.handleIn) {
      updatedAnchor = {
        ...anchor,
        handleIn: {
          x: anchor.x + (anchor.handleIn.x - anchor.x) * scale,
          z: anchor.z + (anchor.handleIn.z - anchor.z) * scale,
        },
      };
    }
  }

  return points.map((p) => {
    if (p.id === updatedMover.id) return updatedMover;
    if (p.id === updatedAnchor.id) return updatedAnchor;
    return p;
  });
}
