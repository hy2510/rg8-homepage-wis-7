import { RouteResponse, executeRequestAction } from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import DubbingRoom from '@/repository/server/dubbingroom'

export async function commonGet(path: string, search?: string) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const [payload, status, error] = await executeRequestAction(
    DubbingRoom.commonGet(
      token,
      `${path}${search && search.length > 1 ? search : ''}`,
    ),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}

export async function commonPost(path: string, data?: unknown) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const [payload, status, error] = await executeRequestAction(
    DubbingRoom.commonPost(token, `${path}`, data ? data : undefined),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
