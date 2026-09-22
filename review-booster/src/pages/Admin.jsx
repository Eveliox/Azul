import { useEffect, useRef, useState } from 'react'
import MessagesPanel from '../components/MessagesPanel.jsx'
import { ActivityChart, Icon, ResponseCard, StatCards } from '../components/DashboardVisuals.jsx'
import { api, getAdminKey, setAdminKey, clearAdminKey } from '../api.js'
import './admin.css'

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminKey())
  return <div className="admin-app">{authed ? <Dashboard onLogout={() => { clearAdminKey(); setAuthed(false) }} /> : <Login onOk={() => setAuthed(true)} />}</div>
}

function Wordmark() {
  return <span className="wordmark">Azul<span>.</span><small>REVIEW BOOSTER</small></span>
}

function Login({ onOk }) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(''); setAdminKey(key.trim())
    try { await api('/api/clients'); onOk() } catch (e) {
      clearAdminKey(); setErr(e.message === 'Unauthorized' ? 'That access key was not recognized. Please try again.' : 'Unable to connect. Check that the API server is running and try again.')
    } finally { setBusy(false) }
  }
  return <div className="login-scene">
    <div className="login-shape one"/><div className="login-shape two"/>
    <form onSubmit={submit} className="login-card">
      <Wordmark/><span className="login-icon"><Icon name="shield" size={28}/></span>
      <h1>Welcome back</h1><p>Your customers have a story to tell.<br/>Let's help you listen.</p>
      <label className="label" htmlFor="access-key">Workspace access key</label>
      <div className="password-field"><input id="access-key" className="input" required autoFocus type={show ? 'text' : 'password'} autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your access key"/><button type="button" aria-label={show ? 'Hide access key' : 'Show access key'} aria-pressed={show} onClick={() => setShow(!show)}><Icon name="eye" size={18}/></button></div>
      <p className="login-help">Use the key provided by your workspace administrator.</p>
      {err && <div className="error-banner" role="alert">{err}</div>}
      <button className="btn-primary login-submit" disabled={busy || !key.trim()}>{busy ? 'Signing in…' : 'Sign in to your workspace'}<Icon name="chevron" size={16}/></button>
      <div className="login-footer"><Icon name="key" size={14}/> Private access. Your business, your feedback.</div>
    </form>
    <p className="login-caption">Better conversations. Stronger customer relationships.</p>
  </div>
}

const NAV = [['overview', 'Overview', 'grid'], ['requests', 'Review requests', 'send'], ['messages', 'Messages', 'message'], ['access', 'Workspace access', 'key']]
const TITLES = {
  overview: ['Workspace overview', 'A little feedback goes a long way. Here’s the latest.'],
  requests: ['Review requests', 'Keep every customer conversation in view.'],
  messages: ['Make it sound like you', 'Personalized messages. Meaningful connections.'],
  access: ['Workspace access', 'A dedicated sign-in key for your client’s team.'],
}

