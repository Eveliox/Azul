import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { productDemo } from '../../data/productDemo'
import { PixelField, WindowBar } from './ServicesVisuals'

const STAGE_MS = 6500

function DemoIcon({ name, ...props }) {
  const paths = {
    website: <><rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M6 6.5h2m2 0h2"/></>,
    phone: <path d="M8 3H4v5c0 6.6 5.4 12 12 12h5v-4l-5-2-2 2-6-6 2-2-2-5Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    calendar: <><rect x="3" y="5" width="18" height="16"/><path d="M7 2v6m10-6v6M3 10h18m-13 5 3 3 5-5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14"/><path d="m3 7 9 6 9-6"/></>,
    transfer: <path d="M4 8h13m-4-4 4 4-4 4M20 16H7m4 4-4-4 4-4"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c4 4.5 4 13.500 0 18-4-4.5-4-13.500 0-18Z"/></>,
    pause: <path d="M9 5v14M15 5v14"/>,
    play: <path d="m8 4 12 8-12 8Z"/>,
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" aria-hidden="true" {...props}>{paths[name]}</svg>
}

// Stage 1: the estimate form on the client's website, filled in and sent.
function CaptureScene({ t }) {
  return <div className="demo-scene demo-scene-capture">
    <div className="demo-site lab-window">
      <div className="demo-site-bar"><span aria-hidden="true"><i/><i/><i/></span><span>{t.siteUrl}</span></div>
      <div className="demo-site-body">
        <strong>{t.formTitle}</strong>
        {t.formFields.map(([label, value], index) => <div className="demo-field" style={{ '--i': index }} key={label}><span>{label}</span><b>{value}</b></div>)}
        <div className="demo-consent" style={{ '--i': t.formFields.length }}><i><DemoIcon name="check" width="11" height="11"/></i>{t.formConsent}</div>
        <div className="demo-send" style={{ '--i': t.formFields.length + 1 }}>{t.formSend}<span>{t.formSent}</span></div>
      </div>
    </div>
    <div className="demo-flow" aria-hidden="true"><span/><b>{t.flowCapture}</b><span/></div>
  </div>
}

// Stage 2: the agent on the phone with the lead.
function CallScene({ t }) {
  return <div className="demo-scene demo-scene-call">
    <div className="demo-call">
      <div className="demo-call-top"><span className="demo-call-dot"/><span>{t.callLive}</span><span className="demo-call-lang">EN / ES</span></div>
      <div className="demo-call-who"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="" width="64" height="32"/><div><strong>Alex Morgan</strong><span>(305) 555-0142 · {t.callAfter}</span></div></div>
      <div className="demo-wave">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i, '--h': `${24 + ((i * 37) % 70)}%` }}/>)}</div>
      <ol className="demo-transcript">{t.transcript.map(([who, line], index) => <li className={who === 'agent' ? 'is-agent' : 'is-lead'} style={{ '--i': index }} key={line}><span>{who === 'agent' ? t.agentLabel : 'Alex'}</span><p>{line}</p></li>)}</ol>
    </div>
  </div>
}

// Stage 3: the visit on the business's calendar, and the owner told.
function BookScene({ t }) {
  return <div className="demo-scene demo-scene-book">
    <div className="demo-calendar lab-window">
      <div className="demo-calendar-bar"><DemoIcon name="calendar" width="15" height="15"/><span>{t.calendarTitle}</span><span>{t.calendarWeek}</span></div>
      <div className="demo-calendar-grid">
        <span/>{t.calendarDays.map((day, index) => <span className={`demo-day${index === 1 ? ' is-target' : ''}`} key={day}>{day}</span>)}
        {['8', '9', '10', '11'].map((hour, row) => [
          <span className="demo-hour" key={hour}>{hour} AM</span>,
          ...t.calendarDays.map((day, col) => {
            const booked = row === 1 && col === 1
            const busy = (row === 0 && col === 0) || (row === 2 && col === 1) || (row === 3 && col === 3) || (row === 1 && col === 4)
            return <span className={`demo-slot${booked ? ' is-booked' : busy ? ' is-busy' : ''}`} key={`${hour}-${day}`}>{booked ? <><b>{t.appointment}</b><em>Alex Morgan</em></> : busy ? t.busy : ''}</span>
          }),
        ])}
      </div>
    </div>
    <div className="demo-notice"><DemoIcon name="mail" width="16" height="16"/><div><strong>{t.ownerNotice}</strong><span>{t.ownerNoticeBody}</span></div></div>
  </div>
}

