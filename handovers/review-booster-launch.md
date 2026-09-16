# HANDOVER — Review Booster Launch (Day 1 → Live)

**Date:** Today's work complete, tomorrow = go live with HelloYou Wellness  
**Goal:** Get the custom Review Booster system running for your first real client (HelloYou) by end of tomorrow.

---

## What we built today

A **fully custom review automation system** to replace GoHighLevel. Zero monthly SaaS fees (just usage: ~$0.01/SMS).

**Location:** `review-booster/` folder in the Azul repo  
**Commit:** `cb608d2` pushed to `main`

### The system

```
Front desk marks job complete
    ↓
Wait 3 hours (configurable per client)
    ↓
SMS + Email → customer taps link → /r/:token (bilingual review gate)
    ↓
    ├─ 5 stars → redirect to Google review page
    └─ 1-4 stars → private feedback form → owner gets email/SMS alert
    ↓
If no click after 48h → one follow-up SMS reminder
```

**Tech stack:**
- Frontend: React + Vite + Tailwind (bilingual EN/ES)
- Backend: Vercel serverless functions (`/api`)
- Database: Supabase (Postgres)
- SMS: Twilio
- Email: Resend
- Cron: Vercel (hourly) + cron-job.org (every 10 min for faster delivery)

**What it does better than GHL:**
- ✅ Fully bilingual (every message, every page, auto-language detection)
- ✅ You own the data (Supabase)
- ✅ ~$70/mo cost per client vs $297+ GHL agency fee
- ✅ 86% margin on $349/mo AI Answering package
- ✅ Clean admin dashboard (no bloat)
- ✅ Review shield (1-4 stars never go public, owner gets private alert)

---

## Current status

| Component | Status | Notes |
|---|---|---|
| Code | ✅ Done | All files written, syntax-checked, builds clean |
| Git | ✅ Pushed | Commit `cb608d2` on `main` |
| Supabase | ❌ TODO | Need to create project + run schema |
| Twilio | ❌ TODO | Need to buy number + A2P 10DLC registration |
| Resend | ❌ TODO | Need to verify domain |
| Vercel | ❌ TODO | Deploy + set env vars |
| HelloYou setup | ❌ TODO | Get Google Place ID, seed client row |
| Testing | ❌ TODO | End-to-end test with your phone before touching real customer |

---

## Tomorrow's checklist (in order)

### 🔴 Priority 1: Accounts (1-2 hours)

**Do these in parallel while waiting for approvals:**

#### 1. Supabase (15 min)
```
1. Go to supabase.com → New project
2. Name: azul-review-booster
3. Region: closest to Miami (us-east-1)
4. Wait 2 min for provisioning
5. SQL Editor → New query → paste review-booster/supabase/schema.sql → Run
6. Settings → API → copy:
   - Project URL → SUPABASE_URL
   - service_role key (NOT anon key) → SUPABASE_SERVICE_ROLE_KEY
```

#### 2. Twilio (30 min + 1-3 day wait)
```
1. Sign up at twilio.com (or log in)
2. Console → Phone Numbers → Buy a Number
   - Pick Miami area code: 305 or 786
   - Capabilities: SMS enabled
   - Cost: ~$1.15/mo + $0.0079/SMS
   - Copy the number in E.164 format (+13055551234) → TWILIO_FROM_NUMBER
3. Console → Account Info → copy:
   - Account SID → TWILIO_ACCOUNT_SID
   - Auth Token → TWILIO_AUTH_TOKEN
4. **CRITICAL:** Console → Messaging → Regulatory Compliance → A2P 10DLC
   - Start registration NOW (US carriers silently drop unregistered SMS)
   - Business profile: Azul, Miami, your details
   - Use case: "Appointment reminders and feedback requests"
   - Sample message: paste the EN template from api/_lib/messages.js
   - Approval time: 1-3 business days
   - Until approved, SMS will fail silently. Test with your own number first.
```

