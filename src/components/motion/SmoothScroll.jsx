import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useMediaQuery'

const ScrollContext = createContext(null)

// Lenis drives the native scroll position from GSAP's ticker, so ScrollTrigger
// and Lenis share one clock and never drift apart.
export function SmoothScroll({ children }) {
  const instance = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -90 }, autoRaf: false })
    instance.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      instance.current = null
    }
  }, [reduced])
  useEffect(() => {
    // Web fonts change text metrics after first layout.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])
  return <ScrollContext.Provider value={instance}>{children}</ScrollContext.Provider>
}

export const useLenis = () => useContext(ScrollContext)

export function useScrollLock(locked) {
  const scroll = useLenis()
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scroll?.current?.stop()
    return () => { document.body.style.overflow = previous; scroll?.current?.start() }
  }, [locked, scroll])
}
