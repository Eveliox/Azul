import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { PixelArrow, PixelField, WindowBar } from './ServicesVisuals'

export function StudioLabel({ children }) { return <span className="lab-label">{children}</span> }
export function StudioTitle({ children, as: Tag = 'h2', ...props }) {
  const lines=String(children).split('\n')
  return <Tag className="studio-title" {...props}>{lines.map((line,i)=><span className={i===lines.length-1&&lines.length>1?'is-mono':''} key={i}>{line}{i<lines.length-1&&<br/>}</span>)}</Tag>
}
export function StudioHero({ label, title, body, children, className='' }) {
  return <section className={`studio-page-hero section ${className}`}>{label && <StudioLabel>{label}</StudioLabel>}<StudioTitle as="h1">{title}</StudioTitle>{body&&<p className="studio-page-intro">{body}</p>}{children}</section>
}
export function StudioWindow({ title, children, className='' }) { return <div className={`studio-window lab-window ${className}`}><WindowBar title={`// ${title} //`}/>{children}</div> }
export function StudioCta({ title, body, children }) { return <section className="studio-cta section"><PixelField/><StudioTitle>{title}</StudioTitle>{body&&<p>{body}</p>}{children}</section> }
export function StudioFooter() {
  const { c }=useLanguage()
  return <footer className="lab-footer studio-footer lab-container"><div><Link className="lab-footer-brand" to="/"><img src="/Azul%20Gradient%20Ribbon%20Logo.png" alt="Azul" width="100" height="50"/></Link><p>{c.footer.bottom}</p></div><div><span className="lab-micro">{c.contact}</span><a href={`mailto:${c.email}`}>{c.email}</a>{c.socials.map(item=><a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>)}</div><div><span className="lab-micro">{c.footer.navigation}</span>{['/','/work','/services','/about','/free-report'].map((path,i)=><Link to={path} key={path}>{c.nav[i]}</Link>)}</div><div className="lab-footer-bottom"><span>© {new Date().getFullYear()} {c.footer.copyright}</span><div>{c.footer.legal.map((label,i)=><Link key={label} to={['/privacy','/terms','/cookies'][i]}>{label}</Link>)}</div></div></footer>
}
export function StudioLink({ to, children }) { return <Link className="lab-inline-link" to={to}>{children}<PixelArrow/></Link> }
