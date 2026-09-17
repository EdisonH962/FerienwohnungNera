/* =========================================================================
   3D-Objekt: REINIGUNGSDROHNE ÜBER FASSADE
   Passend für: Fassadenreinigung per Drohne, Gebäudereinigung, Dachreinigung,
                Solarreinigung, Industriekletterer-Alternative
   =========================================================================
   Eine Quadrocopter-Drohne schwebt über einem Fassadenausschnitt und sprüht
   Wasser. Beim Scrollen lösen sich Rotoren, Arme und Steine einzeln heraus.

   Warum diese Kombination: Die Kamera schaut von der Seite auf die Szene.
   Eine Drohne allein liegt waagerecht und wäre kaum zu erkennen. Zusammen mit
   der Fassade darunter entsteht ein stehendes Bild - und es erzählt sofort,
   worum es geht: gereinigt wird ohne Gerüst, aus der Luft.

   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-drohne.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Reinigungsdrohne',

  farben: {
    haupt:  [.30, .32, .35],   /* Drohnenkorpus, dunkelgrau */
    hell:   [.93, .94, .95],   /* Rotoren, saubere Fassade  */
    akzent: [.30, .68, .90]    /* Wasserstrahl              */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;
    var putz = [.80, .78, .72];          /* Fassadenputz, noch ungereinigt */

    var formen = {
      /* Drohne */
      korpus:  w.roundedBox(.68, .21, .45, .060),
      haube:   w.roundedBox(.43, .14, .33, .050),
      arm:     w.roundedBox(.76, .070, .095, .030),
      motor:   w.cylinder(.070, .14),
      rotor:   w.torus(.34, .022),
      kufe:    w.roundedBox(.06, .20, .06, .024),
      kamera:  w.sphere(.095),
      duese:   w.cylinder(.045, .25),

      /* Fassade darunter */
      wand:    w.roundedBox(1.20, 1.20, .26, .036),
      fenster: w.roundedBox(.34, .42, .12, .024),
      gesims:  w.roundedBox(1.40, .09, .34, .026),

      /* Wasser */
      tropfen: w.sphere(.070),
      strahl:  w.cylinder(.020, .46)
    };

    var teile = [];

    /* ---- Drohne, leicht nach vorn geneigt (wie im Flug) ---- */
    var dy = 1.08, neigung = .17;

    teile.push(['korpus', 0, dy,      0,   neigung, 0, 0, haupt]);
    teile.push(['haube',  0, dy + .13, .02, neigung, 0, 0, hell]);

    /* Vier Arme im X, jeweils mit Motor und Rotor */
    var ecken = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    ecken.forEach(function (e) {
      var ax = e[0] * .56, az = e[1] * .38;
      teile.push(['arm',   ax * .58, dy - .01, az * .58, neigung, e[0] * e[1] * .52, 0, haupt]);
      teile.push(['motor', ax, dy + .06, az, neigung, 0, 0, haupt]);
      teile.push(['rotor', ax, dy + .17, az, w.PI / 2 + neigung, 0, 0, hell]);
    });

    /* Landekufen und Kameragimbal */
    teile.push(['kufe', -.38, dy - .21, 0, neigung, 0, 0, haupt]);
    teile.push(['kufe',  .38, dy - .21, 0, neigung, 0, 0, haupt]);
    teile.push(['kamera', 0, dy - .20, .19, 0, 0, 0, hell]);

    /* Sprühdüse unter der Drohne */
    teile.push(['duese', 0, dy - .37, .05, .22, 0, 0, akzent]);

    /* ---- Wasserstrahl zur Fassade ---- */
    teile.push(['strahl', -.04, dy - .58, .06, .16, 0, .05, akzent]);
    teile.push(['strahl', -.10, dy - .98, .08, .16, 0, .09, akzent]);

    /* ---- Fassade darunter ---- */
    var fy = -.92;
    teile.push(['wand',   0, fy, 0, 0, 0, 0, putz]);
    teile.push(['gesims', 0, fy + .66, .04, 0, 0, 0, hell]);   /* frisch gereinigte Kante */
    teile.push(['gesims', 0, fy - .66, .04, 0, 0, 0, putz]);

    /* Vier Fenster */
    [-.30, .30].forEach(function (x) {
      [fy + .28, fy - .30].forEach(function (y) {
        teile.push(['fenster', x, y, .16, 0, 0, 0, akzent]);
      });
    });

    /* Spritzwasser auf der Fassade */
    teile.push(['tropfen', -.24, fy + .62, .22, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .42, fy + .30, .20, 0, 0, 0, akzent]);
    teile.push(['tropfen', -.52, fy - .06, .24, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .16, fy - .52, .21, 0, 0, 0, akzent]);

    return { formen: formen, teile: teile };
  }
};
