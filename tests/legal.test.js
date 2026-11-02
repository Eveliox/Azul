import test from 'node:test'
import assert from 'node:assert/strict'
import { legalCopy, legalUpdated } from '../src/data/legal.js'

const text = (doc) => doc.sections.flatMap((s) => s.body.flatMap((item) => Array.isArray(item) ? item : [item.key || item])).join('\n')

// Carriers check these clauses during A2P 10DLC review; removing one can get text registration rejected.
for (const lang of ['en', 'es']) {
  test(`${lang}: privacy policy keeps the SMS clauses carriers check`, () => {
    const privacy = text(legalCopy[lang].privacy)
    assert.match(privacy, lang === 'en'
      ? /No mobile information will be shared with third parties or affiliates for marketing or promotional purposes/
      : /No compartiremos información móvil con terceros ni afiliados con fines de marketing o promocionales/)
    assert.match(privacy, lang === 'en' ? /opt-in data and consent .* will not be shared with any third parties/ : /consentimiento para mensajes de texto .* no se compartirán con ningún tercero/)
    assert.match(privacy, /STOP/)
    assert.match(privacy, /HELP/)
    assert.ok(legalCopy[lang].privacy.sections.some((s) => s.id === 'cookies'), 'footer links to /privacy#cookies')
  })

  test(`${lang}: terms describe the text program, frequency, rates, STOP and HELP`, () => {
    const terms = text(legalCopy[lang].terms)
    assert.match(terms, lang === 'en' ? /Message frequency varies/ : /La frecuencia de los mensajes varía/)
    assert.match(terms, lang === 'en' ? /Message and data rates may apply/ : /Pueden aplicarse tarifas de mensajes y datos/)
    assert.match(terms, /STOP/)
    assert.match(terms, /HELP/)
    assert.match(terms, /azulwebdev\.com\/privacy/)
  })
}

test('legal copy has matching sections in both languages', () => {
  for (const doc of ['privacy', 'terms']) {
    assert.deepEqual(legalCopy.en[doc].sections.map((s) => s.id), legalCopy.es[doc].sections.map((s) => s.id))
  }
  assert.ok(legalUpdated.en && legalUpdated.es)
})
