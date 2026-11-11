// Speed-to-lead agent: daily check-in email (Azul), weekly results email (owners),
// owner controls and the hosted lead form. Pure functions; lead-agent.js does the I/O.
import { localParts, nextCallTime, toE164, formatWhen } from './leads.js'

const NY = 'America/New_York'
// Florida's telemarketing law allows calls 8 AM to 8 PM (recipient's time). Nobody can widen that.
export const CALL_EARLIEST = 8, CALL_LATEST = 20
const DAY = 86_400_000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const money = (n) => `$${(Math.round((Number(n) || 0) * 100) / 100).toFixed(2)}`
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const secs = (s) => (s == null ? '—' : s < 60 ? `${s} sec` : `${Math.round(s / 60)} min`)
const NEEDS_YOU = ['needs_owner', 'no_answer', 'failed', 'blocked']
const CREDIT_ERROR = /\b402\b|credit|balance|payment|billing/i
export const DASHBOARD_URL = 'https://app.azulwebdev.com/admin'

function median(values) {
  const v = values.filter((x) => x != null).sort((a, b) => a - b)
  return v.length ? Math.round(v[Math.floor((v.length - 1) / 2)]) : null
}
// Seconds from form to first call, for leads that arrived during calling hours with consent.
function speeds(leads, agent) {
  return leads.filter((l) => l.consent && l.first_call_at && nextCallTime(new Date(l.received_at), agent).getTime() === new Date(l.received_at).getTime())
    .map((l) => Math.max(0, (new Date(l.first_call_at) - new Date(l.received_at)) / 1000))
}
function monthStartMs(now, tz) {
  const p = localParts(now, tz)
  return Date.UTC(p.y, p.m - 1, 1) - 14 * 3600_000 // a little before local midnight, safe for US zones
}

