import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import LanguageToggle from './components/LanguageToggle'
import Reveal from './components/Reveal'
import { CallJourney, VoiceDemo } from './components/CallExperience'
import { FeaturedWork, SectionHeading, VisualServices } from './components/LandingSections'
import { useLanguage } from './contexts/LanguageContext'
import { experience } from './data/experience'
import { stripeLinks, isStripeLinkReady } from './data/stripeLinks'
import './experience.css'

const BOOKING_URL = 'https://calendly.com/purplexmythzz/30min'
const WHATSAPP_URL = 'https://wa.me/17869201239'
const priceIds = { websiteSetup: 'website', aiAnswering: 'calls', reviewBooster: 'reviews', localSeo: 'seo' }

export default function App() {
  const { c, lang } = useLanguage()
  const t = experience[lang]
  const reduced = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const links = [['portfolio', lang === 'es' ? 'Trabajo' : 'Our work'], ['solutions', c.nav.solutions], ['pricing', c.nav.pricing], ['how-it-works', c.nav.howItWorks]]
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return <div className="experience-site">
    <a className="skip-link" href="#main">{lang === 'es' ? 'Ir al contenido' : 'Skip to content'}</a>
    <header className="site-header"><div className="exp-container nav-inner">
      <a className="azul-wordmark" href="#home" onClick={() => setMenuOpen(false)} aria-label="Azul">Azul<span>.</span></a>
      <nav className="desktop-links" aria-label={lang === 'es' ? 'Principal' : 'Main navigation'}>{links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <div className="nav-actions"><LanguageToggle/><a className="nav-book" href={BOOKING_URL} target="_blank" rel="noreferrer">{c.nav.bookDemo}<span aria-hidden="true">↗</span></a><button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={c.nav.toggleMenu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button></div>
    </div>{menuOpen && <nav id="mobile-navigation" className="mobile-site-links" aria-label={lang === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>{[...links, ['contact', c.nav.contact]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}<a href={BOOKING_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>{c.nav.bookDemo} ↗</a></nav>}</header>

    <main id="main">
      <section className="experience-hero" id="home" aria-labelledby="hero-heading"><div className="hero-glow" aria-hidden="true"/><div className="exp-container">
        <div className="hero-editorial"><div><p className="micro-label hero-kicker">{t.eyebrow}</p><h1 id="hero-heading" key={lang}><span>{t.headline[0]}</span><span className="hero-accent">{t.headline[1]}</span></h1></div><div className="hero-side"><p>{t.intro}</p><a className="exp-button exp-button-dark" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.primary}<span aria-hidden="true">↗</span></a><a className="hero-work-link" href="#portfolio">{t.secondary}<span aria-hidden="true">↓</span></a></div></div>
        <CallJourney key={lang} lang={lang}/>
        <div className="hero-footnote"><span>DESIGN + HUMAN CONNECTION + AI</span><span>MIAMI / EN + ES</span></div>
      </div></section>
      <FeaturedWork lang={lang}/>
      <VisualServices lang={lang}/>
      <VoiceDemo key={lang} lang={lang}/>

      <section className="exp-section pricing-section" id="pricing"><div className="exp-container"><Reveal><SectionHeading eyebrow={t.pricingEyebrow} title={t.pricingTitle} intro={t.pricingIntro}/></Reveal>
        <div className="simple-pricing">{c.pricing.tiers.filter((tier) => !tier.comingSoon).map((tier) => {
          const url = stripeLinks[tier.stripeLinkKey]
          const isWebsite = tier.stripeLinkKey === 'websiteSetup'
          const direct = isStripeLinkReady(url) && !isWebsite
          return <article id={`price-${priceIds[tier.stripeLinkKey]}`} className="price-option" key={tier.stripeLinkKey}>
            <h3>{tier.title}</h3><div className="price-number"><strong>{tier.price}</strong><span>{lang === 'es' ? '/mes' : '/mo'}</span></div><p className="price-note">{tier.priceNote || (lang === 'es' ? 'Servicio mensual' : 'Monthly service')}</p>
            <ul>{tier.features.map((feature) => <li key={feature}><span aria-hidden="true">↗</span>{feature}</li>)}</ul>
            <a className="exp-button exp-button-dark" href={direct ? url : BOOKING_URL} target="_blank" rel="noreferrer">{tier.ctaLabel}<span aria-hidden="true">→</span></a>
            {direct && <a className="pricing-secondary" href={BOOKING_URL} target="_blank" rel="noreferrer">{lang === 'es' ? 'O conversemos primero' : 'Or talk to us first'}</a>}
            {isWebsite && isStripeLinkReady(url) && <a className="pricing-secondary" href={url} target="_blank" rel="noreferrer">{lang === 'es' ? 'O pagar el setup de $499' : 'Or pay the $499 setup'}</a>}
          </article>
        })}</div>
        <aside className="combination-note"><div><h3>{t.combinedTitle}</h3><p>{t.combinedBody}</p></div><a href={BOOKING_URL} target="_blank" rel="noreferrer" className="exp-button exp-button-outline">{t.combinedCta}<span aria-hidden="true">↗</span></a></aside>
      </div></section>

      <section className="exp-section process-section" id="how-it-works"><div className="exp-container"><Reveal><SectionHeading eyebrow={t.processEyebrow} title={t.processTitle}/></Reveal><ol className="process-steps">{t.process.map(([title, body], i) => <li key={title}><span className="process-number">0{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
        <div className="local-partner" id="about"><div><p className="micro-label">AZUL / SOUTH FLORIDA</p><h3>{t.about}</h3><p>{t.aboutBody}</p></div><p id="industries">{t.industries}</p></div>
      </div></section>

      <section className="exp-section faq-section" aria-labelledby="faq-heading"><div className="exp-container faq-layout"><div><p className="micro-label">FAQ</p><h2 id="faq-heading" className="exp-heading">{c.faq.headline}</h2></div><div className="faq-list">{c.faq.items.map((faq, i) => <article className={`faq-item ${expandedFAQ === i ? 'open' : ''}`} key={i}><h3><button type="button" aria-expanded={expandedFAQ === i} aria-controls={`faq-answer-${i}`} id={`faq-question-${i}`} onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}>{faq.question}<span aria-hidden="true">{expandedFAQ === i ? '−' : '+'}</span></button></h3><AnimatePresence initial={false}>{expandedFAQ === i && <motion.div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.22 }} className="faq-answer"><p>{faq.answer}</p></motion.div>}</AnimatePresence></article>)}</div></div></section>

      <section className="exp-section contact-section" id="contact"><div className="exp-container contact-layout"><div className="contact-copy"><p className="micro-label">{c.contact.eyebrow}</p><h2 className="exp-heading">{lang === 'es' ? 'Hagamos algo\nque importe.' : 'Let’s make\nsomething matter.'}</h2><p className="exp-intro">{c.contact.subtitle}</p><a className="exp-button exp-button-dark" href={BOOKING_URL} target="_blank" rel="noreferrer">{c.contact.demoCard.cta}<span aria-hidden="true">↗</span></a><a className="contact-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer">{c.footer.whatsapp} ↗</a><span className="contact-signature">Azul<span>.</span></span></div>
        <form action="https://formspree.io/f/meovalvq" method="POST" className="contact-form">
          <div><label htmlFor="contact-name">{c.contact.form.nameLabel}</label><input id="contact-name" name="name" autoComplete="name" required placeholder={c.contact.form.namePlaceholder}/></div>
          <div><label htmlFor="contact-email">{c.contact.form.emailLabel}</label><input id="contact-email" name="email" autoComplete="email" required type="email" placeholder={c.contact.form.emailPlaceholder}/></div>
          <div><label htmlFor="contact-business">{c.contact.form.businessTypeLabel}</label><select id="contact-business" name="business_type">{c.contact.form.businessTypeOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></div>
          <div><label htmlFor="contact-service">{c.contact.form.interestLabel}</label><select id="contact-service" name="service_interest">{c.contact.form.interestOptions.filter((opt) => opt.value !== 'Social Media AI').map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
          <div className="form-full"><label htmlFor="contact-message">{c.contact.form.messageLabel}</label><textarea id="contact-message" name="message" rows={4} required placeholder={c.contact.form.messagePlaceholder}/></div>
          <p className="form-full privacy-note">{t.contactNote}</p><button type="submit" className="exp-button exp-button-blue form-full">{c.contact.form.submit}<span aria-hidden="true">↗</span></button><p className="form-full privacy-note">{c.contact.form.responseTime}</p>
        </form>
      </div></section>
    </main>

    <footer className="experience-footer"><div className="exp-container"><div className="footer-top"><a href="#home" className="azul-wordmark">Azul<span>.</span></a><p>{t.aboutBody}</p><a href="https://app.azulwebdev.com/admin">{lang === 'es' ? 'Acceso de clientes' : 'Client login'} ↗</a></div><nav aria-label={lang === 'es' ? 'Pie de página' : 'Footer'}>{[...links, ['contact', c.nav.contact]].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}<a href="https://www.instagram.com/azuldevsmiami/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/" target="_blank" rel="noreferrer">LinkedIn ↗</a></nav><div className="footer-bottom"><span>© {new Date().getFullYear()} Azul · Miami</span><span>{t.footerSoon}</span></div></div></footer>
    <a className="whatsapp-float" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={c.footer.whatsapp}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c0 5 4 8 8 8l1-2-3-1-1 1-3-3 1-1-1-2Z"/></svg></a>
  </div>
}
