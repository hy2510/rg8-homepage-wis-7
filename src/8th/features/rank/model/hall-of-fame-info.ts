import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type HallOfFameInfo = {
  hallOfFameGradeId: string
  gradeNo: number
  gradeName: string
  gradeNameEng: string
  minRgPoint: number
  maxRgPoint: number
  studentCount: number
  totalStudentCount: number
  studentPercent: number
  studentHallOfFameGradeId: string
}

function makeHallOfFameInfo(json: any): HallOfFameInfo {
  return {
    hallOfFameGradeId: RenewType.renewString(json?.HallOfFameGradeId),
    gradeNo: RenewType.renewNumber(json?.GradeNo),
    gradeName: RenewType.renewString(json?.GradeName),
    gradeNameEng: RenewType.renewString(json?.GradeNameEng),
    minRgPoint: RenewType.renewNumber(json?.MinRgPoint),
    maxRgPoint: RenewType.renewNumber(json?.MaxRgPoint),
    studentCount: RenewType.renewNumber(json?.StudentCount),
    totalStudentCount: RenewType.renewNumber(json?.TotalStudentCount),
    studentPercent: RenewType.renewNumber(json?.StudentPercent),
    studentHallOfFameGradeId: RenewType.renewString(
      json?.StudentHallOfFameGradeId,
    ),
  }
}

function transform(json: any): HallOfFameInfoResponse {
  return {
    list: json?.Info?.map((json: any) => makeHallOfFameInfo(json)),
  }
}

export type HallOfFameInfoParams = {}

export type HallOfFameInfoResponse = {
  list: HallOfFameInfo[]
}

export async function getHallOfFameInfo(
  input?: HallOfFameInfoParams,
): Promise<HallOfFameInfoResponse> {
  const request = makeRequest(
    `api/ranking/hall-of-fame-info`,
    'append-customer',
    {
      method: 'get',
      queryString: {},
    },
  )
  return await execute(request, transform)
}
