export type SketchSelection =
  | { kind: "point"; id: string }
  | { kind: "segment"; id: string }
  | { kind: "image"; id: string }
  | { kind: "multiple"; pointIds: string[]; segmentIds: string[]; imageIds?: string[] }
  | null;

export type SketchSelectableEntity = { kind: "point" | "segment"; id: string };

/**
 * Shift+click in the sketch: adds a point or line to the selection, or takes it
 * out if it is already in. What is left collapses to the plain single kinds, so
 * one remaining point still gets the point tools (corner, smooth, split) and
 * nothing left means no selection at all.
 */
export function toggleSketchSelection(selected: SketchSelection, entity: SketchSelectableEntity): SketchSelection {
  const pointIds = selected?.kind === "multiple" ? [...selected.pointIds] : selected?.kind === "point" ? [selected.id] : [];
  const segmentIds = selected?.kind === "multiple" ? [...selected.segmentIds] : selected?.kind === "segment" ? [selected.id] : [];
  const imageIds = selected?.kind === "multiple" ? [...(selected.imageIds ?? [])] : selected?.kind === "image" ? [selected.id] : [];
  const ids = entity.kind === "point" ? pointIds : segmentIds;
  const index = ids.indexOf(entity.id);
  if (index >= 0) ids.splice(index, 1);
  else ids.push(entity.id);

  const count = pointIds.length + segmentIds.length + imageIds.length;
  if (count === 0) return null;
  if (count === 1) {
    if (pointIds.length) return { kind: "point", id: pointIds[0] };
    if (segmentIds.length) return { kind: "segment", id: segmentIds[0] };
    return { kind: "image", id: imageIds[0] };
  }
  return { kind: "multiple", pointIds, segmentIds, imageIds };
}

export function sketchSelectionCount(selected: SketchSelection): number {
  if (!selected) return 0;
  if (selected.kind === "multiple") return selected.pointIds.length + selected.segmentIds.length + (selected.imageIds?.length ?? 0);
  return 1;
}
