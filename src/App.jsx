import { lazy, Suspense, useLayoutEffect } from 'react'
import { Link, BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useLanguage } from './contexts/LanguageContext'
import Layout, { bookingUrl } from './components/site/Layout'
import { StudioTitle } from './components/site/StartupKit'
import { PageTransition } from './components/motion/PageTransition'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { useLenis } from './components/motion/SmoothScroll'
const AILeadAgent = lazy(() => import('./pages/AILeadAgent'))
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Work = lazy(() => import('./pages/Work'))
const FreeReport = lazy(() => import('./pages/FreeReport'))
function RouteReady({ children }) {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (!hash) return
      let target
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))) } catch { return }
      if (!target) return
      if (lenis?.current) lenis.current.scrollTo(target, { offset: -90, immediate: true, force: true })
      else target.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, lenis])
  return children
}
function LazyRoute({ children }) {
  const { c } = useLanguage()
  return <Suspense fallback={<section className="section insight-loading" role="status">{c.loading}</section>}><RouteReady>{children}</RouteReady></Suspense>
}
function PendingPage() {
  const { c } = useLanguage()
  const { pathname } = useLocation()
  const legal = ['/privacy', '/terms', '/cookies'].includes(pathname)
  return <section className="pending section"><StudioTitle as="h1">{legal ? c.legal.title : c.pending.title}</StudioTitle><p>{legal ? c.legal.body : c.pending.body}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.ai.cta} ↗</a><Link className="text-link" to="/">{c.pending.home} ↗</Link></section>
}
export default function App() {
  return <BrowserRouter><SmoothScroll><PageTransition>{location => <Routes location={location}><Route element={<Layout />}><Route index element={<Home />} /><Route path="about" element={<LazyRoute><About /></LazyRoute>} /><Route path="work" element={<LazyRoute><Work /></LazyRoute>} /><Route path="services" element={<LazyRoute><Services /></LazyRoute>} /><Route path="services/ai-lead-agent" element={<LazyRoute><AILeadAgent /></LazyRoute>} /><Route path="contact" element={<LazyRoute><Contact /></LazyRoute>} /><Route path="free-report" element={<Suspense fallback={<section className="section free-report" />}><FreeReport /></Suspense>} /><Route path="*" element={<PendingPage key={location.pathname} />} /></Route></Routes>}</PageTransition></SmoothScroll></BrowserRouter>
}
