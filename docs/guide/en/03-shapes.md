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

As soon as a shape is selected, its settings appear on the right. At the top is the name; the pencil beside it ({{ui:outliner.rename}}) lets you type a new one. [[Enter]] keeps it, [[Esc]] cancels, and an empty name brings back the shape's default name. Further right, the padlock locks the shape against accidental moving and the eye hides it.

![The settings of a cylinder: solid or hole, diameter and height as a number and as a slider.](shot:editor-overview)

- **{{ui:inspector.solid}} or {{ui:inspector.hole}}:** A solid stays, a hole takes material away. More in [Solids and holes](chapter:solids-and-holes).
- **{{ui:inspector.transparent}}:** Lets you see through the body, for example to spot a shape behind it.
- **{{ui:inspector.properties}}:** The dimensions and everything that belongs to this shape. For a cylinder the diameter, the height and the number of sides. For a gear the teeth, for a spring the turns.
- **{{ui:inspector.taper}}:** Different sizes at the top and bottom, for example for a slope or a funnel.
- **{{ui:inspector.twist}}:** Twists the top against the bottom or shifts it sideways. That gives twisted columns and leaning towers.

A tapered or leaning box, cylinder, ellipse, polygon, tube or ring keeps its exact shape: chamfers and fillets work on it as on the plain shape, and the STEP export writes it. A twisted shape is still a triangle mesh for both.

Typing is more exact than dragging. All number fields take millimetres, but also percentages: type "50 %" into a width of 40 mm and you get 20 mm.

## How round is round? The side count

Round shapes such as cylinder, cone, tube, ellipse or the bores have the switch {{ui:prop.sidesFollowSize}} and the slider {{ui:prop.sides}} in their properties. The reason: for the view and for STL, 3MF and OBJ, layerling draws a circle as a polygon of many small sides. The more sides, the smoother it is, and the more triangles it takes.

**Where the side count matters**

- **In the export for the slicer** (STL, 3MF, OBJ). A cylinder with few sides arrives there as a polygon.
- **When bodies and holes are combined.** A bore cut by a hole with few sides is angular in the finished part. That includes screw holes.
- **In the view.** Many very fine shapes slow the editor down.

**Where it does not matter**

- **For the STEP export.** It writes the round shape, not the polygon.
- **For chamfers and fillets** ({{ui:editor.tool.chamfer}}, {{ui:editor.tool.fillet}}) as long as the shape stays round. That is the case when you have not set a side count, when the count is at least the shape's default, or when the polygon strays at most {{value:EXACT_ROUND_TOLERANCE}} mm from the circle. The default is {{value:ROUND_FROM_SIDES}} sides for cylinder, ellipse, tube and cone, {{value:ROUND_FROM_ROOF_SIDES}} for the {{ui:shape.roundRoof}}, {{value:ROUND_FROM_SPHERE_STEPS}} steps for the {{ui:shape.sphere}}, {{value:ROUND_FROM_HALF_SPHERE_STEPS}} for the {{ui:shape.halfSphere}}, and a {{ui:prop.quality}} of {{value:ROUND_FROM_BENT_TUBE_QUALITY}} for a round {{ui:shape.bentTube}}.
- **For a thread or a spring.** The edge tool and the STEP export take its exact body; its {{ui:prop.quality}} only sets how finely it is drawn.

**Where it matters again**

- **For chamfers and fillets on a shape with few sides.** If you set the side count below the default, the edge tool takes the shape as it is drawn: a cylinder with 6 sides stays a hexagonal bar, and the fillet runs round its six edges. That is how you can build, for instance, a nut pocket with rounded corners. For a round shape, leave {{ui:prop.sidesFollowSize}} on.

**How to use it**

- **Leave {{ui:prop.sidesFollowSize}} on.** Then layerling picks the side count from the diameter so that the polygon strays at most {{value:ROUND_DEVIATION_TOLERANCE}} mm from the true circle, far below what a printer resolves. Small shapes get at least {{value:MIN_AUTOMATIC_SIDES}} sides, large ones more.
- **Fewer sides** you take when you want a polygon on purpose (but there is the {{ui:shape.polygon}} for that) or when the editor gets slow with very many round shapes.
- **More sides** you hardly ever need. Only on very large round parts, when you see edges in the STL.
- **For parts you only treat with edges or hand on as STEP,** the side count does not matter.

## Working with the handles

Besides the settings there are handles on the shape itself:

- The **corners and edges** make the shape larger or smaller.
- The **arrow on top** changes the height, the handle **in the middle** lifts or lowers the shape.
- The **curved arrows** rotate it.
- The **numbers** beside the shape show the dimensions. A click on one opens a field in which you type the number you want.
- A **click on a corner** (without dragging) opens width and depth together. Type the first, press [[Tab]] for the second and [[Enter]] to apply both. [[Esc]] cancels.

Without the mouse, use the keyboard: the arrow keys move the selection by one snap step, with [[Shift]] by five. [[Ctrl]]+[[↑]] and [[Ctrl]]+[[↓]] raise and lower it. [[R]] rotates by 45°, [[Shift]]+[[R]] by 22.5°. [[D]] drops the selection onto the workplane.

The snap step is at the bottom right of the editor and can be changed at any time.

## Copying and duplicating

{{ui:editor.tool.copy}}, {{ui:editor.tool.paste}} and {{ui:editor.tool.duplicate}} are in the ribbon ({{ui:editor.group.clipboard}}). [[Ctrl]]+[[D]] duplicates a selection. layerling remembers how you last moved or rotated the copy and applies the same again on the next duplicate. That produces a row of holes or steps in a few key presses. For regular arrangements there is also the pattern, described in [Selecting and arranging](chapter:select-and-arrange).

> **Tip:** If a shape refuses to take the size you want, it is often the limits for new shapes. Under {{ui:workspace.shapeDefaults}} in the settings you decide how each shape starts and how large it may get.
