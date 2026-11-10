import test from 'node:test'
import assert from 'node:assert/strict'
import {
  toE164, leadFromForm, parseInstant, nextCallTime, nextRetryTime, todayText, formatWhen, dialPlan, vapiCallBody,
  parseCallReport, outcomeFromReport, ownerCallEmail, ownerAlertEmail, leadConfirmationEmail, senderFor, ownerRecipients,
} from '../api/_lib/leads.js'

const iso = (d) => d.toISOString()
const agent = { business_name: 'Test AC Co.', vapi_assistant_id: 'asst', vapi_phone_number_id: 'pn', owner_email: 'owner@example.com, me@azul.com', mode: 'active', test_numbers: [] }
const env = { LEAD_CALLS_ENABLED: 'true' }

test('phone numbers become +1 E.164; invalid US numbers are rejected', () => {
  assert.equal(toE164('(305) 555-0100'), '+13055550100')
  assert.equal(toE164('1-305-555-0100'), '+13055550100')
  assert.equal(toE164('+1 305 555 0100'), '+13055550100')
  for (const bad of ['555-0100', '0305550100', '3051550100', '44 20 7946 0958', '', null]) assert.equal(toE164(bad), null, String(bad))
})

test('form fields follow the site contract; honeypot, consent and extras', () => {
  assert.deepEqual(leadFromForm({ name: 'Bot', phone: '3055550100', website: 'http://spam' }), { spam: true })
  assert.match(leadFromForm({ phone: '3055550100' }).error, /Name/)
  assert.match(leadFromForm({ name: 'Maria', phone: '12' }).error, /phone/)
  const { lead } = leadFromForm({ name: '  Maria   Lopez ', phone: '305-555-0100', email: 'not-an-email', consent: 'yes', language: 'es', service: 'AC repair', size: '3 ton', 'Bad Key': 'x', submitted_at: 'now' })
  assert.equal(lead.name, 'Maria Lopez'); assert.equal(lead.phone, '+13055550100'); assert.equal(lead.email, null)
  assert.equal(lead.consent, true); assert.equal(lead.language, 'es'); assert.deepEqual(lead.extra, { size: '3 ton' })
  for (const v of ['no', '', undefined, false]) assert.equal(leadFromForm({ name: 'A', phone: '3055550100', consent: v }).lead.consent, false)
  assert.equal(leadFromForm({ name: 'A', phone: '3055550100', language: 'fr' }).lead.language, 'en')
})

test('calling hours: 8 AM to 7:59 PM Eastern, no Sundays, daylight saving handled', () => {
  const open = new Date('2026-11-10T19:00:00Z') // Tue 2:00 PM EST
  assert.equal(nextCallTime(open, {}), open)
  assert.equal(iso(nextCallTime(new Date('2026-11-11T00:59:00Z'), {})), '2026-11-11T00:59:00.000Z', '7:59 PM is open')
  assert.equal(iso(nextCallTime(new Date('2026-11-11T01:00:00Z'), {})), '2026-11-11T13:00:00.000Z', '8 PM waits for 8 AM')
  assert.equal(iso(nextCallTime(new Date('2026-11-10T11:00:00Z'), {})), '2026-11-10T13:00:00.000Z', '6 AM waits for 8 AM same day')
  assert.equal(iso(nextCallTime(new Date('2026-11-15T01:30:00Z'), {})), '2026-11-16T13:00:00.000Z', 'Saturday night skips Sunday')
  assert.equal(iso(nextCallTime(new Date('2027-03-14T03:00:00Z'), {})), '2027-03-15T12:00:00.000Z', 'Monday 8 AM EDT after the clocks change')
  assert.equal(iso(nextCallTime(new Date('2027-03-14T03:00:00Z'), { call_sundays: true })), '2027-03-14T12:00:00.000Z')
  assert.equal(iso(nextCallTime(new Date('2026-11-10T15:00:00Z'), { timezone: 'America/Chicago', call_start_hour: 9 })), '2026-11-10T15:00:00.000Z')
})

test('retry time is 2 hours after the last attempt, inside calling hours', () => {
  const now = new Date('2026-11-10T15:00:00Z') // 10 AM
  assert.equal(nextRetryTime({ last_attempt_at: '2026-11-10T15:00:00Z' }, {}, now), '2026-11-10T17:00:00.000Z')
  assert.equal(nextRetryTime({ last_attempt_at: '2026-11-11T00:00:00Z' }, {}, new Date('2026-11-11T00:00:00Z')), '2026-11-11T13:00:00.000Z', '7 PM + 2h → next morning')
})

