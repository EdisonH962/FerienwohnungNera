# Website-Vorlage — Anleitung

Damit erstellst du in ca. 2 Stunden eine fertige Kundenwebsite.

---

## Was drin ist

| Datei | Wozu |
|---|---|
| `vorlage.html` | Die Vorlage mit Platzhaltern — **nicht direkt bearbeiten** |
| `kunde-beispiel.json` | Beispiel-Konfiguration (HOTI BAU) |
| `neue-seite.py` | Erzeugt aus Vorlage + Konfiguration die fertige Seite |
| `assets/` | Hintergrundvideos, Schriften |

---

## Ablauf für einen neuen Kunden

### 1. Google Place ID des Kunden finden

Auf https://developers.google.com/maps/documentation/places/web-service/place-id
den Firmennamen eingeben → die ID beginnt mit `ChIJ...`

Wenn der Kunde **kein** Google-Profil hat: Feld leer lassen. Dann zeigt die
Seite keine Bewertungen und keine Google-Fotos — alles andere funktioniert.

### 2. Konfiguration anlegen

```
cp kunde-beispiel.json kunde-mustermann.json
```

Datei öffnen und ausfüllen:

| Feld | Beispiel | Hinweis |
|---|---|---|
| `ordner` | `mustermann` | Name des Ausgabeordners |
| `FIRMA_KURZ` | `MUSTER BAU` | Für Logo, Titel, Kurznennung |
| `FIRMA_LOADER` | `MUSTER <em>BAU</em>` | Ladebildschirm — `<em>` = farbig |
| `FIRMA_LANG` | `Mustermann Bedachungen GmbH` | Offizieller Name |
| `INHABER` | `Max Mustermann` | Fürs Impressum |
| `GRUENDUNG` | `2004` | Erscheint als „seit 2004" |
| `TEL_ANZEIGE` | `06051 123456` | Wie es dasteht |
| `TEL_INTL` | `4960511 23456` | Ohne + und ohne führende 0, für Anruf-/WhatsApp-Links |
| `EMAIL` | `info@muster.de` | |
| `STRASSE` / `PLZ_ORT` | | Fürs Impressum und die Karte |
| `DOMAIN` | `muster-bau.de` | Ohne https:// |
| `USTID` | `DE123456789` | Falls keine da: Feld auf `—` setzen |
| `GOOGLE_PLACE_ID` | `ChIJ...` | Siehe Schritt 1 |
| `GOOGLE_API_KEY` | `AIza...` | Eigener Schlüssel, siehe unten |
| `INHABER_KENNUNG` | `muster` | **Wichtig:** Wortteil aus dem Google-Profilnamen. Damit erkennt die Seite, welche Fotos vom Kunden selbst stammen |
| `LOGO_URL` | | Logo hochladen, URL eintragen |
| `FARBE_HAUPT` | `#C0392B` | Markenfarbe des Kunden |
| `FARBE_DUNKEL` / `FARBE_HELL` | | Dunklere / hellere Variante davon |

### 3. Seite erzeugen

```
python3 neue-seite.py kunde-mustermann.json
```

Fertig im Ordner `../mustermann/`.

### 4. Texte anpassen

Das ist der eigentliche Arbeitsschritt. In der erzeugten `index.html` anpassen:

- **Hero-Überschrift** — der stärkste Satz der Seite
- **Leistungen** — die Kacheln mit den Gewerken
- **Ablauf** — die Schritte bis zum Auftrag
- **Über uns**
- **FAQ** — die Fragen, die der Kunde am Telefon ständig hört
- **Einzugsgebiet** — Ortsnamen austauschen (wichtig für Google!)

Tipp: Diese Texte mit Claude schreiben lassen — Branche und Ort nennen,
dann kommen sie passend.

### 5. Prüfen und hochladen

- Auf dem Handy testen (wichtiger als Desktop!)
- Impressum und Datenschutz durchlesen
- Ordner als ZIP → bei Netlify hochladen

### 6. Google-Schlüssel absichern

In der Google Cloud Console beim API-Schlüssel die neue Domain eintragen:
`https://kundendomain.de/*` und `https://www.kundendomain.de/*`

**Ohne diesen Schritt funktionieren die Bewertungen auf der neuen Domain nicht.**

---

## Wichtige Hinweise

**Rechtliches**
Impressum und Datenschutz sind vorbereitet, aber **der Kunde haftet dafür**.
Immer vom Kunden prüfen lassen und das schriftlich festhalten.

**Domain und Hosting**
Immer auf den Namen des Kunden anmelden, nie auf den eigenen. Sonst gibt es
Ärger, wenn die Zusammenarbeit endet.

**Ein Schlüssel oder mehrere?**
Ein Google-Schlüssel kann mehrere Domains bedienen — einfach alle Kundendomains
in der Beschränkung eintragen. Sauberer ist pro Kunde ein eigenes Cloud-Projekt,
dann sieht man die Kosten getrennt.

**Die Videos**
Die Hintergrundvideos in `assets/` sind neutral (Bauarbeiten, Natur) und passen
für Handwerksbetriebe. Für andere Branchen austauschen — Dateinamen beibehalten,
dann muss im Code nichts geändert werden.
