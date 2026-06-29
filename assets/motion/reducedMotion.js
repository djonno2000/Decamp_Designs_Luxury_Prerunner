// reducedMotion.js — single source of truth for the reduced-motion preference.
const QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia(QUERY).matches);
}

// Subscribe to changes (user toggles OS setting). Returns an unsubscribe fn.
export function onReducedMotionChange(cb) {
  if (!window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  const handler = (e) => cb(e.matches);
  if (mq.addEventListener) mq.addEventListener('change', handler);
  else mq.addListener(handler); // older Safari
  return () => {
    if (mq.removeEventListener) mq.removeEventListener('change', handler);
    else mq.removeListener(handler);
  };
}
