// Speed-to-lead agent: pure helpers (no network, no database). Orchestration is in lead-agent.js.
import { createHmac } from 'node:crypto'

const NY = 'America/New_York'
const DEFAULTS = { timezone: NY, call_start_hour: 8, call_end_hour: 20, call_sundays: false, max_attempts: 3, retry_gap_minutes: 120 }
export const rules = (agent = {}) => {
  const r = { ...DEFAULTS }
  for (const k of Object.keys(DEFAULTS)) if (agent[k] != null) r[k] = agent[k]
  return r
}

const text = (v, max = 300) => {
  const t = String(v ?? '').replace(/\s+/g, ' ').trim()
  return t ? t.slice(0, max) : null
}
const multiline = (v, max) => {
  const t = String(v ?? '').trim()
  return t ? t.slice(0, max) : null
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// US numbers only: 10 digits, or 11 starting with 1. Area code and exchange can't start with 0 or 1.
export function toE164(v) {
  let d = String(v ?? '').replace(/\D/g, '')
  if (d.length === 11 && d[0] === '1') d = d.slice(1)
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d) ? `+1${d}` : null
}

export function firstName(name) {
  const w = String(name ?? '').trim().split(/\s+/)[0]
  return w ? w.slice(0, 40) : 'there'
}

// Field contract from the /speed-to-lead-site skill. Unknown short snake_case fields go to `extra`.
const KNOWN = new Set(['name', 'phone', 'email', 'address', 'zip', 'service', 'details', 'consent', 'consent_text', 'language', 'page_url', 'website', 'submitted_at'])
export function leadFromForm(body = {}) {
  if (!body || typeof body !== 'object') return { error: 'Send the lead as JSON.' }
  if (text(body.website)) return { spam: true }
  const name = text(body.name, 120)
  const phone = toE164(body.phone)
  if (!name) return { error: 'Name is required.' }
  if (!phone) return { error: 'Enter a valid US phone number.' }
  const email = text(body.email, 254)
  const consent = typeof body.consent === 'string' ? body.consent.trim().toLowerCase() : body.consent
  const extra = {}
  for (const [k, v] of Object.entries(body)) {
    if (KNOWN.has(k) || !/^[a-z][a-z0-9_]{0,39}$/.test(k) || Object.keys(extra).length >= 20) continue
    const t = text(typeof v === 'object' ? JSON.stringify(v) : v, 300)
    if (t) extra[k] = t
  }
  return {
    lead: {
      name, phone,
      email: email && EMAIL.test(email) ? email : null,
      address: text(body.address, 300),
      zip: text(body.zip, 20),
      service: text(body.service, 120),
      details: multiline(body.details, 2000),
      language: body.language === 'es' ? 'es' : 'en',
      consent: [true, 'yes', 'true', 'on', '1'].includes(consent),
      consent_text: text(body.consent_text, 1000),
      page_url: text(body.page_url, 500),
      extra,
    },
  }
}

// ── Time ────────────────────────────────────────────────────────────
const formatters = new Map()
const partsFormatter = (tz) => {
  if (!formatters.has(tz)) formatters.set(tz, new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short' }))
  return formatters.get(tz)
}
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export function localParts(date, tz = NY) {
  const o = {}
  for (const p of partsFormatter(tz).formatToParts(date)) o[p.type] = p.value
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, wd: WEEKDAYS.indexOf(o.weekday) }
}
// Wall-clock time in `tz` → instant. Two passes settle daylight-saving changes.
function zonedToUtc(y, m, d, h, min, tz) {
  const wall = Date.UTC(y, m - 1, d, h, min)
  const offset = (t) => { const p = localParts(new Date(t), tz); return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - t }
  const first = wall - offset(wall)
  return new Date(wall - offset(first))
}
const isOpen = (p, r) => (r.call_sundays || p.wd !== 0) && p.h >= r.call_start_hour && p.h < r.call_end_hour

// `from` if it's inside calling hours, otherwise the next opening (e.g. 8:00 AM, skipping Sundays).
export function nextCallTime(from, agent) {
  const r = rules(agent)
  const p = localParts(from, r.timezone)
  if (isOpen(p, r)) return from
  for (let i = 0; i < 8; i++) {
    const day = new Date(Date.UTC(p.y, p.m - 1, p.d + i))
    const t = zonedToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), r.call_start_hour, 0, r.timezone)
    if (t > from && isOpen(localParts(t, r.timezone), r)) return t
  }
  throw new Error('No calling hours configured')
}

