import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api.js'

const T = {
  en: {
    eyebrow: 'Quick feedback for',
    title: 'How was your visit?',
    sub: 'Tap a star. It takes 5 seconds.',
    stars: ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'],
    thanks5: 'Thank you!',
    thanks5Sub: (b) => `Reviews help other people find ${b}. Would you share yours on Google?`,
    cta5: 'Leave a Google review',
    redirecting: 'Taking you to Google…',
    lowTitle: 'Thanks for your honesty.',
    lowSub: (b) => `This goes privately to the ${b} team so they can make it right. What could have been better?`,
    placeholder: 'Tell us what happened…',
    send: 'Send feedback',
    skip: 'Skip for now',
    doneTitle: 'Received. Thank you.',
    doneSub: 'Someone from the team will reach out to you.',
    publicToo: 'You can also share your experience publicly on Google.',
    already: 'You already left your feedback. Thank you!',
    notFound: 'This link is invalid or has expired.',
    loading: 'Loading…',
    powered: 'Powered by',
  },
  es: {
    eyebrow: 'Opinión rápida para',
    title: '¿Cómo fue su visita?',
    sub: 'Toque una estrella. Solo toma 5 segundos.',
    stars: ['Terrible', 'Malo', 'Regular', 'Bueno', 'Excelente'],
    thanks5: '¡Gracias!',
    thanks5Sub: (b) => `Las reseñas ayudan a otras personas a encontrar ${b}. ¿Compartiría la suya en Google?`,
    cta5: 'Dejar una reseña en Google',
    redirecting: 'Llevándolo a Google…',
    lowTitle: 'Gracias por su honestidad.',
    lowSub: (b) => `Esto llega de forma privada al equipo de ${b} para que puedan mejorar. ¿Qué pudo haber sido mejor?`,
    placeholder: 'Cuéntenos qué pasó…',
    send: 'Enviar comentario',
    skip: 'Omitir por ahora',
    doneTitle: 'Recibido. Gracias.',
    doneSub: 'Alguien del equipo se comunicará con usted.',
    publicToo: 'También puede compartir su experiencia públicamente en Google.',
    already: 'Ya dejó su comentario. ¡Gracias!',
    notFound: 'Este enlace no es válido o ha expirado.',
    loading: 'Cargando…',
    powered: 'Desarrollado por',
  },
}

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path
        d="M12 2.5l2.95 6.27 6.85.83-5.05 4.73 1.32 6.8L12 17.77l-6.07 3.36 1.32-6.8L2.2 9.6l6.85-.83L12 2.5z"
        className={`transition-colors duration-150 ${filled ? 'fill-amber-400 stroke-amber-400' : 'fill-white stroke-gray-300'}`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3c-.5-1.5-.5-3.1 0-4.6V6.6H1.2c-1.6 3.3-1.6 7.5 0 10.8l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-5 6.7-5z" />
    </svg>
  )
}

