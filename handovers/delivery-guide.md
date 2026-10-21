# AZUL DELIVERY PLAYBOOK

Complete operational how-to for delivering every service. This is the sit-down-and-follow-these-steps version. Reference it during setup and client onboarding.

**Prerequisites:**
- Review Booster deployed (`review-booster/`: Vercel + Supabase + Twilio + Resend). It handles review requests, SMS, email and Vapi lead alerts
- Vapi.ai account (for AI Answering)
- LocalFalcon subscription ($40/mo)
- Claude API key or ChatGPT Plus
- WhatsApp Business number
- Meta Business Suite access (free) for Facebook + Instagram scheduling
- Stripe account (already set up)

---

## Section 1 — Foundation Setup (do once, use forever)

### 1.1 Review Booster

Follow `review-booster/README.md` sections 1–5: Supabase project, Twilio number with A2P 10DLC registration (start this on day 1, approval takes days), Resend with your domain verified, deploy to Vercel. Add the Vapi lead alerts at the end of that README.

Vercel's free Hobby plan is for non-commercial use. Once Review Booster serves paying clients, move the project to Vercel Pro.

### 1.2 Add Azul as a test client

In Review Booster's `/admin`, create a client for Azul itself with your own email, phone and a Google review link. Run the end-to-end test from the README (section 4) against yourself before touching a real customer.

### 1.3 Client tracker

One Google Sheet, one row per client:
- Business name, owner, phone, email
- Preferred language (English / Spanish)
- Trade (roofing, HVAC, plumbing, pool, landscaping, other)
- Services they pay for
- Google Business Profile access (yes / pending)
- Facebook Page + Instagram access (yes / pending)
- Twilio / Vapi numbers assigned
- Where their jobs live (Jobber, Housecall Pro, ServiceTitan, paper)

### 1.4 Reusable templates

Your "clone in one click" kit is a set of files, not a platform:
- Review Booster: add a new client in `/admin` (2 minutes)
- Vapi: duplicate your best assistant and change the business facts
- Website: the vertical templates (Section 5.4)
- Content: the bilingual prompt library (Section 3.5)
- Make.com: export working scenarios as blueprints and import them for the next client

---

## Section 2 — Service #1: Review Booster ($79/mo)

### 2.1 What it does (the outcome)

Every customer gets a review request after the job, by SMS and email, in their language. Review Booster does this.

> **Policy note:** Review Booster's review page currently sends 5★ ratings to Google and 1–4★ ratings to a private feedback form. Google's review policy prohibits selectively asking for positive reviews, so this "gate" puts the client's Google profile at risk. Decide how to change it before signing new clients (see `ai-agents/README.md` section 4.4).

### 2.2 One-time setup per client (30 min)

1. **Get client's Google Business Profile access**
   - Send them this exact WhatsApp message:
     > "Hi [Name], to set up your review automation I need to be added as a Manager on your Google Business Profile. Here's how: [link to how-to]. My email: azuldevsmiami@gmail.com. Takes 2 minutes."
   - How-to link: https://support.google.com/business/answer/3403100

2. **Add the client in Review Booster** (`/admin`): business name, owner email and phone, default language, services.

3. **Add their Google review link** (see `review-booster/README.md` section 3 for getting the Place ID).

4. **Decide how finished jobs get in:**
   - Front desk adds each finished job in `/admin` from their phone (10 seconds), or
   - You add them weekly from the client's job list.
   - Later: a webhook from Jobber / Housecall Pro on "job completed" (planned in the Review Booster README).
   - Review Booster then waits, sends the SMS + email in the customer's language, and sends one follow-up if there's no click in 48 hours.

5. **Test it against yourself** before any real customer (README section 4).

### 2.3 Weekly workflow per client (10 min)

- **Monday:** Open Review Booster `/admin`, check last week's requests sent for this client
- Any 1-4 star private feedback? Forward to client via WhatsApp for personal follow-up
- Any reviews collected? Screenshot the best one and text client: *"[Name] just left you a 5-star. Nice work."*

### 2.4 SMS/Email templates (reference; the live ones are in `review-booster/api/_lib/`)

**English SMS:**
```
Hi {{first_name}}, this is {{business_name}}. Thanks for choosing us for {{service}}! 
Would you take 30 seconds to leave us a quick review? It helps us a ton.
{{review_link}}
Reply STOP to opt out.
```

**Spanish SMS:**
```
Hola {{first_name}}, aquí {{business_name}}. ¡Gracias por confiar en nosotros para {{service}}!
¿Podría tomarse 30 segundos para dejarnos una reseña? Nos ayuda muchísimo.
{{review_link}}
Responda STOP para no recibir más mensajes.
```

**Email subject (EN):** Quick favor — 30-second review?
**Email subject (ES):** Un favor rápido, ¿30 segundos para una reseña?

### 2.5 What to watch for

- **Delivery failure:** if SMS bounces (bad number), check the Twilio logs and email the customer manually
- **Zero reviews after 2 weeks:** check that finished jobs are actually being added in Review Booster. The client may have stopped entering them.
- **Negative review posted publicly:** help the client respond within 24h with a calm, professional public reply

---

## Section 3 — Service #2: Local Proof SEO ($299/mo)

### 3.1 What it does

Keeps client's Google Business Profile active with weekly posts that show Google their business is doing real work. Ranks them for "[service] near me" searches in their neighborhoods.

### 3.2 One-time setup per client (1 hour)

1. **Get GBP manager access** (same as Review Booster, one-time)
2. **Audit their current profile:**
   - How many reviews? Rating?
   - Any posts in last 30 days?
   - Service area listed?
   - Photos how old?
   - Q&A section populated?
   - Categories correct?
