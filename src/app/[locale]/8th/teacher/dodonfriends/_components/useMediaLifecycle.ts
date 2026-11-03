'use client'

import { useEffect, type RefObject } from 'react'

/** Preserve video position. Cross-origin activities must reload until they expose a pause API. */
export function useMediaLifecycle(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    const suspended = new Map<HTMLIFrameElement, string>()
    const stop = () => {
      element?.querySelectorAll('video').forEach(video => video.pause())
      element?.querySelectorAll('iframe').forEach(frame => {
        if (!suspended.has(frame)) suspended.set(frame, frame.src)
        frame.src = 'about:blank'
      })
    }
    const restore = () => {
      suspended.forEach((src, frame) => { if (frame.isConnected) frame.src = src })
      suspended.clear()
    }
    const visibility = () => { if (document.hidden) stop(); else restore() }
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('pagehide', stop)
    window.addEventListener('pageshow', visibility)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('pagehide', stop)
      window.removeEventListener('pageshow', visibility)
      // Do not mutate iframe URLs during effect cleanup: React Strict Mode replays effects.
      element?.querySelectorAll('video').forEach(video => video.pause())
      restore()
    }
  }, [ref])
}
