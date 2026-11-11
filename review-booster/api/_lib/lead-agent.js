// Speed-to-lead agent: the steps that touch Vapi, the database and email.
// Every dependency is a parameter so tests run with fakes. Routes are in api/leads/[action].js.
import { timingSafeEqual, randomBytes, createHash } from 'node:crypto'
import { db } from './db.js'
import { sendEmail } from './email.js'
import {
  leadFromForm, dialPlan, vapiCallBody, nextRetryTime, parseCallReport, outcomeFromReport,
  ownerCallEmail, ownerAlertEmail, leadConfirmationEmail, ownerRecipients, senderFor, formatWhen, rules,
  ownerUrl, twilioSignature, ownerCallTwiml, ownerDialTwiml, sayTwiml, inboundOwnerEmail, toE164,
  leadStats, agentForViewer, validateAgentSettings, callEndedUrl, localParts, localDayStart,
} from './leads.js'
import { dailyDigest, weeklyOwnerEmail, validateControls, hostedConsentText, HOSTED_HOURLY_LIMIT, HOSTED_PER_IP_HOURLY, HOSTED_PER_PHONE_DAILY } from './lead-reports.js'
import { buildAssistant, validateProfile, profileGaps, templateReady } from './lead-prompts.js'

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a ?? ''))
  const y = Buffer.from(String(b ?? ''))
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y)
}
// The database client is created on first use, so rejected requests never connect.
const context = (o = {}) => ({ get database() { return o.database || db() }, env: o.env || process.env, now: o.now || new Date(), send: o.send || sendEmail, fetchImpl: o.fetchImpl || fetch })
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

// Owner first: ring the owner's cell from the business number. Returns the Twilio call SID.
export async function placeOwnerCall(lead, agent, { env, fetchImpl }) {
  const sid = env.TWILIO_ACCOUNT_SID, token = env.TWILIO_AUTH_TOKEN
  if (!sid || !token) throw new Error('Twilio credentials are not set')
  const res = await fetchImpl(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Calls.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      To: agent.owner_cell, From: agent.twilio_number, Twiml: ownerCallTwiml(lead, env), Timeout: '25',
      StatusCallback: ownerUrl(env, 'owner_done', lead.id), StatusCallbackMethod: 'POST',
    }),
    signal: AbortSignal.timeout(15_000),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data?.sid) throw new Error(`Twilio ${res.status}: ${data?.message || 'no call sid returned'}`.slice(0, 300))
  return data.sid
}

// Email failures are logged, never thrown: the lead and its status are already saved.
async function notify(send, msg) {
  if (!msg.to?.length) return
  try { await send(msg) } catch (e) { console.error('lead_email_failed', String(e.message).slice(0, 160)) }
}
const toOwner = (agent, env, email) => ({ to: ownerRecipients(agent), from: senderFor('Azul Lead Agent', env), ...email })

// Dials a lead that holds a dialing lease, then records the result (which releases the lease).
// The Vapi /call body: the assistant saved in Vapi, or (assistant_mode 'azul') one built from the business details.
export async function callBody(lead, agent, ctx) {
  if (agent.assistant_mode !== 'azul') return vapiCallBody(lead, agent, ctx.now)
  const found = await ctx.database.from('rb_lead_profiles').select('data').eq('client_id', agent.client_id).maybeSingle()
  if (found.error) throw found.error
  const profile = found.data?.data && validateProfile(found.data.data).data
  if (!profile) throw new Error('Business details are missing or incomplete, so the agent has no script')
  return {
    assistant: buildAssistant({ direction: 'outbound', profile, agent, lead, now: ctx.now, serverUrl: callEndedUrl(ctx.env), secret: ctx.env.VAPI_LEAD_AGENT_SECRET }),
    phoneNumberId: agent.vapi_phone_number_id,
    customer: { number: lead.phone, name: String(lead.name).slice(0, 40) },
  }
}

