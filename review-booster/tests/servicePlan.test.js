import test from 'node:test'
import assert from 'node:assert/strict'
import { MONTHLY_SEO, SERVICES, SETUP, monthId, planKey, readPlan, reviewEvents } from '../src/components/servicePlan.js'

test('each service has a distinct destination; SEO has exactly eight post tasks', () => {
  assert.equal(new Set(SERVICES.map((s) => s.id)).size, 4)
  assert.equal(MONTHLY_SEO.filter((t) => t.id.startsWith('seo-post-')).length, 8)
  const tasks = [...Object.values(SETUP).flat(), ...MONTHLY_SEO]
  assert.equal(new Set(tasks.map((t) => t.id)).size, tasks.length)
})
test('plans isolate business, demo/live, month, and setup', () => {
  assert.equal(monthId(new Date(2026, 0, 15)), '2026-01')
  const keys = [planKey('one', true, '2026-01'), planKey('two', true, '2026-01'), planKey('one', false, '2026-01'), planKey('one', true, '2026-02'), planKey('one', true, 'setup')]
  assert.equal(new Set(keys).size, 5)
})
test('stored plans only accept known task IDs and valid completion timestamps', () => {
  const date = '2026-01-15T10:00:00Z'
  const storage = { getItem: () => JSON.stringify({ 'seo-assets': date, 'seo-drafts': true, unknown: date, 'seo-report': 'invalid-date' }) }
  assert.deepEqual(readPlan(storage, 'key', MONTHLY_SEO.map((t) => t.id)), { 'seo-assets': date })
  assert.deepEqual(readPlan({ getItem: () => 'null' }, 'key', []), {})
  assert.deepEqual(readPlan({ getItem: () => null }, 'key', []), {})
  assert.throws(() => readPlan({ getItem: () => '{broken' }, 'key', []))
})
test('review activity distinguishes private feedback, queued requests, and delivery errors', () => {
  const date = '2026-01-15T10:00:00Z'
  const events = reviewEvents([
    { id: '1', customer_name: 'Sample', rating: 5, rated_at: date },
    { id: '2', customer_name: 'Sample', status: 'pending', created_at: date },
    { id: '3', customer_name: 'Sample', status: 'failed', created_at: date },
    { id: '4', customer_name: 'Sample', status: 'sent', sent_at: date },
    { id: '5', customer_name: 'Invalid', status: 'sent', sent_at: 'not-a-date' },
  ])
  assert.equal(events.length, 4)
  assert.match(events[0].title, /Feedback received/)
  assert.ok(!events[0].title.includes('Google'))
  assert.equal(events[1].state, 'attention')
  assert.equal(events[2].state, 'attention')
  assert.equal(events[3].state, 'completed')
})
