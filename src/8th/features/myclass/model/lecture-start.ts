import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type LectureStart = {
  studyId: string
  studentHistoryId: string
  levelRoundId: string
  bookLevel: string
  bookCode: string
  animationPath: string
}

function makeLectureStart(json: any): LectureStart {
  return {
    studyId: RenewType.renewString(json?.StudyId),
    studentHistoryId: RenewType.renewString(json?.StudentHistoryId),
    levelRoundId: RenewType.renewString(json?.LevelRoundId),
    bookLevel: RenewType.renewString(json?.BookLevel),
    bookCode: RenewType.renewString(json?.BookCode),
    animationPath: RenewType.renewString(json?.AnimationPath),
  }
}

function transform(json: any): LectureStartResponse {
  return makeLectureStart(json)
}

export type LectureStartParams = {
  studentHistoryId: string
  levelRoundId: string
}

export type LectureStartResponse = LectureStart

export async function getLectureStart(
  input: LectureStartParams,
): Promise<LectureStartResponse> {
  const request = makeRequest(`api/lecture/activity-start`, {
    method: 'post',
    body: {
      studentHistoryId: input.studentHistoryId,
      levelRoundId: input.levelRoundId,
    },
  })
  return await execute(request, transform)
}
