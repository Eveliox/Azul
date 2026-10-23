import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { BrandLogo } from './BrandLogo'

function PhoneFrame({ children, call = false }) {
  return <div className={`device-phone${call ? ' device-call' : ''}`}>
    <div className="device-screen">
      <div className="device-status" aria-hidden="true"><span>9:41</span><i className="device-island"/><svg viewBox="0 0 52 16"><path d="M1 12h3V9H1zm5 0h3V6H6zm5 0h3V3h-3z" fill="currentColor"/><path d="M19 6q6-6 12 0m-10 3q4-4 8 0m-5 3h2" fill="none" stroke="currentColor" strokeWidth="1.7"/><rect x="36" y="3" width="12" height="9" rx="2" fill="none" stroke="currentColor"/><path d="M49 6v3" stroke="currentColor"/><rect x="38" y="5" width="8" height="5" rx="1" fill="currentColor"/></svg></div>
      {children}<div className="device-home" aria-hidden="true"/>
    </div>
  </div>
}
function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 3 4 4c-3 6 10 19 16 16l1-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z" strokeLinejoin="round"/></svg>
}

export function PhoneSimulation({ kind }) {
  const { c } = useLanguage()
  const t = c.serviceSimulation
  const v = c.serviceVisuals
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const root = useRef(null)
  const call = kind === 'call'
  const steps = call ? t.callSteps : t.reviewSteps
  const playing = !paused && !reduced && visible && tabVisible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 })
    observer.observe(root.current)
    const update = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setStep(s => (s + 1) % 4), step === 3 ? 6500 : 4800)
    return () => clearTimeout(timer)
  }, [playing, step])
  const next = () => { setPaused(true); setStep(s => (s + 1) % 4) }
  return <div className={`phone-simulation ${playing ? 'is-playing' : ''}`} ref={root} role="group" aria-label={`${t.label}: ${call ? v.titles[4] : v.titles[0]}`}>
    <PhoneFrame call={call || step === 0}>
      <div className={`sim-stage sim-${kind} sim-step-${step}`} key={`${kind}-${step}`}>
        {!call && step === 0 && <div className="sim-lock">
          <span className="sim-lock-icon" aria-hidden="true"><svg viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="9" width="12" height="10" rx="3"/><path d="M6 9V6a4 4 0 0 1 8 0v3"/></svg></span><p>{t.date}</p><strong>9:41</strong>
          <button className="sim-notification" onClick={next} aria-label={t.open}><span className="sim-app-icon" aria-hidden="true">•••</span><span><b>{t.messages}<small>{t.now}</small></b><strong>{v.localBusiness}</strong><p>{v.reviewRequest}</p></span></button>
          <span className="sim-lock-hint">{t.open} ↑</span>
        </div>}
        {!call && step === 1 && <><div className="device-contact"><span className="contact-back" aria-hidden="true">‹</span><span className="contact-avatar"><BrandLogo /></span><b>{v.localBusiness}</b><span className="demo-label">{v.messages}</span></div><div className="device-content"><span className="sim-message-time">9:41</span><div className="message-bubble">{v.reviewRequest}</div><button className="sim-review-link" onClick={next}><BrandLogo/><b>{v.reviewTitle}</b><span>{t.reviewOpen} ↗</span></button></div></>}
        {!call && step === 2 && <div className="sim-review-form"><span className="contact-avatar"><BrandLogo /></span><h4>{t.write}</h4><p>{v.localBusiness}</p><div className="sim-stars" aria-hidden="true">★★★★★</div><div className="sim-review-text">{t.sampleReview}</div><button onClick={next} className="sim-submit">{t.post} ↗</button><span className="sim-form-note">{t.sample}</span></div>}
        {!call && step === 3 && <div className="sim-success"><span className="sim-check" aria-hidden="true">✓</span><h4>{t.thanks}</h4><p>{t.sent}</p><div className="sim-receipt"><BrandLogo/><span>{v.localBusiness}</span><span className="sim-stars" aria-hidden="true">★★★★★</span><p>{t.sampleReview}</p></div></div>}
        {call && step < 3 && <><div className="device-call-header"><span className="demo-label">{step === 0 ? t.incoming : v.bilingual}</span><div className="call-avatar"><PhoneIcon /></div><h4>{step === 0 ? v.caller : v.assistant}</h4><span className="call-live">{step > 0 && <i/>}{step === 0 ? t.mobile : v.callStatus}</span></div>
          {step === 0 ? <div className="sim-incoming"><span className="sim-incoming-ring" aria-hidden="true"/><button onClick={next} aria-label={t.answer}><PhoneIcon/></button><span>{t.answer}</span></div> : <><div className="call-wave" aria-hidden="true">{[12,24,38,19,48,60,33,48,26,42,18,10].map((h,i)=><i key={i} style={{'--bar':`${h}px`,'--delay':`${i*.08}s`}}/>)}</div><div className="call-transcript"><span>{v.assistant}</span><p>{v.assistantText}</p>{step === 2 && <div className="sim-caller-reply"><span>{v.caller}</span><p>{v.callerText}</p></div>}{step === 1 && <div className="sim-typing" aria-hidden="true"><i/><i/><i/></div>}</div><div className="device-call-controls" aria-hidden="true"><span>⌨</span><span className="end-call"><PhoneIcon /></span><span>＋</span></div></>}
        </>}
        {call && step === 3 && <div className="sim-success"><span className="sim-check" aria-hidden="true">✓</span><h4>{t.received}</h4><p>{t.handoff}</p><div className="sim-receipt"><span className="sim-receipt-label">{t.captured}</span><strong>{t.summary}</strong><span>{v.caller} · {v.serviceArea}</span><span className="sim-ready"><i/>{t.ready}</span></div></div>}
      </div>
    </PhoneFrame>
    <div className="sim-progress" aria-label={t.label}>{steps.map((label,i)=><button key={i} className={step===i?'is-current':''} aria-label={label} aria-current={step===i?'step':undefined} onClick={()=>{setPaused(true);setStep(i)}}><span/></button>)}</div>
    <div className="sim-caption"><span>{String(step+1).padStart(2,'0')} / 04</span><strong>{steps[step]}</strong></div>
    <div className="sim-controls">{!reduced && <button onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?t.play:t.pause}</button>}<button onClick={next}>{t.next} →</button><button onClick={()=>{setStep(0);setPaused(reduced)}}>{t.replay} ↺</button></div>
    <p className="sim-disclaimer">{call?t.callSample:t.sample}</p>
  </div>
}
