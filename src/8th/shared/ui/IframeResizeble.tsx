'use client'

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'

/** scrollHeight 측정 시 미세 스크롤 오차 보정 */
const HEIGHT_SAFETY_BUFFER = 2

function measureBodyScrollHeight(iframe: HTMLIFrameElement): number {
  const win = iframe.contentWindow
  const body = win?.document.body
  if (!body || !win) return 0

  const style = win.getComputedStyle(body)
  const marginTop = parseFloat(style.marginTop) || 0
  const marginBottom = parseFloat(style.marginBottom) || 0

  return Math.ceil(body.scrollHeight + marginTop + marginBottom)
}

type IframeResizebleProps = {
  src: string
  /** true: 콘텐츠 scrollHeight에 맞춰 height 설정 */
  fitContentHeight?: boolean
  className?: string
  style?: CSSProperties
}

export default function IframeResizeble({
  src,
  fitContentHeight = false,
  className,
  style,
}: IframeResizebleProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  const measure = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const nextHeight = measureBodyScrollHeight(iframe)
    if (nextHeight > 0) {
      setContentHeight((prev) => Math.max(prev, nextHeight))
    }
  }, [])

  const onLoad = useCallback(() => {
    if (!fitContentHeight) return

    measure()

    const doc = iframeRef.current?.contentWindow?.document
    if (!doc) return

    doc.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', measure, { once: true })
      }
    })

    doc.fonts?.ready.then(measure)
  }, [fitContentHeight, measure])

  useEffect(() => {
    if (!fitContentHeight) return
    setContentHeight(0)
  }, [src, fitContentHeight])

  const fitContentStyle: CSSProperties | undefined = fitContentHeight
    ? {
        flex: 'none',
        height:
          contentHeight > 0
            ? `${contentHeight + HEIGHT_SAFETY_BUFFER}px`
            : '1px',
      }
    : undefined

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className={className}
      scrolling={fitContentHeight ? 'no' : undefined}
      onLoad={onLoad}
      style={{
        border: 'none',
        display: 'block',
        ...style,
        ...fitContentStyle,
      }}
    />
  )
}
