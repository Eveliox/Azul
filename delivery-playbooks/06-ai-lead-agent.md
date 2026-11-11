# AI Lead Agent — client delivery runbook

Target: live within **10-14 days** (voice tuning + form integration + compliance setup).
Service price: setup + monthly, quoted after discovery call. **Current bundle offer:** AI Lead Agent + Website Build at $3,500 one-time (only 5 spots).

**PILOT status.** HVAC spots open, Roofing is next. Not generally available. Do NOT sell to other trades without first adapting the question tree and the compliance review.

**Not to be confused with AI Answering Service.** This one is **outbound** — AI calls new form leads back within ~1 minute, qualifies them, books them. AI Answering is inbound (answers incoming calls). A client can have both.

---

## Day 0 — Intake

### Collect from the client
- Legal business name + DBA
- Trade (today: HVAC or Roofing only — see pilot status in [src/data/leadAgent.js](../src/data/leadAgent.js))
- Business phone number (what the AI's caller ID shows)
- Service area (zip codes + cities — the AI uses this to qualify)
- Operating hours (confirms when the AI can book, not when it can call — calling is always 8am-8pm local)
- Average service appointment duration (for calendar blocks)
- Google Calendar access (pilot calendar integration — other tools on request)
- Where new leads currently come from: website form, Facebook lead ad, Google Local Services Ads, Angi, Thumbtack, phone call-in, walk-in
- Owner's cell for booking summaries + escalation
- Approved price answers (if any) — what the AI *can* say about pricing; everything else is a human handoff
- Trade-specific question tweaks (per leadAgent.js the HVAC default is: repair vs new vs tune-up, is cooling at all, vulnerable person at home, address + area, timing)
- Any absolute no-go rules

### Access requests
1. **Website form submissions** — need webhook access OR Zapier/Make/n8n connection to pull new leads into Vapi within seconds
2. **Google Calendar** — add agency account as writer OR use a shared "Appointments" calendar
3. **Facebook Lead Ads** (if used) — add you as Advertiser or Editor on their Business Manager so you can hook leadgen webhooks
4. **CRM** (Jobber/Housecall Pro/ServiceTitan) if lead needs to land there — API key or integration token
5. **Phone number** for outbound caller ID — either their current business line (via Twilio verify) or a new Twilio local number showing their business name

### Expectations setting (critical — same as AI Answering, extra sharp here)
Say this out loud on the kickoff call:

> "This agent calls your new leads within about a minute of them filling the form. It identifies as AI, tells them the call is recorded, asks the questions you'd ask, and books them on your calendar. For emergencies, upset callers, pricing beyond what we approved, or anyone who asks for a human — it hands off to you. In the pilot we review every call for the first 2 weeks and tune the agent. It will mess up early. By week 3 it's clean. Compliance rules: 8am-8pm local time only, max 3 attempts per day, STOP ends everything forever."

Get this agreement in writing. Pilots that fail do so because owners expected autonomous perfection on day 1.

### Compliance pre-check (do before quoting)
AI outbound to a US number is governed by **TCPA + FCC AI-call rules + state consumer-protection laws**. The non-negotiables, baked into leadAgent.js:
- Only calls people who **explicitly opted in** on the form (checkbox with specific language)
- Identifies as AI at start of call
- Discloses the call is recorded
- 8am-8pm local time (lead's time zone, not yours)
- Max 3 calls/day per lead
- STOP (text or verbal) = never contact again, calls AND texts
- Anyone who asks for a human gets a human

If the client's form doesn't have an AI-callback consent checkbox, you add one on Day 1. Non-negotiable. See the Opt-in copy template below.

---

## Day 1-3 — Infrastructure setup

### Opt-in capture (first thing)
Add this checkbox to the client's lead form (website + any ad landing pages). Required, cannot be pre-checked:

**English:**
```
☐ Yes, [BUSINESS] (or an AI assistant on our behalf) may contact me by phone, text,
  and email about this request. I understand calls may be recorded and that I can
  reply STOP at any time to end contact. Message and data rates may apply.
```

**Spanish:**
```
☐ Sí, [BUSINESS] (o un asistente de AI en nuestro nombre) puede contactarme por
  teléfono, texto y correo electrónico sobre esta solicitud. Entiendo que las
  llamadas pueden grabarse y que puedo responder STOP en cualquier momento para
  terminar el contacto. Pueden aplicar tarifas de mensajes y datos.
```

Store the opt-in: timestamp, IP, exact consent text version, lead's inputs. In Supabase or whatever stores form submissions. **If this record isn't present and dated BEFORE the AI call, the AI does not call.** Hard rule.

### Form → Vapi webhook pipeline
Choose one glue layer:
- **Make.com (easiest)** — form submission → Make scenario → Vapi API call to initiate outbound → log to Supabase/sheet
- **Vapi native webhook** — point form directly to a Vapi outbound-trigger endpoint if the form supports webhooks
- **Zapier** — same as Make, slightly worse pricing at volume

Latency target: form submit → first call attempt within **90 seconds** during calling hours. If outside calling hours (before 8am, after 8pm, lead's time zone), queue for next window.

### Vapi outbound agent config
Base prompt structure (adapt per trade from leadAgent.js):

```
You are the virtual AI assistant for [BUSINESS], a [HVAC/roofing/etc.] contractor serving [AREAS].
You are calling someone who just submitted a request on our website or ad.

Opening (English): "Hi [FIRST_NAME], I'm the virtual AI assistant for [BUSINESS]. You asked
us to contact you through our form. This call is recorded. Is now a good time?"
Opening (Spanish): "Hola [FIRST_NAME], soy el asistente virtual de AI de [BUSINESS].
Usted pidió que lo contactáramos en nuestro formulario. Esta llamada se graba.
¿Puede hablar ahora?"

If YES or they talk, proceed with trade questions:

[FOR HVAC — pulled from leadAgent.js trade entry]
1. Is this a repair, a new system, or a tune-up?
2. Is the AC fully out or just cooling poorly?
3. Is an elderly person, a baby, or anyone with health needs at home?
4. Confirm address: "[ADDRESS from form]" — is that correct?
5. Confirm it's in the service area (check against zips)
6. Offer a booking time: "Would [TIME WINDOW] work for a service visit?"

If YES to booking:
- Book on Google Calendar
- Confirm: "You're booked for [DATE/TIME]. I'll text and email your confirmation
  and send the owner a summary."
- End call.

HANDOFF to human (text owner immediately with lead info + reason) if:
- Gas smell → tell caller to leave the house and call gas company or 911 FIRST, then handoff
- Caller is upset or distressed
- Caller asks a price question outside approved answers:
  [LIST OF APPROVED PRICE ANSWERS, if any — otherwise ALL pricing = handoff]
- Caller asks for a human / "Can I talk to someone?"
- Caller mentions an emergency
- Caller is a vulnerable adult with no cooling (comfort + liability — human calls personally)
- Address is outside service area
- Lead can't confirm their own info (potential wrong number)

NEVER do these:
- Quote a specific price (unless on approved list)
- Promise same-day service
- Diagnose
- Call outside 8am-8pm lead local time
- Attempt a 4th call in one day
- Call anyone who said STOP, "don't call me", "no me llame más", or similar
- Pretend to be human if asked
```

### Retry logic (hard-coded, not AI-decided)
Per leadAgent.js retry rules:
- **Attempt 1:** within 90 seconds of form submission (if in call window)
- **If no answer:** leave short voicemail + send text with booking link
- **Attempt 2:** 2-4 hours later
- **Attempt 3:** next day during call window
- **Hard stop:** 3 attempts total per day MAX, 8am-8pm lead local only
- **Full stop triggers (never call again):** booked, replied, texted STOP, said "no" verbally, told AI not to call

Voicemail template:
```
Hi [FIRST_NAME], this is the AI assistant for [BUSINESS] calling about your
[service] request. I'll text you a link to book a time. If you'd like to speak
to someone directly, call us at [NUMBER]. Thanks.
```

Follow-up text:
```
Hi [FIRST_NAME] — [BUSINESS] here. Missed you by phone. Book a time here:
[BOOKING_LINK]. Reply STOP to opt out.
```

### Calendar booking
During pilot: Google Calendar only.
- Create a dedicated "Appointments" calendar in the client's workspace
- Share it with the agency account (write access)
- Agent books: lead name, lead phone, address, service summary, time window
- Buffer: 30 min between appointments (configurable per trade)

### Owner notification pipeline
Every call triggers an SMS + email to the owner within 30 seconds of call end:
- Lead name + phone
- Service requested
- Address
- Outcome: booked / voicemail left / handoff / no answer / STOP
- If handoff: WHY, with urgency flag
- Link to call recording + transcript

Make sure the owner has a phone-notification setup so handoffs don't sit in email while a hot lead cools down.

---

## Day 4-7 — Voice tuning + testing

### Internal testing (minimum 20 test calls before go-live)
Call with these scenarios. Use real phone numbers you control.

Trade-flow scenarios:
1. Standard HVAC repair — English, cooperative lead
2. Standard HVAC repair — Spanish, cooperative lead
3. New HVAC install — English
4. HVAC tune-up — Spanish
5. Vulnerable person at home + no cooling (should handoff immediately)
6. Gas smell mentioned (safety handoff with gas-company/911 instruction)
7. Address outside service area
8. Address inside area, lead can't confirm their own name
9. Lead picks up but says "wrong time, call back later"
10. Lead picks up but is clearly in a car / can barely hear
11. Lead picks up but asks: "Am I talking to a robot?" — must say yes
12. Lead says STOP mid-call
13. Lead asks for a price → should handoff (unless on approved list)
14. Lead asks for a specific technician by name → handoff
15. Voicemail — AI leaves VM + sends follow-up text

Edge cases:
16. Lead doesn't answer any of 3 attempts in a day
17. Lead texts STOP after voicemail — no further contact
18. Form submission at 11pm — queued for 8am next morning
19. Form submission at 7:55am local — attempt at 8:00am
20. Lead is in a different time zone than the business (lead opt-in was from traveling) — call window follows lead local time, confirm Vapi handles this

For each failure, update prompt or add routing rule. Keep a tuning log.

### Spanish voice quality check
- Pilot in Miami means heavy Cuban/Venezuelan/Colombian Spanish
- Record 5 Spanish test calls, listen with a native speaker
- Flag awkward phrasing — "Puede hablar ahora?" good, "¿Es un buen momento?" good, "¿Está disponible para una conversación?" too formal
- Latin American Spanish, informal ustedeo, not Spain Spanish

### Compliance self-audit (before go-live)
- [ ] Opt-in checkbox live on client's form(s), stored with timestamp + IP + consent version
- [ ] AI identifies as AI in first 15 seconds — every call
- [ ] Call recording disclosure in first 15 seconds — every call
- [ ] Call window enforced in Vapi (not just in prompt — hard scheduler block)
- [ ] Retry limiter enforced at platform level, not relying on AI
- [ ] STOP keyword triggers DNC flag in a database the AI reads before every call
- [ ] DNC flag is permanent (never auto-expires)
- [ ] All call recordings stored at least 90 days
- [ ] Written notes on who in your org can access recordings (not everyone)

### Review call with owner (90 min)
- Play 5-10 test calls with owner
- Owner approves agent voice, phrasing, question flow
- Confirms the NEVER-DO list in writing
- Confirms the approved price answers (if any)
- Confirms escalation path: who gets the "handoff" notification, how fast they commit to calling back (default: within 30 min during business hours)

---

## Day 8-10 — Soft launch

### Live but limited
- Route only **1 form source** (e.g., just the website, not Facebook ads yet) to the agent
- Cap at 5 outbound calls/day for the first 3 days — gives you time to listen to every call
- Owner stays in the loop in real time via SMS summaries

### Daily check-in with owner (first 7 days)
Short message end of each day:
```
Day [N] summary for [BUSINESS]:
- Leads called: [N]
- Booked: [N]
- Handoffs to you: [N] (reasons: [...])
- Voicemails left: [N]
- One thing I'm tuning tomorrow: [specific]
```

---

## Day 11-14 — Full go-live

### Pre-go-live checklist
- [ ] Opt-in capture verified live and storing properly
- [ ] All form sources connected to pipeline (website, ads, landing pages)
- [ ] Retry logic hard-enforced at platform level
- [ ] DNC database tested — add a number, confirm the agent will not call it
- [ ] Owner notification pipeline tested end-to-end
- [ ] Fallback: what happens if Vapi is down? (default: new form submission → owner gets SMS immediately with lead info, calls them manually)
- [ ] Call recording + storage policy in writing
- [ ] Owner has a 15-minute kill switch (text you, you flip it off)
- [ ] 20+ test calls passed
- [ ] A2P 10DLC approved for any Twilio numbers sending texts

### Go-live email
```
Subject: [BUSINESS] — AI Lead Agent is live

Hi [NAME],

Your AI Lead Agent is live. Here's what happens now:

📞 How it works:
- Every new lead on your form gets a bilingual call within about a minute (during 8am-8pm local)
- The agent identifies as AI, qualifies the lead, and books them on your calendar
- You get a text + email summary within 30 seconds of every call
- Emergencies, pricing questions, or anyone who asks for a human comes straight to you

🚨 First 2 weeks (pilot mode):
I'm listening to every call. If something sounds off, I tune the agent that day.
Expect occasional hiccups. By week 3 it runs clean.

Kill switch: text me, I shut it off within 15 minutes.

Weekly: short update with numbers.
Monthly: full report + what we're changing.

— Evelio
```

---

## First 30 days — intensive monitoring

**Daily (week 1 + 2):**
- Listen to every call recording
- Tune prompt same day for any failure
- Confirm every booking actually landed on the calendar
- Confirm handoffs reached the owner within SLA
- Spot-check compliance: did AI ID itself? Disclose recording? Honor STOP?

**Daily (week 3 + 4):**
- Spot-check 30-50% of calls
- Flag any pattern (e.g., "Agent is hesitating on tune-up questions — rewriting that branch today")

**End of month 1 report:**
```
Subject: [BUSINESS] — AI Lead Agent Month 1

Hi [NAME],

30 days of pilot. Here's where we are.

📥 Lead flow
- Leads received: [N]
- Avg time from form to first call: [SECONDS]
- Leads reached (answered): [N] ([%])
- Voicemails + follow-up texts sent: [N]

✅ Outcomes
- Appointments booked by AI: [N]  ← revenue number
- Handed off to you (reason breakdown): [N]
- STOP / declined: [N]
- 3-attempt no-answer: [N]

📊 Conversion
- Form → booked: [%]  ← vs. your historical baseline of [%]

⚠️ Still tuning
- [1-2 specific tweaks shipping next week]

🧾 Compliance
- 100% calls IDed as AI + disclosed recording
- Zero calls outside 8am-8pm window
- Zero over-limit retries
- [N] STOPs honored

💰 Variable cost this month: $[N] (Vapi usage + Twilio texts)

— Evelio
```

---

## Monthly ongoing (~2-3 hr/client in pilot, ~1 hr post-pilot)

- Spot-check 10-20% of calls each week
- Monthly report (template above)
- Prompt tuning for new question types
- Watch Vapi + Twilio costs — if client's variable cost crosses $150/mo, surface it, discuss raising the monthly or capping call volume
- Quarterly compliance audit: pull 20 random calls, verify every one met the full checklist (ID, disclosure, window, retry limits, STOP honored)
- Keep the trade question tree current — the HVAC flow in leadAgent.js is the canonical reference; update there when the client wants a change, then regenerate the prompt

---

## Pilot → general availability criteria

Before offering AI Lead Agent as a non-pilot standard service to new trades:
- 3+ clients live for 60+ days each in the pilot trade
- Zero compliance violations in last 90 days per client
- Avg form→booked conversion ≥ 2x the client's pre-AI baseline (that's the ROI case)
- Variable cost per client under $120/mo
- Positive NPS from all 3 clients
- Documented list of 30+ failure modes + fixes
- Written question tree + prompt for the new trade, reviewed with a trade expert
- Written legal/compliance review for the new trade (any trade-specific regulations)

Until all of the above: PILOT only. Status badge on the site stays accurate.

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Lead hangs up during AI intro | Intro too long, sounds robotic | Cut to under 15 seconds. "Hi [NAME], AI assistant for [BUSINESS] about your request. Call is recorded. Good time?" |
| Lead asks "Is this a robot?" | AI dodged | Script: "Yes — I'm an AI assistant for [BUSINESS]. I'm calling to help book your [service]. Would you prefer to talk to a person? I can have [OWNER] call you back." |
| Low booking rate | Agent asking too many questions before offering a time | Front-load the booking offer. If lead confirms service + address, offer a time slot immediately. Save edge-case questions for after the booking commitment. |
| Owner missing handoffs | Notification pipeline failing or being ignored | Verify SMS delivery. Add 2nd notification channel (email + Slack/Discord). Call the owner about the pattern. |
| Lead complains they didn't opt in | Form opt-in UX problem (pre-checked, misleading) | Audit the form. Uncheck by default. Clear language. Re-launch with new consent version. Add every version date to compliance log. |
| STOP keyword not honored | DNC flag written to one database, agent reads from another | Fix: single source of truth. One DNC table. Agent pre-flight check reads it before every outbound. |
| Spanish-speaking lead getting English call | Form didn't capture language preference | Add language field to form. Default: Spanish IF form was submitted in Spanish (track locale). Fallback: AI opens with bilingual greeting ("English or Spanish?") and switches on first word. |
| Calls landing before/after 8-8 window | Vapi scheduler using agency time zone, not lead time zone | Fix: calculate lead time zone from phone area code or zip. Pass to Vapi's scheduler as a per-call parameter. |
| Variable cost spiking | Agent making many retry attempts to bad numbers | Add number validation at form submission (Twilio Lookup). Reject invalid numbers before they enter the queue. |

---

## Offboarding (if client cancels)

30 days notice. Compliance tail is the hardest part.
1. On day 1 of notice: stop queueing new outbound calls (opt-ins from new form submissions). Any in-flight retry sequences finish or expire.
2. Export: call history (CSV), recordings (audio archive), DNC list (CSV — client needs this if they move to a new vendor, so they don't call opted-out people).
3. Export opt-in records with timestamps + consent version — client must retain these for compliance even after cancellation.
4. Transfer the Twilio number if client wants to keep it. Release otherwise.
5. Disconnect form webhooks → form reverts to just storing submissions, client follows up manually.
6. Final report: lifetime stats (leads received, calls made, booked, handed off, STOPs).
7. **Retain call recordings on your side for the full legal retention period** (confirm with client — minimum 90 days, often longer under state law). Don't nuke recordings day 1 of offboarding.
