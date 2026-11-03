import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
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

  const [payload, status, error] = await executeRequestAction(
    Library.schoolSubjectStudentInfo(token),
  )
  if (error) {
    return RouteResponse.commonError()
  }

  const newPayload = {
    grade: payload?.grade || '',
    publisher: payload?.CurriculumRelatedPublisherCode || '',
    lesson: payload?.lesson || '',
  }
  return RouteResponse.response(newPayload, status)
}

export async function POST(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(
    request,
    'grade',
    'publisher',
    'lesson',
  )
  const grade = parameter.getString('grade')
  const publisherCode = parameter.getString('publisher')
  const lesson = parameter.getString('lesson')

  const [payload, status, error] = await executeRequestAction(
    Library.schoolSubjectStudentInfoUpdate(token, {
      grade,
      publisherCode,
      lesson,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
