import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { textFont } from "@/lib/textFonts";
import { shapeDepth, shapeWidth } from "@/lib/workplaneShapes";
import type { WorkplaneShape } from "@/types/layerling";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createTextGeometry(shape: WorkplaneShape): THREE.BufferGeometry {
  const text = (shape.text ?? "TEXT").trim() || " ";
  const bevel = clamp(shape.bevel ?? 0, 0, 8);
  const fontName = shape.font ?? "Multilanguage";
  const font = textFont(fontName);
  const isCurved = Boolean(shape.textCurved);

  const textOptions = {
    font,
    size: 20,
    depth: shape.height,
    curveSegments: fontName === "Stencil" ? 1 : 8,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel * 0.22,
    bevelSize: bevel * 0.16,
    bevelSegments: Math.max(1, shape.segments ?? 0),
  };

  if (!isCurved) {
    const geometry = new TextGeometry(text, textOptions);
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

  // Curved text along a circular arc of radius R
  const radius = Math.max(5, shape.textRadius ?? 30);
  const inward = Boolean(shape.textInward);
  const charGeoms: THREE.BufferGeometry[] = [];
  const charWidths: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " ") {
      charWidths.push(10);
      continue;
    }
    const g = new TextGeometry(ch, textOptions);
    g.computeBoundingBox();
    const bb = g.boundingBox;
    const w = bb ? Math.max(1, bb.max.x - bb.min.x) : 10;
    charWidths.push(w);
    charGeoms.push(g);
  }

  const charSpacing = 3;
  const totalLength = charWidths.reduce((acc, w) => acc + w, 0) + Math.max(0, text.length - 1) * charSpacing;
  const arcSpan = totalLength / radius;
  let currentAngle = -arcSpan / 2;
  const transformed: THREE.BufferGeometry[] = [];

  let geomIndex = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = charWidths[i];
    const charAngle = currentAngle + (w / 2) / radius;
    currentAngle += (w + charSpacing) / radius;

    if (ch === " ") {
      continue;
    }

    const g = charGeoms[geomIndex++];
    // Put flat on XZ workplane
    g.rotateX(-Math.PI / 2);
    g.computeBoundingBox();
    const bb = g.boundingBox;
    if (bb) {
      g.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
    }

    // Tangential rotation along arc
    if (inward) {
      g.rotateY(Math.PI - charAngle);
    } else {
      g.rotateY(-charAngle);
    }

    // Translate to circle perimeter at radius
    g.translate(radius * Math.sin(charAngle), 0, radius * Math.cos(charAngle));
    transformed.push(g);
  }

  if (transformed.length === 0) {
    // Fallback for empty/whitespace string
    const fallback = new THREE.BoxGeometry(0.001, shape.height, 0.001);
    return fallback;
  }

  const merged = mergeGeometries(transformed, false);
  merged.computeBoundingBox();
  const finalBox = merged.boundingBox;
  if (finalBox) {
    merged.translate(
      -(finalBox.min.x + finalBox.max.x) / 2,
      -finalBox.min.y,
      -(finalBox.min.z + finalBox.max.z) / 2,
    );
  }
  merged.computeVertexNormals();
  return merged;
}
