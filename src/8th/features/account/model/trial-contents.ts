import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type TrialContents = {
  group: string
  contents: {
    title: string
    image: string
    bookCode: string
    studyId: string
    studentHistoryId: string
    levelRoundId: string
    bookLevel: string
  }[]
}

function makeTrialContents(json: any): TrialContents {
  return {
    group: RenewType.renewString(json?.group),
    contents: json?.contents?.map((content: any) => ({
      title: RenewType.renewString(content?.title),
      image: RenewType.renewString(content?.image),
      bookCode: RenewType.renewString(content?.bookCode),
      studyId: RenewType.renewString(content?.studyId),
      studentHistoryId: RenewType.renewString(content?.studentHistoryId),
      levelRoundId: RenewType.renewString(content?.levelRoundId),
      bookLevel: RenewType.renewString(content?.bookLevel),
    })),
  }
}

function transform(json: any): TrialContentsResponse {
  return {
    list: json?.list?.map((content: any) => makeTrialContents(content)),
  }
}

export type TrialContentsParams = {
  level: string
}

export type TrialContentsResponse = {
  list: TrialContents[]
}

export async function getTrialContents(
  input: TrialContentsParams,
): Promise<TrialContentsResponse> {
  const request = makeRequest(`api/trial`, {
    method: 'get',
    queryString: {
      level: input.level,
    },
  })
  return await execute(request, transform)
}
