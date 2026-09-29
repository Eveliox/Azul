import { timingSafeEqual } from 'node:crypto'
import { readJson } from './_lib/auth.js'
import { sendEmail } from './_lib/email.js'
import { parseReport, isNoise, recipientsFor, buildLeadEmail } from './_lib/vapi.js'

// POST /api/vapi-webhook — Vapi "Server URL". Emails the business owner after every real call.
// Auth: Vapi sends the Server URL secret as the `x-vapi-secret` header; must equal VAPI_WEBHOOK_SECRET.
// Env: VAPI_WEBHOOK_SECRET, VAPI_LEAD_TO (fallback recipients), optional VAPI_LEAD_ROUTES
//      ({"<assistantId>":"owner@spa.com, you@azul.com"}), optional VAPI_LEAD_BUSINESS (display name),
//      optional VAPI_LEAD_TRANSCRIPT=false to leave the transcript out of the email.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.VAPI_WEBHOOK_SECRET
  const given = String(req.headers['x-vapi-secret'] || '')
  const ok = secret && given && Buffer.byteLength(given) === Buffer.byteLength(secret) && timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  if (!ok) return res.status(401).json({ error: 'Unauthorized' })

  const report = parseReport(readJson(req))
  if (!report) return res.status(200).json({ ok: true, ignored: 'not an end-of-call-report' })
  if (isNoise(report)) return res.status(200).json({ ok: true, ignored: 'noise' })

  const to = recipientsFor(report)
  if (!to.length) return res.status(200).json({ ok: false, error: 'No recipients configured (VAPI_LEAD_TO)' })

  const email = buildLeadEmail(report, {
    business: process.env.VAPI_LEAD_BUSINESS || report.assistantName || 'your business',
    includeTranscript: process.env.VAPI_LEAD_TRANSCRIPT !== 'false',
  })
  try {
    const id = await sendEmail({ to, ...email })
    return res.status(200).json({ ok: true, emailed: to.length, id })
  } catch (e) {
    console.error('vapi-webhook email failed', report.callId, e.message)
    // 200 so Vapi doesn't retry-storm; the failure is in the Vercel logs.
    return res.status(200).json({ ok: false, error: e.message })
  }
}
