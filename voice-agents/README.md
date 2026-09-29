# Voice Agent Delivery Kit

Manual workflow for delivering bilingual AI receptionist service via Vapi. First client: Hello You Wellness Center.

## What the client gets ($349/mo)

- 24/7 bilingual AI receptionist (English + Spanish)
- Missed-call capture when staff can't answer
- Lead summary via SMS/email within seconds
- One follow-up text if caller doesn't leave details
- Weekly call log review and prompt tuning

## Your delivery time

- **Setup:** 6-10 hours (first client), 2-4 hours (with templates)
- **Weekly:** 30-60 min reviewing calls, tuning prompts
- **Monthly:** 1 hour preparing report + client call

## Start here

1. Copy `templates/` to `clients/helloyou/` — the `clients/` folder is gitignored.
2. Complete `business-profile.md` with verified facts before writing the assistant prompt.
3. Send the owner the onboarding message in `onboarding.md`.
4. Buy a Vapi phone number (305/786 area code).
5. Build the assistant using `assistant-prompt.md` as your template.
6. Test extensively using `testing-checklist.md` before any real calls.
7. Set up conditional call forwarding on the client's phone.
8. Monitor the first week closely; adjust the prompt based on real calls.

## Tool stack

| Tool | Purpose | Cost |
|------|---------|------|
| Vapi.ai | Voice AI platform | ~$0.05-0.09/min |
| Twilio (via Vapi) | Phone number | ~$3/mo |
| Make.com or custom webhook | Post-call SMS/email | Free tier |

## Weekly rhythm

- **Monday:** Review last week's call logs in Vapi dashboard
- **Tuesday:** Note any failures, awkward responses, or missed info
- **Wednesday:** Update the assistant prompt if needed
- **Thursday:** Test changes with 2-3 calls
- **Friday:** Send client a brief update if anything changed

## Important limitations

- Voice AI works best for **simple lead capture**, not complex conversations
- Callers with heavy accents or background noise may have issues
- The AI should **never quote prices or make promises**
- Always have a human fallback for urgent/emergency calls
- Test extensively before going live — real calls will surprise you

## Privacy and compliance

- Call recordings require consent — check Florida two-party consent laws
- Don't store patient health information in Vapi transcripts
- Keep lead summaries to: name, callback number, service interest, urgency
- The client's existing HIPAA/privacy obligations still apply
