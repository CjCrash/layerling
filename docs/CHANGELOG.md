# Changelog

layerling started over at 1.0.0 when it was forked from SketchForge-3D 1.0.9.
Everything from 1.0.9 downwards is SketchForge's history, kept here because the
code still carries it - so a lower number further down is older, not newer.

## Unreleased

- **Larger fillets and chamfers than the part is thick:** The radius and distance in the edge tool stopped just below the smallest measure of the part, so the vertical edges of a 10 mm thick plate could not get more than 10 mm even though they have room for far more. The limit is now the largest measure; whether a size fits the chosen edges is still checked, with the usual message when it does not. Reported by Fratercula in the forum.
- **Inches as decimals:** With Imperial units, the workspace settings (Measurement) now offer "Show inches as": fractions (1 5/8, as before and still the default) or decimals (1.625). Decimals follow the accuracy setting and apply everywhere inches are shown - the numbers on the shape, the properties panel, tape measure, ruler and distance lines. Asked for by milton59 (#65).
- **Knife edges are offered by the edge tool:** An edge where two faces meet at a very sharp angle - the thin end of a flat wedge, say - counted as a smooth seam and could not be selected. The edge tool now measures the real turn across an edge, so such edges are offered like any other sharp edge; all other shapes offer the same edges as before. Found while tracing a face-normal detail pointed out by @plazmabokor (#74).
- **Helical and bevel gears as exact bodies for the edge tool and STEP:** Helical and bevel gears are now built as exact bodies from the same outline the drawn gear uses, so the edge tool offers their real edges - 147 instead of 2,352 for the default helical gear - and fillets all of them in a few seconds where it used to fail; STEP export writes them as exact bodies too. Small gears leave little room between the teeth, so large fillets or chamfers on all edges still fail as on a spur gear, and chamfering a whole end face of a helical gear at once is a kernel limit (single edges and fillets work). A helical gear on an oval footprint stays a mesh. Contributed by @plazmabokor (#77).
- **Springs as exact bodies for the edge tool and STEP:** A spring is now built as an exact body - a round wire swept along the helix, its ends cut square - instead of being refused for its triangle count. The edge tool offers the two wire ends, which can be filleted or chamfered in about two seconds, and STEP export writes springs as exact bodies. The drawn spring is unchanged, and when the exact body cannot be built the mesh is used as before. Contributed by @plazmabokor (#76).
- **Clearance for threaded rods and screws:** Rods and screws now have a Clearance setting of their own that makes the bolt that much thinner in diameter (0 to 1 mm, default 0), for a printed bolt that has to go into a metal nut, which has no play itself. Before, only nuts and tapped holes had a clearance, and a bolt was always built at its nominal size; the way round was to lower the diameter by hand. The nominal size, pitch and size name stay as they are. Existing rods and screws are unchanged: the nut clearance they carried never acted on them and still does not. The setting is also in the shape defaults, the .lyl file and the MCP bridge (`threadBoltClearance`), and the exact thread body follows it. Asked for by Chris (#62).
- **Threads as exact bodies for the edge tool and STEP:** A thread - rod, screw, nut or tapped hole, in every profile and either hand - is now built as an exact body (its profile swept along the helix) instead of being refused for its triangle count. Chamfers and fillets work on it, also grouped, so a block with a tapped hole can have its edges rounded and a screw head its rim; listing the edges takes a few seconds (an M6 screw about 4 s, a G1/2 rod about 20 s). STEP export now writes threads as exact bodies too; the head chamfer is part of the body. The drawn thread and the quality setting are unchanged, and when the exact body cannot be built the mesh is used as before. Springs and helical and bevel gears are still meshes. Contributed by @plazmabokor (#75).
- **Clearer message for shapes too dense for the edge tool:** The message no longer tells you to simplify the mesh, which layerling has no tool for. It now points a shape from the shape list to its own settings, and an imported part to STEP or a version with fewer triangles. Threads keep their own message (edges first, then the thread). Pointed out by @plazmabokor (#74).

## 1.27.1

- **Snap to other shapes while moving:** Dragging a shape across the workplane now locks its left, right, front or back edge or its centre onto an edge or centre of another shape once it comes within a few pixels, and a pink guide line shows which one. Two parts sit flush or centred without typing numbers, also with the grid off. Holding Alt while dragging pauses it; a checkbox in the snap grid menu and one in the settings ("Snap to other shapes while moving") switch it off. For now it applies to moving on the base workplane only, not to lifting, resizing or a workplane set on a face. Suggested by darkwingbreydin in the forum.

## 1.27.0

- **Edge tool and hollowing on STEP imports:** A part imported from STEP now gets chamfers, fillets and hollowing on the exact body from the file instead of its triangles. Parts with many holes, which the edge tool refused before because of their triangle count, now work - a plate with 24 holes offers its 68 real edges and fillets them in about a second. Turned, mirrored, lifted and resized imports work too; a tapered, twisted or leaning one keeps the old way. STL, OBJ and 3MF bring only triangles, so if a part also exists as STEP, import that. Contributed by @plazmabokor (#73).
- **Section view:** A new button at the bottom of the left bar cuts the view open along a plane across X, Y or Z, to look at walls, cavities and parts that fit into each other. A coarse slider moves the plane across the whole design, a fine slider a little either side of where it stands; the position can also be typed, in the workspace unit. The other side, back to the middle and hiding the plane are one click each, and what the cut lays open can be clicked and selected. Only the view is cut: the design, its files and every export stay whole.
- **Shift-click in the object list:** Holding Shift while clicking entries in the object list adds them to the selection or takes them out again, as Shift-click already does in the view. Ctrl-click (Cmd-click on a Mac) no longer does this, so the list works the same way as the view. Shift-clicking no longer highlights the text of the rows in between. Contributed by @gogades (#70).
- **Shift-click in the sketch:** With "Select" in the sketch, holding Shift while clicking a point or line adds it to the selection or takes it out again, so you can pick several points and lines by hand and move them together. Points and lines can be mixed, and Shift-click also works on lines inside an existing selection's frame. Before, a click always replaced the selection, and only a frame or a click inside an outline selected more than one thing. Contributed by @gogades (#70).
- **Rename from the settings panel:** A pencil beside the shape's name at the top of its settings opens the name for typing, like the rename button in the object list. Enter or clicking elsewhere keeps the new name, Esc cancels, and an empty name brings back the default one. Confirming the name unchanged keeps an editor-given name such as "Box" following the interface language. Works in the light, dark and Graphite themes. Contributed by @gogades (#71).
- **Snap grid stays reachable with the settings collapsed:** The snap grid control sits in a shape's settings while a shape is selected, so collapsing the settings with the arrow at their top hid it until the selection was cleared. With the settings collapsed, the snap grid control now shows on the workplane, as it does with nothing selected. Contributed by @gogades (#71).
- **LYL export starts at your history setting:** The history slider in the export window used to start at "Unlimited" every time. It now starts at the history setting from the workspace settings, so a design file carries as many undo steps as the editor keeps. A custom number from the settings appears as an extra stop on the slider. Contributed by @gogades (#72).
- **Ctrl+I opens the import window:** The import window has a keyboard shortcut as well (Cmd+I on a Mac), listed in the shortcuts window and the guide. Contributed by @gogades (#72).
- **Ctrl+E opens the export window:** The export window now has a keyboard shortcut (Cmd+E on a Mac), listed in the shortcuts window and the guide. After a successful export - STL, 3MF, OBJ, STEP, SVG, LYL or saving to the shared folder - the window closes by itself; when an export fails it stays open so you can try again. Contributed by @gogades (#72).

## 1.26.1

- **Tapered and leaning shapes stay exact:** A box, cylinder, ellipse, polygon, tube or ring with a taper or lean is now built as an exact body (the straight-sided loft between its bottom and top) instead of a triangle mesh, so the edge tool offers its real edges and fillets it where it used to refuse - a tapered cylinder has 4 selectable edges instead of 200. Twisted shapes, and a tapered sphere or cone, stay a mesh. Also fixed: STEP export wrote a tapered, leaning or twisted box, cylinder, sphere or cone as the plain undeformed shape; it now writes the tapered or leaning body, and skips a twisted one with a message. Contributed by @plazmabokor (#68).
- **Bent tube as an exact body:** The bent tube is now built as its cross-section pushed along each straight run and turned through each bend - cylinders and tori for a round profile, planes and cones for square, hexagon and octagon - instead of a triangle mesh. The edge tool offers its few real edges (a default tube has 4 instead of 128) and fillets them in well under a second, where many tubes used to be refused, and STEP export now includes it; round tubes go out round. A tube that runs into itself, or a round one drawn visibly coarse, stays a mesh as before. Contributed by @plazmabokor (#66).
- **Snap grid in inches for designs set to Imperial earlier:** A design or default saved with "Imperial" before 1.26.0 still carried a millimetre snap step; the snap grid then showed "1.0 mm" while its list offered only inch steps. Such a step now becomes 1/8 in when the design opens. Reported by Justin (#65).
- **Corner boxes no longer stay behind:** The width and depth boxes opened by a click on a corner were left floating when you clicked beside them, dragged the shape or deselected it, and a second pair could appear. Any press outside the boxes now applies what you typed and closes them; dragging, resizing and changing the selection close them too. Reported by Justin (#65).

## 1.26.0

- **Whitworth pipe threads (G, ISO 228-1):** The thread shape has a fourth size group, "G pipe thread (ISO 228-1)", with the 20 sizes from G 1/16 to G 4, and a new "Whitworth (55°)" profile next to V, trapezoidal and round. Picking a G size switches a V profile to Whitworth, picking an M, UNC or UNF size switches it back; a trapezoidal or round profile you chose stays. For AI assistants `threadProfile` takes `whitworth` and the new `threadSize` sets diameter, pitch and profile by size name (`G1/2`). The guide chapter on threads and the start page mention it. Contributed by @plazmabokor (#61, #59).
- **3MF colours reach Bambu Studio and OrcaSlicer:** The 3MF export now also writes the colours as a Materials-extension colour group that every triangle names, which is the form those two read. They show their colour dialog when opening the file and map the body colours onto your filaments; before, all bodies came out in the default colour. Other programs still get the usual colour list per body. Both slicers call the file "not from Bambu", which is harmless (issue #60).
- **Click a corner to type width and depth together:** A click on a corner handle of a shape (without dragging) opens its width and depth boxes at once, like Tinkercad. Tab moves to the other box, Enter applies both in one step, Esc cancels. Round shapes open their single diameter box. Asked for by Justin (#65).
- **Imperial units on the workplane and the snap grid:** With "Imperial" chosen, the dimension numbers beside a shape, the lift height, the tape measure and the ruler dimensions are shown and typed in inches (or feet) instead of millimetres, as the properties panel already did. Inches read as fractions like in Tinkercad (1⅝, 3/16), also in the properties panel, rounded to 1/64 in; you can type "1 5/8", "1-5/8", "5/8" or a decimal, and a decimal you type keeps its exact value. The distance lines to the origin and between moved shapes follow the unit too. The snap grid then offers inch steps from 1/64 to 1 in and switches to 1/8 in when you change the unit system; back on metric it returns to 1.0 mm. Reported by Justin (#65).
- **Zoom further in the sketch:** The mouse wheel and the zoom buttons in the sketch no longer stop at 6 times; you can zoom in as far as in the 3D editor. "Frame selection" (Shift+F) keeps its limit, so a small selection still shows some context. Contributed by @gogades (#64).
- **Click inside a sketch outline to select it:** With "Select" in the sketch, a click inside a closed outline selects all its points and lines, ready to move or resize. Nested outlines pick the innermost one, so a click inside a hole selects the hole. Dragging a box still selects what is in it, and a click outside every outline still clears the selection. Contributed by @gogades (#63).
- **Own quick guide in sketch mode:** The quick guide (Help group) now shows what matters while sketching - drawing, selecting and editing, clipboard, moving around and measuring, making a body - instead of the 3D editor's sections.

## 1.25.0

- **More 3MF files open:** A 3MF whose parts are nested several levels deep, or whose meshes live in separate model files of the package (how Bambu Studio, OrcaSlicer and PrusaSlicer write their projects), was refused with "contains no readable geometry". Both layouts are read now (issue #60).
- **Few-sided round shapes keep their flat faces in the edge tool:** A cylinder with 6 sides is now a hexagonal bar for chamfers and fillets, not a round cylinder. Shapes stay round when no side count is set, when it reaches the shape's default or when the polygon is within 0.05 mm of the circle. STEP export is unchanged. Also fixed: turned few-sided prisms (hexagon, pentagon, triangle) sat a little off the angle shown in the viewport. The guide chapter on the side count says so (PR #57, thanks plazmabokor).
- **Copy, cut, paste and duplicate in the sketch:** The sketch ribbon has a new "Clipboard" group (copy, paste, duplicate, delete) and the usual shortcuts Ctrl+C, Ctrl+X, Ctrl+V and Ctrl+D work on selected points, lines and template images. A pasted or duplicated copy lands on the nearest free spot beside the original instead of on top of it, so its lines are not welded to the original's (PR #56, thanks gogades).
- **Measure tool in the sketch sits in the side bar:** The ruler button in the sketch moved from the ribbon (group "Inspect") to the side bar, with the same icon as in the 3D editor, and a second click switches it off again (PR #58, thanks gogades).
- **Start script for Linux and macOS:** `scripts/start-layerling.sh` updates the checkout, starts the server, waits for it and then opens the browser, like the Windows shortcut does. Tried on Debian Linux and in a Windows shell; macOS is untested. `PORT=3100` picks another port.
- **Toolbar no longer cut off at some window widths:** Between 1344 and 1351 px and between 1222 and 1238 px of page width the last group (Help) lost a few pixels at the right edge; the steps now switch at the width the icons really need (issue #54).
- **Videos chapter in the user guide:** A new last chapter lists videos by others, in both languages. The quick guide in the editor lost its intro sentence and the button to the full guide (the link at the bottom stays) and shows the videos as a plain list.
- **Update notice on your own computer:** When layerling runs on `localhost`, the "Update available" link in the footer leads to the update steps in the README instead of the release page, with a tooltip that the desktop shortcut updates at the next start. The quick guide in the editor and the README list the videos as well.
- **Videos on the start page:** The welcome guide has a new list "Videos about layerling" with plain links (no embedded player, so nothing is loaded from YouTube until you click). First entry: the 3D Jesus review. The printer count in the guide now says around 190.
- **Windows desktop shortcut starts properly:** The browser now opens only once the server answers (before, it often showed an error page until you reloaded), and the shortcut first updates layerling with `git pull` plus `npm install`. New: `scripts/start-layerling.cmd`; the README now shows how to choose the install folder with `-InstallPath` (issue #55).

## 1.24.0

- **190 printers instead of 54:** The printer list grew by Snapmaker (U1, A250, A350, Artisan, J1) and many more models of the vendors that were already there (Bambu Lab, Prusa, Creality, Elegoo, Anycubic, Qidi, Sovol, Flashforge, Artillery, Voron and others), plus BIQU, Kingroon, Longer, Geeetech, Voxelab, TwoTrees, Comgrow, Eryone, Dremel, InfiMech, Peopoly, Wanhao, Raise3D, UltiMaker, Volumic and RatRig. Bed size and height still come from OrcaSlicer's profiles for the 0.4 mm nozzle. Delta printers with a round bed are not in the list.
- **Settings dialog fits the window:** The workspace settings and the other dialogs of the same kind are sized to the space under the toolbar instead of to the window, so their footer no longer runs off the bottom when the toolbar takes two rows or the page is zoomed. On a very low window the navigation on the left scrolls instead of pushing the footer out. Reported by bernbout (#53).
- **Browser zoom works again:** Ctrl+Plus, Ctrl+Minus and Cmd+Plus/Minus were swallowed by the 3D editor and zoomed only the camera. They now reach the browser, so the whole page can be zoomed out; the plain + and - keys still zoom the camera. Reported by bernbout (#53).
- **More exact round shapes:** The sphere with free width, depth and height, the half sphere with an oval footprint and the cone with an oval footprint (pointed, a frustum, or standing on its tip) now reach the edge tool as exact bodies, not as meshes. The ellipse and the oval cylinder have one edge per rim (3 instead of 6), so one click picks a whole rim. A half sphere tipped over no longer falls back to the mesh, and STEP export keeps the size of stretched bodies. Edges in the editor: half sphere 30 x 20 x 10 from 3,008 to 2, sphere 30 x 20 x 15 from 3,312 to 1. Contributed by @plazmabokor (#52).
- **Sketch view shortcuts:** `F` or `Home` fits the whole sketch in the view and `Shift+F` zooms to the selection, like in the 3D editor, with a new button next to the home button. The sketch shortcut list and the guide name them. Contributed by @gogades (#51).
- **Sketch dimensions on selection:** The sketch shows lengths only for the selected line, or for the lines that meet at the selected point, with extension lines and arrows outside the shape; labels move out of each other's way, and on a sketch with inner outlines (a disc with holes) a label goes to the side with fewer lines in the way. Shift+F on a single point no longer zooms in to the maximum. Before, every length was shown all the time. Contributed by @gogades (#51).
- **Guide header:** The word "Guide" ("Anleitung") in the header of the guide pages sits on one baseline with "layerling".
- **Kernel:** layerling runs on the official occt-wasm 5.4.0 again, which contains the join type for hollowing; the own build from henmedia/occt-wasm is no longer needed.

## 1.23.0

- **Teardrop hole:** A new shape for horizontal holes that print without supports: a round part with a point on top, so no layer has to bridge the hole. Width is the diameter, depth the length of the hole, and the tip angle (90 degrees by default, flanks at 45) can be typed in the inspector; a new diameter keeps the angle. Make it a hole and group it with the part.
- **Counterbore and countersink:** Two cutters for screw heads that sit in the part: a round pocket for a socket-head screw (DIN 912) and a cone for a countersunk screw (DIN 7991). Width is the head diameter, height the whole length, the head end is on top; shaft diameter, pocket depth and cone angle are set in the inspector. The defaults fit an M3 screw. They sit in the shape list in front of the teardrop.
- **More shapes as exact CAD bodies:** The edge tool now gets real solids for the teardrop, counterbore, countersink, ellipse, oval cylinder, tube, half sphere, round roof and rounded box, instead of display meshes. Edges in the default shapes: ellipse 348 to 6, tube 600 to 6, half sphere 3008 to 2, round roof 387 to 6, rounded box 108 to 24. Fillets and chamfers on them are fast and clean.
- **STEP export of outline shapes:** Star, heart, crescent, capsule, polygon, honeycomb, spur gear, dovetail, single letters and all the shapes above no longer drop out of a STEP file; they go out as the same exact bodies, holes included. Thread, spring, bent tube and helical gears are still missing.
- **Side count on the bores:** The teardrop, counterbore and countersink have the same "sides follow the size" switch and slider as a cylinder, in the inspector and in the shape defaults. The guide explains what the side count shapes (view, STL/3MF/OBJ, combining bodies and holes) and where it does not matter (edge tool, STEP).
- **Fewer triangles for small fillets:** A small fillet already gets a tight chord, and a fixed angle limit on top of it cut every narrow strip into ten rows. The angle now loosens as the chord tightens; fillets of 1 mm and more are unchanged. "Grüße" with a 0.1 mm fillet on all edges went from 242,544 to 30,196 triangles. Faces where the looser angle would let the mesh stray from the exact surface (fillets round a circular edge) are checked and keep the old mesh. Contributed by @plazmabokor (#50).
- **Sketch zoom like the 3D editor:** The mouse wheel in the sketch zooms towards the pointer and follows the speed from the settings dialog; the plus and minus buttons follow it too. Contributed by @gogades (#49).
- **Threads and edge treatment:** The message about a thread being too dense for edge treatment now says what to do (treat the edges first, add the thread afterwards), and so do the edges and threads chapters of the guide.
- **Smaller things:** Star, heart and crescent moved to the end of the shape list, just before the ruler. The inspector header fits long names such as "Tropfenbohrung" on one line. The link to the full guide on the start page is a button of its own now.
- **MCP:** New shape kinds `teardrop`, `counterbore` and `countersink` with the keys `screwHoleShaft`, `screwHoleHeadDepth` and `screwHoleAngle`; `sides` works on them too.
- **Guide:** New sections "Teardrop hole" and "Counterbore and countersink" in the threads and mechanics chapter, "How round is round? The side count" in the shapes chapter, and an updated STEP row in the files chapter.

## 1.22.1

- **Fillets and chamfers on text:** Raised text is now handed to the CAD kernel as its exact letter outlines, curves included, instead of thousands of short straight pieces. Chamfering or rounding all edges of a word now works where it used to be refused as too complex, straight or curved, and the edges come out clean. Contributed by @plazmabokor in #48.
- **Umlauts in every typeface:** Multilanguage, Stencil and Rounded had no ä, ö, ü, ß, é or €; missing letters are now taken from Sans. New text starts in Sans.
- **Corner ruler with several bodies:** The green distances at the corner ruler now also show when several bodies are selected, measured on their shared outline. A typed value moves all of them together, in one undo step. Asked for by Eichhornkobel in the forum.
- **Edge tool no longer spins forever:** Changing the fillet or chamfer size before any edge was selected left the spinner on "Apply" running for good. From raimcomputi's report in the forum.
- **Copies of curved text stay curved,** and MCP can create curved text directly.
- **Guide:** Every guide page has the footer with legal notice, privacy and project links; the quick guide now says correctly that Mirror flips the selection itself. New sections on the corner ruler's green distances, on edge treatments on groups and on edges of text.

## 1.22.0

- **User guide:** A complete guide with pictures, in German (layerling.com/anleitung) and English (layerling.com/guide): 15 chapters from the first steps through solids and holes, edges, sketches, text, threads, measuring, printing and files to keyboard shortcuts and building with an AI. It is linked from the start page footer, the welcome text and the editor's quick guide, and it also opens offline.
- **It keeps itself current:** Button names in the guide are read from the interface's own texts, the shortcut chapter from the shortcut dialog, and the pictures are taken from the running program by `npm run guide:images`, once per language. A test checks that both languages have the same chapters and pictures and that every MCP tool is named.
- **More German in the German interface:** The "Sketch view" badge, the handle tooltips (resize, height, lift), the mirror handles and the sketch status messages were still English.
- **For self-hosters:** `npm run export` and `npm run dev` build the guide from `docs/guide`; see `docs/guide/README.md`.

## 1.21.0

- **Curved text:** Text can now follow a circle ("On arc" in the inspector), along the top or along the bottom of it, with its own radius and letter size. All letters sit on one baseline, as in a straight line; the centre of the circle is the middle of the shape, so centring the text on a round body places it concentric. Pulling a handle scales radius and letter size together. "Upside down" turns the letters over in place, to be read from the other side.
- **Round and chamfer sketch corners:** In the sketch, a corner point between two straight lines can be rounded with a radius or cut off with a chamfer - from the point menu or the new buttons in the sketch toolbar.
- **Open group:** A group can be opened from the object list or the inspector. Its parts lie loose on the workplane and can be changed with every tool; "Done" rebuilds the group with its name, colour and solid/hole state, "Cancel" puts it back untouched. Fillets on the whole group are lost on rebuild, which the bar says. Asked for by Fratercula in the forum.
- **Too tall for the printer:** With a printer chosen, layerling now also warns when a body is taller than the printer's build height, counted from the lowest body, as the slicer sets the model down. The warning reads "does not fit the build volume" and names how much is missing.
- **German throughout:** Sketches, groups and objects made through MCP no longer show English names ("Sketch extrusion" is now "Skizzenkörper"); "Edit sketch", "Custom" in the workplane size list, the rotate handle's tooltip and the remaining English labels are translated. Names you typed yourself stay as they are.
- **MCP:** New actions `layerling_lay_flat` (a face of an object onto the plate), `layerling_open_group` and `layerling_close_group`; curved text settings work through MCP, and switching a group between solid and hole follows the same rule as the inspector.
- **Ids stay short:** Part ids no longer grow each time a group is opened and closed or ungrouped and regrouped.

## 1.20.0

- **Object list:** A new panel lists every object in the design - open it with the list button under Visibility, from the eye menu, or with Ctrl+Shift+O. A click selects an object, even one hidden behind others; each row can lock, hide or rename its object (pencil or double-click). Groups fold open and show their parts, each marked Solid or Hole. With more than four objects a search box filters by name or shape. Asked for by Fratercula in the forum.
- **Switching a group between hole and solid keeps its cut-outs:** A group made of a body and its cut-outs, set to Hole and back to Solid, used to turn every part solid, so the cut-outs were gone after the next ungroup. Mixed groups now keep each part's own state; groups of only solids or only holes switch their parts along as before. From archy's report in the forum.
- **Hint when exporting only holes:** If the selection - or the whole design - holds nothing but holes, the export panel now says why there is nothing to export and that a hole needs to be grouped with a body. From archy's report in the forum.

## 1.19.1

- **See-through bodies:** A new checkbox "Transparent" in the inspector, under Solid / Hole, draws a body see-through in its own colour, as in Tinkercad. Bodies behind or inside it and the faces where parts touch stay visible from every side. Display only - it stays a normal solid and exports as one. Saved with the design, and a group passes it on to all its parts. Asked for by Eichhornkobel in the forum.
- **Origin distances for several bodies:** The distances to the origin now also show when several bodies are selected, measured on the box around all of them. Asked for by Eichhornkobel in the forum.
- **Wider zoom speed range:** The zoom speed slider in the settings now spans twenty times from slowest to fastest instead of about three; the middle stays as before. The zoom buttons follow the slider too. Contributed by @gogades in #42.
- **Start in orthographic view:** A new setting "Start editor in perspective view" - switched off, every design opens in orthographic view. It is an app preference and applies to all designs, older ones included. Contributed by @gogades in #44.
- **Design name always in the toolbar:** The option to hide the design name in the toolbar is gone; the name always shows and can be renamed there. Contributed by @gogades in #43.

## 1.19.0

- **Lay flat on face:** A new tool under Arrange, next to "Drop to workplane": click a face of the selection and it turns the shortest way so that face rests on the workplane - the best print orientation in one click. Works on slanted faces and for several bodies at once, which keep their spacing. One undo step.
- **Dovetail joint:** A new shape after the honeycomb for joining flat printed parts without screws. Width is the wide end, the tail length and neck width are set separately. As a body it is the tail; a copy set to hole grows by its clearance (default 0.2 mm) on every side and makes the matching socket. Fillets and chamfers work on it as an exact body.
- **Back up all designs:** A "Back up all" button on the start page packs every design of this browser into one file. Opening that file through "Open design" brings them all back - also the way to move designs to another browser or computer.
- **Insert into this design:** The import panel can now add the bodies of a saved design (.lyl) to the open one instead of opening it separately - for basic parts used again and again. Asked for by darkwingbreydin in the forum.
- **Copy and paste of large objects:** After copying a large object, such as an imported mesh, pasting could bring back something copied earlier, and saving the design list could fail with a storage error. Pasting now always takes the newest copy, and large copies no longer fill the browser's small storage. Reported by darkwingbreydin in the forum.
- **Toolbar on narrower windows:** On common laptop widths the last toolbar groups ran off the right edge unseen, and below 1240 px the bar scrolled sideways. The icons now get smaller as soon as the full size does not fit, and narrow windows wrap the bar onto a second row; the workplane and menus move down with it.
- **Install as an app:** The start page points out that layerling can be installed as an app and then starts without internet, with an install button in Chrome and Edge. Already live on layerling.com since 28 September.
- **Inspector header:** Long single-word names such as "Schwalbenschwanz" no longer run into the lock icon.

## 1.18.9

- **Works offline:** layerling now keeps the whole program on your computer after the first visit (a service worker), so it starts and works without internet - drawing, fillets, chamfers, hollowing, saving in the browser and exporting included. With a connection the page still comes fresh from the server, so reloading brings a new version as before. Server storage and the contact form need a connection. Browsers allow this only on https, so it applies to layerling.com; self-hosted copies over plain http run as before.

## 1.18.8

- **Mirror arrows are back:** Since 1.15.0 the Mirror tool only showed "choose an axis arrow" for shapes added after the design was opened, and no arrows appeared. The arrows now show for every selection again. Reported in the forum.
- **Place shapes by click is on by default:** A new shape follows the pointer and lands where you click, for new and existing projects alike. It can be switched off under Settings → Display ("Cruise when adding new shapes").
- **Exact body for the spur gear:** Fillets, chamfers and hollowing on a spur gear now start from an exact CAD body with a truly round bore, like the shapes in 1.18.7. The default gear offers 147 edges instead of 288, a 0.5 mm fillet on all of them takes less than half the time, and a 1 mm fillet that was refused before now works. Helical and bevel gears keep the previous path. Contributed by @plazmabokor in #41.

## 1.18.7

- **Exact bodies for fillets, chamfers and hollowing:** Polygon, star, heart, crescent, slot and honeycomb now go into the edge tool and the hollow tool as exact CAD bodies built from their own parameters, instead of being sewn together from the display mesh. Curves stay curves: a star with rounded tips offers 60 edges instead of 510 and takes a 1 mm fillet in well under a second instead of several, and a crescent that could not be filleted before now can be. The display mesh stays as the fallback, so anything that worked before still does. Contributed by @plazmabokor in #37.
- **Sizes in percent:** Width, depth and height take a percentage - "50%" halves the current size, "120%" enlarges it by a fifth. Works on the dimension labels on the canvas, in the size fields of the inspector and on ruler dimensions. Contributed by @gogades in #38.
- **Settings dialog:** The checkboxes sit on the same line as their description again. Contributed by @gogades in #39.
- **Place shapes by click:** The setting "Cruise when adding new shapes" under Display now works. A new shape follows the pointer as a preview and lands where you click; Esc cancels. It is off by default, including for projects saved earlier. Contributed by @gogades in #40.

## 1.18.6

- **Tapered boxes stay tapered when grouped:** Grouping a tapered box with a tapered hole - a funnel or a transition piece between two rectangles - turned the result back into a straight box. Twisted and leaning boxes lost their shape the same way. Grouping now keeps the deformation. Reported by Eichhornkobel in the forum.
- **Thicker walls when hollowing:** The wall was limited to half the smallest dimension, height included, whatever stayed open. A frame open at top and bottom now ignores the height, and with one side open the floor may take almost the whole height, so a 1 mm frame can be made from a 1 mm plate. Reported by Fratercula in the forum.
- **Grid in orthographic view:** In a face-on orthographic view, parts of the workplane grid could disappear behind the plate. Contributed by @gogades in #35.

## 1.18.5

- **Pattern tool:** A new "Pattern" tool next to the rotation pivot repeats the selection n times - in a row along X, Y or Z with a spacing (negative runs the other way), or around a circle over a total angle, with the copies turned along or kept as they are. The circle centre is taken from the rotation pivot when one is set, otherwise the origin. The copies show as a preview while the numbers change; "Create" adds them as one undo step. Also available through MCP as `layerling_array_objects`.
- **Up-to-date welcome guide:** The guide on the start page now lists what layerling has gained since it was written - hollowing, sketches, the shape library, patterns, workplanes on faces, the rotation pivot, measuring, printer profiles, import and building with AI - and names 3MF export.
- **Search engines and link previews:** The start page's HTML now carries the welcome guide in English and German instead of an empty page, together with a longer description, a canonical address, structured data, `robots.txt` and `sitemap.xml`.
- **Graphite theme:** The stylesheet is loaded from the site root and carries the app version, so a browser can no longer keep an older copy after an update.

## 1.18.4

- **Rotation pivot:** A new "Set rotation pivot" tool next to Mirror picks the point the selection turns around. Clicking a flat face takes its centre - on the round end of a pipe that is the pipe's axis - and a curved surface takes the clicked point. Dragging the rotation wheel, typing an angle and the R shortcut then turn the selection around that point, so a bend tilted out of the plane keeps its pipe end on the axis. The pivot applies to the selection it was set for; clicking the tool again or selecting something else removes it. Requested by Fratercula in the forum.

## 1.18.3

- **Sharp hollowing after an update:** Browsers that had used layerling before 1.18.2 could keep the previous CAD kernel from their cache and pair it with the new app. Rounded hollowing still worked, but sharp hollowing failed with "The walls cannot be this thick". The kernel is now loaded from a folder named after its version, so every kernel update gets a new address and a cached older one can no longer be picked up. Reported by Magnetron in the forum.
- **Clearer hollowing errors:** A failure that has nothing to do with the wall thickness is no longer reported as "walls too thick".

## 1.18.2

- **Sharp inner edges when hollowing:** The Hollow tool has a new "Inner edges" switch. Rounded stays the default: where the inner walls move apart, at a step or around an opening, they meet in a rounding as large as the wall. Sharp extends the walls until they meet, so the edge stays sharp and the wall is a little thicker in that corner. Also available through MCP as `edges` on `layerling_hollow_object`. Requested by Fratercula and Magnetron in the forum.
- **Closed hollowing of bodies with an inner corner:** Hollowing with every side closed failed for any body with an inner corner, such as an L-shaped part. It works now.
- **CAD kernel:** layerling now runs on occt-wasm 5.3.5 with the added join types, built from [henmedia/occt-wasm](https://github.com/henmedia/occt-wasm) until the change is merged upstream ([andymai/occt-wasm#366](https://github.com/andymai/occt-wasm/pull/366)).

## 1.18.1

- **Printer presets & build plate warnings:** The workspace settings now offer 54 common FDM 3D printer presets grouped by vendor (Bambu Lab, Prusa, Creality, Elegoo, Anycubic, Qidi, Sovol, Flashforge, Artillery, Anker, Voron) sourced directly from OrcaSlicer's profile definitions. Selecting a printer automatically sets the workplane size, displays the model and build volume (e.g. "Bambu Lab A1 / 256 × 256 × 256 mm") in the corner of the workplane, and warns when objects overhang the build plate in real-time or during STL/3MF/OBJ export.
- **Persistent workspace defaults ("Make default"):** Workspace and snap settings saved via "Make default" are now stored in global browser storage (`layerling.workspaceDefault.global`) and reliably applied to all newly created designs. Fixes #28.
- **Configurable dimension visibility:** Added a workplane setting to choose whether dimension lines and values for selected objects remain always visible or only appear while hovering over a transform handle. Contributed by @gogades in #27.

## 1.18.0

- **Hollowing tool (Körper aushöhlen):** A new Hollow tool next to chamfer and fillet turns any solid body into walls of uniform thickness, grown inward so exterior dimensions are preserved. Choose which side stays open: top, bottom, top and bottom (frame), or completely closed around a sealed cavity. Fully supports parametric re-editing, MCP automation (`layerling_hollow_object`), and localized feedback in German and English.
- **3MF export:** Export 3D models directly as 3MF project files for PrusaSlicer, Bambu Studio, OrcaSlicer, and Cura. Preserves multi-body structures, per-body names, and materials/colours in standard millimetre Z-up orientation.
- **Faster initial load & performance:** Reduced dashboard load size by ~80% (from 1.4 MB to 276 KB gzipped) by dynamically loading the editor and typefaces only when entering the workspace, plus removing redundant base64 WASM payloads.
- **Reopen projects with 3MF sources:** Fixed project archive validation so saved `.lyl` files containing imported 3MF assets reopen seamlessly.
- **Security & bridge hardening:** Updated dependencies (fflate, next, vitest), hardened `store.php` against array query injection, and added timeout handling to the MCP bridge.
- **Localized CAD error messages:** Fully translated German and English error messages for hollowing and edge treatment constraints in the CAD modifier.

## 1.17.5

- **Ground shadow of rotated shapes:** A shape turned by 90° and placed away from the workplane origin no longer shows an upright grey plane beside it that could not be removed. The shadow that marks a lifted selection now measures its height along the workplane normal, like the lift handle since 1.17.4, and lies flat on the workplane under the shape. Reported by @gogades in #19.
- **Release workflow:** Releases are now published by a manually started GitHub Actions workflow that takes the version from `package.json` and the text from this changelog.

## 1.17.4

- **Theme switcher in topbar & editor:** Quick theme switching (System, Light, Dark, Graphite) is now available directly in the topbar on the home dashboard and in the editor toolbar title row, placed alongside the language switcher with a dedicated palette icon. Switching is instant and synchronized across all views without requiring a page reload. In the workspace settings dialog, the appearance section has been streamlined with a divider line replacing the note.
- **Align keyboard shortcut:** Pressing `L` now activates the Align tool when one or more shapes are selected on the workplane. Contributed by @plazmabokor in #21.
- **Rotated shape elevation fix:** Elevating rotated shapes with the lift handle now maintains proper alignment along the workplane normal without unintended lateral displacement. Fixes #19.
- **Docker development & compatibility:** Added `compose.dev.yml` for live-reload Docker development, added `:z` volume label for SELinux and Podman support, and opted out of Next.js telemetry by default. Contributed by @gogades in #20.

## 1.17.3

- **Handles and cursor:** The cursor stays a pointer while using resize, lift, and rotate handles instead of constantly switching type. Handles now change colour on hover. Origin lines and labels get their own colour so they read apart from movement and dimension lines. Rotate and lift handle colours are tuned for the Dark and Graphite themes. Contributed by @gogades.

## 1.17.2

- **Graphite theme:** A fourth theme option next to System, Light, and Dark — the dark theme with neutral grey surfaces, text, and workplane grid instead of the brown/beige ones. Orange accents are unchanged. The palette is generated from the same colour declarations as the other themes, so it always stays in sync, and its stylesheet is only loaded once Graphite is actually selected. Contributed by @plazmabokor.

## 1.17.1

- **MCP server:** JSON-RPC notifications (e.g. `notifications/cancelled`) no longer receive an invalid error reply.
- **Windows quickstart:** When run via `irm … | iex`, an error no longer closes the PowerShell window before the message can be read.
- **Project thumbnails:** The server-side thumbnail folder is now capped at 256 MB; the oldest thumbnails are removed beyond that, so the unauthenticated route can no longer fill the disk.
- **Docker support:** Official Docker setup with [`Dockerfile`](docker/Dockerfile) and [`compose.yml`](docker/compose.yml) for hosting a private Layerling instance on a PC, NAS, or home server without Node.js. Contributed by @gogades.

## 1.17.0

- **Bent Tube:** A new catalog shape (`bentTube`) lets you model bent pipes and tubes directly in Layerling. It consists of up to 12 segments, each with a straight length, bend radius, bend angle, and roll angle. Four cross-section profiles are available for the outer wall — Round, Square, Hexagon, and Octagon — and the same options apply to the inner channel, or it can be left solid. Wall thickness is adjustable. The minimum bend radius is enforced automatically so the mesh can never fold into itself, and a warning is shown in the inspector when a chain of segments runs back into itself. Parameters are live-editable with slider preview, and the shape integrates fully with drag & drop, workspace defaults, MCP, and project saving. Contributed by @plazmabokor.

## 1.16.3

- **Rotated shape editing:** Rotating a parametric shape (box, wedge, cone, etc.) no longer bakes it into a plain mesh. The shape keeps its kind and all editable parameters across any rotation. Resize handles and dimension inputs now act on the shape's own local axes rather than the world bounding box, so dragging the depth handle of a wedge that has been turned 90° changes its depth — not its width. The selection frame aligns with the shape's local axes as well.
- **Drag & drop from the shape menu:** Shapes can now be dragged from the catalog panel and dropped anywhere on the workplane. Previously, a `draggable={false}` attribute on the menu buttons prevented the browser from starting a drag, even though the viewport already had a drop handler. The menu now closes automatically when a drag begins.
- **Default sphere dimensions:** A newly inserted sphere is now exactly 22 × 22 × 22 mm (matching its catalog size). A mismatch between the stored height (20 mm) and the catalog width/depth (22 mm) caused the sphere to miss the analytic B-Rep path in the CAD modifier, which in turn made fillets and chamfers on sphere–torus intersections produce deformed meshes instead of clean curves.

## 1.16.2

- **3MF Import:** Layerling now accepts `.3mf` files via drag-and-drop and the file picker (alongside STL, OBJ, STEP, and SVG). 3MF is the native format of PrusaSlicer, OrcaSlicer, Bambu Studio, and Cura, so models can be brought in directly from those workflows without an intermediate STL export. The importer unpacks the ZIP archive, parses the XML model file, resolves multi-mesh assemblies and component references (including per-item transform matrices), and applies the standard Z-up → Y-up coordinate transform. Imported shapes are stored as project assets and round-trip correctly when saved to and reopened from a `.lyl` project file.

## 1.16.1

- **High-Resolution Spheres & Half-Spheres:** The facet resolution slider (`steps`) for both Spheres (`Kugel`) and Half-Spheres (`Halbkugel`) now extends up to 256 steps (512 radial segments) instead of the previous 64-step ceiling. This allows creating ultra-smooth spherical surfaces for high-detail 3D printing and rendering, both via workspace defaults and the per-shape inspector.

- **Analytic B-Rep Spheres and Tori for CAD Edge Treatments:**
  - The OpenCascade CAD modifier now reconstructs exact mathematical solids for Spheres (`makeSphere`) and Tori (`makeTorus`) instead of falling back to tessellated surface meshes.
  - Spheres and circular tori retain their analytic representation through shape baking and grouping. When combined with other primitives (boxes, cylinders, cones, tori, spheres), OpenCascade performs true B-Rep boolean fusion (`cad.fuse`) and cutting (`cad.cut`).
  - This enables seamless, clean, artifact-free edge filleting and chamfering along intersection seams between spheres, tori, and adjacent bodies without triangulation seam artifacts.

## 1.15.0

- The **Corner Ruler** (`Winkellineal`) has been upgraded to full parity with Tinkercad:
  - **Relative Coordinates & Visual Projections:** Selecting any object while a ruler is on the workplane now displays green relative coordinate badges along with directional arrows along the ruler's X, Z, and Elevation axes, connected via dashed projection guide lines. The blue object size dimension badges (width, depth, height) remain simultaneously visible and editable.
  - **Direct Numeric Positioning:** Clicking any of the green coordinate badges (X, Z, or Elevation) opens an in-place numeric input. Entering a new value instantly translates the object to that exact relative coordinate along the ruler's axes.
  - **Endpoint vs. Midpoint Measurement Mode:** A circular toggle button at the ruler origin switches between **Endpoint Mode** (measuring to the bounding box minimum corner/outer edges) and **Midpoint Mode** (measuring directly to the geometric center of the object).
  - **Centered Symmetrical Resizing in Midpoint Mode:** When Midpoint Mode is active, editing an object's dimensions (e.g. changing the diameter of a cylinder or the width/depth of a box) preserves the object's center position—expanding or contracting symmetrically in all directions.
  - **Single Ruler Semantics:** Placing a corner ruler replaces/relocates any existing ruler on the workplane, matching intuitive CAD behavior.

## 1.14.0

- A new **Rounded Box** (`roundedBox`) shape joins the catalog directly next to the standard Box. Unlike other tools where resizing a rounded cube stretches corner fillets into distorted ellipses, Layerling preserves exact circular radii when changing width, depth, or height—only straight edge segments lengthen or shorten. Separate controls allow adjusting vertical corner fillets (`cornerFillet`) and top/bottom cap fillets (`topBottomFillet`) independently, alongside a quality/resolution slider. Top and bottom faces remain planar without faceting artifacts when top/bottom fillet is zero. Fully manifold, watertight, and compatible with CSG booleans, STEP, STL, and OBJ exports.

- The CAD edge modifier now strictly caps its adaptive chordal deflection (`linearDeflection`) at 0.05 mm (standard) and 0.025 mm (fine). Previously, the deflection formula scaled up with large radii or large bounding boxes, causing fillets of 10 mm or more to appear coarsely faceted compared to smaller adjacent fillets. Large fillets and chamfers now remain cleanly rounded and smooth across all models.

## 1.13.0

- Five new parametric shapes are now available in the shape catalog: **Star** (configurable point count, outer/inner radius, outer/inner fillet), **Heart** (configurable length, width, height, tip fillet), **Crescent** (adjustable thickness and tip fillet), **Capsule** (stadium/slot body with adjustable width, length, height), and **Honeycomb** (parametric hexagonal grill with adjustable cell size, wall thickness, and outer frame width).

- Toggling off the workplane grid in the workspace settings now also hides the workplane text label ("Arbeitsebene") for an entirely clean, uncluttered viewport view.

## 1.12.4

- The edge modifier (fillet/chamfer) now presents clear, localized error messages instead of raw worker exceptions. When an operation cannot be built—most commonly because a radius is too large for the edge and collides with or consumes adjacent faces (such as trying to apply a 3 mm fillet across a narrow 2 mm geometry)—the panel explains in plain language why it was rejected and suggests trying a smaller value (e.g. 1.5 mm). Timeouts and internal worker issues are similarly localized in both German and English.

- The quick guide now includes a dedicated **Workplane** section explaining how to activate an auxiliary workplane on any face with the `W` key or the toolbar, how to reset back to the base ground plane by clicking into empty space or pressing Escape, and where to toggle the workplane grid. In addition, the guide clarifies that server-backed project storage runs in addition to local browser storage, and reinforces that all CAD geometry calculations and exports remain 100% local to the user's browser.

## 1.12.3

- A cylinder or cone sent to the edge tool is no longer tessellated into a faceted mesh first - it now reconstructs the exact cylindrical or conical surface before filleting or chamfering, the same way a box already did. This resolves a case reported on the forum: a small fillet on the sloped rim of a tapered cone (a 38/60 mm truncated cone) failed outright even though the edge itself was found cleanly, because the facet size on that mesh lost the race against the fillet's own space requirement on the acute side of the taper - documented at the time as a structural limit of the meshing approach, not something a small patch could reach. Rounding at 90°, on a plain box or hexagonal prism, was never affected by this.

## 1.12.2

- Selecting a single shape now keeps its width, depth and height on screen right on the shape itself - diameter and height for a cylinder - instead of only showing up while hovering or dragging a resize handle. Each one stays click-to-edit exactly as before: click the number, type a new one, done. Requested on the forum, after Tinkercad, where a selected body's full dimensions are always readable and editable in place without opening a side panel.

## 1.12.1

- layerling now notices on its own when a newer version has been published on GitHub. Running a self-hosted instance, or just returning to the browser app after a while, made it easy to miss recent fixes and new features unless someone checked the repository by hand. A quiet check against GitHub's public releases API now runs in the background on start: if the latest published release carries a higher version than the running build, a dismissible banner appears at the top of the dashboard, and the version label in the footer gains a small badge linking straight to the release notes. The check is cached for an hour so it never runs into GitHub's rate limits, and it fails completely silently when offline; dismissing the banner is remembered for the rest of the session so it never gets in the way of working on a design.

- The workplane settings now have a toggle to hide the grid entirely, next to the existing controls for its block size and color - useful for a clean screenshot or just a less busy view while working. The setting already existed under the hood; it only had no switch to reach it from.

## 1.12.0

- A box- or cylinder-style extrusion can now be twisted and leaned, next to its existing taper: **Twist** rotates the top face relative to the base by up to 720°, and **Width Offset**/**Length Offset** shift it up to 80 mm sideways along either axis - in the properties panel, in shape defaults and through the MCP bridge, everywhere taper already reaches. Contributed from outside the project; reviewing it turned up several places that already gate on taper alone and needed the same treatment for the new deformation to take effect there too, most importantly chamfering or filleting a twisted body, which was silently dropping the twist and working from a plain, undeformed copy instead - fixed before it ever shipped.

- A workplane set at an angle now actually reaches a sketch drawn for a revolve, the way it already worked for an extrusion - turn a face 90° to sketch a body meant to be spun into a bottle or a knob, say, and it revolves in place instead of needing to be turned back into position by hand afterward. Switching workplanes, or clearing one back to the base plane, is undo/redo-able now too, like any other edit. Both reported in the forum.

- A long status message - the explanation for why an edge treatment or a boolean operation was just refused, say - no longer gets cut off with an ellipsis partway through; it wraps onto more than one line, and hovering it shows the same text again as a native tooltip for a quick re-read. Reported on GitHub.

## 1.11.0

- Selecting a single body now keeps two floating lines on screen, showing its distance to the X and Z axis of the active workplane - the always-visible measurement several forum posters asked for by name, wanting to place a body precisely without a ruler object in the way. It steps aside the moment anything else already owns the screen (dragging, resizing, aligning, mirroring, the tape measure, edge editing) or more than one body is selected, and a body straddling an axis loses only that one line rather than showing a guess. A new setting turns it off for anyone who finds it distracting.

- A second, genuinely bodiless ruler joins the tape measure and the straight one: a corner tool, the kind Tinkercad has, that drops onto the workplane with a single click and draws two ticked arms meeting at a right angle, ticks facing outward the same way Tinkercad's do. Drag its handle to move it, click the handle to turn it 90°, and a small × removes it again. Like the straight ruler, any body touching one of its arms gets its size along that arm shown as a floating number - but unlike the straight ruler, it is not a body at all: nothing to select, group, export or cast a shadow, so placing one never touches the shape list or the undo history, and by the same design it does not survive a reload, the same trade-off the tape measure already makes.

- The quick guide's **Measuring** section now explains the corner ruler too, between the tape measure and the straight one.

## 1.10.3

- An edge below the angle-detection slider's current threshold wasn't drawn in the edge tool at all, so clicking it did nothing until the slider was dragged down by hand - reported in the forum as fillets only taking effect after touching the slider. Every edge that could in principle be rounded or chamfered now stays visible, dimmed below the threshold, and clickable; clicking one lowers the threshold to its own angle automatically instead of requiring a manual drag first.
- Grouping or cutting a selection that itself contained a group - several threaded holes grouped together, then unioned with a body, in the forum's report - flattened that inner group into the union's own child list. Ungrouping the union afterwards lost the inner grouping instead of restoring it, so it couldn't be reused. The union now keeps the original, ungrouped selection as its children, so ungrouping it again brings the inner group back intact.
- Rotating a ruler to an angle that isn't a multiple of 90° bakes it into a plain mesh, the same as any other body - but the ruler had no case in the function that builds that mesh, so it silently fell back to unrelated placeholder geometry sized for a completely different shape. That corrupted both the live view and any STL/OBJ export made afterwards, matching a forum report of a ruler turning to visible garbage geometry at 45°. The missing case is filled in now.

## 1.10.2

- A body that collected several fillets or chamfers one after another could end up with visibly rippling, uneven mesh lines - reported in the forum on a part built from a sketch and rounded several times over. Each edge treatment re-tessellates the whole body, but the fineness used to depend only on that one operation's own radius, with nothing carried over from an earlier, finer pass; a later fillet with a bigger radius could quietly resample an already finely curved region (a sketch's own rounded corners, an earlier small fillet) coarser than it had been. A body now remembers the finest tessellation any of its edge treatments has needed so far and treats it as a floor for the next one, so later, larger-radius work can no longer roughen up a region a smaller radius already needed fine.

## 1.10.0

- Duplicating a body now remembers the move and turn applied to the previous copy and repeats the same amount on the next one, the way Tinkercad's does - requested by name in the forum, for building a row of holes without dragging each one into place by hand. Pressing duplicate again without moving anything in between repeats the last such step too, so a row keeps extending with nothing but the same key. Most bodies bake a turn straight into a mesh and reset the plain rotation field to zero the moment it happens; the amount actually turned is read from the parametric record layerling already keeps for exactly that case, and reapplied through the same baking step a real turn goes through, so it lands on the copy's own mesh rather than a field that would reset to zero regardless.

- A screw or threaded rod's free end used to run out to a sharp crest, called out in the forum as poor for starting into a mating thread and poor for printing. The chamfer that softens it was already there, but tied to the thread's own depth - the same value used to just deburr a nut's mouth or a tapped hole - which for most pitches comes out well under a millimetre. A free thread end now defaults to a full turn's worth of chamfer instead, reaching visibly past the core diameter into an actual point the way a real screw's ground end does; a nut's mouth and a tapped hole, which only need deburring rather than a lead-in, keep the old, shallower default.

- Rounding or chamfering an imported or boolean body, turning a sketch into a solid, and every boolean operation load a shared computation kernel the first time any of them is used in a session. If the network dropped at exactly that moment, the failed load stayed poisoned for the rest of the session, and every later attempt failed the same way even once the connection was back - found while chasing an unrelated report of a dropped connection leaving a design stuck. STEP export already caught this for its own kernel load; the same self-healing catch now covers the other three places that load one.

## 1.9.0

- Dragging a handle to resize, lift or rotate a single body now measures against that body's own axes instead of the world's, when no explicit workplane is active. Rotate one and the old code kept reading the drag in world X/Z/Y regardless, which on a cylinder in particular turned a resize into a squash - the diameter that changed depended on which way the body happened to be facing, not on the handle being pulled. A multi-body selection and a body resized against a workplane the user actually picked on a face both keep behaving exactly as before; only a single, freely rotated body with no such workplane changes, and only in the direction of no longer drifting off-axis.

- A cylinder can no longer become an ellipse by accident. Its width and depth used to be as independent as a box's, so a mismatched shape default, an uneven MCP call, or the drag above could all leave one wider than the other with nothing to say so was wrong - the STEP exporter already had to special-case exactly that, quietly falling back to a baked mesh instead of an exact solid whenever it happened. The cylinder's panel now shows one **Diameter** field in place of separate length and width, every handle on it drives that one diameter together, and the shape defaults, the MCP bridge and an older saved project with mismatched values all resolve to the same circular result. A cylinder that is rotated and then resized through its own baked mesh - a separate, existing part of how a turned body is remembered - is not covered by this and can still end up elliptical; a fix for that specific path is still open.

- A genuine ellipse joins the shape list for whoever actually wants one: same body as the cylinder underneath, but its width and depth stay independently adjustable on purpose, with its own icon, its own defaults, and support everywhere a cylinder already had it - the shape palette, the inspector, shape defaults, the MCP bridge and saved projects.

- Running layerling locally and opening it as `http://127.0.0.1:<port>` instead of `http://localhost:<port>` used to leave the MCP bridge permanently unreachable: the editor's own heartbeat was rejected as cross-origin every few seconds, so no AI client could ever find it, silently. The check compares the request's port now instead of its exact address, since both names reach the very same local server.

## 1.8.0

- A thread can carry a different tooth profile now, next to the existing **V** shape: **Trapezoidal** and **Round**, both requested by name in the forum, because a sharp crest and a sharp root print poorly with FDM - the crest rounds itself off in the print and the root becomes a stress riser, exactly what a screw thread should not have. V stays the 60-degree ISO default, unchanged down to the last vertex. Trapezoidal cuts a flat top and a flat bottom at the 30-degree flank angle of DIN 103 instead of 60; round drops the flanks altogether for a single cosine curve running the whole pitch, approximating DIN 405. Both depths are documented approximations tuned for a shape that actually prints well rather than a textbook match, in the same spirit as the existing 82-versus-90-degree countersunk deviation. The profile only changes the tooth's cross-section and its depth per turn - role, head, hand, diameter, pitch and quality work exactly as before on any of the three, the chamfer at a thread's ends (always exactly the thread's own depth) now reads that depth from whichever profile is chosen, and the new dropdown sits next to thread direction in the panel, in the shape defaults and through the MCP bridge, the same as every other thread setting.

- The four fixed points that used to describe the ISO tooth - crest, two flanks, root - became a list any profile can supply its own of, so trapezoidal reuses the same straight-flank math with different numbers and round supplies twelve points instead of four without either one touching the shared geometry code. One place still assumed exactly four: the vertex-budget estimate that throttles thread quality on a long or fine screw read the profile's point count as a literal 4, which would have under-budgeted round's finer profile and thrown off the same throttling that already keeps an M2 thread from running away on a 100 mm rod. Found and fixed before it ever shipped, not after.

## 1.7.0

- A ruler joins the shape list, the kind Tinkercad has. Drag it onto the plate like any other body and it carries a printed scale; any body that touches or overlaps its band gets its size along the ruler's own axis shown as a floating number right in the view, not in the properties panel, and typing into that number resizes the body directly. Beside it sits a small round handle: click it for a distance to type, with the body's own length filled in as a starting guess, or drag it to place a copy exactly where the pointer lands. The ruler is a measuring tool and nothing else - it never counts toward an export, and neither grouping nor a boolean operation nor edge treatment will take it as an operand, in the toolbar or through the MCP bridge. Its own panel drops taper and the solid/hole choice, because neither means anything on a plain measuring stick.

- Two bugs turned up while that duplicate handle was measured against a real browser instead of assumed correct from reading the code. The handle is drawn above the plate, but the first version read the pointer back against the ground plane underneath it - on an angled camera that is a different point than the one under the cursor, so a copy meant to land 35 mm away landed 1 mm off instead. It now reads the pointer back at the same height the handle is drawn at. And a single click produced two copies in development, because React's Strict Mode calls a state updater twice on purpose, to catch side effects hiding inside one - and this updater held the actual duplication. Moving that into the click handler itself, the way the existing dimension editor already did it, fixed it for good rather than only in this one place.

- What used to carry the ruler icon and the name "Ruler tools" was always a tape measure - point to point, snapping to corners, edges and faces, unchanged in how it behaves. It now carries the name and icon that match what it does, so the two tools stop being mistaken for each other.

- The quick guide has a **Measuring** section explaining both, since a floating number in the 3D view is not something the properties panel ever pointed anyone toward.

- The page's own language tag follows the interface language instead of always reading English. It never showed on screen, but a screen reader and hyphenation both read it, and a stored German choice was invisible to either until now.

## 1.6.0

- A screw head can have its rim broken, and it no longer goes through the CAD kernel to get there. Chamfering the head of a screw used to end in a timeout and nothing else: edge treatment has to rebuild the whole body as a CAD solid first, and a thread is a tessellated helix - a plain M6 screw is 13,304 triangles. Measured here: 20 s to sew and heal that into a solid, another 107 s to collect its edges, and what came back were 14,845 edges, one per triangle boundary, with no head rim to be picked out among them. On a slower machine that is minutes of waiting for a list nobody can use. The head carries its own chamfer now, as **Head chamfer** beside the head height - exact, instant, and with no kernel involved. It breaks both rims of the head, the free face and the shoulder the shaft rises from: a screw stands on its head, so a chamfer on the free face alone would sit against the workplane where nobody can see it. It is a cone about the axis, so on a hex head it cuts the corners deeper than the flats, which is what a turned head chamfer looks like. How far it can go depends on the head - the socket, the collar around the shaft and a remaining strip of flank all have to survive - so a hex head, whose corners eat more height, allows less than a cylinder head of the same size. A countersunk head does not offer it at all, because its cone already is one. A screw saved without the value stays sharp, so nothing in an existing design moves by itself.

- The nut has the same chamfer, on both of its faces, as **Rim chamfer**. It is the same cone and the same reasoning: a real nut is chamfered on both sides, and a printed one wants its sharp corners broken just as much. What limits it there is the bore rather than a socket - the thread's own countersink at the mouth eats into the face from the inside, and the chamfer has to stop short of it, leaving a flat ring in between. A nut pulled flatter than the standard height gets the value trimmed again when the shape is built, so the two cones can never meet in the middle.

- Edge treatment says no straight away instead of timing out. The guard it had stood at 180,000 triangles, which is a number from nowhere. Measured on this machine, preparing a mesh costs about 0.6 s at 400 triangles, 6.6 s at 2,208 and 11.1 s at 3,806 - and at 7,612 it had still not finished after four minutes. Collecting the edges grows with the square of the triangle count, because every edge is held against the faces around it, while the watchdog's estimate grew as a straight line; so anything much above a few thousand triangles had been failing all along. It just failed slowly, after a minute of hope and a forced cancel. The tool now stops at 4,000 triangles before any work begins, and the message names the count, the limit, and - for a thread, which is where this comes up - the head chamfer that does the job without the detour. The estimate behind the watchdog follows the measurements now instead of a line.

- A rotated body keeps its properties. Rotating anything but text or a group turned it into a plain mesh: the diameter of a nut, the sides of a cylinder, the teeth of a gear were all gone from the panel, and no way led back. That was not an oversight but a trade - a body is rotated about the centre of its frame, and afterwards the frame has to be measured again from the rotated geometry, or the handles would sit somewhere else than the body. Baking it into a mesh does that measuring. What was missing was the memory: the body's own values had in fact survived on the record all along, only the *kind* had been overwritten, and the panel keys off the kind. It is now written down what the body was and how far it has been turned, so the panel shows its values again. Changing one rebuilds the body, turns it by the remembered angle and measures the frame anew - which also means a rotated body no longer accumulates tessellation, because every change starts from the parameters again. Successive rotations compose as quaternions rather than as added Euler angles, which is where three turns about three axes would otherwise drift apart. Dragging a handle still works on the frame, untouched. A mirrored body is deliberately not remembered: a mirrored right-hand thread is a left-hand thread, and re-applying that honestly is a different job.

- Head height and both chamfers arrive when a screw is created. They were offered by the shape defaults and by the MCP bridge, and both were quietly dropped on the way in: a new screw always came out with the standard head, whatever had been asked for. This turned up while the head chamfer was being wired up, and it was the same omission three times over.

- Ten status messages spoke English in a German window. "Deleted 2 selected shapes" after a delete, and the same for cutting, moving, rotating, snapping to the grid, dropping to the workplane, separating parts and showing hidden shapes; a tenth sat in sketch mode, one line above its translated neighbour. All of them were English sentences written straight into the code instead of keys in the catalogue. They are keys now, with singular and plural, and one further literal that was overwritten a line later by its own German version is simply gone. A test reads the source of the three components that can show a status message and fails on any display string that did not go through the translator - which is the part that makes this stay fixed, because a missing key renders as the key itself and is loud, while an English sentence is invisible to anyone working in English.

## 1.5.0

- Bodies that share space are one body in the exported file. Two overlapping solids used to be written as two shells that run through each other: a slicer usually repairs that quietly, but it is not a solid - CGAL gives up on it outright (`assertion violation ... e_below != SHalfedge_handle()`, and then no geometry at all). STL and OBJ now merge what overlaps before writing, and say how many bodies that was. Bodies that merely touch are merged too, because a shared face is the same defect in a gentler disguise - its four edges belong to two shells at once - and grid snapping makes exactly that arrangement the normal case. Bodies with air between them stay separate shells, which is what several parts on one plate are supposed to be. Measured on two 20 mm cubes: overlapping by half they used to export as 16000 mm³ in two shells and now come out as one closed shell of 12000 mm³, every edge used exactly twice; stacked flush, 16000 mm³ in one shell instead of four edges shared by two shells; 40 mm apart, unchanged. When the merge cannot be done the export still runs and says the file holds the bodies separately.

- Edge treatment no longer piles up work it will never show. Every step of the size slider used to post its own preview to the CAD worker, and the worker computes each request in turn - so on a slower machine it was still working through a queue long after the slider had come to rest. The panel made that worse by locking every control while it was busy, which turns a slow computation into something indistinguishable from a program that has hung. At most one preview is in flight now, with at most one waiting behind it; everything in between is dropped, because only the value the slider stops on is worth computing. Measured on a box with all twelve edges selected and an artificially slow worker: eleven requests before, three after. The controls stay usable while a preview runs, the panel says what it is doing, and **Clear selection** stops the running computation instead of leaving the panel spinning over a selection that no longer exists.

- Edge treatment asks less of the CAD kernel, and survives it running dry. Reading a stored B-Rep back in used to place it with a general transform every time, including for a plain move - and a general transform rebuilds analytic faces as splines, which costs memory and precision that a move never needed. Moves, rotations and uniform scaling now take the exact, cheap path the code already had for primitives; only a genuinely non-uniform scale still needs the general one. What remains is a limit of the kernel itself: after enough edge work in one page session it refuses to read a stored B-Rep back - the same string it accepted a minute earlier. That used to surface as `fromBREP: [object WebAssembly.Exception]` and the broken kernel was kept, so from that moment on *every* object failed until the page was reloaded. The kernel is now torn down properly and the message says what happened, so the next object works again. Measured on a box that is filleted, then moved or scaled, then filleted again: one of six attempts got through before, five of six after.

- Three small things in the edge panel that together made the tool look broken. A body whose transitions are all shallow - a cylinder whose rims are already rounded, say - had nothing highlighted at the fixed 25° threshold and said so in English, which reads as if edge treatment only worked on right angles. Every edge carries its own angle, so the panel already knew the sharpest one present: the threshold now drops to it and says that it did. The feature history was a row of undo buttons that only a small arrow icon gave away, so clicking an entry to look at it quietly took the rounding back - and an entry far enough down took every newer one with it. It now says what it is, each row leads with the action, and an entry that removes newer features warns about that on its own line. The edge tool also speaks German again in a German window: its errors were English literals in the code. And the history block had no dark-mode rules at all, so it stayed a cream card on the dark ground.

## 1.4.0

- layerling has icons of its own in the sizes a browser cannot make from an SVG. iOS takes nothing but PNG for the home screen, so **Add to Home Screen** used to put a snapshot of the page there instead of the mark, and anything that asks for `/favicon.ico` out of habit got a 404. The mark itself is unchanged: the PNGs are drawn from the same `layerling-icon.svg` the browser tab already shows, so it stays the one place the brand is described.
- A web manifest makes the site something a browser can install - its own window without an address bar, under the right name and icon, and on Android an icon that survives being masked into whatever shape the launcher uses. There is no service worker, so an installed layerling still needs the network; installing only takes the browser's own frame away.
- A link to layerling.com brings a picture with it now: the mark, the name and the line about what this is. The page carried no `og:image` at all until now, so a forum or a messenger had nothing to show but the bare address.
- Dark mode shows its toolbar again. The drawn marks are all `currentColor`, so a tool can take the colour of the group it sits in - but the rule that set that colour named a near-black outright instead of the theme's ink. On the dark ground the enabled tools were dim and the disabled ones were gone altogether, which left whole groups looking like empty boxes. Brightening them through a filter had been papering over it; that is gone too, because it only washed out what now has the right colour to begin with.
- Two more corners that the dark theme had missed: the light ground beneath the 3D canvas, which flashed white wherever the canvas had not caught up with a resize, and the heading of the folded-up welcome panel, which was left darker than the line underneath it.
- **Sketch to 3D** opens its menu again on a window narrower than 1240 pixels. Below that width the toolbar scrolls sideways, and a row that scrolls in one direction cannot let anything hang out of it in the other - so the menu was drawn, just behind the workplane. The shapes menu beside it had been given the way out years ago; this one now takes the same one.
- The shapes menu in sketch mode says what its shapes are called. It had been printing the name of the translation instead of the translation, so the list read "sketch.rectangle" and "sketch.circle". Only the tooltip was right.
- Two shapes joined that menu: an **oval** and a **half circle**. The oval is an ellipse half as tall as it is wide; the half circle is an arc closed by its own chord, so it can be extruded straight away. Both arrive as ordinary points and edges, the same as the ones you draw - every point can be moved afterwards, every edge split. Their curves are four-point Béziers, which follow the true arc to within a ten-thousandth of its radius.
- And two more after them: a **pie slice** and a **bolt circle**. The slice is a quarter of the circle above it, an arc between two radii. The bolt circle is a disc with six holes on a pitch circle - at the size it arrives in, a 20 disc, a 13 pitch circle and 3 holes, which is clearance for an M3. Its holes are holes because the sketch says so: it counts how deeply each closed outline sits inside the others, and what sits an odd number deep is cut away. That is also why the disc comes along - six circles on their own would extrude into six pillars. Delete it if you want the pattern inside an outline of your own; it is an ordinary loop like any other.
- A body whose edges were rounded or chamfered can be exported as STEP again - with the rounding in it. Treating an edge turns a box into a mesh, and a mesh is not something STEP can hold, so the export skipped it; a design that held nothing else gave up with "No box/cylinder/sphere or imported STEP solids". The exact shape had been lying beside it the whole time: the CAD service stores its result as a B-Rep on the body, and that is what goes into the file now. A rounded 20 cube comes out as six planes, twelve cylinders and eight spheres - real CAD surfaces, not a facetted approximation.
- The export says what STEP can carry, before and after. The panel under **STEP** now names it - boxes, cylinders, spheres and cones, anything with treated edges, bodies that came in as STEP - and says that threads, springs, gears, text and imported meshes go as STL instead. When nothing in a design fits, the message says so in your own language rather than passing through the English line from inside the exporter, and a skipped shape is counted in a sentence that is no longer half English.

## 1.3.0

- Added notes on the workplane. A note stays where you put it, or pins itself to a body and travels along as that body moves, turns and grows. The pin carries a number, a click folds the card open, a switch in **Visibility** hides all of them at once, and nothing of them reaches an exported STL. A note rides inside the design's own history, so undo and redo take it with them, and it travels in the `.lyl` and to the server without anything extra being asked for.
- **Duplicate** in a design's menu makes a copy of it. On the server the file itself is copied - beside the original, under a free name, picture included - so the copy carries the original's geometry down to the byte and nothing is repacked. In your browser the copy becomes a design of its own, with the same shapes, the same history and a preview picture of its own, bound to nothing on the server. The copy of a copy is called "(copy 2)", not "(copy) (copy)".
- The search now covers the whole server folder instead of only the one you happen to be standing in. It used to hide what did not match in front of you and leave the folder tiles untouched, so a design one level down was invisible and unreachable at once. Every hit now says which folder holds it, and that folder is a button: one click and you are there, with the search cleared. Folders are found by name as well, and while you search, the server tile on the start page says how many matches wait over there.
- The workplane can be worked with fingers. One finger does what the left mouse button does: tap to select, drag to move, drag on empty space for a selection box. Two fingers belong to the view - spread them to zoom, move them together to shift the workplane - and putting the second finger down takes back whatever the first one had started, so a pinch never nudges a part. Turning has no gesture of its own; the camera rail carries a switch for it, and that switch only appears on a touch screen. Until now the view could only be turned with the right mouse button and shifted with the middle one, and a tablet has neither.
- Number fields hand over their whole value when you jump into them, ready to be overwritten. A decimal keypad has no arrow keys to place the caret with, and a field five characters wide is not hit digit by digit with a finger: turning "20.00" into "35" meant deleting one character at a time, and a slip left "23.000".
- The MCP bridge can set the taper it had been reporting all along. The values arrived and were then dropped without a word, because everything a command carries is measured against the workspace shape defaults while a taper belongs to the single body - the same shape of bug as the thread and spring settings in 1.2.1. Which shapes ignore a taper is one function now, so the panel and the bridge cannot drift apart. `radius`, the rounding of a box, was dropped from what the bridge reports: the format carries it, but no control and no command sets it.
- Note for older versions: notes travel inside the design's history, which 1.2.2 and older know nothing about. They open such a file and pass the notes over - **and throw them away on the next save**. The format version itself is unchanged.

## 1.2.2

- The status line moved out of the camera rail's column: it floats at the top of the workspace now, beside the view cube, where a whole sentence fits. Down in the corner the two shared a column, and on a flat window - an iPad in landscape with all of Safari's bars - they met.
- It also goes away again. A confirmation steps back after four seconds, a prompt or a failure after thirty, and while there is nothing to report there is no panel at all.
- The camera rail begins sixteen pixels below the view cube instead of sixty-nine, and stands in two columns on a window too flat for one, plus and minus side by side. The rule hangs on the window's height now; the only one before it hung on the width and never matched a window that was wide but flat.
- Pressing the house takes the preview picture and saves a design that lives on the server, there and then. The preview used to wait for a pause in the work and was then taken from a canvas that the hidden editor had already collapsed to nothing - so it never arrived at all.
- A design that was merely opened no longer uploads itself moments later. What counts as a change is the content, not how often the editor's bookkeeping ran.

## 1.2.1

- Fixed the workspace settings losing what they had been told about threads and springs. **Shape defaults** offered the fields and the value took effect at once, but the next time layerling started it stood at standard again: the list those settings are checked against had never learned the two shapes that arrived in 1.2.0, and whatever is not on that list is dropped without a word on the way into storage. Every other shape kept its defaults all along.
- The MCP bridge can now build every shape the palette has a tile for - polygons, spheres, cones, pyramids, wedges, roofs, tori, tubes, gears, springs and threads - instead of boxes, cylinders and sketches alone. It takes its list from the same catalogue the shape menu is built from, so a shape added later is offered without anybody remembering to say so.
- What a shape is beyond its size now travels in both directions. A thread can be asked for by diameter and pitch, a spring by turns and wire, a text by its lettering, and the same values can be set again afterwards - a cylinder's side count can finally be pinned once the cylinder already stands there. Changing a thread's diameter moves its width and depth with it, and a head that sat at the standard height for its size moves to the standard for the new one.
- Reading a scene tells what a shape is made of. Until now the answer carried sizes only, so a client read the dimensions of a screw without ever learning whether M4 or M5 stood on it. A round body that has no side count of its own reports the number it is drawn with at its current size, and says that the number follows the size.
- A locked object was a dead end over the bridge: four operations refused to touch it and nothing could release it. The same call may now pass `locked: false`, and `hidden` can be set as well.
- Everything arriving over the bridge is held to the limits the panel uses, so a value cannot enter a design that would then be refused when that design is saved. A pitch of 99 on an M5 arrives as 3.75.

The bridge is the local development server's `/api/layerling-mcp`; static builds and layerling.com do not carry it, and none of this changes what the editor does by hand.

## 1.2.0

- Added threads as a shape of their own, in four forms: a threaded rod, a screw with a socket, countersunk or hex head, a hex nut, and a tapped hole. The thread is cut from the real ISO profile - sixty degrees, with the crest and the root flattened the way the standard prescribes - not from a sawtooth. That is what makes a printed screw actually run in a printed nut.
- M2 to M12 are listed by name, and so are UNC and UNF from #4 up to one inch. Diameter and pitch can also be set freely, and for an inch size the pitch field asks for threads per inch instead of millimetres, because that is the number written on the part. Left-hand threads are a switch, not a separate shape.
- A clearance value sets how much room the thread leaves, so a nut printed at 0.2 mm clearance turns on a rod instead of welding itself to it, and both thread ends can take a chamfer that leads the first turn in.
- In the panel, **Length** means the thread alone and the head has its own height slider, so shortening a screw no longer shrinks its head. The diameter is one slider: dragging a handle in the workspace scales both horizontal axes together, so a thread can never come out oval.
- The tapped hole is a cutting tool like any other. Drag it into a part, group the two, and the part has a thread in it.
- Added springs - a wire wound along a helix, with the number of turns, the wire thickness and the resolution as separate values. The spring fills the box it is given exactly, including the wire at both ends, so a spring of 30 mm measures 30 mm.
- Added the polygon: a prism of three to twenty-four sides, sitting exactly in its footprint. A hexagon inserted at 20 mm measures 20 mm across the flats and is equilateral, not squashed.
- The pyramid now has **Top length** and **Top width** instead of running to a point, which makes a frustum a matter of two numbers. Taper did the same job worse and has been dropped there, along with everywhere else it had nothing to act on.
- Corrected the footprint of round shapes: a cylinder drawn at 20 mm now measures 20 mm, where a low side count used to leave it noticeably smaller - a six-sided one measured 17.32.
- Round shapes now pick their own number of sides, following the diameter, so that no flat sits more than five thousandths of a millimetre off the true circle. A small pin no longer carries the polygon count of a large disc, and a large disc no longer shows its facets. **Sides follow the size** turns the following off and pins the number by hand; existing designs keep the number they were saved with.
- The shape list is laid out in several columns and no longer needs scrolling, and its heading is simply **Shapes**.
- Note for older versions: threads, springs, polygons and pyramid frustums are new shape types in the `.lyl` package. The format version is unchanged, so designs written here still open in 1.1, but a design that contains one of the new shapes does not.

## 1.1.0

- Designs can now be kept on the server instead of only in the browser, and everyone who opens the page sees them. Where layerling runs on Node, `LAYERLING_SHARED_PROJECTS_DIR` points at the folder; where it is served as a static export, `store.php` travels with it and a folder named `store` beside `index.html` switches it on. Without either, nothing changes.
- Designs on the server can be organised in subfolders, moved between them by dragging or through **Move to ...** in their menu, and dragged over from the browser. A design started inside a folder is created there, and every change saves itself back - five seconds after the last one and when the editor is left.
- Neither route has a login: whoever reaches the page can read, write and delete what is in the folder. It refuses anything that is not a `.lyl` package and any path that would lead out of the folder, and it will not overwrite a file that changed in the meantime.
- Dropped the settings window. The save path it offered only ever worked where layerling runs on Node on the same machine, and version, licence and source were in the footer anyway. The language moved to the top right corner as two small flags, where a website's language picker is looked for - and where the editor can show it too, so the language can be changed without leaving a design.
- Settled on one word for the thing you build: **Entwurf** throughout the German interface, **design** throughout the English. "Project" now only means layerling itself.

## 1.0.1

- Added a welcome panel that greets a first visit in place of the empty project list, with a short guide aimed at people arriving from Tinkercad. Once projects exist it folds into a single line under the list.
- Put the footer under the workspace as well, so the version, the legal pages and the way to the source stay in view while modelling.
- Added the version of the running build and a link to the release notes to that footer, plus an optional sponsor button configured through `NEXT_PUBLIC_SPONSOR_URL`.
- Fixed the wordmark clipping the descender of its g: the line box was shorter than the glyphs, and the rule that gives the name its ellipsis on narrow windows cut off everything below.
- Subtracted the new footer from every height inside the editor that was measured against the toolbar alone; the workspace and the sketch surface had been reaching past their container.

## 1.0.0

First release of the fork, based on SketchForge 1.0.9 and under the same licence.

- Translated the whole interface into German alongside English - not only the menus, but notices, dialogues and the names new projects are given.
- Renamed the project format to `.lyl` with the schema identifier `com.layerling.project`. Files written as `.skf` still open, whatever their format version, and are saved back as `.lyl`.
- Fixed the multi-second freeze that followed a simple transform in large projects: autosave no longer writes a full copy of every object's display edges into every undo state.
- Raised the project format to version 2, which stores display edges as deduplicated assets. Version 1 and the version 0 prototype are still opened; a reader that only knows version 1 refuses a version 2 package.
- Encoded and hashed mesh, display-edge, and imported-source data is now reused across saves instead of being rebuilt for every autosave, and restored undo states share one display-edge list per object.
- Reworked the ribbon: groups tell themselves apart by colour, the icons fit at every window width, and a Help group offers a keyboard-shortcut overview and a short guide to the editor.
- Added arrow-key nudging by the snap grid's own step, framing the camera on the selection, centring a selection on the active workplane, a label on the workplane's front edge, and dimension labels that stay clear of the rotation handle.

## 1.0.9

- Corrected Top and Bottom camera views so they align exactly with the vertical axis in both perspective and orthographic projection.
- Added Ctrl/Cmd + right-button panning in Sketch mode while preserving middle-button panning.

## 1.0.8

- Duplicated objects now stay in the exact position of their source instead of receiving an automatic offset.
- Added geometry shortcuts: `R` rotates selected objects by 45 degrees and `Shift+R` rotates them by 22.5 degrees around the active workplane normal.
- Corrected rotation controls so objects turn in the direction indicated by the pointer on every rotation plane.
- Kept selection outlines, resize anchors, and height controls stable during close zoom while naturally hiding controls that leave the viewport.
- Kept object faces visible from inside the object and hid rotation controls while the camera is inside the selection.

## 1.0.7

- Raised the supported `project.json` size in `.skf` packages from 32 MiB to 64 MiB and compacted new project exports without removing editable data.
- Reused decoded derived-mesh data across restored history states to reduce memory pressure when opening large `.skf` projects.
- Prevented workspace-only changes from advancing the persisted shape revision and replacing newer live objects with an older snapshot.

## 1.0.6

- Fixed dense STL imports failing with `Invalid string length` while creating their initial undo-history fingerprint.
- Streamed large numeric mesh arrays into deterministic hashes instead of converting millions of coordinates to one oversized JSON string.

## 1.0.5

- Made the rotation handles larger and aligned their arrow glyphs with the model faces as the camera moves, including stable behavior on long objects.
- Positioned the lower rotation handle consistently at the model base and corrected its visual and drag directions.
- Added an optional **Select before moving** workspace setting so the first click selects an object without immediately dragging it.

## 1.0.4

- Fixed imported STL objects briefly appearing and then vanishing when a stale IndexedDB project read completed after the import.
- Prevented older persisted project data from overwriting newer live editor state during asynchronous project hydration.

## 0.1.0

- Initial open-source alpha.
- Browser-based 3D workspace with primitive shape editing.
- STL import and STL/OBJ export.
- Grouping and hole subtraction workflows.
- Local project dashboard with generated thumbnails.
