import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'expo.out' })

export { gsap, ScrollTrigger, useGSAP }

// Group split words into visual lines by their untransformed position.
export function groupLines(words) {
  const lines = []
  let lastTop = null
  for (const word of words) {
    const top = word.parentElement.offsetTop
    if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top }
    lines[lines.length - 1].push(word)
  }
  return lines
}

// Element box relative to an ancestor, ignoring CSS transforms.
export function offsetRect(el, root) {
  let x = 0, y = 0, node = el
  while (node && node !== root) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent }
  if (node !== root) {
    const a = el.getBoundingClientRect(), b = root.getBoundingClientRect()
    return { left: a.left - b.left, top: a.top - b.top, right: a.right - b.left, bottom: a.bottom - b.top }
  }
  return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight }
}
