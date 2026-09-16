# Azul Review Booster

Your own review-automation system. No GoHighLevel. ~$0.01 per SMS, everything else free tier.

```
Admin marks job complete  →  wait N hours  →  SMS + email w/ link  →  /r/:token review gate
                                                                          ├─ 5★  → Google review page
                                                                          └─ 1-4★ → private feedback → owner email/SMS
                                            48h no click → one follow-up SMS
```

**Stack:** React + Vite + Tailwind · Vercel serverless (`/api`) · Supabase · Twilio · Resend

---

## 1. Accounts (30 min)

| Service | What to do | Copy into `.env` |
|---|---|---|
| **Supabase** | New project → SQL Editor → paste `supabase/schema.sql` → Run | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → **service_role**) |
| **Twilio** | Buy a 305/786 number. Complete A2P 10DLC registration (required for US SMS, takes 1-3 days) | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| **Resend** | Add + verify your domain (DNS records) | `RESEND_API_KEY`, `EMAIL_FROM` |
| **Vercel** | `npm i -g vercel` → `vercel login` | — |

Then: `cp .env.example .env` and fill it in. Generate keys: `openssl rand -hex 24` (twice — ADMIN_KEY + CRON_SECRET).

## 2. Run locally

```bash
cd review-booster
npm install
npx vercel link          # first time only
npx vercel env pull      # OR just use your .env
npm run dev              # runs vite + /api together on http://localhost:3000
```

Open `http://localhost:3000/admin` → paste your `ADMIN_KEY`.

## 3. Get HelloYou's Google review link

1. Google Maps → search "Hello You Wellness Center" → Share → copy the Place ID, **or**
2. Go to https://developers.google.com/maps/documentation/places/web-service/place-id → search the business → copy Place ID
3. Link = `https://search.google.com/local/writereview?placeid=<PLACE_ID>`
4. Update the seeded client in Supabase (Table Editor → `clients`) or create it from the admin UI.

## 4. Test end-to-end (before touching a real customer)

1. Admin → add yourself as the customer, check **Send immediately**
2. Trigger the sender manually: `curl "http://localhost:3000/api/send-due?key=YOUR_CRON_SECRET"`
3. You should get an SMS + email. Tap the link.
4. Try 5★ (redirects to Google) and 3★ (private feedback → owner email). Owner email = whatever you set on the client, point it to yourself first.
5. Check the admin table: status should go `pending → sent → clicked → rated`.

## 5. Deploy

```bash
vercel                   # preview
vercel --prod            # production
```

Set all env vars in Vercel → Project → Settings → Environment Variables. Set `APP_URL` to your prod URL (e.g. `https://reviews.azuldevs.com`).

**Cron:** `vercel.json` runs `/api/send-due` hourly (Vercel Hobby limit). For faster delivery, add a free job at https://cron-job.org hitting `https://<your-domain>/api/send-due?key=<CRON_SECRET>` every 10 min.

## 6. Onboard HelloYou (the actual workflow)

- Front desk finishes an appointment → opens `/admin` on their phone → types name + phone → done. (10 seconds.)
- Or you do it weekly from their appointment list.
- Owner gets an email/SMS only when a 1-4★ comes in.
- Monthly: screenshot the stats card → send to client. That's your report.

**Later (when you have 3+ clients):** add a webhook endpoint that their booking software (Vagaro / Square / Jobber / Housecall Pro) calls on "appointment completed" so nobody has to type anything.

---

## Files

```
api/
  clients.js          GET list+stats / POST create              (admin)
  requests.js         GET list / POST "job complete" trigger     (admin)
  send-due.js         cron: send due requests + follow-ups       (CRON_SECRET)
  review/[token].js   GET gate info / POST rating+feedback       (public)
  _lib/               db, sms (Twilio), email (Resend), templates (EN/ES), auth
src/pages/
  ReviewGate.jsx      public /r/:token page (bilingual, star gate, private feedback)
  Admin.jsx           /admin dashboard: clients, trigger form, request log, stats
supabase/schema.sql   tables + stats view + HelloYou seed
```

## Compliance notes (don't skip)

- **TCPA:** only text customers who actually did business with the client. Include the business name in every SMS (templates do).
- **Google policy:** gating 1-4★ from Google is a gray area. The page never *blocks* anyone from reviewing — it just doesn't push them. Keep it that way.
- **A2P 10DLC:** Twilio will silently drop US SMS until registration is approved. Do this on day 1.
