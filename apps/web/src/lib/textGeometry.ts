import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { textFont } from "@/lib/textFonts";
import { shapeDepth, shapeWidth } from "@/lib/workplaneShapes";
import type { WorkplaneShape } from "@/types/layerling";

/** Font size the straight text is laid out at before it is fitted into its box. */
const LAYOUT_SIZE = 20;
export const DEFAULT_TEXT_SIZE = 10;
export const MIN_TEXT_RADIUS = 5;
export const MAX_TEXT_RADIUS = 500;
/** Longest arc the lettering may take, as a share of the full circle - leaves a gap so the ends never meet. */
const MAX_ARC_SHARE = 0.84;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function textOf(shape: Pick<WorkplaneShape, "text">) {
  return (shape.text ?? "TEXT").trim() || " ";
}

function textOptions(shape: WorkplaneShape, size: number) {
  const bevel = clamp(shape.bevel ?? 0, 0, 8);
  const fontName = shape.font ?? "Multilanguage";
  return {
    font: textFont(fontName),
    size,
    depth: shape.height,
    curveSegments: fontName === "Stencil" ? 1 : 8,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel * 0.22,
    bevelSize: bevel * 0.16,
    bevelSegments: Math.max(1, shape.segments ?? 0),
  };
}

/** How far the pen moves after a character - the font's own advance, so "i" and "m" sit as the typeface intends. */
function advanceOf(font: Font, char: string, size: number): number {
  const data = font.data as { resolution?: number; glyphs?: Record<string, { ha?: number }> };
  const glyph = data.glyphs?.[char] ?? data.glyphs?.["?"];
  const resolution = data.resolution || 1000;
  return glyph?.ha !== undefined ? (glyph.ha * size) / resolution : size * 0.6;
}

function curvedRadius(shape: WorkplaneShape) {
  return clamp(shape.textRadius ?? 30, MIN_TEXT_RADIUS, MAX_TEXT_RADIUS);
}

function curvedSize(shape: WorkplaneShape) {
  return Math.max(0.5, shape.textSize ?? DEFAULT_TEXT_SIZE);
}

/**
 * Curved text at its real measures: the baseline lies on a circle of
 * `textRadius`, the letters stand `textSize` tall. Every glyph keeps the
 * font's baseline (y = 0), so "a", "T", "g" and "." line up exactly as in a
 * straight line - only the line itself is bent. The centre of the circle stays
 * at the origin, so centring the text on a round body puts it concentric.
 */
function buildCurvedText(shape: WorkplaneShape): THREE.BufferGeometry | null {
  const text = textOf(shape);
  const radius = curvedRadius(shape);
  const font = textFont(shape.font ?? "Multilanguage");
  let size = curvedSize(shape);
  const chars = [...text];

  // Too long for the circle: shrink the letters rather than let the ends overlap.
  const naturalLength = chars.reduce((sum, char) => sum + advanceOf(font, char, size), 0);
  const maxLength = 2 * Math.PI * radius * MAX_ARC_SHARE;
  if (naturalLength > maxLength) size *= maxLength / naturalLength;

  const advances = chars.map((char) => advanceOf(font, char, size));
  const totalLength = advances.reduce((sum, advance) => sum + advance, 0);
  // Upside down: lay the line out the other way round, then turn it half a
  // circle about the centre - it lands back on the same side of the circle.
  const flipped = Boolean(shape.textFlipped);
  const inward = Boolean(shape.textInward) !== flipped;
  const options = textOptions(shape, size);
  const placed: THREE.BufferGeometry[] = [];

  let run = -totalLength / 2;
  chars.forEach((char, index) => {
    const advance = advances[index];
    const angle = (run + advance / 2) / radius;
    run += advance;
    if (!char.trim()) return;

    const glyph = new TextGeometry(char, options);
    // Flat on the workplane: letter height points to -Z, thickness to +Y.
    glyph.rotateX(-Math.PI / 2);
    // Centre the advance box on its arc point - horizontally only, the baseline stays at z = 0.
    glyph.translate(-advance / 2, 0, 0);
    if (inward) {
      // Along the bottom of the circle, read left to right, letters pointing at the centre.
      glyph.rotateY(angle);
      glyph.translate(radius * Math.sin(angle), 0, radius * Math.cos(angle));
    } else {
      // Along the top of the circle, letters pointing away from the centre.
      glyph.rotateY(-angle);
      glyph.translate(radius * Math.sin(angle), 0, -radius * Math.cos(angle));
    }
    placed.push(glyph);
  });

  if (!placed.length) return null;
  const merged = mergeGeometries(placed, false);
  placed.forEach((glyph) => glyph.dispose());
  if (flipped) merged.rotateY(Math.PI);
  merged.computeBoundingBox();
  const box = merged.boundingBox;
  if (box) merged.translate(0, -box.min.y, 0);
  return merged;
}

