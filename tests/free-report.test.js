import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeHtml, buildReport, closedHoursPerWeek, FINDINGS, normalizeWebsite, parseLeadInput, parseScanInput, PASSES, pickCompetitors, previewOf } from '../api/_lib/report.js'
import { isPrivateAddress } from '../api/_lib/fetchSite.js'
import { seal, unseal } from '../api/_lib/seal.js'
import scan from '../api/free-report/scan.js'
import unlock from '../api/free-report/unlock.js'
import { describeFinding, describePass, freeReportCopy } from '../src/data/freeReport.js'
import { serviceSlugs } from '../src/data/services.js'

const weekdays = (open, close) => [1, 2, 3, 4, 5].map(day => ({ open: { day, hour: open, minute: 0 }, close: { day, hour: close, minute: 0 } }))
const place = (extra = {}) => ({
  id: 'self', displayName: { text: 'Sunshine Roofing' }, formattedAddress: '1 Main St, Miami, FL', rating: 4.3, userRatingCount: 12,
  nationalPhoneNumber: '(305) 555-0100', regularOpeningHours: { periods: weekdays(8, 17) }, photos: Array(4).fill({}), websiteUri: 'https://sunshine.example', ...extra,
})
const competitors = [{ name: 'A', rating: 4.9, reviews: 200 }, { name: 'B', rating: 4.7, reviews: 150 }, { name: 'C', rating: 4.8, reviews: 100 }]
const input = { business: 'Sunshine Roofing', city: 'Miami, FL', trade: 'roofing', website: '' }

test('scan input: requires business and city, normalizes the website', () => {
  assert.equal(parseScanInput({ city: 'Miami' }).error, 'business')
  assert.equal(parseScanInput({ business: 'Acme' }).error, 'city')
  assert.equal(parseScanInput({ business: 'Acme', city: 'Miami', website: 'not a site' }).error, 'website')
  assert.deepEqual(parseScanInput({ business: '  Acme  Roofing ', city: 'Miami', trade: 'nope', website: 'acme.com/#top' }).input, { business: 'Acme Roofing', city: 'Miami', trade: 'other', website: 'https://acme.com/' })
  assert.equal(normalizeWebsite(''), '')
  assert.equal(normalizeWebsite('ftp://acme.com'), null)
  assert.equal(normalizeWebsite('http://acme.com:8080'), null)
  assert.equal(normalizeWebsite('https://user:pw@acme.com'), null)
})

test('lead input: requires name, valid email and consent', () => {
  const ok = { name: 'Ana', email: 'Ana@Example.com', consent: true }
  assert.deepEqual(parseLeadInput(ok).lead, { name: 'Ana', email: 'ana@example.com', phone: null, language: 'en' })
  assert.equal(parseLeadInput({ ...ok, email: 'ana@' }).error, 'email')
  assert.equal(parseLeadInput({ ...ok, consent: false }).error, 'consent')
  assert.equal(parseLeadInput({ ...ok, phone: 'call me' }).error, 'phone')
  assert.equal(parseLeadInput({ ...ok, phone: '(305) 555-0100', language: 'es' }).lead.language, 'es')
})

test('HTML analysis finds each signal and skips pages rendered in the browser', () => {
  const body = '<p>' + 'We fix roofs across South Florida. '.repeat(20) + '</p>'
  const full = `<html lang="en"><head><title>Acme</title><meta name="description" content="Roofers"><meta name=viewport content="width=device-width">
    <script type="application/ld+json">{"@type":"RoofingContractor"}</script></head><body>${body}<a href="tel:+13055550100">Call</a><a href="/es/">Español</a></body></html>`
  assert.deepEqual(analyzeHtml(full, 'https://acme.com/'), { https: true, title: 'Acme', description: 'Roofers', viewport: true, tapToCall: true, spanish: true, localSchema: true, renderedInBrowser: false })
  const bare = analyzeHtml(`<html><head></head><body>${body}</body></html>`, 'http://acme.com/')
  assert.equal(bare.https, false)
  assert.equal(bare.spanish || bare.tapToCall || bare.localSchema || bare.viewport, false)
  assert.equal(analyzeHtml('<div id="root"></div><script src="/app.js"></script>', 'https://a.com/').renderedInBrowser, true)
})

