import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { StudioTitle, StudioLabel, StudioWindow } from '../components/site/StartupKit'
import { MagneticButton } from '../components/motion/MagneticButton'
import { Arrow } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'

export default function About() {
  const { c } = useLanguage()
  const a = c.about
  return <div className="about-page">
    <section className="section about-hero" aria-labelledby="about-title">
      <StudioLabel>{a.hero.eyebrow}</StudioLabel>
      <StudioTitle as="h1" id="about-title">{a.hero.title}</StudioTitle>
      <p className="about-hero-intro">{a.hero.body}</p>
      <div className="about-actions">
        <MagneticButton as="a" className="button" href={bookingUrl} target="_blank" rel="noreferrer">{a.hero.cta}<Arrow /></MagneticButton>
        <Link className="text-link" to="/services">{a.hero.services}<Arrow /></Link>
      </div>
    </section>

    <section className="section about-section" aria-labelledby="about-why">
      <div className="about-split"><StudioTitle id="about-why">{a.why.title}</StudioTitle><div className="about-prose">{a.why.paragraphs.map(p => <p key={p}>{p}</p>)}</div></div>
    </section>

    <section className="section about-section" aria-labelledby="about-difference">
      <StudioTitle id="about-difference">{a.difference.title}</StudioTitle>
      <ol className="about-differences">{a.difference.items.map((item, i) => <li key={item.title}>
        <span className="about-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <div><h3>{item.title}</h3><p>{item.body}</p></div>
      </li>)}</ol>
    </section>

    <section className="section about-section" aria-labelledby="about-serve">
      <div className="about-split"><div><StudioTitle id="about-serve">{a.serve.title}</StudioTitle><p className="about-support">{a.serve.body}</p></div><div className="about-territory">
        <h3>{a.serve.regionLabel}</h3><ul className="about-regions">{a.serve.regions.map(region => <li key={region}>{region}</li>)}</ul>
        <h3>{a.serve.tradeLabel}</h3><ul className="service-chips about-trades">{a.serve.trades.map(trade => <li key={trade}>{trade}</li>)}</ul>
      </div></div>
    </section>

    <section className="section about-section" aria-labelledby="about-how">
      <StudioTitle id="about-how">{a.how.title}</StudioTitle>
      <ol className="about-steps">{a.how.steps.map((step, i) => <li key={step.title}><span className="about-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
    </section>

    <section className="section about-section about-founder" aria-labelledby="about-founder">
      <div><StudioTitle id="about-founder">{a.founder.name}</StudioTitle><p className="about-founder-role">{a.founder.role}</p><p className="about-founder-bio">{a.founder.bio}</p><p className="about-founder-note">{a.founder.note}</p></div>
      <StudioWindow title="Azul / Studio" className="studio-founder-card"><div className="studio-founder-monogram" aria-hidden="true">EG<span>+</span></div><p>{a.founder.name}</p><span className="lab-micro">{a.founder.role}</span><div className="studio-profile-languages">EN <span>↔</span> ES</div></StudioWindow>
    </section>

    <section className="section about-section" aria-labelledby="about-principles">
      <div className="about-split"><StudioTitle id="about-principles">{a.principles.title}</StudioTitle><ul className="about-principles">{a.principles.items.map(item => <li key={item}><span aria-hidden="true">+</span>{item}</li>)}</ul></div>
    </section>
  </div>
}