/**
 * The box of curved text is symmetric around the circle centre: as wide and
 * deep as the lettering reaches out from it on either side. It may hold empty
 * space, but the shape's middle is the circle's middle.
 */
function symmetricExtent(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return null;
  return {
    width: Math.max(0.1, 2 * Math.max(Math.abs(box.min.x), Math.abs(box.max.x))),
    depth: Math.max(0.1, 2 * Math.max(Math.abs(box.min.z), Math.abs(box.max.z))),
  };
}

const footprintCache = new Map<string, { width: number; depth: number }>();

/** The width and depth curved text takes at its own radius and letter size. */
export function curvedTextFootprint(shape: WorkplaneShape): { width: number; depth: number } {
  const key = JSON.stringify([textOf(shape), shape.font ?? "Multilanguage", curvedSize(shape), curvedRadius(shape), Boolean(shape.textInward), Boolean(shape.textFlipped), shape.bevel ?? 0]);
  const cached = footprintCache.get(key);
  if (cached) return cached;
  const geometry = buildCurvedText({ ...shape, height: 1 });
  let result = { width: curvedSize(shape), depth: curvedSize(shape) };
  if (geometry) {
    result = symmetricExtent(geometry) ?? result;
    geometry.dispose();
  }
  footprintCache.set(key, result);
  return result;
}

/** Width and depth of the straight line at layout size, before it is fitted into its box. */
function straightTextExtent(shape: WorkplaneShape) {
  const geometry = new TextGeometry(textOf(shape), textOptions({ ...shape, height: 1 }, LAYOUT_SIZE));
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const extent = box ? { width: Math.max(1, box.max.x - box.min.x), depth: Math.max(1, box.max.y - box.min.y) } : { width: LAYOUT_SIZE, depth: LAYOUT_SIZE };
  geometry.dispose();
  return extent;
}

const CURVE_KEYS = ["textCurved", "textRadius", "textInward", "textFlipped", "textSize", "text", "font", "bevel"] as const;

/**
 * Keeps curved text and its box in step. Straight text simply fills its box;
 * curved text is defined by radius and letter size, so the box follows them:
 *
 * - switching the curve on takes the letter size the straight text had,
 * - switching it off lays the straight line out at that letter size again,
 * - changing text, font, radius or size re-measures the box,
 * - pulling a handle scales radius and letter size together, so the values in
 *   the inspector always match what is drawn.
 */
