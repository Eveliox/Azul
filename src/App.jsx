import { lazy, Suspense, useLayoutEffect } from 'react'
import { Link, BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useLanguage } from './contexts/LanguageContext'
import Layout, { bookingUrl } from './components/site/Layout'
import { DotGrid } from './components/motion/DotGrid'
import { PageTransition } from './components/motion/PageTransition'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { SplitText } from './components/motion/SplitText'
import { ScrollTrigger } from './lib/gsap'
import { useLenis } from './components/motion/SmoothScroll'
const CustomAIAgents = lazy(() => import('./pages/CustomAIAgents'))
const AILeadAgent = lazy(() => import('./pages/AILeadAgent'))
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
import { serviceSlugs } from './data/services'
const Work = lazy(() => import('./pages/Work'))
import { insightArticles } from './data/insights'
const Insights = lazy(() => import('./pages/Insights'))
const InsightArticle = lazy(() => import('./pages/InsightArticle'))
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
function InsightRoute({ children }) {
  const { c } = useLanguage()
  return <Suspense fallback={<section className="section insight-loading" role="status">{c.insights.loading}</section>}><RouteReady>{children}</RouteReady></Suspense>
}
function PendingPage() {
  const { c } = useLanguage()
  const { pathname } = useLocation()
  const legal = ['/privacy', '/terms', '/cookies'].includes(pathname)
  return <section className="pending section"><DotGrid /><SplitText as="h1">{legal ? c.legal.title : c.pending.title}</SplitText><p>{legal ? c.legal.body : c.pending.body}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.ai.cta} ↗</a><Link className="text-link" to="/">{c.pending.home} ↗</Link></section>
}
export default function App() {
  return <BrowserRouter><SmoothScroll><PageTransition>{location => <Routes location={location}><Route element={<Layout />}><Route index element={<Home />} /><Route path="about" element={<InsightRoute><About /></InsightRoute>} /><Route path="insights" element={<InsightRoute><Insights /></InsightRoute>} />{insightArticles.map(article => <Route key={article.slug} path={`insights/${article.slug}`} element={<InsightRoute><InsightArticle key={article.slug} article={article} /></InsightRoute>} />)}<Route path="work" element={<InsightRoute><Work /></InsightRoute>} /><Route path="services" element={<InsightRoute><Services /></InsightRoute>} />{serviceSlugs.map(slug => <Route key={slug} path={`services/${slug}`} element={<InsightRoute><ServiceDetail key={slug} slug={slug} /></InsightRoute>} />)}<Route path="services/custom-ai-agents" element={<InsightRoute><CustomAIAgents /></InsightRoute>} /><Route path="services/ai-lead-agent" element={<InsightRoute><AILeadAgent /></InsightRoute>} /><Route path="free-report" element={<Suspense fallback={<section className="section free-report" />}><FreeReport /></Suspense>} /><Route path="*" element={<PendingPage key={location.pathname} />} /></Route></Routes>}</PageTransition></SmoothScroll></BrowserRouter>
}
