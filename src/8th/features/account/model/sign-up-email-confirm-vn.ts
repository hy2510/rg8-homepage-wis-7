import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type SignUpEmailConfirmVN = {
  code: number
  success: boolean
}

function makeSignUpEmailConfirmVN(json: any): SignUpEmailConfirmVN {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpEmailConfirmVNResponse {
  return makeSignUpEmailConfirmVN(json)
}

export type SignUpEmailConfirmVNParams = {
  email: string
  authCode: string
}

export type SignUpEmailConfirmVNResponse = {
  code: number
  success: boolean
}

export async function postSignUpEmailConfirmVN(
  input: SignUpEmailConfirmVNParams,
): Promise<SignUpEmailConfirmVNResponse> {
  const request = makeRequest(
    `api/account/signup/email-confirm-vn`,
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
