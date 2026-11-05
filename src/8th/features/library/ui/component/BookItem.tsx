'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useClipBoard } from '@/8th/shared/hook/useClipBoard'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import { BookItemStyle } from '@/8th/shared/styled/FeaturesStyled'
import CustomCheckbox from '@/8th/shared/ui/CustomCheckbox'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'

/**
 * 도서 표지 및 기타정보
 */

export interface BookItemProps {
  title: string
  isLandscape?: boolean
  passCount: number
  point: number
  addYn: boolean
  movieYn: boolean
  src: string
  levelName: string
  recommendedAge: string
  displayDate?: string
  homeworkYn?: boolean
  isCheckable?: boolean
  isChecked?: boolean
  isDisabled?: boolean
  isInProgressInTodo?: boolean
  isGrayscale?: boolean
  onClick?: () => void
}

export default function BookItem({
  title,
  isLandscape = false,
  passCount,
  point,
  addYn,
  movieYn,
  src,
  levelName,
  recommendedAge,
  displayDate,
  homeworkYn,
  isCheckable,
  isChecked,
  isDisabled,
  isInProgressInTodo,
  isGrayscale,
  onClick,
}: BookItemProps) {
  const { isCopied, doCopyToClipboard } = useClipBoard()
  const { loaded, markLoaded } = useThumbnailLoaded(src)

  let recommendAge: 'Teen' | 'Adult' | undefined = undefined
  if (recommendedAge === 'B') {
    recommendAge = 'Teen'
  } else if (recommendedAge === 'C') {
    recommendAge = 'Adult'
  }

  return (
    <>
      <BookItemStyle level={'level'} className={isLandscape ? 'is-landscape' : undefined}>
        <div
          className="book-cover-container"
          onClick={() => {
            if (onClick) {
              onClick()
            }
          }}>
          <div className="book-cover-wrapper">
            <div className="book-cover-media">
              <div
                className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
                aria-hidden
              />
              <Image
                src={src}
                alt="book"
                width={isLandscape ? 320 : 140}
                height={isLandscape ? 180 : 200}
                className={`book-cover thumbnail-img${loaded ? ' is-loaded' : ''}`}
                style={{
                  filter: isGrayscale ? 'grayscale(100%)' : 'none',
                }}
                onLoad={markLoaded}
                onError={markLoaded}
              />
            </div>
            {isCheckable && (
              <div
                className={`check-box-position ${!isDisabled ? 'animate__animated animate__bounce' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isDisabled) {
                    return
                  }
                  if (onClick) {
                    onClick()
                  }
                }}>
                <CustomCheckbox
                  id="book-item-checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={(checked) => {
                    if (isDisabled) {
                      return
                    }
                    if (onClick) {
                      onClick()
                    }
                  }}
                />
              </div>
            )}
            <div className="badges">
              {/* To-Do에 추가된 도서 */}
              {homeworkYn && (
                <Image
                  src={Assets.Icon.Study.homeworkMark}
                  alt="badge"
                  width={40}
                  height={40}
                />
              )}
              {isInProgressInTodo ? (
                <Image
                  src={Assets.Icon.Study.inProgressMarkInTodo}
                  alt="badge"
                  width={40}
                  height={40}
                />
              ) : (
                addYn && (
                  <Image
                    src={Assets.Icon.Study.inProgressMark}
                    alt="badge"
                    width={40}
                    height={40}
                  />
                )
              )}
              {/* 1회차 완료시 */}
              {passCount === 1 && (
                <Image
                  src={Assets.Icon.Study.checkMarkGold}
                  alt="badge"
                  width={40}
                  height={40}
                />
              )}
              {/* 2회 이상 완료시 */}
              {passCount >= 2 && (
                <Image
                  src={Assets.Icon.Study.checkMarkGoldTwin}
                  alt="badge"
                  width={70}
                  height={40}
                />
              )}
            </div>
            {movieYn && (
              <div className="movie-icon">
                <Image
                  src={Assets.Icon.playRed}
                  alt="badge"
                  width={40}
                  height={40}
                />
              </div>
            )}
            {recommendAge && (
              <div className="age-label">
                <span className="text">{recommendAge}</span>
              </div>
            )}
          </div>
        </div>
        <div
          className="book-code-container"
          style={{ filter: isGrayscale ? 'grayscale(100%)' : 'none' }}>
          <div className="book-code">{levelName}</div>
          <div
            className={`book-code-bg${loaded ? ' is-loaded' : ''}`}
            style={{ backgroundImage: `url(${src})` }}></div>
        </div>
        {displayDate && <div className="date">{displayDate}</div>}
        <div
          className="book-info-container"
          onClick={(e) => {
            e.stopPropagation()
            doCopyToClipboard(title)
          }}>
          <div className="wrapper">
            <div className="title">{isCopied ? 'Copied!' : title}</div>
            {point > 0 && (
              <div className="point">
                {NumberUtils.toRgDecimalPoint(point)}P
              </div>
            )}
          </div>
        </div>
      </BookItemStyle>
    </>
  )
}

export function SkeletonBookItem({
  isLandscape = false,
}: {
  isLandscape?: boolean
}) {
  return (
    <BookItemStyle level={'level'} className={isLandscape ? 'is-landscape' : undefined}>
      <div className="book-cover-container">
        <div className="book-cover-skeleton" />
      </div>
      <div className="book-info-container">
        <div className="wrapper">
          <div className="title-skeleton" />
          <div className="gap" />
          <div className="point-skeleton" />
        </div>
      </div>
    </BookItemStyle>
  )
}
