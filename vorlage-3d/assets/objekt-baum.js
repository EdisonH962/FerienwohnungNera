/* =========================================================================
   3D-Objekt: BAUM
   Passend für: Gartenpflege, Baumpflege, Baumfällung, Forstbetrieb, Gärtnerei
   =========================================================================
   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-baum.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Baum',

  farben: {
    haupt:  [.24, .55, .22],   /* Blattgrün   */
    hell:   [.44, .76, .32],   /* helles Grün */
    akzent: [.42, .29, .17]    /* Stamm braun */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;

    var formen = {
      stamm:  w.cylinder(.145, 1.70),
      ast:    w.cylinder(.070, .85),
      kroneA: w.sphere(.68),
      kroneB: w.sphere(.50),
      kroneC: w.sphere(.36),
      wurzel: w.torus(.62, .055)
    };

    var teile = [
      /* Stamm und Wurzelansatz */
      ['stamm',  0, -.90,  0,   0, 0, 0,    akzent],
      ['wurzel', 0, -1.72, 0,   w.PI/2, 0, 0, akzent],

      /* Äste */
      ['ast',  -.36, -.30, .06, 0, 0,  .72, akzent],
      ['ast',   .38, -.12, -.05, 0, 0, -.66, akzent],

      /* Krone aus mehreren Kugeln */
      ['kroneA',  0,   .72,  0,   0, 0, 0, haupt],
      ['kroneB', -.60,  .42,  .16, 0, 0, 0, hell],
      ['kroneB',  .62,  .50, -.12, 0, 0, 0, haupt],
      ['kroneC', -.30, 1.24, -.18, 0, 0, 0, hell],
      ['kroneC',  .36, 1.18,  .20, 0, 0, 0, hell],
      ['kroneC',  0,    .18,  .44, 0, 0, 0, haupt]
    ];

    return { formen: formen, teile: teile };
  }
};
