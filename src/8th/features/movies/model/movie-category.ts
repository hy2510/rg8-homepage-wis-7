import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type MovieCategory = {
  categoryId: string
  title: string
  imagePath: string
  description: string
  contentsCount: number
  completeCount: number
  newYn: boolean
}

function makeMovieCategory(json: any): MovieCategory {
  return {
    categoryId: RenewType.renewString(json?.CategoryId),
    title: RenewType.renewString(json?.Title),
    imagePath: RenewType.renewString(json?.ImagePath),
    description: RenewType.renewString(json?.Description),
    contentsCount: RenewType.renewNumber(json?.ContentsCount),
    completeCount: RenewType.renewNumber(json?.CompleteCount),
    newYn: RenewType.renewBoolean(json?.NewYn),
  }
}

function transform(json: any): MovieCategoryResponse {
  return {
    movieCategories: json?.MovieCategories?.map(makeMovieCategory) || [],
  }
}

export type MovieCategoryParams = {}

export type MovieCategoryResponse = {
  movieCategories: MovieCategory[]
}

export async function getMovieCategory(): Promise<MovieCategoryResponse> {
  const request = makeRequest(`api/movies/category`, {
    method: 'get',
  })
  return await execute(request, transform)
}
