import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function transform(json: any): SchoolSubjectOptionResponse {
  return {
    grade: RenewType.renewString(json.grade),
    publisher: RenewType.renewString(json.publisher),
    lesson: RenewType.renewString(json.lesson),
  }
}

export type SchoolSubjectOptionParams = {}

export type SchoolSubjectOptionResponse = {
  grade: string
  publisher: string
  lesson: string
}

export async function getSchoolSubjectOption(
  input?: SchoolSubjectOptionParams,
): Promise<SchoolSubjectOptionResponse> {
  const request = makeRequest(`api/library/school-subject/option`, {
    method: 'get',
  })
  return await execute(request, transform)
}
