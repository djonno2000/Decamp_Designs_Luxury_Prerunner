// scrolltrigger-setup.js — wire GSAP ScrollTrigger to the Lenis scroll + ticker.
// GSAP + ScrollTrigger are vendored and loaded as window.gsap / window.ScrollTrigger.
// Returns ScrollTrigger (or null if GSAP isn't available — callers degrade gracefully).

export function initScroll(lenis) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return null;

  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    // Drive ScrollTrigger from Lenis, and Lenis from GSAP's ticker (one clock).
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  return ScrollTrigger;
}

// Convenience: a weighted fade-up batch for elements (used for heavier choreography
// than the CSS [data-reveal] path). Optional — pages can call gsap directly too.
export function fadeUpBatch(selector, opts = {}) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  ScrollTrigger.batch(selector, {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, {
      opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
      stagger: opts.stagger || 0.08, overwrite: true,
    }),
  });
}
