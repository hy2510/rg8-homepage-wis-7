import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

// @NB_ :늘봄 개발
// MEMO: (레거시) 이번 주 학습 진행 상태 조회

export type LectureWeekStatus = {
  weekDays: string
  unit: number
  unitCount: number
  unitPassCount: number
  allPassYn: boolean
}

function makeLectureWeekStatus(json: any): LectureWeekStatus {
  return {
    weekDays: RenewType.renewString(json?.WeekDays),
    unit: RenewType.renewNumber(json?.Unit),
    unitCount: RenewType.renewNumber(json?.UnitCount),
    unitPassCount: RenewType.renewNumber(json?.UnitPassCount),
    allPassYn: RenewType.renewBoolean(json?.AllPassYn),
  }
}

function transform(json: any): LectureWeekStatusResponse {
  return {
    week: json?.Week?.map((item: any) => makeLectureWeekStatus(item)),
  }
}

export type LectureWeekStatusParams = {
  classId: string
  studentHistoryId: string
  startDate: string
  endDate: string
}

export type LectureWeekStatusResponse = {
  week: LectureWeekStatus[]
}

export async function getLectureWeekStatus(
  input: LectureWeekStatusParams,
): Promise<LectureWeekStatusResponse> {
  const request = makeRequest(`api/lecture/week-status`, {
    method: 'get',
    queryString: {
      classId: input.classId,
      studentHistoryId: input.studentHistoryId,
      startDate: input.startDate,
      endDate: input.endDate,
    },
  })
  return await execute(request, transform)
}
