---
title: Files, saving and sharing
summary: Where your designs live, how to back them up, which formats layerling imports and exports, and what is possible on a shared server.
---

## Where your designs live

layerling saves everything in the browser on your computer. There is no account and nothing is uploaded. Every change saves itself, including the preview picture on the start page. If you open layerling in the same browser days later, everything is there.

That has a downside: whoever clears the browser storage or switches to another computer loses the designs. **So back up important work into a file.**

## Backing up and passing on

On the start page every design has a menu with the options to rename, duplicate and delete. With {{ui:dashboard.backupAll}} you pack all designs into one single file. Through {{ui:dashboard.importGeometry}} they come back, also in another browser or on another computer.

You back up a single design in the editor: {{ui:editor.export}}, choose the format **LYL** and click {{ui:export.saveProject}}. The LYL file is layerling's own design format and contains everything: shapes, groups, sketches, CAD data, imported sources and the history, meaning the undo steps. Under {{ui:export.historyTitle}} you choose how many of the last steps travel along. Older `.skf` files from earlier versions can still be opened; they are then saved as `.lyl`.

## Exporting

Click {{ui:editor.export}}.

![The export window with the formats STL, 3MF, OBJ, STEP, SVG and LYL.](shot:export-panel)

At the top is the file name, below it you choose the format. You decide whether only the selection or the whole design is exported.

| Format | For | What to know |
| --- | --- | --- |
| **STL** | slicer and 3D printing | A triangle mesh. The simplest and most widespread format. |
| **3MF** | slicer with colours | Every body stays a part of its own with name and colour. Suited to PrusaSlicer, Bambu Studio, OrcaSlicer and Cura. Bambu Studio and OrcaSlicer ask on opening how to map the colours onto your filaments, and call the file "not from Bambu" - the message is harmless. |
| **OBJ** | modelling and exchange | A widely supported mesh format. |
| **STEP** | a full CAD program | Keeps boxes, cylinders, spheres and cones as exact geometry, and so shapes made from an outline (star, heart, ellipse, tube, half sphere, round roof, rounded box, dovetail, the bores and more) and the bent tube, plus fillets and chamfers. Thread and spring are still missing. The first STEP export in a session loads the CAD kernel (about 22 MB) once. |
| **SVG** | laser cutter and plotter | A clean top view in millimetres, including holes and curved outlines. |
| **LYL** | layerling itself | The editable design with everything that belongs to it. |

Holes cannot be exported on their own. Group them with a body first, otherwise layerling points it out.

## Importing

With {{ui:editor.import}} you bring foreign files into the design.

![The import window: open or insert designs and drop geometry.](shot:import-panel)

- **{{ui:import.openProject}}:** A layerling design (`.lyl`, or an older `.skf`) comes back as a new design.
- **{{ui:import.insertProject}}:** The bodies of a layerling design are added to the open one. Handy for basic shapes you need again and again: build them once, save them and bring them in every time.
- **Add geometry:** Drop STL, OBJ, 3MF, STEP or SVG files in the window or click to choose a file. Imported meshes can be turned, moved, cut with holes and built upon. An SVG becomes a shape you can build on.

Template pictures are added in sketch mode, see [Sketches](chapter:sketches).

## Shared designs on a server

When layerling runs on your own computer or web server, it can offer a shared folder in which all users keep designs. On the start page it then appears as {{ui:dashboard.sharedProjects}}. You create folders there, move designs by dragging and search across the whole folder. A design that lives there saves itself back to it.

That is not simultaneous editing: whoever opens a file works on a copy of their own. If somebody else has changed the file in the meantime, layerling refuses to overwrite it.

On layerling.com this function is not switched on. How to set it up on your own server is described in the [README on GitHub](https://github.com/henmedia/layerling/blob/main/README.md).
