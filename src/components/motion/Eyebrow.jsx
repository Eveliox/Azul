import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'

// Section label: the blue square spins in, then the text types in.
export function SectionEyebrow({ children }) {
  const text = String(children ?? '')
  const ref = useRef(null)
  useReveal(ref, el => {
    const chars = el.querySelectorAll('.eyebrow-char')
    const tl = gsap.timeline({ paused: true })
    tl.from(el.querySelector('.eyebrow-square'), { scale: 0, rotate: -270, duration: 0.8, ease: 'back.out(2.2)' })
      .from(chars, { opacity: 0, duration: 0.01, ease: 'none', stagger: Math.min(0.035, 0.9 / Math.max(chars.length, 1)) }, 0.35)
    return tl
  }, { dependencies: [text] })
  return (
    <p className="eyebrow" ref={ref}>
      <span className="eyebrow-square" aria-hidden="true" />
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{[...text].map((ch, i) => <span className="eyebrow-char" key={i}>{ch}</span>)}</span>
    </p>
  )
}
