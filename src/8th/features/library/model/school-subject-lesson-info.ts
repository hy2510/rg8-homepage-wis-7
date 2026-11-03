import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type SchoolSubjectLessonInfo = {
  relatedBooksId: string
  grade: string
  publisher: string
  title: string
  subject: string
  infoCount: number
  infos: string[]
}

function makeSchoolSubjectLessonInfo(json: any): SchoolSubjectLessonInfo {
  const infoCount = RenewType.renewNumber(json?.LessonInfo?.InfoCount)
  const infos: string[] = []
  if (infoCount && infoCount > 0) {
    for (let i = 1; i <= infoCount; i++) {
      infos.push(RenewType.renewString(json?.LessonInfo?.['Info' + i]))
    }
  }
  return {
    relatedBooksId: RenewType.renewString(json?.LessonInfo?.RelatedBooksId),
    grade: RenewType.renewString(json?.LessonInfo?.Grade),
    publisher: RenewType.renewString(json?.LessonInfo?.Publisher),
    title: RenewType.renewString(json?.LessonInfo?.Title),
    subject: RenewType.renewString(json?.LessonInfo?.Subject),
    infoCount: infoCount,
    infos: infos,
  }
}

function transform(json: any): SchoolSubjectLessonInfoResponse {
  return {
    lessonInfo: makeSchoolSubjectLessonInfo(json),
  }
}

export type SchoolSubjectLessonInfoParams = {
  grade: string
  publisher: string
  lesson: string
}

export type SchoolSubjectLessonInfoResponse = {
  lessonInfo: SchoolSubjectLessonInfo
}

export async function getSchoolSubjectLessonInfo(
  input: SchoolSubjectLessonInfoParams,
): Promise<SchoolSubjectLessonInfoResponse> {
  const request = makeRequest(`api/library/school-subject/lesson-info`, {
    method: 'get',
    queryString: {
      grade: input.grade,
      publisher: input.publisher,
      lesson: input.lesson,
    },
  })
  return await execute(request, transform)
}
