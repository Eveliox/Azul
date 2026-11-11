import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { Icon } from './DashboardVisuals.jsx'
import { PixelArrow, PixelField, WindowBar } from './StudioVisuals.jsx'
import BusinessDetails from './BusinessDetails.jsx'
import AgentControls from './AgentControls.jsx'
import { outboundPrompt, inboundPrompt, validateProfile } from '../../api/_lib/lead-prompts.js'
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

export default function LeadsPanel({ client, demo, isMaster, setupContent }) {
  const [tab, setTab] = useState('overview')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
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
  const matches = (l, id) => id === 'all' || (id === 'needs' ? NEEDS_YOU.includes(l.status) : id === 'booked' ? l.status === 'booked' || l.booked : QUEUED.includes(l.status))
  const visible = leads.filter((l) => matches(l, filter) && [l.name, l.phone, formatPhone(l.phone), l.service, l.email].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  const stats = data?.stats || {}
  const selected = leads.find(l => l.id === selectedId)
  const needs = leads.filter(l => NEEDS_YOU.includes(l.status)).length
  const [modeName, modeNote] = agent ? MODES[agent.mode] || ['Unknown', ''] : ['Not set up', isMaster ? 'Open Setup to connect your agent' : 'Azul is setting up your agent']
  const callsOff = data?.calls_enabled === false
  const period = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: tz })
  const openLead = (id) => { setMessage(''); setSelectedId(id) }
  const showNeeds = () => { setTab('leads'); setFilter('needs'); setQuery('') }
  const inbox = <section className="panel lead-inbox">
    <WindowBar title={`// ${tab === 'overview' ? 'RECENT LEADS' : 'LEAD INBOX'} //`}/>
    <div className="panel-heading"><div><h2>{tab === 'overview' ? 'Recent leads' : 'Leads'}</h2><p>{tab === 'overview' ? 'Your latest conversations and their next steps.' : 'Search and manage your latest 100 website leads.'}</p></div><span className="lead-sync">Updates every 20 seconds</span></div>
    <div className="lead-inbox-toolbar">
      <div className="lead-filter-group" role="group" aria-label="Filter leads">{FILTERS.map(([id, label]) => <button key={id} className={filter === id ? 'selected' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}<span>{leads.filter(l => matches(l, id)).length}</span></button>)}</div>
      <label className="lead-search"><Icon name="search" size={16}/><input aria-label="Search leads" placeholder="Search name, phone, or service" value={query} onChange={e => setQuery(e.target.value)}/></label>
    </div>
    {!visible.length ? <div className="empty-state"><span className="icon-tile blue"><Icon name="phone"/></span><h3>{leads.length ? 'No leads match your search' : 'Your first lead will show up here'}</h3><p>{leads.length ? 'Try another search or filter.' : 'New website leads and their call results will appear here.'}</p>{leads.length > 0 && <button className="text-button" onClick={() => { setFilter('all'); setQuery('') }}>Clear filters</button>}</div> : <>
      <div className="lead-table-scroll"><table className="lead-table"><thead><tr>{['Lead', 'Service', 'Status', 'Received', 'Next step'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{(tab === 'overview' ? visible.slice(0, 5) : visible).map(l => <tr key={l.id}>
        <td><button className="lead-open" onClick={() => openLead(l.id)} aria-label={`View lead ${l.name}`}>{l.name}<span>{formatPhone(l.phone)}{l.is_test && ' · Test'}</span></button></td>
        <td>{l.service || 'Not specified'}{l.language === 'es' && <small>Spanish</small>}</td>
        <td><LeadStatus lead={l}/></td>
        <td><time dateTime={l.received_at}>{when(l.received_at, tz)}</time></td>
        <td><span className={NEEDS_YOU.includes(l.status) ? 'lead-attention-text' : ''}>{nextStep(l, tz, callsOff, agent?.mode)}</span></td>
      </tr>)}</tbody></table></div>
      <div className="lead-mobile-list">{(tab === 'overview' ? visible.slice(0, 5) : visible).map(l => <button className="lead-mobile-card" key={l.id} onClick={() => openLead(l.id)} aria-label={`Open lead ${l.name}`}><span className="lead-mobile-top"><strong>{l.name}</strong><LeadStatus lead={l}/></span><span>{l.service || 'Website inquiry'} · {when(l.received_at, tz)}</span><span className="lead-mobile-next">{nextStep(l, tz, callsOff, agent?.mode)} <span aria-hidden="true">↗</span></span></button>)}</div>
    </>}
    <div className="lead-inbox-footer"><span>{tab === 'overview' ? Math.min(visible.length, 5) : visible.length} of {leads.length} latest leads</span>{tab === 'overview' && <button className="text-button" onClick={() => setTab('leads')}>View all leads →</button>}</div>
  </section>

  return <div className="leads-panel lead-workspace">
    {error && <p className="error-banner" role="alert">Could not load leads: {error} <button onClick={() => setReload(n => n + 1)}>Retry</button></p>}
    {message && <p className="form-note" role="status">{message}</p>}
    {data && <>
      {callsOff && <div className="lead-global-alert" role="status"><Icon name="shield" size={20}/><div><strong>Automatic calls are switched off</strong><p>Leads are saved and emailed. No automatic calls will be placed while the global switch is off.</p></div></div>}
      <header className="lead-agent-header"><WindowBar title={`// ${isMaster ? 'AZUL ADMIN' : 'CLIENT WORKSPACE'} / SPEED-TO-LEAD AGENT //`}/><PixelField/><div><p className="eyebrow">YOUR SERVICES / LEAD OPERATIONS</p><div className="lead-title-line"><h1>Speed-to-Lead</h1><span className={`lead-mode ${callsOff ? 'mode-paused' : `mode-${agent?.mode || 'none'}`}`}><span className="leads-dot"/>{callsOff ? 'Calls off' : modeName}</span></div><p>{callsOff ? `Agent mode: ${modeName}. Leads are saved and emailed.` : modeNote}{agent && <> · {hour(agent.call_start_hour)}–{hour(agent.call_end_hour)} {agent.call_sundays ? 'every day' : 'Mon–Sat'} · {tz.replaceAll('_', ' ')}</>}</p></div><button className="btn-primary" onClick={() => setTab('settings')}><Icon name="clock" size={16}/>Agent settings</button></header>
      <nav className="lead-tabs" aria-label="Speed-to-Lead sections">{[['overview','Overview'],['leads','Leads'],['settings','Agent settings'],['setup','Setup']].map(([id,label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}{id === 'leads' && <span>{leads.length}</span>}</button>)}</nav>
      {(tab === 'overview' || tab === 'leads') && <>
        {tab === 'overview' && <><div className="lead-section-label"><h2>Performance</h2><span>{period} · Month to date</span></div><div className="leads-stats">
          {[['Leads', stats.leads ?? 0, 'From your website'], ['Median response time', seconds(stats.median_seconds_to_call), stats.within_minute == null ? 'During calling hours' : `${stats.within_minute}% called within a minute`], ['Booked visits', stats.booked ?? 0, 'Visits on your calendar'], ['Needs attention', stats.needs_you ?? 0, 'Across the last 32 days']].map(([label,value,note]) => <div className="panel" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
        </div><p className="lead-metric-note">Response time measures the first call for leads received during calling hours. After-hours leads wait until calling hours begin.</p></>}
        {needs > 0 && <div className="lead-callback-strip"><span className="lead-callback-icon"><Icon name="phone" size={19}/></span><div><strong>{needs} lead{needs === 1 ? ' needs' : 's need'} your attention</strong><p>Review call results and the recommended next step.</p></div><button onClick={showNeeds}>View leads <PixelArrow/></button></div>}
        {inbox}
      </>}
      {tab === 'settings' && <div className="lead-settings-layout"><section className="panel"><div className="panel-heading"><div><h2>Agent controls</h2><p>Manage calling hours, transfers, and lead alerts.</p></div></div>{agent ? <AgentControls key={`${client.client_id}:${agent.updated_at || ''}`} initiallyOpen client={client} agent={agent} demo={demo} onSaved={msg => { setMessage(msg); setReload(n => n + 1) }}/> : <p className="form-note">Your agent needs to be connected first. Open Setup for next steps.</p>}</section><BusinessDetails key={client.client_id} client={client} profile={data.profile} updatedAt={data.profile_updated_at} shareEmail={data.calendar_share_email} demo={demo} onSaved={() => setReload(n => n + 1)}/></div>}
      {tab === 'setup' && <div className="lead-setup-content">{isMaster && data.costs && <p className="leads-cost"><Icon name="key" size={14}/>Azul only · Call cost this month: <b>${data.costs.month_usd.toFixed(2)}</b> over {data.costs.calls} calls{data.costs.priced < data.costs.calls ? ` · ${data.costs.calls - data.costs.priced} without a cost yet` : ''}</p>}{isMaster && <AgentSetup key={`${client.client_id}:${agent?.updated_at || 'new'}`} client={client} agent={agent} profile={data.profile} gaps={data.gaps || []} demo={demo} onSaved={msg => { setMessage(msg); setReload(n => n + 1) }}/>}{setupContent}</div>}
      {selected && <LeadDrawer lead={selected} tz={tz} callsOff={callsOff} mode={agent?.mode} busy={busy === selected.id} message={message} onStop={() => stop(selected)} onClose={() => setSelectedId(null)}/>}
    </>}
  </div>
}

function LeadStatus({ lead }) {
  const [label, tone] = LEAD_STATUS[lead.status] || [lead.status, 'cancelled']
  return <span className={`status-pill status-${tone}`}><i/>{label}</span>
}

function nextStep(lead, tz, callsOff, mode) {
  if (lead.status === 'blocked' || lead.status === 'stopped') return 'Do not contact'
  if (lead.status === 'not_called' && !lead.consent) return 'No call permission'
  if (lead.appointment_time) return `Visit ${when(lead.appointment_time, tz) || lead.appointment_time}`
  if (lead.status === 'booked' || lead.booked) return 'Visit booked'
  if (NEEDS_YOU.includes(lead.status)) return 'Review and call back'
  if (['calling','dialing','owner_ringing','owner_connecting'].includes(lead.status)) return 'Call in progress'
  if (['retry','new'].includes(lead.status)) {
    if (callsOff) return 'Waiting · automatic calls off'
    if (mode === 'paused') return 'Waiting · agent paused'
    if (mode === 'testing' && !lead.is_test) return 'Testing · test numbers only'
    return lead.next_attempt_at ? `Next call ${when(lead.next_attempt_at, tz)}` : 'Waiting for first call'
  }
  if (['handed_off','owner_talked'].includes(lead.status)) return 'Continue with your team'
  return 'Review lead details'
}

function LeadDrawer({ lead, tz, callsOff, mode, busy, message, onStop, onClose }) {
  const dialog = useRef(null)
  useEffect(() => { const el = dialog.current; el.showModal(); return () => { el.close() } }, [])
  const speed = firstCall(lead)
  const canContact = lead.consent && !['blocked','stopped'].includes(lead.status)
  return <dialog ref={dialog} className="lead-drawer" aria-labelledby="lead-drawer-title" onClose={onClose} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close() }}>
    <div className="lab-window-bar"><span className="lab-window-controls" aria-hidden="true"/><span>// LEAD DETAILS //</span><button className="lead-close" aria-label="Close lead details" onClick={() => dialog.current.close()}>×</button></div>
    <div className="lead-drawer-inner"><header><h2 id="lead-drawer-title">{lead.name}</h2><LeadStatus lead={lead}/></header>
      <section><h3>Next step</h3><p className="lead-next-detail">{nextStep(lead, tz, callsOff, mode)}</p></section>
      <section><h3>Contact details</h3><dl><div><dt>Phone</dt><dd>{canContact ? <a href={`tel:${lead.phone}`}>{formatPhone(lead.phone)}</a> : formatPhone(lead.phone)}</dd></div>{lead.email && <div><dt>Email</dt><dd>{canContact ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : lead.email}</dd></div>}<div><dt>Service</dt><dd>{lead.service || 'Not specified'}</dd></div><div><dt>Language</dt><dd>{lead.language === 'es' ? 'Spanish' : 'English'}</dd></div>{lead.address && <div><dt>Address</dt><dd>{[lead.address,lead.zip].filter(Boolean).join(' ')}</dd></div>}<div><dt>Call permission</dt><dd>{lead.consent ? 'Provided on form' : 'Not provided'}</dd></div></dl></section>
      <section><h3>Call summary</h3><p>{lead.summary || 'No call summary yet.'}</p>{lead.details && <p><b>From the form:</b> {lead.details}</p>}{lead.notes && <p><b>Note:</b> {lead.notes}</p>}{lead.last_error && <p className="lead-error"><b>Problem:</b> {lead.last_error}</p>}</section>
      <section><h3>Activity & booking</h3><dl><div><dt>Received</dt><dd>{when(lead.received_at,tz)}</dd></div><div><dt>First call</dt><dd>{speed == null ? 'Not called yet' : `${seconds(speed)} after arrival`}</dd></div><div><dt>Attempts</dt><dd>{lead.attempts || 0}</dd></div>{lead.next_attempt_at && <div><dt>Scheduled retry</dt><dd>{when(lead.next_attempt_at,tz)}</dd></div>}{lead.appointment_time && <div><dt>Booked visit</dt><dd>{when(lead.appointment_time,tz) || lead.appointment_time}</dd></div>}</dl></section>
      <footer>{canContact && <a className="btn-primary" href={`tel:${lead.phone}`}><Icon name="phone" size={15}/>Call lead</a>}{['retry','new'].includes(lead.status) && <button className="btn-ghost" disabled={busy} onClick={onStop}>{busy ? 'Stopping…' : 'Stop calling'}</button>}</footer>{message && <p className="form-note" role="status">{message}</p>}
    </div>
  </dialog>
}

const BLANK = { hosted_form: false, privacy_url: '', weekly_email: true, assistant_mode: 'vapi', calendar_id: '', calendar_tool_ids: '', business_name: '', mode: 'testing', vapi_assistant_id: '', vapi_phone_number_id: '', twilio_number: '', owner_email: '', owner_cell: '', owner_first: false, timezone: 'America/New_York', call_start_hour: 8, call_end_hour: 20, call_sundays: false, max_attempts: 3, retry_gap_minutes: 120, test_numbers: '' }

function AgentSetup({ client, agent, profile, gaps, demo, onSaved }) {
  const [f, setF] = useState(() => agent ? { ...BLANK, ...agent, vapi_assistant_id: agent.vapi_assistant_id || '', twilio_number: agent.twilio_number || '', owner_cell: agent.owner_cell || '', test_numbers: (agent.test_numbers || []).join(', '), calendar_tool_ids: (agent.calendar_tool_ids || []).join(', '), calendar_id: agent.calendar_id || '', privacy_url: agent.privacy_url || '' } : { ...BLANK, business_name: client.name })
  const [testNumber, setTestNumber] = useState(agent?.test_numbers?.[0] || '')
  const [testResult, setTestResult] = useState('')
  const [preview, setPreview] = useState('outbound')
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
  async function testCall() {
    setBusy(true); setError(''); setTestResult('')
    try { const r = await api('/api/leads/test-call', { method: 'POST', body: { client_id: client.client_id, phone: testNumber } }); setTestResult(r.status === 'calling' || r.status === 'owner_ringing' ? `Calling ${formatPhone(testNumber)} now. The result appears in Leads after the call.` : `Not called: ${r.last_error || r.status}`); onSaved('Test call sent.') }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const validProfile = profile && validateProfile(profile).data
  const promptText = validProfile ? (preview === 'outbound'
    ? outboundPrompt({ profile: validProfile, agent: { ...f, owner_cell: f.owner_cell || null }, lead: { name: 'Maria Lopez', service: validProfile.services[0], address: '1100 W 49th St, Hialeah, FL', language: 'en' }, now: new Date() })
    : inboundPrompt({ profile: validProfile, agent: { ...f, owner_cell: f.owner_cell || null }, now: new Date() })) : ''
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
        <label className="label">Call script<select className="input" value={f.assistant_mode} onChange={set('assistant_mode')}><option value="vapi">Vapi assistant (saved in Vapi)</option><option value="azul">Azul template (built from business details)</option></select></label>
        {field('vapi_assistant_id', f.assistant_mode === 'vapi' ? 'Vapi assistant ID' : 'Vapi assistant ID (not used in Azul template mode)', { required: f.assistant_mode === 'vapi', placeholder: '92a1a4d7-…', spellCheck: false })}
        {field('calendar_id', 'Google Calendar ID (Azul template)', { required: f.assistant_mode === 'azul' && !String(f.calendar_tool_ids).trim(), placeholder: '…@group.calendar.google.com', spellCheck: false })}
        <small className="field-hint">Google Calendar → the client's calendar → Settings and sharing → Integrate calendar → Calendar ID. The calendar must be shared with the Google account connected to Vapi.</small>
        {field('vapi_phone_number_id', 'Vapi phone number ID (the imported Twilio number)', { required: true, placeholder: '90e9e838-…', spellCheck: false })}
        {field('twilio_number', 'Business number (Twilio)', { type: 'tel', placeholder: '(305) 555-0000' })}
      </fieldset>
      <fieldset><legend>Owner</legend>
        {field('owner_email', 'Owner email(s), comma-separated', { required: true })}
        {field('owner_cell', 'Owner cell', { type: 'tel', placeholder: '(786) 555-0199' })}
        <label className="checkbox-row"><input type="checkbox" checked={f.owner_first} onChange={set('owner_first')}/>Owner first: ring the owner's cell first; press 1 to connect, otherwise the AI calls</label>
        <label className="checkbox-row"><input type="checkbox" checked={f.weekly_email} onChange={set('weekly_email')}/>Weekly results email to the owner (Mondays)</label>
      </fieldset>
      <fieldset><legend>Hosted lead form</legend>
        <label className="checkbox-row"><input type="checkbox" checked={f.hosted_form} onChange={set('hosted_form')}/>Turn on the form at app.azulwebdev.com/f/{client.slug || 'their-id'}</label>
        {field('privacy_url', "Business's privacy page (required for the form)", { type: 'url', placeholder: 'https://theirsite.com/privacy' })}
        {agent?.hosted_form && client.slug && <div className="key-row"><input className="input" readOnly aria-label="Hosted form link" value={`https://app.azulwebdev.com/f/${client.slug}`}/><a className="btn-ghost" href={`/f/${client.slug}`} target="_blank" rel="noreferrer">Open</a></div>}
        <small className="field-hint">For businesses whose own site can't send leads: link it from Google Business Profile, Instagram, Facebook or an ad.</small>
      </fieldset>
      <fieldset><legend>Calling rules</legend>
        <div className="agent-setup-row">
          <label className="label">Start<select className="input" value={f.call_start_hour} onChange={set('call_start_hour')}>{Array.from({ length: 12 }, (_, i) => i + 8).map((h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
          <label className="label">End<select className="input" value={f.call_end_hour} onChange={set('call_end_hour')}>{Array.from({ length: 12 }, (_, i) => i + 9).map((h) => <option key={h} value={h}>{hour(h)}</option>)}</select></label>
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

    {agent && <div className="agent-connect">
      <h3>Before using the Azul template</h3>
      {gaps.length ? <ul className="gap-list">{gaps.map((g) => <li key={g}><Icon name="clock" size={13}/>{g}</li>)}</ul> : <p className="form-note"><Icon name="check" size={14}/> Business details, calendar and transfers are ready.</p>}
      {validProfile && <details className="prompt-preview"><summary>Preview the call script</summary>
        <div className="service-filters" role="group" aria-label="Script to preview">{[['outbound', 'Calling a new lead'], ['inbound', 'Answering a callback']].map(([id, label]) => <button type="button" key={id} className={preview === id ? 'selected' : ''} aria-pressed={preview === id} onClick={() => setPreview(id)}>{label}</button>)}</div>
        <pre>{promptText}</pre><p className="chart-footnote">Sample lead: Maria Lopez. Uses the settings in the form above, saved or not.</p></details>}
      <h3>Send a test call</h3>
      <p className="muted">Calls one of the test numbers now, at any hour and in any mode, with the current settings. The result shows up in Leads.</p>
      {(agent.test_numbers || []).length ? <div className="key-row"><select className="input" aria-label="Test number" value={testNumber} onChange={(e) => setTestNumber(e.target.value)}>{agent.test_numbers.map((n) => <option key={n} value={n}>{formatPhone(n)}</option>)}</select><button type="button" className="btn-primary" disabled={busy || demo || !testNumber} onClick={testCall}>Send test call</button></div> : <p className="form-note">Add a test number above and save first.</p>}
      {testResult && <p className="form-note" role="status">{testResult}</p>}
    </div>}

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
