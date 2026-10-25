import { useEffect, useId, useState } from 'react'

const copy = {
  en: { live: 'AI Agent · Live', revenue: 'Revenue this month', comparison: '↑ 187% vs last month', leads: 'Leads', jobs: 'Jobs booked', response: 'Avg. reply', lead: 'New lead', booked: 'Booked', tabs: ['Leads', 'Calls', 'Reviews', 'Menu'], months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], services: ['Plumbing · Coral Gables', 'AC Repair · Kendall', 'Pool Service · Pinecrest', 'Roofing · Hialeah', 'Pest Control · Doral'] },
  es: { live: 'Agente IA · Activo', revenue: 'Ingresos este mes', comparison: '↑ 187% vs mes anterior', leads: 'Clientes', jobs: 'Agendados', response: 'Resp. media', lead: 'Nuevo cliente', booked: 'Agendado', tabs: ['Clientes', 'Llamadas', 'Reseñas', 'Menú'], months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], services: ['Plomería · Coral Gables', 'Reparación de AC · Kendall', 'Piscinas · Pinecrest', 'Techos · Hialeah', 'Control de plagas · Doral'] },
}
const people = ['Maria G.', 'Carlos R.', 'Sofia M.', 'Luis P.', 'Ana T.']
const times = ['3:00 PM', '2:30 PM', '11:30 AM', '4:15 PM', '9:00 AM']
const chartPath = 'M8 111 C28 111 42 81 64 81 S98 91 120 91 S155 60 176 60 S212 43 232 43 S270 21 292 21'

function StatIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {type === 'user' ? <><circle cx="12" cy="7" r="3" /><path d="M5 21v-3a7 7 0 0 1 14 0v3" /></> : type === 'calendar' ? <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5" /></> : <path d="m13 2-9 12h7l-1 8 10-13h-7z" />}
  </svg>
}

function TabIcon({ index }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {index === 0 ? <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 15v-3m4 3V8m4 7v-5" /></> : index === 1 ? <path d="m8 3 3 5-3 3a14 14 0 0 0 5 5l3-3 5 3c0 4-2 5-5 4C9 18 6 15 4 9 2 5 4 3 8 3Z" /> : index === 2 ? <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /> : <><path d="M5 6h14M5 12h14M5 18h14" /></>}
  </svg>
}

/** Decorative demo; the accessible, explicitly illustrative summary lives in Hero. */
export function GrowthPhone({ lang, still, ready }) {
  const t = copy[lang]
  const gradient = useId()
  const [count, setCount] = useState(0)
  const [lead, setLead] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [counted, setCounted] = useState(false)
  useEffect(() => {
    if (still) { setCounted(true); return }
    if (!ready || counted) return
    let frame, start
    const tick = now => {
      if (start === undefined) start = now
      const progress = Math.min(1, (now - start) / 1200)
      setCount(Math.round(48320 * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setCounted(true)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ready, still, counted])
  useEffect(() => {
    setLeaving(false)
    if (still || !ready) return
    let replacement
    const timer = setInterval(() => {
      if (document.hidden) return
      setLeaving(true)
      replacement = setTimeout(() => { setLead(value => (value + 1) % people.length); setLeaving(false) }, 280)
    }, 5000)
    return () => { clearInterval(timer); clearTimeout(replacement) }
  }, [ready, still])
  const amount = (still || counted ? 48320 : count).toLocaleString(lang === 'es' ? 'es-US' : 'en-US')
  return <div className="growth-phone-rise" aria-hidden="true"><div className="growth-hand-scene"><div className="growth-glow" />
    <img className="growth-hand-photo" src="/images/phone-hand-natural.webp" alt="" width="1122" height="1402" fetchpriority="high" decoding="async" />
      <div className="growth-phone"><div className={`growth-screen revenue-dashboard${ready ? ' dashboard-ready' : ''}`}>
        <div className="growth-status"><span>9:41</span><span className="growth-island" /><svg className="growth-system-icons" viewBox="0 0 52 16" fill="currentColor"><rect x="0" y="10" width="3" height="4" rx=".7" /><rect x="5" y="7" width="3" height="7" rx=".7" /><rect x="10" y="4" width="3" height="10" rx=".7" /><rect x="15" y="1" width="3" height="13" rx=".7" /><rect x="26" y="3" width="22" height="11" rx="3" fill="none" stroke="currentColor" /><rect x="28" y="5" width="16" height="7" rx="1.5" /><path d="M50 6v5" stroke="currentColor" strokeWidth="2" /></svg></div>
        <div className="growth-app-header"><div className="growth-brand"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="" /><span>Growth</span></div><span className="growth-overview">{t.months[5]} 2026<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 6 3 3 3-3" /></svg></span></div>
        <div className="growth-metric"><span>{t.revenue}</span><strong>${amount}</strong><small>{t.comparison}</small></div>
        <div className="growth-chart"><svg viewBox="0 0 300 130" fill="none">
          <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3B5BDB" stopOpacity=".25" /><stop offset="1" stopColor="#3B5BDB" stopOpacity="0" /></linearGradient></defs>
          {[38, 75, 112].map(y => <path key={y} d={`M0 ${y}H300`} stroke="#E6EBF5" />)}
          <path className="growth-chart-fill" d={`${chartPath} V130 H8Z`} fill={`url(#${gradient})`} />
          <path className="growth-chart-line" pathLength="1" d={chartPath} stroke="#3B5BDB" strokeWidth="3" strokeLinecap="round" />
          <circle className="growth-point-ring" cx="292" cy="21" r="9" fill="#3B5BDB" opacity=".18" />
          <circle cx="292" cy="21" r="4.5" fill="#3B5BDB" />
          <g className="growth-chart-tooltip"><rect x="157" y="0" width="122" height="26" rx="9" fill="white" stroke="#E6EBF5" /><text x="218" y="17" fill="#151B2B" textAnchor="middle" fontSize="12" fontWeight="600">{t.months[5]} · 312 {t.leads.toLowerCase()}</text></g>
        </svg><div className="growth-months">{t.months.map(month => <span key={month}>{month}</span>)}</div></div>
        <div className="growth-stats">
          {[['312', t.leads, 'user'], ['42', t.jobs, 'calendar'], ['47s', t.response, 'bolt']].map(([value, label, icon], index) => <div key={icon} style={{ '--stat-index': index }}><StatIcon type={icon} /><strong>{value}</strong><span>{label}</span></div>)}
        </div>
        <div className="growth-notification-slot"><div className={`growth-notification${leaving && !still ? ' is-leaving' : ''}`} key={`${lang}-${lead}`}>
          <span className="growth-check">{people[lead].charAt(0)}<i>✓</i></span><div className="growth-lead-copy"><span className="growth-lead-label">{t.lead}</span><strong>{people[lead]}</strong><p>{t.services[lead]}</p></div><small><span>✓ {t.booked}</span>{times[lead]}</small>
        </div></div>
        <div className="growth-tabs">{t.tabs.map((tab, index) => <span key={tab} className={index === 0 ? 'active' : ''}><TabIcon index={index} />{tab}</span>)}</div><div className="growth-home-indicator" />
      </div></div><img className="growth-hand-foreground" src="/images/phone-hand-natural.webp" alt="" width="1122" height="1402" decoding="async" /></div>
  </div>
}
