---
title: Selecting and arranging
summary: Selecting shapes, finding them in the object list, aligning, mirroring, rotating, laying flat on a face and multiplying in patterns.
---

## Selecting

A click on a shape selects it. With [[Shift]] you add more or take them away again. A click on empty space clears the selection, and so does [[Esc]]. Drag a frame on the empty workplane to select everything inside it, and [[Ctrl]]+[[A]] selects all visible bodies.

What is in your way you hide ({{ui:editor.tool.hideSelected}}, [[Ctrl]]+[[H]]). Hidden shapes stay in the design, they are just not visible. [[Ctrl]]+[[Shift]]+[[H]] brings them all back. What should stay put you lock with the padlock at the top of the settings or with [[Ctrl]]+[[L]]. Locked shapes can neither be moved nor deleted by accident.

## The object list

With many parts it is easy to lose track in the view. The object list ({{ui:editor.tool.showOutliner}} or [[Ctrl]]+[[Shift]]+[[O]]) shows all shapes as a list.

![The object list: the group "Group" with two parts and a sphere beside it. A folder icon opens the group.](shot:object-list)

- A click on an entry selects the shape, including parts inside a group. The arrows fold groups open and shut.
- The label shows whether a part is {{ui:outliner.solid}} or {{ui:outliner.hole}}.
- Padlock and eye lock and hide single parts.
- {{ui:outliner.rename}} gives a part a name of its own; the pencil beside the name at the top of the settings does the same for the selected shape. Sensible names help enormously in larger designs.
- The search field finds shapes by name and by kind, so also "cylinder" or "hole".

## Aligning

Two or more selected shapes are lined up with {{ui:editor.tool.align}}: points appear around the selection for left, centre and right, front, centre and back, and top, centre and bottom. A click on a point moves all shapes there. If you first click one of the selected shapes, it stays in place and the others line up with it.

![Align shows the possible targets as dots around the selection.](shot:align)

The key is [[L]]. [[Esc]] cancels.

## Mirroring

{{ui:editor.tool.mirror}} ([[M]]) flips the selection across a plane: {{ui:mirror.leftRight}}, {{ui:mirror.frontBack}} or {{ui:mirror.topBottom}}. Click the matching axis arrow. That is handy for symmetric parts: build one half, copy it and mirror the copy.

## Rotating and setting the pivot

You rotate with the curved arrows on the shape, with the numbers in the settings or with [[R]] in 45° steps. Normally the selection turns about its centre. Sometimes it should not, for example when a tilted tube is to be turned further at its end. For that there is {{ui:editor.tool.rotationPivot}}: afterwards click on a face. A flat face supplies its centre, for example the axis of a tube end. The selection now turns about that point. A second click on the tool or a new selection removes it.

## Laying flat on a face

Should a part lie on its best side for printing? Select it, click {{ui:editor.tool.layFlat}} and then the face that should go down. The part turns so that this face rests on the workplane.

Just as simple are {{ui:editor.tool.dropToWorkplane}} ([[D]]), which drops the selection onto the workplane, and {{ui:editor.tool.centerOnWorkplane}}.

## Patterns: row and circle

For hole grids, bolt circles and rings of teeth there is the {{ui:editor.tool.array}}. Select the shapes to be multiplied and click it in the ribbon.

![The pattern in "Circle" mode: the copies first appear as a preview.](shot:pattern-tool)

- **{{ui:array.mode.row}}:** The selection is repeated at equal distances. Choose the direction (X, Y or height) and the {{ui:array.spacing}}. A negative spacing lays the row the other way.
- **{{ui:array.mode.circle}}:** The selection is spread around a centre. How many copies there are you set under {{ui:array.count}}, and the {{ui:array.angle}} is 360° for a full circle. Choose whether the copies turn along.

Tip: first set the pivot on a face with {{ui:editor.tool.rotationPivot}}, then the centre of the circle lies exactly there.

The copies first appear as a preview. Only {{ui:array.apply}} creates them. If the copies are holes, group them afterwards with the body they should cut into.

## Undoing

{{ui:editor.tool.undo}} ([[Ctrl]]+[[Z]]) and {{ui:editor.tool.redo}} ([[Ctrl]]+[[Shift]]+[[Z]] or [[Ctrl]]+[[Y]]) step through your history. How many steps travel with the saved design you set in the settings under {{ui:workspace.history}}.