export function curvedTextPatch(shape: WorkplaneShape, patch: Partial<WorkplaneShape>): Partial<WorkplaneShape> {
  const next = { ...shape, ...patch } as WorkplaneShape;
  if (next.kind !== "text") return patch;
  const wasCurved = Boolean(shape.textCurved);
  const isCurved = Boolean(next.textCurved);
  if (!wasCurved && !isCurved) return patch;

  if (!wasCurved && isCurved) {
    const extent = straightTextExtent(shape);
    const scale = Math.min(shapeWidth(shape) / extent.width, shapeDepth(shape) / extent.depth);
    const textSize = Number((patch.textSize ?? LAYOUT_SIZE * scale).toFixed(2));
    const textRadius = patch.textRadius ?? shape.textRadius ?? Math.max(MIN_TEXT_RADIUS, Math.round(shapeWidth(shape) / Math.PI));
    const footprint = curvedTextFootprint({ ...next, textSize, textRadius });
    return { ...patch, textSize, textRadius, ...footprint, size: Math.max(footprint.width, footprint.depth) };
  }

  if (wasCurved && !isCurved) {
    const extent = straightTextExtent(next);
    const scale = curvedSize(next) / LAYOUT_SIZE;
    const width = extent.width * scale;
    const depth = extent.depth * scale;
    return { ...patch, width, depth, size: Math.max(width, depth) };
  }

  const touchesCurve = CURVE_KEYS.some((key) => key in patch);
  const resized = patch.width !== undefined || patch.depth !== undefined || patch.size !== undefined;
  if (resized && !touchesCurve) {
    const current = curvedTextFootprint(shape);
    const factors = [
      patch.width !== undefined ? patch.width / current.width : null,
      patch.depth !== undefined ? patch.depth / current.depth : null,
      patch.width === undefined && patch.depth === undefined && patch.size !== undefined ? patch.size / Math.max(current.width, current.depth) : null,
    ].filter((factor): factor is number => factor !== null && Number.isFinite(factor) && factor > 0);
    // One handle pulled: follow it. Both: the smaller step, so the text still fits.
    const factor = factors.length ? Math.min(...factors) : 1;
    const textSize = Number((curvedSize(shape) * factor).toFixed(2));
    const textRadius = Number(clamp(curvedRadius(shape) * factor, MIN_TEXT_RADIUS, MAX_TEXT_RADIUS).toFixed(2));
    const footprint = curvedTextFootprint({ ...next, textSize, textRadius });
    return { ...patch, textSize, textRadius, ...footprint, size: Math.max(footprint.width, footprint.depth) };
  }

  if (touchesCurve) {
    const footprint = curvedTextFootprint(next);
    return { ...patch, ...footprint, size: Math.max(footprint.width, footprint.depth) };
  }
  return patch;
}

export function createTextGeometry(shape: WorkplaneShape): THREE.BufferGeometry {
  if (shape.textCurved) {
    const curved = buildCurvedText(shape);
    if (!curved) return new THREE.BoxGeometry(0.001, shape.height, 0.001);
    // The box normally matches already; if it does not (older data, a stray
    // width), fit uniformly so the drawing never leaves its own frame.
    const extent = symmetricExtent(curved);
    if (extent) {
      const scale = Math.min(shapeWidth(shape) / extent.width, shapeDepth(shape) / extent.depth);
      if (Number.isFinite(scale) && Math.abs(scale - 1) > 1e-3) curved.scale(scale, 1, scale);
    }
    curved.computeVertexNormals();
    return curved;
  }

  const geometry = new TextGeometry(textOf(shape), textOptions(shape, LAYOUT_SIZE));
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (box) {
    const textWidth = Math.max(1, box.max.x - box.min.x);
    const textDepth = Math.max(1, box.max.y - box.min.y);
    const scale = Math.min(shapeWidth(shape) / textWidth, shapeDepth(shape) / textDepth);
    geometry.scale(scale, scale, 1);
  }

  geometry.rotateX(-Math.PI / 2);
  geometry.computeBoundingBox();
  const rotatedBox = geometry.boundingBox;
  if (rotatedBox) {
    geometry.translate(
      -(rotatedBox.min.x + rotatedBox.max.x) / 2,
      -rotatedBox.min.y,
      -(rotatedBox.min.z + rotatedBox.max.z) / 2,
    );
  }
  return geometry;
}