export async function dialLead(lead, agent, ctx, { test = false } = {}) {
  const { database, env, now, send, fetchImpl } = ctx
  const plan = dialPlan(lead, agent, env, now, { test })
  let result
  if (plan.action === 'skip') result = { status: 'not_called', notes: plan.notes }
  else if (plan.action === 'defer') result = { status: 'retry', next_attempt_at: plan.next_attempt_at, notes: plan.notes }
  else {
    // Owner first: only before anyone has been called for this lead. If Twilio fails, the AI calls instead.
    if (agent.owner_first && agent.owner_cell && agent.twilio_number && !lead.first_call_at) {
      try { result = { call_id: await placeOwnerCall(lead, agent, ctx), kind: 'owner' } }
      catch (e) { console.error('owner_call_failed', String(e.message).slice(0, 120)) }
    }
    if (!result) {
      try {
        result = { call_id: await placeVapiCall(await callBody(lead, agent, ctx), { env, fetchImpl }), kind: 'ai' }
      } catch (e) {
        const error = String(e.message || 'Call failed').slice(0, 300)
        result = test ? { status: 'not_called', notes: `Test call failed: ${error}`.slice(0, 300) } : { error, next_attempt_at: nextRetryTime(lead, agent, now) }
      }
    }
  }
  const [updated] = await rpcRows(database, 'rb_finish_lead_attempt', { p_lead: lead.id, p_lease: lead.lease_token, p_result: result })
  if (test) return updated || null // the dashboard shows the result; no owner alerts for tests
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
  return ingestLead(agent, body, ctx)
}

// Saves a lead and, when allowed, calls it. Shared by the website endpoint and the hosted form.
async function ingestLead(agent, body, ctx) {
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
  if (message?.type === 'assistant-request') return handleAssistantRequest(message, ctx)
  if (message?.type !== 'end-of-call-report') return { status: 200, body: { ok: true, ignored: 'not an end-of-call-report' } }
  const report = parseCallReport(message)
  if (!report.callId) return { status: 200, body: { ok: true, ignored: 'no call id' } }
  if (message.call?.type === 'inboundPhoneCall') return handleInboundCall(message, report, ctx)

  const call = await ctx.database.from('rb_lead_calls').select('call_id, ended_at, client_id, lead:rb_leads(*)').eq('call_id', report.callId).maybeSingle()
  if (call.error) throw call.error
  if (!call.data?.lead || call.data.ended_at) return { status: 200, body: { ok: true, ignored: 'unknown or already recorded' } }
  const agentQuery = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', call.data.client_id).maybeSingle()
  if (agentQuery.error) throw agentQuery.error
  const agent = agentQuery.data || {}

  const outcome = outcomeFromReport(report, call.data.lead, agent, ctx.now)
  if (call.data.lead.is_test && outcome.status === 'retry') { outcome.status = 'no_answer'; delete outcome.next_attempt_at }
  const [updated] = await rpcRows(ctx.database, 'rb_record_call_result', { p_call_id: report.callId, p_result: outcome })
  if (!updated) return { status: 200, body: { ok: true, ignored: 'already recorded' } }

  const email = ownerCallEmail({ lead: updated, agent, outcome, report })
  if (updated.is_test) email.subject = `[Test] ${email.subject}`
  await notify(ctx.send, toOwner(agent, ctx.env, email))
  if (outcome.status === 'booked' && updated.email) {
    const confirmation = leadConfirmationEmail({ lead: updated, agent, appointmentTime: outcome.appointment_time })
    if (confirmation) await notify(ctx.send, { to: [updated.email], from: senderFor(agent.business_name, ctx.env), replyTo: ownerRecipients(agent)[0], ...confirmation })
  }
  return { status: 200, body: { ok: true, status: updated.status } }
}

// POST /api/leads/retry: scheduled. Flags stuck leads for the owner, then places due retry calls.
export async function processLeadRetries({ limit = 5, ...deps } = {}) {
  const ctx = context(deps)
  if (ctx.env.LEAD_CALLS_ENABLED !== 'true') {
    // No calls, but the daily check-in (which says calls are off) and the owners' weekly email still go out.
    let emails = []
    try { emails = await runScheduledEmails(ctx) } catch (e) { console.error('scheduled_email_failed', e.code || String(e.message).slice(0, 120)) }
    return { disabled: true, swept: 0, processed: 0, ...(emails.length ? { emails } : {}) }
  }
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
  // Daily and weekly emails ride on this 5-minute tick. A failure there never blocks calls.
  let emails = []
  try { emails = await runScheduledEmails(ctx) } catch (e) { console.error('scheduled_email_failed', e.code || String(e.message).slice(0, 120)) }
  return { swept: swept.length, processed, failed, ...(emails.length ? { emails } : {}) }
}

