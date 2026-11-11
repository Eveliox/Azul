import test from 'node:test'
import assert from 'node:assert/strict'
import { handleNewLead, handleCallEnded, processLeadRetries } from '../api/_lib/lead-agent.js'

const KEY = 'k'.repeat(64)
const NOW = new Date('2026-11-10T19:00:00Z') // Tuesday 2:00 PM Eastern
const NIGHT = new Date('2026-11-11T02:00:00Z') // Tuesday 9:00 PM Eastern
const env = { LEAD_CALLS_ENABLED: 'true', VAPI_API_KEY: 'vapi-key', VAPI_LEAD_AGENT_SECRET: 's3cret', EMAIL_FROM: 'Azul <leads@azulwebdev.com>' }
const agent = { client_id: 'c1', business_name: 'Test AC Co.', vapi_assistant_id: 'asst', vapi_phone_number_id: 'pn', owner_email: 'owner@example.com', mode: 'active', test_numbers: [], rb_clients: { active: true, services: ['calls'] } }
const newLead = { id: 'lead-1', client_id: 'c1', name: 'Maria Lopez', phone: '+13055550100', service: 'AC repair', status: 'new', attempts: 0 }
const form = { name: 'Maria Lopez', phone: '(305) 555-0100', consent: 'yes', service: 'AC repair', email: 'maria@example.com' }

// Fake Supabase client: records every rpc and write, answers rpcs from `answers` and reads from `tables`.
function fakeDb({ agentRow = agent, call = null, answers = {}, tables = {}, counts = {} } = {}) {
  const log = []
  const writes = []
  const defaults = {
    rb_create_lead: { created: true, lead: newLead },
    rb_claim_lead: [{ ...newLead, status: 'dialing', lease_token: 'lease-1' }],
    rb_finish_lead_attempt: [{ ...newLead, status: 'calling' }],
    rb_record_call_result: [],
    rb_sweep_stuck_leads: [],
    rb_claim_lead_retries: [],
    rb_lead_transition: [{ ...newLead, status: 'dialing', lease_token: 'lease-2' }],
    rb_record_inbound_call: { recorded: true, lead: null },
  }
  const read = (table) => table in tables ? tables[table] : table === 'rb_lead_agents' ? agentRow : table === 'rb_lead_calls' ? call : null
  return {
    log, writes,
    rpcs: (name) => log.filter((c) => c.name === name),
    async rpc(name, args) { log.push({ name, args }); return { data: name in answers ? answers[name] : defaults[name] } },
    from(table) {
      const one = () => { const v = read(table); return Array.isArray(v) ? v[0] ?? null : v }
      const q = {
        select: () => q, eq: () => q, order: () => q, limit: () => q, gte: () => q,
        in: async () => ({ data: [].concat(read(table) || []) }),
        upsert: (row) => { writes.push({ table, op: 'upsert', row }); return q },
        update: (row) => { writes.push({ table, op: 'update', row }); return q },
        maybeSingle: async () => ({ data: one() }),
        single: async () => ({ data: { ...(one() || {}), ...(writes.at(-1)?.row || {}) } }),
        then: (resolve) => resolve({ data: [].concat(read(table) || []), count: counts[table] ?? 0 }),
      }
      return q
    },
  }
}
function fakeVapi(response = { status: 201, body: { id: 'call-1' } }) {
  const requests = []
  const fetchImpl = async (url, init) => { requests.push({ url, init, body: JSON.parse(init.body) }); return { ok: response.status < 300, status: response.status, json: async () => response.body } }
  return { requests, fetchImpl }
}
function fakeMail() { const sent = []; return { sent, send: async (m) => { sent.push(m); return 'id' } } }

test('new lead: rejects missing or unknown keys without touching the database', async () => {
  const database = fakeDb()
  assert.equal((await handleNewLead({ key: 'short', body: form, database, env })).status, 401)
  assert.equal((await handleNewLead({ key: KEY, body: form, database: fakeDb({ agentRow: null }), env })).status, 401)
  assert.equal((await handleNewLead({ key: KEY, body: form, database: fakeDb({ agentRow: { ...agent, rb_clients: { active: false, services: ['calls'] } } }), env })).status, 401)
  assert.equal(database.log.length, 0)
})

test('new lead: honeypot gets a fake success, bad phone gets 400, nothing saved', async () => {
  const database = fakeDb()
  assert.deepEqual((await handleNewLead({ key: KEY, body: { ...form, website: 'x' }, database, env })).body, { ok: true })
  assert.equal((await handleNewLead({ key: KEY, body: { ...form, phone: '123' }, database, env })).status, 400)
  assert.equal(database.log.length, 0)
})

test('new lead in calling hours: one Vapi call, recorded with its call id', async () => {
  const database = fakeDb(); const vapi = fakeVapi(); const mail = fakeMail()
  const r = await handleNewLead({ key: KEY, body: form, database, env, now: NOW, send: mail.send, fetchImpl: vapi.fetchImpl })
  assert.deepEqual(r, { status: 200, body: { ok: true, status: 'calling' } })
  assert.equal(database.rpcs('rb_create_lead')[0].args.p_data.phone, '+13055550100')
  assert.equal(vapi.requests.length, 1)
  assert.equal(vapi.requests[0].url, 'https://api.vapi.ai/call')
  assert.equal(vapi.requests[0].init.headers.Authorization, 'Bearer vapi-key')
  assert.equal(vapi.requests[0].body.customer.number, '+13055550100')
  assert.deepEqual(database.rpcs('rb_finish_lead_attempt')[0].args, { p_lead: 'lead-1', p_lease: 'lease-1', p_result: { call_id: 'call-1', kind: 'ai' } })
  assert.equal(mail.sent.length, 0)
})

