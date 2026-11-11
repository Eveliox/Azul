import { useState } from 'react'
import { api } from '../api.js'
import { Icon } from './DashboardVisuals.jsx'

// What the business's own team can change about its agent. Numbers, Vapi and going live stay with Azul.
// Florida law: calls only 8 AM to 8 PM.
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const hour = (h) => { const n = Number(h) % 24; return `${n % 12 || 12} ${n < 12 ? 'AM' : 'PM'}` }

export default function AgentControls({ client, agent, demo, onSaved, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen)
  const [f, setF] = useState({ mode: agent.mode, call_start_hour: agent.call_start_hour, call_end_hour: agent.call_end_hour, call_sundays: agent.call_sundays, owner_email: agent.owner_email || '', owner_cell: agent.owner_cell || '', owner_first: agent.owner_first, weekly_email: agent.weekly_email !== false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const testing = agent.mode === 'testing'
  async function save(e) {
    e.preventDefault(); setBusy(true); setError('')
    try { await api('/api/leads/controls', { method: 'POST', body: { ...f, client_id: client.client_id } }); setOpen(false); onSaved('Your agent settings are saved.') }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <div className="agent-controls">
    <button type="button" className="text-button" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="clock" size={15}/>{open ? 'Close settings' : 'Change settings'}</button>
    {open && <form onSubmit={save} className="agent-controls-form">
      <label className="label">Your agent
        <select className="input" value={f.mode} onChange={set('mode')} disabled={testing}>
          {testing && <option value="testing">Testing (Azul turns it on)</option>}
          <option value="active">On · call every new lead</option>
          <option value="paused">Paused · save and email leads, no calls</option>
        </select>
      </label>
      <div className="controls-row">
        <label className="label">Calls from<select className="input" value={f.call_start_hour} onChange={set('call_start_hour')}>{HOURS.slice(0, -1).map((h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
        <label className="label">Until<select className="input" value={f.call_end_hour} onChange={set('call_end_hour')}>{HOURS.slice(1).map((h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
      </div>
      <label className="checkbox-row"><input type="checkbox" checked={f.call_sundays} onChange={set('call_sundays')}/>Call on Sundays</label>
      <small className="field-hint">Calls are only allowed between 8 AM and 8 PM.</small>
      <label className="label">Lead alerts go to (comma-separated)<input className="input" type="text" inputMode="email" value={f.owner_email} onChange={set('owner_email')} required/></label>
      <label className="label">Your cell (for transfers and ring-me-first)<input className="input" type="tel" value={f.owner_cell} onChange={set('owner_cell')} placeholder="(305) 555-0199"/></label>
      <label className="checkbox-row"><input type="checkbox" checked={f.owner_first} onChange={set('owner_first')} disabled={!agent.has_business_number && !agent.twilio_number}/>Ring me first: my phone rings, I press 1 to talk to the lead, otherwise the agent calls</label>
      <label className="checkbox-row"><input type="checkbox" checked={f.weekly_email} onChange={set('weekly_email')}/>Send me a weekly results email (Mondays)</label>
      {error && <p className="error-banner" role="alert">{error}</p>}
      <button className="btn-primary" disabled={busy || demo}>{busy ? 'Saving…' : 'Save settings'}</button>
      {demo && <p className="chart-footnote">Demo workspace: settings are not saved.</p>}
    </form>}
  </div>
}