// A lead (or anyone) called the business number back and talked to the inbound assistant.
async function handleInboundCall(message, report, ctx) {
  const phoneNumberId = message.call?.phoneNumberId || message.phoneNumber?.id
  if (!phoneNumberId) return { status: 200, body: { ok: true, ignored: 'no phone number id' } }
  const found = await ctx.database.from('rb_lead_agents').select('*').eq('vapi_phone_number_id', phoneNumberId).limit(1).maybeSingle()
  if (found.error) throw found.error
  const agent = found.data
  if (!agent) return { status: 200, body: { ok: true, ignored: 'number not linked to a business' } }
  const raw = String(message.call?.customer?.number || message.customer?.number || '').slice(0, 40)
  const phone = toE164(raw) || raw || null
  const outcome = outcomeFromReport(report, { attempts: 0 }, agent, ctx.now)
  const rec = await ctx.database.rpc('rb_record_inbound_call', {
    p_call_id: report.callId, p_client: agent.client_id, p_phone: phone,
    p_result: { booked: outcome.booked, appointment_time: outcome.appointment_time, do_not_call: outcome.do_not_call, summary: outcome.summary, ended_reason: outcome.ended_reason, ...(outcome.cost != null ? { cost: outcome.cost } : {}) },
  })
  if (rec.error) throw rec.error
  if (!rec.data?.recorded) return { status: 200, body: { ok: true, ignored: 'already recorded' } }
  const lead = rec.data.lead
  // Hang-ups and dead air: recorded, no email.
  if (!report.transcript && report.durationSeconds < 8) return { status: 200, body: { ok: true, inbound: true } }
  await notify(ctx.send, toOwner(agent, ctx.env, inboundOwnerEmail({ phone, lead, agent, outcome, report })))
  if (outcome.booked && lead?.email) {
    const confirmation = leadConfirmationEmail({ lead, agent, appointmentTime: outcome.appointment_time })
    if (confirmation) await notify(ctx.send, { to: [lead.email], from: senderFor(agent.business_name, ctx.env), replyTo: ownerRecipients(agent)[0], ...confirmation })
  }
  return { status: 200, body: { ok: true, inbound: true, status: lead?.status || null } }
}

// POST /api/leads/owner?step=…&lead=…: Twilio webhooks for the owner-first call.
// pressed: the owner pressed a key · dial_done: the owner's call to the lead ended · owner_done: the owner's call ended.
export async function handleOwnerStep({ step, leadId, params = {}, signature, ...deps }) {
  const ctx = context(deps)
  const token = ctx.env.TWILIO_AUTH_TOKEN
  if (!token || !['pressed', 'dial_done', 'owner_done'].includes(step) || !/^[0-9a-f-]{36}$/i.test(String(leadId || ''))) return { status: 403, xml: '<Response/>' }
  if (!safeEqual(signature, twilioSignature(ownerUrl(ctx.env, step, leadId), params, token))) return { status: 403, xml: '<Response/>' }

  const found = await ctx.database.from('rb_leads').select('*').eq('id', leadId).maybeSingle()
  if (found.error) throw found.error
  const lead = found.data
  if (!lead) return { status: 200, xml: '<Response/>' }
  const agentQuery = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', lead.client_id).maybeSingle()
  if (agentQuery.error) throw agentQuery.error
  const agent = agentQuery.data
  const move = async (from, to, extra = {}) => (await rpcRows(ctx.database, 'rb_lead_transition', { p_lead: lead.id, p_from: from, p_to: to, p_notes: extra.notes ?? null, p_next: extra.next ?? null, p_lease: extra.lease ?? false }))[0]

  if (step === 'pressed') {
    if (String(params.Digits) !== '1' || !agent?.twilio_number) return { status: 200, xml: sayTwiml('Okay, the assistant will call them.') }
    const moved = await move(['owner_ringing'], 'owner_connecting', { notes: 'Owner pressed 1' })
    return { status: 200, xml: moved ? ownerDialTwiml(lead, agent, ctx.env) : sayTwiml('This lead is already being handled.') }
  }
  if (step === 'dial_done') {
    if (params.DialCallStatus === 'completed') {
      await move(['owner_connecting'], 'owner_talked', { notes: `Owner talked to them (${Number(params.DialCallDuration) || 0}s)` })
      return { status: 200, xml: '<Response/>' }
    }
    await move(['owner_connecting'], 'retry', { notes: 'Owner called, no answer', next: nextRetryTime(lead, agent, ctx.now) })
    return { status: 200, xml: sayTwiml("They didn't answer. The assistant will try them again later.") }
  }
  // owner_done: if nobody pressed 1, the lead is still owner_ringing → the AI calls now.
  const handover = await move(['owner_ringing'], 'dialing', { lease: true })
  // The owner already had their chance: never ring them again for this lead.
  if (handover && agent) await dialLead(handover, { ...agent, owner_first: false }, ctx)
  return { status: 200, xml: '<Response/>' }
}

