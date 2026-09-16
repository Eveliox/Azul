import { db } from './_lib/db.js'
import { requireCron } from './_lib/auth.js'
import { sendSms } from './_lib/sms.js'
import { sendEmail } from './_lib/email.js'
import { templates } from './_lib/messages.js'

// GET /api/send-due   (called by cron every 10-60 min)
// 1) sends pending requests whose send_at has passed
// 2) sends ONE follow-up to "sent" requests that were never clicked after followup_hours
export default async function handler(req, res) {
  if (!requireCron(req, res)) return
  const now = new Date()
  const report = { sent: 0, followups: 0, failed: 0, errors: [] }

  // ── 1. First sends ────────────────────────────────────────────────
  const { data: due, error } = await db()
    .from('review_requests')
    .select('*, clients(*)')
    .eq('status', 'pending')
    .lte('send_at', now.toISOString())
    .limit(50)
  if (error) return res.status(500).json({ error: error.message })

  for (const r of due) {
    try {
      await deliver(r, 'sms')
      await db().from('review_requests')
        .update({ status: 'sent', sent_at: now.toISOString(), error: null })
        .eq('id', r.id)
      report.sent++
    } catch (e) {
      report.failed++
      report.errors.push(`${r.id}: ${e.message}`)
      await db().from('review_requests')
        .update({ status: 'failed', error: e.message }).eq('id', r.id)
    }
  }

  // ── 2. Follow-ups ─────────────────────────────────────────────────
  const { data: stale } = await db()
    .from('review_requests')
    .select('*, clients(*)')
    .eq('status', 'sent')
    .is('followup_sent_at', null)
    .is('clicked_at', null)
    .limit(50)

  for (const r of stale || []) {
    const cutoff = new Date(r.sent_at).getTime() + r.clients.followup_hours * 3600 * 1000
    if (Date.now() < cutoff) continue
    try {
      await deliver(r, 'followupSms')
      await db().from('review_requests')
        .update({ followup_sent_at: now.toISOString() }).eq('id', r.id)
      report.followups++
    } catch (e) {
      report.errors.push(`followup ${r.id}: ${e.message}`)
    }
  }

  res.json(report)
}

async function deliver(r, smsKind) {
  const t = templates[r.language] || templates.en
  const vars = {
    customer: r.customer_name,
    business: r.clients.name,
    link: `${process.env.APP_URL}/r/${r.token}`,
  }
  let delivered = false
  if (r.customer_phone) {
    await sendSms(r.customer_phone, t[smsKind](vars))
    delivered = true
  }
  // Email only on first send (no email nag)
  if (r.customer_email && smsKind === 'sms') {
    await sendEmail({
      to: r.customer_email,
      subject: t.emailSubject(vars),
      html: t.emailBody(vars),
    })
    delivered = true
  }
  if (!delivered) throw new Error('No phone or email on request')
}
