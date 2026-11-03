'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StartButton } from '@/8th/shared/ui/Buttons'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function HeaderEnteranceDNF({
  startButtonLabel,
  onStartButtonClick,
}: {
  startButtonLabel: string
  onStartButtonClick?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <section className="section hero">
      <div className="hero-copy dodo-hero-copy">
        <h1 className="dodo-tagline">{t('t8th0354')}</h1>
        <Image
          className="dodo-logo"
          src={Assets.Image.AppLogoDnf}
          alt={t('t8th0386')}
          priority
        />
        <p>
          {t('t8th0387')}
          <br />
          {t('t8th0388')}
        </p>
        <StartButton
          label={startButtonLabel}
          className="animated trial-cta"
          onClick={onStartButtonClick}
        />
      </div>
      <div className="hero-visual" aria-label={t('t8th0316')}>
        <span className="dodo-hero-gloss" aria-hidden="true" />
        <div className="hero-video">
          <video
            src="/src/videos/dodo-movies-story.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={t('t8th0389')}
          />
          <Image
            className="dodo-hero-character dodo-hero-character-left"
            src={Assets.DodoFriends.HeroEdmond}
            alt=""
            width={957}
            height={1533}
            sizes="(max-width: 768px) 88px, 140px"
          />
          <Image
            className="dodo-hero-character"
            src={Assets.DodoFriends.HeroGuitar}
            alt=""
            width={1000}
            height={1164}
            sizes="(max-width: 768px) 120px, 190px"
          />
        </div>
      </div>
    </section>
  )
}
