import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { DotGrid } from '../components/motion/DotGrid'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { SplitText } from '../components/motion/SplitText'
import { useLenis } from '../components/motion/SmoothScroll'
import { bookingUrl } from '../components/site/Layout'
import { Arrow } from '../components/site/UI'
import { getService } from '../data/services'
import { describeFinding, describePass, freeReportCopy } from '../data/freeReport'
import '../free-report.css'

// Free local growth report. The API (api/free-report/) does the lookups;
// the score and top three gaps are free, the full report needs an email.

async function post(path, body) {
  let res
  try {
    res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  } catch { throw new Error('network') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'network')
  return data
}

function ScoreRing({ score, label }) {
  const circumference = 2 * Math.PI * 52
  const tone = score >= 80 ? 'good' : score >= 50 ? 'fair' : 'poor'
  return (
    <div className={`fr-score is-${tone}`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" className="fr-score-track" />
        <circle cx="60" cy="60" r="52" className="fr-score-value" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} />
      </svg>
      <div><b>{score}</b><span>/100</span></div>
      <p>{label}</p>
    </div>
  )
}

function Finding({ finding }) {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang]
  const { title, body } = describeFinding(finding, lang)
  const service = getService(finding.service, lang)
  return (
    <li className={`fr-finding is-${finding.severity}`}>
      <span className="fr-severity">{t.severity[finding.severity]}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      {service && <Link className="fr-service-tag" to={`/services/${finding.service}`}>{service.title}<Arrow /></Link>}
    </li>
  )
}

function ScanForm({ onSubmit, error }) {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang]
  return (
    <form className="fr-form" onSubmit={onSubmit} noValidate>
      <label>{t.form.business}<input name="business" autoComplete="organization" required maxLength={120} /></label>
      <label>{t.form.city}<input name="city" autoComplete="address-level2" placeholder={t.form.cityPlaceholder} required maxLength={80} /></label>
      <label>{t.form.trade}
        <select name="trade" defaultValue="roofing">{Object.entries(t.trades).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </label>
      <label>{t.form.website}<input name="website" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" maxLength={300} /><small>{t.form.websiteHint}</small></label>
      <label className="fr-honeypot" aria-hidden="true">{t.form.honeypot}<input name="hp" tabIndex={-1} autoComplete="off" /></label>
      <button className="button">{t.form.submit}<Arrow /></button>
      {error && <p className="fr-error" role="alert">{error}</p>}
    </form>
  )
}

function Scanning() {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang].scanning
  const [step, setStep] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setStep(s => Math.min(s + 1, t.steps.length - 1)), 6500)
    return () => clearInterval(timer)
  }, [t.steps.length])
  return (
    <div className="fr-panel fr-scanning" role="status" aria-live="polite">
      <h2>{t.title}</h2>
      <ol>{t.steps.map((label, i) => <li key={label} className={i < step ? 'is-done' : i === step ? 'is-active' : ''}><span aria-hidden="true" />{label}</li>)}</ol>
      <p>{t.note}</p>
    </div>
  )
}

function Preview({ preview, onUnlock, busy, error }) {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang]
  const more = preview.total - preview.top.length
  return (
    <div className="fr-preview">
      <div className="fr-preview-head">
        <ScoreRing score={preview.score} label={t.scoreLabel(preview.score)} />
        <div>
          <SectionEyebrow>{t.preview.eyebrow}</SectionEyebrow>
          <h2>{preview.business}</h2>
          <p>{preview.total ? t.preview.found(preview.total) : t.preview.none}</p>
        </div>
      </div>
      {preview.top.length > 0 && <>
        <h3 className="fr-subhead">{t.preview.top}</h3>
        <ol className="fr-findings">{preview.top.map(f => <Finding key={f.id} finding={f} />)}</ol>
        {more > 0 && <p className="fr-more">{t.preview.more(more)}</p>}
      </>}
      <form className="fr-panel fr-gate" onSubmit={onUnlock} noValidate>
        <h3>{t.preview.gateTitle}</h3>
        <p>{t.preview.gateBody}</p>
        <label>{t.preview.name}<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>{t.preview.email}<input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
        <label>{t.preview.phone}<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
        <label className="checkbox"><input type="checkbox" name="consent" required />{t.preview.consent}</label>
        <button className="button" disabled={busy}>{busy ? t.preview.unlocking : t.preview.unlock}<Arrow /></button>
        {error && <p className="fr-error" role="alert">{error}</p>}
      </form>
    </div>
  )
}

