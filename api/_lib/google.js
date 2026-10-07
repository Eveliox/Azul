// Google lookups for the free report, via Places API (New) and GOOGLE_API_KEY.
// Each returns an empty result on any failure so one missing source never
// sinks the whole report.

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
