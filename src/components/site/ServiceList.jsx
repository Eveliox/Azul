import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ServicePrice } from './ServicePrice'
import { ServiceVisual } from './ServiceVisual'
import { useLanguage } from '../../contexts/LanguageContext'

/** Previews have their own space so pointer and keyboard users can read every row. */
export function ServiceList({ services, slugs }) {
  const [active, setActive] = useState(0)
  const { c } = useLanguage()
  return (
    <div className="service-browser">
      <div className="service-list">
        {services.map((service, i) => (
          <Link
            className={`service-row ${i === active ? 'is-active' : ''}`}
            to={`/services/${slugs[i]}`}
            key={slugs[i]}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="service-row-bg" aria-hidden="true" />
            <span className="service-index">0{i + 1}</span>
            <span className="service-copy">
              <span className="service-name">{service}</span>
              <span className="service-description">{c.build.descriptions[i]}</span>
              <ServicePrice slug={slugs[i]} compact />
            </span>
            <span className="service-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <figure className="service-editorial" aria-hidden="true">
        <ServiceVisual index={active} key={active} />
        <figcaption><span>{c.build.previewLabel}</span><span>{services[active]}</span></figcaption>
        <p>{c.build.previewNote}</p>
      </figure>
    </div>
  )
}
