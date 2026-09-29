import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { experience } from '../data/experience'

export function LanguageButtons({ value, onChange, label }) {
  return <div className="experience-language" role="group" aria-label={label}>
    {['en', 'es'].map((code) => <button key={code} type="button" aria-pressed={value === code} onClick={() => onChange(code)}>{code.toUpperCase()}</button>)}
  </div>
}

export function Waveform({ playing = false }) {
  return <div className={`voice-wave ${playing ? 'is-playing' : ''}`} aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <span key={i} style={{ '--height': `${18 + ((i * 37) % 69)}%`, '--delay': `${i * -0.08}s` }}/>)}</div>
}

export function CallJourney({ lang }) {
  const t = experience[lang]
  const [demoLang, setDemoLang] = useState(lang)
  const d = experience[demoLang]
  const [stage, setStage] = useState(0)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const reduced = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (!running || reduced) return
    const timer = setTimeout(() => {
      if (stage === 3) setRunning(false)
      else setStage((s) => s + 1)
    }, 3400)
    return () => clearTimeout(timer)
  }, [stage, running, reduced])
  useEffect(() => {
    if (reduced) setRunning(false)
  }, [reduced])
  useEffect(() => {
    const pause = () => { if (document.hidden) setRunning(false) }
    document.addEventListener('visibilitychange', pause)
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setRunning(false) })
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pause) }
  }, [])

  function play() {
    if (running) { setRunning(false); return }
    if (reduced) { setStage((s) => (s + 1) % 4); setStarted(true); return }
    if (!started || stage === 3) setStage(0)
    setStarted(true); setRunning(true)
  }
  return <div ref={ref} className="call-journey" id="call-example">
    <div className="journey-toolbar"><span className="micro-label"><i/>{t.demoLabel}</span><LanguageButtons value={demoLang} onChange={setDemoLang} label={lang === 'es' ? 'Idioma del ejemplo visual' : 'Visual example language'}/></div>
    <h2>{t.demoTitle}</h2>
    <div className="journey-layout">
      <div className="journey-stages">
        <svg className="journey-track" viewBox="0 0 4 300" preserveAspectRatio="none" aria-hidden="true"><path d="M2 0 V300"/><path className="journey-signal" d="M2 0 V300" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - stage / 3 }}/></svg>
        {t.steps.map((label, i) => <button type="button" key={label} className={`journey-step ${stage === i ? 'current' : ''} ${stage > i ? 'complete' : ''}`} aria-current={stage === i ? 'step' : undefined} onClick={() => { setStage(i); setRunning(false); setStarted(true) }}><span className="step-number">{stage > i ? '✓' : `0${i + 1}`}</span><span>{label}<small>{['INBOUND', 'EN / ES', 'CAPTURE', 'HANDOFF'][i]}</small></span><span className="step-arrow" aria-hidden="true">↗</span></button>)}
      </div>
      <div className="journey-scene" lang={demoLang}>
        <div className="scene-head"><span>AZUL / {String(stage + 1).padStart(2, '0')}</span><span>{d.sample}</span></div>
        <div key={`${stage}-${demoLang}`} className={`scene-content scene-${stage}`}>
          {stage === 0 && <div className="incoming-card"><div className={`phone-orbit ${running ? 'active' : ''}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m7 3 3 5-3 3a14 14 0 0 0 6 6l3-3 5 3c0 3-2 4-4 4C9 21 3 15 3 7c0-2 1-4 4-4Z"/></svg></div><p>{d.incoming}</p><h3>{d.caller}</h3><span className="sample-number">(305) 555-0123</span><div className="incoming-pill">→ {d.steps[1]}</div></div>}
          {stage === 1 && <div className="conversation-preview"><div className="chat-bubble assistant">{d.greeting}</div><div className="chat-bubble caller">{d.reply}</div><div className="chat-bubble assistant">{d.response}</div></div>}
          {stage === 2 && <div className="capture-preview"><span className="capture-mark">✓</span><h3>{d.steps[2]}</h3><dl>{d.labels.map((label, i) => <div key={label}><dt>{label}</dt><dd>{d.values[i]}</dd></div>)}</dl></div>}
          {stage === 3 && <div className="alert-preview"><div className="alert-envelope" aria-hidden="true">↗</div><small>{d.sent}</small><h3>{d.alert}</h3><p>{d.alertBody}</p><div className="alert-contact"><span className="alex-avatar">AR</span><span>Alex Rivera<strong>(305) 555-0123</strong></span><span aria-hidden="true">✓</span></div></div>}
        </div>
        <div className="scene-caption"><strong>{d.stageTitles[stage]}</strong><p>{d.stageNotes[stage]}</p></div>
      </div>
    </div>
    <div className="journey-bottom"><button type="button" className="exp-button exp-button-blue" onClick={play}>{reduced ? t.next : running ? t.pause : stage === 3 ? t.replay : started ? t.resume : t.play}<span aria-hidden="true">{running ? 'Ⅱ' : '→'}</span></button><p>{t.demoHint}</p></div>
  </div>
}

export function VoiceDemo({ lang }) {
  const t = experience[lang]
  const [voiceLang, setVoiceLang] = useState(lang)
  const d = experience[voiceLang]
  const [status, setStatus] = useState('idle')
  const [line, setLine] = useState(-1)
  const [error, setError] = useState('')
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const generation = useRef(0)
  const utteranceRef = useRef(null)
  const sectionRef = useRef(null)

  function stop() {
    generation.current += 1
    if (supported) window.speechSynthesis.cancel()
    utteranceRef.current = null
    setStatus('idle'); setLine(-1)
  }
  useEffect(() => {
    const stopHidden = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', stopHidden)
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop() })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      generation.current += 1
      if (supported) window.speechSynthesis.cancel()
      observer.disconnect(); document.removeEventListener('visibilitychange', stopHidden)
    }
  }, [supported])

  function play() {
    if (!supported) return
    const synth = window.speechSynthesis
    if (status === 'playing') { synth.pause(); setStatus('paused'); return }
    if (status === 'paused') { synth.resume(); setStatus('playing'); return }
    setError(''); synth.cancel()
    const id = ++generation.current
    setStatus('playing')
    const voices = synth.getVoices().filter((v) => v.lang.startsWith(voiceLang))
    function speak(index) {
      if (generation.current !== id) return
      if (index >= d.script.length) { setStatus('idle'); setLine(-1); return }
      const utterance = new SpeechSynthesisUtterance(d.script[index][1])
      utterance.lang = voiceLang === 'es' ? 'es-US' : 'en-US'
      if (voices.length) utterance.voice = voices[index % 2 === 0 ? 0 : Math.min(1, voices.length - 1)]
      utterance.rate = 0.98
      utterance.onstart = () => { if (generation.current === id) setLine(index) }
      utterance.onend = () => speak(index + 1)
      utterance.onerror = () => { if (generation.current === id) { setError(t.voiceError); setStatus('idle'); setLine(-1) } }
      utteranceRef.current = utterance
      synth.speak(utterance)
    }
    speak(0)
  }

  return <section className="voice-section" id="voice-demo" ref={sectionRef} aria-labelledby="voice-heading">
    <div className="exp-container voice-layout"><div className="voice-copy"><p className="micro-label">{t.voiceEyebrow}</p><h2 id="voice-heading" className="exp-heading">{t.voiceTitle}</h2><p className="exp-intro">{t.voiceIntro}</p><Waveform playing={status === 'playing'}/><div className="voice-controls"><LanguageButtons value={voiceLang} onChange={(next) => { stop(); setError(''); setVoiceLang(next) }} label={lang === 'es' ? 'Idioma de audio' : 'Audio language'}/><button type="button" className="exp-button exp-button-white" disabled={!supported} onClick={play}>{status === 'playing' ? t.voicePause : status === 'paused' ? t.voiceResume : t.voicePlay}<span aria-hidden="true">{status === 'playing' ? 'Ⅱ' : '▶'}</span></button>{status !== 'idle' && <button type="button" className="voice-stop" onClick={stop}>{t.voiceStop}</button>}</div><p className="voice-disclosure">{supported ? t.voiceDisclosure : t.voiceUnavailable}</p>{error && <p role="alert" className="voice-disclosure">{error}</p>}</div>
      <div className="voice-transcript" lang={voiceLang}><div className="transcript-heading"><span>{voiceLang === 'es' ? 'CONVERSACIÓN DE EJEMPLO' : 'SAMPLE CONVERSATION'}</span><span>EN / ES</span></div><ol>{d.script.map(([speaker, text], i) => <li key={`${voiceLang}-${i}`} className={`${i % 2 ? 'customer-line' : 'assistant-line'} ${line === i ? 'speaking' : ''}`}><span>{speaker}</span><p>{text}</p></li>)}</ol></div>
    </div>
  </section>
}
