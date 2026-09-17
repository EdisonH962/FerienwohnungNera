/* =========================================================================
   3D-Objekt: HAUSFASSADE
   Passend für: Fassadenreinigung, Maler, Stuckateur, Gerüstbau,
                Dachdecker, Gebäudereinigung, Bausanierung
   =========================================================================
   Ein Fassadenausschnitt mit Fenstern, Gesimsen und Dachkante. Beim Scrollen
   lösen sich die Bauteile einzeln heraus. Die Wassertropfen setzen den Akzent
   auf Reinigung.

   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-fassade.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Hausfassade',

  farben: {
    haupt:  [.86, .84, .78],   /* saubere Putzfassade */
    hell:   [.97, .97, .95],   /* frisch gereinigt    */
    akzent: [.36, .70, .88]    /* Wasser / Glas       */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;

    var formen = {
      wand:    w.roundedBox(1.46, 2.86, .30, .040),
      fenster: w.roundedBox(.40, .50, .14, .028),
      bank:    w.roundedBox(.50, .07, .20, .022),
      gesims:  w.roundedBox(1.72, .11, .40, .030),
      dach:    w.roundedBox(1.86, .17, .48, .038),
      sockel:  w.roundedBox(1.62, .30, .38, .034),
      tropfen: w.sphere(.085)
    };

    var teile = [
      ['wand',   0,  .18, 0, 0, 0, 0, haupt],
      ['sockel', 0, -1.38, 0, 0, 0, 0, hell],
      ['dach',   0,  1.72, 0, 0, 0, 0, hell]
    ];

    /* Sechs Fenster: zwei Spalten, drei Reihen */
    var spalten = [-.36, .36];
    var reihen  = [.92, .18, -.56];
    reihen.forEach(function (y, r) {
      spalten.forEach(function (x) {
        teile.push(['fenster', x, y, .17, 0, 0, 0, akzent]);
        teile.push(['bank',    x, y - .30, .19, 0, 0, 0, hell]);
      });
      /* Gesims unter jeder Fensterreihe, außer ganz unten */
      if (r < 2) teile.push(['gesims', 0, y - .42, .06, 0, 0, 0, hell]);
    });

    /* Wassertropfen – der Reinigungsakzent */
    teile.push(['tropfen', -.78, 1.16, .30, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .82,  .52, .28, 0, 0, 0, akzent]);
    teile.push(['tropfen', -.70, -.22, .32, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .74, -.92, .26, 0, 0, 0, akzent]);

    return { formen: formen, teile: teile };
  }
};
