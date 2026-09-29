import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useScrollLock } from '../motion/SmoothScroll'
export function Arrow({ diagonal = false }) { return <span aria-hidden="true">{diagonal ? '↗' : '↗'}</span> }
export function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3-1 4C10 23 1 14 3 4Z" /></svg> }
export function Modal({ title, onClose, children }) {
  const { c } = useLanguage()
  const ref = useRef(null)
  const id = useId()
  useScrollLock(true)
  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current
    dialog.showModal()
    return () => { dialog.close(); previous?.focus() }
  }, [])
  return <dialog className="modal" ref={ref} aria-labelledby={id} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose() } }} data-lenis-prevent><button className="modal-close" onClick={onClose} aria-label={c.close}>×</button><h2 id={id}>{title}</h2>{children}</dialog>
}
export function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null)
  const id = useId()
  return <div className="faq">{items.map((item, i) => <div key={i}><h3><button aria-expanded={open === i} aria-controls={`${id}-${i}`} onClick={() => setOpen(open === i ? null : i)}>{item.question}<span aria-hidden="true">{open === i ? '−' : '+'}</span></button></h3><div id={`${id}-${i}`} hidden={open !== i}><p>{item.answer}</p></div></div>)}</div>
}
export function FilterChips({ options, value, onChange, label }) { return <div className="filter-chips" role="group" aria-label={label}>{options.map(option => <button key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div> }
export function DownloadModal({ guide, onClose }) {
  const { c, lang } = useLanguage()
  const [status, setStatus] = useState('')
  // Endpoint must collect consent and return an authorized { downloadUrl }.
  const endpoint = import.meta.env.VITE_GUIDE_ENDPOINT
  async function submit(e) {
    e.preventDefault()
    if (!endpoint) return
    setStatus('sending')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(e.currentTarget)), guide: guide.id, language: lang }) })
      if (!response.ok) throw new Error()
      const data = await response.json()
      const url = new URL(data.downloadUrl, window.location.origin)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
      window.location.assign(url.href)
      setStatus('')
    } catch { setStatus('error') }
  }
  return <Modal title={guide.title} onClose={onClose}><p>{guide.description}</p>{!endpoint && <p className="notice">{c.form.unavailable}</p>}<form onSubmit={submit}><label>{c.form.name}<input name="name" autoComplete="name" required /></label><label>{c.form.email}<input type="email" name="email" autoComplete="email" required /></label><label className="checkbox"><input type="checkbox" name="consent" required />{c.form.consent}</label><button className="button" disabled={!endpoint || status === 'sending'}>{status === 'sending' ? c.form.sending : c.form.submit}<Arrow /></button><p role="status">{status === 'error' ? c.form.error : ''}</p></form></Modal>
}
export function Newsletter() {
  const { c, lang } = useLanguage()
  const [status, setStatus] = useState('')
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
  async function submit(e) {
    e.preventDefault()
    if (!endpoint) return
    const form = e.currentTarget
    setStatus('sending')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), language: lang }) })
      if (!response.ok) throw new Error()
      setStatus('success'); form.reset()
    } catch { setStatus('error') }
  }
  return <form className="newsletter" onSubmit={submit}><h3>{c.footer.newsletter}</h3><p>{c.footer.newsletterBody}</p><label>{c.form.email}<input name="email" type="email" required autoComplete="email" /></label><label className="checkbox"><input name="consent" type="checkbox" required />{c.form.newsletterConsent}</label><button className="text-link" disabled={!endpoint || status === 'sending'}>{c.form.signup}<Arrow /></button><p className="form-status" role="status">{!endpoint ? c.form.newsletterUnavailable : status ? c.form[status] : ''}</p></form>
}