test('date text matches what the assistant prompt expects', () => {
  assert.equal(todayText(new Date('2026-10-21T18:00:00Z')), 'Wednesday, October 21, 2026 2:00 PM')
  assert.equal(formatWhen('2026-11-12T09:00:00-05:00'), 'Thursday, November 12 at 9:00 AM')
  assert.equal(formatWhen('2026-11-12T09:00:00-05:00', undefined, 'es'), 'jueves 12 de noviembre a las 9:00 a.m.')
  assert.equal(formatWhen('2026-11-12T13:30:00-05:00', undefined, 'es'), 'jueves 12 de noviembre a la 1:30 p.m.')
  assert.equal(formatWhen('tomorrow morning'), 'tomorrow morning')
})

test('a booking time without an offset is read as Eastern, not UTC', () => {
  assert.equal(iso(parseInstant('2026-11-12T09:00:00')), '2026-11-12T14:00:00.000Z')
  assert.equal(iso(parseInstant('2026-07-01T09:00')), '2026-07-01T13:00:00.000Z', 'daylight time')
  assert.equal(iso(parseInstant('2026-11-12T09:00:00-05:00')), '2026-11-12T14:00:00.000Z')
  assert.equal(iso(parseInstant('2026-11-12T14:00:00Z')), '2026-11-12T14:00:00.000Z')
  assert.equal(parseInstant('Thursday at 9'), null)
  assert.equal(formatWhen('2026-11-12T09:00:00'), 'Thursday, November 12 at 9:00 AM')
  assert.match(leadConfirmationEmail({ lead: { name: 'Maria' }, agent, appointmentTime: '2026-11-12T09:00:00' }).subject, /November 12 at 9:00 AM/)
})

test('dial plan: kill switch, pause, testing list, after hours', () => {
  const lead = { phone: '+13055550100' }
  const now = new Date('2026-11-10T19:00:00Z')
  assert.equal(dialPlan(lead, agent, {}, now).action, 'skip')
  assert.equal(dialPlan(lead, { ...agent, mode: 'paused' }, env, now).action, 'skip')
  assert.match(dialPlan(lead, { ...agent, mode: 'testing' }, env, now).notes, /test list/)
  assert.equal(dialPlan(lead, { ...agent, mode: 'testing', test_numbers: ['+13055550100'] }, env, now).action, 'call')
  assert.deepEqual(dialPlan(lead, agent, env, new Date('2026-11-11T02:00:00Z')), { action: 'defer', next_attempt_at: '2026-11-11T13:00:00.000Z', notes: 'Outside calling hours' })
})

test('Vapi call body carries the same variables Make sent', () => {
  const body = vapiCallBody({ name: 'Maria Lopez', phone: '+13055550100', service: 'AC repair', address: '1100 W 49th St', language: 'es' }, agent, new Date('2026-10-21T18:00:00Z'))
  assert.equal(body.assistantId, 'asst'); assert.equal(body.phoneNumberId, 'pn'); assert.equal(body.customer.number, '+13055550100')
  assert.deepEqual(body.assistantOverrides.variableValues, { name: 'Maria', business: 'Test AC Co.', service: 'AC repair', address: '1100 W 49th St', zip: '', details: '', language: 'es', today: 'Wednesday, October 21, 2026 2:00 PM' })
  assert.equal(vapiCallBody({ name: 'X', phone: '+13055550100', zip: '33012' }, agent, new Date()).assistantOverrides.variableValues.address, '33012')
})

// Shaped like Test AC's real reports: Structured Output under artifact.structuredOutputs.<id>.result.
const message = (endedReason, result = {}, extra = {}) => ({
  type: 'end-of-call-report', endedReason, durationSeconds: 95.4, transcript: 'AI: Hi Maria. User: Hi.',
  call: { id: 'call-1' }, analysis: { summary: 'Maria wants AC repair.' }, recordingUrl: 'https://rec.example/1.wav',
  artifact: { structuredOutputs: { '72953866-f21f-47e4-8ae3-dee0fb60fb8f': { name: 'lead_call_results', result } } }, ...extra,
})

test('report parsing reads structured outputs and the older structuredData shape', () => {
  const r = parseCallReport(message('assistant-ended-call', { appointment_booked: true, appointment_time: '2026-11-12T09:00:00-05:00' }))
  assert.equal(r.callId, 'call-1'); assert.equal(r.durationSeconds, 95); assert.equal(r.fields.appointment_booked, true)
  const old = parseCallReport({ call: { id: 'c' }, analysis: { structuredData: { lead: { do_not_call: true } } } })
  assert.equal(old.fields.do_not_call, true)
  assert.deepEqual(parseCallReport({}).fields, {})
})

