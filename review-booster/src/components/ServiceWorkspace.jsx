import { useState } from 'react'
import { Icon } from './DashboardVisuals.jsx'
import { SERVICES, UPCOMING, SETUP, MONTHLY, DELIVERY, activeServices, monthId, planKey, readPlan, reviewEvents } from './servicePlan.js'
import './service-workspace.css'

const ALL_SETUP = Object.values(SETUP).flat()
const ALL_MONTHLY = Object.entries(MONTHLY).flatMap(([service, tasks]) => tasks.map((t) => ({ ...t, service })))
const months = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); return monthId(d) })

function useChecklist(key, tasks) {
  const [error, setError] = useState('')
  const [done, setDone] = useState(() => { try { return readPlan(localStorage, key, tasks.map((t) => t.id)) } catch { return {} } })
  function toggle(id) {
    const next = { ...done }
    if (next[id]) delete next[id]; else next[id] = new Date().toISOString()
    setDone(next)
    try { localStorage.setItem(key, JSON.stringify(next)); setError('') } catch { setError('Browser storage is unavailable. These checkmarks will be lost when you leave this view.') }
  }
  return { done, toggle, error }
}

export default function ServiceWorkspace(props) {
  const [month, setMonth] = useState(monthId())
  // Remount the month plan when changing month; never mix checkmarks between periods.
  return <WorkspaceBody key={`${props.client.client_id}:${props.demo}:${month}`} {...props} month={month} setMonth={setMonth}/>
}

