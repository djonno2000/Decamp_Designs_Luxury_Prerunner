# DECISIONS

Non-obvious choices, with the reasoning. Newest first.

## Rebrand + "luxury garage" atmosphere (2026-07-02)

- **Studio name resolved to "Decamp Designs"** (inferred from the pushed repo name
  `Decamp_Designs_Luxury_Prerunner`). Swapped the `STUDIO` placeholder everywhere via the site
  pages + manifest + titles; the `.brand` wordmark is `text-transform:uppercase`, so "Decamp Designs"
  renders in condensed caps. The read-mostly apps (`build-lab`/`masterclass`) were untouched — their
  "FLARE STUDIO" section names are unrelated.
- **Design evolved toward a warm, LED-lit, polished-concrete luxury-garage mood** (from a reference
  image), while keeping the exact same tokens and readability. All in `studio.css` so it propagates:
  - **Atmosphere:** `body::before` now paints warm amber light-pools (a ceiling-strip glow top-right,
    a side pool, a floor wash) + a deeper vignette; `body::after` adds a very subtle SVG-noise concrete
    grain (overlay, .42). Base darkened to `#0b0c0e`.
  - **Light language:** `.rule`/`.rule.full` and a new `.led` utility glow like warm LED strips; the
    header gained a lit gold underline; `.btn-primary` and the live doorway spine glow.
  - **Neon:** the wordmark + chevron use `drop-shadow` gold glow (works with the gradient-clipped
    text); `.eyebrow` glows; a `.neon` text utility for accents (used on the hub footer tagline).
  - **Biophilic:** a *procedurally generated* hanging fern (`assets/img/fern.svg`, node-drawn drooping
    fronds — on brand: generated, not stock) sits faintly in the hero's top corners via `.foliage`.
    Decorative, `aria-hidden`, dimmed further on mobile/reduced-motion.
- Contrast preserved/improved (darker base). SW bumped to **v9** and caches `fern.svg`.
- **Deployed:** pushed to `origin/main` (`github.com/djonno2000/Decamp_Designs_Luxury_Prerunner`).

## Phase 6–7 — Cinematic layer + polish (2026-06-29)

- **Restraint over spectacle.** Per the brief's rules, the cinematic layer is a few *earned* moments,
  each with a fallback — not effects everywhere:
  - **Ambient particle field** (`assets/motion/ambience.js`) — a 2D canvas (NOT WebGL, so it survives
    the no-WebGL tier) of drifting desert *dust* on truck/studio heroes and weld-spark *embers* on
    DriftCast, gently cursor-reactive. Gated off for reduced-motion / low tier; count scales down on
    mobile; suspends offscreen.
  - **Heading line-reveal** — `splitByBR()` splits hero headings on the author's `<br>`s, *preserving
    inner markup* (the gold `.lit` gradient span) while sliding each line up with mass. Runs after
    `document.fonts.ready` so measurement is correct. Skipped under reduced-motion (headings stay
    static) and if GSAP is absent.
  - **Seamless page transitions** — CSS `@view-transition` cross-fade-with-lift (Chrome MPA; other
    browsers just navigate). Disabled under reduced-motion.
  - **Scroll-progress bar** — pure CSS `animation-timeline: scroll()` on article pages + trophy-truck;
    where unsupported it simply stays hidden. No JS.
  - **Parallax helper** (`[data-parallax]` in `studio.js`) is built and reduced-motion-safe, but left
    largely unwired — applying it to placeholder galleries on scroll-snap pages risked jank for little
    gain. Ready for when real photos land.

