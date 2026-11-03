import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function transform(json: any): MovieWatchCompleteResponse {
  return {
    success: RenewType.renewBoolean(json.success),
  }
}

export type MovieWatchCompleteParams = {
  movieId: string
}

export type MovieWatchCompleteResponse = {
  success: boolean
}

export async function postMovieWatchComplete(
  input: MovieWatchCompleteParams,
): Promise<MovieWatchCompleteResponse> {
  const request = makeRequest(`api/movies/watch-complete`, {
    method: 'post',
    body: {
      movieId: input.movieId,
    },
  })
  return await execute(request, transform)
}
