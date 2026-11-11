// Speed-to-lead migration test. Isolated in-memory PostgreSQL (PGlite); never connects to production.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite')
const db = new PGlite()
await db.exec(`create role anon; create role authenticated; create role service_role;
create table rb_clients(id uuid primary key, name text, active boolean default true, services text[] default '{calls}');`)
const migration = await readFile(new URL('../supabase/migrations/20261110_speed_to_lead.sql', import.meta.url), 'utf8')
const part2 = await readFile(new URL('../supabase/migrations/20261111_speed_to_lead_owner_inbound.sql', import.meta.url), 'utf8')
await db.exec(migration)
await db.exec(migration) // must be safe to apply twice
await db.exec(part2)
await db.exec(part2)
const part3 = await readFile(new URL('../supabase/migrations/20261112_speed_to_lead_profiles.sql', import.meta.url), 'utf8')
await db.exec(part3)
await db.exec(part3)

const c1 = '11111111-1111-4111-8111-111111111111', c2 = '22222222-2222-4222-8222-222222222222'
await db.query('insert into rb_clients(id,name) values($1,$2),($3,$4)', [c1, 'One', c2, 'Two'])
await db.query(`insert into rb_lead_agents(client_id,business_name,vapi_assistant_id,vapi_phone_number_id,owner_email)
  values($1,'One AC','asst','pn','owner@example.com'),($2,'Two AC','asst2','pn2','owner2@example.com')`, [c1, c2])
const key = (await db.query('select form_key from rb_lead_agents where client_id=$1', [c1])).rows[0].form_key
assert.match(key, /^[0-9a-f]{64}$/, 'form key is 64 hex characters')
await assert.rejects(() => db.query(`insert into rb_lead_agents(client_id,business_name,vapi_assistant_id,vapi_phone_number_id,owner_email,owner_first)
  values($1,'x','a','p','o@example.com',true) on conflict(client_id) do update set owner_first=true`, [c1]), 'owner first needs owner cell and Twilio number')

const one = async (sql, args) => (await db.query(sql, args)).rows[0]
const lead = (phone, over = {}) => JSON.stringify({ name: 'Maria', phone, consent: true, service: 'AC repair', language: 'en', ...over })
const create = async (client, data) => (await one('select rb_create_lead($1,$2::jsonb) as r', [client, data])).r
const claim = async (id) => (await db.query('select * from rb_claim_lead($1)', [id])).rows[0]
const finish = async (l, result) => (await db.query('select * from rb_finish_lead_attempt($1,$2,$3::jsonb)', [l.id, l.lease_token, JSON.stringify(result)])).rows[0]
const record = async (callId, result) => (await db.query('select * from rb_record_call_result($1,$2::jsonb)', [callId, JSON.stringify(result)])).rows[0]
const claimRetries = async () => (await db.query('select * from rb_claim_lead_retries(5)')).rows
const get = (id) => one('select * from rb_leads where id=$1', [id])

// New lead, duplicate guard, consent and do-not-contact.
const a = await create(c1, lead('+13055550100'))
assert.equal(a.created, true); assert.equal(a.lead.status, 'new')
const dup = await create(c1, lead('+13055550100'))
assert.equal(dup.created, false); assert.equal(dup.lead.id, a.lead.id, 'same phone within 10 minutes returns the first lead')
assert.equal((await create(c2, lead('+13055550100'))).created, true, 'duplicate guard is per business')
assert.equal((await create(c1, lead('+13055550101', { consent: false }))).lead.status, 'not_called')
await db.query("insert into rb_do_not_contact(client_id,phone) values($1,'+13055550102')", [c1])
assert.equal((await create(c1, lead('+13055550102'))).lead.status, 'blocked')
await assert.rejects(() => create(c1, lead('3055550103')), 'phone must be E.164')
await assert.rejects(() => create('33333333-3333-4333-8333-333333333333', lead('+13055550104')), 'business without an agent row')

// Claim is exclusive; a stale lease can't finish.
const leases = await Promise.all([claim(a.lead.id), claim(a.lead.id)])
assert.equal(leases.filter(Boolean).length, 1, 'only one worker can claim a new lead')
const leased = leases.find(Boolean); assert.equal(leased.status, 'dialing')
assert.equal(await finish({ ...leased, lease_token: '66666666-6666-4666-8666-666666666666' }, { call_id: 'x' }), undefined, 'stale lease blocked')
const calling = await finish(leased, { call_id: 'call-1', kind: 'ai' })
assert.equal(calling.status, 'calling'); assert.equal(calling.attempts, 1); assert.equal(calling.current_call_id, 'call-1')
assert.equal(await claim(a.lead.id), undefined, 'a lead already called is not claimed again')

