import { useEffect, useState } from 'react'
import { api, getAdminKey, setAdminKey, clearAdminKey } from '../api.js'

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminKey())
  return authed ? <Dashboard onLogout={() => { clearAdminKey(); setAuthed(false) }} /> : <Login onOk={() => setAuthed(true)} />
}

function Login({ onOk }) {
  const [key, setKey] = useState('')
  const [err, setErr] = useState('')
  async function submit(e) {
    e.preventDefault()
    setAdminKey(key)
    try { await api('/api/clients'); onOk() } catch { clearAdminKey(); setErr('Wrong key') }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-1">Azul Review Booster</h1>
        <p className="text-sm text-ink-400 mb-4">Enter your access key.</p>
        <input className="input mb-3" type="password" value={key} onChange={(e) => setKey(e.target.value.trim())} placeholder="Access key" />
        {err && <p className="text-red-400 text-sm mb-2">{err}</p>}
        <button className="btn-primary w-full">Enter</button>
      </form>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [clients, setClients] = useState([])
  const [role, setRole] = useState(null)
  const [selected, setSelected] = useState('')
  const [requests, setRequests] = useState([])
  const [showNewClient, setShowNewClient] = useState(false)
  const [toast, setToast] = useState('')

  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 4000) }

  async function loadClients() {
    const { clients, role } = await api('/api/clients')
    setClients(clients)
    setRole(role)
    if (!selected && clients[0]) setSelected(clients[0].client_id)
  }
  async function loadRequests(id) {
    if (!id) return
    const { requests } = await api(`/api/requests?client_id=${id}`)
    setRequests(requests)
  }
  useEffect(() => { loadClients() }, [])
  useEffect(() => { loadRequests(selected) }, [selected])

  const client = clients.find((c) => c.client_id === selected)
  const isMaster = role === 'master'

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Review Booster</h1>
          <p className="text-xs text-ink-400">{isMaster ? 'Azul · admin' : client?.name || ''}</p>
        </div>
        <div className="flex gap-2">
          {isMaster && <button className="btn-ghost" onClick={() => setShowNewClient((v) => !v)}>+ Client</button>}
          <button className="btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {toast && <div className="mb-4 rounded-lg bg-azul-dark/40 border border-azul-blue/40 px-4 py-2 text-sm">{toast}</div>}

      {isMaster && showNewClient && (
        <NewClientForm onDone={() => { setShowNewClient(false); loadClients(); notify('Client created') }} />
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card md:col-span-1">
          {isMaster ? (
            <>
              <label className="label">Client</label>
              <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                {clients.map((c) => <option key={c.client_id} value={c.client_id}>{c.name}</option>)}
              </select>
            </>
          ) : (
            <h2 className="font-semibold">{client?.name}</h2>
          )}
          {client && <Stats c={client} />}
          {isMaster && client && (
            <AccessKey c={client} onRotated={() => { loadClients(); notify(`New key issued for ${client.name}. The old key no longer works.`) }} />
          )}
        </div>

        <div className="card md:col-span-2">
          <h2 className="font-semibold mb-1">Job complete → send review request</h2>
          <p className="text-xs text-ink-400 mb-4">
            Sends after the client's delay (default 3h). One follow-up if no click after 48h.
          </p>
          <NewRequestForm
            clientId={selected}
            onDone={(d) => { loadRequests(selected); loadClients(); notify(`Scheduled. Link: ${d.link}`) }}
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent requests</h2>
          <button className="text-xs text-ink-400 hover:text-white" onClick={() => loadRequests(selected)}>refresh</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-400">
            <tr className="text-left">
              <th className="py-2 pr-3">Customer</th>
              <th className="py-2 pr-3">Contact</th>
              <th className="py-2 pr-3">Lang</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Rating</th>
              <th className="py-2 pr-3">Send at</th>
              <th className="py-2 pr-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-ink-800">
                <td className="py-2 pr-3">{r.customer_name}</td>
                <td className="py-2 pr-3 text-ink-300">{r.customer_phone || r.customer_email}</td>
                <td className="py-2 pr-3 uppercase text-xs">{r.language}</td>
                <td className="py-2 pr-3"><StatusPill s={r.status} /></td>
                <td className="py-2 pr-3">
                  {r.rating ? <span className={r.rating === 5 ? 'text-yellow-400' : 'text-orange-400'}>{'★'.repeat(r.rating)}</span> : '—'}
                  {r.feedback && <p className="text-xs text-ink-400 max-w-xs truncate" title={r.feedback}>{r.feedback}</p>}
                </td>
                <td className="py-2 pr-3 text-ink-300 whitespace-nowrap">{new Date(r.send_at).toLocaleString()}</td>
                <td className="py-2 pr-3">
                  <a className="text-azul-light hover:underline" href={`/r/${r.token}`} target="_blank" rel="noreferrer">/r/{r.token}</a>
                </td>
              </tr>
            ))}
            {!requests.length && <tr><td colSpan="7" className="py-6 text-center text-ink-500">No requests yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Stats({ c }) {
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)
  const rows = [
    ['Sent', c.sent],
    ['Clicked', `${c.clicked} (${pct(c.clicked, c.sent)}%)`],
    ['Rated', c.rated],
    ['5-star → Google', c.five_star],
    ['Shielded (1-4★)', c.shielded],
    ['Avg rating', c.avg_rating ?? '—'],
  ]
  return (
    <dl className="mt-4 space-y-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-ink-800 pb-1">
          <dt className="text-ink-400">{k}</dt><dd className="font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function AccessKey({ c, onRotated }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(c.access_key)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  async function rotate() {
    if (!confirm(`Issue a new key for ${c.name}? Their front desk will need the new key to log in.`)) return
    await api(`/api/clients?id=${c.client_id}`, { method: 'PATCH', body: { rotate_key: true } })
    onRotated()
  }
  return (
    <div className="mt-4 pt-3 border-t border-ink-800">
      <label className="label">Front-desk access key</label>
      <code className="block text-xs break-all bg-ink-900 rounded px-2 py-1 mb-2">{c.access_key}</code>
      <div className="flex gap-2">
        <button className="btn-ghost text-xs" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        <button className="btn-ghost text-xs" onClick={rotate}>Reset key</button>
      </div>
    </div>
  )
}

