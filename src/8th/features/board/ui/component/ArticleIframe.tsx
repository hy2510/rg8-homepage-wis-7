'use client'

import { openWindow } from '@/8th/shared/utils/open-window'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function ArticleIframe({
  title = 'ReadingGate',
  url,
  initialHeight,
}: {
  title?: string
  url: string
  initialHeight: number
}) {
  const router = useRouter()

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(initialHeight)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'height') {
        setHeight(event.data.height)
      } else if (event.data?.type === 'scrollTo') {
        const windowBound = {
          left: window?.pageXOffset || 0,
          top: window?.pageYOffset || 0,
        }
        const iframeBound = iframeRef?.current?.getBoundingClientRect()

        const offsetX = windowBound.left + (iframeBound?.left || 0)
        // GHeader의 Position이 Fixed이므로 Y값을 해당(GHeader의 Height) 값만큼 빼주어야 함.
        const offsetY = windowBound.top + (iframeBound?.top || 0)

        const x = offsetX + (event.data?.x || 0)
        const y = offsetY + (event.data?.y || 0)
        window.scrollTo(x, y)
      } else if (event.data?.type === 'href' && event.data.href) {
        const link = event.data.href as string
        const isExternal = link.startsWith('http:') || link.startsWith('https:')
        if (isExternal) {
          openWindow(link, {
            target: '_blank',
            external: true,
          })
        } else {
          router.push(link)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  return (
    <div className="article-body">
      <iframe
        ref={iframeRef}
        className="article-frame"
        src={url}
        title={title}
        scrolling="no"
        style={{ height: `${height}px` }}
      />
    </div>
  )
}
