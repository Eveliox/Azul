import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'
import { useLanguage } from '../../contexts/LanguageContext'

const WEEK = 168
const rows = [{ key: 'employee', hours: 40 }, { key: 'agent', hours: WEEK }]

/**
 * 40 vs 168 hours. On scroll the bars fill from the left while their numbers
 * count up in step; the agent bar keeps a soft glow afterwards (CSS).
 * Bars and numbers render at their final values, so they are correct
 * without JavaScript and with reduced motion.
 */
export function HoursComparison() {
  const { c } = useLanguage()
  const h = c.agents.hours
  const ref = useRef(null)
  useReveal(ref, el => {
    const tl = gsap.timeline({ paused: true })
    el.querySelectorAll('.hours-row').forEach((row, i) => {
      const fill = row.querySelector('.hours-fill')
      const number = row.querySelector('.hours-number')
      const counter = { value: 0 }
      number.textContent = '0'
      const at = i * 0.25
      tl.from(fill, { scaleX: 0, duration: 1.8, ease: 'expo.inOut' }, at)
        .to(counter, { value: rows[i].hours, duration: 1.8, ease: 'expo.inOut', onUpdate: () => { number.textContent = Math.round(counter.value) } }, at)
    })
    return tl
  }, { start: 'top 80%' })
  return (
    <div className="hours" ref={ref}>
      <p className="hours-label">{h.label}</p>
      {rows.map(row => (
        <div className={`hours-row is-${row.key}`} key={row.key}>
          <div className="hours-heading">
            <span>{h[row.key]}</span>
            <span className="sr-only">{row.hours} {h.unit}</span>
            <strong aria-hidden="true"><span className="hours-number">{row.hours}</span> <small>{h.unit}</small></strong>
          </div>
          <div className="hours-track" aria-hidden="true">
            <span className="hours-fill" style={{ '--fill': row.hours / WEEK }}><span /></span>
          </div>
        </div>
      ))}
      <p className="hours-note">{h.note}</p>
    </div>
  )
}
