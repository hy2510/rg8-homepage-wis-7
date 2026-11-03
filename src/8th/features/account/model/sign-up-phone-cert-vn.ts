import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type SignUpPhoneCertificationVN = {
  code: number
  success: boolean
}

function makeSignUpPhoneCertificationVN(json: any): SignUpPhoneCertificationVN {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpPhoneCertificationVNResponse {
  return makeSignUpPhoneCertificationVN(json)
}

export type SignUpPhoneCertificationVNParams = {
  phone: string
}

export type SignUpPhoneCertificationVNResponse = {
  code: number
  success: boolean
}

export async function postSignUpPhoneCertificationVN(
  input: SignUpPhoneCertificationVNParams,
): Promise<SignUpPhoneCertificationVNResponse> {
  const request = makeRequest(
    `api/account/signup/phone-certification-vn`,
    'append-customer',
    {
      method: 'post',
      body: {
        phone: input.phone,
      },
    },
  )
  return await execute(request, transform)
}