#### 3. Resend (20 min)
```
1. Sign up at resend.com
2. Domains → Add Domain → enter your domain (e.g., azuldevs.com)
3. Add the 3 DNS records (SPF, DKIM, DMARC) in your DNS provider
   - If Vercel DNS: Vercel dashboard → your domain → DNS → add records
   - If Cloudflare: DNS tab → add records
4. Wait 5-15 min → verify
5. API Keys → Create → copy → RESEND_API_KEY
6. Set EMAIL_FROM="Azul Reviews <reviews@azuldevs.com>"
   (must match the verified domain)
```

#### 4. Generate secrets
```bash
openssl rand -hex 24    # copy → ADMIN_KEY (protects /admin)
openssl rand -hex 24    # copy → CRON_SECRET (protects /api/send-due)
```

---

### 🟠 Priority 2: Deploy (30 min)

```bash
cd review-booster
cp .env.example .env
# Paste all the keys you just got into .env

npm install
npm run dev    # test locally first — should open on localhost:3000

# Once it works locally:
npm i -g vercel
vercel login
vercel          # preview deploy
vercel --prod   # production deploy
```

**After deploy:**
1. Vercel dashboard → your project → Settings → Environment Variables
2. Add ALL vars from your `.env` (same names)
3. Set `APP_URL` to your production URL (e.g., `https://reviews-azul.vercel.app`)
4. Redeploy: `vercel --prod` (so env vars take effect)

---

### 🟡 Priority 3: HelloYou Wellness setup (15 min)

#### Get their Google Place ID
```
Option A (easy):
1. Google Maps → search "Hello You Wellness Center Miami"
2. Click Share → Copy link
3. Extract the hex ID from the URL (after /maps/place/)
4. Build review URL: https://search.google.com/local/writereview?placeid=THE_HEX_ID

Option B (precise):
1. https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search "Hello You Wellness Center"
3. Copy Place ID from results
```

#### Update the seeded client in Supabase
```
1. Supabase → Table Editor → clients table
2. Find the "Hello You Wellness Center" row (seeded from schema.sql)
3. Edit:
   - google_review_url: paste the URL you just built
   - owner_name: (HelloYou owner's name)
   - owner_email: (their email — gets private feedback alerts)
   - owner_phone: (optional, in E.164 format like +13055551234)
4. Save
```

---

### 🟢 Priority 4: Test end-to-end (30 min)

**BEFORE touching a real customer, test with yourself:**

```
1. Open https://your-vercel-url.vercel.app/admin
2. Enter your ADMIN_KEY
3. Select "Hello You Wellness Center"
4. "Job complete → send review request":
   - Customer name: Your Name
   - Phone: Your cell (use your real number)
   - Email: Your email
   - Check "Send immediately"
   - Submit

5. Trigger the cron sender manually:
   curl "https://your-vercel-url.vercel.app/api/send-due?key=YOUR_CRON_SECRET"

6. Check your phone — you should get an SMS within 10 seconds
7. Check your email — should get an email too
8. Click the link → test the review gate:
   - Try clicking 5 stars → should redirect to Google
   - Go back, try 2 stars → should show private feedback form
   - Submit feedback → owner email should get the alert

9. Admin dashboard → refresh → you should see:
   - Status: sent → clicked → rated
   - Rating: 2 stars (or whatever you tested)
   - Your feedback in the table

If ALL of that works → you're ready for real customers.
```

---

### ⚡ Priority 5: Set up faster cron (10 min)

Vercel Hobby plan only allows hourly cron. For real-time delivery (10 min intervals):

```
1. Go to cron-job.org (free)
2. Sign up
3. Create a new cron job:
   - Title: Azul Review Sender
   - URL: https://your-vercel-url.vercel.app/api/send-due?key=YOUR_CRON_SECRET
   - Schedule: Every 10 minutes
   - Save
4. Test: click "Run now" → should see { sent: N, followups: N, failed: 0 }
```

---

## First real customer flow (HelloYou front desk)

Once everything tests clean:

