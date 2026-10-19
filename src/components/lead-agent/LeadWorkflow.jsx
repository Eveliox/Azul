import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { leadAgentCopy, leadVisualCopy } from '../../data/leadAgent'

export function LeadIcon({ kind = 0 }) {
  const paths = [
    <><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h4m-2 5h2"/></>,
    <path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3-1 4C10 23 1 14 3 4Z"/>,
    <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5 3 3 5-5"/></>,
    <><path d="M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z"/><path d="m7 11 3 3 6-6"/></>,
  ]
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>
}

export function LeadWorkflow() {
  const { lang } = useLanguage()
  const v = leadVisualCopy[lang]
  const d = leadAgentCopy[lang]
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(() => !reduced)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (reduced) setPlaying(false) }, [reduced])
  useEffect(() => {
    if (!playing || !visible || reduced) return
    const timer = setTimeout(() => {
      if (stage === 3) setPlaying(false)
      else setStage(stage + 1)
    }, 4000)
    return () => clearTimeout(timer)
  }, [playing, stage, visible, reduced])
  return <div className={`lead-workflow ${playing && visible ? 'is-playing' : ''}`} ref={ref}>
    <div className="lead-workflow-toolbar"><span><i />{v.example}</span><button type="button" onClick={() => { if (!playing && stage === 3) setStage(0); setPlaying(!playing) }} disabled={reduced}>{playing ? v.pause : v.play}<span aria-hidden="true">{playing ? 'Ⅱ' : '↻'}</span></button></div>
    <div className="lead-flow-track" aria-hidden="true">
      {v.stages.map((label, i) => <div key={label} className={`lead-flow-stop ${i === stage ? 'is-current' : i < stage ? 'is-done' : ''}`}>
        <div className="lead-flow-node"><LeadIcon kind={i}/>{i < stage && <b>✓</b>}</div>
        <span>{label}</span>
        {i < 3 && <div className="lead-flow-connection"><i/><em/></div>}
      </div>)}
    </div>
    <div className="lead-workflow-grid">
      <div className="lead-console">
        <div className={`lead-scene scene-${stage}`} key={`scene-${stage}`} aria-hidden="true">
          <div className="lead-scene-top"><span>azul<span className="lead-scene-dot">.</span></span><span>{v.example}</span></div>
          {stage === 0 && <div className="lead-scene-form"><span className="lead-scene-icon"><LeadIcon kind={0}/></span><strong>{v.form}</strong><div className="lead-form-lines"><i/><i/><i/></div><div className="lead-scene-confirm"><span>✓</span>{v.flowReceived}</div></div>}
          {stage === 1 && <div className="lead-scene-call"><div className="lead-call-rings"><i/><i/><span><LeadIcon kind={1}/></span></div><strong>{v.flowCalling}</strong><div className="lead-signal">{Array.from({length:25}, (_,i) => <i key={i} style={{'--height':`${10 + (i * 17 % 38)}px`,'--delay':`${i * 0.045}s`}} />)}</div><span className="lead-scene-pill">{v.bilingual}</span></div>}
          {stage === 2 && <div className="lead-scene-calendar"><strong>{v.flowCalendar}</strong><div className="lead-calendar-cells">{Array.from({length:14},(_,i)=><span key={i} className={i === 9 ? 'is-booked' : ''}>{i === 9 ? '✓' : String(i + 1).padStart(2,'0')}</span>)}</div><div className="lead-scene-confirm"><span>✓</span>{v.confirmation}</div></div>}
          {stage === 3 && <div className="lead-scene-message"><span className="lead-scene-icon"><LeadIcon kind={3}/></span><strong>{v.flowSummary}</strong><div className="lead-summary-lines"><span><i>✓</i>{v.flowQualified}</span><span><i>✓</i>{v.stages[2]}</span><span><i>✓</i>{v.flowConfirmed}</span></div><span className="lead-scene-pill">{v.human}</span></div>}
        </div>
        <div className="lead-console-copy" key={stage}>
          <span className="lead-console-label">{v.stages[stage]}</span>
          <h3>{v.headlines[stage]}</h3>
          <p>{v.details[stage]}</p>
          <div className="lead-console-tags"><span>{v.bilingual}</span><span>{v.human}</span></div>
        </div>
      </div>
      <ol className="lead-workflow-steps" aria-label={d.how}>
        {d.steps.map((step, i) => <li key={step.title} className={stage === i ? 'is-active' : stage > i ? 'is-complete' : ''}><button type="button" aria-pressed={stage === i} onClick={() => { setPlaying(false); setStage(i) }}><span className="lead-step-number">{stage > i ? '✓' : `0${i + 1}`}</span><span><strong>{step.title}</strong><span className="lead-step-body">{step.body}</span></span><span className="lead-step-arrow" aria-hidden="true">{stage > i ? '✓' : '↗'}</span></button></li>)}
      </ol>
    </div>
    <div className="lead-workflow-footer"><div className="lead-flow-progress" aria-hidden="true">{[0,1,2,3].map(i => <span key={i} className={stage >= i ? 'is-filled' : ''} />)}</div><span>{v.caption}</span><span aria-hidden="true">{String(stage + 1).padStart(2,'0')} / 04</span></div>
  </div>
}

export function LeadHeroVisual() {
  const { lang } = useLanguage()
  const v = leadVisualCopy[lang]
  return <div className="lead-hero-art" aria-hidden="true">
    <div className="lead-art-grid"/><div className="lead-art-halo"/>
    <span className="lead-art-kicker">{v.example}</span>
    <div className="lead-art-center"><span>azul</span><div className="lead-art-wave">{[18,32,52,36,68,44,26,58,38,20,12].map((h,i)=><i key={i} style={{height:h}}/>)}</div><span>{v.bilingual}</span></div>
    <div className="lead-art-card card-input"><LeadIcon kind={0}/><span>{v.stages[0]}<small>{v.form}</small></span><i /></div>
    <div className="lead-art-card card-output"><LeadIcon kind={2}/><span>{v.stages[2]}<small>{v.confirmation}</small></span><span className="lead-art-check">✓</span></div>
    <svg className="lead-art-wires" viewBox="0 0 500 500" preserveAspectRatio="none"><path d="M60 100H250V250M250 250V400H440"/><circle cx="250" cy="250" r="170"/></svg>
    <span className="lead-art-foot">{v.caption}</span>
  </div>
}
