import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { SectionEyebrow } from '../motion/Eyebrow'
import './WebsiteTransformation.css'

const projects = {
  hello: { name: 'Hello You Wellness', domain: 'helloyouwellness.com', image: '/videos/work/hello-poster.jpg', video: '/videos/work/hello.webm' },
  aspire: { name: 'Aspire Roofing', domain: 'aspireroofingservices.com', image: '/videos/work/aspire-poster.jpg', video: '/videos/work/aspire.webm' },
}
const copy = {
  en: {
    eyebrow: 'A different first impression', title: 'Same business.\nA whole new presence.',
    body: 'See how thoughtful design changes the way a business shows up online. Start with a dated concept. Reveal the real Azul build.',
    pauseVideo: 'Pause video', playVideo: 'Play video', quote: 'REQUEST INFORMATION', name: 'Your name', email: 'Email address', message: 'How can we help?', send: 'SUBMIT REQUEST', roofing: 'REPAIRS • REPLACEMENTS • MAINTENANCE', watch: 'Watch the upgrade', compare: 'Compare designs', upgrade: 'Upgrade website', replay: 'Replay upgrade',
    before: 'Before · concept', after: 'Built by Azul', drag: 'Drag to explore the difference',
    note: 'The “before” layouts are illustrative concepts, not these clients’ former websites. The finished designs are actual Azul projects.',
    project: 'Choose a project', mode: 'Preview mode', range: 'Amount of illustrative before design visible',
    ready: 'Ready for a new first impression?', playing: 'Upgrading the design…', done: 'Meet the Azul design.',
    live: 'Explore the live site', points: ['Clear visual hierarchy', 'A distinctive brand presence', 'An obvious next step'],
    welcome: 'Welcome to our website!', home: 'HOME', about: 'ABOUT US', services: 'OUR SERVICES', contact: 'CONTACT',
    helloTitle: 'Your local wellness center', aspireTitle: 'Roofing services in South Florida',
    helloBody: 'Learn more about our wellness services and programs. Contact our office for more information or to schedule an appointment.',
    aspireBody: 'We offer roof repairs, replacements and maintenance. Contact our office for more information about our roofing services.',
    oldCta: 'Click here to contact us', links: 'Quick links', more: 'Read more >>',
    helloServices: ['Wellness programs', 'Aesthetic services', 'Appointments'], aspireServices: ['Roof repairs', 'Roof replacement', 'Maintenance'],
  },
  es: {
    eyebrow: 'Una primera impresión diferente', title: 'El mismo negocio.\nUna nueva presencia.',
    body: 'Descubre cómo un buen diseño cambia la presencia digital de un negocio. Empieza con un concepto anticuado y revela el sitio real de Azul.',
    pauseVideo: 'Pausar video', playVideo: 'Reproducir video', quote: 'SOLICITAR INFORMACIÓN', name: 'Tu nombre', email: 'Correo electrónico', message: '¿Cómo podemos ayudar?', send: 'ENVIAR SOLICITUD', roofing: 'REPARACIÓN • REEMPLAZO • MANTENIMIENTO', watch: 'Ver la transformación', compare: 'Comparar diseños', upgrade: 'Renovar sitio web', replay: 'Repetir transformación',
    before: 'Antes · concepto', after: 'Hecho por Azul', drag: 'Desliza para explorar la diferencia',
    note: 'Los diseños de “antes” son conceptos ilustrativos, no los sitios anteriores de estos clientes. Los diseños finales son proyectos reales de Azul.',
    project: 'Elige un proyecto', mode: 'Modo de vista', range: 'Porcentaje visible del concepto anterior',
    ready: '¿Listo para una nueva primera impresión?', playing: 'Renovando el diseño…', done: 'Descubre el diseño de Azul.',
    live: 'Explorar el sitio web', points: ['Jerarquía visual clara', 'Una identidad propia', 'Un siguiente paso evidente'],
    welcome: '¡Bienvenidos a nuestra página web!', home: 'INICIO', about: 'NOSOTROS', services: 'SERVICIOS', contact: 'CONTACTO',
    helloTitle: 'Tu centro de bienestar local', aspireTitle: 'Servicios de techado en el sur de Florida',
    helloBody: 'Conoce nuestros servicios y programas de bienestar. Contacta a nuestra oficina para más información o para programar una cita.',
    aspireBody: 'Ofrecemos reparaciones, reemplazos y mantenimiento de techos. Contacta a nuestra oficina para más información sobre nuestros servicios.',
    oldCta: 'Haz clic aquí para contactarnos', links: 'Enlaces rápidos', more: 'Leer más >>',
    helloServices: ['Programas de bienestar', 'Servicios estéticos', 'Citas'], aspireServices: ['Reparaciones', 'Reemplazo de techos', 'Mantenimiento'],
  },
}

