import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query, fallback = false) {
  const subscribe = useCallback(onChange => {
    const media = window.matchMedia(query)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => fallback)
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'
export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION)
// True on mouse/trackpad devices. Cursor effects and heavy parallax use this.
export const useFinePointer = () => useMediaQuery(FINE_POINTER)
