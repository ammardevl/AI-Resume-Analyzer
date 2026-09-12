# Resumind v2.0

A free AI-powered resume / ATS score checker.

> Free version of **Resumind v2.0**, by **Muhammad Ammar**, who runs
> [Reality Codes](https://reality-codes.netlify.app/) — AI solutions
> & websites.

**One deployable app, zero cost.** Everything — accounts, file
storage, and AI scoring — runs through [Puter](https://puter.com)'s
free hosted platform, loaded straight in the browser. There is no
server of your own to run, pay for, or hand over a credit card to.

```
/frontend   React Router v7 SPA — the entire app, deploy to Cloudflare Pages
```

## What this app does

1. A visitor lands on the homepage and sees a handful of **sample**
   resume scores — never a real user's own data.
2. They click "Sign In", which opens Puter's own free sign-up/login
   popup (no form to build, no password of ours to manage).
3. They upload a resume PDF, optionally with a target job title/
   description. The file and a generated preview image are stored in
   the user's own free Puter cloud storage.
4. Puter's AI (Claude) analyzes the resume and returns an overall ATS
   score plus a breakdown across **Tone & Style**, **Content**,
   **Structure**, and **Skills**, each with "good"/"improve" tips.
5. The result is saved to the user's Puter key-value store and shown
   under **Previously Analyzed**, so they can revisit it any time.

## Why this is free for you

Puter uses a "user pays" model: each visitor signs into their own free
Puter account, and Puter's own infrastructure covers the storage and
AI usage for that account. You (the site owner) never provide an API
key and never get billed for what your users do — you're just hosting
a static site that talks to Puter's API.

## What changed from the original prototype

Keeping the same design, layout and content:

- **Fixed the homepage mixing bug** — the grid only ever shows curated
  samples; a signed-in user's own results live under the new
  **`/previous`** ("Previously Analyzed") page, linked from the navbar.
- **Added missing pages an ATS tool needs**: `/auth`, `/previous`, and
  a real 404 — removed the leftover dev-only `/wipe` route and the
  unused React Router starter template page.
- **Rewrote all styling in plain CSS** (`app/styles/reality-theme.css`)
  — no Tailwind, no build-time utility generation — every class
  prefixed `.reality-`. Colors, gradients, fonts and spacing ported
  1:1 from the original theme.
- **Fixed a bug** where the remove-file button pointed at a
  non-existent `cross.png` icon.
- **Performance pass**: removed the unused Inter font import, switched
  the build to a fully static SPA with `/` and `/auth` **prerendered**
  to real HTML, hand-written CSS instead of a generated utility
  stylesheet, lazy-loaded resume preview images.
- **Technical SEO**: descriptive `<title>`/meta per route, Open Graph
  + Twitter card tags, JSON-LD `WebApplication` structured data,
  `robots.txt`, `sitemap.xml`.
- **Cleanup**: trimmed unused dependencies (Tailwind and its plugins,
  `tailwind-merge`), removed dead files.

## Local development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. No `.env` file or backend needed —
Puter is loaded from its CDN script and works immediately.

## Deploying it live

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the Cloudflare Pages
walkthrough (free, no card required).
