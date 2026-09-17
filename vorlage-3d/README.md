# Ferienwohnung NERA – 3D-Scroll-Erlebnis

Der Einstieg ist als geometrische WebGL-Szene neu aufgebaut. Ein metallisch goldener Schlüssel dreht sich, die Kamera kommt näher, die Einzelteile lösen sich und die Fahrt führt durch hintereinanderliegende Raumrahmen. Das überträgt das Prinzip der gelieferten Videoreferenz – zentrales 3D-Objekt, große Typografie und durchgehende Kamerabewegung – auf NERA. Es ist keine Nachbildung des Referenzfilms und kein maßstabsgetreues Modell der Ferienwohnung.

## Verbesserungen

- Im Einstieg ersetzt die 3D-Szene die bisherige Präsentation mit schwebenden Fotoflächen. Licht und Hintergrund wechseln während der Fahrt von Grün über warmes Gold zu Petrol. In den folgenden Abschnitten bleiben die vorhandenen Hintergründe und Ambiente-Videos erhalten.
- Drei Kapitel begleiten die Fahrt: Ankommen, Wohnen und Garten. Die große Schrift wechselt zwischen Kontur und Füllung, Texte werden passend zum Kamerastand eingeblendet. Die Wohnung selbst wird weiterhin mit ihren Fotos in der Galerie gezeigt.
- Der Browser scrollt weiterhin normal. Die Kapitelwahl springt direkt zur passenden Szene; Ausstattung und Buchungsanfrage bleiben unmittelbar erreichbar.
- Schlüssel und Rahmen bestehen aus echten Dreiecksnetzen mit Oberflächennormalen, gerichteter Beleuchtung, berechneten Reflexionen und Tiefenpuffer. Ein räumliches Partikelfeld ergänzt die Szene. Dafür werden keine externen 3D-Bibliotheken oder fremden Modelle geladen.
- Die Darstellung läuft mit maximal 30 Bildern pro Sekunde, reduzierter Auflösung auf kleinen Geräten und nur bei sichtbarem Einstieg. Die Kameraposition folgt dem normalen Scrollen; leichtes Schweben läuft unabhängig davon weiter.
- Reicht der Platz bei kleinen Ansichten oder großer Schrift nicht aus, stehen die Kapitel untereinander. Bei ausgeschalteten Animationen oder fehlendem WebGL erscheint ein lokal gespeichertes Standbild derselben 3D-Szene. Alle Texte und Buchungswege bleiben erreichbar; auch ohne JavaScript ist die Seite bedienbar.
- Räumliche Gold-Orbits in den vorhandenen Zwischenabschnitten, kinetische Überschriften, Scroll-Parallax und beleuchtete Ausstattungskacheln; die Effekte liegen im Vordergrund.
- Kapitelanzeige am rechten Rand großer Bildschirme, dezente magnetische Bedienelemente und ein zusätzlicher Fokus-Ring beim Zeigen auf anklickbare Elemente. Der normale Mauszeiger bleibt erhalten.
- Die Galerie bleibt frei bedienbar: Wischen, Ziehen, Pfeiltasten, Vor/Zurück-Tasten und Bildzähler. Keine automatische Weiterleitung des Seitenscrollens.
- Vollbildgalerie mit Tastatursteuerung, Fokusbegrenzung, Rückkehr zum vorherigen Element, Wischgesten und Fehlerhinweis.
- Menü mit Fokusbegrenzung, Escape und gesperrtem Hintergrund. Rechtliche Sprunglinks öffnen das zugehörige aufklappbare Element.
- Pflichtfelder und E-Mail werden geprüft. Keine Anreise in der Vergangenheit; Abreise nach Anreise. Der Zeitraum zeigt die Anzahl der Nächte. Das Formular bereitet eine E-Mail vor und bestätigt keine Verfügbarkeit oder Buchung.
- Videos werden erst in der Nähe ihres Abschnitts geladen und außerhalb des sichtbaren Bereichs pausiert. Verdeckte Browser-Tabs, Datensparmodus und reduzierte Bewegung werden berücksichtigt. Zusätzlich gibt es einen Schalter zum Pausieren der Animationen.
- Inhalte und Endwerte der Zahlen bleiben auch ohne JavaScript sichtbar. Mobile Schriftgrößen, Kontraste, Fokusmarkierungen und Schaltflächen wurden verbessert.

## Dateien und Hosting

`dist/` ist die vollständige statische Webseite, ohne Build-Schritt und ohne externe JavaScript-Bibliotheken. Die Download-ZIP enthält den Inhalt dieses Verzeichnisses direkt auf der obersten Ebene; `index.html` und `assets/` müssen zusammen auf den Webserver kopiert werden.

