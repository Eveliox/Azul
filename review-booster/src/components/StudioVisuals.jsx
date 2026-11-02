// Visual primitives copied from the public site's ServicesVisuals.jsx.
import { useId } from 'react'

export function PixelArrow() {
  return <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 1h3v3H4zm3 3h3v3H7zm3 3h3v3h-3zm-3 3h3v3H7zm-3 3h3v3H4z" /></svg>
}
export function WindowBar({ title, blue = false }) {
  return <div className={`lab-window-bar${blue ? ' is-blue' : ''}`}><span className="lab-window-controls" aria-hidden="true"><i>×</i><i>−</i><i>□</i></span><span>{title}</span><span className="lab-window-light" aria-hidden="true" /></div>
}
export function PixelField() {
  const id = useId().replace(/:/g, '')
  return <svg className="lab-pixels" aria-hidden="true" width="100%" height="100%"><defs><pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">{Array.from({length:64},(_,i)=><rect key={i} x={(i%8)*8} y={Math.floor(i/8)*8} width="8" height="8" fill={i%7===0?'#3154cf':i%3===0?'#8faaf5':'#d8e3ff'} opacity={((i*13)%9+1)/12}/>)}</pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`}/></svg>
}

