import { useLanguage } from '../../contexts/LanguageContext'
import { StudioHero } from './StartupKit'
import { OfferCtas } from './Offer'
import { ConnectedJourney } from './ConnectedJourney'
import { servicesPage } from '../../data/servicesPage'

export function Hero() {
  const { lang } = useLanguage()
  const t = servicesPage[lang]
  return <StudioHero title={lang === 'es' ? 'Una mejor web.\nMás estimados agendados.' : 'A better website.\nMore booked estimates.'} body={lang === 'es' ? 'Sitios web a medida y seguimiento con IA que convierten consultas en citas.' : 'Custom websites and AI follow-up that turn new inquiries into booked appointments.'} className="studio-home-hero workflow-hero">
    <OfferCtas />
    <ConnectedJourney key={lang} lang={lang} />
    <div className="lab-trust-strip">{t.strip.map(item => <span key={item}>{item}</span>)}</div>
  </StudioHero>
}
