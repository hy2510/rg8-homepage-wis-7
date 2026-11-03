import {
  OverrideMutationOptions,
  OverrideQueryOptions,
} from '@/8th/shared/react-query/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MovieCategoryResponse,
  getMovieCategory,
} from '../model/movie-category'
import { getMovieList } from '../model/movie-list'
import { postMovieWatchComplete } from '../model/movie-watch-complete'
import { movieKeys } from './movie-key'

export function useMovieCategories(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: movieKeys.categories(),
    queryFn: () => getMovieCategory(),
  })
}

export function useMovieList(
  params: { categoryId: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: movieKeys.listWithParam(params),
    queryFn: () => getMovieList(params),
  })
}

export function useMovieWatchComplete(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: (input: {
      categoryId: string
      movieId: string
      currentPassCount: number
    }) => postMovieWatchComplete({ movieId: input.movieId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: movieKeys.listWithParam({ categoryId: variables.categoryId }),
      })
      const categories: MovieCategoryResponse | undefined =
        queryClient.getQueryData(movieKeys.categories())
      const category = categories?.movieCategories?.find(
        (category) => category.categoryId === variables.categoryId,
      )
      if (category && variables.currentPassCount === 0) {
        category.completeCount = category.completeCount + 1
        queryClient.setQueryData(movieKeys.categories(), categories)
      }
      options?.onSuccess?.(data, variables)
    },
  })
}
