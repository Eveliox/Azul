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
  const [open, setOpen] = useState(false)
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
    <div className="card mb-6">
      <button className="w-full flex items-center justify-between text-left" onClick={() => setOpen((v) => !v)}>
        <div>
          <h2 className="font-semibold">Messages</h2>
          <p className="text-xs text-ink-400 mt-0.5">What your customers receive. Edit the wording, then send yourself a test.</p>
        </div>
        <span className="text-ink-400 text-sm">{open ? 'Hide' : 'Edit'}</span>
      </button>

      {open && data && (
        <div className="mt-5 grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs text-ink-400 mr-1">Start from</span>
              {Object.entries(data.presets).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => loadPreset(k)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    tone === k ? 'bg-azul-blue/20 border-azul-light text-white' : 'border-ink-700 text-ink-300 hover:border-ink-500'
                  }`}
                >{v.label}</button>
              ))}
              <div className="ml-auto flex rounded-lg border border-ink-700 overflow-hidden text-xs">
                {['en', 'es'].map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 ${lang === l ? 'bg-ink-700 text-white' : 'text-ink-400 hover:text-white'}`}>
                    {l === 'en' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[11px] text-ink-500 mr-1">Insert</span>
              {PLACEHOLDERS.map((p) => (
                <button key={p} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(p)}
                  className="font-mono text-[11px] px-2 py-0.5 rounded bg-ink-800 text-ink-200 hover:bg-ink-700">{p}</button>
              ))}
            </div>

            {SECTIONS.map((sec) => (
              <div key={sec.title} className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
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
                          <label className="label mb-0">{f.label}</label>
                          {seg && (
                            <span className={`text-[11px] ${bad ? 'text-red-400' : seg.segments > 1 ? 'text-amber-400' : 'text-ink-500'}`}>
                              {bad ? 'Missing {link}' : `${seg.chars} chars · ${seg.segments} ${seg.segments === 1 ? 'text' : 'texts'}${seg.unicode ? ' · accents count double' : ''}`}
                            </span>
                          )}
                        </div>
                        <Tag
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

            {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn-primary" disabled={!dirty || busy || missingLink.length > 0} onClick={save}>
                {busy === 'save' ? 'Saving…' : 'Save messages'}
              </button>
              <button className="btn-ghost" disabled={busy} onClick={sendTest}>
                {busy === 'test' ? 'Sending…' : `Send me a test (${lang === 'en' ? 'English' : 'Español'})`}
              </button>
              {dirty && <button className="text-xs text-ink-400 hover:text-white ml-1" onClick={() => setDraft(saved)}>Discard changes</button>}
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

  return (
    <div className="space-y-4 lg:sticky lg:top-6 self-start">
      <p className="text-[11px] uppercase tracking-[0.14em] text-ink-500">Preview · {which === 'followup' ? 'reminder' : 'first message'}</p>

      <div className="rounded-[26px] border border-ink-700 bg-black p-3 shadow-card">
        <div className="mx-auto w-20 h-1.5 rounded-full bg-ink-700 mb-3" />
        <div className="text-center mb-3">
          <div className="w-8 h-8 rounded-full bg-ink-600 mx-auto mb-1 flex items-center justify-center text-[11px] font-semibold text-ink-200">{business.slice(0, 1)}</div>
          <p className="text-[11px] text-ink-300 truncate px-2">{business}</p>
        </div>
        <div className="flex">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-[#26252A] text-[13px] leading-snug text-white px-3 py-2 whitespace-pre-wrap break-words">
            {renderLink(sms)}
          </div>
        </div>
        <p className="text-[10px] text-ink-500 mt-2 text-center">Text message</p>
      </div>

      <div className="rounded-xl border border-ink-700 bg-white text-gray-900 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-500">From <span className="text-gray-700">Azul Reviews</span></p>
          <p className="text-sm font-semibold truncate">{subject || <span className="text-gray-300">Subject</span>}</p>
        </div>
        <div className="px-4 py-4 text-[13px] leading-relaxed">
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
