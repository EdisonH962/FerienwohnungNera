/* =========================================================================
   3D-Objekt: FARBROLLE AN DER WAND
   Passend für: Maler, Lackierer, Stuckateur, Trockenbau, Raumausstatter,
                Renovierung, Innenausbau
   =========================================================================
   Eine Malerrolle zieht eine frische Farbbahn über eine Wand. Die Wand ist
   halb alt, halb frisch gestrichen - das Ergebnis ist sofort zu sehen.
   Beim Scrollen loesen sich Rolle, Buegel, Stiel und Wandteile einzeln.

   Die Bahnfarbe kommt aus farben.akzent, laesst sich also ueber
   FARBE_3D_UEBERNEHMEN an die Marke des Betriebs anpassen.

   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-malerrolle.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Farbrolle',

  farben: {
    haupt:  [.78, .77, .74],   /* Wand, noch ungestrichen */
    hell:   [.96, .96, .94],   /* Leisten, Rollenbezug    */
    akzent: [.79, .18, .13]    /* frische Farbbahn        */
  },

  /* Hintergrundstimmung der Szene: warmes Anthrazit statt Gruen, damit
     rote Markenfarben nicht dagegen arbeiten. Weglassen = Standardgruen. */
  szene: {
    grund:      [.016, .015, .018],
    schein:     [.240, .090, .070],
    teal:       [.110, .100, .115],
    warm:       [.400, .130, .060],
    strahl:     [.220, .130, .110],
    strahlWarm: [.560, .230, .120]
  },

  bauen: function (w) {
    var wandton = this.farben.haupt;
    var hell    = this.farben.hell;
    var farbe   = this.farben.akzent;
    var stahl   = [.55, .57, .60];   /* Buegel und Achse */
    var holz    = [.42, .31, .20];   /* Stielgriff       */

    var formen = {
      /* --- Wand --- */
      wand:     w.roundedBox(1.38, 2.24, .22, .030),
      bahn:     w.roundedBox(.54, 1.58, .04, .012),
      leiste:   w.roundedBox(1.54, .10, .30, .024),
      steckdose: w.roundedBox(.16, .16, .06, .018),

      /* --- Rolle --- */
      walze:    w.cylinder(.145, .50),
      achse:    w.cylinder(.042, .62),
      kappe:    w.cylinder(.055, .05),

      /* --- Buegel und Stiel --- */
      buegelQuer: w.cylinder(.026, .30),
      buegelLang: w.cylinder(.026, .34),
      stiel:      w.cylinder(.040, 1.18),
      griff:      w.cylinder(.058, .34),

      /* --- Farbtropfen --- */
      tropfen:  w.sphere(.055),
      klecks:   w.sphere(.075)
    };

    var teile = [];
    var wy = -.16;            /* Wandmitte  */
    var bx = -.22;            /* Bahnmitte in X */

    /* ---------- Wand mit Leisten ---------- */
    teile.push(['wand',   0, wy, 0, 0, 0, 0, wandton]);
    teile.push(['leiste', 0, wy + 1.16, .03, 0, 0, 0, hell]);   /* Deckenleiste */
    teile.push(['leiste', 0, wy - 1.16, .03, 0, 0, 0, hell]);   /* Sockelleiste */
    teile.push(['steckdose', .42, wy - .30, .13, 0, 0, 0, hell]);

    /* ---------- Frisch gestrichene Bahn ---------- */
    var by = wy + .04;
    teile.push(['bahn', bx, by, .13, 0, 0, 0, farbe]);

    /* ---------- Rolle am oberen Ende der Bahn ---------- */
    var ry = by + .92;
    teile.push(['walze', bx, ry, .20, 0, 0, w.PI / 2, farbe]);
    teile.push(['achse', bx, ry, .20, 0, 0, w.PI / 2, stahl]);
    teile.push(['kappe', bx - .29, ry, .20, 0, 0, w.PI / 2, hell]);
    teile.push(['kappe', bx + .29, ry, .20, 0, 0, w.PI / 2, hell]);

    /* ---------- Buegel: von der Achse nach hinten und nach unten ---------- */
    teile.push(['buegelQuer', bx + .30, ry - .02, .30, w.PI / 2, 0, 0, stahl]);
    teile.push(['buegelLang', bx + .38, ry - .22, .34, 0, 0, .42, stahl]);

    /* ---------- Stiel schraeg nach unten rechts, mit Griff ---------- */
    teile.push(['stiel', bx + .70, ry - .74, .36, 0, 0, .52, stahl]);
    teile.push(['griff', bx + 1.05, ry - 1.34, .38, 0, 0, .52, holz]);

    /* ---------- Farbtropfen an der Bahnkante ---------- */
    teile.push(['tropfen', bx - .24, by + .36, .16, 0, 0, 0, farbe]);
    teile.push(['tropfen', bx + .25, by - .18, .16, 0, 0, 0, farbe]);
    teile.push(['tropfen', bx - .21, by - .56, .16, 0, 0, 0, farbe]);
    teile.push(['klecks',  bx + .04, wy - 1.30, .18, 0, 0, 0, farbe]);

    return { formen: formen, teile: teile };
  }
};
