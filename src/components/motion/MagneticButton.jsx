import { forwardRef, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'

// Pulls toward the cursor while hovered, then settles back. Mouse only.
export const MagneticButton = forwardRef(function MagneticButton({ as: Tag = 'button', strength = 0.35, children, ...props }, forwarded) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const setRef = node => {
    ref.current = node
    if (typeof forwarded === 'function') forwarded(node)
    else if (forwarded) forwarded.current = node
  }
  useGSAP(() => {
    const el = ref.current
    if (!el || !fine || reduced) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = e => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2 - gsap.getProperty(el, 'x')
      const cy = r.top + r.height / 2 - gsap.getProperty(el, 'y')
      xTo((e.clientX - cx) * strength)
      yTo((e.clientY - cy) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, { dependencies: [fine, reduced, strength], revertOnUpdate: true })
  return <Tag ref={setRef} {...props}>{children}</Tag>
})
