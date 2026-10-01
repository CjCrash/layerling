import { unzipSync } from "fflate";
import { zUpToLayerling } from "@/lib/meshCoordinates";
import { importedShapeFromTriangleSoup } from "@/lib/stlImport";
import type { WorkplaneShape } from "@/types/layerling";

// ---------------------------------------------------------------------------
// 3MF spec: https://github.com/3MFConsortium/spec_core/blob/master/3MF%20Core%20Specification.md
//
// A 3MF file is a ZIP archive containing (at minimum):
//   3D/3dmodel.model  — UTF-8 XML with vertices and triangles
//
// Coordinate system: millimetres, Z-up (same as slicers).
// We apply the same zUpToLayerling transform used for STL/OBJ.
// ---------------------------------------------------------------------------

/** A 4×4 column-major transform matrix from the 3MF "m" attribute (12 values, row-major in spec). */
type Matrix4x3 = readonly [
  number, number, number,
  number, number, number,
  number, number, number,
  number, number, number,
];

const IDENTITY_M: Matrix4x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

function parseMatrix(attr: string | null): Matrix4x3 {
  if (!attr) return IDENTITY_M;
  const values = attr.trim().split(/\s+/).map(Number);
  if (values.length !== 12 || values.some((v) => !Number.isFinite(v))) return IDENTITY_M;
  return values as unknown as Matrix4x3;
}

function applyMatrix(m: Matrix4x3, x: number, y: number, z: number): [number, number, number] {
  // 3MF row-major 3×4: [m00..m02 | m10..m12 | m20..m22 | m30..m32]
  return [
    m[0] * x + m[3] * y + m[6] * z + m[9],
    m[1] * x + m[4] * y + m[7] * z + m[10],
    m[2] * x + m[5] * y + m[8] * z + m[11],
  ];
}

function isIdentity(m: Matrix4x3) {
  return m === IDENTITY_M || (
    m[0] === 1 && m[1] === 0 && m[2] === 0 &&
    m[3] === 0 && m[4] === 1 && m[5] === 0 &&
    m[6] === 0 && m[7] === 0 && m[8] === 1 &&
    m[9] === 0 && m[10] === 0 && m[11] === 0
  );
}

/** Extract all vertex/triangle data from a single <object> element. */
function extractObjectMesh(
  objectEl: Element,
  rawPositions: number[],
  transform: Matrix4x3,
) {
  const meshEl = objectEl.querySelector("mesh");
  if (!meshEl) return;

  const vertexEls = meshEl.querySelectorAll("vertices > vertex");
  const vertices: [number, number, number][] = [];
  for (let i = 0; i < vertexEls.length; i++) {
    const el = vertexEls[i];
    const x = Number(el.getAttribute("x"));
    const y = Number(el.getAttribute("y"));
    const z = Number(el.getAttribute("z"));
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new Error("3MF contains a non-finite vertex");
    }
    vertices.push(isIdentity(transform) ? [x, y, z] : applyMatrix(transform, x, y, z));
  }

  const triangleEls = meshEl.querySelectorAll("triangles > triangle");
  for (let i = 0; i < triangleEls.length; i++) {
    const el = triangleEls[i];
    const v1 = Number(el.getAttribute("v1"));
    const v2 = Number(el.getAttribute("v2"));
    const v3 = Number(el.getAttribute("v3"));
    if (v1 < 0 || v1 >= vertices.length || v2 < 0 || v2 >= vertices.length || v3 < 0 || v3 >= vertices.length) {
      throw new Error("3MF triangle references out-of-range vertex");
    }
    const [ax, ay, az] = zUpToLayerling(vertices[v1]);
    const [bx, by, bz] = zUpToLayerling(vertices[v2]);
    const [cx, cy, cz] = zUpToLayerling(vertices[v3]);
    rawPositions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
  }
}

/** One model file of the package, with its objects by id. */
type ModelPart = { objects: Map<string, Element>; doc: Document };

/** How deep components may nest before we assume a loop. */
const MAX_COMPONENT_DEPTH = 16;

function parseModelPart(bytes: Uint8Array): ModelPart {
  const xml = new TextDecoder("utf-8").decode(bytes);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error(`3MF XML is invalid: ${parseError.textContent?.slice(0, 120)}`);
  const objects = new Map<string, Element>();
  doc.querySelectorAll("object").forEach((el) => {
    const id = el.getAttribute("id");
    if (id) objects.set(id, el);
  });
  return { doc, objects };
}

/** The production extension's p:path, which names another model file of the package. */
function componentPath(component: Element): string | null {
  const path = component.getAttribute("p:path") ?? component.getAttributeNS("http://schemas.microsoft.com/3dmanufacturing/production/2015/06", "path");
  return path ? path.replace(/^\/+/, "").toLowerCase() : null;
}

/**
 * Resolve all <item> references in <build> and gather triangles. An object is
 * either a mesh or a list of components; a component names another object,
 * in this file or - the way Bambu Studio, OrcaSlicer and PrusaSlicer write
 * their projects - in another model file of the package (p:path). Components
 * may nest.
 */
