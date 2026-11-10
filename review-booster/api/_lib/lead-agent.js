// Speed-to-lead agent: the steps that touch Vapi, the database and email.
// Every dependency is a parameter so tests run with fakes. Routes are in api/leads/[action].js.
import { timingSafeEqual } from 'node:crypto'
import { db } from './db.js'
import { sendEmail } from './email.js'
import {
  leadFromForm, dialPlan, vapiCallBody, nextRetryTime, parseCallReport, outcomeFromReport,
  ownerCallEmail, ownerAlertEmail, leadConfirmationEmail, ownerRecipients, senderFor, formatWhen, rules,
} from './leads.js'

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a ?? ''))
  const y = Buffer.from(String(b ?? ''))
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y)
}
const context = (o = {}) => ({ database: o.database || db(), env: o.env || process.env, now: o.now || new Date(), send: o.send || sendEmail, fetchImpl: o.fetchImpl || fetch })
async function rpcRows(database, name, args) {
  const { data, error } = await database.rpc(name, args)
  if (error) throw error
  return data || []
}

export async function placeVapiCall(body, { env, fetchImpl }) {
  if (!env.VAPI_API_KEY) throw new Error('VAPI_API_KEY is not set')
  const res = await fetchImpl('https://api.vapi.ai/call', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.VAPI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data?.id) {
    const detail = [].concat(data?.message || data?.error || 'no call id returned').join('; ')
    throw new Error(`Vapi ${res.status}: ${detail}`.slice(0, 300))
  }
  return data.id
}

// Email failures are logged, never thrown: the lead and its status are already saved.
async function notify(send, msg) {
  if (!msg.to?.length) return
  try { await send(msg) } catch (e) { console.error('lead_email_failed', String(e.message).slice(0, 160)) }
}
const toOwner = (agent, env, email) => ({ to: ownerRecipients(agent), from: senderFor('Azul Lead Agent', env), ...email })

// Dials a lead that holds a dialing lease, then records the result (which releases the lease).
export async function dialLead(lead, agent, ctx) {
  const { database, env, now, send, fetchImpl } = ctx
  const plan = dialPlan(lead, agent, env, now)
  let result
  if (plan.action === 'skip') result = { status: 'not_called', notes: plan.notes }
  else if (plan.action === 'defer') result = { status: 'retry', next_attempt_at: plan.next_attempt_at, notes: plan.notes }
  else {
    try {
      result = { call_id: await placeVapiCall(vapiCallBody(lead, agent, now), { env, fetchImpl }), kind: 'ai' }
    } catch (e) {
      result = { error: String(e.message || 'Call failed').slice(0, 300), next_attempt_at: nextRetryTime(lead, agent, now) }
    }
  }
  const [updated] = await rpcRows(database, 'rb_finish_lead_attempt', { p_lead: lead.id, p_lease: lead.lease_token, p_result: result })
  if (result.error) {
    const reason = updated?.status === 'failed'
      ? `The agent couldn't place the call and has stopped trying (${result.error}). Call them yourself.`
      : `The agent couldn't place the call (${result.error}). It will try again later, but call them yourself now if you can.`
    await notify(send, toOwner(agent, env, ownerAlertEmail({ lead, title: 'Call this lead yourself', reason })))
  } else if (result.status === 'not_called') {
    await notify(send, toOwner(agent, env, ownerAlertEmail({ lead, title: 'New lead, not called by the agent', reason: `${result.notes} Call them yourself.` })))
  } else if (plan.action === 'defer') {
    // The owner always hears about a new lead, even when the first call waits for the morning.
    const when = formatWhen(plan.next_attempt_at, rules(agent).timezone)
    await notify(send, toOwner(agent, env, ownerAlertEmail({ lead, title: 'New lead after hours', reason: `The agent will call them ${when}. Call them sooner yourself if you want to.` })))
  }
  return updated || null
}

