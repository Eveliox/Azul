import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { DotGrid } from '../components/motion/DotGrid'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { SplitText } from '../components/motion/SplitText'
import { MagneticButton } from '../components/motion/MagneticButton'
import { Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'

// Add the real portrait's public path to `src` in the FounderPhoto call below.
function FounderPhoto({ src, copy }) {
  return <figure className="about-founder-photo">
    {src ? <img src={src} alt={copy.photoAlt} loading="lazy" width="600" height="750" /> :
      <div className="about-photo-placeholder" role="img" aria-label={`${copy.photoLabel}. ${copy.photoHint}`}>
        <span className="about-photo-mark" aria-hidden="true">+</span>
        <span aria-hidden="true">{copy.photoLabel}</span>
      </div>}
    {!src && <figcaption>{copy.photoHint}</figcaption>}
  </figure>
}

export default function About() {
  const { c } = useLanguage()
  const a = c.about
  return <div className="about-page">
    <section className="section about-hero" aria-labelledby="about-title">
      <DotGrid />
      <SectionEyebrow>{a.hero.eyebrow}</SectionEyebrow>
      <SplitText as="h1" id="about-title">{a.hero.title}</SplitText>
      <p className="about-hero-intro">{a.hero.body}</p>
      <div className="about-actions">
        <MagneticButton as="a" className="button" href={bookingUrl} target="_blank" rel="noreferrer">{a.hero.cta}<Arrow /></MagneticButton>
        <Link className="text-link" to="/services">{a.hero.services}<Arrow /></Link>
      </div>
    </section>

    <section className="section about-section" aria-labelledby="about-why">
      <SectionEyebrow>{a.why.eyebrow}</SectionEyebrow>
      <div className="about-split"><SplitText id="about-why">{a.why.title}</SplitText><div className="about-prose">{a.why.paragraphs.map(p => <p key={p}>{p}</p>)}</div></div>
    </section>

    <section className="section about-section" aria-labelledby="about-difference">
      <SectionEyebrow>{a.difference.eyebrow}</SectionEyebrow>
      <SplitText id="about-difference">{a.difference.title}</SplitText>
      <ol className="about-differences">{a.difference.items.map((item, i) => <li key={item.title}>
        <span className="about-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <div><h3>{item.title}</h3><p>{item.body}</p></div>
      </li>)}</ol>
    </section>

    <section className="section about-section" aria-labelledby="about-serve">
      <SectionEyebrow>{a.serve.eyebrow}</SectionEyebrow>
      <div className="about-split"><div><SplitText id="about-serve">{a.serve.title}</SplitText><p className="about-support">{a.serve.body}</p></div><div className="about-territory">
        <h3>{a.serve.regionLabel}</h3><ul className="about-regions">{a.serve.regions.map(region => <li key={region}>{region}</li>)}</ul>
        <h3>{a.serve.tradeLabel}</h3><ul className="service-chips about-trades">{a.serve.trades.map(trade => <li key={trade}>{trade}</li>)}</ul>
      </div></div>
    </section>

    <section className="section about-section" aria-labelledby="about-how">
      <SectionEyebrow>{a.how.eyebrow}</SectionEyebrow>
      <SplitText id="about-how">{a.how.title}</SplitText>
      <ol className="about-steps">{a.how.steps.map((step, i) => <li key={step.title}><span className="about-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
    </section>

    <section className="section about-section about-founder" aria-labelledby="about-founder">
      <div><SectionEyebrow>{a.founder.eyebrow}</SectionEyebrow><SplitText id="about-founder">{a.founder.name}</SplitText><p className="about-founder-role">{a.founder.role}</p><p className="about-founder-bio">{a.founder.bio}</p><p className="about-founder-note">{a.founder.note}</p></div>
      <FounderPhoto copy={a.founder} />
    </section>

    <section className="section about-section" aria-labelledby="about-principles">
      <SectionEyebrow>{a.principles.eyebrow}</SectionEyebrow>
      <div className="about-split"><SplitText id="about-principles">{a.principles.title}</SplitText><ul className="about-principles">{a.principles.items.map(item => <li key={item}><span aria-hidden="true">+</span>{item}</li>)}</ul></div>
    </section>

    <section className="section about-section about-founding" aria-labelledby="about-founding">
      <div><SectionEyebrow>{a.founding.eyebrow}</SectionEyebrow><h2 id="about-founding">{a.founding.title}</h2><p>{a.founding.body}</p><p className="about-founding-note">{a.founding.note}</p></div>
      <div className="about-founding-action"><p><strong>{a.founding.price}</strong><span>{a.founding.period}</span></p><Link className="text-link" to="/services">{a.founding.cta}<Arrow /></Link></div>
    </section>
  </div>
}
