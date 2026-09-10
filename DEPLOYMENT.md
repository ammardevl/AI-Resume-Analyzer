# Deploying Resumind v2.0

Two services, deployed independently. Do the **backend first** — the
frontend needs its live URL.

## 1. Backend → Render

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Render: **New → Web Service**, connect the repo, and set:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: the free tier is fine to start
3. Add a **persistent disk** (Render → your service → Disks) so
   uploaded resumes and the JSON database survive restarts/deploys —
   e.g. mount path `/data`, 1GB is plenty to start.
4. Add environment variables (Render → Environment):

   | Key | Value |
   |---|---|
   | `JWT_SECRET` | a long random string — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `FRONTEND_URL` | your Netlify URL, e.g. `https://resumind.netlify.app` (set this after step 2 below, then redeploy) |
   | `ANTHROPIC_API_KEY` | your Claude API key, from [console.anthropic.com](https://console.anthropic.com) — optional; without it, resumes are still scored, just with the simpler offline fallback |
   | `ANTHROPIC_MODEL` | `claude-sonnet-5` (default, can leave unset) |
   | `UPLOAD_DIR` | `/data/uploads` (matches the disk mount path above) |
   | `DATA_DIR` | `/data/db` |

5. Deploy. Confirm `https://<your-service>.onrender.com/health` returns
   `{"status":"ok"}`.

   Alternatively, the included `backend/Dockerfile` works with Render's
   Docker runtime, or any other Docker host (Fly.io, Railway, a VPS,
   etc.) if you'd rather not use Render.

## 2. Frontend → Netlify

1. In Netlify: **Add new site → Import an existing project**, connect
   the same repo, and set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build/client`

   (`netlify.toml` inside `/frontend` already encodes these, so Netlify
   should pick them up automatically once the base directory is set.)
2. Add an environment variable: `VITE_API_BASE_URL` = your Render URL
   from step 1 (e.g. `https://resumind-backend.onrender.com`).
3. Deploy. Netlify will build, prerender `/`, `/login`, `/register` to
   static HTML, and serve everything else through the SPA fallback
   (already configured via `_redirects`).
4. Go back to Render and set `FRONTEND_URL` to your live Netlify URL,
   then redeploy the backend so CORS allows requests from it.

## 3. Custom domain / SEO follow-ups

- Update the `og:` URLs, `<link rel="canonical">`, `robots.txt`, and
  `sitemap.xml` in `/frontend` with your real domain once you have one
  (they currently point at a placeholder `resumind.realitycodes.dev`).
- Submit `sitemap.xml` to Google Search Console after going live.

## Local smoke test before deploying

```bash
cd backend && npm install && npm run dev &
cd frontend && npm install && npm run build && npx serve build/client
```

Then confirm register → login → upload a resume → see it under
"Previously Analyzed" all work against your local backend before
pointing Netlify at the real one.
