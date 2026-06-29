// deviceTier.js — decide how much 3D/particle work a device should attempt,
// BEFORE creating any scene. Tiers: 'high' | 'mid' | 'low' | 'none' (no WebGL).
// 'none' and reduced-motion both route to the static SVG engineering-drawing fallback.

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function getDeviceTier() {
  if (!hasWebGL()) return 'none';

  const mem = navigator.deviceMemory || 4;          // GB (Chromium only; assume 4)
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (mobile) {
    return (mem >= 6 && cores >= 6) ? 'mid' : 'low';
  }
  if (mem >= 8 && cores >= 8) return 'high';
  if (mem >= 4 && cores >= 4) return 'mid';
  return 'low';
}

// Pixel-ratio cap per tier (keeps fill-rate sane on hi-DPR screens).
export function recommendedDPR(tier) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (tier === 'high') return dpr;
  if (tier === 'mid') return Math.min(dpr, 1.5);
  return 1;
}

// Particle budget per tier (used by ambience shaders in Phase 6).
export function particleBudget(tier) {
  return { high: 1.0, mid: 0.5, low: 0.0, none: 0.0 }[tier] ?? 0;
}
