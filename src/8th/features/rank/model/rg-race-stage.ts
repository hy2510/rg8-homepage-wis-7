import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type RgRaceStage = {
  raceGroupId: string
  raceStageId: string
  groupName: string
  stageNo: number
  stageName: string
  minRgPoint: number
  lowerBoundInclusive: number
  maxRgPoint: number
  studentCount: number
  studentRaceStageId: string
}

function makeRgRaceStage(json: any): RgRaceStage {
  return {
    raceGroupId: RenewType.renewString(json?.RaceGroupId),
    raceStageId: RenewType.renewString(json?.RaceStageId),
    groupName: RenewType.renewString(json?.GroupName),
    stageNo: RenewType.renewNumber(json?.StageNo),
    stageName: RenewType.renewString(json?.StageName),
    minRgPoint: RenewType.renewNumber(json?.MinRgPoint),
    lowerBoundInclusive: RenewType.renewNumber(json?.LowerBoundInclusive),
    maxRgPoint: RenewType.renewNumber(json?.MaxRgPoint),
    studentCount: RenewType.renewNumber(json?.StudentCount),
    studentRaceStageId: RenewType.renewString(json?.StudentRaceStageId),
  }
}

function transform(json: any): RgRaceStageResponse {
  return {
    list: json?.List?.map((item: any) => makeRgRaceStage(item)) || [],
  }
}

export type RgRaceStageParams = {}

export type RgRaceStageResponse = {
  list: RgRaceStage[]
}

export async function getRgRaceStage(
  input?: RgRaceStageParams,
): Promise<RgRaceStageResponse> {
  const request = makeRequest(`api/ranking/rg-race-stage`, 'append-customer', {
    method: 'get',
    queryString: {},
  })
  return await execute(request, transform)
}
