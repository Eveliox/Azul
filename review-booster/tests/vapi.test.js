import test from 'node:test'
import assert from 'node:assert/strict'
import { parseReport, isNoise, recipientsFor, buildLeadEmail } from '../api/_lib/vapi.js'

const report = (over = {}) => ({ message: { type: 'end-of-call-report', call: { id: 'c1', assistantId: 'a1', customer: { number: '+13055550100' } }, durationSeconds: 95, startedAt: '2026-01-15T15:00:00Z', transcript: 'AI: Hello. User: Hi, I am Maria.', analysis: { summary: 'Maria asked about IV therapy.', structuredData: { caller_name: 'Maria Lopez', caller_phone: '3055550100', service_interest: 'IV therapy', callback_time: 'afternoon', language_used: 'spanish', urgent: false, lead_captured: true } }, ...over } })

test('ignores non end-of-call messages and flags hang-ups as noise', () => {
  assert.equal(parseReport({ message: { type: 'status-update' } }), null)
  assert.equal(parseReport({}), null)
  const r = parseReport({ message: { type: 'end-of-call-report', durationSeconds: 3 } })
  assert.equal(isNoise(r), true)
  assert.equal(isNoise(parseReport(report())), false)
})
test('parses flat and named structured outputs, treats "null" strings as missing', () => {
  const flat = parseReport(report())
  assert.equal(flat.name, 'Maria Lopez'); assert.equal(flat.language, 'spanish'); assert.equal(flat.leadCaptured, true)
  const named = parseReport(report({ analysis: { structuredData: { lead: { caller_name: 'Ana', caller_phone: 'null', urgent: true } } } }))
  assert.equal(named.name, 'Ana'); assert.equal(named.phone, null); assert.equal(named.urgent, true)
})
test('routes by assistant id with fallback', () => {
  const r = parseReport(report())
  assert.deepEqual(recipientsFor(r, { VAPI_LEAD_TO: 'owner@spa.com' }), ['owner@spa.com'])
  assert.deepEqual(recipientsFor(r, { VAPI_LEAD_TO: 'x@x.com', VAPI_LEAD_ROUTES: '{"a1":"owner@spa.com, me@azul.com"}' }), ['owner@spa.com', 'me@azul.com'])
  assert.deepEqual(recipientsFor(r, { VAPI_LEAD_ROUTES: 'not json' }), [])
})
test('email has subject, callback number, summary; escapes html; marks urgent and incomplete', () => {
  const e = buildLeadEmail(parseReport(report()), { business: 'Hello You' })
  assert.equal(e.subject, 'New call: Maria Lopez · IV therapy')
  assert.match(e.text, /Callback number: 3055550100/)
  assert.match(e.html, /tel:3055550100/)
  assert.match(e.html, /Show transcript/)
  const urgent = buildLeadEmail(parseReport(report({ analysis: { structuredData: { caller_name: '<b>x</b>', urgent: true } } })), { includeTranscript: false })
  assert.match(urgent.subject, /^URGENT — New call: <b>x<\/b> \(incomplete\)$/)
  assert.match(urgent.html, /&lt;b&gt;x&lt;\/b&gt;/)
  assert.doesNotMatch(urgent.html, /Show transcript/)
  assert.match(urgent.text, /did not leave both a name and a number/)
  // Falls back to caller ID when no name captured
  const noName = buildLeadEmail(parseReport(report({ analysis: {} })))
  assert.equal(noName.subject, 'New call: +13055550100 (incomplete)')
})
