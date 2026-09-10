# Resumind Backend

Express + JWT API that powers Resumind v2.0. Handles accounts, resume
uploads, PDF text extraction, AI-based ATS scoring, and per-user storage
of past results as JSON.

## Stack

- **Express 4** — HTTP API
- **lowdb** — flat-file JSON database (`data/db.json`) — no external DB
  to provision
- **multer** — multipart uploads, validated by mime type and size
- **pdf-parse** — extracts resume text server-side
- **@anthropic-ai/sdk** — real AI feedback when `ANTHROPIC_API_KEY` is set
  (falls back to a small offline heuristic scorer otherwise, so the app
  is fully demoable with zero paid setup)
- **bcryptjs + jsonwebtoken** — password hashing + auth tokens
- **helmet, cors, express-rate-limit** — baseline hardening

## Local development

```bash
cp .env.example .env
# edit .env — at minimum set JWT_SECRET to a long random string
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. `GET /health`
should return `{"status":"ok"}`.

## Environment variables

See `.env.example` for the full list. The only required one is
`JWT_SECRET` — the server refuses to start without it.

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | yes | Long random string used to sign auth tokens |
| `FRONTEND_URL` | recommended | Comma-separated allowed CORS origins |
| `ANTHROPIC_API_KEY` | no | Enables real AI feedback via Claude |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-sonnet-5` |
| `PORT` | no | Defaults to `4000` |
| `UPLOAD_DIR` / `DATA_DIR` | no | Where files/DB are stored — point these at a persistent disk in production |

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{ name, email, password }` → `{ user, token }` |
| POST | `/api/auth/login` | — | `{ email, password }` → `{ user, token }` |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/resumes` | yes | List the caller's analyzed resumes |
| GET | `/api/resumes/:id` | yes | One resume (404 if not owned by caller) |
| POST | `/api/resumes` | yes | `multipart/form-data`: `resume` (PDF), `image` (PNG/JPEG/WebP preview), `companyName`, `jobTitle`, `jobDescription` |
| DELETE | `/api/resumes/:id` | yes | Deletes the record + its files |
| GET | `/uploads/...` | — | Static file serving for stored PDFs/images |
| GET | `/health` | — | Liveness check |

Auth uses `Authorization: Bearer <token>`.

## Security notes

- Passwords hashed with bcrypt (cost 12); JWTs expire after 30 days.
- Upload size capped at 20MB; only `application/pdf` accepted for
  resumes and PNG/JPEG/WebP for the preview image.
- Auth and upload routes have their own tighter rate limits on top of a
  global one.
- Every resume read/delete checks `userId` ownership — one user can
  never see or remove another's data.
- `npm audit` currently reports 2 moderate advisories inherited from
  Express 4's bundled `qs` version (array-limit bypass / DoS). This API
  never parses complex query strings, so exposure is low; upgrading to
  Express 5 would resolve it fully but is a larger migration left as a
  follow-up.

## Data storage

Everything lives under `data/db.json` (users + resume records) and
`uploads/pdfs` / `uploads/images` (the actual files). This is
intentionally simple JSON storage per your request — for real
production scale you'd eventually want to swap `lowdb` for Postgres/
Mongo, but the API surface above wouldn't need to change.

## Deployment (Render)

See `/DEPLOYMENT.md` at the repo root for the full walkthrough.
