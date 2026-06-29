// hero.js — wire up every [data-hero] section: pick the chassis spec, gate on device tier +
// reduced-motion, and either (a) boot the WebGL fly-through with a ScrollTrigger scrub, or
// (b) inject the static SVG engineering still. Always degrades gracefully.
//
// Markup contract:
//   <section data-hero data-chassis="truck|driftcast" class="sf-section">
//     <div class="sf-stage" data-hero-stage>
//       <div class="sf-canvas" data-hero-canvas></div>
//       <div class="sf-fallback" data-hero-fallback></div>
//     </div>
//   </section>
import { getDeviceTier } from './deviceTier.js';
import { spaceframeSVG } from './fallbackSVG.js';
import { prefersReducedMotion } from '../motion/reducedMotion.js';

const SPECS = {
  truck: () => import('../data/chassis.truck.js').then((m) => m.truckChassis),
  driftcast: () => import('../data/chassis.driftcast.js').then((m) => m.driftcastChassis),
};

function showFallback(host, spec) {
  const fb = host.querySelector('[data-hero-fallback]');
  const canvas = host.querySelector('[data-hero-canvas]');
  if (canvas) canvas.hidden = true;
  if (fb) { fb.innerHTML = spaceframeSVG(spec); fb.hidden = false; }
  host.classList.add('is-fallback');
}

async function initOne(host) {
  const key = host.dataset.chassis || 'truck';
  let spec;
  try { spec = await (SPECS[key] || SPECS.truck)(); } catch (e) { return; }

  const params = new URLSearchParams(location.search);
  const forcedT = params.has('t') ? parseFloat(params.get('t')) : null;
  const forceFallback = params.has('fallback');
  const reduced = prefersReducedMotion();
  const tier = getDeviceTier();

  // No-WebGL / low tier / reduced-motion (and no debug override) → static SVG still.
  if (forceFallback || !window.THREE || tier === 'none' || tier === 'low' || (reduced && forcedT === null)) {
    showFallback(host, spec);
    return;
  }

  const canvas = host.querySelector('[data-hero-canvas]');
  let scene;
  try {
    const { HeroScene } = await import('./scene.js');
    scene = new HeroScene(canvas, spec, { tier, allowIdle: !reduced });
  } catch (e) {
    console.warn('[hero] WebGL init failed, using SVG fallback:', e && e.message);
    showFallback(host, spec);
    return;
  }

  // debug / fixed progress
  if (forcedT !== null && !Number.isNaN(forcedT)) { scene.setIdle(false); scene.setProgress(forcedT); return; }

  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) { scene.setProgress(1); return; }   // no scrub → show assembled
  gsap.registerPlugin(ScrollTrigger);

  const stage = host.querySelector('[data-hero-stage]') || canvas;
  ScrollTrigger.create({
    trigger: host, start: 'top top', end: 'bottom bottom', pin: stage, scrub: 0.6,
    onUpdate: (self) => scene.setProgress(self.progress),
    onLeave: () => scene.setProgress(1),
    onLeaveBack: () => scene.setProgress(0),
  });
  scene.setProgress(0);
}

function boot() { document.querySelectorAll('[data-hero]').forEach(initOne); }
if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
