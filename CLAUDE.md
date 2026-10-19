# Azul

Two independent apps in one repo. Each has its own `package.json`, dependencies, and Vercel project.

| App | Path | Stack | Vercel project | Production URL |
|---|---|---|---|---|
| Landing site | `/` | React 18 + Vite + Tailwind | `azul` | https://azulwebdev.com |
| Review Booster | `review-booster/` | React 18 + Vite 8 + Tailwind 4 UI, Vercel serverless `api/`, Supabase (DB + Auth), Twilio (SMS), Resend (email), OpenAI (AI Agents) | `azul-reviews` | https://app.azulwebdev.com (also https://azul-reviews.vercel.app) |

Review Booster needs Node 22.12+. Its AI Agents rollout (what's on, what's still off, how to turn it on) is in `review-booster/PRODUCTION.md`.

## Checks

The landing site has no tests or linter. Run the checks for every app a change touches.

- Landing site: `npm run build` (run `npm install` first if `node_modules/` is missing)
- Review Booster: `cd review-booster && npm test && npm run test:database && npm run build && find api -name '*.js' -print0 | xargs -0 -n1 node --check`
  - `npm test`: unit tests in `tests/` (provider calls use fakes)
  - `npm run test:database`: runs the migrations in an in-memory Postgres (PGlite), never a real database
  - `vite build` never touches `api/`, so the syntax check is what catches serverless errors
- Review Booster UI changes: also run `/ui-check` (browser tests against local fake data).
- CI: the GitHub Actions workflow "Dashboard checks" runs the Review Booster checks plus `npm audit` on every push to `main` touching `review-booster/`.

## Git

- Default branch: `main`, remote: `origin` (GitHub `Eveliox/Azul`). Solo repo: commits go straight to `main`.
- Never force-push. Never commit `.env` files.
- `gh` is not logged in on this machine; read GitHub state through the public API with `curl` (see Deploy).

## Database (Supabase)

- There is no Supabase CLI or `psql` here, and the local `.env` cannot reach the database. The user runs SQL in the Supabase dashboard's SQL Editor. Use `/migrate` for any schema change.
- New changes go in `review-booster/supabase/migrations/` as dated, additive, re-runnable files (`create ... if not exists`, `create or replace`). `supabase/schema.sql` is the full schema for a brand-new project; keep it in sync.
- Apply a migration in production **before** pushing code that depends on it.
- Every new table: enable Row Level Security and `revoke all ... from public, anon, authenticated`. The API reaches the database with the service-role key; the browser never queries tables directly.

## Environment variables

- Vercel env vars for Review Booster are set in the dashboard (no Vercel CLI here). `.env.example` lists every variable.
- A `VITE_` prefix puts the value into public browser code. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` may have it; Vercel stores those two as **Config**. Everything else (service-role key, Twilio, Resend, OpenAI, `ADMIN_KEY`, `CRON_SECRET`) stays **Sensitive** and never gets a `VITE_` name.
- `VITE_` values are baked in at build time: changing one needs a redeploy.

## Sign-in

- Individual email accounts (Supabase Auth). Agency admins are rows in `rb_agency_admins`; team members are rows in `rb_workspace_members`. Public sign-up is off; users are created in the Supabase dashboard or invited from Workspace access.
- Legacy shared access keys still work until `DISABLE_LEGACY_ACCESS_KEYS=true`. Don't set it until every client has a working email login.

## Deploy

- Both apps deploy automatically via the Vercel Git integration when `main` is pushed. Pushing IS deploying.
- Deploy status: GitHub deployments for the pushed commit, one per Vercel project (environments `Production – azul` and `Production – azul-reviews`). Readable without auth: `curl -s "https://api.github.com/repos/Eveliox/Azul/deployments?sha=<sha>"`, then each deployment's `statuses_url`. CI results: `curl -s "https://api.github.com/repos/Eveliox/Azul/actions/runs?head_sha=<sha>"`.
- Smoke checks (GET only):
  - Landing site: `https://azulwebdev.com/` → 200
  - Review Booster: `https://app.azulwebdev.com/` → 200, and `https://app.azulwebdev.com/api/review/smoke-check-nonexistent` → 404 with body `{"error":"Not found"}` (a 500, or any other body, means env vars or Supabase are broken)
- **Never** call these as a check, and never POST anything: `/api/send-due` (texts and emails real customers), `/api/agent-worker` (spends AI budget and emails customers), `/api/agents`, `/api/team`.
- The "Estimate follow-up worker" GitHub workflow stays off unless the repo variable `AGENT_WORKER_ENABLED` is `true`. Don't enable it without the user.
- Rollback: Vercel dashboard → project → Deployments → previous deployment → Promote to Production. Migrations are additive and stay in place.

## Session notes

`docs/notes.md`: dated entries appended by `/wrap-up`, read by `/resume`.