- **Polish/perf (Phase 7):** schematic `<img>`s get `loading="lazy"` + `decoding="async"`;
  `color-scheme: dark` set so native UI (scrollbars/controls) matches; an a11y/SEO lint sweep
  (lang, title, description, viewport, theme-color, noindex, img-alt, single-h1, `rel=noopener`)
  runs clean across all STUDIO pages. Contrast verified: `--mute` (#7b7d84) on `--night` ≈ 4.6:1
  (passes AA for normal text); kept as-is to match the existing apps' token. No raster photos yet, so
  little to compress; libs/fonts already minified/woff2. All 25 routes return 200; every cached SW
  path exists. The two existing apps remain byte-identical except their Phase-1 surgical edits.

## Phase 5 — DriftCast configurator (2026-06-29)

- **Metrics are deliberately simple and transparent** (`assets/data/metrics.js`). Weight =
  representative base (650 kg rolling) + real engine weight + gearbox-by-type + diff + misc; rear
  bias starts at 54% and shifts with engine mass/length and box type; power-to-weight uses the
  catalog's built-kW estimate. The point is honest *relative* comparison between choices, clearly
  labelled "est" in the UI — not a corner-weight scale. Verified: a 2JZ/CD009/R200 build →
  997 kg, 50.8% rear, 602 kW/t (matches the formula by hand).

- **Warnings are advisory "fouls,"** generated from real catalog facts (welded diff, helical/VLSD
  not-for-drift, CD009 clutch behind a V8, R200 past ~500 kW, long engine packaging). The chassis
  dims are placeholders, so there are no hard geometric fouls yet — the warnings are the honest
  stand-in until real geometry lands.

- **One config object, two renderers.** `assets/three/configurator.js` (WebGL: assembled frame +
  configurable engine box sized/coloured by engine, wheels scaled by rim width, skin shell tinted by
  selection, swappable mount-plates highlighted gold, OrbitControls) and
  `assets/three/configuratorSVG.js` (a 2D side-elevation that redraws from the same config). Tier
  gate picks one; `?nogl=1` forces the SVG path (QA + manual override).

- **Build state lives in the URL** (`encodeConfig`/`decodeConfig`, compact keys `e/g/d/l/s/w/k`).
  Every change does `history.replaceState`, and "Copy share link" yields a bookmarkable build.
  Decode on load is verified (all control chips + the 3D/SVG reflect the query). This is the
  come-back-and-share hook.

- **Reused the Phase-4 engine.** The configurator frame is `buildSpaceframe(driftcastChassis)` at
  full progress — the spaceframe generator serves both the truck fly-through and the drift chassis.

## Phase 4 — 3D engine + spaceframe hero (2026-06-29)

- **The spaceframe is generated, not modelled.** `assets/three/spaceframe.js` builds tube geometry
  (cylinders along each edge, glowing gold spheres at joints) directly from `chassis.truck.js`'s
  nodes/edges — the real coordinates. `partSlot.js` places engine/gearbox/diff/shocks/tyres at their
  packaged positions. No asset dependency; the site improves as the data does.

- **Scene-graph principle honoured for the future.** Each part slot's renderer **prefers a glTF
  `model` if the field is set, else draws a labelled primitive** — so swapping a primitive for a real
  glTF/scan later is a one-field change (`slot.model = '…'`). The glTF loader hook is stubbed in
  `partSlot.js`.

- **Assembly is one `setProgress(0→1)`** driving everything: tubes draw in (staggered rear→front via
  per-tube pivot `scale.y`), nodes pop, parts drop+fade into their seats, a faint dark body shell
  skins over, and the camera flies from a wide front-quarter to a hero 3/4. `hero.js` scrubs that
  progress with a pinned GSAP ScrollTrigger; `scene.js` renders only while on-screen
  (IntersectionObserver) and caps DPR by device tier.

- **Three graceful fallbacks, all from the same spec.** `deviceTier.js` gates: `none`/`low` tier,
  no-WebGL, or `prefers-reduced-motion` → `fallbackSVG.js` injects a static **engineering side
  elevation** (edges + nodes + part dots + a real dimension callout) instead of the canvas. WebGL
  init is wrapped in try/catch → SVG on failure. The static text hero + cards above remain the
  resilient core regardless. Verified all three states by screenshot (assembled, mid-assembly, SVG).

- **Debug overrides on the hero:** `?t=0..1` forces a fixed assembly progress (no scrub) and
  `?fallback=1` forces the SVG still — handy for QA and as a manual override. Harmless in production.

- **r128 constraints respected:** `THREE` consumed as the vendored global (no bundler); only core
  geometries (Cylinder/Sphere/Box/Grid) — no `CapsuleGeometry`. Three modules added to the SW
  (cache v4). The hero lives on `index.html` (gateway) and `trophy-truck.html` (the frame), inserted
  after each page's static text hero so the zero-JS core is untouched.

## Phase 3 — Core content, flat (2026-06-28)

- **Pages seeded from the real source files, not invented.** Five parallel research agents read the
  repo's `.md`/`.json` (catalogs, `build-spec.json`, the roll-control and drift-dynamics notes, the
  budget/sourcing + widebody docs) and returned structured data. The catalogs, the trophy-truck
  spec, the two Notebook articles and the Studio story are all faithful to that material; honesty
  flags from the sources are carried through to the pages (confidence chips, "under evaluation",
  "representative geometry", "placeholder dims").

