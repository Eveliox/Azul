import { useState } from 'react'
import { api } from '../api.js'
import { Icon } from './DashboardVisuals.jsx'
import { PROFILE_DEFAULTS } from '../../api/_lib/lead-prompts.js'

// The business describes how its agent should work. The agent's call script is built from this.
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hour = (h) => { const n = Number(h) % 24; return `${n % 12 || 12} ${n < 12 ? 'AM' : 'PM'}` }
const lines = (v) => (Array.isArray(v) ? v.join('\n') : v || '')

export default function BusinessDetails({ client, profile, updatedAt, shareEmail, demo, onSaved }) {
  const start = { ...PROFILE_DEFAULTS, ...(profile || {}) }
  const [f, setF] = useState({ ...start, services: lines(start.services), questions: lines(start.questions), emergencies: lines(start.emergencies), service_zips: (start.service_zips || []).join(', ') })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [open, setOpen] = useState(!profile) // set once, so saving doesn't snap the panel shut
  const set = (k) => (e) => { setSaved(''); setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }) }
  const toggleDay = (d) => { setSaved(''); setF({ ...f, booking_days: f.booking_days.includes(d) ? f.booking_days.filter((x) => x !== d) : [...f.booking_days, d].sort() }) }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError(''); setSaved('')
    try { await api('/api/leads/profile', { method: 'POST', body: { ...f, client_id: client.client_id } }); setSaved('Saved. The agent uses these details on its next call.'); onSaved() }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const text = (key, label, props = {}) => <label className="label">{label}<input className="input" value={f[key] ?? ''} onChange={set(key)} {...props}/></label>
  const area = (key, label, hint, props = {}) => <label className="label">{label}<small className="field-hint">{hint}</small><textarea className="input" rows={4} value={f[key] ?? ''} onChange={set(key)} {...props}/></label>

  return <details className="panel business-details" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
    <summary><span className="icon-tile green"><Icon name="building"/></span><span><strong>Your business details</strong><small>{profile ? `What your agent knows about ${client.name}. Last updated ${updatedAt ? new Date(updatedAt).toLocaleDateString() : 'recently'}.` : 'Tell your agent how to talk about your business and when to book. About 10 minutes.'}</small></span></summary>
    <form onSubmit={save} className="business-form">
      <fieldset><legend>Your business</legend>
        {text('trade', 'Your trade', { placeholder: 'air conditioning', required: true, maxLength: 60 })}
        {text('area', 'City or area you serve', { placeholder: 'Hialeah, Florida', required: true, maxLength: 80 })}
        {area('services', 'Services', 'One per line, the way customers ask for them.', { placeholder: 'AC repair\nNew AC system\nAC tune-up', required: true })}
        {text('technician_word', 'Who goes to the visit', { placeholder: 'technician', maxLength: 30 })}
      </fieldset>
      <fieldset><legend>The call</legend>
        {area('questions', 'Questions the agent asks', 'Up to 5, one per line. It also asks the address and a good time.', { placeholder: 'Is this a repair, a new system, or a tune-up?\nIs the AC blowing warm air or not turning on at all?' })}
        {area('emergencies', 'Emergencies: transfer the call to you', 'One per line. Add what the agent should say first, if anything.', { placeholder: 'A gas smell: tell them to leave the house and call the gas company or 911 from outside.\nNo cooling with an elderly person, a baby or someone with health needs at home.' })}
        {area('notes', 'Anything else the agent should know', 'Brands you install, what you don\'t do, how to describe your company.', { rows: 3, maxLength: 1000 })}
      </fieldset>
      <fieldset><legend>Booking</legend>
        {text('visit_name', 'What the agent books', { placeholder: 'AC service visit', required: true, maxLength: 60 })}
        <div className="business-row">
          <label className="label">Visit length<select className="input" value={f.visit_minutes} onChange={set('visit_minutes')}>{[30, 45, 60, 90, 120, 180, 240].map((m) => <option key={m} value={m}>{m < 60 ? `${m} min` : `${m / 60} h`}</option>)}</select></label>
          <label className="label">Minimum notice<select className="input" value={f.min_notice_hours} onChange={set('min_notice_hours')}>{[0, 1, 2, 4, 12, 24, 48].map((h) => <option key={h} value={h}>{h ? `${h} h` : 'None'}</option>)}</select></label>
        </div>
        <span className="label">Days for visits</span>
        <div className="day-picker" role="group" aria-label="Days for visits">{DAY_NAMES.map((d, i) => <button type="button" key={d} aria-pressed={f.booking_days.includes(i)} className={f.booking_days.includes(i) ? 'selected' : ''} onClick={() => toggleDay(i)}>{d}</button>)}</div>
        <div className="business-row">
          <label className="label">First visit<select className="input" value={f.booking_start_hour} onChange={set('booking_start_hour')}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
          <label className="label">Visits end by<select className="input" value={f.booking_end_hour} onChange={set('booking_end_hour')}>{Array.from({ length: 24 }, (_, h) => h + 1).map((h) => <option key={h} value={h}>{h === 24 ? 'Midnight' : hour(h)}</option>)}</select></label>
        </div>
        {area('service_zips', 'Service area zip codes', 'Optional. Leave empty to serve your whole area.', { rows: 2, placeholder: '33012, 33013, 33014, 33016' })}
      </fieldset>
      <fieldset><legend>Your calendar</legend>
        <p className="muted">The agent checks your Google Calendar before offering a time and books the visit on it. Share it once:</p>
        <ol className="calendar-steps">
          <li>On a computer, open <a href="https://calendar.google.com" target="_blank" rel="noreferrer">calendar.google.com</a>.</li>
          <li>On the left, under <b>My calendars</b>, point at the calendar for visits, click <b>⋮</b>, then <b>Settings and sharing</b>.</li>
          <li>Under <b>Share with specific people or groups</b>, click <b>Add people and groups</b> and enter {shareEmail ? <b className="share-email">{shareEmail}</b> : <b>the email address Azul sends you</b>}.</li>
          <li>Set the permission to <b>Make changes to events</b> and click <b>Send</b>.</li>
          <li>Add events for times you're closed, so the agent never books them.</li>
        </ol>
        {text('calendar_email', 'The Google account that owns this calendar', { type: 'email', placeholder: 'you@yourbusiness.com', maxLength: 254 })}
        <label className="checkbox-row"><input type="checkbox" checked={f.calendar_shared} onChange={set('calendar_shared')}/>I've shared my calendar with Azul</label>
      </fieldset>
      {error && <p className="error-banner" role="alert">{error}</p>}
      {saved && <p className="form-note" role="status"><Icon name="check" size={14}/> {saved}</p>}
      <button className="btn-primary" disabled={busy || demo}>{busy ? 'Saving…' : 'Save business details'}</button>
      {demo && <p className="chart-footnote">Demo workspace: details are not saved.</p>}
    </form>
  </details>
}
