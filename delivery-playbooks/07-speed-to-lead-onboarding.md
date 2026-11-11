# Speed-to-Lead — client onboarding checklist

The one-page operational runbook for signing a new Speed-to-Lead client and getting them from contract-signed to first-live-call in under 2 hours of Azul time.

Target: **client live within 24 hours of signing.**

Before using this doc, assume: Azul has an active Vapi account, a Twilio account, the Review Booster dashboard, and one Google account OAuth-connected to Vapi. Those are one-time setups, not per-client.

---

## Phase 0 — Discovery call (pre-sales, 30 min)

Run this before quoting. If the client fails any of the gating questions, flag it.

### Gating questions
- [ ] Do you operate a business licensed in Florida? (needed for TCPA scope)
- [ ] Does your business serve residential customers primarily? (B2C = our sweet spot)
- [ ] Do you currently get leads through a website form, Facebook/Instagram, Google Business Profile, or phone calls? (if none, Speed-to-Lead has nothing to answer)
- [ ] Do you use Google Calendar for scheduling, or are you open to switching? (required for booking)
- [ ] Can the owner commit to answering transferred emergency/complex calls within business hours?

### Business profile questions (for the AI script)
- [ ] Legal business name + name customers would recognize
- [ ] Trade + specific services offered (verbatim — becomes AI script content)
- [ ] Service area (zip codes or cities)
- [ ] Average service appointment duration (15 / 30 / 60 min — for calendar blocks)
- [ ] Operating hours (when you take appointments — separate from when the AI can call)
- [ ] The 3-5 questions you'd ask every new lead (becomes the AI's qualifying script)
- [ ] Emergency / after-hours policy — what should the AI say if someone says "my AC is out"
- [ ] Price answers the AI is allowed to give (anything else → human handoff)
- [ ] Any absolute no-go words/topics

### Compliance disclosure (verbal, on the call)
Read this out loud, get verbal agreement:

> "Speed-to-Lead calls your new leads within about 60 seconds of them filling out a form. It identifies as AI, tells them the call is recorded, qualifies them with the questions you gave us, and books them on your calendar. For emergencies, upset callers, pricing beyond what we approved, or anyone who asks for a human — it hands off to you. Florida law caps outbound calls to 8 AM–8 PM, and we cap retries at 3 per lead. If someone says STOP, they're never called or texted again. The whole service runs on your consent language, which our lawyer approved."

Get this in writing in the contract.

---

## Phase 1 — Accounts & access requests (client homework, send after contract signed)

Email the client the following list on Day 0. Most delays come from waiting on these:

