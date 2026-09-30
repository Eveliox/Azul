import { analyzeHtml, buildReport, parseScanInput, pickCompetitors, previewOf, TRADES } from '../_lib/report.js'
import { fetchSite } from '../_lib/fetchSite.js'
import { findPlace, pageSpeed, searchCompetitors } from '../_lib/google.js'
import { clientIp, rateLimited, readJson } from '../_lib/http.js'
import { seal } from '../_lib/seal.js'

// PUBLIC. POST { business, city, trade, website? } → { preview, token }
// Runs the Google lookups and website checks, returns the score and the top
// three gaps, plus the full report sealed in `token` for /api/free-report/unlock.
export const REQUIRED_ENV = ['GOOGLE_API_KEY', 'FREE_REPORT_SECRET', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  // Without lead storage the email gate would lose every lead, so the tool
  // stays off until everything is configured.
  if (REQUIRED_ENV.some(name => !process.env[name])) return res.status(503).json({ error: 'not_configured' })

  const body = readJson(req)
  if (body.hp) return res.status(400).json({ error: 'invalid' }) // Honeypot field; people never see it.
  const { input, error } = parseScanInput(body)
  if (error) return res.status(400).json({ error, field: error })
  if (rateLimited(`scan:${clientIp(req)}`, { limit: 5, windowMs: 10 * 60 * 1000 })) return res.status(429).json({ error: 'rate_limited' })

  const key = process.env.GOOGLE_API_KEY
  const place = await findPlace(key, input)
  // No website typed in? Check the one on their Google listing.
  const website = input.website || place?.websiteUri || ''
  const term = TRADES[input.trade] || place?.primaryTypeDisplayName?.text || null

  const [found, speed, fetched] = await Promise.all([
    searchCompetitors(key, { term, city: input.city, location: place?.location }),
    website ? pageSpeed(key, website) : null,
    website ? fetchSite(website).catch(err => { console.error('free-report: site fetch failed', err.message); return null }) : null,
  ])

  const report = buildReport({
    input,
    place,
    competitors: pickCompetitors(found, place),
    website,
    site: fetched ? analyzeHtml(fetched.html, fetched.finalUrl) : null,
    siteError: Boolean(website && !fetched),
    speed,
  })
  res.setHeader('Cache-Control', 'no-store')
  return res.json({ preview: previewOf(report), token: seal({ input, report }, process.env.FREE_REPORT_SECRET) })
}