`assets/nera-depth.css` ergänzt das ursprüngliche Design. `assets/nera-tech.css` enthält die weiteren Vordergrund-Effekte. `assets/nera-3d.js` enthält Geometrie, Kamera und Shader des neuen Einstiegs; `assets/nera-cinema.css` und `assets/nera-cinema.js` verbinden ihn mit Text und Scroll-Steuerung. `assets/nera-3d-poster.webp` ist das lokale Standbild für die statische Darstellung. `assets/nera-experience.js` enthält Navigation, Galerie, Bewegungssteuerung und Formularlogik. `assets/nera-config.js` bewahrt die gelieferten Medienadressen und Google-Konfiguration. `assets/nera-google.js` lädt konfigurierte Profildaten ohne Browser-Cache für Google-Inhalte und gibt deren Urheber an.

## Foto-Aufwertung

Die Bilder wurden mit dem integrierten KI-Bildbearbeitungswerkzeug vorsichtig aufgewertet und gegen die gelieferten Aufnahmen geprüft. Eine Rekonstruktion feiner Details ist nicht gleichbedeutend mit der Wiederherstellung verifizierter Originaldetails. Die Bearbeitung wird in der Galerie kenntlich gemacht. Für eine endgültige, detailgetreue Immobilienpräsentation sind höher aufgelöste Originalfotos vorzuziehen.

Die gelieferten JPG- und WebP-Dateien unter `assets/img/` bleiben unverändert erhalten. Die verbesserten Fassungen sind separat abgelegt. Die frühere permanente Vergrößerung und Abdunklung der Galeriebilder wurden entfernt. Genauere Angaben zu Dateien und Bearbeitungsauftrag stehen in `PHOTO_NOTES.md`.

## Unverändert zu beachten

- Die Kontaktangaben und Buchungslinks stammen aus dieser NERA-Datei. Sie wurden nicht durch die Angaben der anderen HotiBau-Webseite ersetzt.
- In der gelieferten NERA-Datei steht **kein echter Google-API-Schlüssel**, sondern `GOOGLE_API_KEY_HIER_EINFÜGEN`. Die bestehenden direkten Google-Links funktionieren unabhängig davon. Für Live-Fotos und Live-Bewertungen muss der Eigentümer einen passend eingeschränkten Schlüssel in `assets/nera-config.js` eintragen und die Places API (New) für seine Domain konfigurieren. Schlüssel der anderen Firma wurden nicht übernommen.
- Die statische Booking.com-Angabe 9,4/10, Texte und rechtlichen Angaben wurden aus der Quelldatei übernommen und nicht inhaltlich bestätigt. Auch der vorhandene Ergänzungshinweis im Impressum bleibt erhalten.
- Fotos liegen lokal in der ZIP. Die vorhandenen Ambiente-Videos, Google Fonts und das Logo werden weiterhin von ihren ursprünglichen externen Adressen geladen; die ZIP ist deshalb kein vollständiges Offline-Paket. Bei fehlendem Video bleibt der gestaltete Hintergrund erhalten.
- Es gibt keinen Buchungsserver und keinen automatischen Mailversand. Formulareingaben werden nicht in Browser-Speicher geschrieben. Nur die Einstellung zum Pausieren von Animationen wird lokal gespeichert.

## Prüfung

HTML-Verweise, lokale Dateien und JavaScript-Syntax wurden geprüft. Die Originalfotos und die ursprünglichen Hintergrunddefinitionen wurden mit der hochgeladenen Version verglichen. Eine DOM-Ereignissimulation prüft Kapitelwechsel, Tastaturfokus, Pause/Fortsetzen, kleine Bildschirme, große Schrift sowie Verlust und Wiederherstellung des WebGL-Kontexts. Geometrie und Kameramatrizen wurden für mehrere Seitenverhältnisse geprüft.

Alle drei Shader-Programme wurden in einer lokalen OpenGL-ES-Umgebung kompiliert, verbunden und mit den tatsächlichen Website-Geometrien und Kamerazuständen gerendert. Daraus stammt die separat gelieferte Videovorschau. Sie zeigt die 3D-Animation ohne HTML-Bedienelemente und ist keine Browseraufnahme. Keine browserbasierte visuelle oder Ende-zu-Ende-Prüfung in diesem Auftrag. Die Erreichbarkeit und Kontokonfiguration externer Dienste ist nicht Bestandteil dieser Bestätigung.
