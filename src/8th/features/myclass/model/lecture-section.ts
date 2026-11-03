import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

// @NB_ :늘봄 개발
// MEMO: (레거시) Classes 섹션 조회.

export type LectureSection = {
  lectureSection: string
  lectureSectionLink: string
  lectureSectionCount: number
  characterImagePath: string
  characterImagePath2: string
  characterImagePath3: string
  characterImagePath4: string
  surfaceImagePath1: string
  surfaceImagePath2: string
  description: string
  completedStudyCount: number
  totalStudyCount: number
  sortOrder: number
}

function makeLectureSection(json: any): LectureSection {
  return {
    lectureSection: RenewType.renewString(json?.LectureSection),
    lectureSectionLink: RenewType.renewString(json?.LectureSectionLink),
    lectureSectionCount: RenewType.renewNumber(json?.LectureSectionCount),
    characterImagePath: RenewType.renewString(json?.CharacterImagePath),
    characterImagePath2: RenewType.renewString(json?.CharacterImagePath2),
    characterImagePath3: RenewType.renewString(json?.CharacterImagePath3),
    characterImagePath4: RenewType.renewString(json?.CharacterImagePath4),
    surfaceImagePath1: RenewType.renewString(json?.SurfaceImagePath),
    surfaceImagePath2: RenewType.renewString(json?.SurfaceImagePath2),
    description: RenewType.renewString(json?.Description),
    completedStudyCount: RenewType.renewNumber(json?.CompletedStudyCount),
    totalStudyCount: RenewType.renewNumber(json?.TotalStudyCount),
    sortOrder: RenewType.renewNumber(json?.SortOrder),
  }
}

function transform(json: any): LectureSectionResponse {
  return {
    sections: json?.LectureSection?.map((item: any) =>
      makeLectureSection(item),
    ),
  }
}

export type LectureSectionParams = { classId: string; studentHistoryId: string }

export type LectureSectionResponse = {
  sections: LectureSection[]
}

export async function getLectureSection(
  input: LectureSectionParams,
): Promise<LectureSectionResponse> {
  const request = makeRequest(`api/lecture/section`, {
    method: 'get',
    queryString: {
      classId: input.classId,
      studentHistoryId: input.studentHistoryId,
    },
  })
  return await execute(request, transform)
}
