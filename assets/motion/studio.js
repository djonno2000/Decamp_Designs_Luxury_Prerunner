// studio.js — motion orchestrator. Import once per page:
//   <script src="assets/lib/gsap.min.js"></script>
//   <script src="assets/lib/ScrollTrigger.min.js"></script>
//   <script src="assets/lib/lenis.min.js"></script>
//   <script type="module" src="assets/motion/studio.js"></script>
//
// PROGRESSIVE ENHANCEMENT. The page is fully usable without it:
//  - the .js class (added by the inline head guard) hides [data-reveal] elements; if this never
//    runs they stay visible.
//  - reveals use IntersectionObserver (work even if GSAP fails). Lenis, line-split headings,
//    parallax and the ambient particle field are extras, and all bow to prefers-reduced-motion.
import { prefersReducedMotion } from './reducedMotion.js';
import { initLenis } from './lenis.js';
import { initScroll } from './scrolltrigger-setup.js';
import { splitByBR } from './splitText.js';

function showAll(els) { els.forEach((el) => el.classList.add('is-revealed')); }

function initReveals() {
  const els = Array.from(document.querySelectorAll('[data-reveal], [data-reveal-children]'));
  if (!els.length) return;
  document.querySelectorAll('[data-reveal-children]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--child', i));
  });
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) { showAll(els); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

// line-split heading reveal (mass, no bounce). [data-split] on a heading.
function initHeadings() {
  const heads = document.querySelectorAll('[data-split]');
  if (!heads.length) return;
  const gsap = window.gsap;
  if (prefersReducedMotion() || !gsap) return;   // leave headings as-is
  const run = () => heads.forEach((h) => {
    const lines = splitByBR(h);
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 115 });
    gsap.to(lines, { yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.09, delay: 0.05 });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(run));
  else requestAnimationFrame(run);
}

// light scroll parallax. [data-parallax="40"] = shift up 40% across its section.
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!els.length || prefersReducedMotion() || !gsap || !ScrollTrigger) return;
  els.forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 30;
    gsap.to(el, { yPercent: -amt, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

async function initAmbience() {
  const hosts = document.querySelectorAll('[data-ambience]');
  if (!hosts.length || prefersReducedMotion()) return;
  try {
    const { initAmbience } = await import('./ambience.js');
    hosts.forEach((h) => initAmbience(h));
  } catch (e) { /* ambience is optional */ }
}

function boot() {
  initReveals();
  if (prefersReducedMotion()) return;
  const lenis = initLenis();
  const ScrollTrigger = initScroll(lenis);
  window.__studio = { lenis, ScrollTrigger };
  initHeadings();
  initParallax();
  initAmbience();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
