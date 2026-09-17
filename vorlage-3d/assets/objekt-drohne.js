/* =========================================================================
   3D-Objekt: REINIGUNGSDROHNE (Industriedrohne) ÜBER FASSADE
   Passend für: Fassadenreinigung per Drohne, Gebäudereinigung, Dachreinigung,
                Solarreinigung, Industriekletterer-Alternative
   =========================================================================
   Nachempfunden einer Industriedrohne der Oberklasse: grauer Korpus,
   schwarze Carbonrohre als Ausleger, Motorgondeln an den Enden, lange
   schmale Rotorblätter mit hellen Spitzen, Gimbal-Kamera vorn und ein
   V-förmiges Fahrwerk. Darunter ein Fassadenausschnitt, der gerade
   gereinigt wird.

   Warum die Fassade dazugehört: Die Kamera schaut von der Seite auf die
   Szene. Eine Drohne allein liegt waagerecht und wäre kaum zu erkennen.
   Zusammen ergibt sich ein stehendes Bild, das die Leistung sofort erzählt.

   Einbinden VOR assets/site-3d.js:
       <script src="assets/objekt-drohne.js"></script>
   ========================================================================= */
window.SITE_3D_OBJEKT = {
  name: 'Reinigungsdrohne',

  farben: {
    haupt:  [.60, .63, .66],   /* Korpus, helles Industriegrau */
    hell:   [.84, .86, .88],   /* Abdeckung, Gehaeuseoberseite */
    akzent: [.32, .70, .92]    /* Wasser und Glas              */
  },

  bauen: function (w) {
    var grau   = this.farben.haupt;
    var hell   = this.farben.hell;
    var akzent = this.farben.akzent;
    var kohle  = [.13, .14, .16];   /* Carbon, Motoren, Fahrwerk */
    var spitze = [.94, .76, .20];   /* Rotorspitzen              */
    var putz   = [.80, .78, .72];   /* Fassade, noch ungereinigt */

    var formen = {
      /* --- Korpus --- */
      rumpf:      w.roundedBox(.60, .27, .40, .055),
      deckel:     w.roundedBox(.50, .09, .33, .040),
      bug:        w.roundedBox(.26, .17, .13, .045),
      akku:       w.roundedBox(.34, .16, .22, .035),

      /* --- Gimbal --- */
      gimbalHals: w.cylinder(.045, .12),
      gimbal:     w.roundedBox(.19, .15, .17, .050),
      linse:      w.sphere(.055),

      /* --- Ausleger --- */
      rohr:       w.cylinder(.040, .86),
      muffe:      w.cylinder(.055, .10),
      gondel:     w.cylinder(.072, .19),
      kappe:      w.cylinder(.050, .055),

      /* --- Rotorblätter ---
         Beide Teile sitzen mittig auf der Nabe. Das Spitzenteil ist laenger
         und schmaler, dadurch schauen nur die farbigen Enden heraus. So
         koennen Blatt und Spitze nie auseinanderlaufen. */
      blatt:      w.roundedBox(1.00, .014, .085, .006),
      blattSpitz: w.roundedBox(1.20, .016, .062, .006),

      /* --- Fahrwerk --- */
      beinSchraeg: w.cylinder(.032, .42),
      beinFuss:    w.cylinder(.030, .50),

      /* --- Fassade --- */
      wand:    w.roundedBox(1.22, 1.12, .26, .036),
      fenster: w.roundedBox(.34, .40, .12, .024),
      gesims:  w.roundedBox(1.42, .09, .34, .026),

      /* --- Wasser --- */
      duese:   w.cylinder(.038, .17),
      strahl:  w.cylinder(.018, .44),
      tropfen: w.sphere(.065)
    };

    var teile = [];
    var dy = 1.10;          /* Flughöhe der Drohne */
    var kipp = .15;         /* leichte Vorwärtsneigung */

    /* ---------- Korpus ---------- */
    teile.push(['rumpf',  0, dy,       0,   kipp, 0, 0, grau]);
    teile.push(['deckel', 0, dy + .17, -.01, kipp, 0, 0, hell]);
    teile.push(['akku',   0, dy + .02, -.16, kipp, 0, 0, kohle]);
    teile.push(['bug',    0, dy - .02,  .25, kipp, 0, 0, grau]);

    /* ---------- Gimbal-Kamera vorn unten ---------- */
    teile.push(['gimbalHals', .00, dy - .19, .20, 0, 0, 0, kohle]);
    teile.push(['gimbal',     .00, dy - .30, .21, 0, 0, 0, kohle]);
    teile.push(['linse',      .00, dy - .30, .30, 0, 0, 0, akzent]);

    /* ---------- Vier Ausleger mit Motorgondel und Rotor ---------- */
    /* Jeder Ausleger liegt waagerecht (rz = 90°) und zeigt diagonal nach aussen. */
    var ausleger = [
      { vx:  1, vz:  1, gier:  .70 },
      { vx: -1, vz:  1, gier: -.70 },
      { vx:  1, vz: -1, gier: -.70 },
      { vx: -1, vz: -1, gier:  .70 }
    ];

    ausleger.forEach(function (a, i) {
      var ex = a.vx * .62, ez = a.vz * .42;      /* Ende des Auslegers */
      var mx = a.vx * .33, mz = a.vz * .22;      /* Mitte des Auslegers */

      teile.push(['muffe', a.vx * .16, dy + .01, a.vz * .11, kipp, 0, w.PI / 2, kohle]);
      teile.push(['rohr',  mx, dy + .01, mz, kipp, a.gier, w.PI / 2, kohle]);
      teile.push(['gondel', ex, dy + .08, ez, kipp, 0, 0, kohle]);
      teile.push(['kappe',  ex, dy + .20, ez, kipp, 0, 0, grau]);

      /* Zweiblatt-Rotor: ein durchgehendes Blatt mittig auf der Nabe,
         jeder Motor leicht anders angestellt (wie im Stillstand). */
      var drehung = a.gier + i * .46;
      teile.push(['blattSpitz', ex, dy + .235, ez, kipp + .04, drehung, 0, spitze]);
      teile.push(['blatt',      ex, dy + .240, ez, kipp + .04, drehung, 0, hell]);
    });

    /* ---------- Fahrwerk: zwei V-Streben mit Kufen ---------- */
    [-1, 1].forEach(function (v) {
      teile.push(['beinSchraeg', v * .22, dy - .30, 0, 0, 0, v * .42, kohle]);
      teile.push(['beinFuss',    v * .42, dy - .50, 0, w.PI / 2, 0, 0, kohle]);
    });

    /* ---------- Sprühdüse und Wasserstrahl ---------- */
    teile.push(['duese',  0, dy - .44, .08, .20, 0, 0, akzent]);
    teile.push(['strahl', -.03, dy - .68, .09, .15, 0, .05, akzent]);
    teile.push(['strahl', -.09, dy - 1.06, .11, .15, 0, .09, akzent]);

    /* ---------- Fassade darunter ---------- */
    var fy = -1.00;
    teile.push(['wand',   0, fy, 0, 0, 0, 0, putz]);
    teile.push(['gesims', 0, fy + .62, .04, 0, 0, 0, hell]);   /* frisch gereinigt */
    teile.push(['gesims', 0, fy - .62, .04, 0, 0, 0, putz]);

    [-.30, .30].forEach(function (x) {
      [fy + .26, fy - .28].forEach(function (y) {
        teile.push(['fenster', x, y, .16, 0, 0, 0, akzent]);
      });
    });

    teile.push(['tropfen', -.26, fy + .56, .22, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .44, fy + .24, .20, 0, 0, 0, akzent]);
    teile.push(['tropfen', -.50, fy - .10, .24, 0, 0, 0, akzent]);
    teile.push(['tropfen',  .18, fy - .50, .21, 0, 0, 0, akzent]);

    return { formen: formen, teile: teile };
  }
};
