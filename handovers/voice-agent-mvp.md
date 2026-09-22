# AZUL VOICE AGENT MVP — Learn-While-You-Build Guide

Your first shippable service. By the end of this guide you'll have a real bilingual AI receptionist answering test calls, ready to pilot with Aspire Roofing.

**Total time investment:** ~10-15 hours spread over 5-7 days.
**Cost to complete:** ~$15 ($10 Vapi credit free + $3 Twilio phone number + trial calls).

---

## Phase 0 — What you're actually building (concepts, 20 min read)

Before touching any tool, understand what a voice agent IS. This makes every future decision easier.

### A voice agent = 5 systems chained together in ~200ms

```
Caller speaks
  ↓
[1] TELEPHONY: phone network delivers audio (Twilio, Vonage)
  ↓
[2] SPEECH-TO-TEXT (STT): converts audio → text (Deepgram, Whisper)
  ↓
[3] LLM: reads text, decides response (GPT-4, Claude, custom)
  ↓
[4] TEXT-TO-SPEECH (TTS): converts response → audio (ElevenLabs, PlayHT, Cartesia)
  ↓
[5] TELEPHONY: sends audio back to caller
  ↓
Caller hears response
```

**Vapi bundles all 5** and gives you a single dashboard + API to control them. That's what you're paying for. Without Vapi you'd wire Twilio + Deepgram + OpenAI + ElevenLabs yourself and manage the streaming latency (2-3 weeks of work).

### The "assistant" is the brain

In Vapi, an **Assistant** = configured combination of:
- A system prompt (personality + instructions)
- An LLM choice (Claude Sonnet, GPT-4, etc.)
- A voice (ElevenLabs "Adam", Cartesia "Nova", etc.)
- Tools/functions it can call (like "book_appointment" or "transfer_to_human")
- Metadata (industry, language, etc.)

You'll build ONE assistant per client (initially). Each client's assistant knows their business name, hours, services, pricing tier.

### Latency is the whole game

The reason voice AI feels magical (or terrible) comes down to time between "caller stops speaking" and "AI starts responding." Good = under 1 second. Bad = 3+ seconds. Vapi is currently ~800ms which is usable.

You can't fix latency, but you CAN avoid making it worse:
- Don't use overly long system prompts (adds LLM processing time)
- Don't call slow external APIs in-flow
- Use streaming (Vapi does by default)

### What voice agents are BAD at (right now)

- Complex conversations with lots of back-and-forth
- Understanding heavy accents or fast speakers
- Handling upset/emotional callers gracefully
- Any conversation lasting >5 minutes without losing track
- Nuanced pricing quotes ("it depends on your roof size...")

**Design around these limitations.** Your Azul agent's ONLY job = capture 5 pieces of info + tell them a human will call back. Don't try to sell, quote, or negotiate on the AI call.

---

## Phase 1 — Vapi account + first tour (30 min)

