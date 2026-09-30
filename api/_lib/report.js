// Pure analysis for the free report: no network, so tests can cover it.
// Findings carry ids and numbers only; the page turns them into English or
// Spanish copy (src/data/freeReport.js).

export const TRADES = {
  roofing: 'roofing contractor',
  hvac: 'air conditioning contractor',
  plumbing: 'plumber',
  electrical: 'electrician',
  pool: 'pool service',
  landscaping: 'landscaping company',
  pest: 'pest control',
  cleaning: 'cleaning service',
  other: null,
}

// Every finding the report can raise, in display order within a severity.
// service: the Azul service slug that addresses it.
export const FINDINGS = {
  gbp_missing: { severity: 'high', service: 'local-proof-seo' },
  site_missing: { severity: 'high', service: 'website-build' },
  site_unreachable: { severity: 'high', service: 'website-build' },
  reviews_behind: { severity: 'high', service: 'review-booster' },
  reviews_few: { severity: 'medium', service: 'review-booster' },
  rating_low: { severity: 'medium', service: 'review-booster' },
  speed_slow: { severity: 'high', service: 'website-build' },
  not_mobile: { severity: 'high', service: 'website-build' },
  no_https: { severity: 'high', service: 'website-build' },
  phone_missing: { severity: 'high', service: 'local-proof-seo' },
  no_spanish: { severity: 'medium', service: 'website-build' },
  no_tap_to_call: { severity: 'medium', service: 'website-build' },
  seo_issues: { severity: 'medium', service: 'website-build' },
  meta_missing: { severity: 'medium', service: 'website-build' },
  hours_missing: { severity: 'medium', service: 'local-proof-seo' },
  photos_few: { severity: 'medium', service: 'local-proof-seo' },
  gbp_no_website: { severity: 'medium', service: 'website-build' },
  no_schema: { severity: 'low', service: 'local-proof-seo' },
  after_hours: { severity: 'low', service: 'ai-answering-service' },
}
export const PASSES = ['reviews_ahead', 'rating_strong', 'speed_good', 'has_spanish', 'has_tap_to_call', 'has_https', 'gbp_complete']
const WEIGHT = { high: 14, medium: 7, low: 3 }
const SEVERITY_ORDER = ['high', 'medium', 'low']
const findingOrder = Object.keys(FINDINGS)

// ── Input ──────────────────────────────────────────────────────────────────

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/** Returns a normalized http(s) URL string, '' for blank input, or null when invalid. */
export function normalizeWebsite(value) {
  const raw = clean(value, 300)
  if (!raw) return ''
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return null
    if (url.port && !['80', '443'].includes(url.port)) return null
    url.hash = ''
    return url.href
  } catch { return null }
}

