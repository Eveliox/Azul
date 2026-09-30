import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { insightArticles, filterInsights, readingMinutes } from '../data/insights'
import { SectionEyebrow } from '../components/motion/Eyebrow'
import { SplitText } from '../components/motion/SplitText'
import { DotGrid } from '../components/motion/DotGrid'
import { FilterChips, Arrow } from '../components/site/UI'
import { InsightArt } from '../components/insights/InsightArt'
import { InsightCard } from '../components/insights/InsightCard'
import { bookingUrl } from '../components/site/Layout'

export function InsightsCTA() {
  const { c } = useLanguage()
  const p = c.insights
  return <section className="section insights-cta"><SectionEyebrow>{p.ctaEyebrow}</SectionEyebrow><SplitText>{p.ctaTitle}</SplitText><p>{p.ctaBody}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{p.cta}<Arrow /></a></section>
}

export default function Insights() {
  const { c } = useLanguage()
  const p = c.insights
  const [params, setParams] = useSearchParams()
  const requested = params.get('topic') || 'all'
  const category = p.filters.some(f => f.value === requested) ? requested : 'all'
  const query = params.get('q') || ''
  const articles = filterInsights(insightArticles, p, category, query)
  const featured = insightArticles[0]
  const featureCopy = p.articles[featured.slug]
  function update(key, value) {
    setParams(previous => { const next = new URLSearchParams(previous); if (!value || value === 'all') next.delete(key); else next.set(key, value); return next }, { replace: true, preventScrollReset: true })
  }
  return <div className="insights-page">
    <section className="section insights-hero">
      <DotGrid />
      <SectionEyebrow>{p.eyebrow}</SectionEyebrow>
      <SplitText as="h1">{p.title}</SplitText>
      <div className="insights-hero-bottom"><p>{p.intro}</p><a className="text-link" href="#reading-room">{p.library}<span aria-hidden="true">↓</span></a></div>
    </section>
    <section className="section insights-feature" aria-labelledby="featured-title">
      <Link className="insights-feature-link" to={`/insights/${featured.slug}`}>
        <InsightArt article={featured} />
        <div className="insights-feature-copy"><span className="insights-kicker">{p.featured} / 01</span><h2 id="featured-title">{featureCopy.title}</h2><p>{featureCopy.dek}</p><div className="insights-feature-footer"><span className="insight-card-link">{p.read}<Arrow /></span><span>{readingMinutes(featureCopy)} {p.minute}</span></div></div>
      </Link>
    </section>
    <section className="section insights-library" id="reading-room" aria-labelledby="library-title">
      <SectionEyebrow>{p.library}</SectionEyebrow>
      <div className="insights-library-heading"><SplitText id="library-title">{p.libraryTitle}</SplitText><label className="insights-search"><span className="sr-only">{p.search}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder={p.searchPlaceholder}/></label></div>
      <div className="insights-filters"><FilterChips options={p.filters} value={category} onChange={value => update('topic', value)} label={p.filterLabel}/><span role="status" aria-live="polite">{articles.length} {p.results}</span></div>
      <div className="insights-grid">{articles.map(article => <InsightCard key={article.slug} article={article} />)}</div>
      {!articles.length && <div className="insights-empty"><span aria-hidden="true">↺</span><h3>{p.empty}</h3><p>{p.emptyBody}</p><button className="text-link" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>{p.reset}<Arrow /></button></div>}
    </section>
    <InsightsCTA />
  </div>
}
