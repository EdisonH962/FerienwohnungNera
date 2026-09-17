#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Neue Kundenwebsite aus der Vorlage erzeugen
===========================================

Aufruf:
    python3 neue-seite.py kunde-mustermann.json

Ergebnis:
    Ein fertiger Ordner mit index.html + assets, bereit zum Hochladen bei Netlify.

Ablauf für einen neuen Kunden:
    1. kunde-beispiel.json kopieren -> kunde-NAME.json
    2. Werte eintragen (Firma, Telefon, Place ID, Farben ...)
    3. Dieses Skript ausführen
    4. Texte im erzeugten index.html an die Branche anpassen
"""
import json
import os
import re
import shutil
import sys
import urllib.parse

HIER = os.path.dirname(os.path.abspath(__file__))
VORLAGE = os.path.join(HIER, "vorlage.html")
ASSETS = os.path.join(HIER, "assets")


def hex_zu_rgb(hexfarbe):
    """#72B846 -> '114,184,70'"""
    h = hexfarbe.lstrip("#")
    return "%d,%d,%d" % (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    with open(sys.argv[1], encoding="utf-8") as f:
        k = json.load(f)

    # Abgeleitete Werte automatisch ergänzen
    k["FARBE_RGB"] = hex_zu_rgb(k["FARBE_HAUPT"])
    k["FIRMA_URLENC"] = urllib.parse.quote(
        "%s %s" % (k["FIRMA_LANG"], k["PLZ_ORT"].split(" ", 1)[-1])
    )
    k["ADRESSE_URLENC"] = urllib.parse.quote(
        "%s, %s, %s" % (k["FIRMA_LANG"], k["STRASSE"], k["PLZ_ORT"])
    )

    with open(VORLAGE, encoding="utf-8") as f:
        html = f.read()

    # Platzhalter ersetzen
    for schluessel, wert in k.items():
        if schluessel.startswith("_") or schluessel == "ordner":
            continue
        html = html.replace("{{%s}}" % schluessel, str(wert))

    # Kontrolle: ist noch ein Platzhalter übrig?
    offen = sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", html)))
    if offen:
        print("FEHLER - diese Werte fehlen in der JSON-Datei:")
        for o in offen:
            print("   ", o)
        sys.exit(1)

    # Ausgabeordner schreiben
    ziel = os.path.join(HIER, "..", k.get("ordner", "neue-seite"))
    ziel = os.path.abspath(ziel)
    os.makedirs(ziel, exist_ok=True)
    with open(os.path.join(ziel, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    if os.path.isdir(ASSETS):
        ziel_assets = os.path.join(ziel, "assets")
        if os.path.isdir(ziel_assets):
            shutil.rmtree(ziel_assets)
        shutil.copytree(ASSETS, ziel_assets)

    print("Fertig:", os.path.join(ziel, "index.html"))
    print()
    print("Noch zu tun:")
    print("  1. Texte im index.html an die Branche anpassen")
    print("     (Suche nach: ANPASSEN)")
    print("  2. Ordner als ZIP packen und bei Netlify hochladen")
    print("  3. Google-API-Key auf die neue Domain einschraenken")


if __name__ == "__main__":
    main()
