import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import PortfolioCard from './components/PortfolioCard'
import ProjectModal from './components/ProjectModal'
import PricingCard from './components/PricingCard'
import Reveal, { RevealItem } from './components/Reveal'
import MagneticButton from './components/MagneticButton'
import LanguageToggle from './components/LanguageToggle'
import { useLanguage } from './contexts/LanguageContext'
import { portfolioProjects } from './data/portfolioProjects'
import { stripeLinks, isStripeLinkReady } from './data/stripeLinks'

function App() {
  const { c, lang } = useLanguage()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -80 })
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full">
      {/* Founding Client announcement bar */}
      <a
        href="#pricing"
        className="group block w-full bg-gray-50 border-b border-gray-100 hover:bg-gray-100/70 transition-colors duration-300 text-center py-2 sm:py-2.5 px-4 text-xs sm:text-[13px]"
      >
        <span className="hidden sm:inline text-gray-600">{c.announcement.long} </span>
        <span className="sm:hidden text-gray-600">{c.announcement.short} </span>
        <span className="font-semibold text-blue-600">{c.announcement.priceHighlight}</span>
        <span className="ml-2 hidden sm:inline text-gray-500 group-hover:text-gray-700 transition-colors">· {c.announcement.trailingLong}</span>
        <span className="ml-1 sm:hidden text-gray-500 group-hover:text-gray-700 transition-colors">{c.announcement.trailingShort}</span>
      </a>

      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <a
            href="#"
            className="group inline-flex items-baseline gap-1 transition-opacity duration-200 hover:opacity-80"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Azul home"
          >
            <span
              className="text-2xl sm:text-[26px] font-bold text-gray-900 leading-none"
              style={{ letterSpacing: '-0.04em' }}
            >
              Azul
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 self-end mb-1 group-hover:bg-blue-600 transition-colors"></span>
          </a>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-7 lg:gap-9 items-center">
            <a href="#solutions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {c.nav.solutions}
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {c.nav.pricing}
            </a>
            <a href="#industries" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {c.nav.industries}
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {c.nav.howItWorks}
            </a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {c.nav.contact}
            </a>
            <LanguageToggle />
            <a
              href="https://calendly.com/purplexmythzz/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 px-4 py-2 bg-gray-900 hover:bg-black rounded-lg text-sm font-semibold text-white transition-colors duration-200"
            >
              {c.nav.bookDemo}
            </a>
          </nav>
          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label={c.nav.toggleMenu}
            >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <a
                href="#solutions"
                className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium px-3 py-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.solutions}
              </a>
              <a
                href="#pricing"
                className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium px-3 py-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.pricing}
              </a>
              <a
                href="#industries"
                className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium px-3 py-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.industries}
              </a>
              <a
                href="#how-it-works"
                className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium px-3 py-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.howItWorks}
              </a>
              <a
                href="#contact"
                className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium px-3 py-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.contact}
              </a>
              <a
                href="https://calendly.com/purplexmythzz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-5 py-3 bg-gray-900 hover:bg-black rounded-lg text-base font-semibold text-white mt-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {c.nav.bookDemo}
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section — centered stack with full-width dashboard mockup below */}
      <section className={`relative pt-14 pb-20 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden bg-slate-50/70`}>
        {/* Tight blueprint grid — precise geometric backbone (larger cells on mobile) */}
        <div
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center top, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center top, black 20%, transparent 80%)',
          }}
        ></div>
        {/* Mobile grid — wider cells to feel less cramped */}
        <div
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center top, black 15%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center top, black 15%, transparent 75%)',
          }}
        ></div>

        {/* Vertical light beam — center focal point (scales down on mobile) */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[24rem] sm:w-[32rem] md:w-[42rem] h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.10) 20%, rgba(59,130,246,0.04) 45%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        ></div>

        {/* Sharp bright core of the beam — smaller, more intense */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[8rem] sm:w-[11rem] md:w-[14rem] h-[24rem] sm:h-[30rem] md:h-[36rem]"
          style={{
            background: 'linear-gradient(180deg, rgba(96,165,250,0.25) 0%, rgba(96,165,250,0.10) 40%, transparent 80%)',
            filter: 'blur(40px)',
          }}
        ></div>

        {/* Two soft color pools for depth — hidden on mobile to reduce clutter */}
        <div className="pointer-events-none absolute top-1/3 -left-20 w-[28rem] h-[28rem] bg-gradient-radial from-indigo-200/30 via-indigo-100/10 to-transparent rounded-full blur-3xl hidden sm:block"></div>
        <div className="pointer-events-none absolute top-1/4 -right-20 w-[28rem] h-[28rem] bg-gradient-radial from-sky-200/30 via-sky-100/10 to-transparent rounded-full blur-3xl hidden sm:block"></div>

        {/* White wash at bottom — clean cut into next section */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-64 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

        {/* Subtle grain overlay — premium film texture (lower opacity on mobile) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.25] sm:opacity-[0.4] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
            backgroundSize: '200px 200px',
          }}
        ></div>

        {/* Centered content stack */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Reveal direction="up" duration={0.9} amount={0.3} className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-[13px] font-medium">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              {c.hero.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.05]" style={{ letterSpacing: '-0.035em' }}>
              <span>{c.hero.headline[0]} {c.hero.headline[1]}</span>
              <br />
              <span>{c.hero.headline[2]}</span>{' '}
              <span className="hl-mark text-gray-900">
                {c.hero.headline[3]}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              {c.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <MagneticButton
                href="https://calendly.com/purplexmythzz/30min"
                target="_blank"
                rel="noopener noreferrer"
                strength={0.3}
                className="group px-7 py-3.5 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold text-sm transition-colors duration-200 text-center inline-flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_24px_-8px_rgba(0,0,0,0.25)] will-change-transform w-full sm:w-auto"
              >
                <span>{c.hero.ctaPrimary}</span>
                <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </MagneticButton>
              <a
                href="#pricing"
                className="px-7 py-3.5 rounded-lg font-semibold text-sm text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-white transition-colors duration-200 text-center flex items-center justify-center w-full sm:w-auto"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>

            {/* Trust row — stars + client proof (centered) */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0,1,2,3,4].map(i => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600"><span className="font-semibold text-gray-900">4.9</span> {lang === 'es' ? 'promedio' : 'avg client rating'}</span>
              </div>
              <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
              <div className="text-sm text-gray-600">
                {lang === 'es' ? 'Usado por ' : 'Trusted by '}
                <a href="#portfolio" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">Aspire Roofing</a>, <a href="#portfolio" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">Caley Insurance</a>{lang === 'es' ? ' y más' : ' + more'}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Full-width Dashboard Mockup — the money shot */}
        <Reveal direction="up" duration={1} delay={0.2} amount={0.15} className="relative z-10 max-w-6xl mx-auto mt-12 sm:mt-14 md:mt-16 lg:mt-20">
          <div className="relative">
            {/* Ambient blue glow behind mockup (scales down on mobile) */}
            <div className="pointer-events-none absolute -inset-x-4 -inset-y-3 sm:-inset-x-10 sm:-inset-y-6 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent blur-3xl"></div>

            <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.03)] sm:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.03)] overflow-hidden">
              {/* Mock browser/app chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">azul.app/dashboard</div>
                <div className="w-16"></div>
              </div>

              {/* Dashboard body — 3 col: sidebar / main / right rail */}
              <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
                {/* LEFT SIDEBAR — hidden on smallest screens for readability */}
                <div className="hidden sm:block sm:col-span-3 lg:col-span-2 border-r border-gray-100 p-3 lg:p-4 bg-gray-50/40">
                  {/* Profile */}
                  <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px] lg:text-xs font-semibold">AR</div>
                    <div className="hidden lg:block min-w-0">
                      <div className="text-[11px] font-semibold text-gray-900 truncate">Aspire Roofing</div>
                      <div className="text-[10px] text-gray-500 truncate">{lang === 'es' ? 'Cliente Fundador' : 'Founding Client'}</div>
                    </div>
                  </div>
                  {/* Menu */}
                  <div className="text-[10px] uppercase tracking-[0.12em] text-gray-400 font-semibold mb-2 hidden lg:block">Menu</div>
                  <nav className="space-y-1">
                    {[
                      { label: lang === 'es' ? 'Panel' : 'Dashboard', active: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { label: lang === 'es' ? 'Reseñas' : 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' },
                      { label: 'Leads', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-9a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z' },
                      { label: 'SEO', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                      { label: lang === 'es' ? 'Llamadas' : 'Calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                      { label: lang === 'es' ? 'Ajustes' : 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${item.active ? 'bg-blue-500 text-white' : 'text-gray-600'}`}>
                        <svg className={`w-3.5 h-3.5 flex-shrink-0 ${item.active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                        <span className="text-[11px] font-medium hidden lg:inline truncate">{item.label}</span>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* MAIN CENTER — full width on mobile, shrinks as sidebar/rail appear */}
                <div className="col-span-12 sm:col-span-9 lg:col-span-7 p-4 sm:p-5 md:p-6 lg:border-r lg:border-gray-100 sm:border-r sm:border-gray-100">
                  {/* Greeting + progress */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">{lang === 'es' ? '¡Hola, Aspire! 👋' : 'Hi Aspire! 👋'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{lang === 'es' ? 'Aquí está tu resumen semanal' : "Here's your growth this week"}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="text-[11px] text-gray-500 font-medium">78% {lang === 'es' ? 'meta' : 'goal'}</div>
                      <div className="relative w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-[78%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Two big colorful cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {/* Reviews card */}
                    <div className="relative bg-gradient-to-br from-rose-100 via-rose-50 to-orange-50 rounded-xl p-4 overflow-hidden">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                          <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <button className="text-gray-500 text-lg leading-none">···</button>
                      </div>
                      <div className="text-xs font-medium text-rose-900 leading-snug mb-3 pr-6">
                        {lang === 'es' ? 'Nuevas reseñas 5-estrellas capturadas' : 'New 5-star reviews captured'}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-rose-300 border-2 border-white"></div>
                          <div className="w-5 h-5 rounded-full bg-orange-300 border-2 border-white"></div>
                          <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-white"></div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">+12</div>
                      </div>
                    </div>
                    {/* Leads card */}
                    <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 rounded-xl p-4 overflow-hidden">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-9a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <button className="text-gray-500 text-lg leading-none">···</button>
                      </div>
                      <div className="text-xs font-medium text-blue-900 leading-snug mb-3 pr-6">
                        {lang === 'es' ? 'Nuevos leads del sitio web' : 'New leads from your site'}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-300 border-2 border-white"></div>
                          <div className="w-5 h-5 rounded-full bg-indigo-300 border-2 border-white"></div>
                          <div className="w-5 h-5 rounded-full bg-sky-300 border-2 border-white"></div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">+47</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-gray-900">{lang === 'es' ? 'Actividad reciente' : 'Recent activity'}</div>
                      <div className="flex items-center gap-1">
                        <button className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">{lang === 'es' ? 'Activo' : 'Active'}</button>
                        <button className="text-[11px] px-2 py-0.5 rounded-md text-gray-500 font-medium">{lang === 'es' ? 'Completado' : 'Completed'}</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {c.hero.dashboard.activity.map((a, i) => {
                        const dotColor = { blue: 'bg-blue-500', green: 'bg-emerald-500', yellow: 'bg-amber-500' }[a.dot] || 'bg-blue-500'
                        return (
                          <div key={i} className="flex items-center justify-between text-[11px] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                              {a.text}
                            </div>
                            <span className="text-gray-400 font-medium">{a.time}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT RAIL — Today's Schedule */}
                <div className="hidden lg:block col-span-3 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-900">{lang === 'es' ? 'Hoy' : "Today's Schedule"}</div>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>

                  {/* Discovery call card */}
                  <div className="bg-gray-50/60 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-gray-500 font-semibold">{lang === 'es' ? 'En 30 min' : 'In 30 min'}</div>
                      <div className="text-[10px] text-blue-600 font-medium">+ {lang === 'es' ? 'Unirse' : 'Join'}</div>
                    </div>
                    <div className="text-xs font-semibold text-gray-900 mb-3">{lang === 'es' ? 'Llamada con Miguel' : 'Discovery Call · Miguel'}</div>
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg p-2.5 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-200 border-2 border-emerald-400"></div>
                        <div className="w-5 h-5 rounded-full bg-emerald-100 border-2 border-emerald-400"></div>
                        <div className="w-5 h-5 rounded-full bg-emerald-300 border-2 border-emerald-400"></div>
                      </div>
                      <div className="flex items-center gap-1.5 text-white text-[10px] font-semibold">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                        28:15
                      </div>
                    </div>
                  </div>

                  {/* Project progress */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-gray-500 font-semibold mb-2">{lang === 'es' ? 'Este mes' : 'This month'}</div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-semibold text-gray-900">{lang === 'es' ? 'Reseñas' : 'Reviews'}</div>
                        <div className="text-[11px] text-gray-500 font-medium">156 / 200</div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-gradient-to-r from-rose-400 to-rose-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-semibold text-gray-900">{lang === 'es' ? 'Leads' : 'Leads'}</div>
                        <div className="text-[11px] text-gray-500 font-medium">47 / 60</div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Trust strip — headline stats */}
      <section className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-14 sm:py-16">
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">
              {lang === 'es' ? 'Impulsando negocios locales de Miami' : 'Powering Miami home service pros'}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
                3,000<span className="text-blue-500">+</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">{lang === 'es' ? 'Leads capturados' : 'Leads captured'}</div>
            </div>
            <div className="text-center sm:border-x sm:border-gray-100 sm:px-6">
              <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
                4.9<span className="text-gray-300 text-2xl align-top ml-0.5">/5</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">{lang === 'es' ? 'Promedio de reseñas' : 'Avg review score'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
                &lt;24<span className="text-blue-500">h</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">{lang === 'es' ? 'Tiempo de respuesta' : 'Response time'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-white`}>
        <Reveal direction="up" className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.about.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.about.headline[0]}<br className="hidden sm:block" /> {c.about.headline[1]}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {c.about.subtitle}
          </p>
        </Reveal>

        {/* Mission & Values */}
        <Reveal stagger={0.15} className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto mb-16 sm:mb-20 md:mb-24">
          {c.about.cards.map((card) => (
            <RevealItem key={card.title} className="bg-white border border-gray-200/70 rounded-2xl p-8 sm:p-10 hover:border-gray-300 transition-colors duration-200">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3 text-gray-900">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {card.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>

        {/* What We Do — outcome grid */}
        <Reveal direction="up" className="text-center mb-10 sm:mb-12">
          <div className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.about.whatWeDoEyebrow}</div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900" style={{ letterSpacing: '-0.02em' }}>
            {c.about.whatWeDoHeadline}
          </h3>
        </Reveal>
        {(() => {
          const whatWeDoIcons = [
            <svg key="0" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            <svg key="1" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={2} /><circle cx="12" cy="12" r="5" strokeWidth={2} /><circle cx="12" cy="12" r="1.5" strokeWidth={2} /></svg>,
            <svg key="2" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
            <svg key="3" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
          ]
          return (
            <Reveal stagger={0.12} className="grid sm:grid-cols-2 gap-5 max-w-6xl mx-auto">
              {c.about.whatWeDoCards.map((card, i) => (
                <RevealItem key={i} className="bg-white border border-gray-200/70 rounded-2xl p-7 sm:p-8 hover:border-gray-300 transition-colors duration-200">
                  <div className="w-11 h-11 rounded-lg bg-blue-500 flex items-center justify-center mb-5">
                    {whatWeDoIcons[i]}
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight mb-2 text-gray-900">{card.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-[15px]">
                    {card.body}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          )
        })()}
      </section>

      {/* Solutions — expanded service detail cards */}
      <section id="solutions" className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/60 border-y border-gray-100`}>
        <Reveal direction="up" className="max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.solutions.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.solutions.headline}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {c.solutions.subtitle}
          </p>
        </Reveal>

        {(() => {
          const solutionIcons = [
            <svg key="0" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
            <svg key="1" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            <svg key="2" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
            <svg key="3" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
            <svg key="4" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            <svg key="5" className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
          ]
          return (
            <Reveal stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {c.solutions.cards.map((service, idx) => (
                <RevealItem
                  key={idx}
                  className={`bg-white border rounded-2xl p-7 transition-all duration-200 flex flex-col ${
                    service.comingSoon
                      ? 'border-gray-200/70 opacity-70'
                      : 'border-gray-200/70 hover:border-gray-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      {solutionIcons[idx]}
                    </div>
                    <span className="text-sm font-semibold text-gray-400">{service.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2">{service.title}</h3>
                  <div className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium mb-4 ${
                    service.comingSoon
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {service.badge}
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[14.5px] mb-5">{service.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {service.comingSoon ? (
                    <button disabled className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                      {c.solutions.joinWaitlistCta}
                    </button>
                  ) : (
                    <a href="#pricing" className="w-full py-2.5 rounded-lg font-semibold text-sm text-center bg-gray-900 hover:bg-black text-white transition-colors duration-200 block">
                      {c.solutions.seePricingCta}
                    </a>
                  )}
                </RevealItem>
              ))}
            </Reveal>
          )
        })()}
      </section>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* How It Works */}
      <section id="how-it-works" className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-white`}>
        <Reveal direction="up" className="max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.howItWorks.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.howItWorks.headline}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {c.howItWorks.subtitle}
          </p>
        </Reveal>
        <div className="max-w-6xl mx-auto">
          <Reveal stagger={0.12} className="grid md:grid-cols-4 gap-5">
            {c.howItWorks.steps.map((item, idx) => (
              <RevealItem key={idx} className="relative">
                <div className="bg-white border border-gray-200/70 rounded-2xl p-7 hover:border-gray-300 transition-colors duration-200 h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-semibold text-base mb-5">{item.step}</div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-[14.5px]">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/60 border-y border-gray-100 overflow-visible`}>
        <Reveal direction="up" className="max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.pricing.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.pricing.headline[0]}<br className="hidden sm:block" /> {c.pricing.headline[1]}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {c.pricing.subtitle}
          </p>
        </Reveal>

        {/* 6-tile grid */}
        {(() => {
          const pricingIcons = [
            <svg key="0" className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
            <svg key="1" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            <svg key="2" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
            <svg key="3" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            <svg key="4" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
            <svg key="5" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
          ]
          return (
            <Reveal stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-7xl mx-auto mb-12 sm:mb-16">
              {c.pricing.tiers.map((tier, i) => {
                const stripeUrl = tier.stripeLinkKey ? stripeLinks[tier.stripeLinkKey] : null
                const isReady = stripeUrl && isStripeLinkReady(stripeUrl)
                // Website Build stays demo-first (needs conversation for the recurring hosting).
                // All other tiers with a Stripe link: primary CTA = direct-buy Stripe checkout.
                const isWebsiteBuild = tier.stripeLinkKey === 'websiteSetup'
                const useDirectBuy = isReady && !isWebsiteBuild
                return (
                  <RevealItem key={i}>
                    <PricingCard
                      icon={pricingIcons[i]}
                      title={tier.title}
                      price={tier.price}
                      priceSuffix={lang === 'es' ? '/mes' : '/mo'}
                      priceNote={tier.priceNote}
                      badge={tier.badge}
                      badgeTone={tier.comingSoon ? 'gray' : 'green'}
                      features={tier.features}
                      ctaLabel={tier.ctaLabel}
                      ctaHref={useDirectBuy ? stripeUrl : 'https://calendly.com/purplexmythzz/30min'}
                      buyNowHref={
                        useDirectBuy
                          ? 'https://calendly.com/purplexmythzz/30min'
                          : (isReady && isWebsiteBuild ? stripeUrl : undefined)
                      }
                      buyNowLabel={
                        useDirectBuy
                          ? (lang === 'es' ? 'O reserve una demo primero →' : 'Or book a demo first →')
                          : (lang === 'es' ? 'O pagar setup ahora →' : 'Or pay setup now →')
                      }
                      comingSoon={tier.comingSoon}
                    />
                  </RevealItem>
                )
              })}
            </Reveal>
          )
        })()}

        {/* Growth Suite bundle card */}
        <Reveal direction="up" className="max-w-7xl mx-auto">
          <div className="relative bg-gray-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-14 lg:p-16 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.4)] overflow-hidden">
            {/* Ambient blue glow */}
            <div className="absolute -top-40 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
              {/* Left: name + features */}
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold uppercase tracking-[0.14em] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {c.pricing.bundle.badge}
                </div>
                <h3 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-tight text-white mb-4" style={{ letterSpacing: '-0.025em', lineHeight: '1.05' }}>
                  {c.pricing.bundle.title}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                  {c.pricing.bundle.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {c.pricing.bundle.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-sm text-gray-200">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: price + CTA */}
              <div className="lg:col-span-2 lg:pl-10 lg:border-l lg:border-white/10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-[10px] text-blue-300 uppercase tracking-[0.16em] font-semibold bg-blue-500/10 px-2 py-0.5 rounded">
                    {lang === 'es' ? 'Más Popular' : 'Most Popular'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-[0.12em] font-semibold mb-3">{c.pricing.bundle.startingAt}</div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-6xl sm:text-7xl font-semibold tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>{c.pricing.bundle.price}</span>
                  <span className="text-lg text-gray-500 font-medium">{lang === 'es' ? '/mes' : '/mo'}</span>
                </div>
                <div className="text-sm text-gray-500 line-through mb-8">{c.pricing.bundle.crossed}</div>
                {isStripeLinkReady(stripeLinks.foundingClient) ? (
                  <>
                    <a
                      href={stripeLinks.foundingClient}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-base transition-colors duration-200 group"
                    >
                      {lang === 'es' ? 'Empezar Ahora' : 'Start Now'}
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                    <a
                      href="https://calendly.com/purplexmythzz/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs text-gray-400 hover:text-white mt-3 transition-colors underline underline-offset-4"
                    >
                      {lang === 'es' ? 'O reserve una demo primero →' : 'Or book a demo first →'}
                    </a>
                  </>
                ) : (
                  <a
                    href="https://calendly.com/purplexmythzz/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-base transition-colors duration-200 group"
                  >
                    {c.pricing.bundle.ctaLabel}
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
                <div className="text-center text-xs text-gray-500 mt-4">{c.pricing.bundle.microcopy}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Industries */}
      <section id="industries" className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-white`}>
        <Reveal direction="up" className="max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.industries.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.industries.headline}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {c.industries.subtitle}
          </p>
        </Reveal>

        {(() => {
          const industryIcons = [
            <svg key="0" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            <svg key="1" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m2.343 5.657L17.657 6.343m0 11.314L6.343 6.343" /></svg>,
            <svg key="2" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            <svg key="3" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17c1.5 0 3-1 4.5-1s3 1 4.5 1 3-1 4.5-1 3 1 4.5 1M3 12c1.5 0 3-1 4.5-1s3 1 4.5 1 3-1 4.5-1 3 1 4.5 1M3 7c1.5 0 3-1 4.5-1s3 1 4.5 1 3-1 4.5-1 3 1 4.5 1" /></svg>,
            <svg key="4" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22V8M12 8l-4-4m4 4l4-4M6 15c0-3.314 2.686-6 6-6s6 2.686 6 6" /></svg>,
            <svg key="5" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
            <svg key="6" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
            <svg key="7" className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
          ]
          return (
            <Reveal stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {c.industries.items.map((industry, i) => (
                <RevealItem
                  key={industry.name}
                  className={`relative bg-white border rounded-2xl p-6 transition-all duration-200 ${
                    industry.comingSoon
                      ? 'border-gray-200/70 opacity-60'
                      : 'border-gray-200/70 hover:border-gray-300 hover:-translate-y-0.5'
                  }`}
                >
                  {industry.primary && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      {c.industries.focusBadge}
                    </div>
                  )}
                  {industry.comingSoon && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      {c.industries.soonBadge}
                    </div>
                  )}
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    {industryIcons[i]}
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-gray-900">{industry.name}</h3>
                </RevealItem>
              ))}
            </Reveal>
          )
        })()}

        <Reveal direction="fade" className="text-center mt-12">
          <p className="text-gray-600 text-sm sm:text-base">
            {c.industries.fallback} <a href="#contact" className="text-blue-600 hover:text-blue-700 font-semibold">{c.industries.fallbackLink}</a> {c.industries.fallbackAfter}
          </p>
        </Reveal>
      </section>

      {/* Recent Work — compact social proof strip */}
      <section id="portfolio" className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/60 border-y border-gray-100`}>
        <Reveal direction="up" className="max-w-4xl mx-auto mb-12">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.recentWork.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.recentWork.headline}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {c.recentWork.subtitle}
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {portfolioProjects.map((project) => (
            <RevealItem key={project.id}>
              <PortfolioCard
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-white`}>
        <Reveal direction="up" className="text-center mb-14 sm:mb-16 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">FAQ</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.faq.headline}
          </h2>
        </Reveal>
        <Reveal stagger={0.06} className="max-w-3xl mx-auto space-y-3">
          {c.faq.items.map((faq, idx) => (
            <RevealItem key={idx} className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${expandedFAQ === idx ? 'bg-gray-50/70 border-gray-200' : 'bg-white border-gray-200/70 hover:border-gray-300'}`}>
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full px-6 sm:px-7 py-5 text-left flex items-center justify-between gap-4 group"
              >
                <h3 className="text-base sm:text-[17px] font-semibold tracking-tight text-gray-900">{faq.question}</h3>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transform transition-transform duration-300 ${expandedFAQ === idx ? 'rotate-180 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === idx && (
                <div className="px-6 sm:px-7 pb-6 -mt-1">
                  <p className="text-gray-600 leading-relaxed text-[15px]">{faq.answer}</p>
                </div>
              )}
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/60 border-t border-gray-100`}>
        <Reveal direction="up" className="max-w-3xl mx-auto mb-14 sm:mb-16 text-center">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase mb-4">{c.contact.eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-5 text-gray-900" style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            {c.contact.headline}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {c.contact.subtitle}
          </p>
        </Reveal>
        <Reveal stagger={0.18} className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <RevealItem className="bg-white border border-gray-200/70 rounded-2xl p-7 sm:p-9">
            <form 
              action="https://formspree.io/f/meovalvq" 
              method="POST"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">{c.contact.form.nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[48px]"
                  placeholder={c.contact.form.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">{c.contact.form.emailLabel}</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[48px]"
                  placeholder={c.contact.form.emailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">{c.contact.form.businessTypeLabel}</label>
                <select
                  name="business_type"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[48px]"
                >
                  {c.contact.form.businessTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">{c.contact.form.interestLabel}</label>
                <select
                  name="service_interest"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[48px]"
                >
                  {c.contact.form.interestOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">{c.contact.form.messageLabel}</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none min-h-[120px]"
                  placeholder={c.contact.form.messagePlaceholder}
                ></textarea>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{c.contact.form.recaptcha}</span>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-gray-900 hover:bg-black rounded-lg font-semibold text-base text-white transition-colors duration-200 min-h-[48px] flex items-center justify-center gap-2 group"
              >
                {c.contact.form.submit}
                <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
              <p className="text-xs text-gray-500 text-center">
                {c.contact.form.responseTime}
              </p>
            </form>
          </RevealItem>
          <RevealItem className="relative bg-gray-900 rounded-2xl p-7 sm:p-9 flex flex-col text-left overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative w-11 h-11 rounded-lg bg-blue-500 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="relative text-2xl sm:text-3xl font-semibold tracking-tight mb-3 text-white" style={{ letterSpacing: '-0.02em' }}>{c.contact.demoCard.title}</h3>
            <p className="relative text-gray-400 mb-8 leading-relaxed text-[15px]">
              {c.contact.demoCard.body}
            </p>
            <MagneticButton
              href="https://calendly.com/purplexmythzz/30min"
              target="_blank"
              rel="noopener noreferrer"
              strength={0.3}
              className="relative w-full sm:w-auto self-start px-6 py-3.5 bg-white hover:bg-gray-100 rounded-xl font-semibold text-sm text-gray-900 transition-colors duration-200 inline-flex items-center justify-center gap-2 mb-8 will-change-transform group"
            >
              {c.contact.demoCard.cta}
              <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
            </MagneticButton>
            {/* Social Links */}
            <div className="relative flex items-center gap-2 pt-6 border-t border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-[0.14em] font-semibold mr-2">{lang === 'es' ? 'Síguenos' : 'Follow'}</span>
              <a
                href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/azuldevsmiami/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </RevealItem>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand */}
            <div>
              <div className="inline-flex items-baseline gap-1 mb-4">
                <span
                  className="text-3xl font-bold text-gray-900 leading-none"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  Azul
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500 self-end mb-1.5"></span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {c.footer.tagline}
              </p>
              <p className="text-gray-500 text-xs italic">
                {c.footer.subline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-xs uppercase tracking-[0.14em]">{c.footer.quickLinks}</h4>
              <ul className="space-y-2">
                <li><a href="#solutions" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.solutions}</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.pricing}</a></li>
                <li><a href="#industries" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.industries}</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.howItWorks}</a></li>
                <li><a href="#portfolio" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.recentWork}</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{c.footer.links.contact}</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-xs uppercase tracking-[0.14em]">{c.footer.services}</h4>
              <ul className="space-y-2">
                {c.footer.serviceLinks.map((service) => (
                  <li key={service}><a href="#pricing" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">{service}</a></li>
                ))}
                <li><span className="text-gray-500 text-sm italic">{c.footer.soonLabel}</span></li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-xs uppercase tracking-[0.14em]">{c.footer.connect}</h4>
              <div className="flex gap-2 mb-5">
                <a
                  href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/azuldevsmiami/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <a
                href="https://calendly.com/purplexmythzz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors mb-4"
              >
                {c.footer.bookDemo}
              </a>
              <a
                href="https://wa.me/17869201239"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 text-sm transition-colors block mb-1"
              >
                {c.footer.whatsapp}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors block">
                {c.footer.contactForm}
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500">
              {c.footer.copyright(new Date().getFullYear())}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {c.footer.serviceArea}
            </p>
          </div>
        </div>
      </footer>

      {/*
        WhatsApp floating widget.
        TODO: replace 17869201239 with your real WhatsApp Business number (country code + number, no + or spaces).
        Miami leads will overwhelmingly prefer WhatsApp over SMS/email.
      */}
      <a
        href={`https://wa.me/17869201239?text=${encodeURIComponent(c.whatsapp.message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.whatsapp.ariaLabel}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2"
      >
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-gray-900/95 border border-gray-700 text-gray-100 text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {c.whatsapp.tooltip}
        </span>
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg shadow-green-500/30 transition-colors duration-200">
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
          <svg className="relative w-7 h-7 sm:w-8 sm:h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </span>
      </a>
    </div>
  )
}

export default App
