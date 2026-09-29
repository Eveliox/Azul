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

- Add them to your client tracker (Section 1.3)
- Add them as a client in Review Booster `/admin` with their default language
- Save their logo and brand colors in their client folder
- Ask which language each customer prefers when jobs are entered; don't guess from names

### Day 2-3 (4 hours)

- Client accepts your GBP manager invite → connect GBP to your scheduler (if you use one)
- Buy Twilio number for missed-call text-back
- Add their Google review link in Review Booster
- Set up missed-call text-back on their Twilio number
- Test both by sending yourself a fake request

### Day 3-4 (4 hours)

- Build their website (use vertical template, customize with their logo/colors/services/photos)
- Deploy to Vercel on their custom domain
- Connect contact form → lead emails to the client (Resend)
- Install Crisp chat widget with pre-filled bilingual greeting

### Day 4-5 (3 hours)

- Confirm Facebook + Instagram access in Meta Business Suite
- Generate first week of content from their 5 photos (5 GBP posts + 5 IG + 5 FB = 15 pieces of content)
- Schedule everything for the next 7 days

### Day 5 (30 min kickoff call)

Screen-share what's live:
- Show them: their website, Review Booster stats, upcoming scheduled posts in Meta Business Suite
- Don't give them the Review Booster admin key: it currently opens every client's data. Send them a monthly stats screenshot instead
- Confirm: they send you photos via WhatsApp every Monday
- Confirm: their AI Answering (if applicable) is forwarding correctly

### Day 6-7 (buffer)

- Fix anything that broke
- Send a "you're all set" confirmation email

**Onboarding time: ~14 hours for client #1, drops to ~6 hours by client #5 as you refine your templates.**

---

## Section 8 — Weekly Client Rhythm (ongoing)

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

## Section 9 — Monthly Client Rhythm

### First Monday of the month (30 min per client)

- Run LocalFalcon rank report for target keywords
- Export PDF, add 2-3 sentences of commentary
- Send to client with any suggested next moves

### End of month (2 hours total for all clients)

- Review Stripe MRR — anyone canceled? Any failed charges?
- Review your own numbers: how many demos booked this month, closing rate, new MRR
- Refine your templates based on what you added/changed for clients this month

---

## Section 10 — Common Issues & Fixes

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

## Section 13 — Your Next 7 Days (Copy-Paste Checklist)

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
