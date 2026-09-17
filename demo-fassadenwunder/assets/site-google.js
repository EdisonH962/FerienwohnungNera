/* Preserve FASSADEN-WUNDER's own Places configuration. Never borrow another business's key. */
(() => {
  'use strict';
  const config = window.GOOGLE_PLACES;
  const note = document.getElementById('gNote');
  const grid = document.getElementById('gReviews');
  const strip = document.getElementById('galleryStrip');
  const key = config?.apiKey;
  // Only a device-local motion preference is stored by the experience script.
  try { sessionStorage.removeItem('gPlaceCache'); } catch {}
  if (!key || key.includes('HIER_EINF')) {
    note.textContent = 'Weitere Bewertungen finden Sie direkt auf Google.';
    note.hidden = false;
    return;
  }
  const safeUrl = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  };
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const externalLink = (className, label, uri) => {
    const url = safeUrl(uri);
    const el = element(url ? 'a' : 'span', className, label);
    if (url) { el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
    return el;
  };
  function stars(rating) {
    const wrap = element('div', 'review-card__stars');
    wrap.setAttribute('aria-label', rating + ' von 5 Sternen');
    for (let i = 1; i <= 5; i++) {
      const star = element('span', i > Math.round(rating) ? 'off' : '', '★');
      star.setAttribute('aria-hidden', 'true'); wrap.append(star);
    }
    return wrap;
  }
  function render(place) {
    if (Number.isFinite(place.rating)) {
      const score = document.getElementById('gScore');
      const value = place.rating.toFixed(1).replace('.', ',');
      score.replaceChildren(document.createTextNode(value), element('small', '', ' / 5'));
      score.setAttribute('aria-label', 'Google-Bewertung ' + value + ' von 5');
      document.getElementById('gStars').replaceChildren(stars(place.rating));
      document.getElementById('gCount').textContent = 'Google · ' + (Number.isFinite(place.userRatingCount) ? place.userRatingCount + ' Bewertungen' : 'Kundenbewertungen');
    }
    grid.replaceChildren();
    (place.reviews || []).slice(0,5).forEach(review => {
      const author = review.authorAttribution || {};
      const name = author.displayName || 'Google-Nutzer';
      const card = element('article', 'review-card');
      const head = element('div', 'review-card__head');
      const avatarUrl = safeUrl(author.photoUri);
      const fallback = () => element('div', 'review-card__avatar review-card__avatar--initial', name.charAt(0).toUpperCase());
      let avatar = fallback();
      if (avatarUrl) {
        avatar = element('img', 'review-card__avatar');
        avatar.src = avatarUrl; avatar.alt = ''; avatar.loading = 'lazy'; avatar.width = 46; avatar.height = 46;
        avatar.addEventListener('error', () => avatar.replaceWith(fallback()), {once:true});
      }
      const details = element('div');
      details.append(externalLink('review-card__name', name, author.uri));
      details.append(element('div', 'review-card__date', review.relativePublishTimeDescription || ''));
      head.append(avatar, details); card.append(head);
      if (Number.isFinite(review.rating)) card.append(stars(review.rating));
      card.append(element('p', 'review-card__text', review.text?.text || review.originalText?.text || 'Bewertung ohne Text.'));
      if (safeUrl(review.googleMapsUri)) card.append(externalLink('review-original', 'Auf Google ansehen ↗', review.googleMapsUri));
      grid.append(card);
    });
    (place.photos || []).slice(0,config.maxPhotos || 10).forEach((photo,i) => {
      if (!/^places\/[^/]+\/photos\/[^/]+$/.test(photo.name || '')) return;
      const fig = element('figure','gallery-card');
      fig.tabIndex = 0; fig.setAttribute('role','button'); fig.setAttribute('aria-label','Google-Foto ' + (i+1) + ' vergrößern');
      const authors = (photo.authorAttributions || []).map(author => ({displayName: author.displayName,uri:safeUrl(author.uri)}));
      fig.dataset.authors = JSON.stringify(authors);
      const img = element('img');
      img.src = 'https://places.googleapis.com/v1/' + photo.name + '/media?maxHeightPx=1100&key=' + encodeURIComponent(key);
      img.alt = 'DAS FASSADEN-WUNDER – Foto ' + (i+1) + ' aus dem Google-Unternehmensprofil';
      img.loading = 'lazy'; img.decoding = 'async'; img.width = photo.widthPx || 800; img.height = photo.heightPx || 800;
      img.addEventListener('error', () => fig.remove(), {once:true});
      const caption = element('figcaption', '', 'Google Maps · Impression');
      const attribution = element('small');
      authors.forEach((author,index) => {
        if (index) attribution.append(document.createTextNode(' · '));
        attribution.append(externalLink('',author.displayName || 'Google Maps',author.uri));
      });
      caption.append(attribution); fig.append(img,caption); strip.append(fig);
    });
    note.textContent = (place.reviews || []).length
      ? 'Google Maps · Auswahl der Rezensionen in der von Google gelieferten Reihenfolge.'
      : 'Weitere Bewertungen finden Sie direkt auf Google.';
    note.hidden = false;
  }
  let loaded = false;
  async function load() {
    if (loaded) return;
    loaded = true;
    note.hidden = false; note.textContent = 'Google-Bewertungen werden geladen …'; grid.setAttribute('aria-busy','true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(config.placeId) + '?languageCode=de&fields=rating,userRatingCount,reviews,photos&key=' + encodeURIComponent(key);
      const response = await fetch(url, {signal:controller.signal});
      if (!response.ok) throw new Error('Places unavailable');
      render(await response.json());
    } catch {
      note.textContent = 'Google-Bewertungen sind gerade nicht verfügbar. Sie können das Profil über die Links oben öffnen.';
    } finally { clearTimeout(timeout); grid.setAttribute('aria-busy','false'); }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { load(); observer.disconnect(); }
    }, {rootMargin:'200px'});
    observer.observe(document.getElementById('galerie'));
    observer.observe(document.getElementById('bewertungen'));
  } else load();
})();
