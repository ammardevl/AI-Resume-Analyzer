# Resumind v2.0

A free AI-powered resume / ATS score checker, rebuilt as a proper
full-stack app.

> Free version of **Resumind v2.0**, by **Muhammad Ammar**, who runs
> [Reality Codes](https://reality-codes.netlify.app/) — AI solutions
> & websites.

This repo has two independently deployable halves:

```
/frontend   React Router v7 SPA — deploy to Netlify
/backend    Express API — deploy to Render (or any Node host)
```

They talk to each other over HTTP only (`VITE_API_BASE_URL` on the
frontend, `FRONTEND_URL` on the backend for CORS). Nothing about the
frontend is coupled to how/where the backend runs.

## What this app does

1. A visitor lands on the homepage and sees a handful of **sample**
   resume scores for inspiration — never a real user's own data.
2. They create a free account and upload a resume PDF, optionally with
   a target job title/description.
3. The backend extracts the resume's text, sends it for AI analysis
   (Claude, with a keyword/structure-based offline fallback if no API
   key is configured), and returns an overall ATS score plus a
   breakdown across **Tone & Style**, **Content**, **Structure**, and
   **Skills** — each with concrete "good" / "improve" tips.
4. Every analysis is saved to the user's account and shown under
   **Previously Analyzed**, so they can come back and compare results
   across applications.

## What changed from the original prototype

The starting point was a client-only React Router app using
[Puter.js](https://puter.com) for auth, file storage, and AI calls,
styled with Tailwind. Keeping the same design, layout and content,
this pass:

- **Added a real backend** (`/backend`) — JWT auth, per-user resume
  storage, server-side PDF text extraction, and a real AI call,
  replacing the Puter.js dependency entirely.
- **Fixed the homepage mixing bug** — the grid now only ever shows the
  curated samples; a signed-in user's own results live under the new
  **`/previous`** ("Previously Analyzed") page, linked from the navbar.
- **Added missing pages an ATS tool needs**: `/login`, `/register`,
  `/previous`, and a real 404 — plus removed the leftover dev-only
  `/wipe` route and unused React Router starter template page.
- **Rewrote all styling in plain CSS** (`app/styles/reality-theme.css`)
  — no Tailwind, no build-time utility generation — every class
  prefixed `.reality-` so the DOM is easy to identify when inspecting.
  Colors, gradients, fonts and spacing were ported 1:1 from the
  original theme.
- **Security pass**: input validation on every auth/resume field,
  bcrypt password hashing, JWT expiry, per-route rate limiting,
  strict file-type/size validation on uploads, ownership checks on
  every resume read/delete, `helmet` + locked-down CORS, and a bumped
  `multer` major version to drop a known-vulnerable release.
- **Performance pass**: dropped the Puter.js script tag (a large
  third-party runtime dependency) and the unused Inter font import,
  switched the build to a fully static SPA with the marketing pages
  (`/`, `/login`, `/register`) **prerendered** to real HTML, hand
  -written CSS instead of a generated utility stylesheet, and
  lazy-loaded resume preview images.
- **Technical SEO**: descriptive `<title>`/meta per route, Open Graph
  + Twitter card tags, JSON-LD `WebApplication` structured data,
  `robots.txt`, `sitemap.xml`, and a real crawlable static homepage.
- **Cleanup**: trimmed ~10 unused dependencies, removed dead files,
  slimmed and documented every module instead of leaving it as
  boilerplate.

## Quick start (local)

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # set JWT_SECRET at minimum
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:4000
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Deploying it live

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Netlify (frontend)
+ Render (backend) walkthrough.
