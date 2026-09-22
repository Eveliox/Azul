# Voice Agent Troubleshooting Guide

## Common issues and fixes

### "SMS notifications aren't arriving"

**Check:**
1. Webhook URL correct in Vapi → Assistant → Server URL?
2. Make.com scenario active and not paused?
3. Twilio credentials valid and funded?
4. Phone number in correct E.164 format (+1XXXXXXXXXX)?

**Quick test:** Trigger a test call, check Make.com execution history for errors.

---

### "AI is quoting prices when it shouldn't"

**Fix in system prompt:**
```
Add to WHAT YOU MUST NEVER DO section:
"- Quote prices, costs, estimates, or ranges — even if the caller insists"
"- Say 'prices start at' or 'typically costs' or any variation"

Add explicit deflection:
"If asked about price, ALWAYS say: 'Pricing depends on your specific needs. [OWNER] will give you accurate pricing when they call back.'"
```

**Then:** Test 5 calls asking about prices in different ways.

---

### "AI keeps interrupting callers"

**Causes:**
- Silence detection too aggressive
- Caller has slow internet/phone delay

**Fix:**
1. Increase silence timeout from 10s to 15-20s
2. Add to prompt: "Wait for the caller to completely finish speaking before responding. Do not interrupt."

---

### "Spanish sounds unnatural"

**Causes:**
- Using Spain Spanish voice
- Prompt written in English causing translation artifacts

**Fix:**
1. Switch to ElevenLabs "Valentina" or other LatAm voice
2. Write key Spanish phrases directly in the prompt
3. Add: "Use Miami/Latin American Spanish. Use 'usted' not 'tú'. Do not use Spain Spanish expressions."

---

### "Callers hanging up immediately"

**Possible causes:**
1. Greeting too long (over 5 seconds)
2. Robotic voice putting people off
3. Latency too high (caller thinks no one answered)

**Fix:**
1. Shorten first message to under 4 seconds
2. Try a different, warmer voice
3. Check Vapi latency metrics — should be under 1.5s

---

### "AI not detecting language switch"

**Add to prompt:**
```
CRITICAL: If the caller speaks ANY Spanish words, immediately switch to Spanish and stay in Spanish for the rest of the call. Do not ask "would you prefer Spanish?" — just switch.
```

---

### "Structured data extraction missing fields"

**Check:**
1. Field names in extraction config match exactly what you're looking for
2. Extraction prompt is clear about what to look for
3. The AI actually asked for that information in the call

**Common fix:** Make extraction prompt more explicit:
```
Look for the caller's phone number in the transcript. It may be stated as individual digits ("three oh five") or as a full number. Convert to digits. If not found, use null.
```

---

### "Transfer not working"

**Check in Vapi:**
1. Transfer tool enabled for this assistant?
2. Destination number in correct format?
3. Twilio account can make outbound calls?

**Test:** Create a scenario that should trigger transfer, verify in call logs whether transfer was attempted.

---

### "Calls going straight to AI instead of ringing client first"

**Problem:** Call forwarding set to unconditional instead of conditional.

**Fix:** Client needs to re-do the forwarding setup:
- `*61*[number]#` = forward when NO ANSWER (correct)
- `*21*[number]#` = forward ALL calls (wrong)

To remove unconditional forwarding: `##21#`

---

### "Same caller keeps calling back"

**Likely cause:** AI not actually helping them — they're getting frustrated.

**Investigate:**
1. Pull that caller's transcripts
2. What are they asking for?
3. Is the AI deflecting when it shouldn't?

**Common fixes:**
- AI is being too restrictive
- AI isn't confirming it understood
- Callback promise isn't credible (client not actually calling back)

---

### "High Vapi costs this month"

**Check:**
1. Average call duration — anything over 3 min is a red flag
2. Any very long calls (10+ min) — those indicate AI stuck in loops
3. Call volume — did something change?

**Cost reduction options:**
- Switch from GPT-4o to GPT-4o-mini (cheaper, still good)
- Switch TTS from ElevenLabs to Cartesia (faster, cheaper)
- Set max call duration lower (180s vs 300s)
- Add to prompt: "Keep the conversation focused. Once you have the 5 pieces of information, politely end the call."

---

## Escalation checklist

If you can't fix an issue:

1. [ ] Capture the specific call ID from Vapi logs
2. [ ] Download the recording and transcript
3. [ ] Document exact steps to reproduce
4. [ ] Check Vapi status page for outages
5. [ ] Search Vapi Discord/docs for similar issues
6. [ ] Contact Vapi support with call ID and details

## Emergency: Turn it off

If the AI is causing problems with real callers:

**Immediately:**
1. Client dials `##61#` to disable call forwarding
2. Or: Vapi dashboard → Phone Numbers → unassign the assistant

**Then:** Figure out what went wrong before turning it back on.
