'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'wordpractice'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function summary(token: string, input?: {}) {
  const request = makeRequest({
    token,
    path: getPath('summary'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function list(
  token: string,
  input: {
    bookType: 'EB' | 'PB'
    level: string
    proficiency: 'All' | 'Perfect' | 'Strong' | 'Normal' | 'Weak'
    page: number
  },
) {
  const request = makeRequest({
    token,
    path: getPath(`list/${input.bookType}`),
    option: {
      method: 'get',
      queryString: {
        level: input.level,
        proficiency: input.proficiency,
        page: input.page,
      },
    },
  })
  return await execute(request)
}

async function quiz(
  token: string,
  input: { bookType: 'EB' | 'PB'; level: string },
) {
  const request = makeRequest({
    token,
    path: getPath(`quiz/${input.bookType}`),
    option: {
      method: 'get',
      queryString: {
        level: input.level,
      },
    },
  })
  return await execute(request)
}

async function updateScore(
  token: string,
  input: {
    scores: { wordId: string; correctCount: number; wrongCount: number }[]
  },
) {
  const request = makeRequest({
    token,
    path: getPath('update-score'),
    option: {
      method: 'post',
      body: {
        scores: input.scores,
      },
    },
  })
  return await execute(request)
}

const WordPractice = {
  summary,
  list,
  quiz,
  updateScore,
}
export default WordPractice
