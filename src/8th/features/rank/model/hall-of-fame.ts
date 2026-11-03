import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type HallOfFameRank = {
  no: number
  totalRank: number
  gradeRank: number
  hallOfFameId: string
  studentId: string
  studentName: string
  avatarId: string
  imgAvatarRankingList: string
  customerName: string
  gradeCode: string
  gradeName: string
  gradeDate: string
  registNo: number
  rgPoint: number
  bookCount: number
  hallOfFameGrade: string
  registDate: string
  modifyDate: string
}

function makeHallOfFameRank(json?: any): HallOfFameRank {
  return {
    no: RenewType.renewNumber(json?.No),
    totalRank: RenewType.renewNumber(json?.TotalRank),
    gradeRank: RenewType.renewNumber(json?.GradeRank),
    hallOfFameId: RenewType.renewString(json?.HallOfFameId),
    studentId: RenewType.renewString(json?.StudentId),
    studentName: RenewType.renewString(json?.StudentName),
    avatarId: RenewType.renewString(json?.AvatarId),
    imgAvatarRankingList: RenewType.renewString(json?.ImgAvatarRankingList),
    customerName: RenewType.renewString(json?.CustomerName),
    gradeCode: RenewType.renewString(json?.GradeCode),
    gradeName: RenewType.renewString(json?.GradeName),
    gradeDate: RenewType.renewString(json?.GradeDate),
    registNo: RenewType.renewNumber(json?.RegistNo),
    rgPoint: RenewType.renewNumber(json?.RgPoint),
    bookCount: RenewType.renewNumber(json?.BookCount),
    hallOfFameGrade: RenewType.renewString(json?.HallOfFameGrade),
    registDate: RenewType.renewString(json?.RegistDate),
    modifyDate: RenewType.renewString(json?.ModifyDate),
  }
}

function transform(json: any): HallOfFameRankResponse {
  return {
    user: json?.Me ? makeHallOfFameRank(json.Me) : undefined,
    list: json?.HallOfFame?.map((json: any) => {
      return makeHallOfFameRank(json)
    }),
  }
}

export type HallOfFameRankParams = {
  hallOfFameGradeId?: string
  page?: number
}

export type HallOfFameRankResponse = {
  user?: HallOfFameRank
  list: HallOfFameRank[]
}

export async function getHallOfFameRank(
  input?: HallOfFameRankParams,
): Promise<HallOfFameRankResponse> {
  const request = makeRequest(`api/ranking/hall-of-fame`, 'append-customer', {
    method: 'get',
    queryString: {
      hallOfFameGradeId: input?.hallOfFameGradeId,
      page: input?.page,
    },
  })
  return await execute(request, transform)
}
