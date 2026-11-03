import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type ChangeRecoveryPin = {
  success: boolean
}

function makeChangeRecoveryPin(json: any): ChangeRecoveryPin {
  return {
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): ChangeRecoveryPinResponse {
  return makeChangeRecoveryPin(json)
}

export type ChangeRecoveryPinParams = {
  password: string
  pin: string
}

export type ChangeRecoveryPinResponse = {
  success: boolean
}

export async function postChangeRecoveryPin(
  input: ChangeRecoveryPinParams,
): Promise<ChangeRecoveryPinResponse> {
  const request = makeRequest(`api/student/change-recovery-pin`, {
    method: 'post',
    body: {
      password: input.password,
      pin: input.pin,
    },
  })
  return await execute(request, transform)
}
