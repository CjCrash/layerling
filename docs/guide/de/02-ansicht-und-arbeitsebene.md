---
title: Ansicht und Arbeitsebene
summary: Sich in der Szene bewegen, gerade von vorn schauen und neue Formen auf jede beliebige Fläche setzen.
---

## Sich bewegen

Mit der Maus:

| Was du tust | Was passiert |
| --- | --- |
| rechte Maustaste ziehen | die Ansicht drehen |
| mittlere Maustaste ziehen | die Ansicht verschieben |
| Mausrad | hinein- und herauszoomen |
| [[Strg]] halten und mit links ziehen | ebenfalls verschieben |

Auf einem Tablet oder Handy zoomen zwei Finger (spreizen und zusammenziehen) und verschieben die Ansicht (gemeinsam schieben). Ein Finger arbeitet am Entwurf, so wie die linke Maustaste. Wer mit einem Finger drehen möchte, schaltet in der Kameraleiste {{ui:camera.touchRotate}} ein. Der Schalter erscheint nur auf Geräten mit Touchscreen.

### Der Ansichtswürfel

Der Würfel links oben zeigt, wohin du gerade schaust. Ein Klick auf eine seiner Seiten springt in die gerade Ansicht von oben, unten, vorn, hinten, links oder rechts. Das geht auch mit den Zifferntasten [[1]] bis [[6]].

### Die Kameraleiste

Am linken Rand liegt eine schmale Leiste. Von oben nach unten:

- {{ui:camera.home}} holt die ganze Szene wieder ins Bild. Die Taste dazu ist [[F]] oder [[Pos1]].
- {{ui:camera.focusSelection}} zoomt auf die Auswahl ([[Umschalt]]+[[F]]).
- {{ui:camera.zoomIn}} und {{ui:camera.zoomOut}} zoomen schrittweise.
- {{ui:camera.orthographic}} schaltet auf eine flache Ansicht um, in der parallele Kanten parallel bleiben. Das ist zum Messen und zum Ausrichten von Kanten oft angenehmer als die perspektivische Ansicht. Mit [[O]] wechselst du hin und her, ein zweiter Klick geht zurück.
- {{ui:camera.placeWorkplane}}, das Massband und das Winkellineal sind eigene Werkzeuge, sie kommen weiter unten und im Kapitel [Messen und Notizen](chapter:messen-und-notizen) vor.

Über den kleinen Pfeil ganz oben in der Leiste kannst du sie ausblenden, wenn sie stört.

## Ins Innere schauen: die Schnittansicht

{{ui:camera.sectionView}}, der letzte Knopf der Leiste, schneidet die Ansicht entlang einer Ebene auf. So prüfst du Wände, Hohlräume und Teile, die ineinandergreifen. Geschnitten wird nur die Ansicht: Entwurf, Dateien und jeder Export bleiben vollständig.

- Wähle die Achse (X, Y oder Z), quer zu der die Ebene steht. Sie beginnt in der Mitte deines Entwurfs.
- {{ui:camera.sectionCoarse}} schiebt die Ebene über den ganzen Entwurf, {{ui:camera.sectionFine}} nur ein Stück um ihre aktuelle Stelle, für Zehntelmillimeter. Die Position kannst du auch eintippen.
- Der Knopf neben den Achsen zeigt die andere Seite des Schnitts, {{ui:camera.sectionReset}} setzt die Ebene zurück in die Mitte, {{ui:camera.sectionShowPlane}} blendet die blaue Ebene aus.
- Was der Schnitt freilegt, kannst du anklicken und auswählen, auch innere Wände.

[[Esc]] schließt das Fenster; der Schnitt bleibt, bis du ihn ausschaltest.

## Die Arbeitsebene

Neue Formen richten sich nach der Arbeitsebene. Anfangs ist das die Grundplatte mit dem Gitter. Du kannst sie aber auf jede Fläche legen, um etwas seitlich oder auf eine schräge Fläche zu setzen.

1. Drücke [[W]] oder klicke auf {{ui:camera.placeWorkplane}}.
2. Fahre mit der Maus über eine Fläche eines Körpers. Sie wird hervorgehoben.
3. Ein Klick legt die Arbeitsebene dorthin. Alles, was du jetzt hinzufügst, sitzt auf dieser Fläche.

Ein Klick ins Leere oder [[Esc]] holt die Arbeitsebene zurück auf die Grundplatte. Mit [[Umschalt]]+[[W]] legst du sie direkt auf die gerade ausgewählte Fläche. Hältst du beim Klicken [[Umschalt]] gedrückt, zeigt die Ebene in die andere Richtung.

## Gitter und Raster

Das Gitter zeigt die Größe der Platte. Unten rechts steht das **Raster**: Verschieben und Skalieren rasten in Schritten dieser Größe ein, zum Beispiel 1 mm. Für Feinarbeit stellst du es kleiner, für grobes Anordnen größer. {{ui:editor.tool.snapToGrid}} im Menüband rückt die ausgewählten Formen nachträglich auf das nächste Rasterkreuz.

Größe, Gitterweite und Farbe der Platte änderst du in den Einstellungen (das Zahnrad im Menüband): Dort liegen die Bereiche {{ui:workspace.appearance}}, {{ui:workspace.measurement}}, {{ui:workspace.workplane}}, {{ui:workspace.shapeDefaults}} und {{ui:workspace.history}}. Unter {{ui:workspace.appearance}} gibt es zum Beispiel den Schalter {{ui:workspace.startInPerspective}}, {{ui:workspace.showShadows}} und {{ui:workspace.showGrid}}.

![Der Editor im dunklen Farbschema. Das Farbschema stellst du oben rechts ein: System, Hell, Dunkel oder Graphit.](shot:editor-dark)

> **Tipp:** Dreh die Ansicht nicht mehr, wenn du Teile genau aneinander setzt. Wechsle mit den Zifferntasten in die gerade Ansicht von oben oder von vorn und schalte mit [[O]] auf die flache Darstellung um. So erkennst du sofort, ob zwei Kanten wirklich bündig sind.
