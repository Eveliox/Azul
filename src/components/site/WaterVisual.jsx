import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/** An abstract water field: continuous contours, no faceted mesh or footage. */
export function WaterVisual({ paused }) {
  const canvas = useRef(null)
  const phase = useRef(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = canvas.current, ctx = el.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, frame = 0, last = 0, visible = false
    let targetX = 0, targetY = 0, px = 0, py = 0
    const still = paused || reduced
    let rows = 72, points = 120, gradients = []
    const rebuildGradients = () => {
      gradients = Array.from({ length: rows }, (_, row) => {
        const strength = Math.pow(Math.sin(row / (rows - 1) * Math.PI), .65)
        const gradient = ctx.createLinearGradient(width * .06, 0, width * .96, height * .65)
        gradient.addColorStop(0, 'rgba(91,135,255,0)')
        gradient.addColorStop(.18, `rgba(100,150,255,${strength * .45})`)
        gradient.addColorStop(.43, `rgba(38,90,235,${strength * .8})`)
        gradient.addColorStop(.66, `rgba(25,59,174,${strength * .9})`)
        gradient.addColorStop(.84, `rgba(72,111,234,${strength * .5})`)
        gradient.addColorStop(1, 'rgba(91,135,255,0)')
        return { gradient, strength }
      })
    }
    function draw(time) {
      frame = 0
      if (!visible || document.hidden || !width || !height) { last = 0; return }
      if (!still && last && time - last < 32) { frame = requestAnimationFrame(draw); return }
      if (!still && last) phase.current += Math.min(time - last, 50) * .00042
      last = time
      px += (targetX - px) * .06; py += (targetY - py) * .06
      ctx.clearRect(0, 0, width, height)
      const scale = Math.min(width, height) * .16
      const ax = .83 + py * .11, az = -.16 + px * .04
      const cosAx = Math.cos(ax), sinAx = Math.sin(ax), cosAz = Math.cos(az), sinAz = Math.sin(az)
      const swell = (x, z) => Math.sin(x * 1.6 + z * .6 - phase.current) * .48
        + Math.sin(x * 2.7 - z * .9 - phase.current * .72) * .13
        + Math.sin(x * 5 + z * 2.1 - phase.current * 1.15) * .018
      const project = (x, z) => {
        const y = -swell(x, z)
        const ry = y * cosAx - z * sinAx
        const rz = y * sinAx + z * cosAx
        const perspective = 6 / (6 + rz)
        return [width * .5 + (x * cosAz - ry * sinAz) * scale * perspective,
          height * .5 + (x * sinAz + ry * cosAz) * scale * perspective]
      }
      // Far contours first. Opacity tapers through the depth as well as at
      // each end, so the field has no rectangular, cloth-like perimeter.
      for (let row = 0; row < rows; row++) {
        const t = row / (rows - 1), z = 1.7 - t * 3.4
        const { gradient, strength } = gradients[row]
        ctx.beginPath()
        for (let point = 0; point <= points; point++) {
          const x = -2.8 + point / points * 5.6
          const [sx, sy] = project(x, z)
          if (!point) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
        }
        ctx.strokeStyle = gradient
        ctx.lineWidth = .8 + strength * .2
        ctx.stroke()
      }
      if (!still) frame = requestAnimationFrame(draw)
    }
    const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw) }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height
      rows = width < 600 ? 48 : 72; points = width < 600 ? 80 : 120
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      el.width = Math.round(width * dpr); el.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); rebuildGradients(); start()
    })
    resize.observe(el)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; last = 0 }
    })
    observer.observe(el)
    const move = e => { if (still || e.pointerType !== 'mouse') return; const r = el.getBoundingClientRect(); targetX = (e.clientX - r.left) / r.width - .5; targetY = (e.clientY - r.top) / r.height - .5 }
    const reset = () => { targetX = 0; targetY = 0 }
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; last = 0 } else start() }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset); document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); document.removeEventListener('visibilitychange', visibility) }
  }, [paused, reduced])
  return <canvas ref={canvas} className="abstract-water" aria-hidden="true" />
}
