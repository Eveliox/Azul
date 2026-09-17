// Bilingual message templates. Miami/LatAm Spanish, "usted" register.

const first = (name) => (name || '').trim().split(' ')[0]

export const templates = {
  en: {
    sms: ({ customer, business, link }) =>
      `Hi ${first(customer)}, thanks for choosing ${business}! Would you take 30 seconds to share how it went? ${link}`,
    followupSms: ({ customer, business, link }) =>
      `Hi ${first(customer)}, quick reminder from ${business} — we'd love your feedback: ${link}`,
    emailSubject: ({ business }) => `How was your visit to ${business}?`,
    emailBody: ({ customer, business, link }) => `
      <p>Hi ${first(customer)},</p>
      <p>Thank you for choosing <strong>${business}</strong>. We'd really appreciate 30 seconds of your time to tell us how it went.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Share your experience</a></p>
      <p style="color:#6B7280;font-size:13px">Or copy this link: ${link}</p>`,
    followupEmailSubject: ({ business }) => `Quick reminder from ${business}`,
    followupEmailBody: ({ customer, business, link }) => `
      <p>Hi ${first(customer)},</p>
      <p>Just a quick reminder from <strong>${business}</strong> — we'd love to hear how your visit went. It only takes 30 seconds.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Share your experience</a></p>
      <p style="color:#6B7280;font-size:13px">Or copy this link: ${link}</p>`,
  },
  es: {
    sms: ({ customer, business, link }) =>
      `Hola ${first(customer)}, ¡gracias por elegir ${business}! ¿Nos regala 30 segundos para contarnos cómo le fue? ${link}`,
    followupSms: ({ customer, business, link }) =>
      `Hola ${first(customer)}, un recordatorio de ${business} — nos encantaría conocer su opinión: ${link}`,
    emailSubject: ({ business }) => `¿Cómo fue su visita a ${business}?`,
    emailBody: ({ customer, business, link }) => `
      <p>Hola ${first(customer)},</p>
      <p>Gracias por elegir <strong>${business}</strong>. Le agradeceríamos 30 segundos de su tiempo para contarnos cómo le fue.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Compartir mi experiencia</a></p>
      <p style="color:#6B7280;font-size:13px">O copie este enlace: ${link}</p>`,
    followupEmailSubject: ({ business }) => `Un recordatorio de ${business}`,
    followupEmailBody: ({ customer, business, link }) => `
      <p>Hola ${first(customer)},</p>
      <p>Un breve recordatorio de <strong>${business}</strong> — nos encantaría saber cómo le fue en su visita. Solo toma 30 segundos.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Compartir mi experiencia</a></p>
      <p style="color:#6B7280;font-size:13px">O copie este enlace: ${link}</p>`,
  },
}

// Owner alert when a 1-4 star rating comes in (always English + Spanish so any owner can read it)
export const ownerAlert = ({ business, customer, phone, email, rating, feedback }) => ({
  subject: `⚠️ ${rating}-star private feedback — ${business}`,
  html: `
    <h2 style="margin:0 0 8px">Private feedback (not posted publicly)</h2>
    <p style="color:#6B7280;margin:0 0 16px">Comentario privado (no publicado)</p>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Business</strong></td><td>${business}</td></tr>
      <tr><td><strong>Customer</strong></td><td>${customer}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email || '—'}</td></tr>
      <tr><td><strong>Rating</strong></td><td>${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</td></tr>
    </table>
    <p style="margin-top:16px"><strong>Feedback:</strong></p>
    <blockquote style="border-left:3px solid #2563EB;margin:0;padding:8px 12px;background:#F3F4F6">${feedback || '(no comment left)'}</blockquote>
    <p style="color:#6B7280;font-size:13px;margin-top:24px">Tip: call them within 24h. Recovered customers often become your loudest fans.<br/>— Azul Review Booster</p>`,
})
