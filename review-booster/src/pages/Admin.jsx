import { useEffect, useState } from 'react'
import MessagesPanel from '../components/MessagesPanel.jsx'
import { api, getAdminKey, setAdminKey, clearAdminKey } from '../api.js'

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminKey())
  return authed ? <Dashboard onLogout={() => { clearAdminKey(); setAuthed(false) }} /> : <Login onOk={() => setAuthed(true)} />
}

function Wordmark() {
  return (
    <span className="inline-flex items-baseline gap-1 text-lg font-bold tracking-tight text-white">
      Azul<span className="w-1.5 h-1.5 rounded-full bg-azul-light self-end mb-1" />
    </span>
  )
}

function Login({ onOk }) {
  const [key, setKey] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('')
    setAdminKey(key)
    try { await api('/api/clients'); onOk() } catch { clearAdminKey(); setErr('That key didn\'t work. Check for extra spaces.') } finally { setBusy(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wordmark />
          <h1 className="text-xl font-semibold tracking-tight mt-4">Review Booster</h1>
          <p className="text-sm text-ink-400 mt-1">Sign in with the access key you were given.</p>
        </div>
        <div className="card">
          <label className="label">Access key</label>
          <input className="input mb-3" type="password" autoFocus value={key} onChange={(e) => setKey(e.target.value.trim())} placeholder="••••••••••••" />
          {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
          <button className="btn-primary w-full" disabled={busy || !key}>{busy ? 'Checking…' : 'Continue'}</button>
        </div>
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
  const [tab, setTab] = useState('activity')

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
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-ink-950/80 backdrop-blur border-b border-ink-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Wordmark />
            <span className="text-ink-700">/</span>
            {isMaster ? (
              <select className="input py-1.5 w-auto max-w-[240px] text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
                {clients.map((c) => <option key={c.client_id} value={c.client_id}>{c.name}</option>)}
              </select>
            ) : (
              <span className="text-sm font-medium truncate">{client?.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isMaster && <button className="btn-ghost btn-sm" onClick={() => setShowNewClient((v) => !v)}>{showNewClient ? 'Cancel' : 'New client'}</button>}
            <button className="btn-ghost btn-sm" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {toast && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 rounded-lg bg-ink-800 border border-ink-700 px-4 py-2.5 text-sm shadow-lg">{toast}</div>
        )}

        {isMaster && showNewClient && (
          <NewClientForm onDone={() => { setShowNewClient(false); loadClients(); notify('Client created') }} />
        )}

        {client && (
          <>
            <StatStrip c={client} />

            <div className="grid lg:grid-cols-[1fr_360px] gap-6 mt-6">
              <div className="space-y-6">
                <section className="card">
                  <div className="mb-4">
                    <p className="eyebrow mb-1">After each visit</p>
                    <h2 className="text-base font-semibold">Send a review request</h2>
                    <p className="text-xs text-ink-400 mt-1">
                      Goes out {client.delay_hours ?? 3}h after you submit. One reminder if they don't tap the link.
                    </p>
                  </div>
                  <NewRequestForm
                    clientId={selected}
                    onDone={() => { loadRequests(selected); loadClients(); notify('Scheduled. They\'ll hear from you soon.') }}
                  />
                </section>

                <section className="card p-0 overflow-hidden">
                  <div className="flex items-center gap-1 px-2 pt-2 border-b border-ink-800">
                    {[['activity', 'Activity'], ['messages', 'Messages'], ...(isMaster ? [['access', 'Access']] : [])].map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`px-3 py-2 text-sm rounded-t-md border-b-2 -mb-px transition ${
                          tab === k ? 'border-azul-light text-white' : 'border-transparent text-ink-400 hover:text-ink-200'
                        }`}
                      >{l}</button>
                    ))}
                    {tab === 'activity' && (
                      <button className="ml-auto mr-2 text-xs text-ink-500 hover:text-ink-200" onClick={() => loadRequests(selected)}>Refresh</button>
                    )}
                  </div>
                  {tab === 'activity' && <RequestsTable requests={requests} />}
                  {tab === 'messages' && (
                    <div className="p-5">
                      <MessagesPanel key={client.client_id} clientId={client.client_id} business={client.name} notify={notify} />
                    </div>
                  )}
                  {tab === 'access' && isMaster && (
                    <div className="p-5">
                      <AccessKey c={client} onRotated={() => { loadClients(); notify(`New key issued for ${client.name}. The old key no longer works.`) }} />
                    </div>
                  )}
                </section>
              </div>

              <aside className="space-y-6">
                <FunnelCard c={client} />
                <HowItWorks />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

function StatStrip({ c }) {
  const tiles = [
    { label: 'Requests sent', value: c.sent, sub: c.pending ? `${c.pending} scheduled` : null },
    { label: 'Tapped the link', value: `${pct(c.clicked, c.sent)}%`, sub: `${c.clicked} of ${c.sent}` },
    { label: 'Sent to Google', value: c.five_star, sub: '5-star ratings' },
    { label: 'Caught privately', value: c.shielded, sub: '1–4 stars, never public', tone: c.shielded ? 'warn' : null },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-3">
      <div className="card col-span-2 lg:col-span-1 flex flex-col justify-between bg-gradient-to-br from-ink-900 to-ink-800/60">
        <p className="eyebrow">Average rating</p>
        <div className="flex items-end gap-2 mt-3">
          <span className="text-4xl font-semibold tracking-tight leading-none">{c.avg_rating ?? '–'}</span>
          <span className="text-ink-400 text-sm mb-0.5">/ 5</span>
        </div>
        <Stars value={Number(c.avg_rating) || 0} />
      </div>
      {tiles.map((t) => (
        <div key={t.label} className="card">
          <p className="text-xs text-ink-400">{t.label}</p>
          <p className={`text-2xl font-semibold tracking-tight mt-2 ${t.tone === 'warn' ? 'text-amber-300' : ''}`}>{t.value ?? 0}</p>
          {t.sub && <p className="text-[11px] text-ink-500 mt-1">{t.sub}</p>}
        </div>
      ))}
    </div>
  )
}

function Stars({ value }) {
  return (
    <div className="flex gap-0.5 mt-3" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={`w-4 h-4 ${n <= Math.round(value) ? 'fill-amber-400' : 'fill-ink-700'}`}>
          <path d="M12 2.5l2.95 6.27 6.85.83-5.05 4.73 1.32 6.8L12 17.77l-6.07 3.36 1.32-6.8L2.2 9.6l6.85-.83L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

function FunnelCard({ c }) {
  const steps = [
    ['Sent', c.sent],
    ['Tapped', c.clicked],
    ['Rated', c.rated],
    ['On Google', c.five_star],
  ]
  const max = Math.max(1, ...steps.map((s) => s[1] || 0))
  return (
    <div className="card">
      <p className="eyebrow mb-4">Funnel</p>
      <div className="space-y-3">
        {steps.map(([label, n], i) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink-300">{label}</span>
              <span className="text-ink-100 font-medium">{n ?? 0}{i > 0 && c.sent ? <span className="text-ink-500 font-normal"> · {pct(n, c.sent)}%</span> : null}</span>
            </div>
            <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden">
              <div className="h-full rounded-full bg-azul-light transition-all" style={{ width: `${((n || 0) / max) * 100}%`, opacity: 1 - i * 0.18 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HowItWorks() {
  const rows = [
    ['1', 'Front desk enters the customer after the visit.'],
    ['2', 'A text and email go out a few hours later.'],
    ['3', '5 stars go to Google. 1–4 stars come to you privately.'],
  ]
  return (
    <div className="card">
      <p className="eyebrow mb-4">How it works</p>
      <ol className="space-y-3">
        {rows.map(([n, t]) => (
          <li key={n} className="flex gap-3 text-sm text-ink-300">
            <span className="w-5 h-5 rounded-full bg-ink-800 text-ink-300 text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">{n}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function RequestsTable({ requests }) {
  if (!requests.length) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm text-ink-300">No requests yet</p>
        <p className="text-xs text-ink-500 mt-1">Use the form above after your next customer visit.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500 border-b border-ink-800">
            <th className="py-2.5 px-5 font-medium">Customer</th>
            <th className="py-2.5 px-3 font-medium">Status</th>
            <th className="py-2.5 px-3 font-medium">Rating</th>
            <th className="py-2.5 px-3 font-medium">Sends</th>
            <th className="py-2.5 px-5 font-medium text-right">Link</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b border-ink-800/70 last:border-0 hover:bg-ink-800/40 transition-colors">
              <td className="py-3 px-5">
                <p className="font-medium text-ink-100">{r.customer_name}</p>
                <p className="text-xs text-ink-500">{r.customer_phone || r.customer_email} · {r.language.toUpperCase()}</p>
              </td>
              <td className="py-3 px-3"><StatusPill s={r.status} error={r.error} /></td>
              <td className="py-3 px-3">
                {r.rating ? (
                  <div>
                    <span className={r.rating === 5 ? 'text-amber-400' : 'text-orange-400'}>{'★'.repeat(r.rating)}<span className="text-ink-700">{'★'.repeat(5 - r.rating)}</span></span>
                    {r.feedback && <p className="text-xs text-ink-400 max-w-[220px] truncate" title={r.feedback}>“{r.feedback}”</p>}
                  </div>
                ) : <span className="text-ink-600">–</span>}
              </td>
              <td className="py-3 px-3 text-xs text-ink-400 whitespace-nowrap">
                {new Date(r.send_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                {r.followup_sent_at && <span className="block text-ink-500">+ reminder</span>}
              </td>
              <td className="py-3 px-5 text-right">
                <a className="text-xs text-ink-400 hover:text-azul-light font-mono" href={`/r/${r.token}`} target="_blank" rel="noreferrer">/r/{r.token}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusPill({ s, error }) {
  const map = {
    pending: ['bg-ink-500', 'Scheduled'], sent: ['bg-azul-light', 'Sent'],
    clicked: ['bg-violet-400', 'Opened'], rated: ['bg-emerald-400', 'Rated'],
    failed: ['bg-red-400', 'Failed'], cancelled: ['bg-ink-600', 'Cancelled'],
  }
  const [dot, label] = map[s] || ['bg-ink-600', s]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-200" title={error || ''}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{label}
    </span>
  )
}

function AccessKey({ c, onRotated }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(c.access_key)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  async function rotate() {
    if (!confirm(`Issue a new key for ${c.name}? Their front desk will need the new key to sign in.`)) return
    await api(`/api/clients?id=${c.client_id}`, { method: 'PATCH', body: { rotate_key: true } })
    onRotated()
  }
  return (
    <div className="max-w-xl">
      <h3 className="text-sm font-semibold">Front-desk access key</h3>
      <p className="text-xs text-ink-400 mt-1 mb-4">Share this with {c.name}. It signs them in to their own view only: no other clients, no settings.</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs break-all bg-ink-950 border border-ink-800 rounded-lg px-3 py-2 text-ink-300">{c.access_key}</code>
        <button className="btn-ghost btn-sm" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <button className="text-xs text-ink-500 hover:text-red-400 mt-3" onClick={rotate}>Reset key (the old one stops working)</button>
    </div>
  )
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
      <div className="sm:col-span-2"><label className="label">Customer name</label><input className="input" required autoComplete="off" placeholder="Maria Lopez" value={f.customer_name} onChange={set('customer_name')} /></div>
      <div><label className="label">Mobile number</label><input className="input" inputMode="tel" placeholder="(305) 555-0100" value={f.customer_phone} onChange={set('customer_phone')} /></div>
      <div><label className="label">Email</label><input className="input" type="email" placeholder="maria@example.com" value={f.customer_email} onChange={set('customer_email')} /></div>
      <div>
        <label className="label">Language</label>
        <select className="input" value={f.language} onChange={set('language')}>
          <option value="">Business default</option><option value="en">English</option><option value="es">Español</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-xs text-ink-400 self-end pb-2.5 cursor-pointer">
        <input type="checkbox" className="accent-azul-blue" checked={f.send_now} onChange={set('send_now')} /> Send right now instead of waiting
      </label>
      {err && <p className="text-red-400 text-xs sm:col-span-2">{err}</p>}
      <div className="sm:col-span-2 flex justify-end">
        <button className="btn-primary" disabled={busy || !clientId}>{busy ? 'Scheduling…' : 'Schedule request'}</button>
      </div>
    </form>
  )
}

function NewClientForm({ onDone }) {
  const [f, setF] = useState({ name: '', slug: '', google_review_url: '', owner_name: '', owner_email: '', owner_phone: '', default_language: 'en', tone: 'friendly', delay_hours: 3, followup_hours: 48 })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr('')
    try { await api('/api/clients', { method: 'POST', body: f }); onDone() } catch (e) { setErr(e.message) }
  }
  return (
    <form onSubmit={submit} className="card mb-6">
      <p className="eyebrow mb-1">Onboarding</p>
      <h2 className="text-base font-semibold mb-5">New client</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="label">Business name</label><input className="input" required placeholder="Hello You Wellness Center" value={f.name} onChange={set('name')} /></div>
        <div><label className="label">Short ID</label><input className="input" required placeholder="helloyou" value={f.slug} onChange={set('slug')} /></div>
        <div><label className="label">Default language</label><select className="input" value={f.default_language} onChange={set('default_language')}><option value="en">English</option><option value="es">Español</option></select></div>
        <div className="sm:col-span-3"><label className="label">Google review link</label><input className="input" required placeholder="https://search.google.com/local/writereview?placeid=…" value={f.google_review_url} onChange={set('google_review_url')} /></div>
        <div><label className="label">Owner name</label><input className="input" value={f.owner_name} onChange={set('owner_name')} /></div>
        <div><label className="label">Owner email <span className="text-ink-500">· gets private feedback</span></label><input className="input" type="email" value={f.owner_email} onChange={set('owner_email')} /></div>
        <div><label className="label">Owner mobile <span className="text-ink-500">· optional</span></label><input className="input" value={f.owner_phone} onChange={set('owner_phone')} /></div>
        <div><label className="label">Ask after (hours)</label><input className="input" type="number" min="0" value={f.delay_hours} onChange={set('delay_hours')} /></div>
        <div><label className="label">Remind after (hours)</label><input className="input" type="number" min="0" value={f.followup_hours} onChange={set('followup_hours')} /></div>
        <div><label className="label">Message style</label><select className="input" value={f.tone} onChange={set('tone')}><option value="friendly">Friendly</option><option value="professional">Professional</option><option value="casual">Casual</option><option value="warm">Warm</option></select></div>
      </div>
      {err && <p className="text-red-400 text-xs mt-3">{err}</p>}
      <div className="flex justify-end mt-5"><button className="btn-primary">Create client</button></div>
    </form>
  )
}
