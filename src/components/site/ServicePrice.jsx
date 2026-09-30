import { useLanguage } from '../../contexts/LanguageContext'
import { getService, serviceLabels } from '../../data/services'

export function ServicePrice({ slug, compact = false }) {
  const { lang, c } = useLanguage()
  const labels = serviceLabels[lang]
  const service = getService(slug, lang)
  const custom = slug === 'custom-ai-agents'
  return <span className={`service-price${compact ? ' is-compact' : ''}`}>
    {custom ? <><span className="service-price-label">{labels.from}</span><strong>{c.agents.detail.startingPrice}</strong></> : service?.comingSoon ? <><strong className="service-price-pending">{labels.launch}</strong><span className="service-price-label">{labels.soon}</span></> : service && <><span><strong>{service.price}</strong><span className="service-price-period">{labels.month}</span></span>{service.priceNote && <span className="service-price-label">+ $499 {labels.setup}</span>}</>}
  </span>
}
