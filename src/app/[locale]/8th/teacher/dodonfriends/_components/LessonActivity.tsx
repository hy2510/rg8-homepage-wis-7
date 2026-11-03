'use client'

import { useRef } from 'react'

export default function LessonActivity({
  title,
  url,
}: {
  title: string
  url: string
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  return (
    <iframe
      className="activity-frame"
      ref={frameRef}
      key={url}
      src={url}
      title={title}
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  )
}
