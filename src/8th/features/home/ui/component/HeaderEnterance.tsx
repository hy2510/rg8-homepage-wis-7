'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StartButton } from '@/8th/shared/ui/Buttons'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function HeaderEnterance({
  startButtonLabel,
  onStartButtonClick,
}: {
  startButtonLabel: string
  onStartButtonClick?: () => void
}) {
  // @language 'common'
  const { t, i18n } = useTranslation()
  const language = i18n.language

  return (
    <section className="section hero">
      <div className="hero-copy">
        <h1>
          {t('t8th0312')}
          <br />
          {t('t8th0313')}
        </h1>
        <p>
          {t('t8th0314')}
          <br />
          {t('t8th0315')}
        </p>
        <StartButton
          label={startButtonLabel}
          className="animated trial-cta"
          onClick={onStartButtonClick}
        />
      </div>
      <div className="hero-visual" aria-label={t('t8th0316')}>
        <div className="hero-video">
          <video autoPlay muted loop playsInline>
            <source
              src="/src/videos/about_video_background.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="award-badge">
          <Image
            src={
              language === 'vi'
                ? Assets.Image.RibbonPrize_vi
                : Assets.Image.RibbonPrize_ko
            }
            alt={t('t8th0317')}
            width={150}
            height={321}
            priority
          />
        </div>
      </div>
    </section>
  )
}
