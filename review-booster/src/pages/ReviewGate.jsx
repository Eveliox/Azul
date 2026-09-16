import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api.js'

const T = {
  en: {
    title: (b) => `How was your experience with ${b}?`,
    sub: 'Tap a star — it takes 5 seconds.',
    thanks5: 'Thank you! One more step:',
    cta5: 'Leave us a Google review →',
    redirecting: 'Taking you to Google…',
    lowTitle: 'Thank you for your honesty.',
    lowSub: (b) => `This goes privately to the ${b} team so they can make it right. What could have been better?`,
    placeholder: 'Tell us what happened…',
    send: 'Send feedback',
    skip: 'Skip',
    done: 'Received — thank you. Someone from the team will reach out.',
    already: 'You already left your feedback. Thank you!',
    notFound: 'This link is invalid or has expired.',
    stars: ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'],
  },
  es: {
    title: (b) => `¿Cómo fue su experiencia con ${b}?`,
    sub: 'Toque una estrella — solo toma 5 segundos.',
    thanks5: '¡Gracias! Un paso más:',
    cta5: 'Déjenos una reseña en Google →',
    redirecting: 'Llevándolo a Google…',
    lowTitle: 'Gracias por su honestidad.',
    lowSub: (b) => `Esto llega de forma privada al equipo de ${b} para poder mejorar. ¿Qué pudo haber sido mejor?`,
    placeholder: 'Cuéntenos qué pasó…',
    send: 'Enviar comentario',
    skip: 'Omitir',
    done: 'Recibido — gracias. Alguien del equipo se comunicará con usted.',
    already: 'Ya dejó su comentario. ¡Gracias!',
    notFound: 'Este enlace no es válido o ha expirado.',
    stars: ['Terrible', 'Malo', 'Regular', 'Bueno', 'Excelente'],
  },
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

  async function pick(n) {
    if (busy) return
    setRating(n)
    setBusy(true)
    try {
      const d = await api(`/api/review/${token}`, { method: 'POST', admin: false, body: { rating: n } })
      if (n === 5) {
        setStep('five')
        setTimeout(() => { window.location.href = d.redirect || info.google_review_url }, 1200)
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-ink-950 to-ink-900">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="text-xs text-ink-300 hover:text-white px-2 py-1 rounded bg-ink-800"
          >
            {lang === 'en' ? 'Español' : 'English'}
          </button>
        </div>

        <div className="card text-center">
          {err && <p className="text-red-400">{t.notFound}</p>}
          {!err && !info && <p className="text-ink-300">…</p>}

          {info && step === 'rate' && (
            <>
              <h1 className="text-2xl font-semibold mb-2">{t.title(info.business)}</h1>
              <p className="text-ink-300 mb-8">{t.sub}</p>
              <div className="flex justify-center gap-2 mb-3" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    aria-label={`${n} stars`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => pick(n)}
                    className={`text-5xl transition-transform hover:scale-110 ${
                      n <= (hover || rating) ? 'text-yellow-400' : 'text-ink-600'
                    }`}
                  >★</button>
                ))}
              </div>
              <p className="h-5 text-sm text-ink-400">{hover ? t.stars[hover - 1] : ''}</p>
            </>
          )}

          {step === 'five' && (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-semibold mb-4">{t.thanks5}</h2>
              <a href={info.google_review_url} className="btn-primary w-full text-base py-3">{t.cta5}</a>
              <p className="text-xs text-ink-400 mt-4">{t.redirecting}</p>
            </>
          )}

          {step === 'low' && (
            <>
              <h2 className="text-xl font-semibold mb-2">{t.lowTitle}</h2>
              <p className="text-ink-300 mb-5 text-sm">{t.lowSub(info.business)}</p>
              <textarea
                className="input min-h-[120px] mb-3"
                placeholder={t.placeholder}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button className="btn-primary w-full mb-2" disabled={busy} onClick={() => submitFeedback(false)}>
                {t.send}
              </button>
              <button className="text-xs text-ink-400 hover:text-ink-200" disabled={busy} onClick={() => submitFeedback(true)}>
                {t.skip}
              </button>
            </>
          )}

          {step === 'done' && <p className="text-ink-200">{t.done}</p>}
          {step === 'already' && <p className="text-ink-200">{t.already}</p>}
        </div>

        <p className="text-center text-[11px] text-ink-500 mt-6">Powered by Azul</p>
      </div>
    </div>
  )
}
