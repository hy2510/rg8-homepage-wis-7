import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Student from '@/repository/server/student'

export async function POST(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(request, 'password', 'pin')
  const password = parameter.getString('password', '')
  const pin = parameter.getString('pin', '')

  const [payload, status, error] = await executeRequestAction(
    Student.changeRecoveryPin(token, {
      password: password,
      newPin: pin,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }

  if (!payload.success) {
    return RouteResponse.response(payload, { status: 400 })
  }
  return RouteResponse.response(payload, status)
}