function gatherMeshes(files: Record<string, Uint8Array>, mainKey: string, main: ModelPart): number[] {
  const rawPositions: number[] = [];
  const parts = new Map<string, ModelPart>([[mainKey.toLowerCase(), main]]);
  const keyByLowerCase = new Map(Object.keys(files).map((key) => [key.toLowerCase(), key]));
  const partFor = (path: string): ModelPart | null => {
    const cached = parts.get(path);
    if (cached) return cached;
    const key = keyByLowerCase.get(path);
    if (!key) return null;
    const part = parseModelPart(files[key]);
    parts.set(path, part);
    return part;
  };

  const addObject = (part: ModelPart, partPath: string, objectEl: Element, transform: Matrix4x3, depth: number) => {
    if (depth > MAX_COMPONENT_DEPTH) return;
    if (objectEl.querySelector(":scope > mesh")) {
      extractObjectMesh(objectEl, rawPositions, transform);
      return;
    }
    objectEl.querySelectorAll(":scope > components > component").forEach((comp) => {
      const compId = comp.getAttribute("objectid");
      if (!compId) return;
      const externalPath = componentPath(comp);
      const targetPath = externalPath ?? partPath;
      const targetPart = externalPath ? partFor(externalPath) : part;
      const compObj = targetPart?.objects.get(compId);
      if (!targetPart || !compObj) return;
      // Component first, then the transform of whatever contains it.
      addObject(targetPart, targetPath, compObj, combineTransforms(transform, parseMatrix(comp.getAttribute("transform"))), depth + 1);
    });
  };

  const mainPath = mainKey.toLowerCase();
  // Process each <item> in <build>
  const items = main.doc.querySelectorAll("build > item");
  if (items.length === 0) {
    // Fallback: no <build> section, just import all objects with meshes
    main.objects.forEach((objectEl) => addObject(main, mainPath, objectEl, IDENTITY_M, 0));
    return rawPositions;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const objectId = item.getAttribute("objectid");
    if (!objectId) continue;
    const transform = parseMatrix(item.getAttribute("transform"));

    const objectEl = main.objects.get(objectId);
    if (!objectEl) continue;

    const objectType = objectEl.getAttribute("type");
    // Skip support / other structural types
    if (objectType && objectType !== "model") continue;

    addObject(main, mainPath, objectEl, transform, 0);
  }

  return rawPositions;
}

/** Combine two 3×4 row-major transforms: result = outer(inner(v)). */
function combineTransforms(outer: Matrix4x3, inner: Matrix4x3): Matrix4x3 {
  if (isIdentity(outer)) return inner;
  if (isIdentity(inner)) return outer;
  // Multiply 3×3 rotation parts and add translations
  const result: number[] = [
    outer[0]*inner[0] + outer[3]*inner[1] + outer[6]*inner[2],
    outer[1]*inner[0] + outer[4]*inner[1] + outer[7]*inner[2],
    outer[2]*inner[0] + outer[5]*inner[1] + outer[8]*inner[2],
    outer[0]*inner[3] + outer[3]*inner[4] + outer[6]*inner[5],
    outer[1]*inner[3] + outer[4]*inner[4] + outer[7]*inner[5],
    outer[2]*inner[3] + outer[5]*inner[4] + outer[8]*inner[5],
    outer[0]*inner[6] + outer[3]*inner[7] + outer[6]*inner[8],
    outer[1]*inner[6] + outer[4]*inner[7] + outer[7]*inner[8],
    outer[2]*inner[6] + outer[5]*inner[7] + outer[8]*inner[8],
    outer[0]*inner[9] + outer[3]*inner[10] + outer[6]*inner[11] + outer[9],
    outer[1]*inner[9] + outer[4]*inner[10] + outer[7]*inner[11] + outer[10],
    outer[2]*inner[9] + outer[5]*inner[10] + outer[8]*inner[11] + outer[11],
  ];
  return result as unknown as Matrix4x3;
}

export function importedShapeFrom3mf(fileName: string, buffer: ArrayBuffer): WorkplaneShape {
  // 1. Unzip
  let files: ReturnType<typeof unzipSync>;
  try {
    files = unzipSync(new Uint8Array(buffer));
  } catch {
    throw new Error("3MF file could not be unzipped — is the file corrupt?");
  }

  // 2. Find the model file (case-insensitive; may be in a subdirectory)
  const modelKey = Object.keys(files).find(
    (k) => k.toLowerCase() === "3d/3dmodel.model",
  );
  if (!modelKey) throw new Error("3MF file does not contain 3D/3dmodel.model");

  // 3. Parse XML
  const main = parseModelPart(files[modelKey]);

  // 4. Gather all triangles
  const rawPositions = gatherMeshes(files, modelKey, main);
  if (!rawPositions.length) throw new Error("3MF file contains no readable geometry");

  // 5. Build WorkplaneShape (normals computed from triangle positions)
  return importedShapeFromTriangleSoup(fileName, rawPositions, undefined, "3mf");
}
