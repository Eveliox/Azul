import { leadAgentCopy } from '../data/leadAgent'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { gsap } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { DotGrid } from '../components/motion/DotGrid'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { ServiceVisual } from '../components/site/ServiceVisual'
import { Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'
import { serviceSlugs } from '../data/services'
import { ServicePrice } from '../components/site/ServicePrice'

const slugs = [...serviceSlugs, 'custom-ai-agents', 'ai-lead-agent']
const visibleIndices = slugs.map((_, index) => index).filter(index => !['social-media-ai', 'ai-facebook-ads'].includes(slugs[index]))
const NEW_INDEX = 6

const LEAD_STEP_ICONS = [
  <svg key="call" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3 4 4c-3 6 10 19 16 16l1-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z"/></svg>,
  <svg key="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>,
  <svg key="cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5"/></svg>,
  <svg key="hand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>,
]

function LeadAgentPreview({ lang }) {
  const copy = leadAgentCopy[lang]
  return <div className="lead-service-preview">
    <div className="lead-preview-head">
      <span className="lead-badge">{copy.pilot}</span>
      <span className="lead-preview-signal" aria-hidden="true"><i/><i/><i/></span>
    </div>
    <h3 className="lead-preview-title">{copy.title}</h3>
    <ol className="lead-preview-steps">
      {copy.steps.map((step, i) => <li key={step.title}>
        <span className="lead-step-icon" aria-hidden="true">{LEAD_STEP_ICONS[i]}</span>
        <span className="lead-step-copy"><strong>{step.title}</strong><span>{step.body}</span></span>
      </li>)}
    </ol>
  </div>
}

// One service per row, copy and preview swapping sides every other row.
// The copy rises in; the preview wipes up like ImageReveal.
function ServiceFeature({ index, position, name, description, chips }) {
  const { c, lang } = useLanguage()
  const p = c.servicesPage
  const ref = useRef(null)
  useReveal(ref, el => gsap.timeline({ paused: true })
    .from(el.querySelectorAll('.service-feature-copy > *'), { y: 28, autoAlpha: 0, duration: 1, stagger: 0.07 })
    .fromTo(el.querySelector('.service-feature-visual'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.1), { start: 'top 80%' })
  return (
    <article className={`service-feature ${position % 2 ? 'is-flipped' : ''} ${index === NEW_INDEX ? 'is-new' : ''}`.trim()} ref={ref}>
      <div className="service-feature-copy">
        <span className="service-index">{String(position + 1).padStart(2, '0')}</span>
        <h2>{name}{index === NEW_INDEX && <span className="new-badge">{p.newLabel}</span>}</h2>
        <p>{description}</p>
        {chips && <ul className="service-chips">{chips.map(chip => <li key={chip}>{chip}</li>)}</ul>}
        <ServicePrice slug={slugs[index]} />
        <MagneticButton as={Link} className="text-link" to={`/services/${slugs[index]}`}>{p.learn}<Arrow /></MagneticButton>
      </div>
      <div className="service-feature-visual" aria-hidden="true">{slugs[index] === 'ai-lead-agent' ? <LeadAgentPreview lang={lang} /> : <ServiceVisual index={index} position={position} total={visibleIndices.length} />}</div>
    </article>
  )
}

export default function Services() {
  const { c, lang } = useLanguage()
  const p = c.servicesPage
  const names = [...c.build.services, c.agents.name, leadAgentCopy[lang].name]
  const descriptions = [...c.build.descriptions, c.agents.row.description, leadAgentCopy[lang].row]
  return <>
    <section className="services-hero section">
      <DotGrid />
      <SplitText as="h1">{p.title}</SplitText>
      <p>{p.body}</p>
    </section>
    <section className="services-rows section" aria-label={p.eyebrow}>
      {visibleIndices.map((i, position) => <ServiceFeature key={slugs[i]} index={i} position={position} name={names[i]} description={descriptions[i]} chips={i === NEW_INDEX ? c.agents.row.chips : null} />)}
    </section>
    <section className="work-cta section">
      <SplitText>{p.ctaTitle}</SplitText>
      <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{p.cta}<Arrow /></a>
    </section>
  </>
}
