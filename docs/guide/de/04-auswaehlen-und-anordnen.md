---
title: Auswählen und Anordnen
summary: Formen auswählen, in der Objektliste finden, ausrichten, spiegeln, drehen, auf eine Fläche legen und in Mustern vervielfachen.
---

## Auswählen

Ein Klick auf eine Form wählt sie aus. Mit [[Umschalt]] nimmst du weitere dazu oder wieder weg. Ein Klick ins Leere hebt die Auswahl auf, ebenso [[Esc]]. Ziehst du auf der leeren Arbeitsebene einen Rahmen auf, wählst du alles darin aus, und [[Strg]]+[[A]] wählt alle sichtbaren Körper.

Was du im Weg hast, blendest du aus ({{ui:editor.tool.hideSelected}}, [[Strg]]+[[H]]). Ausgeblendete Formen bleiben im Entwurf, sie sind nur nicht zu sehen. Mit [[Strg]]+[[Umschalt]]+[[H]] holst du alle zurück. Was liegen bleiben soll, sperrst du mit dem Schloss oben in den Einstellungen oder mit [[Strg]]+[[L]]. Gesperrte Formen lassen sich weder verschieben noch versehentlich löschen.

## Die Objektliste

Bei vielen Teilen verliert man in der Ansicht leicht den Überblick. Die Objektliste ({{ui:editor.tool.showOutliner}} oder [[Strg]]+[[Umschalt]]+[[O]]) zeigt alle Formen als Liste.

![Die Objektliste: die Gruppe „Gruppe“ mit zwei Teilen und daneben eine Kugel. Ein Ordnersymbol öffnet die Gruppe.](shot:object-list)

- Ein Klick auf einen Eintrag wählt die Form aus, auch die Teile innerhalb einer Gruppe. Mit [[Umschalt]] nimmst du weitere Einträge dazu oder wieder weg, genau wie in der Ansicht. Die Pfeile klappen Gruppen auf und zu.
- Das Etikett zeigt, ob ein Teil {{ui:outliner.solid}} oder {{ui:outliner.hole}} ist.
- Schloss und Auge sperren und verstecken einzelne Teile.
- Über {{ui:outliner.rename}} gibst du einem Teil einen eigenen Namen. Vernünftige Namen helfen bei größeren Entwürfen enorm.
- Das Suchfeld findet Formen nach Namen und nach Art, also auch „Zylinder“ oder „Aussparung“.

## Ausrichten

Zwei oder mehr ausgewählte Formen richtest du mit {{ui:editor.tool.align}} aneinander aus: Am Rand der Auswahl erscheinen Punkte für links, mittig und rechts, vorn, mittig und hinten sowie oben, mittig und unten. Ein Klick auf einen Punkt schiebt alle Formen dorthin. Klickst du zuerst eine der ausgewählten Formen an, bleibt sie an ihrem Platz und die anderen richten sich nach ihr.

![Das Ausrichten zeigt an den Rändern der Auswahl die möglichen Ziele als Punkte.](shot:align)

Die Taste dafür ist [[L]]. [[Esc]] bricht ab.

## Spiegeln

{{ui:editor.tool.mirror}} ([[M]]) kippt die Auswahl an einer Ebene: {{ui:mirror.leftRight}}, {{ui:mirror.frontBack}} oder {{ui:mirror.topBottom}}. Klicke dazu auf den passenden Achsenpfeil. Das ist praktisch für symmetrische Teile: Baue eine Hälfte, kopiere sie und spiegele die Kopie.

## Drehen und den Drehpunkt setzen

Gedreht wird mit den gebogenen Pfeilen an der Form, mit den Zahlen in den Einstellungen oder mit [[R]] in 45°-Schritten. Normalerweise dreht sich die Auswahl um ihre Mitte. Manchmal soll sie das nicht, etwa wenn ein gekipptes Rohr an seinem Ende weitergedreht werden soll. Dafür gibt es {{ui:editor.tool.rotationPivot}}: Klicke danach auf eine Fläche. Eine ebene Fläche gibt ihren Mittelpunkt vor, zum Beispiel die Achse eines Rohrendes. Die Auswahl dreht sich jetzt um diesen Punkt. Ein zweiter Klick auf das Werkzeug oder eine neue Auswahl hebt ihn wieder auf.

## Auf eine Fläche legen

Ein Teil soll für den Druck auf seiner besten Seite liegen? Wähle es aus, klicke auf {{ui:editor.tool.layFlat}} und dann auf die Fläche, die nach unten soll. Das Teil dreht sich so, dass diese Fläche auf der Arbeitsebene liegt.

Ähnlich einfach sind {{ui:editor.tool.dropToWorkplane}} ([[D]]), das die Auswahl auf die Arbeitsebene absetzt, und {{ui:editor.tool.centerOnWorkplane}}.

## Muster: Reihe und Kreis

Für Lochraster, Lochkreise und Zahnkränze gibt es das {{ui:editor.tool.array}}. Wähle die Formen aus, die vervielfältigt werden sollen, und klicke im Menüband darauf.

![Das Muster im Modus „Kreis“: Die Kopien erscheinen zuerst als Vorschau.](shot:pattern-tool)

- **{{ui:array.mode.row}}:** Die Auswahl wird mit gleichem Abstand wiederholt. Wähle die Richtung (X, Y oder Höhe) und den {{ui:array.spacing}}. Ein negativer Abstand legt die Reihe in die andere Richtung.
- **{{ui:array.mode.circle}}:** Die Auswahl wird um einen Mittelpunkt verteilt. Wie viele Kopien es gibt, stellst du bei {{ui:array.count}} ein, der {{ui:array.angle}} ist für einen vollen Kreis 360°. Stelle ein, ob sich die Kopien mitdrehen sollen.

Tipp: Setze vorher mit {{ui:editor.tool.rotationPivot}} den Drehpunkt auf eine Fläche, dann liegt der Mittelpunkt des Kreises genau dort.

Die Kopien erscheinen zuerst als Vorschau. Erst {{ui:array.apply}} legt sie an. Sind die Kopien Aussparungen, gruppierst du sie danach mit dem Körper, in den sie schneiden sollen.

## Rückgängig machen

{{ui:editor.tool.undo}} ([[Strg]]+[[Z]]) und {{ui:editor.tool.redo}} ([[Strg]]+[[Umschalt]]+[[Z]] oder [[Strg]]+[[Y]]) gehen Schritt für Schritt durch deinen Verlauf. Wie viele Schritte mit dem gespeicherten Entwurf mitreisen, stellst du in den Einstellungen unter {{ui:workspace.history}} ein.
