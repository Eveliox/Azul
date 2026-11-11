import test from 'node:test'
import assert from 'node:assert/strict'
import { dailyDigest, weeklyOwnerEmail, validateControls, hostedConsentText } from '../api/_lib/lead-reports.js'

const NOW = new Date('2026-11-16T14:00:00Z') // Monday 9 AM Eastern
const ago = (h) => new Date(NOW.getTime() - h * 3600_000).toISOString()
const agents = [
  { client_id: 'a', client_name: 'Test AC Co.', business_name: 'Test AC Co.', mode: 'active' },
  { client_id: 'b', client_name: 'Quiet Roofing', business_name: 'Quiet Roofing', mode: 'active' },
  { client_id: 'c', client_name: 'New Client', business_name: 'New Client', mode: 'testing' },
]
const L = (client_id, h, extra = {}) => ({ client_id, received_at: ago(h), consent: true, status: 'calling', first_call_at: ago(h - 0.001), booked: false, last_error: null, name: 'Maria', phone: '+13055550100', ...extra })

test('daily check-in: per-client numbers, costs and the alerts that matter', () => {
  const leads = [L('a', 2, { booked: true, status: 'booked' }), L('a', 5, { status: 'retry', last_error: 'Vapi 402: Insufficient credits', first_call_at: null }), L('a', 30, { status: 'needs_owner' }), L('b', 24 * 9)]
  const calls = [{ client_id: 'a', placed_at: ago(2), cost_usd: '0.21' }, { client_id: 'a', placed_at: ago(48), cost_usd: '0.30' }, { client_id: 'a', placed_at: ago(3), cost_usd: null }]
  const d = dailyDigest({ agents, leads, calls, now: NOW })
  const a = d.rows.find((r) => r.name === 'Test AC Co.')
  assert.deepEqual({ leads24: a.leads24, called24: a.called24, booked24: a.booked24, needsYou: a.needsYou }, { leads24: 2, called24: 1, booked24: 1, needsYou: 1 })
  assert.equal(a.cost24, 0.21); assert.equal(a.costMonth, 0.51)
  assert.match(a.alerts[0], /out of credits/)
  assert.deepEqual(d.rows.find((r) => r.name === 'Quiet Roofing').alerts, ['No leads in 7 days: check their website form'])
  assert.deepEqual(d.rows.find((r) => r.name === 'New Client').alerts, [], 'testing clients are not expected to have leads')
  assert.equal(d.subject, 'Azul daily: 2 leads, 1 booked · 2 to check')
  assert.match(d.html, /\$0\.51/); assert.match(d.text, /scheduler is down/)
})

test('weekly owner email: results, who still needs them, and the zero-lead case', () => {
  const agent = { business_name: 'Test AC <Co>', timezone: 'America/New_York' }
  const leads = [L('a', 20, { booked: true }), L('a', 40, { status: 'needs_owner', name: 'Ana <b>', service: 'AC repair' }), L('a', 24 * 8)]
  const e = weeklyOwnerEmail({ agent, leads, now: NOW })
  assert.equal(e.subject, 'Test AC <Co>: 2 leads this week, 1 booked')
  assert.match(e.text, /New leads: 2\nCalled by your agent: 2/)
  assert.match(e.text, /Still need you:\nAna <b> · \+13055550100 · Call them back · AC repair/)
  assert.doesNotMatch(e.html, /<b>Ana <b>/); assert.match(e.html, /Ana &lt;b&gt;/)
  const none = weeklyOwnerEmail({ agent, leads: [], now: NOW })
  assert.equal(none.subject, 'Test AC <Co>: no new leads this week'); assert.match(none.text, /reply to this email and we will check your form/)
})

test('owner controls: what the business may change', () => {
  const live = { mode: 'active', owner_email: 'o@x.com', twilio_number: '+13055550000', call_start_hour: 8, call_end_hour: 20 }
  assert.equal(validateControls({ mode: 'paused', owner_email: 'o@x.com' }, live).row.mode, 'paused')
  assert.match(validateControls({ mode: 'active' }, { ...live, mode: 'testing' }).error, /still in testing/)
  assert.equal(validateControls({ mode: 'testing' }, { ...live, mode: 'testing' }).row.mode, undefined, 'unchanged mode is fine')
  assert.match(validateControls({ mode: 'testing' }, live).error, /on or paused/)
  assert.match(validateControls({ owner_first: true, owner_email: 'o@x.com' }, live).error, /cell/)
  assert.equal(validateControls({ owner_first: true, owner_cell: '(305) 555-0199', owner_email: 'o@x.com' }, live).row.owner_cell, '+13055550199')
  assert.match(validateControls({ owner_first: true, owner_cell: '3055550199', owner_email: 'o@x.com' }, { ...live, twilio_number: null }).error, /business number/)
  assert.match(validateControls({ call_start_hour: 18, call_end_hour: 9, owner_email: 'o@x.com' }, live).error, /end after the start/)
  assert.match(validateControls({ call_start_hour: 0, call_end_hour: 24, owner_email: 'o@x.com' }, live).error, /8 AM and 8 PM/, 'no calls at 3 AM')
  assert.match(validateControls({ call_start_hour: 8, call_end_hour: 21, owner_email: 'o@x.com' }, live).error, /8 AM and 8 PM/)
  assert.equal(validateControls({ call_start_hour: 8, call_end_hour: 20, owner_email: 'o@x.com' }, live).row.call_end_hour, 20)
  assert.match(validateControls({ owner_email: 'nope' }, live).error, /email/)
  assert.equal(validateControls({ owner_email: 'o@x.com', weekly_email: false }, live).row.weekly_email, false)
})

test('hosted form consent text in both languages', () => {
  assert.match(hostedConsentText('Test AC Co.', 'en'), /^I agree that Test AC Co\. may call and text me/)
  assert.match(hostedConsentText('Test AC Co.', 'es'), /^Acepto que Test AC Co\. me llame/)
})
