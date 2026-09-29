# Dashboard preview

## Run without external accounts

```sh
cd review-booster
npm install
npm run demo
```

Keep the terminal open. Visit http://localhost:3000/admin and use `dev-master-key-123`.

This is a **loopback-only, in-memory UI demo**, not a production backend. The blue demo banner distinguishes sample data. Business creation, request scheduling, key rotation and message edits persist only until the server restarts. Test delivery is deliberately disabled. Review links require the real backend. No environment secrets are read and no SMS/email is sent. Never deploy `dev-server.js` publicly.

Demo business login: `demo-business-key-helloyou-12345678` (unless rotated in this session). This hides master-only business creation and access settings.

`npm run demo` rebuilds the UI before starting. Stop this specific server with Ctrl+C before restarting. Do not kill all Node processes.

## Full stack

`npm run dev:local` starts Vercel dev with real API routes. It requires Vercel project setup, real Supabase credentials, and schema setup. `npm run dev` / `npm run dev:ui` start Vite only, with `/api` proxied to port 3000. The Vercel Development Command should be `vite`, not `vercel dev`.

## Client onboarding & access (how clients get in)

There is no signup page on purpose. **The access key is the login.** Azul creates every workspace; clients never self-register.

**Your flow (master key):**
1. Dashboard → **Add business** → fill in name, short ID, owner, and tick the services in their plan.
2. The Google review link and timing fields only appear when Review Booster is ticked.
3. On submit you get a **key-ready** step: copy the 48-char key, or copy the ready-made invite message (“Go to …/admin, paste this key, you’ll see: …”).
4. Send that message to the owner privately (text/WhatsApp/email). Done.

**Client flow (business key):**
- Opens `/admin`, pastes the key, bookmarks it. No password, no reset emails.
- Sees only the services in their plan (sidebar, cards, filters). Other services appear once as an **“Unlock more services”** card that tells them to message Azul.
- Cannot add businesses, change their plan, or reach Workspace access. `PATCH /api/clients` and `POST /api/clients` return 403 for a business key.

**Changing a plan later:** Workspace access → *Services in their plan* → tick/untick → **Save plan**. Their next page load reflects it. The same page has the invite message and the key reset.

**Storage:** `rb_clients.services text[]`, constrained to `website | calls | reviews | seo`, default `{reviews}`. `google_review_url` is now nullable; `POST /api/requests` refuses (403/409) for businesses without Review Booster or without a review link. Master sees all four cards for delivery planning with a “Not in plan” badge on services the client is not paying for.

**Existing Supabase project?** Re-run `supabase/schema.sql` — it is idempotent and adds the column, constraint, and view fields. Existing rows default to `{reviews}`; set HelloYou to `{reviews,seo}` in the Table Editor or via Workspace access.

## Business workspace (service navigation)

The default dashboard is now the **Azul Business Workspace**, not the Reviews overview. The sidebar and filterable cards open Website, Voice agents, Reviews, and Local SEO.

- Reviews retains its API-backed overview, customer requests, message editor, and master-only workspace access controls. Overview / Requests / Messages are subtabs under Reviews.
- Website and Voice agents have manual setup checklists, with explicit notices that hosting analytics and Vapi data are not connected.
- Local SEO has one-time onboarding and a month-specific delivery checklist: approved assets, EN/ES drafts, 8 total posts, a website update, and a ranking report.
- Home combines the latest review-request states with locally recorded checklist completions. Service and activity filters work together. “Up next” links to the next incomplete step; it is not a calendar.
- These service cards are workspace navigation, not active subscription or billing indicators.

### Planning persistence

Checklist marks are stored in `localStorage` under `azul:delivery:v1:<demo/live>:<client_id>:<setup/month>`. Only task IDs and completion timestamps are stored. Business, environment, and monthly plans are isolated. Unknown IDs/invalid timestamps are ignored; unreadable storage falls back to an empty plan. A failed write displays a warning.

Planning marks survive reload/server restart in the same browser, unlike the mock API records. They are **not Supabase-backed, not synchronized between staff/devices, not provider-verified, and not audit records**. Clearing browser data clears them. They do not publish content, schedule calls, send messages, or change a service configuration.

Run `npm test` for service-plan unit checks. Browser checks covered card filters, every service destination, review subtabs, month/business isolation, reload persistence, mobile overflow, and client-role navigation.

## Dashboard features

- Blue-and-white access-key sign-in, responsive sidebar/mobile navigation.
- All-time metrics: sends, link visits, responses, average private-feedback rating.
- 7/14/30-day activity chart based on timestamps from the latest 100 requests.
- Response-rate ring; this is not Google-review conversion.
- Customer search, status filters, 10-row pagination, expandable feedback/errors.
- Accessible native dialogs for adding businesses and scheduling requests.
- Existing EN/ES message editor and preview, with workspace-matched styling.
- Hidden-by-default business key, reveal/copy/reset, master-only access section.
- Explicit loading, empty, error, and demo states.

## Smoke checks

1. Incorrect key shows an error; master key opens Overview.
2. Search a customer, filter status, clear search, navigate pages.
3. Change chart range. Zero-data businesses show an empty chart, not synthetic results.
4. Open New request; Escape closes it and restores focus. Enter a name + email, submit, confirm scheduled row appears.
5. Add a business; switch between it and HelloYou without old request data leaking into the new view.
6. Edit a message, save, leave and return. Preview test-send shows that delivery is disabled.
7. Reveal/copy/reset a key. Sign out; old key is rejected and new business key opens only its workspace.
8. Verify 390px mobile width: navigation scrolls, table scrolls inside its panel, dialogs fit.

## Before production

The UI redesign does not certify delivery, compliance, or backend reliability. In particular:
- Existing review gating (Google links shown only for five-star feedback) should be replaced with equal public-review access for all customers; selective solicitation violates Google's review policies.
- Collect appropriate messaging consent and implement opt-out handling before live SMS. A business relationship alone is not sufficient permission for every kind of message.
- Add reliable send claiming/retries, delivery-status callbacks, and real integration tests.
- Do not describe feedback stars as verified Google reviews or promise ranking/revenue gains.
