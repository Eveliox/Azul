# Speed-to-lead agent without Make: build plan

Written 2026-11-10. Replaces the Make.com scenarios (A new lead, B call ended, C retries, E owner first) with code in Review Booster (`review-booster/api/`, Supabase, Resend, Twilio). Vapi stays: it still makes the calls and books Google Calendar through its own tools. Google Sheets is replaced by Supabase tables.

Make keeps running Test AC Co. until step 5 passes. Nothing here touches a real client until then.

**Status 2026-11-10:** steps 1–5 done and Test AC Co. runs on `/api/leads/*` (Make A and B are OFF; delete them and cancel Make after 2026-11-24). Part 2 built locally (not yet migrated or deployed): owner first (step 6), inbound callbacks, the Leads section and Azul-only Agent setup on the dashboard's Speed-to-Lead Agent page, "stop calling", and step 7 cleanup (privacy policy, `/speed-to-lead-site` skill, per-client template, inbound prompt template). Migration `20261111_speed_to_lead_owner_inbound.sql` must be applied before that code ships.

## What moves where

| Make today | New home |
|---|---|
| A: form webhook → Sheets row → Vapi call | `POST /api/leads/new` |
| B: Vapi end-of-call → update row, Gmail owner + lead, add to Do not contact | `POST /api/leads/call-ended` |
| C: every 30 min, retry `retry` rows | `POST /api/leads/retry`, run by a GitHub Actions schedule |
| E: owner first (designed, never built) | `POST /api/leads/owner` (Twilio webhooks) |
| Sheet tabs `Leads`, `Do not contact` | Tables `rb_leads`, `rb_lead_calls`, `rb_do_not_contact` |
| Per-client copies of A/B/C/E | One row per client in `rb_lead_agents` |
| Gmail | Resend (`api/_lib/email.js`, already in use) |

All four routes are **one serverless function**, `api/leads/[action].js`. Review Booster has 10 functions today; Vercel's Hobby plan stops at 12, and four separate files would hit it.

The existing `api/vapi-webhook.js` (inbound-call emails, `VAPI_LEAD_ROUTES`) stays as it is. Speed-to-lead assistants point their Server URL at the new route, so the two never mix.

## Step 1: Database (use `/migrate`)

New file `review-booster/supabase/migrations/20261110_speed_to_lead.sql`, also added to `supabase/schema.sql`. Additive and re-runnable. Every table gets Row Level Security on plus `revoke all ... from public, anon, authenticated`.

**`rb_lead_agents`**: one row per client, keyed on `rb_clients.id` (service `calls`).
- `client_id` (PK, FK `rb_clients`), `mode` (`testing` | `active` | `paused`, default `testing`)
- `form_key`: random secret the client's site sends to identify itself (default `encode(gen_random_bytes(24),'hex')`)
- `vapi_assistant_id`, `vapi_phone_number_id`, `business_name`, `twilio_number` (E.164)
- `owner_email`, `owner_cell`, `owner_first` (bool, default false)
- `timezone` (default `America/New_York`), `call_start_hour` (8), `call_end_hour` (20), `call_sundays` (false)
- `max_attempts` (3), `retry_gap_minutes` (120)
- `test_numbers` (text[]): in `testing` mode, only these numbers are ever called

**`rb_leads`**: replaces the `Leads` tab.
- `id`, `client_id`, `received_at`, `name`, `phone` (E.164), `email`, `address`, `service`, `consent` (must be true), `consent_text`, `source_url`
- `status`: `new`, `calling`, `retry`, `owner_ringing`, `owner_connecting`, `owner_talked`, `booked`, `handed_off`, `needs_owner`, `stopped`, `no_answer`, `failed`, `blocked`
- `attempts`, `first_call_at`, `last_attempt_at`, `next_attempt_at`, `current_call_id`
- `ended_reason`, `booked`, `appointment_time`, `summary`, `last_error`
- `lease_token`, `lease_until`: so two retry runs can never call the same lead twice
- Duplicate guard: the same client + phone within 10 minutes returns the existing lead instead of calling twice (double-clicked submit).

**`rb_lead_calls`**: one row per call attempt. `call_id` (unique), `lead_id`, `kind` (`ai` | `owner`), `placed_at`, `ended_at`, `ended_reason`. The unique `call_id` makes the end-of-call webhook safe to receive twice.

**`rb_do_not_contact`**: `client_id`, `phone`, `added_at`, `reason`, unique (`client_id`, `phone`).