// ── Dashboard (GET /api/leads/list, GET|POST /api/leads/agent, POST /api/leads/stop) ──
const LEAD_COLUMNS = 'id, is_test, received_at, name, phone, email, address, zip, service, details, language, consent, status, attempts, first_call_at, last_attempt_at, next_attempt_at, booked, appointment_time, summary, notes, ended_reason, last_error'

// Azul only: what this business's calls cost this month (Vapi's per-call cost).
async function monthCosts(ctx, clientId, agent) {
  const p = localParts(ctx.now, agent?.timezone || 'America/New_York')
  const since = new Date(Date.UTC(p.y, p.m - 1, 1) - 14 * 3600_000).toISOString()
  const q = await ctx.database.from('rb_lead_calls').select('cost_usd, kind, lead:rb_leads(is_test)').eq('client_id', clientId).gte('placed_at', since).limit(20000)
  if (q.error) throw q.error
  // Vapi calls only (owner-first rings are Twilio and unpriced), test calls left out.
  const rows = (q.data || []).filter((r) => r.kind !== 'owner' && !r.lead?.is_test)
  return { month_usd: Math.round(rows.reduce((sum, r) => sum + (Number(r.cost_usd) || 0), 0) * 100) / 100, calls: rows.length, priced: rows.filter((r) => r.cost_usd != null).length }
}

export async function getLeadDashboard({ clientId, isMaster, ...deps }) {
  const ctx = context(deps)
  // The list shows the latest 100; the numbers use every lead from the last 32 days (covers this month in any timezone).
  const since = new Date(ctx.now.getTime() - 32 * 86_400_000).toISOString()
  const [agentQuery, leadsQuery, recentQuery, profileQuery] = await Promise.all([
    ctx.database.from('rb_lead_agents').select('*').eq('client_id', clientId).maybeSingle(),
    ctx.database.from('rb_leads').select(LEAD_COLUMNS).eq('client_id', clientId).order('received_at', { ascending: false }).limit(100),
    ctx.database.from('rb_leads').select('received_at, first_call_at, consent, booked, status').eq('client_id', clientId).eq('is_test', false).gte('received_at', since).limit(10000),
    ctx.database.from('rb_lead_profiles').select('data, updated_at').eq('client_id', clientId).maybeSingle(),
  ])
  for (const q of [agentQuery, leadsQuery, recentQuery, profileQuery]) if (q.error) throw q.error
  const agent = agentQuery.data
  const leads = (leadsQuery.data || []).map((l) => (isMaster ? l : { ...l, last_error: l.last_error ? 'The call could not be placed.' : null }))
  return {
    agent: agentForViewer(agent, isMaster),
    leads,
    stats: leadStats(recentQuery.data || [], agent || {}, ctx.now),
    calls_enabled: ctx.env.LEAD_CALLS_ENABLED === 'true',
    profile: profileQuery.data?.data || null,
    profile_updated_at: profileQuery.data?.updated_at || null,
    gaps: profileGaps(profileQuery.data?.data, agent),
    calendar_share_email: ctx.env.LEAD_CALENDAR_SHARE_EMAIL || null,
    ...(isMaster ? { costs: await monthCosts(ctx, clientId, agent) } : {}),
  }
}

