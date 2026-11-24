import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMediaQuery, useReducedMotion } from '../../hooks/useMediaQuery'
import { productDemo } from '../../data/productDemo'
import { PixelField, WindowBar } from './ServicesVisuals'
import { OfferCtas } from './Offer'

// The film is laid out at a fixed design size, scaled to fit its frame, and filmed by a camera transform.
const W = 1440, H = 900
const NARROW = '(max-width: 640px)'
// Timeline marks in seconds: chapter starts, the frame shown for each chapter when paused, and the loop length.
const T = { call: 12.2, book: 21.2, end: 26.6, poster: 27.65, card: 27.8, total: 31.2 }
const CHAPTERS = [0, T.call, T.book]
const STILLS = [9.7, 20.4, T.poster]

function DemoIcon({ name, ...props }) {
  const paths = {
    check: <path d="m5 12 4 4L19 6"/>,
    calendar: <><rect x="3" y="5" width="18" height="16"/><path d="M7 2v6m10-6v6M3 10h18m-13 5 3 3 5-5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    phone: <path d="M8 3H4v5c0 6.6 5.4 12 12 12h5v-4l-5-2-2 2-6-6 2-2-2-5Z"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c4 4.5 4 13.5 0 18-4-4.5-4-13.5 0-18Z"/></>,
    transfer: <path d="M4 8h13m-4-4 4 4-4 4M20 16H7m4 4-4-4 4-4"/>,
    grid: <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/>,
    key: <><circle cx="8" cy="8" r="4"/><path d="m11 11 9 9m-4-4 2-2m-5-1 2-2"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    lock: <><rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/></>,
    left: <path d="m14 6-6 6 6 6"/>, right: <path d="m10 6 6 6-6 6"/>, down: <path d="m6 9 6 6 6-6"/>,
    share: <path d="M12 3v12m-4-8 4-4 4 4M6 11v9h12v-9"/>, plus: <path d="M12 5v14M5 12h14"/>,
    snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5"/>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></>,
    speaker: <path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/>,
    hang: <path d="M3 14c5-5 13-5 18 0l-2.5 2.5-3.5-1.5v-2.5a10 10 0 0 0-6 0V15l-3.5 1.5Z"/>,
    pause: <path d="M9 5v14M15 5v14"/>, play: <path d="m8 4 12 8-12 8Z"/>,
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" aria-hidden="true" {...props}>{paths[name]}</svg>
}

// Stacked alternatives in one grid cell; the timeline cross-fades (or rolls) between them.
const Swap = ({ name, items, roll }) => <span className={`film-swap${roll ? ' film-roll' : ''}`} data-film={name}>{items.map((item, i) => <span key={i}>{item}</span>)}</span>
const Pill = ({ tone, label }) => <span className={`fa-pill tone-${tone}`}><i/>{label}</span>

// Our own pointer artwork: arrow, pointing hand, and text cursor. Each is drawn with its hotspot at the origin.
function Cursor() {
  return <div className="film-cursor" data-film="cursor">
    <div className="film-cursor-in" data-film="cursor-in">
      <i className="film-ripple" data-film="ripple"/>
      <svg className="is-arrow" data-film="c-arrow" width="28" height="28" viewBox="0 0 28 28"><path d="M5 3v19.4l5.1-4.8 3.5 7.7 3.6-1.6-3.5-7.5h7.2Z" fill="#17202a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/></svg>
      <svg className="is-hand" data-film="c-hand" width="28" height="28" viewBox="0 0 28 28"><path d="M11 3.2c-1.2 0-2 .9-2 2v9.6l-1.6-1.7c-.8-.8-2-.9-2.8-.1-.8.7-.8 1.9-.1 2.7l4.6 5.6c1.4 1.7 3.1 2.6 5.3 2.6h2.3c3.6 0 6.3-2.8 6.3-6.4v-5.3c0-1.1-.8-1.9-1.9-1.9s-1.9.8-1.9 1.9v-.9c0-1.1-.8-1.9-1.9-1.9s-1.9.8-1.9 1.9v-.6c0-1.1-.8-1.9-1.9-1.9-.6 0-1 .2-1.4.5V5.2c0-1.1-.9-2-2-2Z" fill="#fff" stroke="#17202a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14.8 13.6v4m3.8-3.4v3.4" stroke="#17202a" strokeWidth="1.3" strokeLinecap="round"/></svg>
      <svg className="is-text" data-film="c-text" width="28" height="28" viewBox="0 0 28 28" fill="none" strokeLinecap="round"><path d="M10 4.5h2.2c1 0 1.8.5 1.8 1.5 0-1 .8-1.5 1.8-1.5H18M14 6v16M10 23.5h2.2c1 0 1.8-.5 1.8-1.5 0 1 .8 1.5 1.8 1.5H18" stroke="#fff" strokeWidth="4"/><path d="M10 4.5h2.2c1 0 1.8.5 1.8 1.5 0-1 .8-1.5 1.8-1.5H18M14 6v16M10 23.5h2.2c1 0 1.8-.5 1.8-1.5 0 1 .8 1.5 1.8 1.5H18" stroke="#17202a" strokeWidth="1.6"/></svg>
    </div>
  </div>
}

// The client's website: an estimate form the cursor fills in.
function SitePage({ t }) {
  const s = t.film.site
  const [name, phone, service, message] = t.formFields
  const field = (key, [label], area) => <div className={`fs-field${area ? ' is-area' : ''}`}><span>{label}</span><span className="fs-input" data-film={`in-${key}`}><span className="fs-typed"><span data-film={`type-${key}`}/><i className="fs-caret" data-film={`caret-${key}`}/></span><i className="fs-focus" data-film={`focus-${key}`}/></span></div>
  return <div className="fs-site" data-film="site">
    <header className="fs-nav"><b><i><DemoIcon name="snow" width="18" height="18"/></i>{s.brand}</b><nav>{s.nav.map(item => <span key={item}>{item}</span>)}<span className="fs-lang">EN / ES</span></nav></header>
    <div className="fs-hero">
      <div className="fs-copy">
        <span className="fs-eyebrow">{s.eyebrow}</span><h4>{s.title}</h4><p>{s.body}</p>
        <ul>{s.points.map(point => <li key={point}><DemoIcon name="check" width="16" height="16"/>{point}</li>)}</ul>
        <div className="fs-art"><svg viewBox="0 0 220 120" width="220" height="120" fill="none" stroke="#17202a" strokeWidth="2"><rect x="10" y="14" width="200" height="92" fill="#fff"/><path d="M10 34h200" /><circle cx="70" cy="70" r="26" fill="#e7edff"/><path d="M70 50v40M50 70h40M56 56l28 28M84 56 56 84" stroke="#3154cf"/><path d="M120 56h70M120 70h70M120 84h70" stroke="#17202a55"/><path d="M30 106v8m160-8v8"/></svg><span>EN / ES</span></div>
      </div>
      <div className="fs-form" data-film="form">
        <strong>{t.formTitle}</strong><small>{s.formSub}</small>
        {field('name', name)}
        {field('phone', phone)}
        <div className="fs-field"><span>{service[0]}</span><span className="fs-input fs-select" data-film="in-service"><Swap name="s-service" items={[<em>{s.choose}</em>, service[1]]}/><DemoIcon name="down" width="16" height="16"/><i className="fs-focus" data-film="focus-service"/>
          <span className="fs-options" data-film="options"><i className="fs-opt-hover" data-film="opt-hover"/>{s.options.map((option, i) => <span key={option} data-film={`opt-${i}`}>{option}</span>)}</span></span></div>
        {field('message', message, true)}
        <div className="fs-consent"><span className="fs-box" data-film="box"><i data-film="box-fill"/><DemoIcon name="check" width="14" height="14" strokeWidth="2.4" data-film="tick"/></span>{t.formConsent}</div>
        <div className="fs-send" data-film="send"><Swap name="s-send" items={[t.formSend, <><DemoIcon name="check" width="14" height="14"/>{t.formSent}</>]}/></div>
      </div>
    </div>
  </div>
}

// Review Booster's Speed-to-Lead page (Overview tab and lead details), recreated as static sample markup.
function AppPage({ t }) {
  const a = t.film.app, d = t.film.drawer, [s0, s1, s2] = t.stages
  const tones = ['pending', 'sent', 'rated']
  const stats = [['0', '1'], ['—', t.responseValue], ['0', '1'], ['1']]
  const filters = [[t.all, ['2', '3']], [t.needs, ['1']], [t.booked, ['0', '1']], [a.inProgress, ['0', '1', '0']]]
  return <div className="fa-app" data-film="app">
    <aside className="fa-side">
      <div className="fa-brand"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="" width="104" height="52"/><small>{a.brandSub}</small></div>
      <span className="fa-label">{a.navLabel}</span>
      {a.nav.map((item, i) => <span className={`fa-nav${i === 2 ? ' is-active' : ''}`} key={item}><DemoIcon name={['grid', 'globe', 'phone', 'key'][i]} width="16" height="16"/><span>{item}</span></span>)}
    </aside>
    <div className="fa-body">
      <div className="fa-top"><span>{a.crumb}</span><span className="fa-account"><b>AZ</b><span><strong>{a.account}</strong><small>{a.role}</small></span></span></div>
      <div className="fa-main">
        <header className="fa-head"><WindowBar title={a.bar}/><PixelField/>
          <div><p className="fa-eyebrow">{a.eyebrow}</p><div className="fa-title"><h4>{t.agent}</h4><span className="fa-mode"><i/>{t.live}</span></div><p>{a.modeNote}</p></div>
          <span className="fa-btn"><DemoIcon name="clock" width="14" height="14"/>{t.agentSettings}</span>
        </header>
        <div className="fa-tabs">{[t.overview, t.leads, t.agentSettings, t.setup].map((tab, i) => <span className={i === 0 ? 'is-active' : ''} key={tab}>{tab}{i === 1 && <Swap name="s-count" roll items={['2', '3']}/>}</span>)}</div>
        <div className="fa-section"><h5>{a.performance}</h5><span>{a.today}</span></div>
        <div className="fa-stats" data-film="stats">{t.metrics.map((label, i) => <div className="fa-stat" key={label} data-film={`stat-${i}`}><span>{label}</span><strong><Swap name={`s-stat-${i}`} roll items={stats[i]}/></strong><small>{a.metricNotes[i]}</small></div>)}</div>
        <section className="fa-inbox">
          <WindowBar title={a.inboxBar}/>
          <div className="fa-inbox-head"><div><h5>{t.recent}</h5><p>{a.inboxNote}</p></div><span className="fa-sync">{a.sync}</span></div>
          <div className="fa-toolbar"><div className="fa-filters">{filters.map(([label, counts], i) => <span className={i === 0 ? 'is-active' : ''} key={label}>{label}<Swap name={i === 0 ? 's-count' : `s-filter-${i}`} roll items={counts}/></span>)}</div><span className="fa-search"><DemoIcon name="search" width="15" height="15"/>{a.search}</span></div>
          <div className="fa-th fa-tr">{a.columns.map(column => <span key={column}>{column}</span>)}</div>
          <div className="fa-rows">
            <div className="fa-tr" data-film="row"><i className="fa-flash" data-film="row-flash"/>
              <span><b className="fa-lead" data-film="row-name">Alex Morgan</b><small>(305) 555-0142</small></span>
              <span>{t.service}</span>
              <span><Swap name="s-row-status" items={[s0, s1, s2].map((stage, i) => <Pill tone={tones[i]} label={stage.status}/>)}/></span>
              <span><time>{a.received}</time></span>
              <span><Swap name="s-row-next" items={[s0.next, s1.next, s2.next]}/></span>
            </div>
            {a.others.map(([name, phone, service, status, tone, received, next]) => <div className="fa-tr" data-film="old-row" key={name}>
              <span><b className="fa-lead">{name}</b><small>{phone}</small></span><span>{service}</span><span><Pill tone={tone} label={status}/></span><span><time>{received}</time></span><span className={tone === 'failed' ? 'fa-attn' : ''}>{next}</span>
            </div>)}
          </div>
          <div className="fa-foot"><span><Swap name="s-count" roll items={['2', '3']}/> {a.shown} <Swap name="s-count" roll items={['2', '3']}/> {a.latest}</span><span>{a.viewAll}</span></div>
        </section>
      </div>
      <i className="fa-backdrop" data-film="backdrop"/>
      <aside className="fa-drawer" data-film="drawer">
        <div className="fa-drawer-bar"><span>{d.bar}</span><span className="fa-close" data-film="close">×</span></div>
        <div className="fa-drawer-in">
          <header>
            <div><h4>Alex Morgan</h4><Swap name="s-drawer-status" items={[<Pill tone="sent" label={s1.status}/>, <Pill tone="rated" label={s2.status}/>]}/></div>
            <div className="fa-next"><h6>{d.next}</h6><p><Swap name="s-drawer-next" items={[s1.next, s2.next]}/></p></div>
          </header>
          <div className="fa-cols">
            <section className="fa-call" data-film="call">
              <div className="fa-call-top"><i className="fa-call-dot" data-film="call-dot"/><Swap name="s-call-state" items={[t.callLive, d.callEnded]}/><b className="fa-call-time" data-film="timer"/><span className="fa-call-lang">EN / ES</span></div>
              <div className="fa-call-who"><span className="fa-avatar">AM</span><div><strong>Alex Morgan</strong><span>(305) 555-0142 · {t.callAfter}</span></div></div>
              <div className="fa-wave">{Array.from({ length: 30 }, (_, i) => <i key={i} data-film="bar" style={{ '--h': `${34 + ((i * 37) % 62)}%` }}/>)}</div>
              <ol className="fa-transcript">{t.transcript.map(([who, line], i) => <li className={who === 'agent' ? 'is-agent' : 'is-lead'} data-film="line" key={i}><span>{who === 'agent' ? t.agentLabel : 'Alex'}</span><p>{line.split(' ').map((word, j) => <Fragment key={j}>{j > 0 && ' '}<span className="fa-w">{word}</span></Fragment>)}</p></li>)}</ol>
            </section>
            <div className="fa-side-col">
              <section className="fa-cal" data-film="cal">
                <div className="fa-cal-bar"><DemoIcon name="calendar" width="14" height="14"/><span>{t.calendarTitle}</span><span>{t.calendarWeek}</span></div>
                <div className="fa-cal-grid">
                  <span/>{t.calendarDays.map((day, i) => <span className={`fa-day${i === 1 ? ' is-target' : ''}`} key={day}>{day}</span>)}
                  {['8', '9', '10', '11'].map((hour, row) => [
                    <span className="fa-hour" key={hour}>{hour} AM</span>,
                    ...t.calendarDays.map((day, col) => {
                      const target = row === 1 && col === 1
                      const busy = (row === 0 && col === 0) || (row === 2 && col === 1) || (row === 3 && col === 3) || (row === 1 && col === 4) || (row === 0 && col === 2)
                      return <span className={busy ? 'fa-busy' : ''} key={`${hour}-${day}`}>{target ? <><i className="fa-hint" data-film="slot-hint"/><b className="fa-event" data-film="slot"><strong>{t.service}</strong><em>9:00 · Alex Morgan</em></b></> : busy ? t.busy : ''}</span>
                    }),
                  ])}
                </div>
              </section>
              <section className="fa-contact"><h6>{d.contact}</h6><dl>{[['(305) 555-0142', true], [t.service], [t.language], [d.consent]].map(([value, link], i) => <div key={d.rows[i]}><dt>{d.rows[i]}</dt><dd className={link ? 'is-link' : ''}>{value}</dd></div>)}</dl></section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
}

// Overlay in frame space (not filmed by the camera): notifications, captions, the lead's phone, and the end card.
function Hud({ t, hudRef }) {
  const f = t.film, n = f.notify
  const note = (key, title, body) => <div className="film-note" data-film={key}><span className="film-note-icon"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="" width="30" height="15"/></span><div><span className="film-note-app"><b>{n.app}</b><small>{n.now}</small></span><strong>{title}</strong><p>{body}</p></div></div>
  return <div className="film-hud" ref={hudRef}>
    <div className="film-hud-deco" aria-hidden="true">
      {note('note1', n.newLead, n.newLeadBody)}
      {note('note2', t.ownerNotice, t.ownerNoticeBody)}
      <div className="film-captions">
        <span className="film-caption" data-film="cap-later"><DemoIcon name="clock" width="15" height="15"/><span data-film="later"/></span>
      </div>
      {/* Top of the frame: the bottom is the contact table while the calendar is on screen. */}
      <div className="film-captions is-top">
        <span className="film-caption" data-film="cap-booked"><DemoIcon name="calendar" width="15" height="15"/>{f.bookedCaption}</span>
      </div>
      <div className="film-phone" data-film="phone"><div className="film-phone-body"><div className="film-phone-screen">
        <i className="film-phone-cam"/><span className="film-phone-status"><span>10:43</span><span>5G</span></span>
        <span className="film-phone-av"><DemoIcon name="snow" width="26" height="26"/></span>
        <strong>{f.phone.caller}</strong><small>{f.phone.sub}</small><b data-film="timer"/>
        <span className="film-phone-wave">{Array.from({ length: 16 }, (_, i) => <i key={i} data-film="pbar" style={{ '--h': `${30 + ((i * 29) % 66)}%` }}/>)}</span>
        <span className="film-phone-keys"><i><DemoIcon name="mic" width="17" height="17"/></i><i><DemoIcon name="speaker" width="17" height="17"/></i><i><DemoIcon name="hang" width="19" height="19"/></i></span>
      </div></div></div>
    </div>
    <div className="film-end" data-film="end"><p>{f.end}</p><OfferCtas/></div>
  </div>
}

// Element box relative to the unscaled stage, ignoring every CSS transform (camera, slides, presses).
function layoutBox(el, stage) {
  let x = 0, y = 0, node = el
  while (node && node !== stage) {
    x += node.offsetLeft; y += node.offsetTop
    node = node.offsetParent
    if (node && node !== stage) { x += node.clientLeft; y += node.clientTop }
  }
  const w = el.offsetWidth, h = el.offsetHeight
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 }
}
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const ease = gsap.parseEase('power3.inOut')

