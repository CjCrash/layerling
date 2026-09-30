import type { Mesh, OcctKernel, ShapeHandle } from "occt-wasm";
import type { CadModifierDeflection } from "@/lib/cadModifierTypes";

/**
 * Surface kinds the edge tool meshes with the looser angle of a small
 * treatment without checking: measured against the exact faces, their meshes
 * stayed within the chord limit with it wherever they did with the old angle
 * (fillets and chamfers on boxes, cylinders, cones, glyphs, the crescent and
 * the heart). Not measured to be so: a sphere of 10 mm radius strays 0.02 mm
 * at a 0.01 mm limit with either angle, and a lofted B-spline strayed
 * 0.032 mm with the old angle and 0.038 mm with the looser one at a 0.025 mm
 * limit - B-spline faces are too slow to project for a check on every
 * preview, and the glyph outlines this change is for stay within it.
 *
 * A torus is not on the list: across a fillet round a circular edge OCCT's
 * rows follow the angle, and a 0.1 mm fillet round a 6 mm cylinder strayed
 * 0.031 mm at a 0.01 mm limit - so torus faces, and any kind not listed, are
 * checked.
 */
export const UNCHECKED_SURFACE_TYPES: ReadonlySet<string> = new Set(["plane", "cylinder", "cone", "sphere", "bspline", "extrusion"]);

/**
 * A triangle's centroid is checked against this share of the chord limit.
 * Over 87 torus fillets (three qualities, cylinder radii 0.6 to 20 mm,
 * fillets 0.05 to 0.8 mm) the worst centroid was never below 0.86 of the
 * worst centroid or edge midpoint, so checking centroids at 0.75 catches
 * every mesh whose edges stray - at a quarter of the projections.
 */
const CENTROID_SHARE = 0.75;

type TessellateOptions = { linearDeflection: number; angularDeflection: number };

function optionsFor(deflection: CadModifierDeflection): TessellateOptions {
  return { linearDeflection: deflection.linear, angularDeflection: deflection.angular };
}

function releaseAll(cad: OcctKernel, handles: ShapeHandle[]) {
  handles.forEach((handle) => {
    try {
      cad.release(handle);
    } catch {
      // A failed topology operation can invalidate temporary handles.
    }
  });
}

/**
 * Whether the mesh just stored on `shape` (by cad.tessellate with `options`)
 * strays from a face whose kind is not in UNCHECKED_SURFACE_TYPES: any
 * triangle centroid further than CENTROID_SHARE of the chord limit from its
 * own face.
 */
export function cadMeshStraysFromFaces(cad: OcctKernel, shape: ShapeHandle, options: TessellateOptions): boolean {
  const limit = options.linearDeflection * CENTROID_SHARE;
  const faces = cad.getSubShapes(shape, "face");
  try {
    for (const face of faces) {
      if (UNCHECKED_SURFACE_TYPES.has(cad.surfaceType(face))) continue;
      // The face keeps the triangulation the whole shape just got.
      const { positions, indices, triangleCount } = cad.tessellate(face, options);
      for (let triangle = 0; triangle < triangleCount; triangle += 1) {
        const a = indices[triangle * 3] * 3;
        const b = indices[triangle * 3 + 1] * 3;
        const c = indices[triangle * 3 + 2] * 3;
        const x = (positions[a] + positions[b] + positions[c]) / 3;
        const y = (positions[a + 1] + positions[b + 1] + positions[c + 1]) / 3;
        const z = (positions[a + 2] + positions[b + 2] + positions[c + 2]) / 3;
        const projected = cad.projectPointOnFace(face, { x, y, z });
        if (Math.hypot(projected.x - x, projected.y - y, projected.z - z) > limit) return true;
      }
    }
    return false;
  } finally {
    releaseAll(cad, faces);
  }
}

/**
 * Meshes a treated body with `deflection` - unless the angle can still be
 * tightened to `capped` and the mesh strays from a checked face: then fresh
 * copies of the components (OCCT keeps a triangulation a shape already has,
 * a copy has none) are meshed with `capped`, which is what every treatment
 * got before the angle loosened. The components passed in are released when
 * they are replaced; the caller owns whatever comes back.
 */
export function meshTreatedBody(cad: OcctKernel, components: ShapeHandle[], result: ShapeHandle, deflection: CadModifierDeflection, capped: CadModifierDeflection): { components: ShapeHandle[]; result: ShapeHandle; deflection: CadModifierDeflection; mesh: Mesh } {
  const mesh = cad.tessellate(result, optionsFor(deflection));
  const kept = { components, result, deflection, mesh };
  if (!(capped.angular < deflection.angular)) return kept;
  let strays = true;
  try {
    strays = cadMeshStraysFromFaces(cad, result, optionsFor(deflection));
  } catch {
    // A face the check cannot measure counts as straying.
  }
  if (!strays) return kept;
  const fresh: ShapeHandle[] = [];
  let freshResult: ShapeHandle | null = null;
  let freshMesh: Mesh;
  try {
    components.forEach((component) => fresh.push(cad.copy(component)));
    freshResult = fresh.length === 1 ? fresh[0] : cad.makeCompound(fresh);
    freshMesh = cad.tessellate(freshResult, optionsFor(capped));
  } catch {
    // The treatment itself succeeded; keep its mesh rather than fail it.
    if (freshResult !== null && fresh.length > 1) releaseAll(cad, [freshResult]);
    releaseAll(cad, fresh);
    return kept;
  }
  if (components.length > 1) releaseAll(cad, [result]);
  releaseAll(cad, components);
  return { components: fresh, result: freshResult, deflection: capped, mesh: freshMesh };
}
