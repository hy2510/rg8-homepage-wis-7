'use client'

import LibraryActionBar, {
  ActionBarDropdownItem,
} from '@/8th/features/library/ui/component/LibraryActionBar'
import {
  useMovieCategories,
  useMovieList,
} from '@/8th/features/movies/service/movie-query'
import MovieCard from '@/8th/features/movies/ui/component/MovieCard'
import MovieContentsListHeader from '@/8th/features/movies/ui/component/MovieContentsListHeader'
import { useStudentHistoryList } from '@/8th/features/student/service/student-query'
import { MovieContentsListStyle } from '@/8th/shared/styled/FeaturesStyled'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useState } from 'react'
import MovieVideoModal from '../modal/MovieVideoModal'

export default function MovieContentsList({
  categoryId,
}: {
  categoryId?: string
}) {
  const categoryIdParam = categoryId || '0'
  const { data: category, isLoading: isCategoryLoading } = useMovieCategories()

  if (isCategoryLoading) {
    return null
  }

  const currentCategory = category?.movieCategories.find(
    (category) => category.categoryId === categoryIdParam,
  )

  if (!currentCategory) {
    return <></>
  }

  return (
    <MovieContentsListDependency
      categoryId={categoryIdParam}
      categoryTitle={currentCategory.title}
      categoryDescription={currentCategory.description}
      categoryImagePath={currentCategory.imagePath}
    />
  )
}

function MovieContentsListDependency({
  categoryId,
  categoryTitle,
  categoryDescription,
  categoryImagePath,
}: {
  categoryId: string
  categoryTitle: string
  categoryDescription: string
  categoryImagePath: string
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const studentHistory = useStudentHistoryList()
  const defaultStudentHistoryId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].studentHistoryId
      : undefined
  const defaultClassId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].classId
      : undefined
  const isStudentHistoryActive = !!defaultClassId && !!defaultStudentHistoryId

  const { data: moviesData, isLoading: isMoviesLoading } = useMovieList({
    categoryId,
  })

  const [movieStudyInfo, setMovieStudyInfo] = useState<{
    movieId: string
    title: string
    video: string
    poster?: string
    subtitle?: string
    passCount?: number
  } | null>(null)

  const [status, setStatus] = useState('All')

  if (isMoviesLoading) {
    return null
  }

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return null
  }

  const statusItems = [
    {
      key: 'All',
      label: t('t8thdf025'),
      isActive: status === 'All',
    },
    {
      key: 'incomplete',
      label: t('t8thdf026'),
      isActive: status === 'incomplete',
    },
    // {
    //   key: 'incompleteOr1stTry',
    //   label: t('t8thdf027'),
    //   isActive: status === 'incompleteOr1stTry',
    // },
    // {
    //   key: '1stTry',
    //   label: t('t8thdf028'),
    //   isActive: status === '1stTry',
    // },
    {
      key: 'complete',
      label: t('t8thdf031'),
      isActive: status === 'complete',
    },
  ]
  const actionBarTitle = statusItems.find((item) => item.isActive)?.label ?? ''

  const onStatusItemClick = (item: ActionBarDropdownItem) => {
    setStatus(item.key)
  }

  const movies =
    moviesData?.movies?.filter((movie) => {
      if (status === 'incomplete') {
        return movie.passCount === 0
      } else if (status === 'complete') {
        return movie.passCount > 0
      }
      return true
    }) || []

  return (
    <>
      <MovieContentsListStyle>
        <SubPageNavHeader parentPath={SITE_PATH.DODON_FRIENDS.MOVIES} />

        <MovieContentsListHeader
          title={categoryTitle}
          description={categoryDescription}
          imagePath={categoryImagePath}
        />

        <LibraryActionBar
          title={actionBarTitle}
          count={movies.length}
          dropdowns={[
            {
              title: t('t8th012'),
              isActiveMakerVisible: true,
              items: statusItems,
              onItemClick: onStatusItemClick,
            },
          ]}
        />

        <div className="movie-grid">
          {movies.map((movie) => {
            return (
              <MovieCard
                key={movie.movieId}
                movieId={movie.movieId}
                title={movie.title}
                imagePath={movie.imagePath}
                passCount={movie.passCount}
                rgPoint={movie.rgPoint}
                isNew={movie.newYn}
                onClick={() => {
                  setMovieStudyInfo({
                    movieId: movie.movieId,
                    title: movie.title,
                    video: movie.moviePath,
                    passCount: movie.passCount,
                    poster: movie.imagePath,
                    subtitle: movie.subtitlePath,
                  })
                }}
              />
            )
          })}
        </div>
      </MovieContentsListStyle>
      {movieStudyInfo && (
        <MovieVideoModal
          categoryId={categoryId}
          movieId={movieStudyInfo.movieId}
          videoUrl={movieStudyInfo.video}
          poster={movieStudyInfo.poster}
          subtitle={movieStudyInfo.subtitle}
          currentPassCount={movieStudyInfo.passCount}
          onClose={() => setMovieStudyInfo(null)}
        />
      )}
    </>
  )
}
