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

// Fake Supabase client: records every rpc and answers from `answers`.
function fakeDb({ agentRow = agent, call = null, answers = {} } = {}) {
  const log = []
  const defaults = {
    rb_create_lead: { created: true, lead: newLead },
    rb_claim_lead: [{ ...newLead, status: 'dialing', lease_token: 'lease-1' }],
    rb_finish_lead_attempt: [{ ...newLead, status: 'calling' }],
    rb_record_call_result: [],
    rb_sweep_stuck_leads: [],
    rb_claim_lead_retries: [],
  }
  return {
    log,
    rpcs: (name) => log.filter((c) => c.name === name),
    async rpc(name, args) { log.push({ name, args }); return { data: name in answers ? answers[name] : defaults[name] } },
    from(table) {
      const q = {
        select: () => q,
        eq: () => q,
        in: async () => ({ data: table === 'rb_lead_agents' && agentRow ? [agentRow] : [] }),
        maybeSingle: async () => ({ data: table === 'rb_lead_agents' ? agentRow : call }),
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
  assert.deepEqual(await processLeadRetries({ database: off, env: {} }), { disabled: true, swept: 0, processed: 0 })
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