// When to try again after an unanswered or failed call.
export function nextRetryTime(lead, agent, now) {
  const r = rules(agent)
  const last = lead?.last_attempt_at ? new Date(lead.last_attempt_at).getTime() : now.getTime()
  const earliest = new Date(Math.max(now.getTime(), last + r.retry_gap_minutes * 60_000))
  return nextCallTime(earliest, agent).toISOString()
}

// "Tuesday, October 21, 2026 2:00 PM", the format the assistant prompt expects in {{today}}.
export function todayText(now, tz = NY) {
  const o = {}
  for (const p of new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(now)) o[p.type] = p.value
  return `${o.weekday}, ${o.month} ${o.day}, ${o.year} ${o.hour}:${o.minute} ${o.dayPeriod}`
}

// ISO time → instant. A time with no Z or ±hh:mm offset is read as wall-clock time in `tz`
// (new Date() would read it as UTC on Vercel, 4–5 hours off). Anything else → null.
export function parseInstant(value, tz = NY) {
  const s = String(value ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s)) {
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(:\d{2}(\.\d+)?)?$/)
  return m ? zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], tz) : null
}

export function formatWhen(value, tz = NY, language = 'en') {
  const d = value instanceof Date ? value : parseInstant(value, tz)
  if (!d) return value ? String(value) : null
  if (language === 'es') {
    // "jueves 12 de noviembre a las 9:00 a.m." ("a la 1:00" for one o'clock)
    const date = d.toLocaleDateString('es-US', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '')
    const time = d.toLocaleTimeString('es-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' })
    return `${date} ${time.startsWith('1:') ? 'a la' : 'a las'} ${time}`
  }
  return d.toLocaleString('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// ── Calling ─────────────────────────────────────────────────────────
// What to do with a lead that holds a dialing lease.
export function dialPlan(lead, agent, env, now, { test = false } = {}) {
  if (env.LEAD_CALLS_ENABLED !== 'true') return { action: 'skip', notes: 'Automatic calls are switched off.' }
  // Test calls from the dashboard only go to the business's test numbers, at any hour, in any mode.
  if (test) return (agent.test_numbers || []).includes(lead.phone) ? { action: 'call' } : { action: 'skip', notes: 'Test calls only go to the test numbers.' }
  if (agent.mode === 'paused') return { action: 'skip', notes: 'The agent is paused for this business.' }
  if (agent.mode !== 'active' && !(agent.test_numbers || []).includes(lead.phone)) return { action: 'skip', notes: 'Testing mode: this number is not on the test list.' }
  const next = nextCallTime(now, agent)
  if (next.getTime() !== now.getTime()) return { action: 'defer', next_attempt_at: next.toISOString(), notes: 'Outside calling hours' }
  return { action: 'call' }
}

// Body for Vapi POST /call. Same variables the Make scenario sent.
export function vapiCallBody(lead, agent, now) {
  return {
    assistantId: agent.vapi_assistant_id,
    phoneNumberId: agent.vapi_phone_number_id,
    customer: { number: lead.phone, name: String(lead.name).slice(0, 40) },
    assistantOverrides: {
      variableValues: {
        name: firstName(lead.name),
        business: agent.business_name,
        service: lead.service || 'your request',
        address: lead.address || lead.zip || '',
        zip: lead.zip || '',
        details: lead.details || '',
        language: lead.language || 'en',
        today: todayText(now, rules(agent).timezone),
      },
    },
  }
}

// ── End-of-call report ──────────────────────────────────────────────
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
export function parseCallReport(message = {}) {
  const fields = {}
  // Older Vapi UI: analysis.structuredData, sometimes nested one level by output name.
  const sd = message.analysis?.structuredData
  if (isObj(sd)) Object.values(sd).some(isObj) ? Object.values(sd).filter(isObj).forEach((v) => Object.assign(fields, v)) : Object.assign(fields, sd)
  // Structured Outputs (what Test AC uses): artifact.structuredOutputs.<id>.result. Takes priority.
  const so = message.artifact?.structuredOutputs || message.call?.artifact?.structuredOutputs
  if (isObj(so)) for (const v of Object.values(so)) if (isObj(v?.result)) Object.assign(fields, v.result)
  return {
    callId: message.call?.id || null,
    endedReason: message.endedReason || message.call?.endedReason || null,
    summary: multiline(message.analysis?.summary || message.summary, 4000),
    transcript: multiline(message.transcript || message.artifact?.transcript, 20000),
    recordingUrl: text(message.recordingUrl || message.artifact?.recordingUrl, 500),
    durationSeconds: Math.round(Number(message.durationSeconds ?? 0)) || 0,
    fields,
  }
}

const NO_ANSWER = /voicemail|did-not-answer|no-answer|busy|failed-to-connect/
const TRANSFERRED = /forward|transfer/
const yes = (v) => v === true || v === 'true'

// Decides the lead's next status from a call report. `lead.attempts` already counts this call.
export function outcomeFromReport(report, lead, agent, now) {
  const f = report.fields || {}
  const booked = yes(f.appointment_booked)
  const reason = String(report.endedReason || '').toLowerCase()
  const base = {
    ended_reason: report.endedReason || null,
    booked,
    appointment_time: booked ? text(f.appointment_time, 100) : null,
    summary: report.summary || null,
    do_not_call: yes(f.do_not_call),
  }
  if (booked) return { ...base, status: 'booked' }
  if (base.do_not_call) return { ...base, status: 'stopped' }
  if (TRANSFERRED.test(reason)) return { ...base, status: 'handed_off' }
  if (NO_ANSWER.test(reason)) {
    if ((lead.attempts || 0) >= rules(agent).max_attempts) return { ...base, status: 'no_answer' }
    return { ...base, status: 'retry', next_attempt_at: nextRetryTime(lead, agent, now) }
  }
  return { ...base, status: 'needs_owner' }
}

// ── Email ───────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim()

// Invalid entries (e.g. a leftover placeholder) are dropped so they can't make Resend reject the whole email.
export const ownerRecipients = (agent) => String(agent?.owner_email || '').split(',').map((s) => s.trim()).filter((s) => EMAIL.test(s))

// "Test AC Co." <leads@azulwebdev.com>, using the address from LEAD_EMAIL_FROM or EMAIL_FROM.
export function senderFor(displayName, env) {
  const raw = env.LEAD_EMAIL_FROM || env.EMAIL_FROM || ''
  const address = raw.match(/<([^>]+)>/)?.[1] || raw.trim()
  if (!address) return undefined
  const name = oneLine(displayName).replace(/["<>\\]/g, '').slice(0, 80)
  return name ? `"${name}" <${address}>` : address
}

function layout({ heading, intro, rows, sections = [] }) {
  const shown = rows.filter(([, v]) => v)
  const text = [heading, intro, '', ...shown.map(([k, v]) => `${k}: ${v}`), ...sections.flatMap(([title, body]) => ['', `${title}:`, body])].filter((l) => l != null).join('\n')
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;max-width:600px">
<h2 style="font-size:18px;margin:0 0 8px">${esc(heading)}</h2>${intro ? `<p style="margin:0 0 12px">${esc(intro)}</p>` : ''}
<table style="border-collapse:collapse">${shown.map(([k, v, href]) => `<tr><td style="padding:3px 12px 3px 0;color:#6b7280;vertical-align:top">${esc(k)}</td><td style="padding:3px 0">${href ? `<a href="${esc(href)}">${esc(v)}</a>` : esc(v)}</td></tr>`).join('')}</table>
${sections.map(([title, body]) => `<h3 style="font-size:15px;margin:16px 0 4px">${esc(title)}</h3><div style="white-space:pre-wrap">${esc(body)}</div>`).join('')}</div>`
  return { text, html }
}

function leadRows(lead) {
  return [
    ['Name', lead.name],
    ['Phone', lead.phone, lead.phone ? `tel:${lead.phone}` : null],
    ['Email', lead.email, lead.email ? `mailto:${lead.email}` : null],
    ['Service', lead.service],
    ['Address', [lead.address, lead.zip].filter(Boolean).join(' ') || null],
    ['Details', lead.details],
    ['Language', lead.language === 'es' ? 'Spanish' : null],
    ['Received', lead.received_at ? formatWhen(lead.received_at) : null],
  ]
}

const who = (lead) => oneLine(lead.name || lead.phone || 'New lead').slice(0, 80)

// Sent to the owner after every call the agent makes.
export function ownerCallEmail({ lead, agent, outcome, report }) {
  const tz = rules(agent).timezone
  const max = rules(agent).max_attempts
  const when = formatWhen(outcome.appointment_time, tz)
  const headline = {
    booked: `Booked: ${who(lead)}${when ? ` · ${when}` : ''}`,
    stopped: `Asked not to be called again: ${who(lead)}`,
    handed_off: `Transferred to you: ${who(lead)}`,
    retry: `No answer (call ${lead.attempts} of ${max}): ${who(lead)}`,
    no_answer: `No answer after ${lead.attempts} calls: ${who(lead)}`,
    needs_owner: `Call this lead back: ${who(lead)}`,
  }[outcome.status] || `Call ended: ${who(lead)}`
  const intro = {
    booked: lead.email ? 'The agent booked a visit. The customer got a confirmation email.' : 'The agent booked a visit.',
    stopped: 'They asked not to be called again. The agent added them to the do-not-contact list.',
    handed_off: 'The agent transferred this call to you.',
    retry: `The agent will try again ${formatWhen(outcome.next_attempt_at, tz)}.`,
    no_answer: 'The agent has stopped trying. Call or text them yourself.',
    needs_owner: 'The call ended without a booking. Read the summary and call them back.',
  }[outcome.status] || ''
  const secs = report?.durationSeconds || 0
  const { text, html } = layout({
    heading: headline,
    intro,
    rows: [
      ...leadRows(lead),
      ['Appointment', when],
      ['Call length', secs ? `${Math.floor(secs / 60)}m ${secs % 60}s` : null],
      ['Call ended', outcome.ended_reason],
      ['Recording', report?.recordingUrl ? 'Listen' : null, report?.recordingUrl],
    ],
    sections: [
      ...(outcome.summary ? [['Summary', outcome.summary]] : []),
      ...(report?.transcript ? [['Transcript', report.transcript.slice(0, 6000)]] : []),
    ],
  })
  return { subject: headline, text, html }
}

// Sent to the owner when the agent did not (or could not) call a lead.
export function ownerAlertEmail({ lead, title, reason }) {
  const subject = `${oneLine(title)}: ${who(lead)}`
  const { text, html } = layout({ heading: subject, intro: reason, rows: leadRows(lead) })
  return { subject, text, html }
}

// Sent to the customer after a booking. Null when the time can't be read.
export function leadConfirmationEmail({ lead, agent, appointmentTime }) {
  if (!parseInstant(appointmentTime, rules(agent).timezone)) return null
  const es = lead.language === 'es'
  const when = formatWhen(appointmentTime, rules(agent).timezone, lead.language)
  const business = oneLine(agent.business_name)
  const place = lead.address ? (es ? ` en ${lead.address}` : ` at ${lead.address}`) : ''
  const subject = es ? `${business}: su visita está reservada para el ${when}` : `${business}: you're booked for ${when}`
  const body = es
    ? `Hola ${firstName(lead.name)}, su visita con ${business} está reservada para el ${when}${place}. Si necesita cambiarla, responda a este correo.`
    : `Hi ${firstName(lead.name)}, your visit with ${business} is booked for ${when}${place}. If you need to change it, reply to this email.`
  return {
    subject,
    text: body,
    html: `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2937"><p>${esc(body)}</p></div>`,
  }
}

// ── Owner first (Twilio) ────────────────────────────────────────────

export const publicBase = (env) => String(env.LEAD_PUBLIC_URL || 'https://app.azulwebdev.com').replace(/\/+$/, '')
// Callback URLs are always built (and re-built for signature checks) from these two params, in this order.
export const callEndedUrl = (env) => `${publicBase(env)}/api/leads/call-ended`
export const ownerUrl = (env, step, leadId) => `${publicBase(env)}/api/leads/owner?step=${encodeURIComponent(step)}&lead=${encodeURIComponent(leadId)}`

// Twilio's X-Twilio-Signature: base64 HMAC-SHA1 of the URL plus every POST param (sorted by name, name+value).
export function twilioSignature(url, params, authToken) {
  const data = Object.keys(params || {}).sort().reduce((s, k) => s + k + (params[k] ?? ''), url)
  return createHmac('sha1', authToken).update(Buffer.from(data, 'utf8')).digest('base64')
}

const xml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]))
// Spoken text: no symbols that read badly or break the voice.
const speakable = (s, max = 60) => String(s ?? '').replace(/[<>&"{}[\]\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)

// What the owner hears when their phone rings. Pressing 1 connects them to the lead.
export function ownerCallTwiml(lead, env) {
  const who = (String(lead.name ?? '').trim() && speakable(firstName(lead.name))) || 'a new customer'
  const what = speakable(lead.service) || 'a request'
  const action = xml(ownerUrl(env, 'pressed', lead.id))
  return `<Response><Gather numDigits="1" timeout="8" action="${action}" method="POST"><Say>New website lead. ${xml(who)}, ${xml(what)}. Press 1 to call them now.</Say><Pause length="1"/><Say>Press 1 to call them now.</Say></Gather><Say>Okay, the assistant will call them.</Say></Response>`
}
export function ownerDialTwiml(lead, agent, env) {
  return `<Response><Say>Connecting you now.</Say><Dial callerId="${xml(agent.twilio_number)}" timeout="25" action="${xml(ownerUrl(env, 'dial_done', lead.id))}" method="POST"><Number>${xml(lead.phone)}</Number></Dial></Response>`
}
export const sayTwiml = (text) => text ? `<Response><Say>${xml(text)}</Say></Response>` : '<Response/>'

// ── Dashboard ───────────────────────────────────────────────────────
const NEEDS_YOU = ['needs_owner', 'no_answer', 'failed', 'blocked']
// Numbers for the client's dashboard. "This month" is the calendar month in the agent's timezone.
export function leadStats(leads, agent, now) {
  const r = rules(agent)
  const p = localParts(now, r.timezone)
  const month = leads.filter((l) => { const q = localParts(new Date(l.received_at), r.timezone); return q.y === p.y && q.m === p.m })
  // Speed is measured only on leads that arrived during calling hours with consent (after-hours leads wait on purpose).
  const timed = month.filter((l) => l.consent && l.first_call_at && nextCallTime(new Date(l.received_at), agent).getTime() === new Date(l.received_at).getTime())
    .map((l) => Math.max(0, (new Date(l.first_call_at) - new Date(l.received_at)) / 1000)).sort((a, b) => a - b)
  const median = timed.length ? timed[Math.floor((timed.length - 1) / 2)] : null
  return {
    leads: month.length,
    called: month.filter((l) => l.first_call_at).length,
    booked: month.filter((l) => l.booked || l.status === 'booked').length,
    needs_you: leads.filter((l) => NEEDS_YOU.includes(l.status)).length,
    median_seconds_to_call: median == null ? null : Math.round(median),
    within_minute: timed.length ? Math.round(timed.filter((s) => s <= 60).length / timed.length * 100) : null,
  }
}

// What a business's team may see about its agent. Azul (master) also gets IDs and the form key.
const CLIENT_AGENT_FIELDS = ['client_id', 'mode', 'assistant_mode', 'business_name', 'timezone', 'call_start_hour', 'call_end_hour', 'call_sundays', 'max_attempts', 'retry_gap_minutes', 'owner_first', 'updated_at']
export const agentForViewer = (agent, isMaster) => !agent ? null : isMaster ? agent : Object.fromEntries(CLIENT_AGENT_FIELDS.map((k) => [k, agent[k]]))

const ID = /^[A-Za-z0-9-]{1,100}$/
const int = (v) => (v === '' || v == null ? NaN : Number(v))
// Validates the agent setup form. Returns { row } or { error }.
export function validateAgentSettings(b = {}) {
  const row = {
    business_name: text(b.business_name, 120),
    vapi_assistant_id: text(b.vapi_assistant_id, 100),
    vapi_phone_number_id: text(b.vapi_phone_number_id, 100),
    mode: ['testing', 'active', 'paused'].includes(b.mode) ? b.mode : null,
    timezone: text(b.timezone, 60) || NY,
    call_start_hour: int(b.call_start_hour ?? 8),
    call_end_hour: int(b.call_end_hour ?? 20),
    call_sundays: b.call_sundays === true,
    max_attempts: int(b.max_attempts ?? 3),
    retry_gap_minutes: int(b.retry_gap_minutes ?? 120),
    owner_first: b.owner_first === true,
    assistant_mode: b.assistant_mode === 'azul' ? 'azul' : 'vapi',
    calendar_id: text(b.calendar_id, 260) || null,
    calendar_tool_ids: (Array.isArray(b.calendar_tool_ids) ? b.calendar_tool_ids : String(b.calendar_tool_ids || '').split(/[,\s]+/)).map((s) => String(s).trim()).filter(Boolean),
  }
  if (!row.vapi_assistant_id) row.vapi_assistant_id = null
  if (!row.business_name) return { error: 'Business name (as callers hear it) is required.' }
  if (row.assistant_mode === 'vapi' ? !ID.test(row.vapi_assistant_id || '') : row.vapi_assistant_id && !ID.test(row.vapi_assistant_id)) return { error: 'Vapi assistant ID is required in "Vapi assistant" mode (letters, numbers and dashes).' }
  if (row.calendar_tool_ids.length > 5 || row.calendar_tool_ids.some((t) => !ID.test(t))) return { error: 'Calendar tool IDs: up to 5, letters, numbers and dashes.' }
  if (row.calendar_id && !/^[A-Za-z0-9._%+-]{1,150}@[A-Za-z0-9.-]{3,100}$/.test(row.calendar_id)) return { error: 'Calendar ID looks wrong. Copy it from Google Calendar → the calendar\'s Settings → Integrate calendar (it ends in @group.calendar.google.com or @gmail.com).' }
  if (row.assistant_mode === 'azul' && !row.calendar_id && !row.calendar_tool_ids.length) return { error: 'Azul template mode needs the business\'s Google Calendar ID.' }
  if (!ID.test(row.vapi_phone_number_id || '')) return { error: 'Vapi phone number ID is required (letters, numbers and dashes).' }
  if (!row.mode) return { error: 'Choose a mode.' }
  try { new Intl.DateTimeFormat('en-US', { timeZone: row.timezone }) } catch { return { error: 'Unknown timezone.' } }
  if (!Number.isInteger(row.call_start_hour) || !Number.isInteger(row.call_end_hour) || row.call_start_hour < 0 || row.call_end_hour > 24 || row.call_end_hour <= row.call_start_hour) return { error: 'Calling hours must be whole hours, with the end after the start.' }
  if (!Number.isInteger(row.max_attempts) || row.max_attempts < 1 || row.max_attempts > 5) return { error: 'Calls per lead must be 1 to 5.' }
  if (!Number.isInteger(row.retry_gap_minutes) || row.retry_gap_minutes < 30 || row.retry_gap_minutes > 1440) return { error: 'Time between calls must be 30 to 1440 minutes.' }
  const emails = String(b.owner_email || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!emails.length || emails.some((e) => !EMAIL.test(e))) return { error: 'Enter the owner email (several allowed, separated by commas).' }
  row.owner_email = emails.join(', ').slice(0, 500)
  for (const [key, label] of [['owner_cell', 'Owner cell'], ['twilio_number', 'Business (Twilio) number']]) {
    const raw = text(b[key], 40)
    row[key] = raw ? toE164(raw) : null
    if (raw && !row[key]) return { error: `${label} must be a valid US number.` }
  }
  if (row.owner_first && (!row.owner_cell || !row.twilio_number)) return { error: 'Owner first needs the owner cell and the business Twilio number.' }
  const tests = (Array.isArray(b.test_numbers) ? b.test_numbers : String(b.test_numbers || '').split(/[,\n]/)).map((s) => String(s).trim()).filter(Boolean)
  row.test_numbers = tests.map(toE164)
  if (row.test_numbers.some((n) => !n)) return { error: 'Test numbers must be valid US numbers.' }
  if (row.test_numbers.length > 10) return { error: 'Up to 10 test numbers.' }
  if (row.mode === 'testing' && !row.test_numbers.length) return { error: 'Testing mode needs at least one test number (your own phone).' }
  return { row }
}

// Sent to the owner when a lead (or anyone) calls the business number back.
export function inboundOwnerEmail({ phone, lead, agent, outcome, report }) {
  const name = lead?.name ? oneLine(lead.name).slice(0, 80) : phone || 'Unknown caller'
  const when = formatWhen(outcome.appointment_time, rules(agent).timezone)
  const subject = outcome.booked ? `Booked on a callback: ${name}${when ? ` · ${when}` : ''}` : outcome.do_not_call ? `Asked not to be called: ${name}` : `Called back: ${name}`
  const intro = outcome.booked ? 'They called the business number back and booked a visit.'
    : outcome.do_not_call ? 'They called back and asked not to be called again. The agent added them to the do-not-contact list.'
    : lead ? 'They called the business number back. The agent stopped any queued calls; read the summary and follow up.' : 'Someone called the business number. They are not one of your website leads.'
  const secs = report?.durationSeconds || 0
  const { text: body, html } = layout({
    heading: subject, intro,
    rows: [...(lead ? leadRows(lead) : [['Phone', phone, phone ? `tel:${phone}` : null]]), ['Appointment', when], ['Call length', secs ? `${Math.floor(secs / 60)}m ${secs % 60}s` : null], ['Recording', report?.recordingUrl ? 'Listen' : null, report?.recordingUrl]],
    sections: [...(outcome.summary ? [['Summary', outcome.summary]] : []), ...(report?.transcript ? [['Transcript', report.transcript.slice(0, 6000)]] : [])],
  })
  return { subject, text: body, html }
}
