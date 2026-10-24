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
      <div className="service-feature-visual" aria-hidden="true">{slugs[index] === 'ai-lead-agent' ? <div className="lead-service-preview"><span className="lead-badge">{leadAgentCopy[lang].pilot}</span><h3>{leadAgentCopy[lang].title}</h3><ol>{leadAgentCopy[lang].steps.map(step => <li key={step.title}>{step.title}</li>)}</ol></div> : <ServiceVisual index={index} position={position} total={visibleIndices.length} />}</div>
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
