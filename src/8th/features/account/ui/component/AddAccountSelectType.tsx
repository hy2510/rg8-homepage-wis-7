'use client'

import useTranslation from '@/localization/client/useTranslations'
import Image, { StaticImageData } from 'next/image'

export default function AddAccountSelectType({
  onSelect,
}: {
  onSelect: (type: 'nation' | 'group') => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div className="body is-add">
      <div className="member-list">
        <button
          type="button"
          className="card"
          onClick={() => onSelect('nation')}>
          <SymbolIcon
            src={'/src/images/@account/symbol_icon_indi.png'}
            alt="person"
          />
          <span className="info">
            <strong>{t('t8th0067')}</strong>
            <span className="school">{t('t8th0116')}</span>
          </span>
        </button>
      </div>
      <p className="add-or">{t('t8th0103')}</p>
      <div className="member-list">
        <button
          type="button"
          className="card"
          onClick={() => onSelect('group')}>
          <SymbolIcon
            src={'/src/images/@account/symbol_icon_school.svg'}
            alt="group"
          />
          <span className="info">
            <strong>{t('t8th0070')}</strong>
            <span className="school">{t('t8th0071')}</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function SymbolIcon({
  src,
  alt,
}: {
  src: string | StaticImageData
  alt: string
}) {
  const size = 64
  return (
    <span className="avatar" aria-hidden="true">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </span>
  )
}
