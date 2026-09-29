---
title: View and workplane
summary: Moving around the scene, looking straight on, and placing new shapes on any surface you like.
---

## Moving around

With the mouse:

| What you do | What happens |
| --- | --- |
| drag with the right button | rotate the view |
| drag with the middle button | move the view |
| mouse wheel | zoom in and out |
| hold [[Ctrl]] and drag with the left button | also moves the view |

On a tablet or phone, two fingers zoom (spread and pinch) and move the view (slide together). One finger works on the design, just like the left mouse button. To rotate with one finger, switch on {{ui:camera.touchRotate}} in the camera bar. That switch only shows on devices with a touch screen.

### The view cube

The cube in the top left shows where you are looking. A click on one of its sides jumps to the straight view from top, bottom, front, back, left or right. The number keys [[1]] to [[6]] do the same.

### The camera bar

At the left edge is a narrow bar. From the top:

- {{ui:camera.home}} brings the whole scene back into view. The key is [[F]] or [[Home]].
- {{ui:camera.focusSelection}} zooms to the selection ([[Shift]]+[[F]]).
- {{ui:camera.zoomIn}} and {{ui:camera.zoomOut}} zoom step by step.
- {{ui:camera.orthographic}} switches to a flat view in which parallel edges stay parallel. For measuring and lining up edges that is often more comfortable than the perspective view. [[O]] switches back and forth, and a second click returns.
- {{ui:camera.placeWorkplane}}, the tape measure and the corner ruler are tools of their own, covered below and in [Measuring and notes](chapter:measuring-and-notes).

The small arrow at the very top of the bar hides it if it gets in the way.

## The workplane

New shapes align with the workplane. At first that is the base plate with the grid. But you can put it on any surface, to place something on a side or a sloped face.

1. Press [[W]] or click {{ui:camera.placeWorkplane}}.
2. Move the mouse over a face of a body. It lights up.
3. A click puts the workplane there. Everything you add now sits on that face.

A click on empty space or [[Esc]] returns the workplane to the base plate. [[Shift]]+[[W]] puts it directly on the currently selected face. If you hold [[Shift]] while clicking, the plane points the other way.

## Grid and snapping

The grid shows the size of the plate. At the bottom right is the **snap step**: moving and scaling snap in steps of that size, for example 1 mm. Make it smaller for fine work and larger for rough arranging. {{ui:editor.tool.snapToGrid}} in the ribbon moves the selected shapes afterwards onto the nearest grid crossing.

Size, grid width and colour of the plate are changed in the settings (the cogwheel in the ribbon): the areas are {{ui:workspace.appearance}}, {{ui:workspace.measurement}}, {{ui:workspace.workplane}}, {{ui:workspace.shapeDefaults}} and {{ui:workspace.history}}. Under {{ui:workspace.appearance}} you find switches such as {{ui:workspace.startInPerspective}}, {{ui:workspace.showShadows}} and {{ui:workspace.showGrid}}.

![The editor in the dark colour scheme. You set the colour scheme at the top right: System, Light, Dark or Graphite.](shot:editor-dark)

> **Tip:** Stop rotating the view when you fit parts together exactly. Use the number keys to go to the straight view from top or front and press [[O]] for the flat display. Then you see at once whether two edges are really flush.
