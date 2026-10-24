import { useLanguage } from '../../contexts/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { PhoneSimulation } from './PhoneSimulation'
import { AgentOrbit } from '../agents/AgentOrbit'

function LocalMap() {
  return <div className="local-map modern-map" aria-hidden="true">
    <svg viewBox="0 0 560 300" preserveAspectRatio="xMidYMid slice">
      <rect width="560" height="300" fill="#e9eee9"/>
      <path d="M425-20C380 58 461 97 417 164S437 247 393 320H580V-20Z" fill="#b9d7ed"/>
      <g fill="#d3e2d1"><path d="m28 30 80-8 8 48-79 9zM222 173l70-8 10 72-67 9zM319 22l60-7 7 64-60 7zM46 216l76-7 8 62-76 9z"/></g>
      <g fill="none" stroke="#fff" strokeWidth="8"><path d="M-20 99 415 50M-20 184 429 133M-20 270 403 219M83-10l43 330M181-10l44 330M288-10l44 330M375-10l35 330"/></g>
      <g fill="none" stroke="#d0d9e1" strokeWidth="1.5"><path d="M-20 99 415 50M-20 184 429 133M-20 270 403 219M83-10l43 330M181-10l44 330M288-10l44 330M375-10l35 330"/></g>
      <path d="M-20 145C100 119 232 164 315 122S398 52 440-20" fill="none" stroke="#fff" strokeWidth="14"/>
      <path d="M-20 145C100 119 232 164 315 122S398 52 440-20" fill="none" stroke="#cad8e6" strokeWidth="5"/>
      <circle cx="236" cy="120" r="68" fill="#3154cf" opacity=".06"/><circle cx="236" cy="120" r="68" fill="none" stroke="#3154cf" strokeOpacity=".2" strokeDasharray="4 5"/>
      <text x="450" y="180" fill="#688faa" fontSize="11" fontFamily="inherit" transform="rotate(-75 450 180)">BISCAYNE BAY</text>
    </svg><span className="map-location-label">MIAMI</span><span className="map-location-pin pin-primary">⌂</span><span className="map-location-pin pin-secondary">⌂</span><span className="map-location-pin pin-tertiary">⌂</span><span className="map-zoom">+<i/>−</span>
  </div>
}

/** Illustrative product interfaces, kept in React so every label switches language. */
export function ServiceVisual({ index, position = index, total = 6 }) {
  const { c } = useLanguage()
  const v = c.serviceVisuals
  return <div className={`service-demo demo-${index}`}>
    <div className="demo-top"><BrandLogo /><span>{v.example}</span><i aria-hidden="true" /></div>
    <div className="demo-heading"><span>{String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span><h3>{v.titles[index]}</h3></div>
    {index === 0 && <PhoneSimulation kind="review" />}
    {index === 1 && <div className="social-planner"><div className="planner-top"><span>{v.week}</span><span>← &nbsp; →</span></div><div className="planner-days">{v.days.map((d,i)=><span className={i===2?'selected':''} key={i}>{d}<b>{12+i}</b></span>)}</div><div className="social-post"><img loading="lazy" decoding="async" src="/images/svc-roofing.jpg" alt=""/><div><span className="demo-label">{v.scheduled}</span><b>{v.socialTitle}</b><p>{v.socialBody}</p><span className="social-icons" aria-hidden="true">♡ &nbsp; ◯ &nbsp; ↗</span></div></div><div className="demo-chip">{v.bilingual}</div></div>}
    {index === 2 && <div className="website-devices"><div className="browser-frame"><div className="browser-bar"><i/><i/><i/><span>{v.website}</span></div><img loading="lazy" decoding="async" src="/images/work/aspire.jpg" alt=""/></div><div className="mobile-frame"><img loading="lazy" decoding="async" src="/images/work/aspire-mobile.jpg" alt=""/></div><div className="demo-chip">{v.responsive}</div></div>}
    {index === 3 && <div className="search-demo"><div className="search-field"><span aria-hidden="true">⌕</span>{v.search}</div><LocalMap /><div className="search-result"><span className="result-icon" aria-hidden="true">⌂</span><div><b>{v.localBusiness}</b><p>{v.localDetails}</p><span>{v.serviceArea}</span></div></div><p className="demo-footnote">{v.rankingNote}</p></div>}
    {index === 4 && <PhoneSimulation kind="call" />}
    {index === 5 && <div className="ad-demo"><div className="ad-audience"><span className="demo-label">{v.audience}</span><strong>{v.serviceArea}</strong><div className="audience-dots" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i}/>)}</div></div><div className="ad-post"><div className="ad-account"><span className="result-icon" aria-hidden="true">⌂</span><div><b>{v.localBusiness}</b><small>{v.sponsored}</small></div></div><img loading="lazy" decoding="async" src="/images/svc-roofing.jpg" alt=""/><div className="ad-caption"><b>{v.adTitle}</b><span>{v.adAction} ↗</span></div></div><div className="demo-chip">{c.build.waitlist}</div></div>}
    {index === 6 && <div className="agent-demo"><span className="demo-label">{v.agentStatus}</span><AgentOrbit /><ul className="agent-demo-log">{v.agentLog.map(([time, text]) => <li key={time}><span>{time}</span>{text}</li>)}</ul><div className="demo-chip">{v.bilingual}</div></div>}
  </div>
}
