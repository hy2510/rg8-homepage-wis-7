import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type ChangePasswordWithPin = {
  code: number
  success: boolean
}

function makeChangePasswordWithPin(json: any): ChangePasswordWithPin {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): ChangePasswordWithPinResponse {
  return makeChangePasswordWithPin(json)
}

export type ChangePasswordWithPinParams = {
  loginId: string
  pin: string
  newPassword: string
}

export type ChangePasswordWithPinResponse = {
  code: number
  success: boolean
}

export async function postChangePasswordWithPin(
  input: ChangePasswordWithPinParams,
): Promise<ChangePasswordWithPinResponse> {
  const request = makeRequest(
    `api/account/change-password-with-pin`,
    'append-customer',
    {
      method: 'post',
      body: {
        loginId: input.loginId,
        pin: input.pin,
        newPassword: input.newPassword,
      },
    },
  )
  return await execute(request, transform)
}
