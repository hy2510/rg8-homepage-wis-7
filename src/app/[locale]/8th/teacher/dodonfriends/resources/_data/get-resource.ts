import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type ResourceLink = {
  id: string
  title: string
  url: string
  startNewRow?: boolean
}
export type ResourceGroup = {
  id: string
  title: string
  subtitle?: string
  items: ResourceLink[]
}
export type ResourcesCatalog = {
  materialGroups: ResourceGroup[]
  answerKeyGroups: ResourceGroup[]
}

function makeResources(json: any): ResourceLink {
  return {
    id: RenewType.renewString(json.id),
    title: RenewType.renewString(json.title),
    url: RenewType.renewString(json.url),
    startNewRow: RenewType.renewBoolean(json.startNewRow),
  }
}

function transform(json: any): ResourcesResponse {
  //FIXME: 하드코딩 데이터, Route 연동 필요

  // return {
  //   materialGroups: json.materialGroups.map(makeResources),
  //   answerKeyGroups: json.answerKeyGroups.map(makeResources),
  // }
  return json as ResourcesCatalog
}

export type ResourcesParams = {}

export type ResourcesResponse = ResourcesCatalog

export async function getResources(
  input?: ResourcesParams,
): Promise<ResourcesResponse> {
  const request = makeRequest(`api/teacher-guide/resources`, {
    method: 'get',
    queryString: {},
  })
  return await execute(request, transform)
}
