# DEPLOY — publish unlisted

The site is plain static files, so hosting is simple. Two good options below. Everything is served
over HTTPS (required for the PWA / service worker to work).

---

## Option A — GitHub Pages (recommended, free)

### One-time setup
1. Create a **new GitHub repo** with a non-obvious name (the URL is your only "lock" — see privacy
   note). Example: `mcd1-bench-7f3a`. You can make the repo **private**; Pages can still serve from
   it on paid plans, otherwise use a public repo (the files are then publicly fetchable by URL).
2. From this project folder:
   ```bash
   git init
   git add .
   git commit -m "Phase 1: offline hub + vendored apps"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch
   **`main`**, folder **`/ (root)`**. Save.
4. Wait ~1 minute. Your site is at `https://<you>.github.io/<repo>/`.

> Because all paths in the site are **relative**, it works correctly from the `/repo/` subpath — no
> config needed.

### Updating later
```bash
git add . && git commit -m "..." && git push
```
Pages redeploys automatically. After a deploy, the service worker picks up changes on next load
(bump `CACHE_VERSION` in `service-worker.js` when you change shell files to force a clean refresh).

### Keep it unlisted
- `robots.txt` (`Disallow: /`) and `<meta name="robots" content="noindex,nofollow">` on every page
  keep it out of search results. **Already in place** on `index.html`; add the same meta tag to new
  pages as they're built.
- **Don't link the URL publicly.** Don't post it where crawlers can find it.

---

## Option B — Netlify (free, drag-and-drop)

1. Go to <https://app.netlify.com/drop> and **drag this whole folder** onto the page, or "Add new
   site → Import from Git" and connect the repo.
2. No build command, no publish directory needed (it's static). You get a random
   `https://<random>.netlify.app` URL.
3. Updating: drag again, or push to the connected repo.

---

## Honest note on "unlisted" vs private
Free static hosting is **unlisted, not access-controlled** — *anyone with the exact URL can view it.*
`robots.txt` + `noindex` keep it out of search engines and a non-obvious URL keeps it obscure, but
that's obscurity, not security. For true gating, pick one:

- **GitHub Pages from a private repo** — needs a paid GitHub plan.
- **Netlify password protection** — paid (Pro) tier; per-site password.
- **Cloudflare Access** in front of the site — free tier exists; email-/SSO-gated. Most robust.

Choose per how private it must be. For a personal build journal shared with a few people, a
non-obvious GitHub Pages URL + `noindex` is usually enough.

---

## Verify after deploy
- Visit the URL on a phone → browser menu → **Add to Home Screen / Install**. It installs as an app.
- Open it, then turn on Airplane mode and reopen — `index`, `build-lab` and `masterclass` all load.
- Open `build-lab.html` offline — the 3D viewport and calculators work (three.js + fonts are local).
