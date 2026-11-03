import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type SignUpPhoneConfirmVN = {
  code: number
  success: boolean
}

function makeSignUpPhoneConfirmVN(json: any): SignUpPhoneConfirmVN {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpPhoneConfirmVNResponse {
  return makeSignUpPhoneConfirmVN(json)
}

export type SignUpPhoneConfirmVNParams = {
  phone: string
  authCode: string
}

export type SignUpPhoneConfirmVNResponse = {
  code: number
  success: boolean
}

export async function postSignUpPhoneConfirmVN(
  input: SignUpPhoneConfirmVNParams,
): Promise<SignUpPhoneConfirmVNResponse> {
  const request = makeRequest(
    `api/account/signup/phone-confirm-vn`,
    'append-customer',
    {
      method: 'post',
      body: {
        phone: input.phone,
        authCode: input.authCode,
      },
    },
  )
  return await execute(request, transform)
}
