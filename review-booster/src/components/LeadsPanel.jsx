import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Icon } from './DashboardVisuals.jsx'
import './leads-panel.css'

// Live speed-to-lead activity for one business, plus (Azul only) the agent's setup.
export const LEAD_STATUS = {
  new: ['New', 'pending'], dialing: ['Calling now', 'pending'], calling: ['On a call', 'sent'], retry: ['Will call again', 'pending'],
  owner_ringing: ['Ringing the owner', 'sent'], owner_connecting: ['Owner connecting', 'sent'], owner_talked: ['Owner talked to them', 'rated'],
  booked: ['Booked', 'rated'], handed_off: ['Transferred to you', 'clicked'], needs_owner: ['Call them back', 'failed'],
  stopped: ['Asked not to be called', 'cancelled'], no_answer: ['No answer', 'failed'], failed: ['Call failed', 'failed'],
  blocked: ['Do not contact', 'cancelled'], not_called: ['Not called', 'cancelled'],
}
const NEEDS_YOU = ['needs_owner', 'no_answer', 'failed', 'blocked']
const QUEUED = ['new', 'dialing', 'retry', 'calling', 'owner_ringing', 'owner_connecting']
const FILTERS = [['all', 'All leads'], ['needs', 'Needs you'], ['booked', 'Booked'], ['queued', 'In progress']]
const MODES = { active: ['Live', 'Calling every new lead'], testing: ['Testing', 'Only your test numbers are called'], paused: ['Paused', 'New leads are saved and emailed, not called'] }

export const formatPhone = (p) => { const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(p || ''); return m ? `(${m[1]}) ${m[2]}-${m[3]}` : p }
const hour = (h) => { const n = Number(h) % 24; return `${n % 12 || 12} ${n < 12 ? 'AM' : 'PM'}` }
const when = (iso, tz) => iso && !Number.isNaN(new Date(iso).getTime()) ? new Date(iso).toLocaleString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''
export function seconds(s) {
  if (s == null) return '—'
  if (s < 60) return `${s} sec`
  if (s < 3600) return `${Math.round(s / 60)} min`
  return `${Math.round(s / 360) / 10} h`
}
function firstCall(l) {
  if (!l.first_call_at) return null
  return Math.max(0, Math.round((new Date(l.first_call_at) - new Date(l.received_at)) / 1000))
}

