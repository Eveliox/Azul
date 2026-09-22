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
