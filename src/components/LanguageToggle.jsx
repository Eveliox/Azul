import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()

  const base =
    'px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors duration-200'
  const active = 'bg-white text-gray-900 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
  const inactive = 'text-gray-500 hover:text-gray-800'

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full bg-gray-100 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`${base} ${lang === 'en' ? active : inactive}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`${base} ${lang === 'es' ? active : inactive}`}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
    </div>
  )
}
