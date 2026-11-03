import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useMediaQuery } from '../../hooks/useMediaQuery'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useLenis } from '../motion/SmoothScroll'

const FILM_START = .65
const FILM_END = 29.45
const FILM_SPAN = FILM_END - FILM_START

const chapters = {
  en: [
    ['The first impression.', 'A bilingual website helps a homeowner find your business and request an estimate.', 'Website'],
    ['The first response.', 'Your AI agent calls while the inquiry is fresh. If they miss the call, a text follows.', 'AI call'],
    ['The details that matter.', 'Service, location, and urgency—collected before your team picks up the job.', 'Qualify'],
    ['A place on your calendar.', 'The estimate is booked. Your customer gets confirmation; your team gets the context.', 'Book'],
    ['The job becomes your reputation.', 'After the work is marked complete, a review request helps the customer share their experience.', 'Reviews'],
    ['One connected system.', 'Your website, calls, calendar, and review requests work together. You get back to the job.', 'Connected'],
  ],
  es: [
    ['La primera impresión.', 'Un sitio bilingüe ayuda al cliente a encontrar tu negocio y solicitar un estimado.', 'Sitio web'],
    ['La primera respuesta.', 'Tu agente de IA llama mientras la consulta está reciente. Si no contestan, envía un mensaje.', 'Llamada IA'],
    ['Los detalles que importan.', 'Servicio, ubicación y urgencia: todo listo antes de que tu equipo tome el trabajo.', 'Calificar'],
    ['Un lugar en tu calendario.', 'El estimado queda agendado. Tu cliente recibe la confirmación y tu equipo, los detalles.', 'Agendar'],
    ['El trabajo construye tu reputación.', 'Después de marcar el trabajo como terminado, una solicitud invita al cliente a compartir su experiencia.', 'Reseñas'],
    ['Un sistema conectado.', 'Tu sitio, llamadas, calendario y solicitudes de reseñas trabajan juntos. Tú vuelves al trabajo.', 'Conectado'],
  ],
}

export function ConnectedJourney({ lang }) {
  const mobile = useMediaQuery('(max-width:700px)')
  return <WorkflowJourney key={`${lang}-${mobile}`} lang={lang} mobile={mobile} />
}

function WorkflowJourney({ lang, mobile }) {
  const video = useRef(null)
  const stage = useRef(null)
  const trigger = useRef(null)
  const progress = useRef(null)
  const scroll = useLenis()
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [chapter, setChapter] = useState(0)
  const es = lang === 'es'
  const items = chapters[lang] || chapters.en
  const scrubbing = ready && !reduced && !failed

  useEffect(() => {
    if (!scrubbing) return
    const media = video.current
    media.pause()
    let target = FILM_START
    let disposed = false
    const seek = () => {
      if (disposed || media.seeking || Math.abs(media.currentTime - target) < .045) return
      media.currentTime = Math.min(target, media.duration - .1)
    }
    media.addEventListener('seeked', seek)
    const pinOffset = () => {
      const header = document.querySelector('.site-header')
      const banner = document.querySelector('.site-banner')
      const offset = (header?.offsetHeight || 82) + (banner?.offsetHeight || 0) + 16
      stage.current?.style.setProperty('--workflow-pin-top', `${offset}px`)
      return offset
    }
    pinOffset()
    const playhead = { progress: 0 }
    const context = gsap.context(() => {
      const tween = gsap.to(playhead, {
        progress: 1, ease: 'none',
        onUpdate: () => {
          const p = playhead.progress
          // Scrub continuously through the designed scene-to-scene handoffs.
          target = FILM_START + p * FILM_SPAN
          const index = Math.min(5, Math.floor(target / 5))
          setChapter(previous => previous === index ? previous : index)
          progress.current?.style.setProperty('--workflow-progress', String(p))
          seek()
        },
        scrollTrigger: {
          trigger: stage.current,
          start: () => `top top+=${pinOffset()}`,
          end: () => `+=${Math.max(1800, window.innerHeight * 3.2)}`,
          pin: true, pinSpacing: true, scrub: .4, anticipatePin: 1, invalidateOnRefresh: true,
        },
      })
      trigger.current = tween.scrollTrigger
    }, stage)
    seek()
    ScrollTrigger.refresh()
    return () => {
      disposed = true
      media.removeEventListener('seeked', seek)
      context.revert()
      trigger.current = null
    }
  }, [scrubbing, lang])

  const goToChapter = index => {
    if (trigger.current) {
      const instance = trigger.current
      const destination = instance.start + (instance.end - instance.start) * ((index * 5 + 2.5 - FILM_START) / FILM_SPAN)
      if (scroll?.current) scroll.current.scrollTo(destination, { duration: .7 })
      else window.scrollTo({ top: destination, behavior: 'smooth' })
    } else if (video.current && ready) {
      video.current.currentTime = index * 5 + 2.5
      setChapter(index)
    }
  }

  return <div className={`workflow-scroll${scrubbing ? ' is-scroll-driven' : ''}`}>
    <div className="workflow-scroll-heading"><span>{es ? 'UN RECORRIDO, DE PRINCIPIO A FIN' : 'ONE JOURNEY, START TO FINISH'}</span><a href="#how-it-works">{es ? 'Saltar recorrido' : 'Skip walkthrough'} ↗</a></div>
    <div ref={stage} className="workflow-stage">
      <figure className="workflow-film">
        <div className="workflow-film-bar"><span>AZUL / {es ? 'EL SISTEMA COMPLETO' : 'THE COMPLETE SYSTEM'}</span><span>{scrubbing ? (es ? 'DESPLÁZATE PARA EXPLORAR ↓' : 'SCROLL TO EXPLORE ↓') : (es ? 'EJEMPLO ILUSTRATIVO' : 'ILLUSTRATIVE EXAMPLE')}</span></div>
        <video key={lang} ref={video} src={`/videos/azul-workflow-${lang}${mobile ? '-mobile' : ''}.webm`} poster={`/videos/azul-workflow-${lang}${mobile ? '-mobile' : ''}.jpg`} muted playsInline controls={!scrubbing} preload={reduced ? 'none' : 'auto'} onLoadedData={() => setReady(true)} onError={() => setFailed(true)} onTimeUpdate={() => { if (!scrubbing) setChapter(Math.min(5, Math.floor((video.current?.currentTime || 0) / 5))) }} aria-label={es ? 'Recorrido de Azul: sitio web, llamada de IA, estimado y reseña' : 'Azul workflow: website, AI call, estimate, and review'} />
        {failed && <p className="workflow-load-error">{es ? 'El video no se pudo cargar. Tu sitio capta la consulta; el agente llama, califica y agenda. Después del trabajo, se solicita una reseña.' : 'The video could not load. Your website captures the inquiry; the agent calls, qualifies, and books. After the job, a review is requested.'}</p>}
      </figure>
      <div ref={progress} className="workflow-chapters" role="group" aria-label={es ? 'Pasos del recorrido' : 'Walkthrough chapters'}>{items.map((item, index) => <button key={item[2]} type="button" onClick={() => goToChapter(index)} disabled={!ready || failed} aria-pressed={chapter === index}><span>0{index + 1}</span>{item[2]}</button>)}</div>
      <div className="workflow-chapter-copy"><span className="workflow-chapter-number">0{chapter + 1} / 06</span><div><h2>{items[chapter][0]}</h2><p>{items[chapter][1]}</p></div><span className="workflow-demo-label">{es ? 'EJEMPLO\nILUSTRATIVO' : 'ILLUSTRATIVE\nEXAMPLE'}</span></div>
    </div>
  </div>
}
