// Customer-facing messages. Every client starts from a preset and can edit any field.
// Placeholders: {first_name} {name} {business} {link}

export const FIELDS = ['sms', 'followupSms', 'emailSubject', 'emailBody', 'emailCta', 'followupEmailSubject', 'followupEmailBody']
export const PLACEHOLDERS = ['{first_name}', '{name}', '{business}', '{link}']

export const PRESETS = {
  friendly: {
    label: 'Friendly',
    en: {
      sms: 'Hi {first_name}, thanks for choosing {business}! Would you take 30 seconds to share how it went? {link}',
      followupSms: 'Hi {first_name}, quick reminder from {business} — we\'d love your feedback: {link}',
      emailSubject: 'How was your visit to {business}?',
      emailBody: 'Hi {first_name},\n\nThank you for choosing {business}. We\'d really appreciate 30 seconds of your time to tell us how it went.',
      emailCta: 'Share your experience',
      followupEmailSubject: 'Quick reminder from {business}',
      followupEmailBody: 'Hi {first_name},\n\nJust a quick reminder from {business} — we\'d love to hear how your visit went. It only takes 30 seconds.',
    },
    es: {
      sms: 'Hola {first_name}, ¡gracias por elegir {business}! ¿Nos regala 30 segundos para contarnos cómo le fue? {link}',
      followupSms: 'Hola {first_name}, un recordatorio de {business} — nos encantaría conocer su opinión: {link}',
      emailSubject: '¿Cómo fue su visita a {business}?',
      emailBody: 'Hola {first_name},\n\nGracias por elegir {business}. Le agradeceríamos 30 segundos de su tiempo para contarnos cómo le fue.',
      emailCta: 'Compartir mi experiencia',
      followupEmailSubject: 'Un recordatorio de {business}',
      followupEmailBody: 'Hola {first_name},\n\nUn breve recordatorio de {business} — nos encantaría saber cómo le fue en su visita. Solo toma 30 segundos.',
    },
  },
  professional: {
    label: 'Professional',
    en: {
      sms: '{business}: Thank you for your visit, {first_name}. We would value your feedback on your experience: {link}',
      followupSms: '{business}: A brief reminder, {first_name} — your feedback helps us maintain our standard of service: {link}',
      emailSubject: 'Your feedback on your recent visit to {business}',
      emailBody: 'Dear {first_name},\n\nThank you for choosing {business}. We are committed to providing excellent service, and your feedback helps us ensure we meet that standard. It takes less than a minute.',
      emailCta: 'Rate your experience',
      followupEmailSubject: 'Reminder: your feedback for {business}',
      followupEmailBody: 'Dear {first_name},\n\nWe recently asked for your feedback on your visit to {business}. If you have a moment, we would appreciate hearing about your experience.',
    },
    es: {
      sms: '{business}: Gracias por su visita, {first_name}. Valoraríamos su opinión sobre su experiencia: {link}',
      followupSms: '{business}: Un breve recordatorio, {first_name} — su opinión nos ayuda a mantener nuestra calidad de servicio: {link}',
      emailSubject: 'Su opinión sobre su reciente visita a {business}',
      emailBody: 'Estimado/a {first_name}:\n\nGracias por elegir {business}. Nos comprometemos a brindar un servicio excelente, y su opinión nos ayuda a asegurar que cumplimos con ese estándar. Toma menos de un minuto.',
      emailCta: 'Calificar mi experiencia',
      followupEmailSubject: 'Recordatorio: su opinión para {business}',
      followupEmailBody: 'Estimado/a {first_name}:\n\nRecientemente le pedimos su opinión sobre su visita a {business}. Si tiene un momento, nos gustaría conocer su experiencia.',
    },
  },
  casual: {
    label: 'Casual',
    en: {
      sms: 'Hey {first_name}! It\'s {business}. How\'d we do today? Tap here, takes 10 sec: {link}',
      followupSms: 'Hey {first_name}, {business} again. Still want to hear how it went: {link}',
      emailSubject: 'How\'d we do? — {business}',
      emailBody: 'Hey {first_name}!\n\nThanks for stopping by {business}. Got 10 seconds? Tap below and let us know how we did.',
      emailCta: 'Tell us how it went',
      followupEmailSubject: 'Still want to hear from you — {business}',
      followupEmailBody: 'Hey {first_name},\n\nIt\'s {business} again. We\'d still love to know how your visit went. Quick tap below.',
    },
    es: {
      sms: '¡Hola {first_name}! Somos {business}. ¿Qué tal le fue hoy? Toque aquí, son 10 segundos: {link}',
      followupSms: 'Hola {first_name}, {business} de nuevo. Todavía queremos saber cómo le fue: {link}',
      emailSubject: '¿Qué tal le fue? — {business}',
      emailBody: '¡Hola {first_name}!\n\nGracias por pasar por {business}. ¿Tiene 10 segundos? Toque abajo y cuéntenos cómo lo hicimos.',
      emailCta: 'Contarles cómo me fue',
      followupEmailSubject: 'Todavía queremos saber de usted — {business}',
      followupEmailBody: 'Hola {first_name},\n\nSomos {business} de nuevo. Todavía nos encantaría saber cómo le fue. Un toque abajo.',
    },
  },
  warm: {
    label: 'Warm',
    en: {
      sms: '{first_name}, it was a pleasure having you at {business} today. If you have a moment, we\'d love to know how you felt about your visit: {link}',
      followupSms: '{first_name}, we hope you\'re doing well. Everyone at {business} would still love to hear how your visit was: {link}',
      emailSubject: 'Thank you for visiting {business}',
      emailBody: 'Hi {first_name},\n\nIt was a pleasure having you at {business}. Every visit matters to us, and we\'d love to know how you felt about yours. It only takes a moment.',
      emailCta: 'Share how you felt',
      followupEmailSubject: 'We hope you\'re well — {business}',
      followupEmailBody: 'Hi {first_name},\n\nWe hope you\'re doing well. Everyone at {business} would still love to hear how your visit was, whenever you have a moment.',
    },
    es: {
      sms: '{first_name}, fue un placer tenerle hoy en {business}. Si tiene un momento, nos encantaría saber cómo se sintió con su visita: {link}',
      followupSms: '{first_name}, esperamos que esté bien. Todo el equipo de {business} aún quisiera saber cómo fue su visita: {link}',
      emailSubject: 'Gracias por visitar {business}',
      emailBody: 'Hola {first_name},\n\nFue un placer tenerle en {business}. Cada visita es importante para nosotros, y nos encantaría saber cómo se sintió con la suya. Solo toma un momento.',
      emailCta: 'Compartir cómo me sentí',
      followupEmailSubject: 'Esperamos que esté bien — {business}',
      followupEmailBody: 'Hola {first_name},\n\nEsperamos que esté bien. Todo el equipo de {business} aún quisiera saber cómo fue su visita, cuando tenga un momento.',
    },
  },
}

