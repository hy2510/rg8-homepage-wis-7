'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StartButton } from '@/8th/shared/ui/Buttons'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function FooterEnterance({
  startButtonLabel,
  showTrialMessage = false,
  onStartButtonClick,
}: {
  startButtonLabel: string
  showTrialMessage?: boolean
  onStartButtonClick?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <section className="section cta">
      <div className="hero-copy">
        <h2>{t('t8th0307')}</h2>
        <p>
          {t('t8th0308')}
          <br />
          {t('t8th0309')}
        </p>
        <div className="cta-buttons">
          <StartButton
            label={startButtonLabel}
            className="animated trial-cta"
            onClick={onStartButtonClick}
          />
          {showTrialMessage && <span>{t('t8th0310')}</span>}
        </div>
      </div>
      <div className="cta-visual" aria-label={t('t8th0311')}>
        <div className="hero-video">
          <video autoPlay muted loop playsInline>
            <source
              src="/src/videos/about_video_background.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="cta-model">
          <Image
            src={Assets.Image.JuniorModel}
            alt=""
            width={282}
            height={665}
          />
        </div>
      </div>
    </section>
  )
}
