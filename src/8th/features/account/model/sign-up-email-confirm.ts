import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type SignUpEmailConfirm = {
  code: number
  success: boolean
}

function makeSignUpEmailConfirm(json: any): SignUpEmailConfirm {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpEmailConfirmResponse {
  return makeSignUpEmailConfirm(json)
}

export type SignUpEmailConfirmParams = {
  email: string
  authCode: string
}

export type SignUpEmailConfirmResponse = {
  code: number
  success: boolean
}

export async function postSignUpEmailConfirm(
  input: SignUpEmailConfirmParams,
): Promise<SignUpEmailConfirmResponse> {
  const request = makeRequest(
    `api/account/signup/email-confirm`,
    'append-customer',
    {
      method: 'post',
      body: {
        email: input.email,
        authCode: input.authCode,
      },
    },
  )
  return await execute(request, transform)
}
