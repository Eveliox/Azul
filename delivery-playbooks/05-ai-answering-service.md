# AI Answering Service — client delivery runbook

Target: live within **10-14 days** (longer than other services — voice tuning + Twilio porting).
Service price: $349/mo. Variable cost: $30-80/mo in Vapi/Bland usage. See AZUL_BUSINESS_PLAN.md §3.4.

**HARD MODE service.** Only offer to Growth Suite clients. Beta first (3-5 clients) before full rollout. Thinnest-margin service — don't scale this before the others are humming.

**Fallback must be defined upfront:** if AI fails on any call, where does it go? Options: real human answering service (Ruby Receptionists, ~$310/mo), owner's cell, missed-call text-back only. Pick one with the client before day 1.

---

## Day 0 — Intake

### Collect from the client
- Legal business name + DBA
- Current business phone number (the one on their website, trucks, GBP)
- Where does that number currently route? (Cell phone? VOIP? Landline?)
- Who currently answers? What hours?
- Owner's cell (for escalation and SMS summaries)
- Preferred language model: EN only, ES only, or both (default: both)
- Hours of operation (for the "we're closed, taking a message" variant)
- Services + rough pricing (for the FAQ script)
- Service area (for qualifying callers)
- 10-20 common questions customers ask + the honest answers
- Any absolute no-go rules: "Never quote a price," "Never promise same-day service," etc.
- Decision: **port current number** (slow but keeps continuity) OR **buy new Twilio number** (fast but requires updating marketing)

### Access requests
1. If porting: get Letter of Authorization (LOA) signed. Twilio provides the form. Current carrier info needed: account number, PIN, authorized account holder name
2. Owner's cell for test calls + call summaries (confirm in writing: SMS + email, which address?)
3. Any CRM or job scheduling tool the agent should book into (Jobber, Housecall Pro, Google Calendar) — API access or shared account

### Expectations setting (critical)
Say this on the kickoff call, out loud:

> "The AI will answer every call in English or Spanish. It handles the easy stuff — scheduling, basic questions, taking messages. For anything it's not sure about, it takes the person's info and texts you so you can call them back. It will mess up sometimes in the first 2-3 weeks. We review every single call and fix anything that went wrong. By week 4 it's running clean. We need you to listen to the first 10 recorded calls with me so we can tune it to how you'd actually talk."

Document this agreement in writing. Nothing kills this service faster than an owner who expected magic on day 1.

---

## Day 1-3 — Infrastructure setup

### Vapi or Bland decision
- **Vapi** ($0.05/min) — more flexible, better for custom logic, requires more dev time
- **Bland** ($0.09/min) — no-code, faster to launch, less customization

Default to **Vapi** for Growth Suite clients with recurring complexity. Use **Bland** for simpler single-service clients or when speed-to-launch matters more than nuance.

### Twilio phone setup
**Option A: Buy new Twilio number**
1. Twilio console → Phone Numbers → Buy a number → Miami area code (`786` or `305`)
2. Register for A2P 10DLC if the agent sends SMS summaries or confirmations
3. Configure the number to forward incoming calls to Vapi/Bland's webhook

**Option B: Port existing number**
1. Submit port request in Twilio console with signed LOA + utility bill
2. Current carrier has 30 days to approve/deny
3. **During the port window (usually 7-21 days):** DO NOT make changes to the current line. Any change can cancel the port and restart the clock.
4. On port completion day: schedule the Vapi/Bland cutover window with the client (ideally 7-9pm Sunday to minimize disruption)

### Call routing config
Set up this call flow in Twilio/Vapi:

```
Incoming call
  ↓
Ring client's real cell for 3 rings (~15 sec)
  ↓ (if no answer)
AI picks up
  ↓
AI handles call OR escalates
  ↓
End: SMS + email summary to client
  ↓
If AI call fails entirely: route to [fallback — Ruby, voicemail, owner cell again]
```

### Missed-call text-back (always on)
Separate from the AI call flow — any call that goes unanswered for any reason (AI failure, after hours, dropped) triggers:
```
Hi, we saw you called [BUSINESS]. What can we help you with?
```
Reply handling: route to a shared SMS inbox the client can see on their phone.

---

## Day 4-7 — Voice tuning

### Build the agent prompt
Base prompt structure:

