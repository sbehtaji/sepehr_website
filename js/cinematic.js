(function () {
  'use strict';

  const section = document.getElementById('cinematic');
  const video   = document.getElementById('cinematic-video');
  const fill    = document.getElementById('cine-progress-fill');

  if (!section || !video) return;

  gsap.registerPlugin(ScrollTrigger);

  // Overlay definitions: [id, fadeIn-start%, peak%, fadeOut-end%]
  // Mapped to 6-clip video:
  //  0-17%  → clip1 (brain MRI + DNA)
  //  17-33% → clip2 (explosion)
  //  33-50% → clip3 (CT segmentation)
  //  50-67% → clip4 (three streams converge)
  //  67-83% → clip5 (neural network alive)
  //  83-100%→ clip6 (hands + panels)
  const overlays = [
    { id: 'cine-overlay-1', inStart: 0.04, inEnd: 0.12, outStart: 0.20, outEnd: 0.28 },
    { id: 'cine-overlay-2', inStart: 0.28, inEnd: 0.36, outStart: 0.44, outEnd: 0.52 },
    { id: 'cine-overlay-3', inStart: 0.52, inEnd: 0.60, outStart: 0.68, outEnd: 0.76 },
    { id: 'cine-overlay-4', inStart: 0.80, inEnd: 0.88, outStart: 0.96, outEnd: 1.00 },
  ];

  function setupCinematic(duration) {
    // ── Scroll → video.currentTime ──────────────────────────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate(self) {
        const t = self.progress * duration;
        // iOS Safari: only seek when paused to avoid stutter
        if (Math.abs(video.currentTime - t) > 0.08) {
          video.currentTime = t;
        }
        // Progress bar
        if (fill) fill.style.width = (self.progress * 100).toFixed(2) + '%';
        // Overlays driven by raw progress value
        updateOverlays(self.progress);
      },
    });
  }

  function updateOverlays(p) {
    overlays.forEach(({ id, inStart, inEnd, outStart, outEnd }) => {
      const el = document.getElementById(id);
      if (!el) return;

      let opacity = 0;
      let y = 18;

      if (p >= inStart && p < inEnd) {
        // Fading in
        const t = (p - inStart) / (inEnd - inStart);
        opacity = t;
        y = 18 * (1 - t);
      } else if (p >= inEnd && p < outStart) {
        // Fully visible
        opacity = 1;
        y = 0;
      } else if (p >= outStart && p < outEnd) {
        // Fading out
        const t = (p - outStart) / (outEnd - outStart);
        opacity = 1 - t;
        y = -14 * t;
      }

      el.style.opacity = opacity;
      el.style.transform = `translateY(${y}px)`;
    });
  }

  // ── Boot sequence ─────────────────────────────────────────────
  function boot() {
    video.muted = true;
    video.load();

    if (video.readyState >= 1 && video.duration) {
      setupCinematic(video.duration);
    } else {
      video.addEventListener('loadedmetadata', () => {
        setupCinematic(video.duration);
      }, { once: true });
    }
  }

  // Run after DOM + GSAP are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
