---
title: Text und gebogene Schrift
summary: Beschriftungen erhaben oder vertieft, mit sieben Schriftarten – und auf Wunsch entlang eines Kreisbogens, etwa auf einer Münze, einem Deckel oder einem Ring.
---

## Text hinzufügen

Wähle in der Formenbibliothek {{ui:shape.text}} und setze ihn ab. Im Feld {{ui:prop.text}} rechts tippst du, was da stehen soll. Die Einstellungen darunter:

- **{{ui:prop.font}}:** Sieben Schriftarten stehen bereit: Multilanguage, Sans, Serif, Script, Monospace, Rounded und Stencil (Buchstaben aus geraden Linien). Neuer Text beginnt in Sans. Umlaute, ß und € gibt es in jeder Schrift.
- **{{ui:prop.height}}:** Wie hoch die Schrift aus der Fläche ragt.
- **{{ui:prop.bevel}}:** Rundet die Buchstabenkanten ab, damit sie weicher wirken. Mit {{ui:prop.segments}} bestimmst du, in wie vielen Stufen.
- **Größe:** Länge und Breite der Zeile stellst du wie bei jeder Form ein. Zieh an den Griffen oder tippe die Maße ein.

Ein Text ist zunächst ein einzelner Körper. Willst du die Buchstaben einzeln behandeln, klicke auf {{ui:inspector.separateParts}}. Dann ist jeder Buchstabe eine eigene Form.

Auch die Kanten einer Schrift lassen sich fasen oder verrunden, gerade oder gebogen, siehe [Kanten brechen und Körper aushöhlen](chapter:kanten-und-aushoehlen). Nimm dafür kleine Maße wie 0,2 bis 0,5 mm, denn die Striche der Buchstaben sind schmal.

## Erhaben oder vertieft

- **Erhaben:** Setze den Text auf die Fläche und gruppiere ihn mit dem Körper. Er wächst als Relief heraus.
- **Vertieft:** Schalte den Text auf {{ui:inspector.hole}}, lasse ihn ein Stück in die Fläche ragen und gruppiere ihn mit dem Körper. Die Buchstaben sind dann eingraviert.

Für Beschriftungen auf einer Seitenfläche legst du vorher die Arbeitsebene auf diese Fläche, siehe [Ansicht und Arbeitsebene](chapter:ansicht-und-arbeitsebene).

## Text auf dem Kreisbogen

Soll die Beschriftung nicht gerade laufen, sondern dem Rand einer Münze, eines Deckels oder eines Rings folgen? Dafür gibt es die Einstellung {{ui:prop.textCurved}}.

![Ein Text folgt einem Kreis. Die Buchstaben stehen alle auf einer gemeinsamen Linie.](shot:curved-text)

Sobald du sie einschaltest, läuft der Text am Kreis entlang. Alle Buchstaben stehen auf derselben Grundlinie, so gleichmäßig wie bei normalem Text. Dazu gibt es vier Einstellungen:

- **{{ui:prop.textRadius}}** (5 bis 500 mm): Der Radius des Kreises, auf dem die Grundlinie der Buchstaben läuft.
- **{{ui:prop.textSize}}:** Wie hoch die Buchstaben sind. Sie hängt nicht mehr an der Breite der Form.
- **{{ui:prop.textInward}}:** Schaltet den Text von der Oberseite des Kreises auf die Unterseite. Die Buchstaben zeigen dann mit dem Kopf zur Mitte.
- **{{ui:prop.textFlipped}}:** Dreht nur die Buchstaben um, damit du sie von der anderen Seite lesen kannst. Der Text bleibt dabei an seiner Stelle auf dem Kreis.

**Die Mitte des Kreises ist die Mitte der Form.** Deshalb geht das Ausrichten wie gewohnt: Wenn du den Text mit einem Zylinder oder Ring mittig ausrichtest, sitzt er genau konzentrisch darauf. Ziehst du an einem Griff, wachsen Radius und Schriftgröße gemeinsam mit, sodass die Schrift nicht verzerrt wird.

> **Tipp:** Oben am Kreis stehen die Buchstaben außerhalb der Grundlinie, mit {{ui:prop.textInward}} innerhalb, mit den Köpfen zur Mitte. Damit die Schrift auf eine Scheibe passt, sollte der Radius plus die Schriftgröße kleiner sein als der Radius der Scheibe.
