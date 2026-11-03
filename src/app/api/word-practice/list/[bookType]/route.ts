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
  const parameter = await getParameters(request, 'level', 'proficiency', 'page')
  const level = parameter.getString('level')
  const proficiency = parameter.getString('proficiency', 'All') as
    | 'All'
    | 'Perfect'
    | 'Strong'
    | 'Normal'
    | 'Weak'
  const page = parameter.getNumber('page', 1)

  const [payload, status, error] = await executeRequestAction(
    WordPractice.list(token, {
      bookType: params.bookType,
      level,
      proficiency,
      page,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
