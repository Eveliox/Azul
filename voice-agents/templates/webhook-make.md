# Vapi → Make.com → SMS Webhook Setup

This routes Vapi call summaries to the business owner's phone via SMS.

## Make.com scenario

### Step 1: Create webhook trigger

1. New scenario → **Webhooks** → **Custom webhook**
2. Name it: `Vapi Call Completed`
3. Copy the webhook URL (looks like `https://hook.us1.make.com/xxx...`)
4. Add to Vapi → Assistant → Server URL

### Step 2: Filter for end-of-call only

1. Add a **Filter** after the webhook
2. Condition: `message.type` = `end-of-call-report`
3. This ignores status-update, speech-update, etc.

### Step 3: Extract the data

Add a **Set variable** module or use directly:

| Variable | Path in Vapi payload |
|----------|---------------------|
| `caller_name` | `message.analysis.structuredData.caller_name` |
| `caller_phone` | `message.analysis.structuredData.caller_phone` |
| `service_interest` | `message.analysis.structuredData.service_interest` |
| `callback_time` | `message.analysis.structuredData.callback_time` |
| `urgency` | `message.analysis.structuredData.urgency` |
| `recording_url` | `message.recordingUrl` |
| `call_duration` | `message.durationSeconds` |

### Step 4: Send SMS via Twilio

1. Add **Twilio** → **Send an SMS**
2. **To:** Owner's phone (hardcode or from config)
3. **From:** Your Twilio number
4. **Message:**

```
🔔 New call for [Business Name]

Name: {{caller_name}}
Phone: {{caller_phone}}
Interested in: {{service_interest}}
Callback: {{callback_time}}
Urgency: {{urgency}}

Duration: {{call_duration}}s
Recording: {{recording_url}}
```

### Step 5: Optional — Log to Google Sheets

Add **Google Sheets** → **Add a Row** to keep a running log:
- Date/time
- Caller name
- Phone
- Service
- Duration
- Recording URL

---

## Alternative: Custom webhook (Node.js/Vercel)

If you'd rather not use Make.com:

```js
// api/vapi-webhook.js (Vercel serverless)
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const OWNER_PHONE = process.env.OWNER_PHONE; // +1XXXXXXXXXX
const TWILIO_FROM = process.env.TWILIO_FROM;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { message } = req.body;
  
  // Only process end-of-call reports
  if (message?.type !== 'end-of-call-report') {
    return res.status(200).json({ ok: true, skipped: true });
  }
  
  const data = message.analysis?.structuredData || {};
  const duration = message.durationSeconds || 0;
  const recording = message.recordingUrl || 'Not available';
  
  // Skip if no usable lead info
  if (!data.caller_name && !data.caller_phone) {
    return res.status(200).json({ ok: true, noLead: true });
  }
  
  const body = `🔔 New lead captured

Name: ${data.caller_name || 'Not provided'}
Phone: ${data.caller_phone || 'Not provided'}
Service: ${data.service_interest || 'General inquiry'}
Callback: ${data.callback_time || 'ASAP'}
Urgency: ${data.urgency || 'routine'}

Call: ${duration}s
Recording: ${recording}`;

  try {
    await client.messages.create({
      to: OWNER_PHONE,
      from: TWILIO_FROM,
      body,
    });
    return res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.error('SMS failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
```

**Environment variables needed:**
```
TWILIO_SID=ACxxxxx
TWILIO_TOKEN=xxxxx
TWILIO_FROM=+1XXXXXXXXXX
OWNER_PHONE=+1XXXXXXXXXX
```

---

## Testing the webhook

1. Make a test call to the Vapi number
2. Check Make.com execution history (or Vercel logs)
3. Verify SMS arrived on owner's phone
4. Check all fields populated correctly

**Common issues:**
- Webhook URL not saved in Vapi (re-paste and save)
- Make scenario not active (turn it on)
- Twilio credentials expired or unfunded
- Phone number format wrong (must be +1XXXXXXXXXX)

---

## Vapi payload reference

The `end-of-call-report` message includes:

```json
{
  "message": {
    "type": "end-of-call-report",
    "call": { /* call metadata */ },
    "recordingUrl": "https://...",
    "stereoRecordingUrl": "https://...",
    "transcript": "Full transcript text...",
    "messages": [ /* turn-by-turn */ ],
    "durationSeconds": 127,
    "analysis": {
      "summary": "Caller asked about...",
      "structuredData": {
        "caller_name": "Maria Lopez",
        "caller_phone": "+13055551234",
        "service_interest": "facial treatment",
        "callback_time": "afternoon",
        "urgency": "routine"
      }
    }
  }
}
```
