import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import DubbingRoom from '@/repository/server/dubbingroom'
import { commonPost } from '../common-api'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(
    request,
    'levelRoundId',
    'studyId',
    'countryCode',
  )
  const levelRoundId = parameter.getString('levelRoundId')
  const studyId = parameter.getString('studyId')
  const studyMode = parameter.getString('studyMode')

  const [payload, status, error] = await executeRequestAction(
    DubbingRoom.contents(token, {
      levelRoundId: levelRoundId,
      studyId: studyId,
      studyMode: studyMode,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  return await commonPost(`content`, data)
}
