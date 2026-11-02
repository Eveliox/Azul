import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { bookingUrl } from '../components/site/Layout'
import { servicesPage } from '../data/servicesPage'
import { offerPrices } from '../data/offer'
import { ComparisonVisual, PixelArrow, PixelField, ServicePreview, SystemIcon, WorkflowVisual } from '../components/site/ServicesVisuals'
import '../services.css'

function BookButton({ label, light = false }) {
  return <a className={`lab-button${light?' is-light':''}`} href={bookingUrl} target="_blank" rel="noreferrer">{label}<span><PixelArrow/></span></a>
}
function Label({ children }) { return <span className="lab-label">{children}</span> }
function Heading({ title, accent }) { return <h2>{title}<br/><span>{accent}</span></h2> }
function Tabs({ labels, selected, onSelect, name, icons = false }) {
  const refs=useRef([])
  function navigate(event,index){
    let next
    if(event.key==='ArrowRight')next=(index+1)%labels.length
    if(event.key==='ArrowLeft')next=(index+labels.length-1)%labels.length
    if(event.key==='Home')next=0
    if(event.key==='End')next=labels.length-1
    if(next===undefined)return
    event.preventDefault();onSelect(next);refs.current[next]?.focus()
  }
  return <div className={`lab-tabs ${icons?'lab-service-tabs':'lab-plan-tabs'}`} role="tablist" aria-label={name==='service'?'Services / Servicios':'Pricing / Precios'}>{labels.map((label,i)=><button type="button" role="tab" key={label} ref={el=>{refs.current[i]=el}} id={`${name}-tab-${i}`} aria-selected={selected===i} aria-controls={`${name}-panel-${i}`} tabIndex={selected===i?0:-1} onClick={()=>onSelect(i)} onKeyDown={event=>navigate(event,i)}>{icons?<span className="lab-tab-icon"><SystemIcon type={i}/></span>:<span className="lab-checkbox" aria-hidden="true">{selected===i?'✓':''}</span>}<span><small>{icons?`0${i+1} / `:''}</small>{label}</span></button>)}</div>
}

