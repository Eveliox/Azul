// Speed-to-lead agent: pure helpers (no network, no database). Orchestration is in lead-agent.js.

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
export function dialPlan(lead, agent, env, now) {
  if (env.LEAD_CALLS_ENABLED !== 'true') return { action: 'skip', notes: 'Automatic calls are switched off.' }
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
