import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { insightArticles, readingMinutes } from '../data/insights'
import { InsightArt } from '../components/insights/InsightArt'
import { InsightCard } from '../components/insights/InsightCard'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { SplitText } from '../components/motion/SplitText'
import { Arrow } from '../components/site/UI'
import { InsightsCTA } from './Insights'

function useReadingPosition(ref, progress, language) {
  const [active, setActive] = useState('section-1')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const article = ref.current
      if (!article) return
      const rect = article.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight + 140)
      const fraction = Math.max(0, Math.min(1, (140 - rect.top) / distance))
      if (progress.current) progress.current.style.transform = `scaleX(${fraction})`
      const sections = [...article.querySelectorAll('[data-reading-section]')]
      const current = sections.filter(el => el.getBoundingClientRect().top <= 180).at(-1)
      setActive(current?.id || 'section-1')
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    if (ref.current) observer.observe(ref.current)
    update()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [ref, progress, language])
  return active
}

export default function InsightArticle({ article }) {
  const { c, lang } = useLanguage()
  const p = c.insights
  const text = p.articles[article.slug]
  const body = useRef(null)
  const progress = useRef(null)
  const active = useReadingPosition(body, progress, lang)
  const [checked, setChecked] = useState([])
  const [share, setShare] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const related = [...insightArticles.filter(a => a.slug !== article.slug && a.category === article.category), ...insightArticles.filter(a => a.slug !== article.slug && a.category !== article.category)].slice(0, 2)
  async function copyLink() {
    const url = `${window.location.origin}/insights/${article.slug}`
    try { await navigator.clipboard.writeText(url); setShare('copied') }
    catch { setShareUrl(url); setShare('failed') }
  }
  return <div className="insight-article-page">
    <div className="reading-progress" aria-hidden="true"><span ref={progress}/></div>
    <header className="section insight-article-header">
      <Link className="text-link insight-back" to="/insights">← {p.back}</Link>
      <SectionEyebrow>{p.filters.find(f => f.value === article.category).label}</SectionEyebrow>
      <SplitText as="h1">{text.title}</SplitText>
      <p className="insight-dek">{text.dek}</p>
      <div className="insight-byline"><span>{p.byline}</span><span>{readingMinutes(text)} {p.minute}</span><span>EN / ES</span></div>
    </header>
    <div className="section insight-cover"><InsightArt article={article}/></div>
    <div className="section insight-reading-layout">
      <aside className="insight-sidebar"><nav aria-label={p.toc}><p className="insights-kicker">{p.toc}</p>{text.sections.map((section, i) => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{section.title}</a>)}<a href="#article-checklist" aria-current={active === 'article-checklist' ? 'location' : undefined}><span>↗</span>{p.checklist}</a></nav><button className="text-link" onClick={copyLink}>{p.copy}<Arrow /></button><p className="insight-share-status" role="status">{share === 'copied' ? p.copied : share === 'failed' ? p.copyFailed : ''}</p>{share === 'failed' && <input className="insight-share-fallback" aria-label={p.copyFailed} readOnly value={shareUrl} onFocus={e => e.target.select()}/>}</aside>
      <article className="insight-body" ref={body}>
        <div className="insight-takeaway"><span className="insights-kicker">{p.takeaway}</span><p>{text.takeaway}</p></div>
        {text.sections.map(section => <section id={section.id} data-reading-section key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <section className="insight-checklist" id="article-checklist" data-reading-section><span className="insights-kicker">{p.checklist}</span><h2>{text.takeaway}</h2><p>{p.checklistHint}</p><div>{text.checklist.map((item, i) => <label key={i}><input type="checkbox" checked={checked.includes(i)} onChange={e => setChecked(previous => e.target.checked ? [...previous, i] : previous.filter(value => value !== i))}/><span>{item}</span></label>)}</div><p className="insight-checklist-count" role="status">{checked.length} / {text.checklist.length} {p.complete}</p></section>
        {article.sources.length > 0 && <section className="insight-sources"><h2>{p.sources}</h2><ul>{article.sources.map(source => <li key={source.url}><a href={lang === 'es' && source.url.includes('support.google.com') ? source.url.replace('hl=en', 'hl=es') : source.url} target="_blank" rel="noreferrer">{source[lang]}<Arrow /></a></li>)}</ul></section>}
        <Link className="text-link insight-service-link" to={`/services/${article.service}`}>{p.service}<Arrow /></Link>
      </article>
    </div>
    <section className="section insight-related"><SectionEyebrow>{p.related}</SectionEyebrow><SplitText>{p.relatedTitle}</SplitText><div className="insights-grid">{related.map(item => <InsightCard key={item.slug} article={item}/>)}</div></section>
    <InsightsCTA />
  </div>
}
