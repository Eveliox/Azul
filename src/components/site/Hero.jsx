import { useLanguage } from '../../contexts/LanguageContext'
import { StudioHero } from './StartupKit'
import { OfferCtas } from './Offer'
import { ConnectedJourney } from './ConnectedJourney'
import { productDemo } from '../../data/productDemo'

export function Hero() {
  const { lang } = useLanguage()
  const t = productDemo[lang]
  return <StudioHero title={t.title} body={t.body} className="studio-home-hero lead-demo-hero">
    <div className="lead-demo-actions"><OfferCtas /><a className="lab-explore" href="#product-demo">{t.watch}<span aria-hidden="true">↓</span></a></div>
    <ConnectedJourney key={lang} lang={lang} />
  </StudioHero>
}
