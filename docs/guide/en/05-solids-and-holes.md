---
title: Solids and holes
summary: How simple shapes become bores, slots and pockets, and how to change a group again later.
---

This is the most important idea in layerling, and it is quickly learned: **Every shape is either a solid or a hole.** A solid stays. A hole is a tool that takes material away.

## Solid or hole

Select a shape and click {{ui:inspector.solid}} or {{ui:inspector.hole}} in its settings. The keyboard is faster: [[H]] makes the selection a hole, [[S]] makes it a solid again. A hole is shown see-through so you can see where it sits.

As long as nothing is grouped, nothing happens with a hole. It just lies there and shows where something will disappear later.

![The cylinder is a hole. It sticks out of the top of the cube so that it cuts all the way through.](shot:hole-before)

## Grouping

Select solids and hole(s) and click {{ui:editor.tool.group}} ([[Ctrl]]+[[G]]). Now the holes remove the material from the solids they touch. What remains is one single new shape.

![The result: a cube with a bore.](shot:hole-after)

This is how you get:

- **Bores:** a cylinder as a hole through a body.
- **Slots:** an elongated box as a hole at the edge.
- **Pockets:** a hole that does not go all the way through.
- **Threads in a part:** a tapped hole as a hole, see [Threads and mechanics](chapter:threads-and-mechanics).

If several solids are in the group, they are joined. Two solids that touch become a single part.

You can treat a group like a shape: move, rotate, colour, group again. {{ui:editor.tool.ungroup}} ([[Ctrl]]+[[Shift]]+[[G]]) dissolves it and the individual parts are back.

### Making a group a hole

A whole group can also be a solid or a hole. A simple rule applies:

- If the group consists only of solids (or only of holes), you switch it as a whole and its parts go along.
- If it contains both, say a cube with a bore, each part keeps its own state. The whole group then becomes a tool, but the bore stays a bore.

## Intersection

{{ui:editor.tool.intersect}} keeps only what two or more bodies have in common. Lay two overlapping shapes on top of each other, select both and click it. That turns a cylinder and a box into a piece with one round and one straight side.

## Opening a group and changing it

If a bore turned out too small, you do not have to dissolve the group and rebuild. Select the group and click {{ui:group.open}} in its settings, or the folder icon in the object list. The parts now lie separately and you change them with every tool: make a hole larger, move a body, add a hole.

![The opened group: the bar at the bottom holds Cancel and Done, and the object list shows the parts.](shot:open-group)

A bar appears at the bottom of the picture. {{ui:group.done}} rebuilds the group, with its name, its colour and its state as solid or hole. {{ui:common.cancel}} puts it back untouched. While a group is open you cannot open a second one.

A note: fillets and chamfers you had put on the **whole** group are lost on rebuild. The bar tells you so.

## Separating parts

If a shape consists of several separate pieces, such as text made of single letters, {{ui:inspector.separateParts}} splits it into independent shapes.

> **Tip:** Always build holes a little longer than the part they are to pass through. If the hole ends exactly flush with the face, a wafer-thin skin sometimes remains. One millimetre of overshoot makes sure.
