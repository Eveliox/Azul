import { randomBytes } from 'node:crypto'
import { db } from './_lib/db.js'
import { authenticate, readJson } from './_lib/auth.js'
import { toE164 } from './_lib/sms.js'

// GET   /api/clients           → list clients + stats (a business key sees only itself)
// POST  /api/clients           → create client (master only)
// PATCH /api/clients?id=…      → { rotate_key: true } issue a new access key (master only)
export default async function handler(req, res) {
  const auth = await authenticate(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    let q = db().from('client_stats').select('*').order('name')
    if (auth.role === 'client') q = q.eq('client_id', auth.clientId)
    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    const clients = auth.role === 'master' ? data : data.map(({ access_key, ...c }) => c)
    return res.json({ role: auth.role, clients })
  }

  if (auth.role !== 'master') return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'POST') {
    const b = readJson(req)
    if (!b.name || !b.slug || !b.google_review_url) {
      return res.status(400).json({ error: 'name, slug, google_review_url are required' })
    }
    const row = {
      name: b.name.trim(),
      slug: b.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      google_review_url: b.google_review_url.trim(),
      owner_name: b.owner_name || null,
      owner_email: b.owner_email || null,
      owner_phone: toE164(b.owner_phone),
      default_language: b.default_language === 'es' ? 'es' : 'en',
      delay_hours: Number(b.delay_hours ?? 3),
      followup_hours: Number(b.followup_hours ?? 48),
    }
    const { data, error } = await db().from('clients').insert(row).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ client: data })
  }

  if (req.method === 'PATCH') {
    const b = readJson(req)
    if (!req.query.id || !b.rotate_key) return res.status(400).json({ error: 'id and rotate_key required' })
    const { data, error } = await db()
      .from('clients')
      .update({ access_key: randomBytes(24).toString('hex') })
      .eq('id', req.query.id)
      .select('id, access_key')
      .single()
    if (error || !data) return res.status(404).json({ error: 'Client not found' })
    return res.json({ client: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