/** Validates the scan form. Returns { input } or { error }. */
export function parseScanInput(body) {
  const business = clean(body?.business, 120)
  const city = clean(body?.city, 80)
  const trade = Object.hasOwn(TRADES, body?.trade) ? body.trade : 'other'
  const website = normalizeWebsite(body?.website)
  if (business.length < 2) return { error: 'business' }
  if (city.length < 2) return { error: 'city' }
  if (website === null) return { error: 'website' }
  return { input: { business, city, trade, website } }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Validates the unlock form. Returns { lead } or { error }. */
export function parseLeadInput(body) {
  const name = clean(body?.name, 100)
  const email = clean(body?.email, 200).toLowerCase()
  const phone = clean(body?.phone, 40)
  if (name.length < 2) return { error: 'name' }
  if (!EMAIL.test(email)) return { error: 'email' }
  if (phone && !/^[+\d\s().-]{7,}$/.test(phone)) return { error: 'phone' }
  if (body?.consent !== true && body?.consent !== 'on') return { error: 'consent' }
  return { lead: { name, email, phone: phone || null, language: body?.language === 'es' ? 'es' : 'en' } }
}

// ── Website HTML ───────────────────────────────────────────────────────────

const attrs = tag => {
  const out = {}
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ''
  return out
}
const LOCAL_TYPES = /\b(LocalBusiness|HomeAndConstructionBusiness|RoofingContractor|HVACBusiness|Plumber|Electrician|GeneralContractor|HousePainter|Locksmith|MovingCompany|ProfessionalService|EmergencyService)\b/

/** Reads the signals we check from a homepage's HTML. */
export function analyzeHtml(html, finalUrl) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]))
  const metaContent = name => metas.find(m => (m.name || '').toLowerCase() === name)?.content?.trim() || ''
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim()
  const htmlLang = (html.match(/<html\b[^>]*>/i)?.[0] || '').match(/\blang\s*=\s*["']?([a-z-]+)/i)?.[1]?.toLowerCase() || ''
  const schemas = [...html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1])
  // Pages that render in the browser (React, Vue…) send almost no text; the
  // HTML checks would then report gaps that aren't real, so we skip them.
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, ' ').replace(/\s+/g, ' ').trim()
  return {
    https: finalUrl.startsWith('https:'),
    title,
    description: metaContent('description'),
    viewport: Boolean(metaContent('viewport')),
    tapToCall: /href\s*=\s*["']?\s*tel:/i.test(html),
    spanish: htmlLang.startsWith('es')
      || /hreflang\s*=\s*["']?es\b/i.test(html)
      || /href\s*=\s*["'][^"']*\/es(?:[/?#"']|-[a-z]{2})/i.test(html)
      || /espa(?:ñ|&ntilde;|&#241;|n)ol/i.test(text)
      || /weglot|gtranslate|translate\.google/i.test(html),
    localSchema: schemas.some(s => LOCAL_TYPES.test(s)),
    renderedInBrowser: text.length < 400,
  }
}

// ── Google data ────────────────────────────────────────────────────────────

/** Hours per week a Places `regularOpeningHours` shows the business closed. */
export function closedHoursPerWeek(hours) {
  const periods = hours?.periods
  if (!periods?.length) return null
  const WEEK = 7 * 24 * 60
  if (periods.some(p => !p.close)) return 0 // Open 24 hours.
  let open = 0
  for (const { open: o, close: c } of periods) {
    const start = o.day * 1440 + (o.hour || 0) * 60 + (o.minute || 0)
    let end = c.day * 1440 + (c.hour || 0) * 60 + (c.minute || 0)
    if (end <= start) end += WEEK
    open += end - start
  }
  return Math.max(0, Math.round((WEEK - Math.min(open, WEEK)) / 60))
}

const round1 = n => Math.round(n * 10) / 10
const mean = values => values.reduce((a, b) => a + b, 0) / values.length

/** Picks the first three results that aren't the business itself. */
export function pickCompetitors(places, self) {
  const selfName = self?.displayName?.text?.toLowerCase()
  return (places || [])
    .filter(p => p.id !== self?.id && p.displayName?.text?.toLowerCase() !== selfName && typeof p.userRatingCount === 'number')
    .slice(0, 3)
    .map(p => ({ name: p.displayName.text, rating: p.rating ?? null, reviews: p.userRatingCount }))
}

// ── Report ─────────────────────────────────────────────────────────────────

/**
 * Builds the report from whatever the lookups returned. Any source may be
 * null (not found, not configured, or failed), and only what was actually
 * measured is reported.
 *
 * place: Places API (New) place | null
 * competitors: [{ name, rating, reviews }]
 * website: the URL we checked, or ''
 * site: analyzeHtml() result | null; siteError: true if the site didn't load
 * speed: { performance, seo, lcpSeconds, seoFailed } | null
 */
export function buildReport({ input, place, competitors = [], website, site, siteError, speed }) {
  const findings = []
  const passes = []
  const add = (id, values = {}) => findings.push({ id, ...FINDINGS[id], values })
  const compared = competitors.length > 0
  const avgReviews = compared ? Math.round(mean(competitors.map(c => c.reviews))) : null
  const rated = competitors.filter(c => typeof c.rating === 'number')
  const avgRating = rated.length ? round1(mean(rated.map(c => c.rating))) : null

  if (!place) add('gbp_missing', { business: input.business, city: input.city })
  else {
    const reviews = place.userRatingCount ?? 0
    const rating = place.rating ?? null
    if (compared && reviews < avgReviews * 0.75) add('reviews_behind', { yours: reviews, avg: avgReviews, gap: avgReviews - reviews })
    else if (!compared && reviews < 50) add('reviews_few', { yours: reviews })
    else if (compared && reviews >= avgReviews) passes.push({ id: 'reviews_ahead', values: { yours: reviews, avg: avgReviews } })

    if (rating !== null && (rating < 4.5 || (avgRating !== null && rating < avgRating - 0.2))) add('rating_low', { yours: rating, avg: avgRating })
    else if (rating !== null && rating >= 4.5) passes.push({ id: 'rating_strong', values: { yours: rating } })

    if (!place.nationalPhoneNumber) add('phone_missing')
    const closed = closedHoursPerWeek(place.regularOpeningHours)
    if (closed === null) add('hours_missing')
    else if (closed > 0) add('after_hours', { hours: closed })
    const photos = place.photos?.length ?? 0
    if (photos < 10) add('photos_few', { count: photos })
    if (!place.websiteUri) add('gbp_no_website')
    if (place.nationalPhoneNumber && closed !== null && photos >= 10 && place.websiteUri) passes.push({ id: 'gbp_complete', values: {} })
  }

  if (!website) add('site_missing')
  else if (siteError && !speed) add('site_unreachable', { url: website })
  else {
    if (speed) {
      if (speed.performance < 90) add('speed_slow', { score: speed.performance, seconds: speed.lcpSeconds })
      else passes.push({ id: 'speed_good', values: { score: speed.performance, seconds: speed.lcpSeconds } })
      if (speed.seo < 90) add('seo_issues', { score: speed.seo, failed: speed.seoFailed })
    }
    if (site) {
      if (!site.https) add('no_https')
      else passes.push({ id: 'has_https', values: {} })
      if (!site.viewport) add('not_mobile')
      if (!site.renderedInBrowser) {
        if (!site.title || !site.description) add('meta_missing', { title: Boolean(site.title), description: Boolean(site.description) })
        if (site.spanish) passes.push({ id: 'has_spanish', values: {} })
        else add('no_spanish')
        if (site.tapToCall) passes.push({ id: 'has_tap_to_call', values: {} })
        else add('no_tap_to_call')
        if (!site.localSchema) add('no_schema')
      }
    }
  }

  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || findingOrder.indexOf(a.id) - findingOrder.indexOf(b.id))
  const score = Math.max(5, 100 - findings.reduce((sum, f) => sum + WEIGHT[f.severity], 0))

  return {
    business: place?.displayName?.text || input.business,
    city: input.city,
    trade: input.trade,
    score,
    findings,
    passes,
    checked: { google: Boolean(place), website: Boolean(website && (site || speed)) },
    google: place ? {
      name: place.displayName?.text || input.business,
      address: place.formattedAddress || null,
      mapsUrl: place.googleMapsUri || null,
      rating: place.rating ?? null,
      reviews: place.userRatingCount ?? 0,
      photos: place.photos?.length ?? 0,
    } : null,
    competitors,
    averages: compared ? { reviews: avgReviews, rating: avgRating } : null,
    website: website || null,
    speed: speed || null,
    services: [...new Set(findings.map(f => f.service))],
    checkedAt: new Date().toISOString(),
  }
}

/** The free part: score, the three biggest gaps, and how many more there are. */
export function previewOf(report) {
  return {
    business: report.business,
    score: report.score,
    total: report.findings.length,
    top: report.findings.slice(0, 3),
    checked: report.checked,
  }
}
