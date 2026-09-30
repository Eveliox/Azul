import { useLanguage } from '../../contexts/LanguageContext'

// Code-native editorial illustrations stay crisp at every size; no image downloads.
export function InsightArt({ article }) {
  const { c } = useLanguage()
  const kind = article.visual
  return <div className={`insight-art art-${kind}`} aria-hidden="true">
    <div className="insight-art-label"><span>{c.insights.artLabel}</span><span>{String(article.number).padStart(2, '0')}</span></div>
    <div className="insight-art-stage">
      {kind === 'language' && <div className="art-language-pair"><span>EN<i>↗</i></span><span>ES<i>↗</i></span><b>+</b></div>}
      {kind === 'reviews' && <div className="art-review-stack"><div/><div/><div><span>✳</span><i/><i/><i/></div><b>↗</b></div>}
      {kind === 'calls' && <div className="art-call"><div className="art-wave">{[22, 40, 68, 94, 58, 110, 74, 42, 66, 30, 18].map((h,i) => <i key={i} style={{ '--wave-height': `${h}px`, '--wave-delay': `${i * 45}ms` }}/>)}</div><span>↗</span></div>}
      {kind === 'local' && <div className="art-map"><div/><div/><div/><span className="art-map-pin"><svg viewBox="0 0 60 80" fill="none"><path d="M30 74S5 45 5 29a25 25 0 0 1 50 0C55 45 30 74 30 74Z" fill="currentColor"/><circle cx="30" cy="29" r="9" fill="var(--blue)"/></svg></span><i/><i/></div>}
      {kind === 'agents' && <div className="art-flow"><span>01</span><i/><span>✳</span><i/><span>↗</span></div>}
      {kind === 'website' && <div className="art-browser"><div><i/><i/><i/></div><span/><span/><div className="art-browser-content"><i/><i/></div><b>↗</b></div>}
    </div>
    <div className="insight-art-caption"><span>{c.insights.artCaptions[article.number - 1]}</span><span>↗</span></div>
  </div>
}
