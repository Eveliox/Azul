import { motion } from 'framer-motion'

const variants = {
  up: { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -32 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
}

export default function Reveal({
  children,
  as: Tag = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  once = true,
  className = '',
  stagger = 0,
}) {
  const MotionTag = motion[Tag] || motion.div

  if (stagger > 0) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants[direction]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ children, as: Tag = 'div', direction = 'up', className = '', duration = 0.6 }) {
  const MotionTag = motion[Tag] || motion.div
  return (
    <MotionTag
      className={className}
      variants={variants[direction]}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