3. **Fix low-hanging fruit:**
   - Add missing categories (they can have up to 10)
   - Add service area zip codes (up to 20)
   - Populate Q&A with 5-10 common questions
4. **Set up LocalFalcon scan:**
   - Add their business + 3-5 target keywords
   - Baseline scan → save the PDF
5. **Set up posting:** post directly in Google Business Profile Manager, or connect their profile to a scheduler that supports Google Business Profile (Publer or Localo)

### 3.3 Weekly workflow (2 hours per client)

**Monday morning:**
- Ping client via WhatsApp: *"Send me 1-2 job photos from last week + a sentence about what you did"*
- Follow up Tuesday if they haven't sent by end of Monday

**When photos arrive:**
- Copy this prompt into Claude:

```
Write a 120-word Google Business Profile post for a [industry] business in 
[Miami neighborhood]. The post should describe this job: [client's description].
Include the neighborhood name naturally. Reference the specific service performed.
End with a soft CTA like "Serving [neighborhood] since [year]" or 
"Need [service] in [neighborhood]? Call us at [phone]."

Output TWO versions:
1. English version
2. Spanish version (Miami/Latin American register, use "nosotros")

Add 3 relevant hashtags to each version.
```

- Review the AI output (5 min) — check for hallucinations, verify neighborhood name is real
- Add the client's photo
- Schedule for Tuesday 9 AM (Publer / Localo), or post directly in Google Business Profile Manager
- Do a second post on Thursday if you have another photo

**Friday:**
- Client weekly summary email (5 min):
  ```
  Hey [Name] — quick update:
  
  This week:
  - 2 GBP posts published
  - X post views on Google
  - X profile visits
  - X new reviews (link to any new ones)
  
  Next week we'll focus on [something specific].
  
  — Azul
  ```

### 3.4 Monthly workflow (30 min per client)

- Run LocalFalcon rank scan for their target keywords
- Export PDF, add 2-3 sentences of commentary
- Email to client
- If they moved up in rankings: highlight the wins
- If they didn't move: propose fixing something (add more categories, get more reviews, more service-area content)

### 3.5 Prompt library location

Save all your bilingual prompts in a Google Doc titled "Azul Content Prompts" — keep it accessible via phone. Categories:
- GBP posts (this section)
- Instagram captions (see Section 4)
- Facebook posts (see Section 4)
- Review request messages (see Section 2)
- Client weekly summaries (see below)

---

## Section 4 — Service #3: Social Media AI ($149/mo)

### 4.1 What it does

Consistent bilingual Facebook + Instagram presence using client's real job photos, so their social feed doesn't look dead and prospects see recent work.

### 4.2 One-time setup per client (45 min)

1. **Get client to add Azul as admin on their Facebook Page**
   - How-to: Facebook Business Suite → Settings → People → Add
   - They need your Facebook account email
