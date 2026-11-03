'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import Image from 'next/image'

type MovieCardProps = {
  movieId: string
  title: string
  imagePath: string
  passCount: number
  rgPoint: number
  isNew?: boolean
  onClick?: () => void
}

export default function MovieCard({
  title,
  imagePath,
  passCount,
  onClick,
}: MovieCardProps) {
  const { loaded, markLoaded } = useThumbnailLoaded(imagePath)

  return (
    <div
      className="movie-card"
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={onClick}>
      <div className="movie-card-thumbnail">
        <div className="movie-card-thumbnail-media">
          <div
            className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
            aria-hidden
          />
          <Image
            src={imagePath}
            alt={title}
            fill
            sizes="(max-width: 480px) 100vw, 50vw"
            className={`thumbnail-img${loaded ? ' is-loaded' : ''}`}
            onLoad={markLoaded}
            onError={markLoaded}
          />
        </div>
        <div className="badges">
          {passCount === 1 && (
            <Image
              src={Assets.Icon.Study.checkMarkGold}
              alt="badge"
              width={40}
              height={40}
            />
          )}
          {passCount >= 2 && (
            <Image
              src={Assets.Icon.Study.checkMarkGoldTwin}
              alt="badge"
              width={70}
              height={40}
            />
          )}
        </div>
      </div>
    </div>
  )
}