test('new lead after hours: no call, queued for 8 AM, owner told right away', async () => {
  const database = fakeDb(); const vapi = fakeVapi(); const mail = fakeMail()
  await handleNewLead({ key: KEY, body: form, database, env, now: NIGHT, send: mail.send, fetchImpl: vapi.fetchImpl })
  assert.equal(vapi.requests.length, 0)
  assert.deepEqual(database.rpcs('rb_finish_lead_attempt')[0].args.p_result, { status: 'retry', next_attempt_at: '2026-11-11T13:00:00.000Z', notes: 'Outside calling hours' })
  assert.equal(mail.sent.length, 1); assert.equal(mail.sent[0].subject, 'New lead after hours: Maria Lopez')
  assert.match(mail.sent[0].text, /will call them Wednesday, November 11 at 8:00 AM/)
})

test('calls switched off or testing mode: no call, owner told to call', async () => {
  for (const [e, a] of [[{ ...env, LEAD_CALLS_ENABLED: 'false' }, agent], [env, { ...agent, mode: 'testing', test_numbers: ['+13055559999'] }]]) {
    const database = fakeDb({ agentRow: a }); const vapi = fakeVapi(); const mail = fakeMail()
    await handleNewLead({ key: KEY, body: form, database, env: e, now: NOW, send: mail.send, fetchImpl: vapi.fetchImpl })
    assert.equal(vapi.requests.length, 0)
    assert.equal(database.rpcs('rb_finish_lead_attempt')[0].args.p_result.status, 'not_called')
    assert.equal(mail.sent.length, 1); assert.deepEqual(mail.sent[0].to, ['owner@example.com'])
    assert.match(mail.sent[0].subject, /not called by the agent: Maria Lopez/)
  }
})

test('Vapi failure: attempt recorded as an error and the owner is emailed right away', async () => {
  const database = fakeDb({ answers: { rb_finish_lead_attempt: [{ ...newLead, status: 'retry' }] } })
  const vapi = fakeVapi({ status: 402, body: { message: ['Insufficient credits'] } }); const mail = fakeMail()
  const r = await handleNewLead({ key: KEY, body: form, database, env, now: NOW, send: mail.send, fetchImpl: vapi.fetchImpl })
  assert.equal(r.body.status, 'retry')
  const result = database.rpcs('rb_finish_lead_attempt')[0].args.p_result
  assert.equal(result.error, 'Vapi 402: Insufficient credits'); assert.equal(result.next_attempt_at, '2026-11-10T21:00:00.000Z')
  assert.equal(mail.sent[0].subject, 'Call this lead yourself: Maria Lopez')
  assert.match(mail.sent[0].text, /try again later/)
})

test('duplicate submit and missing consent never dial', async () => {
  const vapi = fakeVapi()
  const dup = fakeDb({ answers: { rb_create_lead: { created: false, lead: newLead } } })
  assert.deepEqual((await handleNewLead({ key: KEY, body: form, database: dup, env, now: NOW, fetchImpl: vapi.fetchImpl, send: fakeMail().send })).body, { ok: true, duplicate: true })
  const mail = fakeMail()
  const noConsent = fakeDb({ answers: { rb_create_lead: { created: true, lead: { ...newLead, status: 'not_called' } } } })
  await handleNewLead({ key: KEY, body: { ...form, consent: 'no' }, database: noConsent, env, now: NOW, fetchImpl: vapi.fetchImpl, send: mail.send })
  assert.equal(vapi.requests.length, 0)
  assert.equal(dup.rpcs('rb_claim_lead').length + noConsent.rpcs('rb_claim_lead').length, 0)
  assert.equal(mail.sent[0].subject, 'New lead, no permission to call: Maria Lopez')
})

const report = (result, endedReason = 'assistant-ended-call') => ({ message: {
  type: 'end-of-call-report', endedReason, call: { id: 'call-1' }, analysis: { summary: 'Booked AC repair.' }, durationSeconds: 120,
  artifact: { structuredOutputs: { abc: { result } } },
} })

test('call ended: checks the secret and ignores other messages and unknown calls', async () => {
  const database = fakeDb()
  assert.equal((await handleCallEnded({ secret: 'wrong', body: report({}), database, env })).status, 401)
  assert.equal((await handleCallEnded({ secret: 's3cret', body: report({}), database, env: { ...env, VAPI_LEAD_AGENT_SECRET: '' } })).status, 401)
  assert.match((await handleCallEnded({ secret: 's3cret', body: { message: { type: 'status-update' } }, database, env })).body.ignored, /end-of-call/)
  assert.match((await handleCallEnded({ secret: 's3cret', body: report({}), database, env })).body.ignored, /unknown/)
  assert.equal(database.log.length, 0)
})

test('call ended with a booking: status saved, owner email, customer confirmation with reply-to owner', async () => {
  const lead = { ...newLead, email: 'maria@example.com', status: 'calling', attempts: 1, last_attempt_at: NOW.toISOString() }
  const database = fakeDb({ call: { call_id: 'call-1', ended_at: null, client_id: 'c1', lead }, answers: { rb_record_call_result: [{ ...lead, status: 'booked' }] } })
  const mail = fakeMail()
  const r = await handleCallEnded({ secret: 's3cret', body: report({ appointment_booked: true, appointment_time: '2026-11-12T09:00:00-05:00' }), database, env, now: NOW, send: mail.send })
  assert.deepEqual(r.body, { ok: true, status: 'booked' })
  const recorded = database.rpcs('rb_record_call_result')[0].args
  assert.equal(recorded.p_call_id, 'call-1'); assert.equal(recorded.p_result.status, 'booked'); assert.equal(recorded.p_result.appointment_time, '2026-11-12T09:00:00-05:00')
  assert.equal(mail.sent.length, 2)
  assert.equal(mail.sent[0].subject, 'Booked: Maria Lopez · Thursday, November 12 at 9:00 AM')
  assert.deepEqual(mail.sent[1].to, ['maria@example.com']); assert.equal(mail.sent[1].replyTo, 'owner@example.com')
  assert.equal(mail.sent[1].from, '"Test AC Co." <leads@azulwebdev.com>')
})