function Dashboard({ onLogout }) {
  const [clients, setClients] = useState([])
  const [role, setRole] = useState(null)
  const [selected, setSelected] = useState('')
  const [requests, setRequests] = useState([])
  const [demo, setDemo] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const timer = useRef()
  const [tab, setTab] = useState('overview')
  const [query, setQuery] = useState('')
  const [days, setDays] = useState(14)
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [error, setError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const reload = () => setRefresh((v) => v + 1)
  const notify = (message) => { clearTimeout(timer.current); setToast(message); timer.current = setTimeout(() => setToast(''), 5000) }
  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    let current = true
    setLoading(true); setError('')
    api('/api/clients').then((d) => {
      if (!current) return
      setClients(d.clients); setRole(d.role); setDemo(d.demo === true)
      setSelected((id) => d.clients.some((c) => c.client_id === id) ? id : d.clients[0]?.client_id || '')
    }).catch((e) => { if (current) setError(e.message) }).finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [refresh])

  useEffect(() => {
    let current = true
    setRequests([]); setRequestError('')
    if (!selected) return
    setRequestLoading(true)
    api(`/api/requests?client_id=${encodeURIComponent(selected)}`).then((d) => {
      if (current) setRequests(d.requests)
    }).catch((e) => { if (current) setRequestError(e.message) }).finally(() => { if (current) setRequestLoading(false) })
    return () => { current = false }
  }, [selected, refresh])

  const client = clients.find((c) => c.client_id === selected)
  const isMaster = role === 'master'
  const activeTab = tab === 'access' && !isMaster ? 'overview' : tab
  const nav = NAV.filter(([id]) => id !== 'access' || isMaster)
  const done = (message) => { setModal(null); reload(); notify(message) }

  return <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand"><Wordmark/></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav aria-label="Workspace navigation">{nav.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={`nav-item ${activeTab === id ? 'active' : ''}`}><Icon name={icon}/><span>{label}</span>{id === 'requests' && Number(client?.pending) > 0 && <b>{client.pending}</b>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="icon-tile blue"><Icon name="message"/></span><strong>Small asks. Big insights.</strong><p>Make feedback part of every customer visit.</p><button onClick={() => setTab('messages')}>Personalize messages <Icon name="chevron" size={14}/></button></div>
        <button className="nav-item" onClick={onLogout}><Icon name="logout"/><span>Sign out</span></button>
        <p className="sidebar-version">AZUL WORKSPACE <span>v0.1</span></p>
      </div>
    </aside>

    <div className="dashboard-body">
      <header className="dashboard-topbar">
        <form className="global-search" onSubmit={(e) => { e.preventDefault(); setTab('requests') }} role="search"><Icon name="search" size={18}/><input aria-label="Search customers" placeholder="Search customers…" value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value) setTab('requests') }}/>{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={15}/></button>}</form>
        <div className="topbar-account"><span className="avatar">{isMaster ? 'AZ' : client?.name?.slice(0, 2).toUpperCase() || 'RB'}</span><div><strong>{isMaster ? 'Azul workspace' : 'Business workspace'}</strong><span>{isMaster ? 'Administrator' : 'Team access'}</span></div></div>
      </header>
      <nav className="mobile-nav" aria-label="Mobile workspace navigation">{nav.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={activeTab === id ? 'active' : ''}><Icon name={icon} size={17}/>{label}</button>)}<button onClick={onLogout}><Icon name="logout" size={17}/>Sign out</button></nav>
      <main className="dashboard-main">
        {demo && <div className="demo-banner"><span className="demo-dot"/>Demo workspace <span>Sample data only. No messages are sent; changes reset when the preview server restarts.</span></div>}
        <div className="workspace-toolbar"><div className="workspace-picker"><Icon name="building" size={17}/>{isMaster ? <select aria-label="Select business" value={selected} onChange={(e) => { setSelected(e.target.value); setQuery(''); setModal(null) }}><option value="" disabled>Select a business</option>{clients.map((c) => <option key={c.client_id} value={c.client_id}>{c.name}</option>)}</select> : <span>{client?.name || 'Your business'}</span>}</div><div className="toolbar-actions">{isMaster && <button className="text-button" onClick={() => setModal('client')}><Icon name="plus" size={15}/>Add business</button>}<button className="text-button" onClick={reload} disabled={loading || requestLoading} aria-label="Refresh workspace"><Icon name="refresh" size={16}/><span>Refresh</span></button></div></div>
        <div className="page-heading"><div><p className="eyebrow">YOUR REPUTATION, AT A GLANCE</p><h1>{TITLES[activeTab][0]}</h1><p>{TITLES[activeTab][1]}</p></div><button className="btn-primary" onClick={() => setModal('request')} disabled={!client}><Icon name="plus" size={18}/>New request</button></div>
        {error && <div className="error-banner" role="alert">Could not load the workspace: {error}. <button onClick={reload}>Try again</button></div>}
        {loading && !client && <div className="panel empty-state" role="status">Loading your workspace…</div>}
        {!loading && !error && !client && <div className="panel empty-state"><span className="icon-tile blue"><Icon name="building"/></span><h2>Your workspace starts here</h2><p>{isMaster ? 'Add your first business to start collecting customer feedback.' : 'No business is available for this key.'}</p>{isMaster && <button className="btn-primary" onClick={() => setModal('client')}>Add your first business</button>}</div>}
        {client && <>
          {activeTab === 'overview' && <>
            <StatCards client={client}/>
            {requestError ? <div className="error-banner" role="alert">Could not load activity: {requestError}. <button onClick={reload}>Retry</button></div> : requestLoading ? <div className="panel empty-state" role="status">Loading request activity…</div> : <div className="analytics-grid"><ActivityChart requests={requests} days={days} onDaysChange={setDays}/><ResponseCard client={client}/></div>}
            <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent requests</h2><p>Your latest customer touchpoints</p></div><button className="text-button blue-text" onClick={() => setTab('requests')}>View all requests<Icon name="chevron" size={15}/></button></div><RequestsTable requests={requests.slice(0, 5)} loading={requestLoading} onCreate={() => setModal('request')}/></section>
            <div className="workflow-note"><Icon name="clock" size={18}/><p><strong>A thoughtful follow-up, automatically.</strong> Requests are scheduled after {client.delay_hours ?? 3} hours, with one reminder after {client.followup_hours ?? 48} hours if the link is not visited.</p></div>
          </>}
          {activeTab === 'requests' && <section className="panel table-panel">{requestError && <div className="error-banner" role="alert">{requestError}</div>}<RequestBrowser key={selected} requests={requests} query={query} setQuery={setQuery} loading={requestLoading} onCreate={() => setModal('request')}/></section>}
          {activeTab === 'messages' && <section className="panel"><MessagesPanel key={selected} clientId={selected} business={client.name} notify={notify}/></section>}
          {activeTab === 'access' && isMaster && <section className="panel"><AccessKey key={selected} c={client} onRotated={() => { reload(); notify('New key issued. Share it securely with the team.') }}/></section>}
        </>}
        <footer className="dashboard-footer"><span>Azul Review Booster</span><span>Built for better customer relationships.</span></footer>
      </main>
    </div>
    {toast && <div className="toast" role="status"><Icon name="check" size={18}/>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16}/></button></div>}
    {modal && <Modal title={modal === 'client' ? 'Add a business' : 'Send a review request'} onClose={() => setModal(null)}>
      {modal === 'client' ? <NewClientForm onDone={() => done('Business created. Your new workspace is ready.')}/> : <><p className="modal-description">For {client?.name}. Add a customer after their visit to schedule a follow-up.</p><NewRequestForm key={selected} clientId={selected} onDone={() => done(demo ? 'Demo request added. No message will be sent.' : 'Review request scheduled.')}/></>}
    </Modal>}
  </div>
}

