import { db } from '../_lib/db.js'
import { readJson } from '../_lib/auth.js'
import { sendEmail } from '../_lib/email.js'
import { sendSms } from '../_lib/sms.js'
import { ownerAlert } from '../_lib/messages.js'

// PUBLIC — no auth; the token IS the secret.
// GET  /api/review/:token          → info for the review gate page (marks clicked)
// POST /api/review/:token          → { rating, feedback? } record rating; alert owner if < 5
export default async function handler(req, res) {
  const { token } = req.query
  const { data: r, error } = await db()
    .from('review_requests')
    .select('id, status, rating, language, customer_name, clicked_at, customer_phone, customer_email, clients(name, google_review_url, owner_email, owner_phone)')
    .eq('token', token)
    .single()
  if (error || !r) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'GET') {
    if (!r.clicked_at) {
      await db().from('review_requests')
        .update({ clicked_at: new Date().toISOString(), status: r.rating ? 'rated' : 'clicked' })
        .eq('id', r.id)
    }
    return res.json({
      business: r.clients.name,
      customer_name: r.customer_name,
      language: r.language,
      google_review_url: r.clients.google_review_url,
      already_rated: r.rating != null,
      rating: r.rating,
    })
  }

  if (req.method === 'POST') {
    const b = readJson(req)
    const rating = Number(b.rating)
    if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'rating 1-5 required' })
    const feedback = (b.feedback || '').toString().slice(0, 2000) || null

    const update = { rating, rated_at: new Date().toISOString(), status: 'rated' }
    if (feedback) update.feedback = feedback
    await db().from('review_requests').update(update).eq('id', r.id)

    // Shield: 1-4 stars never go public. Alert the owner privately (only once feedback is submitted,
    // or immediately if the customer skipped the comment box).
    if (rating < 5 && (feedback || b.final)) {
      const msg = ownerAlert({
        business: r.clients.name,
        customer: r.customer_name,
        phone: r.customer_phone,
        email: r.customer_email,
        rating,
        feedback,
      })
      const jobs = []
      if (r.clients.owner_email) jobs.push(sendEmail({ to: r.clients.owner_email, ...msg }))
      if (r.clients.owner_phone) {
        jobs.push(sendSms(r.clients.owner_phone,
          `Azul: ${rating}-star private feedback from ${r.customer_name} (${r.clients.name}). Check your email — call them within 24h.`))
      }
      await Promise.allSettled(jobs)
    }

    return res.json({ ok: true, redirect: rating === 5 ? r.clients.google_review_url : null })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
