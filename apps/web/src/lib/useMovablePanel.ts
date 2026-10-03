"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { clampPanelPosition, isNearDock, PANEL_GRAB_HEIGHT, parsePanelPosition, type PanelPosition } from "@/lib/panelPosition";

/** Controls inside the title bar keep their own clicks; only the bar itself moves the panel. */
const NOT_A_HANDLE = "button, a, input, select, textarea";

export type MovablePanelOptions = {
  /** Added while the panel floats - for a panel docked to an edge, the edges and height that let it float. */
  floatingStyle?: CSSProperties;
  /**
   * Where the stylesheet docks the panel, in the same terms as a moved
   * position. Dropping the panel close to it docks it again. Without it, the
   * spot the panel was dragged away from counts as its dock.
   */
  dockedAt?: (area: { width: number; height: number }, panel: { width: number }) => PanelPosition;
  /**
   * The area the panel moves in; by default the element it is positioned in
   * (its offset parent). A panel that sits deeper - the section panel hangs on
   * its button in the camera bar - names the editor area here. Its position is
   * then kept in the area's terms and turned into its own offset parent's.
   */
  area?: (panel: HTMLElement) => HTMLElement | null;
};

/** Where the panel stands in its area, and what that means for its own offset parent. */
type Placement = { position: PanelPosition; origin: PanelPosition; areaHeight: number };

/**
 * Lets a docked panel be moved by its title bar, inside its area, and docked
 * again. Docked, the stylesheet places it; moved, it floats where it was
 * dropped. The spot is remembered in this browser under `storageKey`.
 * Dropping it near its dock (`dockedAt`) or double-clicking the title bar
 * docks it again. Spread `handleProps` on the title bar, put `panelRef` and
 * `style` on the panel.
 */
export function useMovablePanel<T extends HTMLElement = HTMLDivElement>(storageKey: string, { floatingStyle, dockedAt, area }: MovablePanelOptions = {}) {
  const panelRef = useRef<T>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const placementRef = useRef(placement);
  placementRef.current = placement;
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number } | null>(null);
  /** The spot the panel was dragged away from, when it was docked. */
  const dockRef = useRef<PanelPosition | null>(null);
  const [dragging, setDragging] = useState(false);
  const areaRef = useRef(area);
  areaRef.current = area;

  /** The area, and how far its offset parent's corner lies from the area's. */
  const measure = useCallback(() => {
    const panel = panelRef.current;
    const parent = panel?.offsetParent;
    if (!panel || !(parent instanceof HTMLElement)) return null;
    const areaElement = areaRef.current?.(panel) ?? parent;
    if (areaElement === parent) return { panel, area: areaElement, origin: { left: 0, top: 0 } };
    const parentRect = parent.getBoundingClientRect();
    const areaRect = areaElement.getBoundingClientRect();
    return {
      panel,
      area: areaElement,
      origin: {
        left: parentRect.left + parent.clientLeft - (areaRect.left + areaElement.clientLeft),
        top: parentRect.top + parent.clientTop - (areaRect.top + areaElement.clientTop),
      },
    };
  }, []);

  const place = useCallback((next: PanelPosition) => {
    const measured = measure();
    if (!measured) return null;
    const { panel, area: areaElement, origin } = measured;
    const position = clampPanelPosition(next, { width: panel.offsetWidth }, { width: areaElement.clientWidth, height: areaElement.clientHeight });
    return { position, origin, areaHeight: areaElement.clientHeight };
  }, [measure]);

  const store = useCallback((next: PanelPosition | null) => {
    try {
      if (next) window.localStorage.setItem(storageKey, JSON.stringify(next));
      else window.localStorage.removeItem(storageKey);
    } catch {
      // Private windows and blocked storage: the panel still moves, it just is not remembered.
    }
  }, [storageKey]);

  // The remembered spot, read before the first paint so a panel that mounts often
  // (the inspector, with every selection) does not jump there visibly.
  useLayoutEffect(() => {
    let stored: PanelPosition | null = null;
    try {
      stored = parsePanelPosition(window.localStorage.getItem(storageKey));
    } catch {
      stored = null;
    }
    if (stored) setPlacement(place(stored));
  }, [place, storageKey]);

  // A smaller window pulls the panel back in.
  useEffect(() => {
    const onResize = () => {
      if (placementRef.current) setPlacement(place(placementRef.current.position));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    const measured = measure();
    if (event.button !== 0 || !measured) return;
    if (event.target instanceof Element && event.target.closest(NOT_A_HANDLE)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const { panel, origin } = measured;
    const left = panel.offsetLeft + origin.left;
    const top = panel.offsetTop + origin.top;
    if (!placementRef.current) dockRef.current = { left, top };
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left, top };
    setDragging(true);
  }, [measure]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPlacement(place({ left: drag.left + event.clientX - drag.startX, top: drag.top + event.clientY - drag.startY }));
  }, [place]);

  const endDrag = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const dropped = placementRef.current?.position;
    if (!dropped) return;
    const measured = measure();
    const dock = measured && dockedAt
      ? dockedAt({ width: measured.area.clientWidth, height: measured.area.clientHeight }, { width: measured.panel.offsetWidth })
      : dockRef.current;
    if (dock && isNearDock(dropped, dock)) {
      setPlacement(null);
      store(null);
      return;
    }
    store(dropped);
  }, [dockedAt, measure, store]);

  const onDoubleClick = useCallback((event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest(NOT_A_HANDLE)) return;
    setPlacement(null);
    store(null);
  }, [store]);

  const style: CSSProperties | undefined = placement
    ? {
        ...floatingStyle,
        left: placement.position.left - placement.origin.left,
        top: placement.position.top - placement.origin.top,
        // Down to the area's lower edge, but never less than the title bar, which stays inside it.
        maxHeight: Math.max(PANEL_GRAB_HEIGHT, placement.areaHeight - placement.position.top - 32),
      }
    : undefined;

  return {
    panelRef,
    style,
    /** True once the panel has been moved away from where the stylesheet puts it. */
    moved: placement !== null,
    dragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onDoubleClick },
  };
}
