import test from 'node:test'
import assert from 'node:assert/strict'
import { SERVICE_IDS, normalizeServices } from '../api/_lib/services.js'
import { activeServices, inviteMessage } from '../src/components/servicePlan.js'

test('normalizeServices drops unknown ids, dedupes, and keeps canonical order', () => {
  assert.deepEqual(normalizeServices(['seo', 'reviews', 'seo', 'billing', 'ads', 42]), [])
  assert.deepEqual(normalizeServices(['social', 'website']), ['website'], 'coming-soon services cannot be subscribed')
  assert.deepEqual(normalizeServices('reviews'), [])
  assert.deepEqual(normalizeServices(undefined), [])
})
test('master sees every service; a client key sees only its plan', () => {
  assert.deepEqual(activeServices({ services: ['website'] }, true), SERVICE_IDS)
  assert.deepEqual(activeServices({ services: ['website', 'nope'] }, false), ['website'])
  assert.deepEqual(activeServices(undefined, false), [])
})
test('invite message includes the login URL, key, and plan names', () => {
  const text = inviteMessage({ name: 'Test Spa', owner_name: 'Ana', access_key: 'abc123', services: ['website', 'calls'] }, 'https://azul.app')
  assert.match(text, /Hi Ana/)
  assert.match(text, /https:\/\/azul\.app\/admin/)
  assert.match(text, /abc123/)
  assert.match(text, /Website Building, Speed-to-Lead Agent/)
})

test('only the two current services are offered; legacy plans do not grant new services', () => {
  assert.deepEqual(SERVICE_IDS, ['website', 'calls'])
  assert.deepEqual(normalizeServices(['agents', 'reviews', 'seo', 'social', 'ads']), [])
  assert.deepEqual(activeServices({ services: ['reviews'] }, false), [])
  assert.deepEqual(activeServices({ services: ['calls'] }, false), ['calls'])
  assert.match(inviteMessage({ services: ['calls'] }, 'https://azul.app'), /Speed-to-Lead Agent/)
})
