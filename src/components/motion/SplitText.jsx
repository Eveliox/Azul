import { Fragment, useRef } from 'react'
import { gsap, groupLines } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'

/**
 * Splits text into lines (on "\n" and on visual wrapping) and words.
 * Each word sits in its own mask; words on the same visual line slide up
 * together, so every line rises from behind its mask.
 * Pass reveal={false} when a parent timeline animates `.split-word` itself.
 */
export function SplitText({ as: Tag = 'h2', children, className = '', reveal = true, stagger = 0.09, start, ...rest }) {
  const text = String(children ?? '')
  const ref = useRef(null)
  useReveal(ref, el => {
    const tl = gsap.timeline({ paused: true })
    groupLines(el.querySelectorAll('.split-word')).forEach((words, i) => {
      tl.from(words, { yPercent: 115, duration: 1.1, ease: 'expo.out' }, i * stagger)
    })
    return tl
  }, { enabled: reveal, start, dependencies: [text] })
  return (
    <Tag ref={ref} className={`split ${className}`.trim()} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split('\n').map((line, i) => {
          const words = line.split(/\s+/).filter(Boolean)
          return (
            <span className="split-line" key={i}>
              {words.map((word, j) => (
                <Fragment key={j}>
                  <span className="split-mask"><span className="split-word">{word}</span></span>
                  {j < words.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
