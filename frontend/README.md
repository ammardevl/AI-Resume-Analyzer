# Resumind Frontend

The entire app — React Router v7 SPA, TypeScript, hand-written CSS
(`.reality-` prefixed, no Tailwind). Accounts, storage, and AI all run
through [Puter](https://puter.com), loaded via script tag — no backend
of ours needed.

## Local development

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Building

```bash
npm run build
```

Outputs a fully static site to `build/client/` — `/` and `/auth` are
pre-rendered HTML; every other route (`/upload`, `/previous`,
`/resume/:id`, and the 404 catch-all) resolves client-side via the SPA
fallback shell.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page with curated sample scores (never your own) |
| `/auth` | Puter sign-in/sign-up (opens Puter's hosted popup) |
| `/upload` | Upload a resume + job info, get it analyzed |
| `/resume/:id` | Full breakdown: ATS score, tone & style, content, structure, skills |
| `/previous` | Every resume **you've** analyzed |
| `*` | Custom 404 |

## Deployment

See `/DEPLOYMENT.md` at the repo root — Cloudflare Pages, free, no
card required.
