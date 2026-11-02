import { useLanguage } from '../contexts/LanguageContext'
import { StudioHero } from '../components/site/StartupKit'
import { legalCopy, legalUpdated } from '../data/legal'
import '../legal.css'

// Renders the contact email in legal copy as a mailto link.
function Text({ children }) {
  const { c } = useLanguage()
  return children.split(c.email).flatMap((part, i) => i ? [<a key={i} href={`mailto:${c.email}`}>{c.email}</a>, part] : [part])
}

export default function Legal({ doc }) {
  const { lang } = useLanguage()
  const t = legalCopy[lang][doc]
  return <StudioHero label={t.label} title={t.title} body={t.intro} className="legal-page">
    <article className="legal-body">
      <p className="legal-updated">{legalUpdated[lang]}</p>
      {t.sections.map(section => <section key={section.id} id={section.id}>
        <h2>{section.title}</h2>
        {section.body.map((item, i) => Array.isArray(item)
          ? <ul key={i}>{item.map(line => <li key={line}><Text>{line}</Text></li>)}</ul>
          : item.key ? <p key={i} className="legal-key"><Text>{item.key}</Text></p> : <p key={i}><Text>{item}</Text></p>)}
      </section>)}
    </article>
  </StudioHero>
}
