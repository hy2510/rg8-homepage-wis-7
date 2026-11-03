'use client'

import { Gap } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image, { StaticImageData } from 'next/image'

export default function Partners({
  partners,
}: {
  partners: { name: string; href: string; logo?: string; icon?: string }[]
}) {
  if (partners.length === 0) return null
  return <PartnerContainer partners={partners} />
}

function PartnerContainer({
  partners,
}: {
  partners: {
    name: string
    href: string
    logo?: string | StaticImageData
    icon?: string | StaticImageData
  }[]
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <>
      <section
        className="section partners-section deferred-section"
        id="app-install">
        <h2 className="section-title">{t('t8th0347')}</h2>
        <div className="partner-grid">
          {partners.map((partner) => (
            <a
              className={`partner-card${partner.logo ? ' is-logo' : ''}`}
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={60}
                />
              ) : (
                <>
                  {partner.icon ? (
                    <Image
                      className="partner-icon"
                      src={partner.icon}
                      alt=""
                      width={32}
                      height={32}
                    />
                  ) : (
                    <span className="partner-mark" aria-hidden="true" />
                  )}
                  <strong>{partner.name}</strong>
                </>
              )}
            </a>
          ))}
        </div>
      </section>
      <Gap size={40} />
    </>
  )
}