// Deliberately fictional layouts: no invented client history or performance claims.
function DatedConcept({ project, t }) {
  if (project === 'aspire') return <div className="transformation-old old-contractor" aria-hidden="true">
    <div className="contractor-top">ASPIRE ROOFING <span>SOUTH FLORIDA</span></div>
    <div className="contractor-nav">{[t.home, t.about, t.services, t.contact].map(item => <span key={item}>{item}</span>)}</div>
    <div className="contractor-banner"><span>⌂</span><div><h3>{t.aspireTitle}</h3><p>{t.roofing}</p></div></div>
    <div className="contractor-columns"><div className="contractor-copy"><h4>{t.welcome}</h4><p>{t.aspireBody}</p><div className="contractor-roof"/><ul>{t.aspireServices.map(item => <li key={item}>{item}</li>)}</ul><span className="contractor-more">{t.more}</span></div>
      <div className="contractor-form"><b>{t.quote}</b>{[t.name, t.email, t.message].map((label, index) => <div key={label}><span>{label}</span><i className={index === 2 ? 'contractor-textarea' : ''}/></div>)}<strong>{t.send}</strong></div></div>
    <div className="contractor-footer">ASPIRE ROOFING · {t.contact}</div>
  </div>
  const wellness = true
  return <div className={`transformation-old transformation-old--${project}`} aria-hidden="true">
    <div className="old-masthead"><span>{wellness ? '✿' : '⌂'}</span><strong>{projects[project].name}</strong><small>{wellness ? 'WELLNESS & AESTHETICS' : 'ROOFING SERVICES'}</small></div>
    <div className="old-nav">{[t.home, t.about, t.services, t.contact].map(item => <span key={item}>{item}</span>)}</div>
    <div className="old-welcome">{t.welcome}</div>
    <div className="old-columns"><aside><b>{t.links}</b><span>{t.home}</span><span>{t.services}</span><span>{t.contact}</span><div className="old-symbol">{wellness ? '✿' : '⌂'}</div></aside>
      <div className="old-main"><h3>{wellness ? t.helloTitle : t.aspireTitle}</h3><p>{wellness ? t.helloBody : t.aspireBody}</p><span className="old-cta">{t.oldCta}</span><hr/><h4>{t.services}</h4><div className="old-service-list">{(wellness ? t.helloServices : t.aspireServices).map(item => <div key={item}><b>{item}</b><span>{t.more}</span></div>)}</div></div>
    </div>
    <div className="old-footer">{projects[project].name} · {t.home} | {t.contact}</div>
  </div>
}

