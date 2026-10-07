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
export async function authenticate(req, res, database = db()) {
  res.setHeader('Cache-Control', 'no-store')
  const bearer = String(req.headers.authorization || '').match(/^Bearer (.+)$/i)?.[1]
  if (bearer) {
    const { data, error } = await database.auth.getUser(bearer)
    if (error || !data?.user) { res.status(401).json({ error: 'Your session has expired. Sign in again.' }); return null }
    const userId = data.user.id
    const admin = await database.from('rb_agency_admins').select('user_id').eq('user_id', userId).maybeSingle()
    if (admin.error) { res.status(503).json({ error: 'Account access is not configured yet.' }); return null }
    if (admin.data) return { role: 'master', userId }
    const members = await database.from('rb_workspace_members').select('client_id, rb_clients!inner(active)').eq('user_id', userId).eq('rb_clients.active', true)
    if (members.error) { res.status(503).json({ error: 'Could not verify workspace access.' }); return null }
    const clientIds = members.data.map((m) => m.client_id)
    const requested = req.query?.client_id || readJson(req).client_id || req.headers['x-workspace-id'] || clientIds[0]
    if (!clientIds.includes(requested)) { res.status(403).json({ error: 'You do not have access to this workspace.' }); return null }
    return { role: 'client', clientId: requested, clientIds, userId }
  }
  if (process.env.DISABLE_LEGACY_ACCESS_KEYS === 'true') { res.status(401).json({ error: 'Sign in with your email account.' }); return null }
  const key = String(req.headers['x-admin-key'] || '')
  if (process.env.ADMIN_KEY && key && safeEqual(key, process.env.ADMIN_KEY)) {
    return { role: 'master' }
  }
  if (key.length >= 32) {
    const { data } = await database
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
