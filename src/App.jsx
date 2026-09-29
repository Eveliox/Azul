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
import Services from './pages/Services'
import Work from './pages/Work'
function PendingPage() {
  const { c } = useLanguage()
  const { pathname } = useLocation()
  const legal = ['/privacy', '/terms', '/cookies'].includes(pathname)
  return <section className="pending section"><DotGrid /><SectionEyebrow>{c.pending.label}</SectionEyebrow><SplitText as="h1">{legal ? c.legal.title : c.pending.title}</SplitText><p>{legal ? c.legal.body : c.pending.body}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.ai.cta} ↗</a><Link className="text-link" to="/">{c.pending.home} ↗</Link></section>
}
export default function App() {
  return <BrowserRouter><SmoothScroll><PageTransition>{location => <Routes location={location}><Route element={<Layout />}><Route index element={<Home />} /><Route path="work" element={<Work />} /><Route path="services" element={<Services />} /><Route path="services/custom-ai-agents" element={<CustomAIAgents />} /><Route path="*" element={<PendingPage key={location.pathname} />} /></Route></Routes>}</PageTransition></SmoothScroll></BrowserRouter>
}
