import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type CheckPin = {
  code: number
  success: boolean
}

function makeVerifyRecoveryPin(json: any): CheckPin {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}
function transform(json: any): VerifyRecoveryPinResponse {
  return makeVerifyRecoveryPin(json)
}
export type VerifyRecoverfyPinParams = {
  id: string
  pin: string
}

export type VerifyRecoveryPinResponse = {
  code: number
  success: boolean
}

export async function postVerifyRecoveryPin(
  input: VerifyRecoverfyPinParams,
): Promise<VerifyRecoveryPinResponse> {
  const request = makeRequest(
    `api/account/verify-recovery-pin`,
    'append-customer',
    {
      method: 'post',
      queryString: {},
      body: {
        id: input.id,
        pin: input.pin,
      },
    },
  )
  return await execute(request, transform)
}
