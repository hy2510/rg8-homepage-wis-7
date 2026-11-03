import { execute, makeRequest } from '@/8th/shared/http'
import { Pagination, transformPagination } from '@/8th/shared/model/pagination'
import RenewType from '@/util/string-utils'

export type DubbingContentSearch = {
  order: number
  levelRoundId: string
  levelName: string
  topicTitle: string
  studyImagePath: string
  rgPointCount: number
  rgPointSum: number
  bookPoint: number
  getableRgPoint: number
}

function makeDubbingContentSearch(json: any): DubbingContentSearch {
  return {
    order: RenewType.renewNumber(json?.Order),
    levelRoundId: RenewType.renewString(json?.LevelRoundId),
    levelName: RenewType.renewString(json?.LevelName),
    topicTitle: RenewType.renewString(json?.TopicTitle),
    studyImagePath: RenewType.renewString(json?.StudyImagePath),
    rgPointCount: RenewType.renewNumber(json?.RgPointCount),
    rgPointSum: RenewType.renewNumber(json?.RgPointSum),
    bookPoint: RenewType.renewNumber(json?.BookPoint),
    getableRgPoint: RenewType.renewNumber(json?.GetableRgPoint),
  }
}

function transform(json: any): DubbingContentSearchResponse {
  return {
    contents:
      json?.Contents?.map((item: any) => makeDubbingContentSearch(item)) || [],
    page: transformPagination(json.Pagination),
  }
}

export type DubbingContentSearchParams = {
  level: string
}

export type DubbingContentSearchResponse = {
  contents: DubbingContentSearch[]
  page: Pagination
}

export async function getDubbingContentSearch(
  input: DubbingContentSearchParams,
): Promise<DubbingContentSearchResponse> {
  const request = makeRequest(`api/dubbingroom/search`, {
    method: 'get',
    queryString: {
      level: input.level,
    },
  })
  return await execute(request, transform)
}
