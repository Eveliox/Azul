# Launch a Speed-to-Lead Agent

Work in the client’s selected workspace. Azul owns **Setup**. The client can maintain their business details and daily controls under **Agent settings**.

### 1. Configure the business in Testing

1. Open **Speed-to-Lead Agent → Setup**. Enter the name callers should hear, select **Testing**, and add your own phone under **Test numbers**. Use a monitored alert inbox and confirm who answers the transfer cell.
2. Import the client’s Twilio number into Vapi. Copy its **Vapi phone number ID** into Setup. Enter the business’s Twilio number and the owner’s cell. If the owner wants first refusal, enable **Owner first**. Pressing 1 connects them to the lead. If they miss the prompt, the AI takes over. Agree with the owner before testing that route.
3. Choose **Azul template** for a script generated from the business profile. Have the owner share their visits calendar with the Google account connected to Vapi, with permission to change events. In Google Calendar, open that calendar’s **Settings and sharing → Integrate calendar** and copy its **Calendar ID** into Setup. For an existing custom **Vapi assistant**, select that mode and enter its saved assistant ID.
4. Set the business time zone, calling window within 8 AM–8 PM, Sunday preference, calls per lead and minutes between attempts. Select the weekly email preference. Choose **Create agent** or **Save agent settings**.
5. Under **Agent settings → Business details**, complete the trade, services, area, qualification questions, emergency and handoff instructions. Set the days and hours available for visits, visit length and minimum notice. Save. Calling hours govern when the phone rings. Visit hours govern appointments the agent may offer.
6. Return to **Setup**. Resolve items under **Before using the Azul template**. Review both script previews with the owner. Confirm the business name, service area, questions and what happens when a caller asks for a person.

### 2. Connect calls and the lead source

**Call results and callbacks.** Use the server URL shown under **Setup → Connect Vapi** (`https://app.azulwebdev.com/api/leads/call-ended`) and the private `x-vapi-secret` header matching the deployment’s `VAPI_LEAD_AGENT_SECRET`. For saved Vapi assistants, configure outbound and inbound assistants to send the end-of-call report. For the Azul template, set the server URL and header on the imported number and leave its inbound assistant unassigned so Azul can supply the callback script.

| Lead source | Setup |
|---|---|
| Azul hosted form | In Setup, enter the business’s HTTPS privacy page, turn on the hosted form and save. Open the generated link at `/f/<short-id>`. Check the business name, services, EN/ES switch and permission checkbox before sharing it. |
| Existing website form | Under **Connect the website**, copy **Lead address** and **Form key** into the website server’s private settings as `LEAD_ENDPOINT` and `LEAD_FORM_KEY`. Have the server submit the lead with the `x-lead-key` header. Map name, US phone, service, language, permission choice and displayed consent text. Include email when provided for booking confirmation. Keep the key out of browser code. |

If replacing an older form integration, disable its automatic dialer before routing that source to Azul. Leave the owner a working way to receive enquiries during the changeover.

### 3. Prove the handoffs before switching live

Use your own listed number and a test inbox you control. **Setup → Send test call** places a real call at any hour when platform calling is enabled. It tests the phone and script. Use the actual form separately to check intake, consent and scheduling.

| Exercise | Evidence to look for |
|---|---|
| Answer in English and Spanish on separate tests | Correct business, language and qualification questions. A call summary reaches the alert inbox and appears in **Leads**. |
| Book an estimate using an available test slot | The event appears on the intended calendar at the correct local time. Check the owner email and the test lead’s confirmation. Remove the test appointment afterward. |
| Leave form call permission unticked | The enquiry is saved for follow-up and the automatic call stays off. |
| Miss a permitted call or submit outside calling hours | Open the lead and check its next step and scheduled retry against the saved rules. |
| Request a human or call the business number back | The agreed person receives the transfer or callback task. If Owner first is enabled, try both pressing 1 and letting the owner’s phone ring out. |
| Ask the agent to stop calling | The result records the request and further automatic calls to that number are blocked. Run this last with a dedicated test number. |

### 4. Go live

Have the owner confirm the script, calendar event, alert inbox and callback owner. Resolve failed checks in Testing. In **Setup**, change this business to **Live** and save. Confirm the mode in **Overview**. A **Calls off** banner means platform calling is disabled across businesses. Refer that to the Azul operator before promising live calls.

Publish the verified form link or enable the approved website connection. Record the source URL, launch time, person handling callbacks and first check-in. Follow the first genuine enquiry through [daily operations](lead-operations.md).
