# Social Media AI — client delivery runbook

Target: first posts scheduled by **day 7**.
Service price: $149/mo. See AZUL_BUSINESS_PLAN.md §3.3.

**Reuse the WhatsApp photo intake pipeline from Found Everywhere.** If the client is on both services, run them as one operation — same photos, 3 outputs (GBP + FB + IG).

---

## Day 0 — Intake

### Collect from the client
- Legal business name + DBA
- Facebook Page URL (or confirmation that none exists — you'll create one)
- Instagram handle (or confirmation that none exists)
- Logo + brand colors
- Services + service area
- 10-20 real job photos (from existing archive — they'll keep sending more via WhatsApp)
- 3-5 customer wins / stories they're proud of
- Preferred posting language: EN only, ES only, or both

### Access requests
1. **Facebook Page** — add you as **Editor** or **Admin** via Meta Business Suite (Business Settings → Pages → Add People)
2. **Instagram** — connect their IG to the same Meta Business account, add you with content permissions
3. If no FB Page or IG: create them in client's name (Business Page, not personal profile)

**Important:** always connect FB + IG through Meta Business Suite (business.facebook.com), never through the mobile app. The desktop flow is the only one that gives you proper multi-user permissions.

---

## Day 1 — Setup

### Meta Business Suite config
1. Confirm you have Editor/Admin access on both FB + IG
2. In Meta Business Suite → **Planner**, confirm you can schedule posts
3. Set up Instagram Shopping if the client sells products (rare for home services — skip usually)
4. Confirm both accounts are Business accounts (not Personal)
5. Add any team members on client side who should see draft previews

### WhatsApp intake group
If the client is already on Found Everywhere → use the same WhatsApp group.
If this is Social Media AI only → create a new group:

```
📸 Content intake — [BUSINESS]

Each week drop in:
- 2-4 photos (jobs, team, before/after)
- 1-2 sentences of context ("Finished a repipe in Brickell today")

We turn each one into Facebook + Instagram posts in English and Spanish.

Target: 3-4 posts per week on each platform.
```

### Caption prompt library (one-time setup per client)
Create a Claude/ChatGPT prompt tuned to this client's voice. Template:

```
You write Facebook and Instagram captions for [BUSINESS], a [service type] serving [area].

Voice:
- Friendly, local, confident
- Never corporate or stock-sounding
- Mention the neighborhood when possible
- Short (under 100 words for FB, under 150 for IG)
- First sentence hooks on the real moment (not "We provide X services")

Always generate TWO versions: English and Spanish.
The Spanish is Miami/Caribbean Spanish — natural, not translated-sounding.

Each caption ends with:
- 2-4 relevant local hashtags (e.g., #Miami, #SouthFlorida, #Doral, #[service])
- 1 call-to-action: "Call us," "DM us," or "Message us for a free estimate"

Input will be: photos + 1-2 sentences of job context.
Output: EN caption, ES caption, 3-5 hashtag options, suggested CTA.
```

Save the prompt in a shared doc so you (or a VA later) can reuse it.

---

## Day 2-5 — First week of content

### Content rhythm — 3-4 posts/week per platform
Mix across:
- **Job photos** (most frequent — 60% of posts): the actual work
- **Team / behind the scenes** (20%): owner on a job, crew photo, truck
- **Educational tips** (10%): "3 signs your [thing] needs replacing", bilingual
- **Reviews / testimonials** (10%): quote card graphic with real customer words

Avoid: stock photos, generic motivational quotes, memes unless clearly on-brand.

### Weekly schedule template
- **Monday 9am** — job photo post (highest engagement weekday)
- **Wednesday 12pm** — tip/educational post
- **Friday 3pm** — testimonial or team-moment post
- **Saturday 10am** — second job photo (weekend browsers)

Schedule all posts for the week on Sunday night or Monday morning. Use Meta Business Suite's Planner — free, native to the platform, no extra tool.

### Reels / short video (bonus)
If the WhatsApp group includes any 15-30 second video clips, cut 1 Reel per week per platform. Simple edit:
- Vertical crop (9:16)
- Add text overlay with EN caption
- 15-30 sec max
- Same hashtags + CTA as a photo post

Reels get 3-5x the reach of static posts in 2026 — prioritize when you have footage.

---

## Day 6 — Client preview + approval

Before anything publishes, send the client a preview of week 1's posts:
- Screenshot of each scheduled post in Meta Planner
- One short email

```
Subject: [BUSINESS] — week 1 posts, your eyes on them

Hi [NAME],

Here are the 4 posts scheduled for this week. Click through, let me know by [TIME TOMORROW] if anything needs changing.

[screenshot grid]

After this week, I'll send a 1-paragraph monthly summary and only ask you to review when there's something unusual. You stay out of it, we keep posting.

— Evelio
```

Agree on the approval cadence from here:
- **Default:** weekly post without pre-approval, monthly summary
- **If client wants pre-approval each week:** add a Sunday review step. Build it into the pricing after month 2 if it's eating too much time.

---

## First 30 days — monitor

**Weekly:**
- Check post performance in Meta Insights (reach, likes, comments, shares, saves)
- Flag any post that overperformed (3x average) → make more like it next week
- Flag any post that bombed → note why (bad time? boring copy? pixelated photo?)
- Respond to any comments or DMs on the posts (or forward to client if they want to respond)

**Monthly report:**
```
Subject: [BUSINESS] — Social Media Month [N]

Hi [NAME],

📊 Last 30 days (Facebook + Instagram)
- Posts published: [N]
- Total reach: [N]
- Engagement (likes + comments + shares): [N]
- New followers: [N]
- Top post: [1-line description + reach]

What's working:
- [1-2 observations]

What I'd like more of from you:
- [ask for specific photos / stories, e.g., "Any before/after shots from the Hialeah job?"]

— Evelio
```

---

## Monthly ongoing (~1-2 hr/client once rhythm is set)

- 12-16 posts scheduled per month (per platform)
- Weekly monitoring of insights
- Monthly report
- Occasional response to comments/DMs (or route to client)
- Quarterly: review the strategy — are certain post types outperforming? Shift the mix.

---

## Reuse with Found Everywhere

If the client is on both services, each job photo produces:

| Output | Platform | Format | Who ships it |
|---|---|---|---|
| GBP Post | Google Business Profile | 100 words EN+ES | Found Everywhere pipeline |
| Facebook Post | FB Page | 100 words EN+ES | Social Media AI pipeline |
| Instagram Post | IG | 150 words EN+ES, carousel if 2+ photos | Social Media AI pipeline |
| Instagram Reel | IG | 15-30 sec vertical video | Social Media AI pipeline (if video) |
| YouTube Short | YT | 60-90 sec vertical video | Found Everywhere pipeline |
| Reddit answer | r/relevant | long-form text | Found Everywhere pipeline |

**One photo = 3-6 pieces of content.** This is why bundling the two services is high-margin.

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Low engagement on everything | Posts look like ads, not like a neighbor | Rewrite in first person. Use the owner's actual words from the WhatsApp intake. Fewer hashtags. More photos of people, not just the work. |
| Client complains "it doesn't sound like us" | Prompt wasn't tuned enough | Have the client send 5 posts they wrote themselves (if any exist). Feed those to Claude as voice samples. Regenerate. |
| Spanish captions sound translated | Prompt isn't calling for Miami Spanish specifically | Rewrite prompt: "Spanish for a Miami Cuban/Venezuelan/Colombian audience — colloquial, uses expressions like 'ya tú sabes', 'de pinga', etc. Not formal, not from Spain." Human-review for a few weeks. |
| Instagram follower count flat | Not enough Reels | Add 1-2 Reels per week minimum. Static posts don't grow follower counts in 2026. |
| Client sends 0 photos week 2 onwards | Owner is on jobs, forgets | Call the owner once. Ask what's easier — WhatsApp photos, voice notes, you drop by on a job site 1x/month to shoot everything? Adapt to them. |
| Facebook flags posts as spam | Too many links in captions | Remove links from captions. Put links in the first comment or in the "Learn more" button. Never link out from an IG caption (it doesn't click anyway). |

---

## Offboarding (if client cancels)

30 days notice.
1. Export insights from Meta Business Suite (last 90 days)
2. Transfer page admin ownership fully back to client (remove yourself)
3. Hand off the WhatsApp intake group OR unarchive and leave
4. Final monthly report with full history of posts + metrics
5. Keep copies of all post graphics in `_archive/clients/[name]/social/` for 12 months
