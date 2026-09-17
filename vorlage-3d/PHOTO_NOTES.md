# NERA – Hinweise zur Foto-Aufwertung

Die zwölf gelieferten Fotos wurden einzeln mit der integrierten Bildbearbeitung (ImageGen) bearbeitet, nicht mit einer ImageGen-CLI. Auftrag: Unschärfe und Kompressionsartefakte vorsichtig reduzieren; die tatsächliche Einrichtung, Architektur, Blickrichtung, Beleuchtung und Bildaufteilung erhalten.

## Ergebnis und Grenzen

- Ausgangsauflösung: jeweils 800 × 800 Pixel. Die bearbeiteten Bilder wurden mit 1254 × 1254 Pixeln zurückgegeben; die im Auftrag bevorzugten 2048 × 2048 Pixel wurden nicht erreicht.
- Die Ergebnisse wurden visuell mit den Originalen verglichen. Die Gesamtaufteilung ist erhalten; feinste Gegenstände, Armaturen, Textilien, Pflanzen und Oberflächen können KI-rekonstruierte Abweichungen enthalten. Eine höhere Pixelzahl ist kein Nachweis wiederhergestellter Originaldetails.
- Vor der öffentlichen Verwendung bitte selbst die tatsächliche Ausstattung mit den Fotos abgleichen, besonders die Duscharmaturen und kleine Dekorationsgegenstände. Höher aufgelöste echte Originalaufnahmen sind für eine detailgetreue Darstellung vorzuziehen.
- Die Galerie kennzeichnet die KI-Aufwertung. Die unveränderten Original-JPGs und Original-WebPs bleiben unter `assets/img/` erhalten.
- Die verbesserten PNG-Ergebnisse wurden ausschließlich zur Dateiformat-Konvertierung als verlustfreie WebPs gespeichert. Ein Pixelvergleich zwischen PNG und WebP ergab für alle zwölf Dateien 0 abweichende Pixel. Es erfolgte keine zusätzliche Bildmanipulation bei dieser Konvertierung.
- Die Webseite verwendet die verbesserten WebPs; die ursprünglichen JPGs dienen als technische Rückfallversion.

## Dateien im Download

Alle Pfade beziehen sich auf die ZIP-Wurzel. Im Git-Projekt liegen sie unter `dist/`.

| Original (unverändert) | Verwendete Aufwertung | Auflösung |
| --- | --- | --- |
| `assets/img/wohnzimmer.jpg` | `assets/enhanced/wohnzimmer.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/terrasse.jpg` | `assets/enhanced/terrasse.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/kueche.jpg` | `assets/enhanced/kueche.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/schlafzimmer.jpg` | `assets/enhanced/schlafzimmer.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/einzelbetten.jpg` | `assets/enhanced/einzelbetten.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/essbereich.jpg` | `assets/enhanced/essbereich.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/bad.jpg` | `assets/enhanced/bad.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/garten.jpg` | `assets/enhanced/garten.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/haus.jpg` | `assets/enhanced/haus.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/wohnzimmer2.jpg` | `assets/enhanced/wohnzimmer2.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/schlafzimmer2.jpg` | `assets/enhanced/schlafzimmer2.webp` | 800 × 800 → 1254 × 1254 |
| `assets/img/garten2.jpg` | `assets/enhanced/garten2.webp` | 800 × 800 → 1254 × 1254 |

## Tatsächlich verwendete Bearbeitungsaufträge

Jeweils nur das zugehörige Originalfoto wurde als Referenz übergeben. Die folgenden Aufträge sind unverändert dokumentiert, auch dort, wo die KI eine gewünschte Ausgabegröße nicht geliefert hat.

Hinweis zu `garten2.jpg`: Im Bearbeitungsauftrag steht irrtümlich „four lower windows“. Der visuelle Vergleich zeigt fünf untere Fenster in Ausgangsbild und Ergebnis. Die Formulierung ist hier als Dokumentation des tatsächlich verwendeten Auftrags erhalten, nicht als Beschreibung der Immobilie.

