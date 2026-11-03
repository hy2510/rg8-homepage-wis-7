'use client'

import { useMovieCategories } from '@/8th/features/movies/service/movie-query'
import MovieCategoryCard from '@/8th/features/movies/ui/component/MovieCategoryCard'
import MoviesCategoriesHeader from '@/8th/features/movies/ui/component/MoviesCategoriesHeader'
import { MovieCategoriesStyle } from '@/8th/shared/styled/FeaturesStyled'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'

export default function MovieCategories() {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const { data: categories, isLoading: isCategoriesLoading } =
    useMovieCategories()

  if (isCategoriesLoading) {
    return null
  }

  const list = categories?.movieCategories || []

  const onMovieCategoryCardClick = (categoryId: string) => {
    router.push(`${SITE_PATH.DODON_FRIENDS.MOVIES}/${categoryId}`)
  }

  return (
    <MovieCategoriesStyle>
      <MoviesCategoriesHeader />
      <section className="movie-section">
        <div className="movie-section-title">{`· ${t('t8thdf032')}`}</div>
        <div className="movie-grid">
          {list.map((item) => (
            <MovieCategoryCard
              key={item.categoryId}
              categoryId={item.categoryId}
              title={item.title}
              imagePath={item.imagePath}
              contentsCount={item.contentsCount}
              completeCount={item.completeCount}
              isNew={item.newYn}
              onClick={() => onMovieCategoryCardClick(item.categoryId)}
            />
          ))}
        </div>
      </section>
    </MovieCategoriesStyle>
  )
}