// POST /api/leads/new: a lead from the client's website (server to server, x-lead-key).
export async function handleNewLead({ key, body, ...deps }) {
  const ctx = context(deps)
  if (String(key || '').length < 32) return { status: 401, body: { error: 'Unauthorized' } }
  const { data: agent, error } = await ctx.database.from('rb_lead_agents').select('*, rb_clients!inner(active, services)').eq('form_key', String(key)).maybeSingle()
  if (error) throw error
  if (!agent || !agent.rb_clients?.active || !agent.rb_clients.services?.includes('calls')) return { status: 401, body: { error: 'Unauthorized' } }

  const parsed = leadFromForm(body)
  if (parsed.spam) return { status: 200, body: { ok: true } } // bots get a fake success
  if (parsed.error) return { status: 400, body: { error: parsed.error } }

  const created = await ctx.database.rpc('rb_create_lead', { p_client: agent.client_id, p_data: parsed.lead })
  if (created.error) throw created.error
  const { created: isNew, lead } = created.data
  if (!isNew) return { status: 200, body: { ok: true, duplicate: true } }
  if (lead.status !== 'new') {
    const title = lead.status === 'blocked' ? 'Lead on your do-not-contact list' : 'New lead, no permission to call'
    const reason = lead.status === 'blocked'
      ? 'This number asked not to be called, so the agent will not call it. They just sent the form again; contact them yourself if appropriate.'
      : "They didn't tick the box allowing calls, so the agent will not call them. Contact them yourself."
    await notify(ctx.send, toOwner(agent, ctx.env, ownerAlertEmail({ lead, title, reason })))
    return { status: 200, body: { ok: true, status: lead.status } }
  }
  const [leased] = await rpcRows(ctx.database, 'rb_claim_lead', { p_lead: lead.id })
  if (!leased) return { status: 200, body: { ok: true, status: 'new' } }
  const done = await dialLead(leased, agent, ctx)
  return { status: 200, body: { ok: true, status: done?.status || 'dialing' } }
}

// POST /api/leads/call-ended: Vapi Server URL for speed-to-lead assistants.
export async function handleCallEnded({ secret, body, ...deps }) {
  const ctx = context(deps)
  if (!ctx.env.VAPI_LEAD_AGENT_SECRET || !safeEqual(secret, ctx.env.VAPI_LEAD_AGENT_SECRET)) return { status: 401, body: { error: 'Unauthorized' } }
  const message = body?.message
  if (message?.type !== 'end-of-call-report') return { status: 200, body: { ok: true, ignored: 'not an end-of-call-report' } }
  const report = parseCallReport(message)
  if (!report.callId) return { status: 200, body: { ok: true, ignored: 'no call id' } }

  const call = await ctx.database.from('rb_lead_calls').select('call_id, ended_at, client_id, lead:rb_leads(*)').eq('call_id', report.callId).maybeSingle()
  if (call.error) throw call.error
  if (!call.data?.lead || call.data.ended_at) return { status: 200, body: { ok: true, ignored: 'unknown or already recorded' } }
  const agentQuery = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', call.data.client_id).maybeSingle()
  if (agentQuery.error) throw agentQuery.error
  const agent = agentQuery.data || {}

  const outcome = outcomeFromReport(report, call.data.lead, agent, ctx.now)
  const [updated] = await rpcRows(ctx.database, 'rb_record_call_result', { p_call_id: report.callId, p_result: outcome })
  if (!updated) return { status: 200, body: { ok: true, ignored: 'already recorded' } }

  await notify(ctx.send, toOwner(agent, ctx.env, ownerCallEmail({ lead: updated, agent, outcome, report })))
  if (outcome.status === 'booked' && updated.email) {
    const confirmation = leadConfirmationEmail({ lead: updated, agent, appointmentTime: outcome.appointment_time })
    if (confirmation) await notify(ctx.send, { to: [updated.email], from: senderFor(agent.business_name, ctx.env), replyTo: ownerRecipients(agent)[0], ...confirmation })
  }
  return { status: 200, body: { ok: true, status: updated.status } }
}

// POST /api/leads/retry: scheduled. Flags stuck leads for the owner, then places due retry calls.
export async function processLeadRetries({ limit = 5, ...deps } = {}) {
  // Check the kill switch before connecting to anything.
  if ((deps.env || process.env).LEAD_CALLS_ENABLED !== 'true') return { disabled: true, swept: 0, processed: 0 }
  const ctx = context(deps)
  const swept = await rpcRows(ctx.database, 'rb_sweep_stuck_leads', {})
  const claimed = await rpcRows(ctx.database, 'rb_claim_lead_retries', { p_limit: limit })
  const agents = new Map()
  const clientIds = [...new Set([...swept, ...claimed].map((l) => l.client_id))]
  if (clientIds.length) {
    const { data, error } = await ctx.database.from('rb_lead_agents').select('*').in('client_id', clientIds)
    if (error) throw error
    for (const a of data) agents.set(a.client_id, a)
  }
  for (const lead of swept) {
    const agent = agents.get(lead.client_id)
    if (agent) await notify(ctx.send, toOwner(agent, ctx.env, ownerAlertEmail({ lead, title: 'Check this lead', reason: `${lead.notes} Call them yourself.` })))
  }
  let processed = 0, failed = 0
  for (const lead of claimed) {
    const agent = agents.get(lead.client_id)
    if (!agent) continue
    // One bad lead must not block the rest; its lease expires and the sweep hands it to the owner.
    try { await dialLead(lead, agent, ctx); processed++ } catch (e) { failed++; console.error('lead_retry_failed', e.code || String(e.message).slice(0, 120)) }
  }
  return { swept: swept.length, processed, failed }
}
