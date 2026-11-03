import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import WordPractice from '@/repository/server/word-practice'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ bookType: string }> },
) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }
  const params = (await props.params) as { bookType: 'EB' | 'PB' }
  const parameter = await getParameters(request, 'level')
  const level = parameter.getString('level')

  const [payload, status, error] = await executeRequestAction(
    WordPractice.quiz(token, { bookType: params.bookType, level }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
