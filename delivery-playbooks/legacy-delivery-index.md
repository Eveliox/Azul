# Azul — Delivery Playbooks

Per-service runbooks for turning a signed client into a live, running service. Operational, not strategic — the strategy lives in [AZUL_BUSINESS_PLAN.md](../AZUL_BUSINESS_PLAN.md) §3.

Sales side lives in [../sales-playbooks/](../sales-playbooks/). These runbooks start the moment the agreement is signed.

## Services

| # | Service | Price | Target go-live | Difficulty |
|---|---|---|---|---|
| 01 | [Review Booster](01-review-booster.md) | $79/mo | 3 business days | Easy |
| 02 | [Website Build](02-website-build.md) | $2,500 + $120/mo | 14 calendar days | Medium |
| 03 | [Found Everywhere](03-found-everywhere.md) | $599/mo | 7 days baseline, 30 days first full month | Medium |
| 04 | [Social Media AI](04-social-media-ai.md) | $149/mo | 7 days | Easy |
| 05 | [AI Answering Service](05-ai-answering-service.md) | $349/mo | 10-14 days | Hard (beta only) |
| 06 | [AI Lead Agent](06-ai-lead-agent.md) | Setup + monthly, quoted; $3,500 bundle w/ Website | 10-14 days | Hard (pilot only) |

**AI Answering vs. AI Lead Agent:** easy to confuse.
- **AI Answering Service (#05)** — *inbound.* Picks up incoming calls when the owner can't.
- **AI Lead Agent (#06)** — *outbound.* Calls new form leads back within ~1 min, qualifies them, books them. Current limited-offer bundle: AI Lead Agent + Website Build at $3,500 one-time.

## How to use these

Each runbook follows the same shape:

1. **Day 0 — Intake:** what to collect from the client before any technical work
2. **Day 1-N — Setup:** step-by-step build in order
3. **Templates:** copy-paste emails for welcome, kickoff, go-live, monthly reports
4. **Go-live checklist:** what has to be true before you tell the client "we're live"
5. **First 30 days — monitoring:** daily/weekly cadence until the client is in a comfortable rhythm
6. **Monthly ongoing:** recurring deliverables + ops
7. **Common failure modes & fixes:** real problems and how to handle them
8. **Offboarding:** if the client cancels, what to hand back

**Workflow when a client signs a bundle (Growth Suite = Website + Review Booster + Social + Found Everywhere + AI Answering):**
Run the runbooks in parallel per the "target go-live" column — Review Booster and Social Media AI can be live by day 7, Found Everywhere baseline done by day 7, Website launching day 14, AI Answering by day 14. Don't start AI Answering before the simpler services are stable; it eats time disproportionately.

## Shared operational conventions

- **Welcome email goes within 1 hour of signed agreement**, always. Momentum.
- **Intake forms before kickoff call.** The call is for alignment, not data collection.
- **Templates in `[BRACKETS]`** are the fields to swap per client. Keep a Notion doc of filled-in versions per client.
- **One WhatsApp group per client** for photo intake if they're on Found Everywhere or Social Media AI (same group serves both)
- **Access requests one at a time.** Numbered checklist. Owners get overwhelmed when you ask for 7 things at once.
- **No passwords in email, ever.** Delegated access only (GBP managers, Facebook editors, Stripe collaborators, DNS records).
- **Monthly reports stay under 10 lines.** Owners don't read reports.
- **Document every custom thing per client in a single Notion page per client** — their quirks, their language preferences, their off-limits list.

## When these runbooks don't match reality

If a step is wrong, outdated, or missing — fix it here, not in a one-off note. These are living documents. The signal that they're stale: when you catch yourself doing a step from memory because the written version doesn't match what you actually do.

Last updated: 2026-10-25.
