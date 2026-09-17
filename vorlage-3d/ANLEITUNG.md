# 3D-Vorlage — Anleitung

Die gehobene Variante: Der Einstieg ist eine echte 3D-Szene (WebGL), in der sich
ein Objekt dreht, während die Kamera beim Scrollen durch Raumrahmen fährt.
Ohne fremde 3D-Bibliotheken — Geometrie und Shader sind selbst gebaut.

Es gibt zwei Vorlagen:

| | `vorlage/` | `vorlage-3d/` (diese hier) |
|---|---|---|
| Einstieg | Video-Hintergrund | 3D-Szene mit Objekt |
| Dateien | eine index.html | modular (CSS/JS getrennt) |
| Preis-Argument | Standard | Premium |

---

## Das 3D-Objekt wählen

Das ist der eigentliche Trick dieser Vorlage: Das Objekt im Einstieg passt sich
der Branche an. In der JSON-Datei steuert `OBJEKT_3D`, welches geladen wird.

| Wert | Objekt | Passt für |
|---|---|---|
| `schluessel` | Goldener Schlüssel | Ferienwohnung, Ferienhaus, Immobilien, Hausverwaltung, Hotel |
| `mauer` | Natursteinmauer | Garten- und Landschaftsbau, Pflasterarbeiten, Maurer, Tiefbau |
| `zahnrad` | Zahnrad | Metallbau, Schlosserei, KFZ-Werkstatt, Maschinenbau |
| `baum` | Baum | Gartenpflege, Baumpflege, Baumfällung, Gärtnerei |

Das Skript kopiert nur das gewählte Objekt in die fertige Seite — die anderen
landen nicht beim Kunden.

### Markenfarbe ins 3D-Objekt übernehmen

`"FARBE_3D_UEBERNEHMEN": true` färbt das Objekt in der Markenfarbe des Kunden
statt in seiner Standardfarbe. Vorsicht: Bei der Mauer und beim Zahnrad wirken
die Naturfarben (Stein, Stahl) meist besser als eine Signalfarbe. Beim Schlüssel
funktioniert es gut.

---

## Ablauf für einen neuen Kunden

### 1. Konfiguration anlegen

```
cp kunde-beispiel.json kunde-mustermann.json
```

Ausfüllen — die Felder sind dieselben wie bei der einfachen Vorlage, plus:

| Feld | Bedeutung |
|---|---|
| `OBJEKT_3D` | Welches 3D-Objekt (siehe Tabelle oben) |
| `ORT` | Ortsname allein, z. B. `Gelnhausen` (erscheint in Überschriften) |
| `FARBE_3D_UEBERNEHMEN` | `true` oder `false` |

### 2. Seite erzeugen

```
python3 neue-seite-3d.py kunde-mustermann.json
```

Das Skript prüft selbst, ob alle Platzhalter gefüllt sind, und bricht mit einer
Liste ab, falls etwas fehlt.

### 3. Texte anpassen — der eigentliche Arbeitsschritt

Das Skript tauscht Name, Kontakt, Adresse und 3D-Objekt. Die **Texte** stammen
noch aus der Ferienwohnung und müssen ersetzt werden:

| Wo | Was |
|---|---|
| `index.html`, Hero | Die große Überschrift — der wichtigste Satz der Seite |
| Kapitelnamen | „Ankommen / Wohnen / Draußen" → zur Branche passend |
| Leistungen | Die Kacheln mit den Gewerken |
| Galerie | Bildunterschriften |
| FAQ | Die Fragen, die der Kunde am Telefon ständig hört |
| Footer | Impressum und Datenschutz prüfen |

Tipp: Diese Texte mit Claude schreiben lassen — Branche, Ort und Besonderheiten
nennen, dann kommen sie passend.

### 4. Fotos austauschen

Die Bilder liegen unter `assets/img/` (Originale) und `assets/enhanced/`
(aufgewertete Fassungen). Eigene Fotos mit denselben Dateinamen ablegen, dann
muss im Code nichts geändert werden.

### 5. Prüfen und hochladen

- **Auf dem Handy testen** — wichtiger als Desktop
- Prüfen, ob die 3D-Szene läuft. Bei fehlendem WebGL erscheint automatisch ein
  Standbild derselben Szene (`assets/site-3d-poster.webp`)
- Ordner als ZIP → hochladen
- Google-API-Key auf die neue Domain einschränken

---

## Ein eigenes 3D-Objekt bauen

Eine Objektdatei ist überschaubar. Kopiere `assets/objekt-baum.js` als Vorlage.

Verfügbare Grundformen:

```js
w.torus(radius, dicke)                        // Ring
w.sphere(radius)                              // Kugel
w.cylinder(radius, hoehe)                     // Zylinder
w.roundedBox(breite, hoehe, tiefe, rundung)   // Quader mit runden Kanten
```

Aufbau einer Objektdatei:

```js
window.SITE_3D_OBJEKT = {
  name: 'Mein Objekt',
  farben: {
    haupt:  [.9, .6, .2],   // [rot, gruen, blau], jeweils 0 bis 1
    hell:   [1, .8, .4],
    akzent: [.0, .4, .2]
  },
  bauen: function (w) {
    return {
      formen: { kopf: w.sphere(.5), stiel: w.cylinder(.1, 2) },
      teile: [
        // ['formname', x, y, z, drehX, drehY, drehZ, farbe]
        ['kopf',  0,  1, 0, 0, 0, 0, this.farben.haupt],
        ['stiel', 0, -.5, 0, 0, 0, 0, this.farben.hell]
      ]
    };
  }
};
```

**Wichtig für die Bildwirkung:** Die Kamera schaut von der Seite auf das Objekt.
Flach liegende Objekte werden dadurch fast von der Kante gesehen und sind schwer
zu erkennen. Baue **stehende, hohe Objekte** — etwa 3 bis 3,5 Einheiten hoch und
1 bis 1,5 breit. Deshalb ist der Pflasterbogen zur stehenden Mauer geworden.

Neues Objekt in `neue-seite-3d.py` in die Liste `OBJEKTE` eintragen, dann kann
es über die JSON-Datei gewählt werden.

---

## Technische Hinweise

- **Keine externen 3D-Bibliotheken.** Geometrie, Beleuchtung und Shader stecken
  in `assets/site-3d.js`. Dadurch lädt die Seite schnell und ist unabhängig.
- **Rücksicht auf Geräte:** maximal 30 Bilder pro Sekunde, geringere Auflösung
  auf kleinen Geräten, Rendering nur bei sichtbarem Einstieg.
- **Ohne WebGL oder bei abgeschalteten Animationen** erscheint ein Standbild.
  Alle Texte und Buchungswege bleiben erreichbar, auch ohne JavaScript.
- **Bewegung abschaltbar:** Die Seite hat einen eigenen Schalter dafür und
  respektiert die Systemeinstellung „Bewegung reduzieren".

---

## Rechtliches

Wie bei der einfachen Vorlage: Impressum und Datenschutz sind vorbereitet, aber
**der Kunde haftet dafür**. Immer prüfen lassen und schriftlich festhalten.
Domain und Hosting auf den Namen des Kunden anmelden.
