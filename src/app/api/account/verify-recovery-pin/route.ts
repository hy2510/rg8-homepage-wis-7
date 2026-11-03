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

  const parameter = await getBodyParameters(request, 'id', 'pin')
  const loginId = parameter.getString('id', '')
  const pin = parameter.getString('pin', '')

  const [payload, status, error] = await executeRequestAction(
    Account.verifyPin(customer, { loginId, pin }),
  )

  if (error) {
    return RouteResponse.commonError()
  }

  if (!payload.success) {
    return RouteResponse.response(payload, { status: 400 })
  }
  return RouteResponse.response(payload, status)
}
