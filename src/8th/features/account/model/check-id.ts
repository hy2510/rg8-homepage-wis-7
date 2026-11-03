import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type CheckId = {
  success: boolean
}

function makeCheckId(json: any): CheckId {
  return {
    success: RenewType.renewBoolean(json.success),
  }
}

function transform(json: any): CheckIdResponse {
  return makeCheckId(json)
}

export type CheckIdParams = {
  loginId: string
}

export type CheckIdResponse = {
  success: boolean
}

export async function getCheckId(
  input: CheckIdParams,
): Promise<CheckIdResponse> {
  const request = makeRequest(`api/account/check-id`, 'append-customer', {
    method: 'get',
    queryString: {
      loginId: input.loginId,
    },
  })
  return await execute(request, transform)
}
