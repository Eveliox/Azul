import { randomBytes } from 'node:crypto'
import { db } from './_lib/db.js'
import { requireAdmin, readJson } from './_lib/auth.js'
import { toE164 } from './_lib/sms.js'

// GET  /api/requests?client_id=…   → recent requests for a client
// POST /api/requests               → "job complete" trigger: schedules a review request
//        body: { client_id, customer_name, customer_phone?, customer_email?, language?, send_now? }
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    let q = db()
      .from('review_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (req.query.client_id) q = q.eq('client_id', req.query.client_id)
    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ requests: data })
  }

  if (req.method === 'POST') {
    const b = readJson(req)
    if (!b.client_id || !b.customer_name) {
      return res.status(400).json({ error: 'client_id and customer_name are required' })
    }
    const phone = toE164(b.customer_phone)
    const email = (b.customer_email || '').trim() || null
    if (!phone && !email) {
      return res.status(400).json({ error: 'Need at least a valid phone or an email' })
    }

    const { data: client, error: cErr } = await db()
      .from('clients').select('*').eq('id', b.client_id).single()
    if (cErr || !client) return res.status(404).json({ error: 'Client not found' })

    const delayMs = b.send_now ? 0 : client.delay_hours * 3600 * 1000
    const row = {
      client_id: client.id,
      token: randomBytes(6).toString('base64url'),   // 8 chars, URL-safe
      customer_name: b.customer_name.trim(),
      customer_phone: phone,
      customer_email: email,
      language: b.language === 'es' || b.language === 'en' ? b.language : client.default_language,
      send_at: new Date(Date.now() + delayMs).toISOString(),
    }
    const { data, error } = await db().from('review_requests').insert(row).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ request: data, link: `${process.env.APP_URL}/r/${data.token}` })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
