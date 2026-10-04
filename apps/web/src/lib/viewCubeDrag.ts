import * as THREE from "three";

/** How far a press on the view cube moves before it is a drag rather than a click. */
export const VIEW_CUBE_DRAG_THRESHOLD_PX = 4;
/** Turn per pixel dragged; about 80 px turns the view half way round. */
export const VIEW_CUBE_DRAG_RADIANS_PER_PX = 0.04;
/** Keeps the camera a hair off the poles, where lookAt has no defined up. */
export const VIEW_CUBE_POLE_EPSILON = 0.0001;

export type ViewCubeDrag = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  dragging: boolean;
};

export function beginViewCubeDrag(pointerId: number, x: number, y: number): ViewCubeDrag {
  return { pointerId, startX: x, startY: y, lastX: x, lastY: y, dragging: false };
}

/**
 * Feeds one pointer move into the gesture. Until the pointer leaves the
 * threshold it reports nothing, so a plain click stays a click; after that it
 * reports the pixels moved since the last move. `started` is true on the move
 * that turns the press into a drag.
 */
export function moveViewCubeDrag(drag: ViewCubeDrag, x: number, y: number): { started: boolean; dx: number; dy: number } | null {
  let started = false;
  if (!drag.dragging) {
    if (Math.hypot(x - drag.startX, y - drag.startY) < VIEW_CUBE_DRAG_THRESHOLD_PX) {
      return null;
    }
    drag.dragging = true;
    started = true;
  }
  const dx = x - drag.lastX;
  const dy = y - drag.lastY;
  drag.lastX = x;
  drag.lastY = y;
  return { started, dx, dy };
}

/**
 * The camera offset from the orbit target after dragging the cube by
 * (dx, dy) pixels. It turns the same way a right-drag on the canvas does:
 * dragging right swings the camera left around the vertical axis, so the scene
 * and the cube follow the pointer, and dragging down tips the camera up
 * towards the top view. The distance to the target stays the same.
 */
export function orbitOffsetByDrag(offset: THREE.Vector3, dx: number, dy: number): THREE.Vector3 {
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta -= dx * VIEW_CUBE_DRAG_RADIANS_PER_PX;
  spherical.phi = THREE.MathUtils.clamp(
    spherical.phi - dy * VIEW_CUBE_DRAG_RADIANS_PER_PX,
    VIEW_CUBE_POLE_EPSILON,
    Math.PI - VIEW_CUBE_POLE_EPSILON,
  );
  spherical.makeSafe();
  return new THREE.Vector3().setFromSpherical(spherical);
}

/** Pitch and yaw in degrees of a camera offset, as the view cube shows them. */
export function viewCubeAngles(offset: THREE.Vector3): { pitch: number; yaw: number } {
  const horizontalDistance = Math.max(0.001, Math.hypot(offset.x, offset.z));
  return {
    pitch: THREE.MathUtils.radToDeg(Math.atan2(offset.y, horizontalDistance)),
    yaw: THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z)),
  };
}

export type ViewCubeFace = "top" | "bottom" | "front" | "back" | "right" | "left";

/** Keys 1 to 6 jump to the straight views, in the order the shortcut list names them. */
export const VIEW_FACE_SHORTCUTS: Readonly<Record<string, ViewCubeFace>> = {
  "1": "front",
  "2": "back",
  "3": "left",
  "4": "right",
  "5": "top",
  "6": "bottom",
};

/**
 * The view a key press jumps to: the digit itself, or with Shift the digit key
 * it sits on (`Digit1`), because Shift+1 types "!" on most layouts.
 */
export function viewFaceForKey(key: string, code: string, shiftKey: boolean): ViewCubeFace | undefined {
  if (Object.hasOwn(VIEW_FACE_SHORTCUTS, key)) return VIEW_FACE_SHORTCUTS[key];
  if (!shiftKey) return undefined;
  const digit = /^Digit([1-6])$/.exec(code)?.[1];
  return digit ? VIEW_FACE_SHORTCUTS[digit] : undefined;
}

/** The unit direction from the orbit target to the camera when looking at the given side. */
export function viewFaceDirection(face: ViewCubeFace): THREE.Vector3 {
  switch (face) {
    case "top": return new THREE.Vector3(0, 1, 0);
    case "bottom": return new THREE.Vector3(0, -1, 0);
    case "front": return new THREE.Vector3(0, 0, 1);
    case "back": return new THREE.Vector3(0, 0, -1);
    case "right": return new THREE.Vector3(1, 0, 0);
    case "left": return new THREE.Vector3(-1, 0, 0);
  }
}
