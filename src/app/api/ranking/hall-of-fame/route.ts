import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { getCustomerWithHeader } from '@/authorization/server/nextjsHeaderCustomer'
import { NextRequest } from 'next/server'
import Ranking from '@/repository/server/ranking'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  let customer = undefined
  if (!token) {
    customer = await getCustomerWithHeader()
    if (!customer) {
      return RouteResponse.invalidCustomerToken()
    }
  }

  const parameters = await getParameters(request, 'hallOfFameGradeId', 'page')
  const hallOfFameGradeId = parameters.getString('hallOfFameGradeId', '')
  const page = parameters.getNumber('page', 0)

  const [payload, status, error] = await executeRequestAction(
    Ranking.hallOfFame(token, customer, {
      hallOfFameGradeId:
        hallOfFameGradeId === '' ? undefined : hallOfFameGradeId,
      page: page === 0 ? undefined : page,
    }),
  )

  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