test('call ended twice: second report sends no email', async () => {
  const lead = { ...newLead, status: 'calling', attempts: 1 }
  const database = fakeDb({ call: { call_id: 'call-1', ended_at: null, client_id: 'c1', lead }, answers: { rb_record_call_result: [] } })
  const mail = fakeMail()
  const r = await handleCallEnded({ secret: 's3cret', body: report({}, 'voicemail'), database, env, now: NOW, send: mail.send })
  assert.match(r.body.ignored, /already recorded/); assert.equal(mail.sent.length, 0)
})

test('retry worker: off unless enabled; emails owner about stuck leads; dials claimed leads', async () => {
  const off = fakeDb()
  assert.deepEqual(await processLeadRetries({ database: off, env: {}, now: new Date('2026-11-16T12:00:00Z') }), { disabled: true, swept: 0, processed: 0 })
  assert.equal(off.log.length, 0)
  const stuck = { ...newLead, id: 'lead-2', status: 'needs_owner', notes: 'No call report arrived from Vapi.' }
  const due = { ...newLead, status: 'dialing', lease_token: 'lease-9', attempts: 1, last_attempt_at: '2026-11-10T17:00:00Z' }
  const database = fakeDb({ answers: { rb_sweep_stuck_leads: [stuck], rb_claim_lead_retries: [due] } })
  const vapi = fakeVapi(); const mail = fakeMail()
  assert.deepEqual(await processLeadRetries({ database, env, now: NOW, send: mail.send, fetchImpl: vapi.fetchImpl }), { swept: 1, processed: 1, failed: 0 })
  assert.equal(mail.sent[0].subject, 'Check this lead: Maria Lopez')
  assert.equal(vapi.requests.length, 1)
  assert.equal(database.rpcs('rb_finish_lead_attempt')[0].args.p_lease, 'lease-9')
})

// ── Owner first ─────────────────────────────────────────────────────
import { twilioSignature, ownerUrl } from '../api/_lib/leads.js'
import { handleOwnerStep, getLeadDashboard, saveLeadAgent, stopLead } from '../api/_lib/lead-agent.js'
const ownerAgent = { ...agent, owner_first: true, owner_cell: '+13055559999', twilio_number: '+13055550000' }
const twilioEnv = { ...env, TWILIO_ACCOUNT_SID: 'AC123', TWILIO_AUTH_TOKEN: 'tw-token' }
function fakeProviders() {
  const requests = []
  const fetchImpl = async (url, init) => {
    requests.push({ url, init })
    if (url.includes('twilio.com')) return { ok: true, status: 201, json: async () => ({ sid: 'CA-owner-1' }) }
    return { ok: true, status: 201, json: async () => ({ id: 'call-ai-1' }) }
  }
  return { requests, fetchImpl }
}

test('owner first: rings the owner from the business number instead of calling the lead', async () => {
  const database = fakeDb({ agentRow: ownerAgent, answers: { rb_finish_lead_attempt: [{ ...newLead, status: 'owner_ringing' }] } }); const p = fakeProviders()
  const r = await handleNewLead({ key: KEY, body: form, database, env: twilioEnv, now: NOW, send: fakeMail().send, fetchImpl: p.fetchImpl })
  assert.equal(r.body.status, 'owner_ringing')
  assert.equal(p.requests.length, 1); assert.match(p.requests[0].url, /Accounts\/AC123\/Calls\.json$/)
  assert.equal(p.requests[0].init.headers.Authorization, `Basic ${Buffer.from('AC123:tw-token').toString('base64')}`)
  const sent = new URLSearchParams(p.requests[0].init.body)
  assert.equal(sent.get('To'), '+13055559999'); assert.equal(sent.get('From'), '+13055550000')
  assert.equal(sent.get('StatusCallback'), 'https://app.azulwebdev.com/api/leads/owner?step=owner_done&lead=lead-1')
  assert.match(sent.get('Twiml'), /Maria, AC repair\. Press 1/); assert.match(sent.get('Twiml'), /step=pressed&amp;lead=lead-1/)
  assert.deepEqual(database.rpcs('rb_finish_lead_attempt')[0].args.p_result, { call_id: 'CA-owner-1', kind: 'owner' })
})

test('owner first: if Twilio fails the AI calls right away; retries never ring the owner again', async () => {
  const p = { requests: [], fetchImpl: async (url, init) => { p.requests.push(url); return url.includes('twilio') ? { ok: false, status: 401, json: async () => ({ message: 'Authenticate' }) } : { ok: true, status: 201, json: async () => ({ id: 'call-ai-1' }) } } }
  const database = fakeDb({ agentRow: ownerAgent })
  await handleNewLead({ key: KEY, body: form, database, env: twilioEnv, now: NOW, send: fakeMail().send, fetchImpl: p.fetchImpl })
  assert.equal(p.requests.length, 2); assert.match(p.requests[1], /api\.vapi\.ai/)
  assert.deepEqual(database.rpcs('rb_finish_lead_attempt')[0].args.p_result, { call_id: 'call-ai-1', kind: 'ai' })
  const due = { ...newLead, status: 'dialing', lease_token: 'l', first_call_at: '2026-11-10T17:00:00Z', attempts: 1, last_attempt_at: '2026-11-10T17:00:00Z' }
  const p2 = fakeProviders()
  await processLeadRetries({ database: fakeDb({ agentRow: ownerAgent, answers: { rb_claim_lead_retries: [due] } }), env: twilioEnv, now: NOW, send: fakeMail().send, fetchImpl: p2.fetchImpl })
  assert.equal(p2.requests.length, 1); assert.match(p2.requests[0].url, /api\.vapi\.ai/)
})

const LEAD_ID = '11111111-2222-4333-8444-555555555555'
const ownerLead = { ...newLead, id: LEAD_ID, status: 'owner_ringing', first_call_at: NOW.toISOString(), attempts: 0 }
const signed = (step, params) => ({ step, leadId: LEAD_ID, params, signature: twilioSignature(ownerUrl(twilioEnv, step, LEAD_ID), params, 'tw-token') })