export default function LeadsPanel({ client, demo, isMaster }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let current = true
    const load = () => api(`/api/leads/list?client_id=${encodeURIComponent(client.client_id)}`)
      .then((d) => { if (current) { setData(d); setError('') } })
      .catch((e) => { if (current) setError(e.message) })
    load()
    const timer = setInterval(() => { if (document.visibilityState === 'visible') load() }, 20000)
    return () => { current = false; clearInterval(timer) }
  }, [client.client_id, reload])

  async function stop(lead) {
    if (!confirm(`Stop the agent calling ${lead.name}? Use this when your team has already reached them.`)) return
    setBusy(lead.id); setMessage('')
    try { await api('/api/leads/stop', { method: 'POST', body: { client_id: client.client_id, lead_id: lead.id } }); setMessage(`The agent won't call ${lead.name} again.`); setReload((n) => n + 1) }
    catch (e) { setMessage(`Could not stop the calls: ${e.message}`); setReload((n) => n + 1) } finally { setBusy('') }
  }

  if (!data && !error) return <section className="panel leads-panel" role="status">Loading leads…</section>
  const agent = data?.agent
  const tz = agent?.timezone || 'America/New_York'
  const leads = data?.leads || []
  const visible = leads.filter((l) => filter === 'all' || (filter === 'needs' ? NEEDS_YOU.includes(l.status) : filter === 'booked' ? l.status === 'booked' || l.booked : QUEUED.includes(l.status)))
  const stats = data?.stats || {}
  const [modeName, modeNote] = agent ? MODES[agent.mode] || ['Unknown', ''] : ['Not set up', isMaster ? 'Fill in the agent setup below' : 'Azul is setting up your agent']

  return <div className="leads-panel">
    {error && <p className="error-banner" role="alert">Could not load leads: {error} <button onClick={() => setReload((n) => n + 1)}>Retry</button></p>}
    {message && <p className="form-note" role="status">{message}</p>}
    {data && <>
      <section className={`leads-status mode-${agent?.mode || 'none'}`}>
        <div className="leads-status-main"><span className="leads-dot" aria-hidden="true"/><div><span className="eyebrow">YOUR AGENT</span><strong>{modeName}</strong><p>{modeNote}</p></div></div>
        {agent && <dl>
          <div><dt>Calling hours</dt><dd>{hour(agent.call_start_hour)}–{hour(agent.call_end_hour)} · {agent.call_sundays ? 'every day' : 'Mon–Sat'}</dd></div>
          <div><dt>Unanswered leads</dt><dd>Up to {agent.max_attempts} calls, {seconds(agent.retry_gap_minutes * 60)} apart</dd></div>
          <div><dt>Owner first</dt><dd>{agent.owner_first ? 'Your phone rings first' : 'Off · the agent calls first'}</dd></div>
        </dl>}
        {!data.calls_enabled && <p className="leads-warning"><Icon name="shield" size={15}/>Automatic calls are switched off for every business right now. Leads are saved and emailed.</p>}
      </section>

      <div className="leads-stats">
        {[['Leads this month', stats.leads ?? 0, 'From your website'], ['Time to first call', seconds(stats.median_seconds_to_call), stats.within_minute == null ? 'Median, during calling hours' : `${stats.within_minute}% called within a minute`], ['Booked this month', stats.booked ?? 0, 'Visits on your calendar'], ['Need you', stats.needs_you ?? 0, 'Call these leads back']]
          .map(([label, value, note]) => <div className="panel" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>

      <section className="panel table-panel">
        <div className="panel-heading"><div><h2>Leads</h2><p>Every website lead, what the agent did, and what's next. Updates every 20 seconds.</p></div><span className="count-badge">{visible.length} of {leads.length}</span></div>
        <div className="service-filters leads-filters" role="group" aria-label="Filter leads">{FILTERS.map(([id, label]) => <button key={id} className={filter === id ? 'selected' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
        {!visible.length ? <div className="empty-state"><span className="icon-tile green"><Icon name="phone"/></span><h3>{leads.length ? 'No leads match this filter' : 'Your first lead will show up here'}</h3><p>{leads.length ? 'Try another filter.' : 'When someone fills in your website form, the agent calls them within seconds and the result appears here.'}</p></div>
          : <ul className="lead-list">{visible.map((l) => {
            const [label, tone] = LEAD_STATUS[l.status] || [l.status, 'cancelled']
            const speed = firstCall(l)
            return <li key={l.id} className="lead-row">
              <div className="lead-who"><strong>{l.name}</strong><small><a href={`tel:${l.phone}`}>{formatPhone(l.phone)}</a>{l.service ? ` · ${l.service}` : ''}{l.language === 'es' ? ' · ES' : ''}</small></div>
              <div className="lead-state"><span className={`status-pill status-${tone}`}><i/>{label}</span>{l.attempts > 0 && <small>{l.attempts} call{l.attempts > 1 ? 's' : ''}</small>}</div>
              <div className="lead-time"><small>Received {when(l.received_at, tz)}</small>
                <small>{speed != null ? `First call after ${seconds(speed)}` : l.status === 'retry' && l.next_attempt_at ? `Next call ${when(l.next_attempt_at, tz)}` : l.consent ? 'Not called yet' : 'No call permission'}</small>
                {l.appointment_time && <small className="lead-booked"><Icon name="check" size={13}/>Visit {when(l.appointment_time, tz) || l.appointment_time}</small>}</div>
              <div className="lead-actions">{['retry', 'new'].includes(l.status) && <button className="text-button" disabled={busy === l.id} onClick={() => stop(l)}>Stop calling</button>}</div>
              {(l.summary || l.notes || l.last_error || l.details || l.address) && <details className="lead-detail"><summary>Details</summary>
                {l.summary && <p><b>Call summary.</b> {l.summary}</p>}
                {l.details && <p><b>From the form.</b> {l.details}</p>}
                {l.address && <p><b>Address.</b> {[l.address, l.zip].filter(Boolean).join(' ')}</p>}
                {l.notes && <p><b>Note.</b> {l.notes}</p>}
                {l.last_error && <p className="lead-error"><b>Problem.</b> {l.last_error}</p>}
                {l.email && <p><b>Email.</b> <a href={`mailto:${l.email}`}>{l.email}</a></p>}
              </details>}
            </li>
          })}</ul>}
        <p className="chart-footnote leads-footnote">The list shows the latest 100 leads; the numbers count every lead this month. "Time to first call" counts leads that arrived during calling hours; after-hours leads are called when hours start. You get an email after every call.</p>
      </section>

      {isMaster && <AgentSetup key={`${client.client_id}:${agent?.updated_at || 'new'}`} client={client} agent={agent} demo={demo} onSaved={(msg) => { setMessage(msg); setReload((n) => n + 1) }}/>}
    </>}
  </div>
}

const BLANK = { business_name: '', mode: 'testing', vapi_assistant_id: '', vapi_phone_number_id: '', twilio_number: '', owner_email: '', owner_cell: '', owner_first: false, timezone: 'America/New_York', call_start_hour: 8, call_end_hour: 20, call_sundays: false, max_attempts: 3, retry_gap_minutes: 120, test_numbers: '' }

function AgentSetup({ client, agent, demo, onSaved }) {
  const [f, setF] = useState(() => agent ? { ...BLANK, ...agent, twilio_number: agent.twilio_number || '', owner_cell: agent.owner_cell || '', test_numbers: (agent.test_numbers || []).join(', ') } : { ...BLANK, business_name: client.name })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const origin = 'https://app.azulwebdev.com'
  async function save(e) {
    e.preventDefault(); setBusy(true); setError(''); setWarning('')
    try { const r = await api('/api/leads/agent', { method: 'POST', body: { ...f, client_id: client.client_id } }); setWarning(r.warning || ''); onSaved(r.warning ? 'Agent saved, with a warning below.' : 'Agent settings saved.') }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  async function rotate() {
    if (!confirm(`Issue a new form key for ${client.name}? Their website stops sending leads until you update its LEAD_FORM_KEY.`)) return
    setBusy(true); setError('')
    try { await api('/api/leads/agent', { method: 'POST', body: { client_id: client.client_id, rotate_key: true } }); onSaved('New form key issued. Update the website’s LEAD_FORM_KEY.') }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  async function copy(text, what) { try { await navigator.clipboard.writeText(text); setCopied(what) } catch { setError('Could not copy. Select the text and copy it manually.') } }
  const field = (key, label, props = {}) => <label className="label" key={key}>{label}<input className="input" value={f[key] ?? ''} onChange={set(key)} {...props}/></label>

  return <details className="panel agent-setup" open={!agent}>
    <summary><span className="icon-tile blue"><Icon name="key"/></span><span><strong>Agent setup</strong><small>Only Azul sees this. {agent ? 'Edit the settings or the website connection.' : 'Connect this business’s Vapi assistant and number.'}</small></span></summary>
    <form onSubmit={save} className="agent-setup-form">
      <fieldset><legend>Business & mode</legend>
        {field('business_name', 'Business name (as callers hear it)', { required: true, maxLength: 120 })}
        <label className="label">Mode<select className="input" value={f.mode} onChange={set('mode')}><option value="testing">Testing · only test numbers</option><option value="active">Live · call every lead</option><option value="paused">Paused · save and email only</option></select></label>
        {field('test_numbers', 'Test numbers (testing mode)', { placeholder: '(786) 555-0100, (305) 555-0101' })}
      </fieldset>
      <fieldset><legend>Vapi & phone</legend>
        {field('vapi_assistant_id', 'Vapi assistant ID', { required: true, placeholder: '92a1a4d7-…', spellCheck: false })}
        {field('vapi_phone_number_id', 'Vapi phone number ID (the imported Twilio number)', { required: true, placeholder: '90e9e838-…', spellCheck: false })}
        {field('twilio_number', 'Business number (Twilio)', { type: 'tel', placeholder: '(305) 555-0000' })}
      </fieldset>
      <fieldset><legend>Owner</legend>
        {field('owner_email', 'Owner email(s), comma-separated', { required: true })}
        {field('owner_cell', 'Owner cell', { type: 'tel', placeholder: '(786) 555-0199' })}
        <label className="checkbox-row"><input type="checkbox" checked={f.owner_first} onChange={set('owner_first')}/>Owner first: ring the owner's cell first; press 1 to connect, otherwise the AI calls</label>
      </fieldset>
      <fieldset><legend>Calling rules</legend>
        <div className="agent-setup-row">
          <label className="label">Start<select className="input" value={f.call_start_hour} onChange={set('call_start_hour')}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
          <label className="label">End<select className="input" value={f.call_end_hour} onChange={set('call_end_hour')}>{Array.from({ length: 24 }, (_, h) => h + 1).map((h) => <option key={h} value={h}>{h === 24 ? '12 AM (midnight)' : hour(h)}</option>)}</select></label>
          <label className="label">Calls per lead<input className="input" type="number" min="1" max="5" value={f.max_attempts} onChange={set('max_attempts')}/></label>
          <label className="label">Minutes between<input className="input" type="number" min="30" max="1440" step="15" value={f.retry_gap_minutes} onChange={set('retry_gap_minutes')}/></label>
        </div>
        <label className="checkbox-row"><input type="checkbox" checked={f.call_sundays} onChange={set('call_sundays')}/>Call on Sundays</label>
        {field('timezone', 'Timezone', { spellCheck: false })}
      </fieldset>
      {error && <p className="error-banner" role="alert">{error}</p>}
      {warning && <p className="leads-warning" role="status"><Icon name="shield" size={15}/>{warning}</p>}
      <button className="btn-primary" disabled={busy || demo}>{busy ? 'Saving…' : agent ? 'Save agent settings' : 'Create agent'}</button>
      {demo && <p className="chart-footnote">Demo workspace: settings are not saved.</p>}
    </form>

    {agent?.form_key && <div className="agent-connect">
      <h3>Connect the website</h3>
      <p className="muted">The site's server sends each lead to this address with the form key. The <code>/speed-to-lead-site</code> skill sets this up. Keep the key in the host's environment variables, never in browser code.</p>
      <label className="label" htmlFor="lead-endpoint">Lead address (LEAD_ENDPOINT)</label>
      <div className="key-row"><input id="lead-endpoint" className="input" readOnly value={`${origin}/api/leads/new`}/><button type="button" className="btn-ghost" onClick={() => copy(`${origin}/api/leads/new`, 'endpoint')}>{copied === 'endpoint' ? 'Copied' : 'Copy'}</button></div>
      <label className="label" htmlFor="form-key">Form key (LEAD_FORM_KEY, sent as the x-lead-key header)</label>
      <div className="key-row"><input id="form-key" className="input" readOnly type={showKey ? 'text' : 'password'} value={agent.form_key}/><button type="button" className="btn-ghost" onClick={() => setShowKey(!showKey)}>{showKey ? 'Hide' : 'Reveal'}</button><button type="button" className="btn-primary" onClick={() => copy(agent.form_key, 'key')}>{copied === 'key' ? 'Copied' : 'Copy key'}</button></div>
      <h3>Connect Vapi</h3>
      <p className="muted">On this business's assistant (and its inbound assistant): Server URL <code>{origin}/api/leads/call-ended</code>, HTTP header <code>x-vapi-secret</code> = the shared Vapi lead secret, server messages: end-of-call-report only.</p>
      <div className="access-warning"><Icon name="key" size={19}/><div><strong>Key leaked or a site retired?</strong><p>A new key stops the old one immediately. Update the website's LEAD_FORM_KEY right after.</p><button type="button" className="text-button danger" onClick={rotate} disabled={busy || demo}>Issue a new form key</button></div></div>
    </div>}
  </details>
}
