import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function transform(json: any): SchoolSubjectOptionSaveResponse {
  return {
    success: RenewType.renewBoolean(json.success),
  }
}

export type SchoolSubjectOptionSaveParams = {
  grade: string
  publisher: string
  lesson: string
}

export type SchoolSubjectOptionSaveResponse = {
  success: boolean
}

export async function postSchoolSubjectOptionSave(
  input: SchoolSubjectOptionSaveParams,
): Promise<SchoolSubjectOptionSaveResponse> {
  const request = makeRequest(`api/library/school-subject/option`, {
    method: 'post',
    body: {
      grade: input.grade,
      publisher: input.publisher,
      lesson: input.lesson,
    },
  })
  return await execute(request, transform)
}