test('owner steps: unsigned or forged requests are refused before any database access', async () => {
  const database = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead } })
  assert.equal((await handleOwnerStep({ ...signed('pressed', { Digits: '1' }), signature: 'forged', database, env: twilioEnv })).status, 403)
  const r = signed('pressed', { Digits: '1' })
  assert.equal((await handleOwnerStep({ ...r, params: { Digits: '9' }, database, env: twilioEnv })).status, 403, 'params changed after signing')
  assert.equal((await handleOwnerStep({ ...r, database, env: { ...twilioEnv, TWILIO_AUTH_TOKEN: '' } })).status, 403)
  assert.equal(database.log.length, 0)
})

test('owner presses 1: connected to the lead from the business number', async () => {
  const database = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead }, answers: { rb_lead_transition: [{ ...ownerLead, status: 'owner_connecting' }] } })
  const r = await handleOwnerStep({ ...signed('pressed', { Digits: '1', CallSid: 'CA-owner-1' }), database, env: twilioEnv })
  assert.equal(r.status, 200)
  assert.match(r.xml, /<Dial callerId="\+13055550000"[^>]*action="https:\/\/app\.azulwebdev\.com\/api\/leads\/owner\?step=dial_done&amp;lead=/)
  assert.match(r.xml, /<Number>\+13055550100<\/Number>/)
  assert.deepEqual(database.rpcs('rb_lead_transition')[0].args.p_from, ['owner_ringing'])
  const other = await handleOwnerStep({ ...signed('pressed', { Digits: '5' }), database: fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead } }), env: twilioEnv })
  assert.match(other.xml, /assistant will call them/)
})

test('owner did not press 1: the AI calls the lead when the owner call ends', async () => {
  const database = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead } }); const p = fakeProviders()
  await handleOwnerStep({ ...signed('owner_done', { CallStatus: 'completed' }), database, env: twilioEnv, now: NOW, send: fakeMail().send, fetchImpl: p.fetchImpl })
  assert.deepEqual(database.rpcs('rb_lead_transition')[0].args, { p_lead: LEAD_ID, p_from: ['owner_ringing'], p_to: 'dialing', p_notes: null, p_next: null, p_lease: true })
  assert.equal(p.requests.length, 1); assert.match(p.requests[0].url, /api\.vapi\.ai/)
  const none = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead }, answers: { rb_lead_transition: [] } }); const p2 = fakeProviders()
  await handleOwnerStep({ ...signed('owner_done', {}), database: none, env: twilioEnv, now: NOW, fetchImpl: p2.fetchImpl })
  assert.equal(p2.requests.length, 0, 'owner already connected: no AI call')
})

test('owner connected but the lead did not answer: queued for an AI retry', async () => {
  const database = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead } })
  const r = await handleOwnerStep({ ...signed('dial_done', { DialCallStatus: 'no-answer' }), database, env: twilioEnv, now: NOW })
  const args = database.rpcs('rb_lead_transition')[0].args
  assert.equal(args.p_to, 'retry'); assert.deepEqual(args.p_from, ['owner_connecting']); assert.equal(args.p_next, '2026-11-10T21:00:00.000Z')
  assert.match(r.xml, /try them again later/)
  const talked = fakeDb({ agentRow: ownerAgent, tables: { rb_leads: ownerLead } })
  await handleOwnerStep({ ...signed('dial_done', { DialCallStatus: 'completed', DialCallDuration: '95' }), database: talked, env: twilioEnv, now: NOW })
  assert.equal(talked.rpcs('rb_lead_transition')[0].args.p_to, 'owner_talked')
})

// ── Inbound callbacks ───────────────────────────────────────────────
test('inbound callback: recorded against the business by its number, owner emailed', async () => {
  const lead = { ...newLead, status: 'needs_owner', email: 'maria@example.com' }
  const database = fakeDb({ answers: { rb_record_inbound_call: { recorded: true, lead: { ...lead, status: 'booked' } } } }); const mail = fakeMail()
  const body = { message: { type: 'end-of-call-report', endedReason: 'customer-ended-call', durationSeconds: 80, transcript: 'User: calling back',
    call: { id: 'in-1', type: 'inboundPhoneCall', phoneNumberId: 'pn', customer: { number: '+13055550100' } },
    analysis: { summary: 'Booked Thursday.' }, artifact: { structuredOutputs: { x: { result: { appointment_booked: true, appointment_time: '2026-11-12T10:00:00-05:00' } } } } } }
  const r = await handleCallEnded({ secret: 's3cret', body, database, env, now: NOW, send: mail.send })
  assert.deepEqual(r.body, { ok: true, inbound: true, status: 'booked' })
  const args = database.rpcs('rb_record_inbound_call')[0].args
  assert.equal(args.p_client, 'c1'); assert.equal(args.p_phone, '+13055550100'); assert.equal(args.p_result.booked, true)
  assert.equal(mail.sent[0].subject, 'Booked on a callback: Maria Lopez · Thursday, November 12 at 10:00 AM')
  assert.deepEqual(mail.sent[1].to, ['maria@example.com'])
})

test('inbound callback: unknown number ignored, duplicate report sends nothing, hang-ups not emailed', async () => {
  const msg = (extra = {}) => ({ message: { type: 'end-of-call-report', durationSeconds: 3, call: { id: 'in-2', type: 'inboundPhoneCall', phoneNumberId: 'pn', customer: { number: '+13055550100' } }, ...extra } })
  assert.match((await handleCallEnded({ secret: 's3cret', body: msg(), database: fakeDb({ agentRow: null }), env })).body.ignored, /not linked/)
  const mail = fakeMail()
  await handleCallEnded({ secret: 's3cret', body: msg(), database: fakeDb({ answers: { rb_record_inbound_call: { recorded: false } } }), env, send: mail.send })
  await handleCallEnded({ secret: 's3cret', body: msg(), database: fakeDb(), env, send: mail.send })
  assert.equal(mail.sent.length, 0)
})