// ── Daily check-in (to Azul) ────────────────────────────────────────
// agents: rb_lead_agents rows with client_name; leads: last 8 days (no tests); calls: last ~32 days.
export function dailyDigest({ agents, leads, calls, now, callsEnabled = true }) {
  const since24 = now.getTime() - DAY, since7 = now.getTime() - 7 * DAY, month = monthStartMs(now, NY)
  const rows = agents.map((a) => {
    const mine = leads.filter((l) => l.client_id === a.client_id)
    const day = mine.filter((l) => new Date(l.received_at).getTime() >= since24)
    const myCalls = calls.filter((c) => c.client_id === a.client_id)
    const cost = (from) => myCalls.filter((c) => new Date(c.placed_at).getTime() >= from).reduce((s, c) => s + (Number(c.cost_usd) || 0), 0)
    const alerts = []
    const failed = day.filter((l) => l.status === 'failed' || l.last_error)
    if (day.some((l) => CREDIT_ERROR.test(l.last_error || ''))) alerts.push('Vapi may be out of credits: calls failed with a payment error')
    else if (failed.length) alerts.push(`${plural(failed.length, 'call')} could not be placed`)
    if (a.mode === 'active' && !mine.some((l) => new Date(l.received_at).getTime() >= since7)) alerts.push('No leads in 7 days: check their website form')
    const needsYou = mine.filter((l) => NEEDS_YOU.includes(l.status)).length
    return {
      name: a.client_name || a.business_name, mode: a.mode,
      leads24: day.length, called24: day.filter((l) => l.first_call_at).length, booked24: day.filter((l) => l.booked).length,
      needsYou, cost24: cost(since24), costMonth: cost(month),
      leadsMonth: mine.filter((l) => new Date(l.received_at).getTime() >= month).length, alerts,
    }
  }).sort((x, y) => y.alerts.length - x.alerts.length || y.leads24 - x.leads24)
  const total = (k) => rows.reduce((s, r) => s + r[k], 0)
  const alertCount = rows.reduce((s, r) => s + r.alerts.length, 0)
  const off = callsEnabled ? '' : 'Automatic calls are OFF for every business (LEAD_CALLS_ENABLED in Vercel). Leads are saved and emailed, not called.'
  const subject = `Azul daily: ${off ? 'CALLS OFF · ' : ''}${plural(total('leads24'), 'lead')}, ${total('booked24')} booked${alertCount ? ` · ${alertCount} to check` : ''}`
  const lines = rows.map((r) => `${r.name} [${r.mode}]: ${r.leads24} leads, ${r.called24} called, ${r.booked24} booked, ${r.needsYou} need the owner, cost ${money(r.cost24)} (month ${money(r.costMonth)}${r.leadsMonth ? `, ${money(r.costMonth / r.leadsMonth)}/lead` : ''})${r.alerts.map((x) => `\n  ! ${x}`).join('')}`)
  const text = [subject, ...(off ? ['', off] : []), '', ...lines, '', 'Last 24 hours, test calls excluded. If this email ever stops arriving, the 5-minute scheduler is down (Supabase cron job azul-lead-retries).', DASHBOARD_URL].join('\n')
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#1f2937;max-width:680px">
<h2 style="font-size:18px;margin:0 0 4px">${esc(subject)}</h2>${off ? `<p style="margin:0 0 10px;color:#b45309;font-weight:600">${esc(off)}</p>` : ''}<p style="margin:0 0 14px;color:#6b7280">Last 24 hours, test calls excluded.</p>
<table style="border-collapse:collapse;width:100%"><tr style="text-align:left;color:#6b7280;font-size:12px"><th style="padding:6px 8px 6px 0">Business</th><th>Leads</th><th>Called</th><th>Booked</th><th>Need owner</th><th>Cost 24h</th><th>Cost month</th></tr>
${rows.map((r) => `<tr style="border-top:1px solid #eee"><td style="padding:8px 8px 8px 0"><b>${esc(r.name)}</b> <span style="color:#9ca3af">${esc(r.mode)}</span>${r.alerts.map((x) => `<div style="color:#b45309;font-size:12px">⚠ ${esc(x)}</div>`).join('')}</td><td>${r.leads24}</td><td>${r.called24}</td><td>${r.booked24}</td><td>${r.needsYou}</td><td>${money(r.cost24)}</td><td>${money(r.costMonth)}${r.leadsMonth ? `<div style="color:#9ca3af;font-size:11px">${money(r.costMonth / r.leadsMonth)}/lead</div>` : ''}</td></tr>`).join('')}
</table><p style="color:#9ca3af;font-size:12px;margin-top:16px">If this email ever stops arriving, the 5-minute scheduler is down (Supabase cron job azul-lead-retries). <a href="${DASHBOARD_URL}">Open the dashboard</a></p></div>`
  return { subject, text, html, rows }
}

// ── Weekly results (to each owner) ──────────────────────────────────
const LABEL = { needs_owner: 'Call them back', no_answer: 'No answer', failed: 'Call failed', blocked: 'Do not contact' }
export function weeklyOwnerEmail({ agent, leads, now }) {
  const tz = agent.timezone || NY
  const week = leads.filter((l) => new Date(l.received_at).getTime() >= now.getTime() - 7 * DAY)
  const booked = week.filter((l) => l.booked).length
  const called = week.filter((l) => l.first_call_at).length
  const speed = median(speeds(week, agent))
  const needs = week.filter((l) => NEEDS_YOU.includes(l.status)).slice(0, 10)
  const business = String(agent.business_name || '').replace(/[\r\n]+/g, ' ')
  const subject = week.length ? `${business}: ${plural(week.length, 'lead')} this week, ${booked} booked` : `${business}: no new leads this week`
  const facts = week.length
    ? [['New leads', week.length], ['Called by your agent', called], ['Typical time to first call', secs(speed)], ['Visits booked', booked]]
    : []
  const intro = week.length ? 'Here is what your speed-to-lead agent did in the last 7 days.' : 'No one filled in your form in the last 7 days. If you expected leads, reply to this email and we will check your form.'
  const needLines = needs.map((l) => `${l.name} · ${l.phone} · ${LABEL[l.status] || l.status}${l.service ? ` · ${l.service}` : ''}`)
  const text = [subject, intro, '', ...facts.map(([k, v]) => `${k}: ${v}`), ...(needs.length ? ['', 'Still need you:', ...needLines] : []), '', `See every lead: ${DASHBOARD_URL}`].join('\n')
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;max-width:600px">
<h2 style="font-size:18px;margin:0 0 8px">${esc(subject)}</h2><p style="margin:0 0 14px">${esc(intro)}</p>
${facts.length ? `<table style="border-collapse:collapse">${facts.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">${esc(k)}</td><td style="font-weight:600">${esc(v)}</td></tr>`).join('')}</table>` : ''}
${needs.length ? `<h3 style="font-size:15px;margin:18px 0 6px">Still need you</h3><ul style="padding-left:18px;margin:0">${needs.map((l) => `<li><b>${esc(l.name)}</b> · <a href="tel:${esc(l.phone)}">${esc(l.phone)}</a> · ${esc(LABEL[l.status] || l.status)}${l.service ? ` · ${esc(l.service)}` : ''}</li>`).join('')}</ul>` : ''}
<p style="margin-top:18px"><a href="${DASHBOARD_URL}">See every lead and call summary</a></p>
<p style="color:#9ca3af;font-size:12px">Week ending ${esc(formatWhen(now.toISOString(), tz))}. Sent by Azul every Monday.</p></div>`
  return { subject, text, html }
}

// ── Owner controls ──────────────────────────────────────────────────
// What a business's own team may change. Going live from testing, numbers and Vapi stay with Azul.
export function validateControls(b = {}, agent = {}) {
  const row = {}
  if (b.mode !== undefined && b.mode !== agent.mode) {
    if (!['active', 'paused'].includes(agent.mode)) return { error: 'Your agent is still in testing. Azul switches it on after the test calls.' }
    if (!['active', 'paused'].includes(b.mode)) return { error: 'Choose on or paused.' }
    row.mode = b.mode
  }
  const int = (v, d) => (v === '' || v == null ? d : Number(v))
  row.call_start_hour = int(b.call_start_hour, agent.call_start_hour ?? 8)
  row.call_end_hour = int(b.call_end_hour, agent.call_end_hour ?? 20)
  if (![row.call_start_hour, row.call_end_hour].every(Number.isInteger) || row.call_start_hour < CALL_EARLIEST || row.call_end_hour > CALL_LATEST || row.call_end_hour <= row.call_start_hour) return { error: 'Calling hours must be between 8 AM and 8 PM (Florida law), with the end after the start.' }
  row.call_sundays = b.call_sundays === true
  row.weekly_email = b.weekly_email !== false
  const emails = String(b.owner_email ?? agent.owner_email ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!emails.length || emails.some((e) => !EMAIL.test(e))) return { error: 'Enter at least one email for lead alerts (several allowed, separated by commas).' }
  row.owner_email = emails.join(', ').slice(0, 500)
  const cellRaw = String(b.owner_cell ?? '').trim()
  row.owner_cell = cellRaw ? toE164(cellRaw) : null
  if (cellRaw && !row.owner_cell) return { error: 'Your cell must be a valid US number.' }
  row.owner_first = b.owner_first === true
  if (row.owner_first && (!row.owner_cell || !agent.twilio_number)) return { error: 'Ring-me-first needs your cell number (and Azul must have set up the business number).' }
  return { row }
}

// ── Hosted lead form ────────────────────────────────────────────────
export function hostedConsentText(business, language) {
  const b = String(business || '').replace(/[\r\n]+/g, ' ').slice(0, 120)
  return language === 'es'
    ? `Acepto que ${b} me llame y me envíe mensajes de texto a este número, incluso con un asistente de IA y tecnología automatizada, sobre mi solicitud. El consentimiento no es necesario para comprar. Pueden aplicarse tarifas de mensajes y datos. Responda PARAR para cancelar.`
    : `I agree that ${b} may call and text me at this number, including with an AI assistant and automated technology, about my request. Consent is not required to buy. Msg & data rates may apply. Reply STOP to opt out.`
}
export const HOSTED_HOURLY_LIMIT = 30   // hosted-form leads per business per hour
export const HOSTED_PER_IP_HOURLY = 3   // per visitor
export const HOSTED_PER_PHONE_DAILY = 3 // per phone number
