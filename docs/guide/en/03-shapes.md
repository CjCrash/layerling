---
title: Placing and adjusting shapes
summary: The shape library, dimensions by number and by handle, colour, rotating, tapering and twisting.
---

Every part in layerling starts with a shape. From them you build everything else: shapes complement each other, cut each other out or are joined into a new shape.

## Adding a shape

Click {{ui:editor.addShape}} in the ribbon. The shape library opens.

![The shape library. Every little picture is rendered from the shape's real geometry.](shot:shape-menu)

Pick a shape. It now hangs on the mouse pointer and lands where you click. [[Esc]] cancels placing. If you would rather have the shape appear in the middle of the plate, you can switch off placing by click in the settings (area {{ui:workspace.appearance}}, switch {{ui:workspace.cruise}}).

What the library offers:

- **Basic shapes:** {{ui:shape.box}}, {{ui:shape.roundedBox}}, {{ui:shape.cylinder}}, {{ui:shape.slot}}, {{ui:shape.ellipse}}, {{ui:shape.polygon}} (three to twenty-four sides), {{ui:shape.sphere}}, {{ui:shape.cone}}, {{ui:shape.pyramid}}, {{ui:shape.wedge}}, {{ui:shape.roundRoof}}, {{ui:shape.halfSphere}} and {{ui:shape.torus}}.
- **Tubes:** {{ui:shape.tube}} and {{ui:shape.bentTube}}, made of up to twelve straight pieces with bends in between.
- **Decorative shapes:** {{ui:shape.star}}, {{ui:shape.heart}} and {{ui:shape.crescent}}.
- **Lettering:** {{ui:shape.text}}, also along a circular arc. More in [Text](chapter:text).
- **Mechanics:** {{ui:shape.thread}} (threaded rod, screw, nut and tapped hole), {{ui:shape.spring}} and {{ui:shape.gear}}. More in [Threads and mechanics](chapter:threads-and-mechanics).
- **For constructions:** {{ui:shape.honeycomb}}, {{ui:shape.dovetail}}, the {{ui:shape.teardrop}} for horizontal holes, the {{ui:shape.counterbore}} and {{ui:shape.countersink}} for screw heads and the {{ui:shape.ruler}}, which is only a measuring tool and never shows up in an export.

## The shape's settings

As soon as a shape is selected, its settings appear on the right. At the top is the name. Beside it, the padlock locks the shape against accidental moving and the eye hides it.

![The settings of a cylinder: solid or hole, diameter and height as a number and as a slider.](shot:editor-overview)

- **{{ui:inspector.solid}} or {{ui:inspector.hole}}:** A solid stays, a hole takes material away. More in [Solids and holes](chapter:solids-and-holes).
- **{{ui:inspector.transparent}}:** Lets you see through the body, for example to spot a shape behind it.
- **{{ui:inspector.properties}}:** The dimensions and everything that belongs to this shape. For a cylinder the diameter, the height and the number of sides. For a gear the teeth, for a spring the turns.
- **{{ui:inspector.taper}}:** Different sizes at the top and bottom, for example for a slope or a funnel.
- **{{ui:inspector.twist}}:** Twists the top against the bottom or shifts it sideways. That gives twisted columns and leaning towers.

Typing is more exact than dragging. All number fields take millimetres, but also percentages: type "50 %" into a width of 40 mm and you get 20 mm.

## How round is round? The side count

Round shapes such as cylinder, cone, tube, ellipse or the bores have the switch {{ui:prop.sidesFollowSize}} and the slider {{ui:prop.sides}} in their properties. The reason: for the view and for STL, 3MF and OBJ, layerling draws a circle as a polygon of many small sides. The more sides, the smoother it is, and the more triangles it takes.

**Where the side count matters**

- **In the export for the slicer** (STL, 3MF, OBJ). A cylinder with few sides arrives there as a polygon.
- **When bodies and holes are combined.** A bore cut by a hole with few sides is angular in the finished part. That includes screw holes.
- **In the view.** Many very fine shapes slow the editor down.

**Where it does not matter**

- **For chamfers and fillets** ({{ui:editor.tool.chamfer}}, {{ui:editor.tool.fillet}}) and **for the STEP export.** Both work with the exact round shape, not with the polygon. That holds for most round shapes. Thread, spring and bent tube are still triangle meshes, and there the fineness counts for edge treatment as well.

**How to use it**

- **Leave {{ui:prop.sidesFollowSize}} on.** Then layerling picks the side count from the diameter so that the polygon strays at most 0.005 mm from the true circle, far below what a printer resolves. Small shapes get at least 24 sides, large ones more.
- **Fewer sides** you take when you want a polygon on purpose (but there is the {{ui:shape.polygon}} for that) or when the editor gets slow with very many round shapes.
- **More sides** you hardly ever need. Only on very large round parts, when you see edges in the STL.
- **For parts you only treat with edges or hand on as STEP,** the side count does not matter.

## Working with the handles

Besides the settings there are handles on the shape itself:

- The **corners and edges** make the shape larger or smaller.
- The **arrow on top** changes the height, the handle **in the middle** lifts or lowers the shape.
- The **curved arrows** rotate it.
- The **numbers** beside the shape show the dimensions. A click on one opens a field in which you type the number you want.

Without the mouse, use the keyboard: the arrow keys move the selection by one snap step, with [[Shift]] by five. [[Ctrl]]+[[↑]] and [[Ctrl]]+[[↓]] raise and lower it. [[R]] rotates by 45°, [[Shift]]+[[R]] by 22.5°. [[D]] drops the selection onto the workplane.

The snap step is at the bottom right of the editor and can be changed at any time.

## Copying and duplicating

{{ui:editor.tool.copy}}, {{ui:editor.tool.paste}} and {{ui:editor.tool.duplicate}} are in the ribbon ({{ui:editor.group.clipboard}}). [[Ctrl]]+[[D]] duplicates a selection. layerling remembers how you last moved or rotated the copy and applies the same again on the next duplicate. That produces a row of holes or steps in a few key presses. For regular arrangements there is also the pattern, described in [Selecting and arranging](chapter:select-and-arrange).

> **Tip:** If a shape refuses to take the size you want, it is often the limits for new shapes. Under {{ui:workspace.shapeDefaults}} in the settings you decide how each shape starts and how large it may get.
