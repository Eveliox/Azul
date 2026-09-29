import { randomBytes } from 'node:crypto'
import { db } from './_lib/db.js'
import { authenticate, readJson } from './_lib/auth.js'
import { toE164 } from './_lib/sms.js'
import { TONES } from './_lib/messages.js'
import { normalizeServices } from './_lib/services.js'

// GET   /api/clients           → list clients + stats (a business key sees only itself)
// POST  /api/clients           → create client with its services; returns the new access key (master only)
// PATCH /api/clients?id=…      → { rotate_key: true } | { services: [...] } | { tone } (master only)
export default async function handler(req, res) {
  const auth = await authenticate(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    let q = db().from('rb_client_stats').select('*').order('name')
    if (auth.role === 'client') q = q.eq('client_id', auth.clientId)
    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    const clients = auth.role === 'master' ? data : data.map(({ access_key, ...c }) => c)
    return res.json({ role: auth.role, clients })
  }

  if (auth.role !== 'master') return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'POST') {
    const b = readJson(req)
    const services = normalizeServices(b.services)
    if (!b.name || !b.slug) return res.status(400).json({ error: 'name and slug are required' })
    if (!services.length) return res.status(400).json({ error: 'Select at least one service' })
    const reviewUrl = (b.google_review_url || '').trim() || null
    if (services.includes('reviews') && !reviewUrl) {
      return res.status(400).json({ error: 'A Google review link is required for Review Booster' })
    }
    const row = {
      name: b.name.trim(),
      slug: b.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      google_review_url: reviewUrl,
      services,
      owner_name: b.owner_name || null,
      owner_email: b.owner_email || null,
      owner_phone: toE164(b.owner_phone),
      default_language: b.default_language === 'es' ? 'es' : 'en',
      tone: TONES.includes(b.tone) ? b.tone : 'friendly',
      delay_hours: Number(b.delay_hours ?? 3),
      followup_hours: Number(b.followup_hours ?? 48),
    }
    const { data, error } = await db().from('rb_clients').insert(row).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ client: data })
  }

  if (req.method === 'PATCH') {
    const b = readJson(req)
    const patch = {}
    if (b.rotate_key) patch.access_key = randomBytes(24).toString('hex')
    if (b.services !== undefined) {
      const services = normalizeServices(b.services)
      if (!services.length) return res.status(400).json({ error: 'Select at least one service' })
      patch.services = services
    }
    if (b.tone !== undefined) {
      if (!TONES.includes(b.tone)) return res.status(400).json({ error: 'invalid tone' })
      patch.tone = b.tone
    }
    if (!req.query.id || !Object.keys(patch).length) return res.status(400).json({ error: 'id and a change required' })
    const { data, error } = await db()
      .from('rb_clients')
      .update(patch)
      .eq('id', req.query.id)
      .select('id, access_key, tone, services, google_review_url')
      .single()
    if (error || !data) return res.status(404).json({ error: 'Client not found' })
    if (data.services.includes('reviews') && !data.google_review_url) {
      return res.json({ client: data, warning: 'Review Booster is enabled but this business has no Google review link yet. Add one in Supabase before sending requests.' })
    }
    return res.json({ client: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