// ── Dashboard ───────────────────────────────────────────────────────
test('dashboard: a business team never sees the form key, Vapi IDs or raw provider errors', async () => {
  const fullAgent = { ...agent, form_key: 'f'.repeat(64), test_numbers: ['+13055550100'] }
  const leads = [{ ...newLead, received_at: NOW.toISOString(), status: 'retry', last_error: 'Vapi 402: card declined for acct 123' }]
  const team = await getLeadDashboard({ clientId: 'c1', isMaster: false, database: fakeDb({ agentRow: fullAgent, tables: { rb_leads: leads } }), env, now: NOW })
  assert.equal(team.agent.form_key, undefined); assert.equal(team.agent.vapi_assistant_id, undefined); assert.equal(team.agent.test_numbers, undefined)
  assert.equal(team.leads[0].last_error, 'The call could not be placed.')
  assert.equal(team.calls_enabled, true); assert.equal(team.stats.leads, 1)
  const azul = await getLeadDashboard({ clientId: 'c1', isMaster: true, database: fakeDb({ agentRow: fullAgent, tables: { rb_leads: leads } }), env, now: NOW })
  assert.equal(azul.agent.form_key, 'f'.repeat(64)); assert.match(azul.leads[0].last_error, /402/)
})

test('agent settings: validated, saved with upsert, warning when the plan lacks the agent', async () => {
  const settings = { business_name: 'Test AC Co.', vapi_assistant_id: 'asst-1', vapi_phone_number_id: 'pn-1', owner_email: 'owner@example.com', mode: 'testing', test_numbers: '(786) 424-9866' }
  const database = fakeDb({ tables: { rb_clients: { id: 'c1', services: ['website'] } } })
  const r = await saveLeadAgent({ clientId: 'c1', body: settings, database, env, now: NOW })
  assert.equal(r.status, 200); assert.match(r.body.warning, /not in this business/)
  assert.deepEqual(database.writes[0].row.test_numbers, ['+17864249866'])
  assert.equal(database.writes[0].row.client_id, 'c1')
  assert.equal((await saveLeadAgent({ clientId: 'c1', body: { ...settings, owner_email: 'nope' }, database, env, now: NOW })).status, 400)
  const rotate = fakeDb({ tables: { rb_clients: { id: 'c1', services: ['calls'] } } })
  await saveLeadAgent({ clientId: 'c1', body: { rotate_key: true }, database: rotate, env, now: NOW })
  assert.match(rotate.writes[0].row.form_key, /^[0-9a-f]{64}$/)
  assert.equal((await saveLeadAgent({ clientId: 'c9', body: settings, database: fakeDb({ tables: { rb_clients: null } }), env })).status, 404)
})

test('stop calling: only this business’s queued leads', async () => {
  assert.equal((await stopLead({ clientId: 'c1', leadId: 'x', database: fakeDb({ tables: { rb_leads: null } }), env })).status, 404)
  const database = fakeDb({ tables: { rb_leads: { id: 'lead-1' } }, answers: { rb_lead_transition: [{ ...newLead, status: 'not_called' }] } })
  const r = await stopLead({ clientId: 'c1', leadId: 'lead-1', database, env })
  assert.equal(r.status, 200); assert.deepEqual(database.rpcs('rb_lead_transition')[0].args.p_from, ['retry', 'new'])
  assert.equal((await stopLead({ clientId: 'c1', leadId: 'lead-1', database: fakeDb({ tables: { rb_leads: { id: 'lead-1' } }, answers: { rb_lead_transition: [] } }), env })).status, 409)
})

// ── Azul-built assistants, callbacks answered by Azul, test calls, business details ──
import { saveProfile, handleTestCall } from '../api/_lib/lead-agent.js'
const goodProfile = { trade: 'air conditioning', area: 'Hialeah, Florida', visit_name: 'AC service visit', visit_minutes: 60, services: ['AC repair'], questions: [], emergencies: [], service_zips: [], booking_days: [1, 2, 3, 4, 5], booking_start_hour: 8, booking_end_hour: 17, min_notice_hours: 2, calendar_shared: true }
const azulAgent = { ...agent, assistant_mode: 'azul', vapi_assistant_id: null, calendar_tool_ids: ['t-check', 't-book'], owner_cell: '+13055559999', test_numbers: ['+17864249866'] }

test('azul mode: the call carries an assistant built from the business details', async () => {
  const database = fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: { data: goodProfile } } }); const vapi = fakeVapi()
  await handleNewLead({ key: KEY, body: form, database, env, now: NOW, send: fakeMail().send, fetchImpl: vapi.fetchImpl })
  const body = vapi.requests[0].body
  assert.equal(body.assistantId, undefined); assert.equal(body.phoneNumberId, 'pn'); assert.equal(body.customer.number, '+13055550100')
  assert.match(body.assistant.model.messages[0].content, /You are calling Maria/)
  assert.deepEqual(body.assistant.model.toolIds, ['t-check', 't-book'])
  assert.equal(body.assistant.server.url, 'https://app.azulwebdev.com/api/leads/call-ended')
})

test('azul mode without business details: no call, owner told why', async () => {
  const database = fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: null } }); const vapi = fakeVapi(); const mail = fakeMail()
  await handleNewLead({ key: KEY, body: form, database, env, now: NOW, send: mail.send, fetchImpl: vapi.fetchImpl })
  assert.equal(vapi.requests.length, 0)
  assert.match(database.rpcs('rb_finish_lead_attempt')[0].args.p_result.error, /Business details are missing/)
  assert.match(mail.sent[0].text, /Business details are missing/)
})

