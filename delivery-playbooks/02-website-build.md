# Website Build — client delivery runbook

Target: launched site within **14 calendar days** of signed agreement.
Service price: $2,500 one-time + $120/mo recurring. See AZUL_BUSINESS_PLAN.md §3.5.

**Rule from the business plan: never sell standalone.** Always bundle with at least one recurring service (Review Booster at minimum).

---

## Day 0 — Intake (do before anything else)

### Collect from the client
- Legal business name + any DBA
- Services offered (bulleted list — exact wording they use with customers)
- Service area: cities, zip codes, "within 20 miles of X"
- Phone, email, address (or "serves customers at their location")
- Hours of operation
- Current website URL (if any) — for reference, not inspiration
- **Domain**: do they own it? Registrar login OR DNS access
- Logo: vector (SVG/AI) or high-res PNG; both color + monochrome if they have it
- Brand colors (hex) and preferred font (if any — otherwise you choose)
- 10-20 real job photos (high-res, from actual jobs — not stock)
- 3-5 real customer testimonials with full names
- License numbers / certifications / insurance info (for footer trust)
- Any special offer or promo to feature in hero
- Preferred language: EN, ES, or bilingual toggle

### Intake form template (send as a simple Google Form or Notion page)
Group the questions by priority:
1. **Must-have before I can start:** business name, services, service area, phone, email, domain access
2. **Must-have before launch:** logo, photos, testimonials
3. **Nice-to-have:** promo, specific wording preferences

---

## Day 1 — Kickoff call (30-45 min)

Agenda:
1. Confirm the intake form answers (they always miss or misunderstand 1-2 questions)
2. Walk them through the vertical template you'll start from (show Aspire Roofing, Hello You, Caley, Sanos as reference)
3. Agree on 2-3 competitors they want to look better than
4. Agree on primary CTA: "Get a quote" vs "Call now" vs "Book an estimate"
5. Agree on language: EN only, ES only, or bilingual toggle
6. Set launch date (14 days from today — put in writing)
7. Collect any files not yet sent

### After the call — send recap email
```
Subject: Kickoff recap — [BUSINESS] website

Hi [NAME],

Great call. Here's what we agreed:

- Primary goal: [GOAL, e.g., "more quote requests from Spanish-speaking homeowners in Hialeah"]
- Primary CTA: [CTA]
- Language: [EN / ES / Both]
- Launch target: [DATE]

Still waiting on:
- [Logo / photos / testimonials / whatever's missing]

Send those over by [DATE + 3] and we're on track.

— Evelio
```

---

## Day 2-5 — Build (first draft)

### Template selection
Start from the closest live site:
- Roofing / construction → fork Aspire Roofing structure
- Wellness / spa / med spa → fork Hello You structure
- Insurance / finance → fork Caley Insurance structure
- Medical / clinic → fork Sanos Medical structure
- New vertical → start from the Azul landing site structure

### Fixed sections every site gets
1. Hero: headline + sub + primary CTA + hero photo or video
2. About / Who we are (2-3 sentences, 1 photo)
3. Services grid (3-6 cards with icons or photos)
4. Service area (map + list of zip codes/neighborhoods)
5. Why us / differentiators (3-4 tiles)
6. Testimonials (3+ real reviews with names)
7. Gallery (job photos, 6-12)
8. Contact: form + phone + address + hours
9. Footer: license numbers, insurance, hours, social, Spanish toggle if bilingual

### Bilingual decision
- If bilingual toggle: build EN first, then clone every string into `es` locale. Use Latin American Spanish (Miami/Caribbean neutral), not Spain Spanish.
- Have a Spanish-speaking person review before launch. If none available: pass through Claude with "Review this Spanish copy — is it natural for a Miami Spanish-speaker? Flag anything that sounds translated." Then fix flagged items manually.

