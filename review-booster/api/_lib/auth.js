// Tiny auth helpers. Admin routes need `x-admin-key`; cron needs CRON_SECRET.

export function requireAdmin(req, res) {
  const key = req.headers['x-admin-key']
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

export function requireCron(req, res) {
  const bearer = (req.headers.authorization || '').replace('Bearer ', '')
  const q = req.query?.key
  const ok = process.env.CRON_SECRET && (bearer === process.env.CRON_SECRET || q === process.env.CRON_SECRET)
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
