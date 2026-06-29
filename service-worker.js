/* STUDIO — offline-first service worker
 * Strategy:
 *   - CORE shell is precached atomically on install (small, certain list).
 *   - EXTENDED assets (libs, fonts.css, icons) are precached best-effort (failures ignored).
 *   - Everything else same-origin is cache-first with runtime caching, so the whole
 *     site (incl. hashed font woff2 subsets) is available offline after the first online visit.
 * Bump CACHE_VERSION whenever shell files change to force a clean update.
 */
const CACHE_VERSION = 'studio-v6-2026-06-29';
const CACHE = CACHE_VERSION;

// Atomic: install fails (and old SW stays) if any of these can't be fetched.
const CORE = [
  './',
  './index.html',
  './build-lab.html',
  './masterclass.html',
  './manifest.json',
  './favicon.svg',
  './assets/fonts/fonts.css',
  './assets/css/studio.css',
  './assets/lib/three.r128.min.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
];

// Best-effort: nice to have offline immediately, but a miss won't break install.
const EXTENDED = [
  './styleguide.html',
  // Phase-3 content pages
  './trophy-truck.html',
  './studio.html',
  './contact.html',
  './driftcast/index.html',
  './driftcast/configurator.html',
  './notebook/index.html',
  './notebook/roll-control.html',
  './notebook/drift-dynamics.html',
  // notebook schematics
  './notebook/schematics/roll-control-cross-link.svg',
  './notebook/schematics/diff-mounted-swaybar.svg',
  './notebook/schematics/dynamic-toe-camber.svg',
  './notebook/schematics/rear-toe-in-slide.svg',
  './notebook/schematics/rear-traction-geometry.svg',
  // data modules
  './assets/data/types.js',
  './assets/data/engines.js',
  './assets/data/gearboxes.js',
  './assets/data/diffs.js',
  './assets/data/suspension.js',
  './assets/data/wheels.js',
  './assets/data/articles.js',
  './assets/data/chassis.truck.js',
  './assets/data/chassis.driftcast.js',
  './assets/data/metrics.js',
  // libs + motion
  './assets/lib/OrbitControls.js',
  './assets/lib/GLTFLoader.js',
  './assets/lib/gsap.min.js',
  './assets/lib/ScrollTrigger.min.js',
  './assets/lib/lenis.min.js',
  './assets/motion/studio.js',
  './assets/motion/lenis.js',
  './assets/motion/scrolltrigger-setup.js',
  './assets/motion/splitText.js',
  './assets/motion/reducedMotion.js',
  './assets/motion/ambience.js',
  // 3D engine (Phase 4)
  './assets/three/deviceTier.js',
  './assets/three/materials.js',
  './assets/three/spaceframe.js',
  './assets/three/partSlot.js',
  './assets/three/fallbackSVG.js',
  './assets/three/scene.js',
  './assets/three/hero.js',
  './assets/three/configurator.js',
  './assets/three/configuratorSVG.js',
  './assets/icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    // best-effort, don't let failures abort install
    await Promise.allSettled(EXTENDED.map((u) => cache.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only manage our own assets

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: false });
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // cache successful, basic responses for next time
      if (res && res.status === 200 && res.type === 'basic') {
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      // Offline fallback: serve the app shell for navigations
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