export async function saveLeadAgent({ clientId, body, ...deps }) {
  const ctx = context(deps)
  const client = await ctx.database.from('rb_clients').select('id, services').eq('id', clientId).maybeSingle()
  if (client.error) throw client.error
  if (!client.data) return { status: 404, body: { error: 'Business not found.' } }
  if (body?.rotate_key) {
    const { data, error } = await ctx.database.from('rb_lead_agents').update({ form_key: randomBytes(32).toString('hex'), updated_at: ctx.now.toISOString() }).eq('client_id', clientId).select('*').maybeSingle()
    if (error) throw error
    return data ? { status: 200, body: { agent: data } } : { status: 404, body: { error: 'Save the agent settings first.' } }
  }
  const { row, error: invalid } = validateAgentSettings(body)
  if (invalid) return { status: 400, body: { error: invalid } }
  if (row.assistant_mode === 'azul' && !templateReady()) return { status: 400, body: { error: 'The Azul template isn\'t ready yet: its voice settings still need to be copied from Test AC. Keep "Vapi assistant" for now.' } }
  const { data, error } = await ctx.database.from('rb_lead_agents').upsert({ client_id: clientId, ...row, updated_at: ctx.now.toISOString() }, { onConflict: 'client_id' }).select('*').single()
  if (error) throw error
  const warning = (client.data.services || []).includes('calls') ? null : 'Saved, but Speed-to-Lead Agent is not in this business’s plan, so its website leads are refused. Add it under Workspace access.'
  return { status: 200, body: { agent: data, warning } }
}

export async function stopLead({ clientId, leadId, ...deps }) {
  const ctx = context(deps)
  const found = await ctx.database.from('rb_leads').select('id').eq('id', leadId).eq('client_id', clientId).maybeSingle()
  if (found.error) throw found.error
  if (!found.data) return { status: 404, body: { error: 'Lead not found.' } }
  const [moved] = await rpcRows(ctx.database, 'rb_lead_transition', { p_lead: leadId, p_from: ['retry', 'new'], p_to: 'not_called', p_notes: 'Stopped by your team', p_next: null, p_lease: false })
  return moved ? { status: 200, body: { lead: moved } } : { status: 409, body: { error: 'This lead is not waiting for a call anymore.' } }
}

// ── Callbacks answered by Azul (phone number with no inbound assistant, server URL → call-ended) ──
// Vapi waits at most 7.5 s for this answer. Anything missing: forward the caller to the owner instead of dropping.
async function handleAssistantRequest(message, ctx) {
  const phoneNumberId = message.call?.phoneNumberId || message.phoneNumber?.id
  const found = phoneNumberId ? await ctx.database.from('rb_lead_agents').select('*').eq('vapi_phone_number_id', phoneNumberId).limit(1).maybeSingle() : { data: null }
  if (found.error) throw found.error
  const agent = found.data
  const forward = (why) => {
    console.error('assistant_request_forwarded', why)
    return agent?.owner_cell
      ? { status: 200, body: { destination: { type: 'number', number: agent.owner_cell, message: '' } } }
      : { status: 200, body: { error: 'This number is not set up yet. Please call back later.' } }
  }
  if (!agent) return forward('number not linked to a business')
  if (agent.assistant_mode !== 'azul') return forward('business uses a Vapi assistant: set it as the number’s inbound assistant')
  const profileQuery = await ctx.database.from('rb_lead_profiles').select('data').eq('client_id', agent.client_id).maybeSingle()
  if (profileQuery.error) throw profileQuery.error
  const profile = profileQuery.data?.data && validateProfile(profileQuery.data.data).data
  if (!profile) return forward('business details incomplete')
  return { status: 200, body: { assistant: buildAssistant({ direction: 'inbound', profile, agent, now: ctx.now, serverUrl: callEndedUrl(ctx.env), secret: ctx.env.VAPI_LEAD_AGENT_SECRET }) } }
}

// ── Business details (GET in /list; POST /api/leads/profile) and test calls (POST /api/leads/test-call) ──
export async function saveProfile({ clientId, body, userId, ...deps }) {
  const ctx = context(deps)
  const { data, error: invalid } = validateProfile(body)
  if (invalid) return { status: 400, body: { error: invalid } }
  const { error } = await ctx.database.from('rb_lead_profiles').upsert({ client_id: clientId, data, updated_at: ctx.now.toISOString(), updated_by: userId || null }, { onConflict: 'client_id' })
  if (error) throw error
  return { status: 200, body: { profile: data } }
}

