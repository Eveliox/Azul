import { db } from './_lib/db.js'
import { authenticate, readJson } from './_lib/auth.js'
import { sendEmail } from './_lib/email.js'
import { sendSms } from './_lib/sms.js'
import { PRESETS, FIELDS, resolveMessages, normalizeMessages, validateMessages, renderFor } from './_lib/messages.js'

// GET  /api/messages?client_id=…            → presets + this client's current text
// PUT  /api/messages?client_id=…            → { tone, messages } save edits
// POST /api/messages?client_id=…&test=1     → { language } send the real message to the owner
// A business key is always pinned to its own client.
export default async function handler(req, res) {
  const auth = await authenticate(req, res)
  if (!auth) return
  const clientId = auth.role === 'client' ? auth.clientId : req.query.client_id
  if (!clientId) return res.status(400).json({ error: 'client_id required' })

  const { data: client, error } = await db()
    .from('rb_clients').select('id, name, tone, messages, owner_email, owner_phone').eq('id', clientId).single()
  if (error) return res.status(500).json({ error: error.message })
  if (!client) return res.status(404).json({ error: 'Client not found' })

  if (req.method === 'GET') {
    return res.json({
      tone: client.tone || 'friendly',
      presets: Object.fromEntries(Object.entries(PRESETS).map(([k, v]) => [k, { label: v.label, en: v.en, es: v.es }])),
      current: { en: resolveMessages(client, 'en'), es: resolveMessages(client, 'es') },
      fields: FIELDS,
    })
  }

  if (req.method === 'PUT') {
    const b = readJson(req)
    const tone = PRESETS[b.tone] ? b.tone : client.tone || 'friendly'
    const problems = validateMessages(b.messages)
    if (problems.length) return res.status(400).json({ error: problems.join('; ') })
    const messages = normalizeMessages(b.messages, tone)
    const { error: uErr } = await db().from('rb_clients').update({ tone, messages }).eq('id', client.id)
    if (uErr) return res.status(500).json({ error: uErr.message })
    const updated = { ...client, tone, messages }
    return res.json({ tone, current: { en: resolveMessages(updated, 'en'), es: resolveMessages(updated, 'es') } })
  }

  if (req.method === 'POST' && req.query.test) {
    if (!client.owner_email) return res.status(400).json({ error: 'Add an owner email to this client first' })
    const b = readJson(req)
    const lang = b.language === 'es' ? 'es' : 'en'
    const draft = b.messages ? { ...client, tone: b.tone || client.tone, messages: normalizeMessages(b.messages, b.tone || client.tone) } : client
    const r = renderFor(draft, lang, { customer: 'Maria Lopez', business: client.name, link: `${process.env.APP_URL}/r/test` })
    await sendEmail({ to: client.owner_email, subject: `[Test] ${r.emailSubject}`, html: r.emailBody })
    const smsOk = client.owner_phone && process.env.TWILIO_ACCOUNT_SID
    if (smsOk) await sendSms(client.owner_phone, r.sms)
    return res.json({ ok: true, email: client.owner_email, sms: Boolean(smsOk) })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
