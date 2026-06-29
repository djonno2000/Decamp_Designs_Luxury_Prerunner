// lenis.js — smooth-scroll init (vendored Lenis, loaded as window.Lenis).
// Returns the Lenis instance, or null when smooth scroll should be skipped
// (reduced-motion preference, or the library isn't present).
import { prefersReducedMotion } from './reducedMotion.js';

export function initLenis(opts = {}) {
  if (prefersReducedMotion()) return null;
  if (typeof window.Lenis === 'undefined') return null;

  const lenis = new window.Lenis(Object.assign({
    duration: 1.05,
    // expo-out — weighted, machined, no overshoot
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  }, opts));

  return lenis;
}
