import { RouteResponse, executeRequestAction } from '@/app/api/_util'
import { getTrialToken } from '@/app/api/trial/trial-token'
import BookReading from '@/repository/server/book-reading'

export async function commonGet(path: string, search?: string) {
  const token = await getTrialToken()

  const [payload, status, error] = await executeRequestAction(
    BookReading.commonGet(
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
    BookReading.commonPost(token, `${path}`, data ? data : undefined),
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
