import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api.js'

const PLACEHOLDERS = ['{first_name}', '{name}', '{business}', '{link}']
const SAMPLE = { customer: 'Maria Lopez', business: null, link: 'https://reviews.azulwebdev.com/r/a8Kx2q' }

const SECTIONS = [
  { title: 'First message', hint: 'Sent after the visit, once the delay has passed.', fields: [
    { key: 'sms', label: 'Text message', kind: 'sms' },
    { key: 'emailSubject', label: 'Email subject', kind: 'line' },
    { key: 'emailBody', label: 'Email body', kind: 'text' },
    { key: 'emailCta', label: 'Email button', kind: 'line' },
  ]},
  { title: 'Reminder', hint: 'One follow-up if they never tapped the link.', fields: [
    { key: 'followupSms', label: 'Text message', kind: 'sms' },
    { key: 'followupEmailSubject', label: 'Email subject', kind: 'line' },
    { key: 'followupEmailBody', label: 'Email body', kind: 'text' },
  ]},
]

const first = (n) => n.split(' ')[0]
export function fill(text, business) {
  return (text || '')
    .replaceAll('{first_name}', first(SAMPLE.customer))
    .replaceAll('{name}', SAMPLE.customer)
    .replaceAll('{business}', business)
    .replaceAll('{link}', SAMPLE.link)
}

// GSM-7 fits 160 chars per segment; any non-GSM char (accents, emoji) drops it to 70.
function smsSegments(text) {
  const gsm = /^[A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\[~\]|€]*$/
  const per = gsm.test(text) ? 160 : 70
  const multi = per === 160 ? 153 : 67
  const n = text.length
  return { chars: n, segments: n <= per ? 1 : Math.ceil(n / multi), unicode: per === 70 }
}

