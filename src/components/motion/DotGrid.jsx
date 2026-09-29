import { useEffect, useRef } from 'react'
import { gsap, offsetRect, useGSAP } from '../../lib/gsap'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import { useLanguage } from '../../contexts/LanguageContext'

const DEFAULT_AVOID = 'h1, h2, p, a, button, [data-dot-avoid]'

/**
 * Decorative dot grid for a positioned section. It sits behind all text
 * (z-index 0) and hides every dot within `gap` px of a text block matched by
 * `avoid`. Dots twinkle; with a mouse they also drift with the pointer and
 * with scroll.
 */
export function DotGrid({ cols = 8, rows = 6, avoid = DEFAULT_AVOID, gap = 24, className = '' }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const { lang } = useLanguage()

  useEffect(() => {
    const layer = ref.current
    const section = layer?.parentElement
    if (!section) return
    const dots = [...layer.querySelectorAll('.dot')]
    // Extra margin covers the small drift, so dots never slide into text.
    const margin = gap + 12
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const blocks = [...section.querySelectorAll(avoid)]
          .filter(el => !layer.contains(el) && el.offsetWidth > 0)
          .map(el => offsetRect(el, section))
        for (const dot of dots) {
          const r = offsetRect(dot, section)
          const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2
          const near = blocks.some(b => x > b.left - margin && x < b.right + margin && y > b.top - margin && y < b.bottom + margin)
          dot.classList.toggle('is-hidden', near)
        }
      })
    }
    update()
    document.fonts?.ready.then(update)
    const resize = new ResizeObserver(update)
    resize.observe(section)
    return () => { cancelAnimationFrame(frame); resize.disconnect() }
  }, [avoid, gap, lang, cols, rows])

  useGSAP((context, contextSafe) => {
    if (reduced) return
    const layer = ref.current
    layer.querySelectorAll('.dot').forEach(dot => {
      gsap.to(dot, { opacity: 'random(0.12, 1)', duration: 'random(1.2, 3.2)', delay: 'random(0, 3)', ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true })
    })
    if (!fine) return
    gsap.fromTo(layer, { y: -24 }, { y: 24, ease: 'none', scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    const drift = layer.firstElementChild
    const xTo = gsap.quickTo(drift, 'x', { duration: 1.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(drift, 'y', { duration: 1.4, ease: 'power3.out' })
    const move = contextSafe(e => { xTo((e.clientX / window.innerWidth - 0.5) * -18); yTo((e.clientY / window.innerHeight - 0.5) * -18) })
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, { scope: ref, dependencies: [reduced, fine, cols, rows], revertOnUpdate: true })

  return (
    <div ref={ref} className={`dot-grid ${className}`.trim()} aria-hidden="true">
      <div className="dot-grid-drift">
        {Array.from({ length: cols * rows }, (_, i) => (
          <i key={i} className="dot" style={{ left: `${((i % cols) + 0.5) / cols * 100}%`, top: `${(Math.floor(i / cols) + 0.5) / rows * 100}%` }} />
        ))}
      </div>
    </div>
  )
}
