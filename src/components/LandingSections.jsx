import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { experience, featuredWork } from '../data/experience'
import { Waveform } from './CallExperience'

export function SectionHeading({ eyebrow, title, intro }) {
  return <div className="exp-section-heading"><p className="micro-label">{eyebrow}</p><h2 className="exp-heading">{title}</h2>{intro && <p className="exp-intro">{intro}</p>}</div>
}

function WorkDialog({ project, lang, onClose }) {
  const ref = useRef(null)
  const t = experience[lang]
  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement
    dialog.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = old; opener?.focus() }
  }, [])
  return <dialog ref={ref} className="work-dialog" aria-labelledby="work-dialog-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}><div className="work-dialog-inner"><header><span className="micro-label">{project.sector[lang]}</span><button type="button" onClick={onClose} aria-label={t.close}>×</button></header><h2 id="work-dialog-title">{project.name}</h2><img src={project.image} alt={project.name} width="1440" height="1000"/><div className="work-dialog-notes"><div><h3>{t.goal}</h3><p>{project.goal[lang]}</p></div><div><h3>{t.delivery}</h3><p>{project.delivery[lang]}</p></div></div><a className="exp-button exp-button-blue" href={project.url} target="_blank" rel="noreferrer">{t.visit}<span aria-hidden="true">↗</span></a></div></dialog>
}

export function FeaturedWork({ lang }) {
  const t = experience[lang]
  const [selected, setSelected] = useState(null)
  return <section id="portfolio" className="exp-section work-section"><div className="exp-container">
    <Reveal><SectionHeading eyebrow={t.workEyebrow} title={t.workTitle} intro={t.workIntro}/></Reveal>
    <div className="featured-work-grid">{featuredWork.map((p, i) => <Reveal key={p.id} className={`featured-project project-${i}`}><article><button className="project-image-button" type="button" onClick={() => setSelected(p)} aria-label={`${t.explore}: ${p.name}`}><div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{new URL(p.url).hostname}</span><span>↗</span></div><div className="project-image"><img src={p.image} alt={lang === 'es' ? `Diseño del sitio de ${p.name}` : `${p.name} website design`} width="1200" height="900" loading="lazy" decoding="async"/></div><span className="project-open">{t.explore} ↗</span></button><div className="project-description"><span className="micro-label">{p.sector[lang]} / 0{i + 1}</span><h3>{p.name}</h3><p>{p.goal[lang]}</p><p className="project-delivery"><strong>{t.delivery}:</strong> {p.delivery[lang]}</p></div></article></Reveal>)}</div>
  </div>{selected && <WorkDialog project={selected} lang={lang} onClose={() => setSelected(null)}/>}</section>
}

function ServiceVisual({ id, changed, lang }) {
  const exampleLang = changed ? (lang === 'en' ? 'es' : 'en') : lang
  const d = experience[exampleLang]
  const t = experience[lang]
  if (id === 'website') {
    const project = featuredWork[changed ? 1 : 0]
    return <div className="service-browser"><div className="browser-bar"><span>● ● ●</span><span>{project.name}</span><span>↗</span></div><img src={project.image} alt={project.name} width="1200" height="900" loading="lazy" decoding="async"/></div>
  }
  if (id === 'calls') return <div className="service-call" lang={exampleLang}><div className="preview-meta"><span>{t.sample}</span><span>{exampleLang.toUpperCase()}</span></div><Waveform/><div className="chat-bubble assistant">{d.greeting}</div><div className="chat-bubble caller">{d.reply}</div></div>
  if (id === 'reviews') return <div className="service-email" lang={exampleLang}><div className="preview-meta"><span>{t.sample}</span><span>EMAIL</span></div><div className="email-sheet"><span className="email-logo">Azul<span>.</span></span><h4>{d.sampleEmailTitle}</h4><p>{d.sampleEmailBody}</p><span className="email-example-button">{d.sampleEmailCta} →</span></div></div>
  return <div className="service-local"><div className="preview-meta"><span>{t.sample}</span><span>LOCAL SEO</span></div>{changed ? <ol className="local-workflow">{t.workflow.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}<span aria-hidden="true">{i === 3 ? '✓' : '↓'}</span></li>)}</ol> : <div className="local-post"><div className="local-post-art" aria-hidden="true"><svg viewBox="0 0 300 90" fill="none"><path d="m30 75 90-55 80 55M100 75l80-50 90 50" stroke="currentColor" strokeWidth="2"/><path d="M60 58v27h115V58m-77 27V62h25v23" stroke="currentColor" strokeWidth="2"/></svg></div><h4>{t.samplePost}</h4><p>{t.samplePostBody}</p></div>}</div>
}

function VisualService({ service, lang }) {
  const [changed, setChanged] = useState(false)
  const visualId = `service-preview-${service.id}`
  return <article className={`visual-service service-${service.id}`}>
    <div className="service-copy"><p className="micro-label">{service.tag}</p><span className="service-name">{service.name}</span><h3>{service.title}</h3><p>{service.text}</p><a className="service-cta" href={service.id === 'calls' ? '#voice-demo' : `#price-${service.id}`}>{service.cta}<span aria-hidden="true">↗</span></a></div>
    <div className="service-visual-wrap"><div id={visualId} className="service-visual"><ServiceVisual id={service.id} changed={changed} lang={lang}/></div><button className="preview-toggle" type="button" aria-controls={visualId} aria-pressed={changed} onClick={() => setChanged(!changed)}>{changed ? service.alternate : service.preview}<span aria-hidden="true">⇄</span></button></div>
  </article>
}

export function VisualServices({ lang }) {
  const t = experience[lang]
  return <section id="solutions" className="exp-section solutions-section"><div className="exp-container"><Reveal><SectionHeading eyebrow={t.servicesEyebrow} title={t.servicesTitle} intro={t.servicesIntro}/></Reveal><div className="visual-service-grid">{t.services.map((s) => <VisualService key={`${lang}-${s.id}`} service={s} lang={lang}/>)}</div><div className="upcoming-strip"><span className="micro-label">{t.soon}</span><p>{t.soonServices}</p><span className="soon-pill">{t.soonLabel}</span></div></div></section>
}
