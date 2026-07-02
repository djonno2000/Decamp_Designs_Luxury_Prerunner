# STATUS — where we're leaving off

_Last updated: 2026-07-02._

## TL;DR
The full **Decamp Designs** web platform is **built (master-brief Phases 1–7) and PUSHED to GitHub**
(`github.com/djonno2000/Decamp_Designs_Luxury_Prerunner`, branch `main`). The site was **rebranded
from the `STUDIO` placeholder to Decamp Designs** and the look evolved to a **warm, LED-lit,
polished-concrete luxury-garage** aesthetic (hanging ferns, neon-glow wordmark, warm light pools).
The Build Lab was refreshed to the latest r4 (measured frame record, 760 mm fuel cell, 6L80E, 4L80E
table), and the LS-exhaust material was integrated as two Notebook articles with the engine reframed
**naturally-aspirated-likely**.

**Only remaining deploy step:** enable **GitHub Pages** on the repo (Settings → Pages → Deploy from a
branch → `main` / root). After that, every future change is a one-line `git push`.

## What's built (quick map)
- **Site:** `index.html` (hub + 3D spaceframe hero), `trophy-truck.html`, `driftcast/` (platform +
  live configurator), `notebook/` (knowledge base), `studio.html`, `contact.html`, `styleguide.html`,
  plus the two existing apps `build-lab.html` / `masterclass.html` (read-mostly, only vendoring edits).
- **Engine:** design system `assets/css/studio.css`, motion `assets/motion/*`, 3D `assets/three/*`
  (spaceframe generator + configurator + SVG fallbacks), data `assets/data/*` (catalogs, chassis,
  metrics, article manifest). Offline-first PWA (`manifest.json` + `service-worker.js`, now **v7**).
- **Docs:** `README.md`, `DEPLOY.md`, `DECISIONS.md`, `ACCEPTANCE.md`, `TODO-DANIEL.md`, this file.

## What changed this session (2026-06-29)
- **Made the folder a deploy-ready git repo** (branch `main`, source notes/business plan/raw data/
  original revisions kept on disk but git-ignored so they're not published — see `.gitignore`).
- **Added a one-click local preview:** double-click **`start-local.cmd`** (or `node dev-server.js`).
- **Integrated the new LS-exhaust topic cluster** you dropped in (6 `.md` + 5 diagrams) into the
  Notebook as two published articles:
  - **`notebook/ls-exhaust.html` — "The LS exhaust howl"** (firing order → stepped primaries →
    megaphone construction & tuning → reverse cone → routing through the steel-cab spaceframe), with
    all 5 new diagrams inlined.
  - **`notebook/forced-induction-ls.html` — "Boosting an LS to live, not to grenade"** (cheap LS3
    supercharger paths + the honest NA-vs-blown verdict) — promoted from a stub.
- **Reframed the engine to NA-likely** where it was asserted "supercharged": the hub hero chip, the
  trophy-truck driveline chapter (now links both new articles), the spec sheet, and the trophy-truck
  meta description. Left correct contextual mentions (the `studio.html` cooling lesson; the existing
  read-mostly apps).
- **Notebook now: 4 published articles + 6 stubs.**

## Open decisions (need your call)
1. **Engine: NA vs supercharged LS.** Reframed to **NA likely** per your steer. If you want it
   firmly NA (or firmly blown), say so and I'll lock the copy everywhere (incl. the `masterclass.html`
   air-filtration note, which still references a supercharged LS as read-mostly research).
2. **Cage width** — hero/spec show 1,765 mm; `build-spec.json` internal `cage_half_width` = 545
   (≈1,090). Confirm the canonical figure (feeds the 3D).
3. **DriftCast chassis dims** are placeholders (no real numbers in the source) — confirm with Stewie.

## Next steps (in order)
1. **Deploy.** From this folder: `git remote add origin <url>` → `git push -u origin main` → enable
   GitHub Pages on `main`/root (full steps + Netlify alt in `DEPLOY.md`).
2. **Review on a phone** — install the PWA, check offline, the 3D hero + configurator.
3. **Confirm the engine direction** (see Open decisions #1) so I can finalise the copy.
4. **Fill the 6 remaining Notebook stubs** (`assets/data/articles.js`) from your `.md` notes —
   bypass-rebound-tuning, diff-mounted-arb, grip-and-drive, rear-hardpoints, rear-toe-catchability,
   weight-balance-layout. Each becomes a page like the published ones.
5. **Drop in** real photos + an OG image, the studio name/logo, contact channels, and the 4 unverified
   inspiration links — all listed in `TODO-DANIEL.md`.
6. Later (Phase-2 of 3D): real glTF/scan models — hooks are ready (`partSlot.model`).

## Run / deploy quick reference
- **Local:** `start-local.cmd` (Windows) or `node dev-server.js` → opens the hub. Ctrl+C to stop.
- **Git:** `git log --oneline` for history; working tree was clean at last commit.
- **Deploy:** `DEPLOY.md`.
