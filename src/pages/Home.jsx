import { Hero } from '../components/site/Hero'
import { LogoIntro } from '../components/site/LogoIntro'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { ImageReveal } from '../components/motion/ImageReveal'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { WebsiteTransformation } from '../components/site/WebsiteTransformation'
import { AgentOrbit } from '../components/agents/AgentOrbit'
import { HoursComparison } from '../components/agents/HoursComparison'
import { JobPostingButton } from '../components/agents/JobPostingDrawer'
import { ServiceList } from '../components/site/ServiceList'
import { Arrow, DownloadModal } from '../components/site/UI'
import { content } from '../data/content'

import { serviceSlugs } from '../data/services'
import { ServicePrice } from '../components/site/ServicePrice'

function Purpose() {
  const { c } = useLanguage()
  return (
    <section className="purpose purpose-editorial">
      <div className="purpose-statement">
        <div className="purpose-heading"><SectionEyebrow>{c.purpose.eyebrow}</SectionEyebrow><span>{c.purpose.year}</span></div>
        <SplitText className="purpose-title" reveal={false}>{c.purpose.title}</SplitText>
        <p className="purpose-support">{c.purpose.support}</p>
        <Link className="text-link" to="/work">{c.purpose.cta}<Arrow /></Link>
        <p className="purpose-signoff">{c.purpose.caption}</p>
      </div>
      <figure className="purpose-photo">
        <ImageReveal src="/aspire-roofing-preview.png" alt={c.purpose.imageAlt} parallax={false} />
        <figcaption><span>{c.purpose.imageCaption}</span><span aria-hidden="true">↗</span></figcaption>
      </figure>
    </section>
  )
}

function Clients() {
  const { c } = useLanguage()
  return (
    <section className="section clients" id="clients">
      <SectionEyebrow>{c.work.clients}</SectionEyebrow>
      <div className="section-intro">
        <SplitText>{c.clients.title}</SplitText>
        <div><p>{c.clients.body}</p><Link className="text-link" to="/work">{c.purpose.cta}<Arrow /></Link></div>
      </div>
      <div className="home-client-list">{['aspire', 'hello', 'caley', 'sanos'].map((key, i) => <Link to="/work" key={key}><span>0{i + 1}</span><strong>{c.work.projects[key].title}</strong><Arrow /></Link>)}</div>
    </section>
  )
}

export function Guides() {
  const { c } = useLanguage()
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(null)
  return <section className="section guides" id="guides"><SectionEyebrow>{c.guides.eyebrow}</SectionEyebrow><div className="guides-grid"><div><SplitText>{c.guides.title}</SplitText><div className="guide-list">{c.guides.titles.map((title, i) => <button key={i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setSelected(i)}><span className="guide-number">0{i + 1}</span><span>{title}<small>{c.guides.free}</small></span><Arrow /></button>)}</div></div><div className="guide-preview" aria-hidden="true"><div className={`guide-book book-${active}`}><div className="book-top"><span>{c.brand}</span><span>0{active + 1} / 03</span></div><div className="book-orbit" /><h3>{c.guides.titles[active]}</h3><span className="book-bottom">{c.guides.format} ↗</span></div></div></div>{selected !== null && <DownloadModal guide={{ id: `guide-${selected + 1}`, title: c.guides.titles[selected], description: c.guides.descriptions[selected] }} onClose={() => setSelected(null)} />}</section>
}

// New service: headline, 40 vs 168 hours, and the 24 · 7 · 365 ring.
function AgentsFeature() {
  const { c } = useLanguage()
  const a = c.agents
  return (
    <section className="section agents-feature" id="ai-agents">
      <SectionEyebrow>{a.home.eyebrow}</SectionEyebrow>
      <SplitText className="agents-feature-title">{a.home.title}</SplitText>
      <div className="agents-feature-grid">
        <div>
          <p className="agents-feature-body">{a.home.body}</p>
          <ServicePrice slug="custom-ai-agents" />
          <HoursComparison />
          <div className="agent-ctas">
            <JobPostingButton />
            <MagneticButton as={Link} className="text-link" to="/services/custom-ai-agents#examples">{a.examplesCta}<Arrow /></MagneticButton>
          </div>
        </div>
        <AgentOrbit className="is-large" />
      </div>
    </section>
  )
}