export default function Services(){
  const {c,lang}=useLanguage()
  const t=servicesPage[lang]
  const [service,setService]=useState(0)
  const [plan,setPlan]=useState(0)
  const detail=t.details[service]
  const standalone=plan===1?c.offer.services.website:c.offer.services.agent
  const planName=plan===0?c.offer.pricing.name:standalone.name
  const includes=plan===0?c.offer.pricing.includes:standalone.items
  const price=[{value:offerPrices.packageMonthly,unit:c.offer.pricing.month,setup:offerPrices.packageSetup},{value:offerPrices.websiteSetup,unit:c.offer.services.oneTime},{value:offerPrices.agentMonthly,unit:c.offer.pricing.month,setup:offerPrices.agentSetup}][plan]
  return <div className="services-lab">
    <section className="lab-hero lab-container">
      <h1>{t.title}<br/><span>{t.accent}</span></h1>
      <p className="lab-hero-intro">{t.intro}</p>
      <div className="lab-hero-actions"><BookButton label={c.offer.ctas.book}/><a className="lab-explore" href="#the-system">{t.explore}<span aria-hidden="true">↓</span></a></div>
      <WorkflowVisual t={t}/>
      <div className="lab-trust-strip">{t.strip.map(item=><span key={item}>{item}</span>)}</div>
    </section>

    <section className="lab-problem lab-section lab-container" aria-labelledby="problem-title">
      <div className="lab-split-heading"><div><Label>{t.problemLabel}</Label><h2 id="problem-title">{t.problemTitle}<br/><span>{t.problemAccent}</span></h2></div><p>{t.problemBody}</p></div>
      <div className="lab-comparison-grid"><ComparisonVisual t={t}/><ComparisonVisual t={t} connected/></div>
    </section>

    <section className="lab-services lab-section lab-container" id="the-system">
      <div className="lab-section-heading"><Label>{t.servicesLabel}</Label><Heading title={t.servicesTitle} accent={t.servicesAccent}/><p>{t.servicesIntro}</p></div>
      <Tabs labels={t.tabs} selected={service} onSelect={setService} name="service" icons/>
      <div className="lab-service-panel" role="tabpanel" tabIndex={0} id={`service-panel-${service}`} aria-labelledby={`service-tab-${service}`} key={service}>
        <div className="lab-service-copy"><p className="lab-micro">0{service+1} / {t.tabs[service]}</p><h3>{detail.title}</h3><p>{detail.body}</p><ul>{detail.items.map(item=><li key={item}>{item}</li>)}</ul>{service===1?<Link className="lab-inline-link" to="/services/ai-lead-agent">{c.offer.services.agent.learn}<PixelArrow/></Link>:<a className="lab-inline-link" href="#plans">{c.offer.pricing.eyebrow}<PixelArrow/></a>}</div>
        <ServicePreview t={t} index={service}/>
      </div>
    </section>

    <section className="lab-process">
      <div className="lab-container lab-section"><div className="lab-split-heading"><div><Label>{t.processLabel}</Label><Heading title={t.processTitle} accent={t.processAccent}/></div><BookButton label={c.offer.ctas.book} light/></div>
        <ol className="lab-process-track">{t.steps.map((step,i)=><li key={step.title}><div className="lab-process-top"><SystemIcon type={i}/><span>0{i+1} / 04</span></div><h3>{step.title}</h3><p>{step.body}</p><div className="lab-process-bottom"><span>{step.tag}</span><span className="lab-progress-blocks" aria-hidden="true">{[0,1,2,3].map(n=><i key={n} className={n<=i?'is-filled':''}/>)}</span></div></li>)}</ol>
      </div>
    </section>

    <section className="lab-pricing lab-section lab-container" id="plans">
      <div className="lab-section-heading"><Label>{t.priceLabel}</Label><Heading title={t.priceTitle} accent={t.priceAccent}/></div>
      <Tabs labels={t.plans} selected={plan} onSelect={setPlan} name="plan"/>
      <div className="lab-price-panel lab-window" role="tabpanel" tabIndex={0} id={`plan-panel-${plan}`} aria-labelledby={`plan-tab-${plan}`}>
        <div className="lab-price-summary"><span className="lab-micro">0{plan+1} / {t.plans[plan]}</span><h3>{planName}</h3><p>{plan===0?t.packageBody:standalone.body}</p>
          <div className="lab-price-box"><div className="lab-price-heading"><span aria-hidden="true">$</span><span>{c.offer.pricing.eyebrow}</span></div><div className="lab-price-value"><strong>{price.value}</strong><span>{price.unit}</span></div><div className="lab-price-note">{price.setup?<><span>{t.setup}</span><b>{price.setup}</b></>:<span>{t.standaloneNote}</span>}</div></div>
        </div>
        <div className="lab-price-includes"><p className="lab-micro">{t.includes}</p><ul>{includes.map(item=><li key={item}><span aria-hidden="true">+</span>{item}</li>)}</ul>{plan===0&&<p className="lab-terms">{c.offer.pricing.terms}</p>}<BookButton label={c.offer.ctas.book}/></div>
      </div>
    </section>

    <section className="lab-faq lab-section lab-container" id="faq"><div className="lab-section-heading"><Label>{t.faqLabel}</Label><Heading title={t.faqTitle} accent={t.faqAccent}/></div><div className="lab-faq-list">{c.offer.faq.items.map(([question,answer],i)=><details key={i}><summary>{question}<span className="lab-faq-symbol" aria-hidden="true"/></summary><p>{answer}</p></details>)}</div></section>

    <section className="lab-final lab-container" id="contact"><PixelField/><Label>{t.finalLabel}</Label><Heading title={t.finalTitle} accent={t.finalAccent}/><p>{t.finalBody}</p><BookButton label={c.offer.ctas.book} light/></section>

  </div>
}
