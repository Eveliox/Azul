# Local Proof SEO — manual delivery kit

First client: Hello You Wellness Center. Nothing has been posted, connected to Google, or purchased by creating this kit.

## Start here

1. Send the owner the access + information request in `templates/onboarding.md`.
2. Copy `templates/` to `clients/helloyou/` and work from those copies. The `clients/` folder is gitignored: do not commit client photos, private approvals, contact details, credentials, or reports.
3. Fill out `business-profile.md` with confirmed facts. Earlier examples of Coral Gables, HydraFacial, Botox, hours, and treatment benefits were NOT verified business facts.
4. Obtain Google Business Profile **manager** access using your own account. The owner retains ownership. Do not request their password.
5. Check the profile and run a baseline ranking scan BEFORE publishing the first batch.
6. Receive two approved non-patient photos and a short factual description. Use `content-prompt.md` in Claude's web app to generate EN/ES drafts together. No API integration required for the first client.
7. Have the designated client approver review the drafts. Publish approved copy manually and log the result in `content-calendar.csv`.

**First session goal:** verified business facts + access request sent + two draft posts awaiting approval. It is not necessary to buy all the tools first.

## Suggested $299/month scope — agree this with the client first

| Deliverable | Limit / definition |
|---|---|
| Initial local check | Profile accuracy, categories, hours, services, website/booking links, photos, and baseline visibility. Recommendations, not a ranking promise. |
| Google Business Profile posts | 8 published posts per month, usually 2/week. This is 8 total, NOT 8 per language. Generate EN/ES drafts and agree which versions to publish. A fifth week does not automatically add posts. |
| Service-area/location content | 1 useful update to an existing relevant website page per month, up to 400 words, based on genuine services and geography. A website-only change is separate from a GBP post. |
| Bilingual editing | Human-reviewed EN/ES copy; 1 consolidated revision round per monthly batch. |
| Reporting | 1 monthly report, using 3 agreed keywords and a consistent local scan grid; actual counts and limitations disclosed. |

Not included: paid ads, social media management, unlimited website pages, link-building campaigns, medical copywriting advice, or guaranteed rankings/leads. If the client lacks a suitable website page, agree on an equivalent update before billing for it.

Avoid near-identical pages for every city and fake location claims. A service-area setting does not create a physical branch or guarantee visibility there.

## Weekly operating rhythm

- **Monday:** ask for this week's assets, check usage permission, create the draft batch.
- **Tuesday:** proofread facts + EN/ES; obtain approval; publish first approved post.
- **Thursday:** publish second approved post; check both display correctly; record URLs/screenshots.
- **Friday:** record any issues and send a brief delivery update.

If assets are missing, use approved evergreen topics (business introduction, confirmed opening hours, booking process) with existing authorized photos. Do not invent customer visits, results, services, or testimonials.

## Google posting checklist

Google's interface changes. While signed into the manager account, find the business on Google Search/Maps and open the profile's Posts / Add update controls.

1. Confirm the correct business and selected post language.
2. Use an accurate, approved update and a relevant authorized image.
3. Use the appropriate CTA button and client-approved destination URL; test the link.
4. Check current GBP content rules, especially restricted healthcare/pharmaceutical topics. Do not assume every medical service promotion is permitted.
5. Publish manually on the agreed day. If scheduling is available in the account, use it; otherwise use a calendar reminder. This kit does not schedule posts automatically.
6. Check publication/moderation status and log the actual result. Submitted does not necessarily mean published.

Natural local relevance is useful; keyword stuffing and posting frequency alone are not a proven ranking strategy. Local results depend on factors including relevance, distance, and prominence.

## Monthly reporting

1. Choose 3 accurate service queries, after confirming what the business offers.
2. Save a baseline scan with the business identity, grid center, radius/spacing, grid size, tool, and date.
3. Repeat the exact same setup monthly. Keep raw exports and record scan-level metrics in `ranking-log.csv`.
4. Use top-3 visibility across grid points and the tool's documented average-rank calculation, not a single claim like “you rank #3 in Miami.” Explain how unranked points are treated.
5. Complete `monthly-report.md` with actual data. If there's no previous comparable scan, say baseline only.
6. Where accessible, include GBP website clicks/call-button interactions with their date range. These are not confirmed calls, bookings, or revenue. Do not attribute all movement to posts.

## Tools and budget

- WhatsApp Business app: manual coordination only. No API needed. Keep patient data and clinical material out of the workflow.
- Claude web app: copy/paste prompts manually; use your existing plan if suitable. API billing is separate and not required.
- GBP manager interface: manual publishing; no unofficial API or password sharing.
- LocalFalcon or an equivalent geo-grid tool: check CURRENT plans and credit costs before purchase. Budget for baseline + monthly scans × keyword count × grid points. The earlier $40/month figure was an unverified estimate, not a quote.

Plan roughly 2–4 hours for first-client setup and 3–5 hours/month initially, including chasing approvals, translations, a website update, and reporting. Track your real time before claiming margins.

## Safety and approval boundaries

HelloYou is described in the project as a wellness/medical-aesthetic business. Start with empty-room, premises, equipment (without patient data), and approved staff photos. Do not collect patient names, treatment histories, patient images, before/after photos, or health information in WhatsApp, this repo, or an ordinary AI prompt.

Patient-related marketing can require specific written authorization and a privacy-compliant workflow; ordinary photo permission is not necessarily sufficient. Keep it out of this MVP. Route clinical claims to the client's qualified reviewer, and check Google's restrictions even after client approval.

Private working folders still need appropriate storage, retention, access controls, and backups. `.gitignore` only prevents routine Git tracking; it is not a privacy or compliance system.
