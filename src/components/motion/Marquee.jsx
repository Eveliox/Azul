import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Infinite horizontal loop that eases to a stop on hover or keyboard focus.
 * Only the first copy of the items is exposed to assistive tech and Tab.
 * `renderItem(item, index, hidden)` must honor `hidden`.
 * Reduced motion renders a single static row.
 */
export function Marquee({ items, renderItem, speed = 45, repeat = 2, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useGSAP((context, contextSafe) => {
    if (reduced) return
    const root = ref.current
    const track = root.querySelector('.marquee-track')
    const group = track.firstElementChild
    let loop = null
    let width = 0
    const build = () => {
      if (group.offsetWidth === width) return
      width = group.offsetWidth
      const progress = loop ? loop.progress() : 0
      loop?.kill()
      loop = gsap.fromTo(track, { x: 0 }, { x: -width, duration: width / speed, ease: 'none', repeat: -1 }).progress(progress)
    }
    build()
    const resize = new ResizeObserver(contextSafe(build))
    resize.observe(group)
    const pause = contextSafe(() => loop && gsap.to(loop, { timeScale: 0, duration: 0.35, ease: 'power2.out', overwrite: true }))
    const resume = contextSafe(() => loop && gsap.to(loop, { timeScale: 1, duration: 0.8, ease: 'power2.in', overwrite: true }))
    const focusOut = e => { if (!root.contains(e.relatedTarget)) resume() }
    root.addEventListener('pointerenter', pause)
    root.addEventListener('pointerleave', resume)
    root.addEventListener('focusin', pause)
    root.addEventListener('focusout', focusOut)
    return () => {
      resize.disconnect()
      root.removeEventListener('pointerenter', pause)
      root.removeEventListener('pointerleave', resume)
      root.removeEventListener('focusin', pause)
      root.removeEventListener('focusout', focusOut)
    }
  }, { scope: ref, dependencies: [reduced, items.length, speed], revertOnUpdate: true })

  if (reduced) return <div className={`marquee marquee--static ${className}`.trim()}>{items.map((item, i) => renderItem(item, i, false))}</div>
  const copies = Array.from({ length: repeat })
  return (
    <div ref={ref} className={`marquee ${className}`.trim()}>
      <div className="marquee-track">
        {[0, 1].map(group => (
          <div className="marquee-group" key={group} aria-hidden={group ? 'true' : undefined}>
            {copies.map((_, copy) => items.map((item, i) => {
              const hidden = group > 0 || copy > 0
              return <div className="marquee-item" key={`${copy}-${i}`}>{renderItem(item, i, hidden)}</div>
            }))}
          </div>
        ))}
      </div>
    </div>
  )
}
