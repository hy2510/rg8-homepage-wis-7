'use client'

import { Gap } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import { useRef, useState } from 'react'
import CarouselControls from './CarouselControls'

export default function ExperienceVideos({
  videos,
}: {
  videos: { id: string; url: string; title: string; thumbnail: string }[]
}) {
  const count = videos.length
  if (count === 0) return null

  return <VideoContainer videos={videos} count={count} />
}
function VideoContainer({
  videos,
  count,
}: {
  videos: { id: string; url: string; title: string; thumbnail: string }[]
  count: number
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const boundRef = useRef(false)
  const current = videos[index]
  const previous = videos[(index - 1 + count) % count]
  const next = videos[(index + 1) % count]
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const baseEmbedSrc = `${current.url}${
    origin ? `&origin=${encodeURIComponent(origin)}` : ''
  }`
  const embedSrc = `${baseEmbedSrc}${autoplay ? '&autoplay=1' : ''}`

  const changeVideo = (nextIndex: number) => {
    boundRef.current = false
    setPlaying(true)
    setAutoplay(true)
    setIndex(nextIndex)
  }

  const goNext = () => changeVideo((index + 1) % count)
  const goPrev = () => changeVideo((index - 1 + count) % count)

  const togglePlayback = () => {
    const iframe = iframeRef.current
    if (!playing) {
      if (!autoplay) {
        if (iframe) iframe.src = `${baseEmbedSrc}&autoplay=1`
        setAutoplay(true)
      } else {
        commandYoutube(iframe, 'playVideo')
      }
      setPlaying(true)
      return
    }
    commandYoutube(iframe, 'pauseVideo')
    setPlaying(false)
  }

  const onIframeLoad = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    sendYoutubeCommand(iframe, 'listening')
    if (boundRef.current) return
    boundRef.current = true
    bindYoutubePlayer(iframe)
  }

  return (
    <>
      <section className="section">
        <h2 className="section-title">{t('t8th0302')}</h2>
        <div className="panel ebook-panel">
          <button
            type="button"
            className="side-book"
            onClick={goPrev}
            aria-label={t('t8th0303')}
            style={{
              backgroundImage: `url(${previous.thumbnail})`,
            }}
          />
          <div className="main-book">
            <div className="video-frame">
              {autoplay && (
                <iframe
                  key={current.id}
                  id={`hp-review-player-${current.id}`}
                  ref={iframeRef}
                  src={embedSrc}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={onIframeLoad}
                />
              )}
              <button
                type="button"
                className="video-shield"
                aria-label={playing ? t('t8th0304') : t('t8th0305')}
                onClick={togglePlayback}
                style={
                  !autoplay
                    ? {
                        backgroundImage: `url(${current.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }>
                {!autoplay && (
                  <span className="review-play-icon" aria-hidden="true">
                    ▶
                  </span>
                )}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="side-book"
            onClick={goNext}
            aria-label={t('t8th0306')}
            style={{
              backgroundImage: `url(https://i.ytimg.com/vi/${next.id}/hqdefault.jpg)`,
            }}
          />
          <strong>{current.title}</strong>
          <CarouselControls
            index={index}
            size={count}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>
      </section>
      <Gap size={80} />
    </>
  )
}

function sendYoutubeCommand(
  iframe: HTMLIFrameElement | null,
  func: 'playVideo' | 'pauseVideo' | 'listening',
) {
  const payload =
    func === 'listening'
      ? { event: 'listening', id: 1 }
      : { event: 'command', func, args: [] }
  iframe?.contentWindow?.postMessage(JSON.stringify(payload), '*')
}

function loadYoutubeApi() {
  if (document.getElementById('youtube-iframe-api')) return
  const tag = document.createElement('script')
  tag.id = 'youtube-iframe-api'
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
}

type YoutubeCommand = 'playVideo' | 'pauseVideo'
type YoutubeWidget = {
  playVideo?: () => void
  pauseVideo?: () => void
  sendMessage?: (message: {
    event: string
    func: string
    args: unknown[]
  }) => void
}

type YoutubeApi = {
  Player: new (
    element: HTMLElement | string,
    options?: {
      events?: { onReady?: (event: { target: YoutubeWidget }) => void }
    },
  ) => YoutubeWidget
  get?: (id: string) => YoutubeWidget
}

function getYoutubeApi() {
  return (window as Window & { YT?: YoutubeApi }).YT
}

function bindYoutubePlayer(iframe: HTMLIFrameElement) {
  loadYoutubeApi()
  let created = false
  const tryBind = () => {
    const YT = getYoutubeApi()
    if (!YT?.Player || created) return !!created
    if (!iframe.id) iframe.id = 'hp-review-player'
    created = true
    new YT.Player(iframe.id)
    return true
  }
  if (tryBind()) return
  const timer = window.setInterval(() => {
    if (tryBind()) window.clearInterval(timer)
  }, 80)
  window.setTimeout(() => window.clearInterval(timer), 8000)
}

function commandYoutube(
  iframe: HTMLIFrameElement | null,
  func: YoutubeCommand,
) {
  const id = iframe?.id || 'hp-review-player'
  const widget = getYoutubeApi()?.get?.(id)
  if (func === 'playVideo' && widget?.playVideo) {
    widget.playVideo()
    return
  }
  if (func === 'pauseVideo' && widget?.pauseVideo) {
    widget.pauseVideo()
    return
  }
  if (widget?.sendMessage) {
    widget.sendMessage({ event: 'command', func, args: [] })
    return
  }
  sendYoutubeCommand(iframe, 'listening')
  sendYoutubeCommand(iframe, func)
}
