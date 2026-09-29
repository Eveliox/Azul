import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { gsap, groupLines, useGSAP } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useReveal } from '../hooks/useReveal'
import { CountUp } from '../components/motion/CountUp'
import { DotGrid } from '../components/motion/DotGrid'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { ImageReveal } from '../components/motion/ImageReveal'
import { MagneticButton } from '../components/motion/MagneticButton'
import { Marquee } from '../components/motion/Marquee'
import { SplitText } from '../components/motion/SplitText'
import { Wordmark } from '../components/motion/Wordmark'
import { ServiceList } from '../components/site/ServiceList'
import { Arrow, DownloadModal } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'

export const serviceSlugs = ['review-booster', 'social-media-ai', 'website-build', 'local-proof-seo', 'ai-answering-service', 'ai-facebook-ads']
// The intro plays once per page load, not on every return to Home.
let introPlayed = false

function Hero() {
  const { c } = useLanguage()
  const ref = useRef(null)
  const reduced = useReducedMotion()

  // Intro: black screen, letters rise one by one, headline lines slide up,
  // then the photo, nav, floating controls and dot grid fade in.
  useGSAP(() => {
    if (reduced || introPlayed) return
    const q = gsap.utils.selector(ref)
    const chrome = document.querySelectorAll('[data-intro-fade]')
    gsap.set(q('.hero-curtain'), { autoAlpha: 1 })
    gsap.set([...chrome, ...q('.dot-grid')], { autoAlpha: 0 })
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { introPlayed = true } })
    tl.from(q('.wordmark-letter'), { yPercent: 118, duration: 1.2, stagger: 0.12 }, 0.2)
    groupLines(q('.hero-copy .split-word')).forEach((line, i) => tl.from(line, { yPercent: 115, duration: 1.1 }, 0.8 + i * 0.12))
    tl.from(q('.hero-copy p, .hero-meta > *, .hero-bottom > *'), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.05 }, 1.15)
      .to(q('.hero-curtain'), { autoAlpha: 0, duration: 1.3, ease: 'power2.inOut' }, 1.05)
      .to(chrome, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 1.7)
      .to(q('.dot-grid'), { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 1.8)
    // Failsafe: never leave the hero hidden, even if frames are throttled.
    const timer = setTimeout(() => tl.progress(1), 5000)
    return () => clearTimeout(timer)
  }, { scope: ref, dependencies: [reduced] })

  // Scroll: the wordmark scales down and rises, the photo darkens, the copy fades.
  useGSAP(() => {
    if (reduced) return
    const q = gsap.utils.selector(ref)
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      .to(q('.wordmark-wrap'), { yPercent: -5, transformOrigin: '50% 100%', ease: 'none' }, 0)
      .to(q('.hero-darken'), { opacity: 0.45, ease: 'none' }, 0)
      .to(q('.hero-meta, .hero-copy, .hero-bottom'), { opacity: 0.25, ease: 'none', duration: 1 }, 0)
  }, { scope: ref, dependencies: [reduced] })

  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg" aria-hidden="true">
        <img className="hero-image" src="/images/waterfront.jpg" alt="" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-darken" />
        <div className="hero-curtain" />
      </div>
      <DotGrid avoid=".hero-meta > *, .hero-copy h1, .hero-copy p, .hero-bottom > *, [data-dot-avoid]" rows={7} />
      <div className="hero-meta"><span>{c.hero.location}</span><span>{c.hero.index}</span></div>
      <div className="hero-copy"><SplitText as="h1" reveal={false}>{c.hero.title}</SplitText><p>{c.hero.sub}</p></div>
      <Wordmark text={c.brand} />
      <div className="hero-bottom"><a href="#who">{c.hero.scroll}<span aria-hidden="true">↓</span></a><span>{c.hero.note}</span></div>
    </section>
  )
}

function Purpose() {
  const { c } = useLanguage()
  const section = useRef(null)
  const video = useRef(null)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const src = import.meta.env.VITE_PURPOSE_VIDEO || '/images/purpose-roofers.webm'
  useEffect(() => { if (reduced) video.current?.pause(); else video.current?.play().catch(() => {}) }, [reduced])
  function toggle() { if (playing) video.current.pause(); else video.current.play().catch(() => {}) }

  // Pin the section while the statement lights up word by word with scroll.
  // Unrevealed words stay at 25% opacity, so the text is never invisible.
  useGSAP(() => {
    if (reduced) return
    const words = section.current.querySelectorAll('.purpose-title .split-word')
    gsap.timeline({ scrollTrigger: { trigger: section.current, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, anticipatePin: 1 } })
      .fromTo(words, { opacity: 0.25 }, { opacity: 1, ease: 'none', stagger: 0.12 })
      .fromTo(video.current, { scale: 1.08 }, { scale: 1, ease: 'none', duration: words.length * 0.12 }, 0)
  }, { scope: section, dependencies: [reduced, c.purpose.title], revertOnUpdate: true })

  return (
    <section className="purpose" ref={section}>
      <video ref={video} src={src} poster="/images/purpose-roofers.jpg" muted loop playsInline preload="metadata" autoPlay={!reduced} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label={c.purpose.fallback} />
      <div className="purpose-shade" />
      <div className="purpose-content">
        <SectionEyebrow>{c.purpose.eyebrow}</SectionEyebrow>
        <span className="purpose-year">{c.purpose.year}</span>
        <SplitText className="purpose-title" reveal={false}>{c.purpose.title}</SplitText>
        <div className="purpose-bottom"><span>{c.purpose.caption}</span><button onClick={toggle} aria-label={playing ? c.purpose.pause : c.purpose.play}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>{playing ? c.purpose.pause : c.purpose.play}</button></div>
      </div>
    </section>
  )
}

