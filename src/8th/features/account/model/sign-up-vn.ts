import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type SignUpVN = {
  code: number
  success: boolean
}

function makeSignUpVN(json: any): SignUpVN {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpVNResponse {
  return makeSignUpVN(json)
}

export type SignUpVNParams = {
  email: string
  phone: string
}

export type SignUpVNResponse = {
  code: number
  success: boolean
}

export async function postSignUpVN(
  input: SignUpVNParams,
): Promise<SignUpVNResponse> {
  const request = makeRequest(
    `api/account/signup/signup-vn`,
    'append-customer',
    {
      method: 'post',
      body: {
        email: input.email,
        phone: input.phone,
      },
    },
  )
  return await execute(request, transform)
}
