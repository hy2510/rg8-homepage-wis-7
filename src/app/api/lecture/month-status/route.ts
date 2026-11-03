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

  const parameter = await getParameters(
    request,
    'studentHistoryId',
    'startDate',
    'endDate',
  )

  const studentHistoryId = parameter.getString('studentHistoryId', '')
  const startDate = parameter.getString('startDate', '')
  const endDate = parameter.getString('endDate', '')

  const [payload, status, error] = await executeRequestAction(
    Lecture.monthStatus(token, { studentHistoryId, studyDate: startDate }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  const month = payload.Month.map(($data: any) => {
    return {
      WeekDays: $data.WeekDays,
      Unit: $data.Unit,
      UnitCount: $data.UnitCount,
      UnitPassCount: $data.UnitPassCount,
      AllPassYn: $data.AllPassYn,
    }
  })
  const newPayload = {
    Day: month,
  }
  return RouteResponse.response(newPayload, status)
}
