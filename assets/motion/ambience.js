// ambience.js — restrained ambient particle field on a 2D canvas (no WebGL needed, so it works
// even on the no-WebGL tier). Desert "dust" (trophy-truck) or weld-spark "embers" (DriftCast),
// drifting slowly and reacting gently to the cursor. Gated off for reduced-motion / low tier;
// particle count scales down on mobile; suspends when offscreen.
import { prefersReducedMotion } from './reducedMotion.js';
import { getDeviceTier } from '../three/deviceTier.js';

export function initAmbience(host, opts = {}) {
  if (prefersReducedMotion()) return null;
  const tier = getDeviceTier();
  if (tier === 'low' || tier === 'none') return null;

  const mode = opts.mode || host.dataset.ambience || 'dust';
  const mobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const isEmber = mode === 'ember';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '0' });
  host.style.position = host.style.position || 'relative';
  host.insertBefore(canvas, host.firstChild);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.4);
  const COUNT = Math.round((mobile ? 26 : tier === 'high' ? 70 : 44) * (isEmber ? 0.8 : 1));
  const ptr = { x: -9999, y: -9999 };
  let raf = 0, visible = true, parts = [];

  function size() {
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const rnd = (a, b) => a + Math.random() * (b - a);   // Math.random ok in the browser

  function spawn() {
    parts = Array.from({ length: COUNT }, () => ({
      x: rnd(0, W), y: rnd(0, H),
      r: isEmber ? rnd(0.6, 1.8) : rnd(0.6, 2.4),
      vx: rnd(-0.12, 0.12) + (isEmber ? 0 : 0.06),
      vy: isEmber ? rnd(-0.5, -0.15) : rnd(-0.06, 0.06),
      a: rnd(0.15, isEmber ? 0.8 : 0.5), tw: rnd(0, Math.PI * 2),
    }));
  }

  function frame() {
    if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.tw += 0.02;
      p.x += p.vx; p.y += p.vy;
      // gentle cursor push
      const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
      if (d2 < 14000) { const f = (1 - d2 / 14000) * 0.6; p.x += (dx) * 0.002 * f * 30; p.y += (dy) * 0.002 * f * 30; }
      // wrap
      if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = isEmber ? H + 5 : -5;
      const a = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      ctx.beginPath();
      if (isEmber) {
        ctx.fillStyle = `rgba(${220 + Math.sin(p.tw) * 20 | 0},${150 + Math.sin(p.tw) * 30 | 0},90,${a})`;
        ctx.shadowColor = 'rgba(205,162,78,0.8)'; ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = `rgba(205,184,140,${a * 0.5})`; ctx.shadowBlur = 0;
      }
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(frame);
  }

  function start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  size(); spawn(); start();

  const onResize = () => { size(); spawn(); };
  const onMove = (e) => { const r = host.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
  const onLeave = () => { ptr.x = ptr.y = -9999; };
  window.addEventListener('resize', onResize);
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);

  let io;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); }, { threshold: 0.01 });
    io.observe(host);
  }

  return { destroy() { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave); io && io.disconnect(); canvas.remove(); } };
}