### Tech setup
- Repo: new GitHub repo under `Eveliox/[client-slug]`
- Framework: React + Vite + Tailwind (Azul's standard stack) OR Framer for faster iteration
- Deploy: Vercel, free tier
- Domain: don't connect yet — stays on Vercel preview URL until the client approves
- Chat widget: Crisp free tier (install only if client agreed)
- Analytics: Plausible or GA4, basic page views only

---

## Day 6-8 — Client review

Send the Vercel preview URL by Day 6. Set up a 30-minute review call.

### Review call agenda
1. Walk through every section top to bottom. Click every link.
2. Capture feedback live — don't rely on them sending it later
3. Flag "I'll think about it" items with a deadline
4. Agree on round-2 scope. **Max 2 revision rounds included.** Beyond that = scope creep, bill extra.

### Feedback categories to accept vs push back on
- **Accept:** copy tweaks, photo swaps, color adjustments, CTA wording, section reorder
- **Push back:** redesigning sections already approved in template, adding sections not in agreement, custom animations, custom integrations beyond booking + chat
- Script for pushback: *"That's a great idea for v2. For launch, let's go with [current] so we hit the [LAUNCH DATE]. We can revisit in month 2."*

---

## Day 9-11 — Revisions + QA

### QA checklist (every site)
- [ ] Mobile (iPhone + Android width tested in real device, not just DevTools)
- [ ] Tablet width
- [ ] Desktop width
- [ ] Click every nav link + CTA
- [ ] Submit the contact form → confirm it reaches the client's email AND your monitoring inbox
- [ ] Click phone number on mobile → opens dialer
- [ ] Click email link → opens mail client
- [ ] Service area map loads
- [ ] All images have alt text (SEO + accessibility)
- [ ] No lorem ipsum anywhere
- [ ] No broken images
- [ ] No console errors (open DevTools, check network + console)
- [ ] Lighthouse scores: Performance 90+, Accessibility 95+, SEO 100
- [ ] Both languages render if bilingual (click toggle, check every page)
- [ ] Favicon + browser title + meta description set
- [ ] Open Graph image set (for when they share on Facebook/WhatsApp)
- [ ] Schema.org LocalBusiness markup present (verify at https://search.google.com/test/rich-results)

### Pre-launch client approval
```
Subject: Ready to launch [BUSINESS] — need your final OK

Hi [NAME],

The site is ready. Preview: [URL]

Please click through everything one more time and reply with either:
- "Launch it" — I'll point your domain to the new site today
- A list of final tweaks

Reminder: your current site will redirect to this new one once your domain switches over. Takes about 1-24 hours for the DNS change to propagate everywhere.

— Evelio
```

---

## Day 12-14 — Launch

### DNS cutover
1. Get domain registrar login OR ask client to add you as collaborator
2. Add the domain to the Vercel project
3. Update DNS at registrar: point `@` and `www` to Vercel's values (follow Vercel's modal)
4. Wait for Vercel's green checkmark on both records (usually 15 min, sometimes hours)
5. Confirm HTTPS cert issued automatically
6. Visit the live domain in incognito → confirm new site loads
7. Set up www → root redirect (or vice versa) in Vercel's domain settings
8. Submit the sitemap to Google Search Console: `https://domain.com/sitemap.xml`
9. Verify Google Business Profile website URL points to the new site (update if it points to the old one)

### Launch-day email to client
```
Subject: You're live.

Hi [NAME],

[BUSINESS] is live at [DOMAIN].

If anyone sees the old site in the next day or two, their browser is still remembering the old address. By tomorrow it's gone for everyone.

The $120/month covers:
- Hosting + SSL + uptime monitoring
- Up to 2 small edits per month (change phone number, add a service, swap a photo)
- Monthly uptime report

Bigger changes (new sections, redesigns, new pages) — happy to quote.

Review Booster is sending to real customers starting [DATE] (separate email coming).

Thanks for trusting us with this.

— Evelio
```

---

## First 30 days — monitor

**Day 1:**
- Set up uptime monitor (UptimeRobot free tier) — alerts you by email + SMS if site goes down
- Set up Google Search Console → verify ownership → submit sitemap
- Set up Google Analytics or Plausible → confirm data flowing

**Week 1:**
- Daily: check uptime, check contact form submissions arriving
- If any form submissions came in, forward to client with context so they feel the ROI immediately: *"Just got your first lead from the new site. Here's their info."*

**Week 2-4:**
- Weekly: check analytics (sessions, top pages, bounce rate)
- Check Search Console for indexing (should see pages appearing in week 2)
- Note any 404s in Search Console → add redirects

**End of month 1 email:**
```
Subject: [BUSINESS] — Website month 1

Hi [NAME],

30 days in. Numbers:
- Visitors: [N]
- Contact form submissions: [N]
- Phone clicks (mobile): [N]
- Google indexing status: [N pages indexed]

Top pages: [list top 3]

[Any small issue to flag, e.g., "Noticed the gallery is slower on mobile — I'll optimize those images this week."]

— Evelio
```

---

## Monthly ongoing (~1-2 hr/client)

- Uptime monitor stays on. Investigate any downtime same day.
- 2 small edits included each month. Use a simple form or email intake.
- Monthly analytics summary (short — 4-5 lines)
- Keep dependencies updated (quarterly, not monthly)
- Backup: Vercel's Git history IS your backup. Nothing extra needed.

### Edit requests scope
**Included:**
- Change phone number, email, address, hours
- Swap a photo
- Add or remove a service from the services grid
- Change a testimonial
- Update copy on an existing section (under 100 words)

**Not included (bill separately):**
- New page
- New section
- Design changes
- Form integration beyond contact form
- Blog setup
- Multi-location setup
- E-commerce
- Membership / gated content

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Domain won't propagate | DNS cached, or wrong record type | Clear local DNS cache. Verify records in registrar match Vercel's. Allow 24h before escalating. |
| Site slow on mobile | Images not optimized | Use `<img srcset>` with Vercel Image Optimization. Convert hero + above-fold to WebP. |
| Form submissions not arriving | Wrong email in form config, or landing in client's spam | Send a test, check client's spam folder, add `noreply@azulwebdev.com` to their contacts, set SPF/DKIM on their domain. |
| Client wants constant edits | Scope creep | Point to the agreement. 2 edits/month included. Offer a prepaid edit block ($200/5 edits). |
| Client wants to leave to another agency | Depends on relationship | **They own the code.** Export the repo as a zip, hand over domain. Keep the Vercel project up for 30 days as a courtesy. Offer to help with the migration. |

---

## Offboarding (if client cancels)

30 days notice.
1. Day 1 of notice: ask what they want. Transfer the site to their Vercel? Export a static zip? Keep it running at $120/mo?
2. If they're moving to a new vendor: zip the repo, transfer domain back to them, hand over Google Search Console and Analytics ownership.
3. On final day: remove from your monitoring, cancel the Vercel project (or transfer to them), unlink Stripe recurring charge.
4. Keep a copy of the final build in a `_archive/` folder on your side for 6 months in case they come back.
