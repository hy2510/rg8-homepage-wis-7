import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function makeRegistRecoveryPin(json: any): { success: boolean } {
  return {
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): RegistRecoveryPinResponse {
  return makeRegistRecoveryPin(json)
}

export type RegistRecoveryPinParams = {
  hash: string
  pin: string
}

export type RegistRecoveryPinResponse = {
  success: boolean
}

export async function postRegistRecoveryPin(
  input: RegistRecoveryPinParams,
): Promise<RegistRecoveryPinResponse> {
  const request = makeRequest(`api/account/regist-recovery-pin`, {
    method: 'post',
    body: {
      hash: input.hash,
      pin: input.pin,
    },
  })
  return await execute(request, transform)
}
