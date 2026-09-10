# Resumind Frontend

The client for **Resumind v2.0** — a free AI resume / ATS score
checker. React Router v7 (framework mode, SPA build), TypeScript,
hand-written CSS (no Tailwind, no CSS framework — every class is
prefixed `.reality-`).

This is the presentation layer only. All accounts, uploads, AI
scoring, and storage are handled by the companion Express API in
`/backend`.

## Stack

- React 19 + React Router 7 (`ssr: false`, with `/`, `/login`,
  `/register` prerendered to static HTML for fast first paint + SEO)
- `pdfjs-dist` — renders a preview thumbnail of the uploaded PDF
  entirely client-side before it's sent to the backend
- `zustand` — small global auth store
- Hand-written CSS design system in `app/styles/reality-theme.css`,
  ported 1:1 from the original Tailwind theme (same colors, gradients,
  fonts, spacing) so the look is unchanged

## Local development

```bash
cp .env.example .env
# point VITE_API_BASE_URL at your backend, e.g. http://localhost:4000
npm install
npm run dev
```

Runs at `http://localhost:5173`. Start the backend first (see
`/backend/README.md`) or auth/upload calls will fail.

## Building

```bash
npm run build
```

Outputs a fully static site to `build/client/` — `/`, `/login`, and
`/register` are pre-rendered HTML; every other route (including
`/upload`, `/previous`, `/resume/:id`, and unknown paths → 404) is
resolved client-side via the SPA fallback shell.

## Pages

| Route | Purpose |
|---|---|
| `/` | Marketing/landing page with curated sample scores (never your own analyzed resumes) |
| `/register`, `/login` | Account creation / sign-in |
| `/upload` | Upload a resume + job info, get it analyzed |
| `/resume/:id` | Full breakdown: ATS score, tone & style, content, structure, skills |
| `/previous` | Every resume **you've** analyzed, in one place |
| `*` | Custom 404 |

## Deployment (Netlify)

See `/DEPLOYMENT.md` at the repo root for the full walkthrough.
Briefly: build command `npm run build`, publish directory
`build/client`, and set `VITE_API_BASE_URL` to your deployed backend
URL as a Netlify environment variable. `netlify.toml` and
`public/_redirects` are already configured for SPA routing.
