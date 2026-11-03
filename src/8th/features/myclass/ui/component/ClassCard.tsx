'use client'

import { Assets } from '@/8th/assets/asset-library'
import { ClassCardStyle } from '@/8th/shared/styled/FeaturesStyled'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import Image from 'next/image'
import { useState } from 'react'

type ClassCardProps = {
  id: string
  title: string
  characterImagePath: string
  inProgressCharacterImagePath?: string
  completeCharacterImagePath?: string
  completedCount: number
  totalCount: number
  description: string
  bookCoverImage1: string
  bookCoverImage2: string
  onClick?: () => void
}

export default function ClassCard({
  title,
  characterImagePath,
  inProgressCharacterImagePath,
  completeCharacterImagePath,
  completedCount,
  totalCount,
  description,
  bookCoverImage1,
  bookCoverImage2,
  onClick,
}: ClassCardProps) {
  const isCompleted = totalCount > 0 && completedCount === totalCount
  const isClickable = !!onClick

  let characterImage = characterImagePath
  if (isCompleted) {
    if (completeCharacterImagePath) {
      characterImage = completeCharacterImagePath
    }
  } else if (completedCount > 0) {
    if (inProgressCharacterImagePath) {
      characterImage = inProgressCharacterImagePath
    }
  }
  return (
    <ClassCardStyle
      isCompleted={isCompleted}
      $interactive={isClickable}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      role={isClickable ? 'link' : undefined}
      tabIndex={isClickable ? 0 : undefined}>
      {isCompleted && (
        <Image
          className="completed-check"
          src={Assets.Icon.Study.checkMarkGold}
          alt=""
          width={40}
          height={40}
        />
      )}
      <div className="class-info">
        <div className="character-image">
          <Image src={characterImage} alt="" width={100} height={100} />
        </div>
        <div className="content">
          <div className="title">{title}</div>
          <div className="count">
            {completedCount}/{totalCount}
          </div>
          <div className="description">{description}</div>
        </div>
      </div>
      <div className="book-image">
        <div className="book-stack">
          <div className="book-stack-spacer" aria-hidden />
          <BookCoverLayer variant="back" src={bookCoverImage2} alt="" />
          <BookCoverLayer variant="front" src={bookCoverImage1} alt="" />
        </div>
      </div>
    </ClassCardStyle>
  )
}

function BookCoverLayer({
  variant,
  src,
  alt,
}: {
  variant: 'back' | 'front'
  src: string
  alt: string
}) {
  const { loaded, markLoaded } = useThumbnailLoaded(src)
  const [aspectRatio, setAspectRatio] = useState('5 / 7')

  const coverWidthPx = variant === 'back' ? 88 : 98

  return (
    <div className={`book-card book-card--${variant}`}>
      <div className="book-cover-wrap" style={{ aspectRatio }}>
        <div
          className={`book-cover-skeleton-slot${loaded ? ' is-done' : ''}`}
          aria-hidden
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${coverWidthPx}px`}
          className={`book-cover-img${loaded ? ' is-loaded' : ''}`}
          style={{ objectFit: 'contain' }}
          onLoad={(event) => {
            markLoaded()
            const img = event.currentTarget
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`)
            }
          }}
          onError={markLoaded}
        />
      </div>
    </div>
  )
}
