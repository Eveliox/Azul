// Small request helpers shared by the free-report endpoints.

export function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  try { return JSON.parse(req.body || '{}') } catch { return {} }
}

export function clientIp(req) {
  return String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
}

// Per-instance limiter: a speed bump, not a guarantee (serverless instances
// don't share memory). The hard cost cap is the daily quota set on the Google
// Cloud key; see docs/FREE-REPORT-SETUP.md.
const hits = new Map()
export function rateLimited(key, { limit, windowMs }) {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) for (const [k, times] of hits) if (now - times.at(-1) > windowMs) hits.delete(k)
  return recent.length > limit
}
