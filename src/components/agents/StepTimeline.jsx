import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Numbered steps joined by a line that draws with scroll; each step lights up
 * once the line reaches it. Horizontal on desktop, vertical on phones (CSS).
 * CSS shows every step lit with the line drawn. JavaScript adds .is-armed to
 * start from the unlit state, so nothing is hidden if scripts fail, and
 * reduced motion keeps the finished state.
 */
export function StepTimeline({ steps }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useGSAP(() => {
    const el = ref.current
    if (!el || reduced) return
    const items = [...el.querySelectorAll('.timeline-step')]
    const update = progress => {
      el.style.setProperty('--progress', progress.toFixed(4))
      items.forEach((item, i) => item.classList.toggle('is-lit', progress >= i / Math.max(items.length - 1, 1) - 0.001))
    }
    el.classList.add('is-armed')
    const trigger = ScrollTrigger.create({ trigger: el, start: 'top 75%', end: 'bottom 45%', onUpdate: self => update(self.progress) })
    update(trigger.progress)
    return () => { el.classList.remove('is-armed'); el.style.removeProperty('--progress'); items.forEach(item => item.classList.remove('is-lit')) }
  }, { scope: ref, dependencies: [reduced, steps.length] })
  return (
    <div className="timeline" ref={ref}>
      <span className="timeline-line" aria-hidden="true"><span /></span>
      <ol>
        {steps.map((step, i) => (
          <li className="timeline-step" key={i}>
            <span className="timeline-dot" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
