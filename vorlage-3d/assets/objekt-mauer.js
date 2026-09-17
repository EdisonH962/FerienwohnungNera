/* =========================================================================
   3D-Objekt: NATURSTEINMAUER
   Passend für: Garten- und Landschaftsbau, Pflasterarbeiten, Hangbefestigung,
                Maurerbetrieb, Tiefbau, Bauunternehmen
   =========================================================================
   Eine stehende Mauer aus versetzt geschichteten Natursteinen mit Abdeckplatte
   und begrünter Krone. Beim Scrollen lösen sich die Steine einzeln heraus.

   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-mauer.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Natursteinmauer',

  farben: {
    haupt:  [.58, .60, .56],   /* Naturstein grau   */
    hell:   [.82, .82, .77],   /* heller Sandstein  */
    akzent: [.32, .64, .24]    /* Begrünung         */
  },

  bauen: function (w) {
    var haupt = this.farben.haupt, hell = this.farben.hell, akzent = this.farben.akzent;

    var formen = {
      steinBreit:  w.roundedBox(.74, .30, .46, .040),
      steinSchmal: w.roundedBox(.46, .30, .46, .038),
      abdeckung:   w.roundedBox(1.98, .17, .58, .045),
      fundament:   w.roundedBox(1.90, .22, .54, .040),
      busch:       w.sphere(.26),
      halm:        w.cylinder(.030, .52)
    };

    var teile = [];

    /* Neun versetzte Steinlagen – klassischer Mauerverband */
    var lagen = 9;
    for (var i = 0; i < lagen; i++) {
      var y = -1.42 + i * .315;
      var versetzt = (i % 2 === 1);

      if (versetzt) {
        /* Lage mit zwei breiten Steinen und je einem halben am Rand */
        teile.push(['steinSchmal', -.76, y, 0, 0, 0, 0, (i % 3 === 0) ? hell : haupt]);
        teile.push(['steinBreit',  -.13, y, 0, 0, 0, 0, haupt]);
        teile.push(['steinBreit',   .63, y, 0, 0, 0, 0, (i % 4 === 0) ? hell : haupt]);
      } else {
        /* Lage mit drei Steinen mittig */
        teile.push(['steinBreit',  -.62, y, 0, 0, 0, 0, haupt]);
        teile.push(['steinSchmal',  .01, y, 0, 0, 0, 0, (i % 3 === 1) ? hell : haupt]);
        teile.push(['steinBreit',   .64, y, 0, 0, 0, 0, haupt]);
      }
    }

    /* Fundament und Abdeckplatte */
    teile.push(['fundament', 0, -1.68, 0, 0, 0, 0, haupt]);
    teile.push(['abdeckung', 0,  1.30, 0, 0, 0, 0, hell]);

    /* Begrünte Krone */
    teile.push(['busch', -.52, 1.56, .04, 0, 0, 0, akzent]);
    teile.push(['busch',  .18, 1.63, -.08, 0, 0, 0, akzent]);
    teile.push(['busch',  .70, 1.52, .10, 0, 0, 0, akzent]);
    teile.push(['halm',  -.18, 1.68, .12, 0, 0, .22, akzent]);
    teile.push(['halm',   .46, 1.72, -.06, 0, 0, -.18, akzent]);

    return { formen: formen, teile: teile };
  }
};
