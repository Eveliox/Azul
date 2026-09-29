import { useLanguage } from '../../contexts/LanguageContext'

// A dot circles a ring of 24 hour ticks, once every 24 seconds. CSS only, so
// the global reduced-motion rule stops it.
export function AgentOrbit({ className = '' }) {
  const { c } = useLanguage()
  const o = c.agents.orbit
  return (
    <figure className={`agent-orbit ${className}`.trim()}>
      <div className="agent-orbit-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <circle className="agent-orbit-track" cx="100" cy="100" r="88" />
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} className={i % 6 === 0 ? 'is-major' : ''} x1="100" y1={i % 6 === 0 ? 4 : 7} x2="100" y2="14" transform={`rotate(${i * 15} 100 100)`} />
          ))}
        </svg>
        <div className="agent-orbit-spin"><span className="agent-orbit-dot" /></div>
        <strong>{o.label}</strong>
      </div>
      <figcaption><span className="sr-only">{o.sr}</span><span aria-hidden="true">{o.caption}</span></figcaption>
    </figure>
  )
}
