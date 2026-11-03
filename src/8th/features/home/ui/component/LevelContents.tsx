'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'

export default function LevelContents({
  isLogin,
  basePath,
}: {
  isLogin: boolean
  basePath: string
}) {
  // @language 'common'
  const { t } = useTranslation()

  const levelContents = [
    {
      id: 'prek',
      level: t('t8th329'),
      description: t('t8th0334'),
      age: t('t8th287'),
      image: Assets.Thumbnail.LeveledThumbnailPK,
    },
    {
      id: 'k',
      level: t('t8th0335'),
      description: t('t8th0336'),
      age: t('t8th0337'),
      image: Assets.Thumbnail.LeveledThumbnailK,
    },
    {
      id: '1',
      level: t('t8th0338'),
      description: t('t8th0339'),
      age: t('t8th0340'),
      image: Assets.Thumbnail.LeveledThumbnail1,
    },
    {
      id: '2-6',
      level: t('t8th0341'),
      description: t('t8th0342'),
      age: t('t8th0343'),
      image: Assets.Thumbnail.LeveledThumbnail2,
    },
  ]

  return (
    <section className="section deferred-section">
      <h2 className="section-title">{t('t8th0344')}</h2>
      <div className="panel level-grid">
        {levelContents.map((item) => (
          <article className="level-card" key={item.id}>
            <div className="level-image">
              <Image
                src={item.image}
                alt={t('t8th0346', { level: item.level })}
              />
            </div>
            <div>
              <span>{item.age}</span>
              <h3>{item.level}</h3>
              <p>{item.description}</p>
              {!isLogin && (
                <Link
                  href={`${basePath}/${item.id}?from=home`}
                  className="text-button">
                  {t('t8th0345')}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
