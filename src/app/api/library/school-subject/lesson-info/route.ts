import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Library from '@/repository/server/library'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(request, 'grade', 'publisher', 'lesson')
  const grade = parameter.getString('grade')
  const publisherCode = parameter.getString('publisher')
  const lesson = parameter.getString('lesson')

  const [payload, status, error] = await executeRequestAction(
    Library.schoolSubjectLessonInfo(token, {
      grade: grade,
      publisherCode: publisherCode,
      lesson: lesson,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
