'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

export default function LottiePlayer({
  path,
  width = 100,
  height = 100,
}: {
  path: string
  width?: number
  height?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let removed = false
    let animation: { destroy: () => void } | undefined

    const run = async () => {
      while (!(window as any).lottie) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        if (removed) return
      }
      const response = await fetch(path)
      const text = await response.text()
      const animationData = path.endsWith('.js')
        ? JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
        : JSON.parse(text)
      if (removed) return
      animation = (window as any).lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      })
    }

    run()
    return () => {
      removed = true
      animation?.destroy()
    }
  }, [path])

  return (
    <>
      <Script
        src="/src/lottie/lottie.min.js"
        strategy="afterInteractive"
      />
      <div ref={containerRef} style={{ width, height }} />
    </>
  )
}
