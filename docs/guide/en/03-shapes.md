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
- **For constructions:** {{ui:shape.honeycomb}}, {{ui:shape.dovetail}} and the {{ui:shape.ruler}}, which is only a measuring tool and never shows up in an export.

## The shape's settings

As soon as a shape is selected, its settings appear on the right. At the top is the name. Beside it, the padlock locks the shape against accidental moving and the eye hides it.

![The settings of a cylinder: solid or hole, diameter and height as a number and as a slider.](shot:editor-overview)

- **{{ui:inspector.solid}} or {{ui:inspector.hole}}:** A solid stays, a hole takes material away. More in [Solids and holes](chapter:solids-and-holes).
- **{{ui:inspector.transparent}}:** Lets you see through the body, for example to spot a shape behind it.
- **{{ui:inspector.properties}}:** The dimensions and everything that belongs to this shape. For a cylinder the diameter, the height and the number of sides. For a gear the teeth, for a spring the turns.
- **{{ui:inspector.taper}}:** Different sizes at the top and bottom, for example for a slope or a funnel.
- **{{ui:inspector.twist}}:** Twists the top against the bottom or shifts it sideways. That gives twisted columns and leaning towers.

Typing is more exact than dragging. All number fields take millimetres, but also percentages: type "50 %" into a width of 40 mm and you get 20 mm.

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