test('call outcome: booked, do not call, transfer, no answer, retry limit, fallback', () => {
  const now = new Date('2026-11-10T15:00:00Z')
  const lead = { attempts: 1, last_attempt_at: '2026-11-10T15:00:00Z' }
  const out = (reason, result, l = lead) => outcomeFromReport(parseCallReport(message(reason, result)), l, agent, now)
  const booked = out('assistant-ended-call', { appointment_booked: 'true', appointment_time: '2026-11-12T09:00:00-05:00', do_not_call: true })
  assert.equal(booked.status, 'booked'); assert.equal(booked.do_not_call, true, 'a booking still respects do-not-call')
  assert.equal(out('customer-ended-call', { do_not_call: true }).status, 'stopped')
  assert.equal(out('assistant-forwarded-call', {}).status, 'handed_off')
  const retry = out('customer-did-not-answer', {})
  assert.equal(retry.status, 'retry'); assert.equal(retry.next_attempt_at, '2026-11-10T17:00:00.000Z')
  assert.equal(out('voicemail', {}).status, 'retry')
  assert.equal(out('customer-busy', {}, { attempts: 3, last_attempt_at: lead.last_attempt_at }).status, 'no_answer')
  const unclear = out('customer-ended-call', { appointment_booked: false })
  assert.equal(unclear.status, 'needs_owner'); assert.equal(unclear.appointment_time, null); assert.equal(unclear.summary, 'Maria wants AC repair.')
})

test('owner emails: clear subject, escaped html, tel link, recording', () => {
  const lead = { name: 'Maria <b>Lopez</b>', phone: '+13055550100', service: 'AC repair', attempts: 1 }
  const report = parseCallReport(message('voicemail', {}))
  const e = ownerCallEmail({ lead, agent, report, outcome: { status: 'retry', next_attempt_at: '2026-11-10T17:00:00.000Z', ended_reason: 'voicemail', summary: 'Left voicemail.' } })
  assert.equal(e.subject, 'No answer (call 1 of 3): Maria <b>Lopez</b>')
  assert.match(e.text, /try again Tuesday, November 10 at 12:00 PM/)
  assert.match(e.html, /Maria &lt;b&gt;Lopez/); assert.doesNotMatch(e.html, /<b>Lopez/)
  assert.match(e.html, /href="tel:\+13055550100"/); assert.match(e.html, /rec\.example/)
  const b = ownerCallEmail({ lead: { ...lead, email: 'm@example.com' }, agent, report, outcome: { status: 'booked', appointment_time: '2026-11-12T09:00:00-05:00' } })
  assert.equal(b.subject, 'Booked: Maria <b>Lopez</b> · Thursday, November 12 at 9:00 AM')
  const alert = ownerAlertEmail({ lead: { name: 'Ana\nBcc: x', phone: '+13055550100' }, title: 'Call this lead yourself', reason: 'Vapi 402' })
  assert.equal(alert.subject, 'Call this lead yourself: Ana Bcc: x', 'no line breaks in subjects')
})

test('customer confirmation in their language, only with a readable time', () => {
  const lead = { name: 'Maria Lopez', address: '1100 W 49th St', language: 'es' }
  const es = leadConfirmationEmail({ lead, agent, appointmentTime: '2026-11-12T09:00:00-05:00' })
  assert.equal(es.subject, 'Test AC Co.: su visita está reservada para el jueves 12 de noviembre a las 9:00 a.m.')
  assert.match(es.text, /^Hola Maria, .* en 1100 W 49th St\./)
  assert.match(leadConfirmationEmail({ lead: { ...lead, language: 'en' }, agent, appointmentTime: '2026-11-12T09:00:00-05:00' }).subject, /you're booked for Thursday/)
  assert.equal(leadConfirmationEmail({ lead, agent, appointmentTime: 'tomorrow' }), null)
})

test('sender uses the verified address with the business name', () => {
  assert.equal(senderFor('Test AC Co.', { EMAIL_FROM: 'Azul Reviews <reviews@azulwebdev.com>' }), '"Test AC Co." <reviews@azulwebdev.com>')
  assert.equal(senderFor('A "B" <c>', { LEAD_EMAIL_FROM: 'leads@azulwebdev.com', EMAIL_FROM: 'x <y@z.com>' }), '"A B c" <leads@azulwebdev.com>')
  assert.equal(senderFor('X', {}), undefined)
  assert.deepEqual(ownerRecipients(agent), ['owner@example.com', 'me@azul.com'])
  assert.deepEqual(ownerRecipients({ owner_email: 'OWNER_EMAIL_HERE, ok@example.com' }), ['ok@example.com'], 'placeholders are dropped')
})
