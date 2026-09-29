import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { SubmissionUnavailableError, submitJobPosting } from '../../lib/submitJobPosting'
import { SectionEyebrow } from '../motion/Eyebrow'
import { MagneticButton } from '../motion/MagneticButton'
import { useScrollLock } from '../motion/SmoothScroll'
import { Arrow } from '../site/UI'
import { bookingUrl } from '../site/Layout'
import { FileDropzone } from './FileDropzone'

const DrawerContext = createContext(() => {})
const SOURCES = ['file', 'text', 'link']
const CLOSE_MS = 450
const STEP_MS = 1300
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

/** Mount once (in Layout). Any "Upload a job posting" button below it opens the drawer. */
export function JobPostingProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openDrawer = useCallback(() => setOpen(true), [])
  return (
    <DrawerContext.Provider value={openDrawer}>
      {children}
      {open && <JobPostingDrawer onClose={() => setOpen(false)} />}
    </DrawerContext.Provider>
  )
}

export const useJobPostingDrawer = () => useContext(DrawerContext)

export function JobPostingButton({ className = 'button', children, ...props }) {
  const { c } = useLanguage()
  const open = useJobPostingDrawer()
  return <MagneticButton type="button" className={className} aria-haspopup="dialog" onClick={open} {...props}>{children ?? c.agents.uploadCta}<Arrow /></MagneticButton>
}