// End-of-call report: no answer → retry, applied once only.
const retryAt = new Date(Date.now() - 60_000).toISOString()
const noAnswer = await record('call-1', { status: 'retry', next_attempt_at: retryAt, ended_reason: 'customer-did-not-answer' })
assert.equal(noAnswer.status, 'retry')
assert.equal(await record('call-1', { status: 'booked', booked: true }), undefined, 'duplicate report ignored')
assert.equal(await record('unknown-call', { status: 'booked' }), undefined, 'unknown call ignored')
await assert.rejects(() => record('call-1', { status: 'calling' }), 'only final statuses accepted')

// Retry worker: parallel claims never share a lead; paused businesses are skipped.
const claims = await Promise.all([claimRetries(), claimRetries()])
assert.equal(claims.flat().length, 1, 'parallel retry claims never return the same lead')
const second = claims.flat()[0]
const calling2 = await finish(second, { call_id: 'call-2' })
assert.equal(calling2.attempts, 2)
const booked = await record('call-2', { status: 'booked', booked: true, appointment_time: '2026-11-12T09:00:00-05:00', summary: 'Booked AC repair', ended_reason: 'assistant-ended-call' })
assert.equal(booked.status, 'booked'); assert.equal(booked.booked, true); assert.equal(booked.next_attempt_at, null)

const p = (await create(c2, lead('+13055550110'))).lead
await finish(await claim(p.id), { status: 'retry', next_attempt_at: retryAt, notes: 'After hours' })
await db.query("update rb_lead_agents set mode='paused' where client_id=$1", [c2])
assert.equal((await claimRetries()).length, 0, 'paused business is not called')
await db.query("update rb_lead_agents set mode='testing' where client_id=$1", [c2])

// Asked not to be called: added to the list, and a queued retry for that phone stops.
const d = (await create(c1, lead('+13055550120'))).lead
await finish(await claim(d.id), { call_id: 'call-3' })
const stopped = await record('call-3', { status: 'stopped', do_not_call: true })
assert.equal(stopped.status, 'stopped')
assert.ok(await one("select 1 as ok from rb_do_not_contact where client_id=$1 and phone='+13055550120'", [c1]))
const q = (await create(c2, lead('+13055550130'))).lead
await finish(await claim(q.id), { status: 'retry', next_attempt_at: retryAt })
await db.query("insert into rb_do_not_contact(client_id,phone) values($1,'+13055550130')", [c2])
const afterDnc = await claimRetries()
assert.ok(!afterDnc.some((l) => l.id === q.id), 'do-not-contact phone is not retried')
assert.equal((await get(q.id)).status, 'stopped')
for (const l of afterDnc) await finish(l, { status: 'not_called', notes: 'test cleanup' })

// Failed dials count toward the limit and end as failed.
const f = (await create(c1, lead('+13055550140'))).lead
let fl = await finish(await claim(f.id), { error: 'Vapi 402: no credits', next_attempt_at: retryAt })
assert.equal(fl.status, 'retry'); assert.equal(fl.attempts, 1); assert.match(fl.last_error, /no credits/)
fl = await finish((await claimRetries())[0], { error: 'Vapi 402', next_attempt_at: retryAt })
fl = await finish((await claimRetries())[0], { error: 'Vapi 402', next_attempt_at: retryAt })
assert.equal(fl.status, 'failed'); assert.equal(fl.attempts, 3); assert.equal(fl.next_attempt_at, null)
assert.equal((await claimRetries()).length, 0)

// Sweep: never-dialed leads are re-queued; uncertain or stuck calls go to the owner.
const n = (await create(c1, lead('+13055550150'))).lead
await db.query("update rb_leads set received_at=now()-interval '6 minutes' where id=$1", [n.id])
const s = (await create(c1, lead('+13055550160'))).lead
await claim(s.id)
await db.query("update rb_leads set lease_until=now()-interval '1 minute' where id=$1", [s.id])
const t = (await create(c1, lead('+13055550170'))).lead
await finish(await claim(t.id), { call_id: 'call-4' })
await db.query("update rb_leads set last_attempt_at=now()-interval '31 minutes' where id=$1", [t.id])
const swept = (await db.query('select * from rb_sweep_stuck_leads()')).rows
assert.deepEqual(swept.map((l) => l.id).sort(), [s.id, t.id].sort())
assert.ok(swept.every((l) => l.status === 'needs_owner'))
assert.match(swept.find((l) => l.id === s.id).notes, /Check Vapi/)
assert.equal((await get(n.id)).status, 'retry', 'never-dialed lead goes back in the queue')

// A report arriving after the sweep handed the lead to the owner never queues another call...
assert.equal(await record('call-4', { status: 'retry', next_attempt_at: retryAt, ended_reason: 'voicemail' }), undefined)
assert.equal((await get(t.id)).status, 'needs_owner')
// ...but a late booking is still recorded.
const u = (await create(c1, lead('+13055550180'))).lead
await finish(await claim(u.id), { call_id: 'call-5' })
await db.query("update rb_leads set last_attempt_at=now()-interval '31 minutes' where id=$1", [u.id])
await db.query('select * from rb_sweep_stuck_leads()')
assert.equal((await record('call-5', { status: 'booked', booked: true, appointment_time: '2026-11-12T09:00:00-05:00' })).status, 'booked')

