# Agent Spec: [Agent name] for [Business name]

The one-page plan for one agent. Fill it in from the job posting and the discovery call, send it to the owner, and build only after they approve it. Anything not in here is a change request.

- **Client:** [Business name] · [Trade] · [Owner name, cell]
- **Agent:** [e.g. Bilingual Receptionist]
- **Job posting received:** [date] · source: [file / text / link]
- **Discovery call:** [date]
- **Spec approved by owner:** [date]
- **Target go-live:** [date]

## 1. The job, in one sentence

[e.g. "Answer every call and text we miss, get the customer's details, and book a visit or get them to the owner."]

## 2. Tasks

From the job posting, sorted. Automate now = in this build.

| # | Task (from the posting) | What starts it | What "done" looks like | Tools it reads / changes | Decision |
|---|---|---|---|---|---|
| 1 | | | | | Automate now / Later / Never |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

**Never automate (stays with a person):** [e.g. quoting jobs, diagnosing problems, complaints, refunds]

## 3. Tools and access

| Tool | What the agent does there | Access method | Who set it up | Done |
|---|---|---|---|---|
| [Jobber / Housecall Pro / QuickBooks] | | User invite / API key | | ☐ |
| [Calendar] | | | | ☐ |
| Twilio number (texts / calls) | | Azul account, per-client number | | ☐ |
| Make.com scenario / Vercel function | | Azul account | | ☐ |
| Supabase log table | | Azul account | | ☐ |

- [ ] Texting registration (A2P 10DLC) submitted on [date], approved on [date]
- [ ] All credentials stored in the password manager, none in email or texts

## 4. Guardrails

**It must never:**
- Quote prices or discounts
- Promise arrival times or dates without [approval / calendar confirmation]
- Give diagnoses, legal, insurance or medical advice
- [Client-specific rule]

**It hands off to a person when:**

| Trigger | Who | How | How fast |
|---|---|---|---|
| Emergency (leak, flooding, gas smell, no AC with vulnerable people at home) | [Owner] | Live transfer / text | Immediately |
| Customer is upset or mentions a complaint | | | |
| Question about price, scope or timing | | | |
| Anything the business facts don't cover | | | |

## 5. Languages and voice

- Languages: English and Spanish (answers in the customer's language)
- Spanish with customers: usted / tú [owner's preference]
- Tone: [e.g. warm, short, local, never pushy]
- How it introduces itself: [e.g. "Aspire Roofing's virtual assistant"]

## 6. Autonomy level at launch

- [ ] Level 1: drafts only, a person approves each action
- [ ] Level 2: acts on low-risk tasks on its own and sends summaries
- [ ] Level 3: runs its full lane on its own

What moves it up a level: [e.g. "two weeks with no must-not failures and owner OK"]

## 7. How we'll measure it

| Metric | Before (baseline) | Target after 60 days |
|---|---|---|
| [e.g. after-hours calls answered] | | |
| [e.g. quotes that got a reply] | | |
| [e.g. jobs booked by the agent] | | |

## 8. Kill switch

How to turn this agent off in under 2 minutes: [e.g. dial ##61# on the owner's phone; turn off the "Estimate Follow-Up" scenario in Make.com]

## 9. Price

- Setup: $997 · Monthly: $497 · Usage tier: [none / details]
- Out of scope (quoted separately): [list]
