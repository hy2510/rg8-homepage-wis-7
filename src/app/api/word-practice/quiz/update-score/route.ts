import { RouteResponse, executeRequestAction } from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import WordPractice from '@/repository/server/word-practice'

export async function POST(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await request.json()
  if (!parameter) {
    return RouteResponse.commonError()
  }
  const tmpScores = parameter.scores
  if (
    !Array.isArray(tmpScores) ||
    !tmpScores.every(
      (item) =>
        item &&
        typeof item.wordId === 'string' &&
        typeof item.correctCount === 'number' &&
        typeof item.wrongCount === 'number',
    )
  ) {
    return RouteResponse.commonError()
  }
  const scores = tmpScores as {
    wordId: string
    correctCount: number
    wrongCount: number
  }[]

  const [payload, status, error] = await executeRequestAction(
    WordPractice.updateScore(token, {
      scores,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