test('closed hours per week', () => {
  assert.equal(closedHoursPerWeek({ periods: weekdays(8, 17) }), 168 - 45)
  assert.equal(closedHoursPerWeek({ periods: [{ open: { day: 0, hour: 0, minute: 0 } }] }), 0)
  assert.equal(closedHoursPerWeek({ periods: [{ open: { day: 5, hour: 20 }, close: { day: 6, hour: 2 } }] }), 168 - 6)
  assert.equal(closedHoursPerWeek(undefined), null)
})

test('competitors exclude the business itself and results without review counts', () => {
  const found = [{ id: 'self', displayName: { text: 'Sunshine Roofing' }, userRatingCount: 12 }, { id: 'x', displayName: { text: 'No Count' } },
    ...['A', 'B', 'C', 'D'].map((n, i) => ({ id: n, displayName: { text: n }, rating: 4.5, userRatingCount: 10 * (i + 1) }))]
  assert.deepEqual(pickCompetitors(found, place()).map(c => c.name), ['A', 'B', 'C'])
})

test('report: gaps are measured, ranked by severity and scored', () => {
  const report = buildReport({ input, place: place(), competitors, website: 'https://sunshine.example/', site: analyzeHtml('<html><title>x</title></html>' + '<p>text </p>'.repeat(100), 'https://sunshine.example/'), speed: { performance: 41, seo: 83, lcpSeconds: 6.2, seoFailed: 2 } })
  const ids = report.findings.map(f => f.id)
  assert.deepEqual(ids.slice(0, 3), ['reviews_behind', 'speed_slow', 'not_mobile'])
  assert.deepEqual(report.findings[0].values, { yours: 12, avg: 150, gap: 138 })
  assert.ok(ids.includes('rating_low') && ids.includes('photos_few') && ids.includes('after_hours') && ids.includes('no_spanish'))
  assert.ok(!ids.includes('phone_missing') && !ids.includes('hours_missing'))
  assert.deepEqual(report.averages, { reviews: 150, rating: 4.8 })
  assert.ok(report.score >= 5 && report.score < 50)
  const severities = report.findings.map(f => ['high', 'medium', 'low'].indexOf(f.severity))
  assert.deepEqual(severities, [...severities].sort((a, b) => a - b))
  const preview = previewOf(report)
  assert.equal(preview.top.length, 3)
  assert.equal(preview.total, report.findings.length)
  assert.equal('competitors' in preview, false)
})

test('report: no Google listing and no website', () => {
  const report = buildReport({ input, place: null, competitors: [], website: '' })
  assert.deepEqual(report.findings.map(f => f.id), ['gbp_missing', 'site_missing'])
  assert.deepEqual(report.checked, { google: false, website: false })
  assert.equal(report.score, 72)
})

for (const lang of ['en', 'es']) {
  test(`${lang}: every finding and pass has copy, and every service exists`, () => {
    const values = { business: 'A', city: 'B', url: 'https://a.com', yours: 4.2, avg: 4.8, gap: 3, score: 40, seconds: 5.1, failed: 1, count: 3, hours: 100, title: true, description: false }
    for (const [id, meta] of Object.entries(FINDINGS)) {
      const { title, body } = describeFinding({ id, values }, lang)
      assert.ok(title.length > 5 && body.length > 20, id)
      assert.ok(!/undefined|NaN/.test(title + body), id)
      assert.ok(serviceSlugs.includes(meta.service), id)
      assert.ok(freeReportCopy[lang].severity[meta.severity])
    }
    for (const id of PASSES) assert.ok(!/undefined|NaN/.test(describePass({ id, values }, lang)), id)
    assert.deepEqual(Object.keys(freeReportCopy[lang].errors).sort(), Object.keys(freeReportCopy.en.errors).sort())
    assert.deepEqual(Object.keys(freeReportCopy[lang].trades), Object.keys(freeReportCopy.en.trades))
  })
}

test('sealed tokens round-trip and reject tampering, other secrets and expiry', () => {
  const token = seal({ a: 1 }, 's1')
  assert.equal(unseal(token, 's1').a, 1)
  assert.equal(unseal(token, 's2'), null)
  assert.equal(unseal(token.slice(0, -2) + (token.endsWith('A') ? 'BB' : 'AA'), 's1'), null)
  assert.equal(unseal(seal({ a: 1 }, 's1', -1), 's1'), null)
  assert.equal(unseal('garbage', 's1'), null)
})

