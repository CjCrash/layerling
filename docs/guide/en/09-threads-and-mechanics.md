---
title: Threads, gears and other parts
summary: Screws, nuts and tapped holes that fit together, plus gear, spring, bent tube, honeycomb, dovetail and teardrop hole.
---

Besides the basic shapes, the library contains some parts that would be tedious to put together yourself. All of them can be changed afterwards in their settings.

## Threads

Choose {{ui:shape.thread}} in the shape library. Under {{ui:inspector.threadRole}} you decide what it should be:

- **{{ui:thread.rod}}:** a cylinder with thread, for example a screw without a head.
- **{{ui:thread.screw}}:** with a head. You choose the {{ui:inspector.threadHead}}: {{ui:thread.headCylinder}}, {{ui:thread.headCountersunk}} or {{ui:thread.headHex}}.
- **{{ui:thread.nut}}:** the matching nut.
- **{{ui:thread.bore}}:** a tapped hole. It is a hole. Drag it into a part, group both, and the part has an internal thread.

![A screw with a cylinder head. On the right: kind and head shape, further down size, pitch and profile.](shot:thread-screw)

You pick the size under {{ui:prop.threadSize}} from a list: metric from M2 to M12, plus the inch sizes UNC and UNF from No. 4 to 1 inch. If you choose {{ui:thread.customSize}}, you set {{ui:prop.diameter}} and {{ui:prop.pitch}} yourself. For an inch size the field asks for {{ui:prop.threadsPerInch}} instead of the pitch in millimetres.

More settings:

- **{{ui:prop.threadHand}}:** {{ui:thread.right}} or {{ui:thread.left}}.
- **{{ui:prop.threadProfile}}:** {{ui:thread.profileV}} is the standard profile. {{ui:thread.profileTrapezoidal}} and {{ui:thread.profileRound}} have flat crests and roots. That usually prints more reliably because no thin tips result.
- **{{ui:prop.clearance}}:** For nut and tapped hole, the room that makes sure a printed pair really turns. The coarser your printer works, the more clearance the pair needs.
- **{{ui:prop.chamfer}}, {{ui:prop.headChamfer}} and {{ui:prop.rimChamfer}}:** Chamfers at the ends so the thread starts cleanly and the head has no sharp edge.
- **{{ui:prop.quality}}:** How finely the thread is calculated. Higher is more exact, but slower.

Printed threads are a topic of their own. Make the screw-and-nut pair as a test first before you print a large part, and adjust the clearance to your printer.

## Gears

{{ui:shape.gear}} comes as {{ui:gear.spur}}, {{ui:gear.helical}} and {{ui:gear.bevel}}. You set the number of {{ui:prop.teeth}}, the {{ui:prop.toothSize}}, the {{ui:prop.toothWidth}} and the {{ui:prop.centerHole}}. A helical gear adds the {{ui:prop.helixAngle}}. Two gears that should mesh need the same tooth size and tooth width and the right distance between their centres.

## Springs

The {{ui:shape.spring}} has {{ui:prop.turns}} and a {{ui:prop.wire}}. Together with the height they decide how soft the spring is.

## Bent tubes

A {{ui:shape.bentTube}} consists of up to twelve sections: a straight piece followed by a bend. For each you set the {{ui:prop.bentTubeSegmentLength}}, the {{ui:prop.bentTubeBendAngle}}, the {{ui:prop.bentTubeBendRadius}} and the {{ui:prop.bentTubeRoll}}. A roll angle of 0° bends within the plane of the workplane, at 90° the tube bends upward. The profile can be round, square, hexagonal or octagonal, the inside likewise, or fully solid. If the tube runs into itself, layerling warns you.

## Honeycomb

The {{ui:shape.honeycomb}} is a plate with hexagonal holes: light, stiff and nice to look at. The {{ui:prop.honeycombCellSize}}, the {{ui:prop.honeycombWallThickness}} and the {{ui:prop.honeycombFrameWidth}} set the look.

## Dovetail

The {{ui:shape.dovetail}} is the joint in which two parts lock into each other and can only be slid together sideways. You set the width at the wide end, the {{ui:prop.dovetailNeckWidth}} and the length of the tail. Copy the tail for the other side and make the copy a hole: {{ui:prop.dovetailClearance}} then gives a little play so the joint does not jam after printing.

> **Tip:** A tapped hole cuts into the part it overlaps when grouped. So put it a bit into the material rather than just touching the surface.

## Teardrop hole

A hole lying on its side gets a bridge across its top when printed, and the bridge sags. The {{ui:shape.teardrop}} therefore has a point on top: every layer rests on the one below, and the hole comes out round enough without supports. Set the {{ui:prop.teardropDiameter}} to the size of the hole, about 3.4 mm for an M3 screw, and the {{ui:prop.teardropLength}} long enough to reach through the part. The {{ui:prop.teardropTipAngle}} is 90°, so the flanks meet at 45°. Most printers handle that cleanly; a flatter point needs more height, a steeper one saves it.

Make the teardrop a hole and group it with the part. Its length runs along the depth and the point faces up. For a hole in the other direction, turn it by 90° around the vertical axis.
