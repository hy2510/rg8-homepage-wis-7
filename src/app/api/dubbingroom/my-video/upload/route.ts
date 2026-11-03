import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import DubbingRoom from '@/repository/server/dubbingroom'
import { RouteResponse, executeRequestAction } from '../../../_util'

const DUBBING_VIDEO_URL = process.env.DUBBING_VIDEO_URL

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const search = request.nextUrl.search

  const [payload, status, error] = await executeRequestAction(
    DubbingRoom.commonGet(
      token,
      `video-token${search && search.length > 1 ? search : ''}`,
    ),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  if (payload && payload.Token) {
    return RouteResponse.response(
      {
        Url: `${DUBBING_VIDEO_URL}upload/video?token=${payload.Token}`,
      },
      status,
    )
  }
  return RouteResponse.commonError()
}