function Stats() {
  const { c } = useLanguage()
  const ref = useRef(null)
  // A thin line draws under each number as the row comes into view.
  useReveal(ref, el => gsap.timeline({ paused: true }).from(el.querySelectorAll('.stat-line'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, ease: 'expo.inOut', stagger: 0.12 }))
  return (
    <div className="proof">
      <SectionEyebrow>{c.proof.eyebrow}</SectionEyebrow>
      <div className="stats" ref={ref}>
        {c.proof.values.map((stat, i) => (
          <div className="stat" key={i}>
            <strong>{stat.text ? <CountUp text={stat.text} /> : <CountUp to={stat.to} decimals={stat.decimals} suffix={stat.suffix} />}</strong>
            <span className="stat-line" aria-hidden="true" />
            <p>{c.proof.labels[i]}</p>
          </div>
        ))}
      </div>
      <p className="sample-note">{c.proof.sample}</p>
    </div>
  )
}

function Clients() {
  const { c } = useLanguage()
  const logos = c.clients.logos.map((logo, i) => ({ logo, name: c.clients.names[i] }))
  return (
    <section className="section clients" id="clients">
      <SectionEyebrow>{c.clients.eyebrow}</SectionEyebrow>
      <div className="section-intro">
        <SplitText>{c.clients.title}</SplitText>
        <div><p>{c.clients.body}</p><MagneticButton as="a" href={bookingUrl} className="text-link" target="_blank" rel="noreferrer">{c.clients.cta}<Arrow /></MagneticButton></div>
      </div>
      <Marquee className="client-logos" items={logos} renderItem={({ logo, name }, i, hidden) => (
        <figure className={`client-logo client-logo-${i + 1}`} tabIndex={hidden ? -1 : 0} aria-hidden={hidden || undefined}>
          <strong>{logo}</strong>
          <figcaption>{name}</figcaption>
        </figure>
      )} />
      <p className="sample-note">{c.clients.sample}</p>
      <Stats />
    </section>
  )
}

export function Guides() {
  const { c } = useLanguage()
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(null)
  return <section className="section guides" id="guides"><SectionEyebrow>{c.guides.eyebrow}</SectionEyebrow><div className="guides-grid"><div><SplitText>{c.guides.title}</SplitText><div className="guide-list">{c.guides.titles.map((title, i) => <button key={i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setSelected(i)}><span className="guide-number">0{i + 1}</span><span>{title}<small>{c.guides.free}</small></span><Arrow /></button>)}</div></div><div className="guide-preview" aria-hidden="true"><div className={`guide-book book-${active}`}><div className="book-top"><span>{c.brand}</span><span>0{active + 1} / 03</span></div><div className="book-orbit" /><h3>{c.guides.titles[active]}</h3><span className="book-bottom">{c.guides.format} ↗</span></div></div></div>{selected !== null && <DownloadModal guide={{ id: `guide-${selected + 1}`, title: c.guides.titles[selected], description: c.guides.descriptions[selected] }} onClose={() => setSelected(null)} />}</section>
}

function Dashboard() {
  const { c } = useLanguage()
  return <div className="dashboard-scene"><div className="dashboard"><div className="dashboard-bar"><b>{c.brand}</b><span>{c.audit.mockStatus}</span><i /></div><p className="dashboard-label">{c.audit.mockLabel}</p><h3>{c.audit.mockTitle}</h3><div className="chart" aria-hidden="true">{[24, 37, 30, 45, 39, 60, 50, 65, 71, 62, 83, 96].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><div className="dashboard-cards">{c.audit.mockCards.map((name, i) => <div key={name}><span aria-hidden="true">{['✳', '⌖', '↗'][i]}</span><b>{name}</b><small>{c.audit.mockNotes[i]}</small></div>)}</div><p className="dashboard-bottom">{c.audit.mockBottom}</p></div><div className="scene-square" aria-hidden="true" /></div>
}

export default function Home() {
  const { c } = useLanguage()
  return <>
    <Hero />
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
    <Purpose />
    <Clients />
    <section className="section audit" id="audit"><div><SectionEyebrow>{c.audit.eyebrow}</SectionEyebrow><SplitText>{c.audit.title}</SplitText><p>{c.audit.body}</p><ul>{c.audit.benefits.map(benefit => <li key={benefit}><span aria-hidden="true">+</span>{benefit}</li>)}</ul><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.audit.cta}<Arrow /></a><small>{c.audit.foot}</small></div><Dashboard /></section>
    <Guides />
  </>
}
