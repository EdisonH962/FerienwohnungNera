#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Neue Kundenwebsite aus der 3D-Vorlage erzeugen
===============================================

Aufruf:
    python3 neue-seite-3d.py kunde-mustermann.json

Ergebnis:
    Ein fertiger Ordner mit index.html + assets, bereit zum Hochladen.

Unterschied zur einfachen Vorlage:
    Diese Version hat einen 3D-Einstieg (WebGL). Welches Objekt sich dreht,
    steuert das Feld "OBJEKT_3D" in der JSON-Datei.
"""
import json
import os
import re
import shutil
import sys
import urllib.parse

HIER = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HIER, "assets")

OBJEKTE = {
    "schluessel": "Schlüssel – Ferienwohnung, Immobilien, Hausverwaltung, Hotel",
    "mauer":      "Natursteinmauer – GaLaBau, Pflasterarbeiten, Maurer, Tiefbau",
    "zahnrad":    "Zahnrad – Metallbau, Schlosserei, KFZ, Maschinenbau",
    "baum":       "Baum – Gartenpflege, Baumpflege, Baumfällung, Gärtnerei",
    "fassade":    "Hausfassade – Fassadenreinigung, Maler, Gerüstbau, Gebäudereinigung",
    "drohne":     "Reinigungsdrohne über Fassade – Drohnenreinigung, Gebäude-/Dachreinigung",
    "malerrolle": "Farbrolle an der Wand – Maler, Lackierer, Trockenbau, Renovierung",
}


def hex_zu_rgb01(hexfarbe):
    """#72B846 -> [.447, .722, .275]  (fuer WebGL, 0 bis 1)"""
    h = hexfarbe.lstrip("#")
    return [round(int(h[i:i + 2], 16) / 255.0, 3) for i in (0, 2, 4)]


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        print("Verfuegbare 3D-Objekte:")
        for k, v in OBJEKTE.items():
            print("    %-12s %s" % (k, v))
        sys.exit(1)

    with open(sys.argv[1], encoding="utf-8") as f:
        k = json.load(f)

    objekt = k.get("OBJEKT_3D", "schluessel")
    if objekt not in OBJEKTE:
        print("FEHLER - unbekanntes 3D-Objekt: %s" % objekt)
        print("Moeglich sind: %s" % ", ".join(OBJEKTE))
        sys.exit(1)

    # Ausgabeordner vorbereiten
    ziel = os.path.abspath(os.path.join(HIER, "..", k.get("ordner", "neue-seite-3d")))
    if os.path.isdir(ziel):
        shutil.rmtree(ziel)
    shutil.copytree(ASSETS, os.path.join(ziel, "assets"))

    # Nicht gewaehlte 3D-Objekte aus der Ausgabe entfernen
    for name in OBJEKTE:
        if name != objekt:
            weg = os.path.join(ziel, "assets", "objekt-%s.js" % name)
            if os.path.isfile(weg):
                os.remove(weg)

    with open(os.path.join(HIER, "index.html"), encoding="utf-8") as f:
        html = f.read()

    # Gewaehltes 3D-Objekt vor der Szene einbinden
    html = html.replace(
        '<script src="assets/site-3d.js"',
        '<script src="assets/objekt-%s.js"></script>\n<script src="assets/site-3d.js"' % objekt,
        1,
    )

    # Platzhalter ersetzen (in HTML und in allen JS/CSS-Dateien)
    werte = {s: v for s, v in k.items()
             if not s.startswith("_") and s not in ("ordner", "OBJEKT_3D")}

    def fuellen(text):
        for schluessel, wert in werte.items():
            text = text.replace("{{%s}}" % schluessel, str(wert))
        return text

    html = fuellen(html)
    with open(os.path.join(ziel, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    offen = set(re.findall(r"\{\{[A-Z_]+\}\}", html))
    for wurzel, _, dateien in os.walk(os.path.join(ziel, "assets")):
        for name in dateien:
            if not name.endswith((".js", ".css")):
                continue
            pfad = os.path.join(wurzel, name)
            with open(pfad, encoding="utf-8") as f:
                inhalt = f.read()
            neu = fuellen(inhalt)
            if neu != inhalt:
                with open(pfad, "w", encoding="utf-8") as f:
                    f.write(neu)
            offen |= set(re.findall(r"\{\{[A-Z_]+\}\}", neu))

    if offen:
        print("FEHLER - diese Werte fehlen in der JSON-Datei:")
        for o in sorted(offen):
            print("   ", o)
        sys.exit(1)

    # Markenfarbe ins 3D-Objekt uebernehmen, falls gewuenscht
    if k.get("FARBE_3D_UEBERNEHMEN"):
        pfad = os.path.join(ziel, "assets", "objekt-%s.js" % objekt)
        with open(pfad, encoding="utf-8") as f:
            inhalt = f.read()
        neu = re.sub(r"haupt:\s*\[[^\]]+\]", "haupt:  %s" % hex_zu_rgb01(k["FARBE_HAUPT"]), inhalt, count=1)
        neu = re.sub(r"hell:\s*\[[^\]]+\]", "hell:   %s" % hex_zu_rgb01(k["FARBE_HELL"]), neu, count=1)
        with open(pfad, "w", encoding="utf-8") as f:
            f.write(neu)

    print("Fertig:", os.path.join(ziel, "index.html"))
    print("3D-Objekt:", OBJEKTE[objekt])
    print()
    print("Noch zu tun:")
    print("  1. Texte im index.html an die Branche anpassen")
    print("  2. Eigene Fotos nach assets/img/ legen")
    print("  3. Ordner als ZIP packen und hochladen")
    print("  4. Google-API-Key auf die neue Domain einschraenken")


if __name__ == "__main__":
    main()
