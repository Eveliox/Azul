// LOCAL UI DEMO ONLY: in-memory sample data; never loads .env or sends messages.
// Bind to loopback, not the network. Use Vercel dev for real backend integration.
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { randomUUID, randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, sep, extname } from 'node:path'
import { PRESETS, FIELDS, resolveMessages, normalizeMessages, validateMessages } from './api/_lib/messages.js'
import { normalizeServices } from './api/_lib/services.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist')
const port = Number(process.env.PORT || 3000)
const adminKey = 'dev-master-key-123'
const clients = [{ client_id: 'demo-helloyou', name: 'Hello You Wellness Center', slug: 'helloyou', delay_hours: 3, followup_hours: 48, default_language: 'en', tone: 'warm', access_key: 'demo-business-key-helloyou-12345678', services: ['reviews', 'seo'], google_review_url: 'https://example.com/review' }]
const names = ['Maria Lopez', 'Daniel Rivera', 'Sofia Martinez', 'James Wilson', 'Isabella Torres', 'Lucas Perez', 'Emma Davis', 'Mateo Garcia']
const requests = Array.from({ length: 32 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - Math.floor(i / 2.6)); date.setHours(9 + i % 8, 15, 0, 0)
  if (date > new Date()) date.setDate(date.getDate() - 1)
  const sent = date.toISOString()
  const status = ['rated', 'sent', 'rated', 'clicked', 'rated', 'pending', 'failed', 'rated'][i % 8]
  const rating = status === 'rated' ? (i % 5 === 0 ? 3 : i % 3 === 0 ? 4 : 5) : null
  return { id: `sample-${i}`, client_id: clients[0].client_id, customer_name: names[i % names.length], customer_email: `sample${i}@example.com`, language: i % 3 ? 'en' : 'es', status, rating, feedback: rating === 3 ? 'The wait was longer than expected. The team was helpful once we started.' : null, error: status === 'failed' ? 'Sample delivery error. No real message was attempted.' : null, created_at: sent, send_at: sent, sent_at: ['pending', 'failed'].includes(status) ? null : sent, clicked_at: ['rated', 'clicked'].includes(status) ? sent : null, rated_at: status === 'rated' ? sent : null, token: `sample-${i}` }
}).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

function stats(c) {
  const rows = requests.filter((r) => r.client_id === c.client_id)
  const ratings = rows.filter((r) => r.rating)
  return { ...c, total: rows.length, pending: rows.filter((r) => r.status === 'pending').length, sent: rows.filter((r) => r.sent_at).length, clicked: rows.filter((r) => r.clicked_at).length, rated: ratings.length, five_star: ratings.filter((r) => r.rating === 5).length, shielded: ratings.filter((r) => r.rating < 5).length, avg_rating: ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : null }
}
function messageData(c) { return { tone: c.tone, presets: PRESETS, fields: FIELDS, current: { en: resolveMessages(c, 'en'), es: resolveMessages(c, 'es') } } }
async function readBody(req) {
  let body = ''
  for await (const chunk of req) { body += chunk; if (body.length > 32000) throw new Error('Request too large') }
  return JSON.parse(body || '{}')
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`)
  const json = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)) }
  try {
    if (url.pathname.startsWith('/api/')) {
      const key = req.headers['x-admin-key']
      const master = key === adminKey
      const own = clients.find((c) => c.access_key === key)
      if (!master && !own) return json(401, { error: 'Unauthorized' })
      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {}
      if (url.pathname === '/api/clients') {
        if (req.method === 'GET') return json(200, { demo: true, role: master ? 'master' : 'client', clients: (master ? clients : [own]).map((c) => { const row = stats(c); if (!master) delete row.access_key; return row }) })
        if (!master) return json(403, { error: 'Forbidden' })
        if (req.method === 'POST') {
          const services = normalizeServices(body.services)
          if (!body.name?.trim() || !body.slug?.trim()) return json(400, { error: 'Business name and short ID are required' })
          if (!services.length) return json(400, { error: 'Select at least one service' })
          if (services.includes('reviews') && !body.google_review_url?.trim()) return json(400, { error: 'A Google review link is required for Review Booster' })
          const c = { ...body, services, google_review_url: body.google_review_url?.trim() || null, client_id: randomUUID(), access_key: randomBytes(24).toString('hex'), messages: null }; clients.push(c)
          return json(201, { client: c })
        }
        if (req.method === 'PATCH') {
          const c = clients.find((c) => c.client_id === url.searchParams.get('id'))
          if (!c) return json(404, { error: 'Business not found' })
          if (body.rotate_key) c.access_key = randomBytes(24).toString('hex')
          if (body.services !== undefined) { const services = normalizeServices(body.services); if (!services.length) return json(400, { error: 'Select at least one service' }); c.services = services }
          return json(200, { client: c })
        }
      }
      const clientId = own?.client_id || url.searchParams.get('client_id') || body.client_id
      const c = clients.find((c) => c.client_id === clientId)
      if (!c) return json(404, { error: 'Demo business not found' })
      if (url.pathname === '/api/requests') {
        if (req.method === 'GET') return json(200, { requests: requests.filter((r) => r.client_id === c.client_id).slice(0, 100) })
        if (req.method === 'POST') {
          if (!c.services.includes('reviews')) return json(403, { error: 'Review Booster is not enabled for this business' })
          if (!body.customer_name?.trim() || !(body.customer_phone?.trim() || body.customer_email?.trim())) return json(400, { error: 'Customer name and contact required' })
          const now = new Date().toISOString()
          const r = { ...body, id: randomUUID(), token: randomBytes(12).toString('hex'), client_id: c.client_id, language: body.language || c.default_language || 'en', created_at: now, send_at: new Date(Date.now() + (body.send_now ? 0 : Number(c.delay_hours ?? 3) * 3600000)).toISOString(), status: 'pending', rating: null, sent_at: null, clicked_at: null, rated_at: null }
          requests.unshift(r); return json(201, { request: r, link: `http://localhost:${port}/r/${r.token}` })
        }
      }
      if (url.pathname === '/api/messages') {
        if (req.method === 'GET') return json(200, messageData(c))
        if (req.method === 'PUT') {
          const errors = validateMessages(body.messages)
          if (errors.length || !PRESETS[body.tone]) return json(400, { error: errors.join(', ') || 'Invalid tone' })
          c.tone = body.tone; c.messages = normalizeMessages(body.messages, c.tone)
          return json(200, messageData(c))
        }
        if (req.method === 'POST') return json(409, { error: 'Preview only: no email or SMS is sent. Use the configured backend to test delivery.' })
      }
      return json(404, { error: 'This endpoint is not available in the local UI demo.' })
    }
    if (!['GET', 'HEAD'].includes(req.method)) return json(405, { error: 'Method not allowed' })
    const asset = url.pathname.startsWith('/assets/')
    const path = asset ? resolve(root, '.' + decodeURIComponent(url.pathname)) : resolve(root, 'index.html')
    if (!path.startsWith(root + sep)) return json(403, { error: 'Forbidden' })
    const file = readFileSync(path)
    const types = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml' }
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(req.method === 'HEAD' ? undefined : file)
  } catch (e) { json(e.code === 'ENOENT' ? 404 : 400, { error: e.code === 'ENOENT' ? 'Build the preview first: npm run build' : 'Invalid demo request' }) }
}).listen(port, '127.0.0.1', () => console.log(`Local UI demo: http://localhost:${port}/admin\nKey: ${adminKey}\nSample data only. No real messages. Stop with Ctrl+C.`))
