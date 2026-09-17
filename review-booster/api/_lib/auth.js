import { timingSafeEqual } from 'node:crypto'
import { db } from './db.js'

// Tiny auth helpers. Admin routes need `x-admin-key`; cron needs CRON_SECRET.

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

// Returns { role: 'master' } for ADMIN_KEY, { role: 'client', clientId } for a business's
// access_key, or null (after sending 401).
export async function authenticate(req, res) {
  const key = String(req.headers['x-admin-key'] || '')
  if (process.env.ADMIN_KEY && key && safeEqual(key, process.env.ADMIN_KEY)) {
    return { role: 'master' }
  }
  if (key.length >= 32) {
    const { data } = await db()
      .from('rb_clients').select('id').eq('access_key', key).eq('active', true).maybeSingle()
    if (data) return { role: 'client', clientId: data.id }
  }
  res.status(401).json({ error: 'Unauthorized' })
  return null
}

export function requireCron(req, res) {
  const bearer = (req.headers.authorization || '').replace('Bearer ', '')
  const q = req.query?.key
  const secret = process.env.CRON_SECRET
  const ok = secret && ((bearer && safeEqual(bearer, secret)) || (q && safeEqual(q, secret)))
  if (!ok) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

export function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  try { return JSON.parse(req.body || '{}') } catch { return {} }
}