### wohnzimmer.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original wohnzimmer.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the gray L-shaped corner sofa under the two sheer-curtained windows, the two gray armchairs, black rectangular coffee table with its small existing objects, beige rug, geometric black shelf and tree artwork on the left wall, foreground plant, and all ceiling lights exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### terrasse.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original terrasse.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the cream house wall and its exact white-framed mullioned window, dark roof edge, the black outdoor table and every existing chair, square paved patio, lawn, tree, fence, hedge, distant hillside, buildings and original sky exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### kueche.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original kueche.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the exact white kitchen cabinet door and drawer layout, silver handles, dark wood-grain backsplash and counter, black gooseneck tap and sink, all existing countertop appliances, black hood and built-in oven, ceiling lights, and the partially visible dark chair and table exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### schlafzimmer.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original schlafzimmer.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the double bed with dark headboard and base, two red pillows, existing pale blanket, the white wardrobe immediately to its right with its exact panel/mirror/drawer arrangement and handles, the reflected scene, floor planks, wall and single ceiling light exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### einzelbetten.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original einzelbetten.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep exactly two separate beds, their exact positions and dark headboards/bases, gray covers, white pillows and sheets, the sheer-curtained right window, plain cream walls, ceiling lamp and light floor boards exactly as photographed. Do not add bedside tables or ornaments.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### essbereich.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original essbereich.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the exact dining table and every existing dark chair, tabletop ornament, black chair frames, windows and closed shutters/blinds, radiator, left-side open counter with original appliances and bin beneath, overhead beam, floor and ceiling lights exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### bad.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original bad.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the black-framed glass shower enclosure with exact panel geometry, showerhead and hose, the small tiered storage rack visible through the glass, rear white door and handle, right-side sink, faucet, cabinet, mirror and wall light, bath mat, tile surfaces, and original camera tilt exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### garten.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original garten.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the original empty paved patio with NO outdoor furniture, exact yellow house wall and white-framed narrow window, dark roof, mature trees and planting, fence and hedge, distant building and hillside, lawn mowing stripes and slightly pale patches, original sky and original viewpoint exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### haus.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original haus.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the exact two-level yellow house facade, flat-looking low roof shape, satellite dish, upper left balcony and railing, upper windows and balcony door, ground-floor small left window, gray middle door and white right garage door, paved drive, shadows, lawn and background exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### wohnzimmer2.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original wohnzimmer2.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep this exact second living-room viewpoint: the gray L-shaped sofa beneath the sheer-curtained windows, exactly two gray armchairs with their original legs, black coffee table and small existing tabletop objects, beige rug, radiator, large close-up foreground plant and its pot at right, all walls and ceiling lights, and door edge exactly as photographed. Do not insert the shelf or wall artwork from another view.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### schlafzimmer2.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original schlafzimmer2.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep the double bed with dark headboard and base, two red pillows, existing pale blanket, the white wardrobe immediately to its right with its exact panel/mirror/drawer arrangement and handles, the reflected scene, floor planks, wall and single ceiling light exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

### garten2.jpg

```text
Use case: precise-object-edit
Asset type: real NERA holiday apartment website photograph, conservative restoration only
Input images: Image 1 is the sole edit target, the user's original garten2.jpg.
Primary request: Reduce the existing blur and JPEG compression artifacts slightly and improve natural edge clarity, while keeping this exact photograph, not recreating or redesigning its subject.
Scene-specific invariants: Keep this exact garden-side house viewpoint: the yellow single-story facade and gable, existing weathering and low white foundation, dark tile roof and chimney, attic window, all four lower windows with their exact shutters/frames and locations, narrow tall white-framed central window, wall vent, original empty patio with NO furniture, bare/patchy lawn, vegetation, small edge objects and original cloudy sky exactly as photographed.
Style/medium: natural photorealistic photo restoration, with the source's real imperfections intact.
Composition/framing: preserve the exact square composition, camera position, lens perspective, field of view, all object positions and visible boundaries. No crop, rotation, expansion, perspective correction, or reframing.
Lighting/colors: preserve original exposure, lighting, shadows, white balance, colors, and surface finishes; no relighting, glossy real-estate treatment, HDR, saturation boost, or artificial light rays.
Constraints: Change only apparent blur/compression and modest edge clarity. Keep every room boundary, window, door, architectural feature, fixture, furniture item, cushion, ornament, appliance, cable, plant, garden feature and background object in exactly the same shape, count, location, size and material as the source. Do not replace, add, remove, relocate, remodel, stage, straighten or redesign anything. Do not invent details where evidence is missing; leave uncertain fine details softly unresolved. Avoid halos, oversharpening, waxy smoothing, illustration, CGI, synthetic texture, watermark, or new text.
Output: one high-resolution square photo, preferably 2048×2048 pixels, retaining the complete original scene. Fidelity takes priority over sharpness.
```

