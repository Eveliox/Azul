// Google lookups for the free report: Places API (New) and PageSpeed Insights.
// Both use GOOGLE_API_KEY. Each returns null on any failure so one missing
// source never sinks the whole report.

const PLACE_FIELDS = [
  'id', 'displayName', 'formattedAddress', 'rating', 'userRatingCount', 'websiteUri',
  'nationalPhoneNumber', 'regularOpeningHours', 'photos', 'googleMapsUri', 'primaryTypeDisplayName', 'location',
].map(f => `places.${f}`).join(',')
const COMPETITOR_FIELDS = 'places.id,places.displayName,places.rating,places.userRatingCount'

async function searchText(key, fieldMask, body, timeoutMs = 10000) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': fieldMask },
    body: JSON.stringify({ languageCode: 'en', regionCode: 'us', ...body }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`Places ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return (await res.json()).places || []
}

/** The business's own Google listing, or null when Google has none. */
export async function findPlace(key, { business, city }) {
  try {
    const [place] = await searchText(key, PLACE_FIELDS, { textQuery: `${business}, ${city}`, pageSize: 1 })
    return place || null
  } catch (err) {
    console.error('free-report: place lookup failed', err.message)
    return null
  }
}

/** The first results Google shows for the trade near the business. */
export async function searchCompetitors(key, { term, city, location }) {
  if (!term) return []
  try {
    return await searchText(key, COMPETITOR_FIELDS, {
      textQuery: `${term} in ${city}`,
      pageSize: 8,
      ...(location && { locationBias: { circle: { center: location, radius: 20000 } } }),
    })
  } catch (err) {
    console.error('free-report: competitor lookup failed', err.message)
    return []
  }
}

/** Mobile Lighthouse scores for a URL. Slow: usually 10–30 seconds. */
export async function pageSpeed(key, url) {
  const query = new URLSearchParams({ url, strategy: 'mobile', key })
  query.append('category', 'performance')
  query.append('category', 'seo')
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${query}`, { signal: AbortSignal.timeout(45000) })
    if (!res.ok) throw new Error(`PageSpeed ${res.status}: ${(await res.text()).slice(0, 300)}`)
    const { lighthouseResult: lh } = await res.json()
    const perf = lh?.categories?.performance?.score
    const seo = lh?.categories?.seo
    if (typeof perf !== 'number' || typeof seo?.score !== 'number') return null
    const lcp = lh.audits?.['largest-contentful-paint']?.numericValue
    return {
      performance: Math.round(perf * 100),
      seo: Math.round(seo.score * 100),
      lcpSeconds: typeof lcp === 'number' ? Math.round(lcp / 100) / 10 : null,
      seoFailed: (seo.auditRefs || []).filter(ref => ref.weight > 0 && lh.audits[ref.id]?.score === 0).length,
    }
  } catch (err) {
    console.error('free-report: PageSpeed failed', err.message)
    return null
  }
}