export async function handleTestCall({ clientId, phone, ...deps }) {
  const ctx = context(deps)
  const agentQuery = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', clientId).maybeSingle()
  if (agentQuery.error) throw agentQuery.error
  const agent = agentQuery.data
  if (!agent) return { status: 404, body: { error: 'Save the agent settings first.' } }
  const number = toE164(phone)
  if (!number || !(agent.test_numbers || []).includes(number)) return { status: 400, body: { error: 'Test calls only go to the agent’s test numbers. Add the number in Agent setup first.' } }
  if (ctx.env.LEAD_CALLS_ENABLED !== 'true') return { status: 409, body: { error: 'Automatic calls are switched off for every business (LEAD_CALLS_ENABLED).' } }
  const profileQuery = await ctx.database.from('rb_lead_profiles').select('data').eq('client_id', clientId).maybeSingle()
  if (profileQuery.error) throw profileQuery.error
  const service = profileQuery.data?.data?.services?.[0] || 'a service request'
  const created = await ctx.database.rpc('rb_create_lead', { p_client: clientId, p_data: { name: 'Maria Test', phone: number, service, consent: true, consent_text: 'Test call from the dashboard', page_url: 'dashboard test call', language: 'en', test: true } })
  if (created.error) throw created.error
  const { lead } = created.data
  if (lead.status !== 'new') return { status: 409, body: { error: lead.status === 'blocked' ? 'This number is on the do-not-contact list.' : 'The test lead could not be called.' } }
  const [leased] = await rpcRows(ctx.database, 'rb_claim_lead', { p_lead: lead.id })
  if (!leased) return { status: 409, body: { error: 'The test lead is already being called.' } }
  // A test never rings the owner (owner first) and is never retried.
  const done = await dialLead(leased, { ...agent, owner_first: false }, ctx, { test: true })
  return { status: 200, body: { status: done?.status || 'dialing', last_error: done?.notes || done?.last_error || null } }
}

// ── Scheduled emails (from the retry tick) ──────────────────────────
// After 8 AM Eastern: the daily check-in to Azul (AZUL_OPS_EMAIL) once a day, owners' results on Mondays.
export async function runScheduledEmails(ctx) {
  const p = localParts(ctx.now, 'America/New_York')
  if (p.h < 8) return []
  const dayStart = localDayStart(ctx.now, 'America/New_York').toISOString()
  const claim = async (name) => (await ctx.database.rpc('rb_claim_job', { p_name: name, p_after: dayStart })).data === true
  const sent = []
  if (ctx.env.AZUL_OPS_EMAIL && await claim('daily-digest')) { await sendDailyDigest(ctx); sent.push('daily') }
  if (p.wd === 1 && await claim('weekly-owners')) sent.push(`weekly:${await sendWeeklyOwnerEmails(ctx)}`)
  return sent
}

async function recentData(ctx, days) {
  const since = new Date(ctx.now.getTime() - days * 86_400_000).toISOString()
  const [agentsQuery, leadsQuery, callsQuery] = await Promise.all([
    ctx.database.from('rb_lead_agents').select('*, rb_clients!inner(name, active, services)'),
    ctx.database.from('rb_leads').select('client_id, received_at, name, phone, service, status, first_call_at, booked, last_error, consent').eq('is_test', false).gte('received_at', since).limit(20000),
    ctx.database.from('rb_lead_calls').select('client_id, placed_at, cost_usd, kind, lead:rb_leads(is_test)').gte('placed_at', new Date(ctx.now.getTime() - 32 * 86_400_000).toISOString()).limit(50000),
  ])
  for (const q of [agentsQuery, leadsQuery, callsQuery]) if (q.error) throw q.error
  const agents = (agentsQuery.data || []).filter((a) => a.rb_clients?.active && (a.rb_clients.services || []).includes('calls')).map((a) => ({ ...a, client_name: a.rb_clients.name }))
  // Costs: Vapi calls only (owner-first rings are Twilio and unpriced), test calls left out.
  const calls = (callsQuery.data || []).filter((c) => c.kind !== 'owner' && !c.lead?.is_test)
  return { agents, leads: leadsQuery.data || [], calls }
}

export async function sendDailyDigest(ctx) {
  const { agents, leads, calls } = await recentData(ctx, 8)
  const email = dailyDigest({ agents, leads, calls, now: ctx.now, callsEnabled: ctx.env.LEAD_CALLS_ENABLED === 'true' })
  await notify(ctx.send, { to: String(ctx.env.AZUL_OPS_EMAIL).split(',').map((s) => s.trim()).filter(Boolean), from: senderFor('Azul Lead Agent', ctx.env), ...email })
}