test('callback: Azul answers with the inbound assistant, or forwards to the owner', async () => {
  const req = { message: { type: 'assistant-request', call: { id: 'in-9', type: 'inboundPhoneCall', phoneNumberId: 'pn', customer: { number: '+13055550100' } } } }
  const ok = await handleCallEnded({ secret: 's3cret', body: req, database: fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: { data: goodProfile } } }), env, now: NOW })
  assert.match(ok.body.assistant.model.messages[0].content, /Someone is calling the company's number/)
  assert.equal(ok.body.assistant.voicemailDetection, 'off')
  const vapiMode = await handleCallEnded({ secret: 's3cret', body: req, database: fakeDb({ agentRow: { ...azulAgent, assistant_mode: 'vapi' } }), env, now: NOW })
  assert.deepEqual(vapiMode.body, { destination: { type: 'number', number: '+13055559999', message: '' } })
  const noDetails = await handleCallEnded({ secret: 's3cret', body: req, database: fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: null } }), env, now: NOW })
  assert.equal(noDetails.body.destination.number, '+13055559999')
  const unknown = await handleCallEnded({ secret: 's3cret', body: req, database: fakeDb({ agentRow: null }), env, now: NOW })
  assert.match(unknown.body.error, /not set up/)
  assert.equal((await handleCallEnded({ secret: 'wrong', body: req, database: fakeDb(), env })).status, 401)
})

test('test call: only test numbers, any hour, never deduplicated', async () => {
  const lead = { ...newLead, phone: '+17864249866' }
  const answers = { rb_create_lead: { created: true, lead }, rb_claim_lead: [{ ...lead, status: 'dialing', lease_token: 'l' }] }
  assert.equal((await handleTestCall({ clientId: 'c1', phone: '(305) 555-0100', database: fakeDb({ agentRow: azulAgent }), env })).status, 400)
  assert.equal((await handleTestCall({ clientId: 'c1', phone: '786-424-9866', database: fakeDb({ agentRow: azulAgent }), env: { ...env, LEAD_CALLS_ENABLED: 'false' } })).status, 409)
  const database = fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: { data: goodProfile } }, answers }); const vapi = fakeVapi()
  const r = await handleTestCall({ clientId: 'c1', phone: '786-424-9866', database, env, now: NIGHT, send: fakeMail().send, fetchImpl: vapi.fetchImpl })
  assert.equal(r.status, 200); assert.equal(vapi.requests.length, 1, 'calls even at 9 PM')
  const data = database.rpcs('rb_create_lead')[0].args.p_data
  assert.equal(data.test, true); assert.equal(data.service, 'AC repair'); assert.equal(data.consent, true)
})

test('business details: validated and saved with who changed them', async () => {
  const database = fakeDb()
  assert.equal((await saveProfile({ clientId: 'c1', body: { ...goodProfile, trade: '' }, database, env })).status, 400)
  const r = await saveProfile({ clientId: 'c1', body: goodProfile, userId: 'u1', database, env, now: NOW })
  assert.equal(r.status, 200); assert.equal(database.writes[0].table, 'rb_lead_profiles'); assert.equal(database.writes[0].row.updated_by, 'u1')
})

test('dashboard includes business details and what is missing', async () => {
  const d = await getLeadDashboard({ clientId: 'c1', isMaster: false, database: fakeDb({ agentRow: azulAgent, tables: { rb_leads: [], rb_lead_profiles: { data: goodProfile, updated_at: 'x' } } }), env: { ...env, LEAD_CALENDAR_SHARE_EMAIL: 'calendar@azul.test' }, now: NOW })
  assert.equal(d.profile.trade, 'air conditioning'); assert.deepEqual(d.gaps, []); assert.equal(d.calendar_share_email, 'calendar@azul.test')
  assert.equal(d.agent.calendar_tool_ids, undefined, 'tool IDs stay Azul-only')
})

test('switching to the Azul template is refused until the voice is set', async () => {
  const { templateReady } = await import('../api/_lib/lead-prompts.js')
  const body = { business_name: 'Test AC Co.', assistant_mode: 'azul', calendar_tool_ids: 't1, t2', vapi_phone_number_id: 'pn-1', owner_email: 'owner@example.com', mode: 'testing', test_numbers: '786 424 9866' }
  const r = await saveLeadAgent({ clientId: 'c1', body, database: fakeDb({ tables: { rb_clients: { id: 'c1', services: ['calls'] } } }), env, now: NOW })
  assert.equal(r.status, templateReady() ? 200 : 400)
  const cal = await saveLeadAgent({ clientId: 'c1', body: { ...body, calendar_tool_ids: '', calendar_id: 'abc@group.calendar.google.com' }, database: fakeDb({ tables: { rb_clients: { id: 'c1', services: ['calls'] } } }), env, now: NOW })
  assert.equal(cal.status, 200)
  assert.equal((await saveLeadAgent({ clientId: 'c1', body: { ...body, calendar_tool_ids: '' }, database: fakeDb({ tables: { rb_clients: { id: 'c1', services: ['calls'] } } }), env, now: NOW })).status, 400, 'template needs a calendar')
  assert.equal((await saveLeadAgent({ clientId: 'c1', body: { ...body, calendar_id: 'not a calendar' }, database: fakeDb({ tables: { rb_clients: { id: 'c1', services: ['calls'] } } }), env, now: NOW })).status, 400)
})

