import type { SketchPoint, SketchProfile, SketchSegment } from "@/types/layerling";

type IdFactory = (prefix: string) => string;

export type CornerTreatmentResult = {
  profile: SketchProfile;
  newPointIds: [string, string];
};

export type CornerGeometryInfo = {
  point: SketchPoint;
  seg1: SketchSegment;
  seg2: SketchSegment;
  p1: SketchPoint;
  p2: SketchPoint;
  v1: { x: number; z: number };
  v2: { x: number; z: number };
  len1: number;
  len2: number;
  angleRad: number;
};

export function getCornerGeometryInfo(profile: SketchProfile, pointId: string): CornerGeometryInfo | null {
  const point = profile.points.find((p) => p.id === pointId);
  if (!point) return null;

  const connected = profile.segments.filter((s) => s.startId === pointId || s.endId === pointId);
  if (connected.length !== 2) return null;

  const [seg1, seg2] = connected;
  // Only a corner between two straight lines: pulling the end of a curve back
  // along its chord would leave its handles behind and bend the curve.
  if ((seg1.kind ?? "line") !== "line" || (seg2.kind ?? "line") !== "line") return null;
  const otherId1 = seg1.startId === pointId ? seg1.endId : seg1.startId;
  const otherId2 = seg2.startId === pointId ? seg2.endId : seg2.startId;
  if (otherId1 === otherId2) return null; // degenerate loop

  const p1 = profile.points.find((p) => p.id === otherId1);
  const p2 = profile.points.find((p) => p.id === otherId2);
  if (!p1 || !p2) return null;

  const dx1 = p1.x - point.x;
  const dz1 = p1.z - point.z;
  const len1 = Math.hypot(dx1, dz1);

  const dx2 = p2.x - point.x;
  const dz2 = p2.z - point.z;
  const len2 = Math.hypot(dx2, dz2);

  if (len1 < 0.05 || len2 < 0.05) return null;

  const v1 = { x: dx1 / len1, z: dz1 / len1 };
  const v2 = { x: dx2 / len2, z: dz2 / len2 };

  const dot = Math.max(-1, Math.min(1, v1.x * v2.x + v1.z * v2.z));
  // Degenerate collinear or overlapping
  if (dot > 0.9999 || dot < -0.9999) return null;

  const angleRad = Math.acos(dot);
  return { point, seg1, seg2, p1, p2, v1, v2, len1, len2, angleRad };
}

export function canApplySketchCornerTreatment(profile: SketchProfile, pointId: string): boolean {
  return getCornerGeometryInfo(profile, pointId) !== null;
}

export function applySketchChamfer(
  profile: SketchProfile,
  pointId: string,
  distance: number,
  createId: IdFactory,
): CornerTreatmentResult | null {
  const info = getCornerGeometryInfo(profile, pointId);
  if (!info) return null;

  const { point, seg1, seg2, v1, v2, len1, len2 } = info;
  const maxDistance = Math.min(len1, len2) * 0.9;
  const d = Math.max(0.1, Math.min(distance, maxDistance));

  const idA = createId("sketch-point");
  const idB = createId("sketch-point");

  const ptA: SketchPoint = {
    id: idA,
    x: point.x + d * v1.x,
    z: point.z + d * v1.z,
    mode: "corner",
  };

  const ptB: SketchPoint = {
    id: idB,
    x: point.x + d * v2.x,
    z: point.z + d * v2.z,
    mode: "corner",
  };

  const newSegmentId = createId("sketch-segment");
  const newSegment: SketchSegment = {
    id: newSegmentId,
    startId: idA,
    endId: idB,
    kind: "line",
  };

  const updatedSegments = profile.segments.map((seg) => {
    if (seg.id === seg1.id) {
      return {
        ...seg,
        startId: seg.startId === pointId ? idA : seg.startId,
        endId: seg.endId === pointId ? idA : seg.endId,
      };
    }
    if (seg.id === seg2.id) {
      return {
        ...seg,
        startId: seg.startId === pointId ? idB : seg.startId,
        endId: seg.endId === pointId ? idB : seg.endId,
      };
    }
    return seg;
  });

  const nextPoints = profile.points.filter((p) => p.id !== pointId).concat([ptA, ptB]);
  const nextSegments = [...updatedSegments, newSegment];

  return {
    profile: {
      ...profile,
      points: nextPoints,
      segments: nextSegments,
    },
    newPointIds: [idA, idB],
  };
}

export function applySketchFillet(
  profile: SketchProfile,
  pointId: string,
  radius: number,
  createId: IdFactory,
): CornerTreatmentResult | null {
  const info = getCornerGeometryInfo(profile, pointId);
  if (!info) return null;

  const { point, seg1, seg2, v1, v2, len1, len2, angleRad } = info;
  // Tangent setback t = R / tan(alpha / 2)
  const halfAngle = angleRad / 2;
  const tanHalf = Math.tan(halfAngle);
  if (tanHalf <= 1e-4) return null;

  const requestedT = radius / tanHalf;
  const maxT = Math.min(len1, len2) * 0.9;
  const t = Math.max(0.1, Math.min(requestedT, maxT));
  const effectiveR = t * tanHalf;

  // Bezier handle length k = (4/3) * tan(beta / 4) * R
  const beta = Math.PI - angleRad;
  const k = (4 / 3) * Math.tan(beta / 4) * effectiveR;

  const idA = createId("sketch-point");
  const idB = createId("sketch-point");

  const posA = { x: point.x + t * v1.x, z: point.z + t * v1.z };
  const posB = { x: point.x + t * v2.x, z: point.z + t * v2.z };

  // Handle at A points towards corner P (direction -v1)
  const handleA = { x: posA.x - k * v1.x, z: posA.z - k * v1.z };
  // Handle at B points towards corner P (direction -v2)
  const handleB = { x: posB.x - k * v2.x, z: posB.z - k * v2.z };

  const ptA: SketchPoint = {
    id: idA,
    x: posA.x,
    z: posA.z,
    mode: "split",
    handleOut: handleA,
  };

  const ptB: SketchPoint = {
    id: idB,
    x: posB.x,
    z: posB.z,
    mode: "split",
    handleIn: handleB,
  };

  const newSegmentId = createId("sketch-segment");
  const newSegment: SketchSegment = {
    id: newSegmentId,
    startId: idA,
    endId: idB,
    kind: "bezier",
  };

  const updatedSegments = profile.segments.map((seg) => {
    if (seg.id === seg1.id) {
      return {
        ...seg,
        startId: seg.startId === pointId ? idA : seg.startId,
        endId: seg.endId === pointId ? idA : seg.endId,
      };
    }
    if (seg.id === seg2.id) {
      return {
        ...seg,
        startId: seg.startId === pointId ? idB : seg.startId,
        endId: seg.endId === pointId ? idB : seg.endId,
      };
    }
    return seg;
  });

  const nextPoints = profile.points.filter((p) => p.id !== pointId).concat([ptA, ptB]);
  const nextSegments = [...updatedSegments, newSegment];

  return {
    profile: {
      ...profile,
      points: nextPoints,
      segments: nextSegments,
    },
    newPointIds: [idA, idB],
  };
}
