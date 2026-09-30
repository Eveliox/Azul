import { lazy, Suspense } from 'react'
import { Link, BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useLanguage } from './contexts/LanguageContext'
import Layout, { bookingUrl } from './components/site/Layout'
import { DotGrid } from './components/motion/DotGrid'
import { SectionEyebrow } from './components/motion/Eyebrow'
import { PageTransition } from './components/motion/PageTransition'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { SplitText } from './components/motion/SplitText'
import CustomAIAgents from './pages/CustomAIAgents'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import { serviceSlugs } from './data/services'
import Work from './pages/Work'
import { insightArticles } from './data/insights'
const Insights = lazy(() => import('./pages/Insights'))
const InsightArticle = lazy(() => import('./pages/InsightArticle'))
const FreeReport = lazy(() => import('./pages/FreeReport'))
function InsightRoute({ children }) {
  const { c } = useLanguage()
  return <Suspense fallback={<section className="section insight-loading" role="status">{c.insights.loading}</section>}>{children}</Suspense>
}
function PendingPage() {
  const { c } = useLanguage()
  const { pathname } = useLocation()
  const legal = ['/privacy', '/terms', '/cookies'].includes(pathname)
  return <section className="pending section"><DotGrid /><SectionEyebrow>{c.pending.label}</SectionEyebrow><SplitText as="h1">{legal ? c.legal.title : c.pending.title}</SplitText><p>{legal ? c.legal.body : c.pending.body}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.ai.cta} ↗</a><Link className="text-link" to="/">{c.pending.home} ↗</Link></section>
}
export default function App() {
  return <BrowserRouter><SmoothScroll><PageTransition>{location => <Routes location={location}><Route element={<Layout />}><Route index element={<Home />} /><Route path="about" element={<About />} /><Route path="insights" element={<InsightRoute><Insights /></InsightRoute>} />{insightArticles.map(article => <Route key={article.slug} path={`insights/${article.slug}`} element={<InsightRoute><InsightArticle key={article.slug} article={article} /></InsightRoute>} />)}<Route path="work" element={<Work />} /><Route path="services" element={<Services />} />{serviceSlugs.map(slug => <Route key={slug} path={`services/${slug}`} element={<ServiceDetail key={slug} slug={slug} />} />)}<Route path="services/custom-ai-agents" element={<CustomAIAgents />} /><Route path="free-report" element={<Suspense fallback={<section className="section free-report" />}><FreeReport /></Suspense>} /><Route path="*" element={<PendingPage key={location.pathname} />} /></Route></Routes>}</PageTransition></SmoothScroll></BrowserRouter>
}
