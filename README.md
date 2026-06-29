# ⟨STUDIO⟩ — Web Platform

A static, vanilla, **offline-first** web platform for a South Australian fabrication studio:
trophy-truck build tools, the MCD Masterclass, and (soon) the DriftCast modular drift platform.

> **Spine:** *Built from the numbers.* No stock renders — everything is generated from the real
> engineering data. Content and tools ship first; the cinematic 3D layer is additive and always
> degrades gracefully.

## Hard constraints
Static · vanilla HTML/CSS/JS (ES modules) · **no framework, no backend** · all libraries and fonts
**vendored locally** (no CDN) · installable **PWA**, fully **offline-capable** · the two existing
build apps are **read-mostly** (only surgical edits).

## What's live (Phases 1–3 ✅)
| Page | What it is | Status |
|---|---|---|
| `index.html` | Dark/gold hub — the resilient zero-JS core (and future cinematic gateway) | **Live** |
| `build-lab.html` | Existing structural calculator + 3D chassis lab (was `sa-trophy-truck-build-lab-r4.html`) | **Live** |
| `masterclass.html` | Existing shed companion knowledge app (was `mcd-masterclass-shed.html`) | **Live** |
| `trophy-truck.html` | Flagship desert build — 3D spaceframe fly-through, scroll-snap chapters, spec sheet | **Live + 3D** |
| `driftcast/index.html` | Modular drift platform — concept, data-driven catalog, partners, skin | **Live (flat)** |
| `driftcast/configurator.html` | Live 3D build configurator — swap parts, live metrics, shareable URL | **Live + 3D** |
| `notebook/index.html` | Engineering Notebook — filterable, 2 full articles + 7 stubs | **Live** |
| `notebook/roll-control.html`, `notebook/drift-dynamics.html` | Seeded deep-dives w/ inline schematics | **Live** |
| `studio.html` / `contact.html` | Maker story + credited inspirations / get in touch | **Live** |
| `styleguide.html` | The fab-shop design system — tokens, type, component kit, motion | **Live** |

**Design system (Phase 2):** `assets/css/studio.css` is the single source of truth for tokens and
the component kit; `assets/motion/*` + `assets/three/deviceTier.js` are the motion/device primitives.

**Data layer (Phase 3):** `assets/data/*.js` — engines, gearboxes, diffs, suspension, wheels,
articles, and the truck + DriftCast chassis specs (seeded from the repo's source `.md`/`.json`,
representative figures flagged). The DriftCast catalog and Notebook index render from these at
runtime, with `<noscript>` fallbacks.

**3D engine (Phase 4 ✅):** `assets/three/*` — `spaceframe.js` (tube generator from
`chassis.truck.js`), `partSlot.js` (glTF-ready primitives), `scene.js` (HeroScene + camera
fly-through + assembly timeline), `fallbackSVG.js` (static engineering still), `hero.js` (tier-gate +
ScrollTrigger scrub). The scroll-scrubbed spaceframe fly-through is live on `index.html` and
`trophy-truck.html`, with no-WebGL / low-tier / reduced-motion all falling back to the SVG
elevation. Debug: append `?t=0..1` (fixed assembly) or `?fallback=1` (force the SVG still).

**Configurator (Phase 5 ✅):** `driftcast/configurator.html` + `assets/data/metrics.js` +
`assets/three/configurator.js` (3D) + `assets/three/configuratorSVG.js` (2D fallback). Pick
engine/gearbox/diff/LSD/suspension/wheels/skin → the tube chassis + weight/balance/power-to-weight
update live, packaging warnings fire, and the build is URL-encoded + shareable. `?nogl=1` forces the
2D path.

**Cinematic layer (Phase 6 ✅):** ambient dust/ember particle field (`assets/motion/ambience.js`),
hero heading line-reveal (`splitByBR`, gradient-preserving), CSS View-Transition page changes, a
CSS scroll-progress bar on long pages, and a reduced-motion-safe parallax helper. All gated and
degrading.

**Polish & perf (Phase 7 ✅):** lazy/async images, `color-scheme: dark`, a clean a11y/SEO lint sweep
(lang/title/description/viewport/theme-color/noindex/alt/single-h1/noopener), AA-contrast verified,
all 25 routes 200, every SW path present. See **`ACCEPTANCE.md`** for the brief's §16 checklist.

**All 7 phases of the master brief are built.** Phase-2+ "additive" layers (3D, configurator,
cinematics) sit on top of a content-complete, offline-first core that works with every effect
stripped. Outstanding items are content/credentials only Daniel can supply — see `TODO-DANIEL.md`.

## Run locally
The PWA service worker and any ES modules need to be served over HTTP (not opened as `file://`).
From the project root:

```bash
# Python (built-in)
python -m http.server 8080
# or Node
npx serve -l 8080
```

Then open <http://localhost:8080/>. To exercise offline: load the site once, then in DevTools →
Application → Service Workers tick **Offline** (or stop the server) and reload — it keeps working.

## Deploy (unlisted)
See **`DEPLOY.md`** for step-by-step GitHub Pages / Netlify instructions and the honest note on
what "unlisted" can and can't guarantee on free hosting.

## Offline / PWA
- All libraries (`three.js r128`, OrbitControls, GLTFLoader, GSAP, ScrollTrigger, Lenis) and fonts
  (Barlow + Barlow Condensed, woff2) are vendored under `assets/`.
- `manifest.json` + `service-worker.js` cache the app shell (`index`, `build-lab`, `masterclass`,
  three.js, fonts.css, icons) atomically, best-effort cache the rest, and runtime-cache everything
  else same-origin (cache-first). After one online visit the whole site runs with no internet.
- Bump `CACHE_VERSION` in `service-worker.js` whenever shell files change to force a clean update.

## Structure
```
index.html  build-lab.html  masterclass.html
manifest.json  service-worker.js  robots.txt  favicon.svg
assets/
  lib/    three.r128.min.js  OrbitControls.js  GLTFLoader.js  gsap.min.js  ScrollTrigger.min.js  lenis.min.js
  fonts/  fonts.css  *.woff2 (Barlow + Barlow Condensed, latin/latin-ext/vietnamese subsets)
  icons/  icon-180/192/512 + maskable
  three/  motion/  data/  img/  models/   (scaffolded for Phase 2+)
driftcast/  notebook/                      (scaffolded for Phase 2+)
README.md  DEPLOY.md  DECISIONS.md  TODO-DANIEL.md
```

The original verified HTML revisions (`sa-trophy-truck-*`, `mcd-masterclass-shed.html`) are left in
place as backups; the canonical apps are `build-lab.html` and `masterclass.html`.