- [ ] **Google Calendar sharing.** Have them share their primary Google Calendar with the Azul Vapi OAuth email (fixed per Azul — find it in Vapi → Integrations → Google Calendar → connected account). Permission: **Make changes to events**.
- [ ] **Website access** (if we're integrating the form natively vs. hosted). Vercel / Netlify / WordPress admin.
- [ ] **Facebook Business Page + Instagram Business account** — add `azulagencyco@gmail.com` as **Admin** (for Meta ads later; not required for Speed-to-Lead alone).
- [ ] **Owner cell number** in E.164 format (`+1XXXXXXXXXX`) — for transfer-to-owner and daily email alerts.
- [ ] **Owner email** that will receive lead alerts and weekly summaries.
- [ ] **Business address** (for TCPA record of record).
- [ ] **One sentence** describing the business in the owner's own words — used as the AI's identity hook.

### Email template to client — Access requests
```
Subject: Azul Speed-to-Lead — 5-minute setup list for {{BusinessName}}

Hi {{Owner}},

Welcome! To get your AI calling your leads within 60 seconds, I need these
from you. All take under 5 minutes each:

1. Share your Google Calendar with: {{AzulVapiOauthEmail}}
   Permission: "Make changes to events"
   How: calendar.google.com → your calendar → Settings and sharing → Share
   with specific people

2. Send me your owner cell number as +1XXXXXXXXXX format
3. Confirm the email where you want new-lead alerts to arrive
4. Add azulagencyco@gmail.com as an Admin on your Facebook Business Page
   (for ads launch later — not needed for the AI agent itself)
5. One sentence about your business, how YOU would say it

As soon as 1-3 are done I can turn your agent on. Reply when ready and I'll
send over the test number so you can call it yourself before we go live.

— Evelio
Azul · azulagencyco@gmail.com · azulwebdev.com
```

---

## Phase 2 — Azul-side setup (1 hour, no client needed)

### Twilio (5 min, $1.15/mo per client)
- [ ] Twilio console → **Phone Numbers → Buy a Number**
- [ ] Area code: 786 or 305 (Miami) — must match the client's region for trust
- [ ] Capabilities: Voice + SMS
- [ ] Note the E.164 number (`+1786XXXXXXX`) for later

### Vapi (5 min)
- [ ] Vapi dashboard → **Phone Numbers → Import from Twilio**
- [ ] Paste Twilio Account SID + Auth Token + the new E.164 number
- [ ] Name: `{{ClientName}} — Speed-to-Lead`
- [ ] After import, click the number → copy the **Phone Number ID** (UUID)

### Review Booster dashboard — Create workspace (10 min)
- [ ] `https://app.azulwebdev.com` → sign in as agency admin
- [ ] Top-right workspace switcher → **Add business**
- [ ] Business name: `{{ClientName}}`
- [ ] Short ID: lowercase one-word slug (e.g. `aspire`, `sanos`, `coatings`) — becomes `/f/<slug>`
- [ ] Owner name / email / cell: from Phase 1
- [ ] Default language: English (or Spanish if primary)
- [ ] Services: ✅ Website Building + ✅ Speed-to-Lead Agent
- [ ] Click **Create workspace & get key**
- [ ] Save the workspace key in your password manager

### Review Booster dashboard — Agent Setup (15 min)
Switch to the new client workspace → **Speed-to-Lead Agent → Setup** tab.

**Business & mode:**
- [ ] Business name (as callers hear it): `{{ClientName}}`
- [ ] Mode: `Testing` (changes to Active after test call passes)
- [ ] Test numbers: Your Azul cell + client owner cell, both E.164

**Vapi & phone:**
- [ ] Call script: `Azul template (built from business details)` ← always this unless custom Vapi assistant
- [ ] Google Calendar ID: client's primary Gmail or dedicated calendar ID
- [ ] Vapi phone number ID: UUID from Phase 2 Vapi step
- [ ] Business number (Twilio): the E.164 number from Phase 2 Twilio step

**Owner:**
- [ ] Owner email(s): client's monitored email (comma-separated if multiple)
- [ ] Owner cell: client's cell in E.164
- [ ] Owner first: **unchecked** by default. Enable only if the client specifically wants to pick up before the AI.
- [ ] Weekly results email: ✅ checked

**Hosted lead form:**
- [ ] Turn on the form at `app.azulwebdev.com/f/<slug>`: ✅ checked (unless they have a Vercel site we're installing native form on)
- [ ] Business's privacy page: their website privacy URL (we add one if they don't have it — use Azul's privacy template)

**Calling rules:**
- [ ] Start 8 AM, End 8 PM, Calls per lead 3, Minutes between 120 — defaults are correct
- [ ] Call on Sundays: unchecked (FL default)
- [ ] Timezone: `America/New_York`

- [ ] **Create Agent**
- [ ] Reveal and copy the **form_key** — needed only for native form install

### Review Booster dashboard — Business profile (15 min)
Same page → **Agent settings** tab → scroll to Business details.

- [ ] Trade
- [ ] Service area (comma-separated zip codes or cities)
- [ ] Services offered — verbatim from discovery call
- [ ] Questions to ask the lead — the 3-5 qualifying questions (become the AI script)
- [ ] Emergency handling: default `Transfer to owner's cell immediately` unless client specified otherwise
- [ ] Booking days (e.g. Mon-Sat)
- [ ] Booking hours (e.g. 9 AM–6 PM)
- [ ] Visit length in minutes
- [ ] Zip codes served (array, for service-area check)

- [ ] Save

---

## Phase 3 — Test + validate (20 min)

Before showing the client, the agent must pass this sequence end-to-end.

### Test 1 — Standard booking (English)
- [ ] Dashboard → Setup → **Send test call** → pick your cell
- [ ] Answer: "Hi, this is Evelio"
- [ ] AI greets you with the correct business name (no mispronunciation)
- [ ] AI runs the client's qualifying questions in order
- [ ] You say "yes, I'd like to book tomorrow at 10 AM"
- [ ] AI confirms the booking out loud
- [ ] Verify the event appears on the client's Google Calendar
- [ ] End of call — owner email received within 2 min

### Test 2 — Spanish booking
- [ ] Repeat Test 1, respond only in Spanish throughout
- [ ] AI should switch mid-call to Spanish
- [ ] Booking still lands on Google Calendar

### Test 3 — Do-not-contact
- [ ] Send test call
- [ ] Answer: "don't ever call me again"
- [ ] AI should politely end the call
- [ ] Verify lead status in dashboard = `stopped`
- [ ] Verify a row was added to `rb_do_not_contact`
- [ ] Send a second test call from the same number — should be blocked

### Test 4 — Owner transfer
- [ ] Send test call
- [ ] Answer: "I have an emergency, I need to talk to a human"
- [ ] Verify the AI transfers to the owner cell
- [ ] Owner answers, confirms they hear the AI brief them before connecting

### Test 5 — Hosted form submission
- [ ] Open `app.azulwebdev.com/f/<slug>` on your phone
- [ ] Fill in: Your name / **your cell** / service / consent checked
- [ ] Submit
- [ ] Your phone rings within 60 seconds
- [ ] The full call runs the same as Test 1

### Validation checklist before client sees it
- [ ] Business name pronounced correctly (no "Azure" for "Azul" type errors)
- [ ] Booking actually writes to Google Calendar
- [ ] Owner email arrives with the call summary
- [ ] Spanish mode works
- [ ] Do-not-contact works
- [ ] Hosted form is reachable at `/f/<slug>`

Any FAIL on this list = don't go live yet. Fix before switching mode to Active.

---

## Phase 4 — Install the form on the client's website

Pick ONE path based on their site:

### Path A — Hosted form (static sites, Framer, Wix, Squarespace)
- [ ] Give the client: `https://app.azulwebdev.com/f/<slug>`
- [ ] Add a CTA button on their homepage: "Get a free quote →" → links to the hosted form
- [ ] Or embed as an iframe if their platform supports it

### Path B — Native form (Vercel / Next.js / Vite sites built by Azul)
- [ ] In the client's Vercel project → Environment Variables → add:
  - [ ] `LEAD_KEY` = the `form_key` from Agent Setup (Sensitive)
  - [ ] `OWNER_EMAIL` = client owner email (fallback)
- [ ] Run the `/speed-to-lead-site` Claude Code skill in the client's repo to scaffold:
  - [ ] `api/lead.js` serverless function
  - [ ] Frontend form component with consent checkbox
  - [ ] Fallback-email-on-failure logic
- [ ] Deploy preview → test submit → verify a lead lands in the Review Booster dashboard
- [ ] Merge to main → go live

---

## Phase 5 — Go-live checklist

- [ ] Agent Setup → change Mode from `Testing` to `Active`
- [ ] Remove Azul test numbers from the Test numbers field (keeps the whitelist clean)
- [ ] Confirm the owner has the owner alert emails working (send a final test from `/f/<slug>`)
- [ ] Add client to the daily Azul ops check-in (automatic if `AZUL_OPS_EMAIL` is configured)
- [ ] Send the client the go-live email

### Email template to client — Go-live
```
Subject: {{BusinessName}} Speed-to-Lead is live

Hi {{Owner}},

Your AI is now answering every new lead from your website and ad forms
within 60 seconds, in English and Spanish, 8 AM to 8 PM every day except
Sunday.

Here's what happens next:
- Every new lead = instant call, qualifying questions, booking attempt
- You get an email summary after every call (good leads AND problem ones)
- Mondays you'll get a weekly summary of what happened
- You can pause the agent anytime from your dashboard:
  https://app.azulwebdev.com

If anyone asks for a human, or something's urgent, the AI transfers the
call to your cell: {{OwnerCell}}

Give it 2 weeks of real leads to tune. I'll check in Friday with your
first week's numbers.

— Evelio
```

---

## Phase 6 — Week 1 tuning (daily, 10-15 min)

- [ ] Monday: review Friday-Sunday leads in the dashboard
- [ ] Listen to 2-3 call recordings in Vapi logs
- [ ] Note common objections or questions the AI fumbled
- [ ] Update the Business Profile questions/services if the AI needs more context
- [ ] Friday: 15-min check-in call with client — show numbers, confirm they're happy

By end of Week 2: AI should be running clean, owner happy, you only need to check in weekly.

---

## Common failures and fixes

| Symptom | Cause | Fix |
|---|---|---|
| "Could not book" during call | Calendar not shared or wrong permission | Re-share with Make changes to events |
| AI hangs up right after greeting | Business profile empty | Fill in questions + services, save, re-test |
| Call never happens after form submit | `LEAD_CALLS_ENABLED` env not `true` on Vercel | Check env var, redeploy |
| Caller ID shows wrong name | Twilio number registered under different business | Update Twilio caller-ID in their console |
| AI mispronounces business name | ElevenLabs TTS edge case | Add pronunciation hint in business profile or use phonetic spelling |
| Spanish mode doesn't switch mid-call | Prompt template missing bilingual flag | File a bug — see `review-booster/api/_lib/lead-prompts.js` |
| Lead not showing in dashboard | Form submitted without `x-lead-key` | Verify env var on client's site |

---

## Costs per client — reference

| Item | Monthly cost |
|---|---|
| Twilio number | ~$1.15 |
| Twilio call costs (outbound) | ~$0.014/min |
| Vapi call costs | ~$0.08-0.15/min |
| Supabase row usage | Negligible under 100 clients |
| Vercel bandwidth | Negligible |
| **Typical per-client Vapi spend** | **$50-100/mo at normal lead volume** |

Charge the client $999/mo (Founding). Your margin after variable costs: ~$800-900/mo.

---

## When this playbook fails

If any step takes longer than the estimate here, something's wrong. Common root causes:
- Client hasn't shared calendar (block)
- Client's Vercel/website access took too long to get (install hosted form in meantime)
- Vapi credits ran out (add $20-50 buffer)
- Twilio number didn't register for A2P 10DLC (SMS stays off until registered — calls still work)

Flag these early. Don't eat delays silently.