function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  const heading = 'workspace-dialog-title'
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close() }, [])
  return <dialog ref={ref} className="workspace-dialog admin-app" aria-labelledby={heading} onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}><div className="dialog-content"><div className="dialog-heading"><h2 id={heading}>{title}</h2><button className="text-button" aria-label="Close dialog" onClick={onClose}><Icon name="close"/></button></div>{children}</div></dialog>
}

function RequestBrowser({ requests, query, setQuery, loading, onCreate }) {
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(0)
  const filtered = requests.filter((r) => (status === 'all' || r.status === status) && [r.customer_name, r.customer_phone, r.customer_email].some((v) => String(v || '').toLowerCase().includes(query.toLowerCase().trim())))
  const pages = Math.max(1, Math.ceil(filtered.length / 10))
  const current = Math.min(page, pages - 1)
  useEffect(() => setPage(0), [query, status])
  return <><div className="panel-heading"><div><h2>Customer activity</h2><p>Search and filter the latest 100 requests</p></div><span className="count-badge">{filtered.length} requests</span></div>
    <div className="table-filters"><div className="filter-search"><Icon name="search" size={17}/><input aria-label="Filter requests by customer" placeholder="Search by name, email or phone" value={query} onChange={(e) => setQuery(e.target.value)}/></div><select className="input status-select" aria-label="Filter requests by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <RequestsTable requests={filtered.slice(current * 10, current * 10 + 10)} loading={loading} filtered={!!query || status !== 'all'} onCreate={onCreate}/>
    <div className="table-pagination"><span>{filtered.length ? `${current * 10 + 1}–${Math.min((current + 1) * 10, filtered.length)} of ${filtered.length}` : '0 results'}</span><div><button className="btn-ghost btn-sm" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</button><span>{current + 1} / {pages}</span><button className="btn-ghost btn-sm" disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>Next</button></div></div>
  </>
}

