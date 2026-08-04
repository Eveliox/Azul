# Azul — Bilingual AI Growth System for Miami Local Business

> **How to use this document:** This is the full operating context for Azul, the productized AI growth agency serving South Florida home service businesses. Feed this to any Claude session (or share with a collaborator, VA, or investor) so they have complete context on positioning, service catalog, pricing, delivery workflows, tool stack, margin economics, and launch plan.

---

## 1. Company Positioning

**Azul** is a productized AI growth system for local service businesses in South Florida. Instead of billing $2,000+/mo for a single marketing service like a traditional agency, Azul bundles reviews, local SEO, social media, AI phone answering, and websites into one flat-rate monthly subscription — all delivered bilingually (English + Spanish).

### Core differentiator: bilingual by default

Every customer touchpoint — review requests, SEO content, social posts, AI phone answering, website copy — runs in English or Spanish (or both, switching mid-conversation). Miami customers do this natively; most US local-marketing SaaS ships English-only. This is the moat.

### Target market

- **Geography:** Miami-Dade, Broward, Palm Beach
- **Primary verticals:** Roofing, HVAC
- **Secondary verticals:** Plumbing, Pool Services, Landscaping, General Contractors, Pressure Washing
- **Future vertical:** Med Spas (year 2)
- **Ideal customer:** owner-operator or small team (2-15 employees), often not tech-savvy, often Spanish-speaking

### Why this niche

- Hurricane season creates permanent demand for home services
- Job values are high ($5K-$50K+), so a $500/mo marketing spend pays back with one closed job
- Owners are often out on job sites, missing calls — the AI answering service solves an acute pain
- Bilingual delivery unlocks a market segment national competitors can't easily serve

---

## 2. Service Catalog

Six services offered à la carte or as a discounted bundle. Every service has a free trial or free offer.

### Individual services

| # | Service | Price | Free Offer | Status |
|---|---|---|---|---|
| 1 | Review Booster | $79/mo | Free review audit | Live |
| 2 | Social Media AI | $149/mo | 5 free posts | Live |
| 3 | Website Build | $199/mo + $499 setup | Free mockup | Live |
| 4 | Local Proof SEO | $299/mo | Free local presence check | Live |
| 5 | AI Answering Service | $349/mo | 7-day free trial | Beta (first 5 clients only) |
| 6 | AI Facebook Ads | TBD | Join waitlist | Coming Soon |

### Bundle: Azul Growth Suite

- **Standard price:** $549/mo (vs $1,075 à la carte)
- **Founding Client price:** $399/mo locked for life (first 10 clients only)
- **Includes:** all live services + optional AI Answering add-on
- **No long-term contracts** — 30 days notice to cancel

---

## 3. Service Delivery Workflows

### 3.1 Review Booster ($79/mo)

**Purpose:** Automate collecting 5-star Google reviews from happy customers while shielding the business from public negative feedback.

**Tool stack:**
- Primary: GoHighLevel (built-in review automation)
- SMS: Twilio (via GHL)
- Email: SendGrid or Mailgun (via GHL)
- Alternative standalone: NiceJob, Birdeye, or Podium

**Workflow:**
1. Client marks a job "complete" in their existing CRM (Jobber, Housecall Pro, ServiceTitan) → webhook fires to GHL. If no CRM: manual add via a simple form.
2. GHL waits 2-4 hours after job completion.
3. Sends bilingual SMS + email: *"Hi [Name], thanks for choosing [Business]! Would you leave us a quick review?"*
4. **Review gate:** link opens landing page asking "How was your experience?"
   - 5 stars → redirect to Google/Facebook review link
   - 1-4 stars → private feedback form emailed only to the client (the "shield")
5. If no response in 48 hours, one follow-up SMS.
6. Dashboard tracks: sent / opened / clicked / posted.

**Effort per client:** ~20 min setup, ~10 min/month monitoring. Fully automated after setup.
**Variable cost:** ~$5/client/month in SMS charges.

---

### 3.2 Local Proof SEO ($299/mo)

**Purpose:** Keep the client's Google Business Profile continuously active with local, bilingual content so they rank in Miami-area local search.

**Tool stack:**
- Google Business Profile Manager (free)
- GHL Social Planner (pushes to GMB API) OR Localo / Publer
- Claude API or ChatGPT Plus (content generation)
- LocalFalcon ($40/mo) for local ranking reports

