import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getService, serviceLabels, serviceSlugs } from '../data/services'
import { ServicePrice } from '../components/site/ServicePrice'
import { ServiceVisual } from '../components/site/ServiceVisual'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { SplitText } from '../components/motion/SplitText'
import { Arrow, FAQAccordion } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'

export default function ServiceDetail({ slug }) {
  const { lang, c } = useLanguage()
  const service = getService(slug, lang)
  const labels = serviceLabels[lang]
  const contactUrl = service.comingSoon ? `mailto:${c.email}?subject=${encodeURIComponent(service.title)}` : bookingUrl
  const action = service.comingSoon ? labels.interest : labels.cta
  const nextIndex = (service.index + 1) % serviceSlugs.length
  return <>
    <section className="section service-detail-hero">
      <Link className="text-link service-back" to="/services">← {labels.back}</Link>
      <div className="service-detail-grid">
        <div>
          <SectionEyebrow>{`${c.servicesPage.eyebrow} / ${String(service.index + 1).padStart(2, '0')}`}</SectionEyebrow>
          <SplitText as="h1">{c.build.services[service.index]}</SplitText>
          <p className="service-detail-intro">{service.intro}</p>
          <ServicePrice slug={slug} />
          <a className="button" href={contactUrl} target={service.comingSoon ? undefined : '_blank'} rel="noreferrer">{action}<Arrow /></a>
          <p className="service-detail-note">{service.comingSoon ? labels.launchNote : labels.note}</p>
        </div>
        <div className="service-detail-preview" aria-hidden="true"><ServiceVisual index={service.index} /></div>
      </div>
    </section>
    <section className="section service-detail-included">
      <SectionEyebrow>{service.comingSoon ? labels.planned : labels.included}</SectionEyebrow>
      <ul>{service.features.map((feature, i) => <li key={feature}><span className="service-index">0{i + 1}</span><h2>{feature}</h2></li>)}</ul>
    </section>
    {!service.comingSoon && <section className="section service-detail-process">
      <SectionEyebrow>{labels.process}</SectionEyebrow>
      <div>{labels.steps.map((step, i) => <article key={step}><span className="service-index">0{i + 1}</span><h2>{step}</h2><p>{labels.stepCopy[i]}</p></article>)}</div>
    </section>}
    <section className="section service-detail-faq"><h2>{labels.faq}</h2><FAQAccordion key={`${slug}-${lang}`} items={[{ question: labels.question, answer: service.needs }, { question: service.question, answer: service.answer }]} /></section>
    <section className="section work-cta"><SectionEyebrow>{c.contact}</SectionEyebrow><SplitText>{labels.next}</SplitText><a className="button" href={contactUrl} target={service.comingSoon ? undefined : '_blank'} rel="noreferrer">{action}<Arrow /></a></section>
    <nav className="section service-detail-next" aria-label={labels.more}><span>{labels.more}</span><Link className="text-link" to={`/services/${serviceSlugs[nextIndex]}`}>{c.build.services[nextIndex]}<Arrow /></Link></nav>
  </>
}
