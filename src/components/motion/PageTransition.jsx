import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useLenis } from './SmoothScroll'

/**
 * Route changes: a dark panel wipes in from the left, the new page mounts
 * underneath while covered, then the panel wipes out to the right.
 * Renders children(displayLocation) so the old page stays until covered.
 */
export function PageTransition({ children }) {
  const location = useLocation()
  const [display, setDisplay] = useState(location)
  const panel = useRef(null)
  const lenis = useLenis()
  const reduced = useReducedMotion()
  const latest = useRef(location)
  const shown = useRef(location)
  const covering = useRef(false)
  const mounted = useRef(false)
  latest.current = location

  const cover = useCallback(() => {
    covering.current = true
    gsap.fromTo(panel.current, { xPercent: -100, autoAlpha: 1 }, {
      xPercent: 0, duration: 0.55, ease: 'power3.inOut', overwrite: true,
      onComplete: () => setDisplay(latest.current),
    })
  }, [])

  useEffect(() => {
    if (location.pathname === shown.current.pathname) {
      if (location.key !== shown.current.key && !covering.current) setDisplay(location)
      return
    }
    if (reduced || !panel.current) { setDisplay(location); return }
    if (!covering.current) cover()
  }, [location, reduced, cover])

  useLayoutEffect(() => {
    const wasCovered = covering.current
    const samePage = shown.current.pathname === display.pathname
    shown.current = display
    const first = !mounted.current
    mounted.current = true
    const target = display.hash ? document.getElementById(decodeURIComponent(display.hash.slice(1))) : null
    const smooth = samePage && !first && !wasCovered
    if (target) {
      if (lenis?.current) lenis.current.scrollTo(target, { offset: -90, immediate: !smooth, force: true })
      else target.scrollIntoView({ behavior: smooth && !reduced ? 'smooth' : 'auto' })
    } else if (!first && !samePage) {
      lenis?.current?.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    }
    if (!wasCovered) return
    ScrollTrigger.refresh()
    gsap.to(panel.current, {
      xPercent: 100, duration: 0.6, delay: 0.05, ease: 'power3.inOut', overwrite: true,
      onComplete: () => {
        gsap.set(panel.current, { autoAlpha: 0, xPercent: -100 })
        covering.current = false
        // Another navigation happened while the panel was up.
        if (latest.current.pathname !== shown.current.pathname) cover()
      },
    })
  }, [display, lenis, reduced, cover])

  return <>{children(display)}<div className="page-wipe" ref={panel} aria-hidden="true" /></>
}
