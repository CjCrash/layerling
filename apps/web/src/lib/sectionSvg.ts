import type { SectionPlaneAxis } from "@/lib/sectionView";

export type SectionMeshSource = {
  /** Float32Array containing x, y, z triplets */
  positions: ArrayLike<number>;
  /** Optional index array */
  indices?: ArrayLike<number> | null;
  /** Optional 4x4 matrix elements (column-major) transforming local to world */
  matrixWorldElements?: ArrayLike<number> | null;
  /** Layer/part color */
  color?: string;
  /** Part name */
  name?: string;
};

type Vec3 = { x: number; y: number; z: number };
type Vec2 = { u: number; v: number };
type Segment2D = { from: Vec2; to: Vec2 };

function applyMatrix4(x: number, y: number, z: number, m: ArrayLike<number>): Vec3 {
  const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
  return {
    x: (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    y: (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    z: (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
  };
}

function projectTo2D(point: Vec3, axis: SectionPlaneAxis): Vec2 {
  if (axis === "x") {
    // Cut across width (YZ plane): looking from the side, Z is horizontal, Y (up) is vertical
    return { u: point.z, v: -point.y };
  }
  if (axis === "y") {
    // Cut across height (XZ plane): looking from top, X is horizontal, Z is vertical
    return { u: point.x, v: point.z };
  }
  // Cut across depth (XY plane): looking from front, X is horizontal, Y (up) is vertical
  return { u: point.x, v: -point.y };
}

function intersectPlaneEdge(p1: Vec3, p2: Vec3, d1: number, d2: number): Vec3 {
  const denom = d2 - d1;
  const t = Math.abs(denom) > 1e-12 ? Math.max(0, Math.min(1, -d1 / denom)) : 0.5;
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
    z: p1.z + t * (p2.z - p1.z),
  };
}

function sliceTriangleWithPlane(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  normal: Vec3,
  constant: number,
  axis: SectionPlaneAxis,
): Segment2D | null {
  const da = normal.x * a.x + normal.y * a.y + normal.z * a.z + constant;
  const db = normal.x * b.x + normal.y * b.y + normal.z * b.z + constant;
  const dc = normal.x * c.x + normal.y * c.y + normal.z * c.z + constant;

  const eps = 1e-6;
  const sa = Math.abs(da) < eps ? 0 : da > 0 ? 1 : -1;
  const sb = Math.abs(db) < eps ? 0 : db > 0 ? 1 : -1;
  const sc = Math.abs(dc) < eps ? 0 : dc > 0 ? 1 : -1;

  // All vertices strictly on one side
  if ((sa > 0 && sb > 0 && sc > 0) || (sa < 0 && sb < 0 && sc < 0)) {
    return null;
  }

  const intersections: Vec3[] = [];

  // Check edge A-B
  if ((da > eps && db < -eps) || (da < -eps && db > eps)) {
    intersections.push(intersectPlaneEdge(a, b, da, db));
  } else if (Math.abs(da) < eps) {
    intersections.push(a);
  }

  // Check edge B-C
  if ((db > eps && dc < -eps) || (db < -eps && dc > eps)) {
    intersections.push(intersectPlaneEdge(b, c, db, dc));
  } else if (Math.abs(db) < eps) {
    intersections.push(b);
  }

  // Check edge C-A
  if ((dc > eps && da < -eps) || (dc < -eps && da > eps)) {
    intersections.push(intersectPlaneEdge(c, a, dc, da));
  } else if (Math.abs(dc) < eps) {
    intersections.push(c);
  }

  // Deduplicate points within small epsilon
  const unique: Vec3[] = [];
  for (const pt of intersections) {
    if (!unique.some((u) => Math.hypot(u.x - pt.x, u.y - pt.y, u.z - pt.z) < 1e-4)) {
      unique.push(pt);
    }
  }

  if (unique.length < 2) return null;

  const p1_2d = projectTo2D(unique[0], axis);
  const p2_2d = projectTo2D(unique[1], axis);

  if (Math.hypot(p1_2d.u - p2_2d.u, p1_2d.v - p2_2d.v) < 1e-4) {
    return null;
  }

  return { from: p1_2d, to: p2_2d };
}

function chainSegments(segments: Segment2D[], tolerance = 0.05): Array<{ points: Vec2[]; closed: boolean }> {
  const pool = [...segments];
  const chains: Array<{ points: Vec2[]; closed: boolean }> = [];

  while (pool.length > 0) {
    const first = pool.pop()!;
    const chain: Vec2[] = [first.from, first.to];

    let extended = true;
    while (extended) {
      extended = false;
      const tail = chain[chain.length - 1];
      const head = chain[0];

      // Check if chain can close directly
      if (chain.length > 2 && Math.hypot(tail.u - head.u, tail.v - head.v) < tolerance) {
        break;
      }

      for (let i = 0; i < pool.length; i += 1) {
        const seg = pool[i];
        if (Math.hypot(seg.from.u - tail.u, seg.from.v - tail.v) < tolerance) {
          chain.push(seg.to);
          pool.splice(i, 1);
          extended = true;
          break;
        } else if (Math.hypot(seg.to.u - tail.u, seg.to.v - tail.v) < tolerance) {
          chain.push(seg.from);
          pool.splice(i, 1);
          extended = true;
          break;
        } else if (Math.hypot(seg.to.u - head.u, seg.to.v - head.v) < tolerance) {
          chain.unshift(seg.from);
          pool.splice(i, 1);
          extended = true;
          break;
        } else if (Math.hypot(seg.from.u - head.u, seg.from.v - head.v) < tolerance) {
          chain.unshift(seg.to);
          pool.splice(i, 1);
          extended = true;
          break;
        }
      }
    }

    const isClosed = chain.length > 2 && Math.hypot(chain[0].u - chain[chain.length - 1].u, chain[0].v - chain[chain.length - 1].v) < tolerance;
    chains.push({ points: chain, closed: isClosed });
  }

  return chains;
}

function xmlEscape(val: string): string {
  return val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function svgNum(val: number): string {
  return Number(val.toFixed(3)).toString();
}

/**
 * Computes 2D cross-section contours and exports them as an SVG string.
 */
export function generateSectionSvg(
  meshSources: SectionMeshSource[],
  plane: { normal: Vec3; constant: number },
  axis: SectionPlaneAxis,
  title = "layerling section",
): { svg: string; segmentCount: number; bounds: { minU: number; maxU: number; minV: number; maxV: number; width: number; height: number } } {
  const allLayers: Array<{ name: string; color: string; chains: Array<{ points: Vec2[]; closed: boolean }> }> = [];
  let totalSegments = 0;
  let minU = Number.POSITIVE_INFINITY;
  let maxU = Number.NEGATIVE_INFINITY;
  let minV = Number.POSITIVE_INFINITY;
  let maxV = Number.NEGATIVE_INFINITY;

  for (const source of meshSources) {
    const { positions, indices, matrixWorldElements, color, name } = source;
    const vertexCount = positions.length / 3;
    if (vertexCount < 3) continue;

    const layerSegments: Segment2D[] = [];
    const getVertex = (idx: number): Vec3 => {
      const x = positions[idx * 3];
      const y = positions[idx * 3 + 1];
      const z = positions[idx * 3 + 2];
      return matrixWorldElements ? applyMatrix4(x, y, z, matrixWorldElements) : { x, y, z };
    };

    if (indices && indices.length >= 3) {
      for (let i = 0; i < indices.length; i += 3) {
        const a = getVertex(indices[i]);
        const b = getVertex(indices[i + 1]);
        const c = getVertex(indices[i + 2]);
        const seg = sliceTriangleWithPlane(a, b, c, plane.normal, plane.constant, axis);
        if (seg) layerSegments.push(seg);
      }
    } else {
      for (let i = 0; i < vertexCount; i += 3) {
        const a = getVertex(i);
        const b = getVertex(i + 1);
        const c = getVertex(i + 2);
        const seg = sliceTriangleWithPlane(a, b, c, plane.normal, plane.constant, axis);
        if (seg) layerSegments.push(seg);
      }
    }

    if (layerSegments.length > 0) {
      totalSegments += layerSegments.length;
      for (const seg of layerSegments) {
        minU = Math.min(minU, seg.from.u, seg.to.u);
        maxU = Math.max(maxU, seg.from.u, seg.to.u);
        minV = Math.min(minV, seg.from.v, seg.to.v);
        maxV = Math.max(maxV, seg.from.v, seg.to.v);
      }
      const chains = chainSegments(layerSegments);
      allLayers.push({
        name: name || "Shape",
        color: color || "#0098c7",
        chains,
      });
    }
  }

  if (totalSegments === 0 || !Number.isFinite(minU)) {
    const emptySvg = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100mm" height="100mm" viewBox="0 0 100 100">',
      `  <title>${xmlEscape(title)}</title>`,
      '  <text x="50" y="50" text-anchor="middle" font-family="sans-serif" font-size="5" fill="#888">No section cut geometry</text>',
      '</svg>',
    ].join("\n");
    return {
      svg: emptySvg,
      segmentCount: 0,
      bounds: { minU: 0, maxU: 0, minV: 0, maxV: 0, width: 0, height: 0 },
    };
  }

  const padding = 5;
  const contentWidth = maxU - minU;
  const contentHeight = maxV - minV;
  const width = Math.max(1, contentWidth + padding * 2);
  const height = Math.max(1, contentHeight + padding * 2);
  const viewBoxX = minU - padding;
  const viewBoxY = minV - padding;

  const pathElements = allLayers.flatMap((layer) =>
    layer.chains.map(({ points, closed }) => {
      if (points.length < 2) return "";
      const d = points
        .map((p, idx) => `${idx === 0 ? "M" : "L"} ${svgNum(p.u)} ${svgNum(p.v)}`)
        .join(" ") + (closed ? " Z" : "");
      const stroke = layer.color;
      const fill = closed ? "rgba(0, 152, 199, 0.12)" : "none";
      return `  <path data-name="${xmlEscape(layer.name)}" d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round" />`;
    }).filter(Boolean)
  );

  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${svgNum(width)}mm" height="${svgNum(height)}mm" viewBox="${svgNum(viewBoxX)} ${svgNum(viewBoxY)} ${svgNum(width)} ${svgNum(height)}">`,
    `  <title>${xmlEscape(title)}</title>`,
    `  <desc>Cross-section cut along ${axis.toUpperCase()} axis generated by layerling</desc>`,
    ...pathElements,
    '</svg>',
  ].join("\n");

  return {
    svg,
    segmentCount: totalSegments,
    bounds: { minU, maxU, minV, maxV, width: contentWidth, height: contentHeight },
  };
}
