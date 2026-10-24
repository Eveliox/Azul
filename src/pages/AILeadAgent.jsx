import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { leadAgentCopy, leadTrades, leadVisualCopy } from '../data/leadAgent'
import { LanguageButtons } from '../components/CallExperience'
import { LeadWorkflow, LeadHeroVisual, LeadIcon } from '../components/lead-agent/LeadWorkflow'
import { SplitText } from '../components/motion/SplitText'
import { MagneticButton } from '../components/motion/MagneticButton'
import { DotGrid } from '../components/motion/DotGrid'
import { Arrow, FAQAccordion } from '../components/site/UI'
import { bookingUrl } from '../components/site/Layout'
import { useReveal } from '../hooks/useReveal'
import { gsap } from '../lib/gsap'
import '../lead-agent.css'

function BookingLink({ children }) {
  return <MagneticButton as="a" className="button" href={bookingUrl} target="_blank" rel="noreferrer">{children}<Arrow /></MagneticButton>
}

function TradeTabs({ lang, d }) {
  const [params, setParams] = useSearchParams()
  const selected = leadTrades.find(trade => trade.id === params.get('trade')) || leadTrades[0]
  const [callLang, setCallLang] = useState(lang)
  const tabs = useRef([])
  useEffect(() => { setCallLang(lang) }, [lang])
  const choose = id => {
    const next = new URLSearchParams(params)
    next.set('trade', id)
    setParams(next, { preventScrollReset: true })
  }
  function navigate(event, index) {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % leadTrades.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + leadTrades.length) % leadTrades.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = leadTrades.length - 1
    else return
    event.preventDefault()
    choose(leadTrades[next].id)
    tabs.current[next]?.focus()
  }
  return <>
    <div className="lead-tabs" role="tablist" aria-label={d.trades}>
      {leadTrades.map((trade, i) => <button key={trade.id} ref={el => { tabs.current[i] = el }} type="button" role="tab" id={`trade-tab-${trade.id}`} aria-controls={`trade-panel-${trade.id}`} aria-selected={selected.id === trade.id} tabIndex={selected.id === trade.id ? 0 : -1} onClick={() => choose(trade.id)} onKeyDown={event => navigate(event, i)}>{trade[lang].name}</button>)}
    </div>
    {leadTrades.map(trade => {
      const copy = trade[lang]
      const call = trade[callLang]
      return <div key={trade.id} id={`trade-panel-${trade.id}`} role="tabpanel" aria-labelledby={`trade-tab-${trade.id}`} hidden={selected.id !== trade.id} tabIndex={0} className="lead-panel">
        {trade.status === 'soon' ? <div className="lead-soon"><h3>{d.soon}</h3><BookingLink>{d.askCta}</BookingLink></div> : <>
          <span className="lead-badge">{d.statuses[trade.status]}</span>
          <div className="lead-trade-details">
            <div><h3>{d.asks}</h3><ul>{copy.asks.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>{d.books}</h3><p>{copy.books}</p><h3>{d.handoff}</h3><ul>{copy.handoff.map(item => <li key={item}>{item}</li>)}</ul><p className="lead-note">{d.human}</p></div>
          </div>
          <div className="lead-transcript">
            <div className="lead-transcript-header"><h3>{d.sample}</h3><LanguageButtons value={callLang} onChange={setCallLang} label={d.sampleLanguage} /></div>
            <div lang={callLang}><p className="lead-note">{call.scenario}</p><ol>{call.transcript.map(([role, text], i) => <li key={i} className={`lead-message is-${role}`}><strong>{leadAgentCopy[callLang].roles[role]}</strong><p>{text}</p></li>)}</ol></div>
          </div>
        </>}
      </div>
    })}
  </>
}

export default function AILeadAgent() {
  const { lang } = useLanguage()
  const d = leadAgentCopy[lang]
  const v = leadVisualCopy[lang]
  const metrics = useRef(null)
  useReveal(metrics, el => gsap.timeline({ paused: true }).from(el.querySelectorAll('article'), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 }))
  return <div className="lead-agent">
    <section className="section lead-hero">
      <DotGrid />
      <div className="lead-hero-layout"><div className="lead-hero-copy">
      <SplitText as="h1">{d.title}</SplitText>
      <p className="lead-intro">{d.intro}</p><p className="lead-note">{d.availability}</p>
      <div className="lead-ctas"><BookingLink>{d.cta}</BookingLink><MagneticButton as="a" className="text-link" href="#lead-trades">{d.explore}<Arrow /></MagneticButton></div></div><LeadHeroVisual /></div>
    </section>
    <section className="section lead-section"><SplitText>{d.howTitle}</SplitText><LeadWorkflow /></section>
    <section className="section lead-section" id="lead-trades"><SplitText>{d.tradeTitle}</SplitText><TradeTabs lang={lang} d={d} /></section>
    <section className="section lead-section"><SplitText>{d.retryTitle}</SplitText><ul className="lead-rules">{d.retryRules.map(rule => <li key={rule}>{rule}</li>)}</ul></section>
    <section className="section lead-section"><SplitText>{d.dashboardTitle}</SplitText><div className="lead-dashboard"><div className="lead-dashboard-top"><span>{v.dashboard}</span><span className="lead-badge">{v.sampleLabel}</span></div><p className="lead-note">{v.dashboardNote}</p><div className="lead-metrics" ref={metrics}>{d.metrics.map(([title, body], i) => <article key={title}><LeadIcon kind={i}/><span className="lead-metric-value">{v.samples[i]}</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="lead-funnel"><h3>{v.activity}</h3>{v.activitySteps.map((label,i) => <div key={label}><span>{label}</span><div className="lead-funnel-track"><i style={{'--fill':`${[100,67,42][i]}%`}} /></div><b>{[12,8,5][i]}</b></div>)}</div></div></section>
    <section className="section lead-section"><SplitText>{d.safetyTitle}</SplitText><ul className="lead-rules">{d.safetyRules.map(rule => <li key={rule}>{rule}</li>)}</ul></section>
    <section className="section lead-section lead-start"><SplitText>{d.startTitle}</SplitText><p className="lead-intro">{d.pricing}</p><p className="lead-note">{d.availability}</p><BookingLink>{d.cta}</BookingLink></section>
    <section className="section lead-section"><div className="agent-faq-grid"><SplitText>{d.faqTitle}</SplitText><FAQAccordion items={d.faqs.map(([question, answer]) => ({ question, answer }))} /></div></section>
  </div>
}
