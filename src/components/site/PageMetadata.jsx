import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

// Keep the existing site metadata on other routes and restore it after About.
export function PageMetadata() {
  const { pathname } = useLocation()
  const { c } = useLanguage()
  const defaultDescription = useRef(document.querySelector('meta[name="description"]')?.content ?? '')
  useEffect(() => {
    const about = pathname.replace(/\/$/, '') === '/about'
    document.title = about ? c.about.meta.title : c.meta
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = about ? c.about.meta.description : defaultDescription.current
  }, [pathname, c])
  return null
}
