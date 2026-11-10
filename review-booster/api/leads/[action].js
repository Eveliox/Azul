import { timingSafeEqual } from 'node:crypto'
import { readJson } from '../_lib/auth.js'
import { handleNewLead, handleCallEnded, processLeadRetries } from '../_lib/lead-agent.js'

// Speed-to-lead agent. One function for all routes (Vercel Hobby allows 12 functions per deployment).
//   POST /api/leads/new         lead from a client's website server. Header x-lead-key = rb_lead_agents.form_key
//   POST /api/leads/call-ended  Vapi Server URL. Header x-vapi-secret = VAPI_LEAD_AGENT_SECRET
//   POST /api/leads/retry       scheduled worker. Authorization: Bearer LEAD_CRON_SECRET
// Never call these as a health check: /new and /retry place real phone calls.
// Env: VAPI_API_KEY, VAPI_LEAD_AGENT_SECRET, LEAD_CALLS_ENABLED=true, LEAD_CRON_SECRET, RESEND_API_KEY,
//      EMAIL_FROM (optional LEAD_EMAIL_FROM for a different sender address).
export const config = { maxDuration: 60 }

// Its own secret, separate from CRON_SECRET (which also guards /api/send-due).
function bearerMatches(req, secret) {
  const given = Buffer.from(String(req.headers.authorization || '').match(/^Bearer (.+)$/)?.[1] || '')
  const expected = Buffer.from(String(secret || ''))
  return expected.length >= 32 && given.length === expected.length && timingSafeEqual(given, expected)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const action = req.query?.action
  if (!['new', 'call-ended', 'retry'].includes(action)) return res.status(404).json({ error: 'Not found' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (action === 'new') {
      const r = await handleNewLead({ key: req.headers['x-lead-key'], body: readJson(req) })
      return res.status(r.status).json(r.body)
    }
    if (action === 'call-ended') {
      const r = await handleCallEnded({ secret: req.headers['x-vapi-secret'], body: readJson(req) })
      return res.status(r.status).json(r.body)
    }
    // Secrets only in headers, never in query URLs or logs.
    if (req.query?.key || !bearerMatches(req, process.env.LEAD_CRON_SECRET)) return res.status(401).json({ error: 'Unauthorized' })
    return res.json(await processLeadRetries())
  } catch (e) {
    // Log the code only: provider and database messages can contain customer details.
    console.error('lead_agent_failure', action, e.code || e.name || 'unknown')
    return res.status(503).json({ error: 'The lead agent could not process this request.' })
  }
}