```
You are the receptionist for [BUSINESS], a [service type] serving [area].
You answer calls in English and Spanish. If the caller speaks Spanish, continue in Spanish.

Greeting (English): "Thanks for calling [BUSINESS]. Can I help you in English or Español?"
Greeting (Spanish): "Gracias por llamar a [BUSINESS]. ¿Le ayudo en inglés o español?"

Collect every call:
- Caller name
- Callback number (confirm by reading back)
- Service needed (short description in their words)
- Address (if service job) or city (if quote)
- Urgency: emergency / this week / no rush
- Best time for a callback

Can answer directly:
- Business hours: [HOURS]
- Service area: [AREAS]
- General pricing range: [RANGES — only if client approved]
- Does the business do [service]: yes/no from the services list
- How long jobs typically take: [general ranges]

NEVER do these:
- Quote a specific price
- Promise same-day service
- Diagnose a problem over the phone
- Say anything about competitors
- Transfer to a human (there isn't one — take a message)

End of call (English): "Someone from [BUSINESS] will call you back within 30 minutes. Thanks for calling."
End of call (Spanish): "Alguien de [BUSINESS] le devolverá la llamada en los próximos 30 minutos. Gracias por llamar."

If caller is angry or distressed: stay calm, acknowledge, take their info, note urgency as high, end call. Do not try to resolve the complaint.

If caller asks something you can't answer: "That's a great question — let me have the owner call you back with that answer. What's the best number?"
```

### Spanish tuning
- Use Miami/Caribbean Spanish, not formal Spain Spanish
- Natural: "Déjeme tomar sus datos" ✅ / Awkward: "Permítame recoger su información" ❌
- Record 3-5 test calls in Spanish, listen with a native speaker, flag anything that sounds off, fix the prompt
- Test with heavy Cuban, Venezuelan, Colombian accents

### Internal testing (minimum 15 test calls before go-live)
Make calls yourself with these scenarios:
1. Normal English quote request
2. Normal Spanish quote request
3. Emergency ("my pipe just burst")
4. Angry customer ("you were supposed to show up yesterday")
5. Off-topic ("do you also do windows?")
6. Caller doesn't know what service they need ("something is wrong with my AC I don't know")
7. Caller gives a wrong zip code (outside service area)
8. Caller interrupts the greeting
9. Spanglish caller
10. Caller with heavy accent (hard to transcribe)
11. Caller mumbles / low signal quality
12. Caller tries to transfer themselves to a specific person
13. Caller wants to pay a bill (not in services)
14. Caller is a telemarketer
15. Caller is already a customer with a question about an existing job

For each failure, update the prompt or add a routing rule.

---

## Day 8-10 — Client review of test calls

### Call-review session with the owner (90 min)
- Play all 15 test calls together
- Owner flags anything that doesn't sound like how their business would answer
- Rewrite greeting, closers, and any specific phrasing based on their feedback
- Confirm NEVER-DO list
- Confirm fallback plan (where the call goes if AI fails)
- Agree on the first-30-days review cadence: you listen to every call for the first 2 weeks, then weekly reviews

### Soft launch
- Route only off-hours calls to the AI first (6pm-8am + weekends)
- Owner handles business-hours calls as usual
- Lets you catch failures in a smaller volume

---

## Day 11-14 — Full go-live

### Go-live checklist
- [ ] Agent prompt approved by owner in writing
- [ ] 15+ test calls passed
- [ ] Call summaries arriving on owner's phone within 30 sec of call end
- [ ] Missed-call text-back tested — SMS delivered within 10 sec
- [ ] Fallback route tested — kill the AI (disable it in Vapi), call in, confirm fallback catches it
- [ ] CRM / calendar integration tested (if any)
- [ ] A2P 10DLC approved for the Twilio number
- [ ] Call recording + transcription enabled (for review)
- [ ] Call retention policy set (default: 90 days, longer if client wants)
- [ ] Owner has a direct channel to kill-switch the agent (text you, you flip off within 15 min)

### Go-live email
```
Subject: [BUSINESS] — AI answering is live

Hi [NAME],

Your AI receptionist is live. Here's what to expect:

📞 How it works:
- Any call to [NUMBER] rings your cell 3 times first
- If you don't answer, the AI picks up
- It takes a message in English or Spanish
- You get a text + email with the caller's info within 30 seconds
- You call them back when you can

🚨 First 2 weeks:
I'm listening to every call. If something sounds wrong — wrong tone, wrong info, confused caller — I fix the agent that day. Expect a few hiccups while we tune it to how you'd answer. By week 3 it's clean.

Kill switch:
If anything feels off, text me and I shut it off within 15 minutes. We go back to normal while I fix it.

Monthly: I'll send you a summary — how many calls, which were booked, which needed you to call back.

— Evelio
```

