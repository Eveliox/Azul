import { timingSafeEqual } from 'node:crypto'
import { authenticate, readJson } from '../_lib/auth.js'
import {
  handleNewLead, handleCallEnded, processLeadRetries, handleOwnerStep, getLeadDashboard, saveLeadAgent, stopLead,
  saveProfile, handleTestCall, saveControls, getHostedFormInfo, handleHostedForm,
} from '../_lib/lead-agent.js'

// Speed-to-lead agent. One function for all routes (Vercel Hobby allows 12 functions per deployment).
//   POST /api/leads/new         lead from a client's website server. Header x-lead-key = rb_lead_agents.form_key
//   POST /api/leads/call-ended  Vapi Server URL: end-of-call reports, and assistant-request for callbacks.
//                               x-vapi-secret or Authorization: Bearer = VAPI_LEAD_AGENT_SECRET
//   POST /api/leads/retry       scheduled worker. Authorization: Bearer LEAD_CRON_SECRET
//   POST /api/leads/owner       Twilio webhooks for owner-first calls (checked with X-Twilio-Signature)
//   GET  /api/leads/list        dashboard: a business's leads and numbers (its team, or Azul)
//   GET|POST /api/leads/agent   Azul only: read or save a business's agent settings, rotate its form key
//   POST /api/leads/stop        dashboard: stop calling a queued lead
//   POST /api/leads/profile     dashboard: save the business details the agent's script is built from (team or Azul)
//   POST /api/leads/test-call   Azul only: call one of the agent's test numbers now (any hour, any mode)
//   POST /api/leads/controls    dashboard: the business's own settings (on/paused, hours, owner first, alerts)
//   GET  /api/leads/form-info   public: what the hosted form at /f/<slug> shows
//   POST /api/leads/form        public: a lead from the hosted form (rate-limited per business)
// Never call these as a health check: /new, /retry and /owner can place real phone calls.
// Never call these as a health check either: /form places a real call (it is the public version of /new).
// Env: VAPI_API_KEY, VAPI_LEAD_AGENT_SECRET, LEAD_CALLS_ENABLED=true, LEAD_CRON_SECRET, RESEND_API_KEY,
//      EMAIL_FROM, TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN (owner first). Optional: LEAD_EMAIL_FROM, LEAD_PUBLIC_URL, LEAD_CALENDAR_SHARE_EMAIL,
//      AZUL_OPS_EMAIL (daily check-in recipient).
export const config = { maxDuration: 60 }

const METHODS = { new: ['POST'], 'call-ended': ['POST'], retry: ['POST'], owner: ['POST'], list: ['GET'], agent: ['GET', 'POST'], stop: ['POST'], profile: ['POST'], 'test-call': ['POST'], controls: ['POST'], 'form-info': ['GET'], form: ['POST'] }

// Its own secret, separate from CRON_SECRET (which also guards /api/send-due).
// Stray spaces or line breaks from copy-pasting the secret (into Vercel or Supabase Vault) are ignored.
function bearerMatches(req, secret) {
  const given = Buffer.from(String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/)?.[1]?.trim() || '')
  const expected = Buffer.from(String(secret || '').trim())
  return expected.length >= 32 && given.length === expected.length && timingSafeEqual(given, expected)
}
// Twilio posts form fields; Vercel usually parses them already.
const formParams = (req) => req.body && typeof req.body === 'object' ? req.body : Object.fromEntries(new URLSearchParams(String(req.body || '')))

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const action = req.query?.action
  if (!METHODS[action]) return res.status(404).json({ error: 'Not found' })
  if (!METHODS[action].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (action === 'new') {
      const r = await handleNewLead({ key: req.headers['x-lead-key'], body: readJson(req) })
      return res.status(r.status).json(r.body)
    }
    if (action === 'call-ended') {
      // Vapi sends the secret as x-vapi-secret (Server URL Secret / header) or as a Bearer token (Credential).
      const secret = req.headers['x-vapi-secret'] || String(req.headers.authorization || '').match(/^Bearer (.+)$/)?.[1]
      const r = await handleCallEnded({ secret, body: readJson(req) })
      return res.status(r.status).json(r.body)
    }
    if (action === 'owner') {
      const r = await handleOwnerStep({ step: req.query.step, leadId: req.query.lead, params: formParams(req), signature: req.headers['x-twilio-signature'] })
      res.setHeader('Content-Type', 'text/xml')
      return res.status(r.status).send(r.xml)
    }
    if (action === 'form-info') {
      const r = await getHostedFormInfo({ slug: String(req.query.slug || '') })
      if (r.status === 200) res.setHeader('Cache-Control', 'public, max-age=60')
      return res.status(r.status).json(r.body)
    }
    if (action === 'form') {
      const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      const r = await handleHostedForm({ slug: String(req.query.slug || ''), body: readJson(req), ip })
      return res.status(r.status).json(r.body)
    }
    if (action === 'retry') {
      // Secrets only in headers, never in query URLs or logs.
      if (req.query?.key || !bearerMatches(req, process.env.LEAD_CRON_SECRET)) return res.status(401).json({ error: 'Unauthorized' })
      return res.json(await processLeadRetries())
    }

    // Dashboard actions: a team sees its own business; Azul picks one with client_id.
    const auth = await authenticate(req, res)
    if (!auth) return
    const body = req.method === 'POST' ? readJson(req) : {}
    const isMaster = auth.role === 'master'
    const clientId = isMaster ? String(req.query?.client_id || body.client_id || '') : auth.clientId
    if (!/^[0-9a-f-]{36}$/i.test(clientId)) return res.status(400).json({ error: 'Choose a business.' })
    if (action === 'list') return res.json(await getLeadDashboard({ clientId, isMaster }))
    if (action === 'stop') {
      const r = await stopLead({ clientId, leadId: String(body.lead_id || '') })
      return res.status(r.status).json(r.body)
    }
    if (action === 'controls') {
      const r = await saveControls({ clientId, body })
      return res.status(r.status).json(r.body)
    }
    if (action === 'profile') {
      const r = await saveProfile({ clientId, body, userId: auth.userId })
      return res.status(r.status).json(r.body)
    }
    if (!isMaster) return res.status(403).json({ error: 'Only Azul can change the agent settings.' })
    if (action === 'test-call') {
      const r = await handleTestCall({ clientId, phone: body.phone })
      return res.status(r.status).json(r.body)
    }
    if (req.method === 'GET') return res.json({ agent: (await getLeadDashboard({ clientId, isMaster: true })).agent })
    const r = await saveLeadAgent({ clientId, body })
    return res.status(r.status).json(r.body)
  } catch (e) {
    // Log the code only: provider and database messages can contain customer details.
    console.error('lead_agent_failure', action, e.code || e.name || 'unknown')
    return res.status(503).json({ error: 'The lead agent could not process this request.' })
  }
}
