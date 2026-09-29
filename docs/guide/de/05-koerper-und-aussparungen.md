---
title: Körper und Aussparungen
summary: Wie aus einfachen Formen Bohrungen, Nuten und Taschen werden – und wie du eine Gruppe später noch einmal ändern kannst.
---

Das ist die wichtigste Idee in layerling, und sie ist schnell gelernt: **Jede Form ist entweder ein Körper oder eine Aussparung.** Ein Körper bleibt stehen. Eine Aussparung ist ein Werkzeug, das Material wegnimmt.

## Körper oder Aussparung

Wähle eine Form aus und klicke in ihren Einstellungen auf {{ui:inspector.solid}} oder {{ui:inspector.hole}}. Schneller geht es mit der Tastatur: [[H]] macht die Auswahl zur Aussparung, [[S]] wieder zum Körper. Eine Aussparung erscheint durchscheinend, damit du siehst, wo sie sitzt.

Solange nichts gruppiert ist, passiert mit einer Aussparung nichts. Sie liegt nur da und zeigt, wo später etwas wegfallen soll.

![Der Zylinder ist eine Aussparung. Er ragt oben aus dem Würfel heraus, damit er ihn ganz durchschneidet.](shot:hole-before)

## Gruppieren

Markiere Körper und Aussparung(en) und klicke auf {{ui:editor.tool.group}} ([[Strg]]+[[G]]). Jetzt nehmen die Aussparungen das Material aus den Körpern, die sie berühren. Übrig bleibt eine einzige neue Form.

![Das Ergebnis: ein Würfel mit einer Bohrung.](shot:hole-after)

So entstehen:

- **Bohrungen:** ein Zylinder als Aussparung durch einen Körper.
- **Nuten:** ein länglicher Quader als Aussparung an der Kante.
- **Taschen:** eine Aussparung, die nicht ganz durchgeht.
- **Gewinde in einem Teil:** ein Gewindeloch als Aussparung, siehe [Gewinde und Mechanik](chapter:gewinde-und-mechanik).

Sind mehrere Körper in der Gruppe, werden sie verbunden. Zwei sich berührende Körper werden also ein einziges Teil.

Eine Gruppe darfst du weiter behandeln wie eine Form: verschieben, drehen, einfärben, wieder gruppieren. Mit {{ui:editor.tool.ungroup}} ([[Strg]]+[[Umschalt]]+[[G]]) löst du sie auf, und die Einzelteile sind wieder da.

### Eine Gruppe zur Aussparung machen

Auch eine ganze Gruppe kann ein Körper oder eine Aussparung sein. Dabei gilt eine einfache Regel:

- Besteht die Gruppe nur aus Körpern (oder nur aus Aussparungen), schaltest du sie als Ganzes um, und ihre Teile gehen mit.
- Enthält sie beides, etwa einen Würfel mit Bohrung, behält jedes Teil seinen eigenen Zustand. Die ganze Gruppe wird dann zum Werkzeug, aber die Bohrung bleibt eine Bohrung.

## Schnittmenge

{{ui:editor.tool.intersect}} behält nur das, was zwei oder mehr Körper gemeinsam haben. Lege zwei überlappende Formen übereinander, markiere beide und klicke darauf. So entsteht zum Beispiel aus einem Zylinder und einem Quader ein Stück mit runder und gerader Seite.

## Eine Gruppe öffnen und ändern

Ist eine Bohrung zu klein geraten, musst du die Gruppe nicht auflösen und neu bauen. Wähle die Gruppe aus und klicke in ihren Einstellungen auf {{ui:group.open}} oder in der Objektliste auf das Ordnersymbol. Die Teile liegen jetzt einzeln da, und du änderst sie mit allen Werkzeugen: ein Loch größer machen, einen Körper verschieben, eine Aussparung hinzufügen.

![Die geöffnete Gruppe: Unten steht der Balken mit Abbrechen und Fertig, die Objektliste zeigt die Teile.](shot:open-group)

Unten im Bild erscheint ein Balken. {{ui:group.done}} rechnet die Gruppe neu, mit ihrem Namen, ihrer Farbe und ihrem Zustand als Körper oder Aussparung. {{ui:common.cancel}} holt sie unverändert zurück. Solange die Gruppe offen ist, kannst du keine zweite öffnen.

Ein Hinweis: Fasen und Verrundungen, die du auf die **ganze** Gruppe gelegt hattest, gehen beim Neuberechnen verloren. Darauf weist der Balken hin.

## Teile trennen

Besteht eine Form aus mehreren voneinander getrennten Stücken, etwa ein Text aus einzelnen Buchstaben, kannst du sie mit {{ui:inspector.separateParts}} in eigenständige Formen zerlegen.

> **Tipp:** Baue Löcher immer etwas länger als das Teil, das sie durchdringen sollen. Schließt die Aussparung genau mit der Fläche ab, bleibt manchmal eine hauchdünne Haut stehen. Ein Millimeter Überstand schafft Sicherheit.
