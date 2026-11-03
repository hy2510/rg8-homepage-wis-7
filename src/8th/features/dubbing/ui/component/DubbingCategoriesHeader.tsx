import { Assets } from '@/8th/assets/asset-library'
import { DubbingCategoriesHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function DubbingCategoriesHeader() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <DubbingCategoriesHeaderStyle>
      <div className="dubbing-categories-header-text">
        <p className="dubbing-categories-header-title">{t('t8thdf019')}</p>
        <p className="dubbing-categories-header-subtitle">{t('t8thdf020')}</p>
      </div>
      <div className="dubbing-categories-header-image">
        <Image
          src={Assets.Image.DubbingDodo}
          alt={t('t8thdf019')}
          width={140}
          height={140}
          priority
        />
      </div>
    </DubbingCategoriesHeaderStyle>
  )
}