**Functions**
- `rb_claim_lead_retries(p_limit int)`: locks due `retry` leads (`next_attempt_at <= now()`, attempts below max, lease free), sets a 5-minute lease, returns them. Same pattern as `rb_claim_agent_work`.
- `rb_finish_lead_attempt(p_lead, p_lease, p_result jsonb)`: records the outcome only if the lease still matches.

**Database test**: extend `scripts/test-agent-database.mjs` (PGlite) to run the new migration twice, insert two clients, and check: two parallel claims never return the same lead, a stale lease can't finish, and duplicate `call_id`s are rejected.

## Step 2: Shared logic, `api/_lib/leads.js` (pure functions, unit-tested)

- `toE164(phone)`: US numbers only. Returns null if it isn't 10 digits (or 11 starting with 1).
- `callingWindow(now, agent)`: returns `{ open, nextOpen }` in the client's timezone (8:00 to 19:59, no Sundays by default). Test it around daylight-saving changes and Saturday night → Monday.
- `vapiCallBody(lead, agent, now)`: the same JSON Make sends today (`assistantId`, `phoneNumberId`, `customer.number`, `variableValues` name/business/service/address/today). The first name falls back to "there".
- `outcomeFromReport(report, lead, agent)`: decides the next status:
  - `appointment_booked` true → `booked`
  - `do_not_call` true → `stopped`, plus a Do not contact row
  - voicemail / no answer / busy → `retry` with `next_attempt_at` = last attempt + 2h, moved to the next calling-window opening; `no_answer` once attempts reach the max
  - transfer → `handed_off`
  - anything else → `needs_owner`
  - It reads the structured output from `message.artifact.structuredOutputs.<id>.result` first, then `analysis.structuredData` (both shapes have appeared).
- Email builders: owner email after every call (status, summary, booked time, link to the recording), and the lead's booking confirmation (only when booked and an email exists; reply-to = owner).

Unit tests go in `tests/leads.test.js`. Base the fixtures on real Vapi reports from the Test AC Co. tests, with personal details replaced, so the `endedReason` strings match what Vapi actually sends.

## Step 3: Routes in `api/leads/[action].js`

**`POST /api/leads/new`**
- Auth: `x-lead-key` header = the client's `form_key`. The client's site sends it from its server route (`/speed-to-lead-site` already builds one), so the key never reaches the browser.
- Accepts JSON or form-encoded fields. Rejects the request if the honeypot field is filled, consent isn't `yes`, or the phone isn't valid.
- Checks the Do not contact list (`blocked`) and the duplicate guard, then inserts the lead.
- Calling window open → calls Vapi `POST https://api.vapi.ai/call` before answering the request (about 1 second), then saves `current_call_id` with status `calling` and attempts 1. Closed → `retry` with `next_attempt_at` set to the next opening.
- Vapi error (no credits, bad ID) → status `retry`, `last_error` saved, **and the owner gets an email right away: "We couldn't call this lead. Call them yourself."** Make doesn't do this today; when credits run out, calls just stop.
- `mode = paused` → saves the lead and emails the owner, no call. `mode = testing` → calls only `test_numbers`.
- Global kill switch: env `LEAD_CALLS_ENABLED` must be `true`, or no call is placed (the lead is still saved and the owner emailed).

**`POST /api/leads/call-ended`** (Vapi Server URL for speed-to-lead assistants)
- Checks `x-vapi-secret` against `VAPI_LEAD_AGENT_SECRET` (timing-safe, like `vapi-webhook.js`). Only `end-of-call-report` messages are used.
- Finds the lead through `rb_lead_calls.call_id`; an unknown call → 200 ignored. A report already recorded → 200, nothing happens again.
- Applies `outcomeFromReport`, writes the Do not contact row if needed, sends the emails.
- Always answers 200 after authentication so Vapi doesn't retry over and over; failures go to the Vercel logs.

**`POST /api/leads/retry`** (scheduled)
- Bearer auth with its own `LEAD_CRON_SECRET` (header only), separate from `CRON_SECRET`, which also guards `/api/send-due`.
- Claims up to 5 due leads, checks the calling window and Do not contact again, places the Vapi call, finishes the attempt.
- Also catches stuck calls: a lead still `calling` 30 minutes after its last attempt (no report arrived) → `needs_owner` plus an owner email.

**`POST /api/leads/owner?step=...`** (step 6, owner first)