export const TONES = Object.keys(PRESETS)

// The text a client actually uses: their saved edits on top of their preset.
export function resolveMessages(client, language) {
  const lang = language === 'es' ? 'es' : 'en'
  const preset = (PRESETS[client?.tone] || PRESETS.friendly)[lang]
  const custom = client?.messages?.[lang] || {}
  return Object.fromEntries(FIELDS.map((f) => [f, typeof custom[f] === 'string' && custom[f].trim() ? custom[f] : preset[f]]))
}

// Only keep fields that differ from the preset, so a client that never edited stays on the preset.
export function normalizeMessages(input, tone) {
  if (!input || typeof input !== 'object') return null
  const out = {}
  for (const lang of ['en', 'es']) {
    const preset = (PRESETS[tone] || PRESETS.friendly)[lang]
    const src = input[lang] || {}
    const kept = {}
    for (const f of FIELDS) {
      const v = typeof src[f] === 'string' ? src[f].trim().slice(0, 2000) : ''
      if (v && v !== preset[f]) kept[f] = v
    }
    if (Object.keys(kept).length) out[lang] = kept
  }
  return Object.keys(out).length ? out : null
}

// Fields that must carry the review link, or the customer has nothing to tap.
export function validateMessages(input) {
  const problems = []
  for (const lang of ['en', 'es']) {
    const src = input?.[lang] || {}
    for (const f of ['sms', 'followupSms']) {
      if (typeof src[f] === 'string' && src[f].trim() && !src[f].includes('{link}')) problems.push(`${lang}.${f} is missing {link}`)
    }
  }
  return problems
}

