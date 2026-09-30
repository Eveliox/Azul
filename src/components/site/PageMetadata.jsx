import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { insightArticles } from '../../data/insights'
import { useLanguage } from '../../contexts/LanguageContext'

// Route-specific copy follows the language toggle; other routes keep their metadata.
export function PageMetadata() {
  const { pathname } = useLocation()
  const { c } = useLanguage()
  const defaultDescription = useRef(document.querySelector('meta[name="description"]')?.content ?? '')
  useEffect(() => {
    const path = pathname.replace(/\/$/, '')
    const article = insightArticles.find(item => path === `/insights/${item.slug}`)
    const articleCopy = article && c.insights.articles[article.slug]
    const meta = path === '/about' ? c.about.meta : path === '/insights' ? c.insights.meta : articleCopy ? { title: `${articleCopy.title} | Azul`, description: articleCopy.dek } : null
    document.title = meta?.title || c.meta
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = meta?.description || defaultDescription.current
  }, [pathname, c])
  return null
}