// Builds the whole film as one paused, looping timeline. `onSync(time)` runs on every render and after seeks.
function buildFilm({ root, stage, t, narrow, fw, fh, onSync }) {
  const q = name => root.querySelector(`[data-film="${name}"]`)
  const qa = name => [...root.querySelectorAll(`[data-film="${name}"]`)]
  const box = name => layoutBox(q(name), stage)
  const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power2.out' } })

  // Camera: a design-space rectangle fills the frame. Phones keep a fixed, readable width on the active region.
  const ratio = fh / fw, tight = clamp(1000 / fw, 1, 1.35)
  const shot = (target, zoom = 1, dx = 0, dy = 0) => {
    const b = typeof target === 'string' ? box(target) : target
    const w = narrow ? clamp(fw / .85, 380, 460) : zoom === 1 ? W : W / (zoom * tight), h = w * ratio
    const x = w <= W ? clamp(b.cx + dx - w / 2, 0, W - w) : (W - w) / 2
    const y = h <= H ? clamp(b.cy + dy - h / 2, 0, H - h) : (H - h) / 2
    const k = W / w
    return { x: -x * k, y: -y * k, scale: k }
  }
  const FULL = { x: 0, y: 0, scale: 1 }
  const camera = stage
  const cam = (to, at, duration = 1) => tl.to(camera, { ...to, duration, ease: 'power3.inOut' }, at)

  // Text that types or counts is derived from the playhead, so seeks, loops and language rebuilds stay in step.
  const writers = []
  const write = (els, start, end, fn) => els.forEach(el => writers.push({ el, start, end, fn, last: null }))
  const type = (key, text, start, end) => write(qa(`type-${key}`), start, end, p => text.slice(0, Math.round(p * text.length)))
  const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

  // Swaps: show one child at a time.
  const shown = {}
  root.querySelectorAll('.film-swap').forEach(el => gsap.set([...el.children].slice(1), { opacity: 0 }))
  const swap = (name, to, at) => {
    const from = shown[name] ?? 0
    qa(name).forEach(el => {
      const kids = [...el.children]
      if (el.classList.contains('film-roll')) {
        tl.to(kids[from], { yPercent: -110, opacity: 0, duration: .45, ease: 'power3.inOut' }, at)
          .set(kids[to], { yPercent: 110 }, at)
          .to(kids[to], { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.inOut' }, at)
      } else {
        tl.to(kids[from], { opacity: 0, y: -5, duration: .22, ease: 'power2.in' }, at)
          .set(kids[to], { y: 6 }, at)
          .to(kids[to], { opacity: 1, y: 0, duration: .3 }, at + .12)
      }
    })
    shown[name] = to
  }

  // Cursor: curved (quadratic bezier) moves with a small overshoot and settle, shape changes, and clicks.
  const cursor = q('cursor'), inner = q('cursor-in'), ripple = q('ripple')
  const shapes = { arrow: q('c-arrow'), hand: q('c-hand'), text: q('c-text') }
  let pos = { x: 1040, y: 760 }, shape = 'arrow', bend = 1
  const point = (name, dx, dy = 0) => { const b = box(name); return { x: b.x + (dx ?? b.w / 2), y: b.cy + dy } }
  const setShape = (next, at) => { if (next === shape) return; tl.set(shapes[shape], { opacity: 0 }, at).set(shapes[next], { opacity: 1 }, at); shape = next }
  const curve = (from, to, control) => {
    const span = Math.abs(to - from) < .01 ? .01 : to - from, r = (control - from) / span
    return [from + span, s => { const u = ease(s); return 2 * (1 - u) * u * r + u * u }]
  }
  const move = (to, at, duration = .6, next = shape) => {
    const len = Math.hypot(to.x - pos.x, to.y - pos.y)
    bend = -bend
    const off = Math.min(120, len * .2) * bend, nx = -(to.y - pos.y) / (len || 1), ny = (to.x - pos.x) / (len || 1)
    const c = { x: (pos.x + to.x) / 2 + nx * off, y: (pos.y + to.y) / 2 + ny * off }
    const tx = to.x - c.x, ty = to.y - c.y, tlen = Math.hypot(tx, ty) || 1, over = Math.min(9, len * .05)
    const [x, xEase] = curve(pos.x, to.x + tx / tlen * over, c.x), [y, yEase] = curve(pos.y, to.y + ty / tlen * over, c.y)
    tl.to(cursor, { x, duration, ease: xEase }, at).to(cursor, { y, duration, ease: yEase }, at)
      .to(cursor, { x: to.x, y: to.y, duration: .2, ease: 'power2.out' }, at + duration)
    setShape(next, at + duration * .8)
    pos = to
    return at + duration + .2
  }
  const click = (at, target, press = .96) => {
    tl.to(inner, { scale: .9, duration: .08 }, at).to(inner, { scale: 1, duration: .18 }, at + .08)
      .set(ripple, { scale: .3, opacity: .7 }, at).to(ripple, { scale: 1.7, opacity: 0, duration: .5 }, at)
    if (target) tl.to(target, { scale: press, duration: .08 }, at).to(target, { scale: 1, duration: .2 }, at + .08)
  }
  let focused = null
  const focus = (key, at, caret = true) => {
    if (focused) tl.set([q(`focus-${focused}`), q(`caret-${focused}`)].filter(Boolean), { opacity: 0 }, at)
    if (key) tl.set(q(`focus-${key}`), { opacity: 1 }, at)
    if (key && caret) tl.set(q(`caret-${key}`), { opacity: 1 }, at)
    focused = key
  }

  // Starting state.
  const win = q('window'), site = q('site'), app = q('app'), rowH = q('row').offsetHeight
  gsap.set(camera, { transformOrigin: '0 0', ...(narrow ? shot('url') : FULL) })
  gsap.set(win, { opacity: 0, y: 36, scale: .975, transformOrigin: '50% 50%' })
  gsap.set(cursor, { x: pos.x, y: pos.y, opacity: 0 })
  gsap.set(inner, { transformOrigin: '0 0' })
  gsap.set([shapes.hand, shapes.text, ripple, app, q('opt-hover'), q('box-fill'), q('backdrop'), q('row'), q('row-flash'), q('slot-hint')], { opacity: 0 })
  gsap.set(root.querySelectorAll('.fs-caret, .fs-focus'), { opacity: 0 })
  gsap.set(q('options'), { opacity: 0, y: -8 })
  gsap.set(q('tick'), { opacity: 0, scale: .4, transformOrigin: '50% 50%' })
  gsap.set(q('load'), { scaleX: 0, opacity: 0, transformOrigin: '0 50%' })
  gsap.set(qa('old-row'), { y: -rowH })
  gsap.set(q('drawer'), { xPercent: 104 })
  gsap.set(qa('line'), { opacity: 0, y: 8 })
  gsap.set(root.querySelectorAll('.fa-w'), { opacity: 0 })
  gsap.set(qa('bar'), { scaleY: .25 })
  gsap.set(qa('pbar'), { scaleY: .3 })
  gsap.set(q('slot'), { opacity: 0, y: -18, scale: .92, transformOrigin: '50% 0' })
  gsap.set([q('note1'), q('note2')], { opacity: 0, x: 48 })
  gsap.set([q('cap-later'), q('cap-booked')], { opacity: 0, y: 12 })
  gsap.set(q('phone'), { opacity: 0, y: 70 })
  gsap.set(q('end'), { autoAlpha: 0 })
  gsap.set(q('end').children, { opacity: 0, y: 18 })

  const [name, phone, , message] = t.formFields.map(([, value]) => value)

  // 0–2s: the window fades up, camera pulled back on the website.
  tl.addLabel('capture', 0)
  tl.to(win, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, .15)
  tl.to(cursor, { opacity: 1, duration: .3 }, 1.1)

  // 2–9.7s Capture: the camera moves in and the cursor fills in the form.
  cam(narrow ? shot('in-name') : shot('form', 1.5), 1.5, 1.1)
  let at = move(point('in-name', 34), 2.0, .75, 'text')
  click(at); focus('name', at); type('name', name, at + .1, at + .8)
  narrow && cam(shot('in-phone'), 3.6, .7)
  at = move(point('in-phone', 46), 3.8, .4)
  click(at); focus('phone', at); type('phone', phone, at + .1, at + .8)
  narrow && cam(shot('in-service', 1, 0, 60), 5.0, .7)
  at = move(point('in-service', box('in-service').w - 40), 5.25, .4, 'hand')
  click(at, q('in-service'), .985); focus('service', at, false)
  tl.to(q('options'), { opacity: 1, y: 0, duration: .2 }, at + .05)
  at = move(point('opt-0', 70), at + .2, .3)
  tl.to(q('opt-hover'), { opacity: 1, duration: .12 }, at - .25)
  click(at)
  tl.to(q('options'), { opacity: 0, y: -6, duration: .16, ease: 'power2.in' }, at + .1).set(q('opt-hover'), { opacity: 0 }, at + .3)
  swap('s-service', 1, at + .1)
  narrow && cam(shot('in-message', 1, 0, 40), at, .7)
  at = move(point('in-message', 40, -10), at + .15, .35, 'text')
  click(at); focus('message', at); type('message', message, at + .1, at + .75)
  narrow && cam(shot('send', 1, 0, -70), at + .5, .7)
  at = move(point('box'), at + .8, .35, 'hand')
  click(at, q('box'), .9); focus(null, at)
  tl.to(q('box-fill'), { opacity: 1, duration: .12 }, at).to(q('tick'), { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2.5)' }, at + .02)
  at = move(point('send'), at + .1, .3)
  click(at, q('send'), .97)
  swap('s-send', 1, at + .08)
  tl.addLabel('captureStill', STILLS[0])

  // 9.8–12s Hand-off: camera pulls back, the browser opens the dashboard, the lead arrives.
  cam(narrow ? shot('url') : FULL, 9.8, 1)
  move({ x: 1190, y: 640 }, 9.9, .7, 'arrow')
  tl.to(q('load'), { opacity: 1, duration: .1 }, 10.0).to(q('load'), { scaleX: 1, duration: .6, ease: 'power2.inOut' }, 10.0).to(q('load'), { opacity: 0, duration: .2 }, 10.6)
  swap('s-url', 1, 10.2)
  tl.to(site, { opacity: 0, duration: .4, ease: 'power2.inOut' }, 10.3).to(app, { opacity: 1, duration: .45, ease: 'power2.inOut' }, 10.35)
  narrow && cam(shot('row-name', 1, 100), 10.9, .9)
  tl.to(q('note1'), { x: 0, duration: .55, ease: 'power3.out' }, 10.9).to(q('note1'), { opacity: 1, duration: .2 }, 10.9)
  tl.to(q('cap-later'), { opacity: 1, y: 0, duration: .4 }, 11.0).to(q('cap-later'), { opacity: 0, y: 8, duration: .35, ease: 'power2.in' }, 13.0)
  write(qa('later'), 11.0, 12.0, p => `${Math.round(p * 22)} ${t.film.later}`)
  tl.to(qa('old-row'), { y: 0, duration: .5, ease: 'power3.out' }, 11.1)
  tl.set(q('row'), { y: -10 }, 11.1).to(q('row'), { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, 11.15)
  tl.to(q('row-flash'), { opacity: 1, duration: .2 }, 11.15).to(q('row-flash'), { opacity: 0, duration: 1.6, ease: 'power1.in' }, 13.2)
  swap('s-count', 1, 11.3); swap('s-stat-0', 1, 11.3); swap('s-filter-3', 1, 11.3)
  swap('s-row-status', 1, 11.9); swap('s-row-next', 1, 11.9)

  // 12.2–21.2s Call: open the lead, zoom on the live call, the lead's phone slides in.
  tl.addLabel('call', T.call)
  at = move(point('row-name', 40), 12.3, .6, 'hand')
  click(at, q('row'), .995)
  tl.to(q('note1'), { opacity: 0, x: 48, duration: .4, ease: 'power2.in' }, 13.0)
  tl.to(q('backdrop'), { opacity: 1, duration: .35 }, at + .1).to(q('drawer'), { xPercent: 0, duration: .55, ease: 'power3.out' }, at + .1)
  tl.to(cursor, { opacity: 0, duration: .3 }, 13.4)
  cam(narrow ? shot('call') : shot('call', 1.7), 13.6, 1)
  tl.to(q('phone'), { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, 13.9)
  write(qa('timer'), 14.0, 20.6, p => clock(p * 108))
  tl.to(qa('bar'), { scaleY: i => .4 + ((i * 41) % 60) / 100, duration: .22, ease: 'sine.inOut', repeat: 27, yoyo: true, stagger: { each: .02, from: 'random' } }, 14.0)
  tl.to(qa('pbar'), { scaleY: i => .45 + ((i * 23) % 55) / 100, duration: .24, ease: 'sine.inOut', repeat: 25, yoyo: true, stagger: { each: .03, from: 'random' } }, 14.0)
  const lines = qa('line'), spans = [[14.4, 16.4], [16.7, 17.6], [17.9, 19.3], [19.6, 20.0]]
  lines.forEach((line, i) => {
    const words = line.querySelectorAll('.fa-w'), [start, end] = spans[i] || [20, 20.2]
    tl.to(line, { opacity: 1, y: 0, duration: .3 }, start - .15).to(words, { opacity: 1, duration: .12, ease: 'none', stagger: (end - start) / words.length }, start)
  })
  narrow && cam(shot('call', 1, 0, 60), 17.6, 1.2)
  tl.addLabel('callStill', STILLS[1])
  swap('s-call-state', 1, 20.6)
  tl.to(q('call-dot'), { opacity: .25, duration: .3 }, 20.6)
  tl.to(q('phone'), { opacity: 0, y: 70, duration: .45, ease: 'power2.in' }, narrow ? 16.6 : 20.8)

  // 21.2–26.6s Book: pan to the calendar, the visit drops in, statuses and numbers update.
  tl.addLabel('book', T.book)
  cam(narrow ? shot('cal') : shot('cal', 1.7, 0, -40), T.book, 1)
  tl.to(q('slot-hint'), { opacity: 1, duration: .25 }, 21.9)
  tl.to(q('slot'), { opacity: 1, y: 0, scale: 1, duration: .65, ease: 'back.out(1.5)' }, 22.2).to(q('slot-hint'), { opacity: 0, duration: .2 }, 22.4)
  swap('s-drawer-status', 1, 22.5); swap('s-drawer-next', 1, 22.5); swap('s-row-status', 2, 22.5); swap('s-row-next', 2, 22.5)
  swap('s-filter-2', 1, 22.5); swap('s-filter-3', 2, 22.5)
  // The caption leaves before the summary notification arrives, so the two never overlap at the top.
  tl.to(q('cap-booked'), { opacity: 1, y: 0, duration: .4 }, 22.7).to(q('cap-booked'), { opacity: 0, y: -8, duration: .3, ease: 'power2.in' }, 24.2)
  tl.to(q('note2'), { x: 0, duration: .55, ease: 'power3.out' }, 24.5).to(q('note2'), { opacity: 1, duration: .2 }, 24.5).to(q('note2'), { opacity: 0, x: 48, duration: .4, ease: 'power2.in' }, 26.2)
  const close = point('close')
  tl.set(cursor, { x: close.x - 150, y: close.y + 190 }, 23.9)
  pos = { x: close.x - 150, y: close.y + 190 }
  narrow && cam(shot('close', 1, -120, 120), 23.6, .9)
  tl.to(cursor, { opacity: 1, duration: .25 }, 24.0)
  at = move(close, 24.05, .5, 'hand')
  click(at, q('close'), .9)
  tl.to(q('drawer'), { xPercent: 104, duration: .5, ease: 'power3.in' }, at + .12).to(q('backdrop'), { opacity: 0, duration: .4 }, at + .2)
  const stats = box('stats'), row = box('row')
  const summary = { cx: (stats.x + stats.x + stats.w) / 2, cy: (stats.y + row.y + row.h) / 2 }
  cam(narrow ? shot('stat-1') : shot(summary, 1.25), 24.95, 1)
  narrow && cam(shot('stat-2'), 25.6, .8)
  move({ x: 1250, y: 820 }, 25.1, .6, 'arrow')
  tl.to(cursor, { opacity: 0, duration: .3 }, 25.5)
  swap('s-stat-1', 1, 25.5); swap('s-stat-2', 1, 25.75)
  tl.to(q('row-flash'), { opacity: 1, duration: .2 }, 25.6).to(q('row-flash'), { opacity: 0, duration: 1, ease: 'power1.in' }, 26.0)

  // 26.6–31.2s End: pull back, the closing line and the booking link, then fade for the loop.
  tl.addLabel('end', T.end)
  cam(narrow ? shot({ cx: box('stat-2').cx - 90, cy: (stats.cy + row.cy) / 2 }) : FULL, T.end, 1)
  tl.addLabel('poster', T.poster)
  tl.to(q('end'), { autoAlpha: 1, duration: .6 }, T.card).to(q('end').children, { opacity: 1, y: 0, duration: .6, stagger: .12, ease: 'power3.out' }, T.card + .1)
  tl.to([q('end'), win], { opacity: 0, duration: .5, ease: 'power2.in' }, T.total - .6).set(q('end'), { visibility: 'hidden' }, T.total - .1)
  tl.set({}, {}, T.total)

  const sync = () => {
    const time = tl.time()
    writers.forEach(w => {
      const text = w.fn(clamp((time - w.start) / (w.end - w.start), 0, 1))
      if (text !== w.last) { w.el.textContent = text; w.last = text }
    })
    onSync(time)
  }
  tl.eventCallback('onUpdate', sync)
  return { tl, sync }
}

// The product demo: a scripted "screen recording" of the speed-to-lead flow, built from live DOM and one GSAP timeline.
export function ConnectedJourney({ lang }) {
  const t = productDemo[lang] || productDemo.en
  const reduced = useReducedMotion()
  const narrow = useMediaQuery(NARROW)
  const root = useRef(null), frame = useRef(null), fit = useRef(null), camera = useRef(null), hud = useRef(null), fill = useRef(null)
  const tlRef = useRef(null), syncRef = useRef(() => {}), timeRef = useRef(null), chapterRef = useRef(null), endRef = useRef(null), runningRef = useRef(false)
  const [chapter, setChapter] = useState(reduced ? 2 : 0)
  const [atEnd, setAtEnd] = useState(false)
  const [playing, setPlaying] = useState(!reduced)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [fontsReady, setFontsReady] = useState(false)
  const running = playing && visible && pageVisible
  runningRef.current = running

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 })
    observer.observe(frame.current)
    const update = () => setPageVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    let live = true
    document.fonts?.ready.then(() => live && setFontsReady(true))
    return () => { live = false; observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])

  // Scale the 1440×900 stage and the overlay to the frame; rebuild the timeline (debounced) when the frame size changes.
  useLayoutEffect(() => {
    const el = frame.current
    let timer
    const apply = () => {
      const w = el.clientWidth, h = el.clientHeight, s = Math.min(1, Math.max(.72, w / 1160))
      fit.current.style.transform = `scale(${w / W})`
      Object.assign(hud.current.style, { width: `${w / s}px`, height: `${h / s}px`, transform: `scale(${s})` })
      return { w, h }
    }
    setSize(apply())
    const observer = new ResizeObserver(() => {
      const next = apply()
      clearTimeout(timer)
      timer = setTimeout(() => setSize(prev => Math.abs(prev.w - next.w) > 1 || Math.abs(prev.h - next.h) > 1 ? next : prev), 150)
    })
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [])

  const onSync = time => {
    timeRef.current = time
    if (fill.current) fill.current.style.transform = `scaleX(${time / T.total})`
    const next = time >= T.book ? 2 : time >= T.call ? 1 : 0
    if (next !== chapterRef.current) { chapterRef.current = next; setChapter(next) }
    const end = time >= T.card
    if (end !== endRef.current) { endRef.current = end; setAtEnd(end) }
  }

  // One timeline per language and frame size; a rebuild keeps the playhead (and so the chapter).
  useGSAP(() => {
    if (!size.w) return
    const film = buildFilm({ root: root.current, stage: camera.current, t, narrow, fw: size.w, fh: size.h, onSync })
    tlRef.current = film.tl; syncRef.current = film.sync
    film.tl.seek(timeRef.current ?? (reduced ? T.poster : 0))
    film.sync()
    if (runningRef.current) film.tl.play()
    return () => { tlRef.current = null; syncRef.current = () => {} }
  }, { dependencies: [lang, narrow, size.w, size.h, fontsReady], scope: root, revertOnUpdate: true })

  useEffect(() => {
    const tl = tlRef.current
    if (tl) running ? tl.play() : tl.pause()
  }, [running])

  const seek = time => { const tl = tlRef.current; if (tl) { tl.seek(time); syncRef.current() } }
  useEffect(() => { if (reduced) { setPlaying(false); seek(T.poster) } }, [reduced])

  // Chapter marks: while playing, jump to the chapter start; while paused, show that chapter's still frame.
  const select = index => seek(playing ? CHAPTERS[index] : STILLS[index])
  const toggle = () => {
    if (playing) return setPlaying(false)
    const time = tlRef.current?.time() ?? 0
    const still = STILLS.findIndex(s => Math.abs(s - time) < .02)
    if (time >= T.card) seek(0)
    else if (still >= 0) seek(CHAPTERS[still])
    setPlaying(true)
  }
  const stage = t.stages[chapter]
  const playLabel = playing ? t.pause : atEnd ? t.replay : t.play
  const columns = [T.call, T.book - T.call, T.total - T.book].map(n => `${n}fr`).join(' ')

  return <div className={`product-walkthrough lead-film${reduced && !playing ? ' is-still' : ''}`} id="product-demo" ref={root} data-chapter={chapter}>
    <div className="film-frame" ref={frame}>
      <p className="sr-only">{t.film.alt}</p>
      <div className="film-viewport" aria-hidden="true">
        <div className="film-fit" ref={fit}>
          <div className="film-camera" ref={camera}>
            <div className="film-desktop"><PixelField/></div>
            <div className="film-window" data-film="window">
              <div className="film-toolbar">
                <span className="film-lights"><i/><i/><i/></span>
                <span className="film-url" data-film="url"><DemoIcon name="lock" width="13" height="13"/><Swap name="s-url" items={[t.siteUrl, t.film.appUrl]}/></span>
                <span className="film-tools"><DemoIcon name="left" width="16" height="16"/><DemoIcon name="right" width="16" height="16"/><DemoIcon name="share" width="16" height="16"/><DemoIcon name="plus" width="16" height="16"/></span>
                <i className="film-load" data-film="load"/>
              </div>
              <div className="film-screen"><SitePage t={t}/><AppPage t={t}/></div>
            </div>
            <Cursor/>
          </div>
        </div>
      </div>
      <Hud t={t} hudRef={hud}/>
    </div>

    <div className="film-controls">
      <button type="button" className="film-play" onClick={toggle} aria-label={playLabel}><DemoIcon name={playing ? 'pause' : 'play'} width="14" height="14"/><span>{playing ? t.pauseShort : atEnd ? t.replayShort : t.playShort}</span></button>
      <div className="film-track">
        <div className="film-bar" aria-hidden="true"><i ref={fill}/></div>
        <div className="film-chapters" role="group" aria-label={t.stagesLabel} style={{ gridTemplateColumns: columns }}>
          {t.stages.map((item, index) => <button key={item.label} type="button" onClick={() => select(index)} aria-pressed={chapter === index}><span className="film-num">0{index + 1}</span><span>{item.label}</span></button>)}
        </div>
      </div>
    </div>
    <p className="film-meta">↳ {t.demoNote}</p>

    <div className="lead-demo-copy" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
      <span className="service-index">0{chapter + 1}</span>
      <div><h2>{stage.title}</h2><p>{stage.body}</p></div>
    </div>

    <ul className="lead-demo-capabilities" aria-label={t.capabilitiesTitle}>{t.capabilities.map(([title, body], index) => <li key={title}><DemoIcon name={['globe', 'calendar', 'transfer'][index]}/><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul>
  </div>
}