export default function MessagesPanel({ clientId, business, notify }) {
  const [data, setData] = useState(null)
  const [lang, setLang] = useState('en')
  const [tone, setTone] = useState('friendly')
  const [draft, setDraft] = useState({ en: {}, es: {} })
  const [saved, setSaved] = useState({ en: {}, es: {} })
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')
  const [focus, setFocus] = useState('sms')
  const refs = useRef({})

  useEffect(() => {
    api(`/api/messages?client_id=${clientId}`).then((d) => {
      setData(d); setTone(d.tone); setDraft(d.current); setSaved(d.current)
    }).catch((e) => setErr(e.message))
  }, [clientId])

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const m = draft[lang] || {}
  const set = (k, v) => setDraft({ ...draft, [lang]: { ...m, [k]: v } })

  function loadPreset(t) {
    setTone(t)
    setDraft({ en: { ...data.presets[t].en }, es: { ...data.presets[t].es } })
  }

  function insert(ph) {
    const el = refs.current[focus]
    if (!el) return
    const { selectionStart: a, selectionEnd: b, value } = el
    const next = value.slice(0, a) + ph + value.slice(b)
    set(focus, next)
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + ph.length, a + ph.length) })
  }

  async function save() {
    setBusy('save'); setErr('')
    try {
      const d = await api(`/api/messages?client_id=${clientId}`, { method: 'PUT', body: { tone, messages: draft } })
      setDraft(d.current); setSaved(d.current); notify('Messages saved.')
    } catch (e) { setErr(e.message) } finally { setBusy('') }
  }

  async function sendTest() {
    setBusy('test'); setErr('')
    try {
      const d = await api(`/api/messages?client_id=${clientId}&test=1`, { method: 'POST', body: { language: lang, tone, messages: draft } })
      notify(`Test email sent to ${d.email}.${d.sms ? ' Text sent too.' : ''}`)
    } catch (e) { setErr(e.message) } finally { setBusy('') }
  }

  const missingLink = ['sms', 'followupSms'].filter((k) => m[k] && !m[k].includes('{link}'))
  const previewField = focus.startsWith('followup') ? 'followup' : 'first'

  return (
    <div className="messages-panel">
      <div className="mb-5">
        <h2 className="text-base font-semibold">Messages</h2>
        <p className="text-xs text-ink-400 mt-1">This is exactly what your customers receive. Change the wording, then send yourself a test.</p>
      </div>

      {!data && !err && <p className="text-sm text-ink-500" role="status">Loading…</p>}
      {!data && err && <p className="error-banner" role="alert">{err}</p>}
      {data && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <p className="eyebrow mb-2">Start from a template</p>
                <div className="inline-flex rounded-lg bg-ink-950 border border-ink-800 p-0.5">
                  {Object.entries(data.presets).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => loadPreset(k)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        tone === k ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-400 hover:text-ink-100'
                      }`}
                    >{v.label}</button>
                  ))}
                </div>
              </div>
              <div className="inline-flex rounded-lg bg-ink-950 border border-ink-800 p-0.5">
                {['en', 'es'].map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${lang === l ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-400 hover:text-ink-100'}`}>
                    {l === 'en' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px] text-ink-500">
              <span className="mr-1">Insert into the field you're editing:</span>
              {PLACEHOLDERS.map((p) => (
                <button key={p} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(p)} className="kbd hover:border-ink-500 hover:text-ink-100">{p}</button>
              ))}
            </div>

            {SECTIONS.map((sec) => (
              <div key={sec.title} className="mb-6 pt-5 border-t border-ink-800 first:border-0 first:pt-0">
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-sm font-semibold">{sec.title}</h3>
                  <span className="text-xs text-ink-500">{sec.hint}</span>
                </div>
                <div className="space-y-3">
                  {sec.fields.map((f) => {
                    const v = m[f.key] || ''
                    const seg = f.kind === 'sms' ? smsSegments(fill(v, business)) : null
                    const bad = f.kind === 'sms' && v && !v.includes('{link}')
                    const Tag = f.kind === 'text' || f.kind === 'sms' ? 'textarea' : 'input'
                    return (
                      <div key={f.key}>
                        <div className="flex justify-between items-baseline mb-1">
                          <label className="label mb-0" htmlFor={`message-${f.key}`}>{f.label}</label>
                          {seg && (
                            <span className={`text-[11px] ${bad ? 'text-red-400' : seg.segments > 1 ? 'text-amber-400' : 'text-ink-500'}`}>
                              {bad ? 'Missing {link}' : `${seg.chars} chars · ${seg.segments} ${seg.segments === 1 ? 'text' : 'texts'}${seg.unicode ? ' · accents count double' : ''}`}
                            </span>
                          )}
                        </div>
                        <Tag
                          id={`message-${f.key}`}
                          ref={(el) => (refs.current[f.key] = el)}
                          className={`input ${Tag === 'textarea' ? (f.kind === 'text' ? 'min-h-[110px]' : 'min-h-[72px]') + ' resize-y' : ''} ${bad ? 'border-red-500/60' : ''}`}
                          value={v}
                          onFocus={() => setFocus(f.key)}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
            <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-ink-800">
              <button className="btn-primary" disabled={!dirty || busy || missingLink.length > 0} onClick={save}>
                {busy === 'save' ? 'Saving…' : 'Save changes'}
              </button>
              <button className="btn-ghost" disabled={busy} onClick={sendTest}>
                {busy === 'test' ? 'Sending…' : `Email me a test · ${lang === 'en' ? 'EN' : 'ES'}`}
              </button>
              <span className="text-xs text-ink-500 ml-auto">
                {dirty ? <button className="hover:text-ink-200" onClick={() => setDraft(saved)}>Discard changes</button> : 'All changes saved'}
              </span>
            </div>
          </div>

          <Preview m={m} business={business} which={previewField} />
        </div>
      )}
    </div>
  )
}

function Preview({ m, business, which }) {
  const sms = fill(which === 'followup' ? m.followupSms : m.sms, business)
  const subject = fill(which === 'followup' ? m.followupEmailSubject : m.emailSubject, business)
  const body = fill(which === 'followup' ? m.followupEmailBody : m.emailBody, business)
  const cta = fill(m.emailCta, business)
  const paragraphs = useMemo(() => body.split(/\n{2,}/), [body])
  const now = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="space-y-5 xl:sticky xl:top-20 self-start min-w-0">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Preview</p>
        <span className="text-[11px] text-ink-500">{which === 'followup' ? 'Reminder' : 'First message'}</span>
      </div>

      <div className="mx-auto w-[260px] max-w-full rounded-[36px] border-[6px] border-ink-800 bg-black overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,.12)]">
        <div className="relative pt-3 pb-2 border-b border-white/10 bg-[#1C1C1E]">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-20 h-5 rounded-full bg-black" />
          <div className="flex justify-between px-5 text-[10px] text-white/90 font-medium mb-3"><span>{now}</span><span>●●●</span></div>
          <div className="text-center px-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#8E8E93] to-[#636366] mx-auto mb-1 flex items-center justify-center text-[13px] font-semibold text-white">{business.slice(0, 1)}</div>
            <p className="text-[10px] text-white/80 truncate">{business}</p>
          </div>
        </div>
        <div className="px-3 pt-4 pb-6 min-h-[170px]">
          <p className="text-[9px] text-white/40 text-center mb-2">Text Message · {now}</p>
          <div className="flex">
            <div className="max-w-[92%] rounded-[18px] rounded-bl-[4px] bg-[#26252A] text-[12.5px] leading-[1.35] text-white px-3 py-2 whitespace-pre-wrap break-words">
              {renderLink(sms)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-ink-800 bg-white text-gray-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-500 leading-tight">Azul Reviews <span className="text-gray-400">· reviews@azulwebdev.com</span></p>
            <p className="text-[13px] font-semibold truncate leading-snug mt-0.5">{subject || <span className="text-gray-300">Subject</span>}</p>
          </div>
        </div>
        <div className="px-4 py-4 text-[12.5px] leading-relaxed">
          {paragraphs.map((p, i) => <p key={i} className="mb-3 whitespace-pre-wrap">{p}</p>)}
          <span className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">{cta || 'Button'}</span>
          <p className="text-[10px] text-gray-400 mt-3 break-all">Or copy this link: {SAMPLE.link}</p>
        </div>
      </div>
    </div>
  )
}

function renderLink(text) {
  const parts = text.split(SAMPLE.link)
  return parts.flatMap((p, i) => i < parts.length - 1
    ? [p, <span key={i} className="underline text-[#6AB0FF]">{SAMPLE.link}</span>]
    : [p])
}
