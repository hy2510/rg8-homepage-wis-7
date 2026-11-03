import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type Movie = {
  title: string
  imagePath: string
  movieId: string
  moviePath: string
  newYn: boolean
  passCount: number
  rgPoint: number
  rgPointSum: number
  subtitlePath: string
}

function makeMovie(json: any): Movie {
  return {
    title: RenewType.renewString(json?.Title),
    imagePath: RenewType.renewString(json?.ImagePath),
    movieId: RenewType.renewString(json?.MovieId),
    moviePath: RenewType.renewString(json?.MoviePath),
    newYn: RenewType.renewBoolean(json?.NewYn),
    passCount: RenewType.renewNumber(json?.PassCount),
    rgPoint: RenewType.renewNumber(json?.RgPoint),
    rgPointSum: RenewType.renewNumber(json?.RgPointSum),
    subtitlePath: RenewType.renewString(json?.SubtitlePath),
  }
}

function transform(json: any): MovieListResponse {
  return {
    movies: json?.Movies?.map(makeMovie) || [],
  }
}

export type MovieListParams = {
  categoryId: string
}

export type MovieListResponse = {
  movies: Movie[]
}

export async function getMovieList(
  input: MovieListParams,
): Promise<MovieListResponse> {
  const request = makeRequest(`api/movies/list`, {
    method: 'get',
    queryString: {
      categoryId: input.categoryId,
    },
  })
  return await execute(request, transform)
}
