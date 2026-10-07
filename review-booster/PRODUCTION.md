# AI Agents production rollout

The first runnable agent is **Estimate Follow-Up**. Other role cards are examples,
not executable agents. Manual estimate entry, model drafting, human approval,
email delivery, audit history and conservative AI budget reservations are implemented.
CRM imports, delivery webhooks and automatic reply handling are not implemented.

## Apply and configure

1. Back up the existing database. On an existing project apply these additive
   migrations in order (do not re-run the seed section in schema.sql):
   - `supabase/migrations/20261007_ai_agents_service.sql`
   - `supabase/migrations/20261008_agent_operations.sql`
   On a new project first apply schema.sql, then both migrations.
2. In Supabase Auth, set Site URL to `https://app.azulwebdev.com` and add
   `https://app.azulwebdev.com/admin` to allowed redirect URLs. Disable public
   sign-ups. Create the first owner account using the Supabase dashboard.
3. With the local/server Supabase environment configured, run:
   `node --env-file=.env scripts/provision-member.mjs USER_UUID --agency-admin`.
   This grants agency-level administration; never grant it to a customer account.
   The script can also add an existing user to a business with `USER_UUID CLIENT_UUID`.
4. In the existing Vercel project whose root is `review-booster`, configure all
   entries in `.env.example`. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   go into browser builds. Never prefix a service-role, model or email key with VITE.
   Set APP_URL to the production origin. Set AGENT_EMAIL_FROM to a verified Resend
   sender; this is separate from the existing review sender.
5. The example configuration uses GPT-4.1 Mini for short, structured drafts at
   $0.40 input / $1.60 output per million tokens (verified October 7, 2026).
   Confirm account access and pricing before activation. If changing models, update
   OPENAI_AGENT_MODEL and both standard (noncached) token prices together.
   Set AGENTS_ENABLED=true, AGENTS_EMAIL_ENABLED=false initially. Configure a
   provider-side project spending limit too. Prices must be updated when the model
   or provider rates change. The app budget is based on configured prices, not a
   provider billing integration. Reservations are conservative, retained on failed
   attempts, and count in the month each attempt begins (UTC). Email costs are separate.
6. Use Node 22.12+ (Node 22 on Vercel). The updated Tailwind styles target modern
   browsers: Safari 16.4+, Chrome 111+, Firefox 128+. Deploy to a preview, run `node --env-file=.env scripts/check-production.mjs`,
   test email login and workspace isolation, then deploy production.
7. Sign in with the named agency account. Enable Custom AI Agents under Workspace
   access. Create individual team invitations there and share their private links
   securely. No invitations are emailed automatically. Recipients open their link,
   then use "Set or change your account password" before signing out.
   Set DISABLE_LEGACY_ACCESS_KEYS=true only after team accounts have been verified.

## Schedule the worker

The repository includes `.github/workflows/agent-worker.yml`. It is disabled unless
GitHub repository variable AGENT_WORKER_ENABLED is exactly `true`. Configure:

- Repository variable AGENT_APP_URL = `https://app.azulwebdev.com`
- Repository secret AGENT_CRON_SECRET = the deployment's CRON_SECRET
- Repository variable AGENT_WORKER_ENABLED = `true`

GitHub runs a best-effort schedule every five minutes. It can be delayed or dropped
under load, and public-repository schedules can be disabled after inactivity. This
is suitable for a small pilot, not a promised response-time SLA. Each invocation
processes one draft OR one email. A complete follow-up needs at least two ticks and
a human approval. Use a monitored scheduler calling POST /api/agent-worker with
Authorization: Bearer CRON_SECRET for higher throughput or tighter timing. Never
put the secret in a URL. Do not run a second scheduler unintentionally.

The dashboard shows the last worker claim check, not a guarantee of provider health.
Monitor failed workflow runs and runs marked Failed / Needs reconciliation.
The legacy review sender is separate and still needs its existing scheduler verified.

## Pilot acceptance

Use a customer name and email you control. Creating or approving a real customer's
follow-up is not part of automated tests.

- Add an estimate in Testing mode. Confirm it becomes Needs approval.
- Edit the draft; approve it. Confirm it stays Approved while sending is disabled.
- Enable AGENTS_EMAIL_ENABLED, redeploy, set a team reply-to address, and activate
  just the pilot business. Confirm the exact approved message reaches your test inbox.
- Confirm the provider message ID and event history, and reply to verify the team's inbox.
- Pause the business; confirm queued work stops. A request already at the provider
  cannot be recalled by pausing. Pausing does not delete queued approvals.
- Verify an unrelated client's session cannot fetch, approve, change progress, or
  manage members of another business. Legacy shared keys cannot operate agents.
- Test invalid model credentials, provider timeouts and an expired sending lease.
  Every model attempt reserves budget. At most three automatic attempts occur.
  Sending retries retain the exact persisted payload and idempotency key. They stop
  after 20 hours, before Resend's 24-hour idempotency window expires.
- For Needs reconciliation, inspect Resend first. Never create a new estimate ref
  merely to retry an uncertain send. Accepted by provider does not mean delivered.
- Check the provider dashboard for actual billed cost, bounces and complaints.

## Recovery

Disable AGENTS_EMAIL_ENABLED (redeploy) and set businesses to Paused. Disable the
scheduler if needed. Leave database history intact. Roll back the Vercel deployment
if the UI needs recovery; the migrations are additive. Do not delete the new tables
or run destructive down migrations in production. Existing browser-only checklist
marks are not automatically imported; the live UI now reads shared database progress.

## Verification commands

- `npm test`
- `npm run build`
- `npm run test:database` (requires the development-only PGlite dependency)
- `node --env-file=.env scripts/check-production.mjs` (read-only live readiness)

Unit/provider tests use fakes. SQL tests use isolated PostgreSQL via PGlite, never
production. Live model, email and deployment checks must be completed with the
connected provider accounts before calling this production-ready.

References: [structured output](https://developers.openai.com/api/docs/guides/structured-outputs),
[model and pricing](https://developers.openai.com/api/docs/models/gpt-4.1-mini),
[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys),
[GitHub schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

Browser checks are in `scripts/test-agent-ui.cjs` (mocked APIs) and
`scripts/test-review-ui.cjs` (local demo + mocked public review API). Start the demo
on port 3014 and run them with Playwright available, or point PLAYWRIGHT_MODULE to
an installed Playwright module. UI_TEST_ORIGIN can override the local origin.
These are fixtures, not evidence of live delivery or client business results.
