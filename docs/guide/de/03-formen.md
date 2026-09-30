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