- **Data layer is ES modules under `assets/data/`** (`engines`, `gearboxes`, `diffs`, `suspension`,
  `wheels`, `articles`, `chassis.truck`, `chassis.driftcast`) with JSDoc typedefs in `types.js`.
  Power/weight numbers are **representative estimates** for display + the Phase-5 configurator (the
  source mostly quotes hp/whp) — flagged in the file headers. The DriftCast catalog and the Notebook
  index render their cards **from these modules at runtime** (data-driven, filterable), each with a
  meaningful `<noscript>` fallback so the core message survives without JS.

- **`build-spec.json` is keypoints, not a node graph.** It stores stations/rail-heights/cage
  keypoints, so `chassis.truck.js` synthesises a representative node+edge spaceframe from those real
  numbers for the Phase-4 3D generator, keeping `partSlots` (engine/gearbox/diff/shocks/tyres) at
  their published envelope positions. Marked `representative:true`. **Discrepancy flagged:** the
  brief's headline "1,765 mm cage width" vs build-spec's internal `cage_half_width` 545 (≈1,090) —
  kept 1,765 as the headline, noted in `TODO-DANIEL.md`.

- **DriftCast chassis dims are placeholders.** The source commits to philosophy + hard targets
  (60°+ angle, reduced Ackermann, ~52–57% rear bias, positive static rear camber) but gives **no**
  wheelbase/track/length numbers. `chassis.driftcast.js` uses clearly-marked placeholder dims so the
  configurator has geometry to draw; the real targets are captured verbatim under `targets`.

- **Two Notebook articles fully written** (`roll-control`, `drift-dynamics`) with the existing
  project SVGs copied into `notebook/schematics/` and inlined via `<figure><img>`. The schematics are
  light-background engineering drawings — they read as drawings inset into the dark UI, which is
  on-brand. The other 7 articles are scaffolded stubs in `articles.js` (rendered as dashed
  "in development" cards), ready for bodies.

- **Partners & inspirations credited + linked, never reproduced.** Acostal (real link), Shockworks
  and Stewie credited; `designsbykirby` linked (high-confidence Instagram handle), the other three
  inspirations credited by name with "link to confirm" (handles not verified — flagged for Daniel
  rather than shipping a guessed 404).

- **No personal contact details published.** `contact.html` uses clearly-marked placeholder contact
  rows (email/IG/YouTube "to be added") + real "what I'm looking for" copy. Daniel drops in the real
  channels — I won't bake a personal address into a public (even unlisted) page unprompted.

- **`driftcast/configurator.html` is an honest placeholder** (Phase 5) so the CTA isn't a dead link;
  it explains what's coming and points back to the catalog. The catalog + chassis data it will use
  already exist.

- **Trophy-truck uses `.v-desert`, DriftCast uses `.v-tuner`** — the two-vertical tonal shift from
  the design system, applied at the `<body>` level. Scroll-snap chapters use `y proximity` (gentle,
  not mandatory) for accessibility.

## Phase 2 — Design system (2026-06-28)

- **One stylesheet is the source of truth:** `assets/css/studio.css` holds tokens + the whole
  fab-shop component kit (eyebrow, machined rule, datum ticks, CAD dimension callout, blueprint-grid
  utility, chips, badges, buttons, brushed card, CAD title-block, doorways, roadmap cards, site
  chrome, vertical themes, motion classes). `index.html` was refactored off its inline CSS onto
  this file — verified visually identical to Phase 1. New pages just `<link>` it.

- **Mono = IBM Plex Mono** (brief's first suggestion), weights 400/500/600, latin + latin-ext only
  (dropped cyrillic/vietnamese to save weight). Appended into the single `fonts.css`. Note: its
  woff2 hashes start with `-`, which trips `ls`/glob in the shell — reference them via `./name` (the
  CSS already does). `--mono` token now leads with `'IBM Plex Mono'`.

- **Motion is progressive enhancement, guarded by `html.js`.** An inline head script adds the `js`
  class; only then does CSS hide `[data-reveal]` elements. So with JS disabled, nothing is ever
  hidden — the zero-JS resilient core is preserved. Reveals run on a cheap IntersectionObserver
  (work even if GSAP fails to load); Lenis smooth-scroll + ScrollTrigger are extra, and both are
  skipped entirely under `prefers-reduced-motion`.

- **Motion split into the brief's named ES modules** under `assets/motion/` (`reducedMotion.js`,
  `splitText.js`, `lenis.js`, `scrolltrigger-setup.js`, orchestrated by `studio.js`) +
  `assets/three/deviceTier.js`. They consume the vendored libs as UMD globals (`window.gsap`,
  `window.ScrollTrigger`, `window.Lenis`) loaded via `<script>` before the module — no bundler.
  `deviceTier.js` returns high/mid/low/none and is ready for the Phase 4 3D gating.