function isHttpUrl(value) {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

function Progress({ phase, step, onClose, onRetry }) {
  const { c } = useLanguage()
  const t = c.agents.drawer
  if (phase === 'error' || phase === 'unavailable') {
    return (
      <div className="drawer-progress">
        <p className="drawer-message" role="alert">{phase === 'error' ? t.errors.generic : t.errors.unavailable}</p>
        <div className="drawer-actions">
          <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{t.book}<Arrow /></a>
          {phase === 'error' && <button type="button" className="text-link" onClick={onRetry}>{t.submit}<Arrow /></button>}
        </div>
      </div>
    )
  }
  const done = phase === 'done'
  return (
    <div className="drawer-progress">
      <ol className="drawer-steps" aria-live="polite">
        {t.steps.slice(0, 2).map((label, i) => (
          <li key={i} className={done || step > i ? 'is-done' : step === i ? 'is-active' : ''} hidden={step < i && !done}>
            <span className="drawer-step-icon" aria-hidden="true" />{label}
          </li>
        ))}
      </ol>
      {done && (
        <div className="drawer-done" role="status">
          <svg className="drawer-check" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" pathLength="100" /><path d="M15 27l7 7 15-16" pathLength="100" /></svg>
          <p className="drawer-done-line">{t.steps[2]}</p>
          <h3>{t.doneTitle}</h3>
          <p>{t.doneBody}</p>
          <button type="button" className="button" onClick={onClose}>{t.close}<Arrow /></button>
        </div>
      )}
    </div>
  )
}

/** Right-side drawer: a native <dialog>, so focus is trapped and Escape closes it. */
export function JobPostingDrawer({ onClose }) {
  const { c, lang } = useLanguage()
  const t = c.agents.drawer
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const alive = useRef(true)
  const titleId = useId()
  const tabsId = useId()
  const [closing, setClosing] = useState(false)
  const [tab, setTab] = useState(0)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [linkError, setLinkError] = useState(false)
  const [phase, setPhase] = useState('form')
  const [step, setStep] = useState(0)
  useScrollLock(true)

  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current
    dialog.showModal()
    return () => { alive.current = false; dialog.close(); previous?.focus() }
  }, [])

  const requestClose = useCallback(() => {
    if (closing) return
    if (reduced) { onClose(); return }
    setClosing(true)
    setTimeout(onClose, CLOSE_MS)
  }, [closing, reduced, onClose])

  function selectTab(i) {
    setTab(i)
    requestAnimationFrame(() => document.getElementById(`${tabsId}-tab-${i}`)?.focus())
  }
  function onTabKey(e) {
    const moves = { ArrowRight: 1, ArrowLeft: -1, Home: -tab, End: SOURCES.length - 1 - tab }
    if (!(e.key in moves)) return
    e.preventDefault()
    selectTab((tab + moves[e.key] + SOURCES.length) % SOURCES.length)
  }

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const source = SOURCES[tab]
    const fields = Object.fromEntries(new FormData(form))
    if (source === 'file' && !file) {
      setFileError('file')
      form.querySelector('input[type=file]')?.focus()
      return
    }
    if (source === 'link' && !isHttpUrl(fields.link)) {
      setLinkError(true)
      form.elements.link?.focus()
      return
    }
    const data = {
      name: fields.name, business: fields.business, email: fields.email, phone: fields.phone,
      trade: fields.trade, language: fields.language, notes: fields.notes, consent: true,
      source, file: source === 'file' ? file : undefined,
      text: source === 'text' ? fields.text : undefined,
      link: source === 'link' ? fields.link : undefined,
      pageLanguage: lang,
    }
    const pace = reduced ? 0 : STEP_MS
    setPhase('sending'); setStep(0)
    const next = setTimeout(() => { if (alive.current) setStep(1) }, pace)
    try {
      await Promise.all([submitJobPosting(data), wait(pace * 2)])
      if (alive.current) { setStep(2); setPhase('done') }
    } catch (error) {
      clearTimeout(next)
      if (alive.current) setPhase(error instanceof SubmissionUnavailableError ? 'unavailable' : 'error')
    }
  }

  const fileMessage = fileError && t.errors[fileError]
  return (
    <dialog
      ref={ref}
      className={`drawer ${closing ? 'is-closing' : ''}`.trim()}
      aria-labelledby={titleId}
      data-lenis-prevent
      onCancel={e => { e.preventDefault(); requestClose() }}
      onClick={e => { if (e.target === e.currentTarget && e.clientX < e.currentTarget.getBoundingClientRect().left) requestClose() }}
      // A file dropped outside the drop zone would otherwise open in the tab.
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
    >
      <div className="drawer-inner">
        <button type="button" className="modal-close" onClick={requestClose} aria-label={t.close}>×</button>
        <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
        <h2 id={titleId}>{t.title}</h2>
        {phase === 'form' && <p className="drawer-intro">{t.body}</p>}

        <form className="drawer-form" onSubmit={submit} hidden={phase !== 'form'}>
          <div className="drawer-tabs" role="tablist" aria-label={t.tabsLabel}>
            {t.tabs.map((label, i) => (
              <button
                key={label} type="button" role="tab" id={`${tabsId}-tab-${i}`}
                aria-selected={tab === i} aria-controls={`${tabsId}-panel`} tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)} onKeyDown={onTabKey}
              >{label}</button>
            ))}
          </div>
          <div className="drawer-panel" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-tab-${tab}`}>
            {tab === 0 && <FileDropzone file={file} onChange={setFile} error={fileMessage} onError={setFileError} />}
            {tab === 1 && <label>{t.textLabel}<textarea name="text" rows={6} required minLength={20} placeholder={t.textPlaceholder} /></label>}
            {tab === 2 && <>
              <label>{t.linkLabel}<input name="link" type="url" inputMode="url" required placeholder={t.linkPlaceholder} aria-invalid={linkError || undefined} onChange={() => setLinkError(false)} /></label>
              {linkError && <p className="field-error" role="alert">{t.errors.link}</p>}
            </>}
          </div>

          <div className="drawer-fields">
            <label>{t.fields.name}<input name="name" autoComplete="name" required /></label>
            <label>{t.fields.business}<input name="business" autoComplete="organization" required /></label>
            <label>{t.fields.email}<input name="email" type="email" autoComplete="email" required /></label>
            <label>{t.fields.phone}<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label>{t.fields.trade}
              <select name="trade" required defaultValue="">
                <option value="" disabled>{t.tradePlaceholder}</option>
                {t.trades.map(trade => <option key={trade.value} value={trade.value}>{trade.label}</option>)}
              </select>
            </label>
            <label>{t.fields.language}
              <select name="language" defaultValue={lang}>
                {t.languages.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="drawer-wide">{t.fields.notes} <small>({t.optional})</small><textarea name="notes" rows={3} /></label>
          </div>
          <label className="checkbox"><input type="checkbox" name="consent" required />{t.consent}</label>
          <button className="button drawer-submit">{t.submit}<Arrow /></button>
        </form>

        {phase !== 'form' && <Progress phase={phase} step={step} onClose={requestClose} onRetry={() => setPhase('form')} />}
      </div>
    </dialog>
  )
}