---

## First 30 days — intensive monitoring

**Daily (week 1 + 2):**
- Listen to every call recording
- Flag anything that failed and why
- Update prompt same day
- Text owner any time something broke before they notice: "Just caught a call that went sideways. Fixed. Here's what happened: [...]"

**Daily (week 3 + 4):**
- Spot-check 50% of calls
- Weekly short email to owner with: "Here's a win from this week + here's one we're still working on."

**End of month 1 report:**
```
Subject: [BUSINESS] — AI Answering Month 1

Hi [NAME],

30 days in. Here's what happened.

📞 Call volume
- Total calls answered by AI: [N]
- After-hours vs business-hours: [N] / [N]
- Average call length: [MM:SS]

✅ Outcomes
- Appointments booked directly: [N]
- Messages taken for callback: [N]
- Spanish-language calls: [N]
- Calls you'd have missed without the AI: [N]  ← this is the ROI number

⚠️ Things we're still tuning
- [specific — e.g., "Agent is hesitating on the pool heater question. Added that to the FAQ this week."]

💰 Variable cost this month: $[N] (Vapi usage)

Next month: [1 sentence what we're focused on]

— Evelio
```

---

## Monthly ongoing (~1-2 hr/client)

- Weekly spot-check of 10-20% of calls
- Monthly report with the metrics above
- Prompt tuning based on new question types or failure modes
- Watch Vapi/Bland costs — if a client's variable cost crosses $100/mo, surface it in the monthly report and discuss whether to raise their monthly fee
- Twilio A2P 10DLC renewal — check annually

---

## Common failure modes & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent hallucinates a price | Prompt didn't block it clearly enough | Add explicit "If asked about price, say: 'Pricing depends on [factors]. Let me have someone call you back with a real quote.' Never quote a number." |
| Agent transfers caller to a dead extension | Default Vapi/Bland behavior | Disable all transfer functions. Only message-taking. |
| Caller hangs up during greeting | Greeting too long or robotic | Cut to under 10 seconds. Make it sound like a person: "Thanks for calling X, English or Spanish?" |
| Spanish calls routing to English agent | Language detection failing on first word | Set greeting to BOTH languages ("English or Español?") so caller self-selects. |
| Owner angry because AI took a message during work hours | Call forwarding timed out too fast | Increase cell ring from 15 sec to 25 sec. Owners sometimes can't answer in 3 rings on a job site. |
| Owner missed a critical callback | SMS summary not seen | Add email-to-SMS redundancy. Add email to a second person (office manager). Add Slack/Discord integration if client uses one. |
| Caller gives bad callback number | Agent didn't confirm by reading back | Add to prompt: "After collecting number, read it back digit by digit for confirmation." |
| Variable costs spiking | Someone found the number and spam-dials | Add rate limiting at Vapi level. Block repeat offender numbers in Twilio. |
| Agent sounds bored / monotone | Voice model is too flat | Try different Vapi voice. Rachel, Josh (ElevenLabs voices) sound more natural than defaults. Add some "um"s and "let me see"s to prompt. |

---

## Beta → full launch criteria

Before offering AI Answering as a standard service (not just Growth Suite add-on):
- 3+ clients live for 60+ days each
- Zero kill-switch activations in last 30 days per client
- Variable cost per client under $80/mo average
- Positive NPS from all 3 clients
- Documented list of 20+ failure modes + fixes

Until then: beta only, pricing is "we'll figure it out together," no 90-day guarantee.

---

## Offboarding (if client cancels)

30 days notice. **Phone number handling is the hardest part — plan early.**
1. If number was ported in: port it back to their new carrier OR to their cell. Give them the account/PIN. Allow 7-14 days.
2. If number was bought on Twilio: release to pool OR transfer to client's own Twilio account (preferred — no number loss).
3. Export full call history + recordings as CSV + audio files, deliver to client (per data retention agreement)
4. Disable the Vapi/Bland agent
5. Cancel the Twilio number if client doesn't want it
6. Last report with lifetime stats + any pending callbacks the client needs to handle
