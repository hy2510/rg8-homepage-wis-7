import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import TeacherGuide from '@/repository/server/teacherguide'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const userDetails = token
    ? authorizationWithCookie.getTokenUserDetails()
    : undefined
  const isStaffAccess =
    userDetails?.role === 'staff' || userDetails?.role === 'admin'

  if (!isStaffAccess) {
    return RouteResponse.response(null, { status: 403 })
  }

  const parameter = await getParameters(request, 'classId')
  const classId = parameter.getString('classId', '')

  const [payload, status, error] = await executeRequestAction(
    TeacherGuide.courseList(token, { classId }),
  )
  if (status.status >= 200 && status.status < 300) {
    return RouteResponse.response(payload, status)
  }
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.commonError()
}