test('test calls: never ring the owner, never retried, failures stay on the dashboard', async () => {
  const lead = { ...newLead, phone: '+17864249866', is_test: true }
  const ownerFirst = { ...azulAgent, owner_first: true, twilio_number: '+13055550000' }
  const answers = { rb_create_lead: { created: true, lead }, rb_claim_lead: [{ ...lead, status: 'dialing', lease_token: 'l' }] }
  const p = fakeProviders()
  await handleTestCall({ clientId: 'c1', phone: '786-424-9866', database: fakeDb({ agentRow: ownerFirst, tables: { rb_lead_profiles: { data: goodProfile } }, answers }), env: twilioEnv, now: NOW, send: fakeMail().send, fetchImpl: p.fetchImpl })
  assert.equal(p.requests.length, 1); assert.match(p.requests[0].url, /api\.vapi\.ai/, 'owner first skipped for tests')
  const broken = fakeDb({ agentRow: azulAgent, tables: { rb_lead_profiles: null }, answers: { ...answers, rb_finish_lead_attempt: [{ ...lead, status: 'not_called', notes: 'Test call failed: Business details are missing' }] } }); const mail = fakeMail()
  const r = await handleTestCall({ clientId: 'c1', phone: '786-424-9866', database: broken, env, now: NOW, send: mail.send, fetchImpl: fakeVapi().fetchImpl })
  assert.equal(broken.rpcs('rb_finish_lead_attempt')[0].args.p_result.status, 'not_called')
  assert.match(r.body.last_error, /Test call failed/); assert.equal(mail.sent.length, 0, 'no owner alert for a test')
  const ended = fakeDb({ call: { call_id: 'call-1', ended_at: null, client_id: 'c1', lead: { ...lead, status: 'calling', attempts: 1 } }, answers: { rb_record_call_result: [{ ...lead, status: 'no_answer', attempts: 1 }] } }); const mail2 = fakeMail()
  await handleCallEnded({ secret: 's3cret', body: report({}, 'voicemail'), database: ended, env, now: NOW, send: mail2.send })
  assert.equal(ended.rpcs('rb_record_call_result')[0].args.p_result.status, 'no_answer', 'a test is never queued for a retry')
  assert.match(mail2.sent[0].subject, /^\[Test\] /)
})

// ── Costs, scheduled emails, owner controls, hosted form ────────────
import { runScheduledEmails, saveControls, getHostedFormInfo, handleHostedForm } from '../api/_lib/lead-agent.js'
const MONDAY_9AM = new Date('2026-11-16T14:00:00Z'), MONDAY_7AM = new Date('2026-11-16T12:00:00Z'), TUESDAY_9AM = new Date('2026-11-17T14:00:00Z')

test('call cost from the Vapi report is saved with the result', async () => {
  const lead = { ...newLead, status: 'calling', attempts: 1 }
  const database = fakeDb({ call: { call_id: 'call-1', ended_at: null, client_id: 'c1', lead }, answers: { rb_record_call_result: [{ ...lead, status: 'needs_owner' }] } })
  const body = report({}, 'customer-ended-call'); body.message.cost = 0.1834
  await handleCallEnded({ secret: 's3cret', body, database, env, now: NOW, send: fakeMail().send })
  assert.equal(database.rpcs('rb_record_call_result')[0].args.p_result.cost, '0.1834')
})

test('scheduled emails: after 8 AM Eastern, daily check-in once a day, owners on Mondays', async () => {
  const live = { ...agent, mode: 'active', rb_clients: { name: 'Test AC Co.', active: true, services: ['calls'] } }
  const opsEnv = { ...env, AZUL_OPS_EMAIL: 'me@azul.test' }
  assert.deepEqual(await runScheduledEmails({ database: fakeDb(), env: opsEnv, now: MONDAY_7AM, send: fakeMail().send }), [], 'nothing before 8 AM')
  const mail = fakeMail()
  const sent = await runScheduledEmails({ database: fakeDb({ agentRow: live, answers: { rb_claim_job: true }, tables: { rb_leads: [], rb_lead_calls: [] } }), env: opsEnv, now: MONDAY_9AM, send: mail.send })
  assert.deepEqual(sent, ['daily', 'weekly:1'])
  assert.deepEqual(mail.sent[0].to, ['me@azul.test']); assert.match(mail.sent[0].subject, /^Azul daily: 0 leads/)
  assert.deepEqual(mail.sent[1].to, ['owner@example.com']); assert.match(mail.sent[1].subject, /no new leads this week/)
  const tuesday = fakeMail()
  assert.deepEqual(await runScheduledEmails({ database: fakeDb({ agentRow: live, answers: { rb_claim_job: true }, tables: { rb_leads: [], rb_lead_calls: [] } }), env: opsEnv, now: TUESDAY_9AM, send: tuesday.send }), ['daily'])
  const already = fakeMail()
  assert.deepEqual(await runScheduledEmails({ database: fakeDb({ agentRow: live, answers: { rb_claim_job: false } }), env: opsEnv, now: MONDAY_9AM, send: already.send }), [])
  assert.equal(already.sent.length, 0, 'claimed by an earlier tick')
  assert.deepEqual(await runScheduledEmails({ database: fakeDb({ agentRow: { ...live, mode: 'testing' }, answers: { rb_claim_job: true }, tables: { rb_leads: [], rb_lead_calls: [] } }), env, now: MONDAY_9AM, send: fakeMail().send }), ['weekly:0'], 'no AZUL_OPS_EMAIL: no daily; testing clients get no weekly')
})

test('owner controls are saved for the business only through validation', async () => {
  const database = fakeDb({ agentRow: { ...agent, mode: 'active', twilio_number: '+13055550000' } })
  const r = await saveControls({ clientId: 'c1', body: { mode: 'paused', owner_email: 'owner@example.com', call_start_hour: 9, call_end_hour: 18 }, database, env, now: NOW })
  assert.equal(r.status, 200); assert.equal(database.writes[0].row.mode, 'paused'); assert.equal(database.writes[0].row.call_start_hour, 9)
  assert.equal(r.body.agent.form_key, undefined)
  assert.equal((await saveControls({ clientId: 'c1', body: { mode: 'active', owner_email: 'o@x.com' }, database: fakeDb({ agentRow: { ...agent, mode: 'testing' } }), env })).status, 400)
  assert.equal((await saveControls({ clientId: 'c1', body: {}, database: fakeDb({ agentRow: null }), env })).status, 404)
})

