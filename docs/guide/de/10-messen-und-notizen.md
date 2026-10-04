---
title: Messen und Notizen
summary: Maßband, Lineal und Winkellineal, Abstände zum Nullpunkt – und Notizen, die an einem Teil hängen.
---

Wer ein Teil genau bauen will, muss messen können. layerling hat dafür mehrere Werkzeuge. Keines davon landet in einem Export. Wandstärken und Spalte im Inneren misst du am besten in der [Schnittansicht](chapter:ansicht-und-arbeitsebene) mit {{ui:camera.sectionMeasure}}.

## Das Maßband

Das Maßband liegt am unteren Ende der Kameraleiste am linken Rand ({{ui:camera.tapeTools}}). Es misst Abstände zwischen Ecken, Kanten und Flächen. Ein Klick darauf öffnet drei Schaltflächen. Verdecken sie, was du messen willst, ziehst du sie am Griff links frei über die Arbeitsfläche; ein Doppelklick auf den Griff bringt sie zurück:

![Das Maßband mit seinen drei Schaltflächen: Maß hinzufügen, Messpunkte verschieben, Maß entfernen.](shot:tape-menu)

1. **{{ui:camera.addMeasurement}}:** Klicke einen Punkt an, ziehe zum nächsten und klicke ihn an. Die Strecke wird beschriftet.
2. **{{ui:camera.moveMeasurement}}:** Fasse die Punkte an und schiebe sie, die Zahl folgt.
3. **{{ui:camera.deleteMeasurement}}:** Danach klickst du ein Maß an, um es zu entfernen.

Mit [[Esc]] verlässt du den Messmodus.

## Das Lineal

Aus der Formenbibliothek holst du das {{ui:shape.ruler}}. Es ist ein reines Messwerkzeug: Es erscheint in keinem Export und lässt sich weder gruppieren noch verschneiden. Für jeden Körper, der das Lineal berührt oder überlappt, zeigt es die Ausdehnung als schwebende Zahl direkt in der Ansicht. Diese Zahl kannst du direkt dort ändern, und der Körper passt sich an. Über das schwebende Plus-Symbol legst du eine Kopie der gemessenen Form an.

## Das Winkellineal

Manchmal misst du besser an einem rechten Winkel. Klicke in der Kameraleiste auf {{ui:camera.cornerRulerTool}} und dann auf die Arbeitsfläche. Dort legt sich ein Winkellineal mit zwei Armen im rechten Winkel ab, mit Teilstrichen, wie ein Anschlagwinkel. Auch das hat keinen eigenen Körper.

- **Am Griff ziehen** verschiebt es.
- **Ein kurzer Klick auf den Griff** dreht es um 90°.
- **Das ×** daneben entfernt es.

Stehen Körper an einem der Arme, zeigt das Winkellineal automatisch deren Maße an.

Markierst du einen Körper, zeigt das Winkellineal in Grün, wie weit er von der Ecke entfernt ist, entlang beider Arme und in der Höhe. Ein Klick auf eine grüne Zahl öffnet ein Eingabefeld: Tippe den gewünschten Abstand ein, und der Körper rückt genau dorthin. Sind mehrere Körper markiert, zählen sie zusammen wie einer. Gemessen wird ihr gemeinsamer Umriss, und ein eingetippter Wert verschiebt alle gemeinsam, ohne dass sich ihre Lage zueinander ändert.

## Abstände zum Nullpunkt und beim Verschieben

In den Einstellungen unter {{ui:workspace.appearance}} gibt es zwei Schalter für laufende Maße:

- {{ui:workspace.showMoveDimensions}} zeigt beim Verschieben, um wie viel du dich bewegst.
- {{ui:workspace.showOriginDimensions}} zeigt die Abstände der Auswahl zum Nullpunkt der Platte, auch bei mehreren markierten Körpern.

Mit {{ui:workspace.dimensionsAlwaysVisible}} bleiben die Maße dauerhaft sichtbar.

## Notizen

Eine Notiz hält fest, was die Geometrie nicht sagt: „Hier ist eine Schraube 0,3 mm zu eng“, „Deckel noch drucken“, „Maß von Peter“. Setze sie mit {{ui:editor.tool.note}} oder der Taste [[N]].

- Setzt du die Notiz **auf einen Körper**, wandert sie mit ihm.
- Setzt du sie **daneben**, bleibt sie auf der Arbeitsebene ({{ui:note.free}}).
- {{ui:note.detach}} löst eine angeheftete Notiz vom Körper.
- Ziehen verschiebt die Notiz, ein Klick öffnet sie zum Bearbeiten.

Notizen werden im Entwurf gespeichert, tauchen in keinem Export auf und lassen sich über {{ui:visibility.notes}} ein- und ausblenden.
