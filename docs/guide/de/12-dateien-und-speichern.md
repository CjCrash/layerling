---
title: Dateien, Speichern und Weitergeben
summary: Wo deine Entwürfe liegen, wie du sie sicherst, welche Formate layerling importiert und exportiert und was auf einem gemeinsamen Server möglich ist.
---

## Wo deine Entwürfe liegen

layerling speichert alles im Browser auf deinem Rechner. Es gibt kein Konto, und nichts wird hochgeladen. Jede Änderung sichert sich von selbst, auch das Vorschaubild auf der Startseite. Öffnest du layerling nach Tagen wieder im selben Browser, ist alles da.

Das hat eine Kehrseite: Wer den Browserspeicher löscht oder auf einen anderen Rechner wechselt, verliert die Entwürfe. **Sichere deshalb wichtige Arbeiten in eine Datei.**

## Sichern und Weitergeben

Auf der Startseite hat jeder Entwurf ein Menü mit den Optionen zum Umbenennen, Duplizieren und Löschen. Mit {{ui:dashboard.backupAll}} packst du alle Entwürfe auf einmal in eine einzige Datei. Über {{ui:dashboard.importGeometry}} kommen sie wieder zurück, auch in einem anderen Browser oder auf einem anderen Rechner.

Einen einzelnen Entwurf sicherst du im Editor: {{ui:editor.export}}, dann das Format **LYL** wählen und {{ui:export.saveProject}} anklicken. Die LYL-Datei ist layerlings eigenes Entwurfsformat und enthält alles: Formen, Gruppen, Skizzen, CAD-Daten, importierte Quellen und den Verlauf, also die Rückgängig-Schritte. Bei {{ui:export.historyTitle}} wählst du, wie viele der letzten Schritte mitreisen sollen; vorgegeben ist, was die Einstellungen (das Zahnrad im Menüband) unter {{ui:workspace.history}} aufheben. Ältere `.skf`-Dateien aus früheren Fassungen lassen sich weiterhin öffnen, gespeichert wird dann als `.lyl`.

## Exportieren

Klicke auf {{ui:editor.export}} oder drücke [[Strg]]+[[E]].

![Das Exportfenster mit den Formaten STL, 3MF, OBJ, STEP, SVG und LYL.](shot:export-panel)

Oben steht der Dateiname, darunter wählst du das Format. Du entscheidest, ob nur die Auswahl oder der ganze Entwurf exportiert wird. Ist die Datei geschrieben, schließt sich das Fenster von selbst; schlägt der Export fehl, bleibt es mit der Meldung offen.

| Format | Wofür | Was du wissen musst |
| --- | --- | --- |
| **STL** | Slicer und 3D-Druck | Ein Dreiecksnetz. Das einfachste und verbreitetste Format. |
| **3MF** | Slicer mit Farben | Jeder Körper bleibt ein eigenes Teil mit Namen und Farbe. Geeignet für PrusaSlicer, Bambu Studio, OrcaSlicer und Cura. Bambu Studio und OrcaSlicer fragen beim Öffnen, wie die Farben auf deine Filamente verteilt werden sollen, und nennen die Datei „nicht von Bambu“ – die Meldung ist harmlos. |
| **OBJ** | Modellierung und Austausch | Ein breit unterstütztes Netzformat. |
| **STEP** | Ein vollwertiges CAD-Programm | Behält Quader, Zylinder, Kugeln und Kegel als exakte Geometrie, ebenso Formen aus einem Umriss (Stern, Herz, Ellipse, Rohr, Halbkugel, Rundes Dach, Abgerundeter Quader, Schwalbenschwanz, die Bohrungen und mehr), das gebogene Rohr, Gewinde, Federn und Zahnräder, dazu Rundungen und Fasen. Der erste STEP-Export in einer Sitzung lädt den CAD-Kern (etwa 22 MB) einmalig nach. |
| **SVG** | Lasercutter und Plotter | Eine saubere Draufsicht in Millimetern, samt Löchern und gekrümmten Umrissen. |
| **LYL** | layerling selbst | Der bearbeitbare Entwurf mit allem Drum und Dran. |

Aussparungen lassen sich nicht einzeln exportieren. Gruppiere sie zuerst mit einem Körper, sonst weist dich layerling darauf hin.

## Importieren

Über {{ui:editor.import}} oder [[Strg]]+[[I]] bringst du fremde Dateien in den Entwurf.

![Das Importfenster: Entwürfe öffnen oder einfügen und Geometrie ablegen.](shot:import-panel)

- **{{ui:import.openProject}}:** Ein layerling-Entwurf (`.lyl`, oder eine ältere `.skf`) kommt als neuer Entwurf zurück.
- **{{ui:import.insertProject}}:** Die Körper eines layerling-Entwurfs kommen in den offenen dazu. Praktisch für Grundformen, die du immer wieder brauchst: Baue sie einmal, speichere sie und hole sie jedes Mal herein.
- **Geometrie hinzufügen:** Lege STL-, OBJ-, 3MF-, STEP- oder SVG-Dateien im Fenster ab oder klicke, um eine Datei auszuwählen. Importierte Netze kannst du drehen, verschieben, mit Aussparungen schneiden und dann weiterbauen. Ein SVG wird zu einer Form, die du weiterbauen kannst.

Bilder als Vorlage fügst du im Skizzenmodus ein, siehe [Skizzen](chapter:skizzen).

## Gemeinsame Entwürfe auf einem Server

Wenn layerling auf einem eigenen Rechner oder Webserver läuft, kann es einen gemeinsamen Ordner anbieten, in dem alle Nutzer Entwürfe ablegen. Auf der Startseite erscheint er dann als {{ui:dashboard.sharedProjects}}. Du legst dort Ordner an, verschiebst Entwürfe per Ziehen und suchst über den ganzen Ordner. Ein Entwurf, der dort liegt, sichert sich von selbst dorthin zurück.

Das ist kein gleichzeitiges Bearbeiten: Wer eine Datei öffnet, arbeitet an einer eigenen Kopie. Hat inzwischen jemand anderes die Datei geändert, verweigert layerling das Überschreiben.

Auf layerling.com ist diese Funktion nicht eingeschaltet. Wie du sie auf einem eigenen Server einrichtest, steht in der [README auf GitHub](https://github.com/henmedia/layerling/blob/main/README.de.md#gemeinsame-entwürfe-im-netz).