export default function ReviewGate() {
  const { token } = useParams()
  const [info, setInfo] = useState(null)
  const [err, setErr] = useState(null)
  const [lang, setLang] = useState('en')
  const [hover, setHover] = useState(0)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [step, setStep] = useState('rate') // rate | five | low | done | already
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api(`/api/review/${token}`, { admin: false })
      .then((d) => {
        setInfo(d)
        setLang(d.language || 'en')
        if (d.already_rated) setStep('already')
      })
      .catch((e) => setErr(e.message))
  }, [token])

  const t = T[lang]
  const shown = hover || rating

  async function pick(n) {
    if (busy) return
    setRating(n)
    setBusy(true)
    try {
      const d = await api(`/api/review/${token}`, { method: 'POST', admin: false, body: { rating: n } })
      if (n === 5) {
        setStep('five')
        setTimeout(() => { window.location.href = d.redirect || info.google_review_url }, 1500)
      } else {
        setStep('low')
      }
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  async function submitFeedback(skip = false) {
    setBusy(true)
    try {
      await api(`/api/review/${token}`, {
        method: 'POST', admin: false,
        body: { rating, feedback: skip ? '' : feedback, final: true },
      })
      setStep('done')
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-50 to-white" />

      <header className="relative flex items-center justify-between px-5 py-4 max-w-lg w-full mx-auto">
        <span className="inline-flex items-baseline gap-1 text-xl font-bold tracking-tight">
          Azul<span className="w-1.5 h-1.5 rounded-full bg-blue-500 self-end mb-1" />
        </span>
        <button
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur transition-colors"
        >
          {lang === 'en' ? 'Español' : 'English'}
        </button>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-5 pb-10">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200/70 rounded-2xl p-7 sm:p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            {err && <p className="text-gray-600">{t.notFound}</p>}
            {!err && !info && <p className="text-gray-400">{t.loading}</p>}

            {info && step === 'rate' && (
              <>
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-blue-600 mb-2">{t.eyebrow}</p>
                <p className="text-lg font-semibold tracking-tight text-gray-900 mb-6">{info.business}</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>{t.title}</h1>
                <p className="text-gray-500 mb-8">{t.sub}</p>

                <div className="flex justify-center gap-1.5 sm:gap-2 mb-3" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} ${t.stars[n - 1]}`}
                      disabled={busy}
                      onMouseEnter={() => setHover(n)}
                      onFocus={() => setHover(n)}
                      onBlur={() => setHover(0)}
                      onClick={() => pick(n)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 p-1 rounded-xl transition-transform duration-150 active:scale-95 ${
                        n <= shown ? 'scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <Star filled={n <= shown} />
                    </button>
                  ))}
                </div>
                <p className={`h-6 text-sm font-medium transition-opacity ${shown ? 'opacity-100' : 'opacity-0'} ${shown >= 4 ? 'text-emerald-600' : shown >= 3 ? 'text-gray-600' : 'text-orange-600'}`}>
                  {shown ? t.stars[shown - 1] : ' '}
                </p>
              </>
            )}

            {step === 'five' && (
              <>
                <div className="flex justify-center gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((n) => <div key={n} className="w-9 h-9"><Star filled /></div>)}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>{t.thanks5}</h2>
                <p className="text-gray-500 mb-7">{t.thanks5Sub(info.business)}</p>
                <a
                  href={info.google_review_url}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-colors"
                >
                  <span className="bg-white rounded-full p-1"><GoogleG /></span>
                  {t.cta5}
                </a>
                <p className="text-xs text-gray-400 mt-4">{t.redirecting}</p>
              </>
            )}

            {step === 'low' && (
              <>
                <div className="flex justify-center gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((n) => <div key={n} className="w-7 h-7"><Star filled={n <= rating} /></div>)}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{t.lowTitle}</h2>
                <p className="text-gray-500 text-sm mb-5">{t.lowSub(info.business)}</p>
                <textarea
                  className="w-full min-h-[130px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition mb-3 resize-none"
                  placeholder={t.placeholder}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  autoFocus
                />
                <button
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-500 disabled:opacity-50 transition-colors mb-3"
                  disabled={busy || !feedback.trim()}
                  onClick={() => submitFeedback(false)}
                >
                  {t.send}
                </button>
                <button className="text-sm text-gray-400 hover:text-gray-700 transition-colors" disabled={busy} onClick={() => submitFeedback(true)}>
                  {t.skip}
                </button>
              </>
            )}

            {step === 'done' && (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2">{t.doneTitle}</h2>
                <p className="text-gray-500 mb-6">{t.doneSub}</p>
                <a href={info.google_review_url} className="text-sm text-gray-400 hover:text-blue-600 underline underline-offset-2 transition-colors">{t.publicToo}</a>
              </>
            )}

            {step === 'already' && <p className="text-gray-600">{t.already}</p>}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            {t.powered} <a href="https://azulwebdev.com" className="font-semibold text-gray-500 hover:text-blue-600 transition-colors">Azul</a>
          </p>
        </div>
      </main>
    </div>
  )
}
