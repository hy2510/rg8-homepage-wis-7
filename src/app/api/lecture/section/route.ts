import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
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

  const parameter = await getParameters(request, 'studentHistoryId')

  const studentHistoryId = parameter.getString('studentHistoryId', '')

  const [payload, status, error] = await executeRequestAction(
    Lecture.section(token, { studentHistoryId }),
  )
  if (error) {
    return RouteResponse.commonError()
  }

  const savedLng = request.cookies.get('lang')?.value

  const LectureSection =
    payload?.LectureSection?.map((seciton: any) => {
      const { DescriptionKor, DescriptionEng } = seciton
      delete seciton.DescriptionKor
      delete seciton.DescriptionEng

      const Description = savedLng === 'ko' ? DescriptionKor : DescriptionEng
      return {
        ...seciton,
        Description,
      }
    }) || []
  const newPayload = {
    LectureSection,
  }

  return RouteResponse.response(newPayload, status)
}
