import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type SignUpEmailCertification = { code: number; success: boolean }

function makeSignUpEmailCertification(json: any): SignUpEmailCertification {
  return {
    code: RenewType.renewNumber(json?.code),
    success: RenewType.renewBoolean(json?.success),
  }
}

function transform(json: any): SignUpEmailCertificationResponse {
  return makeSignUpEmailCertification(json)
}

export type SignUpEmailCertificationParams = {
  email: string
  password: string
  studentName: string
}

export type SignUpEmailCertificationResponse = SignUpEmailCertification

export async function postSignUpEmailCertification(
  input: SignUpEmailCertificationParams,
): Promise<SignUpEmailCertificationResponse> {
  const request = makeRequest(
    `api/account/signup/email-certification`,
    'append-customer',
    {
      method: 'post',
      body: {
        email: input.email,
        password: input.password,
        studentName: input.studentName,
      },
    },
  )
  return await execute(request, transform)
}
