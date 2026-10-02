import type { ShellEdges, ShellOpenings } from "@/types/layerling";

export type CadModifierKind = "chamfer" | "fillet" | "shell";

export type CadModifierEdge = {
  id: number;
  owner?: number;
  points: number[];
  display: boolean;
  selectable: boolean;
  angle: number;
  boundary: boolean;
  manifold: boolean;
};

export type CadModifierQuality = "draft" | "standard" | "fine";

export type CadModifierDisplayEdge = {
  points: number[];
};

export type CadModifierPrimitivePart =
  | {
      kind: "box";
      width: number;
      depth: number;
      height: number;
      transform?: number[];
    }
  | {
      kind: "cylinder";
      radius: number;
      width: number;
      depth: number;
      height: number;
      transform?: number[];
    }
  | {
      kind: "cone";
      baseRadius: number;
      topRadius: number;
      width: number;
      depth: number;
      height: number;
      transform?: number[];
    }
  | {
      kind: "sphere";
      radius: number;
      width: number;
      depth: number;
      height: number;
      transform?: number[];
    }
  | {
      kind: "torus";
      majorRadius: number;
      minorRadius: number;
      width: number;
      depth: number;
      height: number;
      transform?: number[];
    };

/**
 * One piece of a flat outline in the shape's local X/Z plane, running from the
 * end of the previous piece (or the loop's start point) to (x, z). An arc is a
 * piece of the ellipse (cx + rx cos t, cz + rz sin t) from t = start to
 * t = end; with rx === rz it is a circular arc. A bezier is the Bezier curve
 * through its start, the control points and (x, z) - quadratic with one
 * control point, cubic with two, as a font's glyph outlines use them.
 */
export type CadModifierProfileSegment =
  | { kind: "line"; x: number; z: number }
  | { kind: "arc"; x: number; z: number; cx: number; cz: number; rx: number; rz: number; start: number; end: number }
  | { kind: "bezier"; x: number; z: number; controls: Array<{ x: number; z: number }> };

export type CadModifierProfileLoop = {
  x: number;
  z: number;
  segments: CadModifierProfileSegment[];
};

/**
 * One piece of a sweep's centre line (the bent tube). `frame` is a 3x4 matrix,
 * row by row, that places the section - drawn in the X/Z plane - at the start
 * of the piece, with local +Y the running direction; it keeps handedness. A
 * straight piece pushes the placed section `length` along that direction, a
 * bend turns it `angle` radians about `axis` through `center` (right-handed).
 * All in the frame the part's `transform` then places.
 */
export type CadModifierSweepPiece =
  | { kind: "straight"; frame: number[]; length: number }
  | { kind: "bend"; frame: number[]; center: [number, number, number]; axis: [number, number, number]; angle: number };

/**
 * A catalog shape whose body is its outline pushed straight up (or a section turned around an axis): the CAD worker
 * builds it as an exact solid (lines, arcs, flat caps) from the shape's own
 * parameters instead of sewing the display mesh back together.
 */
export type CadModifierProfilePart = {
  /**
   * "extrusion": the outline in the local X/Z plane pushed up by `height`.
   * "revolution": the loop is a half-section (x = distance from the axis,
   * z = position along it, x >= 0) turned once around the Z axis, `height`
   * long; the transform stands the axis up.
   * "sweep": the loops are a cross-section, pushed along the straight pieces
   * of `path` and turned through its bends, the pieces fused into one body;
   * `height` is the length of the centre line.
   * "loft": the loops are the section at the bottom (y = 0) and `topLoops`
   * the same section at the top (y = `height`), scaled and shifted - a
   * tapered or leaning extrusion. Each loop is joined to its partner by
   * straight lines (a ruled loft), which is exactly what the display's taper
   * and lean do between the two ends.
   * Either way `transform` places the result on the shape (for the teardrop it
   * also lays the extrusion on its side).
   */
  kind: "extrusion" | "revolution" | "sweep" | "loft";
  /** Sweep only: the centre line, piece by piece. */
  path?: CadModifierSweepPiece[];
  /** Loft only: the section at the top, loop for loop and piece for piece the partner of `loops`. */
  topLoops?: CadModifierProfileLoop[];
  /** Extrusion only: round every edge of the two flat ends by this radius (a rounded box). */
  capFillet?: number;
  /** The first loop is the outer boundary, any further loops are holes. */
  loops: CadModifierProfileLoop[];
  height: number;
  transform?: number[];
  /**
   * World bounds [minX, minY, minZ, maxX, maxY, maxZ] and volume of the
   * display mesh - the exact body has to agree with them, or the worker falls
   * back to the mesh.
   */
  expected?: { bounds: number[]; volume: number };
};

export type CadModifierMeshPart = {
  positions?: Float32Array;
  indices?: Uint32Array;
  brep?: string;
  /**
   * A body imported from STEP: the file's exact solid in the shape's own
   * frame, placed by `brepTransform`. positions/indices (if any) are only the
   * fallback if it cannot be restored.
   */
  step?: string;
  brepTransform?: number[];
  /** With `step`: world bounds and volume of the display mesh, which the placed body has to match. */
  expected?: { bounds: number[]; volume: number };
  primitive?: CadModifierPrimitivePart;
  /** When set, positions/indices (if any) are only the fallback if the exact body fails. */
  profile?: CadModifierProfilePart;
  hole: boolean;
};

export type CadModifierComponentMesh = {
  owner: number;
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
  triangleCount: number;
  brep: string;
  displayEdges: CadModifierDisplayEdge[];
};

export type CadModifierDeflection = { linear: number; angular: number };

export type CadModifierWorkerRequest =
  | { type: "prepare"; requestId: number; parts: CadModifierMeshPart[]; sharpAngle: number; suppressTreatmentDetailEdges?: boolean }
  | {
      type: "preview";
      requestId: number;
      kind: CadModifierKind;
      edgeIds: number[];
      amount: number;
      quality: CadModifierQuality;
      chamferAngle: number;
      // Only for "shell": which faces stay open; `amount` is the wall thickness.
      shellOpenings?: ShellOpenings;
      shellEdges?: ShellEdges;
      // The finest deflection the shape's edge-treatment history has needed
      // so far, if any - a floor beneath this operation's own deflection.
      minDeflection?: CadModifierDeflection;
    }
  | { type: "dispose"; requestId: number };

export type CadModifierWorkerResponse =
  | { type: "ready"; requestId: number; edges: CadModifierEdge[]; selectableEdgeIds: number[]; sourceType: string }
  | {
      type: "preview";
      requestId: number;
      positions: Float32Array;
      normals: Float32Array;
      indices: Uint32Array;
      triangleCount: number;
      brep: string;
      displayEdges: CadModifierDisplayEdge[];
      components?: CadModifierComponentMesh[];
      // The deflection actually used for this operation - request.minDeflection
      // folded in, so the caller can carry it forward as the new floor.
      deflection: CadModifierDeflection;
    }
  | { type: "disposed"; requestId: number }
  | { type: "error"; requestId: number; message: string; resetSession?: boolean };
