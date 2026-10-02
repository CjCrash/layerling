import type { WorkplaneShape } from "@/types/layerling";
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
    const w = shapeWidth(shape);
    const d = shapeDepth(shape);
    const h = shape.height;
    const elev = shape.elevation ?? 0;

    if (axis === "x") {
      min = Math.min(min, shape.x - w / 2);
      max = Math.max(max, shape.x + w / 2);
    } else if (axis === "y") {
      min = Math.min(min, elev);
      max = Math.max(max, elev + h);
    } else {
      min = Math.min(min, shape.z - d / 2);
      max = Math.max(max, shape.z + d / 2);
    }
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
