import type { ShellOpenings } from "@/types/layerling";

export const MIN_SHELL_WALL = 0.2;

/**
 * The thickest wall the Hollow tool offers. Across, two walls must leave room
 * for the cavity, so half the narrower side. Up and down it depends on what
 * stays closed: a frame (open top and bottom) has no floor or lid, so the
 * height does not matter at all; one open side leaves only the floor or lid,
 * which may be almost as thick as the part is tall; closed all round, floor
 * and lid share the height. Until 1.18.5 half the height applied everywhere,
 * which refused Fratercula's 1 mm frame from a 1 mm plate.
 */
export function shellMaxThickness(size: { width: number; depth: number; height: number }, openings: ShellOpenings) {
  const across = Math.min(size.width, size.depth) / 2;
  const vertical = openings === "top-bottom"
    ? Number.POSITIVE_INFINITY
    : openings === "none"
      ? size.height / 2
      : size.height - MIN_SHELL_WALL;
  return Math.max(MIN_SHELL_WALL, Math.min(across, vertical));
}