test('hosted form: only when switched on with a privacy page; consent text set by the server; rate-limited', async () => {
  const client = { id: 'c1', name: 'Test AC Co.', active: true, services: ['calls'] }
  const hosted = { ...agent, hosted_form: true, privacy_url: 'https://testac.example/privacy' }
  const tables = { rb_clients: client, rb_lead_profiles: { data: { services: ['AC repair'] } } }
  assert.equal((await getHostedFormInfo({ slug: 'Bad Slug!', database: fakeDb(), env })).status, 404)
  assert.equal((await getHostedFormInfo({ slug: 'test-ac', database: fakeDb({ agentRow: { ...hosted, hosted_form: false }, tables }), env })).status, 404)
  assert.equal((await getHostedFormInfo({ slug: 'test-ac', database: fakeDb({ agentRow: { ...hosted, privacy_url: null }, tables }), env })).status, 404)
  const info = await getHostedFormInfo({ slug: 'test-ac', database: fakeDb({ agentRow: hosted, tables }), env })
  assert.deepEqual(info.body.services, ['AC repair']); assert.match(info.body.consent.es, /^Acepto/)
  assert.equal(info.body.privacy_url, 'https://testac.example/privacy'); assert.equal(info.body.form_key, undefined)
  const database = fakeDb({ agentRow: hosted, tables }); const vapi = fakeVapi()
  await handleHostedForm({ slug: 'test-ac', body: { ...form, language: 'es', consent_text: 'I agree to nothing', page_url: 'https://evil.example' }, database, env, now: NOW, send: fakeMail().send, fetchImpl: vapi.fetchImpl })
  const data = database.rpcs('rb_create_lead')[0].args.p_data
  assert.match(data.consent_text, /^Acepto que Test AC Co\./); assert.equal(data.page_url, 'https://app.azulwebdev.com/f/test-ac')
  assert.equal(vapi.requests.length, 1)
  const flooded = await handleHostedForm({ slug: 'test-ac', body: form, database: fakeDb({ agentRow: hosted, tables, counts: { rb_leads: 30 } }), env, now: NOW })
  assert.equal(flooded.status, 429)
})

test('Azul sees this month\'s call costs on the dashboard; the business does not', async () => {
  const tables = { rb_leads: [], rb_lead_profiles: null, rb_lead_calls: [{ cost_usd: '0.20' }, { cost_usd: '0.35' }, { cost_usd: null }] }
  const azul = await getLeadDashboard({ clientId: 'c1', isMaster: true, database: fakeDb({ tables }), env, now: NOW })
  assert.deepEqual(azul.costs, { month_usd: 0.55, calls: 3, priced: 2 })
  const team = await getLeadDashboard({ clientId: 'c1', isMaster: false, database: fakeDb({ tables }), env, now: NOW })
  assert.equal(team.costs, undefined)
})

test('review fixes: emails still go out with calls off; callback cost saved; costs skip tests and owner rings', async () => {
  const live = { ...agent, mode: 'active', rb_clients: { name: 'Test AC Co.', active: true, services: ['calls'] } }
  const mail = fakeMail()
  const r = await processLeadRetries({ database: fakeDb({ agentRow: live, answers: { rb_claim_job: true }, tables: { rb_leads: [], rb_lead_calls: [] } }), env: { AZUL_OPS_EMAIL: 'me@azul.test', LEAD_CALLS_ENABLED: 'false' }, now: MONDAY_9AM, send: mail.send })
  assert.equal(r.disabled, true); assert.deepEqual(r.emails, ['daily', 'weekly:1'])
  assert.match(mail.sent[0].subject, /^Azul daily: CALLS OFF/); assert.match(mail.sent[0].text, /Automatic calls are OFF/)

  const inboundDb = fakeDb({ answers: { rb_record_inbound_call: { recorded: true, lead: null } } })
  await handleCallEnded({ secret: 's3cret', body: { message: { type: 'end-of-call-report', cost: 0.07, durationSeconds: 3, call: { id: 'in-c', type: 'inboundPhoneCall', phoneNumberId: 'pn', customer: { number: '+13055550100' } } } }, database: inboundDb, env, now: NOW, send: fakeMail().send })
  assert.equal(inboundDb.rpcs('rb_record_inbound_call')[0].args.p_result.cost, '0.07')

  const calls = [{ cost_usd: '0.20', kind: 'ai', lead: { is_test: false } }, { cost_usd: '0.50', kind: 'ai', lead: { is_test: true } }, { cost_usd: null, kind: 'owner', lead: { is_test: false } }, { cost_usd: '0.05', kind: 'inbound', lead: null }]
  const azul = await getLeadDashboard({ clientId: 'c1', isMaster: true, database: fakeDb({ tables: { rb_leads: [], rb_lead_profiles: null, rb_lead_calls: calls } }), env, now: NOW })
  assert.deepEqual(azul.costs, { month_usd: 0.25, calls: 2, priced: 2 })
})

test('review fixes: hosted form limits per visitor, per phone and per business', async () => {
  const client = { id: 'c1', name: 'Test AC Co.', active: true, services: ['calls'] }
  const hosted = { ...agent, hosted_form: true, privacy_url: 'https://testac.example/privacy' }
  const tables = { rb_clients: client, rb_lead_profiles: { data: { services: [] } } }
  assert.equal((await handleHostedForm({ slug: 'test-ac', body: form, ip: '1.2.3.4', database: fakeDb({ agentRow: hosted, tables, counts: { rb_leads: 3 } }), env, now: NOW })).status, 429, '3 from this visitor already')
  const ok = fakeDb({ agentRow: hosted, tables, counts: { rb_leads: 2 } })
  await handleHostedForm({ slug: 'test-ac', body: { ...form, ip_hash: 'forged' }, ip: '1.2.3.4', database: ok, env, now: NOW, send: fakeMail().send, fetchImpl: fakeVapi().fetchImpl })
  const data = ok.rpcs('rb_create_lead')[0].args.p_data
  assert.match(data.extra.ip_hash, /^[0-9a-f]{32}$/); assert.notEqual(data.extra.ip_hash, 'forged', 'the browser cannot set its own visitor id')
})
