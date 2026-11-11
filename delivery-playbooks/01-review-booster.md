# Review Booster — client delivery runbook

Target: client live within **3 business days** of signed agreement.
Service price: $79/mo. Variable cost: ~$5/mo in SMS. See AZUL_BUSINESS_PLAN.md §3.1.

---

## Day 0 — Intake (do before the kickoff call)

### Collect from the client
- Legal business name (as it appears on Google Business Profile)
- Business phone number (the one customers already call)
- **Google review URL** — get this from `https://search.google.com/local/writereview?placeid=PLACE_ID`. Find PLACE_ID at https://developers.google.com/maps/documentation/places/web-service/place-id
- Preferred language: English, Spanish, or both
- Who sends the "job done" trigger (owner, dispatcher, office manager)? Collect that person's name + phone + email
- Branding: logo (PNG, transparent background preferred) + brand color hex if they have one
- Any copy they *don't* want in the message (some owners hate the word "survey", some want to avoid "please")

### Create accounts
1. In Review Booster admin → **Workspaces → New** → use their legal business name
2. Invite the trigger person as a team member (Workspace access → Add member)
3. Set review URL, brand color, logo in Workspace settings
4. Set default locale (en, es, or both)

### Templates to send

**Welcome email (send within 1 hour of signed agreement):**
```
Subject: Welcome to Azul — a few things we need to get started

Hi [NAME],

Great to have you on board. To get Review Booster live for [BUSINESS], I need three things:

1. Your Google review link (I'll help you find it if you send me your business name — reply here)
2. A high-res logo (PNG with transparent background if you have one)
3. The name + mobile of the person who will mark jobs "done" each day

Once I have these, you're live within 3 business days.

— Evelio
Azul · azulwebdev.com
```

---

## Day 1 — Technical setup

- [ ] Create workspace in Review Booster
- [ ] Add Twilio phone number to workspace (buy a new local number if their current number isn't in Twilio: Miami area code `786` or `305`)
- [ ] Verify Resend sender for their domain if they want email from `reviews@theirbusiness.com` (fallback: send from `reviews@azulwebdev.com`)
- [ ] Set message copy — English, Spanish, or both — in the workspace. Default template:
  - **EN:** "Hi {{first_name}}, thanks for choosing {{business}}! If we did a good job, would you share a quick review? {{review_link}}"
  - **ES:** "Hola {{first_name}}, gracias por confiar en {{business}}. Si quedó contento con el trabajo, ¿nos ayudaría con una reseña? {{review_link}}"
- [ ] Set delay between job completion and request: default 4 hours, confirm with client
- [ ] Set follow-up delay (no response): default 48 hours, one follow-up only
- [ ] Enable review gate: 5 stars → Google, 1-4 stars → private feedback form emailed to client only

### A2P 10DLC
If sending SMS to US numbers, the workspace's Twilio number must be registered under A2P 10DLC. Do this once per client (or share your agency campaign if you have one approved). Not registered = messages silently filtered.
- Submit brand + campaign in Twilio console → Messaging → Regulatory Compliance
- Typical approval: 1-3 business days. Build this into the delivery timeline.

---

## Day 2 — Train the trigger person

30-minute call or screen-share:
1. Show them the "Add job" screen in the admin (`app.azulwebdev.com`)
2. Walk through adding a test job with their own phone number as the customer
3. Confirm they receive the SMS and the review page opens correctly
4. Show them the dashboard: sent / opened / clicked / posted
5. Agree on frequency: enter jobs daily, or batch at end of day

### Templates — team access

Send a private link, never put the password in email:
```
Subject: Your Review Booster login

Hi [NAME],

Your login is ready: [paste private invite link]

The link sets your password. After you sign in, bookmark app.azulwebdev.com — that's where you'll add every completed job (takes about 10 seconds per job).

I'll be on the kickoff call tomorrow at [TIME] to walk you through it.

— Evelio
```

---

## Day 3 — Go live checklist

Before telling the client "we're live":
- [ ] Send yourself a test request from the client's workspace → it arrives on your phone
- [ ] Click the 5-star path → opens their real Google review page
- [ ] Click the 1-4 star path → emails the client, not Google
- [ ] Confirm no messages are being sent to real customers yet (empty jobs table)
- [ ] Confirm the dashboard loads for the trigger person's account
- [ ] Workspace is NOT visible to any other client's team

### Go-live email to the client
```
Subject: You're live. Here's how to use it.

Hi [NAME],

Review Booster is live for [BUSINESS].

Here's what to do:
1. Each time a job is finished, [TRIGGER PERSON] opens app.azulwebdev.com and adds the customer's name + phone (takes 10 seconds)
2. A few hours later, the customer gets a bilingual text
3. If they're happy, they go to your Google reviews. If not, their feedback comes to your email — not public.
4. You can see everything at app.azulwebdev.com → Dashboard

I'll check in Friday to see how week 1 is going. Any question in the meantime, just text me.

— Evelio
```

---

## First 30 days — what to monitor

**Daily (first 7 days):**
- Open the client's dashboard once a day. Confirm jobs are being entered.
- If zero jobs entered after 48 hours → text the trigger person. The #1 failure mode is "they forgot how to use it."

**Weekly:**
- Review the private feedback inbox (1-4 star submissions) — forward to client with context: "This came in last week, might be worth a call."
- Count new Google reviews posted. Compare to messages sent → that's your conversion rate (healthy: 20-35%).

**End of month 1 — send the first client report:**
```
Subject: [BUSINESS] — Review Booster month 1

Hi [NAME],

Month 1 numbers:
- Jobs entered: [N]
- Messages sent: [N]
- Google reviews posted: [N]
- Private feedback caught: [N]

[If private feedback came in, name any pattern — e.g., "Two mentioned pricing confusion, might be worth addressing on the quote."]

New Google rating: [X.X] (was [X.X])

Keep going. Numbers get better month 2 when word-of-mouth catches up.

— Evelio
```

---

## Monthly ongoing (~10 min/client)

- Check SMS delivery rate in Twilio → anything under 90% = investigate (bad numbers, A2P issue, blocked by carrier)
- Review 1-4 star feedback trends. Flag anything the client needs to act on.
- Send monthly 1-paragraph email with the numbers. Short. Owners don't read reports.
- Invoice runs on Stripe (set it up during Day 0, charged monthly on same date as agreement)

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| No jobs entered after 48h | Trigger person forgot | Text them. Second time it happens, add a 9pm reminder SMS to their phone. |
| SMS not delivered | A2P 10DLC not registered | Check Twilio console → register and wait 1-3 days. Interim: send via email only. |
| Customer clicks link but no review posted | Review URL goes to a listing with no reviews enabled | Verify GBP is **verified**. Unverified profiles can't receive reviews. |
| Owner complains about Google policy | They heard review gating is against TOS | True — explain the risk (AZUL_BUSINESS_PLAN.md §3.1). Options: disable the gate (ask everyone, no filter) or disclose the risk and keep going. Client decides. Document their choice in writing. |

---

## Offboarding (if client cancels)

30 days notice. During notice period:
1. Export all collected private feedback to CSV, email to client.
2. Export all sent messages log to CSV, email to client.
3. On final day: disable the workspace, release the Twilio number back to the pool (or transfer to client if they bought it in their own name).
4. Delete customer PII after 60 days per privacy policy.
