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
    <div className="lead-workflow-toolbar"><span /><button type="button" onClick={() => { if (!playing && stage === 3) setStage(0); setPlaying(!playing) }} disabled={reduced}>{playing ? v.pause : v.play}<span aria-hidden="true">{playing ? 'Ⅱ' : '↻'}</span></button></div>
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
          <div className="lead-scene-top"><span>azul<span className="lead-scene-dot">.</span></span></div>
          {stage === 0 && <div className="lead-scene-form"><span className="lead-scene-icon"><LeadIcon kind={0}/></span><strong>{v.form}</strong><div className="lead-form-lines"><i/><i/><i/></div><div className="lead-scene-confirm"><span>✓</span>{v.flowReceived}</div></div>}
          {stage === 1 && <div className="lead-scene-call"><div className="lead-call-rings"><i/><i/><span><LeadIcon kind={1}/></span></div><strong>{v.flowCalling}</strong><div className="lead-signal">{Array.from({length:25}, (_,i) => <i key={i} style={{'--height':`${10 + (i * 17 % 38)}px`,'--delay':`${i * 0.045}s`}} />)}</div></div>}
          {stage === 2 && <div className="lead-scene-calendar"><strong>{v.flowCalendar}</strong><div className="lead-calendar-cells">{Array.from({length:14},(_,i)=><span key={i} className={i === 9 ? 'is-booked' : ''}>{i === 9 ? '✓' : String(i + 1).padStart(2,'0')}</span>)}</div><div className="lead-scene-confirm"><span>✓</span>{v.confirmation}</div></div>}
          {stage === 3 && <div className="lead-scene-message"><span className="lead-scene-icon"><LeadIcon kind={3}/></span><strong>{v.flowSummary}</strong><div className="lead-summary-lines"><span><i>✓</i>{v.flowQualified}</span><span><i>✓</i>{v.stages[2]}</span><span><i>✓</i>{v.flowConfirmed}</span></div><span className="lead-scene-pill">{v.human}</span></div>}
        </div>
        <div className="lead-console-copy" key={stage}>
          <span className="lead-console-label">{v.stages[stage]}</span>
          <h3>{v.headlines[stage]}</h3>
          <p>{v.details[stage]}</p>
          <div className="lead-console-tags"><span>{v.human}</span></div>
        </div>
      </div>
      <ol className="lead-workflow-steps" aria-label={d.how}>
        {d.steps.map((step, i) => <li key={step.title} className={stage === i ? 'is-active' : stage > i ? 'is-complete' : ''}><button type="button" aria-pressed={stage === i} onClick={() => { setPlaying(false); setStage(i) }}><span className="lead-step-number">{stage > i ? '✓' : `0${i + 1}`}</span><span><strong>{step.title}</strong><span className="lead-step-body">{step.body}</span></span><span className="lead-step-arrow" aria-hidden="true">{stage > i ? '✓' : '↗'}</span></button></li>)}
      </ol>
    </div>
    <div className="lead-workflow-footer"><div className="lead-flow-progress" aria-hidden="true">{[0,1,2,3].map(i => <span key={i} className={stage >= i ? 'is-filled' : ''} />)}</div><span>{v.caption}</span><span aria-hidden="true">{String(stage + 1).padStart(2,'0')} / 04</span></div>
  </div>
}

// The same plane transform gives every tile a consistent isometric perspective.
function WorkflowTile({ x, y, width = 170, height = 65, label, sublabel, primary = false, delay = 0 }) {
  return <g className={`lead-iso-tile ${primary ? 'is-core' : ''}`} style={{ '--tile-delay': `${delay}s` }}>
    <g transform={`translate(${x} ${y}) matrix(.866 -.5 .866 .5 0 0)`}>
      <rect className="lead-iso-edge" y="12" width={width} height={height} rx="5" />
      <rect className="lead-iso-face" width={width} height={height} rx="5" />
      <path className="lead-iso-notch" d={`M12 ${height - 12}h22`} />
      <text className="lead-iso-label" x={width / 2} y={height / 2 - (sublabel ? 3 : -4)} textAnchor="middle">{label}</text>
      {sublabel && <text className="lead-iso-sublabel" x={width / 2} y={height / 2 + 16} textAnchor="middle">{sublabel}</text>}
    </g>
  </g>
}

