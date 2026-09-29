import { useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { gsap } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { AgentCard } from '../components/agents/AgentCard'
import { AgentOrbit } from '../components/agents/AgentOrbit'
import { JobPostingButton } from '../components/agents/JobPostingDrawer'
import { StepTimeline } from '../components/agents/StepTimeline'
import { CountUp } from '../components/motion/CountUp'
import { DotGrid } from '../components/motion/DotGrid'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { Arrow, FAQAccordion } from '../components/site/UI'

// Children of `selector` rise in one after another when `ref` scrolls into view.
function useStagger(ref, selector, { y = 32, stagger = 0.08, start } = {}) {
  useReveal(ref, el => gsap.timeline({ paused: true }).from(el.querySelectorAll(selector), { y, autoAlpha: 0, duration: 1, stagger }), { start })
}

function Hero() {
  const { c } = useLanguage()
  const d = c.agents.detail
  return (
    <section className="agent-hero section">
      <DotGrid />
      <SectionEyebrow>{d.eyebrow}</SectionEyebrow>
      <div className="agent-hero-grid">
        <div>
          <SplitText as="h1">{d.title}</SplitText>
          <p className="agent-hero-intro">{d.intro}</p>
          <dl className="agent-price">
            <dt>{d.priceLabel}</dt>
            <dd>{d.price}<small>{d.priceFrom} {d.startingPrice}</small></dd>
          </dl>
          <div className="agent-ctas">
            <JobPostingButton />
            <MagneticButton as="a" className="text-link" href="#examples">{c.agents.examplesCta}<Arrow /></MagneticButton>
          </div>
        </div>
        <AgentOrbit className="is-large" />
      </div>
    </section>
  )
}

function WhatItIs() {
  const { c } = useLanguage()
  const d = c.agents.detail
  const ref = useRef(null)
  useStagger(ref, '.agent-needs li', { y: 14, stagger: 0.04 })
  return (
    <section className="section agent-what">
      <SectionEyebrow>{d.whatEyebrow}</SectionEyebrow>
      <div className="section-intro"><SplitText>{d.whatTitle}</SplitText><p>{d.whatBody}</p></div>
      <div className="agent-needs-wrap" ref={ref}>
        <h3>{d.needsLabel}</h3>
        <ul className="agent-needs">{d.needs.map(need => <li key={need}>{need}</li>)}</ul>
      </div>
    </section>
  )
}

function Stats() {
  const { c } = useLanguage()
  const d = c.agents.detail
  const ref = useRef(null)
  useReveal(ref, el => gsap.timeline({ paused: true }).from(el.querySelectorAll('.stat-line'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, ease: 'expo.inOut', stagger: 0.12 }))
  return (
    <section className="section agent-stats">
      <SectionEyebrow>{d.statsEyebrow}</SectionEyebrow>
      <div className="stats stats-3" ref={ref}>
        {d.stats.map((stat, i) => (
          <div className="stat" key={i}>
            <strong>{stat.text ? <CountUp text={stat.text} /> : <CountUp to={stat.to} />}</strong>
            <span className="stat-line" aria-hidden="true" />
            <p>{d.statLabels[i]}</p>
          </div>
        ))}
      </div>
      <p className="sample-note">{d.statsSample}</p>
    </section>
  )
}

function Problems() {
  const { c } = useLanguage()
  const d = c.agents.detail
  const ref = useRef(null)
  useStagger(ref, '.agent-problem')
  return (
    <section className="section agent-problems">
      <SectionEyebrow>{d.problemEyebrow}</SectionEyebrow>
      <SplitText>{d.problemTitle}</SplitText>
      <div className="agent-problem-grid" ref={ref}>
        {d.problems.map((problem, i) => (
          <article className="agent-problem" key={i}>
            <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
            <h3>{problem.title}</h3>
            <p>{problem.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Examples() {
  const { c } = useLanguage()
  const d = c.agents.detail
  const ref = useRef(null)
  useStagger(ref, '.agent-card', { y: 48, stagger: 0.09 })
  return (
    <section className="section agent-examples" id="examples">
      <SectionEyebrow>{d.examplesEyebrow}</SectionEyebrow>
      <div className="section-intro"><SplitText>{d.examplesTitle}</SplitText><p>{d.examplesHint}</p></div>
      <div className="agent-grid" ref={ref}>
        {d.agents.map((agent, i) => <AgentCard key={i} index={i} agent={agent} tools={d.tools[i]} />)}
      </div>
    </section>
  )
}

function Comparison() {
  const { c } = useLanguage()
  const d = c.agents.detail
  const ref = useRef(null)
  useStagger(ref, 'thead tr, tbody tr', { y: 20, stagger: 0.1 })
  const [, employee, agent] = d.compareColumns
  return (
    <section className="section agent-compare">
      <SectionEyebrow>{d.compareEyebrow}</SectionEyebrow>
      <SplitText>{d.compareTitle}</SplitText>
      <div className="compare-wrap" ref={ref}>
        <table className="compare-table">
          <thead><tr><td /><th scope="col">{employee}</th><th scope="col" className="is-agent">{agent}</th></tr></thead>
          <tbody>
            {d.compareRows.map(([label, a, b]) => (
              <tr key={label}><th scope="row">{label}</th><td>{a}</td><td className="is-agent">{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sample-note">{d.compareNote}</p>
    </section>
  )
}

export default function CustomAIAgents() {
  const { c } = useLanguage()
  const d = c.agents.detail
  return <>
    <Hero />
    <WhatItIs />
    <Stats />
    <Problems />
    <section className="section agent-how">
      <SectionEyebrow>{d.howEyebrow}</SectionEyebrow>
      <SplitText>{d.howTitle}</SplitText>
      <StepTimeline steps={d.steps} />
    </section>
    <Examples />
    <Comparison />
    <section className="section agent-faq">
      <SectionEyebrow>{d.faqEyebrow}</SectionEyebrow>
      <div className="agent-faq-grid"><SplitText>{d.faqTitle}</SplitText><FAQAccordion items={d.faq} /></div>
    </section>
    <section className="section agent-cta">
      <SectionEyebrow>{d.ctaEyebrow}</SectionEyebrow>
      <SplitText>{d.ctaTitle}</SplitText>
      <p>{d.ctaBody}</p>
      <JobPostingButton />
    </section>
  </>
}