**Workflow:**
1. Onboarding: client adds you as a **manager** on their Google Business Profile.
2. Weekly: collect job info from client via WhatsApp (built-in intake form) — 1-2 photos + 3-sentence description of the job.
3. Feed to Claude/GPT with a prompt template:
   > "Write a 100-word Google Business post in [English/Spanish] for a [industry] business in [Miami neighborhood] about [job description]. Include the neighborhood name naturally. End with a soft CTA."
4. Human review the AI output (5 min).
5. Schedule via GHL Social Planner or post manually — 1-2 posts/week.
6. Monthly: run LocalFalcon rank scan → export PDF → email to client with 2-sentence commentary.

**Effort per client:** ~2-3 hours/month total.
**Bottleneck:** getting clients to actually send photos. Build a WhatsApp submission flow on day one.

---

### 3.3 Social Media AI ($149/mo)

**Purpose:** Consistent bilingual social presence on Facebook + Instagram using the client's real work photos.

**Tool stack:**
- GHL Social Planner OR Buffer / Later / Publer
- Meta Business Suite (for FB + IG)
- Claude/GPT for captions

**Workflow:**
1. Reuse the WhatsApp photo intake pipeline from Local SEO.
2. AI generates bilingual captions with hashtags — same prompt library as SEO but tuned for social tone.
3. Schedule 3-4 posts/week per platform (FB + IG).
4. Monthly analytics summary sent to client: reach, engagement, top post.

**Effort per client:** 1-2 hours/month once the intake pipeline is running.
**Reuse tip:** one job photo = 1 GBP post + 1 IG post + 1 FB post. Same asset, 3 pieces of content.

---

### 3.4 AI Answering Service ($349/mo) — HARD MODE

**Purpose:** 24/7 bilingual AI receptionist that captures leads when the crew is on a job site.

**Tool stack:**
- Vapi.ai (~$0.05/min) — most flexible, dev-first
- OR Bland.ai (~$0.09/min) — no-code, easier for agency setup
- OR GHL Voice AI add-on (if you already run GHL)
- Twilio for phone numbers ($1-3/mo)

**Workflow:**
1. Buy a dedicated Twilio number OR port the client's existing business line.
2. Configure call routing: ring client's real cell 3 times → if no answer, AI picks up.
3. Bilingual greeting: *"Thanks for calling [Business]. English or Español?"*
4. AI captures: name, callback number, service needed, address, urgency, best time to call back.
5. AI can answer basic FAQs from a client-specific script (hours, service area, rough pricing).
6. End of call: *"Someone from [Business] will call you within 30 minutes."*
7. Immediately send call summary via SMS + email to the client.
8. **Missed-call text-back:** if any call goes unanswered (including AI failures), auto-SMS: *"Hi, we saw you called [Business]. What can we help you with?"*

**Effort per client:** 6-10 hours initial setup (voice tuning, testing, bilingual script writing), 1-2 hours/month reviewing call transcripts and optimizing.
**Variable cost per client:** $30-80/mo in Vapi/Bland fees depending on call volume. Thinnest margin service.
**Fallback:** if AI fails, route to a real human answering service like Ruby Receptionists (~$310/mo) so calls never drop.
**Launch plan:** offer only to first 3-5 Growth Suite Founding Clients as beta. Full rollout month 2-3 after learning from real usage.

---

### 3.5 Website Build ($199/mo + $499 setup)

**Purpose:** Modern, conversion-focused websites that connect into the rest of the growth system.

