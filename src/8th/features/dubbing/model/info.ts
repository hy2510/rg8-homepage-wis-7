import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type DubbingInfo = {
  rgPoint: number
  completeCount: number
  totalCount: number
  studyableYn: boolean
  dubbingRoomLevel: string
  studentId: string
  studentHistory: {
    studentHistoryId: string
    classId: string
    className: string
  }[]
}

function makeDubbingInfo(json: any): DubbingInfo {
  return {
    rgPoint: RenewType.renewNumber(json?.RgPoint),
    completeCount: RenewType.renewNumber(json?.CompleteCount),
    totalCount: RenewType.renewNumber(json?.TotalCount),
    studyableYn: RenewType.renewBoolean(json?.StudyableYn),
    dubbingRoomLevel: RenewType.renewString(json?.DubbingRoomLevel),
    studentId: RenewType.renewString(json?.StudentId),
    studentHistory:
      json?.StudentHistory?.map((item: any) => ({
        studentHistoryId: RenewType.renewString(item?.StudentHistoryId),
        classId: RenewType.renewString(item?.ClassId),
        className: RenewType.renewString(item?.ClassName),
      })) || [],
  }
}

function transform(json: any): DubbingInfoResponse {
  return makeDubbingInfo(json)
}

export type DubbingInfoParams = undefined

export type DubbingInfoResponse = DubbingInfo

export async function getDubbingInfo(): Promise<DubbingInfoResponse> {
  const request = makeRequest(`api/dubbingroom/info`, {
    method: 'get',
  })
  return await execute(request, transform)
}
