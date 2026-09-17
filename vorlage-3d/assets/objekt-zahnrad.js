/* =========================================================================
   3D-Objekt: ZAHNRAD
   Passend für: Metallbau, Schlosserei, KFZ-Werkstatt, Maschinenbau, Handwerk allgemein
   =========================================================================
   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-zahnrad.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Zahnrad',

  farben: {
    haupt:  [.72, .74, .78],   /* Stahl            */
    hell:   [.93, .94, .96],   /* polierter Stahl  */
    akzent: [.90, .45, .10]    /* Signalorange     */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;

    var formen = {
      ring:   w.torus(1.05, .20),
      zahn:   w.roundedBox(.30, .34, .40, .045),
      nabe:   w.cylinder(.34, .46),
      achse:  w.cylinder(.12, 1.30),
      speiche: w.roundedBox(1.30, .13, .22, .045),
      bolzen: w.sphere(.085)
    };

    var teile = [];
    var zaehne = 12;

    /* Zähne gleichmäßig auf dem Ring verteilen */
    for (var i = 0; i < zaehne; i++) {
      var winkel = (i / zaehne) * Math.PI * 2;
      var r = 1.19;
      teile.push([
        'zahn',
        Math.cos(winkel) * r,
        Math.sin(winkel) * r,
        0,
        0, 0, winkel,
        (i % 3 === 0) ? hell : haupt
      ]);
    }

    /* Grundkörper */
    teile.push(['ring',  0, 0, 0, 0, 0, 0, haupt]);
    teile.push(['nabe',  0, 0, 0, w.PI / 2, 0, 0, hell]);
    teile.push(['achse', 0, 0, 0, w.PI / 2, 0, 0, akzent]);

    /* Drei Speichen */
    for (var s = 0; s < 3; s++) {
      teile.push(['speiche', 0, 0, 0, 0, 0, (s / 3) * Math.PI * 2, haupt]);
    }

    /* Bolzen als Akzente */
    for (var b = 0; b < 4; b++) {
      var wb = (b / 4) * Math.PI * 2 + .78;
      teile.push(['bolzen', Math.cos(wb) * .62, Math.sin(wb) * .62, .17, 0, 0, 0, akzent]);
    }

    return { formen: formen, teile: teile };
  }
};
