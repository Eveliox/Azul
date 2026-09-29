import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useReducedMotion } from './useMediaQuery'

/**
 * Plays a paused GSAP timeline when `ref` scrolls into view.
 *
 * `build(el)` returns a paused timeline whose from-states hide the content.
 * The trigger is the (never clipped) container, not the masked children, so it
 * always fires. Failsafe: once the container has been on screen for
 * `failsafe` ms and the timeline still has not run, it jumps to the end.
 * Text is never left invisible. Reduced motion skips everything.
 */
export function useReveal(ref, build, { start = 'top 88%', failsafe = 1500, enabled = true, dependencies = [] } = {}) {
  const reduced = useReducedMotion()
  const done = useRef(false)
  useGSAP(() => {
    const el = ref.current
    if (!el || reduced || !enabled || done.current) return
    const tl = build(el)
    if (!tl) return
    tl.eventCallback('onComplete', () => { done.current = true })
    const play = () => { if (tl.progress() === 0 && !tl.isActive()) tl.play() }
    const trigger = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play })
    if (trigger.progress > 0) play()

    let timer = null
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !timer) {
        timer = setTimeout(() => { if (tl.progress() < 1 && !tl.isActive()) tl.progress(1) }, failsafe)
      } else if (!entry.isIntersecting) { clearTimeout(timer); timer = null }
    })
    observer.observe(el)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, { scope: ref, dependencies: [reduced, enabled, ...dependencies], revertOnUpdate: true })
}
