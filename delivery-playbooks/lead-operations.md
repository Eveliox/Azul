# Run the lead inbox

### Owner or dispatcher

1. Open **Speed-to-Lead Agent → Overview**. When the attention banner appears, choose **View leads**, then select a name. You can also open the **Leads** tab directly. The inbox shows the latest 100 leads. Read **Next step**, call permission, summary, attempts and scheduled retry before acting.
2. For a handoff, assign one person to handle it and record who owns it in your team’s usual job tracker. Use a permitted contact channel. Honor a stop request. For a pending new lead or retry that should receive no more automatic calls, choose **Stop calling**.
3. For a booking, confirm the visit exists on the business calendar at the time shown. If it is missing, have the dispatcher reconcile the appointment with the owner before promising a time.
4. Keep transfer numbers, alert inboxes and availability current in **Agent settings**. After launch the owner can pause calling there while the business continues receiving enquiries.

### Azul operator

Review the first genuine enquiry after launch. Compare form arrival, first call, outcome, alert email and any calendar event. During the first week, check in with the dispatcher about missed handoffs and inaccurate answers. Update business details and repeat the affected test with your own number.

| Symptom | What to check and do |
|---|---|
| Form appears to succeed but no lead is visible | Verify the selected workspace and clear inbox filters. Check the hosted link’s short ID or the website server’s endpoint and current form key. Use the owner’s working intake channel while repairing the route. |
| Lead saved but no call | Read its permission, status and next step. Check **Calls off**, client mode, test-number list, local hours, Sunday setting and scheduled retry. Respect a blocked or stopped result. |
| Retries overdue across clients | Have Azul inspect the Supabase scheduled job `azul-lead-retries` and its recent responses. It runs every five minutes and also drives reports. Check job history before changing any scheduler. |
| Call finished but outcome or email is missing | Compare the call in Vapi with the lead activity. Check the end-of-call report destination and secret, then the alert recipient and Resend delivery record. Avoid redialing a customer to diagnose reporting. |
| Wrong times, business details or transfers | Pause this client. Verify calendar ID, sharing, local time zone, profile and owner cell. Correct the setting and repeat the failed scenario using your test number. |

**Reports.** Read the daily Azul operations email for call failures, spend and quiet clients. Owners who have weekly results enabled receive a Monday summary. Use the dashboard’s median response time, bookings and leads needing attention when discussing results. Confirm booked visits against the calendar.

**Pausing or ending service.** In **Agent settings**, pause the client and verify the mode. Assign pending leads to the dispatcher. For offboarding, replace the hosted link or website integration with the owner’s agreed intake route, disable the retired hosted form if used, and verify the replacement with your own details. Hand over outstanding callbacks and bookings. Remove departing members through **Workspace access** after handoff. For a temporary pause, review pending retries and verify the repair before resuming calls.
