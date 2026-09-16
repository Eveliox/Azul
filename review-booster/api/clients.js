import { db } from './_lib/db.js'
import { requireAdmin, readJson } from './_lib/auth.js'
import { toE164 } from './_lib/sms.js'

// GET  /api/clients          → list clients + stats
// POST /api/clients          → create client
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { data, error } = await db()
      .from('client_stats')
      .select('*')
      .order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ clients: data })
  }

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

  res.status(405).json({ error: 'Method not allowed' })
}
