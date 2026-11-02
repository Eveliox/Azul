import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { offerPrices } from '../../data/offer'
import { MagneticButton } from '../motion/MagneticButton'
import { bookingUrl } from './Layout'
import { Arrow } from './UI'
import '../../offer.css'

export function OfferCtas() {
  const { c } = useLanguage()
  return <div className="offer-ctas">
    <MagneticButton as="a" className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.offer.ctas.book}<Arrow /></MagneticButton>
  </div>
}

function Checklist({ items }) {
  return <ul className="offer-list">{items.map(item => <li key={item}><span aria-hidden="true">+</span>{item}</li>)}</ul>
}

export function PackageCard({ servicesLink = false, badge }) {
  const { c } = useLanguage()
  const t = c.offer.pricing
  const standard = offerPrices.packageStandardMonthly
  return <article className="offer-card is-package">
    <div className="offer-card-top">
      <h3>{t.name}</h3>
      {standard ? <span className="offer-badge">{t.founding}</span> : badge && <span className="offer-badge">{badge}</span>}
    </div>
    <p className="offer-price"><strong>{offerPrices.packageMonthly}</strong><span>{t.month}</span></p>
    {standard && <p className="offer-standard">{t.standard}: <s>{standard}{t.month}</s></p>}
    <p className="offer-setup">{t.setup(offerPrices.packageSetup)}</p>
    <Checklist items={t.includes} />
    <p className="offer-terms">{t.terms}</p>
    <OfferCtas />
    {servicesLink && <p className="offer-separately">{t.separately} <Link className="text-link" to="/services">{t.separatelyLink}<Arrow /></Link></p>}
  </article>
}

export function ServiceCard({ service, price }) {
  const { c } = useLanguage()
  const s = c.offer.services
  return <article className="offer-card">
    <div className="offer-card-top"><h3>{service.name}</h3></div>
    <p className="offer-price"><strong>{price}</strong><span>{s.setup}</span></p>
    <p className="offer-body">{service.body}</p>
    <Checklist items={service.items} />
    <a className="text-link" href={bookingUrl} target="_blank" rel="noreferrer">{c.offer.ctas.book}<Arrow /></a>
    {service.learn && <Link className="text-link" to="/services/ai-lead-agent">{service.learn}<Arrow /></Link>}
  </article>
}
