import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { workProjects } from '../data/workProjects'
import { StudioTitle, StudioLabel } from '../components/site/StartupKit'
import { WindowBar } from '../components/site/ServicesVisuals'
import { FilterChips, Modal, Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'
import { WebsiteTransformation } from '../components/site/WebsiteTransformation'

export default function Work() {
  const { c } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    const id = params.get('project')
    if (!id) return
    const match = workProjects.find(p => p.id === id)
    if (match) setSelected(match)
    setParams(prev => { const next = new URLSearchParams(prev); next.delete('project'); return next }, { replace: true })
  }, [params, setParams])
  const projects = workProjects.filter(p => filter === 'all' || p.category === filter)
  const copy = selected ? c.work.projects[selected.id] : null
  return <>
    <section className="work-hero section">
      <StudioLabel>{c.work.eyebrow}</StudioLabel>
      <StudioTitle as="h1">{c.work.title}</StudioTitle>
      <div className="work-intro"><p>{c.work.subtitle}</p><span>{String(workProjects.length).padStart(2, '0')} / {c.work.countLabel}</span></div>
    </section>
    <section className="work-gallery section" aria-label={c.work.eyebrow}>
      <div className="work-filters"><FilterChips options={c.work.filters} value={filter} onChange={setFilter} label={c.work.filterLabel} /><span role="status">{projects.length} {c.work.countLabel}</span></div>
      <div className="work-grid">
        {projects.map((project) => {
          const text = c.work.projects[project.id]
          return <article className={`work-card work-${project.id}`} key={project.id}>
            <button className="work-card-button" onClick={() => setSelected(project)} aria-label={`${c.work.view}: ${text.title}`}>
              <div className="work-image"><WindowBar title={`// ${text.title} //`}/><img src={project.image} alt={text.imageAlt} loading="lazy"/><span className="work-image-link" aria-hidden="true">↗</span></div>
              <div className="work-card-heading"><h2>{text.title}</h2><Arrow /></div>
              {text.caseStudy && <div className="work-card-metric">{text.caseStudy.metric}</div>}
              <div className="work-tags">{text.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </button>
          </article>
        })}
      </div>
      {!projects.length && <div className="work-empty"><h2>{c.work.empty}</h2><p>{c.work.emptyBody}</p><button className="text-link" onClick={() => setFilter('all')}>{c.work.reset}<Arrow /></button></div>}
    </section>
    <WebsiteTransformation initialMode="compare" />
    <section className="work-clients section"><div>{workProjects.filter(p=>p.category!=='studio').map(p=><span key={p.id}>{c.work.projects[p.id].title}</span>)}</div></section>
    <section className="work-cta section"><StudioTitle>{c.work.ctaTitle}</StudioTitle><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.work.cta}<Arrow /></a></section>
    {selected && <Modal title={copy.title} onClose={() => setSelected(null)}><img className="work-modal-image" src={selected.image} alt={copy.imageAlt}/><p>{copy.description}</p><h3 className="work-modal-label">{c.work.scope}</h3><div className="work-tags">{copy.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{copy.caseStudy && <div className="work-modal-case"><h3 className="work-modal-label">{c.work.results}</h3><div className="work-case-metric">{copy.caseStudy.metric}</div>{copy.caseStudy.note && <div className="work-case-note">{copy.caseStudy.note}</div>}<blockquote className="work-case-quote">“{copy.caseStudy.quote}”</blockquote><div className="work-case-byline">{copy.caseStudy.person} · {copy.caseStudy.role}</div><div className="work-case-approval">{copy.caseStudy.window} · {copy.caseStudy.approval}</div></div>}<a className="button" href={selected.url} target="_blank" rel="noreferrer">{c.work.visit}<Arrow /></a></Modal>}
  </>
}