export async function sendWeeklyOwnerEmails(ctx) {
  const { agents, leads } = await recentData(ctx, 7)
  let count = 0
  for (const agent of agents.filter((a) => ['active', 'paused'].includes(a.mode) && a.weekly_email !== false)) {
    const email = weeklyOwnerEmail({ agent, leads: leads.filter((l) => l.client_id === agent.client_id), now: ctx.now })
    await notify(ctx.send, toOwner(agent, ctx.env, { ...email, from: senderFor(`${agent.business_name} via Azul`, ctx.env) }))
    count++
  }
  return count
}

// ── Owner controls (POST /api/leads/controls; the business's team or Azul) ──
export async function saveControls({ clientId, body, ...deps }) {
  const ctx = context(deps)
  const found = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', clientId).maybeSingle()
  if (found.error) throw found.error
  if (!found.data) return { status: 404, body: { error: 'Your agent is not set up yet.' } }
  const { row, error: invalid } = validateControls(body, found.data)
  if (invalid) return { status: 400, body: { error: invalid } }
  const { data, error } = await ctx.database.from('rb_lead_agents').update({ ...row, updated_at: ctx.now.toISOString() }).eq('client_id', clientId).select('*').maybeSingle()
  if (error) throw error
  return { status: 200, body: { agent: agentForViewer(data, false) } }
}

// ── Hosted lead form (GET /api/leads/form-info?slug=…, POST /api/leads/form?slug=…; public) ──
async function hostedAgent(ctx, slug) {
  if (!/^[a-z0-9-]{1,60}$/.test(String(slug || ''))) return null
  const client = await ctx.database.from('rb_clients').select('id, name, active, services').eq('slug', slug).maybeSingle()
  if (client.error) throw client.error
  if (!client.data?.active || !(client.data.services || []).includes('calls')) return null
  const agent = await ctx.database.from('rb_lead_agents').select('*').eq('client_id', client.data.id).maybeSingle()
  if (agent.error) throw agent.error
  return agent.data?.hosted_form && agent.data.privacy_url ? agent.data : null
}

export async function getHostedFormInfo({ slug, ...deps }) {
  const ctx = context(deps)
  const agent = await hostedAgent(ctx, slug)
  if (!agent) return { status: 404, body: { error: 'This form is not available.' } }
  const profile = await ctx.database.from('rb_lead_profiles').select('data').eq('client_id', agent.client_id).maybeSingle()
  if (profile.error) throw profile.error
  return { status: 200, body: { business: agent.business_name, services: profile.data?.data?.services || [], privacy_url: agent.privacy_url, consent: { en: hostedConsentText(agent.business_name, 'en'), es: hostedConsentText(agent.business_name, 'es') } } }
}

export async function handleHostedForm({ slug, body, ip, ...deps }) {
  const ctx = context(deps)
  const agent = await hostedAgent(ctx, slug)
  if (!agent) return { status: 404, body: { error: 'This form is not available.' } }
  // A public form must not become a way to make the agent call strangers. Limits (hosted-form leads only):
  // per visitor (IP) per hour, per phone per day, and per business per hour.
  const pageUrl = `${ctx.env.LEAD_PUBLIC_URL || 'https://app.azulwebdev.com'}/f/${slug}`
  const ipHash = createHash('sha256').update(`azul-lead-form:${String(ip || 'unknown')}`).digest('hex').slice(0, 32)
  const phone = toE164(body?.phone)
  const count = async (filter, sinceMs) => {
    const q = filter(ctx.database.from('rb_leads').select('id', { count: 'exact', head: true }).eq('client_id', agent.client_id).eq('page_url', pageUrl).gte('received_at', new Date(ctx.now.getTime() - sinceMs).toISOString()))
    const r = await q
    if (r.error) throw r.error
    return r.count || 0
  }
  const tooMany = { status: 429, body: { error: 'Too many requests right now. Please call us instead.' } }
  if (await count((q) => q.eq('extra->>ip_hash', ipHash), 3600_000) >= HOSTED_PER_IP_HOURLY) return tooMany
  if (phone && await count((q) => q.eq('phone', phone), 86_400_000) >= HOSTED_PER_PHONE_DAILY) return tooMany
  if (await count((q) => q, 3600_000) >= HOSTED_HOURLY_LIMIT) return tooMany
  const language = body?.language === 'es' ? 'es' : 'en'
  // The consent wording is always the text this form showed, never what the browser sends.
  return ingestLead(agent, { ...body, ip_hash: ipHash, language, consent_text: hostedConsentText(agent.business_name, language), page_url: pageUrl }, ctx)
}