function Dashboard() {
  const { c } = useLanguage()
  return <div className="dashboard-scene"><div className="dashboard"><div className="dashboard-bar"><b>{c.brand}</b><span>{c.audit.mockStatus}</span><i /></div><p className="dashboard-label">{c.audit.mockLabel}</p><h3>{c.audit.mockTitle}</h3><div className="chart" aria-hidden="true">{[24, 37, 30, 45, 39, 60, 50, 65, 71, 62, 83, 96].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><div className="dashboard-cards">{c.audit.mockCards.map((name, i) => <div key={name}><span aria-hidden="true">{['✳', '⌖', '↗'][i]}</span><b>{name}</b><small>{c.audit.mockNotes[i]}</small></div>)}</div><p className="dashboard-bottom">{c.audit.mockBottom}</p></div><div className="scene-square" aria-hidden="true" /></div>
}

export default function Home() {
  const [introReady, setIntroReady] = useState(false)
  const { c, lang } = useLanguage()
  const industries = content[lang].industries
  return <div className="home-studio">
    <LogoIntro onComplete={() => setIntroReady(true)} />
    <Hero introReady={introReady} />
    <WebsiteTransformation />
    <section className="section who" id="who">
      <SectionEyebrow>{c.who.eyebrow}</SectionEyebrow>
      <SplitText>{c.who.title}</SplitText>
      <div className="who-detail"><span className="asterisk" aria-hidden="true">✳</span><div><p>{c.who.body}</p><MagneticButton as={Link} className="text-link" to="/about">{c.who.link}<Arrow /></MagneticButton></div></div>
      <figure className="local-story">
        <div className="local-story-visual">
        <ImageReveal src="/images/who-florida-home.jpg" alt={c.who.image} className="who-image" />
        <div className="local-story-overlay"><span className="local-story-kicker">{c.who.photoLabel}</span><p>{c.who.photoTitle}</p><span className="local-story-mark" aria-hidden="true">+</span></div>
        </div>
        <figcaption className="image-caption"><span>{c.who.caption}</span><span>{c.who.photoLocation}</span></figcaption>
      </figure>
    </section>
    <section className="section services" id="services">
      <SectionEyebrow>{c.build.eyebrow}</SectionEyebrow>
      <div className="section-intro"><SplitText>{c.build.title}</SplitText><p>{c.build.body}</p></div>
      <ServiceList services={c.build.services} slugs={serviceSlugs} waitlist={c.build.waitlist} waitlistIndex={5} />
      <Link className="text-link" to="/services">{c.build.all}<Arrow /></Link>
    </section>
    <section className="section home-industries" id="industries">
      <SectionEyebrow>{industries.eyebrow}</SectionEyebrow>
      <SplitText>{industries.headline}</SplitText>
      <ul>{industries.items.map(item => <li key={item.name}>{item.href ? <Link to={item.href}>{item.name}<Arrow /></Link> : item.name}</li>)}</ul>
    </section>
    <AgentsFeature />
    <Purpose />
    <Clients />
    <section className="section audit" id="audit"><div><SectionEyebrow>{c.audit.eyebrow}</SectionEyebrow><SplitText>{c.audit.title}</SplitText><p>{c.audit.body}</p><ul>{c.audit.benefits.map(benefit => <li key={benefit}><span aria-hidden="true">+</span>{benefit}</li>)}</ul><Link className="button" to="/free-report">{c.audit.cta}<Arrow /></Link><small>{c.audit.foot}</small></div><Dashboard /></section>
    <Guides />
  </div>
}
