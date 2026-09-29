import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useLanguage } from '../../contexts/LanguageContext'

export function HeroFilm() {
  const { c } = useLanguage()
  const reduced = useReducedMotion()
  const video = useRef(null)
  const [requested, setRequested] = useState(!reduced)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => { setRequested(!reduced) }, [reduced])
  useEffect(() => {
    const media = video.current
    if (!media || failed) return
    let inView = false
    const sync = () => {
      if (requested && inView && !document.hidden) media.play().catch(() => setPlaying(false))
      else media.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync() }, { threshold: 0.05 })
    observer.observe(media.closest('.hero'))
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); media.pause() }
  }, [requested, failed])

  return <>
    <div className="hero-bg" aria-hidden="true">
      <img className="hero-image hero-wave-poster" src="/images/hero-waves.jpg" alt="" fetchPriority="high" />
      {!failed && <video ref={video} className={`hero-film ${ready ? 'is-ready' : ''}`} src={!reduced || requested ? '/videos/hero-waves.mp4' : undefined} poster="/images/hero-waves.jpg" muted loop playsInline preload={reduced ? 'none' : 'metadata'} onPlaying={() => { setReady(true); setPlaying(true) }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false) }} />}
      <div className="hero-shade" />
      <div className="hero-darken" />
      <div className="hero-curtain" />
    </div>
    {!failed && <button className="hero-film-control" data-dot-avoid aria-label={playing ? c.hero.pause : c.hero.play} onClick={() => { if (playing) setRequested(false); else { setRequested(true); video.current?.play().catch(() => {}) } }}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span><span>{playing ? c.hero.pause : c.hero.play}</span></button>}
  </>
}
