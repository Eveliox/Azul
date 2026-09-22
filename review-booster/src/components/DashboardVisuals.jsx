import { useId } from 'react'

const paths = {
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></>,
  phone: <path d="m7 3 3 5-3 3a14 14 0 0 0 6 6l3-3 5 3c0 3-2 4-4 4C9 21 3 15 3 7c0-2 1-4 4-4Z"/>,
  share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></>,
  megaphone: <><path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1Z"/><path d="M18 9a3 3 0 0 1 0 6M7 15l1 5h3l-1-5"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  send: <><path d="m21 3-7 18-4-7-7-4L21 3Z"/><path d="m10 14 6-6"/></>,
  message: <path d="M21 11a8 8 0 0 1-8 8H7l-4 3V5a2 2 0 0 1 2-2h8a8 8 0 0 1 8 8Z"/>,
  key: <><circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-3-3 3-3m-6 0 3-3"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  logout: <><path d="M9 4H4v16h5m5-12 4 4-4 4m-6-4h13"/></>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
  cursor: <path d="m4 3 6 18 3-8 8-3L4 3Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  building: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1m-5 10v-6h4v6"/></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
}
export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.grid}</svg>
}
export const percent = (a, b) => b > 0 ? Math.round(Number(a || 0) / Number(b) * 100) : 0

export function StatCards({ client: c }) {
  const items = [
    ['Requests sent', c.sent ?? 0, `${c.pending || 0} requests scheduled`, 'send', 'blue'],
    ['Link visits', c.clicked ?? 0, `${percent(c.clicked, c.sent)}% of requests sent`, 'cursor', 'purple'],
    ['Responses received', c.rated ?? 0, 'Private feedback ratings', 'message', 'green'],
    ['Average feedback', c.avg_rating == null ? '—' : Number(c.avg_rating).toFixed(1), 'Out of 5 · not your Google rating', 'star', 'orange'],
  ]
  return <div className="stats-grid">{items.map(([label, value, sub, icon, color]) => <section className="stat-card" key={label}>
    <div className="stat-top"><p>{label}</p><span className={`icon-tile ${color}`}><Icon name={icon}/></span></div>
    <p className="stat-value">{value}</p><p className="stat-note">{sub}</p>
  </section>)}</div>
}

export function ActivityChart({ requests, days, onDaysChange }) {
  const id = useId().replaceAll(':', '')
  const dates = Array.from({ length: days }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - days + i + 1); return d })
  const sameDay = (timestamp, day) => timestamp && new Date(timestamp).toDateString() === day.toDateString()
  const sent = dates.map((d) => requests.filter((r) => sameDay(r.sent_at, d)).length)
  const rated = dates.map((d) => requests.filter((r) => sameDay(r.rated_at, d)).length)
  const max = Math.max(4, ...sent, ...rated)
  const ceiling = Math.ceil(max / 4) * 4
  const x = (i) => 40 + i / (days - 1) * 680
  const y = (n) => 190 - n / ceiling * 150
  const points = (values) => values.map((n, i) => `${x(i)},${y(n)}`).join(' ')
  const totalSent = sent.reduce((a, b) => a + b, 0)
  const totalRated = rated.reduce((a, b) => a + b, 0)
  return <section className="panel activity-chart">
    <div className="panel-heading"><div><h2>Request activity</h2><p>Daily sends and feedback responses</p></div>
      <select aria-label="Activity time range" className="input range-select" value={days} onChange={(e) => onDaysChange(Number(e.target.value))}><option value="7">Last 7 days</option><option value="14">Last 14 days</option><option value="30">Last 30 days</option></select>
    </div>
    <div className="chart-legend"><span><i className="legend-dot blue"/> Sent <strong>{totalSent}</strong></span><span><i className="legend-dot purple"/> Responses <strong>{totalRated}</strong></span></div>
    <svg viewBox="0 0 740 225" role="img" aria-label={`${totalSent} sends and ${totalRated} responses in the last ${days} days, from the latest ${requests.length} requests.`}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4c7cfe" stopOpacity=".2"/><stop offset="100%" stopColor="#4c7cfe" stopOpacity=".01"/></linearGradient></defs>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><line x1="40" x2="720" y1={y(i * ceiling / 4)} y2={y(i * ceiling / 4)} stroke="#edf0f5" strokeDasharray="4 5"/><text x="22" y={y(i * ceiling / 4) + 4} textAnchor="end" fill="#8b94a5" fontSize="10">{i * ceiling / 4}</text></g>)}
      <polygon points={`40,190 ${points(sent)} 720,190`} fill={`url(#${id})`}/>
      <polyline points={points(sent)} fill="none" stroke="#4c7cfe" strokeWidth="2.5" strokeLinejoin="round"/>
      <polyline points={points(rated)} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round"/>
      {dates.map((d, i) => <g key={i}><circle cx={x(i)} cy={y(sent[i])} r="3" fill="#4c7cfe"><title>{d.toLocaleDateString()}: {sent[i]} sent, {rated[i]} responses</title></circle>{(i === 0 || i === days - 1 || i % Math.ceil(days / 5) === 0) && <text x={x(i)} y="216" textAnchor="middle" fill="#8b94a5" fontSize="10">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</text>}</g>)}
    </svg>
    <p className="chart-footnote">Based on the latest {requests.length} requests (up to 100). Summary cards are all-time totals.</p>
  </section>
}

export function ResponseCard({ client: c }) {
  const rate = Math.max(0, Math.min(100, percent(c.rated, c.sent)))
  return <section className="panel response-card"><h2>Customer engagement</h2><p className="muted">Every response is an opportunity.</p>
    <div className="donut-wrap"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="64" fill="none" stroke="#edf1fc" strokeWidth="12"/><circle cx="80" cy="80" r="64" fill="none" stroke="#4c7cfe" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${rate * 4.0212} 402.12`} transform="rotate(-90 80 80)"/></svg><div><strong>{rate}%</strong><span>response rate</span></div></div>
    <div className="engagement-totals"><div><span className="legend-dot blue"/>Responded<strong>{c.rated ?? 0}</strong></div><div><span className="legend-dot pale"/>No response yet<strong>{Math.max(0, Number(c.sent || 0) - Number(c.rated || 0))}</strong></div></div>
    <p className="chart-footnote">Feedback ratings do not confirm a posted Google review.</p>
  </section>
}
