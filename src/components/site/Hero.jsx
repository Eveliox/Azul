import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion, useFinePointer } from '../../hooks/useMediaQuery'
import { GrowthPhone } from './GrowthPhone'

export function Hero({ introReady }) {
  const { c, lang } = useLanguage()
  const t = c.hero.studio
  const reduced = useReducedMotion()
  const finePointer = useFinePointer()
  const ref = useRef(null)
  const [paused, setPaused] = useState(false)
  const still = paused || reduced
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => document.body.classList.toggle('home-hero-visible', entry.isIntersecting))
    observer.observe(ref.current)
    return () => { observer.disconnect(); document.body.classList.remove('home-hero-visible') }
  }, [])
  useEffect(() => {
    const el = ref.current
    const reset = () => { el.style.setProperty('--phone-x', '0deg'); el.style.setProperty('--phone-y', '0deg') }
    reset()
    if (still || !finePointer) return
    let frame = 0
    let rect = el.getBoundingClientRect()
    const refreshRect = () => { rect = el.getBoundingClientRect() }
    const move = event => {
      if (event.pointerType !== 'mouse') return
      const x = event.clientX, y = event.clientY
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const nx = (y - rect.top) / rect.height * 2 - 1
        const ny = (x - rect.left) / rect.width * 2 - 1
        el.style.setProperty('--phone-x', `${Math.max(-1, Math.min(1, nx)) * -4}deg`)
        el.style.setProperty('--phone-y', `${Math.max(-1, Math.min(1, ny)) * 4}deg`)
      })
    }
    const leave = () => { cancelAnimationFrame(frame); reset() }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    window.addEventListener('resize', refreshRect, { passive: true })
    window.addEventListener('scroll', refreshRect, { passive: true })
    return () => { cancelAnimationFrame(frame); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); window.removeEventListener('resize', refreshRect); window.removeEventListener('scroll', refreshRect); reset() }
  }, [still, finePointer])
  return <section ref={ref} className={`studio-hero growth-hero${still ? ' is-still' : ''}${introReady ? ' is-ready' : ''}`} data-language={lang} aria-labelledby="studio-title">
    <div className="hero-film-grain" aria-hidden="true" />
    <button type="button" className="ribbon-motion" onClick={() => setPaused(value => !value)} aria-pressed={still} disabled={reduced}>{reduced ? t.pauseMotion : paused ? t.resumeMotion : t.pauseMotion}<span aria-hidden="true">{still ? '▷' : 'Ⅱ'}</span></button>
    <div className="studio-copy"><h1 id="studio-title">{t.lineOne} <span>{t.lineTwo}</span></h1><p className="studio-body">{t.body}</p></div>
    <div className="studio-showcase">
      <p className="sr-only">{lang === 'es' ? 'Demostración de Azul Growth: $48,320 de ingresos, 312 clientes, 42 trabajos agendados y respuesta media de 47 segundos. Datos ilustrativos.' : 'Azul Growth demo: $48,320 revenue, 312 leads, 42 booked jobs, and an average reply of 47 seconds. Illustrative data.'}</p>
      <GrowthPhone lang={lang} still={still} ready={introReady} />
    </div>
    <div className="studio-actions"><Link className="studio-primary" to="/contact">{t.primary}<span aria-hidden="true">↗</span></Link><Link className="studio-secondary" to="/work">{t.secondary}<span aria-hidden="true">→</span></Link></div>
  </section>
}