// Short recordings of the actual homepages, loaded only when visible.
function HomepageVideo({ project, enabled, paused, label }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (inView && enabled && !paused) setLoaded(true) }, [inView, enabled, paused])
  useEffect(() => {
    const video = ref.current
    const sync = () => {
      if (loaded && inView && enabled && !paused && !failed && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => { video.pause(); document.removeEventListener('visibilitychange', sync) }
  }, [loaded, inView, enabled, paused, failed])
  return <div className="transformation-after" role="img" aria-label={label}>
    <img src={project.image} alt="" loading="lazy" width="1440" height="1000"/>
    <video ref={ref} src={loaded ? project.video : undefined} poster={project.image} muted loop playsInline preload="none" aria-hidden="true" onError={() => setFailed(true)} style={failed ? { visibility: 'hidden' } : undefined}/>
  </div>
}

export function WebsiteTransformation({ initialMode = 'watch' }) {
  const { lang } = useLanguage()
  const t = copy[lang] || copy.en
  const reduced = useReducedMotion()
  const id = useId()
  const stageRef = useRef(null)
  const autoPlayed = useRef(false)
  const [project, setProject] = useState('hello')
  const [mode, setMode] = useState(initialMode)
  const [phase, setPhase] = useState('ready')
  const [position, setPosition] = useState(50)
  const [videoPaused, setVideoPaused] = useState(reduced)
  useEffect(() => { if (reduced) setVideoPaused(true) }, [reduced])
  const current = projects[project]

  // One short, silent preview when it enters view; never loop or autoplay
  // for visitors who prefer reduced motion. All controls also work manually.
  useEffect(() => {
    if (mode !== 'watch' || reduced || autoPlayed.current || phase !== 'ready') return
    let timer
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer)
      if (entry.isIntersecting) timer = setTimeout(() => {
        autoPlayed.current = true
        setPhase('playing')
      }, 1000)
    }, { threshold: .5 })
    observer.observe(stageRef.current)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [mode, reduced, phase, project])

  useEffect(() => {
    if (phase !== 'playing') return
    if (reduced) { setPhase('done'); return }
    const timer = setTimeout(() => setPhase('done'), 2800)
    return () => clearTimeout(timer)
  }, [phase, reduced])

  const moveSlider = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))))
  }
  const compare = () => { setMode('compare'); setPhase('ready'); setPosition(50) }
  const reset = () => { setPhase('ready'); setPosition(50) }
  const play = () => { autoPlayed.current = true; setPhase(reduced ? 'done' : 'playing') }
  return <section className={`section transformation transformation--${mode}`} aria-labelledby={`${id}-title`}>
    <div className="transformation-heading"><div><SectionEyebrow>{t.eyebrow}</SectionEyebrow><h2 id={`${id}-title`}>{t.title}</h2></div><p>{t.body}</p></div>
    <div className="transformation-toolbar">
      <div className="transformation-projects" role="group" aria-label={t.project}>{Object.entries(projects).map(([key, item], index) => <button key={key} type="button" aria-pressed={project === key} onClick={() => { setProject(key); reset() }}><span>0{index + 1}</span>{item.name}</button>)}</div>
      <div className="transformation-modes" role="group" aria-label={t.mode}>{['watch', 'compare'].map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => { setMode(value); reset() }}>{t[value]}</button>)}</div>
    </div>
    <div className="transformation-browser">
      <div className="transformation-chrome"><span className="transformation-dots" aria-hidden="true"><i/><i/><i/></span><span>{current.domain}</span><span className="transformation-chrome-brand">azul®</span></div>
      <div ref={stageRef} className={`transformation-stage transformation-phase--${phase}`} style={{ '--split': `${position}%` }}>
        <HomepageVideo key={project} project={current} label={`${current.name} — ${t.after}`} enabled={mode === 'compare' || phase !== 'ready'} paused={videoPaused}/>
        <div className="transformation-before"><DatedConcept project={project} t={t}/></div>
        <div className="transformation-badges"><span className="transformation-before-badge">{t.before}</span><span className="transformation-after-badge">{t.after} ↗</span></div>
        {mode === 'compare' ? <>
          <div className="transformation-divider" aria-hidden="true"><span>‹ ›</span></div>
          <input className="transformation-range" type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} onPointerDown={event => { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); event.currentTarget.setPointerCapture(event.pointerId); moveSlider(event) }} onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) moveSlider(event) }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} aria-label={`${current.name}: ${t.range}`} aria-valuetext={`${position}%`} />
        </> : <>
          {phase !== 'done' && <div className="transformation-upgrade-wrap"><button className="transformation-upgrade" type="button" onClick={play} disabled={phase === 'playing'}><span aria-hidden="true">↑</span>{t.upgrade}</button></div>}
          {phase === 'playing' && <svg className="transformation-cursor" aria-hidden="true" viewBox="0 0 32 40"><path d="M3 2v29l8-7 7 13 6-3-7-12 11-1Z" fill="white" stroke="#111" strokeWidth="2"/></svg>}
        </>}
      </div>
      <div className="transformation-player"><span role="status">{mode === 'compare' ? t.drag : phase === 'playing' ? t.playing : phase === 'done' ? t.done : t.ready}</span>{mode === 'watch' && phase === 'done' ? <button type="button" onClick={compare}>{t.compare} ↔</button> : <span className="transformation-player-index" aria-hidden="true">{project === 'hello' ? '01' : '02'} / 02</span>}</div>
    </div>
    <div className="transformation-details"><div className="transformation-points">{t.points.map((point, index) => <span key={point}><b>0{index + 1}</b>{point}</span>)}</div><div className="transformation-actions">{(mode === 'compare' || phase === 'done') && <button type="button" onClick={() => setVideoPaused(value => !value)}>{videoPaused ? t.playVideo : t.pauseVideo}</button>}{mode === 'watch' && phase === 'done' && <button type="button" onClick={play}>{t.replay} ↻</button>}<a href={`https://${current.domain}/`} target="_blank" rel="noreferrer">{t.live} ↗</a></div></div>
    <p className="transformation-disclosure">{t.note}</p>
  </section>
}
