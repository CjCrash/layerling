---
title: Gewinde, Zahnräder und andere Bauteile
summary: Schrauben, Muttern und Gewindelöcher, die zusammenpassen, dazu Zahnrad, Feder, gebogenes Rohr, Wabengitter und Schwalbenschwanz.
---

Die Formenbibliothek enthält neben den Grundformen einige Bauteile, die man sonst mühsam zusammensetzen müsste. Alle lassen sich nachträglich in ihren Einstellungen ändern.

## Gewinde

Wähle {{ui:shape.thread}} in der Formenbibliothek. Unter {{ui:inspector.threadRole}} entscheidest du, was es sein soll:

- **{{ui:thread.rod}}:** ein Zylinder mit Gewinde, zum Beispiel eine Schraube ohne Kopf.
- **{{ui:thread.screw}}:** mit Kopf. Die {{ui:inspector.threadHead}} wählst du aus: {{ui:thread.headCylinder}}, {{ui:thread.headCountersunk}} oder {{ui:thread.headHex}}.
- **{{ui:thread.nut}}:** die passende Mutter.
- **{{ui:thread.bore}}:** ein Gewindeloch. Es ist eine Aussparung. Ziehe es in ein Teil, gruppiere beides, und das Teil hat ein Innengewinde.

![Eine Schraube mit Zylinderkopf. Rechts stehen Art und Kopfform, weiter unten Größe, Steigung und Profil.](shot:thread-screw)

Die Größe suchst du bei {{ui:prop.threadSize}} aus einer Liste: metrisch von M2 bis M12, dazu die Zollgrößen UNC und UNF von Nr. 4 bis 1 Zoll. Wählst du {{ui:thread.customSize}}, bestimmst du {{ui:prop.diameter}} und {{ui:prop.pitch}} selbst. Bei einer Zollgröße fragt das Feld nach {{ui:prop.threadsPerInch}} statt nach der Steigung in Millimetern.

Weitere Einstellungen:

- **{{ui:prop.threadHand}}:** {{ui:thread.right}} oder {{ui:thread.left}}.
- **{{ui:prop.threadProfile}}:** {{ui:thread.profileV}} ist das genormte Profil. {{ui:thread.profileTrapezoidal}} und {{ui:thread.profileRound}} haben flache Spitzen und Täler. Das druckt sich meist zuverlässiger, weil keine dünnen Spitzen entstehen.
- **{{ui:prop.clearance}}:** Bei Mutter und Gewindeloch der Spielraum, der dafür sorgt, dass ein gedrucktes Paar sich wirklich dreht. Je gröber dein Drucker arbeitet, desto mehr Spiel braucht das Paar.
- **{{ui:prop.chamfer}}, {{ui:prop.headChamfer}} und {{ui:prop.rimChamfer}}:** Fasen an den Enden, damit das Gewinde sauber anläuft und der Kopf keine scharfe Kante hat.
- **{{ui:prop.quality}}:** Wie fein das Gewinde berechnet wird. Höher ist genauer, aber langsamer.

Gedruckte Gewinde sind eine Sache für sich. Stelle die Pärchen aus Schraube und Mutter zuerst als Test her, bevor du ein großes Teil druckst, und passe das Spiel an deinen Drucker an.

## Zahnräder

{{ui:shape.gear}} gibt es als {{ui:gear.spur}}, {{ui:gear.helical}} und {{ui:gear.bevel}}. Du stellst die Zahl der {{ui:prop.teeth}}, die {{ui:prop.toothSize}}, die {{ui:prop.toothWidth}} und die {{ui:prop.centerHole}} ein. Beim Schrägrad kommt der {{ui:prop.helixAngle}} dazu. Zwei Räder, die ineinandergreifen sollen, brauchen dieselbe Zahngröße und Zahnbreite und den passenden Abstand zwischen ihren Mitten.

## Federn

Die {{ui:shape.spring}} hat {{ui:prop.turns}} und eine {{ui:prop.wire}}. Zusammen mit der Höhe bestimmen sie, wie weich die Feder wird.

## Gebogene Rohre

Ein {{ui:shape.bentTube}} besteht aus bis zu zwölf Abschnitten: ein gerades Stück, gefolgt von einer Biegung. Für jedes stellst du die {{ui:prop.bentTubeSegmentLength}}, den {{ui:prop.bentTubeBendAngle}}, den {{ui:prop.bentTubeBendRadius}} und den {{ui:prop.bentTubeRoll}} ein. Ein Rollwinkel von 0° biegt in der Ebene der Arbeitsfläche, bei 90° biegt das Rohr nach oben. Das Profil kann rund, quadratisch, sechs- oder achteckig sein, innen ebenso, oder ganz massiv. Läuft das Rohr in sich selbst, warnt dich layerling.

## Wabengitter

Das {{ui:shape.honeycomb}} ist eine Platte mit sechseckigen Aussparungen: leicht, stabil und schön anzusehen. Die {{ui:prop.honeycombCellSize}}, die {{ui:prop.honeycombWallThickness}} und die {{ui:prop.honeycombFrameWidth}} legen das Aussehen fest.

## Schwalbenschwanz

Der {{ui:shape.dovetail}} ist die Verbindung, bei der zwei Teile ineinander einrasten und sich nur seitlich zusammenschieben lassen. Du stellst die Breite am breiten Ende, die {{ui:prop.dovetailNeckWidth}} und die Länge des Zapfens ein. Kopiere den Zapfen für die Gegenseite und mache die Kopie zur Aussparung: {{ui:prop.dovetailClearance}} sorgt dann für ein wenig Spiel, damit die Verbindung nach dem Druck nicht klemmt.

> **Tipp:** Ein Gewindeloch schneidet sich beim Gruppieren in das Teil, mit dem es sich überlappt. Setze es also ein Stück in das Material hinein und lasse es nicht nur an der Fläche anliegen.
