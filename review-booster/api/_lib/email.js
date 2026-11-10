// Resend via plain fetch.
// `from` and `replyTo` are optional; without them the sender is EMAIL_FROM.
export async function sendEmail({ to, subject, html, text, from: fromOverride, replyTo }) {
  const key = process.env.RESEND_API_KEY
  const from = fromOverride || process.env.EMAIL_FROM
  if (!key || !from) throw new Error('Resend env vars missing')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Resend ${res.status}: ${data.message || JSON.stringify(data)}`)
  return data.id
}
