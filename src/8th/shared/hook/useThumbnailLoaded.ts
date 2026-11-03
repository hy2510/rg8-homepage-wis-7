'use client'

import { useCallback, useEffect, useState } from 'react'

const LOAD_FALLBACK_MS = 8000

type ThumbnailSrc = string | { src: string } | undefined | null

function getSrcKey(src: ThumbnailSrc): string {
  if (!src) return ''
  return typeof src === 'string' ? src : src.src
}

export function useThumbnailLoaded(src: ThumbnailSrc) {
  const srcKey = getSrcKey(src)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const loaded = !srcKey || loadedSrc === srcKey

  const markLoaded = useCallback(() => {
    if (!srcKey) return
    setLoadedSrc(srcKey)
  }, [srcKey])

  useEffect(() => {
    if (!srcKey || loaded) return
    const timer = window.setTimeout(markLoaded, LOAD_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [srcKey, loaded, markLoaded])

  return { loaded, markLoaded }
}
