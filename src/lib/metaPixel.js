// Meta Pixel for azulwebdev.com. Only loads after the visitor accepts optional
// analytics in the cookie banner, matching the privacy policy at /privacy.
// Set VITE_META_PIXEL_ID in Vercel to activate.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID

function hasAnalyticsConsent() {
  try { return JSON.parse(localStorage.getItem('azul-cookies'))?.analytics === true } catch { return false }
}

function loadPixel() {
  if (window.fbq) return
  const f = window
  f.fbq = function () { f.fbq.callMethod ? f.fbq.callMethod.apply(f.fbq, arguments) : f.fbq.queue.push(arguments) }
  if (!f._fbq) f._fbq = f.fbq
  f.fbq.push = f.fbq; f.fbq.loaded = true; f.fbq.version = '2.0'; f.fbq.queue = []
  const s = document.createElement('script')
  s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
  window.fbq('init', PIXEL_ID)
}

export function useMetaPixel() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!PIXEL_ID) return
    function fire() {
      if (!hasAnalyticsConsent()) return
      loadPixel()
      window.fbq('track', 'PageView')
    }
    fire()
    function onConsent(event) { if (event.detail?.analytics) fire() }
    window.addEventListener('azul:consent', onConsent)
    return () => window.removeEventListener('azul:consent', onConsent)
  }, [pathname])
}
