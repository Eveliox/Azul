import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function MagneticButton({
  as: Tag = 'a',
  strength = 0.35,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const innerX = useTransform(sx, (v) => v * 0.5)
  const innerY = useTransform(sy, (v) => v * 0.5)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const MotionTag = motion[Tag] || motion.a

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      <motion.span style={{ x: innerX, y: innerY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {children}
      </motion.span>
    </MotionTag>
  )
}
