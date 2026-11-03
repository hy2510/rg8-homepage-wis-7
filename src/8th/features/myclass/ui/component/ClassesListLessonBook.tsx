'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'

const LESSON_CHECK_SIZE = { width: 14, height: 11 } as const

type ClassesListLessonBookProps = {
  title: string
  activityType: string
  imgUrl: string
  point: number
  isLessonComplete?: boolean
  isReviewComplete?: boolean
  onClick?: () => void
}

export default function ClassesListLessonBook({
  title,
  activityType,
  imgUrl,
  point,
  isLessonComplete,
  isReviewComplete,
  onClick,
}: ClassesListLessonBookProps) {
  const { loaded, markLoaded } = useThumbnailLoaded(imgUrl)

  const ariaLabel =
    point > 0 ? `${title} ${NumberUtils.toRgDecimalPoint(point)}P` : title

  const unitCheckSrc = isLessonComplete
    ? Assets.Icon.Study.lessonCheckWhite
    : Assets.Icon.Study.lessonCheckGray

  const unitReviewCheckSrc = isReviewComplete
    ? Assets.Icon.Study.lessonCheckWhite
    : Assets.Icon.Study.lessonCheckGray

  return (
    <div className="cl-book-tile">
      <div
        className="cl-book-cover-block"
        onClick={onClick}
        style={{ cursor: !!onClick ? 'pointer' : 'default' }}>
        <div className="cl-book-cover-wrap">
          <div
            className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
            aria-hidden
          />
          <Image
            src={imgUrl}
            alt=""
            width={120}
            height={180}
            className={`cl-book-cover-img thumbnail-img${loaded ? ' is-loaded' : ''}`}
            onLoad={markLoaded}
            onError={markLoaded}
          />
        </div>
        <div className="cl-book-cover-label">
          <span className="cl-book-cover-label-text">{activityType}</span>
          <div
            className={`cl-book-cover-label-bg${loaded ? ' is-loaded' : ''}`}
            style={{ backgroundImage: `url(${imgUrl})` }}
            aria-hidden
          />
        </div>
      </div>
      <div className="cl-book-footer">
        <div
          className="cl-book-actions"
          role="group"
          aria-label={`${ariaLabel} progress`}>
          <span
            className="cl-book-action cl-book-action--left"
            data-complete={!!isLessonComplete}
            aria-hidden>
            <Image src={unitCheckSrc} alt="" {...LESSON_CHECK_SIZE} />
          </span>
          <span
            className="cl-book-action cl-book-action--right"
            data-complete={!!isReviewComplete}
            aria-hidden>
            <Image src={unitReviewCheckSrc} alt="" {...LESSON_CHECK_SIZE} />
          </span>
        </div>
        <div className="cl-book-info" title={title}>
          <div className="wrapper">
            <div className="title">{title}</div>
            {point > 0 && (
              <div className="point">
                {NumberUtils.toRgDecimalPoint(point)}P
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
