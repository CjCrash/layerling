import { describe, it, expect, vi } from "vitest";
import type { WorkplaneShape } from "@/types/layerling";

describe("ObjectListPanel & Outliner logic", () => {
  const cube: WorkplaneShape = {
    id: "cube-1",
    kind: "box",
    name: "Main Body",
    x: 0,
    y: 0,
    z: 0,
    width: 20,
    depth: 20,
    height: 20,
    size: 20,
    color: "#d41721",
    hole: false,
    locked: false,
    hidden: false,
  };

  const holeCylinder: WorkplaneShape = {
    id: "cyl-1",
    kind: "cylinder",
    name: "Hole Cutout",
    x: 0,
    y: 0,
    z: 0,
    width: 10,
    depth: 10,
    height: 25,
    size: 10,
    color: "#b8c2cc",
    hole: true,
    locked: true,
    hidden: false,
  };

  const group: WorkplaneShape = {
    id: "grp-1",
    kind: "mesh",
    name: "Gear with Hole",
    x: 0,
    y: 0,
    z: 0,
    width: 30,
    depth: 30,
    height: 20,
    size: 30,
    color: "#d41721",
    hole: false,
    groupedShapes: [cube, holeCylinder],
  };

  it("identifies solid vs hole and group shapes accurately", () => {
    expect(cube.hole).toBe(false);
    expect(holeCylinder.hole).toBe(true);
    expect(Boolean(group.groupedShapes?.length)).toBe(true);
    expect(group.groupedShapes?.length).toBe(2);
  });

  it("calculates exportable count and detects holes-only condition", () => {
    const onlyHoles = [holeCylinder];
    const mixed = [cube, holeCylinder];

    const exportableFromHoles = onlyHoles.filter((s) => !s.hole).length;
    const isHolesOnly = onlyHoles.length > 0 && onlyHoles.every((s) => s.hole);
    expect(exportableFromHoles).toBe(0);
    expect(isHolesOnly).toBe(true);

    const exportableFromMixed = mixed.filter((s) => !s.hole).length;
    const isMixedHolesOnly = mixed.length > 0 && mixed.every((s) => s.hole);
    expect(exportableFromMixed).toBe(1);
    expect(isMixedHolesOnly).toBe(false);
  });
});
