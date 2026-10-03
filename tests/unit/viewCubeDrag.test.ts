import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  VIEW_CUBE_DRAG_RADIANS_PER_PX,
  VIEW_CUBE_DRAG_THRESHOLD_PX,
  beginViewCubeDrag,
  moveViewCubeDrag,
  orbitOffsetByDrag,
  viewCubeAngles,
} from "@/lib/viewCubeDrag";

const DEGREES_PER_PX = THREE.MathUtils.radToDeg(VIEW_CUBE_DRAG_RADIANS_PER_PX);

// The editor's home view: a little above the plate, looking at it from the front right.
function homeOffset() {
  return new THREE.Vector3(120, 90, 160);
}

describe("view cube drag gesture", () => {
  it("stays a click while the pointer moves less than the threshold", () => {
    const drag = beginViewCubeDrag(1, 100, 100);

    expect(moveViewCubeDrag(drag, 101, 101)).toBeNull();
    expect(moveViewCubeDrag(drag, 100 + VIEW_CUBE_DRAG_THRESHOLD_PX - 1, 100)).toBeNull();
    expect(drag.dragging).toBe(false);
  });

  it("becomes a drag at the threshold and reports the move from the press", () => {
    const drag = beginViewCubeDrag(1, 100, 100);
    moveViewCubeDrag(drag, 102, 100);

    expect(moveViewCubeDrag(drag, 100 + VIEW_CUBE_DRAG_THRESHOLD_PX, 100)).toEqual({ started: true, dx: VIEW_CUBE_DRAG_THRESHOLD_PX, dy: 0 });
    expect(drag.dragging).toBe(true);
  });

  it("measures the threshold diagonally, not per axis", () => {
    const drag = beginViewCubeDrag(1, 0, 0);

    // 3 px each way is 4.2 px from the press, though neither axis reaches 4.
    expect(moveViewCubeDrag(drag, 3, 3)).toMatchObject({ started: true, dx: 3, dy: 3 });
  });

  it("reports each later move relative to the last one, without starting again", () => {
    const drag = beginViewCubeDrag(1, 0, 0);
    moveViewCubeDrag(drag, 10, 0);

    expect(moveViewCubeDrag(drag, 15, -2)).toEqual({ started: false, dx: 5, dy: -2 });
    // Coming back inside the threshold area keeps dragging.
    expect(moveViewCubeDrag(drag, 0, 0)).toEqual({ started: false, dx: -15, dy: 2 });
  });
});

describe("orbiting the camera by a view cube drag", () => {
  it("keeps the distance to the orbit target", () => {
    const offset = homeOffset();
    const turned = orbitOffsetByDrag(offset, 37, -22);

    expect(turned.length()).toBeCloseTo(offset.length(), 9);
  });

  it("turns the cube with the pointer when dragged sideways", () => {
    const before = viewCubeAngles(homeOffset());
    const after = viewCubeAngles(orbitOffsetByDrag(homeOffset(), 10, 0));

    // The cube is drawn turned by -yaw, so a falling yaw turns it right, with the pointer.
    expect(after.yaw - before.yaw).toBeCloseTo(-10 * DEGREES_PER_PX, 9);
    expect(after.pitch).toBeCloseTo(before.pitch, 9);
  });

  it("tips the camera up towards the top view when dragged down", () => {
    const before = viewCubeAngles(homeOffset());
    const after = viewCubeAngles(orbitOffsetByDrag(homeOffset(), 0, 5));

    expect(after.pitch - before.pitch).toBeCloseTo(5 * DEGREES_PER_PX, 9);
    expect(after.yaw).toBeCloseTo(before.yaw, 9);
  });

  it("comes back to the same view after a full turn", () => {
    const fullTurnPx = (2 * Math.PI) / VIEW_CUBE_DRAG_RADIANS_PER_PX;
    const turned = orbitOffsetByDrag(homeOffset(), fullTurnPx, 0);

    expect(turned.distanceTo(homeOffset())).toBeLessThan(1e-9);
  });

  it("stops just short of straight above and below instead of flipping over", () => {
    const over = orbitOffsetByDrag(homeOffset(), 0, 10_000);
    const under = orbitOffsetByDrag(homeOffset(), 0, -10_000);

    expect(viewCubeAngles(over).pitch).toBeGreaterThan(89.99);
    expect(viewCubeAngles(over).pitch).toBeLessThan(90);
    expect(viewCubeAngles(under).pitch).toBeLessThan(-89.99);
    expect(viewCubeAngles(under).pitch).toBeGreaterThan(-90);
    for (const offset of [over, under]) {
      expect([offset.x, offset.y, offset.z].every(Number.isFinite)).toBe(true);
    }
  });

  it("keeps the heading when dragged past the top and back", () => {
    const startYaw = viewCubeAngles(homeOffset()).yaw;
    const back = orbitOffsetByDrag(orbitOffsetByDrag(homeOffset(), 0, 10_000), 0, -20);

    expect(viewCubeAngles(back).yaw).toBeCloseTo(startYaw, 6);
  });

  it("can still turn around the vertical axis from the top view", () => {
    const top = new THREE.Vector3(0, 200, 0);
    const turned = orbitOffsetByDrag(top, 30, 0);

    expect(turned.length()).toBeCloseTo(200, 9);
    expect(viewCubeAngles(turned).pitch).toBeGreaterThan(89.99);
  });
});

describe("view cube angles", () => {
  it("matches the straight views the cube's sides jump to", () => {
    expect(viewCubeAngles(new THREE.Vector3(0, 0, 50))).toEqual({ pitch: 0, yaw: 0 });
    expect(viewCubeAngles(new THREE.Vector3(50, 0, 0)).yaw).toBeCloseTo(90, 9);
    expect(viewCubeAngles(new THREE.Vector3(-50, 0, 0)).yaw).toBeCloseTo(-90, 9);
    // Straight up and down the horizontal distance is floored to stay off atan2(y, 0).
    expect(viewCubeAngles(new THREE.Vector3(0, 50, 0)).pitch).toBeCloseTo(90, 2);
    expect(viewCubeAngles(new THREE.Vector3(0, -50, 0)).pitch).toBeCloseTo(-90, 2);
  });
});

// The faces are buttons inside the draggable cube. A drag must not also click
// the face it ends on, and a plain click must still reach the face.
describe("view cube wiring in the viewport", () => {
  const source = readFileSync(
    fileURLToPath(new URL("../../apps/web/src/components/WorkplaneViewport.tsx", import.meta.url)),
    "utf8",
  );
  const cube = source.slice(source.indexOf('className={`view-cube '), source.indexOf('<div className={`camera-controls'));

  it("keeps a click on every face jumping to its view", () => {
    for (const face of ["top", "bottom", "front", "back", "right", "left"]) {
      expect(cube).toContain(`onClick={() => setViewCubeFace("${face}")}`);
    }
  });

  it("handles the drag on the cube and swallows the click that ends it", () => {
    expect(cube).toContain("onPointerDown={handleViewCubePointerDown}");
    expect(cube).toContain("onPointerMove={handleViewCubePointerMove}");
    expect(cube).toContain("onPointerUp={endViewCubeDrag}");
    expect(cube).toContain("onPointerCancel={endViewCubeDrag}");
    expect(cube).toContain("onClickCapture={handleViewCubeClickCapture}");
  });
});
