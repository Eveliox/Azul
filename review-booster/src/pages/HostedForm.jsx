import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './hosted-form.css'

// Public lead form at /f/<slug>, for businesses whose own website can't send leads to the agent.
const T = {
  en: { title: 'Request a callback', sub: 'Fill this in and we will call you in a few minutes.', name: 'Your name', phone: 'Mobile number', email: 'Email (optional)', address: 'Service address or zip code', service: 'What do you need?', details: 'Anything else? (optional)', send: 'Request a callback', sending: 'Sending…', privacy: 'Privacy Policy', ok: (n, b) => `Thanks, ${n}! ${b} will call you in the next few minutes.`, later: (n, b) => `Thanks, ${n}! ${b} will call you as soon as we open.`, okNoConsent: 'Thanks! We got your request and will reach out soon.', other: 'Something else', missing: 'This form is not available.', error: 'We could not send that. Please try again, or call us.', lang: 'Español' },
  es: { title: 'Solicite una llamada', sub: 'Complete el formulario y le llamaremos en unos minutos.', name: 'Su nombre', phone: 'Número de celular', email: 'Correo electrónico (opcional)', address: 'Dirección del servicio o código postal', service: '¿Qué necesita?', details: '¿Algo más? (opcional)', send: 'Solicitar una llamada', sending: 'Enviando…', privacy: 'Política de Privacidad', ok: (n, b) => `¡Gracias, ${n}! ${b} le llamará en los próximos minutos.`, later: (n, b) => `¡Gracias, ${n}! ${b} le llamará en cuanto abramos.`, okNoConsent: '¡Gracias! Recibimos su solicitud y le contactaremos pronto.', other: 'Otra cosa', missing: 'Este formulario no está disponible.', error: 'No pudimos enviarlo. Inténtelo de nuevo o llámenos.', lang: 'English' },
}

export default function HostedForm() {
  const { slug } = useParams()
  const [lang, setLang] = useState(() => (navigator.language || '').startsWith('es') ? 'es' : 'en')
  const [info, setInfo] = useState(null)
  const [missing, setMissing] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', email: '', address: '', service: '', details: '', consent: false, website: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const t = T[lang]
  useEffect(() => {
    fetch(`/api/leads/form-info?slug=${encodeURIComponent(slug)}`).then((r) => r.ok ? r.json() : Promise.reject()).then(setInfo).catch(() => setMissing(true))
  }, [slug])
  useEffect(() => { document.documentElement.lang = lang; if (info) document.title = `${info.business} · ${t.title}` }, [lang, info])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const res = await fetch(`/api/leads/form?slug=${encodeURIComponent(slug)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, consent: f.consent ? 'yes' : 'no', language: lang }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.error)
      // Say what will actually happen: a call now, a call when they open, or a reply from the team.
      const first = f.name.trim().split(/\s+/)[0]
      const calling = ['calling', 'dialing', 'owner_ringing'].includes(data.status)
      setDone(f.consent && calling ? t.ok(first, info.business) : f.consent && data.status === 'retry' ? t.later(first, info.business) : t.okNoConsent)
    } catch (e) { setError(e.message || t.error) } finally { setBusy(false) }
  }
  if (missing) return <main className="hosted-form"><div className="hosted-card"><p>{t.missing}</p></div></main>
  if (!info) return <main className="hosted-form" aria-busy="true"><div className="hosted-card"><p>…</p></div></main>
  return <main className="hosted-form">
    <div className="hosted-card">
      <div className="hosted-top"><strong>{info.business}</strong><button type="button" className="hosted-lang" onClick={() => setLang(lang === 'en' ? 'es' : 'en')}>{t.lang}</button></div>
      {done ? <p className="hosted-done" role="status">{done}</p> : <form onSubmit={submit}>
        <h1>{t.title}</h1><p className="hosted-sub">{t.sub}</p>
        <label>{t.name}<input required autoComplete="name" maxLength={120} value={f.name} onChange={set('name')}/></label>
        <label>{t.phone}<input required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={f.phone} onChange={set('phone')}/></label>
        <label>{t.email}<input type="email" autoComplete="email" maxLength={254} value={f.email} onChange={set('email')}/></label>
        <label>{t.address}<input autoComplete="street-address" maxLength={300} value={f.address} onChange={set('address')}/></label>
        {info.services.length > 0 && <label>{t.service}<select value={f.service} onChange={set('service')}><option value=""></option>{info.services.map((s) => <option key={s} value={s}>{s}</option>)}<option value={t.other}>{t.other}</option></select></label>}
        <label>{t.details}<textarea rows={3} maxLength={2000} value={f.details} onChange={set('details')}/></label>
        <input className="hosted-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')}/>
        <label className="hosted-consent"><input type="checkbox" checked={f.consent} onChange={set('consent')}/><span>{info.consent[lang]} <a href={info.privacy_url} target="_blank" rel="noreferrer">{t.privacy}</a></span></label>
        {error && <p className="hosted-error" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? t.sending : t.send}</button>
      </form>}
    </div>
    <p className="hosted-foot">Powered by Azul</p>
  </main>
}
