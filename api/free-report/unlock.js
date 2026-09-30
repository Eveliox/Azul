import { parseLeadInput } from '../_lib/report.js'
import { clientIp, rateLimited, readJson } from '../_lib/http.js'
import { notifyTeam, saveLead } from '../_lib/leads.js'
import { unseal } from '../_lib/seal.js'

// PUBLIC. POST { token, name, email, phone?, consent, language } → { report }
// Saves the lead, then returns the full report sealed by /api/free-report/scan.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.FREE_REPORT_SECRET) return res.status(503).json({ error: 'not_configured' })
  if (rateLimited(`unlock:${clientIp(req)}`, { limit: 10, windowMs: 10 * 60 * 1000 })) return res.status(429).json({ error: 'rate_limited' })

  const body = readJson(req)
  const sealed = unseal(body.token, process.env.FREE_REPORT_SECRET)
  if (!sealed) return res.status(410).json({ error: 'expired' })
  const { lead, error } = parseLeadInput(body)
  if (error) return res.status(400).json({ error, field: error })

  const { input, report } = sealed
  try {
    await saveLead({
      ...lead,
      consent: true,
      business: report.business,
      city: input.city,
      trade: input.trade,
      website: report.website,
      score: report.score,
      report,
    })
  } catch (err) {
    // The visitor did their part; show the report and leave a trail to recover the lead.
    console.error('free-report: lead not saved', err.message, JSON.stringify({ ...lead, business: report.business }))
  }
  await notifyTeam({ lead, input, report }).catch(err => console.error('free-report: notify failed', err.message))

  res.setHeader('Cache-Control', 'no-store')
  return res.json({ report })
}