export function LeadHeroVisual() {
  const { lang } = useLanguage()
  const v = leadVisualCopy[lang]
  const c = lang === 'es' ? {
    title: 'De interés a conversación.', inputs: ['Formulario web', 'Nuevo contacto', 'Solicitud de cita'],
    intake: 'Recibir + organizar', consent: 'Consentimiento · Horario', agent: 'Agente de voz',
    call: 'Iniciar llamada', retry: 'Programar reintento', now: 'En horario', later: 'Fuera de horario',
    foot: 'Cada contacto. Un siguiente paso.', engine: 'El motor de tu próximo cliente',
  } : {
    title: 'From interest to conversation.', inputs: ['Website form', 'New inquiry', 'Booking request'],
    intake: 'Capture + organize', consent: 'Consent · Call timing', agent: 'Voice agent',
    call: 'Start a call', retry: 'Schedule retry', now: 'Within hours', later: 'After hours',
    foot: 'Every lead. A next step.', engine: 'The engine behind your next customer',
  }
  return <div className="lead-engine">
    <div className="lead-engine-title">{c.title}</div>
    <svg className="lead-engine-diagram" viewBox="0 0 640 560" role="img" aria-label={`${c.engine}. ${c.inputs.join(', ')} → ${c.intake} → ${c.consent} → ${c.call} / ${c.retry}.`}>
      <defs>
        <radialGradient id="lead-engine-glow"><stop stopColor="#366bff" stopOpacity=".3"/><stop offset="1" stopColor="#366bff" stopOpacity="0"/></radialGradient>
        <linearGradient id="lead-engine-face" x2="1" y2="1"><stop stopColor="#244a8a"/><stop offset="1" stopColor="#101d34"/></linearGradient>
        <linearGradient id="lead-engine-core" x2="1" y2="1"><stop stopColor="#719dff"/><stop offset=".5" stopColor="#366cf5"/><stop offset="1" stopColor="#1745ed"/></linearGradient>
        <pattern id="lead-engine-grid" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="matrix(.866 -.5 .866 .5 0 0)"><path d="M36 0H0V36" fill="none" stroke="#7fa6ef" strokeOpacity=".09"/></pattern>
      </defs>
      <ellipse cx="355" cy="305" rx="275" ry="240" fill="url(#lead-engine-glow)"/>
      <path d="M12 340 330 155 634 330 316 515Z" fill="url(#lead-engine-grid)"/>
      <g className="lead-engine-wires" fill="none">
        {['M162 331 203 307 Q213 301 224 307 L286 343', 'M162 393 212 364 Q223 358 233 364 L259 379', 'M162 455 242 409 Q252 403 263 409 L286 422', 'M403 250 465 214 Q475 208 475 196 L475 166', 'M440 270 512 229 Q522 223 532 229 L552 241'].map((path, i) => <g key={path}><path d={path}/><path className="lead-engine-signal" d={path} style={{ '--wire-delay': `${i * .65}s` }}/></g>)}
      </g>
      <WorkflowTile x={245} y={421} width={225} height={135} label="" delay={0}/>
      <WorkflowTile x={245} y={393} width={225} height={135} label="" delay={.25}/>
      <WorkflowTile x={245} y={360} width={225} height={135} label="azul" sublabel={c.agent} primary delay={.5}/>
      <WorkflowTile x={245} y={305} width={225} height={135} label={c.intake} sublabel={c.consent} delay={.8}/>
      {c.inputs.map((label, i) => <WorkflowTile key={label} x={20} y={334 + i * 62} width={145} height={44} label={label} delay={1.1 + i * .2}/>)}
      <WorkflowTile x={369} y={155} width={155} height={65} label={c.call} sublabel={c.now} delay={1.9}/>
      <WorkflowTile x={443} y={239} width={155} height={65} label={c.retry} sublabel={c.later} delay={2.2}/>
    </svg>
    <div className="lead-engine-footer"><span className="lead-engine-wave" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--bar': `${8 + (i * 13 % 17)}px`, '--delay': `${i * .09}s` }}/>)}</span><span>{c.foot}</span><span aria-hidden="true">↗</span></div>
  </div>
}
