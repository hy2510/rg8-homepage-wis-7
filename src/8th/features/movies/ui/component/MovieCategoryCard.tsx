'use client'

import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import Image from 'next/image'

export interface MovieCategoryCardProps {
  categoryId: string
  title: string
  imagePath: string
  contentsCount: number
  completeCount: number
  isNew?: boolean
  onClick?: () => void
}

export default function MovieCategoryCard({
  title,
  imagePath,
  onClick,
}: MovieCategoryCardProps) {
  const { loaded, markLoaded } = useThumbnailLoaded(imagePath)

  return (
    <button
      className="movie-card"
      type="button"
      aria-label={title}
      onClick={onClick}>
      <div
        className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
        aria-hidden
      />
      <Image
        className={`movie-card-image thumbnail-img${loaded ? ' is-loaded' : ''}`}
        src={imagePath}
        alt=""
        fill
        sizes="(max-width: 480px) 50vw, 33vw"
        onLoad={markLoaded}
        onError={markLoaded}
      />
    </button>
  )
}