**Tool stack:**
- React + Vite + Tailwind (what Azul's own site is built with)
- OR Framer ($15/mo) for faster template-based iteration
- Deploy: Vercel or Cloudflare Pages (free tier or $20/mo)
- Chat widget: Crisp (free tier) or GHL's built-in

**Workflow:**
1. **Week 1-2 (setup):** discovery call → wireframe → design → build → launch. Use vertical templates (one for roofing, one for HVAC, one for pool services) to avoid designing from scratch.
2. Client owns the domain; you help register if needed.
3. Every website includes: hero with CTA, services grid, service area map, contact form, chat widget, mobile-optimized.
4. Bilingual toggle for clients who serve mixed-language markets.
5. **Ongoing $199/mo covers:** hosting, SSL, uptime monitoring, up to 2 small edits/month (change phone number, add service, swap photo).

**Effort per client:** 30-40 hours upfront (drops to 10-15 with templates), 1-2 hours/month after launch.
**Why the setup fee matters:** without it you lose money on the upfront build. The recurring covers hosting + maintenance only.
**Never sell a website standalone.** It's a loss leader for the recurring services. Always attach at least one other subscription.

---

### 3.6 AI Facebook Ads (Coming Soon)

Waitlist only for now. Do NOT build this before you have 10+ paying clients on other services. Meta ads is a specialization — bad campaigns burn client money and your reputation. When ready: hire a media buyer or partner with one before launching.

---

## 4. Tool Stack Summary

| Purpose | Tool | Monthly Cost |
|---|---|---|
| Core CRM, automation, reviews, SMS, social scheduling, websites | **GoHighLevel Agency Plan** | $297-$497 |
| AI phone answering | Vapi.ai or Bland.ai | ~$50/client (usage) |
| Content generation | Claude API + ChatGPT Plus | $20-100 |
| Local rank tracking | LocalFalcon | $40 |
| Website hosting | Vercel or Cloudflare Pages | Free-$20 |
| Chat widget on client sites | Crisp | Free-$25 |
| Design templates | Figma / Framer | $15 |
| Agency WhatsApp Business number | Meta (free) or Twilio | Free-$5 |

**Total fixed monthly cost:** ~$500-700
**Per-client variable cost:** $50-100 (mostly SMS + AI voice minutes)

---

## 5. Margin Economics

### Per-client (Growth Suite bundle at $549/mo)

- Revenue: **$549**
- Variable cost: **~$80**
- Gross profit: **~$470 (85% margin)**

### Business scale checkpoints

| Clients | MRR | Gross Profit/mo | Notes |
|---|---|---|---|
| 2 | $1,098 | $940 | Break-even on fixed tool costs |
| 10 | $5,490 | $4,700 | Founder still solo, working 40 hrs/wk |
| 20 | $10,980 | $9,400 | Hire first VA (~$2,000/mo Philippines or LatAm) |
| 30+ | $16,470+ | $14,100+ | Systemize SOPs, hire second VA or account manager |

### Founding Client math (first 10 at $399/mo)

- $399 × 10 = $3,990 MRR from founding cohort
- Locked pricing = predictable base + case studies
- Full-price clients #11+ pay $549/mo

---

## 6. 30-Day Launch Plan

### Week 1 — Infrastructure
- Sign up for GoHighLevel Agency plan ($297 starter tier)
- Pick 1 vertical to specialize in first (recommend roofing)
- Create Azul's own GHL sub-account as the test/demo environment
- Set up Twilio account, buy 1 phone number for AI Answering testing
- Sign up for Claude API + LocalFalcon

### Week 2 — Automations
- Build Review Booster automation in GHL (SMS + email + review gate)
- Build missed-call text-back automation
- Configure one test AI Answering agent in Vapi (bilingual, roofing-flavored)
- Write bilingual prompt library for content generation (SEO posts, social captions, review requests)
- Create WhatsApp intake form for client photo submissions

### Week 3 — First client
- Land 1 Founding Client — offer free 30 days of full Growth Suite in exchange for case study rights
- Onboard them into GHL, tune all automations against their real data
- Start generating content, answering their calls, running review requests
- Document every setup step as an SOP

### Week 4 — Iterate + scale
- Fix everything that broke in week 3
- Case study screenshots: reviews collected, calls captured, GBP impressions
- Land clients #2 and #3 at $399/mo Founding Client pricing
- Refine onboarding based on what took the longest with client #1

### Month 2-3 — Scale
- Target 5-8 paying clients
- Hire a Philippines/LatAm VA (~$5-8/hr) for content generation and photo intake once you cross 5 clients
- Move AI Answering out of beta once you have 3 stable installs

---

## 7. Website Copy (Reference)

The following are the live copy blocks on azul.com — use these as the canonical positioning language.

### Hero
- **Badge:** AI Growth System for Miami Home Services · English + Español
- **Headline:** Get More Customers, Reviews, And Booked Jobs.
- **Subtitle:** Azul helps South Florida roofers, HVAC pros, and home service businesses get found online, answer every call, and turn happy customers into 5-star reviews — all in one bilingual growth system.
- **CTAs:** Book a Free Demo · See Growth Plans

### Four value pillars (What We Do)
1. **Get Found Online** — Google Business Profile posts, local SEO, service-area content
2. **Capture More Leads** — connected forms, calls, messages in one system
3. **Answer Faster (English & Español)** — AI answering + missed-call text-back, in the caller's language
4. **Build Trust With Reviews** — automated review requests with private feedback shield

### FAQ headlines (canonical objection answers)
- How is this different from a traditional marketing agency? → Productized subscription vs à la carte, one system vs many vendors.
- Do I need to be tech-savvy? → No. Weekly summary is the interface.
- Do you really answer in English AND Spanish? → Yes, every part of the system.
- How fast will I see results? → Day 1 for call capture, week 1 for reviews, 30-60 days for local SEO ranking.
- Do you serve outside Miami? → South Florida focus. Elsewhere = book a demo, we'll be honest about fit.
- What if I want to cancel? → 30 days notice, no fees, you keep everything we built.

---

## 8. Site Architecture (What's Built)

**Live at:** azul.com (React + Vite + Tailwind + Lenis smooth scroll)

**Section flow:**
1. Founding Client announcement bar (top, blue gradient)
2. Sticky header with EN/ES language toggle + Book Free Demo CTA
3. Hero (bilingual badge + agency dashboard mockup)
4. About + What We Do outcome grid
5. Solutions (6 detailed service cards)
6. How It Works (4-step process)
7. Pricing (6-tile grid + Growth Suite bundle card)
8. Industries (8 verticals with Focus/Soon badges)
9. Recent Work (compact 2-card portfolio strip)
10. FAQ (6 local-business-owner questions)
11. Contact (form + Book Demo card)
12. Footer (bilingual links + service area)
13. Floating WhatsApp widget (green, bottom-right, with animated ping)

**Fully bilingual:** every string flips between English and Spanish via a `LanguageContext` that persists to localStorage and auto-detects browser language.

---

## 9. Bilingual Delivery — Operational Notes

Bilingual is the moat AND doubles content workload. To manage it:

- **Prompt library must produce both languages from one input.** Same job description in → EN and ES outputs generated in one API call.
- **Miami/Latin American Spanish, not Spain Spanish.** Use "usted" for professional register with business owners. Vertical-specific terminology (Techos, HVAC stays as HVAC, Plomería, Servicios de Piscinas, etc.).
- **Client language preference stored per account** in GHL so all their content defaults to the right language.
- **Meta / GBP posts can be language-tagged** — post EN version to English-facing audience, ES to Spanish-facing.
- **AI Answering script must handle language switch mid-call.** Customers in Miami switch mid-sentence.

---

## 10. Delivery Reality Checks

1. **You are the delivery team for clients 1-10.** No amount of tooling changes this. Plan on 4-6 hours/week per client at the start.
2. **The photo intake pipeline is the whole game.** If clients don't send photos, no content, no reviews, no proof. Build the WhatsApp intake flow first.
3. **AI Answering will break on real calls.** Beta it, keep a human answering service (Ruby, etc.) as fallback, tune weekly.
4. **The website is a loss leader.** Never sell it without another recurring service attached.
5. **Bilingual is 2x the work.** Systematize with prompt templates or the margin disappears.
6. **Founding Client offer creates urgency AND traps you.** $399/mo for 10 clients = $47,880 ARR locked at that rate forever. Worth it for case studies + early revenue, but understand the tradeoff.

---

## 11. What's NOT Built Yet (Roadmap)

- **Booking widget embed** — currently CTAs open Calendly in a new tab. Could inline embed for higher conversion.
- **Real case studies** — Recent Work section shows website portfolio, not growth-system results. Add screenshots of dashboards / testimonial video from Founding Clients.
- **Blog / resource content** — for organic SEO to Azul itself. Not urgent.
- **/es route with hreflang** — currently language is client-side toggle. For SEO you may want distinct URLs.
- **Live chat on Azul.com** — WhatsApp widget is there; consider Intercom or Crisp for typed chat.
- **AI Facebook Ads product** — waitlist only. Do not build until 10+ clients on other services.

---

## 12. Contact & Assets

- **Website:** azul.com
- **Booking:** calendly.com/purplexmythzz/30min
- **Founder:** Evelio Gonzalez (Miami)
- **Instagram:** @azuldevsmiami
- **LinkedIn:** linkedin.com/in/evelio-gonzalez-77a3b5329
- **WhatsApp Business:** `786-920-1239` (wired in App.jsx as `17869201239`)

---

*This document is the single source of truth for Azul as of the latest site build. Share it with collaborators, VAs, or paste into Claude sessions to get context-aware help on any part of the business — from writing sales scripts to configuring Vapi to building SOPs.*
