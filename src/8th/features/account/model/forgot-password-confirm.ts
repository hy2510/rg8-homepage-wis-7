import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type ForgotPasswordConfirm = {
  code: number
  success: boolean
}

function makeForgotPasswordConfirm(json: any): ForgotPasswordConfirm {
  return {
    code: RenewType.renewNumber(json.code),
    success: RenewType.renewBoolean(json.success),
  }
}

function transform(json: any): ForgotPasswordConfirmResponse {
  return makeForgotPasswordConfirm(json)
}

export type ForgotPasswordConfirmParams = { keyword: string; authCode: string }

export type ForgotPasswordConfirmResponse = {
  code: number
  success: boolean
}

export async function postForgotPasswordConfirm(
  input: ForgotPasswordConfirmParams,
): Promise<ForgotPasswordConfirmResponse> {
  const request = makeRequest(
    `api/account/forgot/password-confirm`,
    'append-customer',
    {
      method: 'post',
      body: {
        keyword: input.keyword,
        authCode: input.authCode,
      },
    },
  )
  return await execute(request, transform)
}
