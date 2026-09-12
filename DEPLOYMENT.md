# Deploying Resumind v2.0 (Cloudflare Pages, free)

One service, no card required.

## 1. Push to GitHub

Commit the whole `resumind-v2` folder (just `/frontend` matters here)
to a GitHub repo.

## 2. Create the Cloudflare Pages project

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) →
   **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Sign in with GitHub and pick your repo. No payment method is asked
   for on the free plan.
3. Set the build configuration:

   | Field | Value |
   |---|---|
   | Framework preset | None (or "Vite" if offered) |
   | Root directory | `frontend` |
   | Build command | `npm run build` |
   | Build output directory | `build/client` |

4. Click **Save and Deploy**. Cloudflare installs dependencies, runs
   the build, and gives you a live URL like
   `https://ai-resume-analyzer.pages.dev` within a minute or two.

That's it — there's no backend to deploy, no environment variables to
set, no database to provision. The `_redirects` file already in
`frontend/public/` (Cloudflare Pages supports the same format Netlify
does) handles routing so `/upload`, `/previous`, `/resume/:id`, and
unknown paths all resolve correctly through the client-side router.

## 3. Every future update

Just `git push` — Cloudflare Pages watches the branch and redeploys
automatically. No redeploy step to remember.

## 4. Custom domain (optional, still free)

Cloudflare Pages → your project → **Custom domains** → add a domain
you own (or a free Cloudflare-provided one). If you do this, update
the placeholder URLs in `frontend/app/root.tsx`,
`frontend/public/robots.txt`, and `frontend/public/sitemap.xml`
(currently `resumind.realitycodes.dev`) to match.

## About the "backend"

There isn't one to deploy — [Puter](https://puter.com) is providing
free hosted auth, file storage, and AI on your users' behalf, loaded
directly in the browser via its script tag in `app/root.tsx`. If you
ever outgrow that (e.g. you want your own database, your own AI
provider/key, or server-side control), that's a bigger follow-up
project — not something needed to get this live today.
