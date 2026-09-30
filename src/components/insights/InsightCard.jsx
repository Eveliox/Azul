import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { gsap } from '../../lib/gsap'
import { useReveal } from '../../hooks/useReveal'
import { readingMinutes } from '../../data/insights'
import { InsightArt } from './InsightArt'

export function InsightCard({ article }) {
  const { c } = useLanguage()
  const ref = useRef(null)
  const p = c.insights
  const text = p.articles[article.slug]
  useReveal(ref, el => gsap.timeline({ paused: true }).from(el, { y: 24, autoAlpha: 0, duration: .7 }))
  return <article className="insight-card" ref={ref}>
    <Link to={`/insights/${article.slug}`}>
      <InsightArt article={article} />
      <div className="insight-card-meta"><span>{p.filters.find(f => f.value === article.category).label}</span><span>{readingMinutes(text)} {p.minute}</span></div>
      <h3>{text.title}</h3><p>{text.dek}</p>
      <span className="insight-card-link">{p.read}<span aria-hidden="true">↗</span></span>
    </Link>
  </article>
}
