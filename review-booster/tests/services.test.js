import test from 'node:test'
import assert from 'node:assert/strict'
import { SERVICE_IDS, normalizeServices } from '../api/_lib/services.js'
import { activeServices, inviteMessage } from '../src/components/servicePlan.js'

test('normalizeServices drops unknown ids, dedupes, and keeps canonical order', () => {
  assert.deepEqual(normalizeServices(['seo', 'reviews', 'seo', 'billing', 42]), ['reviews', 'seo'])
  assert.deepEqual(normalizeServices('reviews'), [])
  assert.deepEqual(normalizeServices(undefined), [])
})
test('master sees every service; a client key sees only its plan', () => {
  assert.deepEqual(activeServices({ services: ['website'] }, true), SERVICE_IDS)
  assert.deepEqual(activeServices({ services: ['website', 'nope'] }, false), ['website'])
  assert.deepEqual(activeServices(undefined, false), [])
})
test('invite message includes the login URL, key, and plan names', () => {
  const text = inviteMessage({ name: 'Test Spa', owner_name: 'Ana', access_key: 'abc123', services: ['reviews', 'seo'] }, 'https://azul.app')
  assert.match(text, /Hi Ana/)
  assert.match(text, /https:\/\/azul\.app\/admin/)
  assert.match(text, /abc123/)
  assert.match(text, /Review Booster, Local Proof SEO/)
})
