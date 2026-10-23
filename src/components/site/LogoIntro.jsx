import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BrandLogo } from './BrandLogo'
import { useReducedMotion } from '../../hooks/useMediaQuery'

let shown = false

/** One short brand introduction per page load, with a bounded loading wait. */
export function LogoIntro({ onComplete }) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(() => !shown)
  const [leaving, setLeaving] = useState(false)
  const complete = useRef(onComplete)
  complete.current = onComplete

  useEffect(() => {
    if (!visible || reduced) {
      shown = true
      setVisible(false)
      complete.current()
      return
    }
    let cancelled = false
    let exitTimer
    let minimumTimer
    const controller = new AbortController()
    const image = new Image()
    image.src = '/Azul%20Gradient%20Ribbon%20Logo.png'
    const minimum = new Promise(resolve => { minimumTimer = setTimeout(resolve, 850) })
    const loaded = new Promise(resolve => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true, signal: controller.signal })
    })
    function finish() {
      if (cancelled || exitTimer) return
      shown = true
      setLeaving(true)
      complete.current()
      exitTimer = setTimeout(() => setVisible(false), 400)
    }
    const fallback = setTimeout(finish, 2500)
    Promise.all([minimum, loaded, image.decode().catch(() => {})]).then(finish)
    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(minimumTimer)
      clearTimeout(fallback)
      clearTimeout(exitTimer)
    }
  }, [visible, reduced])

  return visible && !reduced ? createPortal(
    <div className={`logo-intro${leaving ? ' is-leaving' : ''}`} aria-hidden="true"><BrandLogo /></div>,
    document.body,
  ) : null
}
