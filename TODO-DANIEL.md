# TODO — Daniel drops these in

Stubs and placeholders the build is scaffolded around. None of these block shipping — the site is
deployable as-is; these are content/credentials only Daniel can provide.

## Brand / identity
- [x] ~~Studio name~~ — now **Decamp Designs** (from the repo name) across the whole site, manifest and
      titles. The wordmark shows in neon-glow condensed caps beside the gold chevron.
- [ ] **Final logo.** Still the *generated* gold-chevron mark (`favicon.svg`, `assets/icons/*`). If you
      have a real Decamp Designs logo, drop it in and regenerate the icons. *(DriftCast name is final.)*
- [x] ~~Vendored mono font~~ — **IBM Plex Mono** (400/500/600) vendored in Phase 2; `--mono` token
      now leads with it. Numbers/specs/CAD callouts render in it site-wide.

## Content / copy
- [ ] **Final hero + footer copy.** Current hero ("Built from the numbers"), lead and footer tagline
      are on-brand drafts — review/replace.
- [ ] **Contact details** (`contact.html`). Email / Instagram / YouTube rows are placeholders ("to be
      added"). Drop in the real channels — I deliberately did not publish a personal address.
- [ ] **Inspiration links** (`studio.html`). `designsbykirby` is linked (Instagram); **Morgan Clark
      Design, Mason Motorsports, Danny Giannini** are credited by name with "link to confirm" — add
      the real URLs/handles (I didn't want to ship a guessed 404). Also confirm the **Shockworks**
      link on `driftcast/index.html`.
- [ ] **Engine: NA vs supercharged LS — confirm.** Reframed to **naturally aspirated likely** per your
      steer (hub chip, trophy-truck driveline/spec/meta). The two new Notebook articles cover both paths.
      Say the word to lock it firmly NA (or blown) everywhere — incl. the `masterclass.html` air-filtration
      note, which still references a supercharged LS (read-mostly research, left as-is for now).
- [ ] **Cage-width discrepancy.** The brief / hero title-blocks show **1,765 mm cage width**, but
      `build-spec.json`'s internal `cage_half_width` is 545 (≈1,090 mm). Confirm which is canonical —
      it feeds `chassis.truck.js` and the Phase-4 3D.
- [ ] **DriftCast chassis dimensions are placeholders** (`chassis.driftcast.js`: WB 2,550 / track
      1,600 mm). The source notes give targets (60°+ angle, ~52–57% rear bias) but no hard dims —
      confirm with Stewie before the Phase-5 configurator treats them as real.
- [ ] **Catalog figures are representative** (`assets/data/*.js`). kW/weight values are display/
      configurator estimates converted from the source's hp/whp — sanity-check before they're quoted
      as spec.

## Notebook (content)
- [x] ~~Pipeline + 2 seeded examples~~ — `notebook/` pipeline live. **4 articles published:**
      roll-control, drift-dynamics, **ls-exhaust** ("The LS exhaust howl") and **forced-induction-ls**
      ("NA vs blown LS") — all with inline schematics.
- [ ] **Fill the 6 remaining stubs** in `assets/data/articles.js` (bypass-rebound-tuning,
      diff-mounted-arb, grip-and-drive, rear-hardpoints, rear-toe-catchability, weight-balance-layout)
      — paste/finalise bodies; each becomes a page like the published ones.

## Assets (Phase 2+)
- [ ] **Real photos** (build log, parts, the truck) — placeholders only for now.
- [ ] **glTF / CAD models**, and eventually **Gaussian-Splat scans** of the real truck. The 3D
      system is built: set `model: 'path.glb'` on any slot in `chassis.truck.js` `partSlots`
      (currently `null` = labelled primitive). `partSlot.js` has the glTF loader hook ready —
      `assets/lib/GLTFLoader.js` is already vendored.
- [ ] **OG / social preview image** — currently falls back to the 512px app icon.

## Housekeeping
- [ ] Once happy with `build-lab.html` / `masterclass.html`, delete the original revisions
      (`sa-trophy-truck-*.html`, `mcd-masterclass-shed.html`) kept as backups.
- [ ] Decide the privacy level — free GitHub Pages is *unlisted, not private* (see `DEPLOY.md`).
