import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import BookReading from '@/repository/server/book-reading'

export async function POST(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(
    request,
    'studyId',
    'studentHistoryId',
  )
  const studyId = parameter.getString('studyId')
  const studentHistoryId = parameter.getString('studentHistoryId')

  const [payload, status, error] = await executeRequestAction(
    BookReading.animationCompleteNeulbom(token, { studyId, studentHistoryId }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
