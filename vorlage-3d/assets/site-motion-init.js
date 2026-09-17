/* No content is hidden until the full enhancement script has initialized. */
(() => {
  let paused = false;
  try { paused = localStorage.getItem('site-motion-paused') === 'true'; } catch {}
  if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-off');
  }
})();