function Report({ report, onRestart }) {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang]
  const r = t.report
  const date = new Date(report.checkedAt).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const priced = price => /^\$/.test(price || '') ? `${r.from} ${price}${r.month}` : price || r.soon
  return (
    <div className="fr-report">
      <div className="fr-preview-head">
        <ScoreRing score={report.score} label={t.scoreLabel(report.score)} />
        <div>
          <SectionEyebrow>{r.eyebrow}</SectionEyebrow>
          <p className="fr-for">{r.for}</p>
          <h2>{report.business}</h2>
          {report.google?.address && <p>{report.google.address}</p>}
        </div>
      </div>

      {report.google && report.competitors.length > 0 && (
        <section className="fr-block" aria-labelledby="fr-compare">
          <h3 id="fr-compare" className="fr-subhead">{r.compare}</h3>
          <p className="fr-note">{r.compareNote}</p>
          <div className="fr-table-wrap">
            <table className="fr-table">
              <thead><tr><th scope="col"><span className="sr-only">{r.you}</span></th><th scope="col">{r.reviews}</th><th scope="col">{r.rating}</th></tr></thead>
              <tbody>
                <tr className="is-you"><th scope="row">{r.you} · {report.google.name}</th><td>{report.google.reviews.toLocaleString(lang)}</td><td>{report.google.rating ? `${report.google.rating}★` : '—'}</td></tr>
                {report.competitors.map(c => <tr key={c.name}><th scope="row">{c.name}</th><td>{c.reviews.toLocaleString(lang)}</td><td>{c.rating ? `${c.rating}★` : '—'}</td></tr>)}
                <tr className="is-avg"><th scope="row">{r.avg}</th><td>{report.averages.reviews.toLocaleString(lang)}</td><td>{report.averages.rating ? `${report.averages.rating}★` : '—'}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {report.speed && (
        <section className="fr-block" aria-labelledby="fr-website">
          <h3 id="fr-website" className="fr-subhead">{r.websiteTitle}</h3>
          <dl className="fr-stats">
            <div><dt>{r.speedScore}</dt><dd>{report.speed.performance}<small>/100</small></dd></div>
            {report.speed.lcpSeconds && <div><dt>{r.loadTime}</dt><dd>{r.seconds(report.speed.lcpSeconds)}</dd><p>{r.target}</p></div>}
            <div><dt>{r.seoScore}</dt><dd>{report.speed.seo}<small>/100</small></dd></div>
          </dl>
        </section>
      )}

      {(!report.checked.google || !report.checked.website) && (
        <ul className="fr-unchecked">
          {!report.checked.google && <li>{r.notChecked.google}</li>}
          {!report.checked.website && report.website && <li>{r.notChecked.website}</li>}
        </ul>
      )}

      {report.findings.length > 0 && (
        <section className="fr-block" aria-labelledby="fr-gaps">
          <h3 id="fr-gaps" className="fr-subhead">{r.gaps}</h3>
          <ol className="fr-findings">{report.findings.map(f => <Finding key={f.id} finding={f} />)}</ol>
        </section>
      )}

      {report.passes.length > 0 && (
        <section className="fr-block" aria-labelledby="fr-working">
          <h3 id="fr-working" className="fr-subhead">{r.working}</h3>
          <ul className="fr-passes">{report.passes.map(p => <li key={p.id}><span aria-hidden="true">✓</span>{describePass(p, lang)}</li>)}</ul>
        </section>
      )}

      {report.services.length > 0 && (
        <section className="fr-block" aria-labelledby="fr-help">
          <h3 id="fr-help" className="fr-subhead">{r.help}</h3>
          <p className="fr-note">{r.helpBody}</p>
          <ul className="fr-services">
            {report.services.map(slug => {
              const service = getService(slug, lang)
              if (!service) return null
              const count = report.findings.filter(f => f.service === slug).length
              return (
                <li key={slug}>
                  <span>{r.fixes(count)}</span>
                  <h4>{service.title}</h4>
                  <p>{priced(service.price)}</p>
                  <Link className="text-link" to={`/services/${slug}`}>{r.learn}<Arrow /></Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="fr-cta">
        <div><h3>{r.ctaTitle}</h3><p>{r.ctaBody}</p></div>
        <div className="fr-cta-actions">
          <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{r.cta}<Arrow /></a>
          <button type="button" className="text-link" onClick={onRestart}>{r.again}<Arrow /></button>
        </div>
      </div>
      <p className="fr-sources">{r.sources(date)}</p>
    </div>
  )
}

export default function FreeReport() {
  const { lang } = useLanguage()
  const t = freeReportCopy[lang]
  const lenis = useLenis()
  const stage = useRef(null)
  const [status, setStatus] = useState('idle') // idle | scanning | unlocking
  const [scan, setScan] = useState(null) // { preview, token }
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const errorText = key => t.errors[key] || t.errors.network
  const scanning = status === 'scanning'

  // Bring each new stage (scanning, preview, full report) into view.
  useEffect(() => {
    if (!scan && !report && !scanning) return
    const el = stage.current
    if (lenis?.current) lenis.current.scrollTo(el, { offset: -100 })
    else el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [scan, report, scanning, lenis])

  async function runScan(e) {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    if (!form.business.trim()) return setError(errorText('business'))
    if (!form.city.trim()) return setError(errorText('city'))
    setError(''); setStatus('scanning')
    try {
      setScan(await post('/api/free-report/scan', form))
    } catch (err) { setError(errorText(err.message)) }
    setStatus('idle')
  }

  async function unlock(e) {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    if (!form.consent) return setError(errorText('consent'))
    setError(''); setStatus('unlocking')
    try {
      const data = await post('/api/free-report/unlock', { ...form, consent: true, token: scan.token, language: lang })
      setReport(data.report)
    } catch (err) {
      if (err.message === 'expired') setScan(null)
      setError(errorText(err.message))
    }
    setStatus('idle')
  }

  function restart() { setScan(null); setReport(null); setError('') }

  const notConfigured = error === t.errors.not_configured
  return (
    <section className="section free-report">
      <DotGrid />
      <div className="fr-intro">
        <div>
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <SplitText as="h1">{t.title}</SplitText>
          <p>{t.intro}</p>
          <ul className="fr-checks">{t.checks.map(check => <li key={check}><span aria-hidden="true">+</span>{check}</li>)}</ul>
        </div>
        {!scan && !report && !scanning && (
          <div className="fr-panel">
            <ScanForm onSubmit={runScan} error={notConfigured ? '' : error} />
            {notConfigured && <div className="fr-error" role="alert"><p>{error}</p><a className="text-link" href={bookingUrl} target="_blank" rel="noreferrer">{t.report.cta}<Arrow /></a></div>}
          </div>
        )}
      </div>
      <div className="fr-stage" ref={stage}>
        {scanning && <Scanning />}
        {scan && !report && <Preview preview={scan.preview} onUnlock={unlock} busy={status === 'unlocking'} error={error} />}
        {report && <Report report={report} onRestart={restart} />}
      </div>
    </section>
  )
}
