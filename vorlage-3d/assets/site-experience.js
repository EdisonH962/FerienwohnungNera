/* Progressive enhancement. No framework, scroll hijacking, or personal-data storage. */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const connection = navigator.connection;
  const clamp = (min, max, value) => Math.max(min, Math.min(max, value));
  let paused = false;
  try { paused = localStorage.getItem('site-motion-paused') === 'true'; } catch {}
  const motion = () => !paused && !reduced.matches && !connection?.saveData;
  const behavior = () => motion() ? 'smooth' : 'auto';
  const main = $('#main');
  const header = $('#siteHeader');
  const menu = $('#menuOverlay');
  const menuToggle = $('#menuToggle');
  const motionToggle = $('#motionToggle');
  const sticky = $('#stickyCta');
  const lightbox = $('#lightbox');
  const chapterRail = $('#chapterRail');
  const chapterProgress = $('#chapterProgress');
  const focusHalo = $('#focusHalo');
  let menuOpen = false;
  let lightboxOpen = false;
  let previousFocus = null;

  function syncPageLock() {
    main.inert = menuOpen || lightboxOpen;
    header.inert = lightboxOpen;
    chapterRail.inert = menuOpen || lightboxOpen;
    sticky.inert = menuOpen || lightboxOpen || !sticky.classList.contains('is-visible');
    $('.logo').inert = menuOpen;
    document.body.style.overflow = menuOpen || lightboxOpen ? 'hidden' : '';
    window.dispatchEvent(new CustomEvent('site:overlaychange', {detail:{open:menuOpen || lightboxOpen}}));
  }
  function setMenu(open, restoreFocus = true) {
    menuOpen = open;
    menu.inert = !open;
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    syncPageLock();
    if (open) $('a', menu).focus({preventScroll: true});
    else if (restoreFocus) menuToggle.focus({preventScroll: true});
  }
  menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  $$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
  function trapFocus(event, controls) {
    const visible = controls.filter(el => !el.disabled && el.getClientRects().length);
    if (!visible.length) return;
    const first = visible[0], last = visible[visible.length - 1];
    if (event.shiftKey && (document.activeElement === first || !visible.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !visible.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }

  $$('.whatsapp-link').forEach(link => {
    link.href = 'https://wa.me/{{TEL_INTL}}?text=' + encodeURIComponent('Hallo, ich interessiere mich für die {{FIRMA_LANG}} und möchte gerne mehr erfahren.');
  });

  // Videos only load near their chapter and stop offscreen, in hidden tabs, or on pause.
  const videoStates = $$('[data-video]').map(bg => ({bg, scene: bg.parentElement, visible: false, video: null, failed: false}));
  function syncVideo(state) {
    const shouldPlay = state.visible && motion() && !document.hidden && !menuOpen && !lightboxOpen && state.bg.id !== 'bgHero';
    if (!shouldPlay) {
      state.video?.pause();
      if (!motion()) state.bg.classList.remove('is-playing');
      return;
    }
    if (state.failed) return;
    if (!state.video) {
      const src = window.SITE_MEDIA?.[state.bg.dataset.video];
      if (!src) return;
      const video = document.createElement('video');
      state.video = video;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      video.addEventListener('playing', () => {
        if (motion() && state.visible && !document.hidden) state.bg.classList.add('is-playing');
        else video.pause();
      });
      video.addEventListener('error', () => {
        state.failed = true;
        state.bg.classList.remove('is-playing');
      });
      video.src = src;
      state.bg.append(video);
    }
    if (state.video.paused) state.video.play().catch(() => state.bg.classList.remove('is-playing'));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = videoStates.find(item => item.scene === entry.target);
        if (state) { state.visible = entry.isIntersecting; syncVideo(state); }
      });
    }, {rootMargin: '80px', threshold: 0});
    videoStates.forEach(state => observer.observe(state.scene));
  } else {
    // Older browsers get a single ambient hero rather than five simultaneous streams.
    if (videoStates[0]) { videoStates[0].visible = true; syncVideo(videoStates[0]); }
  }

  const scenes = $$('[data-scene]');
  const moments = $$('.image-break');
  if ('IntersectionObserver' in window) {
    const effectObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('fx-in-view',entry.isIntersecting)),{rootMargin:'60px'});
    [...moments,scenes[0]].forEach(el=>effectObserver.observe(el));
  } else [...moments,scenes[0]].forEach(el=>el.classList.add('fx-in-view'));
  const progress = $('#scrollProgress');
  const bookingSection = $('#anfrage');
  const strip = $('#galleryStrip');
  const previous = $('#galleryPrev');
  const next = $('#galleryNext');
  const galleryCount = $('#galleryCount');
  let tiles = [];
  let galleryIndex = 0;
  let frameId = 0;
  const tiltUpdates = new Map();
  const magnetUpdates = new Map();
  let cursorPoint = null;
  function requestFrame() {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(updateFrame);
  }
  function updateFrame() {
    frameId = 0;
    const vh = window.innerHeight, vw = window.innerWidth, y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 14);
    progress.style.transform = 'scaleX(' + clamp(0, 1, y / Math.max(1, root.scrollHeight - vh)) + ')';
    chapterProgress.style.transform = 'scaleY(' + clamp(0, 1, y / Math.max(1, root.scrollHeight - vh)) + ')';
    const bookingRect = bookingSection.getBoundingClientRect();
    const heroRect = scenes[0].getBoundingClientRect();
    sticky.classList.toggle('is-visible', heroRect.bottom < 70 && bookingRect.top > vh && !menuOpen && !lightboxOpen);
    sticky.inert = !sticky.classList.contains('is-visible');
    let current = scenes[0].id;
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      if (rect.top <= vh * .38) current = scene.id;
      if (!motion() || rect.bottom < -100 || rect.top > vh + 100) return;
      const bg = $('.scene__bg', scene);
      const amount = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height);
      if (bg) {
        bg.style.transform = 'translate3d(0,' + (amount * -46).toFixed(2) + 'px,0)';
        bg.style.setProperty('--vscale', (1.16 - Math.min(Math.abs(amount) * .12,.06)).toFixed(3));
      }
    });
    [...$$('a', menu), ...$$('a', chapterRail)].forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (motion()) {
      moments.forEach(moment => {
        const rect = moment.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const position = clamp(-1, 1, (rect.top + rect.height / 2 - vh / 2) / vh);
        const power = vw < 760 ? .5 : 1;
        moment.style.setProperty('--moment-text-y', (position * 20 * power).toFixed(2) + 'px');
        moment.style.setProperty('--ipy', (position * 24).toFixed(2) + 'px');
        moment.style.setProperty('--ring-x', (position * 40 * power).toFixed(2) + 'deg');
        moment.style.setProperty('--orbit-turn', (position * 65 * power).toFixed(2) + 'deg');
      });
    }
    updateGallery();
    tiltUpdates.forEach((point, el) => {
      if (!motion() || !pointer.matches) return;
      el.classList.add('is-tilting');
      el.style.setProperty('--tilt-x', point.x + 'deg');
      el.style.setProperty('--tilt-y', point.y + 'deg');
      el.style.setProperty('--light-x', point.lightX + '%');
      el.style.setProperty('--light-y', point.lightY + '%');
    });
    tiltUpdates.clear();
    magnetUpdates.forEach((point,el) => {
      if (!motion() || !pointer.matches) return;
      el.classList.add('is-magnetic');
      el.style.setProperty('--magnet-x',point.x+'px');
      el.style.setProperty('--magnet-y',point.y+'px');
    });
    magnetUpdates.clear();
    if (cursorPoint && motion() && pointer.matches) {
      focusHalo.style.transform = 'translate3d('+cursorPoint.x+'px,'+cursorPoint.y+'px,0)';
      focusHalo.classList.toggle('is-active',cursorPoint.active);
    }
  }
  window.addEventListener('scroll', requestFrame, {passive: true});
  strip.addEventListener('scroll', requestFrame, {passive: true});
  window.addEventListener('resize', requestFrame, {passive: true});
  document.fonts?.ready.then(requestFrame);
  $$('picture img').forEach(img => img.addEventListener('error', () => {
    const sources = $$('source',img.parentElement);
    if (sources.length) { sources.forEach(source=>source.remove()); img.src=img.getAttribute('src'); }
  },{once:true}));
  if ('ResizeObserver' in window) new ResizeObserver(requestFrame).observe(main);

  // A few independent planes: subtle tilt on pictures and amenity/benefit tiles only.
  const tiltElements = $$('[data-tilt], .amenity, .benefit');
  function resetTilt(el) {
    tiltUpdates.delete(el);
    el.classList.remove('is-tilting');
    ['--tilt-x','--tilt-y','--light-x','--light-y'].forEach(key => el.style.removeProperty(key));
  }
  tiltElements.forEach(el => {
    el.addEventListener('pointermove', event => {
      if (!motion() || !pointer.matches || event.pointerType !== 'mouse') return;
      const rect = (el.closest('[data-tilt-surface]') || el).getBoundingClientRect();
      const x = clamp(0, 1, (event.clientX - rect.left) / rect.width);
      const y = clamp(0, 1, (event.clientY - rect.top) / rect.height);
      const strength = Number(el.dataset.tiltStrength || 3);
      tiltUpdates.set(el, {x: ((.5 - y) * strength * 2).toFixed(2), y: ((x - .5) * strength * 2).toFixed(2), lightX: x * 100, lightY: y * 100});
      requestFrame();
    }, {passive: true});
    el.addEventListener('pointerleave', () => resetTilt(el));
    el.addEventListener('pointercancel', () => resetTilt(el));
  });
  pointer.addEventListener('change', () => { tiltElements.forEach(resetTilt); syncMotion(); });
  const magneticElements = $$('.btn-ring, .gallery-nav, .header-booking');
  function resetMagnet(el) {
    magnetUpdates.delete(el); el.classList.remove('is-magnetic');
    el.style.removeProperty('--magnet-x'); el.style.removeProperty('--magnet-y');
  }
  magneticElements.forEach(el => {
    el.addEventListener('pointermove', event => {
      if (!motion() || !pointer.matches || event.pointerType !== 'mouse' || el.disabled) return;
      const rect=el.getBoundingClientRect(), strength=el.classList.contains('btn-ring')?6:3;
      magnetUpdates.set(el,{x:(clamp(-.5,.5,(event.clientX-rect.left)/rect.width-.5)*strength*2).toFixed(2),y:(clamp(-.5,.5,(event.clientY-rect.top)/rect.height-.5)*strength*2).toFixed(2)});
      requestFrame();
    },{passive:true});
    el.addEventListener('pointerleave',()=>resetMagnet(el));
    el.addEventListener('pointercancel',()=>resetMagnet(el));
  });
  document.addEventListener('pointermove',event=>{
    if (!motion() || !pointer.matches || event.pointerType!=='mouse' || innerWidth<901) return;
    cursorPoint={x:event.clientX,y:event.clientY,active:!!event.target.closest('a, button:not(:disabled), .gallery-card')};
    requestFrame();
  },{passive:true});
  document.addEventListener('pointerleave',()=>{cursorPoint=null;focusHalo.classList.remove('is-active');});

  function refreshGallery() {
    tiles = $$('.gallery-card', strip);
    tiles.forEach(tile => {
      const img = $('img', tile);
      img.draggable = false;
      img.decoding = 'async';
      if (!$('.gallery-expand', tile)) {
        const expand = document.createElement('span');
        expand.className = 'gallery-expand'; expand.textContent = '↗';
        expand.setAttribute('aria-hidden', 'true'); tile.append(expand);
      }
    });
    requestFrame();
  }
  function updateGallery() {
    if (!tiles.length) return;
    const center = strip.scrollLeft + strip.clientWidth / 2;
    let nearest = 0, distance = Infinity;
    const rect = strip.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    tiles.forEach((tile, i) => {
      const offset = tile.offsetLeft + tile.offsetWidth / 2 - center;
      if (Math.abs(offset) < distance) { nearest = i; distance = Math.abs(offset); }
      if (motion() && visible && Math.abs(offset) < strip.clientWidth) {
        const position = clamp(-1, 1, offset / strip.clientWidth);
        tile.style.setProperty('--gallery-turn', (position * -6).toFixed(2) + 'deg');
        tile.style.setProperty('--gallery-rise', (Math.abs(position) * 12).toFixed(2) + 'px');
      }
    });
    galleryIndex = nearest;
    galleryCount.textContent = String(nearest + 1).padStart(2, '0') + ' / ' + String(tiles.length).padStart(2, '0');
    previous.disabled = strip.scrollLeft <= 2;
    next.disabled = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2;
  }
  function goToTile(index, focus = false) {
    const target = tiles[clamp(0, tiles.length - 1, index)];
    if (!target) return;
    const left = target.offsetLeft - (strip.clientWidth - target.offsetWidth) / 2;
    strip.scrollTo({left: clamp(0, strip.scrollWidth - strip.clientWidth, left), behavior: behavior()});
    if (focus) target.focus({preventScroll: true});
  }
  previous.addEventListener('click', () => goToTile(galleryIndex - 1));
  next.addEventListener('click', () => goToTile(galleryIndex + 1));
  refreshGallery();
  new MutationObserver(refreshGallery).observe(strip, {childList: true});

  let drag = null, suppressUntil = 0;
  strip.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a')) return;
    drag = {x: event.clientX, left: strip.scrollLeft, moved: false};
  });
  window.addEventListener('pointermove', event => {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 6) drag.moved = true;
    if (drag.moved) {
      event.preventDefault(); strip.classList.add('is-dragging'); strip.scrollLeft = drag.left - dx;
    }
  });
  function endDrag() {
    if (drag?.moved) suppressUntil = performance.now() + 160;
    drag = null; strip.classList.remove('is-dragging');
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', () => { endDrag(); tiltElements.forEach(resetTilt); });

  let lightboxIndex = 0;
  const lightboxImage = $('#lbImg');
  const lightboxClose = $('#lbClose');
  const lightboxError = $('#lbError');
  function openLightbox(index) {
    if (!tiles.length) return;
    const firstOpen = !lightboxOpen;
    if (firstOpen) previousFocus = document.activeElement;
    lightboxIndex = (index + tiles.length) % tiles.length;
    const tile = tiles[lightboxIndex], img = $('img', tile);
    lightboxError.hidden = true;
    lightboxImage.hidden = false;
    lightbox.classList.add('is-loading');
    lightboxImage.alt = img.alt;
    lightboxImage.src = tile.dataset.fullSrc || img.currentSrc || img.src;
    $('#lbCaption').textContent = ($('figcaption', tile)?.firstChild?.textContent || img.alt) + ' · ' + (lightboxIndex + 1) + ' / ' + tiles.length;
    const attribution = $('#lbAttribution');
    attribution.replaceChildren();
    if (tile.dataset.authors) {
      try {
        JSON.parse(tile.dataset.authors).forEach(author => {
          const link = document.createElement('a');
          link.textContent = author.displayName || 'Google Maps';
          if (/^https:\/\//i.test(author.uri || '')) link.href = author.uri;
          link.target = '_blank'; link.rel = 'noopener noreferrer'; attribution.append(link);
        });
      } catch {}
    }
    lightboxOpen = true;
    lightbox.inert = false;
    lightbox.classList.add('is-open');
    syncPageLock();
    videoStates.forEach(syncVideo);
    if (firstOpen) lightboxClose.focus({preventScroll: true});
  }
  function closeLightbox() {
    lightboxOpen = false;
    lightbox.classList.remove('is-open');
    lightbox.inert = true;
    syncPageLock();
    videoStates.forEach(syncVideo);
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll: true});
    requestFrame();
  }
  lightboxImage.addEventListener('load', () => lightbox.classList.remove('is-loading'));
  lightboxImage.addEventListener('error', () => {
    lightbox.classList.remove('is-loading'); lightboxImage.hidden = true; lightboxError.hidden = false;
  });
  strip.addEventListener('click', event => {
    const tile = event.target.closest('.gallery-card');
    if (!tile || performance.now() < suppressUntil || event.target.closest('a')) return;
    openLightbox(tiles.indexOf(tile));
  });
  strip.addEventListener('keydown', event => {
    if (event.target.closest('a')) return;
    const tile = event.target.closest('.gallery-card');
    const index = tile ? tiles.indexOf(tile) : galleryIndex;
    if (tile && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openLightbox(index); }
    if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      goToTile(event.key === 'Home' ? 0 : event.key === 'End' ? tiles.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  lightboxClose.addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => openLightbox(lightboxIndex - 1));
  $('#lbNext').addEventListener('click', () => openLightbox(lightboxIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  let touchStart = null;
  lightboxImage.addEventListener('touchstart', event => { touchStart = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null; }, {passive: true});
  lightboxImage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x, dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) openLightbox(lightboxIndex + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, {passive: true});
  document.addEventListener('keydown', event => {
    if (lightboxOpen) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') { event.preventDefault(); openLightbox(lightboxIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); openLightbox(lightboxIndex + 1); }
      if (event.key === 'Tab') trapFocus(event, $$('button, a[href]', lightbox));
    } else if (menuOpen) {
      if (event.key === 'Escape') setMenu(false);
      if (event.key === 'Tab') trapFocus(event, [menuToggle, ...$$('a', menu)]);
    }
  });

  $('#mapShieldBtn')?.addEventListener('click', () => {
    const shield = $('#mapShield');
    const iframe = document.createElement('iframe');
    iframe.src = shield.dataset.src; iframe.title = 'Karte {{ORT}}'; iframe.loading = 'lazy';
    shield.replaceWith(iframe);
    iframe.focus();
  });
  function openLinkedDetails() {
    const details = [$('#impressum'), $('#datenschutz')].find(el => '#' + el.id === location.hash);
    if (details) details.open = true;
  }
  window.addEventListener('hashchange', openLinkedDetails);
  openLinkedDetails();

  // Native validation, local calendar dates, and an honest mail-app handoff.
  const form = $('#bookingForm');
  const checkin = $('#bfCheckin'), checkout = $('#bfCheckout'), guests = $('#bfGuests'), name = $('#bfName');
  const error = $('#bfError'), summary = $('#bookingSummary'), status = $('#bookingStatus');
  const localDate = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
  const dayNumber = value => { const [y,m,d] = value.split('-').map(Number); return Date.UTC(y,m-1,d) / 86400000; };
  function nextDay(value) {
    const [y,m,d] = value.split('-').map(Number);
    return localDate(new Date(y,m-1,d+1,12));
  }
  function dateRules() {
    const today = localDate(new Date());
    checkin.min = today;
    checkout.min = checkin.value && checkin.value >= today ? nextDay(checkin.value) : nextDay(today);
    checkout.setCustomValidity(checkout.value && checkin.value && checkout.value <= checkin.value ? 'Die Abreise muss nach der Anreise liegen.' : '');
    const nights = checkin.value && checkout.value ? dayNumber(checkout.value) - dayNumber(checkin.value) : 0;
    summary.textContent = nights > 0 && checkin.validity.valid && checkout.validity.valid
      ? nights + (nights === 1 ? ' Nacht' : ' Nächte') + ' · ' + guests.value + (guests.value === '1' ? ' Gast' : ' Gäste') + ' · unverbindliche Anfrage'
      : 'Wählen Sie Ihren Wunschzeitraum.';
  }
  form.addEventListener('input', event => {
    if (event.target === name) name.setCustomValidity(name.value && !name.value.trim() ? 'Bitte geben Sie Ihren Namen ein.' : '');
    dateRules();
    event.target.removeAttribute('aria-invalid');
    error.classList.remove('is-visible'); status.hidden = true;
  });
  form.addEventListener('change', dateRules);
  form.addEventListener('invalid', event => {
    event.target.setAttribute('aria-invalid', 'true');
    error.textContent = 'Bitte prüfen Sie die markierten Felder und Ihren Reisezeitraum.';
    error.classList.add('is-visible');
  }, true);
  form.addEventListener('submit', event => {
    event.preventDefault(); dateRules();
    name.setCustomValidity(name.value.trim() ? '' : 'Bitte geben Sie Ihren Namen ein.');
    if (!form.reportValidity()) return;
    error.classList.remove('is-visible');
    const format = value => value.split('-').reverse().join('.');
    const lines = ['Guten Tag, ich möchte die {{FIRMA_LANG}} unverbindlich anfragen.', '',
      'Anreise: ' + format(checkin.value), 'Abreise: ' + format(checkout.value),
      'Nächte: ' + (dayNumber(checkout.value) - dayNumber(checkin.value)), 'Gäste: ' + guests.value, '',
      'Name: ' + name.value.trim(), 'E-Mail: ' + $('#bfEmail').value.trim(),
      'Telefon: ' + ($('#bfPhone').value.trim() || '-'), '', 'Nachricht:', $('#bfMessage').value.trim() || '-'];
    status.hidden = false;
    location.href = 'mailto:{{EMAIL}}?subject=' + encodeURIComponent('Buchungsanfrage {{FIRMA_LANG}}') + '&body=' + encodeURIComponent(lines.join('\n'));
  });
  dateRules();

  // The cinema module owns the single decorative canvas and follows this preference.
  function syncMotion() {
    root.classList.toggle('motion-off', !motion());
    const off = !motion();
    motionToggle.setAttribute('aria-pressed', String(off));
    motionToggle.setAttribute('aria-label', off ? 'Animationen aktivieren' : 'Animationen pausieren');
    motionToggle.disabled = reduced.matches || Boolean(connection?.saveData);
    motionToggle.title = reduced.matches ? 'Reduzierte Bewegung ist in Ihrem Gerät aktiviert.' : connection?.saveData ? 'Der Datensparmodus Ihres Geräts ist aktiv.' : off ? 'Animationen sind pausiert.' : 'Animationen pausieren';
    $('.motion-icon', motionToggle).textContent = off ? '▷' : 'Ⅱ';
    if (off) {
      $$('.reveal, .reveal-line').forEach(el => el.classList.add('is-visible'));
      tiltElements.forEach(resetTilt);
      magneticElements.forEach(resetMagnet);
    }
    focusHalo.hidden = off || !pointer.matches;
    if (off) { cursorPoint=null; focusHalo.classList.remove('is-active'); }
    videoStates.forEach(syncVideo);
    window.dispatchEvent(new CustomEvent('site:motionchange', {detail:{enabled:motion()}}));
    requestFrame();
  }
  motionToggle.hidden = false;
  window.addEventListener('site:worldready', () => videoStates.forEach(syncVideo));
  motionToggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('site-motion-paused', String(paused)); } catch {}
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  connection?.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0; tiltElements.forEach(resetTilt);
    }
    syncMotion();
  });
  new MutationObserver(() => { videoStates.forEach(syncVideo); requestFrame(); }).observe(document.body, {attributes:true,attributeFilter:['class']});

  // Reveal once. Motion preferences also apply to live changes, not just initial load.
  $$('.amenity-grid, .benefit-row').forEach(row => Array.from(row.children).forEach((el,i) => el.style.setProperty('--item-order', i)));
  function reveal(el) {
    el.classList.add('is-visible');
    if (motion()) el.classList.add('is-revealing');
  }
  if ('IntersectionObserver' in window && motion()) {
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
    }), {threshold: .08, rootMargin: '0px 0px -18px 0px'});
    $$('.reveal, .reveal-line').forEach(el => observer.observe(el));
  } else $$('.reveal, .reveal-line').forEach(reveal);
  const counters = $$('[data-count]');
  function count(el) {
    const target = Number(el.dataset.count), start = performance.now();
    function step(now) {
      const amount = motion() ? clamp(0,1,(now-start)/1100) : 1;
      el.textContent = String(Math.round((1-Math.pow(1-amount,3))*target));
      if (amount < 1 && !document.hidden) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && motion()) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { count(entry.target); observer.unobserve(entry.target); }
    }), {threshold:.5});
    counters.forEach(el => observer.observe(el));
  }
  syncPageLock();
  syncMotion();
  requestFrame();
})();
