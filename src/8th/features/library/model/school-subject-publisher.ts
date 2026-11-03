import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type SchoolSubjectPublisher = {
  grade: string
  gradeCode: string
  maxLessons: number
  publisher: string
  publisherCode: string
}

function makeSchoolSubjectPublisher(json: any): SchoolSubjectPublisher {
  return {
    grade: RenewType.renewString(json?.Grade),
    gradeCode: RenewType.renewString(json?.GradeCode),
    maxLessons: RenewType.renewNumber(json?.MaxLessons),
    publisher: RenewType.renewString(json?.Publisher),
    publisherCode: RenewType.renewString(json?.PublisherCode),
  }
}

function transform(json: any): SchoolSubjectPublisherResponse {
  return {
    publishers: json
      ? json?.Publishers?.map((item: any) => makeSchoolSubjectPublisher(item))
      : [],
  }
}

export type SchoolSubjectPublisherParams = {
  grade: string
}

export type SchoolSubjectPublisherResponse = {
  publishers: SchoolSubjectPublisher[]
}

export async function getSchoolSubjectPublisher(
  input: SchoolSubjectPublisherParams,
): Promise<SchoolSubjectPublisherResponse> {
  const request = makeRequest(`api/library/school-subject/publisher`, {
    method: 'get',
    queryString: { grade: input.grade },
  })
  return await execute(request, transform)
}