## Step 4: Schedule

New workflow `.github/workflows/lead-retries.yml`, copied from `agent-worker.yml`: every 10 minutes, `POST $APP_URL/api/leads/retry` with the bearer secret. It runs only when the repo variable `LEAD_RETRY_ENABLED` is `true`. GitHub can start it 5 to 20 minutes late; that's fine for retries 2 hours apart. The first call never waits for the schedule.

**New Vercel env vars** (all Sensitive; add them to `.env.example`): `VAPI_API_KEY`, `VAPI_LEAD_AGENT_SECRET`, `LEAD_CALLS_ENABLED`. Twilio, Resend and `CRON_SECRET` already exist.

**CLAUDE.md**: add `/api/leads/*` to the "never call as a check" list (it calls real people). Smoke check: `GET https://app.azulwebdev.com/api/leads/new` → 405.

Checks before pushing: the Review Booster set in CLAUDE.md (`npm test`, `npm run test:database`, `npm run build`, `node --check` on `api/`), then `/review`.

## Step 5: Switch Test AC Co. over

1. Apply the migration in Supabase (`/migrate`), then push the code.
2. In the SQL Editor: add Test AC Co. to `rb_clients` (services `{calls}`) and `rb_lead_agents` (assistant `92a1a4d7-…`, phone number `90e9e838-…`, never `affa2e72-…`), mode `testing`, `test_numbers` = your two phones.
3. Vercel: set the three env vars, `LEAD_CALLS_ENABLED=true`, redeploy. Also set `LEAD_CRON_SECRET` in Vercel; in GitHub, add the repo secret `LEAD_CRON_SECRET` (same value) and set the repo variable `LEAD_RETRY_ENABLED=true` **at the same time**: after-hours and unanswered leads are only called again by that workflow.
4. Vapi → the Test AC assistant → Server URL = `https://app.azulwebdev.com/api/leads/call-ended`, secret = `VAPI_LEAD_AGENT_SECRET`, server messages = end-of-call-report only.
5. Switch Make scenarios A and B **off**, so both systems never call the same lead.
6. Point `ai-agents/clients/test-ac/test-lead-form.html` at a small local relay that adds `x-lead-key` (or give the test form the key; it's local only).
7. Tests, your phones only:
   - Booking → row `booked`, calendar event at the right time, owner and lead emails.
   - "Don't call me" → `stopped`, Do not contact row; a second submit → `blocked`, no call.
   - No answer → `retry`; with `LEAD_RETRY_ENABLED=true` the second call comes about 2h later; after 3 tries → `no_answer`.
   - After-hours submit → no call until 8 AM, then the retry run calls.
   - Vapi failure (temporarily wrong assistant ID) → owner email "couldn't call".
   - Same form submitted twice in a row → one call.
8. All pass → leave Make scenarios off. Delete them after two quiet weeks, then cancel Make.

## Step 6: Owner first (Scenario E)

Same flow as the walkthrough's Scenario E, in code:
- `/new`: if `owner_first`, use Twilio `Calls.json` to ring `owner_cell` from `twilio_number` (Timeout 25), with TwiML `<Gather numDigits="1">` "New website lead, Maria, AC repair. Press 1 to call them now." Status `owner_ringing`.
- `step=pressed`: digit 1 → `<Dial callerId=twilio_number>` the lead, status `owner_connecting`.
- `step=dial_done`: lead answered → `owner_talked`; otherwise → `retry`.
- `step=owner_done` (status callback): still `owner_ringing` → place the AI call.
- **Check `X-Twilio-Signature`** on every Twilio request (Make never did). Spoken names go through XML escaping.
- Tests: the four in the walkthrough.

## Step 7: Clean-up once Make is off

- Privacy policy: remove "Automation: Make.com" from `src/data/legal.js` (English line 50, Spanish line 174); run the landing checks (`npm run build`, `tests/legal.test.js`).
- `/speed-to-lead-site` skill (Claude and Codex copies): post to `https://app.azulwebdev.com/api/leads/new` with `x-lead-key` from the site's env instead of a Make webhook. If that post fails, the site's route emails the owner the lead, so the lead is never lost.
- `ai-agents/clients/_template/README.md`: the per-client table becomes "add one `rb_lead_agents` row" instead of cloning scenarios.
- Update or retire Make references in `voice-agents/templates/webhook-make.md`, `voice-agents/templates/troubleshooting.md`, `ai-agents/templates/agent-spec.md`, `handovers/delivery-guide.md`, `ai-agents/README.md`.
- Update memory: the Make scenarios note becomes history.

## Later (not in this build)

- Leads list in the client's dashboard (Review Booster workspace, `calls` service).
- Texting (Scenario D: STOP replies) after the first client's A2P 10DLC registration.
- Adding a client from the admin screen instead of SQL.

## Open questions

- **Vercel plan**: Hobby is for non-commercial use. Paying clients' lead calls likely need Pro ($20/mo). Check before the first real client.
- **Lead confirmation sender**: from Azul's Resend domain with the client's name ("Test AC Co. via Azul"), reply-to the owner. Fine for now; per-client sending domains can come later.

## Part 2 (built 2026-11-10)

- **Dashboard**: Speed-to-Lead Agent page shows the agent's mode and rules, this month's numbers (leads, median time to first call during calling hours, booked, need you), and the latest 100 leads with status, call summary and "Stop calling". Business teams never see the form key, Vapi IDs or raw provider errors.
- **Agent setup (Azul only)**: same page. Replaces the SQL for adding a client; shows the lead address and form key (hidden until revealed) and rotates the key. Routes: `GET /api/leads/list`, `GET|POST /api/leads/agent`, `POST /api/leads/stop` (same single function).
- **Owner first**: `POST /api/leads/owner?step=pressed|dial_done|owner_done&lead=…`. Every Twilio request is checked with `X-Twilio-Signature` (URL rebuilt from `LEAD_PUBLIC_URL`, default `https://app.azulwebdev.com`). Only before anyone was called for the lead; if Twilio fails, the AI calls immediately; the owner is never rung twice.
- **Inbound callbacks**: a Vapi report with `call.type = inboundPhoneCall` is matched to the business by `vapi_phone_number_id`, recorded once per call id, and emailed to the owner. A booking or do-not-call updates the lead; any other callback stops queued retries and hands the lead to the owner. Setup per client: `ai-agents/clients/_template/inbound-prompt.md`.

## Retry scheduler (2026-11-11)

GitHub ran scheduled workflows here only a few times a day, so retries now run from Supabase: pg_cron job `azul-lead-retries` every 5 minutes, `net.http_post` to `/api/leads/retry` with `Authorization: Bearer` + the Vault secret `azul_lead_cron_secret` (same value as Vercel `LEAD_CRON_SECRET`). Check: `select created, status_code, content from net._http_response order by created desc limit 3;` (200 expected). Stop: `select cron.unschedule('azul-lead-retries');`.

## Part 3 (built 2026-11-10): Azul-built assistants

- **Business details** (`rb_lead_profiles`, `POST /api/leads/profile`): the client's team fills in trade, area, services, questions, emergencies, booking days/hours, visit length, zip codes and shares their Google Calendar, on the Speed-to-Lead Agent page.
- **Call scripts in code** (`api/_lib/lead-prompts.js`): outbound and callback prompts built from those details, based on the Test AC prompts. Client text is stripped of Vapi template tags. Azul previews both scripts in Agent setup.
- **Per-client switch** `assistant_mode`: `vapi` (saved Vapi assistant, as before) or `azul` (the full assistant is sent with each call: prompt, transfer to the owner's cell, the client's calendar tool IDs, server URL + secret, structured output `lead_call_results`). Refused until the template's voice settings are copied from Test AC (`ASSISTANT_BASE` in lead-prompts.js).
- **Callbacks without an inbound assistant**: the business number's Server URL is `/api/leads/call-ended` (with the `x-vapi-secret` header) and no inbound assistant; Vapi sends `assistant-request` and the app answers with the callback assistant. Not ready, Vapi mode, or unknown number: the caller is forwarded to the owner's cell.
- **Send test call** (`POST /api/leads/test-call`, Azul only): calls one of the agent's test numbers now, at any hour and in any mode; test leads skip the 10-minute duplicate guard.
- Template settings copied from Test AC's Vapi export (2026-11-11): GPT-4.1, ElevenLabs Turbo v2.5 voice `SAz9YHcvj6GT2YYXdXww`, Deepgram nova-2 multi. Calendar tools are built per call from the business's **Calendar ID** (migration `20261113_speed_to_lead_calendar.sql`), so the only per-client Vapi step is importing the Twilio number. Voicemail detection and the call summary are on in the template (both were off on Test AC's saved assistant).
