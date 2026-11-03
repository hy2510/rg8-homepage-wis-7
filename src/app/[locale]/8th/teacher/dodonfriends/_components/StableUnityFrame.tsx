'use client'

import { useEffect, useRef, useState } from 'react'

export default function StableUnityFrame({ url, title }: { url?: string; title: string }) {
  const container = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / 1280, entry.contentRect.height / 720))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={container} className="unity-stable-container">
    <iframe src={url} title={title} width={1280} height={720} allow="autoplay; fullscreen" allowFullScreen
      style={{ transform: `translate(-50%, -50%) scale(${scale})` }} />
  </div>
}
