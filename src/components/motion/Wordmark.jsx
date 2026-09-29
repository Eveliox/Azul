import { useEffect, useRef } from 'react'

/**
 * Full-bleed wordmark. Each letter sits in its own mask so it can rise into
 * view. Masks clip only the entrance, never the finished glyph: they are tall
 * enough for the whole letter, including the bowl of the "u".
 *
 * Sizing: after fonts load, the ink width of the word is measured once as a
 * ratio of font size (--wm-ratio). CSS then sets
 * font-size = (container width − edges) / ratio with container query units,
 * so the ink spans edge to edge at every width with no resize work.
 */
export function Wordmark({ text }) {
  const wrap = useRef(null)
  useEffect(() => {
    const el = wrap.current
    const row = el.querySelector('.wordmark')
    const measure = () => {
      const letters = row.querySelectorAll('.wordmark-letter')
      if (!letters.length) return
      const style = getComputedStyle(row)
      const size = parseFloat(style.fontSize)
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`
      const first = letters[0], last = letters[letters.length - 1]
      const inkLeft = first.offsetLeft - ctx.measureText(first.textContent).actualBoundingBoxLeft
      const inkRight = last.offsetLeft + ctx.measureText(last.textContent).actualBoundingBoxRight
      const ink = inkRight - inkLeft
      if (!(ink > 0)) return
      const ratio = (ink / size).toFixed(4)
      const shift = ((row.offsetWidth / 2 - (inkLeft + inkRight) / 2) / size).toFixed(4)
      // Only write on change: the new size resizes the row, which re-runs this.
      if (el.style.getPropertyValue('--wm-ratio') !== ratio) el.style.setProperty('--wm-ratio', ratio)
      if (el.style.getPropertyValue('--wm-shift') !== shift) el.style.setProperty('--wm-shift', shift)
    }
    measure()
    // Re-measure when the web font swaps in (row size changes) or finishes loading.
    const resize = new ResizeObserver(measure)
    resize.observe(row)
    document.fonts?.ready.then(measure)
    document.fonts?.addEventListener('loadingdone', measure)
    return () => { resize.disconnect(); document.fonts?.removeEventListener('loadingdone', measure) }
  }, [text])
  return (
    <div className="wordmark-wrap" ref={wrap}>
      <div className="wordmark" role="img" aria-label={text}>
        {[...text].map((letter, i) => (
          <span className="wordmark-mask" key={i} aria-hidden="true" data-dot-avoid><span className="wordmark-letter">{letter}</span></span>
        ))}
      </div>
    </div>
  )
}
