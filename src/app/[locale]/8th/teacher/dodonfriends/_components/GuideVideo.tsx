'use client'

import { useEffect, useRef } from 'react'

export default function GuideVideo({ url, title }: { url: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = videoRef.current
    return () => { video?.pause() }
  }, [])
  return <video ref={videoRef} src={url} controls controlsList="nodownload"
    playsInline preload="metadata" aria-label={title}>
    Your browser does not support video playback.
  </video>
}
