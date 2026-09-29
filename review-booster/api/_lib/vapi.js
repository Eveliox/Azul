// Turns a Vapi end-of-call report into a lead alert email.
// Only summary, structured fields, caller number and the transcript are used — nothing is stored here.

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const clean = (v) => (v == null || v === '' || v === 'null' ? null : String(v).trim())

// Normalise the useful bits out of the raw webhook payload.
export function parseReport(body) {
  const m = body?.message
  if (!m || m.type !== 'end-of-call-report') return null
  const call = m.call || {}
  const analysis = m.analysis || {}
  const sd = analysis.structuredData || {}
  // Structured outputs (newer Vapi UI) arrive keyed by output name; flatten one level if so.
  const fields = Object.values(sd).some((v) => v && typeof v === 'object') ? Object.assign({}, ...Object.values(sd).filter((v) => v && typeof v === 'object')) : sd
  return {
    callId: call.id || null,
    assistantId: call.assistantId || m.assistant?.id || null,
    assistantName: m.assistant?.name || null,
    from: clean(call.customer?.number) || clean(m.customer?.number),
    startedAt: m.startedAt || call.startedAt || null,
    durationSeconds: Math.round(Number(m.durationSeconds ?? 0)),
    endedReason: m.endedReason || null,
    summary: clean(analysis.summary),
    transcript: clean(m.transcript),
    recordingUrl: clean(m.recordingUrl),
    name: clean(fields.caller_name),
    phone: clean(fields.caller_phone),
    service: clean(fields.service_interest),
    callbackTime: clean(fields.callback_time),
    language: clean(fields.language_used),
    urgent: fields.urgent === true,
    leadCaptured: fields.lead_captured === true,
  }
}

// Hang-ups and dead air: no transcript and under ~8 seconds. Not worth an email.
export function isNoise(r) {
  return !r.transcript && !r.summary && r.durationSeconds < 8
}

// Pick the recipient for this call. Routes: { [assistantId]: "a@x.com, b@y.com" }; falls back to VAPI_LEAD_TO.
export function recipientsFor(r, env = process.env) {
  let routes = {}
  try { routes = env.VAPI_LEAD_ROUTES ? JSON.parse(env.VAPI_LEAD_ROUTES) : {} } catch { routes = {} }
  const raw = (r.assistantId && routes[r.assistantId]) || env.VAPI_LEAD_TO || ''
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

export function buildLeadEmail(r, { business = 'your business', includeTranscript = true } = {}) {
  const who = r.name || r.from || 'Unknown caller'
  const urgent = r.urgent ? 'URGENT — ' : ''
  const captured = r.leadCaptured || (r.name && r.phone)
  const subject = `${urgent}New call: ${who}${r.service ? ` · ${r.service}` : ''}${captured ? '' : ' (incomplete)'}`
  const when = r.startedAt ? new Date(r.startedAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) + ' ET' : ''
  const rows = [
    ['Caller', r.name], ['Callback number', r.phone || r.from], ['Interested in', r.service], ['Best time to call back', r.callbackTime],
    ['Language', r.language], ['Call length', r.durationSeconds ? `${Math.floor(r.durationSeconds / 60)}m ${r.durationSeconds % 60}s` : null], ['Received', when],
  ].filter(([, v]) => v)
  const text = [
    `${urgent}New call for ${business}`, '',
    ...rows.map(([k, v]) => `${k}: ${v}`), '',
    r.summary ? `Summary:\n${r.summary}\n` : '',
    !captured ? 'Heads up: the caller did not leave both a name and a number. Check the transcript or call back the number above.\n' : '',
    includeTranscript && r.transcript ? `Transcript:\n${r.transcript.slice(0, 4000)}\n` : '',
    r.recordingUrl ? `Recording: ${r.recordingUrl}` : '',
    '', 'Sent by Azul AI Answering Service. Recordings and transcripts may contain personal information — handle per your privacy policy.',
  ].filter((l) => l !== '').join('\n')
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#29364d">
<div style="background:${r.urgent ? '#c2410c' : '#2563eb'};color:#fff;padding:18px 22px;border-radius:12px 12px 0 0"><div style="font-size:11px;letter-spacing:.12em;opacity:.85">${r.urgent ? 'URGENT CALL' : 'NEW CALL'}</div><div style="font-size:20px;font-weight:600;margin-top:4px">${esc(who)}</div></div>
<div style="border:1px solid #e5e9f2;border-top:0;padding:20px 22px;border-radius:0 0 12px 12px">
<table style="border-collapse:collapse;width:100%;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#7c899e;width:42%">${esc(k)}</td><td style="padding:6px 0;font-weight:500">${k === 'Callback number' ? `<a href="tel:${esc(v)}" style="color:#2563eb">${esc(v)}</a>` : esc(v)}</td></tr>`).join('')}</table>
${r.summary ? `<p style="margin:18px 0 6px;font-size:11px;letter-spacing:.1em;color:#7c899e">SUMMARY</p><p style="margin:0;font-size:14px;line-height:1.6">${esc(r.summary)}</p>` : ''}
${!captured ? `<p style="margin:16px 0 0;padding:12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:13px">The caller did not leave both a name and a number. Check the transcript or call back the number above.</p>` : ''}
${includeTranscript && r.transcript ? `<details style="margin-top:18px"><summary style="cursor:pointer;font-size:13px;color:#2563eb">Show transcript</summary><pre style="white-space:pre-wrap;font:13px/1.6 inherit;background:#f7f9fd;padding:12px;border-radius:8px;margin-top:8px">${esc(r.transcript.slice(0, 4000))}</pre></details>` : ''}
${r.recordingUrl ? `<p style="margin-top:16px;font-size:13px"><a href="${esc(r.recordingUrl)}" style="color:#2563eb">Listen to the recording</a></p>` : ''}
<p style="margin:22px 0 0;font-size:11px;color:#9aa5b8;line-height:1.6">Sent by Azul AI Answering Service. Recordings and transcripts may contain personal information — handle per your privacy policy.</p>
</div></div>`
  return { subject, text, html }
}
