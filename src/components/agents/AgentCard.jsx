import { useId, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Example agent. The front shows the role; the back shows what it does and
 * the tools it connects to. Mouse users flip it on hover (CSS); touch and
 * keyboard users flip it with the button, which sits outside both faces so
 * it stays reachable either way. Screen readers get both faces in order.
 */
export function AgentCard({ index, agent, tools }) {
  const { c } = useLanguage()
  const d = c.agents.detail
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <article className={`agent-card ${open ? 'is-open' : ''}`.trim()}>
      <div className="agent-card-inner">
        <div className="agent-card-face agent-card-front">
          <span className="agent-card-index">{String(index + 1).padStart(2, '0')}</span>
          <h3>{agent.name}</h3>
          <p>{agent.short}</p>
        </div>
        <div className="agent-card-face agent-card-back" id={id}>
          <p className="agent-card-label">{d.whatItDoes}</p>
          <p>{agent.does}</p>
          <p className="agent-card-label">{d.toolsLabel}</p>
          <ul className="agent-card-tools">{tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
        </div>
      </div>
      <button type="button" className="agent-card-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(v => !v)}>
        <span className="sr-only">{open ? d.hideDetails : d.showDetails}: {agent.name}</span>
        <span aria-hidden="true">+</span>
      </button>
    </article>
  )
}
