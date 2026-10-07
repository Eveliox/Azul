import { useState } from 'react'
import { Icon } from './DashboardVisuals.jsx'
import './agent-studio.css'

const ROLES = [
  { id: 'reception', name: 'Bilingual Receptionist', icon: 'phone', summary: 'A thoughtful first conversation.', trigger: 'A customer calls or sends a message', work: 'Gather the details and prepare a booking or callback', handoff: 'Your team handles exceptions and complex questions' },
  { id: 'dispatch', name: 'Dispatcher', icon: 'pin', summary: 'Keep the day moving.', trigger: 'A new job arrives or the schedule changes', work: 'Prepare crew assignments and customer updates', handoff: 'A dispatcher approves schedule changes' },
  { id: 'estimates', name: 'Estimate Follow-Up', icon: 'send', summary: 'Give every quote a next step.', trigger: 'An estimate is waiting for a response', work: 'Draft a relevant follow-up and organize the reply', handoff: 'Your team approves pricing and closes the job' },
  { id: 'reviews', name: 'Review Requester', icon: 'star', summary: 'Make room for customer feedback.', trigger: 'A completed job is ready for follow-up', work: 'Prepare a thank-you and review invitation', handoff: 'Your team responds to feedback that needs attention' },
  { id: 'paperwork', name: 'Permit & Paperwork Assistant', icon: 'building', summary: 'Stay ahead of the details.', trigger: 'A permit, inspection, or warranty needs attention', work: 'Organize requirements and upcoming deadlines', handoff: 'Your team verifies documents before submission' },
  { id: 'social', name: 'Social Media Coordinator', icon: 'share', summary: 'Turn real work into your next post.', trigger: 'Your team shares approved job photos', work: 'Draft a post in English and Spanish', handoff: 'An owner reviews the content before publication' },
]

export default function AgentStudio() {
  const [selected, setSelected] = useState(ROLES[0].id)
  const role = ROLES.find((item) => item.id === selected)
  return <section className="agent-studio" aria-label="AI agent role examples">
    <div className="agent-studio-intro">
      <div><p className="eyebrow">DESIGNED AROUND YOUR DAY</p><h2>One role. More room to focus.</h2><p>Explore a starting point for your custom agent. Selecting a role previews a workflow; it does not create or activate an agent.</p></div>
      <div className="agent-orbit" aria-hidden="true"><span/><span/><span/><div><Icon name="agents" size={40}/></div><i/><i/></div>
    </div>
    <div className="agent-role-grid" role="group" aria-label="Preview an agent role">{ROLES.map((item) => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={`agent-role ${selected === item.id ? 'selected' : ''}`}><Icon name={item.icon} size={19}/><strong>{item.name}</strong><span>{item.summary}</span><span className="agent-role-arrow" aria-hidden="true">↗</span></button>)}</div>
    <div className="agent-workflow" aria-live="polite" aria-atomic="true"><div className="agent-workflow-heading"><h3>{role.name}</h3><span>EXAMPLE WORKFLOW</span></div><ol>{[['The starting point', role.trigger], ['The agent’s assignment', role.work], ['The human handoff', role.handoff]].map(([title, detail], index) => <li key={title}><span className="agent-step">0{index + 1}</span><div><strong>{title}</strong><p>{detail}</p></div></li>)}</ol></div>
  </section>
}
