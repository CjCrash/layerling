import type { WorkplaneShape } from "@/types/layerling";
import * as THREE from "three";
import { quaternionForShape } from "@/lib/geometryRotation";
import { shapeDepth, shapeWidth } from "@/lib/workplaneShapes";

export type SectionPlaneAxis = "x" | "y" | "z";

export type SectionPlaneSettings = {
  enabled: boolean;
  axis: SectionPlaneAxis;
  offset: number;
  flipped: boolean;
  showPlane: boolean;
};

export type SectionBounds = {
  min: number;
  max: number;
  center: number;
  step: number;
};

export const DEFAULT_SECTION_SETTINGS: SectionPlaneSettings = {
  enabled: false,
  axis: "x",
  offset: 0,
  flipped: false,
  showPlane: true,
};

/**
 * Calculates the bounding range for the cutting plane slider along the chosen axis.
 * Adds a small margin around the shapes so the user can easily slice through the entire model.
 */
export function getSectionBounds(
  shapes: WorkplaneShape[],
  axis: SectionPlaneAxis,
  workspaceWidth = 200,
  workspaceDepth = 200,
): SectionBounds {
  const visible = shapes.filter((shape) => !shape.hidden);
  if (visible.length === 0) {
    if (axis === "x") return { min: -workspaceWidth / 2, max: workspaceWidth / 2, center: 0, step: 0.5 };
    if (axis === "y") return { min: 0, max: 100, center: 50, step: 0.5 };
    return { min: -workspaceDepth / 2, max: workspaceDepth / 2, center: 0, step: 0.5 };
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  visible.forEach((shape) => {
    // The box around the turned shape: a part turned or tipped reaches
    // further along some axes than its width, depth and height say.
    const half = new THREE.Vector3(shapeWidth(shape) / 2, shape.height / 2, shapeDepth(shape) / 2);
    const rotation = new THREE.Matrix4().makeRotationFromQuaternion(quaternionForShape(shape)).elements;
    const row = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    // Column-major: element (row, column) sits at column * 4 + row.
    const reach = Math.abs(rotation[row]) * half.x + Math.abs(rotation[4 + row]) * half.y + Math.abs(rotation[8 + row]) * half.z;
    const center = axis === "x" ? shape.x : axis === "y" ? (shape.elevation ?? 0) + shape.height / 2 : shape.z;
    min = Math.min(min, center - reach);
    max = Math.max(max, center + reach);
  });

  const span = Math.max(max - min, 1);
  const padding = Math.max(span * 0.05, 1);
  const paddedMin = Math.round((min - padding) * 10) / 10;
  const paddedMax = Math.round((max + padding) * 10) / 10;
  const center = Math.round(((min + max) / 2) * 10) / 10;

  return {
    min: paddedMin,
    max: paddedMax,
    center,
    step: 0.5,
  };
}

/**
 * The fine slider's window: a twentieth of the coarse range to either side,
 * at least 0.5 mm and at most 10 mm, in steps 200 times finer than that.
 */
export function sectionFineWindow(bounds: Pick<SectionBounds, "min" | "max">) {
  const span = Math.min(10, Math.max(0.5, (bounds.max - bounds.min) / 20));
  return { span, step: span / 200 };
}

/**
 * Computes normal vector and plane constant D for Ax + By + Cz + D = 0.
 * In Three.js: points with n · p + D >= 0 are kept, points with n · p + D < 0 are discarded.
 */
export function computeSectionPlaneVector(settings: SectionPlaneSettings) {
  let nx = 0;
  let ny = 0;
  let nz = 0;

  if (settings.axis === "x") {
    nx = settings.flipped ? -1 : 1;
  } else if (settings.axis === "y") {
    ny = settings.flipped ? -1 : 1;
  } else {
    nz = settings.flipped ? -1 : 1;
  }

  // If not flipped: n · p - offset >= 0 => keeps p >= offset.
  // If flipped: -n · p + offset >= 0 => keeps p <= offset.
  const constant = settings.flipped ? settings.offset : -settings.offset;

  return {
    normal: { x: nx, y: ny, z: nz },
    constant,
  };
}
