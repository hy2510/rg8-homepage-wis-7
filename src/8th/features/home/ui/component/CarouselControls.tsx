'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function CarouselControls({
  index,
  size,
  onPrev,
  onNext,
}: {
  index: number
  size: number
  onPrev?: () => void
  onNext?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div className="carousel-controls" aria-label={t('t8th0299')}>
      <button
        type="button"
        className="carousel-prev"
        aria-label={t('t8th0300')}
        onClick={onPrev}>
        <Image
          src={Assets.Icon.chevronLeftGray}
          alt=""
          width={24}
          height={24}
        />
      </button>
      <div className="carousel-index" aria-live="polite">
        <strong>{index + 1}</strong>
        <span>/</span>
        {size}
      </div>
      <button
        type="button"
        className="carousel-next"
        aria-label={t('t8th0301')}
        onClick={onNext}>
        <Image
          src={Assets.Icon.chevronRightGray}
          alt=""
          width={24}
          height={24}
        />
      </button>
    </div>
  )
}