1. Share this bookmark with HelloYou's front desk: `https://your-vercel-url.vercel.app/admin`
2. They save your ADMIN_KEY in their phone's notes (or password manager)
3. After every appointment:
   - Open /admin
   - Type customer name + phone
   - Submit (takes 10 seconds)
4. 3 hours later → customer gets SMS + email automatically
5. You do nothing. Owner gets an email ONLY if someone leaves 1-4 stars.

**Monthly reporting (5 min/client):**
1. Open /admin
2. Screenshot the stats card
3. Send to HelloYou: "This month: 12 sent, 8 clicked, 6 rated, 5 went to Google, 1 private issue we helped you fix. Keep it up!"

---

## Pricing for HelloYou

**You charge:** $79/mo (Review Booster standalone) or bundled in Growth Suite  
**Your cost per month:**
- SMS: ~$0.01 × 30 requests × 1.5 (follow-ups) = ~$0.45
- Email: free (Resend free tier = 3,000/mo)
- Supabase: free
- Vercel: free (Hobby plan)
- **Total: ~$0.50/mo**

**Margin: 98%+** (not counting your time, which drops to near-zero after setup)

---

## What's NOT done yet (backlog for later)

- ❌ Webhook endpoint (so booking software auto-triggers requests, no manual typing)
- ❌ Weekly stats email to clients (automated report)
- ❌ Multi-location support (one client, multiple GBPs)
- ❌ Custom branding per client (white-label the review gate page)
- ❌ Zapier/Make.com integration (for non-tech clients who want to connect their CRM)

**Don't build these until you have 3+ paying clients using the basic version.** Solve real problems, not imagined ones.

---

## Troubleshooting (when things break tomorrow)

### "SMS not sending"
- A2P 10DLC not approved yet → wait, or test with a non-US number
- Wrong Twilio credentials → check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- Phone number not in E.164 → must start with +1 for US

### "Email not sending"
- Domain not verified in Resend → check DNS records, wait 15 min
- Wrong API key → regenerate in Resend dashboard
- `EMAIL_FROM` domain doesn't match verified domain

### "Admin page says Unauthorized"
- Wrong ADMIN_KEY → check `.env` matches what you're typing
- Vercel env vars not set → redeploy after adding them

### "Cron not firing"
- Vercel cron is hourly max on Hobby → set up cron-job.org
- CRON_SECRET wrong → check the ?key= param matches .env

### "Review link says Not Found"
- Token expired or DB issue → check Supabase `review_requests` table, status should be 'sent'
- Wrong APP_URL → must match your Vercel prod URL exactly

---

## Success criteria for tomorrow EOD

- [ ] All 4 accounts created (Supabase, Twilio, Resend, Vercel)
- [ ] Deployed to Vercel with all env vars set
- [ ] HelloYou client row updated with real Google Place ID
- [ ] End-to-end test passed (you sent yourself a review request, clicked it, rated it, got the owner alert)
- [ ] Cron-job.org hitting /api/send-due every 10 min
- [ ] One real HelloYou customer sent a review request (optional, but ideal)

If you hit all 6 → you have a productized, margin-rich service running for your first client with ZERO ongoing SaaS fees.

---

## Next session (after Review Booster is live)

Two paths:

**Path A: Voice Agent for HelloYou**  
You already have the Vapi assistant built. Wire it to a phone number, set up call forwarding, test with HelloYou's front desk.  
Handover: `handovers/voice-agent-mvp.md` (already written, phases 4-9)

**Path B: Local SEO content engine**  
Photo intake (WhatsApp or upload form) → Claude API → bilingual GBP posts + social posts for HelloYou.  
Est. build time: 3-4 hours. You'd charge $299/mo (Local Proof SEO), cost = ~$5/mo (Claude API).

Pick based on HelloYou's bigger pain point: missed calls (→ voice agent) or no social proof (→ SEO content).

---

**Questions before you start tomorrow? Ping me. Otherwise: accounts → deploy → test → launch. Let's go.**
