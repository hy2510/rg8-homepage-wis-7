'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'movie'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function categories(token: string) {
  const request = makeRequest({
    token,
    path: getPath('categories'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function search(
  token: string,
  input: {
    categoryId: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('search'),
    option: {
      method: 'get',
      queryString: {
        categoryId: input.categoryId,
      },
    },
  })
  return await execute(request)
}

async function watchComplete(
  token: string,
  input: {
    movieId: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('watch-complete'),
    option: {
      method: 'post',
      body: {
        movieId: input.movieId,
      },
    },
  })
  return await execute(request)
}
const Movie = {
  categories,
  search,
  watchComplete,
}
export default Movie
