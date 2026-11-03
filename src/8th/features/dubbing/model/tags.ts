import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type DubbingTags = {
  level: string
  tags: string[]
}

function makeDubbingTags(json: any): DubbingTags {
  return {
    level: RenewType.renewString(json?.Level),
    tags: json?.Tags?.map((item: any) => RenewType.renewString(item)) || [],
  }
}

function transform(json: any): DubbingTagsResponse {
  return {
    levels: json?.Levels?.map((item: any) => makeDubbingTags(item)) || [],
  }
}

export type DubbingTagsParams = undefined

export type DubbingTagsResponse = {
  levels: DubbingTags[]
}

export async function getDubbingTags(): Promise<DubbingTagsResponse> {
  const request = makeRequest(`api/dubbingroom/tags`, {
    method: 'get',
  })
  return await execute(request, transform)
}
