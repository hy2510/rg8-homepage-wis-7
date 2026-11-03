import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

// @NB_ :늘봄 개발
// MEMO: (레거시) Classes 도서 조회.

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
export type CourseBook = {
  lectureNumber: number
  lectureSection: string
  lectureTitle: string
  lectureActiveDate: string
  lectureStatus: string
  activities: Activity[]
}

function makeCourseBook(json: any): CourseBook {
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

function transform(json: any): CourseBookResponse {
  return {
    lectures: json?.Lectures?.map((item: any) => makeCourseBook(item)),
  }
}

export type CourseBookParams = {
  lectureSection: string
  classId: string
  studentHistoryId: string
  status: string
  page: number
}

export type CourseBookResponse = {
  lectures: CourseBook[]
}

export async function getCourseBook(
  input: CourseBookParams,
): Promise<CourseBookResponse> {
  const request = makeRequest(`api/lecture/course-book`, {
    method: 'get',
    queryString: {
      lectureSection: input.lectureSection,
      classId: input.classId,
      studentHistoryId: input.studentHistoryId,
      status: input.status,
      page: input.page,
    },
  })
  return await execute(request, transform)
}
