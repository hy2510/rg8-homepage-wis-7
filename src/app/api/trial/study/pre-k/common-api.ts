import { RouteResponse, executeRequestAction } from '@/app/api/_util'
import { getTrialToken } from '@/app/api/trial/trial-token'
import PreK from '@/repository/server/pre-k'

export async function commonGet(path: string, search?: string) {
  const token = await getTrialToken()

  const [payload, status, error] = await executeRequestAction(
    PreK.commonGet(
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
  const token = await getTrialToken()

  const [payload, status, error] = await executeRequestAction(
    PreK.commonPost(token, `${path}`, data ? data : undefined),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}

export function notSupportedApi() {
  return RouteResponse.response(
    { message: 'The requested API is not supported.' },
    { status: 400 },
  )
}
