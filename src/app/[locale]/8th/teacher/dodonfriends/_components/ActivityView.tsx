'use client'

import { useEffect, useRef, useState } from 'react'
import getTeacherStudyUrl from '../_data/get-teacher-study'

export default function ActivityView({
  id,
  type,
  uri,
  title,
  extra,
  language,
}: {
  id: string
  type: string
  uri: string
  title: string
  extra?: string
  language?: string
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [contentUrl, setContentUrl] = useState(type === 'hidodo' ? uri : '')
  const key = JSON.stringify(['activity', id, uri, type])

  useEffect(() => {
    if (type === 'prek' || type === 'reading') {
      const bookCode = uri
      const url = getTeacherStudyUrl({
        type: type,
        uri: bookCode,
        extra: extra,
        language: language,
      })
      setContentUrl(url)
    } else {
      setContentUrl(uri)
    }
  }, [type, uri, extra, language])

  return (
    <iframe
      className="activity-frame"
      ref={frameRef}
      key={key}
      src={contentUrl}
      title={title}
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  )
}
