import { leadAgentCopy } from '../../data/leadAgent'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

// Route-specific copy follows the language toggle; other routes use the homepage metadata.
export function PageMetadata() {
  const { pathname } = useLocation()
  const { c, lang } = useLanguage()
  useEffect(() => {
    const path = pathname.replace(/\/$/, '')
    const routeMeta = { '/services': c.offer.servicesMeta, '/contact': c.offer.contactMeta }
    const meta = routeMeta[path] || (path === '/services/ai-lead-agent' ? leadAgentCopy[lang].meta : path === '/about' ? c.about.meta : null)
    document.title = meta?.title || c.meta
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = meta?.description || c.offer.meta.description
  }, [pathname, c, lang])
  return null
}
