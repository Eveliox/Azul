import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'azul-lang'
const SUPPORTED = ['en', 'es']

function detectInitialLang() {
  if (typeof window === 'undefined') return 'en'
  let stored
  try { stored = window.localStorage.getItem(STORAGE_KEY) } catch { /* Storage can be blocked. */ }
  if (stored && SUPPORTED.includes(stored)) return stored
  const browser = (window.navigator.language || 'en').slice(0, 2).toLowerCase()
  return SUPPORTED.includes(browser) ? browser : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang)

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, lang) } catch { /* In-memory language remains available. */ }
    document.documentElement.lang = lang
    document.title = translations[lang].meta
  }, [lang])

  const setLang = (next) => {
    if (SUPPORTED.includes(next)) setLangState(next)
  }

  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'es' : 'en'))

  const value = {
    lang,
    setLang,
    toggleLang,
    c: translations[lang],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
