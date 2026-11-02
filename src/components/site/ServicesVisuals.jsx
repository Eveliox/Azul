import { useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

export function SystemIcon({ type = 0 }) {
  const paths = [
    <><rect x="3" y="4" width="18" height="16" /><path d="M3 9h18M6 6.5h2m2 0h2M7 13h10M7 16h6" /></>,
    <><path d="M8 3H4v5c0 6.6 5.4 12 12 12h5v-4l-5-2-2 2-6-6 2-2-2-5Z" /><path d="M15 3a6 6 0 0 1 6 6m-6-2a2 2 0 0 1 2 2" /></>,
    <path d="m12 3 3 6 6 1-4.5 4.5L18 21l-6-3-6 3 1.5-6.5L3 10l6-1 3-6Z" />,
    <><rect x="3" y="5" width="18" height="16" /><path d="M7 2v6m10-6v6M3 10h18m-13 5 3 3 5-5" /></>,
  ]
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" aria-hidden="true">{paths[type]}</svg>
}
export function PixelArrow() {
  return <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 1h3v3H4zm3 3h3v3H7zm3 3h3v3h-3zm-3 3h3v3H7zm-3 3h3v3H4z" /></svg>
}
export function WindowBar({ title, blue = false }) {
  return <div className={`lab-window-bar${blue ? ' is-blue' : ''}`}><span className="lab-window-controls" aria-hidden="true"><i>×</i><i>−</i><i>□</i></span><span>{title}</span><span className="lab-window-light" aria-hidden="true" /></div>
}
export function PixelField() {
  const id = useId().replace(/:/g, '')
  return <svg className="lab-pixels" aria-hidden="true" width="100%" height="100%"><defs><pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">{Array.from({length:64},(_,i)=><rect key={i} x={(i%8)*8} y={Math.floor(i/8)*8} width="8" height="8" fill={i%7===0?'#3154cf':i%3===0?'#8faaf5':'#d8e3ff'} opacity={((i*13)%9+1)/12}/>)}</pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`}/></svg>
}

export function WorkflowVisual({ t }) {
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const [stage, setStage] = useState(2)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (reduced) { setStage(2); setPlaying(false); return }
    let timers=[]
    const start=()=>{
      setStage(0);setPlaying(true)
      timers=[setTimeout(()=>setStage(1),1100),setTimeout(()=>setStage(2),2300),setTimeout(()=>setPlaying(false),3800)]
    }
    if (run) start()
    const observer = new IntersectionObserver(([entry])=>{if(entry.isIntersecting){if(!run)start();observer.disconnect()}},{threshold:.3})
    if(ref.current)observer.observe(ref.current)
    return ()=>{observer.disconnect();timers.forEach(clearTimeout)}
  },[run,reduced])
  return <figure className="lab-workflow-wrap" ref={ref}>
    <PixelField />
    <div className="lab-workflow lab-window" data-stage={stage} data-playing={playing}>
      <WindowBar title={`// ${t.engine} //`} />
      <div className="lab-workflow-grid">
        <div className="lab-inputs"><p className="lab-micro">{t.inputNote}</p>{t.inputs.map((item,i)=><div className="lab-input-node" key={item}><span className="lab-icon-tile"><SystemIcon type={i===2?3:0}/></span><strong>{item}</strong><span className="lab-node-plus" aria-hidden="true">+</span></div>)}</div>
        <svg className="lab-wires" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><g fill="none"><path d="M280 70C400 70 370 150 485 150M280 150H485M280 230C400 230 370 150 485 150M535 150H740"/><path className="lab-wire-signal" d="M280 70C400 70 370 150 485 150M280 150H485M280 230C400 230 370 150 485 150M535 150H740"/></g></svg>
        <div className="lab-hub"><div className="lab-hub-box"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="Azul"/><div className="lab-hub-meter"><span /></div><span className="lab-micro">{t.hubNote}</span></div></div>
        <div className="lab-output"><div className="lab-output-title"><SystemIcon type={3}/><strong>{t.output}</strong><span aria-hidden="true">↗</span></div>{t.sampleJobs.map((job,i)=><div className="lab-appointment" key={job}><span className="lab-appointment-icon" aria-hidden="true">✓</span><div><b>{job}</b><small>{t.days[i]}</small></div><span className="lab-confirmed">{t.confirmed}</span></div>)}</div>
      </div>
      <div className="lab-workflow-bottom"><span>↳ {t.reviewLoop}</span><span>EN / ES</span></div>
    </div>
    <figcaption><span>{t.preview}</span><button type="button" onClick={()=>setRun(n=>n+1)} disabled={playing}><span aria-hidden="true">↻</span>{t.replay}</button></figcaption>
  </figure>
}

