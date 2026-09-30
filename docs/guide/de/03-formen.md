---
title: Formen setzen und einstellen
summary: Die Formenbibliothek, Maße per Zahl und per Griff, Farbe, Drehen, Verjüngen und Verdrehen.
---

Jedes Teil in layerling beginnt mit einer Form. Aus ihnen baust du alles Weitere: Formen ergänzen einander, schneiden einander aus oder werden zu einer neuen Form verbunden.

## Eine Form hinzufügen

Klicke im Menüband auf {{ui:editor.addShape}}. Es öffnet sich die Formenbibliothek.

![Die Formenbibliothek. Jedes Bildchen ist aus der echten Geometrie der Form gerendert.](shot:shape-menu)

Wähle eine Form aus. Sie hängt jetzt am Mauszeiger und landet dort, wo du klickst. Drückst du [[Esc]], wird das Absetzen abgebrochen. Wer die Form lieber direkt in der Mitte der Platte haben möchte, kann das Absetzen per Klick in den Einstellungen abschalten (Bereich {{ui:workspace.appearance}}, Schalter {{ui:workspace.cruise}}).

Was die Bibliothek bietet:

- **Grundformen:** {{ui:shape.box}}, {{ui:shape.roundedBox}}, {{ui:shape.cylinder}}, {{ui:shape.slot}}, {{ui:shape.ellipse}}, {{ui:shape.polygon}} (drei bis vierundzwanzig Seiten), {{ui:shape.sphere}}, {{ui:shape.cone}}, {{ui:shape.pyramid}}, {{ui:shape.wedge}}, {{ui:shape.roundRoof}}, {{ui:shape.halfSphere}} und {{ui:shape.torus}}.
- **Rohre:** {{ui:shape.tube}} und {{ui:shape.bentTube}} aus bis zu zwölf geraden Stücken mit Biegungen dazwischen.
- **Zierformen:** {{ui:shape.star}}, {{ui:shape.heart}} und {{ui:shape.crescent}}.
- **Beschriftung:** {{ui:shape.text}}, auch auf einem Kreisbogen. Mehr im Kapitel [Text](chapter:text).
- **Mechanik:** {{ui:shape.thread}} (Gewindestange, Schraube, Mutter und Gewindeloch), {{ui:shape.spring}} und {{ui:shape.gear}}. Mehr im Kapitel [Gewinde und Mechanik](chapter:gewinde-und-mechanik).
- **Für Konstruktionen:** {{ui:shape.honeycomb}}, {{ui:shape.dovetail}}, die {{ui:shape.teardrop}} für waagerechte Löcher, die {{ui:shape.counterbore}} und {{ui:shape.countersink}} für Schraubenköpfe und das {{ui:shape.ruler}}, das nur ein Messwerkzeug ist und in keinem Export auftaucht.

## Die Einstellungen der Form

Sobald eine Form ausgewählt ist, erscheinen rechts ihre Einstellungen. Ganz oben steht der Name. Daneben schließt das Schloss die Form gegen versehentliches Verschieben ab, und das Auge blendet sie aus.

![Die Einstellungen eines Zylinders: Körper oder Aussparung, Durchmesser und Höhe als Zahl und als Schieber.](shot:editor-overview)

- **{{ui:inspector.solid}} oder {{ui:inspector.hole}}:** Ein Körper bleibt stehen, eine Aussparung nimmt Material weg. Mehr im Kapitel [Körper und Aussparungen](chapter:koerper-und-aussparungen).
- **{{ui:inspector.transparent}}:** Damit siehst du durch den Körper hindurch, zum Beispiel um eine Form dahinter zu erkennen.
- **{{ui:inspector.properties}}:** Die Maße und alles, was zu dieser Form gehört. Beim Zylinder etwa der Durchmesser, die Höhe und die Zahl der Seiten. Bei einem Zahnrad die Zähne, bei einer Feder die Windungen.
- **Lage und Drehung** weiter unten im Bereich.
- **{{ui:inspector.taper}}:** Oben und unten unterschiedlich groß, zum Beispiel für eine Schräge oder einen Trichter.
- **{{ui:inspector.twist}}:** Verdreht die Oberseite gegen die Unterseite oder schiebt sie zur Seite. So entstehen gedrehte Säulen und geneigte Türme.

Tippen ist genauer als Ziehen. Alle Zahlenfelder nehmen Millimeter, aber auch Prozent: Wer bei einer Breite von 40 mm „50 %“ eintippt, bekommt 20 mm.

