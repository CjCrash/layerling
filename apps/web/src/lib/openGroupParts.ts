/**
 * Which objects on the workplane belong to the group that is open for editing.
 *
 * Opening a group notes its parts by id. Many edits replace a part with a new
 * object under a new id - grouping two parts, cutting, separating, ungrouping a
 * group among them - and Done would then leave that result outside the rebuilt
 * group. The rule here: when one step removes at least one part and brings in
 * new objects, those objects take the removed parts' place in the group. A step
 * that removes nothing (a new shape, a paste, a duplicate) adds nobody.
 *
 * Ids are only ever added, never dropped: undo and redo bring back the earlier
 * objects under their old ids, which are then still on the list. Done takes the
 * ids that are on the workplane at that moment.
 */
export function trackOpenGroupParts(
  partIds: readonly string[],
  previous: readonly { id: string }[],
  next: readonly { id: string }[],
): readonly string[] {
  const nextIds = new Set(next.map((shape) => shape.id));
  const previousIds = new Set(previous.map((shape) => shape.id));
  const removedPart = partIds.findIndex((id) => previousIds.has(id) && !nextIds.has(id));
  if (removedPart < 0) return partIds;
  const parts = new Set(partIds);
  const added = next.map((shape) => shape.id).filter((id) => !previousIds.has(id) && !parts.has(id));
  if (!added.length) return partIds;
  // Where the first replaced part stood, so the rebuilt group keeps its order.
  return [...partIds.slice(0, removedPart + 1), ...added, ...partIds.slice(removedPart + 1)];
}