test('private and internal addresses are refused', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '172.20.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1', '::ffff:7f00:1'])
    assert.equal(isPrivateAddress(ip), true, ip)
  for (const ip of ['8.8.8.8', '172.32.0.1', '2606:4700::1111']) assert.equal(isPrivateAddress(ip), false, ip)
})

// ── Endpoints, with Google, the website and Supabase mocked ────────────────

const mockRes = () => ({ code: 200, headers: {}, status(c) { this.code = c; return this }, json(b) { this.body = b; return this }, setHeader(k, v) { this.headers[k] = v } })
const json = body => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })

test('scan then unlock: free preview, then full report after the lead is saved', async t => {
  Object.assign(process.env, { GOOGLE_API_KEY: 'g', FREE_REPORT_SECRET: 'secret', SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'k' })
  const saved = []
  const realFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = realFetch })
  globalThis.fetch = async (url, init = {}) => {
    const href = String(url)
    if (href.includes('places:searchText')) {
      const body = JSON.parse(init.body)
      if (body.pageSize === 1) return json({ places: [place({ websiteUri: 'https://93.184.215.14/' })] })
      return json({ places: [{ id: 'self', displayName: { text: 'Sunshine Roofing' }, userRatingCount: 12 }, ...competitors.map(c => ({ id: c.name, displayName: { text: c.name }, rating: c.rating, userRatingCount: c.reviews }))] })
    }
    if (href.includes('pagespeedonline')) return json({ lighthouseResult: { categories: { performance: { score: 0.41 }, seo: { score: 0.83, auditRefs: [{ id: 'meta-description', weight: 1 }] } }, audits: { 'largest-contentful-paint': { numericValue: 6240 }, 'meta-description': { score: 0 } } } })
    if (href.startsWith('https://93.184.215.14')) return new Response('<html lang="en"><title>Sunshine</title><meta name="viewport" content="x">' + '<p>We fix roofs. </p>'.repeat(60), { status: 200 })
    if (href.startsWith('https://db.example/rest/v1/free_report_leads')) { saved.push(JSON.parse(init.body)); return new Response(null, { status: 201 }) }
    throw new Error(`unexpected fetch ${href}`)
  }

  const scanned = mockRes()
  await scan({ method: 'POST', headers: { 'x-real-ip': '1.1.1.1' }, body: { business: 'Sunshine Roofing', city: 'Miami, FL', trade: 'roofing' } }, scanned)
  assert.equal(scanned.code, 200)
  const { preview, token } = scanned.body
  assert.equal(preview.top[0].id, 'reviews_behind')
  assert.ok(preview.top.some(f => f.id === 'speed_slow' && f.values.seconds === 6.2))
  assert.equal(JSON.stringify(preview).includes('"A"'), false) // Competitor names stay in the full report.

  const rejected = mockRes()
  await unlock({ method: 'POST', headers: {}, body: { token, name: 'Ana', email: 'bad', consent: true } }, rejected)
  assert.equal(rejected.code, 400)
  assert.equal(saved.length, 0)

  const unlocked = mockRes()
  await unlock({ method: 'POST', headers: {}, body: { token, name: 'Ana', email: 'ana@example.com', consent: true, language: 'es' } }, unlocked)
  assert.equal(unlocked.code, 200)
  assert.deepEqual(unlocked.body.report.competitors.map(c => c.name), ['A', 'B', 'C'])
  assert.equal(unlocked.body.report.website, 'https://93.184.215.14/')
  assert.equal(saved.length, 1)
  assert.equal(saved[0].email, 'ana@example.com')
  assert.equal(saved[0].language, 'es')
  assert.equal(saved[0].score, unlocked.body.report.score)

  const forged = mockRes()
  await unlock({ method: 'POST', headers: {}, body: { token: token.slice(5), name: 'Ana', email: 'ana@example.com', consent: true } }, forged)
  assert.equal(forged.code, 410)
})

test('scan stays off until every key is configured', async () => {
  const saved = process.env.SUPABASE_URL
  delete process.env.SUPABASE_URL
  const res = mockRes()
  await scan({ method: 'POST', headers: {}, body: { business: 'A', city: 'B' } }, res)
  process.env.SUPABASE_URL = saved
  assert.equal(res.code, 503)
  assert.equal(res.body.error, 'not_configured')
})