const first = (name) => (name || '').trim().split(' ')[0]
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export function fill(text, { customer, business, link }) {
  return String(text)
    .replaceAll('{first_name}', first(customer))
    .replaceAll('{name}', customer || '')
    .replaceAll('{business}', business || '')
    .replaceAll('{link}', link || '')
}

const BTN = 'display:inline-block;padding:12px 22px;background:#2563EB;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px'
function emailHtml(bodyText, cta, link, lang) {
  const paragraphs = esc(bodyText).split(/\n{2,}/).map((p) => `<p style="margin:0 0 16px">${p.replace(/\n/g, '<br/>')}</p>`).join('')
  const footer = lang === 'es' ? 'O copie este enlace:' : 'Or copy this link:'
  return `
  <div style="font-family:Inter,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px 16px;color:#111827;line-height:1.55">
    ${paragraphs}
    <p style="margin:4px 0 20px"><a href="${esc(link)}" style="${BTN}">${esc(cta)}</a></p>
    <p style="color:#6B7280;font-size:13px;margin:0">${footer} <a href="${esc(link)}" style="color:#2563EB">${esc(link)}</a></p>
  </div>`
}

// Rendered messages for one request, in the shape send-due.js consumes.
export function renderFor(client, language, vars) {
  const m = resolveMessages(client, language)
  const lang = language === 'es' ? 'es' : 'en'
  const f = (t) => fill(t, vars)
  return {
    sms: f(m.sms),
    followupSms: f(m.followupSms),
    emailSubject: f(m.emailSubject),
    emailBody: emailHtml(f(m.emailBody), f(m.emailCta), vars.link, lang),
    followupEmailSubject: f(m.followupEmailSubject),
    followupEmailBody: emailHtml(f(m.followupEmailBody), f(m.emailCta), vars.link, lang),
  }
}

// Owner alert when a 1-4 star rating comes in (always English + Spanish so any owner can read it)
export const ownerAlert = ({ business, customer, phone, email, rating, feedback }) => ({
  subject: `⚠️ ${rating}-star private feedback — ${business}`,
  html: `
    <h2 style="margin:0 0 8px">Private feedback (not posted publicly)</h2>
    <p style="color:#6B7280;margin:0 0 16px">Comentario privado (no publicado)</p>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Business</strong></td><td>${esc(business)}</td></tr>
      <tr><td><strong>Customer</strong></td><td>${esc(customer)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${esc(phone || '—')}</td></tr>
      <tr><td><strong>Email</strong></td><td>${esc(email || '—')}</td></tr>
      <tr><td><strong>Rating</strong></td><td>${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</td></tr>
    </table>
    <p style="margin-top:16px"><strong>Feedback:</strong></p>
    <blockquote style="border-left:3px solid #2563EB;margin:0;padding:8px 12px;background:#F3F4F6">${esc(feedback || '(no comment left)')}</blockquote>
    <p style="color:#6B7280;font-size:13px;margin-top:24px">Tip: call them within 24h. Recovered customers often become your loudest fans.<br/>— Azul Review Booster</p>`,
})
