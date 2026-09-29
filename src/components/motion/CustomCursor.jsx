import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'

// A small dot that grows into a "View" circle over images and links.
// Mouse devices only; hidden while a dialog is open and over text fields.
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  if (!fine || reduced) return null
  return <Cursor />
}

function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    const root = document.documentElement
    const cursor = ref.current
    const ball = cursor.querySelector('.cursor-ball')
    const label = cursor.querySelector('.cursor-label')
    root.classList.add('has-custom-cursor')
    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    gsap.set(ball, { scale: 0.12 })
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3.out' })
    let state = ''
    let visible = false
    const show = on => {
      if (on === visible) return
      visible = on
      gsap.to(cursor, { autoAlpha: on ? 1 : 0, duration: 0.25, overwrite: 'auto' })
    }
    const setState = (next, text = '') => {
      if (next === state && label.textContent === text) return
      state = next
      label.textContent = text
      const scale = next === 'view' ? 1 : next === 'press' ? 0.4 : 0.12
      gsap.to(ball, { scale, duration: 0.45, ease: 'expo.out', overwrite: true })
      gsap.to(label, { autoAlpha: next === 'view' ? 1 : 0, duration: 0.25, overwrite: true })
    }
    const move = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const target = e.target instanceof Element ? e.target : null
      if (!target || target.closest('dialog') || target.closest('input, textarea, select')) { show(false); return }
      if (!visible) { xTo(e.clientX, e.clientX); yTo(e.clientY, e.clientY) } else { xTo(e.clientX); yTo(e.clientY) }
      show(true)
      const view = target.closest('[data-cursor]')
      if (view) setState('view', view.getAttribute('data-cursor') || 'View')
      else if (target.closest('a[href]')) setState('view', 'View')
      else if (target.closest('button, [role="button"], label, [tabindex]:not([tabindex="-1"])')) setState('press')
      else setState('dot')
    }
    const leave = () => show(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
      gsap.killTweensOf([cursor, ball, label])
    }
  }, [])
  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor-ball" />
      <span className="cursor-label" />
    </div>
  )
}
