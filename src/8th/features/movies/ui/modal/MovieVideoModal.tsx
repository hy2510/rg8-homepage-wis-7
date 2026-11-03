'use client'

import { useLockBodyScroll } from '@/8th/application/context/ScrollLockContext'
import { Assets } from '@/8th/assets/asset-library'
import { useMovieWatchComplete } from '@/8th/features/movies/service/movie-query'
import VideoButton from '@/8th/features/myclass/ui/component/VideoButton'
import { MovieVideoModalStyle } from '@/8th/shared/styled/FeaturesStyled'
import ModalPortal from '@/8th/shared/ui/ModalPortal'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type MovieVideoModalProps = {
  categoryId: string
  movieId: string
  videoUrl: string
  currentPassCount?: number
  poster?: string
  subtitle?: string
  isPreview?: boolean
  onClose?: () => void
}

export default function MovieVideoModal({
  categoryId,
  movieId,
  videoUrl,
  currentPassCount = 0,
  poster,
  subtitle,
  isPreview = false,
  onClose,
}: MovieVideoModalProps) {
  useLockBodyScroll()

  const movieWatchComplete = useMovieWatchComplete({
    onSuccess: () => {
      setShowCompleteButton(true)
      setComplete(true)
    },
  })

  const [isComplete, setComplete] = useState(false)
  const [isShowCompleteButton, setShowCompleteButton] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }
    void video.play().catch(() => {})

    return () => {
      video.pause()
      video.currentTime = 0
    }
  }, [videoUrl])

  const onMovieReplay = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      void video.play().catch(() => {})
    }
  }

  const onMoviePlayComplete = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }
    if (isPreview) {
      return
    }
    if (movieWatchComplete.isPending || currentPassCount > 0) {
      setShowCompleteButton(true)
      return
    }
    if (!isComplete) {
      movieWatchComplete.mutate({
        categoryId,
        movieId,
        currentPassCount: currentPassCount,
      })
    }
  }

  return (
    <ModalPortal>
      <MovieVideoModalStyle role="dialog" aria-modal="true" onClick={onClose}>
        <div
          className="movie-video-modal-content"
          onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="movie-video-modal-close"
            aria-label="Close video"
            onClick={onClose}>
            <Image
              src={Assets.Icon.deleteWhite}
              alt=""
              width={32}
              height={32}
            />
          </button>
          <video
            ref={videoRef}
            poster={poster}
            controls
            playsInline
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            onEnded={() => {
              onMoviePlayComplete()
            }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
          {isShowCompleteButton && (
            <div className="complete-container">
              <div className="button-container">
                <VideoButton
                  label="Replay"
                  color="red"
                  icon={Assets.Icon.VideoComplete.replay}
                  onClick={() => {
                    setShowCompleteButton(false)
                    onMovieReplay()
                  }}
                />
                <VideoButton
                  label="Complete"
                  color="green"
                  icon={Assets.Icon.VideoComplete.complete}
                  onClick={() => {
                    if (onClose) {
                      onClose()
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </MovieVideoModalStyle>
    </ModalPortal>
  )
}
