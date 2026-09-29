import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'

// Image that wipes in from the bottom with a slight zoom-out, then drifts
// with scroll. Parallax is off on touch devices and with reduced motion.
export function ImageReveal({ src, alt, className = '', cursor, parallax = true }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  useReveal(ref, el => {
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' })
      .from(el.querySelector('img'), { scale: 1.08, duration: 1.4, ease: 'expo.out' }, 0.1)
    return tl
  }, { start: 'top 85%', dependencies: [src] })
  useGSAP(() => {
    if (!parallax || !fine || reduced) return
    gsap.fromTo(ref.current.querySelector('.image-reveal-inner'), { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }, { scope: ref, dependencies: [parallax, fine, reduced] })
  return (
    <div ref={ref} className={`image-reveal ${className}`.trim()} data-cursor={cursor}>
      <div className="image-reveal-inner"><img src={src} alt={alt} loading="lazy" decoding="async" /></div>
    </div>
  )
}
