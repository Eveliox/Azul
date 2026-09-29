# AZUL DELIVERY PLAYBOOK

Complete operational how-to for delivering every service. This is the sit-down-and-follow-these-steps version. Reference it during GHL setup and client onboarding.

**Prerequisites:**
- GoHighLevel Agency Starter plan ($297/mo)
- Vapi.ai account (for AI Answering)
- LocalFalcon subscription ($40/mo)
- Claude API key or ChatGPT Plus
- WhatsApp Business number
- Stripe account (already set up)

---

## Section 1 — Foundation Setup (do once, use forever)

### 1.1 GoHighLevel Agency Account

1. Go to gohighlevel.com → sign up for Agency Starter ($297/mo, 14-day trial)
2. Complete business profile: Company name = Azul, Industry = Marketing Agency
3. Add payment method (they'll charge after trial)
4. Get your Agency dashboard access

### 1.2 Build Your Sandbox Sub-Account

In GHL Agency dashboard:
1. Click **+ Add Sub-Account**
2. Name it: `Azul — Test Sandbox`
3. Address: your Miami address
4. Choose Snapshot: **Start Fresh** (you're building the template)
5. Timezone: America/New_York

### 1.3 Configure the Sandbox

Inside the sandbox, set up these building blocks:

**Custom Fields** (Contacts → Custom Fields):
- `preferred_language` (dropdown: English, Spanish)
- `service_type` (dropdown: roofing, HVAC, plumbing, pool, landscaping, general_contractor, medspa, other)
- `last_job_date` (date)
- `job_value` (number)

**Pipeline** (Opportunities → Pipelines):
Create pipeline "Sales Pipeline" with stages:
1. New Lead
2. Contacted
3. Quoted
4. Booked
5. Job Complete
6. Review Requested
7. Reviewed
8. Lost

**Tags to create:**
- `founding-client` (for your $399/mo customers)
- `growth-suite` (for $549/mo customers)
- `english`
- `spanish`
- `job-complete` (triggers review requests)
- `unhappy-customer` (routes to private feedback)

### 1.4 Save As Snapshot

Agency Settings → Snapshots → Create Snapshot from Sub-Account
- Name: `Azul Growth Suite — Master`
- Include: everything

Now you can clone this in 1 click for every new client.

---

## Section 2 — Service #1: Review Booster ($79/mo)

### 2.1 What it does (the outcome)

Happy customers get automatically prompted for a Google review. Unhappy ones get routed to a private feedback form so they don't leave a 1-star publicly.

### 2.2 One-time setup per client (30 min)

1. **Get client's Google Business Profile access**
   - Send them this exact WhatsApp message:
     > "Hi [Name], to set up your review automation I need to be added as a Manager on your Google Business Profile. Here's how: [link to how-to]. My email: azuldevsmiami@gmail.com. Takes 2 minutes."
   - How-to link: https://support.google.com/business/answer/3403100

2. **Configure the automation in GHL** (using your Snapshot, most is pre-built):
   - Trigger: Contact tagged `job-complete`
   - Wait 2 hours
   - Send SMS: *"Hi [First Name], thanks for choosing [Business]! Would you take 30 seconds to leave us a review? [review-link]"*
   - If preferred_language = spanish, send Spanish version
   - If clicked but no submit in 48h → send follow-up SMS

3. **Build the review gate landing page** in GHL:
   - Path: `/review/[client-slug]`
   - Simple design: business logo, "How was your experience with [Business]?", 5-star selector
   - If 5 stars → redirect to Google review link
   - If 1-4 stars → show private feedback form (emails client directly)

4. **Connect Google review link** (get it from GBP settings)

### 2.3 Weekly workflow per client (10 min)

- **Monday:** Open client's dashboard, check requests-sent count from last week
- Any 1-4 star private feedback? Forward to client via WhatsApp for personal follow-up
- Any reviews collected? Screenshot the best one and text client: *"[Name] just left you a 5-star. Nice work."*

### 2.4 SMS/Email templates (paste into GHL)

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

- **Delivery failure:** if SMS bounces (bad number), tag contact `bad-number` and manually email
- **Zero reviews after 2 weeks:** check that job-complete tag is actually being applied. Client may not be marking jobs done in their system.
- **Negative review posted publicly:** if review gate failed, respond within 24h with a professional public reply

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
5. **Set up GHL Social Planner → Google Business Profile connection**

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
- Schedule via GHL Social Planner for Tuesday 9 AM
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
3. **In GHL Social Planner:** connect their Facebook Page + Instagram (should auto-pull posts)
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

Schedule 3-4 posts per week per platform via GHL Social Planner.

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
- **Day 14:** Connect to GHL forms, Crisp chat widget, GA4

### 5.3 Every website MUST include

- Sticky header with phone + "Get a Quote" button
- Hero with headline + subheadline + CTA + hero image
- Services grid (3-6 services with icons and 1-line descriptions)
- Service area map (embed Google Map showing coverage area)
- "Why choose us" (3 pillars — years in business, reviews count, response time)
- Testimonials section pulling their real Google reviews
- Contact form (name, phone, service, message) → connects to GHL pipeline
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
4. **Configure webhook:** on call end → send summary to client via SMS (Twilio) + email (GHL)
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

## Section 7 — Onboarding a New Paying Client (Day 0 → Day 7)

### Hour 0 (immediately after Stripe payment)

Send this WhatsApp message:
```
Welcome to Azul! Your subscription is confirmed.

3 quick things to get you launched by end of week:

1. Add me as MANAGER on your Google Business Profile:
   https://support.google.com/business/answer/3403100
   My email: azuldevsmiami@gmail.com

2. Send me these 5 things via WhatsApp today:
   - Your logo (PNG or JPG)
   - 5 recent job photos with 1-sentence descriptions
   - List of services you offer
   - Your service area (zip codes or neighborhoods)
   - Top 3 competitor names

3. Book your 30-min kickoff call here: [Calendly link]

I'll have your Growth Suite fully live in 5 business days.

— Evelio at Azul
```

### Day 1 (30 min)

- In GHL Agency → Clone Snapshot → Create sub-account named "Client — [Business Name]"
- Upload their logo, set brand colors
- Import any existing customer list they have (CSV)
- Tag all contacts with `english` or `spanish` based on names

### Day 2-3 (4 hours)

- Client accepts your GBP manager invite → connect GBP to sub-account
- Buy Twilio number for missed-call text-back
- Turn on Review Booster automation (Snapshot has it pre-built, just enable)
- Turn on missed-call text-back automation
- Configure their review gate landing page with their Google review link
- Test both by sending yourself a fake request

### Day 3-4 (4 hours)

- Build their website (use vertical template, customize with their logo/colors/services/photos)
- Deploy to Vercel on their custom domain
- Connect contact form → GHL pipeline
- Install Crisp chat widget with pre-filled bilingual greeting

### Day 4-5 (3 hours)

- Connect Facebook + Instagram to GHL Social Planner
- Generate first week of content from their 5 photos (5 GBP posts + 5 IG + 5 FB = 15 pieces of content)
- Schedule everything for the next 7 days

### Day 5 (30 min kickoff call)

Screen-share their new GHL dashboard:
- Show them: reviews inbox, contacts pipeline, upcoming scheduled posts
- Give them their login (they can peek anytime)
- Confirm: they send you photos via WhatsApp every Monday
- Confirm: their AI Answering (if applicable) is forwarding correctly

### Day 6-7 (buffer)

- Fix anything that broke
- Send a "you're all set" confirmation email

**Onboarding time: ~14 hours for client #1, drops to ~6 hours by client #5 as you refine the Snapshot.**

---

## Section 8 — Weekly Client Rhythm (ongoing)

Per active paying client, ~2 hours/week total.

### Monday morning (per client, 20 min)

- WhatsApp them: *"Hey [Name], send me job photos from the past week"*
- When photos come in, generate content in Claude → schedule in GHL

### Wednesday afternoon (per client, 15 min)

- Open GHL sub-account
- Check: any missed calls this week? Any reviews sent but not clicked? Any pipeline stuck?
- Fix or nudge

### Friday afternoon (per client, 15 min)

- Send weekly summary email:
  ```
  Hey [Name] — quick recap:
  
  ✅ Reviews collected this week: [X]
  ✅ Missed calls captured: [X] (with SMS follow-ups sent)
  ✅ New leads in pipeline: [X]
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

## Section 9 — Monthly Client Rhythm

### First Monday of the month (30 min per client)

- Run LocalFalcon rank report for target keywords
- Export PDF, add 2-3 sentences of commentary
- Send to client with any suggested next moves

### End of month (2 hours total for all clients)

- Review Stripe MRR — anyone canceled? Any failed charges?
- Review your own numbers: how many demos booked this month, closing rate, new MRR
- Refine the Snapshot based on what you added/changed for clients this month

---

## Section 10 — Common Issues & Fixes

### "Client isn't sending me photos"
- Try WhatsApp reminders 2×/week for 2 weeks
- If still no photos, offer to visit a job site once and take photos yourself (paid trip, one-time)
- If still nothing, they're not a good fit for Social Media AI — refund that portion and downgrade

### "Reviews aren't landing"
- Check job-complete tag is actually being applied to contacts (most common cause)
- Check SMS delivery rate in Twilio dashboard (bad numbers get filtered)
- Check the review gate landing page isn't broken

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

### "GHL is glitching"
- 90% of the time restarting your browser fixes it
- 9% of the time it's a real GHL bug — check their status page (status.gohighlevel.com)
- 1% of the time you have to open a support ticket. Expect 24-48 hr response.

---

## Section 11 — When to Hire (and Who)

| Clients | MRR | Hire | Cost | Frees you to |
|---|---|---|---|---|
| 0-3 | $0-1,500 | Nobody | $0 | Learn every step yourself |
| 3-8 | $1,500-4,000 | **VA #1** — content generation | $600-1,000/mo LatAm | Focus on sales + high-value delivery |
| 8-15 | $4,000-7,000 | **Sales Setter** — sends Looms, books calls | $800-1,500/mo LatAm | Take demo calls, close deals |
| 15-25 | $7,000-12,000 | **Sales Closer** — takes demos, closes | $500 base + 15% MRR commission | Strategy + high-touch client relationships |
| 25+ | $12,000+ | **Account Manager** — owns client retention | $2-3K/mo | Product + partnerships + hiring |

Hire the setter ($800-1500/mo LatAm) BEFORE the closer. They're cheaper, easier to replace, and you learn what your sales flow needs before delegating the close.

---

## Section 12 — Tools You'll Actually Log Into Daily

**Web browser bookmarks bar (in this order):**
1. GHL Agency Dashboard — `app.gohighlevel.com`
2. Stripe Dashboard — `dashboard.stripe.com`
3. Calendly — `calendly.com/purplexmythzz`
4. WhatsApp Web — `web.whatsapp.com`
5. Meta Business Suite — `business.facebook.com`
6. Vapi — `dashboard.vapi.ai`
7. LocalFalcon — `localfalcon.com`
8. Claude — `claude.ai`
9. Google Business Profile Manager — `business.google.com`

**Mobile app on your phone:**
- WhatsApp Business (for client photos + intake)
- GHL mobile app (for on-the-go dashboard checks)
- Stripe (get notified of new payments in real time)

---

## Section 13 — Your Next 7 Days (Copy-Paste Checklist)

- [ ] Sign up for GoHighLevel Agency Starter today
- [ ] Sign up for Vapi (free tier)
- [ ] Sign up for LocalFalcon ($40/mo)
- [ ] Get Claude API key ($20 credit)
- [ ] Get WhatsApp Business number
- [ ] Watch 3 GHL YouTube tutorials (Extendly channel)
- [ ] Build your Sandbox sub-account in GHL
- [ ] Configure Review Booster automation end-to-end
- [ ] Configure missed-call text-back automation
- [ ] Save as Snapshot
- [ ] Write bilingual prompt library (5 prompts min)
- [ ] Create WhatsApp intake form
- [ ] Reach out to Aspire Roofing offering free 60-day Growth Suite
- [ ] Build prospect list of 25 Miami roofers
- [ ] Send 10 Looms this week

If you do all 15 of these, by Sunday night you'll have infrastructure ready + first outbound going + likely 1 free-trial case study client onboarded.

Everything after this is repetition and refinement.

---

## Final rule

**Doing 40% of this playbook consistently beats doing 100% of it once.**

Set aside 2 hours every morning for delivery + outbound. Never skip.

The site is done. The offer is set. Delivery + outbound is 100% of what stands between you and your first $10K month.

Go.