function StatusPill({ s }) {
  const map = {
    pending: 'bg-ink-700 text-ink-200', sent: 'bg-azul-dark/50 text-azul-light',
    clicked: 'bg-purple-900/50 text-purple-300', rated: 'bg-green-900/50 text-green-300',
    failed: 'bg-red-900/50 text-red-300', cancelled: 'bg-ink-800 text-ink-400',
  }
  return <span className={`px-2 py-0.5 rounded text-xs ${map[s] || ''}`}>{s}</span>
}

function NewRequestForm({ clientId, onDone }) {
  const empty = { customer_name: '', customer_phone: '', customer_email: '', language: '', send_now: false }
  const [f, setF] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const d = await api('/api/requests', { method: 'POST', body: { ...f, client_id: clientId, language: f.language || undefined } })
      setF(empty); onDone(d)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
      <div><label className="label">Customer name *</label><input className="input" required value={f.customer_name} onChange={set('customer_name')} /></div>
      <div><label className="label">Phone (SMS)</label><input className="input" placeholder="(305) 555-0100" value={f.customer_phone} onChange={set('customer_phone')} /></div>
      <div><label className="label">Email</label><input className="input" type="email" value={f.customer_email} onChange={set('customer_email')} /></div>
      <div>
        <label className="label">Language</label>
        <select className="input" value={f.language} onChange={set('language')}>
          <option value="">Client default</option><option value="en">English</option><option value="es">Español</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-300 sm:col-span-2">
        <input type="checkbox" checked={f.send_now} onChange={set('send_now')} /> Send immediately (skip delay — useful for testing)
      </label>
      {err && <p className="text-red-400 text-sm sm:col-span-2">{err}</p>}
      <button className="btn-primary sm:col-span-2" disabled={busy || !clientId}>{busy ? 'Scheduling…' : 'Schedule review request'}</button>
    </form>
  )
}

function NewClientForm({ onDone }) {
  const [f, setF] = useState({ name: '', slug: '', google_review_url: '', owner_name: '', owner_email: '', owner_phone: '', default_language: 'en', delay_hours: 3, followup_hours: 48 })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr('')
    try { await api('/api/clients', { method: 'POST', body: f }); onDone() } catch (e) { setErr(e.message) }
  }
  return (
    <form onSubmit={submit} className="card mb-6 grid sm:grid-cols-3 gap-3">
      <h2 className="font-semibold sm:col-span-3">New client</h2>
      <div><label className="label">Business name *</label><input className="input" required value={f.name} onChange={set('name')} /></div>
      <div><label className="label">Slug *</label><input className="input" required placeholder="helloyou" value={f.slug} onChange={set('slug')} /></div>
      <div><label className="label">Default language</label><select className="input" value={f.default_language} onChange={set('default_language')}><option value="en">English</option><option value="es">Español</option></select></div>
      <div className="sm:col-span-3"><label className="label">Google review URL *</label><input className="input" required placeholder="https://search.google.com/local/writereview?placeid=…" value={f.google_review_url} onChange={set('google_review_url')} /></div>
      <div><label className="label">Owner name</label><input className="input" value={f.owner_name} onChange={set('owner_name')} /></div>
      <div><label className="label">Owner email (gets private feedback)</label><input className="input" type="email" value={f.owner_email} onChange={set('owner_email')} /></div>
      <div><label className="label">Owner phone (SMS alerts)</label><input className="input" value={f.owner_phone} onChange={set('owner_phone')} /></div>
      <div><label className="label">Delay before asking (hours)</label><input className="input" type="number" min="0" value={f.delay_hours} onChange={set('delay_hours')} /></div>
      <div><label className="label">Follow-up after (hours)</label><input className="input" type="number" min="0" value={f.followup_hours} onChange={set('followup_hours')} /></div>
      {err && <p className="text-red-400 text-sm sm:col-span-3">{err}</p>}
      <button className="btn-primary sm:col-span-3">Create client</button>
    </form>
  )
}
