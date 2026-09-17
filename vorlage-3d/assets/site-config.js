// Existing user-supplied media, booking profile and Google configuration.
var SITE_CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8m1bxNBqhjlyBCY2gFUlzpzbo/';
  var SITE_MEDIA = {
    heroVideo:    SITE_CDN + 'hf_20260709_211251_157de0c6-b408-4998-b276-48d68e3050f3.mp4', /* dunkler Wald, goldene Lichtschächte */
    heroVideo2:   SITE_CDN + 'hf_20260707_183155_d857c55d-e4a7-40a6-90d2-551214ad24a0.mp4', /* Waldhügel golden */
    interiorVideo:SITE_CDN + 'hf_20260709_211301_780e70ef-7bac-49e3-8834-deb7e3a8b449.mp4', /* dunkles Interieur, Kaminglut */
    nightVideo:   SITE_CDN + 'hf_20260709_211305_11162099-237e-4cb5-b3ad-efdc22966dff.mp4', /* Sternenhimmel über Hügeln */
    eveningVideo: SITE_CDN + 'hf_20260707_183207_509abbd6-9c07-4995-b75a-823a6e0ff7c8.mp4'  /* Abendgarten-Bokeh */
  };
var GOOGLE_PLACES = {
    apiKey: '{{GOOGLE_API_KEY}}',
    placeId: '{{GOOGLE_PLACE_ID}}',
    maxPhotos: 10           /* wie viele Profil-Fotos in die Galerie übernommen werden */
  };
