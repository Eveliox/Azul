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
  { id: 'website', name: 'Website Build', icon: 'globe', color: 'blue', category: 'Your digital foundation', description: 'Launch, maintain, and improve your business website.', status: 'Manual checklist', action: 'Open website plan' },
  { id: 'calls', name: 'AI Answering Service', icon: 'phone', color: 'green', category: 'Never miss the conversation', description: 'Plan your bilingual receptionist and its call handoff.', status: 'Vapi not connected', action: 'Open answering service plan' },
  { id: 'reviews', name: 'Review Booster', icon: 'star', color: 'pink', category: 'Listen to your customers', description: 'Send requests, personalize messages, and collect feedback.', status: 'Workspace available', action: 'Open reviews' },
  { id: 'seo', name: 'Local Proof SEO', icon: 'pin', color: 'purple', category: 'Show up locally', description: 'Organize approved content and monthly visibility reporting.', status: 'Manual delivery', action: 'Open SEO plan' },
  { id: 'social', name: 'Social Media AI', icon: 'share', color: 'orange', category: 'Show your real work', description: 'Turn job and team photos into bilingual Facebook & Instagram posts.', status: 'Manual delivery', action: 'Open social media plan' },
]
// Services on the roadmap. Shown as "Coming soon" cards; cannot be added to a plan yet.
export const UPCOMING = [
  { id: 'ads', name: 'AI Facebook Ads', icon: 'megaphone', color: 'orange', category: 'Reach new customers', description: 'AI-built Facebook & Instagram ad campaigns with local targeting, creative, and budget optimization.', status: 'Coming soon' },
]
// Per-service copy for the delivery view. Keeps ServiceWorkspace data-driven.
export const DELIVERY = {
  website: { intro: 'Track the delivery work here. Hosting, deployment, and analytics stay in your existing tools.', setupTitle: 'Setup & launch checklist', sideTitle: 'Keep delivery focused', side: 'Agree on scope, collect approved content, test on mobile, and make sure enquiries reach the right person.', noteTitle: 'Website monitoring not connected', note: 'This is a launch checklist, not an uptime monitor or a website builder.', link: 'https://vercel.com/dashboard', linkLabel: 'Open Vercel' },
  calls: { intro: 'Use this plan alongside Vapi. Checking a task does not configure a phone number or deploy an agent.', setupTitle: 'Setup & launch checklist', sideTitle: 'Before the first real call', side: 'Verify call routing, callbacks, human fallback, and privacy requirements. A good test call is not proof that every real call will work.', noteTitle: 'Vapi not connected to this dashboard', note: 'Call volume, captured leads, and recordings will appear only after a real integration is built.', link: 'https://dashboard.vapi.ai/', linkLabel: 'Open Vapi' },
  seo: { intro: 'Your manual workflow: collect → draft → approve → publish → measure.', setupTitle: 'One-time onboarding', monthlyTitle: 'Monthly delivery', monthlySub: '8 posts total · 1 website update · 1 visibility report', sideTitle: 'What the client sends you', side: 'Approved non-patient photos, a factual description, and approval of the final copy. Start with verified business information—not assumed services or locations.', noteTitle: 'GBP & ranking tools not connected', note: 'Publish in Google’s interface and run your ranking scans externally. This checklist does not auto-post, run AI, or track rankings.', link: 'https://business.google.com/', linkLabel: 'Open Google Business Profile' },
  social: { intro: 'Your manual workflow: collect photos → write EN/ES captions → approve → publish → report.', setupTitle: 'One-time onboarding', monthlyTitle: 'Monthly delivery', monthlySub: '8 posts total across Facebook & Instagram · 1 monthly summary', sideTitle: 'What the client sends you', side: 'Job photos, before-and-afters, or team photos they have the right to share. No customer faces, addresses, or patient details without written permission.', noteTitle: 'Meta not connected to this dashboard', note: 'Publish through Meta Business Suite. This checklist does not auto-post, generate captions, or pull reach and engagement numbers.', link: 'https://business.facebook.com/latest/', linkLabel: 'Open Meta Business Suite' },
}
export const SEO_SETUP = [
  { id: 'seo-access', title: 'Confirm profile access & business facts', detail: 'Owner keeps ownership. Verify the actual location, services, hours, and booking link.' },
  { id: 'seo-baseline', title: 'Record a local visibility baseline', detail: 'Choose 3 real service queries; save the scan grid settings and export privately.' },
]
export const SETUP = {
  website: [
    { id: 'web-scope', title: 'Confirm pages, content & domain ownership', detail: 'Agree the scope with the owner and gather approved brand assets.' },
    { id: 'web-build', title: 'Review the site with the client', detail: 'Check both languages, service details, and mobile layouts.' },
    { id: 'web-test', title: 'Test forms & booking links', detail: 'Verify actual delivery to the right person using test data, not patient information.' },
    { id: 'web-launch', title: 'Verify launch & hand over access', detail: 'Check the deployed domain, SSL, basic indexing, and agreed maintenance process.' },
  ],
  calls: [
    { id: 'call-scope', title: 'Approve the receptionist’s boundaries', detail: 'Confirm hours, service area, language, escalation, and callback expectations. No invented promises.' },
    { id: 'call-number', title: 'Assign and test the phone number in Vapi', detail: 'Confirm routing with the actual carrier. Do not port the client’s main number for an untested pilot.' },
    { id: 'call-tests', title: 'Test English, Spanish & failure scenarios', detail: 'Test interruptions, incomplete details, emergency instructions, and failed transfers.' },
    { id: 'call-handoff', title: 'Verify lead handoff and privacy settings', detail: 'Test summaries and fallback handling. Confirm recording consent, retention, and any healthcare obligations.' },
    { id: 'call-pilot', title: 'Get approval for a monitored pilot', detail: 'Start with a reversible routing setup and review real-world failures with the owner.' },
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
export const MONTHLY = { seo: MONTHLY_SEO, social: MONTHLY_SOCIAL }
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