export function ComparisonVisual({ t, connected }) {
  const items=connected?t.afterItems:t.beforeItems
  return <div className={`lab-comparison lab-window${connected?' is-connected':''}`}>
    <WindowBar title={`// ${connected?t.after:t.before} //`} blue={connected}/>
    <ol>{items.map((item,i)=><li key={item}><span className="lab-comparison-step">{String(i+1).padStart(2,'0')}</span><span>{item}</span><span className="lab-step-symbol" aria-hidden="true">{connected?'✓':i===3?'×':'·'}</span></li>)}</ol>
    <div className="lab-comparison-result"><span aria-hidden="true">{connected?'↗':'↘'}</span>{connected?t.afterEnd:t.beforeEnd}</div>
  </div>
}

export function ServicePreview({ t, index }) {
  if(index===0){const p=t.websitePreview;return <div className="lab-preview-scene lab-preview-website"><PixelField/><div className="lab-mini-site lab-window"><WindowBar title={p.url}/><div className="lab-mini-nav"><b>{p.brand}</b><span>EN / ES</span></div><div className="lab-mini-hero"><small>{p.sub}</small><h4>{p.heading}</h4><svg viewBox="0 0 200 170" className="lab-house" fill="none" aria-hidden="true"><path d="m12 80 88-62 88 62-88 62Z" fill="#3154cf" stroke="#17202a" strokeWidth="2"/><path d="m24 87 76 54v25l-76-53Z" fill="#fff" stroke="#17202a" strokeWidth="2"/><path d="m100 141 76-54v26l-76 53Z" fill="#dce5ff" stroke="#17202a" strokeWidth="2"/><path d="m36 63 88 62M60 46l88 63M83 30l88 63" stroke="#ffffff70"/><path d="m44 109 20 14v13l-20-14Z" fill="#3154cf"/><path d="m133 130 16-12v23l-16 11Z" fill="#3154cf"/></svg></div><div className="lab-mini-form">{p.fields.map(f=><span key={f}>{f}</span>)}<div>{p.button}<PixelArrow/></div></div><div className="lab-preview-foot">{p.footer}</div></div><span className="lab-preview-label">{t.preview}</span></div>}
  if(index===1){const p=t.agentPreview;return <div className="lab-preview-scene lab-preview-agent"><PixelField/><div className="lab-call-window lab-window"><WindowBar title={p.title} blue/><div className="lab-call-status"><span className="lab-status-dot"/>{p.status}</div><div className="lab-wave" aria-hidden="true">{Array.from({length:40},(_,i)=><i key={i} style={{height:12+((i*19)%54),animationDelay:`${(i%9)*-.12}s`}}/>)}</div><div className="lab-transcript"><small>{p.agent}</small><p>{p.line}</p><small>{p.customer}</small><p>{p.response}</p></div><ul className="lab-call-fields">{p.fields.map(field=><li key={field}><span aria-hidden="true">✓</span>{field}</li>)}</ul><div className="lab-preview-foot">{p.footer}<SystemIcon type={1}/></div></div><span className="lab-preview-label">{t.preview}</span></div>}
  const p=t.reviewPreview
  return <div className="lab-preview-scene lab-preview-reviews"><PixelField/><div className="lab-review-window lab-window"><WindowBar title={p.title}/><div className="lab-review-event"><span className="lab-icon-tile"><SystemIcon type={3}/></span><b>{p.done}</b><span aria-hidden="true">✓</span></div><div className="lab-review-connector" aria-hidden="true">↓</div><div className="lab-message"><small>{p.sent}</small><p>{p.message}</p><span className="lab-review-link">{p.link}</span></div><div className="lab-review-reminder"><SystemIcon type={2}/><span>{p.reminder}</span></div></div><span className="lab-preview-label">{t.preview}</span></div>
}
