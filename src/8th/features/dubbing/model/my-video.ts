import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type StudyMode = {
  studyId: string
  studentHistoryId: string
  bookPoint: number
  endDate: string
}
export type DubbingMyVideo = {
  order: number
  levelRoundId: string
  levelName: string
  topicTitle: string
  studyImagePath: string
  soloStudy?: StudyMode
  fullStudy?: StudyMode
}

function makeStudyMode(json: any): StudyMode {
  return {
    studyId: RenewType.renewString(json?.StudyId),
    studentHistoryId: RenewType.renewString(json?.StudentHistoryId),
    bookPoint: RenewType.renewNumber(json?.BookPoint),
    endDate: RenewType.renewString(json?.EndDate),
  }
}

function makeDubbingMyVideo(json: any): DubbingMyVideo {
  return {
    order: RenewType.renewNumber(json?.Order),
    levelRoundId: RenewType.renewString(json?.LevelRoundId),
    levelName: RenewType.renewString(json?.LevelName),
    topicTitle: RenewType.renewString(json?.TopicTitle),
    studyImagePath: RenewType.renewString(json?.StudyImagePath),
    soloStudy: json?.SoloStudy ? makeStudyMode(json?.SoloStudy) : undefined,
    fullStudy: json?.FullStudy ? makeStudyMode(json?.FullStudy) : undefined,
  }
}

function transform(json: any): DubbingMyVideoResponse {
  return {
    contents:
      json?.Contents?.map((item: any) => makeDubbingMyVideo(item)) || [],
  }
}

export type DubbingMyVideoParams = {
  level: string
}

export type DubbingMyVideoResponse = {
  contents: DubbingMyVideo[]
}

export async function getDubbingMyVideo(
  input: DubbingMyVideoParams,
): Promise<DubbingMyVideoResponse> {
  const request = makeRequest(`api/dubbingroom/my-video`, {
    method: 'get',
    queryString: {
      level: input.level,
    },
  })
  return await execute(request, transform)
}
