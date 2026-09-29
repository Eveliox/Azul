import { useId, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { ACCEPT_ATTRIBUTE, validateJobFile } from '../../lib/submitJobPosting'

function formatSize(bytes, lang) {
  const mb = bytes / (1024 * 1024)
  const format = new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', { maximumFractionDigits: mb < 1 ? 0 : 1 })
  return mb < 1 ? `${format.format(Math.max(1, bytes / 1024))} KB` : `${format.format(mb)} MB`
}

/**
 * Drag-and-drop or click-to-browse for one PDF, DOCX or TXT file up to 10 MB.
 * Controlled: the parent owns `file` and the error. `onError` receives
 * 'type', 'size' or null. The dashed border marches while a file is dragged over.
 */
export function FileDropzone({ file, onChange, error, onError }) {
  const { c, lang } = useLanguage()
  const t = c.agents.drawer.drop
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  const input = useRef(null)
  const hintId = useId()
  const errorId = useId()

  const accept = next => {
    if (!next) return
    const problem = validateJobFile(next)
    if (input.current) input.current.value = ''
    onError(problem)
    onChange(problem ? null : next)
  }
  const remove = () => {
    onChange(null)
    onError(null)
    requestAnimationFrame(() => input.current?.focus())
  }

  if (file) {
    return (
      <div className="dropzone-file">
        <span className="dropzone-file-type" aria-hidden="true">{file.name.split('.').pop().toUpperCase()}</span>
        <div><strong>{file.name}</strong><small>{formatSize(file.size, lang)}</small></div>
        <button type="button" onClick={remove} aria-label={`${t.remove}: ${file.name}`}>×</button>
      </div>
    )
  }

  return (
    <>
      <label
        className={`dropzone ${dragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`.trim()}
        onDragEnter={e => { e.preventDefault(); depth.current += 1; setDragging(true) }}
        onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
        onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setDragging(false) }}
        onDrop={e => { e.preventDefault(); depth.current = 0; setDragging(false); accept(e.dataTransfer.files[0]) }}
      >
        <svg className="dropzone-border" aria-hidden="true"><rect width="100%" height="100%" rx="4" /></svg>
        <input
          ref={input} className="sr-only" type="file" accept={ACCEPT_ATTRIBUTE}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId} aria-invalid={error ? true : undefined}
          onChange={e => accept(e.target.files[0])}
        />
        <span className="dropzone-icon" aria-hidden="true">↑</span>
        <strong>{t.title}</strong>
        <span>{t.or} <u>{t.browse}</u></span>
        <small id={hintId}>{t.hint}</small>
      </label>
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </>
  )
}