// Owner first: owner call recorded without counting as an AI attempt; transitions only from the expected state.
const transition = async (id, from, to, extra = {}) => (await db.query('select * from rb_lead_transition($1,$2,$3,$4,$5,$6)', [id, from, to, extra.notes ?? null, extra.next ?? null, extra.lease ?? false])).rows[0]
const o = (await create(c1, lead('+13055550190'))).lead
const ringing = await finish(await claim(o.id), { call_id: 'CA-owner-1', kind: 'owner' })
assert.equal(ringing.status, 'owner_ringing'); assert.equal(ringing.attempts, 0, 'owner call is not an AI attempt')
assert.ok(ringing.first_call_at)
const handover = await transition(o.id, ['owner_ringing'], 'dialing', { lease: true })
assert.equal(handover.status, 'dialing'); assert.ok(handover.lease_token)
assert.equal(await transition(o.id, ['owner_ringing'], 'dialing', { lease: true }), undefined, 'second status callback is a no-op')
assert.equal((await finish(handover, { call_id: 'call-6' })).attempts, 1)
await assert.rejects(() => transition(o.id, ['calling'], 'booked'), 'transition cannot set final call statuses')
assert.equal((await transition(o.id, ['retry'], 'not_called', { notes: 'Stopped by your team' })), undefined, 'stop only applies to queued leads')

// Inbound callback: recorded once; stops queued retries; booking wins; unknown numbers still logged.
const inbound = async (id, client, phone, result) => (await one('select rb_record_inbound_call($1,$2,$3,$4::jsonb) as r', [id, client, phone, JSON.stringify(result)])).r
const cb = (await create(c1, lead('+13055550200'))).lead
await finish(await claim(cb.id), { status: 'retry', next_attempt_at: retryAt })
const back = await inbound('in-1', c1, '+13055550200', { summary: 'Called back, wants a call tomorrow.', ended_reason: 'customer-ended-call' })
assert.equal(back.recorded, true); assert.equal(back.lead.status, 'needs_owner'); assert.equal(back.lead.next_attempt_at, null)
assert.equal((await inbound('in-1', c1, '+13055550200', {})).recorded, false, 'same call id recorded once')
const bk = await inbound('in-2', c1, '+13055550200', { booked: true, appointment_time: '2026-11-12T10:00:00-05:00' })
assert.equal(bk.lead.status, 'booked'); assert.equal(bk.lead.appointment_time, '2026-11-12T10:00:00-05:00')
const stranger = await inbound('in-3', c1, '+13055550299', { do_not_call: true })
assert.equal(stranger.recorded, true); assert.equal(stranger.lead, null)
assert.ok(await one("select 1 as ok from rb_do_not_contact where client_id=$1 and phone='+13055550299'", [c1]))
const live = (await create(c1, lead('+13055550210'))).lead
await finish(await claim(live.id), { call_id: 'call-7' })
assert.equal((await inbound('in-4', c1, '+13055550210', {})).lead.status, 'calling', 'a callback never overwrites a call in progress')

// Part 3: test calls skip the duplicate guard; profiles locked down; assistant mode checked.
const t1 = await create(c1, lead('+13055550300', { test: true, name: 'Test call' }))
const t2 = await create(c1, lead('+13055550300', { test: true, name: 'Test call' }))
assert.equal(t1.created && t2.created, true, 'test calls are never treated as duplicates')
assert.equal(t2.lead.notes, 'Test call from the dashboard'); assert.equal(t2.lead.is_test, true)
await finish(await claim(t2.lead.id), { status: 'retry', next_attempt_at: retryAt })
assert.ok(!(await claimRetries()).some((l) => l.id === t2.lead.id), 'test leads are never retried')
assert.equal((await create(c1, lead('+13055550300'))).created, false, 'normal leads still are')
await assert.rejects(() => db.query("update rb_lead_agents set assistant_mode='other' where client_id=$1", [c1]))
await db.query("update rb_lead_agents set assistant_mode='azul', vapi_assistant_id=null, calendar_tool_ids=array['t1','t2'] where client_id=$1", [c1])
await db.query(`insert into rb_lead_profiles(client_id,data) values($1,'{"trade":"air conditioning"}')`, [c1])

// No browser access to tables or functions.
await db.exec('set role anon')
await assert.rejects(() => db.query('select * from rb_leads'))
await assert.rejects(() => db.query('select * from rb_lead_profiles'))
await assert.rejects(() => db.query('select * from rb_claim_lead_retries(5)'))
await assert.rejects(() => db.query("select rb_record_inbound_call('x',$1,'+13055550100','{}'::jsonb)", [c1]))
await db.exec('reset role')
await db.close()
console.log('PASS: reapplicable lead migration, duplicate guard, consent and do-not-contact, exclusive claims, stale leases, one-time call reports, retry limits, pause, sweep, owner-first handover, inbound callbacks and public access restrictions.')
