import { Assets } from '@/8th/assets/asset-library'
import { MoviesCategoriesHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function MoviesCategoriesHeader() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <MoviesCategoriesHeaderStyle>
      <div className="dubbing-categories-header-text">
        <p className="dubbing-categories-header-title">{t('t8thdf033')}</p>
        <p className="dubbing-categories-header-subtitle">{t('t8thdf034')}</p>
      </div>
      <div className="dubbing-categories-header-image">
        <Image
          src={Assets.Image.MovieDodo}
          alt="Dodo watching movies"
          width={140}
          height={140}
          priority
        />
      </div>
    </MoviesCategoriesHeaderStyle>
  )
}