function WorkspaceBody({ client, demo, isMaster, view, navigate, requests, loading, error, month, setMonth }) {
  const [filter, setFilter] = useState('all')
  const [activityFilter, setActivityFilter] = useState('all')
  const setup = useChecklist(planKey(client.client_id, demo, 'setup'), ALL_SETUP)
  const monthly = useChecklist(planKey(client.client_id, demo, month), ALL_MONTHLY)
  const isOverview = view === 'overview'
  const service = SERVICES.find((s) => s.id === view)
  const included = activeServices(client, isMaster)
  const subscribed = client.services || []
  const visible = SERVICES.filter((s) => included.includes(s.id))
  const locked = SERVICES.filter((s) => !subscribed.includes(s.id))
  const selectedServices = filter === 'all' ? visible : visible.filter((s) => s.id === filter)
  const count = (tasks, done) => tasks.filter((t) => done[t.id]).length
  const posts = (id) => MONTHLY[id].filter((t) => t.id.startsWith(`${id}-post-`))
  const taskEvents = [
    ...ALL_SETUP.filter((t) => setup.done[t.id]).map((t) => ({ ...t, date: setup.done[t.id], service: Object.keys(SETUP).find((s) => SETUP[s].some((x) => x.id === t.id)) })),
    ...ALL_MONTHLY.filter((t) => monthly.done[t.id]).map((t) => ({ ...t, date: monthly.done[t.id] })),
  ].map((t) => ({ ...t, state: 'completed', detail: 'Manually checked in this browser · not provider-verified' }))
  const events = [...reviewEvents(requests), ...taskEvents]
    .filter((e) => (filter === 'all' || e.service === filter) && (activityFilter === 'all' || e.state === activityFilter))
    .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  const nextTasks = visible.filter((s) => s.id !== 'reviews' && (filter === 'all' || s.id === filter)).flatMap((s) => {
    const tasks = [...SETUP[s.id], ...(MONTHLY[s.id] || [])]
    const task = tasks.find((t) => !(MONTHLY[s.id]?.includes(t) ? monthly.done[t.id] : setup.done[t.id]))
    return task ? [{ ...task, service: s }] : []
  })

  function metric(s) {
    if (s.id === 'reviews') return [client.rated ?? 0, 'feedback responses · all time']
    if (MONTHLY[s.id]) return [`${count(posts(s.id), monthly.done)} / ${posts(s.id).length}`, `posts checked off · ${month}`]
    return [`${count(SETUP[s.id], setup.done)} / ${SETUP[s.id].length}`, 'setup steps checked off']
  }
  const storageNote = <p className="plan-storage-note"><Icon name="shield" size={15}/><span>Planning only: checkmarks are saved in this browser for this business, not synced to your team or verified by providers. No credentials or patient details belong here.</span></p>

  return <div className="service-workspace">
    {(setup.error || monthly.error) && <div className="error-banner" role="alert">{setup.error || monthly.error}</div>}
    {isOverview ? <>
      <div className="service-section-heading"><div><h2>Your services</h2><p>One workspace. Choose where you want to work.</p></div><span className="workspace-label">{client.name}</span></div>
      <div className="service-filters" role="group" aria-label="Filter services">{[{ id: 'all', name: 'All services', icon: 'grid' }, ...visible].map((s) => <button key={s.id} onClick={() => setFilter(s.id)} aria-pressed={filter === s.id} className={filter === s.id ? 'selected' : ''}><Icon name={s.icon} size={15}/>{s.name}</button>)}</div>
      <div className="service-cards">{selectedServices.map((s) => { const [value, label] = metric(s); return <button key={s.id} className={`service-card service-${s.color}`} onClick={() => navigate(s.id)} aria-label={s.action}>
        <div className="service-card-top"><span className={`icon-tile ${s.color}`}><Icon name={s.icon}/></span><span className={`service-status ${!subscribed.includes(s.id) ? 'not-included' : ''}`}>{!subscribed.includes(s.id) ? 'Not in plan' : s.id === 'reviews' && demo ? 'Demo data' : s.status}</span><Icon name="chevron" size={17}/></div>
        <span className="service-category">{s.category}</span><h3>{s.name}</h3><p>{s.description}</p>
        <div className="service-card-bottom"><span>{label}</span><strong>{value}</strong></div>
      </button> })}
      {filter === 'all' && UPCOMING.map((s) => <div key={s.id} className="service-card service-upcoming" aria-label={`${s.name} — coming soon`}><div className="service-card-top"><span className={`icon-tile ${s.color}`}><Icon name={s.icon}/></span><span className="service-status upcoming">{s.status}</span></div><span className="service-category">{s.category}</span><h3>{s.name}</h3><p>{s.description}</p><div className="service-card-bottom"><span>{isMaster ? 'Not yet available to add to a plan' : 'Ask Azul to be first in line'}</span><strong>Soon</strong></div></div>)}
      {!isMaster && locked.length > 0 && filter === 'all' && <div className="service-card service-locked"><div className="service-card-top"><span className="icon-tile blue"><Icon name="plus"/></span><span className="service-status">Available</span></div><span className="service-category">Grow with Azul</span><h3>Unlock more services</h3><p>Not yet in your plan: {locked.map((s) => s.name).join(', ')}. Message Azul to add a service to this workspace.</p></div>}
      </div>
      {isMaster && locked.length > 0 && <p className="plan-storage-note"><Icon name="key" size={15}/><span>{client.name} is subscribed to {subscribed.length ? subscribed.map((id) => SERVICES.find((s) => s.id === id).name).join(', ') : 'no services yet'}. Their key only shows those. Change the plan under Workspace access.</span></p>}
      {storageNote}
      <div className="service-home-grid">
        <section className="panel service-activity"><div className="panel-heading"><div><h2>Recent activity</h2><p>Review request states + your local planning updates</p></div><select className="input" aria-label="Filter recent activity" value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}><option value="all">All activity</option><option value="attention">Needs attention</option><option value="completed">Completed</option></select></div>
          {error && <div className="error-banner" role="alert">Review activity is unavailable: {error}</div>}
          {loading ? <div className="empty-state" role="status">Loading review activity…</div> : !events.length ? <div className="empty-state"><Icon name="clock" size={25}/><h3>No activity for this filter</h3><p>{included.includes('reviews') ? 'Complete a planning step or use Review Booster to start.' : 'Complete a planning step to see it here.'}</p></div> : <ul className="activity-list">{events.map((event) => <li key={event.id}><span className={`activity-dot ${event.state}`}/><button onClick={() => navigate(event.service)}><strong>{event.title}</strong><small>{event.detail}</small></button><time dateTime={event.date}>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></li>)}</ul>}
          <p className="chart-footnote">Website analytics, call logs, and Google rankings are not connected. No leads or revenue are inferred from this feed.</p>
        </section>
        <aside className="panel next-actions"><div className="panel-heading"><div><h2>Up next</h2><p>Your next steps, not a live calendar</p></div><Icon name="clock" size={18}/></div>
          {included.includes('reviews') && (filter === 'all' || filter === 'reviews') && <button className="next-action" onClick={() => navigate('requests')}><span className="next-service">REVIEW BOOSTER</span><strong>{client.pending || 0} requests scheduled</strong><span>Open customer activity<Icon name="chevron" size={15}/></span></button>}
          {nextTasks.map((t) => <button key={t.id} className="next-action" onClick={() => navigate(t.service.id)}><span className="next-service">{t.service.name}</span><strong>{t.title}</strong><span>Open delivery plan<Icon name="chevron" size={15}/></span></button>)}
          {!nextTasks.length && filter !== 'all' && filter !== 'reviews' && <p className="muted">All planning steps for this service are checked off in this browser.</p>}
        </aside>
      </div>
    </> : service && (() => { const d = DELIVERY[view]; return <>
      <section className={`service-intro service-${service.color}`}><span className={`icon-tile ${service.color}`}><Icon name={service.icon} size={25}/></span><div><p className="eyebrow">{service.status}</p><h2>{service.description}</h2><p>{d.intro}</p></div></section>
      {storageNote}
      <div className="delivery-grid"><div className="delivery-main">
        <TaskList title={d.setupTitle} tasks={SETUP[view]} state={setup}/>
        {MONTHLY[view] && <section className="panel"><div className="panel-heading"><div><h2>{d.monthlyTitle}</h2><p>{d.monthlySub}</p></div><select className="input month-select" aria-label={`${service.name} planning month`} value={month} onChange={(e) => setMonth(e.target.value)}>{months.map((m) => <option key={m} value={m}>{new Date(`${m}-01T12:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</option>)}</select></div><TaskList tasks={MONTHLY[view]} state={monthly} embedded/></section>}
      </div><aside className="delivery-side panel"><span className={`icon-tile ${service.color}`}><Icon name="message"/></span><h2>{d.sideTitle}</h2>
        <p>{d.side}</p>
        <div className="integration-note"><Icon name="shield" size={17}/><strong>{d.noteTitle}</strong><p>{d.note}</p></div>
        <a className="btn-ghost" href={d.link} target="_blank" rel="noreferrer">{d.linkLabel}<Icon name="chevron" size={14}/></a>
        <p className="chart-footnote">Opens a separate tool. Access and subscriptions are managed there.</p>
      </aside></div>
    </> })()}
  </div>
}

function TaskList({ title, tasks, state, embedded }) {
  const completed = tasks.filter((t) => state.done[t.id]).length
  return <section className={embedded ? 'embedded-tasks' : 'panel'}>{title && <div className="panel-heading"><h2>{title}</h2><span className="count-badge">{completed} / {tasks.length} checked</span></div>}
    <div className="plan-progress" role="progressbar" aria-label={title || 'Monthly delivery checkmarks'} aria-valuemin={0} aria-valuemax={tasks.length} aria-valuenow={completed}><span style={{ width: `${completed / tasks.length * 100}%` }}/></div>
    {embedded && <p className="muted">{completed} of {tasks.length} steps manually checked off</p>}
    <ul className="task-list">{tasks.map((task) => <li key={task.id}><label><input type="checkbox" checked={!!state.done[task.id]} onChange={() => state.toggle(task.id)}/><span><strong>{task.title}</strong><small>{task.detail}</small></span></label></li>)}</ul>
  </section>
}