- **`styleguide.html`** demonstrates every token + component + both vertical themes + the motion
  path. It's the lock on the look and the reference for Phase 3 pages. Marked `noindex`.


## Phase 1 — Offline hub (2026-06-28)

- **Copied, not deleted, the originals.** `build-lab.html` and `masterclass.html` are copies of
  `sa-trophy-truck-build-lab-r4.html` and `mcd-masterclass-shed.html`. The brief said "rename"; I
  copied so the verified originals survive as backups (they're read-mostly and must never break).
  Daniel can delete the `sa-trophy-truck-*` / `mcd-masterclass-shed.html` originals once happy.

- **Surgical edits to the two apps, nothing else.**
  - `build-lab.html`: replaced the Google-Fonts `<link>`s and the cdnjs three.js r128 `<script>`
    with the vendored local copies (`assets/fonts/fonts.css`, `assets/lib/three.r128.min.js`); also
    shortened the `<title>` ("Revision 4 — Build Lab" → "Build Lab"). No app logic touched. It uses
    the global `THREE` from the same r128 build, so behaviour is identical.
  - `masterclass.html`: added one line — `<link href="assets/fonts/fonts.css">`. The app already
    *declared* Barlow as its primary font but never loaded it (it silently fell back to system
    fonts). Vendoring makes it render as designed and fully offline. This is the only change; it has
    no other external dependencies. If a machine had Barlow installed, this changes nothing; if not,
    it now correctly shows Barlow instead of Segoe UI.

- **Vendored everything from cdnjs/unpkg, version-pinned.** three.js **r128** (matches Build Lab),
  its r128 `examples/js` OrbitControls + GLTFLoader (not in core at r128), GSAP 3.12.5 +
  ScrollTrigger, Lenis 1.1.14. GSAP/Lenis aren't used yet (Phase 6) but are vendored now while
  online and best-effort cached by the SW.

- **Fonts vendored as woff2 with a local `fonts.css`.** Fetched Google's `css2` output with a
  Chrome UA (so it returns woff2), downloaded every referenced file to its hashed basename, and
  rewrote the `src: url(...)` to local paths. All 21 faces kept (Barlow 400/500/600, Barlow
  Condensed 500/600/700/800 × latin/latin-ext/vietnamese). `unicode-range` is preserved so browsers
  still only download the subsets they need; the SW caches them on use.

- **Icons generated programmatically** (no ImageMagick available; the system `convert` is the
  Windows NTFS tool). A small pure-Node PNG encoder draws the heat-tinted gold chevron logomark on
  the night background at 180/192/512 + a maskable 512 (chevron kept inside the maskable safe zone).
  `favicon.svg` is the scalable source of truth for the mark. Generator script lives in the session
  scratchpad; re-run only if the brand mark changes.

- **PWA paths are all relative** (`./…`, `assets/…`) so the site works from a GitHub Pages *project*
  subpath (`user.github.io/repo/`) without rewriting. `manifest.json` uses `start_url: ./index.html`
  and `scope: ./`.

- **Service worker = CORE (atomic) + EXTENDED (best-effort) + runtime cache-first.** A single
  missing optional asset can't break installation, but the shell + three.js + fonts.css are
  guaranteed. Full site (including hashed woff2) is offline after the first online visit.

- **Hub `index.html` is intentionally a standalone file with inline CSS.** Phase 2 extracts the
  fab-shop design system into shared stylesheets + a `styleguide.html`; until then, inline keeps the
  resilient core a single, dependency-light document. The canonical tokens are declared in `:root`
  exactly as the brief / existing apps specify, ready to lift out.

- **Mono font is the system stack for now** (`ui-monospace, Cascadia Code, JetBrains Mono, …`). The
  brief assigns a *vendored* mono (IBM Plex / JetBrains) in Phase 2; deferred to keep Phase 1 tight.

- **No personal contact details published.** The footer links no email/socials yet — `contact.html`
  and final contact info are Phase 3 / Daniel's to drop in. See `TODO-DANIEL.md`.
