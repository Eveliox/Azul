# Voice Agent Testing Checklist

Complete ALL tests before forwarding real client calls. Use your personal phone, not the client's.

## Pre-flight checks

- [ ] Assistant created in Vapi dashboard
- [ ] Phone number purchased and assigned to assistant
- [ ] Webhook endpoint configured and tested
- [ ] Owner's phone ready to receive SMS summaries
- [ ] You have Vapi Call Logs open in another tab

## Basic functionality (5 calls minimum)

### Test 1: Happy path — English
- [ ] Call the Vapi number
- [ ] Respond in English throughout
- [ ] Provide: name, phone, service interest, callback time
- [ ] AI repeats phone number back correctly
- [ ] AI confirms callback promise
- [ ] Call ends naturally
- [ ] SMS received within 60 seconds
- [ ] Structured data captured correctly in Vapi logs

### Test 2: Happy path — Spanish
- [ ] Call and respond in Spanish from the start
- [ ] AI switches to Spanish and stays there
- [ ] Same capture flow works
- [ ] SMS received with correct info
- [ ] Spanish was natural (Miami/LatAm, not Spain)

### Test 3: Language switch mid-call
- [ ] Start in English
- [ ] Switch to Spanish mid-sentence
- [ ] AI follows the switch smoothly
- [ ] Doesn't get confused or repeat itself

### Test 4: Incomplete information
- [ ] Refuse to give phone number
- [ ] AI asks again politely
- [ ] Still captures what it can
- [ ] Doesn't get stuck in a loop

### Test 5: Service question
- [ ] Ask about a service ON the approved list
- [ ] AI acknowledges it appropriately
- [ ] Ask about a service NOT on the list
- [ ] AI deflects to callback without making things up

## Edge cases (test each scenario)

### Pricing questions
- [ ] "How much does [service] cost?"
- [ ] AI does NOT quote a price
- [ ] AI deflects: "I want to make sure you get accurate pricing..."

### Availability questions  
- [ ] "Can I come in tomorrow at 2pm?"
- [ ] AI does NOT promise availability
- [ ] AI captures callback preference instead

### Urgent/emergency
- [ ] "I'm having an allergic reaction" or similar
- [ ] AI immediately offers to transfer
- [ ] Transfer function triggers (or AI instructs to hang up and call 911)

### Upset caller
- [ ] Sound frustrated, say "I just want to talk to a person"
- [ ] AI offers to transfer without arguing
- [ ] Doesn't keep pushing the script

### Silence/dead air
- [ ] Stay silent for 10+ seconds
- [ ] AI prompts: "Are you still there?"
- [ ] After continued silence, ends call gracefully

### Background noise
- [ ] Call from a noisy environment
- [ ] AI asks for clarification when needed
- [ ] Doesn't mishear numbers catastrophically

### Rapid speech
- [ ] Speak quickly, interrupt the AI
- [ ] AI handles it without breaking
- [ ] Still captures the key information

### Voicemail scenario
- [ ] What happens if someone's voicemail answers first?
- [ ] Does the AI detect it's talking to a machine?

## Quality checks

### Latency
- [ ] Time from you stopping speaking to AI responding: _____ seconds
- [ ] Acceptable: under 1.5 seconds
- [ ] Problematic: over 2.5 seconds

### Voice quality
- [ ] AI sounds natural, not robotic
- [ ] Pronunciation is clear
- [ ] Pacing feels conversational

### Transcript accuracy
- [ ] Review 5 call transcripts in Vapi logs
- [ ] Names spelled correctly?
- [ ] Phone numbers captured correctly?
- [ ] No hallucinated information?

## Post-test fixes

Document every issue and fix:

| Test | Issue found | Prompt change made | Retested? |
|------|-------------|-------------------|-----------|
| | | | |
| | | | |
| | | | |

## Go-live criteria

All must be YES:
- [ ] 10+ successful test calls completed
- [ ] SMS notifications working reliably
- [ ] No pricing/availability promises observed
- [ ] Transfer function works for urgent cases
- [ ] Latency under 2 seconds consistently
- [ ] Both languages tested thoroughly
- [ ] Owner has seen a demo call and approved

## First-week monitoring plan

- [ ] Day 1-2: Check every single call log
- [ ] Day 3-4: Review any calls longer than 3 minutes
- [ ] Day 5-7: Spot-check 3-5 calls daily
- [ ] End of week: Full review with owner

**Red flags to watch for:**
- Same caller calling multiple times (AI not helping them)
- Calls ending abruptly (AI or caller hanging up frustrated)
- Missing structured data (extraction not working)
- Long calls with little captured (AI going in circles)
