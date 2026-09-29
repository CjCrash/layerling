---
title: Text and curved lettering
summary: Raised or engraved lettering in seven typefaces, and if you like along a circular arc, such as on a coin, a lid or a ring.
---

## Adding text

Choose {{ui:shape.text}} in the shape library and place it. In the {{ui:prop.text}} field on the right, type what it should say. The settings below:

- **{{ui:prop.font}}:** Seven typefaces are available: Multilanguage, Sans, Serif, Script, Monospace, Rounded and Stencil (letters made of straight lines). New text starts in Sans. Accented letters such as ä, ö, ü, é and the € sign are in every typeface.
- **{{ui:prop.height}}:** How far the lettering stands out from the surface.
- **{{ui:prop.bevel}}:** Rounds the letter edges so they look softer. With {{ui:prop.segments}} you decide in how many steps.
- **Size:** You set the length and width of the line as with any shape. Drag the handles or type the dimensions.

Text is at first a single body. If you want to treat the letters individually, click {{ui:inspector.separateParts}}. Then every letter is a shape of its own.

The edges of text can be chamfered or filleted too, straight or curved, see [Breaking edges and hollowing bodies](chapter:edges-and-hollowing). Use small sizes such as 0.2 to 0.5 mm, because the strokes of the letters are narrow.

## Raised or engraved

- **Raised:** Place the text on the surface and group it with the body. It grows out as a relief.
- **Engraved:** Switch the text to {{ui:inspector.hole}}, let it reach a little into the surface and group it with the body. The letters are then engraved.

For lettering on a side face, first put the workplane on that face, see [View and workplane](chapter:view-and-workplane).

## Text on a circular arc

Should the lettering not run straight but follow the edge of a coin, a lid or a ring? For that there is the setting {{ui:prop.textCurved}}.

![Text follows a circle. All letters stand on one common line.](shot:curved-text)

Once you switch it on, the text runs along the circle. All letters stand on the same baseline, as evenly as with normal text. There are four settings:

- **{{ui:prop.textRadius}}** (5 to 500 mm): The radius of the circle the letters' baseline runs on.
- **{{ui:prop.textSize}}:** How tall the letters are. It no longer depends on the width of the shape.
- **{{ui:prop.textInward}}:** Moves the text from the top of the circle to its bottom. The letters then point with their heads to the centre.
- **{{ui:prop.textFlipped}}:** Turns only the letters over so you can read them from the other side. The text stays in its place on the circle.

**The centre of the circle is the centre of the shape.** That is why aligning works as usual: if you centre the text with a cylinder or ring, it sits exactly concentric on it. When you pull a handle, radius and letter size grow together, so the lettering is not distorted.

> **Tip:** At the top of the circle the letters stand outside the baseline; with {{ui:prop.textInward}} they stand inside, heads towards the centre. For the lettering to fit on a disc, the radius plus the letter size should be smaller than the disc's radius.
