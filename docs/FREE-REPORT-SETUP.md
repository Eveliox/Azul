# Free report setup

The free report at `azulwebdev.com/free-report` checks a business's Google listing and website and shows a score with the top 3 gaps for free. The full report needs a name and email, and each unlock is saved as a lead in Supabase.

Until all four required keys below are set in Vercel, the page shows "almost ready, book a free call" instead of running. Nothing breaks.

| Variable | Required | Where it comes from |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Google Cloud (steps 1–6) |
| `FREE_REPORT_SECRET` | Yes | Any long random string (step 8) |
| `SUPABASE_URL` | Yes | Supabase (step 7) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase (step 7) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `FREE_REPORT_NOTIFY_EMAIL` | Optional | Sends you an email for every new lead. Same Resend setup as Review Booster. |

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com and sign in.
2. Open the project picker at the top → **New project**. Name it `Azul Free Report` → **Create**, then select it.

## 2. Turn on billing

Google requires a billing account for the Places API, even when usage stays inside the free monthly allowance.

**Billing** (left menu) → **Link a billing account** → add a card.

## 3. Enable the two APIs

**APIs & Services → Library**, then search for each one and click **Enable**:

- **Places API (New)**. Make sure it's the one with "(New)"; the legacy Places API won't work.
- **PageSpeed Insights API**

## 4. Create the key

**APIs & Services → Credentials → Create credentials → API key**. Copy the key.

## 5. Restrict the key

On the key's page:

- **API restrictions → Restrict key** → tick **Places API (New)** and **PageSpeed Insights API** → **Save**.
- Leave **Application restrictions** set to **None**. The key is only used from the server (Vercel), which has no fixed IP address, and a website restriction would block those calls. The key never reaches the browser.

## 6. Cap your costs

Each report makes **2 Places searches** (the business and its competitors) and **1 PageSpeed test**. PageSpeed is free. Places has a free monthly allowance, then bills per request. Check current prices at https://developers.google.com/maps/billing-and-pricing/pricing (the report uses **Text Search**, at the tier that includes ratings, phone and hours).

Set two safety nets:

- **Daily cap:** APIs & Services → **Places API (New)** → **Quotas & System Limits** → edit the **Text Search requests per day** limit and set it to `200` (about 100 reports a day). When the cap is hit, reports stop running for the rest of the day and no charges accrue.
- **Budget alert:** Billing → **Budgets & alerts** → **Create budget** → for example $10/month, with email alerts at 50% and 100%.

## 7. Create the leads table in Supabase

You can use the same Supabase project as Review Booster.

1. Supabase → your project → **SQL Editor** → paste the contents of [`supabase/free-report.sql`](../supabase/free-report.sql) → **Run**.
2. **Project Settings → API**: copy the **Project URL** (`SUPABASE_URL`) and the **service_role** secret (`SUPABASE_SERVICE_ROLE_KEY`).

Leads then appear in **Table Editor → free_report_leads**. Each row has the contact details, the score, and the full report as JSON.

## 8. Add everything to Vercel

Vercel → project **azul** (the landing site, not azul-reviews) → **Settings → Environment Variables**. Add each variable from the table above for **Production** and **Preview**.

For `FREE_REPORT_SECRET`, generate a value with:

```sh
openssl rand -base64 32
```

Environment variables apply on the next deploy. Push a commit or click **Redeploy**.

## 9. Check it

1. Open https://azulwebdev.com/free-report and run a report for a real business (your own works well).
2. Unlock it with your email, then check that a row appeared in `free_report_leads`.

To run it locally, `npm run dev` does not serve `/api`. Use `npx vercel link` once, then `npx vercel env pull .env.local` and `npx vercel dev`.

## What it measures, and what it doesn't

- **Measured:** Google rating, review count, phone, hours, photo count (Google returns up to 10) and website link; the first 3 businesses Google shows for the trade in that city; mobile speed and search-basics scores from Google PageSpeed; and HTTPS, mobile setup, tap-to-call, Spanish version, search title and description, and business structured data from the homepage.
- **Not measured:** missed calls, website traffic, and exact search ranking positions.
- **Browser-rendered sites** (React, Vue and similar) send almost no HTML, so the homepage checks are skipped rather than reporting gaps that may not be real. The speed and Google checks still run.
- **Abuse limits:** 5 scans per visitor per 10 minutes (per server instance), a hidden spam-trap field, and the daily Google quota from step 6, which is the hard cost cap.
