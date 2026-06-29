# Acceptance checklist (master brief §16)

Status of each acceptance item. ✅ done · ⚠️ done with a flag for Daniel · ⬜ needs Daniel.

- ✅ **Phase 1 first.** Renames done (`build-lab.html`, `masterclass.html`); dark/gold hub live;
  three.js r128 + Barlow vendored locally; Build Lab repointed; `manifest.json` + `service-worker.js`
  cache the shell; installs + works offline; `robots.txt` + `noindex` for unlisted; both apps behave
  exactly as before (diff = only the surgical edits). ⬜ *Deploy step is yours* — see `DEPLOY.md`.
- ✅ **No framework, no backend; existing apps' internals untouched; all libs/fonts vendored.**
- ✅ **Identity matches the tokens + existing apps** — dark + gold, Barlow + Barlow Condensed,
  IBM Plex Mono numerals, datum ticks, machined rules. Locked in `styleguide.html`.
- ✅ **Spaceframe fly-through** assembles from the real `chassis.truck.js` numbers, scrubs to scroll,
  with the static SVG engineering-drawing fallback for no-WebGL/low-tier and reduced-motion.
- ✅ **Configurator** swaps parts in 3D, recomputes weight / balance / power-to-weight / packaging,
  gives a shareable URL; the 2D SVG fallback works (`?nogl=1`).
- ✅ **Notebook** renders with inline SVG schematics, tags and confidence flags; two seeded articles
  present + 7 scaffolded stubs. ⬜ *Article bodies for the stubs are yours.*
- ⚠️ **Inspirations + partners credited and linked, never reproduced.** Acostal + `designsbykirby`
  linked; Shockworks / Morgan Clark Design / Mason Motorsports / Danny Giannini credited with
  "link to confirm" (handles not verified — see `TODO-DANIEL.md`).
- ✅ **Perf/access:** mobile-first responsive; `prefers-reduced-motion` honoured everywhere; keyboard
  focus styles + skip links; AA contrast verified; clean a11y/SEO lint. ⬜ *Run Lighthouse on the
  deployed URL to confirm field scores.* PWA still offline-installable (SW v6, all paths cached).
- ✅ **`DECISIONS.md` + `TODO-DANIEL.md` current.**

## What only Daniel can finish (none block shipping)
Studio name/logo · real photos + OG image · glTF/scan models (hooks ready) · final hero/studio/contact
copy · contact channels · the 4 unverified inspiration links · the cage-width 1,765-vs-build-spec
reconciliation · DriftCast real chassis dims · the 7 Notebook stub bodies. Full detail in
`TODO-DANIEL.md`.
