(function () {
  'use strict';

  const section = document.getElementById('cinematic');
  const video   = document.getElementById('cinematic-video');
  const fill    = document.getElementById('cine-progress-fill');
  if (!section || !video) return;

  // Keep video frozen — scroll drives every frame
  video.pause();
  video.currentTime = 0;

  const overlays = [
    { id: 'cine-overlay-1', i0: 0.04, i1: 0.13, o0: 0.22, o1: 0.30 },
    { id: 'cine-overlay-2', i0: 0.30, i1: 0.40, o0: 0.48, o1: 0.56 },
    { id: 'cine-overlay-3', i0: 0.56, i1: 0.65, o0: 0.73, o1: 0.80 },
    { id: 'cine-overlay-4', i0: 0.82, i1: 0.90, o0: 0.97, o1: 1.00 },
  ];

  /* ── scroll progress 0→1 ── */
  function getProgress() {
    const top       = section.getBoundingClientRect().top;
    const scrollable = section.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -top / scrollable));
  }

  /* ── drive overlay opacity + y ── */
  function updateOverlays(p) {
    overlays.forEach(({ id, i0, i1, o0, o1 }) => {
      const el = document.getElementById(id);
      if (!el) return;
      let opacity = 0, y = 20;
      if (p >= i0 && p < i1) {
        const t = (p - i0) / (i1 - i0);
        opacity = t;
        y = 20 * (1 - t);
      } else if (p >= i1 && p < o0) {
        opacity = 1;
        y = 0;
      } else if (p >= o0 && p < o1) {
        const t = (p - o0) / (o1 - o0);
        opacity = 1 - t;
        y = -16 * t;
      }
      el.style.opacity  = opacity;
      el.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
    });
  }

  /* ── main update loop ── */
  let rafId = null;

  function update() {
    rafId = null;
    const p = getProgress();

    // Seek video
    if (video.duration && video.readyState >= 2) {
      const target = p * video.duration;
      video.currentTime = target;
    }

    // Progress bar
    if (fill) fill.style.width = (p * 100).toFixed(2) + '%';

    // Overlays
    updateOverlays(p);
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── boot: wait for video to be ready ── */
  function boot() {
    video.muted = true;
    // Force browser to load enough data for seeking
    video.addEventListener('canplay', function onReady() {
      video.pause();
      update(); // set initial frame
      video.removeEventListener('canplay', onReady);
    });
    video.load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
