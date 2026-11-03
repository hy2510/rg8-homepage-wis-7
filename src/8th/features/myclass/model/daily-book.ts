import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

// @NB_ :늘봄 개발
// MEMO: (레거시) Today's Lesson 도서 조회.

type Activity = {
  levelRoundId: string
  topicTitle: string
  levelName: string
  bookId: string
  studyTypeCode: string
  surfaceImagePath: string
  studyImagePath: string
  status: string
  activityType: string
  bookPoint: number
  earnedPoint: number
  passCount: number
  getableRgPoint: number
}
export type DailyBook = {
  lectureNumber: number
  lectureSection: string
  lectureTitle: string
  lectureActiveDate: string
  lectureStatus: string
  activities: Activity[]
}

function makeDailyBook(json: any): DailyBook {
  const activities: Activity[] = []
  json?.Activities?.forEach((json: any) => {
    let status: string = 'Not Yet'
    const tmpStatus = RenewType.renewString(json?.Status)
    if (
      tmpStatus === 'InProgress' ||
      tmpStatus === 'Not Yet' ||
      tmpStatus === 'Pass'
    ) {
      status = tmpStatus
    }
    activities.push({
      levelRoundId: RenewType.renewString(json?.LevelRoundId),
      topicTitle: RenewType.renewString(json?.TopicTitle),
      levelName: RenewType.renewString(json?.LevelName),
      bookId: RenewType.renewString(json?.BookId),
      studyTypeCode: RenewType.renewString(json?.StudyTypeCode),
      surfaceImagePath: RenewType.renewString(json?.SurfaceImagePath),
      studyImagePath: RenewType.renewString(json?.StudyImagePath),
      status: status,
      activityType: RenewType.renewString(json?.ActivityType),
      bookPoint: RenewType.renewNumber(json?.BookPoint),
      earnedPoint: RenewType.renewNumber(json?.EarnedPoint),
      passCount: RenewType.renewNumber(json?.PassCount),
      getableRgPoint: RenewType.renewNumber(json?.GetableRgPoint),
    })
  })
  const lectureStatus =
    activities.length ===
    activities.filter((activity) => activity.status === 'Pass').length
      ? 'Complete'
      : 'Incomplete'
  return {
    lectureNumber: RenewType.renewNumber(json?.LectureNumber),
    lectureSection: RenewType.renewString(json?.LectureSection),
    lectureTitle: RenewType.renewString(json?.LectureTitle),
    lectureActiveDate: RenewType.renewString(json?.LectureActiveDate),
    lectureStatus: lectureStatus,
    activities: activities,
  }
}

function transform(json: any): DailyBookResponse {
  return {
    lectures: json?.Lectures?.map((item: any) => makeDailyBook(item)),
  }
}

export type DailyBookParams = {
  date: string
  classId: string
  studentHistoryId: string
  page: number
}

export type DailyBookResponse = {
  lectures: DailyBook[]
}

export async function getDailyBook(
  input: DailyBookParams,
): Promise<DailyBookResponse> {
  const request = makeRequest(`api/lecture/daily-book`, {
    method: 'get',
    queryString: {
      date: input.date,
      classId: input.classId,
      studentHistoryId: input.studentHistoryId,
      page: input.page,
    },
  })
  return await execute(request, transform)
}
