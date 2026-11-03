import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type RgRaceRank = {
  rgRaceId: string
  totalRank: number
  stageRank: number
  studentId: string
  customerId: string
  studentName: string
  avatarId: string
  imgAvatarRankingList: string
  customerName: string
  gradeCode: string
  rgPoint: number
  bookCount: number
  raceStageId: string
  groupName: string
  stageNo: number
  stageName: string
  stageChangedDate: string
}

function makeRgRaceRank(json: any): RgRaceRank {
  return {
    rgRaceId: RenewType.renewString(json?.RGRaceId),
    totalRank: RenewType.renewNumber(json?.TotalRank),
    stageRank: RenewType.renewNumber(json?.StageRank),
    studentId: RenewType.renewString(json?.StudentId),
    customerId: RenewType.renewString(json?.CustomerId),
    studentName: RenewType.renewString(json?.StudentName),
    avatarId: RenewType.renewString(json?.AvatarId),
    imgAvatarRankingList: RenewType.renewString(json?.ImgAvatarRankingList),
    customerName: RenewType.renewString(json?.CustomerName),
    gradeCode: RenewType.renewString(json?.GradeCode),
    rgPoint: RenewType.renewNumber(json?.RgPoint),
    bookCount: RenewType.renewNumber(json?.BookCount),
    raceStageId: RenewType.renewString(json?.RaceStageId),
    groupName: RenewType.renewString(json?.GroupName),
    stageNo: RenewType.renewNumber(json?.StageNo),
    stageName: RenewType.renewString(json?.StageName),
    stageChangedDate: RenewType.renewString(json?.StageChangedDate),
  }
}

function transform(json: any): RgRaceRankResponse {
  return {
    user: json?.Me ? makeRgRaceRank(json.Me) : undefined,
    list: json?.Rank?.map((json: any) => {
      return makeRgRaceRank(json)
    }),
  }
}

export type RgRaceRankParams = {
  raceStageId: string
  page?: number
}

export type RgRaceRankResponse = {
  user?: RgRaceRank
  list: RgRaceRank[]
}

export async function getRgRaceRank(
  input: RgRaceRankParams,
): Promise<RgRaceRankResponse> {
  const request = makeRequest(`api/ranking/rg-race-rank`, 'append-customer', {
    method: 'get',
    queryString: {
      raceStageId: input?.raceStageId || undefined,
      page: input?.page || undefined,
    },
  })
  return await execute(request, transform)
}