## Wie rund ist rund? Die Seitenzahl

Runde Formen wie Zylinder, Kegel, Rohr, Ellipse oder die Bohrungen haben in den Eigenschaften den Schalter {{ui:prop.sidesFollowSize}} und den Regler {{ui:prop.sides}}. Der Hintergrund: Für die Anzeige und für STL, 3MF und OBJ zeichnet layerling einen Kreis als Vieleck aus vielen kleinen Seiten. Je mehr Seiten, desto glatter, aber desto mehr Dreiecke.

**Wo die Seitenzahl wichtig ist**

- **Beim Export für den Slicer** (STL, 3MF, OBJ). Ein Zylinder mit wenigen Seiten kommt dort als Vieleck an.
- **Beim Zusammenrechnen von Körpern und Aussparungen.** Eine Bohrung, die aus einer Aussparung mit wenigen Seiten geschnitten wird, ist im fertigen Teil eckig. Das gilt auch für Schraubenlöcher.
- **In der Anzeige.** Viele sehr feine Formen machen den Editor langsamer.

**Wo sie keine Rolle spielt**

- **Bei Fasen und Verrundungen** ({{ui:editor.tool.chamfer}}, {{ui:editor.tool.fillet}}) und **beim STEP-Export.** Beides arbeitet mit der exakten runden Form, nicht mit dem Vieleck. Das gilt für die meisten runden Formen. Gewinde, Feder und gebogenes Rohr sind noch Dreiecksnetze, dort zählt die Feinheit auch für die Kantenbearbeitung.

**Wie du es einsetzt**

- **Lass {{ui:prop.sidesFollowSize}} eingeschaltet.** Dann wählt layerling die Seitenzahl nach dem Durchmesser, so dass das Vieleck höchstens 0,005 mm vom echten Kreis abweicht, weit unter dem, was ein Drucker auflöst. Kleine Formen bekommen mindestens 24 Seiten, große mehr.
- **Weniger Seiten** nimmst du, wenn du absichtlich ein Vieleck willst (aber dafür gibt es den {{ui:shape.polygon}}) oder wenn der Editor mit sehr vielen runden Formen träge wird.
- **Mehr Seiten** brauchst du fast nie. Nur bei sehr großen runden Teilen, wenn du im STL Kanten siehst.
- **Für Teile, die du nur mit Kanten bearbeitest oder als STEP weitergibst,** ist die Seitenzahl egal.

## Mit den Griffen arbeiten

Neben den Einstellungen gibt es Griffe an der Form selbst:

- Die **Ecken und Kanten** ziehen die Form größer oder kleiner.
- Der **Pfeil oben** ändert die Höhe, der Griff **in der Mitte** hebt die Form an oder senkt sie.
- Die **gebogenen Pfeile** drehen sie.
- An den **Zahlen** neben der Form siehst du die Maße. Ein Klick darauf öffnet ein Feld, in das du die gewünschte Zahl tippst.

Ohne Maus geht es mit der Tastatur: Die Pfeiltasten schieben die Auswahl um einen Rasterschritt, mit [[Umschalt]] um fünf. [[Strg]]+[[↑]] und [[Strg]]+[[↓]] heben und senken sie. [[R]] dreht um 45°, [[Umschalt]]+[[R]] um 22,5°. [[D]] setzt die Auswahl auf die Arbeitsebene ab.

Der Rasterschritt steht unten rechts im Editor und lässt sich jederzeit ändern.

## Kopieren und duplizieren

{{ui:editor.tool.copy}}, {{ui:editor.tool.paste}} und {{ui:editor.tool.duplicate}} liegen im Menüband ({{ui:editor.group.clipboard}}). Mit [[Strg]]+[[D]] duplizierst du eine Auswahl. layerling merkt sich dabei, wie du die Kopie zuletzt verschoben oder gedreht hast, und wendet dasselbe beim nächsten Duplizieren wieder an. So entsteht eine Reihe von Löchern oder Stufen mit ein paar Tastendrücken. Für regelmäßige Anordnungen gibt es außerdem das Muster, das im Kapitel [Auswählen und Anordnen](chapter:auswaehlen-und-anordnen) beschrieben ist.

> **Tipp:** Wenn eine Form nicht die gewünschte Größe annimmt, liegt das oft an den Grenzen für neue Formen. Unter {{ui:workspace.shapeDefaults}} in den Einstellungen legst du fest, wie jede Form beginnt und wie groß sie höchstens werden darf.
