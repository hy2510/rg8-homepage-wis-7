import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function transform(json: any): StudentWithdrawResponse {
  return {
    success: RenewType.renewBoolean(json.success),
  }
}

export type StudentWithdrawParams = {
  cause: string
}

export type StudentWithdrawResponse = {
  success: boolean
}

export async function postStudentWithdraw(
  input: StudentWithdrawParams,
): Promise<StudentWithdrawResponse> {
  const request = makeRequest(`api/student/withdraw`, {
    method: 'post',
    body: {
      cause: input.cause,
    },
  })
  return await execute(request, transform)
}
