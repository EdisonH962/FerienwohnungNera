/* =========================================================================
   3D-Objekt: SCHLÜSSEL
   Passend für: Ferienwohnung, Ferienhaus, Immobilien, Hausverwaltung, Hotel
   =========================================================================
   Einbinden in index.html VOR assets/site-3d.js:
       <script src="assets/objekt-schluessel.js"></script>

   Werkzeug (w) stellt bereit:
       w.torus(radius, dicke)
       w.sphere(radius)
       w.cylinder(radius, hoehe)
       w.roundedBox(breite, hoehe, tiefe, eckenradius)
       w.PI

   Bauteil-Format:
       ['formname', x, y, z, drehX, drehY, drehZ, farbe]
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Schlüssel',

  /* Farben als [rot, gruen, blau], jeweils 0 bis 1 */
  farben: {
    haupt:  [.92, .59, .20],   /* Gold          */
    hell:   [1,   .78, .39],   /* helles Gold   */
    akzent: [.02, .37, .18]    /* Smaragd (Stein) */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;
    return {
      formen: {
        bow:    w.torus(.56, .145),            /* Griffring        */
        detail: w.torus(.555, .021),           /* Zierring         */
        neck:   w.sphere(.165),                /* Übergang         */
        stem:   w.cylinder(.125, 2.10),        /* Schaft           */
        collar: w.torus(.145, .047),           /* Ringe am Schaft  */
        tip:    w.roundedBox(.25, .38, .25, .055),
        toothA: w.roundedBox(.62, .24, .27, .048),
        toothB: w.roundedBox(.43, .23, .27, .046),
        gem:    w.sphere(.07)                  /* Schmuckstein     */
      },
      teile: [
        ['bow',    0,   .96,  0,    0,      0, 0, haupt],
        ['detail', 0,   .96,  .139, 0,      0, 0, hell],
        ['neck',   0,   .38,  0,    0,      0, 0, haupt],
        ['stem',   0,  -.61,  0,    0,      0, 0, haupt],
        ['collar', 0,   .23,  0,    w.PI/2, 0, 0, hell],
        ['collar', 0,  -.56,  0,    w.PI/2, 0, 0, hell],
        ['tip',    0,  -1.73, 0,    0,      0, 0, haupt],
        ['toothA', .21, -1.53, 0,   0,      0, 0, haupt],
        ['toothB', .14, -1.12, 0,   0,      0, 0, haupt],
        ['gem',    0,   1.53, .115, 0,      0, 0, akzent]
      ]
    };
  }
};
