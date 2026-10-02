"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { clampPanelPosition, isNearDock, parsePanelPosition, type PanelPosition } from "@/lib/panelPosition";

/** Controls inside the title bar keep their own clicks; only the bar itself moves the panel. */
const NOT_A_HANDLE = "button, a, input, select, textarea";

export type MovablePanelOptions = {
  /** Added while the panel floats - for a panel docked to an edge, the edges and height that let it float. */
  floatingStyle?: CSSProperties;
  /**
   * Where the stylesheet docks the panel, in the same terms as a moved
   * position. Dropping the panel close to it docks it again.
   */
  dockedAt?: (area: { width: number; height: number }, panel: { width: number }) => PanelPosition;
};

/**
 * Lets a docked panel be moved by its title bar, inside the area it is placed
 * in (its offset parent), and docked again. Docked, the stylesheet places it;
 * moved, it floats where it was dropped. The spot is remembered in this browser
 * under `storageKey`. Dropping it near its dock (`dockedAt`) or double-clicking
 * the title bar docks it again. Spread `handleProps` on the title bar, put
 * `panelRef` and `style` on the panel.
 */
export function useMovablePanel<T extends HTMLElement = HTMLDivElement>(storageKey: string, { floatingStyle, dockedAt }: MovablePanelOptions = {}) {
  const panelRef = useRef<T>(null);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const positionRef = useRef(position);
  positionRef.current = position;
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const clamped = useCallback((next: PanelPosition) => {
    const panel = panelRef.current;
    const area = panel?.offsetParent;
    if (!panel || !(area instanceof HTMLElement)) return next;
    return clampPanelPosition(next, { width: panel.offsetWidth }, { width: area.clientWidth, height: area.clientHeight });
  }, []);

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
    if (stored) setPosition(clamped(stored));
  }, [clamped, storageKey]);

  // A smaller window pulls the panel back in.
  useEffect(() => {
    const onResize = () => {
      if (positionRef.current) setPosition(clamped(positionRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamped]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (event.button !== 0 || !panel) return;
    if (event.target instanceof Element && event.target.closest(NOT_A_HANDLE)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: panel.offsetLeft, top: panel.offsetTop };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(clamped({ left: drag.left + event.clientX - drag.startX, top: drag.top + event.clientY - drag.startY }));
  }, [clamped]);

  const endDrag = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const dropped = positionRef.current;
    if (!dropped) return;
    const panel = panelRef.current;
    const area = panel?.offsetParent;
    if (dockedAt && panel && area instanceof HTMLElement && isNearDock(dropped, dockedAt({ width: area.clientWidth, height: area.clientHeight }, { width: panel.offsetWidth }))) {
      setPosition(null);
      store(null);
      return;
    }
    store(dropped);
  }, [dockedAt, store]);

  const onDoubleClick = useCallback((event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest(NOT_A_HANDLE)) return;
    setPosition(null);
    store(null);
  }, [store]);

  const style: CSSProperties | undefined = position
    ? { ...floatingStyle, left: position.left, top: position.top, maxHeight: `calc(100% - ${position.top + 32}px)` }
    : undefined;

  return {
    panelRef,
    style,
    /** True once the panel has been moved away from where the stylesheet puts it. */
    moved: position !== null,
    dragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onDoubleClick },
  };
}
