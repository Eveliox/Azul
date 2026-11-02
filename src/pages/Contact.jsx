import { useLanguage } from '../contexts/LanguageContext'
import { StudioHero, StudioWindow } from '../components/site/StartupKit'
import { PixelArrow, SystemIcon } from '../components/site/ServicesVisuals'
import { bookingUrl } from '../components/site/Layout'

export default function Contact() {
  const { c, lang } = useLanguage()
  const t = c.offer.contact
  const en = lang === 'en'
  return <StudioHero label={en ? 'Let’s talk / EN + ES' : 'Hablemos / EN + ES'} title={t.title} body={t.body} className="offer-contact">
    <div className="studio-contact-grid">
      <StudioWindow title={en ? 'Start a conversation' : 'Iniciemos una conversación'}>
        <div className="studio-contact-content"><SystemIcon type={2}/><h2>{en ? 'Tell us what you need.' : 'Cuéntenos qué necesita.'}</h2><p>{en ? 'A new website, faster lead follow-up, or the whole system. We’ll work through the next step together.' : 'Un sitio nuevo, una respuesta más rápida a sus clientes o el sistema completo. Definamos juntos el siguiente paso.'}</p><a className="lab-button" href={bookingUrl} target="_blank" rel="noreferrer">{c.offer.ctas.book}<span><PixelArrow/></span></a></div>
      </StudioWindow>
      <div className="studio-contact-email"><span className="lab-micro">{en ? 'Prefer email?' : '¿Prefiere escribirnos?'}</span><a href={`mailto:${c.email}`}>{c.email} ↗</a><p>{en ? 'Send us your website and a little about your business.' : 'Envíenos su sitio web y cuéntenos un poco sobre su negocio.'}</p><div className="studio-profile-languages">EN <span>↔</span> ES</div></div>
    </div>
  </StudioHero>
}
