import { SERVICE_IDS, normalizeServices } from '../../api/_lib/services.js'
export { SERVICE_IDS, normalizeServices }

// Services a business is subscribed to (set by Azul). Master sees every service for delivery planning.
export function activeServices(client, isMaster) {
  if (isMaster) return SERVICE_IDS
  return normalizeServices(client?.services)
}
// What Azul sends the owner after creating their workspace.
export function inviteMessage(client, origin) {
  const names = normalizeServices(client?.services).map((id) => SERVICES.find((s) => s.id === id).name).join(', ') || 'your services'
  return `Hi ${client?.owner_name || 'there'} — your Azul workspace for ${client?.name} is ready.\n\n1. Go to ${origin}/admin\n2. Paste this access key: ${client?.access_key}\n\nYou'll see: ${names}.\n\nKeep the key private — it's your team's sign-in. If you ever need it reset, or want to add a service, just message me.`
}

// Local delivery planning metadata. This is NOT provider configuration or billing.
// Names match the Services section on azulwebdev.com.
export const SERVICES = [
  { id: 'website', name: 'Website Building', icon: 'globe', color: 'blue', category: 'Your digital foundation', description: 'Build a fast, bilingual website that turns visitors into leads.', status: 'Launch checklist', action: 'Open website plan' },
  { id: 'calls', name: 'Speed-to-Lead Agent', icon: 'phone', color: 'green', category: 'From new lead to booked estimate', description: 'Connect new leads to an immediate bilingual call, qualification, and estimate booking.', status: 'Setup checklist', action: 'Open speed-to-lead plan' },
]
export const UPCOMING = []
// Per-service copy for the delivery view. Keeps ServiceWorkspace data-driven.
export const DELIVERY = {
  agents: { intro: 'Choose a role below, then work through the launch plan. This workspace tracks preparation; agents are not running here yet.', setupTitle: 'From idea to first assignment', sideTitle: 'Start with one useful job', side: 'Pick a repeatable task with a clear input and result. Agree who reviews the output and when the agent should hand work back to your team.', noteTitle: 'Agent runtime not connected', note: 'These are planning checkmarks, not deployment controls. Live runs, tool connections, approvals, and performance reporting need a separate integration.', link: 'https://azulwebdev.com/services/custom-ai-agents', linkLabel: 'Explore the AI Agents service', linkNote: 'Opens Azul’s service page with examples and build options.' },
  website: { intro: 'Track the delivery work here. Hosting, deployment, and analytics stay in your existing tools.', setupTitle: 'Setup & launch checklist', sideTitle: 'Keep delivery focused', side: 'Agree on scope, collect approved content, test on mobile, and make sure enquiries reach the right person.', noteTitle: 'Website monitoring not connected', note: 'This is a launch checklist, not an uptime monitor or a website builder.', link: 'https://vercel.com/dashboard', linkLabel: 'Open Vercel' },
  calls: { intro: 'Every website lead gets a call within seconds during calling hours. Live leads and results are above; the checklist below tracks setup.', setupTitle: 'Speed-to-lead launch checklist', sideTitle: 'From enquiry to estimate', side: 'Connect the lead form, confirm service area and qualification questions, and route bookings to the right calendar. Test English and Spanish calls, a no-answer retry, and a callback to the business number.', noteTitle: 'What the agent records', note: 'Calls, outcomes, bookings and callbacks are recorded automatically above. These checkmarks are planning notes and do not change how the agent runs.', link: 'https://dashboard.vapi.ai/', linkLabel: 'Open agent provider' },
  seo: { intro: 'Your manual workflow: collect → draft → approve → publish → measure.', setupTitle: 'One-time onboarding', monthlyTitle: 'Monthly delivery', monthlySub: '8 posts total · 1 website update · 1 visibility report', sideTitle: 'What the client sends you', side: 'Approved non-patient photos, a factual description, and approval of the final copy. Start with verified business information—not assumed services or locations.', noteTitle: 'GBP & ranking tools not connected', note: 'Publish in Google’s interface and run your ranking scans externally. This checklist does not auto-post, run AI, or track rankings.', link: 'https://business.google.com/', linkLabel: 'Open Google Business Profile' },
  social: { intro: 'Your manual workflow: collect photos → write EN/ES captions → approve → publish → report.', setupTitle: 'One-time onboarding', monthlyTitle: 'Monthly delivery', monthlySub: '8 posts total across Facebook & Instagram · 1 monthly summary', sideTitle: 'What the client sends you', side: 'Job photos, before-and-afters, or team photos they have the right to share. No customer faces, addresses, or patient details without written permission.', noteTitle: 'Meta not connected to this dashboard', note: 'Publish through Meta Business Suite. This checklist does not auto-post, generate captions, or pull reach and engagement numbers.', link: 'https://business.facebook.com/latest/', linkLabel: 'Open Meta Business Suite' },
}
export const SEO_SETUP = [
  { id: 'seo-access', title: 'Confirm profile access & business facts', detail: 'Owner keeps ownership. Verify the actual location, services, hours, and booking link.' },
  { id: 'seo-baseline', title: 'Record a local visibility baseline', detail: 'Choose 3 real service queries; save the scan grid settings and export privately.' },
]
export const SETUP = {
  agents: [
    { id: 'agent-role', title: 'Define the role & first assignment', detail: 'Choose one repeated task. Write down what starts it, what information it needs, and what a good result looks like.' },
    { id: 'agent-tools', title: 'Confirm tools & access', detail: 'List the systems the agent needs and have the owner approve the access required for this job.' },
    { id: 'agent-handoff', title: 'Agree on approvals & human handoff', detail: 'Decide what can happen automatically, what needs review, and who receives exceptions.' },
    { id: 'agent-test', title: 'Review sample work together', detail: 'Test typical tasks, missing information, and tool failures with sample data. Check the result with the business owner.' },
    { id: 'agent-pilot', title: 'Approve a monitored pilot', detail: 'Agree the pilot scope, review schedule, and how to pause the agent before enabling it in the connected system.' },
  ],
  website: [
    { id: 'web-scope', title: 'Confirm pages, content & domain ownership', detail: 'Agree the scope with the owner and gather approved brand assets.' },
    { id: 'web-build', title: 'Review the site with the client', detail: 'Check both languages, service details, and mobile layouts.' },
    { id: 'web-test', title: 'Test forms & booking links', detail: 'Verify actual delivery to the right person using test data, not patient information.' },
    { id: 'web-launch', title: 'Verify launch & hand over access', detail: 'Check the deployed domain, SSL, basic indexing, and agreed maintenance process.' },
  ],
  calls: [
    { id: 'call-scope', title: 'Approve qualification & booking rules', detail: 'Confirm services, service area, urgency questions, English and Spanish scripts, and when to hand off to a person.' },
    { id: 'call-number', title: 'Connect the lead form & outbound number', detail: 'Verify a new enquiry triggers the correct agent with the customer’s details and contact permission.' },
    { id: 'call-tests', title: 'Test response speed in English & Spanish', detail: 'Submit test leads, measure time to first call, and test incomplete details, duplicate submissions, and failures.' },
    { id: 'call-handoff', title: 'Verify calendar booking, retries & callbacks', detail: 'Check real availability, time zones and booking confirmations, the retry call when a lead does not answer, and a callback to the business number.' },
    { id: 'call-pilot', title: 'Approve a monitored launch', detail: 'Review the complete enquiry-to-estimate flow with the owner and agree on monitoring and a pause procedure.' },
  ],
  seo: SEO_SETUP,
  social: [
    { id: 'social-access', title: 'Get Page & Instagram access', detail: 'Owner keeps ownership; you are added as a partner or editor in Meta Business Suite. Confirm both accounts are connected.' },
    { id: 'social-voice', title: 'Agree on voice, topics & no-go list', detail: 'Tone, EN/ES mix, services to feature, and what never gets posted (customers, prices, medical claims).' },
    { id: 'social-photos', title: 'Set up the photo drop', detail: 'A shared folder or WhatsApp thread where the client sends job photos. Confirm they have the right to share each one.' },
  ],
}
export const MONTHLY_SOCIAL = [
  { id: 'social-assets', title: 'Collect this month’s photos', detail: 'Real jobs, real team. Skip anything showing customers, addresses, or health details without permission.' },
  { id: 'social-drafts', title: 'Draft and approve EN/ES captions', detail: 'Write from what is actually in the photo. Client approves before anything is published.' },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `social-post-${i + 1}`, title: `Publish post ${i + 1}`, detail: `Week ${Math.floor(i / 2) + 1} · Facebook + Instagram. Check it actually went live.` })),
  { id: 'social-report', title: 'Send the monthly summary', detail: 'What was posted, what got engagement, what to feature next month. Report real numbers from Meta; do not promise leads.' },
]
export const MONTHLY_SEO = [
  { id: 'seo-assets', title: 'Collect approved photos & topics', detail: 'Use business premises or approved staff photos. No patient images or health information.' },
  { id: 'seo-drafts', title: 'Draft and approve EN/ES content', detail: 'Generate both languages from verified facts; have the client approve before publication.' },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `seo-post-${i + 1}`, title: `Publish Google post ${i + 1}`, detail: `Week ${Math.floor(i / 2) + 1} · Check the actual publication status. Eight total posts, not eight per language.` })),
  { id: 'seo-page', title: 'Improve one existing website page', detail: 'Add useful, verified local information. Avoid near-duplicate city pages and unsupported medical claims.' },
  { id: 'seo-report', title: 'Deliver the monthly visibility report', detail: 'Repeat the same grid and keywords. Report actual results; do not promise ranking gains.' },
]
export const MONTHLY = { seo: MONTHLY_SEO }
export const monthId = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
export function planKey(clientId, demo, period) { return `azul:delivery:v1:${demo ? 'demo' : 'live'}:${clientId}:${period}` }
export function readPlan(storage, key, allowed) {
  const parsed = JSON.parse(storage.getItem(key) || '{}')
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
  return Object.fromEntries(Object.entries(parsed).filter(([id, date]) => allowed.includes(id) && typeof date === 'string' && Number.isFinite(Date.parse(date))))
}
export function reviewEvents(requests) {
  return requests.map((r) => {
    const responded = r.rating != null
    const failed = r.status === 'failed'
    const cancelled = r.status === 'cancelled'
    return { id: `review-${r.id}`, service: 'reviews', title: responded ? `Feedback received from ${r.customer_name}` : failed ? `Request delivery failed · ${r.customer_name}` : cancelled ? `Request cancelled · ${r.customer_name}` : r.sent_at ? `Review request sent to ${r.customer_name}` : `Request scheduled for ${r.customer_name}`, date: r.rated_at || r.sent_at || r.created_at || r.send_at, state: failed || r.status === 'pending' ? 'attention' : 'completed', detail: 'Review Booster · latest recorded request state' }
  }).filter((e) => Number.isFinite(Date.parse(e.date)))
}
