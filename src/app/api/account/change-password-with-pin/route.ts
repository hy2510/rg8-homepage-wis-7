import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
} from '@/app/api/_util'
import { getCustomerWithHeader } from '@/authorization/server/nextjsHeaderCustomer'
import { NextRequest } from 'next/server'
import Account from '@/repository/server/account'

export async function POST(request: NextRequest) {
  const customer = await getCustomerWithHeader()
  if (!customer) {
    return RouteResponse.invalidCustomerToken()
  }

  const parameter = await getBodyParameters(
    request,
    'loginId',
    'pin',
    'newPassword',
  )
  const loginId = parameter.getString('loginId', '')
  const pin = parameter.getString('pin', '')
  const newPassword = parameter.getString('newPassword', '')

  const [payload, status, error] = await executeRequestAction(
    Account.changePasswordWithPin(customer, { loginId, pin, newPassword }),
  )

  if (error) {
    return RouteResponse.commonError()
  }

  return RouteResponse.response(payload, status)
}
