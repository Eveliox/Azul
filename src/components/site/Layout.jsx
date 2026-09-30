import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { MagneticButton } from '../motion/MagneticButton'
import { PageMetadata } from './PageMetadata'
import { JobPostingProvider } from '../agents/JobPostingDrawer'
import { Arrow, Modal, Newsletter, PhoneIcon } from './UI'
export const paths = ['/', '/work', '/services', '/about', '/insights', '/free-report']
export const bookingUrl = 'https://calendly.com/purplexmythzz/30min'
// Temporary "New" badge beside Services while Custom AI Agents launches. Set to null to remove it.
const NEW_BADGE_PATH = '/services'
const NavBadge = ({ path }) => { const { c } = useLanguage(); return path === NEW_BADGE_PATH ? <span className="nav-new">{c.agents.newLabel}</span> : null }

// Transparent over the hero. A dark blurred backdrop fades in once the page
// scrolls. The bar hides while scrolling down and returns when scrolling up.
function useHeaderScroll(header, locked) {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  useEffect(() => {
    const el = header.current
    if (!el) return
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.max(window.scrollY, 0)
      el.classList.toggle('is-scrolled', y > 24)
      if (Math.abs(y - last) < 6) return
      el.classList.toggle('is-hidden', !reduced && !locked && y > last && y > 160)
      last = y
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    el.classList.remove('is-hidden')
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [header, locked, reduced, pathname])
}

function Navigation() {
  const { c, lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const header = useRef(null)
  useHeaderScroll(header, open)
  return <><header className="site-header" ref={header} data-intro-fade><nav className="desktop-nav" aria-label={c.footer.navigation}>{paths.map((path, i) => <NavLink to={path} end={path === '/'} key={path}>{c.nav[i]}<NavBadge path={path} /></NavLink>)}</nav><Link className="mobile-brand" to="/">{c.brand}</Link><div className="nav-right"><Link to="/contact">{c.contact}<Arrow /></Link><div className="languages" role="group" aria-label={c.language}>{c.languages.map((label, i) => <button key={label} onClick={() => setLang(i ? 'es' : 'en')} aria-pressed={lang === (i ? 'es' : 'en')}>{label}</button>)}</div><button className="menu-toggle" aria-label={c.menu} aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button></div></header>{open && <Modal title={c.brand} onClose={() => setOpen(false)}><nav className="mobile-nav">{[...paths, '/contact'].map((path, i) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}><span>{[...c.nav, c.contact][i]}<NavBadge path={path} /></span><Arrow /></NavLink>)}</nav></Modal>}</>
}
function CookieControls() {
  const { c } = useLanguage()
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('azul-cookies')) } catch { return null } })
  const [visible, setVisible] = useState(!saved)
  const [manage, setManage] = useState(false)
  const [analytics, setAnalytics] = useState(saved?.analytics ?? false)
  function save(value) {
    const preference = { analytics: value, updatedAt: new Date().toISOString() }
    try { localStorage.setItem('azul-cookies', JSON.stringify(preference)) } catch { /* Works without persistent storage. */ }
    setSaved(preference); setAnalytics(value); setVisible(false); setManage(false)
    window.dispatchEvent(new CustomEvent('azul:consent', { detail: preference }))
  }
  return <><button className="cookie-reopen" data-intro-fade aria-label={c.cookie.reopen} onClick={() => setVisible(v => !v)}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c-1 3 2 6 5 5-1 3 1 4 4 4Z"/><circle cx="8" cy="10" r="1"/><circle cx="10" cy="16" r="1"/><circle cx="16" cy="15" r="1"/></svg></button>{visible && <aside className="cookie-banner" data-intro-fade aria-label={c.cookie.title}><h2>{c.cookie.title}</h2><p>{c.cookie.body}</p>{manage && <div className="cookie-options"><p>{c.cookie.necessary}</p><label className="checkbox"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />{c.cookie.analytics}</label></div>}<div className="cookie-actions"><button onClick={() => save(true)}>{c.cookie.accept}</button><button onClick={() => save(false)}>{c.cookie.deny}</button>{manage ? <button onClick={() => save(analytics)}>{c.cookie.save}</button> : <button onClick={() => setManage(true)}>{c.cookie.manage}</button>}</div></aside>}</>
}
export default function Layout() {
  const { c } = useLanguage()
  const [ai, setAi] = useState(false)
  return <JobPostingProvider><PageMetadata /><a className="skip-link" href="#main">{c.skip}</a><Navigation /><main id="main" tabIndex={-1}><Outlet /></main><footer className="site-footer" id="contact"><div className="footer-top"><h2>{c.footer.title}</h2><a href={`mailto:${c.email}`}>{c.email}<Arrow /></a></div><div className="footer-columns"><div><h3>{c.footer.navigation}</h3>{paths.map((path, i) => <Fragment key={path}><Link to={path}>{c.nav[i]}</Link>{path === '/services' && <Link className="footer-sublink" to="/services/custom-ai-agents">{c.agents.footerLink}</Link>}</Fragment>)}<Link to="/contact">{c.contact}</Link></div><div><h3>{c.footer.social}</h3>{c.socials.map(s => <a href={s.href} target="_blank" rel="noreferrer" key={s.label}>{s.label}<Arrow /></a>)}</div><div><h3>{c.footer.areas}</h3>{c.areas.map(area => <p key={area}>{area}</p>)}</div><Newsletter /></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {c.footer.copyright}</span><div>{c.footer.legal.map((label, i) => <Link key={label} to={['/privacy', '/terms', '/cookies'][i]}>{label}</Link>)}</div><span>{c.footer.bottom}</span></div></footer><MagneticButton className="ai-pill" data-intro-fade onClick={() => setAi(true)} strength={0.25}><PhoneIcon />{c.ai.label}<span aria-hidden="true">↗</span></MagneticButton><CookieControls />{ai && <Modal title={c.ai.title} onClose={() => setAi(false)}><p>{c.ai.body}</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">{c.ai.cta}<Arrow /></a></Modal>}</JobPostingProvider>
}
