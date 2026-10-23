import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { gsap, useGSAP } from '../../lib/gsap'
import { WaterVisual } from './WaterVisual'

let introPlayed = false

export function Hero({ introReady }) {
  const { c } = useLanguage()
  const t = c.hero.studio
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => document.body.classList.toggle('home-hero-visible', entry.isIntersecting))
    observer.observe(ref.current)
    return () => { observer.disconnect(); document.body.classList.remove('home-hero-visible') }
  }, [])

  useGSAP(() => {
    if (!introReady || reduced || introPlayed) return
    const tl = gsap.timeline({ onComplete: () => { introPlayed = true } })
    tl.from('.studio-copy > *', { opacity: 0, y: 16, duration: .7, stagger: .08, ease: 'power2.out' })
      .from('.studio-showcase', { opacity: 0, y: 24, duration: .9, ease: 'power2.out' }, .2)
    const timer = setTimeout(() => tl.progress(1), 3000)
    return () => clearTimeout(timer)
  }, { scope: ref, dependencies: [introReady, reduced], revertOnUpdate: true })

  return <section ref={ref} className="studio-hero" aria-labelledby="studio-title">
    <div className="studio-main">
      <div className="studio-copy">
        <h1 id="studio-title">{t.lineOne}<br /><span>{t.lineTwo}</span></h1>
        <p className="studio-body">{t.body}</p>
        <div className="studio-actions">
          <Link className="studio-primary" to="/contact">{t.primary}<span aria-hidden="true">↗</span></Link>
          <Link className="studio-secondary" to="/work">{t.secondary}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="studio-showcase">
        <WaterVisual paused={paused} />
        {!reduced && <button type="button" className="ribbon-motion" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? t.resumeMotion : t.pauseMotion}<span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>}
      </div>
    </div>
    <div className="studio-bottom"><p>{t.bottom}</p><span>{t.values[2]}</span><a href="#who" aria-label={c.hero.scroll}>↓</a></div>
  </section>
}
