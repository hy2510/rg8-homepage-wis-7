'use client'

import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import { Assets } from '@/8th/assets/asset-library'
import { MyLessonBookItemStyle } from '@/8th/shared/styled/FeaturesStyled'
import { StartButton } from '@/8th/shared/ui/Buttons'
import NumberUtils from '@/util/number-utils'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import Image from 'next/image'

interface MyLessonBookItemProps {
  ref?: React.RefObject<HTMLDivElement | null>
  no: number
  title: string
  imgUrl: string
  passCount: number
  point: number
  isPassed: boolean
  activityType: string
  color?: string
  isCurrent?: boolean
  isMovieAvailable?: boolean
  isFullCardContent?: boolean
  onStart?: () => void
  onImageLoaded?: (isSuccess: boolean) => void
  onContentClick?: () => void
}

export default function MyLessonBookItem({
  ref,
  no,
  title,
  imgUrl,
  passCount,
  point,
  isPassed,
  activityType,
  color = '#2CB1BE',
  isCurrent,
  isMovieAvailable,
  isFullCardContent = false,
  onStart,
  onImageLoaded,
  onContentClick,
}: MyLessonBookItemProps) {
  const isPreK = true
  const preKCharacter = ''
  const isPhone = useIsPhone()

  const isCompleted = isPassed
  let pointText = `${NumberUtils.toDecimalPoint(point)}P`
  if (isCompleted) {
    pointText = 'Good Job 👍'
  }

  const { loaded, markLoaded } = useThumbnailLoaded(imgUrl)

  const handleImageLoad = () => {
    markLoaded()
    onImageLoaded?.(true)
  }
  const handleImageError = () => {
    markLoaded()
    onImageLoaded?.(false)
  }

  const onCardClick =
    isFullCardContent && !!onContentClick ? onContentClick : undefined
  const onContentsClick =
    !isFullCardContent && !!onContentClick ? onContentClick : undefined
  // const styleCursor = !!onContentClick ? { cursor: 'pointer' } : undefined

  return (
    <MyLessonBookItemStyle
      ref={ref}
      className={isCurrent ? 'current-book' : ''}
      isPreK={isPreK}
      isCurrent={isCurrent}
      isCompleted={isCompleted}
      color={color}>
      <div
        className={`book-container ${
          isPreK ? 'mobile-prek-container' : 'mobile-book-container'
        }`}
        style={{ cursor: !!onCardClick ? 'pointer' : 'default' }}
        onClick={onCardClick}>
        {passCount === 0 && <div className="book-number">{no}</div>}
        {passCount === 1 && <div className="completed-mark" />}
        {passCount >= 2 && <div className="completed-mark-twin" />}
        <div className={isPreK ? 'prek-thumbnail' : 'book-cover'}>
          <div
            style={{ cursor: !!onContentClick ? 'pointer' : 'default' }}
            className="image-wrapper"
            onClick={onContentsClick}>
            <div className="study-label">
              <span className="study-label-text">{activityType}</span>
              <div
                className={`study-label-bg${loaded ? ' is-loaded' : ''}`}
                style={{ backgroundImage: `url(${imgUrl})` }}
                aria-hidden
              />
            </div>
            <div
              className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
              aria-hidden
            />
            <Image
              src={imgUrl}
              alt="thumbnail"
              className={`image${loaded ? ' is-loaded' : ''}`}
              width={125}
              height={180}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {preKCharacter && (
              <Image
                src={getPreKCharacterBadgeAsset(preKCharacter)}
                className={'character'}
                alt={preKCharacter}
                width={42}
                height={42}
              />
            )}
            {isMovieAvailable && (
              <Image
                src={Assets.Icon.playRed}
                className={'movie-icon'}
                alt={'movie-icon'}
                width={42}
                height={42}
              />
            )}
          </div>
        </div>
        <div className="title-container">
          <div className="title-box">
            <div
              style={{ cursor: !!onContentClick ? 'pointer' : 'default' }}
              className="title"
              onClick={onContentsClick}>
              {title}
            </div>
            <div className={`point ${isCompleted ? 'good-job' : ''}`}>
              {pointText}
            </div>
          </div>
          <div>
            {isPhone ? (
              <></>
            ) : (
              <>
                {isCurrent && (
                  <StartButton onClick={onStart} className="animated" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {isPhone ? (
        <div style={{ width: '100%' }}>
          {isCurrent && (
            <StartButton
              onClick={onStart}
              isMobile
              className="mobile-animated mobile-activated"
            />
          )}
        </div>
      ) : (
        <></>
      )}
    </MyLessonBookItemStyle>
  )
}

function getPreKCharacterBadgeAsset(character: string) {
  const badge =
    Assets.DailyRG.Badge[character as keyof typeof Assets.DailyRG.Badge]
  return badge
}