// An illustrative walkthrough of the lead workspace: no API calls, sign-in, or customer data.
export function ConnectedJourney({ lang }) {
  const t = productDemo[lang] || productDemo.en
  const reduced = useReducedMotion()
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(!reduced)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 })
    observer.observe(root.current)
    const update = () => setPageVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => { if (reduced) setPlaying(false) }, [reduced])
  const running = playing && visible && pageVisible
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => { if (step < 2) setStep(step + 1); else setPlaying(false) }, STAGE_MS)
    return () => clearTimeout(timer)
  }, [running, step])
  const select = index => { setStep(index); setPlaying(false) }
  const toggle = () => { if (!playing && step === 2) setStep(0); setPlaying(!playing) }
  const stage = t.stages[step]
  const playLabel = playing ? t.pause : step === 2 ? t.replay : t.play
  const metrics = ['1', step > 0 ? t.responseValue : '—', step === 2 ? '1' : '0', '0']

  return <div className="product-walkthrough lead-demo" id="product-demo" ref={root}>
    <div className="lead-demo-frame">
      <PixelField/>
      <div className="lab-window lead-demo-window product-demo-shell">
        <WindowBar title={`// AZUL / ${t.windowTitle} //`}/>
        <div className="lead-demo-rail">
          <div className="product-stage-buttons" role="group" aria-label={t.stagesLabel}>
            {t.stages.map((item, index) => <button key={item.label} type="button" onClick={() => select(index)} aria-pressed={step === index} className={index < step ? 'is-done' : ''}>
              <span className="lead-demo-num">0{index + 1}</span><span>{item.label}</span>
              {step === index && <i className={`lead-demo-progress${running ? ' is-running' : ''}`} key={`${step}-${running}`} style={{ '--stage-ms': `${STAGE_MS}ms` }}/>}
            </button>)}
          </div>
          <button type="button" className="product-playback" onClick={toggle} aria-label={playLabel}><DemoIcon name={playing ? 'pause' : 'play'} width="14" height="14"/><span>{playing ? t.pauseShort : step === 2 ? t.replayShort : t.playShort}</span></button>
        </div>

        <div className="lead-demo-metrics">{t.metrics.map((label, index) => <div key={label}><span>{label}</span><strong key={metrics[index]}>{metrics[index]}</strong></div>)}</div>

        <div className="lead-demo-body">
          <div className="lead-demo-stage" key={step} aria-hidden="true">
            {step === 0 && <CaptureScene t={t}/>}
            {step === 1 && <CallScene t={t}/>}
            {step === 2 && <BookScene t={t}/>}
          </div>

          <aside className="product-detail" aria-label={t.contact}>
            <header><span className="demo-avatar">AM</span><div><h3>Alex Morgan</h3><p>{t.service} · Coral Gables</p></div><span className={`product-status stage-${step}`}><i/>{stage.status}</span></header>
            <div className="demo-detail-block" key={step}>
              <span className="lab-micro">{step === 0 ? t.fromForm : t.summary}</span>
              <p>{step === 0 ? t.inquiry : stage.summary}</p>
              {step === 2
                ? <div className="product-appointment"><DemoIcon name="calendar"/><div><strong>{t.appointment}</strong><span>{t.date}</span><small>{t.calendar}</small></div></div>
                : <div className="product-next-step"><DemoIcon name={step === 0 ? 'clock' : 'phone'} width="15" height="15"/><span>{stage.next}</span></div>}
            </div>
            <div className="demo-activity">
              <span className="lab-micro">{t.activity}</span>
              <ol>{t.stages.map((item, index) => <li key={item.event} className={index <= step ? 'is-on' : ''}><i><DemoIcon name={['website', 'phone', 'check'][index]} width="12" height="12"/></i><span>{index === 1 ? t.contacted : item.event}</span><time>{index <= step ? item.time : '—'}</time></li>)}</ol>
            </div>
          </aside>
        </div>

        <div className="lead-demo-foot"><span>↳ {t.demoNote}</span><span>{t.step} {step + 1} {t.of} 3</span></div>
      </div>
    </div>

    <div className="lead-demo-copy" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
      <span className="service-index">0{step + 1}</span>
      <div><h2>{stage.title}</h2><p>{stage.body}</p></div>
    </div>

    <ul className="lead-demo-capabilities" aria-label={t.capabilitiesTitle}>{t.capabilities.map(([title, body], index) => <li key={title}><DemoIcon name={['globe', 'calendar', 'transfer'][index]}/><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul>
  </div>
}
