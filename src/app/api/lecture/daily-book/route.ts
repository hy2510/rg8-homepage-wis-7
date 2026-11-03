import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import NumberUtils from '@/util/number-utils'
import { NextRequest } from 'next/server'
import Lecture from '@/repository/server/lecture'
import { RouteResponse, executeRequestAction, getParameters } from '../../_util'

// @NB_ :늘봄 개발
export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(
    request,
    'date',
    'studentHistoryId',
    'page',
  )

  const date = parameter.getString('date', '')
  const studentHistoryId = parameter.getString('studentHistoryId', '')
  const page = parameter.getNumber('page', 1)

  const [payload, status, error] = await executeRequestAction(
    Lecture.book(token, {
      studentHistoryId,
      studyDate: date,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  const lectures = payload.Lectures.map(($data: any) => {
    const Activities: {
      LevelRoundId: string
      TopicTitle: string
      LevelName: string
      BookId: string
      StudyTypeCode: string
      SurfaceImagePath: string
      StudyImagePath: string
      Status: string
      ActivityType: string
      BookPoint: number
      PassCount: number
      EarnedPoint: number
      GetableRgPoint: number
    }[] = []
    if ($data.Activity1_LevelRoundId && $data.Activity1_LevelRoundId !== '0') {
      Activities.push({
        LevelRoundId: $data.Activity1_LevelRoundId,
        TopicTitle: $data.Activity1_Title,
        LevelName: $data.Activity1_BookCode,
        BookId: $data.Activity1_BookId,
        StudyTypeCode: $data.Activity1_StudyTypeCode,
        SurfaceImagePath: $data.Activity1_ImagePath,
        StudyImagePath: $data.Activity1_Thumbnail,
        Status: $data.Activity1_Status,
        ActivityType: $data.Activity1_Tag,
        BookPoint: $data.Activity1_BookPoint,
        PassCount: $data.Activity1_PassCount,
        EarnedPoint: $data.Activity1_EarnedPoint,
        GetableRgPoint: getableRgPoint(
          Number($data.Activity1_BookPoint),
          Number($data.Activity1_EarnedPoint),
          Number($data.Activity1_PassCount),
        ),
      })
    }
    if ($data.Activity2_LevelRoundId && $data.Activity2_LevelRoundId !== '0') {
      Activities.push({
        LevelRoundId: $data.Activity2_LevelRoundId,
        TopicTitle: $data.Activity2_Title,
        LevelName: $data.Activity2_BookCode,
        BookId: $data.Activity2_BookId,
        StudyTypeCode: $data.Activity2_StudyTypeCode,
        SurfaceImagePath: $data.Activity2_ImagePath,
        StudyImagePath: $data.Activity2_Thumbnail,
        Status: $data.Activity2_Status,
        ActivityType: $data.Activity2_Tag,
        BookPoint: $data.Activity2_BookPoint,
        PassCount: $data.Activity2_PassCount,
        EarnedPoint: $data.Activity2_EarnedPoint,
        GetableRgPoint: getableRgPoint(
          Number($data.Activity2_BookPoint),
          Number($data.Activity2_EarnedPoint),
          Number($data.Activity2_PassCount),
        ),
      })
    }
    if ($data.Activity3_LevelRoundId && $data.Activity3_LevelRoundId !== '0') {
      Activities.push({
        LevelRoundId: $data.Activity3_LevelRoundId,
        TopicTitle: $data.Activity3_Title,
        LevelName: $data.Activity3_BookCode,
        BookId: $data.Activity3_BookId,
        StudyTypeCode: $data.Activity3_StudyTypeCode,
        SurfaceImagePath: $data.Activity3_ImagePath,
        StudyImagePath: $data.Activity3_Thumbnail,
        Status: $data.Activity3_Status,
        ActivityType: $data.Activity3_Tag,
        BookPoint: $data.Activity3_BookPoint,
        PassCount: $data.Activity3_PassCount,
        EarnedPoint: $data.Activity3_EarnedPoint,
        GetableRgPoint: getableRgPoint(
          Number($data.Activity3_BookPoint),
          Number($data.Activity3_EarnedPoint),
          Number($data.Activity3_PassCount),
        ),
      })
    }
    if ($data.Activity4_LevelRoundId && $data.Activity4_LevelRoundId !== '0') {
      Activities.push({
        LevelRoundId: $data.Activity4_LevelRoundId,
        TopicTitle: $data.Activity4_Title,
        LevelName: $data.Activity4_BookCode,
        BookId: $data.Activity4_BookId,
        StudyTypeCode: $data.Activity4_StudyTypeCode,
        SurfaceImagePath: $data.Activity4_ImagePath,
        StudyImagePath: $data.Activity4_Thumbnail,
        Status: $data.Activity4_Status,
        ActivityType: $data.Activity4_Tag,
        BookPoint: $data.Activity4_BookPoint,
        PassCount: $data.Activity4_PassCount,
        EarnedPoint: $data.Activity4_EarnedPoint,
        GetableRgPoint: getableRgPoint(
          Number($data.Activity4_BookPoint),
          Number($data.Activity4_EarnedPoint),
          Number($data.Activity4_PassCount),
        ),
      })
    }
    return {
      LectureNumber: $data.LectureNumber,
      LectureSection: $data.LectureSection,
      LectureTitle: $data.LectureTitle,
      LectureActiveDate: $data.LectureDate,
      Activities,
    }
  })
  const newPayload = {
    Lectures: lectures,
  }
  return RouteResponse.response(newPayload, status)
}

function getableRgPoint(
  bookPoint: number,
  earnPoint: number,
  passCount: number,
): number {
  let getableRgPoint = bookPoint
  if (passCount === 1) {
    const findMode = findFullEasyMode(bookPoint, earnPoint)
    if (findMode === 'full') {
      getableRgPoint = NumberUtils.toRgDecimalPoint(bookPoint * 0.5)
    } else if (findMode === 'invalid') {
      getableRgPoint = 0
    }
  } else if (passCount >= 2) {
    getableRgPoint = 0
  }
  return getableRgPoint
}

// 얻은 포인트를 기준으로 Full 인지 Easy인지 근사값을 추론하는 함수
// 변동 허용범위는 +-33.3%이므로 30% 바운더리로 설정함.
function findFullEasyMode(
  rgPoint: number,
  earnRgPoint: number,
): 'full' | 'easy' | 'invalid' {
  const BOUNDARY = 0.3
  const xEasy = earnRgPoint * 2
  const xFull = earnRgPoint

  const easyRange = [xEasy * (1 - BOUNDARY), xEasy * (1 + BOUNDARY)]
  const fullRange = [xFull * (1 - BOUNDARY), xFull * (1 + BOUNDARY)]

  const isEasyPossible = easyRange[0] <= rgPoint && rgPoint <= easyRange[1]
  const isFullPossible = fullRange[0] <= rgPoint && rgPoint <= fullRange[1]

  if (isEasyPossible && !isFullPossible) {
    return 'easy'
  } else if (!isEasyPossible && isFullPossible) {
    return 'full'
  }
  return 'invalid'
}
