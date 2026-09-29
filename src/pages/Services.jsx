import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { gsap } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { DotGrid } from '../components/motion/DotGrid'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { ServiceVisual } from '../components/site/ServiceVisual'
import { Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'
import { serviceSlugs } from './Home'

const slugs = [...serviceSlugs, 'custom-ai-agents']
const WAITLIST_INDEX = 5
const NEW_INDEX = 6

// One service per row, copy and preview swapping sides every other row.
// The copy rises in; the preview wipes up like ImageReveal.
function ServiceFeature({ index, name, description, chips }) {
  const { c } = useLanguage()
  const p = c.servicesPage
  const ref = useRef(null)
  useReveal(ref, el => gsap.timeline({ paused: true })
    .from(el.querySelectorAll('.service-feature-copy > *'), { y: 28, autoAlpha: 0, duration: 1, stagger: 0.07 })
    .fromTo(el.querySelector('.service-feature-visual'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.1), { start: 'top 80%' })
  return (
    <article className={`service-feature ${index % 2 ? 'is-flipped' : ''} ${index === NEW_INDEX ? 'is-new' : ''}`.trim()} ref={ref}>
      <div className="service-feature-copy">
        <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
        <h2>{name}{index === NEW_INDEX && <span className="new-badge">{p.newLabel}</span>}</h2>
        <p>{description}</p>
        {chips && <ul className="service-chips">{chips.map(chip => <li key={chip}>{chip}</li>)}</ul>}
        {index === WAITLIST_INDEX && <span className="waitlist">{c.build.waitlist}</span>}
        <MagneticButton as={Link} className="text-link" to={`/services/${slugs[index]}`}>{p.learn}<Arrow /></MagneticButton>
      </div>
      <div className="service-feature-visual" aria-hidden="true"><ServiceVisual index={index} total={slugs.length} /></div>
    </article>
  )
}

export default function Services() {
  const { c } = useLanguage()
  const p = c.servicesPage
  const names = [...c.build.services, c.agents.name]
  const descriptions = [...c.build.descriptions, c.agents.row.description]
  return <>
    <section className="services-hero section">
      <DotGrid />
      <SectionEyebrow>{p.eyebrow}</SectionEyebrow>
      <SplitText as="h1">{p.title}</SplitText>
      <p>{p.body}</p>
    </section>
    <section className="services-rows section" aria-label={p.eyebrow}>
      {names.map((name, i) => <ServiceFeature key={slugs[i]} index={i} name={name} description={descriptions[i]} chips={i === NEW_INDEX ? c.agents.row.chips : null} />)}
    </section>
    <section className="work-cta section">
      <SectionEyebrow>{c.contact}</SectionEyebrow>
      <SplitText>{p.ctaTitle}</SplitText>
      <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{p.cta}<Arrow /></a>
    </section>
  </>
}
