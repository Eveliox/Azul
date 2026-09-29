# Azul

Two independent apps in one repo. Each has its own `package.json`, dependencies, and Vercel project.

| App | Path | Stack | Vercel project | Production URL |
|---|---|---|---|---|
| Landing site | `/` | React 18 + Vite + Tailwind | `azul` | https://azulwebdev.com |
| Review Booster | `review-booster/` | React/Vite UI + Vercel serverless `api/`, Supabase, Twilio (SMS), Resend (email) | `azul-reviews` | https://azul-reviews.vercel.app |

## Checks

There is no test suite or linter yet. These are the checks; run the ones for every app a change touches.

- Landing site: `npm run build` (run `npm install` first if `node_modules/` is missing)
- Review Booster: `cd review-booster && npm run build && find api -name '*.js' -print0 | xargs -0 -n1 node --check`
  (`vite build` never touches `api/`, so the syntax check is what catches serverless errors)

## Git

- Default branch: `main`, remote: `origin`. Solo repo: commits go straight to `main`.
- Never force-push. Never commit `.env` files.

## Deploy

- Both apps deploy automatically via the Vercel Git integration when `main` is pushed. Pushing IS deploying.
- Deploy status: GitHub deployments for the pushed commit, one per Vercel project (environments `Production – azul` and `Production – azul-reviews`). Readable without auth: `curl -s "https://api.github.com/repos/<owner>/<repo>/deployments?sha=<sha>"`, then each deployment's `statuses_url`.
- Smoke checks (GET only):
  - Landing site: `https://azulwebdev.com/` → 200
  - Review Booster: `https://azul-reviews.vercel.app/` → 200, and `https://azul-reviews.vercel.app/api/review/smoke-check-nonexistent` → 404 with body `{"error":"Not found"}` (a 500, or any other body, means env vars or Supabase are broken)
- **Never** call `/api/send-due` or POST anything as a check: it texts and emails real customers.
- Rollback: Vercel dashboard → project → Deployments → previous deployment → Promote to Production.

## Session notes

`docs/notes.md`: dated entries appended by `/wrap-up`, read by `/resume`.
