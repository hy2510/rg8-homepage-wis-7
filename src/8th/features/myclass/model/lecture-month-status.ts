import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

// @NB_ :늘봄 개발
// MEMO: (레거시) 이번 주 학습 진행 상태 조회

export type LectureMonthStatus = {
  weekDays: string
  unit: number
  unitCount: number
  unitPassCount: number
  allPassYn: boolean
}

function makeLectureMonthStatus(json: any): LectureMonthStatus {
  return {
    weekDays: RenewType.renewString(json?.WeekDays),
    unit: RenewType.renewNumber(json?.Unit),
    unitCount: RenewType.renewNumber(json?.UnitCount),
    unitPassCount: RenewType.renewNumber(json?.UnitPassCount),
    allPassYn: RenewType.renewBoolean(json?.AllPassYn),
  }
}

function transform(json: any): LectureMonthStatusResponse {
  return {
    day: json?.Day?.map((item: any) => makeLectureMonthStatus(item)),
  }
}

export type LectureMonthStatusParams = {
  classId: string
  studentHistoryId: string
  startDate: string
  endDate: string
}

export type LectureMonthStatusResponse = {
  day: LectureMonthStatus[]
}

export async function getLectureMonthStatus(
  input: LectureMonthStatusParams,
): Promise<LectureMonthStatusResponse> {
  const request = makeRequest(`api/lecture/month-status`, {
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