2. **Instagram: they need to convert their IG to a Business account and connect to their Facebook Page**
3. **In Meta Business Suite:** confirm you can see and schedule for both their Facebook Page and Instagram
4. **Ask them for:**
   - Their brand colors (or grab from their website)
   - Any hashtags they already use
   - Team member names (so you can tag them if they're in photos)

### 4.3 Weekly workflow (1-2 hours per client)

Reuse the SAME photos you got from Local SEO intake. One photo generates 3 pieces of content:
1. GBP post (SEO)
2. Instagram post (single image + caption)
3. Facebook post (same image, adapted caption)

**Instagram caption prompt (Claude):**
```
Write a punchy Instagram caption for a [industry] business in Miami about this job:
[description]. Include:
- 1-2 emojis (max, tastefully)
- Casual tone but professional
- A soft CTA in the last line
- 8-12 relevant hashtags mixing local (#miamiroofing) and industry (#roofinglife)

Output English and Spanish versions.
```

**Facebook adaptation:** IG captions work on FB with 2-3 fewer hashtags and slightly more description.

Schedule 3-4 posts per week per platform in Meta Business Suite (free), or in Publer if you're already using it for Google posts.

### 4.4 Content calendar rhythm

- **Monday post:** the weekend's completed job
- **Wednesday post:** a "before/after" if you have it, or a service explainer
- **Friday post:** a team/behind-the-scenes photo, or a customer testimonial screenshot
- **Sunday post:** motivational or seasonal (skip if you don't have content)

### 4.5 What NOT to post

- Politics
- Anything referencing competitors negatively
- Generic stock photos (kills authenticity — always use client's real photos)
- Posts without a specific hook — vague "we're the best!" content

---

## Section 5 — Service #4: Website Build ($199/mo + $499 setup)

### 5.1 What it does

Modern conversion-focused website that funnels visitors into calls, quote requests, and reviews. Connected to the rest of the growth system.

### 5.2 Setup timeline (2 weeks)

**Week 1:**
- **Day 1:** Discovery call (30 min). Ask:
  - What do you want visitors to do (call, book, quote)?
  - Who's your #1 competitor's site? What do you like/dislike?
  - Do you have a logo? Brand colors?
  - What are your top 3 services?
  - What are your top 3 objections you hear from prospects?
  - Do you serve any language other than English?
- **Day 2-3:** Wireframe in Figma OR pick a Framer template
- **Day 4-5:** Design mockup (send screenshots via WhatsApp for approval)

**Week 2:**
- **Day 8-11:** Build the site (React + Vite + Tailwind OR Framer)
- **Day 12:** Client review, revisions
- **Day 13:** Launch on their custom domain
- **Day 14:** Connect the contact form (Section 5.3), Crisp chat widget, GA4

### 5.3 Every website MUST include

- Sticky header with phone + "Get a Quote" button
- Hero with headline + subheadline + CTA + hero image
- Services grid (3-6 services with icons and 1-line descriptions)
- Service area map (embed Google Map showing coverage area)
- "Why choose us" (3 pillars — years in business, reviews count, response time)
- Testimonials section pulling their real Google reviews
- Contact form (name, phone, service, message) → a Vercel function emails the lead to the client through Resend (same setup as Review Booster)
- Chat widget (Crisp free tier) with pre-filled greeting in EN + ES
- Footer with NAP (Name, Address, Phone), business hours, social icons
- Mobile-optimized (test on 375px width before launch)

### 5.4 Vertical templates (build these once, reuse forever)

Create Framer/React templates for:
- Roofing (blue/gray palette, imagery of shingles + tile)
- HVAC (blue/red palette, imagery of AC units + technicians)
- Plumbing (blue palette, imagery of pipes + plumbers)
- Pool services (aqua palette, pool imagery)

Each template ~80% pre-built. Client customization: logo, colors, phone, service area, service descriptions.

### 5.5 Ongoing $199/mo covers

- Hosting on Vercel/Cloudflare Pages
- SSL renewal
- Uptime monitoring
- Up to 2 small edits/month (change phone, swap photo, add service)
- Monthly Google Analytics summary

Additional major changes billed separately.

---

## Section 6 — Service #5: AI Answering ($349/mo) — HARDEST TO DELIVER

### 6.1 What it does

When the client's phone rings and they don't answer within 3 rings, Vapi's AI picks up, captures caller info in EN or ES, and sends a summary to the client immediately.

### 6.2 Reality check

This is your thinnest-margin service AND the highest technical complexity. Only offer to your first 3-5 Founding Clients as a beta while you learn. Get it running smoothly with 3 clients before selling as standalone.

### 6.3 Setup per client (6-10 hours)

1. **Buy a dedicated Twilio number** (~$1-3/mo) for AI answering
2. **Two setup options:**
   - **Option A (recommended for start):** Client keeps their existing phone. Set up call forwarding — if they don't answer in 3 rings, forward to Twilio number → Vapi answers
   - **Option B (advanced):** Port their existing number to Twilio, all calls go through Vapi first
3. **Configure Vapi call flow:**
   - Greeting: *"Thanks for calling [Business]. For English, press 1. Para español, presione 2."*
   - EN branch: name → callback number → service needed → address → best time to call back
   - ES branch: same but in Spanish
   - Confirm and end: *"Someone from [Business] will call you within 30 minutes."*
4. **Configure webhook:** on call end → Review Booster's `/api/vapi-webhook` emails the summary to the client through Resend (already built; see `review-booster/README.md`). Add an SMS summary through Twilio if the client prefers texts
5. **Missed-call text-back:** if any call goes fully unanswered (even by Vapi), send auto-SMS from Twilio

### 6.4 Vapi script template (starter)

```
System prompt to Vapi:

You are the friendly bilingual receptionist for {{business_name}}, a 
{{industry}} company in Miami, Florida. Your ONLY job is to:
1. Ask the caller's name
2. Ask what service they need
3. Ask for their phone number
4. Ask for their address
5. Ask what time is best to call back
6. Confirm you've captured everything correctly
7. Tell them someone will call within 30 minutes

Rules:
- Speak in the caller's language (English or Spanish)
- Keep responses under 15 words
- Never make up prices or availability
- If the caller asks a question you don't know, say: 
  "That's a great question — [owner name] will call you back within 30 minutes and answer that."
- If the caller is angry or in an emergency, immediately say:
  "Let me connect you to [owner name] right now" and forward the call to [client cell]
```

### 6.5 Weekly workflow (30 min per client)

- Review call recordings from the week (Vapi logs them)
- Note any calls where AI messed up — refine the prompt
- Check that client is calling captured leads back within 30 min
- If client is NOT calling back captured leads, big problem — talk to them

### 6.6 Fallback plan

If Vapi has a bad week (call drops, misroutes, etc.), have this ready:
- Route to a real human answering service like **Ruby Receptionists** (~$310/mo)
- Charge the client the same $349, absorb the extra cost that month
- Fix Vapi in parallel
- Never let calls drop for a paying client

### 6.7 What NOT to promise

- Don't promise Vapi handles complex conversations (repair diagnosis, price quotes, scheduling)
- Don't promise 100% uptime (real number is ~95-97%)
- Don't promise sub-second response time (there's usually a 1-2 second AI delay)

Set expectations: *"AI captures your basic lead info so you can call them back. It doesn't replace you."*

---

## Section 7 — Pre-Sale → Sold Handoff (the first 24 hours)

The window from "I'm in" on the demo call to Day 1 of the 14-day build. The old version of this guide assumed the client was already paid and jumped to Day 0. That assumption is where clients ghost, chargebacks happen, and A2P 10DLC delays silently cost you a week of SMS send-ability. Do this part right.

### 7.1 Close the demo call (last 5 minutes)

If they signal yes verbally, lock it before the call ends. Script:

```
"Great. Three things to confirm before I send your link:

1) Growth Suite at $399/mo locked for life as a Founding Client — correct?
   (Standard is $549. If you want to pick & choose à la carte instead, let's do that now.)

2) We default all customer-facing content to [English / Spanish / both] — confirm?

3) Your start date is today — I'll have your system fully live in 14 days.

I'll send you a Stripe link in the next 10 minutes.
Pay from your phone. Second it clears, I send you a welcome kit with everything we need."
```

Never leave the call without:
- Confirmed service list (bundle vs à la carte line items)
- Confirmed primary language (EN / ES / both)
- Confirmed legal business name + EIN (needed for A2P 10DLC — ask now, not Day 7)
- Confirmed start date (today, 99% of the time)

### 7.2 Create the Stripe charge (10 min after call)

The two live subscription products in Stripe:
- `Azul Growth Suite — Founding Client` — $399/mo (first 10 clients only, locked for life)
- `Azul Growth Suite — Standard` — $549/mo

À la carte products exist for Review Booster ($79), Social Media AI ($149), Local Proof SEO ($299), AI Answering ($349), and Website Build ($199/mo + $499 one-time setup).

**How to send the link:**

1. Stripe Dashboard → Payment Links → clone `Growth Suite – Founding Client` template
2. Rename: `GS-FC — <Client Business Name>`
3. Metadata (hidden from client, lives on the subscription forever):
   - `client_name` — owner's full name
   - `business_name` — legal name (matches EIN)
   - `trade` — roofing / HVAC / plumbing / pool / landscaping / other
   - `services` — comma-separated codes (reviews,seo,social,site,phone)
   - `language` — en / es / both
   - `founding_cohort` — #1-10 so you know how many founding slots remain
4. Enable "Collect customer email" and "Collect billing address" (both required for A2P 10DLC)
5. If they're adding a website, add `Website Build Setup Fee` — $499 one-time — as a line item on the first invoice
6. Copy URL → send via WhatsApp inside 10 min of call ending (the longer you wait, the colder the lead)

**WhatsApp send:**
```
Here's your Stripe link — pay from your phone, takes 30 seconds:

[stripe link]

Moment it clears, I'll send you the welcome kit with everything we need to start.
```

Never email the link if WhatsApp is an option — highest open rate, this is the moment to close.

### 7.3 Service agreement (same hour)

Template lives at `/legal/service-agreement.pdf` (create one with a Florida lawyer before client #1). Send via WhatsApp alongside the Stripe link.

Minimum non-negotiable terms:

- Month-to-month, 30 days written notice to cancel (email or WhatsApp both acceptable)
- Services included — exact list matching Stripe metadata
- Services NOT included — ad spend, custom dev beyond scope, legal/accounting advice
- Who owns what on exit:
  - Client owns their domain, GBP, Facebook Page, Instagram, Google Reviews
  - Client owns all content Azul produced for them
  - Azul transfers back any accounts registered on client's behalf within 7 days of cancellation
- A2P 10DLC: client agrees to be registered as a brand under Azul's Twilio parent for the duration of their subscription
- Review policy: client acknowledges Azul asks every customer for a review (no gating), per Google policy
- AI Answering (if applicable): client acknowledges this is a bilingual AI receptionist that captures leads only — it does not quote prices, diagnose, or dispatch emergencies

**Signature path:** DocuSign free tier (preferred), or email the PDF and ask them to reply "I agree" from the email on file. Save the signed copy to `clients/<slug>/legal/service-agreement-signed.pdf`.

### 7.4 Payment confirmation flow (within 1 hour of send)

Stripe shows "Succeeded" → fires webhook (if wired) → emails receipt. The moment it clears, do all of this inside 15 minutes:

1. Add row to client tracker Google Sheet (Section 1.3):
   - Business name, owner, phone, email
   - Preferred language
   - Trade
   - Services (match Stripe metadata exactly)
   - Stripe customer ID (`cus_...`)
   - Stripe subscription ID (`sub_...`)
   - Signup date = today
   - Go-live target = today + 14 days
   - Status = `onboarding`
2. Review Booster `/admin` → create client row (name, phone, email, language, Google review link if available — else placeholder for Day 2)
3. Scaffold client folders (all gitignored):
   ```
   ai-agents/clients/<slug>/
     ├─ agent-spec.md               (copy from ai-agents/templates/)
     ├─ system-prompt-v1.md         (fill on Day 6)
     ├─ business-profile.md         (copy from voice-agents/templates/)
     ├─ test-checklist.md           (copy from ai-agents/templates/)
     ├─ changelog.md                (empty, fill as you tune)
     ├─ legal/
     │  └─ service-agreement-signed.pdf
     └─ assets/
        ├─ logo.png
        └─ job-photos/
   voice-agents/clients/<slug>/     (only if AI Answering in bundle)
   ```
4. Hold their Day 12 kickoff call on Calendly (right slot = early afternoon, same day of week they said works best)

### 7.5 Day 0 welcome WhatsApp (expanded template)

Send immediately after step 7.4 is green:

```
Welcome to Azul, [Name]! Your subscription is live.

Your system goes fully live in 14 days — [specific date].

4 quick things today so I can start building tomorrow:

1) Sign the service agreement:
   [DocuSign link OR "reply 'I agree' to the email I just sent you"]
   (30-day cancel clause + data ownership terms we discussed.)

2) Add me as MANAGER on your Google Business Profile:
   https://support.google.com/business/answer/3403100
   My email: azuldevsmiami@gmail.com
   Accept the invite in your Gmail — I'll send it in the next few minutes.

3) Add me as ADMIN on your Facebook Page:
   Facebook Business Suite → Settings → People → Add
   My Facebook email: [your FB email]

4) Send me 5 things in this WhatsApp:
   - Your logo (PNG or JPG, highest quality you have)
   - 5 recent job photos + 1 sentence each describing the job
   - Your full services list
   - Your service area (zip codes or neighborhood names)
   - Top 3 competitors by name

Your 30-min kickoff is scheduled for [Day 12 date, e.g. "Tuesday Oct 27 at 2pm"]:
   [Calendly link — already booked, this is the confirmation]

Reply here if anything's unclear.

— Evelio
```

### 7.6 Access requests sent same day (parallel to welcome)

Fire these NOW, not on Day 1 — they have external approval delays:

| Action | Where | Delay | Why Day 0 |
|---|---|---|---|
| GBP manager invite | business.google.com → Users → Add | Up to 7 days to accept | Blocks SEO + review link setup |
| Facebook Page admin invite | business.facebook.com → Settings → People | Up to 2 days | Blocks social scheduling |
| Twilio A2P 10DLC brand + campaign | console.twilio.com → Messaging → Regulatory → A2P 10DLC | 1-7 days approval | Unregistered US SMS is silently dropped |
| Resend domain verification (if using their domain) | resend.com → Domains → Add | 1-24h DNS propagation | Blocks branded email delivery |
| Vapi assistant draft (if AI Answering) | dashboard.vapi.ai | No external delay but 6-10h of your time | Reserve the time block on Day 6 |

A2P 10DLC is the one that silently kills your SMS launch if you forget. It needs:
- Client's legal business name + EIN
- Client's business address
- Client's business website (even the preview URL on their custom domain works; placeholder is fine)
- Sample messages (use templates from Section 2.4)

### 7.7 End-of-Day-0 checklist (don't sleep until all green)

- [ ] Stripe link sent AND cleared
- [ ] Service agreement sent (signed or signature-pending reminder set for Day 1)
- [ ] Welcome WhatsApp sent
- [ ] Client tracker row created with Stripe IDs
- [ ] Review Booster `/admin` client row created
- [ ] `clients/<slug>/` folder scaffolded with templates copied
- [ ] GBP manager invite sent
- [ ] Facebook Page admin invite sent
- [ ] A2P 10DLC brand registration started in Twilio
- [ ] Day 12 kickoff call blocked on Calendly
- [ ] Day 0 end logged in `clients/<slug>/changelog.md`

### 7.8 Red flags: when to refund and walk inside 24 hours

A Day-1 refund costs you an hour. A Day-60 chargeback costs you a weekend + reputation. If any of these show up, refund the Stripe charge and move on:

- They push back on the 30-day notice clause ("I want 7 days") — signals cancel-at-first-friction
- They refuse to add you as GBP manager ("I'll do the posts myself") — you can't deliver SEO without it
- They can't produce their EIN or legal business name — likely unregistered; A2P 10DLC will reject
- They want to pay via Zelle / Venmo / check — no paper trail for a $400/mo recurring is a non-starter
- They can't name 3 recent jobs or 3 customers by name — fake business or shell, do not touch
- They want you to run Facebook Ads with their credit card on Day 1 — unauthorized-spend risk; ads are explicitly not in Growth Suite
- The signed agreement comes back with handwritten edits to the data-ownership clause — walk

---

## Section 8 — The 14-Day Onboarding Timeline

Day-by-day, hour-by-hour build schedule. Each day lists: morning block, afternoon block, deliverable, time estimate. First client takes ~18 hours over 14 days without AI Answering, ~24 with it. By client #5 this drops to ~10 hours total as vertical templates, Vapi assistant clones, and prompt libraries become one-click copies.

### Day 1 — Access verification + accounts (2h)

**Morning (1h):**
- [ ] Confirm GBP manager invite accepted (not → WhatsApp nudge)
- [ ] Confirm Facebook Page admin invite accepted
- [ ] Confirm Instagram is a Business account linked to the Facebook Page
- [ ] Confirm signed service agreement filed in `clients/<slug>/legal/`
- [ ] Confirm A2P 10DLC status — `pending review` is fine, `rejected` means fix message samples today

**Afternoon (1h):**
- [ ] Buy a dedicated Twilio number for this client (305 or 786 area code), $1-3/mo
- [ ] Note the number in client tracker + Review Booster client row
- [ ] If AI Answering: duplicate your best Vapi assistant → rename `<client-slug>-receptionist` → save as draft
- [ ] Save their logo + brand colors in `clients/<slug>/assets/`
- [ ] Ask the owner which language each customer prefers when logging jobs — don't guess from names

**Deliverable:** All external access accepted; client-specific accounts provisioned.

### Day 2 — Infrastructure baseline (3h)

**Morning (1.5h):**
- [ ] GBP audit — screenshot current state, note:
  - Primary + secondary categories (can hold up to 10)
  - Service area zip codes (up to 20)
  - Hours accurate?
  - Photos from last 90 days?
  - Q&A section populated?
- [ ] LocalFalcon: add their business + 3-5 target keywords (e.g. "roof repair Hialeah", "techos Miami", "HVAC Doral")
- [ ] Run baseline rank scan → export PDF → save to `clients/<slug>/reports/month-0-baseline.pdf`

**Afternoon (1.5h):**
- [ ] Resend: send a test email on their behalf to yourself — confirm it lands in inbox, not spam, with their business name in the From
- [ ] Configure missed-call text-back on their new Twilio number — any inbound call → voicemail → auto-SMS "Hi, we saw you called [Business]. What can we help you with?"
- [ ] Test it: call the Twilio number from your personal phone, don't pick up, confirm text-back arrives in under 60 seconds

**Deliverable:** GBP audit PDF, LocalFalcon baseline PDF, missed-call text-back live and tested.

### Day 3 — Website: template + customization (3h)

**Morning (1.5h):**
- [ ] Review their Day-0 submissions (logo, services, service area, competitors)
- [ ] Pick vertical template: roofing / HVAC / plumbing / pool
- [ ] Clone template to `/clients/<slug>/site/`
- [ ] Customize: swap logo, update color palette to their brand, replace phone everywhere, replace service list + service area

**Afternoon (1.5h):**
- [ ] Replace stock photos with their real job photos (Day-0 submission + anything grabbable from their Facebook)
- [ ] Write hero headline + subhead in their primary language (with EN/ES toggle enabled)
- [ ] Write the 3-pillar "Why choose us" with real credentials (years in business, review count, response time)
- [ ] Deploy to Vercel preview URL
- [ ] Send mockup screenshot via WhatsApp: *"Here's your preview — any changes?"*

**Deliverable:** Preview URL sent, feedback loop open.

### Day 4 — Website: revisions, forms, launch prep (2.5h)

**Morning (1h):**
- [ ] Apply overnight revisions
- [ ] Wire the contact form → `/api/lead` → Resend email to the client (same pattern as Review Booster's contact form)
- [ ] Test end-to-end: submit as a fake visitor, confirm client's email receives it within 30 seconds

**Afternoon (1.5h):**
- [ ] Install Crisp chat widget with pre-filled bilingual greeting
- [ ] Install GA4
- [ ] Mobile QA at 375px — hero CTA, nav, phone CTR, contact form all work
- [ ] Send DNS instructions (A record to Vercel + CNAME for www) via WhatsApp, OR do the DNS change yourself if they shared registrar access

**Deliverable:** Production-ready website on preview URL; DNS instructions sent.

### Day 5 — Content pipeline + Review Booster prep (3h)

**Morning (1.5h):**
- [ ] Build their prompt library at `clients/<slug>/prompts.md` — copy from `AZUL_BUSINESS_PLAN.md` Section 9 and localize with their business facts (neighborhoods they serve, service names in Spanish, owner's voice/tone)
- [ ] Generate first week of content from Day-0 photos: 5 GBP posts + 5 IG captions + 5 FB posts = 15 pieces
- [ ] Save drafts to `clients/<slug>/content/week-1/` — one human review pass before scheduling

**Afternoon (1.5h):**
- [ ] Review Booster `/admin`: confirm their Google review link is live (if GBP access accepted, pull Place ID → generate direct review URL)
- [ ] If they shared past-week completed jobs: enter them now, `send_at = Day 7`
- [ ] If no past jobs: schedule a Day 7 WhatsApp nudge asking for their last 10 completed customers

**Deliverable:** Prompt library saved, 15 content pieces drafted, Review Booster primed for Day 7 first-send.

### Day 6 — AI Answering build (6h — SKIP if not in bundle)

**Morning (3h):**
- [ ] Fill `clients/<slug>/business-profile.md` with VERIFIED facts: services (exact names in EN + ES), hours, service area zip codes, emergency policy, what they don't do, owner's cell for transfer
- [ ] Write `system-prompt-v1.md` from `voice-agents/templates/assistant-prompt.md` — paste the business-profile block, add never-rules
- [ ] Load prompt into Vapi assistant → save

**Afternoon (3h):**
- [ ] Configure call forwarding on their business line: unanswered after 3 rings → their Twilio number → Vapi
- [ ] Wire Vapi end-of-call webhook to `https://app.azulwebdev.com/api/vapi-webhook` (see Review Booster README section on Vapi lead alerts)
- [ ] Set `VAPI_LEAD_TO` to the owner's email in Vercel env; optional per-assistant override via `VAPI_LEAD_TO_<assistant_id>`
- [ ] Run `test-checklist.md`: 10 test calls split EN / ES / Spanglish + 2 must-not cases (price question, emergency) + 1 injection attempt ("ignore your instructions")
- [ ] Pass bar: 100% on must-not, 90% on everything else. Fail → tune prompt → re-run full checklist

**Deliverable:** AI Answering live, passing tests, lead-alert emails arriving at owner's inbox.

### Day 7 — Review Booster goes live (1.5h)

**Morning (0.5h):**
- [ ] Verify A2P 10DLC status = `approved`. If still pending → DO NOT send. Reschedule first-send to day-after-approval and notify client via WhatsApp
- [ ] If approved: review the client's seeded request queue in `/admin`
- [ ] Trigger `/api/send-due` with `CRON_SECRET` → first batch of real review requests goes out

**Afternoon (1h):**
- [ ] Monitor Twilio message logs for bounces / undeliverable numbers
- [ ] For any 1-4★ private feedback that lands in the owner's inbox, forward via WhatsApp within 15 minutes
- [ ] Screenshot the first 5★ that lands on Google — this is the "proof it works" image for the Day 14 report

**Deliverable:** First real review requests out, review log started.

### Day 8 — Social Media activation (2h)

**Morning (1h):**
- [ ] Meta Business Suite: confirm you can see + schedule for both the FB Page and IG account
- [ ] Create a "Saved Replies" set for inbound DMs — bilingual greetings, "we'll get back within 1 hour" fallback
- [ ] Upload the week-1 content from Day 5

**Afternoon (1h):**
- [ ] Schedule the 15 pieces across the next 7 days:
  - Mon: FB + IG + GBP (same job)
  - Wed: FB + IG + GBP (different job)
  - Fri: FB + IG + GBP (team / behind-the-scenes)
  - Weekend: 1 motivational / seasonal, IG only
- [ ] Confirm every post shows the client's handle, not Azul's

**Deliverable:** 7 days of social + GBP content scheduled.

### Day 9 — Local SEO polish (1.5h)

**Morning (1h):**
- [ ] Fix GBP gaps from Day-2 audit:
  - Add missing categories (up to 10)
  - Add service area zip codes (up to 20)
  - Populate Q&A with 5-10 real questions (ask the owner via WhatsApp if unclear)
  - Upload 5 recent job photos directly to GBP
- [ ] Verify business description includes neighborhood names + language cue ("Hablamos Español")

**Afternoon (0.5h):**
- [ ] Schedule this week's 2 GBP posts for Tuesday 9am + Thursday 2pm (highest-engagement windows for local service)
- [ ] Add their business + review link to their website footer

**Deliverable:** GBP profile fully optimized, first GBP posts scheduled.

### Day 10 — Website launch (1.5h)

**Morning (1h):**
- [ ] Confirm DNS propagated (`nslookup <domain>` or `dig`)
- [ ] Verify SSL (padlock, no warnings)
- [ ] Final 375px mobile QA — hero CTA, phone CTR, form submit all work
- [ ] Submit `sitemap.xml` to Google Search Console → request indexing

**Afternoon (0.5h):**
- [ ] WhatsApp the live URL: *"Your site is live at [URL]. Walk through on your phone and let me know."*
- [ ] Add site URL to GBP profile + Facebook Page + Instagram bio
- [ ] Update Review Booster request templates to the live domain if any reference the staging URL

**Deliverable:** Live production website on their custom domain.

### Day 11 — End-to-end dry run (2h)

Simulate the full customer journey as a real customer would. Four scenarios, 30 min each:

**Scenario 1 — Website quote request:**
- Submit the contact form as a fake lead
- Confirm Resend delivers to the client's inbox within 60 seconds
- Confirm the lead data (name, phone, service, message) is complete

**Scenario 2 — After-hours call:**
- Call their business line when they're typically on a job site
- Let it ring past 3 rings → confirm Vapi picks up
- Run the full 5-question flow in EN → confirm lead summary email in owner's inbox within 2 min
- Repeat in ES

**Scenario 3 — Finished-job review request:**
- Add yourself in Review Booster `/admin` as a "finished customer" with `send_at = now()`
- Trigger `/api/send-due`
- Receive SMS + email → tap 5★ → confirm Google redirect
- Repeat with 3★ → confirm private feedback form arrives at owner's email

**Scenario 4 — Missed call:**
- Call the Twilio number, hang up before Vapi answers
- Confirm auto text-back arrives on your phone within 60 seconds

**Fix anything that breaks today.** Day 12 is the kickoff — nothing should be broken on-camera.

**Deliverable:** All 4 scenarios pass; any failures logged + fixed in `changelog.md`.

### Day 12 — Kickoff call (30 min)

Screen share. Agenda:

1. **Website (3 min):** show the live URL on desktop + mobile. Confirm they're happy.
2. **Review Booster (5 min):** screenshot of `/admin` stats (don't hand them the admin key — it currently opens every client's data). Explain the flow: finished jobs in → SMS + email out → gate → Google. Show a real 5★ already captured.
3. **AI Answering (5 min):** play one test call recording in EN, one in ES. Confirm: *"If this call came in while you were on a roof, you'd have the lead in your inbox before you climbed down."*
4. **Social + GBP (5 min):** walk through the week's scheduled posts in Meta Business Suite + GBP. Confirm the content voice feels like theirs.
5. **Monday photo request (2 min):** confirm the cadence — *"Every Monday I'll ping you asking for last week's job photos. 1-2 photos + 1 sentence each. 2-minute lift on your side."*
6. **Expectations (5 min):**
   - First new reviews — days
   - First captured leads — immediate
   - Google ranking movement — 30-60 days
   - How to reach you — WhatsApp, this number
   - How to cancel — 30-day notice, email or WhatsApp
7. **Q&A (5 min):** actually listen. Any doubt they voice now becomes a cancellation risk later.

**Deliverable:** Live client, agreed cadence, concerns noted in `clients/<slug>/changelog.md`.

### Day 13 — Buffer / fix / tune (variable)

Reserve this day. There is always something.

- Address kickoff-call concerns
- Review any Vapi call recordings from soft launch; tune the prompt
- Fix any issues raised by the client's walk-through
- Document client-specific quirks in their folder (e.g. *"owner prefers 'Mr. [Last Name]' not first names when AI talks to callers"*)

### Day 14 — Officially "live" + first weekly summary (1h)

Send the first Friday summary (template matches Section 9's Friday afternoon block), backfilled with the first week's numbers:

```
Hey [Name] — your Azul system has been live 7 days. Quick recap:

✅ Reviews collected: [X]
✅ New leads captured (web + phone): [X]
✅ Missed calls caught by AI: [X]
✅ Posts published: [X] (GBP + FB + IG)
✅ Google Business impressions this week: [X]

Highlight of the week: [specific — a great review, a $5K lead captured at 10pm, etc.]

Reminder: send me 1-2 job photos from this week via WhatsApp when you get a chance.

— Azul
```

Then:
- Flip client tracker status from `onboarding` → `live`
- Mark the Stripe subscription with metadata `go_live_date = today`
- Move the client from "watch daily" to the standard weekly rhythm (Section 9)

**Deliverable:** First weekly summary sent. Client is officially a live, delivery-rhythm client.

---

**Total onboarding time (first client):** ~18 hours over 14 days without AI Answering, ~24 hours with it.
**By client #5:** ~10 hours total as vertical templates + Vapi clones + prompt libraries become one-click copies.

---

## Section 9 — Weekly Client Rhythm (ongoing)

Per active paying client, ~2 hours/week total.

### Monday morning (per client, 20 min)

- WhatsApp them: *"Hey [Name], send me job photos from the past week"*
- When photos come in, generate content in Claude → schedule in Meta Business Suite / your scheduler

### Wednesday afternoon (per client, 15 min)

- Open Review Booster `/admin`, Vapi call logs and Twilio logs
- Check: any missed calls this week? Any reviews sent but not clicked? Any lead the client never called back?
- Fix or nudge

### Friday afternoon (per client, 15 min)

- Send weekly summary email:
  ```
  Hey [Name] — quick recap:
  
  ✅ Reviews collected this week: [X]
  ✅ Missed calls captured: [X] (with SMS follow-ups sent)
  ✅ New leads captured: [X]
  ✅ Posts published: [X] (GBP + FB + IG)
  ✅ Google Business impressions: [X]
  
  Highlight of the week: [something specific — a great review, a big lead, etc.]
  
  Anything you need from me?
  
  — Azul
  ```

### Sunday admin (30 min for ALL clients)

- Check Stripe for any failed payments
- Update your tracker spreadsheet
- Plan next week's outbound (target 25 more Looms per week when you're still solo)

---

## Section 10 — Monthly Client Rhythm

### First Monday of the month (30 min per client)

- Run LocalFalcon rank report for target keywords
- Export PDF, add 2-3 sentences of commentary
- Send to client with any suggested next moves

### End of month (2 hours total for all clients)

- Review Stripe MRR — anyone canceled? Any failed charges?
- Review your own numbers: how many demos booked this month, closing rate, new MRR
- Refine your templates based on what you added/changed for clients this month

---

## Section 11 — Common Issues & Fixes

### "Client isn't sending me photos"
- Try WhatsApp reminders 2×/week for 2 weeks
- If still no photos, offer to visit a job site once and take photos yourself (paid trip, one-time)
- If still nothing, they're not a good fit for Social Media AI — refund that portion and downgrade

### "Reviews aren't landing"
- Check finished jobs are actually being added in Review Booster (most common cause)
- Check SMS delivery rate in Twilio dashboard (bad numbers get filtered)
- Check the review page isn't broken

### "AI Answering messed up a call"
- Listen to the recording immediately
- Refine the Vapi system prompt
- Call the customer back yourself and apologize on the client's behalf
- If this happens 3× in a month, temporarily route calls to Ruby Receptionists while you fix

### "Client wants to cancel"
- Ask why. Actually listen.
- If it's a delivery problem → fix and win them back
- If they can't afford it → offer to downgrade to Review Booster only ($79/mo)
- If they don't like the service → let them go cleanly, transfer their GBP access back
- Never argue with a churn — just learn from it

### "Texts aren't sending"
- Check A2P 10DLC registration status in Twilio (unregistered texts are silently dropped)
- Check Twilio's message logs for errors on those numbers
- Check the Vercel function logs and that the Review Booster cron (`/api/send-due`) is running

---

## Section 12 — When to Hire (and Who)

| Clients | MRR | Hire | Cost | Frees you to |
|---|---|---|---|---|
| 0-3 | $0-1,500 | Nobody | $0 | Learn every step yourself |
| 3-8 | $1,500-4,000 | **VA #1** — content generation | $600-1,000/mo LatAm | Focus on sales + high-value delivery |
| 8-15 | $4,000-7,000 | **Sales Setter** — sends Looms, books calls | $800-1,500/mo LatAm | Take demo calls, close deals |
| 15-25 | $7,000-12,000 | **Sales Closer** — takes demos, closes | $500 base + 15% MRR commission | Strategy + high-touch client relationships |
| 25+ | $12,000+ | **Account Manager** — owns client retention | $2-3K/mo | Product + partnerships + hiring |

Hire the setter ($800-1500/mo LatAm) BEFORE the closer. They're cheaper, easier to replace, and you learn what your sales flow needs before delegating the close.

---

## Section 13 — Tools You'll Actually Log Into Daily

**Web browser bookmarks bar (in this order):**
1. Review Booster admin — `/admin` on your Review Booster domain
2. Stripe Dashboard — `dashboard.stripe.com`
3. Calendly — `calendly.com/purplexmythzz`
4. WhatsApp Web — `web.whatsapp.com`
5. Meta Business Suite — `business.facebook.com`
6. Vapi — `dashboard.vapi.ai`
7. Twilio Console — `console.twilio.com`
8. LocalFalcon — `localfalcon.com`
9. Claude — `claude.ai`
10. Google Business Profile Manager — `business.google.com`
11. Vercel + Supabase dashboards (when something breaks)

**Mobile app on your phone:**
- WhatsApp Business (for client photos + intake)
- Review Booster `/admin` saved to your home screen (for on-the-go checks)
- Stripe (get notified of new payments in real time)

---

## Section 14 — Your Next 7 Days (Copy-Paste Checklist)

- [ ] Deploy Review Booster (`review-booster/README.md`) and start A2P 10DLC registration today
- [ ] Sign up for Vapi (free tier)
- [ ] Sign up for LocalFalcon ($40/mo)
- [ ] Get Claude API key ($20 credit)
- [ ] Get WhatsApp Business number
- [ ] Add Azul as a test client in Review Booster
- [ ] Test Review Booster end-to-end against yourself
- [ ] Configure missed-call text-back on your Twilio number
- [ ] Set up your client tracker sheet
- [ ] Write bilingual prompt library (5 prompts min)
- [ ] Create WhatsApp intake form
- [ ] Reach out to Aspire Roofing offering free 60-day Growth Suite
- [ ] Build prospect list of 25 Miami roofers
- [ ] Send 10 Looms this week

If you do all 14 of these, by Sunday night you'll have infrastructure ready + first outbound going + likely 1 free-trial case study client onboarded.

Everything after this is repetition and refinement.

---

## Final rule

**Doing 40% of this playbook consistently beats doing 100% of it once.**

Set aside 2 hours every morning for delivery + outbound. Never skip.

The site is done. The offer is set. Delivery + outbound is 100% of what stands between you and your first $10K month.

Go.
