# Found Everywhere — client delivery runbook

Target: baseline reports delivered within **7 days**, first full month's deliverables out by **day 30**.
Service price: $599/mo. Variable cost: ~$0-50/mo (optional paid listicle slot). See AZUL_BUSINESS_PLAN.md §3.2.

**Highest-margin service. Also the one with a 90-day guarantee (refund month 3 if not cited by at least one AI engine on agreed target queries).**

---

## Day 0 — Intake

### Collect from the client
- Legal business name + any DBA
- Google Business Profile status (verified, unverified, doesn't exist)
- Current GBP URL (Google Maps link)
- Domain (for schema work)
- Services offered — exact wording
- Service area: cities, neighborhoods, zip codes (up to 20)
- Primary categories they want to rank for (up to 10 for GBP)
- Existing Reddit account? (Almost always no — you'll create one)
- Existing YouTube channel? (Usually no — you'll create one)
- Logo + 3-5 brand photos
- WhatsApp number for the owner (for photo intake)
- **Target queries** — this is the 90-day guarantee bar. Pick 3-5 realistic queries together on the kickoff call. Examples:
  - ✅ "best roofer in Doral"
  - ✅ "metal roof contractor near Hialeah"
  - ❌ "best roofer in Florida" (too broad, won't win)
  - ❌ "cheapest roof" (not a query AI engines personalize well)

### Access requests the client needs to grant you
Send as a numbered checklist, one at a time (people get overwhelmed by all at once):

1. **Google Business Profile** — add `eveliogonzalez@gmail.com` (or your agency account) as **Manager** at https://business.google.com → Users
2. **Domain access** — add you as a user in their registrar OR add a DNS TXT record you provide (needed for schema work)
3. **Facebook / Instagram** (if we're sharing GBP posts there too) — add you as Editor on their Meta Business account

Do NOT ask for passwords. Always use proper delegated access.

---

## Day 1 — Baseline audits

Do all three on the same day so you have a dated starting point.

### 1. GBP audit (30 min)
- [ ] Verified? (If no — walk them through postcard verification. Don't start deliverables until verified.)
- [ ] Primary category + secondary categories (up to 10)
- [ ] Service area zips (up to 20)
- [ ] Hours, phone, website correct
- [ ] Logo + 10+ photos uploaded (interior, exterior, team, work)
- [ ] Q&A section — any existing questions? (Answer them with the owner on the call)
- [ ] Review count + rating (snapshot this number — compare monthly)
- [ ] GBP Posts: when was the last one? (Usually never)

### 2. LocalFalcon baseline rank scan
- Set up grid scan: 5x5 or 7x7 grid centered on their location
- Scan their top 3-5 target keywords
- Save the report as "Baseline — [DATE]"
- Numbers to screenshot: average rank, visibility %, grid dominance

### 3. AI citation baseline
Open each engine fresh (incognito or new chat), run every target query, record who gets named. Save as a dated table:

```
Query: "best roofer in Doral"
- ChatGPT: [competitors named, our client Y/N]
- Perplexity: [competitors named, our client Y/N]
- Gemini: [competitors named, our client Y/N]
- Google AI Overviews: [competitors named, our client Y/N]
```

This is your baseline for the 90-day guarantee. **Save screenshots.**

---

## Day 2-7 — Onboarding setup

### GBP cleanup (fix anything the audit flagged)
- Update categories, hours, service area
- Upload fresh photos (bulk upload 20+ at once — categorize interior/exterior/team/work)
- Pre-write 5-10 Q&A pairs together with the owner, publish them
- Enable messaging (so leads can text through GBP)

### Reddit account creation + warm-up
- Create a Reddit account in the owner's name (not a fake persona — authenticity matters)
- Avatar: real headshot or company logo
- Bio: short, honest. "Roofer in Miami. 15 years in the trade. Happy to answer home questions."
- Subscribe to: `r/Miami`, `r/florida`, `r/HomeImprovement`, `r/Roofing` (and vertical-specific), plus any neighborhood sub (`r/MiamiBeach`, etc.)
- **Warm up for 2-3 weeks before promotional posts.** Participate authentically: comment on 10-20 threads with real knowledge. No links. No business plugs. Build karma + account history. Reddit instant-shadowbans new accounts that promote.

### YouTube channel setup
- Create channel in client's business name (not personal Google account — use a Brand Account)
- Upload channel art + logo + banner
- Write channel description (bilingual, services, service area)
- Create "Shorts" playlist
- Enable monetization requirements aren't needed — this is for discoverability, not revenue

### Schema deployment
Add LocalBusiness + Service schema to their site. Use JSON-LD in `<head>`. Minimum fields:
- `@type: LocalBusiness` (or more specific: `Roofer`, `HVACBusiness`, etc.)
- `name`, `address`, `telephone`, `url`, `priceRange`, `openingHours`
- `geo` (lat/lng)
- `areaServed` (list of cities)
- `aggregateRating` (if 20+ reviews)
- `sameAs` (links to Facebook, Instagram, YouTube, Yelp)

Validate at https://search.google.com/test/rich-results. If their site isn't ours (we didn't build it), we may need their current developer's cooperation OR work through Google Tag Manager if it's installed.

### WhatsApp intake group
- Create a WhatsApp group: "[BUSINESS] + Azul content"
- Members: you, the owner, anyone on their team who takes job photos
- Pin a message with the instructions:

```
📸 Content intake — [BUSINESS]

Every job, when you have a minute, drop in:
1. 1-3 photos (before + after is best)
2. 3 sentences:
   - What was the job?
   - What was tricky about it?
   - Where (city + neighborhood)?

That's it. We turn each one into a Google post, a Reddit answer, and a YouTube Short.

Minimum: 1 job/week.
```

---

## Day 7 — Baseline report + agreed target queries

Send the client:
1. Baseline AI citation table (annotated: "You weren't named in 0/5 queries — here's where we're starting")
2. Baseline LocalFalcon grid screenshots (annotated: "You rank in Y of 25 grid cells for X query — here's where we are")
3. GBP optimization summary ("Added X categories, Y zip codes, Z photos")
4. **Written confirmation of the 3-5 target queries** that trigger the 90-day guarantee

Email template:
```
Subject: Day 7 — [BUSINESS] baseline report

Hi [NAME],

Here's where we're starting. These numbers are the "before" picture — we beat them over the next 90 days.

🤖 AI engines (baseline):
Across ChatGPT, Perplexity, Gemini, and Google AI Overviews, you're currently cited on [X] of [Y] agreed queries. Full breakdown attached.

📍 Local rank (LocalFalcon baseline):
"[QUERY 1]" — [AVG RANK] across 25 grid points
"[QUERY 2]" — [AVG RANK]
"[QUERY 3]" — [AVG RANK]

✅ GBP cleanup done:
- [N] categories live
- [N] zips in service area
- [N] photos added
- [N] Q&A pairs published

🎯 Our 90-day guarantee queries (confirming so we're aligned):
1. [QUERY]
2. [QUERY]
3. [QUERY]

Monthly content starts this week. First GBP post goes out [DATE].

— Evelio
```

---

## Monthly deliverables (recurring)

### Every month, each client gets:
1. **4 bilingual GBP posts** (one per week) — from WhatsApp photo intake
2. **1 authority listicle placement/mention** — pitch to local news, neighborhood blogs, Expertise.com, Three Best Rated, Yelp Top 10, local chamber of commerce
3. **2 Reddit mentions** — authentic answers in target subs (NEVER spam, NEVER drop a link without context)
4. **1 YouTube Short (60-90 sec)** — client narrates on-site via WhatsApp video, you edit + add bilingual captions + upload
5. **Schema health check** — re-validate rich results, fix any new errors
6. **Monthly bilingual report** — LocalFalcon rank scan + AI citation re-check + 2 sentences of commentary

### Weekly workflow
- **Monday:** check WhatsApp group for new job photos. If none in 7+ days, ping the owner.
- **Tuesday:** turn one job into 1 GBP post + 1 Reddit answer draft + 1 YouTube Short script
- **Wednesday:** owner reviews drafts (10 min), approves
- **Thursday:** schedule GBP post, post Reddit answer (if a relevant live thread exists this week — don't force it), film + upload YouTube Short
- **Friday:** nothing scheduled — buffer day for the Reddit thread monitoring

### Reddit monitoring
Weekly saved search: run these queries in Reddit search, filtered to last 7 days, in your target subs:
- `[service type] miami` / `[service type] [neighborhood]`
- `recommend [service type]` / `looking for [service type]`
- `[problem the service solves]` (e.g., "roof leaking", "AC not cooling")

If a thread exists, draft an answer with real context from the client's work. Rules:
- No company link in the first comment
- First sentence: real advice, not a pitch
- Mention the client's business only if directly asked ("I used [BUSINESS]" — in a comment, like a real person)
- If no relevant thread this week, skip. Don't invent reasons to post.

---

## Monthly report template

Send on the same day each month (e.g., 1st of each month).

```
Subject: [BUSINESS] — Found Everywhere · Month [N]

Hi [NAME],

📍 Local rank (LocalFalcon)
Query | Avg rank | Change | Grid visibility
"[Q1]" | [N] | [+/- N vs last month] | [X of 25 cells top-3]
"[Q2]" | [N] | [...] | [...]
"[Q3]" | [N] | [...] | [...]

🤖 AI citations (ChatGPT / Perplexity / Gemini / Google AI Overviews)
Query | Named by | Change
"[Q1]" | [engines] | [new citations this month]
"[Q2]" | [engines] | [...]
"[Q3]" | [engines] | [...]

📝 Content shipped this month
- 4 Google Business posts (EN/ES)
- 2 Reddit answers in [subs]
- 1 YouTube Short: "[title]"
- 1 listicle placement/mention: [where]

Takeaways:
- [1-2 sentences about what's working or what to adjust]
- [1 ask of the client if needed, e.g., "Need 3-4 more job photos — send via WhatsApp this week."]

— Evelio
```

---

## 90-day guarantee — the enforcement moment

End of month 3, you run the AI citation check against the agreed queries.

**If the client is cited on ≥1 target query by ≥1 engine:** guarantee met. Business as usual.

**If not cited at all:**
1. Refund month 3's payment within 5 business days
2. Send honest post-mortem email — what we tried, what didn't work, what we'd do differently
3. Offer: continue month 4 free as a last swing, or wind down with no further charges
4. Document the failure case internally — adjust the guarantee criteria or the services pitch

Email template (refund case):
```
Subject: Month 3 — the honest report, and your refund

Hi [NAME],

I owe you a straight answer. The 90-day guarantee was that at least one AI engine would be citing [BUSINESS] by now on our target queries. That didn't happen on [N] of them.

What we tried: [list]
What we think went wrong: [analysis — be specific, don't deflect]

As promised, your month 3 payment ($599) is being refunded. You'll see it on your card in 3-5 days.

Two options from here:
1. Continue month 4 free. We change tactic — [specific new plan].
2. Pause. No further charges. Everything we built (GBP optimizations, Reddit account, YouTube channel) stays with you.

Which do you want? Call me or reply here.

— Evelio
```

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| No GBP post engagement | Posts too corporate / stock-looking | Use the real job photo, keep caption under 100 words, local language ("Fixed a leak on NE 143rd St yesterday" > "We provide roof repair services"). |
| Reddit account shadowbanned | Posted too fast, too promotional | Create a new account, warm it up longer (4-6 weeks), stick to answering before any mention of the client. |
| YouTube Shorts getting 0 views | No keywords in title, no description, no hashtags | Title format: "[Problem] in [City] | [Service]" (e.g., "Metal roof install in Doral | Residential roofing"). Description: 2 paragraphs + 3-5 hashtags. |
| Client not sending photos | Owner is on job sites all day | Switch to voice notes. "Just send me a 15-second voice note describing the job after you finish. I'll do the rest." |
| AI engines still not citing | Not enough third-party mentions | Push harder on listicle placements. Pay for 1-2 ($50-200 each) if organic pitches fail month 2. Focus on sites with clean markup (Yelp Top 10, Expertise, Thumbtack top-rated badges). |

---

## Offboarding (if client cancels)

30 days notice.
1. Export all content you created: Reddit post history (screenshots), YouTube videos (give them owner access to the channel if it's in their name — it should be), GBP (already theirs).
2. Hand off the WhatsApp group ownership
3. Transfer YouTube channel ownership to the client (via Brand Account settings)
4. Last report delivered on final day: full history of ranks + citations with the start → end delta
5. Remove yourself as GBP manager
6. Keep screenshots of all deliverables in a `_archive/clients/[name]/` folder for 12 months