1. Go to **vapi.ai** → sign up with your dev email (not personal — you'll want this professionally)
2. Verify email, land on the dashboard
3. **Free tier gives you $10 credit** = ~200 minutes of testing
4. Take the 5-minute product tour. Click every menu item once so you know what's where.

**Key sections you'll use daily:**
- **Assistants** — your AI personalities (one per client)
- **Phone Numbers** — the Twilio numbers routing to your assistants
- **Call Logs** — every test/production call, with transcripts + recordings
- **Test** — an in-dashboard voice tester (no phone needed)
- **API Keys** — for later when you want to programmatically create assistants

**Learn**: watch [this 10-min Vapi intro](https://www.youtube.com/results?search_query=vapi+ai+tutorial+2024) before continuing. Any recent one is fine.

---

## Phase 2 — Hello World assistant (30 min)

Goal: get your first AI voice agent responding, using Vapi's built-in tester (no phone needed yet).

1. Dashboard → **Assistants → + New Assistant**
2. Name: `Hello World Test`
3. **Model:** GPT-4o mini (cheap, fast, plenty smart for a hello world)
4. **Voice:** Any ElevenLabs voice you like — try `Rachel` for a friendly female voice
5. **First Message:** `Hello! This is your test AI. What's your name?`
6. **System Prompt:**
   ```
   You are a friendly test assistant. Ask the caller's name, then say
   "Nice to meet you, [name]. This is Azul's first voice AI. Have a great day!"
   and end the call.
   ```
7. Save
8. Click the **"Talk to Assistant"** button in the dashboard — this opens a browser voice tester
9. Say hi. See what happens.

**You just built a functional voice AI in 30 minutes.** Now let's make it actually useful.

**Learn:** notice the LATENCY. That pause between you talking and AI responding. This is the "vibe" of every voice AI product. Feel it, understand what you're up against.

---

## Phase 3 — Build the real Azul receptionist (3-4 hours)

Now build your production assistant. This one you'll actually deploy for Aspire Roofing.

### 3a — Assistant configuration

- Name: `Aspire Roofing - Receptionist`
- **Model:** `GPT-4o` (worth the extra pennies for real customer conversations)
- **Voice:** try a few. My picks:
  - EN: ElevenLabs `Charlotte` (calm, professional)
  - ES: ElevenLabs `Valentina` (Miami/LatAm-friendly)
- **Max duration:** 300 seconds (5 min max — cuts off runaway calls)
- **Silence timeout:** 15 seconds (ends call if caller goes silent)
- **First message** (bilingual auto-detect):
  ```
  Hi, thanks for calling Aspire Roofing. Hola, gracias por llamar a Aspire Roofing.
  How can I help you today? En qué le puedo ayudar?
  ```

### 3b — The system prompt (the real work)

Paste this in, then tweak:

```
You are the friendly bilingual receptionist for Aspire Roofing, a roofing 
contractor in Miami, Florida serving Miami-Dade and Broward counties.

YOUR ONLY JOB is to capture 5 pieces of information from every caller:
1. Caller's full name
2. Their phone number (repeat back to confirm)
3. What service they need (repair, replacement, inspection, quote)
4. The property address (or at least neighborhood)
5. When they'd like a callback (morning, afternoon, evening, specific time)

Then say: "Perfect. Someone from Aspire Roofing will call you back within 
30 minutes. Have a great day."

RULES:
- Speak in the caller's language (English or Spanish). Match them.
- If they start in Spanish, respond in Spanish for the entire call.
- Keep every response under 15 words.
- Do NOT quote prices, timelines, or availability. If asked, say:
  "That's a great question. When [owner name] calls you back, they'll give 
  you an exact answer."
- Do NOT try to schedule an appointment yourself. Just capture the callback 
  time and let the human handle scheduling.
- If the caller sounds angry or in an emergency (leak, storm damage, 
  water pouring in), immediately say: "This sounds urgent. I'm going to 
  transfer you to Kevin right now." and use the transferCall function.
- If the caller asks for hours: "We're open Monday to Saturday, 8 AM to 6 PM."
- If the caller asks the address: "We're in Miami, serving all of Miami-Dade 
  and Broward."

TONE:
- Warm and human, not robotic
- Confident but never pushy
- Match the caller's energy (chill caller = chill you, formal caller = 
  formal you)
```

Save. Test in the browser tester. **Iterate 10-15 times** before moving on. Try to break it:
- Talk over it
- Speak Spanish then switch to English mid-sentence
- Ask it for a price ("How much for a new roof?")
- Say "leak, help, water everywhere" and see if it handles the emergency case
- Give a fake phone number and see if it repeats it back correctly

**Learn:** every time it fails, adjust the system prompt. This is prompt engineering. Save each version so you can compare.

### 3c — Add structured data extraction

Vapi can extract structured info from the conversation and give it to you as JSON at the end.

1. In assistant settings → **Analysis** section
2. Add these structured data fields:
   ```json
   {
     "caller_name": "string",
     "caller_phone": "string",
     "service_needed": "string",
     "property_address": "string",
     "callback_time": "string",
     "urgency_level": "enum: normal, urgent, emergency",
     "language": "enum: english, spanish"
   }
   ```
3. Add a prompt for extraction:
   ```
   Extract the above fields from the call transcript. If the caller did not 
   provide a field, leave it as null. Do not invent values.
   ```

Now after every call, Vapi will POST you a webhook with this JSON. You'll use this to auto-SMS the client.

**Learn:** function calling / structured extraction is how LLMs bridge to real systems. Every voice agent uses this pattern.

---

## Phase 4 — Wire to a real phone number (1 hour)

Now let's make real calls hit your assistant.

### 4a — Vapi + Twilio (easiest)

Vapi has built-in Twilio integration:

1. Dashboard → **Phone Numbers → + Buy Number**
2. Choose a Miami area code (305 or 786) — feels local to prospects
3. Pay ~$3 (comes out of your $10 credit)
4. In the phone number settings → **Assign Assistant** → pick `Aspire Roofing - Receptionist`
5. Save

Now call that number from your cell. **Your AI should answer.**

Test 5-10 times. Try different scenarios. Listen to the recordings in Call Logs.

### 4b — What just happened technically

Vapi:
- Bought a Twilio number under the hood
- Set the number's webhook to route incoming calls to their SIP infrastructure
- Their SIP endpoint streams the audio to Deepgram (STT) → LLM → ElevenLabs (TTS) → back to Twilio
- Every call is logged, transcribed, and analyzed

**Learn:** this is why Vapi is worth $0.05/min. You'd spend 2 weeks configuring this yourself.

---

## Phase 5 — Call routing from client's real phone (2 hours)

For a real client, you DON'T give out the Vapi number as their main line. You keep their existing phone and route to Vapi only when they don't answer.

### The setup

Client's real number = the one on Google, their business cards, etc.

You configure their carrier (or Twilio) to:
- Ring their cell 3 times
- If unanswered → forward to Vapi number
- Vapi answers → captures info → hangs up
- You SMS the client the summary

### How to do this per carrier

**iPhone (AT&T, Verizon, T-Mobile) — conditional call forwarding:**
1. Client dials `*61*[Vapi phone number in E.164 format]#` and hits call
   - Example: `*61*17869201239#`
2. This sets "call forwarding when unanswered" to the Vapi number
3. Test by calling client's number and not answering — call rings to Vapi after ~15 seconds

To turn off: dial `##61#`.

**Alternative: port their number to Twilio**
1. Client gives you their carrier account details
2. Port their number into Twilio (~2 weeks, $0 fee)
3. In Twilio, set call flow: Ring their cell → Vapi
4. More control, more setup, more risk. Skip for now.

### For your first pilot (Aspire Roofing)

- Ask Kevin (owner) to add `*61*[VapiNumber]#` on his cell TEMPORARILY (weekend only) as a test
- Any incoming call he doesn't answer within 3 rings → Vapi picks up
- Monday morning he decides if he wants to keep it

Low risk, high learning.

---

## Phase 6 — Post-call SMS summary to client (1-2 hours)

When Vapi captures a lead, the client needs to know IMMEDIATELY. That's the whole value prop.

### Setup

1. In Vapi dashboard → your assistant → **Server URL** field
2. Set it to a webhook endpoint (you'll create this next)
3. Vapi will POST call events here — you filter for `end-of-call-report` and send SMS

### Simplest webhook: use Make.com (no-code, free tier)

1. Sign up for Make.com (free tier fine)
2. Create scenario:
   - **Trigger:** Webhook (custom) — Make gives you a URL, paste that into Vapi's Server URL
   - **Filter:** only if `message.type == "end-of-call-report"`
   - **Action 1 (SMS):** Twilio → Send SMS
     - To: client's cell (Kevin's number for Aspire test)
     - From: your Twilio number
     - Body:
       ```
       New lead from Azul AI:
       Name: {{message.analysis.structuredData.caller_name}}
       Phone: {{message.analysis.structuredData.caller_phone}}
       Service: {{message.analysis.structuredData.service_needed}}
       Address: {{message.analysis.structuredData.property_address}}
       Best callback time: {{message.analysis.structuredData.callback_time}}
       Urgency: {{message.analysis.structuredData.urgency_level}}
       
       Full recording: {{message.recordingUrl}}
       ```
   - **Action 2 (optional):** Send email to yourself + client with same info

3. Save + activate scenario

Test: call the Vapi number, give fake info, hang up. Within 10 seconds Kevin's phone should ding with the SMS.

**Learn:** webhooks are how systems talk to each other. Vapi → Make → Twilio → phone. This same pattern connects any two SaaS tools.

### Later upgrade path

Once you're comfortable, replace Make.com with a real Node.js endpoint on Vercel:
- More reliable, cheaper at scale (~$0 vs Make's $9/mo)
- Programmatic control
- Log everything to Supabase for history
- Trigger multiple actions in parallel

Skip this until you have 5+ clients.

---

## Phase 7 — Dogfood with a friend (2 hours)

Before you put this in front of Kevin, stress test it.

1. Text 3 friends: *"Call this number and pretend you need [service]. I'll buy you a coffee."*
2. Give them the Vapi number
3. Have each call once with a different scenario:
   - Friend 1: normal roof leak, English
   - Friend 2: Spanish-speaking caller, needs a quote for a new roof
   - Friend 3: angry customer, water pouring from ceiling right now

4. Listen to all 3 recordings in Vapi Call Logs
5. Note failures. Common ones:
   - AI cut them off mid-sentence
   - Missed a phone number digit
   - Didn't detect Spanish
   - Handled emergency poorly (didn't transfer)

6. Fix the system prompt for each failure
7. Retest until 3 back-to-back calls succeed

This is where you learn what real voice AI feels like. It's humbling.

---

## Phase 8 — Pilot with Aspire Roofing (Week 2)

Message Kevin (owner):

```
Hey Kevin — quick pitch.

I've been building an AI receptionist for roofers. It picks up your 
missed calls (weekends, after hours, when you're on a job) and captures 
lead info, then texts you the details within 30 seconds.

Want to be the first pilot? Free for 30 days, no strings. I set it up 
this weekend, we test it Monday, if it saves you even one job it pays 
for itself forever.

If you're in, three things I need from you:
1. Your cell number
2. Your business hours
3. 15 minutes to set up call forwarding on your phone

— Evelio at Azul
```

Once he says yes:
1. Onboard him: set up his assistant, add his cell to the Make.com webhook, set up conditional forwarding on his iPhone
2. Test 10 calls together with him listening
3. Turn it on Friday evening (highest missed-call rate is weekends)
4. Monday morning: check Call Logs together. Any captured leads?

**If Vapi captured even one lead that turned into a booked job**, you have your case study.

---

## Phase 9 — Package it as a paid service (Week 3+)

Now that you've validated it works:

1. Update site: your existing "AI Answering" pricing tile is already wired to Stripe ($349/mo). Prospects can subscribe self-serve.
2. Onboarding SOP (~2 hours per new client):
   - Duplicate your Aspire assistant in Vapi
   - Customize the system prompt (their business name, hours, services)
   - Buy new Twilio number OR port theirs
   - Test 5 calls with them
   - Turn on call forwarding on their end
3. Weekly review: 20 min per client. Listen to a few random calls. Refine their assistant prompt if needed.

**Margin math per client:**
- Charge: $349/mo
- Vapi cost: ~$30-50/mo (depending on call volume)
- Twilio number: ~$3/mo
- Twilio SMS (for summaries): ~$5/mo
- Total cost: ~$40-60/mo
- **Profit: $290-310/mo per client**

At 10 clients = $2,900-3,100/mo profit from just AI Answering.

---

## Common failure modes (and how to avoid them)

### "The AI didn't detect Spanish"
- Add to system prompt: `"IMPORTANT: if the caller speaks Spanish at any point in the call, immediately switch to Spanish and stay in Spanish for the rest of the call."`
- Use a voice that handles both languages well (Charlotte, Valentina)

### "The AI hung up too early"
- Increase `silenceTimeout` from 10s to 20s
- Add to system prompt: `"Wait for the caller to finish speaking before responding. Don't interrupt."`

### "The AI made up a price"
- Add: `"NEVER quote a price. If asked, say 'that depends on your specific situation, [owner] will give you an exact quote when they call back.'"`
- Test with prompt: "How much is a new roof?" until it consistently deflects

### "The SMS summary is missing info"
- The AI didn't capture that field during the call. Two fixes:
  1. Add to system prompt: `"Do not end the call until you have captured all 5 pieces of information. If the caller didn't give you something, ask again."`
  2. In Vapi Analysis → adjust the extraction prompt to be more strict

### "Latency is killing us — 3+ second pauses"
- Switch LLM from GPT-4o to GPT-4o-mini (faster)
- Shorten system prompt (every 1000 words = +100ms)
- Use Cartesia voice instead of ElevenLabs (faster TTS)

### "Client complains the AI sounds robotic"
- Try different voices — ElevenLabs `Charlotte` and `Adam` are the most human
- Add to system prompt: `"Speak conversationally. Use 'um' or 'let me see' occasionally. Don't sound corporate."`
- Adjust `stability` and `similarityBoost` in the voice settings — lower stability = more natural but less consistent

---

## Your 5-day sprint to first working voice agent

- [ ] **Day 1 (1 hr):** Vapi account, hello world assistant, browser test
- [ ] **Day 2 (3 hrs):** Build Aspire Roofing assistant with full system prompt + structured data extraction. Iterate in browser tester.
- [ ] **Day 3 (2 hrs):** Buy Vapi phone number. Test with your cell 10 times.
- [ ] **Day 4 (2 hrs):** Set up Make.com webhook → Twilio SMS. Test end-to-end with fake calls.
- [ ] **Day 5 (2 hrs):** Dogfood with 3 friends. Fix issues. Send Kevin the pilot pitch.

Total: **~10 hours over 5 days.** Then you're ready for a real client.

---

## Deeper learning resources

If you want to go deeper on voice AI:

- **Vapi docs:** docs.vapi.ai (start with "Quickstart" then "Assistants" → "Advanced")
- **Deepgram blog:** blog.deepgram.com — free-flowing STT concepts
- **ElevenLabs blog:** elevenlabs.io/blog — voice quality tradeoffs
- **YouTube:** search "Vapi tutorial 2024" — pick recent videos, ignore anything before mid-2024 (rapidly changing space)
- **X/Twitter accounts to follow:** @denysmakes (Vapi CEO), @swyx (AI general), @deepgramAI

---

## What NOT to do

- **Don't skip the dogfooding phase.** Every voice agent has quirks that only show up in real calls with unpredictable humans.
- **Don't over-engineer the system prompt.** Every 100 words you add = +50-100ms latency + more edge cases.
- **Don't try to make the AI sell.** It's a lead capture tool, not a salesperson.
- **Don't build custom Twilio flows in Phase 1.** Use Vapi's built-in number provisioning. You can migrate later if needed.
- **Don't launch to a real client without 20+ test calls first.**

---

## When you're ready to talk more strategy

Come back after Phase 8 (first pilot live with Kevin). We'll cover:
- Vapi vs Bland vs building custom (do you need to migrate?)
- Handling voicemails vs live calls
- Multi-assistant per client (different agent for after-hours vs business hours)
- Integrating with GHL when you're ready to add that
- Charging setup fees ($499 setup + $349/mo)
- Handling clients who want their AI voice to sound EXACTLY like them (voice cloning — advanced)

Ship the MVP first. Everything else is optimization.
