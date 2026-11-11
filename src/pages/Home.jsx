import { Link } from 'react-router-dom'
import { StudioTitle, StudioLabel } from '../components/site/StartupKit'
import { Hero } from '../components/site/Hero'
import { useLanguage } from '../contexts/LanguageContext'
import { FAQAccordion } from '../components/site/UI'
import { OfferCtas, PackageCard } from '../components/site/Offer'
import { SHOW_PRICES } from '../data/offer'
import '../offer.css'

const SHOW_CASE_STUDIES = true

function HowItWorks() {
  const { c } = useLanguage()
  const t = c.offer.how
  return <section className="section offer-how" id="how-it-works">
    <StudioLabel>{t.eyebrow}</StudioLabel><div className="section-intro"><StudioTitle>{t.title}</StudioTitle><div><p>{t.body}</p></div></div>
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
    <StudioLabel>{t.eyebrow}</StudioLabel>
    <div className="section-intro"><StudioTitle>{t.title}</StudioTitle><div><p>{t.body}</p></div></div>
    <ol className="offer-cases-grid">
      {t.items.map((item, i) => <li key={item.id} className="offer-case">
        <Link to={`/work?project=${item.id}`} className="offer-case-link" aria-label={`${item.business} — ${t.view || 'see project'}`}>
          <span className="service-index">0{i + 1}</span>
          <div className="offer-case-metric">{item.metric}</div>
          {item.note && <div className="offer-case-note">{item.note}</div>}
          <blockquote className="offer-case-quote">“{item.quote}”</blockquote>
          <div className="offer-case-byline">{item.person} · {item.role}</div>
          <span className="offer-case-cta">{t.view || 'See the project'} →</span>
        </Link>
      </li>)}
    </ol>
    <p className="offer-cases-footer">{t.footer}</p>
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
  return <div className="home-studio">
    <Hero introReady />
    <HowItWorks />
    <Included />
    {SHOW_PRICES && <Pricing />}
    {SHOW_CASE_STUDIES && <CaseStudies />}
    <FAQ />
    <FinalCta />
  </div>
}
