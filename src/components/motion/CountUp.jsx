import { useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Counts from 0 to `to` when scrolled into view. Pass `text` instead of `to`
 * for a non-numeric value, which slides up from a mask.
 * The final value renders first, so it is correct without JavaScript.
 */
export function CountUp({ to = 0, decimals = 0, prefix = '', suffix = '', text, duration = 1.8, className = '' }) {
  const { lang } = useLanguage()
  const format = useMemo(() => new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }), [lang, decimals])
  const finalText = text ?? `${prefix}${format.format(to)}${suffix}`
  const ref = useRef(null)
  const number = useRef(null)
  useReveal(ref, () => {
    const tl = gsap.timeline({ paused: true })
    if (text) {
      tl.from(number.current, { yPercent: 115, duration: 1.1, ease: 'expo.out' })
    } else {
      const counter = { value: 0 }
      const render = () => { if (number.current) number.current.textContent = format.format(counter.value) }
      render()
      tl.to(counter, { value: to, duration, ease: 'power3.out', onUpdate: render })
    }
    return tl
  }, { dependencies: [finalText] })
  return (
    <span className={`count-up ${className}`.trim()} ref={ref}>
      <span className="sr-only">{finalText}</span>
      {text
        ? <span className="split-mask" aria-hidden="true"><span className="split-word" ref={number}>{text}</span></span>
        : <span aria-hidden="true">{prefix}<span ref={number}>{format.format(to)}</span>{suffix}</span>}
    </span>
  )
}
