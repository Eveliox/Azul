import { StudioHero, StudioTitle, StudioLabel } from '../components/site/StartupKit'
import { GrowthPhone } from '../components/site/GrowthPhone'
import { useState } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { servicesPage } from '../data/servicesPage'
import { useLanguage } from '../contexts/LanguageContext'
import { FAQAccordion, Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'
import { OfferCtas, PackageCard } from '../components/site/Offer'
import { SHOW_PRICES } from '../data/offer'
import '../offer.css'

// Hidden until Azul has real client results. Add them to c.offer.caseStudies, then set this to true.
const SHOW_CASE_STUDIES = false

function HowItWorks() {
  const { c } = useLanguage()
  const t = c.offer.how
  return <section className="section offer-how" id="how-it-works">
    <StudioLabel>{t.eyebrow}</StudioLabel><div className="section-intro"><StudioTitle>{t.title}</StudioTitle><div><p>{t.body}</p><OfferCtas /></div></div>
    <ol className="offer-steps">{t.steps.map((step, i) => <li key={step.title}><span className="service-index">0{i + 1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
  </section>
}

function Included() {
  const { c } = useLanguage()
  const t = c.offer.included
  return <section className="section offer-included" id="included">
    <StudioTitle>{t.title}</StudioTitle>
    <ol className="offer-items">{t.items.map((item, i) => <li key={item.title}><span className="service-index">0{i + 1}</span><div><h3>{item.title}{i === t.items.length - 1 && <span className="offer-badge">{t.badge}</span>}</h3><p>{item.body}</p></div></li>)}</ol>
  </section>
}

function Pricing() {
  const { c } = useLanguage()
  const t = c.offer.pricing
  return <section className="section offer-pricing" id="pricing">
    <div className="offer-pricing-grid"><StudioTitle>{t.title}</StudioTitle><PackageCard servicesLink /></div>
  </section>
}

function CaseStudies() {
  const { c } = useLanguage()
  const t = c.offer.caseStudies
  return <section className="section offer-cases" id="case-studies">
    <StudioTitle>{t.title}</StudioTitle>
    <p>{t.body}</p>
  </section>
}

function FAQ() {
  const { c, lang } = useLanguage()
  const t = c.offer.faq
  return <section className="section offer-faq" id="faq">
    <div className="offer-faq-grid"><StudioTitle>{t.title}</StudioTitle><FAQAccordion key={lang} items={t.items.map(([question, answer]) => ({ question, answer }))} /></div>
  </section>
}

function FinalCta() {
  const { c } = useLanguage()
  const t = c.offer.final
  return <section className="section offer-final" id="get-started">
    <StudioTitle>{t.title}</StudioTitle>
    <p>{t.body}</p>
    <OfferCtas />
  </section>
}

export default function Home() {
  const { c, lang } = useLanguage()
  const t = servicesPage[lang]
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  return <div className="home-studio">
    <StudioHero title={lang === 'en' ? 'More calls answered.\nMore estimates booked.' : 'Más llamadas atendidas.\nMás citas agendadas.'} body={t.intro} className="studio-home-hero">
      <div className="offer-ctas"><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.offer.ctas.book}<Arrow /></a></div>
      <div className={`growth-hero studio-phone-visual${paused || reduced ? ' is-still' : ''}`}>
        <p className="sr-only">{lang === 'en' ? 'Illustrative Azul Growth dashboard displayed on a phone held in a hand. Demo data.' : 'Panel ilustrativo de Azul Growth en un teléfono sostenido en una mano. Datos de demostración.'}</p>
        <GrowthPhone lang={lang} still={paused || reduced} ready />
        {!reduced && <button className="studio-phone-motion" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{lang === 'en' ? paused ? 'Resume animation' : 'Pause animation' : paused ? 'Reanudar animación' : 'Pausar animación'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>}
      </div>
      <div className="lab-trust-strip">{t.strip.map(item=><span key={item}>{item}</span>)}</div>
    </StudioHero>
    <HowItWorks />
    <Included />
    {SHOW_PRICES && <Pricing />}
    {SHOW_CASE_STUDIES && <CaseStudies />}
    <FAQ />
    <FinalCta />
  </div>
}