const STATUS = { pending: 'Scheduled', sent: 'Sent', clicked: 'Link visited', rated: 'Responded', failed: 'Failed', cancelled: 'Cancelled' }
function RequestsTable({ requests, loading, filtered, onCreate }) {
  if (loading) return <div className="empty-state" role="status">Loading requests…</div>
  if (!requests.length) return <div className="empty-state"><span className="icon-tile blue"><Icon name={filtered ? 'search' : 'send'}/></span><h3>{filtered ? 'No matching requests' : 'Your next conversation starts here'}</h3><p>{filtered ? 'Try another customer name or status.' : 'Send a review request after a customer visit.'}</p>{!filtered && <button className="btn-ghost" onClick={onCreate}>Create a request</button>}</div>
  return <div className="table-scroll"><table className="requests-table"><thead><tr><th>Customer</th><th>Status</th><th>Feedback rating</th><th>Scheduled for</th><th><span className="sr-only">Review link</span></th></tr></thead><tbody>{requests.map((r, index) => <tr key={r.id}>
    <td><div className="customer-cell"><span className={`customer-avatar avatar-${index % 4}`}>{(r.customer_name || '?').split(' ').filter(Boolean).slice(0, 2).map((v) => v[0]).join('')}</span><div><strong>{r.customer_name}</strong><small>{r.customer_phone || r.customer_email || 'No contact'} <span>· {(r.language || 'en').toUpperCase()}</span></small></div></div></td>
    <td><span className={`status-pill status-${r.status}`} title={r.error || undefined}><i/>{STATUS[r.status] || r.status}</span>{r.error && <details className="feedback-detail"><summary>View error</summary><p>{r.error}</p></details>}</td>
    <td>{r.rating ? <><span className="rating-stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}<span>{'★'.repeat(5 - r.rating)}</span></span>{r.feedback && <details className="feedback-detail"><summary>Read feedback</summary><p>{r.feedback}</p></details>}</> : <span className="muted">Not rated</span>}</td>
    <td className="date-cell">{new Date(r.send_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}<small>{new Date(r.send_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}{r.followup_sent_at ? ' · Reminder sent' : ''}</small></td>
    <td><a className="table-link" href={`/r/${r.token}`} target="_blank" rel="noreferrer" aria-label={`Open review link for ${r.customer_name}`} title="Opening this link may record a visit"><Icon name="chevron" size={16}/></a></td>
  </tr>)}</tbody></table></div>
}

function AccessKey({ c, onRotated }) {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function copy() {
    try { await navigator.clipboard.writeText(c.access_key); setCopied(true) } catch { setError('Could not copy. Reveal the key and copy it manually.') }
  }
  async function rotate() {
    if (!confirm(`Issue a new key for ${c.name}? The old key will stop working.`)) return
    setBusy(true); setError('')
    try { await api(`/api/clients?id=${c.client_id}`, { method: 'PATCH', body: { rotate_key: true } }); setCopied(false); onRotated() } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <div className="access-panel"><span className="icon-tile blue"><Icon name="shield" size={24}/></span><h2>Give your team their own space</h2><p className="muted">This key only grants access to {c.name}. Share it securely with authorized staff—not in public links or screenshots.</p><label className="label" htmlFor="business-key">Business access key</label><div className="key-row"><input id="business-key" className="input" readOnly type={visible ? 'text' : 'password'} value={c.access_key || ''}/><button className="btn-ghost" onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Reveal'}</button><button className="btn-primary" disabled={!c.access_key} onClick={copy}>{copied ? 'Copied' : 'Copy key'}</button></div><div className="access-warning"><Icon name="key" size={19}/><div><strong>Need to revoke access?</strong><p>Resetting the key signs out anyone using the old one on their next API request.</p><button className="text-button danger" onClick={rotate} disabled={busy}>{busy ? 'Resetting…' : 'Reset access key'}</button></div></div>{error && <div className="error-banner" role="alert">{error}</div>}</div>
}

function NewRequestForm({ clientId, onDone }) {
  const [f, setF] = useState({ customer_name: '', customer_phone: '', customer_email: '', language: '', send_now: false })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr('')
    if (!f.customer_phone.trim() && !f.customer_email.trim()) { setErr('Add a mobile number or email address.'); return }
    setBusy(true)
    try { const d = await api('/api/requests', { method: 'POST', body: { ...f, client_id: clientId, language: f.language || undefined } }); onDone(d) } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
    <Field label="Customer name" id="customer-name" className="sm:col-span-2"><input id="customer-name" className="input" required autoComplete="off" placeholder="Maria Lopez" value={f.customer_name} onChange={set('customer_name')}/></Field>
    <Field label="Mobile number" id="customer-phone"><input id="customer-phone" className="input" type="tel" placeholder="(305) 555-0100" value={f.customer_phone} onChange={set('customer_phone')}/></Field>
    <Field label="Email address" id="customer-email"><input id="customer-email" className="input" type="email" placeholder="maria@example.com" value={f.customer_email} onChange={set('customer_email')}/></Field>
    <Field label="Message language" id="request-language" className="sm:col-span-2"><select id="request-language" className="input" value={f.language} onChange={set('language')}><option value="">Business default</option><option value="en">English</option><option value="es">Español</option></select></Field>
    <label className="checkbox-row sm:col-span-2"><input type="checkbox" checked={f.send_now} onChange={set('send_now')}/>Skip delay (send on the next sender run)</label>
    <p className="form-note sm:col-span-2">Only contact customers with the appropriate messaging consent. Do not include medical or treatment details.</p>
    {err && <p className="error-banner sm:col-span-2" role="alert">{err}</p>}
    <button className="btn-primary sm:col-span-2" disabled={busy || !clientId}><Icon name="send" size={16}/>{busy ? 'Scheduling…' : 'Schedule request'}</button>
  </form>
}

function Field({ label, id, children, className = '' }) {
  return <div className={className}><label className="label" htmlFor={id}>{label}</label>{children}</div>
}

function NewClientForm({ onDone }) {
  const [f, setF] = useState({ name: '', slug: '', google_review_url: '', owner_name: '', owner_email: '', owner_phone: '', default_language: 'en', tone: 'friendly', delay_hours: 3, followup_hours: 48 })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await api('/api/clients', { method: 'POST', body: f }); onDone() } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const fields = [['name', 'Business name', 'text', true], ['slug', 'Short ID (e.g. helloyou)', 'text', true], ['google_review_url', 'Google review link', 'url', true], ['owner_name', 'Owner name', 'text'], ['owner_email', 'Owner email', 'email'], ['owner_phone', 'Owner mobile (optional)', 'tel'], ['delay_hours', 'Ask after (hours)', 'number'], ['followup_hours', 'Remind after (hours)', 'number']]
  return <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4"><p className="modal-description sm:col-span-2">Create a separate workspace with its own messages and team access.</p>{fields.map(([key, label, type, required]) => <Field key={key} id={`client-${key}`} label={label} className={key === 'google_review_url' ? 'sm:col-span-2' : ''}><input className="input" id={`client-${key}`} required={required} type={type} min={type === 'number' ? 0 : undefined} value={f[key]} onChange={set(key)}/></Field>)}
    <Field label="Default language" id="client-language"><select className="input" id="client-language" value={f.default_language} onChange={set('default_language')}><option value="en">English</option><option value="es">Español</option></select></Field>
    <Field label="Message style" id="client-tone"><select className="input" id="client-tone" value={f.tone} onChange={set('tone')}>{['friendly', 'professional', 'casual', 'warm'].map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}</select></Field>
    {err && <p className="error-banner sm:col-span-2" role="alert">{err}</p>}<button className="btn-primary sm:col-span-2" disabled={busy}>{busy ? 'Creating…' : 'Create business workspace'}</button>
  </form>
}
